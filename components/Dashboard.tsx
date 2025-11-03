import React, { useState, useEffect } from 'react';
import type { NavItemType, WeatherDay, Task } from '../types';
import { MOCK_TASKS, MOCK_VEGETABLES } from '../constants';
import { SunIcon, CloudIcon, RainIcon, WindIcon, CloseIcon, CommunityIcon, HarvestIcon, EcommerceIcon } from './Icons';

interface DashboardProps {
  setActiveView: (view: NavItemType, tab?: string | null) => void;
  weatherData: WeatherDay[] | null;
  weatherLoading: boolean;
  weatherError: string | null;
}

const WeatherIconComponent: React.FC<{condition: WeatherDay['condition']}> = ({ condition }) => {
    switch (condition) {
        case 'Sunny': return <SunIcon className="w-12 h-12 text-yellow-400" />;
        case 'Cloudy': return <CloudIcon className="w-12 h-12 text-gray-400" />;
        case 'Rain': return <RainIcon className="w-12 h-12 text-blue-400" />;
        case 'Windy': return <WindIcon className="w-12 h-12 text-gray-500" />;
        default: return null;
    }
};

const VegetablesWidget: React.FC<{
    setActiveView: (view: NavItemType, tab?: string | null) => void;
}> = ({ setActiveView }) => {
    const displayedVegetables = MOCK_VEGETABLES.slice(0, 4);

    return (
        <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="font-bold text-xl text-agro-green mb-4">I Tuoi Ortaggi</h3>
                {displayedVegetables.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {displayedVegetables.map(veg => (
                            <div key={veg.id} className="text-center group cursor-pointer" onClick={() => setActiveView('I miei ortaggi')}>
                                <div className="overflow-hidden rounded-md">
                                    <img src={veg.imageUrl} alt={veg.name} className="w-full h-20 object-cover rounded-md transform group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <p className="text-xs text-agro-brown mt-2 truncate font-serif">{veg.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center">
                       <span className="text-3xl">🌱</span>
                       <p className="text-agro-brown font-serif italic mt-2">Non hai ancora aggiunto nessun ortaggio.</p>
                    </div>
                )}
            </div>
            <button onClick={() => setActiveView('I miei ortaggi')} className="mt-6 w-full bg-agro-green text-white py-2 rounded-lg hover:bg-agro-green-light transition-colors">
                Gestisci Ortaggi
            </button>
        </div>
    );
};


const WeatherWidget: React.FC<{
    weatherData: WeatherDay[] | null;
    weatherLoading: boolean;
    weatherError: string | null;
    setActiveView: (view: NavItemType, tab?: string | null) => void;
}> = ({ weatherData, weatherLoading, weatherError, setActiveView }) => {
    if (weatherLoading) {
        return (
            <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center min-h-[280px]">
                <p className="text-agro-brown animate-pulse">Caricamento meteo...</p>
            </div>
        );
    }

    if (weatherError || !weatherData || weatherData.length === 0) {
        return (
            <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center min-h-[280px] text-center">
                 <p className="text-red-500 font-serif">{weatherError || 'Dati meteo non disponibili.'}</p>
                 <button onClick={() => window.location.reload()} className="mt-4 text-sm text-agro-green underline">Riprova</button>
            </div>
        );
    }

    const todayWeather = weatherData[0];

    return (
        <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="font-bold text-xl text-agro-green mb-4">Meteo di Oggi</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-5xl font-bold text-agro-brown">{todayWeather.temp}°C</p>
                        <p className="text-agro-brown font-serif">{todayWeather.condition}</p>
                    </div>
                    <WeatherIconComponent condition={todayWeather.condition} />
                </div>
                <div className="mt-6 space-y-2 text-sm text-agro-brown">
                    <p>Vento: {todayWeather.wind} km/h</p>
                    <p>Umidità: {todayWeather.humidity}%</p>
                    <p>Prob. Pioggia: {todayWeather.rainChance}%</p>
                </div>
            </div>
            <button onClick={() => setActiveView('Meteo')} className="mt-6 w-full bg-agro-green text-white py-2 rounded-lg hover:bg-agro-green-light transition-colors">
                Vedi Previsioni
            </button>
        </div>
    );
};

const ChecklistWidget: React.FC<{
    setActiveView: (view: NavItemType, tab?: string | null) => void;
}> = ({ setActiveView }) => {
    const upcomingTasks = MOCK_TASKS.filter(task => !task.completed).slice(0, 3);
    return (
        <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-agro-green mb-4">Prossime Attività</h3>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center p-3 bg-agro-gray-light rounded-lg">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-agro-green focus:ring-agro-green-light" />
                    <p className="ml-4 flex-1 text-agro-brown">{task.title}</p>
                    <span className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'short'})}</span>
                  </div>
                ))
              ) : (
                <p className="text-agro-brown font-serif italic">Nessuna attività imminente.</p>
              )}
            </div>
          </div>
           <button onClick={() => setActiveView('Check List')} className="mt-6 w-full bg-agro-green text-white py-2 rounded-lg hover:bg-agro-green-light transition-colors">
            Vai alla Check List
          </button>
        </div>
    );
};

