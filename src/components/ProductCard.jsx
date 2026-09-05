import ProductVisual from './ProductVisual'
import { PlusIcon } from './Icons'

const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductCard({ product, onAdd }) {
  const soldOut = Number(product.stock) <= 0
  return (
    <article className={`product-card ${soldOut ? 'sold-out' : ''}`}>
      <div className="product-media">
        <ProductVisual product={product} />
        <span className={`stock-badge ${soldOut ? 'empty' : ''}`}>{soldOut ? 'Esgotado' : `${product.stock} em estoque`}</span>
      </div>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <strong>{money(product.price)}</strong>
        </div>
        <button onClick={() => onAdd(product)} disabled={soldOut}>
          <PlusIcon /> {soldOut ? 'Indisponível' : 'Adicionar'}
        </button>
      </div>
    </article>
  )
}
