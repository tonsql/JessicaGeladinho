import { InstagramIcon, WhatsAppIcon } from '../components/Icons'

export default function Contact() {
  return (
    <main className="page inner-page page-enter">
      <section className="contact-hero">
        <div className="contact-copy">
          <span className="eyebrow">CONTATO & ENCOMENDAS</span>
          <h1>Vamos adoçar seu próximo momento?</h1>
          <p>Entre em contato e solicite seu orçamento para:</p>
          <ul>
            <li>Festas e comemorações</li>
            <li>Feiras e eventos corporativos</li>
            <li>Encomendas especiais para datas comemorativas</li>
          </ul>
          <p>Clique no botão abaixo e fale com a nossa equipe. Estamos prontos para atender você.</p>
          <div className="contact-actions">
            <a className="primary-action" href="https://wa.me/5567992517521?text=Ol%C3%A1%2C%20Jessica%20Gourmet!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento." target="_blank" rel="noreferrer"><WhatsAppIcon/> Solicitar orçamento</a>
            <a className="secondary-action" href="https://instagram.com/jessicageladinho" target="_blank" rel="noreferrer"><InstagramIcon/> @jessicageladinho</a>
          </div>
        </div>
        <div className="contact-info-card">
          <span className="eyebrow">ATENDIMENTO</span>
          <div><small>WhatsApp</small><strong>(67) 99251-7521</strong></div>
          <div><small>Instagram</small><strong>@jessicageladinho</strong></div>
          <div><small>Endereço</small><strong>Rua Maria Candida Lopes, 441<br/>Bairro Jardim Das Paineiras</strong></div>
          <div><small>CNPJ</small><strong>67.298.023/0001-03</strong></div>
        </div>
      </section>
    </main>
  )
}
