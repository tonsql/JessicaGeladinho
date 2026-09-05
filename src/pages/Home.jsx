import ProductCard from '../components/ProductCard'
import ScrollReveal from '../components/ScrollReveal'
import { useProducts } from '../hooks/useProducts'

export default function Home({ onAdd }) {
  const { products, loading } = useProducts()

  return (
    <main className="page home-page page-enter">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">JESSICA GOURMET</span>
          <h1>Trabalhamos para deixar sua vida <em>mais doce.</em></h1>
          <p>Geladinhos gourmet cremosos, feitos com carinho e sabores que combinam com qualquer momento.</p>
          <button
            type="button"
            className="hero-cta"
            onClick={() => document.getElementById('sabores')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            Ver sabores
          </button>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-glow" />
          <img src="./logo-jessica-gourmet.png" alt="" />
          <div className="hero-price"><small>cada sabor</small><strong>R$ 8,00</strong></div>
        </div>
      </section>

      <section id="sabores" className="catalog-section">
        <ScrollReveal>
          <div className="section-heading">
            <div><span className="eyebrow">CARDÁPIO</span><h2>Escolha seu sabor</h2></div>
            <p>Disponibilidade atualizada pelo nosso estoque.</p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="product-grid loading-grid">{Array.from({ length: 6 }).map((_, i) => <div className="product-skeleton" key={i} />)}</div>
        ) : products.length ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <ScrollReveal key={product.id} delay={Math.min(index * 55, 220)}><ProductCard product={product} onAdd={onAdd} /></ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="empty-state"><strong>Nenhum sabor disponível agora.</strong><span>Volte em breve ou fale com a gente pelo WhatsApp.</span></div>
        )}
      </section>
    </main>
  )
}
