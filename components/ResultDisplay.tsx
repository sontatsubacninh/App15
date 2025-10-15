import React from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
    generatedImage: string | null;
    isLoading: boolean;
}

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <Spinner />
        <p className="mt-4 text-lg text-gray-400 animate-pulse">Generating your image...</p>
        <p className="mt-2 text-sm text-gray-500">This can take a moment.</p>
    </div>
);

const PlaceholderState: React.FC = () => {
    const PlaceholderIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <PlaceholderIcon />
            <p className="mt-4 text-lg font-medium text-gray-400">Your generated image will appear here.</p>
            <p className="mt-1 text-sm text-gray-500">Complete the steps on the left and click "Generate".</p>
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading }) => {
    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'generated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full aspect-[9/16] bg-gray-800 border-2 border-gray-700 rounded-lg flex items-center justify-center overflow-hidden relative">
            {isLoading ? (
                <LoadingState />
            ) : generatedImage ? (
                <>
                    <img src={generatedImage} alt="Generated result" className="object-contain w-full h-full" />
                    <button
                        onClick={handleDownload}
                        className="absolute top-2 right-2 p-2 bg-gray-900/70 text-white rounded-full hover:bg-blue-600/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                        aria-label="Download image"
                    >
                        <DownloadIcon className="w-6 h-6" />
                    </button>
                </>
            ) : (
                <PlaceholderState />
            )}
        </div>
    );
};
