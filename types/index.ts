export interface Product {
  id: number; barcode: string; name: string; image_url: string
  description: string; price: number; category_id: number
  category_name?: string; parent_category_name?: string
  is_popular: boolean; is_new: boolean; colors: string; created_at: string
}
export interface Category {
  id: number; name: string; slug: string; parent_id: number | null; parent_name?: string
}
export interface Slider {
  id: number; image_url: string; title: string; subtitle: string
  link: string; order_index: number; is_active: boolean
}
export interface CartItem { product: Product; quantity: number; selectedColor?: string }
