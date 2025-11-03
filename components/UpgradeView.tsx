import React from 'react';
import type { SubscriptionPlan } from '../types';
import { SparklesIcon } from './Icons';

interface UpgradeViewProps {
  plan: SubscriptionPlan;
}

const getUpgradeSuggestion = (plan: SubscriptionPlan) => {
    switch (plan) {
        case 'Gratis':
            return {
                targetPlan: 'Pro',
                message: "Passa al piano Pro per sbloccare la gestione dei raccolti, la diagnosi AI delle piante con l'AgroGiardiniere, l'accesso alla community e il marketplace e-commerce!",
            };
        case 'Pro':
            return {
                targetPlan: 'Business',
                message: "Fai il salto di qualità con il piano Business! Ottieni l'accesso alla progettazione avanzata dell'orto con l'IA e alla gestione completa del cash flow.",
            };
        default:
            return {
                targetPlan: '',
                message: 'Hai già accesso a tutte le funzionalità!',
            };
    }
}

export const UpgradeView: React.FC<UpgradeViewProps> = ({ plan }) => {
    const suggestion = getUpgradeSuggestion(plan);

    return (
        <div className="flex flex-col items-center justify-center text-center h-full bg-agro-white p-8 rounded-xl shadow-md">
            <SparklesIcon className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-3xl font-bold text-agro-green">Sblocca il Tuo Potenziale</h2>
            <p className="text-agro-brown mt-2 font-serif text-lg max-w-2xl">{suggestion.message}</p>
            {suggestion.targetPlan && (
                <button className="mt-8 bg-agro-green text-white font-bold py-3 px-8 rounded-lg hover:bg-agro-green-light transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Upgrade al Piano {suggestion.targetPlan}
                </button>
            )}
        </div>
    );
};
