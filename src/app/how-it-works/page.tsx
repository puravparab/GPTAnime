'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { BackgroundVideo } from '@/components/home/BackgroundVideo';
import { Header } from '@/components/home/Header';
import { useProjects } from '@/hooks/useProjects';

export default function HowItWorks() {
  const router = useRouter();
  const { createNewProject } = useProjects();

  const handleCreateProject = () => {
    const newProject = createNewProject();
    router.push(`/project/${newProject.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
      <BackgroundVideo />
      <div className="relative z-[1]">
        <div className="text-center text-white p-4 relative z-[10001]">
          <Link href="/" className="inline-block">
            <h1 className="text-7xl font-extrabold mb-4 tracking-tight drop-shadow-xl text-white [text-shadow:_-1px_-1px_0_#fef3c7,_1px_-1px_0_#fef3c7,_-1px_1px_0_#fef3c7,_1px_1px_0_#fef3c7]">
              GPT Anime
            </h1>
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="backdrop-blur-md bg-white/10 rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Create a Project</h2>
              <p className="text-white">
                Start by creating a new project. Click the "New Project" button on the home page to get started.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Upload Images</h2>
              <p className="text-white">
                Upload the images you want to transform into anime style. Files must be in PNG, JPG, JPEG or WebP format.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Customize Prompt</h2>
              <p className="text-white">
                Update the prompt with your preferences or choose from our example prompts to guide the transformation.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Generate</h2>
              <p className="text-white">
                Select your preferred model (e.g., Gemini Flash Edit) and click the Generate button to start the transformation process.
              </p>
            </section>

            <section className="backdrop-blur-md bg-white/10 rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-white">5. View Results</h2>
              <p className="text-white">
                Check your results in the history section. You can view all your previous generations and download the transformed images.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-8 py-4 text-2xl font-extrabold rounded-full text-white bg-blue-950/50 hover:bg-blue-950/60 backdrop-blur-sm border border-blue-900/50 transition-all duration-200 ease-in-out cursor-pointer"
            >
              Try it out!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 