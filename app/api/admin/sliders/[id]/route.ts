import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const cur = await sql`SELECT * FROM sliders WHERE id=${parseInt(params.id)}`
    if (!cur.rows[0]) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    const s = cur.rows[0]
    const r = await sql`
      UPDATE sliders SET 
        image_url=${body.image_url??s.image_url}, title=${body.title??s.title},
        subtitle=${body.subtitle??s.subtitle}, link=${body.link??s.link},
        order_index=${body.order_index??s.order_index}, is_active=${body.is_active??s.is_active}
      WHERE id=${parseInt(params.id)} RETURNING *`
    revalidatePath('/')
    return NextResponse.json({ slider: r.rows[0] })
  } catch (e: any) { 
    return NextResponse.json({ error: 'Güncelleme başarısız: ' + e.message }, { status: 500 }) 
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM sliders WHERE id=${parseInt(params.id)}`
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (e: any) { 
    return NextResponse.json({ error: 'Silinemedi: ' + e.message }, { status: 500 }) 
  }
}
