import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recoveryItems, recoveryActivities } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const item = await db.query.recoveryItems.findFirst({
            where: eq(recoveryItems.id, id),
            with: {
                vendor: true,
                invoice: true,
                analyst: true, // Assuming analyst relation exists
            },
        });

        if (!item) {
            return NextResponse.json({ error: "Recovery item not found" }, { status: 404 });
        }

        const activities = await db.query.recoveryActivities.findMany({
            where: eq(recoveryActivities.recoveryItemId, id),
            orderBy: [desc(recoveryActivities.timestamp)],
            with: {
                user: true
            }
        });

        return NextResponse.json({ ...item, activities });
    } catch (error) {
        console.error("Error fetching recovery item:", error);
        return NextResponse.json(
            { error: "Failed to fetch recovery item" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Update recovery item
        const updatedItem = await db.update(recoveryItems)
            .set({
                status: body.status,
                notes: body.notes,
                resolvedDate: body.status === 'recovered' || body.status === 'written_off' ? new Date() : undefined,
            })
            .where(eq(recoveryItems.id, id))
            .returning();

        if (!updatedItem.length) {
            return NextResponse.json({ error: "Recovery item not found" }, { status: 404 });
        }

        // Log activity
        if (body.action) {
            await db.insert(recoveryActivities).values({
                recoveryItemId: id,
                action: body.action,
                notes: body.activityNotes || `Status updated to ${body.status}`,
                userId: body.userId,
            });
        }

        return NextResponse.json(updatedItem[0]);
    } catch (error) {
        console.error("Error updating recovery item:", error);
        return NextResponse.json(
            { error: "Failed to update recovery item" },
            { status: 500 }
        );
    }
}
