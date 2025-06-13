
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Service {
  id: string;
  name: string;
  type: string;
  provider: string;
  amount: number;
  currency: string;
  expirationDate: string;
  status: string;
}

interface EmailRequest {
  email: string;
  reportType: string;
  services: Service[];
}

const serve_handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, reportType, services }: EmailRequest = await req.json();
    
    console.log(`Sending ${reportType} report to ${email} with ${services.length} services`);

    const postmarkToken = Deno.env.get('POSTMARK_API_TOKEN');
    const fromEmail = Deno.env.get('POSTMARK_FROM_EMAIL');
    
    if (!postmarkToken || !fromEmail) {
      throw new Error('Postmark configuration missing');
    }

    // Generate email content based on report type
    const { subject, htmlContent } = generateEmailContent(reportType, services);

    // Send email via Postmark
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: email,
        Subject: subject,
        HtmlBody: htmlContent,
        MessageStream: 'outbound'
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Postmark error:', result);
      throw new Error(`Postmark API error: ${result.Message || 'Unknown error'}`);
    }

    console.log('Email sent successfully:', result.MessageID);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.MessageID,
        message: `Report sent successfully to ${email}`
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
    console.error('Error sending expiry report:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

function generateEmailContent(reportType: string, services: Service[]) {
  const reportTitles: { [key: string]: string } = {
    'expiring7': 'Services Expiring in 7 Days',
    'expiring3': 'Services Expiring in 3 Days',
    'expiringToday': 'Services Expiring Today',
    'expired2': 'Services Expired 2 Days Ago',
    'expired5': 'Services Expired 5 Days Ago',
    'expired10': 'Services Expired 10 Days Ago',
    'expired30': 'Services Expired 30 Days Ago'
  };

  const subject = `Service Expiry Report: ${reportTitles[reportType] || 'Service Report'}`;
  
  const isExpired = reportType.includes('expired');
  const statusColor = isExpired ? '#dc2626' : '#f59e0b';
  const statusText = isExpired ? 'EXPIRED' : 'EXPIRING';

  const servicesHtml = services.map(service => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; text-align: left;">${service.name}</td>
      <td style="padding: 12px; text-align: left;">${service.type}</td>
      <td style="padding: 12px; text-align: left;">${service.provider}</td>
      <td style="padding: 12px; text-align: left;">${service.amount} ${service.currency}</td>
      <td style="padding: 12px; text-align: left;">${new Date(service.expirationDate).toLocaleDateString()}</td>
      <td style="padding: 12px; text-align: center;">
        <span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
          ${statusText}
        </span>
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Service Expiry Report</h1>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">${reportTitles[reportType] || 'Service Report'}</p>
        </div>

        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f9fafb;">
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Service Name</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Type</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Provider</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Amount</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Expiry Date</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${servicesHtml}
                </tbody>
            </table>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
            <p style="margin: 0; color: #0c4a6e;">
                <strong>Summary:</strong> This report contains ${services.length} service${services.length !== 1 ? 's' : ''} that ${isExpired ? 'have expired' : 'are expiring soon'}.
                ${!isExpired ? ' Please take action to renew these services to avoid any service interruptions.' : ' Please review these expired services and take necessary action.'}
            </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This email was generated automatically by your Service Management System.</p>
            <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
  `;

  return { subject, htmlContent };
}

serve(serve_handler);
