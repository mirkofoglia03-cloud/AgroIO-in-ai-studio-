import React, { useState, useMemo } from 'react';
import type { Harvest } from '../types';
import { ChartBarIcon } from './Icons';

export const HarvestChart: React.FC<{ harvests: Harvest[] }> = ({ harvests }) => {
    const [selectedUnit, setSelectedUnit] = useState<Harvest['unit']>('kg');
    const units: Harvest['unit'][] = ['kg', 'g', 'pezzi'];

    const chartData = useMemo(() => {
        // 1. Initialize data for the last 12 months
        const months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date();
            d.setDate(1);
            d.setMonth(d.getMonth() - i);
            return {
                label: d.toLocaleDateString('it-IT', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                total: 0,
            };
        }).reverse();

        // 2. Filter harvests by selected unit and aggregate
        const filteredHarvests = harvests.filter(h => h.unit === selectedUnit);
        
        filteredHarvests.forEach(h => {
            const date = new Date(h.date);
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthData = months.find(m => m.year === year && m.month === month);
            if (monthData) {
                monthData.total += h.quantity;
            }
        });

        // 3. Find max total for scaling
        const maxTotal = Math.max(...months.map(m => m.total));

        return { months, maxTotal: maxTotal > 0 ? maxTotal : 1 };
    }, [harvests, selectedUnit]);
    
    const hasData = useMemo(() => chartData.months.some(m => m.total > 0), [chartData]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-xl font-bold text-agro-green flex items-center mb-2 sm:mb-0"><ChartBarIcon className="w-6 h-6 mr-2" /> Storico Raccolti (Ultimi 12 mesi)</h3>
                <div className="flex items-center space-x-1 bg-agro-gray-light p-1 rounded-lg">
                    {units.map(unit => (
                        <button
                            key={unit}
                            onClick={() => setSelectedUnit(unit)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                                selectedUnit === unit ? 'bg-agro-green text-white shadow' : 'text-agro-brown hover:bg-agro-gray'
                            }`}
                        >
                            {unit}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex h-52 items-end space-x-2 md:space-x-4 border-b border-agro-gray-light pb-2">
                {chartData.months.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                        <div
                            className="w-full bg-agro-green-light/50 hover:bg-agro-green-light rounded-t-md transition-all"
                            style={{ height: `${(month.total / chartData.maxTotal) * 100}%` }}
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-agro-brown text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                               {`${month.total.toLocaleString('it-IT')} ${selectedUnit}`}
                           </div>
                        </div>
                        <span className="text-xs text-agro-brown mt-2">{month.label}</span>
                    </div>
                ))}
            </div>
            {!hasData && (
                <p className="text-center text-agro-brown font-serif italic pt-4">Nessun dato disponibile per l'unità '{selectedUnit}' in questo periodo.</p>
            )}
        </div>
    );
};