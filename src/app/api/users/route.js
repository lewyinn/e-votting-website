import { NextResponse } from 'next/server';
import { addUser, getUsers } from '@/lib/data';

export async function GET() {
  const users = getUsers();
  return NextResponse.json(users);
}

export async function POST(request) {
  const data = await request.json();
  const newUser = await addUser(data);
  return NextResponse.json(newUser);
}