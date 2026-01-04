import React, { useMemo } from 'react'
import styles from './CartItem.module.css'
import Button from './Button.jsx'
import { useCartActions } from '../context/cartContext.jsx'
import { formatCurrency, clamp } from '../utils/format.js'

export default function CartItem({ product, qty }) {
  const { removeFromCart, setQty } = useCartActions()

  const max = product.stockQty ?? 0
  const atMax = qty >= max

  const subtotal = useMemo(() => product.price * qty, [product.price, qty])

  return (
    <div className={styles.row}>
      <div className={styles.thumb} aria-hidden="true">
        {product.image ? <img src={product.image} alt="" /> : <span>🛍️</span>}
      </div>

      <div className={styles.main}>
        <div className={styles.name} title={product.name}>{product.name}</div>
        <div className={styles.meta}>
          <span>{formatCurrency(product.price)}</span>
          <span className={styles.dot} aria-hidden="true">•</span>
          <span>Stock {max}</span>
          <span className={styles.dot} aria-hidden="true">•</span>
          <span><strong>{formatCurrency(subtotal)}</strong></span>
        </div>

        <div className={styles.controls}>
          <div className={styles.qty}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setQty(product.id, clamp(qty - 1, 0, max))}
              aria-label={`Decrease quantity of ${product.name}`}
            >
              −
            </Button>
            <input
              className={styles.qtyInput}
              value={qty}
              inputMode="numeric"
              aria-label={`Quantity for ${product.name}`}
              onChange={(e) => {
                const next = Number(e.target.value.replace(/\D/g, ''))
                if (Number.isFinite(next)) setQty(product.id, next)
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              disabled={atMax}
              onClick={() => setQty(product.id, clamp(qty + 1, 0, max))}
              aria-label={`Increase quantity of ${product.name}`}
              title={atMax ? 'Reached available stock' : 'Increase quantity'}
            >
              +
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(product.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
