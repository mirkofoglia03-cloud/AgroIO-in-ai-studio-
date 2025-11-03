import React, { useMemo } from 'react';
import type { Transaction, ProductHistoryItem } from '../types';
import { CloseIcon, ChartBarIcon } from './Icons';

// =================================================================
// CHART SUB-COMPONENT
// =================================================================
const ProductHistoryChart: React.FC<{ productTransactions: Transaction[], productUnit: string }> = ({ productTransactions, productUnit }) => {
    const userLocale = navigator.language || 'it-IT';
    const currencyFormatter = (amount: number) => new Intl.NumberFormat(userLocale, { style: 'currency', currency: 'EUR' }).format(amount);

    const chartData = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date();
            d.setDate(1);
            d.setMonth(d.getMonth() - i);
            return {
                label: d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                quantity: 0,
                amount: 0,
            };
        }).reverse();

        productTransactions.forEach(t => {
            const date = new Date(t.date);
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthData = months.find(m => m.year === year && m.month === month);
            if (monthData) {
                monthData.quantity += t.quantity || 0;
                monthData.amount += t.amount;
            }
        });

        const dataWithAvgPrice = months.map(m => ({
            ...m,
            avgPrice: m.quantity > 0 ? m.amount / m.quantity : 0,
        }));
        
        const maxQuantity = Math.max(...dataWithAvgPrice.map(m => m.quantity));
        const maxPrice = Math.max(...dataWithAvgPrice.map(m => m.avgPrice));

        return {
            monthsData: dataWithAvgPrice,
            maxQuantity: maxQuantity > 0 ? maxQuantity : 1,
            maxPrice: maxPrice > 0 ? maxPrice : 1,
        };
    }, [productTransactions]);
    
    // SVG Line path calculation
    const priceLinePath = useMemo(() => {
        const width = 500; // viewbox width
        const height = 150; // viewbox height
        const points = chartData.monthsData.map((month, index) => {
            const x = (width / 11) * index;
            const y = height - (month.avgPrice / chartData.maxPrice) * height;
            return { x, y: isNaN(y) ? height : y };
        });

        return points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');
    }, [chartData]);

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-agro-brown mb-2">Andamento Quantità (ultimi 12 mesi)</h4>
                <div className="flex h-40 bg-agro-gray-light/50 p-2 rounded-lg">
                    {chartData.monthsData.map(month => (
                        <div key={month.label} className="flex-1 flex flex-col justify-end items-center group">
                            <div className="w-3/4 bg-agro-brown/40 group-hover:bg-agro-brown/60 rounded-t-md transition-all"
                                 style={{ height: `${(month.quantity / chartData.maxQuantity) * 100}%` }}
                                 title={`Quantità: ${month.quantity.toLocaleString(userLocale)} ${productUnit}`}>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{month.label.split(' ')[0]}</span>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-agro-brown mb-2">Andamento Prezzo / {productUnit} (ultimi 12 mesi)</h4>
                 <div className="h-40 bg-agro-gray-light/50 p-4 rounded-lg relative">
                    <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="none">
                        <path d={priceLinePath} stroke="#3A5A40" fill="none" strokeWidth="2" />
                        {chartData.monthsData.map((month, index) => (
                           month.avgPrice > 0 && <circle 
                                key={month.label} 
                                cx={(500 / 11) * index} 
                                cy={150 - (month.avgPrice / chartData.maxPrice) * 150} 
                                r="3" 
                                fill="#3A5A40"
                           >
                            <title>{`Prezzo Medio: ${currencyFormatter(month.avgPrice)}`}</title>
                           </circle>
                        ))}
                    </svg>
                    <div className="absolute top-2 right-4 text-xs text-gray-500 font-semibold">{currencyFormatter(chartData.maxPrice)}</div>
                    <div className="absolute bottom-2 right-4 text-xs text-gray-500 font-semibold">{currencyFormatter(0)}</div>
                </div>
            </div>
        </div>
    );
};


// =================================================================
// MAIN MODAL COMPONENT
// =================================================================
export const ProductDetailModal: React.FC<{ product: ProductHistoryItem; transactions: Transaction[]; onClose: () => void; }> = ({ product, transactions, onClose }) => {
    const userLocale = navigator.language || 'it-IT';
    const currencyFormatter = (amount: number) => new Intl.NumberFormat(userLocale, { style: 'currency', currency: 'EUR' }).format(amount);

    const productTransactions = useMemo(() => {
        return transactions.filter(t => t.description.toLowerCase() === product.productName.toLowerCase()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [product, transactions]);
    
    const isIncome = productTransactions[0]?.type === 'income';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-agro-gray flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-agro-green">{product.productName}</h2>
                        <p className="text-sm text-agro-brown font-serif">{isIncome ? 'Dettaglio Vendite' : 'Dettaglio Acquisti'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
                        <CloseIcon className="w-6 h-6 text-agro-brown" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="overflow-y-auto p-6 space-y-8">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-agro-gray-light p-3 rounded-lg">
                            <p className="text-xs text-agro-brown">Quantità Totale</p>
                            <p className="font-bold text-lg text-agro-green">{product.totalQuantity.toLocaleString(userLocale)} {product.unit}</p>
                        </div>
                        <div className="bg-agro-gray-light p-3 rounded-lg">
                            <p className="text-xs text-agro-brown">{isIncome ? 'Ricavo Totale' : 'Costo Totale'}</p>
                            <p className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>{currencyFormatter(product.totalAmount)}</p>
                        </div>
                         <div className="bg-agro-gray-light p-3 rounded-lg">
                            <p className="text-xs text-agro-brown">Prezzo Medio / {product.unit}</p>
                            <p className="font-bold text-lg text-agro-green">{product.averagePricePerUnit > 0 ? currencyFormatter(product.averagePricePerUnit) : '-'}</p>
                        </div>
                        <div className="bg-agro-gray-light p-3 rounded-lg">
                            <p className="text-xs text-agro-brown">N. Transazioni</p>
                            <p className="font-bold text-lg text-agro-green">{product.transactionCount}</p>
                        </div>
                    </div>

                    {/* Charts */}
                     <div>
                        <h3 className="text-xl font-bold text-agro-green mb-4 flex items-center"><ChartBarIcon className="w-6 h-6 mr-2" /> Andamento Storico</h3>
                        <ProductHistoryChart productTransactions={productTransactions} productUnit={product.unit} />
                     </div>

                    {/* Transaction List */}
                    <div>
                        <h3 className="text-xl font-bold text-agro-green mb-4">Tutti i Movimenti per "{product.productName}"</h3>
                         <div className="overflow-y-auto max-h-64 border border-agro-gray rounded-lg">
                            <table className="w-full text-left">
                                <thead className="bg-agro-gray-light sticky top-0">
                                    <tr>
                                        <th className="py-2 px-4 text-sm font-semibold text-agro-brown">Data</th>
                                        <th className="py-2 px-4 text-sm font-semibold text-agro-brown">{isIncome ? 'Cliente' : 'Fornitore'}</th>
                                        <th className="py-2 px-4 text-sm font-semibold text-agro-brown text-right">Quantità</th>
                                        <th className="py-2 px-4 text-sm font-semibold text-agro-brown text-right">Importo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productTransactions.map(t => (
                                         <tr key={t.id} className="border-t border-agro-gray">
                                            <td className="py-2 px-4 text-agro-brown">{new Date(t.date).toLocaleDateString('it-IT')}</td>
                                            <td className="py-2 px-4 text-agro-brown">{t.contactName}</td>
                                            <td className="py-2 px-4 text-agro-brown text-right">{t.quantity ? `${t.quantity.toLocaleString(userLocale)} ${t.unit}` : '-'}</td>
                                            <td className={`py-2 px-4 font-semibold text-right ${isIncome ? 'text-green-600' : 'text-red-600'}`}>{currencyFormatter(t.amount)}</td>
                                         </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
