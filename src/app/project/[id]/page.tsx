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
            <h1 className="text-7xl font-extrabold mb-4 tracking-tight drop-shadow-xl text-white [text-shadow:_-1px_-1px_0_#fef3c7,_1px_-1px_0_#fef3c7,_-1px_1px_0_#fef3c7,_1px_1px_0_#fef3c7]">
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
              className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-amber-200/60 rounded px-2 text-white placeholder-white/60 [text-shadow:_-1px_-1px_0_#fef3c7,_1px_-1px_0_#fef3c7,_-1px_1px_0_#fef3c7,_1px_1px_0_#fef3c7]"
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