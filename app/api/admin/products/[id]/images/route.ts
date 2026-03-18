import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const r = await sql`SELECT * FROM product_images WHERE product_id=${parseInt(params.id)} ORDER BY order_index ASC`
    return NextResponse.json({ images: r.rows })
  } catch { return NextResponse.json({ error: 'Hata' }, { status: 500 }) }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { image_url, order_index } = await req.json()
    const r = await sql`INSERT INTO product_images (product_id, image_url, order_index) VALUES (${parseInt(params.id)}, ${image_url}, ${order_index || 0}) RETURNING *`
    return NextResponse.json({ image: r.rows[0] }, { status: 201 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { image_id } = await req.json()
    await sql`DELETE FROM product_images WHERE id=${image_id} AND product_id=${parseInt(params.id)}`
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
