import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  status: 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, status, notes }: StatusUpdateRequest = await req.json();

    console.log('Sending status update email:', { email, status });

    let emailSubject = '';
    let emailBody = '';

    if (status === 'reviewed') {
      emailSubject = `Mise à jour de votre candidature - ANSUT`;
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Candidature en cours d'examen</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${firstName} ${lastName},</h2>
              <p>Nous vous informons que votre candidature est actuellement en cours d'examen par notre équipe.</p>
              <p>Nous reviendrons vers vous prochainement avec une réponse.</p>
              <p>Merci pour votre patience.</p>
            </div>
            <div class="footer">
              <p>Agence Nationale du Service Universel des Télécommunications/TIC</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (status === 'accepted') {
      emailSubject = `🎉 Félicitations ! Votre candidature est acceptée - ANSUT`;
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .highlight { background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Félicitations !</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${firstName} ${lastName},</h2>
              <p>Nous avons le plaisir de vous informer que votre candidature a été <strong>acceptée</strong> !</p>
              <div class="highlight">
                <p><strong>Prochaines étapes :</strong></p>
                <ul>
                  <li>Notre équipe vous contactera dans les prochains jours</li>
                  <li>Nous organiserons un entretien pour discuter des détails</li>
                  <li>Préparez vos documents officiels</li>
                </ul>
              </div>
              ${notes ? `<p><strong>Note de l'équipe RH :</strong><br>${notes}</p>` : ''}
              <p>Nous sommes ravis de potentiellement vous accueillir au sein de l'ANSUT !</p>
            </div>
            <div class="footer">
              <p>Agence Nationale du Service Universel des Télécommunications/TIC</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (status === 'rejected') {
      emailSubject = `Suite à votre candidature - ANSUT`;
      emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Suite à votre candidature</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${firstName} ${lastName},</h2>
              <p>Nous vous remercions sincèrement pour l'intérêt que vous portez à l'ANSUT et pour le temps que vous avez consacré à votre candidature.</p>
              <p>Après un examen attentif de votre dossier, nous devons malheureusement vous informer que nous ne pourrons pas donner suite à votre candidature pour le moment.</p>
              ${notes ? `<p><strong>Commentaire :</strong><br>${notes}</p>` : ''}
              <p>Cette décision ne remet en aucun cas en question vos compétences et qualifications. Nous vous encourageons vivement à postuler à nouveau pour nos futures opportunités.</p>
              <p>Nous vous souhaitons beaucoup de succès dans votre recherche.</p>
            </div>
            <div class="footer">
              <p>Agence Nationale du Service Universel des Télécommunications/TIC</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "ANSUT Recrutement <no-reply@notifications.ansut.ci>",
      to: [email],
      subject: emailSubject,
      html: emailBody,
    });

    console.log('Status update email sent:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Status update email sent',
        emailId: emailResponse.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending status update email:', error);
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
