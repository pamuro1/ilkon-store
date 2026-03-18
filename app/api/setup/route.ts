import { NextResponse } from 'next/server'
import { setupDatabase } from '@/lib/db'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    await setupDatabase()

    // Colors kolonu migration
    try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT DEFAULT ''` } catch {}


    // Varsayılan kategorileri ekle
    const defaultCategories = [
      // Ana kategoriler
      { name: 'Ev Temizliği', slug: 'ev-temizligi', parent: null },
      { name: 'Mutfak Aletleri', slug: 'mutfak-aletleri', parent: null },
      { name: 'Elektrikli Ev Aletleri', slug: 'elektrikli-ev-aletleri', parent: null },
      { name: 'Beyaz Eşya', slug: 'beyaz-esya', parent: null },
    ]

    for (const cat of defaultCategories) {
      await sql`INSERT INTO categories (name, slug, parent_id) VALUES (${cat.name}, ${cat.slug}, null) ON CONFLICT (slug) DO NOTHING`
    }

    // Alt kategoriler için parent ID'leri al
    const parents = await sql`SELECT id, slug FROM categories WHERE parent_id IS NULL`
    const parentMap: Record<string, number> = {}
    for (const p of parents.rows) {
      parentMap[p.slug] = p.id
    }

    const subCategories = [
      // Ev Temizliği
      { name: 'Toz Torbasız Süpürge', slug: 'toz-torbasiz-supurge', parent: 'ev-temizligi' },
      { name: 'Dik Süpürge', slug: 'dik-supurge', parent: 'ev-temizligi' },
      { name: 'Toz Torbalı Süpürge', slug: 'toz-torbali-supurge', parent: 'ev-temizligi' },
      { name: 'Islak/Kuru Süpürge', slug: 'islak-kuru-supurge', parent: 'ev-temizligi' },
      { name: 'Robot Süpürge', slug: 'robot-supurge', parent: 'ev-temizligi' },
      { name: 'Buharlı Temizleyici', slug: 'buharli-temizleyici', parent: 'ev-temizligi' },
      { name: 'Halı Yıkama', slug: 'hali-yikama', parent: 'ev-temizligi' },
      // Mutfak - Gıda Hazırlama
      { name: 'Blender Seti', slug: 'blender-seti', parent: 'mutfak-aletleri' },
      { name: 'Kişisel Blender', slug: 'kisisel-blender', parent: 'mutfak-aletleri' },
      { name: 'Mikser', slug: 'mikser', parent: 'mutfak-aletleri' },
      { name: 'Mutfak Robotu', slug: 'mutfak-robotu', parent: 'mutfak-aletleri' },
      { name: 'Tost Makinesi', slug: 'tost-makinesi', parent: 'mutfak-aletleri' },
      { name: 'Doğrayıcı', slug: 'dograyici', parent: 'mutfak-aletleri' },
      // Mutfak - İçecek
      { name: 'Çay Makinesi', slug: 'cay-makinesi', parent: 'mutfak-aletleri' },
      { name: 'Su Isıtıcı (Kettle)', slug: 'su-isitici', parent: 'mutfak-aletleri' },
      { name: 'Kahve Makinesi', slug: 'kahve-makinesi', parent: 'mutfak-aletleri' },
      { name: 'Espresso Makinesi', slug: 'espresso-makinesi', parent: 'mutfak-aletleri' },
      // Mutfak - Pişirme
      { name: 'Air Fryer', slug: 'air-fryer', parent: 'mutfak-aletleri' },
      { name: 'Mini Fırın', slug: 'mini-firin', parent: 'mutfak-aletleri' },
      { name: 'Waffle Makinesi', slug: 'waffle-makinesi', parent: 'mutfak-aletleri' },
      // Elektrikli Aletler
      { name: 'Ütü', slug: 'utu', parent: 'elektrikli-ev-aletleri' },
      { name: 'Ütü Masası', slug: 'utu-masasi', parent: 'elektrikli-ev-aletleri' },
      { name: 'Buharlı Ütü', slug: 'buharli-utu', parent: 'elektrikli-ev-aletleri' },
      { name: 'Saç Kurutma', slug: 'sac-kurutma', parent: 'elektrikli-ev-aletleri' },
      { name: 'Saç Düzleştirici', slug: 'sac-duzlestirici', parent: 'elektrikli-ev-aletleri' },
      { name: 'Epilasyon', slug: 'epilasyon', parent: 'elektrikli-ev-aletleri' },
      { name: 'Tıraş Makinesi', slug: 'tiras-makinesi', parent: 'elektrikli-ev-aletleri' },
      { name: 'Banyo Baskülü', slug: 'banyo-baskulu', parent: 'elektrikli-ev-aletleri' },
      { name: 'Vantilatör', slug: 'vantilator', parent: 'elektrikli-ev-aletleri' },
      // Beyaz Eşya
      { name: 'Çamaşır Makinesi', slug: 'camasir-makinesi', parent: 'beyaz-esya' },
      { name: 'Kurutma Makinesi', slug: 'kurutma-makinesi', parent: 'beyaz-esya' },
      { name: 'Bulaşık Makinesi', slug: 'bulasik-makinesi', parent: 'beyaz-esya' },
      { name: 'Buzdolabı', slug: 'buzdolabi', parent: 'beyaz-esya' },
      { name: 'Derin Dondurucu', slug: 'derin-dondurucu', parent: 'beyaz-esya' },
    ]

    for (const sub of subCategories) {
      const parentId = parentMap[sub.parent]
      if (parentId) {
        await sql`INSERT INTO categories (name, slug, parent_id) VALUES (${sub.name}, ${sub.slug}, ${parentId}) ON CONFLICT (slug) DO NOTHING`
      }
    }

    return NextResponse.json({ success: true, message: 'Veritabanı ve kategoriler kuruldu!' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
