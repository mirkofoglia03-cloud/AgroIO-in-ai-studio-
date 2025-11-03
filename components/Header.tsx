
import React from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  title: string;
  icon: React.ReactNode;
  onMenuClick: () => void;
}

// =================================================================
// HEADER COMPONENT
// =================================================================
export const Header: React.FC<HeaderProps> = ({ title, icon, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-20 px-4 md:px-8 bg-agro-white border-b border-agro-gray">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden mr-4 p-2 rounded-full hover:bg-agro-gray-light">
          <MenuIcon className="w-6 h-6 text-agro-brown" />
        </button>
        {icon && <span className="text-agro-green mr-3">{icon}</span>}
        <h2 className="text-2xl font-bold text-agro-green">{title}</h2>
      </div>
      <div className="flex items-center">
        {/* Add actions like notifications or search here */}
      </div>
    </header>
  );
};
