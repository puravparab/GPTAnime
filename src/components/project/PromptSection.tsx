import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import ModelSelector from './ModelSelector';

interface PromptSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: string | undefined;
  updateProject: (updates: { 
    style?: string;
    images?: string[];
    originalImages?: string[];
    prompt?: string;
    lastTransformed?: string;
    model?: string;
  }) => void;
  images: string[];
  projectId: string;
  model?: string;
}

export default function PromptSection({ 
  prompt, 
  setPrompt, 
  style, 
  updateProject, 
  images,
  projectId,
  model = 'Gemini Flash Edit'
}: PromptSectionProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const placeholders = [
    'Enter your prompt...',
    'Change the style of these images to Studio Ghibli...',
    'Create an image of an astronaut on a horse in the style of Studio Ghibli'
  ];

  const handleSubmit = async () => {
    if (!prompt.trim() || images.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          images,
          model
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform images');
      }

      // Get existing projects from localStorage
      const savedProjects = localStorage.getItem('projects');
      const projects = savedProjects ? JSON.parse(savedProjects) : [];
      
      // Find and update the current project
      const updatedProjects = projects.map((p: any) => {
        if (p.id === projectId) {
          return {
            ...p,
            images: data.results.map((result: any) => result.outputImage),
            originalImages: images, // Store original images for reference
            prompt,
            style,
            lastTransformed: new Date().toISOString(),
            model
          };
        }
        return p;
      });

      // Save updated projects back to localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
      // Update the current project state
      updateProject({
        images: data.results.map((result: any) => result.outputImage),
        originalImages: images,
        prompt,
        style,
        lastTransformed: new Date().toISOString(),
        model
      });

      console.log('Images transformed successfully:', data.results);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to transform images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (newModel: string) => {
    // Get existing projects from localStorage
    const savedProjects = localStorage.getItem('projects');
    const projects = savedProjects ? JSON.parse(savedProjects) : [];
    
    // Find and update the current project
    const updatedProjects = projects.map((p: any) => {
      if (p.id === projectId) {
        return {
          ...p,
          model: newModel
        };
      }
      return p;
    });

    // Save updated projects back to localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    // Update the current project state
    updateProject({ model: newModel });
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (isTyping) {
      if (currentText.length < placeholders[placeholderIndex].length) {
        timeout = setTimeout(() => {
          setCurrentText(placeholders[placeholderIndex].slice(0, currentText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 30);
      } else {
        setIsTyping(true);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, placeholderIndex]);

  return (
    <div className="mb-8 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={currentText}
          className="flex-1 px-4 py-3 rounded-full text-white/90 placeholder-white/40 focus:outline-none border-none text-lg"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim() || images.length === 0}
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 ease-in-out ${
            isLoading || !prompt.trim() || images.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <ArrowRight size={24} />
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 px-4">
          <span className="text-white/60 text-sm font-medium">Or try these examples:</span>
          <button
            onClick={() => {
              updateProject({ style: 'Studio Ghibli' });
              setPrompt('Change the style of these images into Studio Ghibli style');
            }}
            className="px-4 py-1.5 rounded-md text-sm transition-all duration-200 cursor-pointer bg-emerald-800/90 text-emerald-50"
          >
            Studio Ghibli
          </button>
          <button
            onClick={() => {
              updateProject({ style: 'Batman TAS' });
              setPrompt('Change the style of these images into Batman: The Animated Series style');
            }}
            className="px-4 py-1.5 rounded-md text-sm transition-all duration-200 cursor-pointer bg-slate-800/90 text-slate-50"
          >
            Batman TAS
          </button>
          <button
            onClick={() => {
              updateProject({ style: 'Sailor Moon' });
              setPrompt('Change the style of these images into Sailor Moon style');
            }}
            className="px-4 py-1.5 rounded-md text-sm transition-all duration-200 cursor-pointer bg-sky-800/90 text-sky-50"
          >
            Sailor Moon
          </button>
          <button
            onClick={() => {
              updateProject({ style: 'Dragon Ball' });
              setPrompt('Change the style of these images into Dragon Ball style');
            }}
            className="px-4 py-1.5 rounded-md text-sm transition-all duration-200 cursor-pointer bg-amber-800/90 text-amber-50"
          >
            Dragon Ball
          </button>
          <button
            onClick={() => {
              updateProject({ style: 'Attack on Titan' });
              setPrompt('Change the style of these images into Attack on Titan style');
            }}
            className="px-4 py-1.5 rounded-md text-sm transition-all duration-200 cursor-pointer bg-stone-800/90 text-stone-50"
          >
            Attack on Titan
          </button>
        </div>
        <ModelSelector 
          selectedModel={model} 
          onModelSelect={handleModelSelect} 
        />
      </div>
    </div>
  );
} 