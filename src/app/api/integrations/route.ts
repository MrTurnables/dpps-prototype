import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiTokens } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const tokens = await db.select().from(apiTokens).orderBy(desc(apiTokens.createdAt));
        return NextResponse.json(tokens);
    } catch (error) {
        console.error('Failed to fetch tokens:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        // Generate simple token
        const token = `sk_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
        const maskedToken = `${token.substring(0, 5)}...${token.substring(token.length - 4)}`;

        await db.insert(apiTokens).values({
            name: name || 'Start-up Token',
            token,
            maskedToken,
            status: 'Active'
        });

        return NextResponse.json({ success: true, token, maskedToken });
    } catch (error) {
        console.error('Failed to create token:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
