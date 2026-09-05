import { NavLink } from 'react-router-dom'
import { CartIcon } from './Icons'

export default function Header({ cartCount, onOpenCart }) {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="Jessica Gourmet — início">
        <img src="./logo-jessica-gourmet.png" alt="Logo Jessica Geladinho Gourmet" />
        <span><strong>Jessica Gourmet</strong><small>Geladinhos artesanais</small></span>
      </NavLink>

      <nav className="desktop-nav" aria-label="Navegação principal">
        <NavLink to="/" end>Início</NavLink>
        <NavLink to="/rastreio">Rastreio</NavLink>
        <NavLink to="/contato">Contato</NavLink>
      </nav>

      <button className="cart-button" onClick={onOpenCart} aria-label={`Abrir carrinho com ${cartCount} itens`}>
        <CartIcon />
        <span className="cart-label">Carrinho</span>
        {cartCount > 0 && <b>{cartCount}</b>}
      </button>
    </header>
  )
}
