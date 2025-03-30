'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 z-[10002]">
      <div className="w-fit ml-auto pr-4">
        <div className="flex justify-end items-center h-16 gap-4">
          <div className="flex items-center">
            <Link
              href="/how-it-works"
              aria-label="Learn how GPT Anime works"
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-full text-white bg-blue-950/50 hover:bg-blue-950/60 backdrop-blur-sm border border-blue-900/50 transition-all duration-200 ease-in-out"
            >
              How it Works
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              href="https://github.com/puravparab/GPTAnime"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View GPT Anime on GitHub"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-white/10 border border-white/20 transition-all duration-200 ease-in-out"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 