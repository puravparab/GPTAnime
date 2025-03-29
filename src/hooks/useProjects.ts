import { useState, useEffect } from 'react';
import { Project } from '@/types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    setIsLoading(false);
  }, []);

  const createNewProject = () => {
    const maxId = projects.reduce((max, project) => {
      const currentId = parseInt(project.id);
      return currentId > max ? currentId : max;
    }, 0);

    const newProject = {
      id: (maxId + 1).toString(),
      name: `Project ${maxId + 1}`,
      createdAt: new Date()
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    return newProject;
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return {
    projects,
    isLoading,
    createNewProject,
    deleteProject
  };
}; 