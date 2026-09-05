import { useEffect, useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AdminIcon, BoxIcon, CheckIcon, CopyIcon, EditIcon, LogoutIcon, PlusIcon, TrashIcon, TruckIcon } from '../components/Icons'

const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const statusLabels = {
  confirmed: 'Confirmado',
  packing: 'Embalando',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
}
const statusOptions = Object.entries(statusLabels)

function SetupRequired() {
  return (
    <main className="admin-page setup-page">
      <div className="setup-card">
        <img src="./logo-jessica-gourmet.png" alt="Jessica Gourmet" />
        <span className="eyebrow">CONFIGURAÇÃO</span>
        <h1>Conecte o Supabase</h1>
        <p>O painel já está pronto. Para ativá-lo, crie o projeto no Supabase, execute o arquivo <code>supabase/schema.sql</code> e preencha o arquivo <code>.env</code>.</p>
        <div className="setup-steps"><span>1. Supabase</span><span>2. schema.sql</span><span>3. .env</span><span>4. npm run dev</span></div>
      </div>
    </main>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (loginError) return setError('E-mail ou senha incorretos.')
    onLogin?.()
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <img src="./logo-jessica-gourmet.png" alt="Jessica Gourmet" />
        <div><span className="eyebrow">ÁREA RESTRITA</span><h1>Painel Jessica Gourmet</h1><p>Entre com o usuário administrador cadastrado no Supabase.</p></div>
        <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@jessicagourmet.com" required /></label>
        <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" required /></label>
        {error && <div className="admin-error">{error}</div>}
        <button className="admin-primary" disabled={loading}><AdminIcon/>{loading ? 'Entrando...' : 'Entrar no painel'}</button>
        <a href="#/">← Voltar para a loja</a>
      </form>
    </main>
  )
}

function ProductForm({ editing, onClose, onSaved }) {
  const [form, setForm] = useState({ name: editing?.name || '', price: editing?.price ?? 8, stock: editing?.stock ?? 0, active: editing?.active ?? true, image_url: editing?.image_url || '', sort_order: editing?.sort_order ?? 0 })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const save = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    let imageUrl = form.image_url || null

    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
      const { error: uploadError } = await supabase.storage.from('products').upload(safeName, file, { cacheControl: '3600', upsert: false })
      if (uploadError) {
        setLoading(false)
        return setError(`Erro ao enviar foto: ${uploadError.message}`)
      }
      imageUrl = supabase.storage.from('products').getPublicUrl(safeName).data.publicUrl
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Math.max(0, Number(form.stock)),
      active: Boolean(form.active),
      image_url: imageUrl,
      sort_order: Number(form.sort_order || 0),
    }

    const request = editing
      ? supabase.from('products').update(payload).eq('id', editing.id)
      : supabase.from('products').insert(payload)
    const { error: saveError } = await request
    setLoading(false)
    if (saveError) return setError(saveError.message)
    onSaved()
  }

  return (
    <div className="admin-modal-layer" role="dialog" aria-modal="true">
      <button className="admin-modal-backdrop" onClick={onClose} aria-label="Fechar" />
      <form className="admin-modal" onSubmit={save}>
        <div className="admin-modal-head"><div><small>{editing ? 'EDITAR' : 'NOVO PRODUTO'}</small><h2>{editing ? editing.name : 'Adicionar geladinho'}</h2></div><button type="button" onClick={onClose}>×</button></div>
        <div className="admin-form-grid">
          <label className="wide">Nome do produto<input value={form.name} onChange={(e) => change('name', e.target.value)} placeholder="Ex.: Morango com Nutella" required /></label>
          <label>Preço<input type="number" step="0.01" min="0" value={form.price} onChange={(e) => change('price', e.target.value)} required /></label>
          <label>Quantidade em estoque<input type="number" min="0" value={form.stock} onChange={(e) => change('stock', e.target.value)} required /></label>
          <label>Ordem de exibição<input type="number" value={form.sort_order} onChange={(e) => change('sort_order', e.target.value)} /></label>
          <label className="switch-label"><span>Disponível na loja</span><input type="checkbox" checked={form.active} onChange={(e) => change('active', e.target.checked)} /><i /></label>
          <label className="wide file-label">Foto do produto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} /><span>{file ? file.name : (form.image_url ? 'Trocar foto atual' : 'Escolher foto')}</span></label>
        </div>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-modal-actions"><button type="button" className="admin-secondary" onClick={onClose}>Cancelar</button><button className="admin-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar produto'}</button></div>
      </form>
    </div>
  )
}

