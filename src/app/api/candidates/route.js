import { NextResponse } from 'next/server';
import { addCandidate, getCandidates } from '@/lib/data';

export async function GET() {
    const candidates = getCandidates();
    return NextResponse.json(candidates);
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newCandidate = addCandidate(data);
        return NextResponse.json(newCandidate);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}