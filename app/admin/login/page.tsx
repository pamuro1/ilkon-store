'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Lock, User, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        window.location.href = '/admin/dashboard'
      } else {
        setError(data.error || 'Giriş başarısız')
      }
    } catch {
      setError('Bağlantı hatası')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="İlkon Home Store" width={200} height={93} className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-800">Admin Paneli</h1>
          <p className="text-gray-500 text-sm mt-1">Giriş yapın, yönetmeye başlayın</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Kullanıcı Adı</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="admin" required
                className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Şifre</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full pl-9 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-sm">
            {loading
              ? <span className="flex items-center justify-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Giriş yapılıyor...</span>
              : 'Giriş Yap'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">İlkon Home Store © 2026 · Admin Paneli</p>
      </div>
    </div>
  )
}
