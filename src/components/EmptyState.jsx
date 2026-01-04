import React from 'react'
import styles from './EmptyState.module.css'

export default function EmptyState({ title, description, icon = '🛒', children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon} aria-hidden="true">{icon}</div>
      <div className={styles.title}>{title}</div>
      {description ? <div className={styles.desc}>{description}</div> : null}
      {children ? <div className={styles.actions}>{children}</div> : null}
    </div>
  )
}
