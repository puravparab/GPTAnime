'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

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

  const onDrop = (acceptedFiles: File[]) => {
    if (!project) return;
    
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const newImages = [...(project.images || []), reader.result as string];
          updateProject({ images: newImages });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    if (!project) return;
    
    const newImages = [...project.images];
    newImages.splice(index, 1);
    updateProject({ images: newImages });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/zip': ['.zip']
    }
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
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
      <div className="relative z-10">
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

          <div
            {...getRootProps()}
            className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragActive ? 'border-white/70 bg-white/5' : 'border-white/60 bg-transparent'
            }`}
          >
            <Upload className="h-8 w-8 text-white/80" />
            <p className="mt-2 text-base font-medium text-white/80">
              Drop images here
            </p>
          </div>

          {project.images && project.images.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-amber-50/80 text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 