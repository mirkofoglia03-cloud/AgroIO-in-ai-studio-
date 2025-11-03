import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { VEGETABLE_DATABASE, FARMING_SYSTEMS } from '../constants';
import type { VegetableInfo, GardenData, FarmingSystem } from '../types';
import { GreenhouseIcon, RaisedBedIcon, PotIcon, FieldIcon, SunFullIcon, SunPartialIcon, SunShadeIcon, PlusIcon, TrashIcon, PhotographIcon, CloseIcon } from './Icons';

type CultivationType = 'Campo Aperto' | 'Serra' | 'Aiuole Rialzate' | 'Vasi';
type SunExposure = 'Pieno Sole' | 'Mezz\'ombra' | 'Ombra Piena';

interface DesignGardenProps {
    latitude?: number;
    longitude?: number;
}

const TOTAL_STEPS = 7;

// =================================================================
// HELPER: Base64 converter
// =================================================================
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};


// =================================================================
// PROGRESS BAR COMPONENT
// =================================================================
const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const progressPercentage = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
    return (
        <div className="w-full bg-agro-gray rounded-full h-2.5 mb-8">
            <div
                className="bg-agro-green h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

// =================================================================
// MAIN DESIGN GARDEN COMPONENT
// =================================================================
export const DesignGarden: React.FC<DesignGardenProps> = ({ latitude, longitude }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [gardenData, setGardenData] = useState<GardenData>({
        farmingSystem: null,
        cultivationType: null,
        sunExposure: null,
        selectedPlants: [],
        dimensions: { width: '', length: '' },
        gardenImage: null,
    });
    const [layoutSuggestion, setLayoutSuggestion] = useState('');
    const [graphicalLayout, setGraphicalLayout] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const startOver = () => {
        setCurrentStep(1);
        setGardenData({
            farmingSystem: null,
            cultivationType: null,
            sunExposure: null,
            selectedPlants: [],
            dimensions: { width: '', length: '' },
            gardenImage: null,
        });
        setLayoutSuggestion('');
        setGraphicalLayout('');
        setError('');
    };


    const generateLayout = async () => {
        setIsLoading(true);
        setError('');
        setLayoutSuggestion('');
        setGraphicalLayout('');

        const photoContext = gardenData.gardenImage ? "Una foto dell'area è stata fornita." : "Nessuna foto fornita.";

        const textPrompt = `Agisci come un esperto di permacultura e progettazione di orti.
        La tua risposta DEVE contenere due parti distinte: una descrizione testuale e un rendering grafico.

        **1. Descrizione Testuale Dettagliata:**
        Basandoti sulle seguenti informazioni, fornisci una semplice ma efficace descrizione testuale per un layout di un orto. Descrivi dove posizionare ogni pianta per una crescita ottimale, considerando le consociazioni benefiche (piante amiche) e quelle da evitare. Struttura la risposta in sezioni chiare e usa elenchi puntati. Tieni conto della filosofia del sistema agricolo scelto.
        
        **2. Rendering Grafico Semplice:**
        Crea uno schizzo del layout. Se è stata fornita una foto, sovrapponi il layout a quella foto in modo schematico. Se non c'è una foto, crea un disegno da zero. Il rendering deve essere chiaro e indicare le aree per le diverse piante.

        **Dettagli dell'Orto:**
        - **Sistema Agricolo:** ${gardenData.farmingSystem?.name}
        - **Tipo di Coltivazione:** ${gardenData.cultivationType}
        - **Dimensioni:** ${gardenData.dimensions.width} metri (larghezza) x ${gardenData.dimensions.length} metri (lunghezza)
        - **Esposizione Solare:** ${gardenData.sunExposure}
        - **Piante Selezionate:** ${gardenData.selectedPlants.map(p => p.name).join(', ')}
        - **Contesto:** ${photoContext}
        
        Fornisci consigli pratici e concisi in entrambi gli output. Assicurati che l'output contenga sia la parte testuale che quella grafica.`;
        
        const parts: any[] = [{ text: textPrompt }];

        if (gardenData.gardenImage) {
            parts.push({
                inlineData: {
                    mimeType: gardenData.gardenImage.split(';')[0].split(':')[1],
                    data: gardenData.gardenImage.split(',')[1],
                }
            });
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: parts },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            let foundText = false;
            let foundImage = false;
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.text) {
                    setLayoutSuggestion(part.text);
                    foundText = true;
                } else if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    setGraphicalLayout(imageUrl);
                    foundImage = true;
                }
            }

            if (!foundText && !foundImage) {
                 setError("L'IA non ha fornito una risposta valida. Riprova modificando leggermente i parametri.");
            }

        } catch (e) {
            console.error("Error generating layout:", e);
            setError("Si è verificato un errore durante la generazione del suggerimento. Riprova.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1FarmingSystem setData={setGardenData} onNext={handleNextStep} currentValue={gardenData.farmingSystem} />;
            case 2:
                return <Step2CultivationType setData={setGardenData} onNext={handleNextStep} onBack={handlePrevStep} currentValue={gardenData.cultivationType} />;
            case 3:
                return <Step3SunExposure setData={setGardenData} onNext={handleNextStep} onBack={handlePrevStep} currentValue={gardenData.sunExposure} latitude={latitude} longitude={longitude} />;
            case 4:
                return <Step4SelectPlants setData={setGardenData} onNext={handleNextStep} onBack={handlePrevStep} currentValue={gardenData.selectedPlants} />;
            case 5:
                return <Step5Dimensions setData={setGardenData} onNext={handleNextStep} onBack={handlePrevStep} currentValue={gardenData.dimensions} />;
            case 6:
                return <Step6PhotoUpload setData={setGardenData} onNext={handleNextStep} onBack={handlePrevStep} currentValue={gardenData.gardenImage} />;
            case 7:
                return <Step7Summary gardenData={gardenData} onBack={handlePrevStep} onGenerate={generateLayout} suggestion={layoutSuggestion} graphicalLayout={graphicalLayout} isLoading={isLoading} error={error} onStartOver={startOver} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-agro-white p-4 sm:p-8 rounded-xl shadow-md min-h-full">
            <div className="max-w-4xl mx-auto">
                {currentStep < TOTAL_STEPS && (
                     <h2 className="text-3xl font-bold text-agro-green text-center">Progetta il Tuo Orto Ideale</h2>
                )}
                <ProgressBar currentStep={currentStep} />
                {renderStep()}
            </div>
        </div>
    );
};


