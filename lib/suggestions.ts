import type { WeatherDay, TaskSuggestion } from '../types';
import { SuggestionIcon, WarningIcon } from '../components/Icons';

export const generateTaskSuggestions = (weatherData: WeatherDay[]): TaskSuggestion[] => {
  const suggestions: TaskSuggestion[] = [];
  const forecast = weatherData.slice(0, 3); // Analyze the next 3 days

  if (forecast.length === 0) return [];

  // --- Rain related suggestions ---
  const heavyRainDays = forecast.filter(day => day.rainChance > 60);
  if (heavyRainDays.length > 0) {
    suggestions.push({
      title: 'Pioggia in arrivo',
      reason: `Prevista pioggia con probabilità superiore al ${heavyRainDays[0].rainChance}% per ${heavyRainDays[0].day.toLowerCase()}. Considera di posticipare l'irrigazione e i trattamenti fogliari.`,
      type: 'warning',
      icon: WarningIcon,
    });
  }

  // --- Sunny spell suggestions ---
  const sunnyDays = forecast.filter(day => day.condition === 'Sunny' && day.rainChance < 20);
  if (sunnyDays.length >= 2) {
    suggestions.push({
      title: 'Periodo favorevole',
      reason: `Si prevedono ${sunnyDays.length} giorni di sole. È un ottimo momento per la raccolta, la semina o i lavori di preparazione del terreno.`,
      type: 'suggestion',
      icon: SuggestionIcon,
    });
  }
  
  // --- Wind related suggestions ---
  const windyDay = forecast.find(day => day.condition === 'Windy' || day.wind > 30);
  if (windyDay) {
    suggestions.push({
      title: 'Attenzione al vento forte',
      reason: `Previsto vento superiore a ${windyDay.wind} km/h per ${windyDay.day.toLowerCase()}. Sconsigliata la nebulizzazione di trattamenti per evitarne la dispersione.`,
      type: 'warning',
      icon: WarningIcon,
    });
  }

  // --- Planting suggestion ---
  const mildDays = forecast.filter(day => day.temp > 10 && day.rainChance < 40);
  if (mildDays.length >= 2 && !heavyRainDays.length) {
     suggestions.push({
      title: 'Condizioni ideali per la semina',
      reason: 'Le temperature miti e l\'assenza di piogge intense creano un ambiente perfetto per seminare o trapiantare nuove colture.',
      type: 'suggestion',
      icon: SuggestionIcon,
    });
  }


  // Remove duplicate suggestions if any logic overlaps
  const uniqueTitles = new Set();
  return suggestions.filter(el => {
    const isDuplicate = uniqueTitles.has(el.title);
    uniqueTitles.add(el.title);
    return !isDuplicate;
  });
};
