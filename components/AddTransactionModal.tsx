import React, { useState, useEffect, useMemo } from 'react';
import type { Transaction, Contact } from '../types';
import { CloseIcon } from './Icons';

interface AddTransactionModalProps {
  onClose: () => void;
  onAdd: (data: { transaction: Omit<Transaction, 'id'>, newContact?: Omit<Contact, 'id' | 'name'> & { name: string } }) => void;
  transactions: Transaction[];
  allContacts: Contact[];
  customers: Contact[];
  suppliers: Contact[];
}

// =================================================================
// ADD TRANSACTION MODAL COMPONENT
// =================================================================
export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAdd, transactions, allContacts, customers, suppliers }) => {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<'kg' | 'l' | 'unità'>('unità');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('Fornitura');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    
    const [contactSuggestions, setContactSuggestions] = useState<Contact[]>([]);
    const [descriptionSuggestions, setDescriptionSuggestions] = useState<string[]>([]);

    const [isNewContact, setIsNewContact] = useState(false);
    const [error, setError] = useState('');

    const contactLabel = type === 'income' ? 'Cliente' : 'Fornitore';
    const placeholderText = type === 'income' ? 'Cerca o aggiungi un cliente' : 'Cerca o aggiungi un fornitore';

    const uniqueDescriptions = useMemo(() => {
        const descriptions = transactions.map(t => t.description);
        return [...new Set(descriptions)];
    }, [transactions]);

    useEffect(() => {
        if (type === 'income') {
            setCategory('Vendita');
        } else {
            setCategory('Fornitura');
        }
    }, [type]);

    useEffect(() => {
        if (contactName.trim() && !allContacts.some(c => c.name.toLowerCase() === contactName.trim().toLowerCase())) {
            setIsNewContact(true);
        } else {
            setIsNewContact(false);
            setContactPhone('');
            setContactEmail('');
        }
    }, [contactName, allContacts]);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDescription(value);
        if (value.length > 1) {
            setDescriptionSuggestions(
                uniqueDescriptions.filter(d => d.toLowerCase().includes(value.toLowerCase()))
            );
        } else {
            setDescriptionSuggestions([]);
        }
    };

    const handleDescriptionFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 1) {
             setDescriptionSuggestions(
                uniqueDescriptions.filter(d => d.toLowerCase().includes(value.toLowerCase()))
            );
        }
    };

    const handleDescriptionBlur = () => {
        setTimeout(() => {
            setDescriptionSuggestions([]);
        }, 150); // Delay to allow click
    };
    
    const handleDescriptionSuggestionClick = (value: string) => {
        setDescription(value);
        setDescriptionSuggestions([]);
    };

    const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
                setAmount(numericValue.toFixed(2));
            }
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setContactName(value);
        const sourceList = type === 'income' ? customers : suppliers;
        if (value.length > 1) {
            setContactSuggestions(sourceList.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
        } else {
            setContactSuggestions([]);
        }
    };

    const handleContactSuggestionClick = (contact: Contact) => {
        setContactName(contact.name);
        setContactPhone(contact.phone || '');
        setContactEmail(contact.email || '');
        setContactSuggestions([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim() || !amount || !category.trim() || !contactName.trim()) {
            setError('Descrizione, importo e contatto sono obbligatori.');
            return;
        }
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('L\'importo deve essere un numero positivo.');
            return;
        }

        const numericQuantity = quantity ? parseFloat(quantity) : undefined;
        if (quantity && (isNaN(numericQuantity) || numericQuantity < 0)) {
            setError('La quantità deve essere un numero positivo.');
            return;
        }

        const transaction: Omit<Transaction, 'id'> = { 
            type, 
            description, 
            amount: numericAmount, 
            date, 
            category, 
            contactName: contactName.trim(),
            quantity: numericQuantity,
            unit: numericQuantity ? unit : undefined,
        };
        const newContact = isNewContact ? { name: contactName.trim(), phone: contactPhone, email: contactEmail } : undefined;

        onAdd({ transaction, newContact });
        onClose();
    };

    const userLocale = navigator.language || 'it-IT';
    const currencySymbol = (new Intl.NumberFormat(userLocale, { style: 'currency', currency: 'EUR' })).formatToParts(1).find(part => part.type === 'currency')?.value || '€';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-agro-green">Nuovo Movimento</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
                        <CloseIcon className="w-6 h-6 text-agro-brown" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-agro-brown mb-1">Tipo di Movimento</label>
                        <div className="flex rounded-lg shadow-sm">
                            <button type="button" onClick={() => setType('income')} className={`w-full px-4 py-2 rounded-l-lg transition-colors ${type === 'income' ? 'bg-agro-green text-white' : 'bg-agro-gray-light text-agro-brown hover:bg-agro-gray'}`}>Entrata</button>
                            <button type="button" onClick={() => setType('expense')} className={`w-full px-4 py-2 rounded-r-lg transition-colors ${type === 'expense' ? 'bg-red-600 text-white' : 'bg-agro-gray-light text-agro-brown hover:bg-agro-gray'}`}>Uscita</button>
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="description" className="block text-sm font-medium text-agro-brown mb-1">Descrizione</label>
                        <input id="description" type="text" value={description} onChange={handleDescriptionChange} onFocus={handleDescriptionFocus} onBlur={handleDescriptionBlur} autoComplete="off" className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="Es. Vendita pomodori"/>
                        {descriptionSuggestions.length > 0 && (
                            <ul className="absolute z-20 w-full bg-white border border-agro-gray rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                                {descriptionSuggestions.map(d => <li key={d} onMouseDown={() => handleDescriptionSuggestionClick(d)} className="px-4 py-2 cursor-pointer hover:bg-agro-gray-light">{d}</li>)}
                            </ul>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-agro-brown mb-1">Importo ({currencySymbol})</label>
                            <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} onBlur={handleAmountBlur} className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="0.00" step="0.01"/>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-agro-brown mb-1">Quantità (Opz.)</label>
                            <input id="quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="Es. 10" step="any"/>
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-agro-brown mb-1">Unità</label>
                            <select id="unit" value={unit} onChange={e => setUnit(e.target.value as any)} className="w-full px-4 py-2 border border-agro-gray rounded-lg bg-white disabled:bg-agro-gray-light" disabled={!quantity}>
                                <option value="unità">Unità</option>
                                <option value="kg">Kg</option>
                                <option value="l">Litri</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="date" className="block text-sm font-medium text-agro-brown mb-1">Data</label>
                            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg"/>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-agro-brown mb-1">Categoria</label>
                            <div className="w-full px-4 py-2 border border-agro-gray rounded-lg bg-agro-gray-light text-agro-brown">
                                {category}
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="contactName" className="block text-sm font-medium text-agro-brown mb-1">{contactLabel}</label>
                        <input id="contactName" type="text" value={contactName} onChange={handleContactChange} autoComplete="off" className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder={placeholderText}/>
                         {contactSuggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-agro-gray rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                                {contactSuggestions.map(s => <li key={s.id + s.name} onMouseDown={() => handleContactSuggestionClick(s)} className="px-4 py-2 cursor-pointer hover:bg-agro-gray-light">{s.name}</li>)}
                            </ul>
                        )}
                    </div>
                    
                    {isNewContact && (
                        <div className="p-3 bg-agro-green/10 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="contactPhone" className="block text-xs font-medium text-agro-brown mb-1">Telefono (Opzionale)</label>
                                <input id="contactPhone" type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg text-sm" placeholder="Es. 0123456789"/>
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-xs font-medium text-agro-brown mb-1">Email (Opzionale)</label>
                                <input id="contactEmail" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg text-sm" placeholder="Es. info@contatto.it"/>
                            </div>
                        </div>
                    )}
                    
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light">Annulla</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light">Salva</button>
                    </div>
                </form>
            </div>
        </div>
    );
};