// =================================================================
// WIZARD STEP COMPONENTS
// =================================================================

const SystemDetailModal: React.FC<{system: FarmingSystem, onClose: () => void}> = ({ system, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4 transform transition-all max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-agro-green">{system.name}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
                        <CloseIcon className="w-6 h-6 text-agro-brown" />
                    </button>
                </div>
                <div className="overflow-y-auto">
                    <p className="text-gray-600 mb-6">{system.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-green-700 mb-2">Vantaggi</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {system.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-700 mb-2">Svantaggi</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {system.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Step1FarmingSystem: React.FC<{ setData: React.Dispatch<React.SetStateAction<GardenData>>, onNext: () => void, currentValue: FarmingSystem | null }> = ({ setData, onNext, currentValue }) => {
    const [detailModalSystem, setDetailModalSystem] = useState<FarmingSystem | null>(null);

    const handleSelect = (system: FarmingSystem) => {
        setData((prev) => ({ ...prev, farmingSystem: system }));
        onNext();
    };

    return (
        <div className="text-center">
             <h3 className="text-2xl font-semibold text-agro-brown mb-2 font-serif">Passo 1: Qual è il tuo approccio all'agricoltura?</h3>
            <p className="text-gray-600 mb-8">Scegli il sistema agricolo che meglio rappresenta la tua filosofia.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FARMING_SYSTEMS.map((system) => {
                    const Icon = system.icon;
                    const isSelected = currentValue?.name === system.name;
                    return (
                        <div key={system.name} className={'p-4 border-2 rounded-xl text-center transition-all duration-300 flex flex-col items-center justify-between h-56 ' + (isSelected ? 'border-agro-green bg-agro-green/10 shadow-lg' : 'border-agro-gray hover:border-agro-green-light hover:shadow-md')}>
                            <div>
                                <Icon className="w-10 h-10 text-agro-green mx-auto mb-3" />
                                <h4 className="font-bold text-agro-brown">{system.name}</h4>
                                <p className="text-xs text-gray-500 mt-2">{system.description}</p>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <button onClick={() => handleSelect(system)} className="text-sm bg-agro-green text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-agro-green-light">Seleziona</button>
                                <button onClick={(e) => { e.stopPropagation(); setDetailModalSystem(system); }} className="text-sm text-agro-brown underline hover:text-agro-green">Dettagli</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {detailModalSystem && <SystemDetailModal system={detailModalSystem} onClose={() => setDetailModalSystem(null)} />}
        </div>
    );
};


const Step2CultivationType: React.FC<{ setData: React.Dispatch<React.SetStateAction<GardenData>>, onNext: () => void, onBack: () => void, currentValue: CultivationType | null }> = ({ setData, onNext, onBack, currentValue }) => {
    const types: { name: CultivationType, icon: React.FC<any> }[] = [
        { name: 'Campo Aperto', icon: FieldIcon },
        { name: 'Serra', icon: GreenhouseIcon },
        { name: 'Aiuole Rialzate', icon: RaisedBedIcon },
        { name: 'Vasi', icon: PotIcon },
    ];
    return (
        <div className="text-center">
            <h3 className="text-2xl font-semibold text-agro-brown mb-2 font-serif">Passo 2: Che tipo di coltivazione vuoi effettuare?</h3>
            <p className="text-gray-600 mb-8">La scelta influenzerà la selezione delle piante e la disposizione.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {types.map(({ name, icon: Icon }) => (
                    <button key={name} onClick={() => { setData((prev) => ({ ...prev, cultivationType: name })); onNext(); }}
                        className={'p-6 border-2 rounded-xl text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center h-40 ' + (currentValue === name ? 'border-agro-green bg-agro-green/10 shadow-lg' : 'border-agro-gray hover:border-agro-green-light hover:shadow-md')}>
                        <Icon className="w-12 h-12 text-agro-green mb-3" />
                        <span className="font-bold text-agro-brown">{name}</span>
                    </button>
                ))}
            </div>
             <div className="mt-8 flex justify-center">
                <button onClick={onBack} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors">Indietro</button>
            </div>
        </div>
    );
};

const Step3SunExposure: React.FC<{ setData: React.Dispatch<React.SetStateAction<GardenData>>, onNext: () => void, onBack: () => void, currentValue: SunExposure | null, latitude?: number, longitude?: number }> = ({ setData, onNext, onBack, currentValue, latitude, longitude }) => {
    const exposures: { name: SunExposure, icon: React.FC<any>, description: string }[] = [
        { name: 'Pieno Sole', icon: SunFullIcon, description: '6+ ore di luce solare diretta al giorno.' },
        { name: 'Mezz\'ombra', icon: SunPartialIcon, description: '3-6 ore di luce solare diretta.' },
        { name: 'Ombra Piena', icon: SunShadeIcon, description: 'Meno di 3 ore di luce solare diretta.' },
    ];
    return (
        <div className="text-center">
            <h3 className="text-2xl font-semibold text-agro-brown mb-2 font-serif">Passo 3: Qual è l'esposizione solare?</h3>
            <p className="text-gray-600 mb-2">Questo è fondamentale per la salute delle tue piante.</p>
            {latitude && longitude && <p className="text-sm text-gray-500 mb-8">Località rilevata: Lat {latitude.toFixed(2)}, Lon {longitude.toFixed(2)}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {exposures.map(({ name, icon: Icon, description }) => (
                    <button key={name} onClick={() => { setData((prev) => ({ ...prev, sunExposure: name })); onNext(); }}
                        className={'p-6 border-2 rounded-xl text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center h-48 ' + (currentValue === name ? 'border-agro-green bg-agro-green/10 shadow-lg' : 'border-agro-gray hover:border-agro-green-light hover:shadow-md')}>
                        <Icon className="w-12 h-12 text-yellow-500 mb-3" />
                        <span className="font-bold text-agro-brown">{name}</span>
                        <p className="text-xs text-gray-500 mt-2">{description}</p>
                    </button>
                ))}
            </div>
            <div className="mt-8 flex justify-center">
                <button onClick={onBack} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors">Indietro</button>
            </div>
        </div>
    );
};


const Step4SelectPlants: React.FC<{ setData: React.Dispatch<React.SetStateAction<GardenData>>, onNext: () => void, onBack: () => void, currentValue: VegetableInfo[] }> = ({ setData, onNext, onBack, currentValue }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPlants = useMemo(() =>
        VEGETABLE_DATABASE.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    , [searchTerm]);

    const addPlant = (plant: VegetableInfo) => {
        if (!currentValue.some(p => p.name === plant.name)) {
            setData((prev) => ({ ...prev, selectedPlants: [...prev.selectedPlants, plant] }));
        }
    };
    const removePlant = (plant: VegetableInfo) => {
        setData((prev) => ({ ...prev, selectedPlants: prev.selectedPlants.filter(p => p.name !== plant.name) }));
    };

    return (
        <div className="text-center">
             <h3 className="text-2xl font-semibold text-agro-brown mb-2 font-serif">Passo 4: Scegli cosa coltivare</h3>
             <p className="text-gray-600 mb-6">Seleziona ortaggi, erbe aromatiche e frutta per il tuo orto.</p>
            <div className="flex flex-col md:flex-row gap-6 max-h-[60vh]">
                {/* Left: Plant List */}
                <div className="md:w-1/2 flex flex-col border border-agro-gray rounded-xl p-4">
                    <input type="text" placeholder="Cerca una pianta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-agro-gray rounded-lg mb-4"/>
                    <ul className="overflow-y-auto space-y-2">
                        {filteredPlants.map(plant => (
                            <li key={plant.name} className="flex justify-between items-center p-2 rounded-lg hover:bg-agro-gray-light">
                                <span className="text-agro-brown">{plant.name}</span>
                                <button onClick={() => addPlant(plant)} className="p-1.5 bg-agro-green text-white rounded-full hover:bg-agro-green-light disabled:bg-gray-300" disabled={currentValue.some(p => p.name === plant.name)}>
                                    <PlusIcon className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Right: Selected Plants */}
                 <div className="md:w-1/2 flex flex-col border border-agro-gray rounded-xl p-4 bg-agro-gray-light/50">
                     <h4 className="font-bold text-agro-green mb-4 text-left">Piante Selezionate ({currentValue.length})</h4>
                     <div className="flex-1 overflow-y-auto">
                        {currentValue.length === 0 ? (
                             <div className="flex items-center justify-center h-full">
                                <p className="text-agro-brown font-serif italic">Nessuna pianta selezionata.</p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {currentValue.map(plant => (
                                <li key={plant.name} className="flex justify-between items-center p-2 rounded-lg bg-white shadow-sm">
                                    <span className="text-agro-brown">{plant.name}</span>
                                    <button onClick={() => removePlant(plant)} className="p-1.5 text-red-500 rounded-full hover:bg-red-100">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                                ))}
                            </ul>
                        )}
                     </div>
                 </div>
            </div>
             <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors">Indietro</button>
                <button onClick={onNext} disabled={currentValue.length === 0} className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light transition-colors disabled:bg-agro-green-light/50 disabled:cursor-not-allowed">Avanti</button>
            </div>
        </div>
    );
};

const Step5Dimensions: React.FC<{ setData: React.Dispatch<React.SetStateAction<GardenData>>, onNext: () => void, onBack: () => void, currentValue: {width: string, length: string} }> = ({ setData, onNext, onBack, currentValue }) => {
    return (
        <div className="text-center max-w-sm mx-auto">
             <h3 className="text-2xl font-semibold text-agro-brown mb-2 font-serif">Passo 5: Quali sono le dimensioni?</h3>
             <p className="text-gray-600 mb-8">Inserisci le misure in metri per definire l'area di coltivazione.</p>
             <div className="space-y-4">
                 <div>
                    <label htmlFor="width" className="block text-sm font-medium text-agro-brown mb-1 text-left">Larghezza (metri)</label>
                    <input type="number" id="width" value={currentValue.width} onChange={e => setData((prev) => ({ ...prev, dimensions: {...prev.dimensions, width: e.target.value} }))} className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="Es. 5"/>
                 </div>
                 <div>
                    <label htmlFor="length" className="block text-sm font-medium text-agro-brown mb-1 text-left">Lunghezza (metri)</label>
                    <input type="number" id="length" value={currentValue.length} onChange={e => setData((prev) => ({ ...prev, dimensions: {...prev.dimensions, length: e.target.value} }))} className="w-full px-4 py-2 border border-agro-gray rounded-lg" placeholder="Es. 10"/>
                 </div>
             </div>
             <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors">Indietro</button>
                <button onClick={onNext} disabled={!currentValue.width || !currentValue.length} className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light transition-colors disabled:bg-agro-green-light/50 disabled:cursor-not-allowed">Avanti</button>
            </div>
        </div>
    );
};

const Step6PhotoUpload: React.FC<{ setData: React.Dispatch<React.SetStateAction<GardenData>>, onNext: () => void, onBack: () => void, currentValue: string | null }> = ({ setData, onNext, onBack, currentValue }) => {
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setData((prev) => ({ ...prev, gardenImage: base64 }));
        }
    };

    const removeImage = () => {
        setData((prev) => ({ ...prev, gardenImage: null }));
    };

    return (
        <div className="text-center">
            <h3 className="text-2xl font-semibold text-agro-brown mb-2 font-serif">Passo 6: Carica una foto (Opzionale)</h3>
            <p className="text-gray-600 mb-8">Mostra all'IA il tuo spazio per un suggerimento più accurato.</p>
            
            <div className="w-full max-w-lg mx-auto">
                {!currentValue ? (
                    <label className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-agro-gray border-dashed rounded-md appearance-none cursor-pointer hover:border-agro-green-light focus:outline-none">
                        <span className="flex flex-col items-center justify-center space-x-2">
                            <PhotographIcon className="w-16 h-16 text-agro-gray" />
                            <span className="font-medium text-gray-600">
                                Trascina un'immagine o <span className="text-agro-green-light underline">sfoglia</span>
                            </span>
                             <span className="text-xs text-gray-500">PNG, JPG, JPEG</span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    </label>
                ) : (
                    <div className="relative">
                        <img src={currentValue} alt="Anteprima del giardino" className="w-full h-auto max-h-72 object-contain rounded-lg shadow-md" />
                        <button onClick={removeImage} className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

             <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors">Indietro</button>
                <button onClick={onNext} className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light transition-colors">
                    {currentValue ? 'Avanti' : 'Salta questo passaggio'}
                </button>
            </div>
        </div>
    );
};


const Step7Summary: React.FC<{ gardenData: GardenData, onBack: () => void, onGenerate: () => void, suggestion: string, graphicalLayout: string, isLoading: boolean, error: string, onStartOver: () => void }> = ({ gardenData, onBack, onGenerate, suggestion, graphicalLayout, isLoading, error, onStartOver }) => {
    const [activeTab, setActiveTab] = useState<'text' | 'image' | 'yield'>('text');
    
    const SummaryItem: React.FC<{label: string, value: string | null}> = ({label, value}) => (
        <div>
            <p className="text-sm font-semibold text-agro-brown">{label}</p>
            <p className="text-lg text-agro-green font-serif">{value || 'N/D'}</p>
        </div>
    );

    const plantCalculations = useMemo(() => {
        if (!gardenData.dimensions.width || !gardenData.dimensions.length) return [];
        const area = parseFloat(gardenData.dimensions.width) * parseFloat(gardenData.dimensions.length);
        if (area === 0) return [];

        return gardenData.selectedPlants.map(plant => {
            const plantArea = (plant.spacing.plants / 100) * (plant.spacing.rows / 100);
            const quantity = Math.floor(area / plantArea / gardenData.selectedPlants.length); // Simple division of space
            return {
                name: plant.name,
                quantity,
                yield: plant.yield
            };
        });
    }, [gardenData.dimensions, gardenData.selectedPlants]);
    
    return (
        <div>
             <h2 className="text-3xl font-bold text-agro-green text-center mb-4">Riepilogo e Layout</h2>
             <p className="text-gray-600 mb-8 text-center">Controlla i dati e genera un suggerimento di layout per il tuo orto.</p>
            <div className="bg-agro-gray-light/60 p-6 rounded-xl space-y-4 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SummaryItem label="Sistema Agricolo" value={gardenData.farmingSystem?.name ?? null} />
                    <SummaryItem label="Tipo Coltivazione" value={gardenData.cultivationType} />
                    <SummaryItem label="Esposizione" value={gardenData.sunExposure} />
                    <SummaryItem label="Dimensioni" value={gardenData.dimensions.width + 'm x ' + gardenData.dimensions.length + 'm'} />
                     <div className="col-span-2 md:col-span-4">
                        <p className="text-sm font-semibold text-agro-brown">Piante ({gardenData.selectedPlants.length})</p>
                        <p className="text-sm text-agro-green font-serif">{gardenData.selectedPlants.map(p => p.name).join(', ')}</p>
                    </div>
                </div>
            </div>
            
            {!suggestion && !isLoading && !error && (
                 <div className="text-center">
                    <button onClick={onGenerate} className="px-8 py-3 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light transition-colors text-lg">
                        Crea Suggerimento Layout
                    </button>
                </div>
            )}
            
            {isLoading && (
                <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-agro-beige border-t-agro-green rounded-full animate-spin mx-auto"></div>
                    <p className="text-agro-brown mt-4 animate-pulse">L'intelligenza artificiale sta progettando il tuo orto...</p>
                </div>
            )}

            {error && <p className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>}
            
            {(suggestion || graphicalLayout) && !isLoading && (
                <div>
                    <div className="border-b border-agro-gray mb-4">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setActiveTab('text')} className={'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'text' ? 'border-agro-green text-agro-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                                Descrizione
                            </button>
                            <button onClick={() => setActiveTab('image')} className={'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'image' ? 'border-agro-green text-agro-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                                Rendering
                            </button>
                            <button onClick={() => setActiveTab('yield')} className={'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'yield' ? 'border-agro-green text-agro-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                                Quantità e Resa
                            </button>
                        </nav>
                    </div>

                    <div className="bg-agro-gray-light/60 p-6 rounded-xl min-h-[200px]">
                        {activeTab === 'text' && suggestion && (
                            <div className="prose prose-sm sm:prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: suggestion.replace(/\n/g, '<br />') }} />
                            </div>
                        )}
                        {activeTab === 'image' && (
                            graphicalLayout ? 
                             <img src={graphicalLayout} alt="Rendering grafico del giardino" className="w-full h-auto rounded-lg shadow-md" /> :
                             <div className="flex items-center justify-center h-full"><p className="text-agro-brown font-serif italic">Nessun rendering grafico disponibile.</p></div>
                        )}
                        {activeTab === 'yield' && (
                             <div>
                                <h4 className="text-xl font-bold text-agro-green mb-4">Stima Quantità e Resa</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg shadow">
                                        <thead>
                                            <tr className="bg-agro-green/10">
                                                <th className="text-left font-semibold text-agro-green p-3">Pianta</th>
                                                <th className="text-center font-semibold text-agro-green p-3">Quantità Stimata</th>
                                                <th className="text-left font-semibold text-agro-green p-3">Resa Potenziale</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plantCalculations.map(p => (
                                                <tr key={p.name} className="border-t border-agro-gray">
                                                    <td className="p-3 text-agro-brown">{p.name}</td>
                                                    <td className="p-3 text-agro-brown text-center">{p.quantity > 0 ? `~ ${p.quantity} piante` : 'Spazio insufficiente'}</td>
                                                    <td className="p-3 text-agro-brown">{p.yield}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 italic">*Le stime sono approssimative e basate su una divisione equa dello spazio. La disposizione effettiva può variare.</p>
                             </div>
                        )}
                    </div>
                </div>
            )}
            
             <div className="mt-8 flex justify-between">
                <button onClick={() => (suggestion || graphicalLayout) ? onStartOver() : onBack()} className="px-6 py-2 rounded-lg text-agro-brown border border-agro-gray hover:bg-agro-gray-light transition-colors">
                    {(suggestion || graphicalLayout) ? 'Ricomincia' : 'Indietro'}
                </button>
            </div>
        </div>
    );
};