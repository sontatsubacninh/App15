import React from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';

interface ImageUploaderProps {
    imagePreview: string | null;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onImageRemove: () => void;
    isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageChange, onImageRemove, isLoading }) => {
    return (
        <div className="w-full aspect-[9/16] bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center relative transition-colors duration-200">
            {imagePreview ? (
                <>
                    <img src={imagePreview} alt="Reference preview" className="object-contain w-full h-full rounded-lg" />
                    <button
                        onClick={onImageRemove}
                        className="absolute top-2 right-2 p-1.5 bg-gray-900/70 text-white rounded-full hover:bg-red-600/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                        aria-label="Remove image"
                        disabled={isLoading}
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </>
            ) : (
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center text-center p-4 cursor-pointer">
                    <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
                    <span className="font-semibold text-gray-400">Click to upload or drag and drop</span>
                    <span className="text-sm text-gray-500">PNG, JPG, WEBP (Max 10MB)</span>
                    <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={onImageChange}
                        disabled={isLoading}
                    />
                </label>
            )}
        </div>
    );
};
