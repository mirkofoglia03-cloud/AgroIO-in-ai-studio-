import React, { useState, useMemo } from 'react';
import { MOCK_FAQS } from '../constants';
import type { FaqItem } from '../types';
import { SearchIcon, ChevronDownIcon } from './Icons';

// =================================================================
// ACCORDION ITEM SUB-COMPONENT
// =================================================================
const AccordionItem: React.FC<{
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-agro-gray">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full text-left py-4 px-2 hover:bg-agro-gray-light/50 focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-agro-green">{item.question}</h3>
        <ChevronDownIcon
          className={`w-6 h-6 text-agro-brown transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 pt-0 text-agro-brown font-serif">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
};


// =================================================================
// MAIN FAQ COMPONENT
// =================================================================
export const Faq: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) {
      return MOCK_FAQS;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return MOCK_FAQS.filter(
      (item) =>
        item.question.toLowerCase().includes(lowercasedFilter) ||
        item.answer.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-3xl font-bold text-agro-green">Domande Frequenti (FAQ)</h2>
            <p className="text-agro-brown mt-1 font-serif">Trova le risposte alle domande più comuni su AgroIO.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cerca una domanda o una parola chiave..."
                    className="w-full pl-12 pr-4 py-3 border border-agro-gray rounded-full focus:ring-agro-green-light focus:border-agro-green-light"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            {/* Accordion List */}
            <div className="space-y-2">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            item={faq}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-agro-green">Nessun risultato trovato</h3>
                        <p className="mt-2 text-agro-brown font-serif">
                            La tua ricerca per "{searchTerm}" non ha prodotto risultati. Prova con altre parole chiave.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};