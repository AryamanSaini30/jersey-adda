import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <BrandLogo />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 hover:text-brand-600 font-medium transition-colors">Home</Link>
            <Link to="/jerseys" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Catalog</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-900">
              <Search size={24} />
            </button>
            <button onClick={toggleCart} className="relative text-gray-500 hover:text-gray-900">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-500 hover:text-gray-900">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-900 hover:text-brand-600 font-medium py-2 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/jerseys" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-600 hover:text-brand-600 font-medium py-2 transition-colors"
          >
            Catalog
          </Link>
        </nav>
      )}
    </header>
  );
}
