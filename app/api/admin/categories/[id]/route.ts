import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, slug, parent_id } = await req.json()
    const r = await sql`UPDATE categories SET name=${name},slug=${slug},parent_id=${parent_id||null} WHERE id=${parseInt(params.id)} RETURNING *`
    return NextResponse.json({ category: r.rows[0] })
  } catch { return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM categories WHERE id=${parseInt(params.id)}`
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Silinemedi' }, { status: 500 }) }
}
