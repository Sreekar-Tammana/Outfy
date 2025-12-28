
import React, { useState } from 'react';
import Layout from './components/Layout';
import TryOnExperience from './components/TryOnExperience';
import { ShoppingBag, Star, ChevronRight, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative h-[450px] overflow-hidden">
              <img 
                src="https://picsum.photos/800/1200?fashion=1" 
                alt="New Collection" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 opacity-80">New Season 2024</span>
                <h2 className="text-4xl font-light tracking-tight mb-4 leading-tight">Summer<br/><span className="font-bold">Expressions</span></h2>
                <button 
                  onClick={() => setActiveTab('tryon')}
                  className="bg-white text-black px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 w-max"
                >
                  Start Fitting <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Collections */}
            <section className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold tracking-tight">Trending Now</h3>
                <TrendingUp size={20} className="text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[2, 3, 4, 5].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3 relative">
                      <img 
                        src={`https://picsum.photos/400/600?fashion=${i}`} 
                        alt="Product" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <button className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Classic Linen Set</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} fill="currentColor" className="text-yellow-400" />
                      <span className="text-[10px] text-gray-500 font-bold">4.9 (124 reviews)</span>
                    </div>
                    <p className="text-sm font-bold text-black mt-1">$124.00</p>
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
          <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
             <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                <span className="text-3xl">👋</span>
             </div>
             <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
             <p className="text-gray-500 text-sm max-w-xs mb-8">Login to save your AI try-on sessions and view your wishlist.</p>
             <button className="w-full py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs">
               Sign In / Join
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
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-out forwards;
          }
          .animate-slide-up {
            animation: slide-up 0.4s ease-out forwards;
          }
        `}
      </style>
      {renderContent()}
    </Layout>
  );
};

export default App;
