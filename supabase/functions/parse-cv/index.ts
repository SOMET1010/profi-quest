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
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { cvText, jobId } = await req.json();
    
    if (!cvText) {
      throw new Error('cvText is required');
    }

    console.log('Parsing CV text, length:', cvText.length);

    // Utiliser Lovable AI pour analyser le CV
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert RH qui analyse des CV. Extrais les informations structurées suivantes :
- Compétences techniques (technical_skills)
- Compétences comportementales (behavioral_skills)
- Années d'expérience (experience_years)
- Localisation (location)
- Liens professionnels (linkedin, github)
- Résumé court (summary)

Retourne un JSON valide avec ces clés exactes. Pour technical_skills et behavioral_skills, retourne des arrays de strings. Pour experience_years, calcule le total d'années.`
          },
          {
            role: 'user',
            content: `Analyse ce CV et extrais les informations:\n\n${cvText.substring(0, 8000)}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_cv_data",
              description: "Extraire les données structurées d'un CV",
              parameters: {
                type: "object",
                properties: {
                  technical_skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Liste des compétences techniques"
                  },
                  behavioral_skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Liste des compétences comportementales"
                  },
                  experience_years: {
                    type: "number",
                    description: "Nombre total d'années d'expérience"
                  },
                  location: {
                    type: "string",
                    description: "Localisation du candidat"
                  },
                  linkedin: {
                    type: "string",
                    description: "URL du profil LinkedIn"
                  },
                  github: {
                    type: "string",
                    description: "URL du profil GitHub"
                  },
                  summary: {
                    type: "string",
                    description: "Résumé court du profil (2-3 phrases)"
                  }
                },
                required: ["technical_skills", "behavioral_skills", "experience_years", "summary"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_cv_data" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received:', JSON.stringify(aiData));

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log('Extracted CV data:', extractedData);

    return new Response(
      JSON.stringify({
        success: true,
        data: extractedData,
        rawText: cvText.substring(0, 500) // Preview
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error parsing CV:', error);
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