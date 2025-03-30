import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`w-48 flex items-center gap-2 px-2 py-1.5 text-sm transition-all duration-200 cursor-pointer bg-emerald-900/30 text-emerald-50 hover:bg-emerald-800/40 backdrop-blur-sm border border-white/10 ${
          showDropdown ? 'rounded-t-xl' : 'rounded-xl'
        }`}
      >
        <Sparkles size={14} className="text-emerald-50 shrink-0" />
        <span className="truncate">{selectedModel}</span>
      </button>
      {showDropdown && (
        <div className="absolute top-full right-0 w-48 bg-emerald-950 rounded-b-xl shadow-lg border border-t-0 border-emerald-900/50 overflow-hidden">
          <div className="border-t border-emerald-900/50">
            <button
              onClick={() => {
                onModelSelect('Gemini Flash Edit');
                setShowDropdown(false);
              }}
              className={`w-full px-2 py-2 text-left text-sm hover:bg-emerald-900 transition-colors ${
                selectedModel === 'Gemini Flash Edit' ? 'text-emerald-200 font-medium' : 'text-emerald-50'
              }`}
            >
              <span className="truncate block">Gemini Flash Edit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 