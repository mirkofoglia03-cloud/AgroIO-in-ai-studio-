import React from 'react';
import { CloseIcon, CreditCardIcon, GlobeAltIcon, UserCircleIcon, PencilIcon } from './Icons';
import type { User, SubscriptionPlan } from '../types';

interface ProfileModalProps {
  onClose: () => void;
  user: User;
  plan: SubscriptionPlan;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, user, plan }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-agro-gray">
          <h2 className="text-2xl font-bold text-agro-green">Profilo & Impostazioni</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
            <CloseIcon className="w-6 h-6 text-agro-brown" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Subscription Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-agro-brown flex items-center"><CreditCardIcon className="w-5 h-5 mr-2" />Il Tuo Abbonamento</h3>
            <div className="bg-agro-gray-light p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-agro-green">Piano {plan}</p>
                  <p className="text-sm text-gray-600">Scade il: 31/12/2024</p>
                </div>
                <button className="bg-agro-green text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-agro-green-light transition-colors">
                  Gestisci
                </button>
              </div>
            </div>
          </div>
          
          {/* Settings Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-agro-brown flex items-center"><GlobeAltIcon className="w-5 h-5 mr-2" />Impostazioni</h3>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Lingua</label>
              <select id="language" name="language" className="w-full px-3 py-2 border border-agro-gray rounded-lg bg-white focus:outline-none focus:ring-agro-green-light focus:border-agro-green-light">
                <option>Italiano</option>
                <option disabled>English (coming soon)</option>
              </select>
            </div>
          </div>

          {/* User Data Section */}
          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-agro-brown flex items-center"><UserCircleIcon className="w-5 h-5 mr-2" />I Tuoi Dati</h3>
             <div className="bg-agro-gray-light p-4 rounded-lg space-y-2">
                <p><span className="font-semibold text-gray-700">Nome:</span> {user.name} {user.surname}</p>
                <p><span className="font-semibold text-gray-700">Email:</span> {user.email}</p>
                <button className="flex items-center text-sm text-agro-green-light font-semibold hover:text-agro-green mt-2">
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Modifica Dati
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
