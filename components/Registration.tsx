import React, { useState } from 'react';
import type { SubscriptionPlan, User } from '../types';
import { ArrowLeftIcon } from './Icons';

interface RegistrationProps {
  plan: SubscriptionPlan;
  onRegister: (userData: Omit<User, 'id' | 'lat' | 'lng'>) => void;
  onBack: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ plan, onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    street: '',
    city: '',
    province: '',
    cap: '',
    company: '',
    specialization: '',
    email: '',
    website: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, surname, street, city, province, cap, email } = formData;
    if (!name || !surname || !street || !city || !province || !cap || !email) {
      setError('Per favore, compila tutti i campi obbligatori.');
      return;
    }
    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('Inserisci un indirizzo email valido.');
        return;
    }
    setError('');

    const fullAddress = `${formData.street}, ${formData.cap} ${formData.city} (${formData.province.toUpperCase()})`;

    const userData = {
        name: formData.name,
        surname: formData.surname,
        address: fullAddress,
        company: formData.company,
        specialization: formData.specialization,
        email: formData.email,
        website: formData.website,
    };

    onRegister(userData);
  };

  return (
    <div className="min-h-screen bg-agro-gray-light flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-agro-green">Crea il tuo Account</h1>
            <p className="text-agro-brown mt-2 font-serif">Stai per iscriverti al piano <strong className="text-agro-green-light capitalize">{plan}</strong>. Manca solo un ultimo passo.</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-agro-brown mb-1">Nome *</label>
                        <input type="text" name="name" id="name" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" required />
                    </div>
                     <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-agro-brown mb-1">Cognome *</label>
                        <input type="text" name="surname" id="surname" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" required />
                    </div>
                </div>
                 <div>
                    <label htmlFor="street" className="block text-sm font-medium text-agro-brown mb-1">Indirizzo (Via / Piazza) *</label>
                    <input type="text" name="street" id="street" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" required placeholder="Es. Via Roma 1"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-agro-brown mb-1">Città *</label>
                        <input type="text" name="city" id="city" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" required placeholder="Es. Roma"/>
                    </div>
                    <div>
                        <label htmlFor="province" className="block text-sm font-medium text-agro-brown mb-1">Provincia (Sigla) *</label>
                        <input type="text" name="province" id="province" maxLength={2} onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" required placeholder="Es. RM"/>
                    </div>
                    <div>
                        <label htmlFor="cap" className="block text-sm font-medium text-agro-brown mb-1">CAP *</label>
                        <input type="text" name="cap" id="cap" maxLength={5} onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" required placeholder="Es. 00100"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-agro-brown mb-1">Azienda (Facoltativo)</label>
                        <input type="text" name="company" id="company" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" />
                    </div>
                     <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-agro-brown mb-1">Specializzazione (Facoltativo)</label>
                        <input type="text" name="specialization" id="specialization" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" placeholder="Es. Coltivatore biologico"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-agro-brown mb-1">Email *</label>
                        <input type="email" name="email" id="email" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" required />
                    </div>
                     <div>
                        <label htmlFor="website" className="block text-sm font-medium text-agro-brown mb-1">Sito Web (Facoltativo)</label>
                        <input type="url" name="website" id="website" onChange={handleChange} className="w-full p-2 border border-agro-gray rounded-lg" placeholder="https://..."/>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between">
                     <button type="button" onClick={onBack} className="flex items-center text-agro-brown hover:text-agro-green font-semibold mt-4 sm:mt-0">
                        <ArrowLeftIcon className="w-5 h-5 mr-1" />
                        Torna ai Piani
                     </button>
                    <button type="submit" className="w-full sm:w-auto bg-agro-green text-white font-bold py-3 px-8 rounded-lg hover:bg-agro-green-light transition-colors">
                        Completa Registrazione
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
