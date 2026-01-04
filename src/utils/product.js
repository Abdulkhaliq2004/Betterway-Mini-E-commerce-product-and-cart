export function addMockStock(products, seed = Date.now()) {
  // Deterministic-ish stock per session: derived from id + seed.
  // This avoids requiring a backend and keeps stock stable while app runs.
  const s = Number(seed) || 1
  return products.map((p) => {
    const base = (p.id * 9301 + s) % 233280
    const qty = Math.floor((base / 233280) * 11) // 0..10
    return {
      ...p,
      stockQty: qty,
      inStock: qty > 0,
    }
  })
}

export function normalizeProducts(raw) {
  // FakeStore uses: title, price, category, image, description, id
  return raw.map((p) => ({
    id: p.id,
    name: p.title ?? p.name ?? 'Untitled',
    price: Number(p.price) || 0,
    category: p.category ?? 'misc',
    image: p.image ?? '',
    description: p.description ?? '',
  }))
}

export function uniqueCategories(products) {
  const set = new Set(products.map((p) => p.category))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
