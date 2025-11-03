import React, { useState, useMemo } from 'react';
import { MOCK_POSTS, MOCK_PARTNER_STORES, MOCK_USERS, VEGETABLE_DATABASE } from '../constants';
import type { CommunityPost, PartnerStore, CommunityUser, VegetableInfo, User } from '../types';
import { HeartIcon, ChatAltIcon, ShareIcon, PaperAirplaneIcon, PlusIcon, PhotographIcon, TrashIcon, CheckIcon } from './Icons';
import { GoogleGenAI, Modality } from '@google/genai';
import { UserMap } from './UserMap';


// =================================================================
// TAB: Bacheca
// =================================================================
const PostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img className="w-12 h-12 rounded-full mr-4" src={post.avatarUrl} alt={post.author} />
                    <div>
                        <p className="font-bold text-agro-green">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                </div>
                <p className="text-agro-brown mb-4">{post.content}</p>
            </div>
            {post.imageUrl && <img className="w-full h-64 object-cover" src={post.imageUrl} alt="Post image" />}
            <div className="p-4 bg-agro-gray-light/50 flex justify-around border-t border-agro-gray">
                <button className="flex items-center space-x-2 text-agro-brown hover:text-agro-green transition-colors">
                    <HeartIcon className="w-5 h-5" /> <span className="text-sm">{post.likes}</span>
                </button>
                 <button className="flex items-center space-x-2 text-agro-brown hover:text-agro-green transition-colors">
                    <ChatAltIcon className="w-5 h-5" /> <span className="text-sm">{post.comments}</span>
                </button>
                 <button className="flex items-center space-x-2 text-agro-brown hover:text-agro-green transition-colors">
                    <ShareIcon className="w-5 h-5" /> <span className="text-sm">Condividi</span>
                </button>
            </div>
        </div>
    );
};

const Bacheca: React.FC<{ user: User | null }> = ({ user }) => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Create Post */}
            <div className="bg-white p-4 rounded-xl shadow-md">
                <textarea 
                    className="w-full p-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light"
                    rows={3}
                    placeholder={`A cosa stai pensando, ${user?.name}?`}
                ></textarea>
                <div className="flex justify-end mt-2">
                    <button className="bg-agro-green text-white font-bold py-2 px-6 rounded-lg hover:bg-agro-green-light transition-colors">
                        Pubblica
                    </button>
                </div>
            </div>
            
            {/* Posts Feed */}
            {MOCK_POSTS.map(post => <PostCard key={post.id} post={post} />)}
        </div>
    );
};


// =================================================================
// TAB: AgroHunter
// =================================================================
const ReportStoreForm: React.FC<{ onSubmitSuccess: () => void }> = ({ onSubmitSuccess }) => {
    const [photo, setPhoto] = useState<{ file: File, preview: string } | null>(null);
    const [formError, setFormError] = useState('');
    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setFormError("La foto non può superare i 5MB.");
                return;
            }
            setFormError('');
            const preview = URL.createObjectURL(file);
            setPhoto({ file, preview });
        }
    };

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeName || !storeAddress) {
            setFormError('Nome negozio e indirizzo sono obbligatori.');
            return;
        }
        if (!photo) {
            setFormError('È richiesta una foto-testimonianza.');
            return;
        }
        
        console.log("Submitting:", { storeName, storeAddress, photo: photo.file.name });
        setFormError('');
        onSubmitSuccess();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
             <h3 className="text-xl font-bold text-agro-green mb-4">Segnala un Negozio</h3>
             <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-agro-brown mb-1">Nome Negozio</label>
                    <input id="storeName" name="storeName" type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="Es. Bio Emporio Srl" />
                </div>
                 <div>
                    <label htmlFor="storeAddress" className="block text-sm font-medium text-agro-brown mb-1">Indirizzo Completo</label>
                    <input id="storeAddress" name="storeAddress" type="text" value={storeAddress} onChange={e => setStoreAddress(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="Es. Via Roma 10, 20121 Milano" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-agro-brown mb-1">Foto-testimonianza</label>
                    {!photo ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-agro-gray border-dashed rounded-md appearance-none cursor-pointer hover:border-agro-green-light">
                             <PhotographIcon className="w-10 h-10 text-agro-gray" />
                            <span className="font-medium text-sm text-gray-600 mt-2">
                                Clicca per caricare una foto
                            </span>
                             <span className="text-xs text-gray-500">PNG o JPG (max 5MB)</span>
                            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePhotoChange} />
                        </label>
                    ) : (
                        <div className="relative">
                            <img src={photo.preview} alt="Anteprima foto" className="w-full h-auto max-h-48 object-contain rounded-lg shadow-sm" />
                            <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-colors" aria-label="Rimuovi foto">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                     <p className="text-xs text-gray-500 mt-1">Carica la foto dell'adesivo AgroIO esposto sulla vetrina del negozio.</p>
                </div>
                {formError && <p className="text-sm text-red-500">{formError}</p>}
                <div className="text-right pt-2">
                     <button type="submit" className="flex items-center ml-auto bg-agro-green text-white font-bold py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors">
                        <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                        Invia Segnalazione
                    </button>
                </div>
             </form>
        </div>
    );
};

