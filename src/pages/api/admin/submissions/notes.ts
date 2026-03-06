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

export const PATCH: APIRoute = async ({ request }) => {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized" });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { error: "Content-Type must be application/json" });
  }

  let body: { submission_id?: number; notes?: string | null };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { submission_id, notes } = body;
  if (!submission_id || typeof submission_id !== "number") {
    return json(400, { error: "submission_id is required" });
  }

  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    const trimmed = typeof notes === "string" ? notes.trim() || null : null;
    await sql`
      UPDATE contact_submissions
      SET admin_notes = ${trimmed}
      WHERE id = ${submission_id}
    `;
    return json(200, { ok: true });
  } catch (error) {
    console.error("Failed to save notes:", error);
    return json(500, { error: "Failed to save notes" });
  }
};