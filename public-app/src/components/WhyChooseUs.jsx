import React from 'react';
import { ShieldCheck, Truck, MessageCircle } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-600" />,
      title: 'Premium Quality Jerseys',
      description: 'Authentic feel, breathable fabrics, and durable prints. Available in both Player and Fan versions to suit your style.'
    },
    {
      icon: <Truck className="w-8 h-8 text-brand-600" />,
      title: 'Fast & Reliable Delivery',
      description: 'We ensure quick dispatch and secure packaging so your jersey reaches you in perfect condition, ready for matchday.'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-brand-600" />,
      title: 'Secure Ordering via WhatsApp',
      description: 'Personalized customer service. Browse our catalog and finalize your order securely through a direct WhatsApp chat.'
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why Choose Jersey Adda?</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We are dedicated to providing football fans with the best merchandise experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
