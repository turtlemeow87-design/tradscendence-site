import type { APIRoute } from "astro";

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
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  // Accept 10 digits (US) or 11 digits (with country code)
  return digits.length === 10 || digits.length === 11;
}

function normalizePhone(phone: string) {
  // Extract just the digits
  const digits = phone.replace(/\D/g, "");
  // Format as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone; // Return as-is if weird format
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

  // 3) Honeypot check (spam bots fill hidden fields)
  const honeypot = typeof payload?.honeypot === "string" ? payload.honeypot : "";
  if (honeypot.trim().length > 0) {
    // Return fake success to avoid teaching bots
    return json(200, { ok: true });
  }

  // 4) Normalize & validate fields
  const errors: Record<string, string> = {};

  // Required fields
  const name = isNonEmptyString(payload?.name) ? clampTrim(payload.name, MAX_NAME) : "";
  const emailRaw = isNonEmptyString(payload?.email) ? clampTrim(payload.email, MAX_EMAIL) : "";
  const email = emailRaw.toLowerCase();
  const location = isNonEmptyString(payload?.location) ? clampTrim(payload.location, MAX_LOCATION) : "";
  const message = isNonEmptyString(payload?.message) ? clampTrim(payload.message, MAX_MESSAGE) : "";

  // Optional fields
  const phone = isNonEmptyString(payload?.phone) ? clampTrim(payload.phone, MAX_PHONE) : "";
  const date = isNonEmptyString(payload?.date) ? payload.date.trim() : "";
  
  // Multi-select arrays
  const instruments = Array.isArray(payload?.instruments) ? payload.instruments : [];
  const genres = Array.isArray(payload?.genres) ? payload.genres : [];
  
  // Custom text fields
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

  // Validate optional fields if provided
  if (date && !isValidISODate(date)) {
    errors.date = "Event date must be YYYY-MM-DD format.";
  }
  
  if (phone && !isValidPhone(phone)) {
    errors.phone = "Phone number looks invalid. Use format: (804) 555-1234";
  }

  // If validation failed, return errors
  if (Object.keys(errors).length > 0) {
    return json(400, { error: "Validation failed.", errors });
  }

  // 5) Format phone nicely if provided
  const formattedPhone = phone ? normalizePhone(phone) : "";

  // 6) Build readable message for Formspree
  const instrumentList = instruments.length > 0 ? instruments.join(", ") : "Not specified";
  const genreList = genres.length > 0 ? genres.join(", ") : "Not specified";
  
  const composedMessage = [
    `Name: ${name}`,
    `Email: ${email}`,
    formattedPhone ? `Phone: ${formattedPhone}` : null,
    date ? `Event Date: ${date}` : null,
    `Location: ${location}`,
    `Instruments: ${instrumentList}`,
    `Genres: ${genreList}`,
    genreOther ? `Custom Genre(s): ${genreOther}` : null,
    "",
    "Message:",
    message,
    "",
    `Form: ${formName}`,
  ]
    .filter(Boolean)
    .join("\n");

  // 7) Forward to Formspree
  const endpoint = import.meta.env.FORMSPREE_ENDPOINT;
  if (!endpoint) {
    return json(500, { error: "Server misconfigured. Missing FORMSPREE_ENDPOINT." });
  }

  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message: composedMessage,
        _subject: `Booking Request from ${name}`,
      }),
    });

    if (!resp.ok) {
      console.error("Formspree error:", resp.status);
      return json(502, { error: "Upstream form service error." });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("Network error:", err);
    return json(502, { error: "Network error contacting form service." });
  }
};