function ProductsTab() {
  const { products, loading, reload } = useProducts({ includeInactive: true })
  const [editing, setEditing] = useState(null)
  const [openForm, setOpenForm] = useState(false)

  const remove = async (product) => {
    if (!window.confirm(`Excluir “${product.name}”?`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) return window.alert(`Não foi possível excluir: ${error.message}`)
    reload()
  }

  return (
    <section className="admin-section">
      <div className="admin-section-head"><div><span className="eyebrow">CATÁLOGO</span><h2>Produtos e estoque</h2><p>Cadastre foto, nome, preço e quantidade disponível.</p></div><button className="admin-primary" onClick={() => { setEditing(null); setOpenForm(true) }}><PlusIcon/> Novo produto</button></div>
      <div className="admin-product-list">
        {loading ? <div className="admin-empty">Carregando produtos...</div> : products.map((product) => (
          <article className="admin-product-row" key={product.id}>
            <div className="admin-product-thumb">{product.image_url ? <img src={product.image_url} alt="" /> : <span>JG</span>}</div>
            <div className="admin-product-name"><strong>{product.name}</strong><small>{product.active ? 'Visível na loja' : 'Oculto na loja'}</small></div>
            <div className="admin-product-metric"><small>Preço</small><strong>{money(product.price)}</strong></div>
            <div className="admin-product-metric"><small>Estoque</small><strong className={product.stock <= 5 ? 'low-stock' : ''}>{product.stock}</strong></div>
            <div className="admin-row-actions"><button title="Editar" onClick={() => { setEditing(product); setOpenForm(true) }}><EditIcon/></button><button title="Excluir" onClick={() => remove(product)}><TrashIcon/></button></div>
          </article>
        ))}
        {!loading && !products.length && <div className="admin-empty">Nenhum produto cadastrado. Clique em “Novo produto”.</div>}
      </div>
      {openForm && <ProductForm editing={editing} onClose={() => setOpenForm(false)} onSaved={() => { setOpenForm(false); reload() }} />}
    </section>
  )
}

function OrderForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', summary: '', status: 'confirmed' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const code = useMemo(() => `JG-${Date.now().toString(36).slice(-5).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`, [])

  const save = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: saveError } = await supabase.from('orders').insert({
      tracking_code: code,
      customer_name: form.customer_name.trim() || null,
      customer_phone: form.customer_phone.trim() || null,
      summary: form.summary.trim() || null,
      status: form.status,
    })
    setLoading(false)
    if (saveError) return setError(saveError.message)
    onSaved(code)
  }

  return (
    <div className="admin-modal-layer" role="dialog" aria-modal="true">
      <button className="admin-modal-backdrop" onClick={onClose} aria-label="Fechar" />
      <form className="admin-modal compact" onSubmit={save}>
        <div className="admin-modal-head"><div><small>NOVO PEDIDO</small><h2>Criar rastreio</h2></div><button type="button" onClick={onClose}>×</button></div>
        <div className="generated-code"><small>CÓDIGO GERADO</small><strong>{code}</strong></div>
        <div className="admin-form-grid one-column">
          <label>Nome do cliente<input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Opcional" /></label>
          <label>WhatsApp do cliente<input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} placeholder="Opcional" /></label>
          <label>Resumo do pedido<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Ex.: 2x Morango com Nutella, 1x Paçoca" rows="3" /></label>
          <label>Status inicial<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-modal-actions"><button type="button" className="admin-secondary" onClick={onClose}>Cancelar</button><button className="admin-primary" disabled={loading}>{loading ? 'Criando...' : 'Criar pedido'}</button></div>
      </form>
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [createdCode, setCreatedCode] = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (!error) setOrders(data || [])
  }

  useEffect(() => { load() }, [])

  const setStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) return window.alert('Não foi possível atualizar o status.')
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order))
  }

  const remove = async (order) => {
    if (!window.confirm(`Excluir o pedido ${order.tracking_code}?`)) return
    const { error } = await supabase.from('orders').delete().eq('id', order.id)
    if (!error) setOrders((current) => current.filter((item) => item.id !== order.id))
  }

  const copy = async (code) => {
    await navigator.clipboard?.writeText(code)
    setCreatedCode(code)
    setTimeout(() => setCreatedCode(''), 1800)
  }

  const nextStatus = (status) => {
    const order = ['confirmed', 'packing', 'out_for_delivery', 'delivered']
    return order[Math.min(order.indexOf(status) + 1, order.length - 1)]
  }

  return (
    <section className="admin-section">
      <div className="admin-section-head"><div><span className="eyebrow">RASTREAMENTO</span><h2>Pedidos</h2><p>Crie o código e avance o pedido com poucos cliques.</p></div><button className="admin-primary" onClick={() => setOpenForm(true)}><PlusIcon/> Criar pedido</button></div>
      {createdCode && <div className="admin-toast">Código {createdCode} copiado.</div>}
      <div className="admin-orders-list">
        {loading ? <div className="admin-empty">Carregando pedidos...</div> : orders.map((order) => (
          <article className="admin-order-card" key={order.id}>
            <div className="order-card-top">
              <div><button className="order-code" onClick={() => copy(order.tracking_code)} title="Copiar código"><strong>{order.tracking_code}</strong><CopyIcon/></button><span>{order.customer_name || 'Cliente sem nome'}</span></div>
              <span className={`admin-status ${order.status}`}>{statusLabels[order.status] || order.status}</span>
            </div>
            {order.summary && <p>{order.summary}</p>}
            <div className="quick-status">
              {order.status !== 'delivered' ? <button className="advance-button" onClick={() => setStatus(order.id, nextStatus(order.status))}>{order.status === 'confirmed' ? <BoxIcon/> : order.status === 'packing' ? <TruckIcon/> : <CheckIcon/>} Avançar para: {statusLabels[nextStatus(order.status)]}</button> : <span className="delivered-note"><CheckIcon/> Pedido finalizado</span>}
              <select value={order.status} onChange={(e) => setStatus(order.id, e.target.value)} aria-label="Alterar status">{statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <button className="delete-order" onClick={() => remove(order)} title="Excluir"><TrashIcon/></button>
            </div>
          </article>
        ))}
        {!loading && !orders.length && <div className="admin-empty">Nenhum pedido criado ainda.</div>}
      </div>
      {openForm && <OrderForm onClose={() => setOpenForm(false)} onSaved={(code) => { setOpenForm(false); load(); copy(code) }} />}
    </section>
  )
}

