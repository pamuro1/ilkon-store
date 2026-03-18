import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const r = await sql`SELECT * FROM sliders ORDER BY order_index ASC`
    return NextResponse.json({ sliders: r.rows })
  } catch { return NextResponse.json({ error: 'Hata' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { image_url, title, subtitle, link, order_index, is_active } = await req.json()
    const r = await sql`
      INSERT INTO sliders (image_url, title, subtitle, link, order_index, is_active) 
      VALUES (${image_url}, ${title||''}, ${subtitle||''}, ${link||''}, ${order_index||0}, ${is_active??true}) 
      RETURNING *`
    revalidatePath('/')
    return NextResponse.json({ slider: r.rows[0] }, { status: 201 })
  } catch (e: any) { 
    return NextResponse.json({ error: 'Eklenemedi: ' + e.message }, { status: 500 }) 
  }
}