const SuccessMessage: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-agro-green">Segnalazione Inviata!</h3>
            <p className="mt-2 text-agro-brown font-serif">
                Grazie per il tuo contributo! Verificheremo la foto-testimonianza al più presto.
                Una volta confermata, attiveremo il tuo bonus di <strong>3 mesi di abbonamento GRATIS</strong>.
            </p>
            <div className="mt-6">
                <button
                    onClick={onReset}
                    className="flex items-center mx-auto bg-agro-green text-white font-bold py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Segnala un altro negozio
                </button>
            </div>
        </div>
    </div>
);


const AgroHunter: React.FC<{ user: User | null }> = ({ user }) => {
    const [submitted, setSubmitted] = useState(false);

    // Add current user to the list of users on the map
    const allUsers = useMemo(() => {
      if (user) {
        const currentUserAsCommunityUser: CommunityUser = {
          id: user.id,
          name: `${user.name} ${user.surname}`,
          bio: user.specialization || 'Nuovo membro AgroIO',
          lat: user.lat,
          lng: user.lng
        };
        // Avoid adding duplicates if mocks already contain the user
        if (!MOCK_USERS.find(u => u.id === currentUserAsCommunityUser.id)) {
          return [currentUserAsCommunityUser, ...MOCK_USERS];
        }
      }
      return MOCK_USERS;
    }, [user]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Explanation & Form */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-agro-green mb-3">Diventa un AgroHunter!</h3>
                    <p className="text-agro-brown mb-4 font-serif">
                        Aiutaci a far crescere la rete di AgroIO e ottieni fantastici premi. Segnala un negozio fisico che potrebbe diventare nostro partner.
                    </p>
                    <div className="bg-agro-green/10 p-4 rounded-lg border-l-4 border-agro-green">
                        <p className="font-bold text-agro-green">Il tuo premio:</p>
                        <p className="text-sm text-agro-brown">Se il negozio che segnali espone il nostro QR code, riceverai <strong className="text-agro-green-light">3 mesi di abbonamento GRATIS</strong> al tuo piano tariffario.</p>
                    </div>
                </div>
                {submitted ? (
                    <SuccessMessage onReset={() => setSubmitted(false)} />
                ) : (
                    <ReportStoreForm onSubmitSuccess={() => setSubmitted(true)} />
                )}
            </div>

            {/* Right Column: Map */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col min-h-[500px] lg:min-h-0">
                <h3 className="text-xl font-bold text-agro-green mb-4">La Nostra Rete</h3>
                <div className="flex-grow rounded-lg overflow-hidden flex flex-col">
                    <UserMap users={allUsers} stores={MOCK_PARTNER_STORES} />
                </div>
            </div>
        </div>
    );
};

// =================================================================
// TAB: Contribuisci al Database
// =================================================================
const Contribuisci: React.FC = () => {
    const initialFormState = { name: '', family: '', exposure: '', watering: '', plants: '', rows: '', sowing: '', harvest: '', companions: '', avoid: '', yield: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedProduct, setGeneratedProduct] = useState<{info: VegetableInfo, imageUrl: string} | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setGeneratedProduct(null);

        const description = `Nome: ${formData.name}, Famiglia: ${formData.family}, Esposizione: ${formData.exposure}, Irrigazione: ${formData.watering}, Distanza piante: ${formData.plants} cm, Distanza file: ${formData.rows} cm, Semina: ${formData.sowing}, Raccolta: ${formData.harvest}, Consociazioni: ${formData.companions}, Da evitare: ${formData.avoid}, Resa: ${formData.yield}`;
        const prompt = `Crea una foto realistica, vibrante e di alta qualità di un/una "${formData.name}" maturo/a. Lo sfondo deve essere pulito e neutro, con un'atmosfera rustica e luminosa. Lo stile deve essere fotografico e naturale, adatto per una moderna applicazione agricola. Nessun testo o filigrana. Deve basarsi sulla seguente descrizione: ${description}.`;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            let imageUrl = '';
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            }
            if (imageUrl) {
                 const newVegInfo: VegetableInfo = {
                    name: formData.name, family: formData.family, exposure: formData.exposure, watering: formData.watering,
                    spacing: { plants: Number(formData.plants), rows: Number(formData.rows) },
                    sowing: formData.sowing, harvest: formData.harvest, companions: formData.companions, avoid: formData.avoid, yield: formData.yield
                };
                setGeneratedProduct({ info: newVegInfo, imageUrl });
            } else {
                setError("Impossibile generare l'immagine. Riprova con una descrizione più chiara.");
            }
        } catch (err) {
            console.error(err);
            setError("Si è verificato un errore durante la generazione. Riprova più tardi.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <div className="w-12 h-12 border-4 border-agro-beige border-t-agro-green rounded-full animate-spin mx-auto"></div>
                <p className="text-agro-brown mt-4 animate-pulse">L'IA sta analizzando i dati e generando l'immagine del nuovo prodotto...</p>
            </div>
        );
    }
    
    if (generatedProduct) {
        return (
             <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-2xl font-bold text-agro-green mb-4">Prodotto Aggiunto con Successo!</h3>
                <p className="text-agro-brown mb-6 font-serif">Grazie per il tuo contributo! Ecco un'anteprima del nuovo prodotto.</p>
                <div className="max-w-sm mx-auto bg-agro-gray-light p-4 rounded-lg">
                    <img src={generatedProduct.imageUrl} alt={`Immagine di ${generatedProduct.info.name}`} className="w-full h-48 object-cover rounded-md shadow-lg mb-4" />
                    <h4 className="text-xl font-bold text-agro-green">{generatedProduct.info.name}</h4>
                    <p className="text-sm text-agro-brown">{generatedProduct.info.family}</p>
                </div>
                 <button onClick={() => { setGeneratedProduct(null); setFormData(initialFormState); }} className="mt-6 bg-agro-green text-white font-bold py-2 px-6 rounded-lg hover:bg-agro-green-light transition-colors">
                    <PlusIcon className="w-5 h-5 inline-block mr-2" />
                    Aggiungi un Altro Prodotto
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-agro-green mb-2">Contribuisci al Database di AgroIO</h3>
            <p className="text-agro-brown mb-6 font-serif">Aggiungi un nuovo tipo di ortaggio non presente nel nostro sistema. Compila i campi e la nostra IA genererà un'immagine di riferimento.</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-agro-brown mb-1">Nome Prodotto</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light" placeholder="Es. Peperone di Carmagnola" required autoComplete="off"/>
                </div>
                {Object.keys(initialFormState).filter(k => k !== 'name').map(key => (
                     <div key={key}>
                        <label className="block text-sm font-medium text-agro-brown mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <input name={key} value={formData[key as keyof typeof formData]} onChange={handleInputChange} type={key === 'plants' || key === 'rows' ? 'number' : 'text'} className="w-full px-4 py-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light" required autoComplete="off"/>
                    </div>
                ))}
                 <div className="md:col-span-2 text-right mt-4">
                     {error && <p className="text-red-500 text-sm mb-4 text-left">{error}</p>}
                     <button type="submit" className="bg-agro-green text-white font-bold py-2 px-6 rounded-lg hover:bg-agro-green-light transition-colors">
                        Invia e Genera Immagine
                    </button>
                 </div>
            </form>
        </div>
    );
};


