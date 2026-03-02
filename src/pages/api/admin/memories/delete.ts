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

export const DELETE: APIRoute = async ({ request }) => {
  if (request.headers.get("x-admin-key") !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized" });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { error: "Content-Type must be application/json" });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { memory_id } = body;
  if (!memory_id) return json(400, { error: "memory_id is required" });

  try {
    const sql = neon(import.meta.env.DATABASE_URL);
    const result = await sql`
      DELETE FROM memories WHERE id = ${Number(memory_id)} RETURNING id
    `;
    if (result.length === 0) return json(404, { error: "Memory not found" });
    return json(200, { ok: true });
  } catch (err) {
    console.error("Failed to delete memory:", err);
    return json(500, { error: "Failed to delete memory" });
  }
};