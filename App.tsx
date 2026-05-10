
import React, { useState, useEffect, useCallback } from 'react';
import { Quote, QuoteTheme } from './types';
import { generateQuote, generateQuoteImage } from './services/geminiService';
import QuoteCard from './components/QuoteCard';
import ThemeSelector from './components/ThemeSelector';

const App: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<QuoteTheme>(QuoteTheme.LEADERSHIP);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [history, setHistory] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateQuote(selectedTheme);
      const imageUrl = await generateQuoteImage(result.quote, selectedTheme);
      
      const newQuote: Quote = {
        id: crypto.randomUUID(),
        text: result.quote,
        author: result.author,
        theme: selectedTheme,
        timestamp: Date.now(),
        imageUrl: imageUrl
      };

      setCurrentQuote(newQuote);
      setHistory(prev => [newQuote, ...prev].slice(0, 10)); // Keep last 10
    } catch (err) {
      console.error(err);
      setError("The muse is currently silent. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTheme]);

  const copyToClipboard = () => {
    if (currentQuote) {
      const text = `"${currentQuote.text}" — ${currentQuote.author}`;
      navigator.clipboard.writeText(text);
      // We could use a custom toast here, but alert is the simplest fallback
      alert("Quote copied to clipboard.");
    }
  };

  const handleShare = async () => {
    if (!currentQuote) return;

    const shareData = {
      title: 'Lumina Bespoke Wisdom',
      text: `"${currentQuote.text}" — ${currentQuote.author} (${currentQuote.theme})`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard if sharing is not supported
        copyToClipboard();
        alert("Sharing not supported on this browser. Quote copied to clipboard instead.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Navigation / Header */}
      <header className="w-full py-8 px-6 md:px-12 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-xl font-bold tracking-[0.3em] uppercase">Lumina</h1>
        </div>
        <div className="hidden md:block text-xs text-zinc-500 tracking-widest uppercase font-medium">
          Professional Insights & Motivating Wisdom
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 gap-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold text-white/40 tracking-[0.4em] uppercase">Select Your Focus</span>
          <ThemeSelector 
            selectedTheme={selectedTheme} 
            onSelectTheme={setSelectedTheme} 
            disabled={isLoading}
          />
        </div>

        <div className="w-full flex flex-col items-center gap-8">
          <QuoteCard quote={currentQuote} isLoading={isLoading} />
          
          {error && <p className="text-red-400 text-sm font-medium animate-bounce">{error}</p>}

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`
                group relative px-10 py-4 bg-white text-black font-bold tracking-widest uppercase rounded-full overflow-hidden transition-all duration-300
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'}
              `}
            >
              <span className="relative z-10">{isLoading ? 'Synthesizing...' : 'Generate New Insight'}</span>
              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            {currentQuote && (
              <>
                <button
                  onClick={copyToClipboard}
                  className="px-8 py-4 bg-zinc-900 text-white font-bold tracking-widest uppercase rounded-full border border-white/10 hover:border-white/30 hover:bg-zinc-800 transition-all duration-300 flex items-center gap-2 active:scale-95"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={handleShare}
                  className="px-8 py-4 bg-zinc-900 text-white font-bold tracking-widest uppercase rounded-full border border-white/10 hover:border-white/30 hover:bg-zinc-800 transition-all duration-300 flex items-center gap-2 active:scale-95"
                  title="Share quote"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* History Section */}
      {history.length > 0 && (
        <section className="w-full bg-zinc-950 border-t border-white/5 py-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-sm font-bold tracking-[0.4em] uppercase text-zinc-500 mb-8 border-l-2 border-white/20 pl-4">Recent Chronicles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group cursor-pointer"
                  onClick={() => setCurrentQuote(item)}
                >
                  <p className="text-zinc-400 font-serif italic mb-4 line-clamp-3 group-hover:text-white transition-colors">"{item.text}"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.author}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded uppercase">{item.theme.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full py-12 px-6 text-center border-t border-white/5 text-zinc-600">
        <p className="text-xs tracking-widest uppercase font-medium">© 2026 Jonathan Peters</p>
      </footer>
    </div>
  );
};

export default App;

// src/App.tsx (example - adapt to your structure)
import { useState } from 'react';
import { generateQuote, checkHealth } from './services/quoteService';

export function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('Leadership');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    const result = await generateQuote(theme);

    if (result.success) {
      setQuote(result.data.quote);
      setAuthor(result.data.author);
    } else {
      setError(result.error || 'Failed to generate quote');
    }

    setLoading(false);
  };

  return (
    <div className="lumina-container">
      <h1>Professional Motivation Studio</h1>

      <div className="theme-selector">
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="Leadership">Leadership</option>
          <option value="Innovation">Innovation</option>
          <option value="Resilience">Resilience</option>
          <option value="Strategy">Strategy</option>
          <option value="Vision">Vision</option>
        </select>
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quote'}
      </button>

      {error && <div className="error">{error}</div>}

      {quote && (
        <div className="quote-card">
          <blockquote>{quote}</blockquote>
          <footer>{author}</footer>
        </div>
      )}
    </div>
  );
}
