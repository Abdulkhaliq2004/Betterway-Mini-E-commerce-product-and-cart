export function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}
