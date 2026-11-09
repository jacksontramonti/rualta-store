import { Minus,Plus,ShoppingBag,Trash2,X } from 'lucide-react';import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';import { useShop } from '../context/ShopContext.jsx';import {formatPrice,salePrice} from '../utils/catalog.js';
export default function CartDrawer(){const {items,cartOpen,setCartOpen,count,total,updateQuantity,removeItem}=useShop();
 const drawerRef=useRef(null);
 useEffect(()=>{
   if(!cartOpen)return;
   const previous=document.activeElement;
   const oldOverflow=document.body.style.overflow;
   document.body.style.overflow='hidden';
   drawerRef.current?.querySelector('button')?.focus();
   const handleKeyDown=e=>{
     if(e.key==='Escape'){setCartOpen(false);return;}
     if(e.key!=='Tab')return;
     const focusables=[...drawerRef.current.querySelectorAll('a[href],button:not([disabled]),input,select,[tabindex]:not([tabindex="-1"])')];
     if(!focusables.length)return;
     const first=focusables[0],last=focusables[focusables.length-1];
     if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   };
   document.addEventListener('keydown',handleKeyDown);
   return()=>{document.removeEventListener('keydown',handleKeyDown);document.body.style.overflow=oldOverflow;previous?.focus?.();};
 },[cartOpen,setCartOpen]);
 if(!cartOpen)return null;
 return <div className="cart-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)setCartOpen(false);}}><aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Seu carrinho" className="cart-drawer"><div className="drawer-heading"><div><span className="eyebrow">SEUS ESCOLHIDOS</span><h2>Seu carrinho <small>({count})</small></h2></div><button aria-label="Fechar carrinho" className="drawer-close" onClick={()=>setCartOpen(false)}><X/></button></div>
 <div className="cart-drawer-body">{items.length?items.map(item=><article className="cart-row" key={item.key}><Link to={`/product/${item.id}`} onClick={()=>setCartOpen(false)} className="cart-row-photo" style={{background:item.product.bg}}><img src={item.product.image} alt={item.product.name}/></Link><div className="cart-row-data"><h3>{item.product.name}</h3><span>Tam. {item.size} <i style={{backgroundColor:item.color}}/> </span><strong>{formatPrice(salePrice(item.product)*item.quantity)}</strong><div className="qty-row"><button aria-label="Diminuir" onClick={()=>updateQuantity(item.key,item.quantity-1)}><Minus size={15}/></button><span>{item.quantity}</span><button aria-label="Aumentar" onClick={()=>updateQuantity(item.key,item.quantity+1)}><Plus size={15}/></button><button aria-label="Remover" className="qty-remove" onClick={()=>removeItem(item.key)}><Trash2 size={16}/></button></div></div></article>):<div className="cart-empty"><ShoppingBag size={44}/><h3>Nada por aqui ainda</h3><p>Seu novo favorito está a um clique de distância.</p><Link to="/products" onClick={()=>setCartOpen(false)} className="primary-button">Explorar tênis</Link></div>}</div>
 {items.length>0&&<div className="drawer-total"><div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><p>Carrinho demonstrativo. Não há compra, pagamento ou envio real.</p><button className="primary-button" onClick={()=>setCartOpen(false)}>Continuar explorando ↗</button></div>}</aside></div>;
}
