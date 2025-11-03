import React, { useState, useMemo } from 'react';
import type { MarketplaceItem } from '../types';
import { MOCK_EQUIPMENT, MOCK_PRODUCE } from '../constants';
import { GoogleGenAI, Modality } from '@google/genai';
import { 
    StoreIcon, WrenchScrewdriverIcon, EcommerceIcon, PlusIcon, CloseIcon, LocationMarkerIcon, SearchIcon, SparklesIcon
} from './Icons';

// =================================================================
// HELPER: Currency Formatter
// =================================================================
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
};

// =================================================================
// MODAL: Item Detail
// =================================================================
const ItemDetailModal: React.FC<{ item: MarketplaceItem, onClose: () => void }> = ({ item, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-agro-gray">
                    <h2 className="text-2xl font-bold text-agro-green">{item.name}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
                        <CloseIcon className="w-6 h-6 text-agro-brown" />
                    </button>
                </div>
                <div className="overflow-y-auto">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover" />
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-agro-green">{item.name}</h3>
                                {item.condition && <p className="text-sm text-agro-brown font-serif">{item.condition}</p>}
                            </div>
                            <p className="text-2xl font-bold text-agro-green-light">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p className="flex items-center"><LocationMarkerIcon className="w-4 h-4 mr-2 text-agro-brown" /> Venduto da <strong className="ml-1">{item.seller}</strong> a {item.location}</p>
                        </div>
                        <p className="text-agro-brown pt-4 border-t border-agro-gray-light">{item.description}</p>
                        <button className="w-full mt-4 bg-agro-green text-white font-bold py-3 px-4 rounded-lg hover:bg-agro-green-light transition-colors">
                            Contatta il Venditore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// MODAL: Add Item
// =================================================================
const AddItemModal: React.FC<{ onClose: () => void, onAddItem: (item: MarketplaceItem) => void }> = ({ onClose, onAddItem }) => {
    const [item, setItem] = useState<Partial<MarketplaceItem>>({ type: 'equipment', condition: 'Buono Stato', seller: 'Mario Rossi' });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setItem({ ...item, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGeneratePhoto = async () => {
        if (!item.name) {
            setError('Inserisci un nome per l\'articolo prima di generare l\'immagine.');
            return;
        }
        setIsGenerating(true);
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Una foto realistica e di alta qualità di un/una "${item.name}" in un contesto agricolo o su uno sfondo pulito. Descrizione: ${item.description || ''}. Lo stile deve essere fotografico e naturale, adatto per un marketplace. Nessun testo o filigrana.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            let imageUrl = '';
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            }
            if (imageUrl) {
                setImagePreview(imageUrl);
                setItem({ ...item, imageUrl: imageUrl });
            } else {
                setError("Impossibile generare l'immagine. Riprova.");
            }
        } catch (error) {
            console.error("Errore durante la generazione dell'immagine:", error);
            setError("Si è verificato un errore durante la generazione. Riprova.");
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item.name || !item.price || !item.description || !item.imageUrl || !item.location) {
            setError('Tutti i campi sono obbligatori.');
            return;
        }
        const newItem: MarketplaceItem = {
            id: Date.now(),
            ...item
        } as MarketplaceItem;
        
        onAddItem(newItem);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-agro-green">Metti in vendita un articolo</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-agro-brown mb-1">Tipo di Articolo</label>
                        <select name="type" onChange={handleChange} value={item.type} className="w-full p-2 border rounded-lg bg-white">
                            <option value="equipment">Attrezzatura</option>
                            <option value="produce">Prodotto dal campo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-agro-brown mb-1">Nome Articolo</label>
                        <input name="name" onChange={handleChange} type="text" className="w-full p-2 border rounded-lg" placeholder="Es. Zappa manuale" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-agro-brown mb-1">Descrizione</label>
                        <textarea name="description" onChange={handleChange} className="w-full p-2 border rounded-lg" rows={3}></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-agro-brown mb-1">Prezzo (€)</label>
                            <input name="price" onChange={handleChange} type="number" step="0.01" className="w-full p-2 border rounded-lg" placeholder="Es. 25.50" />
                        </div>
                        {item.type === 'equipment' && (
                             <div>
                                <label className="block text-sm font-medium text-agro-brown mb-1">Condizione</label>
                                <select name="condition" onChange={handleChange} value={item.condition} className="w-full p-2 border rounded-lg bg-white">
                                    <option>Come Nuovo</option>
                                    <option>Buono Stato</option>
                                    <option>Da Revisionare</option>
                                </select>
                            </div>
                        )}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-agro-brown mb-1">Località</label>
                        <input name="location" onChange={handleChange} type="text" className="w-full p-2 border rounded-lg" placeholder="Es. Bologna, BO" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-agro-brown">Foto</label>
                             <button
                                type="button"
                                onClick={handleGeneratePhoto}
                                disabled={!item.name || isGenerating}
                                className="flex items-center text-sm text-agro-green-light font-semibold hover:text-agro-green disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SparklesIcon className="w-4 h-4 mr-1"/>
                                {isGenerating ? 'Generando...' : 'Genera con IA'}
                            </button>
                        </div>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm text-agro-brown file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-agro-green/10 file:text-agro-green hover:file:bg-agro-green/20" />
                        
                         {isGenerating && (
                            <div className="mt-4 flex items-center justify-center h-32 w-full bg-agro-gray-light rounded-lg">
                               <div className="w-8 h-8 border-4 border-agro-beige border-t-agro-green rounded-full animate-spin"></div>
                            </div>
                         )}

                        {imagePreview && !isGenerating && <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg h-32 w-auto" />}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-agro-brown border">Annulla</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold">Pubblica Annuncio</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// =================================================================
// COMPONENT: Item Card
// =================================================================
const ItemCard: React.FC<{ item: MarketplaceItem, onClick: () => void }> = ({ item, onClick }) => {
    const getConditionClass = (condition?: MarketplaceItem['condition']) => {
        switch (condition) {
            case 'Come Nuovo': return 'bg-green-100 text-green-800';
            case 'Buono Stato': return 'bg-yellow-100 text-yellow-800';
            case 'Da Revisionare': return 'bg-red-100 text-red-800';
            default: return '';
        }
    };
    
    return (
        <div onClick={onClick} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer flex flex-col interactive-card">
            <img className="h-48 w-full object-cover" src={item.imageUrl} alt={item.name} />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-agro-green mb-2 truncate">{item.name}</h3>
                <p className="text-xl font-semibold text-agro-green-light mb-3">{formatCurrency(item.price)}</p>
                {item.condition && <span className={`text-xs font-semibold mr-auto px-2 py-1 rounded-full ${getConditionClass(item.condition)}`}>{item.condition}</span>}
                <div className="mt-auto pt-3 text-xs text-gray-500 border-t border-agro-gray-light">
                    <p className="truncate">{item.seller} - {item.location}</p>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// MAIN ECOMMERCE COMPONENT
// =================================================================
export const Ecommerce: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'equipment' | 'produce'>('equipment');
    const [items, setItems] = useState<MarketplaceItem[]>([...MOCK_EQUIPMENT, ...MOCK_PRODUCE]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddItem = (item: MarketplaceItem) => {
        setItems(prev => [item, ...prev]);
        setAddModalOpen(false);
    };

    const filteredItems = useMemo(() => {
        return items
            .filter(item => item.type === activeTab)
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [items, activeTab, searchTerm]);
    
    const TabButton: React.FC<{ tabName: 'equipment' | 'produce', label: string, icon: React.FC<any> }> = ({ tabName, label, icon: Icon }) => (
         <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center space-x-2 py-3 px-4 rounded-t-lg font-semibold transition-colors ${activeTab === tabName ? 'bg-white text-agro-green' : 'bg-transparent text-agro-brown hover:bg-white/50'}`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="bg-agro-beige text-agro-brown p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                    <StoreIcon className="w-8 h-8 text-agro-brown mr-4"/>
                    <div>
                        <h3 className="font-bold text-lg">Visita il nostro Store Ufficiale</h3>
                        <p className="text-sm">Attrezzature nuove, sementi e prodotti selezionati per te.</p>
                    </div>
                </div>
                <button className="bg-agro-brown text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-80 transition-colors flex-shrink-0">
                    Prossimamente
                </button>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-agro-green">E-Commerce</h2>
                <p className="text-agro-brown mt-1 font-serif">Vendi, acquista e scambia con la community di AgroIO.</p>
            </div>
            
            <div className="bg-agro-gray-light p-4 rounded-xl shadow-inner">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex border-b border-agro-gray self-start sm:self-auto">
                        <TabButton tabName="equipment" label="Attrezzatura Usata" icon={WrenchScrewdriverIcon} />
                        <TabButton tabName="produce" label="Prodotti dal Campo" icon={EcommerceIcon} />
                    </div>
                     <div className="relative w-full sm:w-auto">
                        <input 
                            type="text" 
                            placeholder="Cerca un articolo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-agro-gray rounded-full"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    </div>
                </div>

                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-agro-green">Nessun articolo trovato</h3>
                        <p className="mt-2 text-agro-brown font-serif">
                           {searchTerm ? `La tua ricerca per "${searchTerm}" non ha prodotto risultati.` : `Non ci sono ancora articoli in questa categoria. Sii il primo a pubblicarne uno!`}
                        </p>
                    </div>
                )}
            </div>

            <button onClick={() => setAddModalOpen(true)} className="fixed bottom-8 right-8 bg-agro-green text-white rounded-full p-4 shadow-lg hover:bg-agro-green-light transition-transform hover:scale-110">
                <PlusIcon className="w-8 h-8" />
            </button>

            {isAddModalOpen && <AddItemModal onClose={() => setAddModalOpen(false)} onAddItem={handleAddItem} />}
            {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </div>
    );
};