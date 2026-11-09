import { ArrowUpRight } from 'lucide-react';import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
const items=[
 {name:'Urbano',subtitle:'Seu cenário. Sua identidade.',description:'Para quem faz das ruas uma extensão do próprio estilo.',img:products[0].image,bg:'#dcecf4'},
 {name:'Corrida',subtitle:'Tudo começa em movimento.',description:'Leveza e energia para explorar mais longe.',img:products[3].image,bg:'#e5eecf'},
 {name:'Casual',subtitle:'O conforto também tem atitude.',description:'Versatilidade que combina com qualquer plano.',img:products[7].image,bg:'#eee5ff'},
 {name:'Aventura',subtitle:'O próximo destino é seu.',description:'Para descobrir novos trajetos sem perder o ritmo.',img:products[5].image,bg:'#f5e9d9'}
];
export default function CategoriesPage(){return <div className="categories-page"><div className="container"><div className="categories-intro"><span className="eyebrow">CURADORIA NOVA SPORT</span><h1>Um estilo para<br/><em>cada caminho.</em></h1><p>Descubra as linhas da nossa coleção e encontre os tênis que acompanham a sua história.</p></div><div className="categories-page-grid">{items.map((x,i)=><Link className="categories-page-card" key={x.name} to={`/products?category=${x.name}`} style={{background:x.bg}}><span className="eyebrow">COLEÇÃO / {String(i+1).padStart(2,'0')}</span><img src={x.img} alt={`Coleção Nova Sport ${x.name}`} loading="lazy"/><div><h2>{x.name}</h2><strong>{x.subtitle}</strong><p>{x.description}</p><span>EXPLORAR COLEÇÃO <ArrowUpRight size={17}/></span></div></Link>)}</div></div></div>;}
