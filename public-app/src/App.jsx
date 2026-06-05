import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import JerseyDetailPage from './pages/JerseyDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CartDrawer from './components/CartDrawer';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jerseys" element={<CatalogPage />} />
          <Route path="/jerseys/:slug" element={<JerseyDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
