import React from 'react';

// =================================================================
// USER & SUBSCRIPTION
// =================================================================
export type SubscriptionPlan = 'Gratis' | 'Pro' | 'Business';

export interface User {
  id: number;
  name: string;
  surname: string;
  address: string;
  company?: string;
  specialization?: string;
  email: string;
  website?: string;
  lat: number;
  lng: number;
}


// =================================================================
// NAVIGATION
// =================================================================
export type NavItemType = 
  | 'Il mio Orto' 
  | 'I miei ortaggi' 
  | 'Check List' 
  | 'Meteo' 
  | 'Progetta il tuo Orto' 
  | 'Il tuo AgroGiardiniere' 
  | 'Entrate/Uscite' 
  | 'Raccolti' 
  | 'Community' 
  | 'E-Commerce'
  | 'Faq'
  | 'Upgrade';

export interface NavItem {
  name: NavItemType;
  icon: React.FC<{ className?: string }>;
  plan: SubscriptionPlan | 'All';
}

// =================================================================
// APP-WIDE TYPES
// =================================================================

// Weather
export interface WeatherDay {
  day: string;
  temp: number;
  tempMin: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Windy';
  wind: number;
  humidity: number;
  rainChance: number;
}

// Tasks & Suggestions
export interface Task {
  id: number;
  title: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  category: 'Daily' | 'Weekly' | 'General';
}

export interface TaskSuggestion {
  title: string;
  reason: string;
  type: 'suggestion' | 'warning';
  icon: React.FC<{ className?: string }>;
}

// Vegetables
export interface Vegetable {
  id: number;
  name: string;
  plantingDate: string; // YYYY-MM-DD
  status: 'Seedling' | 'Growing' | 'Flowering' | 'Harvestable';
  imageUrl: string;
  imageLoading?: boolean;
}

export interface VegetableInfo {
    name: string;
    family: string;
    exposure: string;
    watering: string;
    spacing: {
        plants: number; // in cm
        rows: number; // in cm
    };
    sowing: string;
    harvest: string;
    companions: string;
    avoid: string;
    yield: string;
}

// Garden Design
export interface GardenData {
    farmingSystem: FarmingSystem | null;
    cultivationType: 'Campo Aperto' | 'Serra' | 'Aiuole Rialzate' | 'Vasi' | null;
    sunExposure: 'Pieno Sole' | 'Mezz\'ombra' | 'Ombra Piena' | null;
    selectedPlants: VegetableInfo[];
    dimensions: { width: string; length: string; };
    gardenImage: string | null; // base64
}

export interface FarmingSystem {
    name: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    icon: React.FC<{ className?: string }>;
}

// Cash Flow
export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  contactName: string;
  quantity?: number;
  unit?: 'kg' | 'l' | 'unità';
}

export interface Contact {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

export interface AgendaContact {
  name: string;
  phone?: string;
  email?: string;
  totalAmount: number;
  transactionCount: number;
}

export interface ProductHistoryItem {
  productName: string;
  totalQuantity: number;
  unit: string;
  totalAmount: number;
  averagePricePerUnit: number;
  contacts: string[];
  transactionCount: number;
}

// Harvests
export interface Harvest {
  id: number;
  vegetableId: number;
  vegetableName: string;
  date: string; // YYYY-MM-DD
  quantity: number;
  unit: 'kg' | 'g' | 'pezzi';
  notes?: string;
}

// Community
export interface CommunityPost {
  id: number;
  author: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export interface PartnerStore {
  id: number;
  name: string;
  address: string;
  website: string;
  lat: number;
  lng: number;
}

export interface CommunityUser {
  id: number;
  name: string;
  bio: string;
  lat: number;
  lng: number;
}

// E-Commerce
export interface MarketplaceItem {
  id: number;
  type: 'equipment' | 'produce';
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: string;
  location: string;
  condition?: 'Come Nuovo' | 'Buono Stato' | 'Da Revisionare';
}

// FAQ
export interface FaqItem {
  question: string;
  answer: string;
}