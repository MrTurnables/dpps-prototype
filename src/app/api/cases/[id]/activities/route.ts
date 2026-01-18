import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertCaseActivitySchema } from '@/lib/schema';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const activities = await storage.getCaseActivities(id);
        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching case activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const activityData = {
            ...body,
            caseId: id
        };
        const validatedData = insertCaseActivitySchema.parse(activityData);
        const activity = await storage.createCaseActivity(validatedData);
        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error('Error creating case activity:', error);
        return NextResponse.json(
            { error: 'Invalid activity data' },
            { status: 400 }
        );
    }
}
