'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export default function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would fetch from an API/database
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    setIsLoading(false);
  }, []);

  const createNewProject = () => {
    const newProject = {
      id: (projects.length + 1).toString(),
      name: `Project ${projects.length + 1}`,
      createdAt: new Date()
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    router.push(`/project/${newProject.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
        <div className="text-center text-white p-8 relative z-10 pt-32">
          <h1 className="text-7xl font-extrabold mb-8 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-50 to-white">
            GPT Anime
          </h1>
          <p className="text-3xl font-medium tracking-wide drop-shadow-lg max-w-3xl mx-auto leading-relaxed text-white mb-12">
            Your photos reimagined in your favorite anime
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
      <div className="text-center text-white p-8 relative z-10 pt-32">
        <h1 className="text-7xl font-extrabold mb-8 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-50 to-white">
          GPT Anime
        </h1>
        <p className="text-3xl font-medium tracking-wide drop-shadow-lg max-w-3xl mx-auto leading-relaxed text-white mb-12">
          Your photos reimagined in your favorite anime
        </p>
      </div>
      <div className="relative z-10 w-full max-w-4xl px-8 mx-auto pb-16">
        {projects.length === 0 ? (
          <div className="text-center">
            <button
              onClick={createNewProject}
              className="inline-flex items-center px-8 py-4 text-2xl font-extrabold rounded-full text-sky-800 bg-white/50 hover:bg-white/70 border border-white/60 transition-all duration-200 ease-in-out cursor-pointer"
            >
              New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={createNewProject}
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/60 rounded-lg bg-transparent hover:bg-white/5 transition-all duration-200 cursor-pointer p-6"
            >
              <span className="text-4xl text-white/80 mb-2">+</span>
              <span className="text-base font-medium text-white/80">New Project</span>
            </button>
            {projects
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((project) => (
              <Link 
                key={project.id} 
                href={`/project/${project.id}`}
                className="group bg-white/60 hover:bg-white/40 border border-white/60 rounded-xl p-6 transition-all duration-200 cursor-pointer"
              >
                <h3 className="text-2xl font-extrabold text-sky-800 mb-2">{project.name}</h3>
                <p className="text-sm font-medium text-slate-700">
                  Created {new Date(project.createdAt).toLocaleString(undefined, { 
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
