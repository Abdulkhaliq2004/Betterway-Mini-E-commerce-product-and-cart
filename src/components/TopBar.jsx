import React from 'react'
import styles from './TopBar.module.css'
import Button from './Button.jsx'
import { useCartState } from '../context/cartContext.jsx'

export default function TopBar({ onToggleTheme, theme }) {
  const { totalItems } = useCartState()
  return (
    <div className={styles.wrap}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">🪄</div>
        <div>
          <div className={styles.name}>MiniMart</div>
          <div className={styles.tag}>A tiny store with extraordinary polish</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.cartPill} title="Items in cart">
          🛒 <strong>{totalItems}</strong>
        </div>
        <Button variant="secondary" size="sm" onClick={onToggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'} mode
        </Button>
      </div>
    </div>
  )
}
