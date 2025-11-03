import React from 'react';
import type { SubscriptionPlan } from '../types';
import { CheckIcon } from './Icons';

interface SubscriptionProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const PlanCard: React.FC<{
  plan: SubscriptionPlan;
  title: string;
  price: string;
  period: string;
  features: string[];
  isRecommended?: boolean;
  onSelect: () => void;
}> = ({ plan, title, price, period, features, isRecommended, onSelect }) => {
  return (
    <div className={`border rounded-xl p-6 flex flex-col ${isRecommended ? 'border-agro-green-light shadow-2xl scale-105' : 'border-agro-gray bg-white'}`}>
      {isRecommended && <div className="text-center text-sm font-bold text-white bg-agro-green-light py-1 px-4 rounded-full -mt-9 mx-auto">Consigliato</div>}
      <h3 className="text-2xl font-bold text-agro-green text-center mt-4">{title}</h3>
      <p className="text-center text-agro-brown mt-2">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-lg">/{period}</span>
      </p>
      <ul className="mt-6 space-y-3 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-agro-brown">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`w-full mt-8 py-3 rounded-lg font-bold transition-colors ${isRecommended ? 'bg-agro-green text-white hover:bg-agro-green-light' : 'bg-agro-gray text-agro-brown hover:bg-agro-beige'}`}
      >
        Inizia con {title}
      </button>
    </div>
  );
};

export const Subscription: React.FC<SubscriptionProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-agro-gray-light flex flex-col items-center justify-center p-4">
      <header className="text-center mb-10">
        <svg className="w-16 h-16 text-agro-green mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
        <h1 className="text-4xl font-bold text-agro-green">Benvenuto in AgroIO</h1>
        <p className="text-agro-brown mt-2 font-serif text-lg">Scegli il piano più adatto alle tue esigenze.</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <PlanCard
          plan="Gratis"
          title="Gratis"
          price="€0"
          period="mese"
          features={[
            'Gestione Ortaggi',
            'Check List attività',
            'Previsioni Meteo',
            'Accesso alle FAQ'
          ]}
          onSelect={() => onSelectPlan('Gratis')}
        />
        <PlanCard
          plan="Pro"
          title="Pro"
          price="€15"
          period="mese"
          features={[
            'Tutte le funzionalità Gratis',
            'Gestione Raccolti',
            'AgroGiardiniere (Diagnosi AI)',
            'Accesso alla Community',
            'Marketplace E-Commerce',
          ]}
          isRecommended
          onSelect={() => onSelectPlan('Pro')}
        />
        <PlanCard
          plan="Business"
          title="Business"
          price="€40"
          period="mese"
          features={[
            'Tutte le funzionalità Pro',
            'Progettazione Orto con AI',
            'Gestione Cash Flow (Entrate/Uscite)',
            'Supporto prioritario',
          ]}
          onSelect={() => onSelectPlan('Business')}
        />
      </main>
    </div>
  );
};
