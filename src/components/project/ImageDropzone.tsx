import { useDropzone } from 'react-dropzone';
import { Upload, Trash2 } from 'lucide-react';
import { useState, forwardRef } from 'react';
import { resizeImage, processZipFile } from '@/utils/imageUpload';

interface ImageDropzoneProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
  triggerButton?: React.ReactNode;
}

export default forwardRef<HTMLInputElement, ImageDropzoneProps>(function ImageDropzone({ images, onImagesChange, triggerButton }, ref) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const newImages = [...images];
    
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        try {
          const resizedImage = await resizeImage(file);
          newImages.push(resizedImage);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      } else if (file.type === 'application/zip') {
        const processedImages = await processZipFile(file);
        if (processedImages.length > 0) {
          newImages.push(...processedImages);
        }
      }
    }
    
    onImagesChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'application/zip': ['.zip']
    },
    noClick: true,
    noKeyboard: false,
    multiple: true,
    // @ts-ignore
    directory: true
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`min-h-[12rem] border-2 border-dashed rounded-lg transition-colors ${
          isDragActive ? 'border-white/70 bg-white/5' : 'border-white/60 bg-transparent'
        }`}
      >
        <div className="p-4">
          {(!images || images.length === 0) ? (
            <div className="h-48 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-white/80" />
              <p className="mt-2 text-base font-medium text-white/80">
                Drop images or .zip folder here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group overflow-hidden">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-1 right-1 bg-amber-50/80 text-slate-800 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input {...getInputProps()} ref={ref} />
        </div>
      </div>

      {triggerButton && (
        <div className="mt-4 flex justify-end">
          {triggerButton}
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999] cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}); 