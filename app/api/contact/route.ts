import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    const emailSubject = subject || 'New inquiry from House of Weaves';

    // Send notification email
    await resend.emails.send({
      from: 'House of Weaves <noreply@houseofweaves.love>',
      to: ['hello@houseofweaves.love'],
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 1px solid #e5e5e5; padding-bottom: 16px;">
            New Inquiry
          </h2>
          
          <div style="margin: 24px 0;">
            <p style="margin: 8px 0;"><strong>From:</strong> ${fullName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            ${subject ? `<p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
          </div>
          
          <div style="margin: 24px 0; padding: 16px; background-color: #f9f6f1; border-left: 3px solid #8b4513;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 32px;">
            — House of Weaves
          </p>
        </div>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'House of Weaves <noreply@houseofweaves.love>',
      to: [email],
      subject: 'We received your message',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Thank you for reaching out</h2>
          
          <p style="color: #444; line-height: 1.7;">
            We received your message and will get back to you as soon as possible.
          </p>
          
          <p style="color: #444; line-height: 1.7;">
            In the meantime, feel free to explore our archive at 
            <a href="https://houseofweaves.love" style="color: #8b4513;">houseofweaves.love</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 32px;">
            — House of Weaves<br>
            Marrakech, Morocco
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
