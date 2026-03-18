'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import ImageUploader from '@/components/ui/ImageUploader'

interface Slider {
  id: number
  image_url: string
  title: string
  subtitle: string
  link: string
  order_index: number
  is_active: boolean
}

const EMPTY = { image_url: '', title: '', subtitle: '', link: '', order_index: 0, is_active: true }

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const fetchSliders = async () => {
    try {
      const r = await fetch('/api/admin/sliders')
      const d = await r.json()
      setSliders(d.sliders || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchSliders() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image_url) { alert('Lütfen bir görsel yükleyin veya URL girin'); return }
    setSaving(true)
    try {
      const url = editId ? `/api/admin/sliders/${editId}` : '/api/admin/sliders'
      const method = editId ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setShowForm(false)
      setEditId(null)
      setForm(EMPTY)
      fetchSliders()
    } catch {}
    setSaving(false)
  }

  const handleEdit = (s: Slider) => {
    setForm({ image_url: s.image_url, title: s.title, subtitle: s.subtitle, link: s.link, order_index: s.order_index, is_active: s.is_active })
    setEditId(s.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu slideri silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' })
    fetchSliders()
  }

  const handleToggle = async (id: number, is_active: boolean) => {
    await fetch(`/api/admin/sliders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !is_active }),
    })
    fetchSliders()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-green-200 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-black text-xl">Slider Yönetimi</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY) }}
          className="ml-auto flex items-center gap-2 bg-white text-green-700 font-bold px-4 py-2 rounded-xl hover:bg-green-50 text-sm transition-colors"
        >
          <Plus size={16} /> Yeni Slider
        </button>
      </header>

      {/* Slider boyut rehberi */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">📐</span>
          <div>
            <p className="font-bold text-blue-800 text-sm mb-1">Slider Görsel Boyutları</p>
            <p className="text-blue-600 text-xs">Önerilen boyut: <strong>1920 x 600 piksel</strong> (JPG/PNG) · Maksimum 5MB</p>
            <p className="text-blue-500 text-xs mt-0.5">Minimum: 1200 x 400 · Format: Yatay/Landscape · Çözünürlük: 72-150 DPI</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h2 className="font-black text-gray-800 text-lg mb-5">
              {editId ? '✏️ Slider Düzenle' : '➕ Yeni Slider Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Görsel yükleme */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Görsel *</label>
                <ImageUploader
                  value={form.image_url}
                  onChange={url => setForm({ ...form, image_url: url })}
                  label="Önerilen boyut: 1920 x 600 piksel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Başlık</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Kampanya Başlığı"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Link (tıklanınca gidilecek sayfa)</label>
                  <input
                    value={form.link}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    placeholder="/kategori/kampanya"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Alt Başlık</label>
                <input
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Kampanya açıklaması"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Sıralama (küçük = öne çıkar)</label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm"
                  />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer pt-5">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="text-sm font-semibold text-gray-700">Aktif (sitede göster)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY) }}
                  className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl hover:border-gray-300 transition-colors"
                >
                  <X size={16} /> İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Slider listesi */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={32} className="animate-spin text-green-500 mx-auto" />
          </div>
        ) : sliders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-4xl mb-3">🖼️</p>
            <p className="text-gray-500 font-semibold mb-3">Henüz slider eklenmemiş</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-700 text-sm transition-colors"
            >
              <Plus size={16} /> İlk Slideri Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sliders.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  {s.image_url && (
                    <Image src={s.image_url} alt={s.title || ''} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800">{s.title || 'Başlıksız Slider'}</p>
                  {s.subtitle && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{s.subtitle}</p>}
                  {s.link && <p className="text-green-600 text-xs mt-0.5">→ {s.link}</p>}
                  <p className="text-gray-400 text-xs mt-1">Sıra: {s.order_index}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(s.id, s.is_active)}
                    title={s.is_active ? 'Pasife al' : 'Aktife al'}
                    className={`transition-colors ${s.is_active ? 'text-green-500 hover:text-green-700' : 'text-gray-300 hover:text-gray-500'}`}
                  >
                    {s.is_active ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
                  </button>
                  <button
                    onClick={() => handleEdit(s)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
