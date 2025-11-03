import React, { useState } from 'react';
import type { Harvest, Vegetable } from '../types';
import { CloseIcon } from './Icons';

interface AddHarvestModalProps {
  onClose: () => void;
  onAdd: (newHarvest: Omit<Harvest, 'id'>) => void;
  vegetables: Vegetable[];
}

export const AddHarvestModal: React.FC<AddHarvestModalProps> = ({ onClose, onAdd, vegetables }) => {
  const [vegetableId, setVegetableId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'kg' | 'g' | 'pezzi'>('kg');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vegetableId || !quantity || !date) {
      setError('Ortaggio, data e quantità sono campi obbligatori.');
      return;
    }
    const numericQuantity = parseFloat(quantity);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
        setError('La quantità deve essere un numero positivo.');
        return;
    }

    const selectedVegetable = vegetables.find(v => v.id === parseInt(vegetableId, 10));
    if (!selectedVegetable) {
        setError('Ortaggio non valido selezionato.');
        return;
    }

    onAdd({
      vegetableId: parseInt(vegetableId, 10),
      vegetableName: selectedVegetable.name,
      date,
      quantity: numericQuantity,
      unit,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-agro-green">Aggiungi Nuovo Raccolto</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
            <CloseIcon className="w-6 h-6 text-agro-brown" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="vegetable" className="block text-sm font-medium text-agro-brown mb-1">Ortaggio Raccolto</label>
            <select
              id="vegetable"
              value={vegetableId}
              onChange={(e) => setVegetableId(e.target.value)}
              className="w-full px-4 py-2 border border-agro-gray rounded-lg bg-white focus:ring-agro-green-light focus:border-agro-green-light"
            >
              <option value="">-- Seleziona un ortaggio --</option>
              {vegetables.map(veg => (
                <option key={veg.id} value={veg.id}>{veg.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-agro-brown mb-1">Data del Raccolto</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-agro-brown mb-1">Quantità</label>
              <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Es. 5" className="w-full px-4 py-2 border border-agro-gray rounded-lg" step="any" />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-agro-brown mb-1">Unità</label>
              <select id="unit" value={unit} onChange={e => setUnit(e.target.value as any)} className="w-full px-4 py-2 border border-agro-gray rounded-lg bg-white">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="pezzi">pezzi</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-agro-brown mb-1">Note (Opzionale)</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="Es. Qualità del raccolto, osservazioni..."></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors">Annulla</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light transition-colors">Salva Raccolto</button>
          </div>
        </form>
      </div>
    </div>
  );
};
