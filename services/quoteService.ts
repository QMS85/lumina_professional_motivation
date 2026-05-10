// src/services/quoteService.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface QuoteResponse {
  success: boolean;
  data: {
    quote: string;
    author: string;
  };
  error?: string;
}

export async function generateQuote(
  theme: string,
  previousQuotes: string[] = []
): Promise<QuoteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme, previousQuotes }),
      credentials: 'include', // Include cookies for CORS
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        data: { quote: '', author: '' },
        error: errorData.error || `HTTP ${response.status}`,
      };
    }

    return await response.json();

  } catch (error) {
    console.error('Error calling backend:', error);
    return {
      success: false,
      data: { quote: '', author: '' },
      error: 'Failed to connect to API server. Please try again.',
    };
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
