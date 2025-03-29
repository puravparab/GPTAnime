'use client';

import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { resizeImage, processZipFile } from '@/utils/imageUpload';

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
  const [imageUrl, setImageUrl] = useState('');
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
        const processedImages = await processZipFile(file);
        if (processedImages.length > 0) {
          const newImages = [...(project.images || []), ...processedImages];
          updateProject({ images: newImages });
        }
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
    
    for (const file of imageFiles) {
      try {
        const resizedImage = await resizeImage(file);
        if (!project) return;
        const newImages = [...(project.images || []), resizedImage];
        updateProject({ images: newImages });
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
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
      if (!project) return;
      const newImages = [...(project.images || []), resizedImage];
      updateProject({ images: newImages });
      setImageUrl('');
    } catch (error) {
      console.error('Error processing image URL:', error);
      alert('Failed to process image URL. Please check the console for details.');
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
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    onPaste={handleUrlPaste}
                    placeholder="Paste image URL"
                    className="px-4 py-2 rounded-full bg-white/30 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-200/60"
                  />
                </div>
                <button
                  {...getRootProps()}
                  className="inline-flex items-center px-6 py-3 text-base font-bold rounded-full text-slate-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-all duration-200 ease-in-out cursor-pointer"
                >
                  <Upload size={20} className="mr-2" />
                  Add Images
                  <input {...getInputProps()} />
                </button>
              </div>
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