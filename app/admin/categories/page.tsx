'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react'

interface Cat { id: number; name: string; slug: string; parent_id: number | null }
const EMPTY = { name: '', slug: '', parent_id: '' }

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const fetchCats = async () => {
    try {
      const r = await fetch('/api/admin/categories')
      const d = await r.json()
      setCats(d.categories || [])
    } catch {}
    setLoading(false)
  }
  useEffect(() => { fetchCats() }, [])

  const handleName = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').trim()
    setForm(p => ({ ...p, name, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories'
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, parent_id: form.parent_id ? parseInt(form.parent_id) : null }),
      })
      if (res.ok) { setShowForm(false); setEditId(null); setForm(EMPTY); fetchCats() }
      else { const d = await res.json(); alert(d.error || 'Hata') }
    } catch {}
    setSaving(false)
  }

  const handleEdit = (c: Cat) => {
    setForm({ name: c.name, slug: c.slug, parent_id: c.parent_id?.toString() || '' })
    setEditId(c.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" silinsin mi?`)) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    fetchCats()
  }

  // Hızlı ekle: formu belirli parent ile aç
  const quickAdd = (parentId: string) => {
    setForm({ ...EMPTY, parent_id: parentId })
    setEditId(null); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const l1 = cats.filter(c => !c.parent_id)
  const l1ids = new Set(l1.map(c => c.id))
  const l2 = cats.filter(c => c.parent_id && l1ids.has(c.parent_id!))
  const l2ids = new Set(l2.map(c => c.id))
  const l3 = cats.filter(c => c.parent_id && l2ids.has(c.parent_id!))

  const getTypeInfo = () => {
    if (!form.parent_id) return { text: 'Ana Kategori — menüde üst başlık olur', color: 'bg-blue-50 text-blue-700' }
    const pid = parseInt(form.parent_id)
    if (l1ids.has(pid)) return { text: 'Grup Başlığı — dropdown\'da kalın başlık olur', color: 'bg-orange-50 text-orange-700' }
    if (l2ids.has(pid)) return { text: 'Alt Kategori — tıklanabilir link olur', color: 'bg-green-50 text-green-700' }
    return { text: '', color: '' }
  }
  const typeInfo = getTypeInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-green-200 hover:text-white"><ArrowLeft size={20}/></Link>
        <h1 className="font-black text-xl">Kategori Yönetimi</h1>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true) }}
          className="ml-auto flex items-center gap-2 bg-white text-green-700 font-bold px-4 py-2 rounded-xl hover:bg-green-50 text-sm">
          <Plus size={16}/> Yeni Kategori
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h2 className="font-black text-gray-800 mb-4">{editId ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori Adı *</label>
                <input value={form.name} onChange={e => handleName(e.target.value)} placeholder="Örn: Klima" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Slug *</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="klima" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm font-mono"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nereye eklenecek?</label>
                <select value={form.parent_id} onChange={e => setForm({...form, parent_id: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm bg-white">
                  <option value="">— Üst kategori yok (Ana Kategori olur) —</option>
                  <optgroup label="Ana Kategoriler altına (Grup başlığı olur)">
                    {l1.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                  <optgroup label="Grup Başlıkları altına (Alt kategori / link olur)">
                    {l2.map(c => {
                      const parent = l1.find(p => p.id === c.parent_id)
                      return <option key={c.id} value={c.id}>{parent?.name} › {c.name}</option>
                    })}
                  </optgroup>
                </select>
                {typeInfo.text && (
                  <p className={`mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg inline-block ${typeInfo.color}`}>
                    ✓ {typeInfo.text}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-60">
                  {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Kaydet
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); setEditId(null) }}
                  className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl">
                  <X size={16}/> İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12"><Loader2 size={32} className="animate-spin text-green-500 mx-auto"/></div>
        ) : (
          <div className="space-y-3">
            {l1.map(cat => {
              const groups = l2.filter(g => g.parent_id === cat.id)
              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* ANA KATEGORİ */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                      <p className="font-black text-gray-800">{cat.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">/{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => quickAdd(cat.id.toString())}
                        className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-orange-50 border border-orange-200 transition-colors">
                        <Plus size={12}/> Grup Ekle
                      </button>
                      <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                    </div>
                  </div>

                  {/* GRUPLAR */}
                  {groups.map(grp => {
                    const subs = l3.filter(s => s.parent_id === grp.id)
                    return (
                      <div key={grp.id} className="border-b border-gray-50 last:border-0">
                        <div className="flex items-center justify-between px-5 py-3 bg-orange-50/30">
                          <div className="flex items-center gap-2 ml-4">
                            <div className="w-0.5 h-4 bg-orange-400 rounded-full"/>
                            <div>
                              <p className="font-bold text-orange-700 text-sm">{grp.name}</p>
                              <p className="text-xs text-gray-400 font-mono">/{grp.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => quickAdd(grp.id.toString())}
                              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-green-50 border border-green-200 transition-colors">
                              <Plus size={12}/> Alt Ekle
                            </button>
                            <button onClick={() => handleEdit(grp)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={13}/></button>
                            <button onClick={() => handleDelete(grp.id, grp.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13}/></button>
                          </div>
                        </div>

                        {/* ALT KATEGORİLER */}
                        {subs.map(sub => (
                          <div key={sub.id} className="flex items-center justify-between px-5 py-2.5 border-t border-gray-50">
                            <div className="flex items-center gap-2 ml-10">
                              <span className="text-gray-300">→</span>
                              <div>
                                <p className="text-sm text-gray-600">{sub.name}</p>
                                <p className="text-xs text-gray-400 font-mono">/{sub.slug}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(sub)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={12}/></button>
                              <button onClick={() => handleDelete(sub.id, sub.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={12}/></button>
                            </div>
                          </div>
                        ))}
                        {subs.length === 0 && (
                          <p className="text-xs text-gray-400 ml-14 py-2 italic">Alt kategori yok</p>
                        )}
                      </div>
                    )
                  })}
                  {groups.length === 0 && (
                    <p className="text-xs text-gray-400 px-5 py-3 italic">
                      Grup yok — <button onClick={() => quickAdd(cat.id.toString())} className="text-orange-500 font-semibold hover:underline">Grup Ekle</button>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
