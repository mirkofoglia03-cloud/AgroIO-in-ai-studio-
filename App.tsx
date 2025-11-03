import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { YourVegetables } from './components/YourVegetables';
import { Checklist } from './components/Checklist';
import { Weather } from './components/Weather';
import { Ecommerce } from './components/Ecommerce';
import { DesignGarden } from './components/DesignGarden';
import { AgroGardener } from './components/AgroGardener';
import { CashFlow } from './components/CashFlow';
import { Harvests } from './components/Harvests';
import { Community } from './components/Community';
import { Faq } from './components/Faq';
import { ProfileModal } from './components/ProfileModal';
import { NAV_ITEMS } from './constants';
import type { NavItemType, WeatherDay, TaskSuggestion } from './types';
import { generateTaskSuggestions } from './lib/suggestions';

// Helper function to map WMO weather codes to app conditions
const mapWmoCodeToCondition = (code: number, windSpeed: number): WeatherDay['condition'] => {
    if (windSpeed > 30) return 'Windy';
    if ([0].includes(code)) return 'Sunny';
    if ([1, 2, 3, 45, 48].includes(code)) return 'Cloudy';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return 'Rain';
    return 'Cloudy'; // Default for other codes
};


// =================================================================
// MAIN APPLICATION COMPONENT
// =================================================================
const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItemType>('Il mio Orto');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherDay[] | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([]);
  const [initialCommunityTab, setInitialCommunityTab] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      setLocation({ lat, lon });
      setWeatherLoading(true);
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,relative_humidity_2m_mean,precipitation_probability_max&forecast_days=7&timezone=auto`;
      
      fetch(apiUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch weather data.');
            }
            return res.json();
        })
        .then(data => {
            const transformedData: WeatherDay[] = data.daily.time.map((date: string, index: number) => {
                const dayDate = new Date(date);
                let dayName;
                if (index === 0) {
                    dayName = 'Oggi';
                } else if (index === 1) {
                    dayName = 'Domani';
                } else {
                    dayName = dayDate.toLocaleDateString('it-IT', { weekday: 'short' });
                }

                return {
                    day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                    temp: Math.round(data.daily.temperature_2m_max[index]),
                    tempMin: Math.round(data.daily.temperature_2m_min[index]),
                    condition: mapWmoCodeToCondition(data.daily.weather_code[index], data.daily.wind_speed_10m_max[index]),
                    wind: Math.round(data.daily.wind_speed_10m_max[index]),
                    humidity: Math.round(data.daily.relative_humidity_2m_mean[index]),
                    rainChance: data.daily.precipitation_probability_max[index],
                };
            });
            setWeatherData(transformedData);
            setWeatherError(null); // Clear previous errors
        })
        .catch(err => {
            console.error(err);
            setWeatherError('Impossibile caricare i dati meteo. Per favore, riprova più tardi.');
        })
        .finally(() => {
            setWeatherLoading(false);
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setWeatherError('Geolocalizzazione non riuscita. Verrà mostrato il meteo per Roma.');
          fetchWeather(41.9028, 12.4964); // Fallback to Rome, Italy
        }
      );
    } else {
      setWeatherError('La geolocalizzazione non è supportata. Verrà mostrato il meteo per Roma.');
      fetchWeather(41.9028, 12.4964); // Fallback
    }
  }, []);

  useEffect(() => {
    if (weatherData) {
      setTaskSuggestions(generateTaskSuggestions(weatherData));
    }
  }, [weatherData]);

  // This useEffect handles sending weather alert notifications
  useEffect(() => {
    if (weatherData && weatherData.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      const todayWeather = weatherData[0];
      const todayDate = new Date().toISOString().split('T')[0];

      // --- Define Alert Conditions ---
      const HEAVY_RAIN_THRESHOLD = 70; // %
      const STRONG_WIND_THRESHOLD = 35; // km/h

      // --- Check for Heavy Rain ---
      const rainAlertKey = `alert_rain_${todayDate}`;
      if (todayWeather.rainChance > HEAVY_RAIN_THRESHOLD && !sessionStorage.getItem(rainAlertKey)) {
        new Notification('AgroIO - Allerta Pioggia Forte', {
          body: `Attenzione: prevista alta probabilità di pioggia (${todayWeather.rainChance}%) oggi. Considera di proteggere le colture sensibili.`,
          tag: 'weather-alert-rain', // Use a tag to prevent multiple similar notifications from stacking
        });
        sessionStorage.setItem(rainAlertKey, 'true');
      }
      
      // --- Check for Strong Wind ---
      const windAlertKey = `alert_wind_${todayDate}`;
      if (todayWeather.wind > STRONG_WIND_THRESHOLD && !sessionStorage.getItem(windAlertKey)) {
        new Notification('AgroIO - Allerta Vento Forte', {
          body: `Attenzione: previsto vento forte (${todayWeather.wind} km/h) oggi. Assicura le strutture e le coperture.`,
          tag: 'weather-alert-wind',
        });
        sessionStorage.setItem(windAlertKey, 'true');
      }
    }
  }, [weatherData]);


  const handleNavClick = useCallback((view: NavItemType, tab: string | null = null) => {
    setActiveView(view);
    if (view === 'Community' && tab) {
        setInitialCommunityTab(tab);
    } else {
        setInitialCommunityTab(null); // Reset if not navigating to a specific tab or no tab is specified
    }
    setSidebarOpen(false); // Close sidebar on navigation in mobile view
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'Il mio Orto':
        return <Dashboard setActiveView={handleNavClick} weatherData={weatherData} weatherLoading={weatherLoading} weatherError={weatherError} />;
      case 'I miei ortaggi':
        return <YourVegetables />;
      case 'Check List':
        return <Checklist suggestions={taskSuggestions} />;
      case 'Meteo':
        return <Weather weatherData={weatherData} weatherLoading={weatherLoading} weatherError={weatherError} latitude={location?.lat} longitude={location?.lon} />;
      case 'Progetta il tuo Orto':
        return <DesignGarden latitude={location?.lat} longitude={location?.lon} />;
      case 'Il tuo AgroGiardiniere':
        return <AgroGardener />;
      case 'Entrate/Uscite':
        return <CashFlow />;
      case 'Raccolti':
        return <Harvests />;
      case 'Community':
        return <Community initialTab={initialCommunityTab} />;
      case 'E-Commerce':
        return <Ecommerce />;
      case 'Faq':
        return <Faq />;
      default:
        return <Dashboard setActiveView={handleNavClick} weatherData={weatherData} weatherLoading={weatherLoading} weatherError={weatherError} />;
    }
  };
  
  const activeNavItem = NAV_ITEMS.find(item => item.name === activeView);
  const Icon = activeNavItem?.icon;

  return (
    <div className="flex min-h-screen bg-agro-gray-light font-sans text-gray-800">
      {/* ======================= SIDEBAR NAVIGATION ======================= */}
      <Sidebar 
        activeView={activeView} 
        onNavClick={handleNavClick} 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen} 
        onProfileClick={() => setProfileModalOpen(true)}
      />

      {/* ======================= MAIN CONTENT AREA ======================= */}
      <div className="flex-1 flex flex-col">
        <Header 
          title={activeNavItem?.name || 'Il mio Orto'} 
          icon={Icon ? <Icon className="w-6 h-6" /> : null}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>

      {isProfileModalOpen && <ProfileModal onClose={() => setProfileModalOpen(false)} />}
    </div>
  );
};

export default App;