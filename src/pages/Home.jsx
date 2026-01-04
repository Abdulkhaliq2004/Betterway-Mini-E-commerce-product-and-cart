import React, { useEffect, useMemo, useState } from 'react'
import styles from './Home.module.css'
import TopBar from '../components/TopBar.jsx'
import Filters from '../components/Filters.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Cart from '../components/Cart.jsx'
import useProducts from '../hooks/useProducts.js'

export default function Home() {
  const { status, products, totalProducts, categories, filters, actions } = useProducts()
  const [theme, setTheme] = useState(() => localStorage.getItem('minimart_theme') || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('minimart_theme', theme) } catch {}
  }, [theme])

  const isLoading = status === 'loading'
  const isError = status === 'error'

  const subtitle = useMemo(() => {
    return `${products.length} of ${totalProducts} products`
  }, [products.length, totalProducts])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <TopBar
          theme={theme}
          onToggleTheme={() =>
            setTheme(t => (t === 'dark' ? 'light' : 'dark'))
          }
        />

        {isError && (
          <div className={styles.errorBanner}>
            Failed to load products. Please refresh the page.
          </div>
        )}

        <div className={styles.main}>
          <div className={styles.left}>
            <Filters
              categories={categories}
              filters={filters}
              actions={actions}
            />

            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Products</div>
              <div className={styles.sectionSub}>{subtitle}</div>
            </div>

            <ProductGrid
              products={products}
              isLoading={isLoading}
              onClearFilters={actions.clearAll}
            />
          </div>

          <div className={styles.right}>
            <div className={styles.desktopCart}>
              <Cart />
            </div>

            <div className={styles.mobileCart}>
              <Cart compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
