import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';
export { renderers } from '../../renderers.mjs';

const MAX_NAME = 80;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4e3;
const MAX_LOCATION = 120;
const MAX_PHONE = 40;
const MAX_CUSTOM_TEXT = 500;
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function clampTrim(v, max) {
  return v.trim().slice(0, max);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
function isValidISODate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00Z");
  return !Number.isNaN(d.getTime());
}
function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}
const POST = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return json(415, {
      error: "Unsupported Media Type. Send application/json."
    });
  }
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON." });
  }
  const honeypot = typeof payload?.honeypot === "string" ? payload.honeypot : "";
  if (honeypot.trim().length > 0) {
    return json(200, { ok: true });
  }
  const errors = {};
  const name = isNonEmptyString(payload?.name) ? clampTrim(payload.name, MAX_NAME) : "";
  const emailRaw = isNonEmptyString(payload?.email) ? clampTrim(payload.email, MAX_EMAIL) : "";
  const email = emailRaw.toLowerCase();
  const location = isNonEmptyString(payload?.location) ? clampTrim(payload.location, MAX_LOCATION) : "";
  const message = isNonEmptyString(payload?.message) ? clampTrim(payload.message, MAX_MESSAGE) : "";
  const phone = isNonEmptyString(payload?.phone) ? clampTrim(payload.phone, MAX_PHONE) : "";
  const date = isNonEmptyString(payload?.date) ? payload.date.trim() : "";
  const instruments = Array.isArray(payload?.instruments) ? payload.instruments : [];
  const genres = Array.isArray(payload?.genres) ? payload.genres : [];
  const genreOther = isNonEmptyString(payload?.genre_other) ? clampTrim(payload.genre_other, MAX_CUSTOM_TEXT) : "";
  const formName = isNonEmptyString(payload?.formName) ? payload.formName : "Contact Page";
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
  const formattedPhone = phone ? normalizePhone(phone) : "";
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  console.log(`📝 Contact form submission in ${"PRODUCTION"} mode`);
  console.log(`   Name: ${name}`);
  console.log(`   Email: ${email}`);
  console.log(`   Location: ${location}`);
  {
    try {
      const sql = neon("postgresql://neondb_owner:npg_7w9kgXDBueEJ@ep-shiny-river-aiuubcro-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
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
    }
  }
  {
    const resendApiKey = "re_fL2JUu5t_D435CyjDpU23XKWA27e54cyP";
    const contactEmail = "HunterEast.Musiq@gmail.com";
    const resend = new Resend(resendApiKey);
    const instrumentList = instruments.length > 0 ? instruments.join(", ") : "Not specified";
    const genreList = genres.length > 0 ? genres.join(", ") : "Not specified";
    const emailBody = `
New Inquiry from ${name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email: ${email}
${formattedPhone ? `📱 Phone: ${formattedPhone}` : ""}
${date ? `📅 Event Date: ${date}` : ""}
📍 Location: ${location}

🎵 Instruments: ${instrumentList}
🎶 Genres: ${genreList}
${genreOther ? `🎨 Custom Genre: ${genreOther}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Submitted from: ${formName}
IP: ${ipAddress}
Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}
    `.trim();
    try {
      const { data, error } = await resend.emails.send({
        from: "Tradscendence Booking <bookings@soundbeyondborders.com>",
        to: [contactEmail],
        replyTo: email,
        subject: `🎵 SoundBeyondBorders Booking Inquiries and Questions`,
        text: emailBody
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
  }
  return json(200, { ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
