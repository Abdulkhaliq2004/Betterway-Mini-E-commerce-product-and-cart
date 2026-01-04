import React from 'react'
import Home from './pages/Home.jsx'
import { CartProvider } from './context/cartContext.jsx'

export default function App() {
  return (
    <CartProvider>
      <Home />
    </CartProvider>
  )
}
