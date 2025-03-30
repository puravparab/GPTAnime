import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Project } from '@/types/project';
import { StatusIndicator } from '@/components/common/StatusIndicator';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  return (
    <div className="relative group backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/40 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
      <Link 
        href={`/project/${project.id}`}
        className="block p-6"
      >
        <div className="flex items-center">
          <h3 className="text-2xl font-extrabold text-white">{project.name}</h3>
          <StatusIndicator status={project.status} size="sm" />
        </div>
        <p className="text-sm font-medium text-white/80">
          Created {new Date(project.createdAt).toLocaleString(undefined, { 
            dateStyle: 'short',
            timeStyle: 'short'
          })}
        </p>
      </Link>
      <button
        onClick={() => onDelete(project.id)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}; 