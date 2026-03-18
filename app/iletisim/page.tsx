import { Phone, Mail, MapPin, Clock } from 'lucide-react'

// WhatsApp SVG icon
function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function IletisimPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-800 mb-3">İletişim</h1>
        <p className="text-gray-500 text-lg">Sorularınız için bize ulaşın, hemen yardımcı olalım.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Telefon</h3>
          <a href="tel:+905428520351" className="text-green-600 font-semibold hover:text-green-800 block text-sm">0542 852 03 51</a>
          <p className="text-gray-400 text-xs mt-1">Hafta içi 08:00-21:00</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
            <WhatsAppIcon size={24} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">WhatsApp</h3>
          <a href="https://wa.me/905428520351" target="_blank" rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:text-green-800 block text-sm">
            WhatsApp ile Yaz
          </a>
          <p className="text-gray-400 text-xs mt-1">Hızlı sipariş & destek</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">E-posta</h3>
          <a href="mailto:ilkonhomestore@gmail.com" className="text-green-600 font-semibold hover:text-green-800 block text-sm break-all">
            ilkonhomestore@gmail.com
          </a>
          <p className="text-gray-400 text-xs mt-1">24 saat içinde yanıtlanır</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harita - Lefkoşa/Ortaköy */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={17} className="text-green-600" /> Lefkoşa, Ortaköy
            </h3>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13159.123456789!2d33.3513!3d35.1856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de1a5c8e2f1234%3A0xabcdef1234567890!2sOrtaköy%2C%20Nicosia%2C%20Cyprus!5e0!3m2!1str!2str!4v1699000000000!5m2!1str!2str"
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="space-y-4">
          {/* Çalışma saatleri */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={17} className="text-green-600" /> Çalışma Saatleri
            </h3>
            {[
              { d: 'Pazartesi - Cuma', h: '08:00 - 21:00' },
              { d: 'Cumartesi', h: '08:00 - 20:00' },
              { d: 'Pazar', h: 'Kapalı' },
            ].map((x, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                <span className="text-gray-600 font-medium">{x.d}</span>
                <span className={`font-semibold ${x.h === 'Kapalı' ? 'text-red-400' : 'text-green-600'}`}>{x.h}</span>
              </div>
            ))}
          </div>

          {/* Sosyal medya */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Sosyal Medya</h3>
            <a href="https://instagram.com/ilkonhomestore" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              @ilkonhomestore
            </a>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-green-700 rounded-2xl p-6 text-white">
            <h3 className="font-black text-lg mb-2">Hızlı Sipariş</h3>
            <p className="text-green-100 text-sm mb-4">WhatsApp üzerinden ürünlerimizi inceleyip sipariş verebilirsiniz.</p>
            <a href="https://wa.me/905428520351" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-2.5 rounded-xl hover:bg-green-50 text-sm">
              <WhatsAppIcon size={18} /> WhatsApp'tan Yaz
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
