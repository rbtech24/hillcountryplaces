import { MailService } from '@sendgrid/mail';

// Check if SendGrid API key is available
const hasSendgridKey = process.env.SENDGRID_API_KEY !== undefined;

// Initialize the mail service if API key is available
let mailService: MailService | null = null;

if (hasSendgridKey) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY || '');
  console.log('SendGrid mail service initialized');
} else {
  console.log('SendGrid API key not found. Email functionality will be limited.');
}

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

/**
 * Send an email using SendGrid
 * Falls back to logging the email content if SendGrid is not configured
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, text, html } = options;
  const from = options.from || 'updates@texashillcountryguide.com';
  
  // Validate required fields
  if (!to || !subject || (!text && !html)) {
    console.error('Invalid email options: missing required fields');
    return false;
  }
  
  try {
    // If SendGrid is configured, send the email
    if (mailService) {
      await mailService.send({
        to,
        from,
        subject,
        text,
        html
      });
      console.log(`Email sent to ${to} - Subject: ${subject}`);
      return true;
    } 
    
    // Otherwise log the email content for testing/development
    console.log('------- WOULD SEND EMAIL (SendGrid not configured) -------');
    console.log(`To: ${to}`);
    console.log(`From: ${from}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text || html}`);
    console.log('----------------------------------------------------------');
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send a calendar update notification email
 */
export async function sendCalendarUpdateNotification(
  email: string, 
  events: { name: string, date: string, location: string }[]
): Promise<boolean> {
  const subject = 'New Hill Country Events Added to Calendar';
  
  // Generate HTML content for the email
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #5c913b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .event { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Hill Country Events Added!</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We've added some exciting new events to our Hill Country calendar that we thought you'd be interested in:</p>
          
          ${events.map(event => `
            <div class="event">
              <h3>${event.name}</h3>
              <p><strong>Date:</strong> ${event.date}</p>
              <p><strong>Location:</strong> ${event.location}</p>
            </div>
          `).join('')}
          
          <p>Check out our <a href="https://texashillcountryguide.com/calendar-map">Calendar & Map</a> page for more details and to see all upcoming events.</p>
          <p>We hope to see you in the beautiful Texas Hill Country soon!</p>
          <p>Best regards,<br>Texas Hill Country Guide Team</p>
        </div>
        <div class="footer">
          <p>You received this email because you subscribed to calendar updates from Texas Hill Country Guide.</p>
          <p>To unsubscribe, <a href="https://texashillcountryguide.com/unsubscribe?email=${email}">click here</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Generate plain text version for email clients that don't support HTML
  const textContent = `
    New Hill Country Events Added!
    
    Hello,
    
    We've added some exciting new events to our Hill Country calendar that we thought you'd be interested in:
    
    ${events.map(event => `
    ${event.name}
    Date: ${event.date}
    Location: ${event.location}
    
    `).join('')}
    
    Check out our Calendar & Map page for more details and to see all upcoming events:
    https://texashillcountryguide.com/calendar-map
    
    We hope to see you in the beautiful Texas Hill Country soon!
    
    Best regards,
    Texas Hill Country Guide Team
    
    ---
    You received this email because you subscribed to calendar updates from Texas Hill Country Guide.
    To unsubscribe, visit: https://texashillcountryguide.com/unsubscribe?email=${email}
  `;
  
  return sendEmail({
    to: email,
    subject,
    text: textContent,
    html: htmlContent
  });
}