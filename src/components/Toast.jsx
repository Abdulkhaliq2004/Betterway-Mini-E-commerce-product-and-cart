import React from 'react'
import styles from './Toast.module.css'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      {message}
    </div>
  )
}
