
import React, { useState, useCallback } from 'react';
import { generateImageFromImageAndPrompt } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';

const App: React.FC = () => {
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (e.g., JPEG, PNG).');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError('File size exceeds 10MB. Please choose a smaller image.');
                return;
            }

            setError(null);
            setReferenceImage(file);
            try {
                const previewUrl = await fileToBase64(file);
                setReferenceImagePreview(previewUrl);
            } catch (e) {
                setError('Could not read the image file.');
            }
        }
    }, []);

    const handleImageRemove = useCallback(() => {
        setReferenceImage(null);
        setReferenceImagePreview(null);
    }, []);

    const handleGenerate = useCallback(async () => {
        if (!referenceImage || !prompt.trim()) {
            setError('Please upload a reference image and describe an action.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setGeneratedImage(null);

        try {
            const dataUrl = await fileToBase64(referenceImage);
            const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
            const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);

            const result = await generateImageFromImageAndPrompt(base64Data, mimeType, prompt);
            setGeneratedImage(result);

        } catch (e) {
            const err = e instanceof Error ? e : new Error('An unknown error occurred');
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [referenceImage, prompt]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">AI Image Action Generator</h1>
                    <p className="mt-4 text-lg text-gray-400">Bring your characters to life. Upload an image, describe an action, and see the magic.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Input Section */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <label className="text-lg font-medium text-gray-300 mb-2 block">1. Upload Reference Image</label>
                            <ImageUploader
                                imagePreview={referenceImagePreview}
                                onImageChange={handleImageChange}
                                onImageRemove={handleImageRemove}
                                isLoading={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="prompt-input" className="text-lg font-medium text-gray-300 mb-2 block">2. Describe the Action</label>
                            <textarea
                                id="prompt-input"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., riding a skateboard in a futuristic city, painting a masterpiece in a sunlit studio, exploring a mysterious jungle..."
                                className="w-full h-32 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !referenceImage || !prompt}
                            className="w-full flex justify-center items-center py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                        >
                            {isLoading ? 'Generating...' : 'Generate Image'}
                        </button>
                        
                        {error && <p className="text-red-400 text-center font-medium bg-red-900/50 p-3 rounded-lg">{error}</p>}
                    </div>

                    {/* Output Section */}
                    <div>
                         <label className="text-lg font-medium text-gray-300 mb-2 block">Result</label>
                        <ResultDisplay
                            generatedImage={generatedImage}
                            isLoading={isLoading}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
