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

// GET /api/admin/invoices/list
// Returns all invoices grouped-ready (flat list, admin merges client-side)
export const GET: APIRoute = async ({ request }) => {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Session expired — please refresh and re-enter your admin key" });
  }

  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { invoices: [] });
  }

  try {
    const sql = neon(import.meta.env.DATABASE_URL);

    const invoices = await sql`
      SELECT id, submission_id, file_url, label, uploaded_at
      FROM invoices
      ORDER BY submission_id, uploaded_at ASC
    `;

    return json(200, { invoices });
  } catch (error) {
    console.error("Invoice list error:", error);
    return json(500, { error: "Failed to fetch invoices" });
  }
};