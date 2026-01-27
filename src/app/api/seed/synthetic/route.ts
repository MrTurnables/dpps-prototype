
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors, invoices } from "@/lib/schema";
import fs from "fs";
import path from "path";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const csvFilePath = path.join(process.cwd(), "test-data", "DPPS_Synthetic_Paid_Invoices_1000.csv");

        if (!fs.existsSync(csvFilePath)) {
            return NextResponse.json(
                { error: "CSV file not found at " + csvFilePath },
                { status: 404 }
            );
        }

        const fileContent = fs.readFileSync(csvFilePath, "utf-8");
        const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");

        if (lines.length < 2) {
            return NextResponse.json(
                { error: "CSV file is empty or missing headers" },
                { status: 400 }
            );
        }

        const headers = lines[0].split(",").map(h => h.trim());
        const dataLines = lines.slice(1);

        const vendorMap = new Map<string, { id: string; name: string }>();
        const invoiceList: {
            id: string;
            vendorId: string; // Vendor_Number
            invoiceNumber: string; // Invoice_Reference
            amount: string; // Invoice_Amount
            invoiceDate: Date; // Invoice_Date
            status: string; // Payment_Status
            docId: string; // using Invoice_ID as doc_id or just id? Schema says id is uuid default gen, but I can override it.
            // The plan said: id -> Invoice_ID
        }[] = [];

        // Helper to get index
        const getIdx = (name: string) => headers.indexOf(name);

        const idxInvoiceID = getIdx("Invoice_ID");
        const idxVendorName = getIdx("Vendor_Name");
        const idxVendorNumber = getIdx("Vendor_Number");
        const idxInvoiceRef = getIdx("Invoice_Reference");
        const idxInvoiceAmount = getIdx("Invoice_Amount");
        const idxInvoiceDate = getIdx("Invoice_Date");
        const idxPaymentStatus = getIdx("Payment_Status");
        // const idxPaymentDate = getIdx("Payment_Date");

        if ([idxInvoiceID, idxVendorName, idxVendorNumber, idxInvoiceRef, idxInvoiceAmount, idxInvoiceDate, idxPaymentStatus].some(i => i === -1)) {
            return NextResponse.json(
                { error: "Missing required columns in CSV" },
                { status: 400 }
            );
        }

        // Parse data
        for (const line of dataLines) {
            // Simple CSV split (assuming no commas in values for this synthetic data)
            const values = line.split(",").map(v => v.trim());

            if (values.length !== headers.length) continue;

            const vendorId = values[idxVendorNumber];
            const vendorName = values[idxVendorName];

            if (!vendorMap.has(vendorId)) {
                vendorMap.set(vendorId, { id: vendorId, name: vendorName });
            }

            invoiceList.push({
                id: values[idxInvoiceID], // Using Invoice_ID from CSV as the primary key
                vendorId: vendorId,
                invoiceNumber: values[idxInvoiceRef],
                amount: values[idxInvoiceAmount],
                invoiceDate: new Date(values[idxInvoiceDate]),
                status: values[idxPaymentStatus].toLowerCase(), // e.g. "Paid" -> "paid"
                docId: values[idxInvoiceID]
            });
        }

        // 1. Upsert Vendors
        const vendorValues = Array.from(vendorMap.values());
        console.log(`Found ${vendorValues.length} unique vendors.`);

        // Batch insert vendors
        await db.insert(vendors).values(vendorValues.map(v => ({
            id: v.id,
            name: v.name,
            totalSpend: "0",
            riskLevel: "low"
        }))).onConflictDoUpdate({
            target: vendors.id,
            set: { name: sql.raw('excluded.name') }
        });

        // 2. Upsert Invoices
        console.log(`Processing ${invoiceList.length} invoices.`);
        let insertedCount = 0;

        // Batch insert is better, but let's do simple loop for safety and error handling first, or small batches
        // Drizzle insert many
        const batchSize = 100;
        for (let i = 0; i < invoiceList.length; i += batchSize) {
            const batch = invoiceList.slice(i, i + batchSize);
            await db.insert(invoices).values(batch.map(inv => ({
                id: inv.id,
                vendorId: inv.vendorId,
                invoiceNumber: inv.invoiceNumber,
                amount: inv.amount,
                invoiceDate: inv.invoiceDate,
                status: inv.status,
                docId: inv.docId,
                isDuplicate: false
            }))).onConflictDoNothing(); // If we run this multiple times, don't error

            insertedCount += batch.length;
        }

        return NextResponse.json({
            success: true,
            vendorsCount: vendorValues.length,
            invoicesCount: insertedCount
        });

    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            { error: "Failed to seed data: " + (error as Error).message },
            { status: 500 }
        );
    }
}
