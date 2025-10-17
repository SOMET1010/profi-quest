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
    const { applicationId } = await req.json();
    
    if (!applicationId) {
      throw new Error('applicationId is required');
    }

    console.log(`Screening application ${applicationId}`);

    // Récupérer les données de la candidature et de l'offre
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        id,
        job_id,
        candidate_id,
        cover_letter_text,
        cv_file_path,
        jobs (
          id,
          title,
          mission,
          requirements_text,
          contract_type,
          seniority_min,
          seniority_max,
          tags
        ),
        profiles (
          id,
          experience_years,
          technical_skills,
          behavioral_skills,
          location
        )
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error('Application not found');
    }

    console.log('Application data retrieved');

    const job = application.jobs;
    const profile = application.profiles;

    // Construire le prompt pour l'IA
    const systemPrompt = `Tu es un expert RH qui évalue les candidatures. 
Analyse la candidature par rapport à l'offre et attribue un score sur 100 selon ces critères:
1. Adéquation compétences techniques (40%)
2. Années d'expérience (20%)
3. Compétences comportementales (20%)
4. Motivation (lettre de motivation) (20%)

Fournis également des recommandations d'action: shortlist, interview, ou reject.`;

    const userPrompt = `OFFRE D'EMPLOI:
Titre: ${job.title}
Mission: ${job.mission}
Prérequis: ${job.requirements_text}
Expérience souhaitée: ${job.seniority_min}-${job.seniority_max} ans
Tags: ${job.tags?.join(', ') || 'N/A'}

CANDIDATURE:
Années d'expérience: ${profile.experience_years || 'Non spécifié'}
Compétences techniques: ${profile.technical_skills || 'Non spécifié'}
Compétences comportementales: ${profile.behavioral_skills || 'Non spécifié'}
Localisation: ${profile.location || 'Non spécifié'}
Lettre de motivation: ${application.cover_letter_text?.substring(0, 500) || 'Aucune'}

Évalue cette candidature.`;

    // Appeler Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "evaluate_application",
              description: "Évaluer une candidature",
              parameters: {
                type: "object",
                properties: {
                  score_overall: {
                    type: "number",
                    description: "Score global sur 100"
                  },
                  score_technical: {
                    type: "number",
                    description: "Score compétences techniques sur 100"
                  },
                  score_experience: {
                    type: "number",
                    description: "Score expérience sur 100"
                  },
                  score_behavioral: {
                    type: "number",
                    description: "Score compétences comportementales sur 100"
                  },
                  score_motivation: {
                    type: "number",
                    description: "Score motivation sur 100"
                  },
                  recommendation: {
                    type: "string",
                    enum: ["shortlist", "interview", "reject"],
                    description: "Recommandation d'action"
                  },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "Points forts de la candidature"
                  },
                  weaknesses: {
                    type: "array",
                    items: { type: "string" },
                    description: "Points faibles de la candidature"
                  },
                  comments: {
                    type: "string",
                    description: "Commentaires détaillés"
                  }
                },
                required: [
                  "score_overall",
                  "score_technical",
                  "score_experience",
                  "score_behavioral",
                  "score_motivation",
                  "recommendation",
                  "strengths",
                  "weaknesses",
                  "comments"
                ],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "evaluate_application" } }
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
    console.log('AI evaluation received');

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const evaluation = JSON.parse(toolCall.function.arguments);
    console.log('Evaluation:', evaluation);

    // Mettre à jour la candidature avec le score
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        score_overall: evaluation.score_overall,
        screening_json: evaluation,
        status: evaluation.recommendation === 'reject' ? 'rejected' : 'screening'
      })
      .eq('id', applicationId);

    if (updateError) {
      throw updateError;
    }

    // Créer un événement dans la timeline
    const { error: eventError } = await supabase
      .from('events')
      .insert({
        application_id: applicationId,
        type: 'comment',
        payload_json: {
          action: 'ai_screening',
          score: evaluation.score_overall,
          recommendation: evaluation.recommendation
        }
      });

    if (eventError) {
      console.warn('Failed to create event:', eventError);
    }

    console.log('Application updated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        applicationId,
        evaluation
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error screening application:', error);
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