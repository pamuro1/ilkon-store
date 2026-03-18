'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Menu, X, ChevronDown, Phone, Mail } from 'lucide-react'

interface Cat { id: number; name: string; slug: string; parent_id: number | null }
interface NavGroup { id: number; name: string; slug: string; items: Cat[] }
interface NavItem { id: number; name: string; slug: string; groups: NavGroup[] }

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileExp, setMobileExp] = useState<string | null>(null)
  const [mobileGrpExp, setMobileGrpExp] = useState<string | null>(null)
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [cokSatanlar, setCokSatanlar] = useState<Cat | null>(null)
  const router = useRouter()

  // Tüm kategorileri DB'den çek, 3 seviyeli ağaç yap
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(d => {
        const all: Cat[] = d.categories || []
        const l1 = all.filter(c => !c.parent_id)
        const l1ids = new Set(l1.map(c => c.id))
        const l2 = all.filter(c => c.parent_id && l1ids.has(c.parent_id!))
        const l2ids = new Set(l2.map(c => c.id))
        const l3 = all.filter(c => c.parent_id && l2ids.has(c.parent_id!))

        setCokSatanlar(l1.find(c => c.slug === 'cok-satanlar') || null)

        const tree: NavItem[] = l1
          .filter(c => c.slug !== 'cok-satanlar')
          .map(cat => ({
            ...cat,
            groups: l2
              .filter(g => g.parent_id === cat.id)
              .map(g => ({ ...g, items: l3.filter(s => s.parent_id === g.id) }))
          }))
        setNavItems(tree)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const update = () => {
      try {
        const s = localStorage.getItem('ilkon-cart')
        setCartCount(s ? JSON.parse(s).reduce((a: number, i: any) => a + i.quantity, 0) : 0)
      } catch {}
    }
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery(''); setMobileOpen(false)
    }
  }

  return (
    <>
      <div className="ann-bar text-white text-center py-2 text-xs font-semibold tracking-wide">
        🚚 Tüm Siparişlerde Ücretsiz Kargo &nbsp;|&nbsp; 📞 0542 852 03 51
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <a href="tel:+905428520351" className="flex items-center gap-1 hover:text-green-600"><Phone size={11}/> 0542 852 03 51</a>
              <a href="mailto:ilkonhomestore@gmail.com" className="hidden sm:flex items-center gap-1 hover:text-green-600"><Mail size={11}/> ilkonhomestore@gmail.com</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/iletisim" className="hover:text-green-600">İletişim</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0" onClick={() => setMobileOpen(true)}>
            <Menu size={22} className="text-gray-700"/>
          </button>
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="İlkon Home Store" width={160} height={74} className="h-14 w-auto object-contain" priority/>
          </Link>
          <div className="flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" placeholder="Ürün, marka veya kategori arayın..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"/>
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white p-1.5 rounded-lg hover:bg-green-700">
                <Search size={15}/>
              </button>
            </form>
          </div>
          <Link href="/sepet" className="relative flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-xl transition-all hover:shadow-md">
            <ShoppingCart size={20}/>
            <span className="hidden sm:block text-sm font-bold">Sepet</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 cart-badge bg-amber-400 text-gray-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:block bg-green-700">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center flex-wrap">
              {navItems.map(item => (
                <li key={item.slug} className="relative"
                  onMouseEnter={() => setActiveMenu(item.slug)}
                  onMouseLeave={() => setActiveMenu(null)}>
                  <Link href={`/kategori/${item.slug}`}
                    className="flex items-center gap-1.5 px-4 py-3.5 text-white text-sm font-bold hover:bg-green-600 transition-colors whitespace-nowrap">
                    {item.name.toUpperCase()}
                    {item.groups.length > 0 && (
                      <ChevronDown size={13} className={`transition-transform ${activeMenu === item.slug ? 'rotate-180' : ''}`}/>
                    )}
                  </Link>

                  {/* Dropdown - tüm alt kategoriler alt alta */}
                  {item.groups.length > 0 && activeMenu === item.slug && (
                    <div className="absolute top-full left-0 bg-white shadow-2xl border-t-2 border-green-500 z-50 min-w-[220px]">
                      <ul className="py-2">
                        {item.groups.map(group => (
                          group.items.length > 0 ? (
                            group.items.map(sub => (
                              <li key={sub.slug}>
                                <Link href={`/kategori/${sub.slug}`}
                                  className="block px-5 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors whitespace-nowrap">
                                  → {sub.name}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li key={group.slug}>
                              <Link href={`/kategori/${group.slug}`}
                                className="block px-5 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors whitespace-nowrap font-semibold">
                                → {group.name}
                              </Link>
                            </li>
                          )
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 px-5 py-2.5">
                        <Link href={`/kategori/${item.slug}`} className="text-green-700 font-bold text-xs hover:text-green-900">
                          Tüm {item.name} →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}

              {/* Çok Satanlar - her zaman sonda */}
              {cokSatanlar && (
                <li>
                  <Link href="/kategori/cok-satanlar"
                    className="flex items-center px-4 py-3.5 text-white text-sm font-bold hover:bg-green-600 transition-colors whitespace-nowrap">
                    ÇOK SATANLAR
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobil menü */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="mobile-menu bg-white w-80 h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-green-700">
              <Image src="/images/logo.png" alt="İlkon" width={120} height={56} className="h-10 w-auto"/>
              <button onClick={() => setMobileOpen(false)} className="text-white"><X size={24}/></button>
            </div>
            <nav className="p-4">
              {navItems.map(item => (
                <div key={item.slug} className="border-b border-gray-100">
                  <button className="w-full flex items-center justify-between py-3.5 text-gray-800 font-bold text-sm"
                    onClick={() => { setMobileExp(mobileExp === item.slug ? null : item.slug); setMobileGrpExp(null) }}>
                    {item.name}
                    {item.groups.length > 0 && (
                      <ChevronDown size={15} className={`text-gray-400 transition-transform ${mobileExp === item.slug ? 'rotate-180' : ''}`}/>
                    )}
                  </button>
                  {mobileExp === item.slug && (
                    <div className="pb-2 pl-3">
                      {item.groups.map(group => (
                        group.items.length > 0 ? (
                          <div key={group.slug}>
                            <p className="text-xs font-black text-green-600 uppercase py-1.5">{group.name}</p>
                            {group.items.map(sub => (
                              <Link key={sub.slug} href={`/kategori/${sub.slug}`}
                                className="block py-1.5 text-sm text-gray-600 hover:text-green-600 pl-2"
                                onClick={() => setMobileOpen(false)}>
                                → {sub.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link key={group.slug} href={`/kategori/${group.slug}`}
                            className="block py-1.5 text-sm font-semibold text-gray-700 hover:text-green-600"
                            onClick={() => setMobileOpen(false)}>
                            → {group.name}
                          </Link>
                        )
                      ))}
                      <Link href={`/kategori/${item.slug}`} className="block py-2 text-xs text-green-600 font-semibold" onClick={() => setMobileOpen(false)}>
                        Tümünü Gör →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {cokSatanlar && (
                <div className="border-b border-gray-100">
                  <Link href="/kategori/cok-satanlar" className="block py-3.5 text-gray-800 font-bold text-sm" onClick={() => setMobileOpen(false)}>
                    ÇOK SATANLAR
                  </Link>
                </div>
              )}
              <Link href="/iletisim" className="flex items-center gap-2 py-3.5 text-gray-600 font-semibold text-sm" onClick={() => setMobileOpen(false)}>
                <Phone size={15} className="text-green-600"/> İletişim
              </Link>
            </nav>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)}/>
        </div>
      )}
    </>
  )
}
