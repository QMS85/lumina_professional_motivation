
import React from 'react';
import { QuoteTheme } from '../types';

interface ThemeSelectorProps {
  selectedTheme: QuoteTheme;
  onSelectTheme: (theme: QuoteTheme) => void;
  disabled?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelectTheme, disabled }) => {
  const themes = Object.values(QuoteTheme);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-6xl mx-auto px-4">
      {themes.map((theme) => {
        const isSelected = selectedTheme === theme;
        return (
          <button
            key={theme}
            onClick={() => onSelectTheme(theme)}
            disabled={disabled}
            className={`
              relative px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-500 border
              ${isSelected 
                ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] scale-105 z-10' 
                : 'bg-zinc-900/50 text-zinc-400 border-white/10 hover:border-white/30 hover:bg-zinc-800 hover:scale-102'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
            `}
          >
            {/* Subtle inner glow for selected state */}
            {isSelected && (
              <span className="absolute inset-0 rounded-xl animate-pulse bg-white/10 pointer-events-none"></span>
            )}
            <span className="relative z-10">{theme.split(' & ')[0]}</span>
            
            {/* Bottom indicator line */}
            <div className={`
              absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-black/20 rounded-full transition-all duration-500
              ${isSelected ? 'w-4' : 'w-0'}
            `}></div>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
