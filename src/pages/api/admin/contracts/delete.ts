import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";
import { del } from "@vercel/blob";

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
  // Auth check
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Session expired — please refresh and re-enter your admin key" });
  }

  try {
    const body = await request.json();
    const { contract_id } = body;

    if (!contract_id) {
      return json(400, { error: "Missing contract_id" });
    }

    // Dev mode guard
    if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
      console.log("[DEV] Would delete contract:", contract_id);
      return json(200, { success: true, message: "Dev mode: contract delete skipped" });
    }

    const sql = neon(import.meta.env.DATABASE_URL);

    // Fetch the contract record so we have the file_url for Blob deletion
    const records = await sql`
      SELECT id, file_url, signed_at FROM contracts WHERE id = ${contract_id}
    `;

    if (records.length === 0) {
      return json(404, { error: "Contract not found" });
    }

    const contract = records[0];

    // Delete from Vercel Blob (non-fatal if it fails — DB record is the source of truth)
    try {
      await del(contract.file_url);
    } catch (blobErr) {
      console.error("Blob delete failed (non-fatal):", blobErr);
    }

    // Delete DB record
    await sql`DELETE FROM contracts WHERE id = ${contract_id}`;

    return json(200, { success: true });
  } catch (error) {
    console.error("Contract delete error:", error);
    return json(500, { error: "Failed to delete contract" });
  }
};