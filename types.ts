
export interface Quote {
  id: string;
  text: string;
  author: string;
  theme: string;
  timestamp: number;
  imageUrl?: string;
}

export enum QuoteTheme {
  LEADERSHIP = 'Leadership & Vision',
  RESILIENCE = 'Resilience & Grit',
  INNOVATION = 'Innovation & Creativity',
  MINDFULNESS = 'Mindfulness & Clarity',
  EXCELLENCE = 'Excellence & Mastery',
  AMBITION = 'Ambition & Growth'
}

export interface QuoteGenerationResult {
  quote: string;
  author: string;
}
