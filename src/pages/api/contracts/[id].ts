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

export const GET: APIRoute = async ({ params, locals }) => {
  const user = locals.user;

  if (!user) {
    return json(401, { error: "Unauthorized" });
  }

  const contractId = params.id;

  if (!contractId) {
    return json(400, { error: "Missing contract ID" });
  }

  // Dev mode guard
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, {
      id: parseInt(contractId),
      fileUrl: "https://example.com/dev-contract.pdf",
      uploadedAt: new Date().toISOString(),
      signedAt: null,
      signatureName: null,
    });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    // Get contract and verify ownership via email match
    const result = await sql`
      SELECT 
        c.id,
        c.file_url,
        c.uploaded_at,
        c.signed_at,
        c.signature_name,
        cs.email
      FROM contracts c
      JOIN contact_submissions cs ON c.submission_id = cs.id
      WHERE c.id = ${contractId}
    `;

    if (result.length === 0) {
      return json(404, { error: "Contract not found" });
    }

    const contract = result[0];

    // Verify user owns this contract
    if (contract.email !== user.email) {
      return json(403, { error: "Access denied" });
    }

    return json(200, {
      id: contract.id,
      fileUrl: contract.file_url,
      uploadedAt: contract.uploaded_at,
      signedAt: contract.signed_at,
      signatureName: contract.signature_name,
    });
  } catch (error) {
    console.error("Contract fetch error:", error);
    return json(500, { error: "Failed to fetch contract" });
  }
};