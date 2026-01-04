import React, { memo, useMemo, useState } from 'react'
import styles from './ProductCard.module.css'
import Badge from './Badge.jsx'
import Button from './Button.jsx'
import Modal from './Modal.jsx'
import { useCartActions, useCartState } from '../context/cartContext.jsx'
import { formatCurrency } from '../utils/format.js'

function ProductCardImpl({ product }) {
  const { addToCart } = useCartActions()
  const { items } = useCartState()
  const [open, setOpen] = useState(false)

  const inCartQty = items?.[product.id]?.qty ?? 0
  const canAdd = product.inStock && inCartQty < (product.stockQty ?? 0)

  const stockTone = product.inStock ? 'success' : 'danger'
  const stockLabel = product.inStock ? `In stock (${product.stockQty})` : 'Out of stock'

  const prettyCategory = useMemo(() => {
    return product.category.replace(/\b\w/g, (m) => m.toUpperCase())
  }, [product.category])

  return (
    <>
      <div className={styles.card}>
        <button className={styles.media} onClick={() => setOpen(true)} aria-label={`View details: ${product.name}`}>
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">🛍️</div>
          )}
        </button>

        <div className={styles.body}>
          <div className={styles.topRow}>
            <div className={styles.title} title={product.name}>{product.name}</div>
          </div>

          <div className={styles.metaRow}>
            <Badge tone="neutral">{prettyCategory}</Badge>
            <Badge tone={stockTone}>{stockLabel}</Badge>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.price}>{formatCurrency(product.price)}</div>

            <div className={styles.cta}>
              <Button
                variant={canAdd ? 'primary' : 'secondary'}
                size="sm"
                disabled={!canAdd}
                onClick={() => addToCart(product)}
                title={!product.inStock ? 'Out of stock' : canAdd ? 'Add to cart' : 'Reached stock limit'}
              >
                {inCartQty ? `Add (+${inCartQty})` : 'Add to cart'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>Details</Button>
            </div>
          </div>
        </div>
      </div>

      <Modal title={product.name} isOpen={open} onClose={() => setOpen(false)}>
        <div className={styles.modal}>
          <div className={styles.modalMedia}>
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className={styles.modalPlaceholder} aria-hidden="true">🛍️</div>
            )}
          </div>

          <div className={styles.modalInfo}>
            <div className={styles.modalBadges}>
              <Badge tone="neutral">{prettyCategory}</Badge>
              <Badge tone={stockTone}>{stockLabel}</Badge>
            </div>

            <div className={styles.modalPrice}>{formatCurrency(product.price)}</div>

            <p className={styles.modalDesc}>
              {product.description || 'No description available.'}
            </p>

            <div className={styles.modalActions}>
              <Button
                variant={canAdd ? 'primary' : 'secondary'}
                disabled={!canAdd}
                onClick={() => addToCart(product)}
              >
                {canAdd ? 'Add to cart' : 'Unavailable'}
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
            </div>

            <div className={styles.modalNote}>
              Quantity in cart: <strong>{inCartQty}</strong> / {product.stockQty ?? 0}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

const ProductCard = memo(ProductCardImpl)
export default ProductCard
