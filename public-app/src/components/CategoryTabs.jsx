import React from 'react';

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  const tabs = [
    { id: 'INTERNATIONAL', label: 'International Teams' },
    { id: 'CLUB', label: 'Club Jerseys' },
    { id: 'SHORTS', label: 'Jerseys With Shorts' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 mt-8 sticky top-[138px] z-30 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${isActive 
                    ? 'border-brand-600 text-brand-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
