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

  // In a real app, this would fetch from an API/database
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
      <div className="text-center text-white p-8 relative z-10 -mt-64">
        <h1 className="text-7xl font-extrabold mb-8 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-50 to-white">
          GPT Anime
        </h1>
        <p className="text-3xl font-medium tracking-wide drop-shadow-lg max-w-3xl mx-auto leading-relaxed text-white mb-12">
          Your photos reimagined in your favorite anime
        </p>
      </div>
      <div className="relative z-10 w-full max-w-4xl px-8">
        {projects.length === 0 ? (
          <div className="text-center">
            <button
              onClick={createNewProject}
              className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-full text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all duration-200 ease-in-out cursor-pointer shadow-lg hover:shadow-amber-100/25"
            >
              New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/project/${project.id}`}
                className="group bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/60 rounded-xl p-6 transition-all duration-200 cursor-pointer"
              >
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{project.name}</h3>
                <p className="text-base font-medium text-slate-600">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
            <div className="flex items-center justify-center">
              <button
                onClick={createNewProject}
                className="flex items-center justify-center border-2 border-white/30 rounded-full w-16 h-16 transition-all duration-300 cursor-pointer text-white hover:text-white group hover:border-white/40 bg-white/20 hover:bg-white/25"
              >
                <span className="text-5xl font-thin flex items-center justify-center translate-y-[-3px] translate-x-[-1px]">+</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
