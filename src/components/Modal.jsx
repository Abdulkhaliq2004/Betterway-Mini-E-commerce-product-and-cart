import React, { useEffect, useRef } from 'react'
import styles from './Modal.module.css'
import Button from './Button.jsx'

export default function Modal({ title, isOpen, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      // focus first focusable element
      setTimeout(() => {
        const el = dialogRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        el?.focus?.()
      }, 0)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose?.()
    }}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={title} ref={dialogRef}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.title}>{title}</div>
            <div className={styles.sub}>Press Esc to close</div>
          </div>
          <Button variant="ghost" size="sm" aria-label="Close modal" onClick={onClose}>✕</Button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  )
}
