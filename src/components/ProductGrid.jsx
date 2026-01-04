import React from 'react'
import styles from './ProductGrid.module.css'
import ProductCard from './ProductCard.jsx'
import EmptyState from './EmptyState.jsx'
import Button from './Button.jsx'

export default function ProductGrid({ products, isLoading, onClearFilters }) {
  if (isLoading) {
    return (
      <div className={styles.skeletonGrid} aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 12 }).map((_, i) => (
          <div className={styles.skeletonCard} key={i} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        icon="🔎"
        title="No products found"
        description="Try clearing filters or searching for something else."
      >
        <Button variant="secondary" onClick={onClearFilters}>Clear filters</Button>
      </EmptyState>
    )
  }

  return (
    <div className={styles.grid} aria-label="Product list">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
