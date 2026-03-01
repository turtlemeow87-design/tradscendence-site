import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

// Stamps the signature block onto the last page of a PDF and returns the modified bytes.
// Throws if anything goes wrong — caller handles the fallback.
async function stampPdf(
  pdfUrl: string,
  signatureName: string,
  signedAt: Date,
  signerIp: string
): Promise<Uint8Array> {
  // Fetch original PDF from Vercel Blob
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status}`);
  }
  const pdfBytes = await response.arrayBuffer();

  // Load the document
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  const { width, height } = lastPage.getSize();

  // Embed fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Format date/time in EST
  const formattedDate = signedAt.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = signedAt.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Stamp layout constants
  const blockWidth = 260;
  const blockX = width - blockWidth - 36; // 36pt right margin
  const baseY = 72; // 72pt (~1 inch) from page bottom
  const lineSpacing = 14;
  const separatorColor = rgb(0.6, 0.6, 0.6);
  const textColor = rgb(0.1, 0.1, 0.1);
  const labelColor = rgb(0.35, 0.35, 0.35);

  // Draw top separator line
  lastPage.drawLine({
    start: { x: blockX, y: baseY + lineSpacing * 5 + 6 },
    end: { x: blockX + blockWidth, y: baseY + lineSpacing * 5 + 6 },
    thickness: 0.75,
    color: separatorColor,
  });

  // "DIGITALLY SIGNED" header
  lastPage.drawText("DIGITALLY SIGNED", {
    x: blockX,
    y: baseY + lineSpacing * 5,
    size: 8,
    font: helveticaBold,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Signed by
  lastPage.drawText("Signed by:", {
    x: blockX,
    y: baseY + lineSpacing * 3.5,
    size: 7,
    font: helvetica,
    color: labelColor,
  });
  lastPage.drawText(signatureName, {
    x: blockX,
    y: baseY + lineSpacing * 2.5,
    size: 8,
    font: helveticaBold,
    color: textColor,
  });

  // Date/time
  lastPage.drawText("Date:", {
    x: blockX,
    y: baseY + lineSpacing * 1.5,
    size: 7,
    font: helvetica,
    color: labelColor,
  });
  lastPage.drawText(`${formattedDate} at ${formattedTime} EST`, {
    x: blockX,
    y: baseY + lineSpacing * 0.6,
    size: 7,
    font: helvetica,
    color: textColor,
  });

  // IP address
  lastPage.drawText(`IP: ${signerIp}`, {
    x: blockX,
    y: baseY - lineSpacing * 0.4,
    size: 6.5,
    font: helvetica,
    color: labelColor,
  });

  // Bottom separator line
  lastPage.drawLine({
    start: { x: blockX, y: baseY - lineSpacing * 1.1 },
    end: { x: blockX + blockWidth, y: baseY - lineSpacing * 1.1 },
    thickness: 0.75,
    color: separatorColor,
  });

  return pdfDoc.save();
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
        pdfStamped: false,
      });
    }

    const sql = neon(import.meta.env.DATABASE_URL);

    // Get contract and verify ownership — now also fetching file_url for stamping
    const result = await sql`
      SELECT 
        c.id,
        c.signed_at,
        c.file_url,
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

    const signerIp = clientAddress || "unknown";
    const signedAt = new Date();

    // Save signature to database FIRST — this is the legally binding record.
    // PDF stamping is a customer comfort feature and runs after.
    await sql`
      UPDATE contracts
      SET 
        signed_at = ${signedAt.toISOString()},
        signature_name = ${trimmedName},
        signer_ip = ${signerIp}
      WHERE id = ${contractId}
    `;

    // Attempt PDF stamping — failure is non-fatal
    let pdfStamped = false;
    try {
      const stampedBytes = await stampPdf(
        contract.file_url,
        trimmedName,
        signedAt,
        signerIp
      );

      // Upload stamped PDF to Vercel Blob, replacing the original
      // Using a consistent pathname so subsequent uploads overwrite
      const blobPathname = `contracts/signed-${contractId}.pdf`;
      const blob = await put(blobPathname, Buffer.from(stampedBytes), {
  access: "public",
  contentType: "application/pdf",
});

      // Update the stored file URL to point to the stamped version
      await sql`
        UPDATE contracts
        SET file_url = ${blob.url}
        WHERE id = ${contractId}
      `;

      pdfStamped = true;
      console.log(`[Contracts] PDF stamped successfully for contract ${contractId}`);
    } catch (pdfError) {
      // Log but do not fail — database signature record is sufficient
      console.error(
        `[Contracts] PDF stamping failed for contract ${contractId} — signature still recorded in DB:`,
        pdfError
      );
    }

    return json(200, {
      success: true,
      signedAt: signedAt.toISOString(),
      signatureName: trimmedName,
      pdfStamped, // lets the frontend know if the PDF was updated
    });
  } catch (error) {
    console.error("Contract signing error:", error);
    return json(500, { error: "Failed to sign contract" });
  }
};