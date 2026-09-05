import { CloseIcon, WhatsAppIcon } from './Icons'

const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const WHATSAPP = '5567992517521'

export default function CartDrawer({ open, onClose, items, total, onAdd, onDecrement, onRemove }) {
  const finish = () => {
    if (!items.length) return
    const lines = items.map((item) => `• ${item.quantity}x ${item.name} — ${money(Number(item.price) * item.quantity)}`).join('\n')
    const message = `Olá, Jessica Gourmet! Gostaria de fazer este pedido:\n\n${lines}\n\nTotal: ${money(total)}\n\nPode me confirmar a disponibilidade?`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <button className={`drawer-overlay ${open ? 'show' : ''}`} onClick={onClose} aria-label="Fechar carrinho" />
      <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer-header">
          <div><small>SEU PEDIDO</small><h2>Carrinho</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar"><CloseIcon/></button>
        </div>
        <div className="drawer-content">
          {!items.length ? (
            <div className="cart-empty"><span>JG</span><h3>Seu carrinho está vazio</h3><p>Escolha seus sabores favoritos.</p></div>
          ) : items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div><strong>{item.name}</strong><small>{money(item.price)} cada</small></div>
              <div className="cart-item-actions">
                <div className="quantity"><button onClick={() => onDecrement(item.id)}>−</button><span>{item.quantity}</span><button onClick={() => onAdd(item)}>+</button></div>
                <button className="remove" onClick={() => onRemove(item.id)}>remover</button>
              </div>
            </div>
          ))}
        </div>
        <div className="drawer-footer">
          <div><span>Total</span><strong>{money(total)}</strong></div>
          <button className="checkout" disabled={!items.length} onClick={finish}><WhatsAppIcon/> Finalizar no WhatsApp</button>
          <small>O pedido será confirmado pela equipe antes do pagamento/entrega.</small>
        </div>
      </aside>
    </>
  )
}
