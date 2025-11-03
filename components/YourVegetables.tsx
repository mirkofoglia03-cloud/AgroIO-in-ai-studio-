import React, { useState } from 'react';
import { MOCK_VEGETABLES } from '../constants';
import type { Vegetable } from '../types';
import { AddVegetableModal } from './AddVegetableModal';
import { VegetableDetailModal } from './VegetableDetailModal';
import { PlusIcon } from './Icons';
import { GoogleGenAI, Modality } from '@google/genai';

const VegetableCard: React.FC<{ vegetable: Vegetable; onClick: () => void; }> = ({ vegetable, onClick }) => {
  const getStatusColor = (status: Vegetable['status']) => {
    switch (status) {
      case 'Seedling': return 'bg-blue-200 text-blue-800';
      case 'Growing': return 'bg-yellow-200 text-yellow-800';
      case 'Flowering': return 'bg-pink-200 text-pink-800';
      case 'Harvestable': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 w-full bg-agro-gray-light relative">
        {vegetable.imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-agro-beige border-t-agro-green rounded-full animate-spin"></div>
          </div>
        ) : (
          <img className="h-48 w-full object-cover" src={vegetable.imageUrl} alt={vegetable.name} />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-agro-green mb-2">{vegetable.name}</h3>
        <p className="text-sm text-agro-brown font-serif mb-4">Piantato il: {vegetable.plantingDate}</p>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(vegetable.status)}`}>
          {vegetable.status}
        </span>
      </div>
    </div>
  );
};

// =================================================================
// YOUR VEGETABLES COMPONENT
// =================================================================
export const YourVegetables: React.FC = () => {
  const [vegetables, setVegetables] = useState<Vegetable[]>(MOCK_VEGETABLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState<Vegetable | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddVegetable = async (newVegetable: Omit<Vegetable, 'id' | 'imageUrl'>) => {
    setIsGenerating(true);
    const tempId = Date.now();

    const placeholderVeg: Vegetable = {
        ...newVegetable,
        id: tempId,
        imageUrl: '',
        imageLoading: true,
    };
    setVegetables(prev => [...prev, placeholderVeg]);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Una foto vibrante e di alta qualità di un/una ${newVegetable.name} maturo/a su uno sfondo pulito e neutro, con un'atmosfera rustica e luminosa. Stile fotografico naturale, adatto per una moderna applicazione agricola. Nessun testo o filigrana.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        let imageUrl = `https://loremflickr.com/400/300/vegetable,plant?lock=${Date.now()}`; // Fallback
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                break;
            }
        }
        
        setVegetables(prev => {
            const maxId = Math.max(...prev.filter(v => v.id !== tempId).map(v => v.id), 0);
            return prev.map(v => 
                v.id === tempId 
                ? { ...v, imageUrl, imageLoading: false, id: maxId + 1 }
                : v
            );
        });
    } catch (error) {
        console.error("Errore durante la generazione dell'immagine:", error);
        setVegetables(prev => {
            const maxId = Math.max(...prev.filter(v => v.id !== tempId).map(v => v.id), 0);
            return prev.map(v => 
                v.id === tempId 
                ? { ...v, imageUrl: `https://loremflickr.com/400/300/vegetable/error?lock=${Date.now()}`, imageLoading: false, id: maxId + 1 }
                : v
            );
        });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-agro-green">I miei ortaggi</h2>
          <p className="text-agro-brown mt-1 font-serif">Tieni traccia di tutto ciò che coltivi.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isGenerating}
          className="flex items-center justify-center bg-agro-green text-white font-bold py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors disabled:bg-agro-green-light disabled:cursor-not-allowed min-w-[190px]"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Generazione...</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5 mr-2" />
              Aggiungi Ortaggio
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {vegetables.map(veg => (
          <VegetableCard key={veg.id} vegetable={veg} onClick={() => setSelectedVegetable(veg)} />
        ))}
      </div>

      {isModalOpen && (
        <AddVegetableModal 
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddVegetable}
        />
      )}

      {selectedVegetable && (
        <VegetableDetailModal
            vegetable={selectedVegetable}
            onClose={() => setSelectedVegetable(null)}
        />
      )}
    </div>
  );
};
