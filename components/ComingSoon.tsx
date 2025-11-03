
import React from 'react';

interface ComingSoonProps {
  pageTitle: string;
}

// =================================================================
// COMING SOON PLACEHOLDER COMPONENT
// =================================================================
export const ComingSoon: React.FC<ComingSoonProps> = ({ pageTitle }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-agro-white rounded-xl shadow-md p-8">
      <div className="text-6xl mb-4">🏗️</div>
      <h2 className="text-4xl font-bold text-agro-green mb-2">{pageTitle}</h2>
      <p className="text-xl text-agro-brown font-serif">Questa funzionalità è in arrivo!</p>
      <p className="mt-4 max-w-md text-gray-600">
        Stiamo lavorando duramente per offrirti nuovi strumenti per migliorare la gestione della tua azienda agricola.
        Resta sintonizzato per futuri aggiornamenti.
      </p>
    </div>
  );
};
