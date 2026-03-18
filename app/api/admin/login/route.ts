import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ilkon2024'

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set({
      name: 'admin-key',
      value: 'logged-in',
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
