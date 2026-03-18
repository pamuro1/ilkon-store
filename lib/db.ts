import { sql } from '@vercel/postgres'
export { sql }

export async function setupDatabase() {
  await sql`CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL UNIQUE, parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL, created_at TIMESTAMP DEFAULT NOW())`
  await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, barcode VARCHAR(255) UNIQUE, name VARCHAR(500) NOT NULL, image_url TEXT, description TEXT, price DECIMAL(10,2) NOT NULL, category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL, is_popular BOOLEAN DEFAULT false, is_new BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW())`
  await sql`CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )`

  await sql`CREATE TABLE IF NOT EXISTS sliders (id SERIAL PRIMARY KEY, image_url TEXT NOT NULL, title VARCHAR(255), subtitle VARCHAR(500), link VARCHAR(500), order_index INTEGER DEFAULT 0, is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW())`
}

export async function getProducts(opts?: { isPopular?: boolean; isNew?: boolean; categoryId?: number; limit?: number }) {
  const { isPopular, isNew, categoryId, limit = 50 } = opts || {}
  const base = `SELECT p.*, c.name as category_name, pc.name as parent_category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN categories pc ON c.parent_id=pc.id`
  if (isPopular) return sql`${base} WHERE p.is_popular=true ORDER BY p.created_at DESC LIMIT ${limit}`
  if (isNew) return sql`${base} WHERE p.is_new=true ORDER BY p.created_at DESC LIMIT ${limit}`
  if (categoryId) return sql`${base} WHERE p.category_id=${categoryId} OR c.parent_id=${categoryId} ORDER BY p.created_at DESC LIMIT ${limit}`
  return sql`${base} ORDER BY p.created_at DESC LIMIT ${limit}`
}

export async function getCategories() {
  return sql`SELECT c.*, pc.name as parent_name FROM categories c LEFT JOIN categories pc ON c.parent_id=pc.id ORDER BY c.parent_id NULLS FIRST, c.name`
}

export async function getSliders() {
  return sql`SELECT * FROM sliders WHERE is_active=true ORDER BY order_index ASC`
}
