import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invoices, caseActivities } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// POST /api/cases/[id]/action
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const body = await request.json();
        const { action } = body;

        if (!action || !['confirm', 'release'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Update Invoice Status
        const newStatus = action === 'confirm' ? 'held' : 'paid';
        // 'held' = confirm duplicate (block payment)
        // 'paid' = release payment (allow it)

        await db.update(invoices)
            .set({ status: newStatus })
            .where(eq(invoices.id, id));

        // Log Activity
        // In a real app, we would get the user ID from session. Here we mock 'system'.
        // We first need to find the caseId associated with this invoice to log activity properly
        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, id),
            with: { case: true }
        });

        if (invoice?.caseId) {
            await db.insert(caseActivities).values({
                caseId: invoice.caseId,
                action: action === 'confirm' ? 'Duplicate Confirmed' : 'Payment Released',
                notes: `Action triggering status change to ${newStatus}`,
                // userId: '...', 
            });
        }

        return NextResponse.json({ success: true, status: newStatus });

    } catch (error) {
        console.error('Failed to process action:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
