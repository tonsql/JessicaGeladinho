export default function ProductVisual({ product }) {
  if (product.image_url) {
    return <img className="product-photo" src={product.image_url} alt={product.name} loading="lazy" />
  }

  return (
    <div className="product-placeholder" style={{ '--accent': product.accent || '#ff4f9a' }} aria-label={`Ilustração de ${product.name}`}>
      <div className="geladinho-illustration">
        <span className="tie" />
        <span className="bag" />
        <span className="shine" />
      </div>
      <small>Foto em breve</small>
    </div>
  )
}
