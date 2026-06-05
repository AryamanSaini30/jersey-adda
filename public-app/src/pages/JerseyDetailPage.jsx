import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJerseyBySlug } from '../api/jerseys';
import { getJerseyImages } from '../utils/image';
import { formatCurrency } from '../utils/currency';
import { normalizeSizes, defaultJerseySizes } from '../utils/sizes';
import { useCart } from '../context/CartContext';
import SizeChartModal from '../components/SizeChartModal';
import { ArrowLeft, Check, Truck, ShieldCheck, MessageCircle, ShoppingBag, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JerseyDetailPage() {
  const { slug } = useParams();
  const [jersey, setJersey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { addToCart } = useCart();
  const [whatsappNumber, setWhatsappNumber] = useState("+1234567890"); // Default fallback

  const images = getJerseyImages(jersey);
  const sizes = useMemo(() => {
    const normalized = normalizeSizes(jersey?.available_sizes);
    return normalized.length > 0 ? normalized : defaultJerseySizes;
  }, [jersey]);

  useEffect(() => {
    let active = true;
    async function fetchJersey() {
      setLoading(true);
      setError('');
      try {
        const response = await getJerseyBySlug(slug);
        if (!active) return;
        setJersey(response.data);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load jersey details');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchJersey();
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    let active = true;
    async function fetchSettings() {
      try {
        const apiUrl = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) 
          || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
          || '/api';
        const response = await fetch(`${apiUrl}/settings`);
        if (response.ok) {
          const data = await response.json();
          const number = data?.data?.whatsapp_number || data?.whatsapp_number;
          if (active && number) {
            setWhatsappNumber(number);
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    }
    fetchSettings();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (sizes.length > 0) {
      setSelectedSize((current) => (sizes.includes(current) ? current : sizes[0]));
    }
  }, [sizes]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size first.');
      return;
    }

    addToCart(jersey, selectedSize);
    toast.success(`${jersey.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !jersey) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 mb-6">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error || 'Jersey not found.'}</p>
        </div>
        <Link to="/jerseys" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  // WhatsApp ordering info
  const message = `Hi! I want to order the "${jersey.name}" (Slug: ${jersey.slug}). Price: ${formatCurrency(jersey.price)}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb / Back */}
        <nav className="mb-8">
          <Link to="/jerseys" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 shrink-0 pb-2 lg:pb-0 hide-scrollbar">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                  className={`relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border-2 transition-all ${
                    activeImage === index ? 'border-brand-600 ring-2 ring-brand-600/20' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-grow bg-gray-50 rounded-3xl overflow-hidden aspect-[4/5] border border-gray-100">
              <img 
                src={images[activeImage]} 
                alt={jersey.name} 
                className="w-full h-full object-cover object-center"
              />
              {jersey.version_type && (
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 text-sm font-bold bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-md uppercase tracking-wider">
                    {jersey.version_type} VERSION
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0 px-2 sm:px-0 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-sm font-bold tracking-widest text-brand-600 uppercase mb-2">{jersey.team_name}</h2>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{jersey.name}</h1>
              <div className="flex items-center">
                <p className="text-3xl font-black text-gray-900">{formatCurrency(jersey.price || 0)}</p>
              </div>
            </div>

            <div className="prose prose-sm sm:prose text-gray-500 mb-8">
              <p className="text-base leading-relaxed">{jersey.description || 'Experience the game with this premium quality football jersey, designed for true fans and players alike.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">League</p>
                <p className="font-bold text-gray-900">{jersey.league_name || 'International'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Sleeve</p>
                <p className="font-bold text-gray-900">{jersey.sleeve_type === 'HALF' ? 'Half Sleeve' : 'Full Sleeve'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Version</p>
                <p className="font-bold text-gray-900">{jersey.version_type || 'Standard'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Shorts</p>
                <p className="font-bold text-gray-900">{jersey.has_shorts ? 'Included' : 'Not Included'}</p>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold tracking-widest text-brand-600 uppercase">Select Size</h3>
                <button
                  type="button"
                  onClick={() => setShowSizeChart(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Ruler className="h-4 w-4" />
                  View Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-14 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                      selectedSize === size
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-brand-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 font-bold text-white transition hover:bg-gray-800"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => setShowSizeChart(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-5 py-4 font-bold text-gray-800 transition hover:border-brand-500 hover:text-brand-600"
                >
                  <Ruler className="h-5 w-5" />
                  View Size Chart
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-8 border-t border-gray-200">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-lg shadow-[#25D366]/20 transition-all transform hover:-translate-y-1"
              >
                <MessageCircle className="w-6 h-6" />
                Order via WhatsApp
              </a>
              <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> Stock verified manually upon order.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <ShieldCheck className="w-5 h-5 text-brand-600" /> Premium Quality
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <Truck className="w-5 h-5 text-brand-600" /> Fast Delivery
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeChartModal open={showSizeChart} onClose={() => setShowSizeChart(false)} />
    </main>
  );
}
