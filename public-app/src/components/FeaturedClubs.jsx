import React from 'react';
import { Link } from 'react-router-dom';

const clubs = [
  {
    id: 'BARCELONA',
    name: 'FC Barcelona',
    bgImage: 'https://res.cloudinary.com/dlnf5iam6/image/upload/v1780696434/barca_zobf0w.jpg',
    color: 'from-blue-950/80 to-red-900/80',
    logo: 'BARCA',
  },
  {
    id: 'REAL_MADRID',
    name: 'Real Madrid',
    bgImage: 'https://res.cloudinary.com/dlnf5iam6/image/upload/v1780696434/madrid_s8pzsx.jpg',
    color: 'from-gray-950/80 to-slate-900/80',
    logo: 'MADRID',
  },
  {
    id: 'MAN_UNITED',
    name: 'Manchester United',
    bgImage: 'https://res.cloudinary.com/dlnf5iam6/image/upload/v1780696434/united_u9rups.jpg',
    color: 'from-red-950/80 to-black/80',
    logo: 'UNITED',
  },
  {
    id: 'AC_MILAN',
    name: 'AC Milan',
    bgImage: 'https://res.cloudinary.com/dlnf5iam6/image/upload/v1780696434/milan_mujfq4.jpg',
    color: 'from-red-950/85 to-black/85',
    logo: 'MILAN',
  }
];

export default function FeaturedClubs() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Shop by Club</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Find the latest kits from Europe's most prestigious football clubs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <Link 
              key={club.id} 
              to={`/jerseys?club=${encodeURIComponent(club.id)}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out" 
                style={{ backgroundImage: `url(${club.bgImage})` }}
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${club.color} group-hover:opacity-90 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center z-10">
                <h3 className="text-2xl font-extrabold text-white tracking-wide group-hover:text-yellow-400 transition-all duration-300 transform group-hover:scale-105">
                  {club.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
