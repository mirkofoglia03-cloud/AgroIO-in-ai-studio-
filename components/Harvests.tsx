import React, { useState } from 'react';
import { MOCK_HARVESTS, MOCK_VEGETABLES } from '../constants';
import type { Harvest } from '../types';
import { AddHarvestModal } from './AddHarvestModal';
import { HarvestChart } from './HarvestChart';
import { PlusIcon, HarvestIcon as PageIcon } from './Icons';

export const Harvests: React.FC = () => {
    const [harvests, setHarvests] = useState<Harvest[]>(MOCK_HARVESTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddHarvest = (newHarvestData: Omit<Harvest, 'id'>) => {
        const newHarvest: Harvest = {
            id: Math.max(0, ...harvests.map(h => h.id)) + 1,
            ...newHarvestData,
        };
        setHarvests(prev => [newHarvest, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-agro-green">I miei Raccolti</h2>
                    <p className="text-agro-brown mt-1 font-serif">Registra e analizza i dati dei tuoi raccolti.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-agro-green text-white font-bold py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Aggiungi Raccolto
                </button>
            </div>
            
            <HarvestChart harvests={harvests} />

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h3 className="text-xl font-bold text-agro-green mb-4">Dettaglio Raccolti Recenti</h3>
                {harvests.length === 0 ? (
                    <div className="text-center py-16">
                        <PageIcon className="w-24 h-24 mx-auto text-agro-gray" />
                        <h3 className="mt-4 text-xl font-semibold text-agro-green">Nessun raccolto registrato</h3>
                        <p className="mt-2 text-agro-brown font-serif">Clicca su "Aggiungi Raccolto" per iniziare a tracciare la tua produzione.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-agro-gray-light">
                                    <th className="py-3 px-4 text-sm font-semibold text-agro-brown">Ortaggio</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-agro-brown">Data</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-agro-brown text-right">Quantità</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-agro-brown">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {harvests.map(harvest => (
                                    <tr key={harvest.id} className="border-b border-agro-gray-light hover:bg-agro-gray-light/30">
                                        <td className="py-4 px-4 font-semibold text-agro-green">{harvest.vegetableName}</td>
                                        <td className="py-4 px-4 text-agro-brown">{new Date(harvest.date).toLocaleDateString('it-IT')}</td>
                                        <td className="py-4 px-4 text-agro-brown text-right">{`${harvest.quantity} ${harvest.unit}`}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600 italic truncate" title={harvest.notes}>{harvest.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AddHarvestModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddHarvest}
                    vegetables={MOCK_VEGETABLES}
                />
            )}
        </div>
    );
};