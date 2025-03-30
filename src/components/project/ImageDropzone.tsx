import { useDropzone } from 'react-dropzone';
import { Upload, Trash2 } from 'lucide-react';
import { useState, forwardRef } from 'react';
import { resizeImage, processZipFile } from '@/utils/imageUpload';

interface ImageDropzoneProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
}

export default forwardRef<HTMLInputElement, ImageDropzoneProps>(function ImageDropzone({ images, onImagesChange }, ref) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleUrlPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedUrl = e.clipboardData.getData('text');
    setImageUrl(pastedUrl);
    try {
      // Validate URL first
      const urlObj = new URL(pastedUrl);
      if (!urlObj.protocol.startsWith('http')) {
        throw new Error('Not a valid HTTP URL');
      }

      console.log('Fetching image from URL:', pastedUrl);
      const response = await fetch(pastedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Fetched blob type:', blob.type);
      
      // Verify it's an image
      if (!blob.type.startsWith('image/')) {
        throw new Error('Not a valid image file');
      }
      
      const file = new File([blob], 'image.jpg', { type: blob.type });
      console.log('Processing image file:', file.name, file.type);
      
      const resizedImage = await resizeImage(file);
      const newImages = [...images, resizedImage];
      onImagesChange(newImages);
      setImageUrl(''); // Clear the input after successful processing
    } catch (error) {
      console.error('Error processing image URL:', error);
      alert('Failed to process image URL. Please check the console for details.');
    }
  };

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
      <div className="flex justify-between items-end mb-4">
        <div>
          {images.length > 0 && (
            <div className="text-white/100 text-xl font-medium">
              {images.length} {images.length === 1 ? 'Image' : 'Images'} selected
            </div>
          )}
        </div>
        <div className="flex items-center border border-white/40 rounded-full overflow-hidden">
          <div className="flex items-center">
            <input
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              onPaste={handleUrlPaste}
              placeholder="Paste image URL"
              className="px-4 py-2 rounded-l-full bg-white/10 border-none focus:outline-none focus:ring-2 focus:ring-slate-200/60 text-white/90 placeholder-white/80 w-64"
            />
          </div>
          <button
            onClick={() => {
              // @ts-ignore
              ref?.current?.click();
            }}
            className="inline-flex items-center px-3 py-2 text-base font-bold rounded-r-full text-slate-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-all duration-200 ease-in-out cursor-pointer"
          >
            <Upload size={20} className="mr-2" />
            Add Images
          </button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`min-h-[12rem] border-2 border-dashed rounded-lg transition-colors cursor-pointer relative ${
          isDragActive ? 'border-white/70 bg-white/5' : 'border-white/60 bg-transparent'
        }`}
      >
        <div className="p-4">
          {(!images || images.length === 0) ? (
            <div className="h-48 flex flex-col items-center justify-center relative">
              <input
                type="file"
                accept="image/*,.zip"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  onDrop(files);
                }}
              />
              <Upload className="h-8 w-8 text-white/80" />
              <p className="mt-2 text-base font-medium text-white/80">
                Click or drop images or .zip folder here
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
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