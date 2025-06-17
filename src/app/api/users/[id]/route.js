import { NextResponse } from 'next/server';
import { updateUser, deleteUser } from '@/lib/data';

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  await updateUser(Number(id), data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  deleteUser(Number(id));
  return NextResponse.json({ success: true });
}