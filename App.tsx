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
import type { NavItemType, WeatherDay, TaskSuggestion, User, SubscriptionPlan } from './types';
import { generateTaskSuggestions } from './lib/suggestions';
import { Subscription } from './components/Subscription';
import { Registration } from './components/Registration';
import { UpgradeView } from './components/UpgradeView';
import { isFeatureAllowed } from './lib/utils';

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

  // New state for auth and subscription
  type AppState = 'choosing_plan' | 'registering' | 'loggedIn';
  const [appState, setAppState] = useState<AppState>('choosing_plan');
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  
  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('agroUser');
    const storedPlan = localStorage.getItem('agroPlan');
    if (storedUser && storedPlan) {
      setUser(JSON.parse(storedUser));
      setPlan(storedPlan as SubscriptionPlan);
      setAppState('loggedIn');
    }
  }, []);

  const handleSelectPlan = (selectedPlan: SubscriptionPlan) => {
    setPlan(selectedPlan);
    setAppState('registering');
  };

  const handleRegister = (userData: Omit<User, 'id' | 'lat' | 'lng'>) => {
    // In a real app, we'd geocode the address. Here we use fallback coordinates.
    const newUser: User = { ...userData, id: 1, lat: 41.9028, lng: 12.4964 };
    setUser(newUser);
    localStorage.setItem('agroUser', JSON.stringify(newUser));
    localStorage.setItem('agroPlan', plan!);
    setAppState('loggedIn');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('agroUser');
    localStorage.removeItem('agroPlan');
    setUser(null);
    setPlan(null);
    setAppState('choosing_plan');
    setActiveView('Il mio Orto');
  };

  useEffect(() => {
    if (appState !== 'loggedIn') return;

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
  }, [appState]);

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
    const targetItem = NAV_ITEMS.find(item => item.name === view);
    if (plan && targetItem && !isFeatureAllowed(targetItem.plan, plan)) {
      setActiveView('Upgrade');
    } else {
      setActiveView(view);
    }

    if (view === 'Community' && tab) {
        setInitialCommunityTab(tab);
    } else {
        setInitialCommunityTab(null);
    }
    setSidebarOpen(false);
  }, [plan]);

  const renderContent = () => {
    if (!plan) return null; // Should not happen in loggedIn state

    const targetItem = NAV_ITEMS.find(item => item.name === activeView);
    if(targetItem && !isFeatureAllowed(targetItem.plan, plan)) {
        return <UpgradeView plan={plan} />;
    }

    switch (activeView) {
      case 'Il mio Orto':
        return <Dashboard setActiveView={handleNavClick} weatherData={weatherData} weatherLoading={weatherLoading} weatherError={weatherError} user={user} plan={plan} />;
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
        return <Community initialTab={initialCommunityTab} user={user} />;
      case 'E-Commerce':
        return <Ecommerce />;
      case 'Faq':
        return <Faq />;
      case 'Upgrade':
        return <UpgradeView plan={plan} />;
      default:
        return <Dashboard setActiveView={handleNavClick} weatherData={weatherData} weatherLoading={weatherLoading} weatherError={weatherError} user={user} plan={plan} />;
    }
  };
  
  // Render onboarding flow if not logged in
  if (appState === 'choosing_plan') {
    return <Subscription onSelectPlan={handleSelectPlan} />;
  }
  if (appState === 'registering') {
    return <Registration onRegister={handleRegister} plan={plan!} onBack={() => setAppState('choosing_plan')} />;
  }
  if (appState !== 'loggedIn' || !user || !plan) {
    return <div className="flex h-screen w-full items-center justify-center">Caricamento...</div>; // Or a proper loading screen
  }

  const activeNavItem = NAV_ITEMS.find(item => item.name === activeView);
  const Icon = activeNavItem?.icon;

  return (
    <div className="flex min-h-screen bg-agro-gray-light font-sans text-gray-800">
      <Sidebar 
        activeView={activeView} 
        onNavClick={handleNavClick} 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen} 
        onProfileClick={() => setProfileModalOpen(true)}
        user={user}
        plan={plan}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Header 
          title={activeNavItem?.name || 'Il mio Orto'} 
          icon={Icon ? <Icon className="w-6 h-6" /> : null}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8">
          <div key={activeView} className="fade-in">
            {renderContent()}
          </div>
        </main>
      </div>

      {isProfileModalOpen && <ProfileModal onClose={() => setProfileModalOpen(false)} user={user} plan={plan} />}
    </div>
  );
};

export default App;