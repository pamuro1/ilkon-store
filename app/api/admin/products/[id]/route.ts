import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { barcode, name, image_url, description, price, category_id, is_popular, is_new, colors } = await req.json()
    const r = await sql`
      UPDATE products SET 
        barcode=${barcode||null}, name=${name}, image_url=${image_url||null},
        description=${description||null}, price=${price}, category_id=${category_id||null},
        is_popular=${is_popular||false}, is_new=${is_new??true}, colors=${colors||''}
      WHERE id=${parseInt(params.id)} RETURNING *`
    if (!r.rows[0]) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    revalidatePath('/')
    revalidatePath('/kategori/[slug]', 'page')
    return NextResponse.json({ product: r.rows[0] })
  } catch (e: any) { 
    return NextResponse.json({ error: 'Güncelleme başarısız: ' + e.message }, { status: 500 }) 
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM products WHERE id=${parseInt(params.id)}`
    revalidatePath('/')
    revalidatePath('/kategori/[slug]', 'page')
    return NextResponse.json({ success: true })
  } catch (e: any) { 
    return NextResponse.json({ error: 'Silinemedi: ' + e.message }, { status: 500 }) 
  }
}
