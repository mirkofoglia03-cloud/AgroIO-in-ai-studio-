import React, { useState } from 'react';
import type { Vegetable, VegetableInfo } from '../types';
import { CloseIcon } from './Icons';
import { VEGETABLE_DATABASE } from '../constants';

interface AddVegetableModalProps {
  onClose: () => void;
  onAdd: (newVegetable: Omit<Vegetable, 'id' | 'imageUrl'>) => void;
}

// =================================================================
// ADD VEGETABLE MODAL COMPONENT
// =================================================================
export const AddVegetableModal: React.FC<AddVegetableModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<Vegetable['status']>('Seedling');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<VegetableInfo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSelectedIndex(-1); // Reset selection on new input

    if (value.trim().length > 1) {
      const filteredSuggestions = VEGETABLE_DATABASE.filter(veg =>
        veg.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestionName: string) => {
    setName(suggestionName);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (selectedIndex > -1) {
        e.preventDefault();
        handleSuggestionClick(suggestions[selectedIndex].name);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Il nome è obbligatorio.');
      return;
    }
    onAdd({ name, plantingDate, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-agro-green">Aggiungi un Nuovo Ortaggio</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
            <CloseIcon className="w-6 h-6 text-agro-brown" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-agro-brown mb-1">
              Nome Ortaggio
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                // Delay hiding suggestions to allow click event to register
                setTimeout(() => {
                  setSuggestions([]);
                }, 150);
              }}
              className="w-full px-4 py-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light"
              placeholder="Es. Pomodoro, Zucchina..."
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-agro-gray rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.name}
                    onMouseDown={() => handleSuggestionClick(suggestion.name)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-4 py-2 cursor-pointer ${
                        index === selectedIndex ? 'bg-agro-gray-light' : 'hover:bg-agro-gray-light'
                    }`}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div>
            <label htmlFor="plantingDate" className="block text-sm font-medium text-agro-brown mb-1">
              Data di Semina/Trapianto
            </label>
            <input
              type="date"
              id="plantingDate"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full px-4 py-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light"
            />
          </div>

          <div>
             <label htmlFor="status" className="block text-sm font-medium text-agro-brown mb-1">
              Stato Iniziale
            </label>
            <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Vegetable['status'])}
                className="w-full px-4 py-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light bg-white"
            >
                <option value="Seedling">Piantina</option>
                <option value="Growing">In Crescita</option>
                <option value="Flowering">In Fioritura</option>
                <option value="Harvestable">Pronto per il Raccolto</option>
            </select>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-end space-x-4 pt-4">
             <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors"
             >
                Annulla
             </button>
             <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light transition-colors"
             >
                Salva Ortaggio
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
