
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        // 1. Read Test CSV
        const csvFilePath = path.join(process.cwd(), "test-data", "DPPS_Test_Payments_MixedCollisions.csv");
        if (!fs.existsSync(csvFilePath)) {
            return NextResponse.json({ error: "Test file not found" }, { status: 404 });
        }

        const fileContent = fs.readFileSync(csvFilePath, "utf-8");
        const lines = fileContent.split(/\r?\n/).filter(l => l.trim() !== "");
        const headers = lines[0].split(",").map(h => h.trim());

        // 2. Parse into InvoiceData format expected by /api/payment-gate/validate
        // Expected InvoiceData: { id, invoiceNumber, vendorId, amount, invoiceDate }

        // Map headers
        const getIdx = (name: string) => headers.indexOf(name);
        const idxInvoiceID = getIdx("Invoice_ID");
        const idxVendorNumber = getIdx("Vendor_Number"); // vendorId
        const idxInvoiceRef = getIdx("Invoice_Reference"); // invoiceNumber
        const idxInvoiceAmount = getIdx("Invoice_Amount");
        const idxInvoiceDate = getIdx("Invoice_Date");

        const invoices = lines.slice(1).map(line => {
            const vals = line.split(",").map(v => v.trim());
            if (vals.length !== headers.length) return null;
            return {
                id: vals[idxInvoiceID],
                vendorId: vals[idxVendorNumber],
                invoiceNumber: vals[idxInvoiceRef],
                amount: vals[idxInvoiceAmount],
                invoiceDate: vals[idxInvoiceDate]
            };
        }).filter(i => i !== null);

        // 3. Call Validate API in batches
        const batchSize = 50;
        const allDuplicates: any[] = [];
        let totalLines = 0;
        let approvedLines = 0;
        let heldLines = 0;
        let reviewLines = 0;
        let duplicatesDetected = 0;

        for (let i = 0; i < invoices.length; i += batchSize) {
            const batch = invoices.slice(i, i + batchSize);

            const response = await fetch("http://localhost:3000/api/payment-gate/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invoices: batch })
            });

            if (!response.ok) {
                const txt = await response.text();
                // If one batch fails, we record error but maybe continue or stop?
                // Let's stop and return error
                return NextResponse.json({ error: `Validation API failed at batch ${i}`, details: txt }, { status: response.status });
            }

            const result = await response.json();

            // Aggregate
            totalLines += result.totalLines || 0;
            approvedLines += result.approvedLines || 0;
            heldLines += result.heldLines || 0;
            reviewLines += result.reviewLines || 0;
            duplicatesDetected += result.duplicatesDetected || 0;

            if (Array.isArray(result.duplicates)) {
                allDuplicates.push(...result.duplicates);
            }
        }

        return NextResponse.json({
            totalLines,
            approvedLines,
            heldLines,
            reviewLines,
            duplicatesDetected,
            duplicates: allDuplicates
        });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
