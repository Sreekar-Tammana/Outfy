
import React from 'react';
import { ShoppingBag, User, Sparkles, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 shadow-xl relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">V-TRY</h1>
        </div>
        <button className="relative">
          <ShoppingBag size={24} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex justify-around items-center py-3 px-6 z-50">
        <NavButton 
          icon={<Home size={22} />} 
          label="Home" 
          active={activeTab === 'home'} 
          onClick={() => onTabChange('home')} 
        />
        <NavButton 
          icon={<Sparkles size={22} />} 
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
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-black' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
  </button>
);

export default Layout;
