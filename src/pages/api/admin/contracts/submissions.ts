import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const GET: APIRoute = async ({ request }) => {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized" });
  }

  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, {
      submissions: [
        {
          id: 1,
          name: "Dev User",
          email: "dev@example.com",
          event_date: "2026-06-15",
          location: "Richmond, VA",
          instruments: ["Oud", "Handpan"],
          status: "Pending",
          created_at: new Date().toISOString(),
          last_reminded_at: null,
          admin_notes: null,
          is_registered: false,
          contract: null,
        },
      ],
    });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    const submissions = await sql`
      SELECT
        cs.id,
        cs.name,
        cs.first_name,
        cs.last_name,
        cs.email,
        cs.event_date,
        cs.location,
        cs.instruments,
        cs.status,
        cs.created_at,
        cs.last_reminded_at,
        cs.admin_notes,
        c.id            AS contract_id,
        c.file_url,
        c.uploaded_at,
        c.signed_at,
        c.signature_name,
        u.preferred_name,
        CASE WHEN u.id IS NOT NULL THEN true ELSE false END AS is_registered
      FROM contact_submissions cs
      LEFT JOIN contracts c ON cs.id = c.submission_id
      LEFT JOIN users u ON cs.email = u.email
      ORDER BY cs.created_at DESC
    `;

    const formatted = submissions.map(sub => ({
      id: sub.id,
      name: sub.name || [sub.first_name, sub.last_name].filter(Boolean).join(" "),
      preferred_name: sub.preferred_name || null,
      email: sub.email,
      event_date: sub.event_date,
      location: sub.location,
      instruments: sub.instruments,
      status: sub.status,
      created_at: sub.created_at,
      last_reminded_at: sub.last_reminded_at || null,
      admin_notes: sub.admin_notes || null,
      is_registered: sub.is_registered,
      contract: sub.contract_id
        ? {
            id: sub.contract_id,
            file_url: sub.file_url,
            uploaded_at: sub.uploaded_at,
            signed_at: sub.signed_at,
            signature_name: sub.signature_name,
          }
        : null,
    }));

    return json(200, { submissions: formatted });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return json(500, { error: "Failed to fetch submissions" });
  }
};