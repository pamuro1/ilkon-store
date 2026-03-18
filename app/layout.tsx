import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Toast from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'İlkon Home Store | Ev & Yaşam Ürünleri',
  description: 'Beyaz eşya, küçük ev aletleri ve yaşam ürünleri. En kaliteli ürünler en uygun fiyatlarla.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toast />
      </body>
    </html>
  )
}
