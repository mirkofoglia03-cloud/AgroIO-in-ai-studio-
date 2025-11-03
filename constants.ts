import type { NavItem, Task, Vegetable, VegetableInfo, FarmingSystem, Transaction, Contact, Harvest, CommunityPost, PartnerStore, CommunityUser, MarketplaceItem, FaqItem } from './types';
import { HomeIcon, LeafIcon, ChecklistIcon, SunIcon, SparklesIcon, BeakerIcon, CashIcon, HarvestIcon, CommunityIcon, EcommerceIcon, FaqIcon, BioIcon, SyncIcon, TechIcon } from './components/Icons';

export const NAV_ITEMS: NavItem[] = [
  { name: 'Il mio Orto', icon: HomeIcon },
  { name: 'I miei ortaggi', icon: LeafIcon },
  { name: 'Check List', icon: ChecklistIcon },
  { name: 'Meteo', icon: SunIcon },
  { name: 'Progetta il tuo Orto', icon: SparklesIcon },
  { name: 'Il tuo AgroGiardiniere', icon: BeakerIcon },
  { name: 'Entrate/Uscite', icon: CashIcon },
  { name: 'Raccolti', icon: HarvestIcon },
  { name: 'Community', icon: CommunityIcon },
  { name: 'E-Commerce', icon: EcommerceIcon },
  { name: 'Faq', icon: FaqIcon },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

export const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Irrigare le piante di pomodoro', dueDate: today.toISOString().split('T')[0], completed: false, category: 'Daily' },
  { id: 2, title: 'Controllare la presenza di parassiti sulle zucchine', dueDate: today.toISOString().split('T')[0], completed: false, category: 'Daily' },
  { id: 3, title: 'Fertilizzare le aiuole delle fragole', dueDate: tomorrow.toISOString().split('T')[0], completed: false, category: 'Weekly' },
  { id: 4, title: 'Preparare il terreno per la semina delle carote', dueDate: nextWeek.toISOString().split('T')[0], completed: false, category: 'General' },
  { id: 5, title: 'Pulire gli attrezzi da giardino', dueDate: today.toISOString().split('T')[0], completed: true, category: 'Weekly' },
];

export const MOCK_VEGETABLES: Vegetable[] = [
  { id: 1, name: 'Pomodoro San Marzano', plantingDate: '2024-05-15', status: 'Flowering', imageUrl: 'https://source.unsplash.com/400x300/?san-marzano-tomatoes' },
  { id: 2, name: 'Zucchina Nera di Milano', plantingDate: '2024-06-01', status: 'Growing', imageUrl: 'https://source.unsplash.com/400x300/?dark-zucchini' },
  { id: 3, name: 'Basilico Genovese', plantingDate: '2024-05-20', status: 'Harvestable', imageUrl: 'https://source.unsplash.com/400x300/?genovese-basil' },
  { id: 4, name: 'Lattuga Romana', plantingDate: '2024-06-10', status: 'Seedling', imageUrl: 'https://source.unsplash.com/400x300/?romaine-lettuce' },
];

