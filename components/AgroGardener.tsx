import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PhotographIcon, TrashIcon } from './Icons';

// Helper to convert a file to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

// Helper to extract MIME type from base64 string
const getMimeTypeFromBase64 = (base64: string): string => {
    return base64.substring(base64.indexOf(":") + 1, base64.indexOf(";"));
};

// Sub-component for the initial image upload state
const ImageUploader: React.FC<{ onImageSelect: (file: File) => void }> = ({ onImageSelect }) => {
    const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            onImageSelect(event.dataTransfer.files[0]);
        }
    }, [onImageSelect]);

    const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageSelect(event.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <label 
                className="flex justify-center w-full h-64 px-4 transition bg-white border-2 border-agro-gray border-dashed rounded-xl appearance-none cursor-pointer hover:border-agro-green-light focus:outline-none"
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <span className="flex flex-col items-center justify-center space-y-2">
                    <PhotographIcon className="w-16 h-16 text-agro-gray" />
                    <span className="font-medium text-gray-600">
                        Trascina una foto della tua pianta o <span className="text-agro-green-light underline">clicca per sfogliare</span>
                    </span>
                    <span className="text-xs text-gray-500">PNG, JPG, JPEG (max 5MB)</span>
                </span>
                <input type="file" name="file_upload" className="hidden" accept="image/png, image/jpeg" onChange={onFileChange} />
            </label>
        </div>
    );
};

// =================================================================
// MAIN AGRO-GARDENER COMPONENT
// =================================================================
export const AgroGardener: React.FC = () => {
    const [image, setImage] = useState<{ file: File, base64: string } | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = async (file: File) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB size limit
            setError("L'immagine è troppo grande. Il limite è 5MB.");
            return;
        }
        setError(null);
        setAnalysis(null);
        const base64 = await fileToBase64(file);
        setImage({ file, base64 });
    };

    const handleAnalyze = async () => {
        if (!image) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Sei "AgroGardener", un agronomo esperto e assistente AI. Analizza la seguente immagine di una pianta.
Fornisci una diagnosi chiara, concisa e utile, formattata in Markdown.
La tua risposta DEVE includere le seguenti sezioni ESATTE con questi titoli in grassetto:

**Stato di Salute Generale**
(Descrivi la tua valutazione complessiva: sana, stressata, malata, carenza nutrizionale, ecc.)

**Potenziali Problemi Rilevati**
(Elenca in un elenco puntato i problemi specifici che noti, come macchie fogliari, ingiallimento, presenza di insetti, ecc. Se la pianta sembra sana, indicalo chiaramente.)

**Interventi Consigliati**
(Fornisci un elenco puntato di azioni pratiche e chiare che l'agricoltore può intraprendere. Sii specifico. Ad esempio, "Rimuovere le foglie infette", "Applicare olio di neem", "Verificare l'umidità del terreno", etc. Se la pianta è sana, fornisci consigli di mantenimento.)`;

            const imagePart = {
                inlineData: {
                    mimeType: getMimeTypeFromBase64(image.base64),
                    data: image.base64.split(',')[1],
                },
            };
            const textPart = { text: prompt };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image', // Using a vision-capable model
                contents: { parts: [textPart, imagePart] },
            });

            const resultText = response.text;
            setAnalysis(resultText);

        } catch (err) {
            console.error("Error analyzing image:", err);
            setError("Si è verificato un errore durante l'analisi. Per favore, riprova più tardi.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setImage(null);
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-agro-green">Your AgroGardener</h2>
                <p className="text-agro-brown mt-1 font-serif">Ottieni una diagnosi e consigli per la salute delle tue piante, powered by AI.</p>
            </div>

            <div className="bg-agro-white p-4 sm:p-8 rounded-xl shadow-md min-h-[400px]">
                {!image && <ImageUploader onImageSelect={handleImageSelect} />}
                
                {error && <p className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>}
                
                {image && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Preview & Actions */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-xl text-agro-green">La Tua Foto</h3>
                            <div className="relative">
                                <img src={image.base64} alt="Pianta da analizzare" className="rounded-lg shadow-lg w-full object-contain max-h-96" />
                                <button
                                    onClick={() => setImage(null)}
                                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                                    aria-label="Rimuovi immagine"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                             {!analysis && !isLoading && (
                                <button
                                    onClick={handleAnalyze}
                                    className="w-full bg-agro-green text-white font-bold py-3 px-4 rounded-lg hover:bg-agro-green-light transition-colors text-lg"
                                >
                                    Analizza Stato di Salute
                                </button>
                            )}
                        </div>

                        {/* Analysis Result */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-xl text-agro-green">Analisi dell'IA</h3>
                             {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full min-h-[250px] bg-agro-gray-light rounded-lg p-4">
                                    <div className="w-12 h-12 border-4 border-agro-beige border-t-agro-green rounded-full animate-spin"></div>
                                    <p className="text-agro-brown mt-4 animate-pulse">AgroGardener sta analizzando la tua pianta...</p>
                                </div>
                            )}
                            {analysis && !isLoading && (
                                <div className="bg-agro-gray-light rounded-lg p-4 space-y-4 prose prose-sm max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />').replace(/(\*|\-)\s/g, '• ') }} />
                                    <button
                                        onClick={handleReset}
                                        className="w-full mt-4 bg-agro-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                                    >
                                        Analizza un'altra Pianta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
