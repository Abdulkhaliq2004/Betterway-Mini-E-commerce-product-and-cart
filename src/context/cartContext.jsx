import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { clamp } from '../utils/format.js'

const CartStateContext = createContext(null)
const CartActionsContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload
    case 'ADD': {
      const p = action.payload
      const existing = state.items[p.id]
      const nextQty = clamp((existing?.qty ?? 0) + 1, 0, p.stockQty ?? 0)
      if (nextQty === 0) return state
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: { product: p, qty: nextQty },
        },
      }
    }
    case 'REMOVE': {
      const id = action.payload
      const items = { ...state.items }
      delete items[id]
      return { ...state, items }
    }
    case 'SET_QTY': {
      const { id, qty } = action.payload
      const entry = state.items[id]
      if (!entry) return state
      const max = entry.product.stockQty ?? 0
      const nextQty = clamp(qty, 0, max)
      if (nextQty === 0) {
        const items = { ...state.items }
        delete items[id]
        return { ...state, items }
      }
      return {
        ...state,
        items: { ...state.items, [id]: { ...entry, qty: nextQty } },
      }
    }
    case 'CLEAR':
      return { ...state, items: {} }
    default:
      return state
  }
}

function computeTotals(items) {
  const list = Object.values(items)
  const totalItems = list.reduce((sum, it) => sum + it.qty, 0)
  const totalPrice = list.reduce((sum, it) => sum + it.qty * (it.product.price || 0), 0)
  return { totalItems, totalPrice }
}

const STORAGE_KEY = 'minimart_cart_v1'

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} })

  // init from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && parsed.items) {
        dispatch({ type: 'INIT', payload: parsed })
      }
    } catch {
      // ignore
    }
  }, [])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const addToCart = useCallback((product) => dispatch({ type: 'ADD', payload: product }), [])
  const removeFromCart = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), [])
  const setQty = useCallback((id, qty) => dispatch({ type: 'SET_QTY', payload: { id, qty } }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const totals = useMemo(() => computeTotals(state.items), [state.items])
  const cartList = useMemo(() => Object.values(state.items), [state.items])

  const stateValue = useMemo(
    () => ({
      items: state.items,
      list: cartList,
      ...totals,
    }),
    [state.items, cartList, totals],
  )

  const actionsValue = useMemo(
    () => ({
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
    }),
    [addToCart, removeFromCart, setQty, clearCart],
  )

  return (
    <CartStateContext.Provider value={stateValue}>
      <CartActionsContext.Provider value={actionsValue}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  )
}

export function useCartState() {
  const ctx = useContext(CartStateContext)
  if (!ctx) throw new Error('useCartState must be used within CartProvider')
  return ctx
}

export function useCartActions() {
  const ctx = useContext(CartActionsContext)
  if (!ctx) throw new Error('useCartActions must be used within CartProvider')
  return ctx
}
