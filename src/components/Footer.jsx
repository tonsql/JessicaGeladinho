import { Link } from 'react-router-dom'
import { InstagramIcon, WhatsAppIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src="./logo-jessica-gourmet.png" alt="" />
          <div><strong>Jessica Gourmet</strong><span>Feito com carinho para adoçar seus momentos.</span></div>
        </div>
        <div className="footer-links">
          <div><small>Navegação</small><Link to="/">Início</Link><Link to="/rastreio">Rastreio</Link><Link to="/contato">Contato</Link></div>
          <div><small>Atendimento</small><a href="https://wa.me/5567992517521" target="_blank" rel="noreferrer"><WhatsAppIcon/> WhatsApp</a><a href="https://instagram.com/jessicageladinho" target="_blank" rel="noreferrer"><InstagramIcon/> Instagram</a></div>
          <div><small>Loja</small><span>CNPJ 67.298.023/0001-03</span><span>Rua Maria Candida Lopes, 441</span><span>Jardim Das Paineiras</span></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Jessica Gourmet. Todos os direitos reservados.</span>
        <Link to="/admin">Área administrativa</Link>
      </div>
    </footer>
  )
}
