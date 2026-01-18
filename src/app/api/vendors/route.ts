import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertVendorSchema } from '@/lib/schema';

export async function GET() {
    try {
        const vendorsData = await storage.getAllVendors();
        return NextResponse.json(vendorsData);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return NextResponse.json(
            { error: 'Failed to fetch vendors' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = insertVendorSchema.parse(body);
        const newVendor = await storage.createVendor(validatedData);
        return NextResponse.json(newVendor, { status: 201 });
    } catch (error) {
        console.error('Error creating vendor:', error);
        return NextResponse.json(
            { error: 'Invalid vendor data' },
            { status: 400 }
        );
    }
}
