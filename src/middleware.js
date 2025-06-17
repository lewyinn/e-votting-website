import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('session')?.value;

    console.log(`Middleware: Accessing ${pathname}, session: ${session}`);

    // Rute yang diizinkan tanpa login
    const publicRoutes = ['/', '/daftar'];
    if (publicRoutes.includes(pathname)) {
        // Jika sudah login (user/admin), redirect ke rute yang sesuai
        if (session) {
            const user = JSON.parse(session);
            const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : '/voting';
            console.log(`Middleware: Redirecting logged-in user to ${redirectUrl}`);
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        return NextResponse.next();
    }

    // Jika belum login, redirect ke login untuk rute selain public
    if (!session) {
        console.log(`Middleware: No session, redirecting to / for ${pathname}`);
        return NextResponse.redirect(new URL('/', request.url));
    }

    const user = JSON.parse(session);
    const role = user.role;

    // User hanya boleh akses /voting
    if (role === 'user' && pathname !== '/voting') {
        console.log(`Middleware: User role detected, redirecting to /voting from ${pathname}`);
        return NextResponse.redirect(new URL('/voting', request.url));
    }

    // Admin bisa akses semua rute
    if (role === 'admin') {
        console.log(`Middleware: Admin role detected, allowing access to ${pathname}`);
        return NextResponse.next();
    }

    // Default: izinkan akses
    console.log(`Middleware: Allowing access to ${pathname} for role ${role}`);
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.well-known/*).*)'],
};