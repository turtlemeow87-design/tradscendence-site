import type { APIRoute } from "astro";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

// GET /api/admin/check — lets an admin page confirm the key before unlocking
export const GET: APIRoute = async ({ request }) => {
  if (request.headers.get("x-admin-key") !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized" });
  }
  return json(200, { ok: true });
};
