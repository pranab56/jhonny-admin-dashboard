import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token =
        request.cookies.get('JhonnyAdmin')?.value

    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname.startsWith('/auth');

    if (!isAuthRoute) {
        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('reason', 'expired');
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons|site.webmanifest).*)'],
};
