import React from 'react'
import styles from './Filters.module.css'
import Button from './Button.jsx'

export default function Filters({ categories, filters, actions }) {
  const { search, category, sort } = filters
  const { setSearch, setCategory, setSort, clearAll } = actions

  const isDirty = search.trim() || category !== 'all' || sort

  return (
    <div className={styles.wrap} role="region" aria-label="Filters and Search">
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Search</span>
          <input
            className={styles.input}
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Category</span>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Sort</span>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </label>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="md"
            onClick={clearAll}
            disabled={!isDirty}
            title={isDirty ? 'Clear all filters' : 'Nothing to clear'}
          >
            Clear all
          </Button>
        </div>
      </div>

      <div className={styles.hint}>
        Filters combine (search + category + sort). Search is debounced for smooth typing.
      </div>
    </div>
  )
}
