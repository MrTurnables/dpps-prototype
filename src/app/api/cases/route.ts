import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invoices, vendors } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Query DB for potential duplicates
        // In a real scenario, "cases" might be a separate table, but here we treat duplicate invoices as cases.
        const results = await db
            .select({
                invoice: invoices,
                vendor: vendors,
            })
            .from(invoices)
            .leftJoin(vendors, eq(invoices.vendorId, vendors.id))
            .where(and(eq(invoices.isDuplicate, true)))
            .orderBy(desc(invoices.createdAt));

        // Transform DB results to Case shape Expected by Frontend
        const cases = results.map(({ invoice, vendor }) => ({
            id: invoice.id,
            caseNumber: `CASE-${invoice.invoiceNumber}`, // distinct ID for UI
            primaryInvoice: {
                vendorName: vendor?.name || 'Unknown Vendor',
                vendorId: invoice.vendorId,
                invoiceNumber: invoice.invoiceNumber,
                currency: 'USD', // Default for now
                amount: Number(invoice.amount),
                invoiceDate: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : '',
                sourceSystem: 'Oracle',
            },
            riskScore: invoice.similarityScore || 0,
            status: invoice.status === 'held' ? 'Open' : (invoice.status === 'paid' ? 'Closed' : invoice.status),
            auditTrail: [
                { action: 'Case Created', date: invoice.createdAt ? new Date(invoice.createdAt).toISOString().split('T')[0] : '', user: 'System' }
            ],
            candidates: [] // Populating candidates would require a more complex query joining matched invoice
        }));

        return NextResponse.json(cases);
    } catch (error) {
        console.error('Failed to fetch cases:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
