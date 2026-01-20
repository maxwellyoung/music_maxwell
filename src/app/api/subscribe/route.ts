import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: z.string().optional().default("website"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Add to Resend audience
    // Note: You'll need to create an audience in Resend and get the ID
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
    }

    // Send welcome email
    await resend.emails.send({
      from: "Maxwell Young <hello@maxwellyoung.info>",
      to: email,
      subject: "Welcome to the Maxwell Young mailing list",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #000; color: #fff;">
          <h1 style="font-size: 24px; margin-bottom: 20px;">Thanks for subscribing!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
            You'll be the first to know about new music, shows, and exclusive content.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #ccc; margin-top: 20px;">
            In the meantime, check out my latest releases on
            <a href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q" style="color: #1DB954;">Spotify</a>.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 40px;">
            — Maxwell Young
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Subscribe API] Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
