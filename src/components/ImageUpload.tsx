import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  images: File[];
  setImages: (images: File[]) => void;
  maxImages?: number;

}

export default function ImageUpload({ images, setImages, maxImages = 4 }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prevImages => {
      const newImages = [...prevImages, ...acceptedFiles].slice(0, maxImages);
      return newImages;
    });
  }, [maxImages, setImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    disabled: images.length >= maxImages
  });

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-600">
          <ImageIcon className="w-8 h-8 mb-2" />
          <p className="text-sm text-center">
            {images.length >= maxImages
              ? 'Maximum images reached'
              : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Max {maxImages} images • Up to 5MB each
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {images.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg
                  hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}