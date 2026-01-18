import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertInvoiceSchema } from '@/lib/schema';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const caseId = searchParams.get('caseId');

        const invoicesData = caseId
            ? await storage.getInvoicesByCase(caseId)
            : await storage.getAllInvoices();

        return NextResponse.json(invoicesData);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = insertInvoiceSchema.parse(body);
        const newInvoice = await storage.createInvoice(validatedData);
        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json(
            { error: 'Invalid invoice data' },
            { status: 400 }
        );
    }
}
