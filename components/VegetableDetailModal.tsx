import React from 'react';
import type { Vegetable, VegetableInfo } from '../types';
import { CloseIcon } from './Icons';
import { VEGETABLE_DATABASE } from '../constants';

interface VegetableDetailModalProps {
  vegetable: Vegetable;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; value: string; isPaired?: boolean; }> = ({ label, value, isPaired = false }) => (
    <div className={'py-3 ' + (isPaired ? '' : 'border-b border-agro-gray-light')}>
        <p className="text-sm font-semibold text-agro-brown">{label}</p>
        <p className="text-agro-green">{value}</p>
    </div>
);


// =================================================================
// VEGETABLE DETAIL MODAL COMPONENT
// =================================================================
export const VegetableDetailModal: React.FC<VegetableDetailModalProps> = ({ vegetable, onClose }) => {
  
  // Find detailed information from the database
  const vegetableInfo = VEGETABLE_DATABASE.find(info =>
    vegetable.name.toLowerCase().includes(info.name.toLowerCase())
  );
  
  const getStatusColor = (status: Vegetable['status']) => {
    switch (status) {
      case 'Seedling': return 'bg-blue-100 text-blue-800';
      case 'Growing': return 'bg-yellow-100 text-yellow-800';
      case 'Flowering': return 'bg-pink-100 text-pink-800';
      case 'Harvestable': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center p-4 border-b border-agro-gray">
          <h2 className="text-2xl font-bold text-agro-green">{vegetable.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
            <CloseIcon className="w-6 h-6 text-agro-brown" />
          </button>
        </div>

        <div className="overflow-y-auto">
            <img src={vegetable.imageUrl} alt={vegetable.name} className="w-full h-64 object-cover" />
            
            <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-agro-brown font-serif">Data di Semina</p>
                        <p className="font-semibold text-agro-green">{new Date(vegetable.plantingDate).toLocaleDateString('it-IT')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-agro-brown font-serif">Stato</p>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(vegetable.status)}`}>
                            {vegetable.status}
                        </span>
                    </div>
                </div>

                {/* Agronomic Details */}
                {vegetableInfo ? (
                    <div>
                        <h3 className="text-xl font-bold text-agro-green mb-3 border-b pb-2">Dettagli della Coltura</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <InfoRow label="Famiglia Botanica" value={vegetableInfo.family} />
                            <InfoRow label="Esposizione Solare" value={vegetableInfo.exposure} />
                            <InfoRow label="Irrigazione" value={vegetableInfo.watering} />
                            <InfoRow label="Distanza" value={'Tra piante: ' + vegetableInfo.spacing.plants + ' cm, Tra file: ' + vegetableInfo.spacing.rows + ' cm'} />
                            <InfoRow label="Periodo di Semina" value={vegetableInfo.sowing} />
                            <InfoRow label="Periodo di Raccolta" value={vegetableInfo.harvest} />
                            <div className="md:col-span-2 py-3 border-b border-agro-gray-light">
                                <p className="text-sm font-semibold text-agro-brown">Consociazioni</p>
                                <p className="text-green-600"><span className="font-bold">Amiche:</span> {vegetableInfo.companions}</p>
                                <p className="text-red-600"><span className="font-bold">Nemiche:</span> {vegetableInfo.avoid}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-agro-gray-light rounded-lg">
                        <p className="font-serif text-agro-brown">Nessun dettaglio agronomico disponibile nel nostro database per questo ortaggio.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
