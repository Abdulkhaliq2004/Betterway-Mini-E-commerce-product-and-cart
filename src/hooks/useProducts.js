import { useEffect, useMemo, useState } from 'react'
import useDebounce from './useDebounce.js'

const API_URL = 'https://dummyjson.com/products?limit=20'

export default function useProducts() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [products, setProducts] = useState([])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('')

  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      setStatus('loading')
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()

        const normalized = data.products.map(p => ({
          id: p.id,
          name: p.title,
          price: Number(p.price),
          category: p.category,
          image: p.thumbnail,
          description: p.description,
          stockQty: p.stock,
          inStock: p.stock > 0,
        }))

        if (!cancelled) {
          setProducts(normalized)
          setStatus('ready')
        }
      } catch (err) {
        console.error('Product API error:', err)
        if (!cancelled) setStatus('error')
      }
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category))).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    let list = products

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }

    if (category !== 'all') {
      list = list.filter(p => p.category === category)
    }

    if (sort === 'low') {
      list = [...list].sort((a, b) => a.price - b.price)
    }

    if (sort === 'high') {
      list = [...list].sort((a, b) => b.price - a.price)
    }

    return list
  }, [products, debouncedSearch, category, sort])

  const clearAll = () => {
    setSearch('')
    setCategory('all')
    setSort('')
  }

  return {
    status,
    products: filteredProducts,
    totalProducts: products.length,
    categories,
    filters: { search, category, sort },
    actions: { setSearch, setCategory, setSort, clearAll },
  }
}
