import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email }: ApplicationConfirmationRequest = await req.json();

    console.log('Sending confirmation email to:', email);

    const emailSubject = `Confirmation de votre candidature - ANSUT`;
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmation de candidature</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${firstName} ${lastName},</h2>
            <p>Nous avons bien reçu votre candidature et nous vous en remercions.</p>
            <p>Notre équipe des ressources humaines l'examinera dans les plus brefs délais.</p>
            <p><strong>Prochaines étapes :</strong></p>
            <ul>
              <li>Votre dossier sera examiné par notre équipe</li>
              <li>Vous recevrez une notification dès qu'il y aura une mise à jour</li>
              <li>Si votre profil correspond, nous vous contacterons pour un entretien</li>
            </ul>
            <p>En attendant, n'hésitez pas à consulter notre site web pour en savoir plus sur l'ANSUT.</p>
          </div>
          <div class="footer">
            <p>Agence Nationale du Service Universel des Télécommunications/TIC</p>
            <p>Abidjan, Côte d'Ivoire</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "ANSUT Recrutement <onboarding@resend.dev>",
      to: [email],
      subject: emailSubject,
      html: emailBody,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Confirmation email sent',
        emailId: emailResponse.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending confirmation email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
