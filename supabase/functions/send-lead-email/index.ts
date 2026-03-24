// @ts-ignore: Deno URL import
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// @ts-ignore: Deno global
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = "onboarding@resend.dev" // Change this to your verified domain email later
const TO_EMAIL = "info@vanroey-kalei.be"   // Where you want to receive the leads

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const lead = payload.record

    console.log(`Processing new lead for Resend: ${lead.name} (${lead.email})`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `Nieuwe offerteaanvraag: ${lead.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #1A1917; border-bottom: 2px solid #8C7B6C; padding-bottom: 10px;">Nieuwe aanvraag ontvangen</h2>
            <p>Er is een nieuwe offerteaanvraag binnengekomen via de website.</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Naam:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${lead.email}">${lead.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Telefoon:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.phone || 'Niet opgegeven'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Project Type:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-transform: capitalize;">${lead.project_type}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Locatie:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.postal_code || ''} ${lead.city || ''}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Ondergrond:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-transform: capitalize;">${lead.surface_type}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Timing:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.timing}</td>
              </tr>
            </table>

            ${lead.comment ? `
              <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #8C7B6C;">
                <p style="margin: 0; font-weight: bold; font-size: 12px; text-transform: uppercase; color: #8C7B6C;">Opmerking van klant:</p>
                <p style="margin-top: 5px; font-style: italic;">"${lead.comment}"</p>
              </div>
            ` : ''}

            <div style="margin-top: 30px; text-align: center;">
              <a href="https://sjfosmcpbekkokmedwil.supabase.co/dashboard/project/_/editor/leads?filter=id%3Deq.${lead.id}" 
                 style="background-color: #1A1917; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; display: inline-block;">
                 Bekijk in Dashboard
              </a>
            </div>
          </div>
        `,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error sending email via Resend:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})