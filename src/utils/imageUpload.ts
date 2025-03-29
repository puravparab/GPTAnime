import JSZip from 'jszip';

export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Maximum width for the resized image
        const MAX_HEIGHT = 800; // Maximum height for the resized image
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8)); // 0.8 quality for good compression
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const processZipFile = async (file: File): Promise<string[]> => {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    // Array to store all processed images
    const processedImages: string[] = [];
    
    // Process all files in the zip
    for (const [filename, zipEntry] of Object.entries(contents.files)) {
      // Skip directories, non-image files, and macOS system files
      if (zipEntry.dir || 
          !filename.match(/\.(png|jpeg|jpg|webp)$/i) || 
          filename.startsWith('__MACOSX') || 
          filename.startsWith('._')) continue;
      
      try {
        // Get the file data as blob
        const blob = await zipEntry.async('blob');
        
        // Skip files that are too small to be valid images
        if (blob.size < 1000) {
          console.log('Skipping file too small to be a valid image:', filename, 'Size:', blob.size);
          continue;
        }
        
        const imageFile = new File([blob], filename, { type: `image/${filename.split('.').pop()}` });
        
        console.log('Processing image from zip:', filename, 'Size:', blob.size);
        
        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a new Image object and load it
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // Wait for the image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (e) => {
            URL.revokeObjectURL(blobUrl);
            reject(new Error(`Failed to load image: ${filename}`));
          };
          img.src = blobUrl;
        });
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        URL.revokeObjectURL(blobUrl);
        
        // Add to processed images array
        processedImages.push(resizedImage);
      } catch (error) {
        console.error('Error processing image from zip:', filename, 'Error details:', error);
        if (error instanceof Error) {
          console.error('Error stack:', error.stack);
        }
      }
    }
    
    return processedImages;
  } catch (error) {
    console.error('Error processing zip file:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}; 