import { useState } from 'react'
import { CheckIcon, BoxIcon, TruckIcon } from '../components/Icons'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const statusData = {
  confirmed: { label: 'Pedido confirmado', message: 'Recebemos seu pedido e ele já entrou na nossa fila de preparo.', step: 1 },
  packing: { label: 'Sendo embalado', message: 'Seu pedido está sendo separado e embalado com cuidado.', step: 2 },
  out_for_delivery: { label: 'Saiu para entrega', message: 'Seu pedido está a caminho do endereço combinado.', step: 3 },
  delivered: { label: 'Entregue', message: 'Pedido entregue. Esperamos que você aproveite!', step: 4 },
}

export default function Tracking() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const search = async (event) => {
    event.preventDefault()
    const normalized = code.trim().toUpperCase()
    setResult(null)
    if (!normalized) return setMessage('Digite o código do seu pedido.')
    if (!isSupabaseConfigured) return setMessage('O rastreio ficará disponível assim que o banco de dados for conectado.')

    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.rpc('track_order', { code_input: normalized })
    setLoading(false)
    if (error) return setMessage('Não foi possível consultar agora. Tente novamente em instantes.')
    const item = Array.isArray(data) ? data[0] : data
    if (!item) return setMessage('Pedido não encontrado. Confira o código e tente novamente.')
    setResult(item)
  }

  const current = result ? (statusData[result.status] || statusData.confirmed) : null

  return (
    <main className="page inner-page page-enter">
      <section className="tracking-card">
        <div className="inner-heading"><span className="eyebrow">RASTREIO</span><h1>Onde está meu pedido?</h1><p>Digite o código que você recebeu da Jessica Gourmet.</p></div>
        <form className="tracking-form" onSubmit={search}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código do pedido" autoCapitalize="characters" maxLength={32} />
          <button disabled={loading}>{loading ? 'Consultando...' : 'Consultar'}</button>
        </form>

        {message && <div className="tracking-message">{message}</div>}
        {result && current && (
          <div className="tracking-result">
            <div className="tracking-result-top">
              <span className="status-icon">{current.step === 4 ? <CheckIcon/> : current.step === 3 ? <TruckIcon/> : <BoxIcon/>}</span>
              <div><small>{result.tracking_code}</small><h2>{current.label}</h2><p>{current.message}</p></div>
            </div>
            <div className="status-progress" style={{ '--progress': `${((current.step - 1) / 3) * 100}%` }}>
              <div className="status-line"><span /></div>
              {['Confirmado', 'Embalando', 'Em entrega', 'Entregue'].map((label, index) => <div className={`status-step ${current.step >= index + 1 ? 'done' : ''}`} key={label}><i>{current.step > index + 1 ? '✓' : index + 1}</i><span>{label}</span></div>)}
            </div>
            {result.summary && <div className="order-summary"><small>RESUMO</small><p>{result.summary}</p></div>}
          </div>
        )}
      </section>
    </main>
  )
}
