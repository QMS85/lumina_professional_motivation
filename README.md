# Lumina: Professional Motivation Studio

Lumina is a high-end, AI-powered motivational quote generation platform designed for leaders, innovators, and dreamers. Using Google's state-of-the-art **Gemini 2.0 Flash** and **Gemini 2.5 Image** models, Lumina crafts bespoke, sophisticated wisdom paired with stunning, atmospheric visual backdrops.

![Lumina Screenshot](https://raw.githubusercontent.com/username/repo/main/screenshot.png) *(Placeholder: Replace with actual screenshot)*

---

## 🚀 Key Features

- **Bespoke Wisdom**: Generates unique, non-cliché quotes using specialized AI prompting.
- **Cinematic Visuals**: Procedurally generates abstract, high-end background images matched to the quote's theme.
- **Theme-Based Focus**: Choose from Leadership, Innovation, Resilience, Strategy, and Vision.
- **Minimalist Design**: A premium, "dark mode" aesthetic designed for focus and impact.
- **Seamless Sharing**: One-click copy-to-clipboard and native mobile sharing support.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/lumina.git
   cd lumina
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   # API_KEY=your_gemini_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: For the default Vite development setup, prefixing with `VITE_` is required to access variables in the frontend.*

4. **Launch the development server:**
   ```bash
   npm run dev
   ```

---

## 🔑 API Key Usage & Security

The application currently utilizes the `@google/genai` SDK to communicate directly with Gemini models.

### How it works:
- **Quote Synthesis**: Uses `gemini-3-flash-preview` for high-speed, intelligent text generation.
- **Image Generation**: Uses `gemini-2.5-flash-image` to create background assets.

### ⚠️ Security Warning (Client-Side Exposure)
By default, standard Vite applications expose environment variables prefixed with `VITE_` to the browser's "Network" tab. **This means anyone visiting your site can potentially see and steal your API Key.**

---

## 🛡️ How to Limit API Usage & Secure Your Keys

To protect your budget and prevent abuse, follow these production-readiness steps:

### 1. Move to a Server-Side Proxy (Recommended)
Instead of calling Gemini from the React frontend, create a small backend (Node.js/Express) to handle the requests.
- **Benefit**: Your `API_KEY` stays hidden on the server.
- **Implementation**: Frontend calls `/api/generate` -> Backend adds the secret key -> Backend calls Gemini -> Backend sends result back to UI.

### 2. Implement Rate Limiting
Prevent a single user or bot from spamming your API and exhausting your quota.
- **Tool**: `express-rate-limit`
- **Example**:
  ```javascript
  import rateLimit from 'express-rate-limit';

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: "Too many quotes generated. Please take a moment to reflect."
  });

  app.use('/api/', limiter);
  ```

### 3. Add User Authentication
Require users to sign in (e.g., via **Firebase Auth** or **OAuth**) before they can generate content.
- **Benefit**: You can limit usage per *user ID* rather than just IP address.
- **Enforcement**: Validate the user's JWT token in your backend before processing the request.

### 4. Set Usage Quotas in Google Cloud Console
- Go to the [Google Cloud Console](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas).
- Set "Hard Limits" for daily requests to ensure you never exceed a specific dollar amount.

---

## 🌍 Deployment Options

### Option 1: AI Studio (Direct Deployment)
The easiest way to host this app is directly through the AI Studio platform.
- **Process**: Click the **Deploy** button in AI Studio.
- **Cloud Run**: This will containerize your app and deploy it to Google Cloud Run.
- **Automatic Secrets**: AI Studio manages your `API_KEY` securely in the container environment.

### Option 2: Static Hosting (Vercel / Netlify)
If you keep the app as a pure SPA (Single Page Application):
1. Push code to GitHub.
2. Connect the repo to Vercel/Netlify.
3. Add `VITE_GEMINI_API_KEY` to the provider's Environment Variable settings.
4. *Remember: This is insecure for production as keys are visible in the browser.*

### Option 3: Full-Stack (Google Cloud Run / Heroku / AWS)
If you implement the Server-Side Proxy recommended above:
1. Dockerize the application.
2. Deploy to a platform that supports persistent Node.js servers (Cloud Run is excellent for this).
3. Use a managed database (like Firestore) if you want to store user history permanently.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/      # UI components (QuoteCard, ThemeSelector)
│   ├── services/        # API integration logic
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Main application logic
│   └── index.tsx        # Entry point
├── public/              # Static assets
└── package.json         # Project dependencies
```

---

## 🏗️ Technical Architecture

### Core Stack
- **Framework**: React 19 (Functional Components + Hooks)
- **Styling**: Tailwind CSS (Sophisticated "Glassmorph" Dark Theme)
- **Build Tool**: Vite
- **AI Engine**: Google Generative AI (@google/genai)
- **Language**: TypeScript (Strict Mode)

### Data Flow
1. **User Interaction**: User selects a theme and clicks 'Generate'.
2. **Contextual Prompting**: App constructs a sophisticated prompt adding "Professional" and "Non-Cliché" constraints.
3. **Structured Generation**: `gemini-3-flash-preview` generates a JSON response ensuring valid quote/author separation.
4. **Visual Synthesis**: A second call (parallel or sequential) trigger's `gemini-2.5-flash-image` for the background.
5. **State Management**: React `useState` manages the immediate display, while a local `history` array keeps track of the session.

---

## 🤝 Contribution Guidelines

We welcome contributions to Lumina! Whether it's adding new themes, refining AI prompts, or improving the UI.

1. **Fork the project** and create your feature branch: `git checkout -b feature/AmazingFeature`
2. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
3. **Push to the branch**: `git push origin feature/AmazingFeature`
4. **Open a Pull Request** to the `main` branch.

### Code Style
- Use functional React components.
- Favor Tailwind utility classes over inline styles.
- Maintain TypeScript type safety for all new features.

---

## 📜 License

MIT License - Copyright (c) 2024 Lumina Wisdom Studio

---

*Harness the light of intelligence. Lumina.*
