import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertCaseSchema } from '@/lib/schema';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const casesData = status
            ? await storage.getCasesByStatus(status)
            : await storage.getAllCases();

        return NextResponse.json(casesData);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cases' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = insertCaseSchema.parse(body);
        const newCase = await storage.createCase(validatedData);
        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        console.error('Error creating case:', error);
        return NextResponse.json(
            { error: 'Invalid case data' },
            { status: 400 }
        );
    }
}
