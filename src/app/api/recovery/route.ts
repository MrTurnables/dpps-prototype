import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recoveryItems, recoveryActivities } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const items = await db.query.recoveryItems.findMany({
            with: {
                vendor: true,
                invoice: true,
            },
            orderBy: [desc(recoveryItems.initiatedDate)],
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching recovery items:", error);
        return NextResponse.json(
            { error: "Failed to fetch recovery items" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Create new recovery item
        const newItem = await db.insert(recoveryItems).values({
            invoiceId: body.invoiceId,
            vendorId: body.vendorId,
            amount: body.amount,
            status: "initiated",
            recoveryMethod: body.recoveryMethod || "email",
            notes: body.notes,
        }).returning();

        // Log activity
        await db.insert(recoveryActivities).values({
            recoveryItemId: newItem[0].id,
            action: "created",
            notes: "Recovery case initiated",
            userId: body.userId, // Optional if we have auth context
        });

        return NextResponse.json(newItem[0]);
    } catch (error) {
        console.error("Error creating recovery item:", error);
        return NextResponse.json(
            { error: "Failed to create recovery item" },
            { status: 500 }
        );
    }
}
