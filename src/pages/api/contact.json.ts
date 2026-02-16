import type { APIRoute } from "astro";
import { Resend } from "resend";
import { neon } from "@neondatabase/serverless";

// Field length limits
const MAX_NAME = 80;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4000;
const MAX_LOCATION = 120;
const MAX_PHONE = 40;
const MAX_CUSTOM_TEXT = 500;

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function clampTrim(v: string, max: number) {
  return v.trim().slice(0, max);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidISODate(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr + "T00:00:00Z");
  return !Number.isNaN(d.getTime());
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export const POST: APIRoute = async ({ request }) => {
  // 1) Enforce JSON
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return json(415, {
      error: "Unsupported Media Type. Send application/json.",
    });
  }

  // 2) Parse JSON safely
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON." });
  }

  // 3) Honeypot check
  const honeypot = typeof payload?.honeypot === "string" ? payload.honeypot : "";
  if (honeypot.trim().length > 0) {
    return json(200, { ok: true });
  }

  // 4) Normalize & validate fields
  const errors: Record<string, string> = {};

  const name = isNonEmptyString(payload?.name) ? clampTrim(payload.name, MAX_NAME) : "";
  const emailRaw = isNonEmptyString(payload?.email) ? clampTrim(payload.email, MAX_EMAIL) : "";
  const email = emailRaw.toLowerCase();
  const location = isNonEmptyString(payload?.location) ? clampTrim(payload.location, MAX_LOCATION) : "";
  const message = isNonEmptyString(payload?.message) ? clampTrim(payload.message, MAX_MESSAGE) : "";

  const phone = isNonEmptyString(payload?.phone) ? clampTrim(payload.phone, MAX_PHONE) : "";
  const date = isNonEmptyString(payload?.date) ? payload.date.trim() : "";
  
  const instruments = Array.isArray(payload?.instruments) ? payload.instruments : [];
  const genres = Array.isArray(payload?.genres) ? payload.genres : [];
  
  const genreOther = isNonEmptyString(payload?.genre_other) 
    ? clampTrim(payload.genre_other, MAX_CUSTOM_TEXT) 
    : "";
  
  const formName = isNonEmptyString(payload?.formName) ? payload.formName : "Contact Page";

  // Validate required fields
  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Email looks invalid.";
  if (!location) errors.location = "Location is required.";
  if (!message) errors.message = "Message is required.";

  if (date && !isValidISODate(date)) {
    errors.date = "Event date must be YYYY-MM-DD format.";
  }
  
  if (phone && !isValidPhone(phone)) {
    errors.phone = "Phone number looks invalid. Use format: (804) 555-1234";
  }

  if (Object.keys(errors).length > 0) {
    return json(400, { error: "Validation failed.", errors });
  }

  // 5) Format phone nicely
  const formattedPhone = phone ? normalizePhone(phone) : "";

  // 6) Get request metadata
  const ipAddress = request.headers.get("x-forwarded-for") || 
                    request.headers.get("x-real-ip") || 
                    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // 7) Determine environment
  const isDevelopment = import.meta.env.DEV || !import.meta.env.DATABASE_URL;
  
  console.log(`📝 Contact form submission in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
  console.log(`   Name: ${name}`);
  console.log(`   Email: ${email}`);
  console.log(`   Location: ${location}`);

  // 8) Save to database (skip in development)
  if (!isDevelopment) {
    try {
      const sql = neon(import.meta.env.DATABASE_URL);
      const result = await sql`
        INSERT INTO contact_submissions (
          name, email, phone, event_date, location, 
          instruments, genres, genre_other, message, 
          form_name, ip_address, user_agent
        )
        VALUES (
          ${name}, ${email}, ${formattedPhone}, ${date || null}, ${location},
          ${instruments}, ${genres}, ${genreOther}, ${message},
          ${formName}, ${ipAddress}, ${userAgent}
        )
        RETURNING id
      `;
      
      console.log("✅ Database insert successful! ID:", result[0]?.id);
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      // Continue even if database fails - still send email
    }
  } else {
    console.log("🔧 Development mode: Skipping database insert");
  }

  // 9) Send email via Resend (skip in development)
  if (!isDevelopment) {
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const contactEmail = import.meta.env.CONTACT_EMAIL;

    if (!resendApiKey || !contactEmail) {
      return json(500, { 
        error: "Server misconfigured. Missing email configuration." 
      });
    }

    const resend = new Resend(resendApiKey);

    // Build email content
    const instrumentList = instruments.length > 0 ? instruments.join(", ") : "Not specified";
    const genreList = genres.length > 0 ? genres.join(", ") : "Not specified";

    const emailBody = `
New Inquiry from ${name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email: ${email}
${formattedPhone ? `📱 Phone: ${formattedPhone}` : ''}
${date ? `📅 Event Date: ${date}` : ''}
📍 Location: ${location}

🎵 Instruments: ${instrumentList}
🎶 Genres: ${genreList}
${genreOther ? `🎨 Custom Genre: ${genreOther}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Submitted from: ${formName}
IP: ${ipAddress}
Timestamp: ${new Date().toISOString()}
    `.trim();

    try {
      const { data, error } = await resend.emails.send({
        from: 'Tradscendence Booking <bookings@soundbeyondborders.com>',
        to: [contactEmail],
        replyTo: email,
        subject: `🎵 SoundBeyondBorders Booking Inquiries and Questions`,
        text: emailBody,
      });

      if (error) {
        console.error("❌ Resend error:", error);
        return json(502, { 
          error: "Failed to send email notification." 
        });
      }

      console.log("✅ Email sent successfully:", data);
    } catch (emailError) {
      console.error("❌ Email error:", emailError);
      return json(502, { 
        error: "Failed to send email notification." 
      });
    }
  } else {
    console.log("🔧 Development mode: Skipping email send");
  }

  // Always return success
  return json(200, { ok: true });
};