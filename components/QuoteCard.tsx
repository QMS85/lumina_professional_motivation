
import React from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote | null;
  isLoading: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLoading }) => {
  if (isLoading) {
    return (
      <div className="relative w-full max-w-4xl h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm animate-pulse">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400 font-medium tracking-widest uppercase text-xs">Crafting Wisdom...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="relative w-full max-w-4xl h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm group cursor-pointer">
        <div className="text-center p-8 transition-transform duration-700 group-hover:scale-105">
           <h2 className="text-4xl md:text-5xl font-serif mb-4 italic text-white/90">Wisdom Awaits</h2>
           <p className="text-zinc-500 max-w-md mx-auto">Select a theme above to generate a bespoke professional insight powered by Lumina.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center transition-all duration-1000 ease-in-out shadow-2xl group">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-110"
        style={{ backgroundImage: quote.imageUrl ? `url(${quote.imageUrl})` : 'linear-gradient(to bottom right, #1a1a1a, #000)' }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      </div>

      {/* Quote Content */}
      <div className="relative z-10 px-8 md:px-16 py-12 text-center max-w-3xl">
        <svg className="w-12 h-12 text-white/20 mx-auto mb-8 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V5C14.017 4.44772 14.4647 4 15.017 4H19.017C20.6738 4 22.017 5.34315 22.017 7V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.01693 21L3.01693 18C3.01693 16.8954 3.91236 16 5.01693 16H8.01693C8.56921 16 9.01693 15.5523 9.01693 15V9C9.01693 8.44772 8.56921 8 8.01693 8H4.01693C3.46465 8 3.01693 7.55228 3.01693 7V5C3.01693 4.44772 3.46465 4 4.01693 4H8.01693C9.67378 4 11.0169 5.34315 11.0169 7V15C11.0169 18.3137 8.33064 21 5.01693 21H3.01693Z" />
        </svg>
        
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white leading-tight md:leading-snug mb-8 transition-opacity duration-700">
          {quote.text}
        </h2>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-[1px] bg-white/30 mb-4"></div>
          <span className="text-sm md:text-base font-medium text-white/60 tracking-[0.2em] uppercase">
            {quote.author}
          </span>
          <span className="mt-2 text-[10px] text-white/30 tracking-widest uppercase font-semibold px-3 py-1 border border-white/10 rounded-full">
            {quote.theme}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
