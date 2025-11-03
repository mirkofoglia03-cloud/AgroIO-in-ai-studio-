import React from 'react';
import type { WeatherDay } from '../types';
import { SunIcon, CloudIcon, RainIcon, WindIcon } from './Icons';

interface WeatherProps {
    weatherData: WeatherDay[] | null;
    weatherLoading: boolean;
    weatherError: string | null;
    latitude?: number;
    longitude?: number;
}

const WeatherIconComponent: React.FC<{ condition: WeatherDay['condition'], className?: string }> = ({ condition, className = "w-10 h-10" }) => {
    switch (condition) {
        case 'Sunny': return <SunIcon className={`${className} text-yellow-400`} />;
        case 'Cloudy': return <CloudIcon className={`${className} text-gray-400`} />;
        case 'Rain': return <RainIcon className={`${className} text-blue-400`} />;
        case 'Windy': return <WindIcon className={`${className} text-gray-500`} />;
        default: return null;
    }
};

const WeatherCard: React.FC<{ day: WeatherDay; isToday?: boolean }> = ({ day, isToday = false }) => (
  <div className={`p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300 h-full ${
    isToday ? 'bg-agro-green text-agro-white shadow-2xl scale-105' : 'bg-agro-white text-agro-brown shadow-md hover:shadow-lg'
  }`}>
    <p className={`font-bold text-lg ${isToday ? 'text-agro-beige' : 'text-agro-green'}`}>{day.day}</p>
    <div className="my-3">
      <WeatherIconComponent condition={day.condition} className="w-12 h-12" />
    </div>
    <p className="text-3xl font-bold mb-1">{day.temp}°<span className="opacity-70"> / {day.tempMin}°</span>C</p>
    <p className={`text-sm font-serif ${isToday ? 'text-agro-beige' : ''}`}>{day.condition}</p>
    <div className={`mt-4 text-xs w-full pt-3 border-t ${isToday ? 'border-agro-green-light' : 'border-agro-gray'}`}>
      <p>Vento: {day.wind} km/h</p>
      <p>Umidità: {day.humidity}%</p>
      <p>Pioggia: {day.rainChance}%</p>
    </div>
  </div>
);

// =================================================================
// WEATHER COMPONENT
// =================================================================
export const Weather: React.FC<WeatherProps> = ({ weatherData, weatherLoading, weatherError, latitude, longitude }) => {
  
  const radarUrl = `https://embed.windy.com/embed.html?lat=${latitude}&lon=${longitude}&zoom=9&layer=radar&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  const renderForecast = () => {
    if (weatherLoading) {
      return (
        <div className="flex justify-center items-center h-full min-h-[300px]">
          <p className="text-agro-brown text-xl animate-pulse">Caricamento previsioni...</p>
        </div>
      );
    }

    if (weatherError || !weatherData) {
      return (
        <div className="text-center p-8 bg-white rounded-xl shadow-md h-full flex flex-col justify-center">
          <p className="text-red-500 font-serif text-lg">{weatherError || 'Impossibile caricare le previsioni meteo.'}</p>
          <p className="mt-2 text-agro-brown">Assicurati di aver concesso l'accesso alla tua posizione.</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-agro-green text-white py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors self-center">
            Ricarica
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {weatherData.map((day, index) => (
          <WeatherCard key={`${day.day}-${index}`} day={day} isToday={index === 0} />
        ))}
      </div>
    );
  };
  
  const renderRadar = () => {
    if (!latitude || !longitude) {
      return (
        <div className="bg-agro-white rounded-xl shadow-md flex items-center justify-center h-full min-h-[400px]">
          <p className="text-agro-brown animate-pulse">In attesa delle coordinate...</p>
        </div>
      );
    }
    return (
      <div className="bg-agro-white rounded-xl shadow-md overflow-hidden h-full min-h-[400px] flex flex-col">
         <h3 className="text-lg font-bold text-agro-green p-4 border-b border-agro-gray">Radar Live</h3>
         <div className="flex-1">
            <iframe
                src={radarUrl}
                className="w-full h-full border-0"
                title="Weather Radar"
                allowFullScreen
            ></iframe>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-agro-green">Meteo Agricolo</h2>
        <p className="text-agro-brown mt-1 font-serif">Previsioni e radar per pianificare al meglio le tue attività.</p>
      </div>
      
      <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Forecast section taking up 2/3 of the space */}
        <div className="lg:col-span-3">
          {renderForecast()}
        </div>
      </div>
      
      {/* Radar Section, full width */}
       <div>
          {renderRadar()}
       </div>

    </div>
  );
};