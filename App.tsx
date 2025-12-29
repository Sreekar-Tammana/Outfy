
import React, { useState } from 'react';
import Layout from './components/Layout';
import TryOnExperience from './components/TryOnExperience';
import { ShoppingBag, Star, ChevronRight, TrendingUp, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const trendingItems = [
    { id: 1, name: "Zudio Relaxed Shirt", brand: "Zudio", price: "₹799", rating: "4.8", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&h=533&auto=format&fit=crop" },
    { id: 2, name: "H&M Oversized Tee", brand: "H&M", price: "₹1,299", rating: "4.9", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&h=533&auto=format&fit=crop" },
    { id: 3, name: "Westside Floral Kurta", brand: "Westside", price: "₹1,499", rating: "4.7", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&h=533&auto=format&fit=crop" },
    { id: 4, name: "Zudio Cargo Pants", brand: "Zudio", price: "₹999", rating: "4.8", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&h=533&auto=format&fit=crop" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in">
            {/* Main Brand Banner */}
            <div className="relative h-[480px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop" 
                alt="Trending Brands" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <div className="flex items-center gap-2 mb-3 bg-white/20 backdrop-blur-lg w-max px-3 py-1 rounded-full">
                  <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Latest Drops</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4 leading-[0.9]">H&M × ZUDIO<br/><span className="text-gray-400">SUMMER FEST</span></h2>
                <p className="text-sm text-gray-300 font-medium mb-6 max-w-[250px]">Try the hottest trends from top brands virtually before you buy.</p>
                <button 
                  onClick={() => setActiveTab('tryon')}
                  className="bg-white text-black px-8 py-4 rounded-full text-xs font-black tracking-widest uppercase inline-flex items-center gap-3 w-max shadow-2xl active:scale-95 transition-transform"
                >
                  Go to Try-On <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Brand Chips */}
            <div className="flex gap-3 px-6 py-6 overflow-x-auto hide-scrollbar smooth-scroll bg-white">
              {['H&M', 'Zudio', 'Westside', 'Zara', 'Pantaloons', 'Uniqlo'].map((brand) => (
                <button key={brand} className="flex-shrink-0 px-5 py-2.5 rounded-full border border-gray-100 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:border-black transition-colors active:scale-95">
                  {brand}
                </button>
              ))}
            </div>

            {/* Trending Collection */}
            <section className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6 px-1">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Top Trending</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected from H&M, Zudio & more</p>
                </div>
                <TrendingUp size={20} className="text-black" />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {trendingItems.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 mb-3 relative shadow-sm ring-1 ring-gray-100">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[8px] font-black tracking-[0.1em] text-black">
                        {item.brand}
                      </div>
                      <button className="absolute bottom-4 right-4 p-3 bg-black text-white rounded-2xl shadow-xl active:scale-90 transition-transform">
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                    <div className="px-1">
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-sm font-bold text-black">{item.price}</p>
                        <div className="flex items-center gap-1">
                          <Star size={10} fill="currentColor" className="text-yellow-400" />
                          <span className="text-[9px] text-gray-400 font-black">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'tryon':
        return <TryOnExperience />;
      case 'profile':
        return (
          <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
             <div className="w-24 h-24 rounded-full bg-black mb-6 flex items-center justify-center shadow-2xl">
                <span className="text-3xl">✨</span>
             </div>
             <h2 className="text-3xl font-black tracking-tighter mb-2">My Outfy</h2>
             <p className="text-gray-500 text-sm max-w-[240px] mb-10 font-medium">Log in to save your fitting room results and brand favorites.</p>
             <button className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-transform">
               Connect Profile
             </button>
             <button className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               Need Help?
             </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-slide-up {
            animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>
      {renderContent()}
    </Layout>
  );
};

export default App;
