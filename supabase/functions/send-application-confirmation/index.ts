import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApplicationConfirmationRequest {
  firstName: string;
  lastName: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email }: ApplicationConfirmationRequest = await req.json();

    console.log('Sending application confirmation email to:', email);

    // Note: This is a placeholder implementation
    // In production, you would integrate with Resend or another email service
    // For now, we'll just log the confirmation
    
    const confirmationMessage = {
      to: email,
      subject: "Candidature reçue - ANSUT Programme d'Experts",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">ANSUT - Programme d'Experts RH</h1>
          
          <p>Bonjour ${firstName} ${lastName},</p>
          
          <p>Nous avons bien reçu votre candidature pour rejoindre notre réseau d'experts.</p>
          
          <p>Notre équipe RH va examiner votre profil et vous contactera prochainement par email pour la suite du processus de sélection.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Prochaines étapes :</h3>
            <ol>
              <li>Examen de votre candidature par notre équipe RH (2-3 jours ouvrés)</li>
              <li>Entretien de pré-qualification si votre profil correspond</li>
              <li>Évaluation technique et comportementale</li>
              <li>Intégration au réseau d'experts ANSUT</li>
            </ol>
          </div>
          
          <p>Vous pouvez créer un compte sur notre plateforme pour suivre l'évolution de votre candidature et compléter votre profil :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://quali-rh-experts.lovable.app/auth" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Créer mon compte
            </a>
          </div>
          
          <p>Nous vous remercions de votre intérêt pour l'ANSUT.</p>
          
          <p>Cordialement,<br>
          <strong>L'équipe RH ANSUT</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280;">
            ANSUT - Agence Nationale du Service Universel des Télécommunications<br>
            Programme de Transformation Numérique de la Côte d'Ivoire
          </p>
        </div>
      `,
    };

    console.log('Email confirmation prepared:', confirmationMessage);

    // TODO: Integrate with Resend or another email service
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // await resend.emails.send(confirmationMessage);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email logged (email service not configured yet)',
        data: confirmationMessage 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-application-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
