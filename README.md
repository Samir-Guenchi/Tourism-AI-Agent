# Tourism AI Agent - Discover Algeria

An intelligent travel planning platform powered by AI, designed to help travelers explore Algeria's 58 wilayas with personalized recommendations, interactive maps, and AI-powered assistance.

![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black)
![React](https://img.shields.io/badge/React-19.2.8-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### AI-Powered Assistants
- **Travel Planner Agent**: Generate personalized itineraries based on your preferences
- **Explorer Agent**: Get detailed information about destinations, hotels, and activities
- **Real-time Chat**: Ask questions and get instant recommendations
- **Voice Assistant**: Interact with the AI using voice commands (Gemini Live API)

### Interactive Planning
- **Visual Canvas**: Drag-and-drop interface for building your travel itinerary
- **Mobile Touch Support**: Full touch gestures for panning and zooming on mobile devices
- **Route Planning**: Optimize routes between multiple destinations
- **Save & Sync**: Plans automatically saved to Firebase for cross-device access

### Comprehensive Travel Services
- **580+ Hotels**: Browse and book accommodations across Algeria
- **420+ Restaurants**: Discover local cuisine and dining options
- **270+ Activities**: Find tours, experiences, and things to do
- **Car Rentals**: Vehicle options for your journey

### Rich Destination Data
- **58 Wilayas Coverage**: Complete information for all Algerian provinces
- **Interactive Maps**: GeoJSON-powered wilaya boundaries with Leaflet
- **Cultural Insights**: Traditional clothing, cuisine, and cultural heritage
- **Multilingual Support**: English, French, and Arabic interfaces

### Modern UI/UX
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion
- **Accessible**: WCAG-compliant design patterns

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Firebase account (for authentication and data storage)
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Samir-Guenchi/Tourism-AI-Agent.git
   cd Tourism-AI-Agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   Fill in your credentials in `.env.local`:
   ```env
   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Tourism-AI-Agent/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Home page
│   │   ├── destinations/      # Destination pages
│   │   ├── map/               # Interactive map & planner
│   │   ├── services/          # Hotels, restaurants, activities
│   │   ├── chat/              # AI chat interface
│   │   └── api/               # API routes for AI
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── navbar.tsx        # Navigation
│   │   ├── texa-assistant.tsx # AI assistant
│   │   └── global-voice.tsx  # Voice interface
│   ├── contexts/             # React contexts
│   │   ├── auth-context.tsx  # Authentication
│   │   ├── plan-context.tsx  # Travel plan state
│   │   └── language-context.tsx # i18n
│   ├── lib/                  # Data & utilities
│   │   ├── destinations-data.ts # 58 wilayas
│   │   ├── hotels-data.ts    # Hotels database
│   │   ├── activities-data.ts # Activities
│   │   ├── restaurants-data.ts # Restaurants
│   │   ├── gemini.ts         # AI integration
│   │   └── translations.ts   # Multilingual
│   └── hooks/                # Custom React hooks
├── public/
│   ├── images/               # Static images
│   └── wilaya-boundaries.geojson # Map data
└── package.json
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16.3.0 (App Router)
- **UI Library**: React 19.2.8
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 13
- **Maps**: React Leaflet 5
- **Components**: shadcn/ui + Radix UI

### Backend & Services
- **AI**: Google Gemini API (3.5 Flash & 3.1 Flash Live)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Deployment**: Vercel (recommended)

### Key Libraries
- `react-markdown` - Rich text rendering
- `class-variance-authority` - Component variants
- `lucide-react` - Icon system
- `next-themes` - Dark mode support

## Core Features

### AI Planner Agent
Located at `/map`, the planner allows users to:
- Add destinations to an infinite canvas
- Connect wilayas with routes
- Add hotels, restaurants, and activities
- Generate AI-powered itineraries
- Export and share plans

### Destination Explorer
Browse all 58 Algerian wilayas with:
- Rich descriptions and imagery
- Cultural heritage information
- Local cuisine specialties
- Traditional clothing styles
- Interactive filtering by region

### Mobile Experience
- Full touch support for canvas panning
- Mobile-optimized zoom controls
- Responsive navigation
- Touch-friendly UI elements

## Environment Variables

See `.env.example` for all required variables. Key configurations:

- **GEMINI_API_KEY**: Required for AI chat and recommendations
- **Firebase credentials**: Required for auth and data persistence
- **MODEL**: AI model selection (gemini-3.5-flash, etc.)

## API Routes

### `/api/chat`
General chat endpoint for AI assistant

### `/api/planner`
Travel planning and itinerary generation

### `/api/explorer`
Destination-specific queries and recommendations

### `/api/algeria-boundaries`
Serves GeoJSON data for interactive maps

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

This project follows standard TypeScript and React conventions:
- Components use TypeScript with strict type checking
- Functional components with React hooks
- Tailwind CSS for styling
- ESLint for code quality

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI capabilities
- Firebase for backend services
- Next.js team for the framework
- shadcn for UI components
- All contributors and supporters

## Support

- **Repository**: [https://github.com/Samir-Guenchi/Tourism-AI-Agent](https://github.com/Samir-Guenchi/Tourism-AI-Agent)
- **Issues**: [Report a bug](https://github.com/Samir-Guenchi/Tourism-AI-Agent/issues)
- **Discussions**: [Join the conversation](https://github.com/Samir-Guenchi/Tourism-AI-Agent/discussions)

---

Built for Algeria | Powered by AI
