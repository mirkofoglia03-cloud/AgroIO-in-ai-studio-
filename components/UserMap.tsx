import React, { useState, useMemo } from 'react';
import type { PartnerStore, CommunityUser } from '../types';
import { SearchIcon } from './Icons';

interface UserMapProps {
    users: CommunityUser[];
    stores: PartnerStore[];
}

export const UserMap: React.FC<UserMapProps> = ({ users, stores }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStores = useMemo(() => {
        if (!searchTerm.trim()) return stores;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return stores.filter(store => 
            store.address.toLowerCase().includes(lowerCaseSearch) ||
            store.name.toLowerCase().includes(lowerCaseSearch)
        );
    }, [stores, searchTerm]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return users.filter(user => 
            user.bio.toLowerCase().includes(lowerCaseSearch) ||
            user.name.toLowerCase().includes(lowerCaseSearch)
        );
    }, [users, searchTerm]);

    return (
        <div className="flex-grow flex flex-col h-full">
            <div className="relative mb-4 flex-shrink-0">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cerca per CAP, città o nome..."
                    className="w-full px-4 py-2 pl-10 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {filteredStores.length === 0 && filteredUsers.length === 0 && searchTerm ? (
                    <div className="text-center py-8">
                        <p className="text-agro-brown font-serif">Nessun risultato trovato per "{searchTerm}".</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <h4 className="font-semibold text-agro-brown mb-2 border-b pb-1">Negozi Partner ({filteredStores.length})</h4>
                            {filteredStores.length > 0 ? (
                                <ul className="space-y-3">
                                    {filteredStores.map(store => (
                                        <li key={store.id} className="bg-agro-gray-light/50 p-3 rounded-lg">
                                            <p className="font-bold text-agro-green">{store.name}</p>
                                            <p className="text-sm text-gray-600">{store.address}</p>
                                            <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                                Sito web
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-gray-500 italic px-2">Nessun negozio trovato.</p>}
                        </div>
                        <div>
                            <h4 className="font-semibold text-agro-brown mb-2 border-b pb-1 mt-4">Utenti AgroHunter ({filteredUsers.length})</h4>
                            {filteredUsers.length > 0 ? (
                                <ul className="space-y-3">
                                    {filteredUsers.map(user => (
                                        <li key={user.id} className="bg-agro-gray-light/50 p-3 rounded-lg">
                                            <p className="font-bold text-agro-green">{user.name}</p>
                                            <p className="text-sm text-gray-600 italic">"{user.bio}"</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-gray-500 italic px-2">Nessun utente trovato.</p>}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};