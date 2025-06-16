
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get services expiring in the next 30 days
    const { data: services, error: servicesError } = await supabaseClient
      .from('services')
      .select('*')
      .gte('expiration_date', new Date().toISOString().split('T')[0])
      .lte('expiration_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`)
    }

    if (!services || services.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No services expiring in the next 30 days' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Get Postmark configuration
    const postmarkApiToken = Deno.env.get('POSTMARK_API_TOKEN')
    const postmarkFromEmail = Deno.env.get('POSTMARK_FROM_EMAIL')

    if (!postmarkApiToken || !postmarkFromEmail) {
      throw new Error('Postmark configuration missing. Please set POSTMARK_API_TOKEN and POSTMARK_FROM_EMAIL in Edge Function secrets.')
    }

    // Generate HTML email content
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .service-item { border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin-bottom: 15px; }
            .service-name { font-weight: bold; font-size: 16px; color: #333; }
            .service-details { margin-top: 8px; color: #666; }
            .expiring-soon { border-left: 4px solid #f39c12; }
            .expired { border-left: 4px solid #e74c3c; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #333; margin: 0;">Service Expiry Report</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Services expiring in the next 30 days</p>
            </div>
            
            ${services.map(service => {
              const expirationDate = new Date(service.expiration_date)
              const today = new Date()
              const daysUntilExpiry = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              const isExpired = daysUntilExpiry < 0
              const cssClass = isExpired ? 'expired' : 'expiring-soon'
              
              return `
                <div class="service-item ${cssClass}">
                  <div class="service-name">${service.name}</div>
                  <div class="service-details">
                    <strong>Provider:</strong> ${service.provider}<br>
                    <strong>Amount:</strong> ${service.amount} ${service.currency}<br>
                    <strong>Frequency:</strong> ${service.frequency}<br>
                    <strong>Expiration Date:</strong> ${expirationDate.toLocaleDateString()}<br>
                    <strong>Status:</strong> ${isExpired ? 'Expired' : `Expires in ${daysUntilExpiry} days`}
                  </div>
                </div>
              `
            }).join('')}
            
            <div class="footer">
              <p>This is an automated report from your Service Management System.</p>
              <p>Please review and renew your services as needed.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email via Postmark
    const postmarkResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkApiToken,
      },
      body: JSON.stringify({
        From: postmarkFromEmail,
        To: postmarkFromEmail, // Send to the same email for now
        Subject: `Service Expiry Report - ${services.length} services expiring soon`,
        HtmlBody: htmlContent,
        TextBody: `Service Expiry Report\n\n${services.map(s => 
          `${s.name} (${s.provider}) - Expires: ${new Date(s.expiration_date).toLocaleDateString()}`
        ).join('\n')}`
      })
    })

    if (!postmarkResponse.ok) {
      const errorText = await postmarkResponse.text()
      throw new Error(`Postmark API error: ${postmarkResponse.status} - ${errorText}`)
    }

    const postmarkResult = await postmarkResponse.json()

    return new Response(
      JSON.stringify({ 
        message: 'Email sent successfully',
        servicesCount: services.length,
        messageId: postmarkResult.MessageID
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-expiry-report function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the Edge Function logs for more information'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
