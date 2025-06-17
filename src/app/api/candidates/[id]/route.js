import { NextResponse } from 'next/server';
import { updateCandidate, deleteCandidate } from '@/lib/data';

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  updateCandidate(Number(id), data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  deleteCandidate(Number(id));
  return NextResponse.json({ success: true });
}