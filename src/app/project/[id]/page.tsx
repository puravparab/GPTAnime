'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, History } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { resizeImage, processZipFile } from '@/utils/imageUpload';
import PromptSection from '@/components/project/PromptSection';
import ImageDropzone from '@/components/project/ImageDropzone';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  images: string[];
  prompt?: string;
  style?: string;
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const directoryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="text-center text-white p-4">
          <Link href="/" className="inline-block">
            <h1 className="text-7xl font-extrabold mb-4 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-50 to-white">
              GPT Anime
            </h1>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProject({ name: e.target.value })}
              className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-amber-200/60 rounded px-2 text-white placeholder-white/60"
            />
            <button
              className="inline-flex items-center px-6 py-2 text-base font-bold rounded-full text-slate-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-all duration-200 ease-in-out cursor-pointer"
            >
              <History size={20} className="mr-2" />
              History
            </button>
          </div>

          <PromptSection
            prompt={prompt}
            setPrompt={setPrompt}
            style={project.style}
            updateProject={updateProject}
            images={project.images}
            projectId={project.id}
          />

          <div className="flex justify-end gap-4 mb-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                onPaste={handleUrlPaste}
                placeholder="Paste image URL"
                className="px-4 py-2 rounded-full bg-white/10 border border-white/40 text-white/90 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-slate-200/60"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-2 text-base font-bold rounded-full text-slate-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <Upload size={20} className="mr-2" />
                Add Images
              </button>
            </div>
          </div>

          <ImageDropzone
            images={project.images}
            onImagesChange={(newImages) => updateProject({ images: newImages })}
            ref={fileInputRef}
          />
        </div>
      </div>
    </div>
  );
}