export const VEGETABLE_DATABASE: VegetableInfo[] = [
  { name: 'Pomodoro', family: 'Solanaceae', exposure: 'Pieno sole', watering: 'Regolare e costante', spacing: { plants: 40, rows: 70 }, sowing: 'Feb-Apr', harvest: 'Giu-Set', companions: 'Basilico, Carote, Cipolle', avoid: 'Patate, Finocchi', yield: '2-5 kg per pianta' },
  { name: 'Zucchina', family: 'Cucurbitaceae', exposure: 'Pieno sole', watering: 'Abbondante', spacing: { plants: 80, rows: 120 }, sowing: 'Apr-Giu', harvest: 'Giu-Ott', companions: 'Fagioli, Mais, Lattuga', avoid: 'Patate', yield: '10-20 frutti per pianta' },
  { name: 'Basilico', family: 'Lamiaceae', exposure: 'Pieno sole/Mezz\'ombra', watering: 'Frequente', spacing: { plants: 20, rows: 30 }, sowing: 'Mar-Giu', harvest: 'Mag-Ott', companions: 'Pomodori, Peperoni', avoid: 'Ruta', yield: 'Raccolta continua' },
  { name: 'Lattuga', family: 'Asteraceae', exposure: 'Mezz\'ombra', watering: 'Costante', spacing: { plants: 25, rows: 30 }, sowing: 'Feb-Set', harvest: 'Apr-Nov', companions: 'Carote, Fragole, Ravanelli', avoid: 'Prezzemolo', yield: '1 cespo per pianta' },
  { name: 'Carota', family: 'Apiaceae', exposure: 'Pieno sole/Mezz\'ombra', watering: 'Regolare', spacing: { plants: 5, rows: 20 }, sowing: 'Feb-Lug', harvest: 'Mag-Nov', companions: 'Lattuga, Pomodori, Piselli', avoid: 'Aneto', yield: '1 radice per pianta' },
];

export const FARMING_SYSTEMS: FarmingSystem[] = [
    { 
        name: 'Agricoltura Biologica', 
        description: 'Utilizza metodi naturali, evitando prodotti chimici di sintesi.',
        advantages: ['Rispetto per l\'ambiente', 'Prodotti più sani', 'Migliora la fertilità del suolo'],
        disadvantages: ['Rese potenzialmente inferiori', 'Maggiore manodopera', 'Controllo parassiti più complesso'],
        icon: BioIcon,
    },
    { 
        name: 'Agricoltura Integrata', 
        description: 'Combina pratiche convenzionali e biologiche per la sostenibilità.',
        advantages: ['Uso mirato di agrofarmaci', 'Buon equilibrio resa/sostenibilità', 'Minore impatto ambientale del convenzionale'],
        disadvantages: ['Richiede alta competenza tecnica', 'Certificazione complessa'],
        icon: SyncIcon,
    },
    { 
        name: 'Agricoltura di Precisione', 
        description: 'Impiega tecnologie avanzate (GPS, droni) per ottimizzare gli input.',
        advantages: ['Massima efficienza', 'Riduzione sprechi (acqua, fertilizzanti)', 'Dati precisi per decisioni migliori'],
        disadvantages: ['Alti costi iniziali', 'Richiede competenze tecnologiche', 'Dipendenza dalla tecnologia'],
        icon: TechIcon,
    },
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 1, name: 'Mercato Agricolo Locale', phone: '061234567', email: 'info@mercatoagricolo.it' },
    { id: 2, name: 'Forniture Verdi S.r.l.', phone: '029876543', email: 'ordini@fornitureverdi.com' },
    { id: 3, name: 'Ristorante La Cascina', phone: '0815556677', email: 'chef@lacascina.it' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 1, date: '2024-07-15', description: 'Vendita pomodori', amount: 150.00, type: 'income', category: 'Vendite', contactName: 'Mercato Agricolo Locale', quantity: 50, unit: 'kg' },
    { id: 2, date: '2024-07-14', description: 'Acquisto fertilizzante organico', amount: 45.50, type: 'expense', category: 'Forniture', contactName: 'Forniture Verdi S.r.l.', quantity: 5, unit: 'l' },
    { id: 3, date: '2024-07-12', description: 'Vendita zucchine e basilico', amount: 85.20, type: 'income', category: 'Vendite', contactName: 'Ristorante La Cascina', quantity: 20, unit: 'unità' },
    { id: 4, date: '2024-07-10', description: 'Carburante per trattore', amount: 60.00, type: 'expense', category: 'Operative', contactName: 'Distributore IP', quantity: 30, unit: 'l' },
    { id: 5, date: '2024-07-08', description: 'Riparazione sistema di irrigazione', amount: 120.00, type: 'expense', category: 'Manutenzione', contactName: 'Idraulica Rossi' },
    { id: 6, date: '2024-07-16', description: 'Vendita lattuga', amount: 55.00, type: 'income', category: 'Vendite', contactName: 'Mercato Agricolo Locale', quantity: 100, unit: 'unità' },
];

