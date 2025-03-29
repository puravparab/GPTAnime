'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

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
      <div className="relative z-10">
        <button
          onClick={() => router.push('/project/1')}
          className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-full text-emerald-900 bg-emerald-50/85 hover:bg-emerald-50/95 backdrop-blur-sm border border-emerald-100/50 transition-all duration-200 ease-in-out cursor-pointer shadow-lg hover:shadow-emerald-100/25"
        >
          New Project
        </button>
      </div>
    </div>
  );
}
