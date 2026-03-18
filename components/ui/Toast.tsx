'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastMsg { id: number; message: string }

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message } }))
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message: e.detail.message }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
    }
    window.addEventListener('show-toast', handler as EventListener)
    return () => window.removeEventListener('show-toast', handler as EventListener)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="toast-anim pointer-events-auto flex items-center gap-3 bg-white shadow-2xl rounded-xl px-4 py-3 border-l-4 border-green-500 min-w-[260px]">
          <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800 flex-1">{t.message}</span>
          <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-gray-300 hover:text-gray-500"><X size={14} /></button>
        </div>
      ))}
    </div>
  )
}
