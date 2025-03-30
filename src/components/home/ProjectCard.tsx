import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  return (
    <div className="relative group bg-white/60 hover:bg-white/40 border border-white/60 rounded-xl transition-all duration-200">
      <Link 
        href={`/project/${project.id}`}
        className="block p-6"
      >
        <h3 className="text-2xl font-extrabold text-sky-800 mb-2">{project.name}</h3>
        <p className="text-sm font-medium text-slate-700">
          Created {new Date(project.createdAt).toLocaleString(undefined, { 
            dateStyle: 'short',
            timeStyle: 'short'
          })}
        </p>
      </Link>
      <button
        onClick={() => onDelete(project.id)}
        className="absolute top-2 right-2 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}; 