function DashboardHome({ onNavigate }) {
  const [stats, setStats] = useState({ products: 0, lowStock: 0, packing: 0, delivery: 0 })

  useEffect(() => {
    const loadStats = async () => {
      const [{ data: products }, { data: orders }] = await Promise.all([
        supabase.from('products').select('stock,active'),
        supabase.from('orders').select('status'),
      ])
      const activeProducts = (products || []).filter((item) => item.active)
      setStats({
        products: activeProducts.length,
        lowStock: activeProducts.filter((item) => Number(item.stock) <= 5).length,
        packing: (orders || []).filter((item) => item.status === 'packing').length,
        delivery: (orders || []).filter((item) => item.status === 'out_for_delivery').length,
      })
    }
    loadStats()
  }, [])

  return (
    <section className="admin-section dashboard-section">
      <div className="admin-section-head"><div><span className="eyebrow">VISÃO GERAL</span><h2>Olá, Jessica 👋</h2><p>O essencial da loja em uma tela simples.</p></div></div>
      <div className="stats-grid">
        <div><span>Produtos ativos</span><strong>{stats.products}</strong></div>
        <div><span>Estoque baixo</span><strong>{stats.lowStock}</strong></div>
        <div><span>Embalando</span><strong>{stats.packing}</strong></div>
        <div><span>Em entrega</span><strong>{stats.delivery}</strong></div>
      </div>
      <div className="admin-shortcuts">
        <button onClick={() => onNavigate('orders')}><span><BoxIcon/></span><div><strong>Criar novo pedido</strong><small>Gere o código de rastreio do cliente.</small></div>→</button>
        <button onClick={() => onNavigate('products')}><span><PlusIcon/></span><div><strong>Adicionar produto</strong><small>Cadastre foto, nome e estoque.</small></div>→</button>
      </div>
    </section>
  )
}

function Dashboard() {
  const [tab, setTab] = useState('home')

  const logout = () => supabase.auth.signOut()

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a href="#/" className="admin-brand"><img src="./logo-jessica-gourmet.png" alt=""/><div><strong>Jessica Gourmet</strong><small>Admin</small></div></a>
        <nav>
          <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}><AdminIcon/> Início</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><BoxIcon/> Pedidos</button>
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><PlusIcon/> Produtos</button>
        </nav>
        <button className="admin-logout" onClick={logout}><LogoutIcon/> Sair</button>
      </aside>
      <div className="admin-mobile-bar"><div><img src="./logo-jessica-gourmet.png" alt=""/><strong>Painel Admin</strong></div><button onClick={logout}><LogoutIcon/></button></div>
      <div className="admin-mobile-tabs"><button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>Início</button><button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Pedidos</button><button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Produtos</button></div>
      <div className="admin-content">
        {tab === 'home' && <DashboardHome onNavigate={setTab} />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'products' && <ProductsTab />}
      </div>
    </main>
  )
}

export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!isSupabaseConfigured) return setSession(null)
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) return <SetupRequired />
  if (session === undefined) return <main className="admin-loading">Carregando painel...</main>
  if (!session) return <Login />
  return <Dashboard />
}
