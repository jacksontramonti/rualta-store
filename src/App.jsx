import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductListingPage from './pages/ProductListingPage.jsx';
import ProductViewPage from './pages/ProductViewPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import InfoPage from './pages/InfoPage.jsx';
export default function App(){return <Layout><Routes>
<Route path="/" element={<HomePage/>}/>
<Route path="/products" element={<ProductListingPage/>}/>
<Route path="/produtos" element={<Navigate to="/products" replace/>}/>
<Route path="/categories" element={<CategoriesPage/>}/>
<Route path="/product/:id" element={<ProductViewPage/>}/>
<Route path="/favorites" element={<FavoritesPage/>}/>
<Route path="/orders" element={<InfoPage title="Meus pedidos" description="Este é um projeto demonstrativo. Para acompanhar pedidos reais, seria necessário integrar um serviço de pagamento e uma API."/>}/>
<Route path="/login" element={<InfoPage title="Entrar na RUALTA" description="O acesso à conta é uma simulação visual. O aplicativo não armazena senhas nem dados pessoais."/>}/>
<Route path="/register" element={<InfoPage title="Crie sua conta" description="O cadastro ficará disponível quando a loja possuir um serviço seguro de autenticação."/>}/>
<Route path="*" element={<InfoPage title="Página não encontrada" description="Esse caminho não existe. O próximo passo é encontrar seu novo tênis favorito."/>}/>
</Routes></Layout>;}
