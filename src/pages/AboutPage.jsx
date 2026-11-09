import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="about-page container">
      <span className="eyebrow">NOVA SPORT / NOSSA IDENTIDADE</span>
      <h1>O esporte é o começo.<br /><em>O movimento é seu.</em></h1>
      <p>A NOVA SPORT é uma loja conceito criada para demonstrar uma experiência de compra moderna, com navegação intuitiva, produtos originais e estilo próprio.</p>
      <p>Todos os modelos, avaliações e preços são fictícios. Não realizamos vendas nem coletamos dados de pagamento neste projeto de estudo.</p>
      <div className="about-note"><ShieldCheck size={22}/><span>Projeto demonstrativo desenvolvido com React, Vite e CSS responsivo.</span></div>
      <Link to="/products" className="primary-button">Explorar coleção <ArrowUpRight size={18}/></Link>
    </div>
  );
}