import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import Logo from './Logo.jsx';
const links=[['/','Início'],['/products','Explorar'],['/categories','Coleções'],['/orders','Meus pedidos']];
export default function Header(){
 const [search,setSearch]=useState('');const [menuOpen,setMenuOpen]=useState(false);const navigate=useNavigate();const location=useLocation();
 const {count,favorites,setCartOpen}=useShop();
 useEffect(()=>{setMenuOpen(false);setSearch(new URLSearchParams(location.search).get('filter')||'');},[location.pathname,location.search]);
 function submit(e){e.preventDefault();const q=search.trim();navigate(q?`/products?filter=${encodeURIComponent(q)}`:'/products');}
 return <>
  <div className="announcement"><span className="announcement-spark">✳</span> FRETE GRÁTIS A PARTIR DE R$ 299 <span className="announcement-separator">/</span> NOVA COLEÇÃO DISPONÍVEL</div>
  <header className="site-header"><div className="container header-inner">
   <Logo/>
   <form onSubmit={submit} className="header-search" role="search"><input type="search" placeholder="Qual é o seu próximo passo?" aria-label="Buscar tênis" value={search} onChange={e=>setSearch(e.target.value)}/><button type="submit" aria-label="Buscar"><Search size={20}/></button></form>
   <div className="header-actions"><Link className="header-account" to="/login" aria-label="Minha conta"><UserRound size={22}/><span>Minha conta</span></Link><Link className="icon-action" to="/favorites" aria-label={`Favoritos: ${favorites.length}`}><Heart size={23}/>{favorites.length>0&&<span className="icon-count">{favorites.length}</span>}</Link><button className="icon-action" onClick={()=>setCartOpen(true)} aria-label={`Abrir carrinho com ${count} itens`}><ShoppingBag size={23}/>{count>0&&<span className="icon-count">{count}</span>}</button></div>
   <button className="mobile-menu-button" aria-expanded={menuOpen} aria-label={menuOpen?'Fechar menu':'Abrir menu'} onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X/>:<Menu/>}</button>
  </div><div className="header-nav-wrap"><nav className={`container main-nav ${menuOpen?'main-nav--open':''}`} aria-label="Navegação principal">{links.map(([to,label])=><NavLink to={to} key={to} end={to==='/'} className={({isActive})=>`nav-link ${isActive?'nav-link--active':''}`}>{label}</NavLink>)}<Link className="nav-tag" to="/products?sort=popular">DROP / 2026 <span>↗</span></Link></nav></div>
  </header>
 </>;
}
