'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
      <div className="text-center text-white p-8 relative z-10 pt-32">
        <h1 className="text-7xl font-extrabold mb-8 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-50 to-white">
          Oops!
        </h1>
        <p className="text-3xl font-medium tracking-wide drop-shadow-lg max-w-3xl mx-auto leading-relaxed text-white mb-12">
          Something went wrong. Please try again or return to the home page.
        </p>
        <div className="space-y-4 max-w-md mx-auto">
          <button
            onClick={reset}
            className="w-full py-4 px-8 text-xl font-bold rounded-full text-sky-800 bg-white/50 hover:bg-white/70 border border-white/60 transition-all duration-200 ease-in-out"
          >
            Try again
          </button>
          <Link
            href="/"
            className="block w-full py-4 px-8 text-xl font-bold rounded-full text-white bg-transparent hover:bg-white/10 border border-white/60 transition-all duration-200 ease-in-out"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
} 