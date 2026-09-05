import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import MobileNav from './components/MobileNav'
import Footer from './components/Footer'
import VerifiedBadge from './components/VerifiedBadge'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Tracking from './pages/Tracking'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { useCart } from './hooks/useCart'

function StoreLayout() {
  const [cartOpen, setCartOpen] = useState(false)
  const cart = useCart()

  return (
    <div className="site-app">
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
      <Header cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />
      <Routes>
        <Route path="/" element={<Home onAdd={(product) => { cart.add(product); setCartOpen(true) }} />} />
        <Route path="/rastreio" element={<Tracking />} />
        <Route path="/contato" element={<Contact />} />
      </Routes>
      <Footer />
      <VerifiedBadge />
      <MobileNav />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart.items} total={cart.total} onAdd={cart.add} onDecrement={cart.decrement} onRemove={cart.remove} />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  if (isAdmin) return <Routes><Route path="/admin" element={<Admin />} /><Route path="*" element={<Admin />} /></Routes>
  return <StoreLayout />
}