export const MOCK_HARVESTS: Harvest[] = [
  { id: 1, vegetableId: 3, vegetableName: 'Basilico Genovese', date: '2024-07-20', quantity: 200, unit: 'g', notes: 'Primo raccolto, foglie molto profumate.' },
  { id: 2, vegetableId: 1, vegetableName: 'Pomodoro San Marzano', date: '2024-07-22', quantity: 5, unit: 'kg', notes: 'Primi frutti maturi, ottimi per la salsa.' },
  { id: 3, vegetableId: 2, vegetableName: 'Zucchina Nera di Milano', date: '2024-07-23', quantity: 8, unit: 'pezzi', notes: 'Zucchine di medie dimensioni.' },
];

export const MOCK_POSTS: CommunityPost[] = [
    { id: 1, author: 'Giulia Bianchi', avatarUrl: 'https://picsum.photos/seed/giulia/100/100', timestamp: '2 ore fa', content: 'Qualcuno ha consigli su come combattere la peronospora del pomodoro in modo biologico? Quest\'anno è un disastro!', imageUrl: 'https://picsum.photos/seed/peronospora/800/600', likes: 12, comments: 5 },
    { id: 2, author: 'Marco Verdi', avatarUrl: 'https://picsum.photos/seed/marco/100/100', timestamp: 'Ieri', content: 'Raccolto di zucchine eccezionale! La consociazione con i fagioli ha funzionato alla grande. Consiglio a tutti di provare.', likes: 45, comments: 11 },
    { id: 3, author: 'Mario Rossi', avatarUrl: 'https://picsum.photos/seed/user/100/100', timestamp: '3 giorni fa', content: 'Sto cercando di migliorare la fertilità del mio suolo. Avete mai provato la tecnica del sovescio? Mi piacerebbe sentire le vostre esperienze.', likes: 28, comments: 9 },
];

export const MOCK_PARTNER_STORES: PartnerStore[] = [
    { id: 1, name: 'Bio Emporio Srl', address: 'Via Roma 10, 20121 Milano', website: 'https://www.bioemporio.it', lat: 45.4642, lng: 9.1900 },
    { id: 2, name: 'La Terra Fertile', address: 'Corso Vittorio Emanuele 150, 80132 Napoli', website: 'https://www.laterrafertile.it', lat: 40.8518, lng: 14.2681 },
    { id: 3, name: 'Azienda Agricola Sole d\'Oro', address: 'Contrada da Sole, 1, 90123 Palermo', website: 'https://www.soledoro.it', lat: 38.1157, lng: 13.3615 },
];

export const MOCK_USERS: CommunityUser[] = [
    { id: 101, name: 'Luca Neri', bio: 'Coltivatore di ortaggi biologici - Bologna (40121)', lat: 44.4949, lng: 11.3426 },
    { id: 102, name: 'Sofia Gallo', bio: 'Apicoltrice e frutticoltrice - Firenze (50122)', lat: 43.7696, lng: 11.2558 },
    { id: 103, name: 'Davide Esposito', bio: 'Esperto di permacultura - Roma (00184)', lat: 41.9028, lng: 12.4964 },
];

