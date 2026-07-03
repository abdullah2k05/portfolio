export default function Products({ products = [] }) {
  return (
    <section id="products">
      <div className="container">
        <div className="reveal">
          <div className="section-label">04 — Products</div>
          <div className="section-title">Digital <em>Products</em></div>
        </div>
        {products.length === 0 ? (
          <div className="reveal" style={{ textAlign: 'center', padding: '60px 0', color: '#666', fontSize: 14 }}>
            <p>No products listed yet.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, idx) => (
              <div key={product.id} className={`product-card reveal reveal-delay-${(idx % 3) + 1}`}>
                {product.image && (
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                )}
                  <div className="product-body">
                    <div className="product-meta">
                      <span className="product-num">Product {String(idx + 1).padStart(2, '0')}</span>
                      {product.price && <span className="product-price">${product.price.startsWith('$') ? product.price.slice(1) : product.price}</span>}
                    </div>
                    <h3>{product.title}</h3>
                    <p>{(product.description || '').slice(0, 150)}</p>
                    {product.features && product.features.length > 0 && (
                      <div className="product-tags">
                        {product.features.map((f, i) => (
                          <span key={i} className="product-tag">{f}</span>
                        ))}
                      </div>
                    )}
                    {product.linkUrl && (
                      <a href={product.linkUrl} className="btn-primary product-btn" target="_blank" rel="noreferrer">
                        {product.linkLabel || 'View Product'}
                      </a>
                    )}
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
