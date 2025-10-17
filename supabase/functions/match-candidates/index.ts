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
    const authHeader = req.headers.get('Authorization');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { jobId, limit = 20 } = await req.json();
    
    if (!jobId) {
      throw new Error('jobId is required');
    }

    console.log(`Matching candidates for job ${jobId}, limit: ${limit}`);

    // Récupérer l'embedding de l'offre d'emploi
    const { data: jobVector, error: jobVectorError } = await supabase
      .from('vectors')
      .select('embedding')
      .eq('owner_type', 'job')
      .eq('owner_id', jobId)
      .single();

    if (jobVectorError || !jobVector) {
      throw new Error('Job embedding not found. Generate it first.');
    }

    console.log('Job embedding retrieved');

    // Récupérer toutes les candidatures pour cette offre
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select(`
        id,
        candidate_id,
        status,
        score_overall,
        created_at
      `)
      .eq('job_id', jobId);

    if (appsError) {
      throw appsError;
    }

    if (!applications || applications.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          matches: []
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Found ${applications.length} applications`);

    // Calculer la similarité cosine pour chaque candidature
    const matches = [];
    
    for (const app of applications) {
      // Récupérer l'embedding de la candidature
      const { data: appVector, error: appVectorError } = await supabase
        .from('vectors')
        .select('embedding')
        .eq('owner_type', 'application')
        .eq('owner_id', app.id)
        .maybeSingle();

      if (appVectorError || !appVector) {
        console.warn(`No embedding for application ${app.id}, skipping`);
        continue;
      }

      // Calculer similarité cosine en SQL
      const { data: similarity, error: simError } = await supabase
        .rpc('calculate_cosine_similarity', {
          vec1: jobVector.embedding,
          vec2: appVector.embedding
        });

      if (simError) {
        console.error(`Error calculating similarity for app ${app.id}:`, simError);
        continue;
      }

      matches.push({
        application_id: app.id,
        candidate_id: app.candidate_id,
        similarity_score: similarity,
        current_status: app.status,
        current_overall_score: app.score_overall
      });
    }

    // Trier par score de similarité décroissant
    matches.sort((a, b) => b.similarity_score - a.similarity_score);

    // Limiter les résultats
    const topMatches = matches.slice(0, limit);

    console.log(`Returning ${topMatches.length} top matches`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        totalApplications: applications.length,
        matchesFound: matches.length,
        matches: topMatches
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error matching candidates:', error);
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