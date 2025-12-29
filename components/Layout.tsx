
import React from 'react';
import { ShoppingBag, User, Sparkles, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 shadow-xl relative overflow-hidden">
      {/* Header - Fixed with Blur */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center safe-top">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter">OUTFY</h1>
        </div>
        <button className="relative active:scale-90 transition-transform p-2">
          <ShoppingBag size={24} strokeWidth={1.5} />
          <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 pb-32 overflow-y-auto hide-scrollbar smooth-scroll">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center pt-3 pb-8 px-6 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <NavButton 
          icon={<Home size={22} />} 
          label="Shop" 
          active={activeTab === 'home'} 
          onClick={() => onTabChange('home')} 
        />
        <NavButton 
          icon={<Sparkles size={26} />} 
          label="Try-On" 
          active={activeTab === 'tryon'} 
          onClick={() => onTabChange('tryon')} 
        />
        <NavButton 
          icon={<User size={22} />} 
          label="Profile" 
          active={activeTab === 'profile'} 
          onClick={() => onTabChange('profile')} 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${active ? 'text-black' : 'text-gray-300'}`}
  >
    <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

export default Layout;
