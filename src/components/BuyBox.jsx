import { Check, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';import { useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';import { formatPrice,salePrice } from '../utils/catalog.js';
import ProductOptions from './ProductOptions.jsx';
export default function BuyBox({product,name,reference,stars,rating,price,priceDiscount,description,children}){
 const p=product||{name,reference,rating:stars,reviews:rating,price,priceDiscount,description,sizes:[36,37,38,39,40,41,42,43],colors:['#162438','#C9F564']};
 const [size,setSize]=useState(null);const [color,setColor]=useState(p.colors[0]);const [message,setMessage]=useState('');const {addToCart}=useShop();
 function buy(){if(!size){setMessage('Selecione um tamanho antes de continuar.');return;}setMessage('');addToCart(p,{size,color});}
 return <div className="buy-box"><span className="eyebrow">RUALTA / {p.category||'EDIÇÃO ESPECIAL'}</span><h1>{p.name}</h1><div className="product-ref">REF. {p.reference} <span>·</span> ORIGINAL RUALTA</div>
 <div className="rating"><span className="rating-stars"><Star size={17} fill="currentColor"/> {p.rating}</span><span>{p.reviews} avaliações na loja conceito</span></div>
 <div className="buy-prices"><strong>{formatPrice(salePrice(p))}</strong>{p.priceDiscount&&<del>{formatPrice(p.price)}</del>}</div><p className="buy-description">{p.description}</p>
 <div className="purchase-options"><div className="purchase-option-heading"><strong>Escolha o tamanho</strong><span>Guia BR</span></div><ProductOptions options={p.sizes} value={size} onChange={v=>{setSize(v);setMessage('');}}/>
 <div className="purchase-option-heading"><strong>Escolha a cor</strong><span>3 opções</span></div><ProductOptions type="color" shape="circle" options={p.colors} value={color} onChange={setColor}/>{children}</div>
 {message&&<p role="alert" className="input-message">{message}</p>}
 <button type="button" className="buy-button" onClick={buy}>ADICIONAR AO CARRINHO <span>↗</span></button>
 <div className="buy-trust"><span><Truck size={19}/> Frete simulado</span><span><RotateCcw size={19}/> Trocas demonstrativas</span><span><ShieldCheck size={19}/> Checkout não integrado</span></div>
 </div>;
}