// =================================================================
// MAIN COMMUNITY COMPONENT
// =================================================================
interface CommunityProps {
    initialTab?: string | null;
    user: User | null;
}

export const Community: React.FC<CommunityProps> = ({ initialTab, user }) => {
    const getInitialTab = (): 'bacheca' | 'agrohunter' | 'contribuisci' => {
        if (initialTab === 'agrohunter') return 'agrohunter';
        if (initialTab === 'contribuisci') return 'contribuisci';
        return 'bacheca';
    };

  const [activeTab, setActiveTab] = useState<'bacheca' | 'agrohunter' | 'contribuisci'>(getInitialTab());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-agro-green">Community - Grow Up Together</h2>
        <p className="text-agro-brown mt-1 font-serif">Condividi, impara e cresci con altri agricoltori.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-agro-gray">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                  onClick={() => setActiveTab('bacheca')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bacheca' ? 'border-agro-green text-agro-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                  Bacheca
              </button>
              <button
                  onClick={() => setActiveTab('agrohunter')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'agrohunter' ? 'border-agro-green text-agro-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                  Diventa AgroHunter
              </button>
              <button
                  onClick={() => setActiveTab('contribuisci')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contribuisci' ? 'border-agro-green text-agro-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                  Contribuisci al Database
              </button>
          </nav>
      </div>
      
      {/* Tab Content */}
      <div>
          {activeTab === 'bacheca' && <Bacheca user={user} />}
          {activeTab === 'agrohunter' && <AgroHunter user={user} />}
          {activeTab === 'contribuisci' && <Contribuisci />}
      </div>
    </div>
  );
};
