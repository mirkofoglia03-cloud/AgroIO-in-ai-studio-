import React from 'react';
import { NAV_ITEMS } from '../constants';
import type { NavItemType, User, SubscriptionPlan } from '../types';
import { isFeatureAllowed } from '../lib/utils';
import { LockIcon } from './Icons';

interface SidebarProps {
  activeView: NavItemType;
  onNavClick: (view: NavItemType, tab?: string | null) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onProfileClick: () => void;
  user: User;
  plan: SubscriptionPlan;
  onLogout: () => void;
}

// =================================================================
// SIDEBAR COMPONENT
// =================================================================

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavClick, isOpen, setOpen, onProfileClick, user, plan, onLogout }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky lg:top-0 z-40 flex flex-col h-full lg:h-screen bg-agro-green text-agro-white w-64 self-start transition-all duration-300 ease-in-out ${isOpen ? 'left-0' : '-left-64'} lg:left-0`}>
        {/* <!-- Logo and App Name --> */}
        <div className="flex items-center justify-center h-20 border-b border-agro-green-light flex-shrink-0">
          <svg className="w-10 h-10 text-agro-beige" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
          <h1 className="text-2xl font-bold ml-2">AgroIO</h1>
        </div>
        
        {/* <!-- Navigation Links --> */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto hide-scrollbar min-h-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.name;
            const isAllowed = isFeatureAllowed(item.plan, plan);

            if (!isAllowed) {
              return (
                 <a
                  key={item.name}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick('Upgrade');
                  }}
                  className="flex items-center px-4 py-3 rounded-lg text-agro-beige/50 cursor-pointer"
                  title={`Esegui l'upgrade al piano ${item.plan} per sbloccare`}
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  <span className="text-sm flex-1">{item.name}</span>
                  <LockIcon className="w-4 h-4" />
                </a>
              )
            }

            return (
              <a
                key={item.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.name);
                }}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-agro-green-light text-white font-semibold'
                    : 'text-agro-beige hover:bg-agro-green-light hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span className="text-sm">{item.name}</span>
              </a>
            );
          })}
        </nav>
        
        {/* <!-- User Profile Section --> */}
        <div className="p-4 border-t border-agro-green-light flex-shrink-0">
          <button 
            onClick={onProfileClick}
            className="flex items-center w-full text-left p-2 rounded-lg hover:bg-agro-green-light transition-colors"
          >
            <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <p className="text-sm font-semibold text-agro-white truncate">{user.name} {user.surname}</p>
              <p className="text-xs text-agro-beige capitalize">{plan} Plan</p>
            </div>
          </button>
           <button 
            onClick={onLogout}
            className="w-full text-center text-xs text-agro-beige/70 hover:text-agro-beige mt-2 underline"
          >
            Esci
          </button>
        </div>
      </aside>
    </>
  );
};