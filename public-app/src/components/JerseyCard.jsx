import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getJerseyImages } from '../utils/image';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

export default function JerseyCard({ jersey }) {
  const { addToCart } = useCart();
  const jerseySlug = jersey.slug || jersey.id;

  const images = useMemo(() => getJerseyImages(jersey), [jersey]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleAddToCart = (size) => {
    addToCart(jersey, size);
    toast.success(`${jersey.name} (Size: ${size}) added to cart!`);
  };

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      <Link to={`/jerseys/${jerseySlug}`} className="block">
        <div className="relative overflow-hidden h-64">
          {images.map((imgUrl, index) => (
            <img
              key={imgUrl}
              src={imgUrl}
              alt={jersey.name}
              className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            />
          ))}
          <div className="absolute top-2 right-2 flex flex-col space-y-1 z-10">
            {jersey.version && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
                {jersey.version}
              </span>
            )}
            {jersey.sleeve && (
              <span className="bg-blue-400 text-blue-900 text-xs font-semibold px-2 py-1 rounded-full">
                {jersey.sleeve}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
          <Link to={`/jerseys/${jerseySlug}`}>{jersey.name}</Link>
        </h3>
        <p className="text-sm text-gray-500">{jersey.team_name}</p>
        <p className="text-xl font-bold text-gray-900 my-2">
          {formatCurrency(jersey.price)}
        </p>

        <div className="mt-auto">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-600">Sizes:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {jersey.available_sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => handleAddToCart(size)}
                  className="w-8 h-8 border rounded-md text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
