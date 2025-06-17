import { NextResponse } from 'next/server';
import { updateEvent, deleteEvent } from '@/lib/data';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    updateEvent(Number(id), data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    deleteEvent(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}