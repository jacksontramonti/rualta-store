import { ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';import { formatPrice,salePrice } from '../utils/catalog.js';
export default function ProductCard({product,image,name,price,priceDiscount}){
 const p=product||{id:'#',image,name,price,priceDiscount,category:'Tênis',bg:'#F3F4F7',newArrival:false};
 const {favorites,toggleFavorite}=useShop();const liked=favorites.includes(p.id);const reduction=p.priceDiscount?Math.round((1-p.priceDiscount/p.price)*100):0;
 return <article className="product-card"><div className="product-visual" style={{background:p.bg||'#EEF3F8'}}>
 {reduction>0&&<span className="sale-badge">-{reduction}%</span>}{p.newArrival&&<span className="new-badge">NOVO</span>}
 <button className={`favorite-button ${liked?'favorite-button--active':''}`} onClick={()=>toggleFavorite(p.id)} aria-label={liked?`Remover ${p.name} dos favoritos`:`Favoritar ${p.name}`} title={liked?'Remover dos favoritos':'Adicionar aos favoritos'}><Heart size={19} fill={liked?'currentColor':'none'}/></button>
 <Link to={`/product/${p.id}`} className="product-image-link" aria-label={`Ver ${p.name}`}><img src={p.image} alt={`Tênis ${p.name}`} loading="lazy"/></Link><Link to={`/product/${p.id}`} className="product-quick-link" aria-label={`Ver detalhes de ${p.name}`}><ArrowUpRight size={20}/></Link></div>
 <div className="product-meta"><span>{p.category} · NOVA SPORT</span><Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link><div className="product-prices"><strong>{formatPrice(salePrice(p))}</strong>{p.priceDiscount&&<del>{formatPrice(p.price)}</del>}</div></div></article>;
}
