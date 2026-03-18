import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'Blob token bulunamadı. Vercel Storage > Blob ayarlarını kontrol edin.' }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece JPG, PNG, WebP desteklenir' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya 5MB'dan küçük olmalı" }, { status: 400 })
    }

    const filename = `ilkon/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Dosyayı ArrayBuffer olarak oku
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Vercel Blob REST API'yi doğrudan çağır
    const response = await fetch(`https://blob.vercel-storage.com/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type,
        'x-api-version': '7',
      },
      body: buffer,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Blob API error:', errorText)
      return NextResponse.json({ error: 'Görsel yüklenemedi: ' + errorText }, { status: 500 })
    }

    const result = await response.json()
    return NextResponse.json({ url: result.url })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Sunucu hatası: ' + (error?.message || 'Bilinmeyen hata') }, { status: 500 })
  }
}
