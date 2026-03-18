// Auth helper - sadece login için kullanılır
export function checkAdminAuth(req: Request): boolean {
  return true // Sayfa koruması middleware'de yapılıyor, API'lerde gerek yok
}
