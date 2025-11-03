import React, { useState, useMemo } from 'react';
import { AddTransactionModal } from './AddTransactionModal';
import { ProductDetailModal } from './ProductDetailModal';
import { MOCK_TRANSACTIONS, MOCK_CONTACTS } from '../constants';
import type { Transaction, Contact, AgendaContact, ProductHistoryItem } from '../types';
import { PlusIcon, UserGroupIcon, PhoneIcon, MailIcon, ChartBarIcon, ArchiveIcon, ArrowLeftIcon } from './Icons';

const StatCard: React.FC<{ title: string; amount: number; color: string }> = ({ title, amount, color }) => {
    const userLocale = navigator.language || 'it-IT';
    const formattedAmount = new Intl.NumberFormat(userLocale, { style: 'currency', currency: 'EUR' }).format(amount);
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-agro-brown">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{formattedAmount}</p>
        </div>
    );
};

const PerformanceChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const userLocale = navigator.language || 'it-IT';
    
    const data = useMemo(() => {
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setDate(1); // Avoid month-end issues
            d.setMonth(d.getMonth() - i);
            return {
                label: d.toLocaleDateString('it-IT', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                income: 0,
                expense: 0,
            };
        }).reverse();

        transactions.forEach(t => {
            const date = new Date(t.date);
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthData = months.find(m => m.year === year && m.month === month);
            if (monthData) {
                if (t.type === 'income') monthData.income += t.amount;
                else monthData.expense += t.amount;
            }
        });

        const maxAmount = Math.max(...months.flatMap(m => [m.income, m.expense]));
        return { months, maxAmount: maxAmount > 0 ? maxAmount : 1 };
    }, [transactions]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-agro-green mb-4 flex items-center"><ChartBarIcon className="w-6 h-6 mr-2" /> Andamento Attività (Ultimi 6 Mesi)</h3>
            <div className="flex h-64">
                {data.months.map(month => (
                    <div key={`${month.year}-${month.month}`} className="flex-1 flex flex-col justify-end items-center group">
                        <div className="w-full flex-grow flex items-end justify-center space-x-1 relative" title={`Entrate: ${new Intl.NumberFormat(userLocale, { style: 'currency', currency: 'EUR' }).format(month.income)}\nUscite: ${new Intl.NumberFormat(userLocale, { style: 'currency', currency: 'EUR' }).format(month.expense)}`}>
                            <div className="w-1/2 bg-green-300 group-hover:bg-green-400 rounded-t-md transition-all duration-300" style={{ height: `${(month.income / data.maxAmount) * 100}%` }}></div>
                            <div className="w-1/2 bg-red-300 group-hover:bg-red-400 rounded-t-md transition-all duration-300" style={{ height: `${(month.expense / data.maxAmount) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-agro-brown mt-2 flex-shrink-0">{month.label}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
                <div className="flex items-center"><span className="w-3 h-3 bg-green-300 rounded-sm mr-2"></span>Entrate</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-red-300 rounded-sm mr-2"></span>Uscite</div>
            </div>
        </div>
    );
};


const HistoryTable: React.FC<{ title: string, data: ProductHistoryItem[], type: 'income' | 'expense', onProductSelect: (product: ProductHistoryItem) => void; }> = ({ title, data, type, onProductSelect }) => {
    const userLocale = navigator.language || 'it-IT';
    const currencyFormatter = (amount: number) => new Intl.NumberFormat(userLocale, { style: 'currency', currency: 'EUR' }).format(amount);

    return (
         <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-agro-green mb-4 flex items-center"><ArchiveIcon className="w-6 h-6 mr-2" /> {title}</h3>
            <div className="overflow-x-auto max-h-[400px]">
                {data.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-agro-gray">
                                <th className="py-2 px-4 text-sm font-semibold text-agro-brown">Prodotto/Servizio</th>
                                <th className="py-2 px-4 text-sm font-semibold text-agro-brown text-center">Quantità Tot.</th>
                                <th className="py-2 px-4 text-sm font-semibold text-agro-brown text-right">Prezzo Medio / Unità</th>
                                <th className="py-2 px-4 text-sm font-semibold text-agro-brown text-right">Totale</th>
                                <th className="py-2 px-4 text-sm font-semibold text-agro-brown">{type === 'income' ? 'Clienti' : 'Fornitori'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.productName} onClick={() => onProductSelect(item)} className="border-b border-agro-gray-light hover:bg-agro-gray-light/50 cursor-pointer">
                                    <td className="py-3 px-4 text-agro-brown font-semibold">{item.productName}</td>
                                    <td className="py-3 px-4 text-agro-brown text-center">{item.totalQuantity > 0 ? `${item.totalQuantity.toLocaleString(userLocale)} ${item.unit}` : '-'}</td>
                                    <td className="py-3 px-4 text-agro-brown text-right">{item.averagePricePerUnit > 0 ? currencyFormatter(item.averagePricePerUnit) : '-'}</td>
                                    <td className={`py-3 px-4 font-bold text-right ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{currencyFormatter(item.totalAmount)}</td>
                                    <td className="py-3 px-4 text-agro-brown text-xs italic" title={item.contacts.join(', ')}>{item.contacts.join(', ').substring(0, 20)}{item.contacts.join(', ').length > 20 ? '...' : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-8">
                        <ArchiveIcon className="w-16 h-16 mx-auto text-agro-gray" />
                        <p className="mt-4 text-agro-brown font-serif">Nessun dato storico disponibile.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AgendaView: React.FC<{ contacts: AgendaContact[], onBack: () => void; }> = ({ contacts, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const userLocale = navigator.language || 'it-IT';

    const filteredContacts = useMemo(() => {
        if (!searchTerm) return contacts;
        return contacts.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone?.includes(searchTerm)
        );
    }, [contacts, searchTerm]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-agro-green flex items-center"><UserGroupIcon className="w-6 h-6 mr-2" /> Agenda Contatti</h3>
                <button onClick={onBack} className="flex items-center text-sm bg-agro-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Torna alla Panoramica
                </button>
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cerca per nome, email o telefono..."
                className="w-full px-4 py-2 border border-agro-gray rounded-lg mb-6"
            />
            {filteredContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.map(contact => {
                        return (
                            <div key={contact.name} className="bg-agro-gray-light/50 p-4 rounded-lg border border-agro-gray flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-agro-green truncate">{contact.name}</h4>
                                    {contact.phone && <div className="flex items-center text-sm text-agro-brown mt-2"><PhoneIcon className="w-4 h-4 mr-2"/> {contact.phone}</div>}
                                    {contact.email && <div className="flex items-center text-sm text-agro-brown mt-1"><MailIcon className="w-4 h-4 mr-2"/> {contact.email}</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                 <div className="text-center py-8">
                    <UserGroupIcon className="w-16 h-16 mx-auto text-agro-gray" />
                    <p className="mt-4 text-agro-brown font-serif">Nessun contatto trovato.</p>
                </div>
            )}
        </div>
    );
};


// =================================================================
// CASH FLOW COMPONENT
// =================================================================
export const CashFlow: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState<'overview' | 'agenda'>('overview');
    const [selectedProduct, setSelectedProduct] = useState<ProductHistoryItem | null>(null);

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
    }, [transactions]);
    
    const { customers, suppliers } = useMemo(() => {
        const customerNames = new Set(transactions.filter(t => t.type === 'income').map(t => t.contactName));
        const supplierNames = new Set(transactions.filter(t => t.type === 'expense').map(t => t.contactName));

        const getContactsFromNames = (names: Set<string>) => {
            const contactMap = new Map<string, Contact>();
            contacts.forEach(c => contactMap.set(c.name, c));
            return Array.from(names).map(name => contactMap.get(name)).filter((c): c is Contact => !!c);
        };
        
        return { customers: getContactsFromNames(customerNames), suppliers: getContactsFromNames(supplierNames) };
    }, [transactions, contacts]);

    const handleAddTransaction = (data: { transaction: Omit<Transaction, 'id'>, newContact?: Omit<Contact, 'id' | 'name'> & { name: string } }) => {
        const { transaction, newContact } = data;
        const newTransaction: Transaction = { id: Math.max(0, ...transactions.map(t => t.id)) + 1, ...transaction };
        setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        if (newContact) {
            const contactExists = contacts.some(c => c.name.toLowerCase() === newContact.name.toLowerCase());
            if (!contactExists) {
                setContacts(prev => [...prev, { id: Math.max(0, ...contacts.map(c => c.id)) + 1, ...newContact }]);
            } else {
                setContacts(prev => prev.map(c => c.name.toLowerCase() === newContact.name.toLowerCase() ? { ...c, phone: newContact.phone || c.phone, email: newContact.email || c.email } : c));
            }
        }
    };

    const agendaContacts: AgendaContact[] = useMemo(() => {
        const contactsMap = new Map<string, { totalAmount: number; transactionCount: number }>();
        transactions.forEach(t => {
            const existing = contactsMap.get(t.contactName) || { totalAmount: 0, transactionCount: 0 };
            const amount = t.type === 'income' ? t.amount : -t.amount;
            contactsMap.set(t.contactName, { totalAmount: existing.totalAmount + amount, transactionCount: existing.transactionCount + 1 });
        });
        const allContactNames = new Set([...Array.from(contactsMap.keys()), ...contacts.map(c => c.name)]);
        return Array.from(allContactNames).map(name => {
            const transactionData = contactsMap.get(name) || { totalAmount: 0, transactionCount: 0 };
            const contactDetails = contacts.find(c => c.name === name);
            return { name, ...contactDetails, ...transactionData };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [transactions, contacts]);

    const { salesHistory, purchaseHistory } = useMemo(() => {
        const createHistoryData = (type: 'income' | 'expense'): ProductHistoryItem[] => {
            const relevantTransactions = transactions.filter(t => t.type === type);
            const grouped = relevantTransactions.reduce((acc, t) => {
                const key = t.description.trim().toLowerCase();
                if (!acc[key]) acc[key] = { productName: t.description, transactions: [] };
                acc[key].transactions.push(t);
                return acc;
            }, {} as Record<string, {productName: string, transactions: Transaction[]}>);

            return Object.values(grouped).map(group => {
                const totalAmount = group.transactions.reduce((sum, t) => sum + t.amount, 0);
                const totalQuantity = group.transactions.reduce((sum, t) => sum + (t.quantity || 0), 0);
                const transactionCount = group.transactions.length;
                const firstUnit = group.transactions.find(t => t.unit)?.unit;
                const unit = firstUnit || (totalQuantity > 0 ? 'unità' : '');

                return {
                    productName: group.productName,
                    totalQuantity,
                    unit,
                    totalAmount,
                    averagePricePerUnit: totalQuantity > 0 ? totalAmount / totalQuantity : 0,
                    contacts: [...new Set(group.transactions.map(t => t.contactName))],
                    transactionCount,
                };
            }).sort((a,b) => b.totalAmount - a.totalAmount);
        };
        return { salesHistory: createHistoryData('income'), purchaseHistory: createHistoryData('expense') };
    }, [transactions]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-agro-green">Cash Flow</h2>
                    <p className="text-agro-brown mt-1 font-serif">
                        {view === 'overview'
                         ? 'Monitora le entrate, le uscite e i contatti della tua attività.'
                         : 'Gestisci e visualizza i tuoi contatti commerciali.'
                        }
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setView('agenda')} className="flex items-center bg-agro-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors">
                        <UserGroupIcon className="w-5 h-5 mr-2" /> Agenda
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-agro-green text-white font-bold py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" /> Aggiungi Movimento
                    </button>
                </div>
            </div>

            {view === 'overview' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Entrate Totali" amount={totalIncome} color="text-green-600" />
                        <StatCard title="Uscite Totali" amount={totalExpenses} color="text-red-600" />
                        <StatCard title="Saldo Corrente" amount={balance} color={balance >= 0 ? "text-agro-green" : "text-red-600"} />
                    </div>

                    <PerformanceChart transactions={transactions} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <HistoryTable title="Storico Vendite" data={salesHistory} type="income" onProductSelect={setSelectedProduct} />
                        <HistoryTable title="Storico Acquisti" data={purchaseHistory} type="expense" onProductSelect={setSelectedProduct} />
                    </div>
                </>
            ) : (
                <AgendaView contacts={agendaContacts} onBack={() => setView('overview')} />
            )}


            {isModalOpen && (
                <AddTransactionModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddTransaction}
                    transactions={transactions}
                    allContacts={contacts}
                    customers={customers}
                    suppliers={suppliers}
                />
            )}
            
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    transactions={transactions}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};