'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import JSZip from 'jszip';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  images: string[];
  prompt?: string;
  style?: string;
  generatedImages?: string[];
}

export default function ProjectHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const existingProject = projects.find((p: Project) => p.id === resolvedParams.id);
      if (existingProject) {
        setProject(existingProject);
      }
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

  const handleDownload = async () => {
    if (!project?.generatedImages?.length) return;
    
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      // Fetch and add each image to the zip
      const imagePromises = project.generatedImages.map(async (imageUrl, index) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        zip.file(`image_${index + 1}.png`, blob);
      });

      await Promise.all(imagePromises);
      
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name}_generated_images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading images:', error);
      alert('Failed to download images. Please try again.');
    } finally {
      setIsDownloading(false);
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
            <h1 className="text-7xl font-extrabold mb-4 tracking-tight drop-shadow-xl text-white [text-shadow:_-1px_-1px_0_#fef3c7,_1px_-1px_0_#fef3c7,_-1px_1px_0_#fef3c7,_1px_1px_0_#fef3c7]">
              GPT Anime
            </h1>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject({ name: e.target.value })}
                className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-amber-200/60 rounded px-2 text-white placeholder-white/60 [text-shadow:_-1px_-1px_0_#fef3c7,_1px_-1px_0_#fef3c7,_-1px_1px_0_#fef3c7,_1px_1px_0_#fef3c7]"
              />
              <p className="text-white/80 mt-1 ml-2 text-xl">
                Total Generated Images: {project.generatedImages?.length || 0}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !project.generatedImages?.length}
                className={`inline-flex items-center px-6 py-2 text-base font-bold rounded-full text-slate-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-all duration-200 ease-in-out cursor-pointer ${
                  isDownloading || !project.generatedImages?.length ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download size={20} className="mr-2" />
                {isDownloading ? 'Downloading...' : 'Download All'}
              </button>
              <Link
                href={`/project/${project.id}`}
                className="inline-flex items-center px-6 py-2 text-base font-bold rounded-full text-slate-900 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Project
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...(project.generatedImages || [])].reverse().map((image, index) => (
              <div key={index} className="relative group overflow-hidden">
                <img
                  src={image}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
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
    </div>
  );
} 