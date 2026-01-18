import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    try {
        const metrics = await storage.getDashboardMetrics();
        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard metrics' },
            { status: 500 }
        );
    }
}
