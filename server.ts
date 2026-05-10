// server.ts - Backend API proxy to protect your API key
import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini API with server-side key
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, // Only server can access this
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Rate limiter: 10 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { 
    error: 'The muse is currently silent. Please try again in a moment.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint (Render requires this)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    apiReady: !!process.env.GEMINI_API_KEY
  });
});

// Quote generation endpoint
app.post('/api/generate-quote', async (req: Request, res: Response) => {
  try {
    const { theme, previousQuotes = [] } = req.body;

    if (!theme || !['Leadership', 'Innovation', 'Resilience', 'Strategy', 'Vision'].includes(theme)) {
      return res.status(400).json({ 
        error: 'Invalid theme. Choose from: Leadership, Innovation, Resilience, Strategy, Vision' 
      });
    }

    const previousContext = previousQuotes.length > 0 
      ? `\n\nAvoid these previously generated quotes: ${previousQuotes.map((q: string) => `"${q}"`).join(', ')}`
      : '';

    const prompt = `Generate a unique, professional motivational quote focused on ${theme}.
    
    Requirements:
    - Must be original and non-clichéd
    - Between 50-150 characters
    - Professional tone suitable for executives
    - Include attribution to a real or fictional expert
    ${previousContext}
    
    Return ONLY valid JSON:
    {
      "quote": "The exact quote text",
      "author": "Author Name"
    }`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    
    let responseText = result.response.text();
    
    // Extract JSON if wrapped in markdown
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    const quoteData = JSON.parse(responseText);
    res.status(200).json({ 
      success: true,
      data: quoteData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({ 
      error: 'Failed to generate quote',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check API key and rate limits'
    });
  }
});

// Image generation endpoint
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { theme, quote } = req.body;

    if (!theme || !quote) {
      return res.status(400).json({ error: 'Theme and quote are required' });
    }

    const prompt = `Create an abstract, high-end minimalist background image for this ${theme} motivational quote: "${quote}"
    
    Requirements:
    - Dark, professional aesthetic
    - Gradient or abstract patterns
    - 16:9 aspect ratio
    - Cinematic quality
    - Subtle, sophisticated colors`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Note: Image generation requires additional setup
    // This is a placeholder - actual implementation depends on your API tier
    res.status(200).json({ 
      success: true,
      message: 'Image generation queued',
      warning: 'Image generation requires Gemini 2.5 vision or external service'
    });

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image' 
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Lumina backend running on port ${PORT}`);
  console.log(`🔒 API Key status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'NOT SET'}`);
});
