import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const vendor = await storage.getVendor(id);

        if (!vendor) {
            return NextResponse.json(
                { error: 'Vendor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(vendor);
    } catch (error) {
        console.error('Error fetching vendor:', error);
        return NextResponse.json(
            { error: 'Failed to fetch vendor' },
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
        const updated = await storage.updateVendor(id, body);

        if (!updated) {
            return NextResponse.json(
                { error: 'Vendor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating vendor:', error);
        return NextResponse.json(
            { error: 'Failed to update vendor' },
            { status: 500 }
        );
    }
}
