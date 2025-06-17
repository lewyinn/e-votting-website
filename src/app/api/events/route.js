import { NextResponse } from 'next/server';
import { addEvent, getEvents } from '@/lib/data';

export async function GET() {
    const events = getEvents();
    return NextResponse.json(events);
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newEvent = addEvent(data);
        return NextResponse.json(newEvent);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}