export const MOCK_EQUIPMENT: MarketplaceItem[] = [
  { id: 201, type: 'equipment', name: 'Zappa Manuale Rinforzata', description: 'Usata per una stagione, in ottime condizioni. Manico in faggio robusto.', price: 25, imageUrl: 'https://source.unsplash.com/400x300/?garden-hoe', seller: 'Marco Verdi', location: 'Bologna, BO', condition: 'Buono Stato' },
  { id: 202, type: 'equipment', name: 'Motosega a scoppio 52cc', description: 'Perfettamente funzionante, necessita solo di una nuova catena. Potente e affidabile per potature.', price: 110, imageUrl: 'https://source.unsplash.com/400x300/?chainsaw', seller: 'Luca Neri', location: 'Firenze, FI', condition: 'Da Revisionare' },
  { id: 203, type: 'equipment', name: 'Sistema di Irrigazione a Goccia (50m)', description: 'Kit completo per irrigare un piccolo orto. Usato pochissimo, come nuovo.', price: 40, imageUrl: 'https://source.unsplash.com/400x300/?drip-irrigation', seller: 'Giulia Bianchi', location: 'Napoli, NA', condition: 'Come Nuovo' },
];

export const MOCK_PRODUCE: MarketplaceItem[] = [
  { id: 301, type: 'produce', name: 'Cassetta di Pomodori San Marzano (5kg)', description: 'Appena raccolti, dolcissimi e perfetti per conserve. Coltivazione biologica.', price: 15, imageUrl: 'https://source.unsplash.com/400x300/?tomatoes,crate', seller: 'Mario Rossi', location: 'Salerno, SA' },
  { id: 302, type: 'produce', name: 'Mazzo di Basilico Genovese Fresco', description: 'Profumatissimo basilico, ideale per pesto e sughi. Raccolto giornalmente.', price: 3, imageUrl: 'https://source.unsplash.com/400x300/?basil,bunch', seller: 'Sofia Gallo', location: 'Genova, GE' },
  { id: 303, type: 'produce', name: 'Zucchine Biologiche (1kg)', description: 'Zucchine tenere e saporite, senza trattamenti chimici. Ottime grigliate o trifolate.', price: 4.5, imageUrl: 'https://source.unsplash.com/400x300/?zucchini,basket', seller: 'Davide Esposito', location: 'Roma, RM' },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    question: "Come posso aggiungere un nuovo ortaggio al mio elenco?",
    answer: "Vai alla sezione 'I Miei Ortaggi' e clicca sul pulsante 'Aggiungi Ortaggio'. Inserisci il nome, la data di semina e lo stato iniziale. L'IA genererà un'immagine per te!",
  },
  {
    question: "La previsione meteo è accurata per la mia zona?",
    answer: "Sì, AgroIO utilizza la tua geolocalizzazione per fornire previsioni meteo precise e localizzate. Se non concedi l'accesso, mostreremo le previsioni per una località predefinita (Roma). Le previsioni includono allerte per pioggia e vento forte.",
  },
  {
    question: "Cosa fa la sezione 'Progetta il tuo Orto'?",
    answer: "Questa funzionalità ti guida passo dopo passo nella creazione del layout ideale per il tuo orto. Scegli il tipo di coltivazione, l'esposizione al sole, le piante e le dimensioni. La nostra IA ti fornirà un suggerimento di layout testuale e grafico ottimizzato per le consociazioni tra piante.",
  },
  {
    question: "Come funziona l'AgroGiardiniere?",
    answer: "L'AgroGiardiniere è il tuo agronomo personale basato sull'IA. Carica una foto di una pianta e riceverai un'analisi dettagliata del suo stato di salute, con l'identificazione di eventuali problemi e una lista di interventi consigliati.",
  },
  {
    question: "Posso vendere i miei prodotti su AgroIO?",
    answer: "Assolutamente! La sezione 'E-Commerce' è un marketplace dove puoi vendere i tuoi prodotti dal campo o attrezzatura usata. Clicca sul pulsante '+' per creare un nuovo annuncio in modo semplice e veloce, anche generando l'immagine con l'IA.",
  },
  {
    question: "Cos'è un 'AgroHunter' nella Community?",
    answer: "Un AgroHunter ci aiuta a far crescere la nostra rete di partner. Se segnali un negozio fisico che espone il nostro QR code (inviando una foto-testimonianza), riceverai 3 mesi di abbonamento gratis al tuo piano. È il nostro modo per ringraziarti!",
  },
];