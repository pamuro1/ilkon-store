// Admin API çağrıları için yardımcı - her istekte API key header ekler
export function getAdminKey(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('admin-api-key') || ''
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const key = getAdminKey()
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'x-admin-key': key,
    },
  })
}
