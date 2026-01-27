import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, vendors, invoices, cases, recoveryItems, recoveryActivities } from "@/lib/schema";
import { nanoid } from "nanoid";

export async function POST() {
    try {
        // 1. Clear existing data (optional, but good for clean slate)
        // Note: Deletion order matters due to foreign keys
        try {
            await db.delete(recoveryActivities);
            await db.delete(recoveryItems);
            await db.delete(invoices);
            await db.delete(cases);
            await db.delete(vendors);
            await db.delete(users);
        } catch (e) {
            console.log("Cleanup failed or empty db:", e);
        }

        // 2. Create Users
        const analystId = nanoid();
        await db.insert(users).values({
            id: analystId,
            username: "jane.analyst@dpps.com",
            password: "hashed_password_here",
        });

        // 3. Create Vendors
        const vendorIds = {
            acme: nanoid(),
            globex: nanoid(),
            soylent: nanoid(),
            cyberdyne: nanoid(),
        };

        await db.insert(vendors).values([
            { id: vendorIds.acme, name: "Acme Corp", totalSpend: "1250000.00", riskLevel: "low" },
            { id: vendorIds.globex, name: "Globex Corporation", totalSpend: "850000.00", riskLevel: "medium" },
            { id: vendorIds.soylent, name: "Soylent Corp", totalSpend: "450000.00", riskLevel: "high" },
            { id: vendorIds.cyberdyne, name: "Cyberdyne Systems", totalSpend: "2100000.00", riskLevel: "low" },
        ]);

        // 4. Create Historical Invoices (to match against)
        const invoiceIds = {
            inv1: nanoid(),
            inv2: nanoid(),
            inv3: nanoid(),
            inv4: nanoid(),
            inv5: nanoid(),
        };

        await db.insert(invoices).values([
            { id: invoiceIds.inv1, vendorId: vendorIds.acme, invoiceNumber: "INV-2023-001", amount: "12500.00", invoiceDate: new Date("2023-12-15"), status: "paid", docId: "SAP-101" },
            { id: invoiceIds.inv2, vendorId: vendorIds.globex, invoiceNumber: "GLBX-992", amount: "4320.50", invoiceDate: new Date("2024-01-10"), status: "paid", docId: "SAP-102" },
            { id: invoiceIds.inv3, vendorId: vendorIds.soylent, invoiceNumber: "SLNT-001", amount: "8900.00", invoiceDate: new Date("2024-01-05"), status: "paid", docId: "SAP-103" },
            { id: invoiceIds.inv4, vendorId: vendorIds.cyberdyne, invoiceNumber: "CBS-440", amount: "15750.00", invoiceDate: new Date("2024-01-20"), status: "paid", docId: "SAP-104" },
            { id: invoiceIds.inv5, vendorId: vendorIds.acme, invoiceNumber: "INV-2023-005", amount: "3200.00", invoiceDate: new Date("2024-01-25"), status: "paid", docId: "SAP-105" },
        ]);

        // 5. Create Pre-Pay Cases (Open Duplicates)
        const caseIds = [nanoid(), nanoid(), nanoid(), nanoid()];

        // CASE 1: Critical - Exact Duplicate
        await db.insert(cases).values({
            id: caseIds[0],
            caseNumber: "CASE-2024-CRIT",
            status: "open",
            priority: "critical",
            assignedTo: analystId,
            totalAmount: "12500.00",
            potentialSavings: "12500.00",
            riskScore: 100,
        });

        await db.insert(invoices).values({
            caseId: caseIds[0],
            vendorId: vendorIds.acme,
            invoiceNumber: "INV-2023-001",
            amount: "12500.00",
            invoiceDate: new Date("2024-01-28"),
            status: "on-hold",
            isDuplicate: true,
            matchedInvoiceId: invoiceIds.inv1,
            signals: ["Exact Amount", "Vendor Match", "Exact Pattern"],
            similarityScore: 100,
        });

        // CASE 2: High - Fuzzy Pattern (OCR Error)
        await db.insert(cases).values({
            id: caseIds[1],
            caseNumber: "CASE-2024-OCR",
            status: "open",
            priority: "high",
            assignedTo: analystId,
            totalAmount: "8900.00",
            potentialSavings: "8900.00",
            riskScore: 92,
        });

        await db.insert(invoices).values({
            caseId: caseIds[1],
            vendorId: vendorIds.soylent,
            invoiceNumber: "SLNT-OO1", // 'O's instead of '0's
            amount: "8900.00",
            invoiceDate: new Date("2024-02-05"),
            status: "pending",
            isDuplicate: true,
            matchedInvoiceId: invoiceIds.inv3,
            signals: ["Vendor Match", "Invoice Pattern (90%)"],
            similarityScore: 92,
        });

        // CASE 3: Medium - Fuzzy Amount
        await db.insert(cases).values({
            id: caseIds[2],
            caseNumber: "CASE-2024-AMT",
            status: "open",
            priority: "medium",
            assignedTo: analystId,
            totalAmount: "3205.00",
            potentialSavings: "3205.00",
            riskScore: 65,
        });

        await db.insert(invoices).values({
            caseId: caseIds[2],
            vendorId: vendorIds.acme,
            invoiceNumber: "INV-2024-005",
            amount: "3205.00", // $5 difference from inv5
            invoiceDate: new Date("2024-02-10"),
            status: "review",
            isDuplicate: true,
            matchedInvoiceId: invoiceIds.inv5,
            signals: ["Vendor Match", "Fuzzy Amount (0.15%)"],
            similarityScore: 65,
        });

        // CASE 4: Low - Date Proximity Only
        await db.insert(cases).values({
            id: caseIds[3],
            caseNumber: "CASE-2024-DATE",
            status: "open",
            priority: "low",
            assignedTo: analystId,
            totalAmount: "15750.00",
            potentialSavings: "0.00",
            riskScore: 25,
        });

        await db.insert(invoices).values({
            caseId: caseIds[3],
            vendorId: vendorIds.cyberdyne,
            invoiceNumber: "CBS-441", // Different number
            amount: "15750.00",
            invoiceDate: new Date("2024-01-22"), // 2 days after inv4
            status: "on-hold",
            isDuplicate: false,
            matchedInvoiceId: invoiceIds.inv4,
            signals: ["Vendor Match", "Date Proximity (2 days)"],
            similarityScore: 25,
        });

        // 6. Create Recovery Items (Post-Pay)
        const recoveryId = nanoid();
        await db.insert(recoveryItems).values({
            id: recoveryId,
            invoiceId: invoiceIds.inv2,
            vendorId: vendorIds.globex,
            amount: "4320.50",
            status: "contacted",
            assignedAnalyst: analystId,
            recoveryMethod: "email",
            notes: "Double payment identified during post-pay audit.",
            initiatedDate: new Date("2024-02-15"),
        });

        await db.insert(recoveryActivities).values([
            {
                recoveryItemId: recoveryId,
                userId: analystId,
                action: "created",
                notes: "Recovery case identified via batch audit",
                timestamp: new Date("2024-02-15T09:00:00Z"),
            },
            {
                recoveryItemId: recoveryId,
                userId: analystId,
                action: "contacted",
                notes: "Sent demand letter to accounts.payable@globex.corp",
                timestamp: new Date("2024-02-16T14:30:00Z"),
            }
        ]);

        return NextResponse.json({ success: true, message: "Database seeded with rich demo data" });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database", details: error }, { status: 500 });
    }
}
