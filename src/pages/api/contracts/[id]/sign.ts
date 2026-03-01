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

export const POST: APIRoute = async ({ params, request, locals, clientAddress }) => {
  const user = locals.user;

  if (!user) {
    return json(401, { error: "Unauthorized" });
  }

  const contractId = params.id;

  if (!contractId) {
    return json(400, { error: "Missing contract ID" });
  }

  try {
    const body = await request.json();
    const { signatureName, agreed } = body;

    // Validation
    if (!signatureName || typeof signatureName !== "string") {
      return json(400, { error: "Signature name is required" });
    }

    if (!agreed) {
      return json(400, { error: "You must agree to the contract terms" });
    }

    const trimmedName = signatureName.trim();
    if (trimmedName.length < 2) {
      return json(400, { error: "Please enter your full name" });
    }

    // Dev mode guard
    if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
      console.log("[DEV] Would sign contract:", contractId, "as:", trimmedName);
      return json(200, {
        success: true,
        signedAt: new Date().toISOString(),
        signatureName: trimmedName,
      });
    }

    const sql = neon(import.meta.env.DATABASE_URL);

    // Get contract and verify ownership
    const result = await sql`
      SELECT 
        c.id,
        c.signed_at,
        cs.email
      FROM contracts c
      JOIN contact_submissions cs ON c.submission_id = cs.id
      WHERE c.id = ${contractId}
    `;

    if (result.length === 0) {
      return json(404, { error: "Contract not found" });
    }

    const contract = result[0];

    // Verify ownership
    if (contract.email !== user.email) {
      return json(403, { error: "Access denied" });
    }

    // Check if already signed
    if (contract.signed_at) {
      return json(400, { error: "Contract already signed" });
    }

    // Record signature
    const signerIp = clientAddress || "unknown";
    
    await sql`
      UPDATE contracts
      SET 
        signed_at = CURRENT_TIMESTAMP,
        signature_name = ${trimmedName},
        signer_ip = ${signerIp}
      WHERE id = ${contractId}
    `;

    return json(200, {
      success: true,
      signedAt: new Date().toISOString(),
      signatureName: trimmedName,
    });
  } catch (error) {
    console.error("Contract signing error:", error);
    return json(500, { error: "Failed to sign contract" });
  }
};