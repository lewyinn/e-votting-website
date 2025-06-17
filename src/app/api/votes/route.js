import { NextResponse } from 'next/server';
import { addVote, getVotes, getVotesByEvent } from '@/lib/data';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    if (eventId) {
        const votes = getVotesByEvent(Number(eventId));
        return NextResponse.json(votes);
    }
    const votes = getVotes();
    return NextResponse.json(votes);
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newVote = addVote(data);
        return NextResponse.json(newVote);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}