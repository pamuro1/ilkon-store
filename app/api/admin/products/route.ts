import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const r = await sql`
      SELECT p.*, c.name as category_name, pc.name as parent_category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id=c.id 
      LEFT JOIN categories pc ON c.parent_id=pc.id 
      ORDER BY p.created_at DESC`
    return NextResponse.json({ products: r.rows })
  } catch { return NextResponse.json({ error: 'Hata' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { barcode, name, image_url, description, price, category_id, is_popular, is_new, colors } = await req.json()
    if (!name || !price) return NextResponse.json({ error: 'Ad ve fiyat zorunlu' }, { status: 400 })
    
    const r = await sql`
      INSERT INTO products (barcode, name, image_url, description, price, category_id, is_popular, is_new) 
      VALUES (${barcode||null}, ${name}, ${image_url||null}, ${description||null}, ${price}, ${category_id||null}, ${is_popular||false}, ${is_new??true}) 
      RETURNING *`
    
    // Ana sayfayı ve kategori sayfasını yenile
    revalidatePath('/')
    revalidatePath('/kategori/[slug]', 'page')
    
    return NextResponse.json({ product: r.rows[0] }, { status: 201 })
  } catch (e: any) {
    if (e.message?.includes('unique')) return NextResponse.json({ error: 'Barkod zaten mevcut' }, { status: 409 })
    return NextResponse.json({ error: 'Eklenemedi: ' + e.message }, { status: 500 })
  }
}
