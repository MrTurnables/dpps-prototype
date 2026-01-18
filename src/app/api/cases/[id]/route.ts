import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const caseData = await storage.getCase(id);

        if (!caseData) {
            return NextResponse.json(
                { error: 'Case not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(caseData);
    } catch (error) {
        console.error('Error fetching case:', error);
        return NextResponse.json(
            { error: 'Failed to fetch case' },
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
        const updated = await storage.updateCase(id, body);

        if (!updated) {
            return NextResponse.json(
                { error: 'Case not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating case:', error);
        return NextResponse.json(
            { error: 'Failed to update case' },
            { status: 500 }
        );
    }
}
