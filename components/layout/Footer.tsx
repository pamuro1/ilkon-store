import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Image src="/images/logo.png" alt="İlkon Home Store" width={180} height={84} className="h-14 w-auto mb-4" />
            <p className="text-sm text-gray-400 leading-relaxed mb-4">Evinizi dönüştürecek en kaliteli ev aletleri ve beyaz eşyaları uygun fiyatlarla sunuyoruz.</p>
            <a href="https://instagram.com/ilkonhomestore" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
              <Instagram size={15} /> @ilkonhomestore
            </a>
          </div>
          <div>
            <h3 className="text-white font-black mb-4 text-sm uppercase tracking-wider">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              {[
                { l: 'Ev Temizliği', s: 'ev-temizligi' },
                { l: 'Mutfak Aletleri', s: 'mutfak-aletleri' },
                { l: 'Elektrikli Aletler', s: 'elektrikli-ev-aletleri' },
                { l: 'Beyaz Eşya', s: 'beyaz-esya' },
                { l: 'Çok Satanlar', s: 'cok-satanlar' },
              ].map(c => (
                <li key={c.s}><Link href={`/kategori/${c.s}`} className="hover:text-green-400 transition-colors">→ {c.l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black mb-4 text-sm uppercase tracking-wider">Hızlı Erişim</h3>
            <ul className="space-y-2 text-sm">
              {[{ l: 'Ana Sayfa', h: '/' }, { l: 'Sepetim', h: '/sepet' }, { l: 'Arama', h: '/arama' }, { l: 'İletişim', h: '/iletisim' }].map(x => (
                <li key={x.h}><Link href={x.h} className="hover:text-green-400 transition-colors">→ {x.l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black mb-4 text-sm uppercase tracking-wider">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin size={14} className="text-green-500 mt-0.5 flex-shrink-0" /><span className="text-gray-400">Mersin, Türkiye</span></li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-green-500" /><a href="tel:+905428520351" className="hover:text-green-400">0542 852 03 51</a></li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-green-500" /><a href="mailto:ilkonhomestore@gmail.com" className="hover:text-green-400 text-xs">ilkonhomestore@gmail.com</a></li>
            </ul>
            <a href="https://wa.me/905428520351" target="_blank" rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-semibold w-fit">
              <MessageCircle size={16} /> WhatsApp Sipariş
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 İlkon Home Store. Tüm hakları saklıdır.</p>
          <p>Güvenli alışveriş 🔒</p>
        </div>
      </div>
    </footer>
  )
}
