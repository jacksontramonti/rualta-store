import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products.js';
import { salePrice } from '../utils/catalog.js';
const ShopContext = createContext(null);
const CART_KEY='nova-sport-cart-v1';
const FAVORITES_KEY='nova-sport-favorites-v1';
function read(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:fallback;}catch{return fallback;}}
export function ShopProvider({children}){
  const [cart,setCart]=useState(()=>read(CART_KEY,[]));
  const [favorites,setFavorites]=useState(()=>read(FAVORITES_KEY,[]));
  const [cartOpen,setCartOpen]=useState(false);
  useEffect(()=>{try{localStorage.setItem(CART_KEY,JSON.stringify(cart));}catch{}},[cart]);
  useEffect(()=>{try{localStorage.setItem(FAVORITES_KEY,JSON.stringify(favorites));}catch{}},[favorites]);
  function addToCart(product,{size=40,color=product.colors[0]}={}){
    const key=`${product.id}_${size}_${color}`;
    setCart(current=>{
      const item=current.find(i=>i.key===key);
      return item?current.map(i=>i.key===key?{...i,quantity:i.quantity+1}:i):[...current,{key,id:product.id,size,color,quantity:1}];
    });
    setCartOpen(true);
  }
  function updateQuantity(key,quantity){setCart(current=>quantity<1?current.filter(i=>i.key!==key):current.map(i=>i.key===key?{...i,quantity}:i));}
  function removeItem(key){setCart(current=>current.filter(i=>i.key!==key));}
  function toggleFavorite(id){setFavorites(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);}
  const items=cart.map(i=>({...i,product:getProductById(i.id)})).filter(i=>i.product);
  const count=items.reduce((n,i)=>n+i.quantity,0);
  const total=items.reduce((n,i)=>n+salePrice(i.product)*i.quantity,0);
  const value=useMemo(()=>({items,count,total,favorites,cartOpen,setCartOpen,addToCart,removeItem,updateQuantity,toggleFavorite}),[cart,favorites,cartOpen]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
export function useShop(){const ctx=useContext(ShopContext);if(!ctx)throw new Error('useShop precisa estar em ShopProvider');return ctx;}
