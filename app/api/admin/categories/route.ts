import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const r = await sql`SELECT c.*, pc.name as parent_name FROM categories c LEFT JOIN categories pc ON c.parent_id=pc.id ORDER BY c.parent_id NULLS FIRST, c.name`
    return NextResponse.json({ categories: r.rows })
  } catch { return NextResponse.json({ error: 'Hata' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { name, slug, parent_id } = await req.json()
    if (!name || !slug) return NextResponse.json({ error: 'Ad ve slug zorunlu' }, { status: 400 })
    const r = await sql`INSERT INTO categories (name,slug,parent_id) VALUES (${name},${slug},${parent_id||null}) RETURNING *`
    return NextResponse.json({ category: r.rows[0] }, { status: 201 })
  } catch (e: any) {
    if (e.message?.includes('unique')) return NextResponse.json({ error: 'Slug zaten mevcut' }, { status: 409 })
    return NextResponse.json({ error: 'Eklenemedi' }, { status: 500 })
  }
}
