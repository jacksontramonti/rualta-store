
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CartDrawer from '../components/CartDrawer.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
