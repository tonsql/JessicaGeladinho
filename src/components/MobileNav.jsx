import { NavLink } from 'react-router-dom'
import { ContactIcon, HomeIcon, TrackIcon } from './Icons'

const itemClass = ({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Navegação móvel">
      <NavLink to="/" end className={itemClass}><HomeIcon/><span>Início</span></NavLink>
      <NavLink to="/rastreio" className={itemClass}><TrackIcon/><span>Rastreio</span></NavLink>
      <NavLink to="/contato" className={itemClass}><ContactIcon/><span>Contato</span></NavLink>
    </nav>
  )
}
