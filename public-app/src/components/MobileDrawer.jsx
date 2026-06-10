import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

export default function MobileDrawer({ isOpen, onClose }) {
  const location = useLocation();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActiveLink = (path) => {
    const [pathname, search] = path.split('?');
    if (location.pathname !== pathname) return false;
    
    if (!search) {
      // If checking catalog, and location has search params, it's not the generic catalog page.
      if (pathname === '/jerseys') {
        return location.search === '' || location.search === '?';
      }
      return true;
    }

    const searchParams = new URLSearchParams(search);
    const currentParams = new URLSearchParams(location.search);

    for (const [key, value] of searchParams.entries()) {
      if (currentParams.get(key) !== value) return false;
    }
    return true;
  };

  const linkClass = (path) => {
    const active = isActiveLink(path);
    return `block font-heading text-base uppercase tracking-wider py-3 px-4 transition-all duration-200 border-l-4 ${
      active
        ? 'border-charcoal bg-accent/20 text-charcoal font-extrabold'
        : 'border-transparent text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 font-semibold'
    }`;
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        className={`absolute inset-y-0 left-0 max-w-xs w-full bg-cream border-r border-charcoal/10 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-6">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-6 border-b border-charcoal/10">
            <span className="font-heading text-lg font-black uppercase tracking-widest text-charcoal">
              Menu
            </span>
            <button
              onClick={onClose}
              className="text-charcoal/70 hover:text-charcoal transition-colors p-1"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="py-4">
            <Link to="/" onClick={onClose} className={linkClass('/')}>
              Home
            </Link>
            <Link to="/jerseys" onClick={onClose} className={linkClass('/jerseys')}>
              Catalog
            </Link>

            <div className="my-4 border-t border-charcoal/10" />

            <div className="px-6 py-2">
              <span className="font-heading text-xs font-black uppercase tracking-widest text-charcoal/40">
                Categories
              </span>
            </div>
            <Link
              to="/jerseys?category=INTERNATIONAL"
              onClick={onClose}
              className={linkClass('/jerseys?category=INTERNATIONAL')}
            >
              International Jerseys
            </Link>
            <Link
              to="/jerseys?category=CLUB"
              onClick={onClose}
              className={linkClass('/jerseys?category=CLUB')}
            >
              Club Jerseys
            </Link>
            <Link
              to="/jerseys?category=SHORTS"
              onClick={onClose}
              className={linkClass('/jerseys?category=SHORTS')}
            >
              Jerseys With Shorts
            </Link>
            <Link
              to="/jerseys?category=OTHER"
              onClick={onClose}
              className={linkClass('/jerseys?category=OTHER')}
            >
              Other Sports & Merchandise
            </Link>

            <div className="my-4 border-t border-charcoal/10" />

            <div className="px-6 py-2">
              <span className="font-heading text-xs font-black uppercase tracking-widest text-charcoal/40">
                Special Collections
              </span>
            </div>
            <Link
              to="/jerseys?version=PLAYER"
              onClick={onClose}
              className={linkClass('/jerseys?version=PLAYER')}
            >
              Player Version
            </Link>
            <Link
              to="/jerseys?version=FAN"
              onClick={onClose}
              className={linkClass('/jerseys?version=FAN')}
            >
              Stadium Version
            </Link>
            <Link
              to="/jerseys?is_on_sale=Yes"
              onClick={onClose}
              className={linkClass('/jerseys?is_on_sale=Yes')}
            >
              Clearance Sale
            </Link>
          </nav>
        </div>

        {/* Footer / Branding */}
        <div className="p-6 bg-charcoal text-cream text-center font-heading text-xs font-bold tracking-widest uppercase">
          Jersey Adda
        </div>
      </div>
    </div>
  );
}
