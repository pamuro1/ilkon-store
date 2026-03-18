import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Login sayfası herkese açık
  if (pathname === '/admin/login') return NextResponse.next()

  // /admin → dashboard'a yönlendir
  if (pathname === '/admin') {
    const key = req.cookies.get('admin-key')?.value
    if (key) return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Admin sayfalarını koru
  if (pathname.startsWith('/admin/')) {
    const key = req.cookies.get('admin-key')?.value
    if (!key) return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
