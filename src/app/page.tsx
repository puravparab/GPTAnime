'use client';

import { useRouter } from 'next/navigation';
import { BackgroundVideo } from '@/components/home/BackgroundVideo';
import { Header } from '@/components/home/Header';
import { ProjectCard } from '@/components/home/ProjectCard';
import { useProjects } from '@/hooks/useProjects';

export default function Home() {
  const router = useRouter();
  const { projects, isLoading, createNewProject, deleteProject } = useProjects();

  const handleCreateProject = () => {
    const newProject = createNewProject();
    router.push(`/project/${newProject.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
        <BackgroundVideo />
        <Header />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
      <BackgroundVideo />
      <Header />
      <div className="relative z-10 w-full max-w-4xl px-8 mx-auto pb-16">
        {projects.length === 0 ? (
          <div className="text-center">
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-8 py-4 text-2xl font-extrabold rounded-full text-white bg-blue-950/50 hover:bg-blue-950/60 backdrop-blur-sm border border-blue-900/50 transition-all duration-200 ease-in-out cursor-pointer"
            >
              New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={handleCreateProject}
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/60 rounded-lg bg-transparent hover:bg-white/5 transition-all duration-200 cursor-pointer p-6"
            >
              <span className="text-4xl text-white/80 mb-2">+</span>
              <span className="text-base font-medium text-white/80">New Project</span>
            </button>
            {projects
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={deleteProject}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
