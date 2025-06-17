import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/lib/data';

export async function POST(request) {
    const { email, password } = await request.json();

    // console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
        // console.log('Email atau Password Salah');
        return NextResponse.json({ success: false, message: 'Email atau Password Harus Di isi' }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
        // console.log(`User Tidak Ada: ${email}`);
        return NextResponse.json({ success: false, message: 'User Tidak Ada' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        // console.log(`Password salah dengan User: ${email}`);
        return NextResponse.json({ success: false, message: 'Password Salah' }, { status: 401 });
    }

    // console.log(`Login successful for user: ${email}`);
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}