const CommunityWidget: React.FC<{
    setActiveView: (view: NavItemType, tab?: string | null) => void;
}> = ({ setActiveView }) => {
    return (
        <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="font-bold text-xl text-agro-green mb-4">Grow up together</h3>
                <div className="flex flex-col items-center text-center min-h-[120px] justify-center">
                    <CommunityIcon className="w-16 h-16 text-agro-brown mb-4" />
                    <p className="text-agro-brown font-serif text-sm">
                       Connettiti con altri agricoltori, scambia consigli e cresci insieme alla community di AgroIO.
                    </p>
                </div>
            </div>
            <button onClick={() => setActiveView('Community')} className="mt-6 w-full bg-agro-green text-white py-2 rounded-lg hover:bg-agro-green-light transition-colors">
                Entra nella Community
            </button>
        </div>
    );
};

const HarvestsWidget: React.FC<{
    setActiveView: (view: NavItemType, tab?: string | null) => void;
}> = ({ setActiveView }) => {
    return (
        <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="font-bold text-xl text-agro-green mb-4">I miei Raccolti</h3>
                <div className="flex flex-col items-center text-center min-h-[120px] justify-center">
                    <HarvestIcon className="w-16 h-16 text-agro-brown mb-4" />
                    <p className="text-agro-brown font-serif text-sm">
                       Tieni traccia dei tuoi raccolti, analizza i dati di produzione e pianifica le vendite.
                    </p>
                </div>
            </div>
            <button onClick={() => setActiveView('Raccolti')} className="mt-6 w-full bg-agro-green text-white py-2 rounded-lg hover:bg-agro-green-light transition-colors">
                Gestisci Raccolti
            </button>
        </div>
    );
};

const ECommerceWidget: React.FC<{
    setActiveView: (view: NavItemType, tab?: string | null) => void;
}> = ({ setActiveView }) => {
    return (
        <div className="lg:col-span-1 bg-agro-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="font-bold text-xl text-agro-green mb-4">E-Commerce</h3>
                <div className="flex flex-col items-center text-center min-h-[120px] justify-center">
                    <EcommerceIcon className="w-16 h-16 text-agro-brown mb-4" />
                    <p className="text-agro-brown font-serif text-sm">
                        Vendi i tuoi prodotti direttamente dal campo al consumatore attraverso il nostro marketplace integrato.
                    </p>
                </div>
            </div>
            <button onClick={() => setActiveView('E-Commerce')} className="mt-6 w-full bg-agro-green text-white py-2 rounded-lg hover:bg-agro-green-light transition-colors">
                Vai al Marketplace
            </button>
        </div>
    );
};


// =================================================================
// DASHBOARD COMPONENT
// =================================================================
export const Dashboard: React.FC<DashboardProps> = ({ setActiveView, weatherData, weatherLoading, weatherError }) => {
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  useEffect(() => {
    // Show banner only if permission is 'default' and it hasn't been dismissed this session
    if (
      'Notification' in window &&
      Notification.permission === 'default' &&
      !sessionStorage.getItem('notificationBannerDismissed')
    ) {
      setShowNotificationBanner(true);
    }
  }, []);

  const handleEnableNotifications = () => {
    Notification.requestPermission().then(permission => {
      // The banner will be hidden on the next render if permission is no longer 'default'
      if (permission !== 'default') {
        setShowNotificationBanner(false);
      }
    });
  };

  const handleDismissBanner = () => {
    sessionStorage.setItem('notificationBannerDismissed', 'true');
    setShowNotificationBanner(false);
  };

  return (
    <div className="space-y-8">
       {/* Notification Permission Banner */}
      {showNotificationBanner && (
        <div className="bg-agro-beige text-agro-brown p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h4 className="font-bold">Rimani aggiornato!</h4>
                <p className="text-sm">Abilita le notifiche per ricevere allerte meteo importanti in tempo reale.</p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button onClick={handleEnableNotifications} className="bg-agro-green text-white font-bold py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors text-sm">
                    Abilita
                </button>
                <button onClick={handleDismissBanner} className="p-2 rounded-full hover:bg-agro-brown/20" aria-label="Chiudi banner">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}

      {/* <!-- Welcome Header --> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-4xl font-bold text-agro-green">Bentornato, Mario!</h1>
                <p className="text-agro-brown mt-2 font-serif text-lg">Ecco il riepilogo della tua azienda agricola.</p>
            </div>
            <button
                onClick={() => setActiveView('Community', 'agrohunter')}
                className="flex-shrink-0 mt-2 sm:mt-0 flex items-center bg-agro-brown text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-300"
            >
                <CommunityIcon className="w-5 h-5 mr-2" />
                Diventa un AgroHunter
            </button>
        </div>

      {/* <!-- Grid for Widgets --> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* <!-- ROW 1 --> */}
        <WeatherWidget 
            weatherData={weatherData}
            weatherLoading={weatherLoading}
            weatherError={weatherError}
            setActiveView={setActiveView}
        />
        <VegetablesWidget setActiveView={setActiveView} />
        <ChecklistWidget setActiveView={setActiveView} />

        {/* <!-- ROW 2 --> */}
        <CommunityWidget setActiveView={setActiveView} />
        <HarvestsWidget setActiveView={setActiveView} />
        <ECommerceWidget setActiveView={setActiveView} />

      </div>
    </div>
  );
};