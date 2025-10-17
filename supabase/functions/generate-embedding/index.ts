import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { text, ownerType, ownerId } = await req.json();
    
    if (!text || !ownerType || !ownerId) {
      throw new Error('text, ownerType, and ownerId are required');
    }

    console.log(`Generating embedding for ${ownerType}:${ownerId}, text length:`, text.length);

    // Utiliser Lovable AI pour générer l'embedding
    // Note: Actuellement Lovable AI ne supporte pas directement les embeddings
    // On va utiliser le texte pour créer un pseudo-embedding basé sur les tokens
    // En production, vous devriez utiliser l'API OpenAI embeddings directement
    
    // Pour cette démo, on va créer un embedding simple basé sur le hash du texte
    // IMPORTANT: En production, remplacez ceci par un vrai service d'embeddings
    const embedding = await generateMockEmbedding(text);

    console.log('Embedding generated, dimensions:', embedding.length);

    // Stocker dans la table vectors
    const { data: vectorData, error: vectorError } = await supabase
      .from('vectors')
      .upsert({
        owner_type: ownerType,
        owner_id: ownerId,
        embedding: `[${embedding.join(',')}]` // Format PostgreSQL array
      }, {
        onConflict: 'owner_type,owner_id'
      })
      .select()
      .single();

    if (vectorError) {
      console.error('Error storing embedding:', vectorError);
      throw vectorError;
    }

    console.log('Embedding stored successfully');

    return new Response(
      JSON.stringify({
        success: true,
        vectorId: vectorData.id,
        dimensions: embedding.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error generating embedding:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Fonction helper pour générer un mock embedding
// IMPORTANT: Remplacer par un vrai service d'embeddings en production
function generateMockEmbedding(text: string): number[] {
  const embedding = new Array(1536).fill(0);
  
  // Utiliser un hash simple pour créer des valeurs pseudo-aléatoires mais déterministes
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Générer les dimensions de l'embedding
  for (let i = 0; i < 1536; i++) {
    const seed = hash + i * 7919; // Nombre premier pour distribution
    embedding[i] = (Math.sin(seed) + Math.cos(seed * 1.5)) / 2;
  }
  
  // Normaliser le vecteur
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}