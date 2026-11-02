import ProductCard from './ProductCard.jsx';
export default function ProductListing({products=[]}){return products.length?<div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product}/>)}</div>:<div className="empty-products"><h3>Nenhum tênis nessa combinação.</h3><p>Tente mudar os filtros ou buscar outro modelo.</p></div>;}
