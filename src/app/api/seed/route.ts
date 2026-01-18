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
        };

        await db.insert(invoices).values([
            {
                id: invoiceIds.inv1,
                vendorId: vendorIds.acme,
                invoiceNumber: "INV-2023-001",
                amount: "12500.00",
                invoiceDate: new Date("2023-12-15"),
                status: "paid",
                docId: "SAP-1001",
            },
            {
                id: invoiceIds.inv2,
                vendorId: vendorIds.globex,
                invoiceNumber: "GLBX-992",
                amount: "4320.50",
                invoiceDate: new Date("2024-01-10"),
                status: "paid",
                docId: "SAP-1002",
            },
        ]);

        // 5. Create Pre-Pay Cases (Open Duplicates)
        const caseId1 = nanoid();
        await db.insert(cases).values({
            id: caseId1,
            caseNumber: "CASE-2024-001",
            status: "open",
            priority: "high",
            assignedTo: analystId,
            totalAmount: "12500.00",
            potentialSavings: "12500.00",
            riskScore: 98,
        });

        // Associated duplicate invoice for the case
        await db.insert(invoices).values({
            caseId: caseId1,
            vendorId: vendorIds.acme,
            invoiceNumber: "INV-2023-001-A", // Duplicate
            amount: "12500.00",
            invoiceDate: new Date("2024-01-20"),
            status: "pending",
            similarityScore: 98,
            isDuplicate: true,
            matchedInvoiceId: invoiceIds.inv1,
            signals: ["Exact Amount", "Vendor Match", "Invoice Pattern"],
        });

        // 6. Create Recovery Items (Post-Pay)
        const recoveryId = nanoid();
        await db.insert(recoveryItems).values({
            id: recoveryId,
            invoiceId: invoiceIds.inv2, // Linking to the paid Globex invoice as if it was a dupe
            vendorId: vendorIds.globex,
            amount: "4320.50",
            status: "contacted",
            assignedAnalyst: analystId,
            recoveryMethod: "email",
            notes: "Vendor contacted regarding double payment in Q4.",
            initiatedDate: new Date("2024-02-01"),
        });

        await db.insert(recoveryActivities).values({
            recoveryItemId: recoveryId,
            userId: analystId,
            action: "contacted",
            notes: "Sent initial recovery email to billing@globex.com",
            timestamp: new Date("2024-02-01T10:00:00Z"),
        });

        return NextResponse.json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database", details: error }, { status: 500 });
    }
}
