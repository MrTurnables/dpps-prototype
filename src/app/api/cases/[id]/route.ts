import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invoices, vendors } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/cases/[id]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;

        // Fetch invoice details
        const result = await db
            .select({
                invoice: invoices,
                vendor: vendors,
            })
            .from(invoices)
            .leftJoin(vendors, eq(invoices.vendorId, vendors.id))
            .where(eq(invoices.id, id))
            .limit(1);

        if (result.length === 0) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }

        const { invoice, vendor } = result[0];

        // Build response 
        const caseDetail = {
            id: invoice.id,
            caseNumber: `CASE-${invoice.invoiceNumber}`,
            status: invoice.status === 'held' ? 'Open' : (invoice.status === 'paid' ? 'Closed' : invoice.status),
            riskScore: invoice.similarityScore || 0,
            primaryInvoice: {
                vendorName: vendor?.name || 'Unknown Vendor',
                vendorId: invoice.vendorId,
                invoiceNumber: invoice.invoiceNumber,
                currency: 'USD',
                amount: Number(invoice.amount),
                invoiceDate: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : '',
                sourceSystem: 'Oracle',
            },
            auditTrail: [
                { action: 'Case Created', date: invoice.createdAt ? new Date(invoice.createdAt).toISOString().split('T')[0] : '', user: 'System' }
            ],
            candidates: [] // TODO: fetch matched candidates
        };

        return NextResponse.json(caseDetail);

    } catch (error) {
        console.error('Failed to fetch case detail:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
