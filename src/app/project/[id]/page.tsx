'use client';

import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import JSZip from 'jszip';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  images: string[];
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const directoryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const existingProject = projects.find((p: Project) => p.id === resolvedParams.id);
      if (existingProject) {
        setProject(existingProject);
      } else {
        setProject({
          id: resolvedParams.id,
          name: 'Project ' + resolvedParams.id,
          createdAt: new Date(),
          images: []
        });
      }
    } else {
      setProject({
        id: resolvedParams.id,
        name: 'Project ' + resolvedParams.id,
        createdAt: new Date(),
        images: []
      });
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  const updateProject = (updates: Partial<Project>) => {
    if (!project) return;
    
    const updatedProject = { ...project, ...updates };
    setProject(updatedProject);

    const savedProjects = localStorage.getItem('projects');
    const projects = savedProjects ? JSON.parse(savedProjects) : [];
    const updatedProjects = projects.map((p: Project) => 
      p.id === resolvedParams.id ? updatedProject : p
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const resizeImage = (file: File): Promise<string> => {
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

  const processZipFile = async (file: File) => {
    if (!project) return;
    
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
      
      // Update project with all processed images at once
      if (processedImages.length > 0) {
        const newImages = [...(project.images || []), ...processedImages];
        updateProject({ images: newImages });
      }
    } catch (error) {
      console.error('Error processing zip file:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (!project) return;
    
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        try {
          const resizedImage = await resizeImage(file);
          const newImages = [...(project.images || []), resizedImage];
          updateProject({ images: newImages });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      } else if (file.type === 'application/zip') {
        await processZipFile(file);
      }
    }
  };

  const removeImage = (index: number) => {
    if (!project) return;
    
    const newImages = [...project.images];
    newImages.splice(index, 1);
    updateProject({ images: newImages });
  };

  const handleDirectoryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && 
      /\.(png|jpeg|jpg|webp)$/i.test(file.name)
    );
    
    if (imageFiles.length > 0) {
      const processedImages: string[] = [];
      
      for (const file of imageFiles) {
        try {
          const resizedImage = await resizeImage(file);
          processedImages.push(resizedImage);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
      
      if (processedImages.length > 0) {
        const newImages = [...(project?.images || []), ...processedImages];
        updateProject({ images: newImages });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'application/zip': ['.zip']
    },
    noClick: false,
    noKeyboard: false,
    multiple: true,
    // @ts-ignore
    directory: true
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
        <div className="text-white text-2xl">Project not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/video/background.mp4" type="video/mp4" />
        </video>
        <div className="relative z-[1]">
          <div className="text-center text-white p-8">
            <Link href="/" className="inline-block">
              <h1 className="text-7xl font-extrabold mb-8 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-50 to-white">
                GPT Anime
              </h1>
            </Link>
            <p className="text-3xl font-medium tracking-wide drop-shadow-lg max-w-3xl mx-auto leading-relaxed text-white mb-12">
              Your photos reimagined in your favorite anime
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-8">
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject({ name: e.target.value })}
                className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-amber-200/60 rounded px-2 text-white placeholder-white/60"
              />
              <button
                {...getRootProps()}
                className="inline-flex items-center px-6 py-3 text-base font-bold rounded-full text-slate-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <Upload size={20} className="mr-2" />
                Add Images
                <input {...getInputProps()} />
              </button>
            </div>

            {(!project.images || project.images.length === 0) && (
              <div
                {...getRootProps()}
                className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-white/70 bg-white/5' : 'border-white/60 bg-transparent'
                }`}
              >
                <Upload className="h-8 w-8 text-white/80" />
                <p className="mt-2 text-base font-medium text-white/80">
                  Drop images or .zip folder here
                </p>
              </div>
            )}

            {project.images && project.images.length > 0 && (
              <div className="mt-8 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 border border-white/30 rounded-lg p-4">
                {project.images.map((image, index) => (
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
          </div>
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
} 