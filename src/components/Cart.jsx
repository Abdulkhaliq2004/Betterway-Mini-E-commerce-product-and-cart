import React, { useMemo, useState } from 'react'
import styles from './Cart.module.css'
import { useCartActions, useCartState } from '../context/cartContext.jsx'
import { formatCurrency } from '../utils/format.js'
import CartItem from './CartItem.jsx'
import EmptyState from './EmptyState.jsx'
import Button from './Button.jsx'
import Modal from './Modal.jsx'

export default function Cart({ compact = false }) {
  const { list, totalItems, totalPrice } = useCartState()
  const { clearCart } = useCartActions()
  const [open, setOpen] = useState(false)

  const hasItems = list.length > 0

  const header = (
    <div className={styles.header}>
      <div>
        <div className={styles.title}>Cart</div>
        <div className={styles.meta}>
          <span><strong>{totalItems}</strong> item{totalItems === 1 ? '' : 's'}</span>
          <span className={styles.dot} aria-hidden="true">•</span>
          <span><strong>{formatCurrency(totalPrice)}</strong></span>
        </div>
      </div>
      <div className={styles.headerActions}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label="Open cart"
        >
          View
        </Button>
      </div>
    </div>
  )

  if (compact) {
    return (
      <>
        <div className={styles.compactCard}>
          {header}
        </div>

        <Modal title="Your Cart" isOpen={open} onClose={() => setOpen(false)}>
          <CartBody />
          <div className={styles.footer}>
            <div className={styles.totals}>
              <div>Items: <strong>{totalItems}</strong></div>
              <div>Total: <strong>{formatCurrency(totalPrice)}</strong></div>
            </div>
            <div className={styles.footerActions}>
              <Button variant="danger" disabled={!hasItems} onClick={clearCart}>Clear cart</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      </>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.headerInline}>
        <div className={styles.title}>Cart</div>
        <div className={styles.pills}>
          <span className={styles.pill}>{totalItems} items</span>
          <span className={styles.pill}>{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <CartBody />

      <div className={styles.footer}>
        <div className={styles.totals}>
          <div>Items: <strong>{totalItems}</strong></div>
          <div>Total: <strong>{formatCurrency(totalPrice)}</strong></div>
        </div>
        <div className={styles.footerActions}>
          <Button variant="danger" disabled={!hasItems} onClick={clearCart}>Clear cart</Button>
        </div>
      </div>
    </div>
  )
}

function CartBody() {
  const { list } = useCartState()

  if (!list.length) {
    return (
      <EmptyState
        icon="🛒"
        title="Empty cart"
        description="Add a product to get started. Your total will update instantly."
      />
    )
  }

  return (
    <div className={styles.items} aria-label="Cart items">
      {list.map(({ product, qty }) => (
        <CartItem key={product.id} product={product} qty={qty} />
      ))}
    </div>
  )
}
