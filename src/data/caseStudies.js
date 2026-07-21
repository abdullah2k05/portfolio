export const caseStudies = [
  {
    slug: 'github-reader',
    title: 'GitHub Reader',
    subtitle: 'AI-Powered Codebase Analysis & RAG System',
    date: '2025',
    projectNumber: '01',
    heroImage: null,
    liveUrl: null,
    githubUrl: 'https://github.com/Abdullah2k05/github-reader',
    problem:
      'Developers spend significant time understanding unfamiliar codebases. Traditional documentation is often outdated or incomplete, and manually tracing code paths across large repositories is inefficient. There was no unified tool that could ingest a full GitHub repository and answer natural language questions about its code.',
    solution:
      'Built a full-stack RAG (Retrieval-Augmented Generation) application that clones GitHub repos, chunks the codebase, generates embeddings via Jina AI, stores them in a pgvector-enabled PostgreSQL database, and answers natural language questions using Groq LLM. The system understands code semantics, not just keyword matches.',
    features: [
      'GitHub OAuth authentication with JWT session management',
      'Clone any public GitHub repository for analysis',
      'Intelligent code chunking with overlap for context preservation',
      'Jina AI embeddings stored in pgvector for semantic search',
      'Groq LLM integration for natural language code Q&A',
      'Redis caching for frequently queried repositories',
      'Stripe subscription model for usage-based billing',
      'Docker Compose deployment with PostgreSQL, Redis, and app services',
      'SQLite fallback for local development without external dependencies',
      'Comprehensive test suite with Vitest',
    ],
    architecture:
      'Express 5 backend with ESM modules, serving a React 19 + TypeScript frontend via Vite. The backend exposes RESTful endpoints for repo management and a streaming chat endpoint for Q&A. The RAG pipeline runs server-side: on repo ingestion, files are walked, chunked with configurable overlap, embedded via Jina AI API, and upserted into pgvector. On query, the question is embedded, similar chunks are retrieved via cosine similarity, and the context is injected into the Groq LLM prompt for answer generation.',
    folderStructure:
      'server.js (Express entry), src/ (core logic: chunking, embedding, retrieval), frontend/ (React 19 + Vite + TypeScript), scripts/ (CLI tools for ingestion and testing), tests/ (Vitest), data/ (SQLite dev DB), uploads/ (cloned repos), schema.sql + migration files for PostgreSQL.',
    technologies: [
      'Node.js',
      'Express 5',
      'React 19',
      'TypeScript',
      'Vite',
      'Groq LLM',
      'Jina AI',
      'pgvector',
      'PostgreSQL',
      'Redis',
      'Stripe',
      'Docker',
      'JWT',
      'Vitest',
    ],
    challenges: [
      'Chunking code while preserving syntactic boundaries and cross-file context required custom logic beyond naive text splitting.',
      'Token limits and prompt engineering for Groq LLM to handle large code contexts without losing accuracy.',
      'Implementing streaming responses for the chat UI while managing abort signals and error recovery.',
    ],
    lessonsLearned: [
      'Semantic code search via embeddings dramatically outperforms regex-based search for understanding intent.',
      'Docker Compose simplifies multi-service development but adds complexity for new contributors; a SQLite fallback was essential.',
      'Chunk overlap size is critical — too little loses context, too much dilutes relevance.',
    ],
    futureImprovements: [
      'Add support for private repositories via GitHub App installation',
      'Implement code graph visualization (dependency trees, call graphs)',
      'Add batch analysis for comparing multiple repositories',
    ],
    seo: {
      title: 'GitHub Reader — AI Codebase RAG System | Abdullah Portfolio',
      description:
        'Case study: Building a RAG-powered tool that clones GitHub repos and answers natural language questions about code using Groq LLM, Jina AI embeddings, and pgvector.',
      keywords:
        'RAG, code analysis, AI, GitHub, Groq, embeddings, pgvector, semantic search',
    },
  },
  {
    slug: 'period-tracker',
    title: 'Period Tracker Pro',
    subtitle: 'Local-First Mobile Health Tracking with WatermelonDB',
    date: '2025',
    projectNumber: '02',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Existing period tracking apps either require constant internet connectivity, sell user health data, or lack customization for individual cycle variations. Users need a private, offline-capable tracker that respects their data sovereignty while providing accurate predictions and insights.',
    solution:
      'Developed a React Native (Expo) mobile application with WatermelonDB for local-first data persistence, ensuring all health data stays on-device. Supabase is used only for optional cloud sync and authentication. The app features interactive charts, a private journal, and customizable cycle predictions.',
    features: [
      'WatermelonDB + SQLCipher for encrypted local storage',
      'Offline-first architecture — full functionality without internet',
      'Supabase auth with optional cloud sync',
      'Victory Native charts for cycle visualization and trend analysis',
      'Customizable period and ovulation predictions',
      'Built-in private journal with mood and symptom tracking',
      'React Native Reanimated for smooth, native-feeling animations',
      'Zustand for lightweight UI state management',
      'React Navigation with deep linking support',
      'Comprehensive type definitions with TypeScript',
    ],
    architecture:
      'Expo SDK 52 managed workflow with React Native 0.76. WatermelonDB sits as the local database layer with lazy-loaded collections for cycles, symptoms, journal entries, and settings. The renderer uses React Navigation for screen management and Zustand for transient UI state. All business logic (prediction algorithms, data validation) lives in pure TypeScript modules, decoupled from the UI.',
    folderStructure:
      'App.tsx (entry), src/ (screens, components, database models, utils, hooks), supabase/ (migrations and config), docs/ (architecture decisions), assets/ (icons and images), android/ (native Android build output).',
    technologies: [
      'React Native',
      'Expo SDK 52',
      'TypeScript',
      'WatermelonDB',
      'SQLCipher',
      'Supabase',
      'Zustand',
      'Victory Native',
      'React Navigation',
      'React Native Reanimated',
    ],
    challenges: [
      'WatermelonDB lazy-loading requires careful relationship modeling between cycles, symptoms, and journal entries to avoid N+1 query performance issues.',
      'Cycle prediction algorithms must handle irregular cycles, missed logs, and edge cases like anovulatory cycles without producing alarming false predictions.',
      'Encrypted local storage (SQLCipher) adds complexity to schema migrations and debugging.',
    ],
    lessonsLearned: [
      'Local-first architecture with WatermelonDB gives users complete data control while still enabling optional cloud features.',
      'TypeScript strict mode catches data shape mismatches early, especially with complex relational models.',
      'Animated transitions (Reanimated) significantly improve the perceived responsiveness of health tracking interactions.',
    ],
    futureImprovements: [
      'Apple Health / Google Fit integration for symptom correlation',
      'Partner sharing mode for family planning',
      'AI-based anomaly detection for cycle irregularities',
    ],
    seo: {
      title: 'Period Tracker Pro — Local-First Health App | Abdullah Portfolio',
      description:
        'Case study: Period Tracker Pro — a React Native mobile app with WatermelonDB for encrypted offline health tracking, cycle predictions, and Supabase sync.',
      keywords:
        'period tracker, React Native, WatermelonDB, health app, offline-first, Expo, cycle tracking',
    },
  },
  {
    slug: 'invoice-generator',
    title: 'Invoice Generator',
    subtitle: 'Next.js Multi-Tenant Invoicing with PDF & Android Support',
    date: '2025',
    projectNumber: '03',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Small businesses and freelancers need a fast, professional invoicing tool without recurring subscription fees. Existing solutions are either expensive, bloated, or require constant internet access. Generating PDF invoices on mobile devices is particularly challenging.',
    solution:
      'Created a Next.js 14 web application with Capacitor wrapping for Android APK distribution. Features include multi-tenant client management, customizable invoice templates, real-time PDF generation via jsPDF and @react-pdf/renderer, and Firebase for optional cloud persistence.',
    features: [
      'Multi-tenant architecture with client isolation',
      'Real-time PDF preview and generation using jsPDF and @react-pdf/renderer',
      'Capacitor Android build for Play Store distribution',
      'Customizable invoice templates with company branding',
      'Client management with invoice history',
      'Firebase integration for cloud backup and sync',
      'Radix UI components with Tailwind CSS styling',
      'Responsive design optimized for mobile and desktop',
      'Export invoices as downloadable PDF files',
      'TypeScript throughout for type safety',
    ],
    architecture:
      'Next.js 14 App Router with React 18 server components. The PDF rendering pipeline runs client-side to generate invoices without server load. Capacitor wraps the PWA as a native Android APK with access to device storage. State management uses React context with a SQLite-like local store via Firebase.',
    folderStructure:
      'app/ (Next.js App Router pages), components/ (Radix UI + shadcn-style components), lib/ (PDF generation, utils, Firebase config), public/ (static assets), android/ (Capacitor native build).',
    technologies: [
      'Next.js 14',
      'React 18',
      'TypeScript',
      'Tailwind CSS',
      'Radix UI',
      'jsPDF',
      '@react-pdf/renderer',
      'Firebase',
      'Capacitor 8',
      'shadcn/ui',
    ],
    challenges: [
      'PDF layout rendering differs between jsPDF (canvas-based) and @react-pdf/renderer (React component-based); maintaining consistency across both engines required an abstraction layer.',
      'Capacitor plugin compatibility with modern Next.js features required careful configuration of the Android manifest and asset links.',
      'Template customization without a visual editor meant building a robust configuration object format that non-technical users could understand.',
    ],
    lessonsLearned: [
      'Dual PDF engines (jsPDF for simple invoices, @react-pdf/renderer for complex layouts) covers more use cases than a single approach.',
      'Capacitor is a viable distribution path for Next.js apps targeting mobile users, but testing across Android API levels is essential.',
      'Shadcn-style component architecture keeps the UI consistent and themable without a design system dependency.',
    ],
    futureImprovements: [
      'Recurring invoice automation with email scheduling',
      'Stripe/PayPal payment integration with payment status tracking',
      'Multi-currency and tax calculation engine',
    ],
    seo: {
      title: 'Invoice Generator — Next.js Multi-Tenant App | Abdullah Portfolio',
      description:
        'Case study: A full-stack invoicing application built with Next.js 14, featuring dual PDF engines, Capacitor Android distribution, and multi-tenant client management.',
      keywords:
        'invoice generator, Next.js, PDF generation, Capacitor, Android app, invoicing software',
    },
  },
  {
    slug: 'expense-tracker',
    title: 'Expense Tracker',
    subtitle: 'Next.js 16 Finance Management with CSV Import & PDF Reports',
    date: '2026',
    projectNumber: '04',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Personal finance tracking tools either oversimplify (spreadsheets) or overcomplicate (enterprise ERP). Users need a middle ground: quick transaction logging, powerful categorization, and meaningful visual reports — without a monthly subscription.',
    solution:
      'Developed a Next.js 16 application with Supabase backend, featuring CSV import for bulk transaction loading, Recharts-based spending visualizations, PDF report generation, and Framer Motion for polished interactions. Zustand handles client-state while Supabase manages persistence.',
    features: [
      'CSV import with PapaParse for bulk transaction entry from bank exports',
      'Recharts interactive dashboard with spending trends and category breakdowns',
      'PDF report export via jsPDF for monthly financial summaries',
      'Supabase authentication with row-level security',
      'Custom categories with sub-category nesting',
      'Recurring transaction detection and scheduling',
      'Framer Motion page transitions and micro-interactions',
      'Radix UI components with Tailwind CSS 4',
      'React Hook Form with Zod validation for transaction entry',
      'Responsive design with mobile-first layout',
    ],
    architecture:
      'Next.js 16 App Router with React 19. Supabase SSR client for authenticated data fetching. CSV import pipeline: file upload → PapaParse parsing → Zod schema validation → Supabase upsert. The reporting engine aggregates transactions by category/date range using SQL window functions. PDF export renders via jsPDF with table layouts.',
    folderStructure:
      'src/app/ (Next.js App Router routes), src/components/ (UI components), src/lib/ (Supabase client, utils, PDF generation), supabase/ (migrations, seed data), public/ (static assets).',
    technologies: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS 4',
      'Supabase',
      'Zustand',
      'Recharts',
      'jsPDF',
      'PapaParse',
      'Framer Motion',
      'Radix UI',
      'React Hook Form',
      'Zod',
    ],
    challenges: [
      'CSV parsing must handle diverse bank export formats (date formats, currency symbols, column naming conventions). Built a heuristic-based column mapper with user override.',
      'Recurring transaction detection requires fuzzy matching on description, amount, and frequency rather than exact matches.',
      'Row-level security policies in Supabase must be carefully designed to prevent data leaks while allowing shared household expense tracking.',
    ],
    lessonsLearned: [
      'Next.js 16 server actions simplify form handling for transaction CRUD, reducing boilerplate compared to traditional API routes.',
      'Zod schemas shared between client validation and server insertion prevent data integrity issues at the boundary.',
      'Recharts with Supabase real-time subscriptions enables live-updating dashboards without polling.',
    ],
    futureImprovements: [
      'Budget planning with envelope-style allocation',
      'Bank API integration (Plaid/Stripe) for automatic transaction syncing',
      'AI-powered categorization suggestions using transaction descriptions',
    ],
    seo: {
      title: 'Expense Tracker — Next.js 16 Finance App | Abdullah Portfolio',
      description:
        'Case study: Expense Tracker built with Next.js 16, Supabase, and Recharts. Features CSV import, PDF reports, and real-time spending dashboards.',
      keywords:
        'expense tracker, finance app, Next.js, Supabase, Recharts, CSV import, budget',
    },
  },
  {
    slug: 'finance-analyzer',
    title: 'Finance Analyzer',
    subtitle: 'AI-Powered Financial Document Analysis with RAG',
    date: '2025',
    projectNumber: '05',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Financial analysts spend hours manually reading PDF reports (balance sheets, income statements, annual reports) to extract key metrics and trends. Traditional OCR tools lack contextual understanding, and enterprise solutions are prohibitively expensive for small firms.',
    solution:
      'Built a dual-component system: a Python FastAPI backend with sentence-transformers and FAISS for vector search over financial PDFs, paired with a Next.js 16 frontend for visualization. The pipeline extracts text from PDFs (pdfplumber), chunks by section, generates embeddings, and enables natural language querying over financial data.',
    features: [
      'PDF parsing with pdfplumber for table and text extraction',
      'Sentence-transformers for generating financial-domain embeddings',
      'FAISS vector search for fast similarity queries across document collections',
      'OpenAI integration for natural language financial Q&A',
      'ReportLab / matplotlib for generating visual financial summaries',
      'Pandas and NumPy for financial calculations and aggregations',
      'Chart.js dashboards with trend analysis and comparisons',
      'Multi-document upload and cross-document querying',
      'Export analysis results as formatted PDF reports',
      'RESTful API with FastAPI for frontend-backend separation',
    ],
    architecture:
      'Python FastAPI backend serves as the analysis engine. PDFs are processed through a pipeline: pdfplumber extracts text → sentence-transformers embed chunks → FAISS indexes vectors. On query, the question is embedded, similar chunks retrieved, and sent to OpenAI for synthesis. The Next.js frontend provides the UI for upload, querying, and visualization. The two services communicate via REST API.',
    folderStructure:
      'backend/ (FastAPI main.py, routes/, parsers/, services/), frontend/ (Next.js 16 app), backend/requirements.txt (Python dependencies), backend/venv/ (virtual environment).',
    technologies: [
      'FastAPI',
      'Python 3',
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS 4',
      'sentence-transformers',
      'FAISS',
      'OpenAI',
      'pdfplumber',
      'pandas',
      'NumPy',
      'Chart.js',
      'ReportLab',
    ],
    challenges: [
      'Financial PDFs often contain complex tables spanning multiple pages; pdfplumber struggles with merged cells and inconsistent table structures. Built a post-processing heuristic to reconstruct tables from raw text coordinates.',
      'Embedding financial terminology requires domain-specific fine-tuning of sentence-transformers for accurate semantic search.',
      'Cross-document queries require aggregating context from multiple documents while respecting per-document access controls.',
    ],
    lessonsLearned: [
      'Separating the Python analysis backend from the TypeScript frontend allows each to use best-in-class libraries (FAISS, pandas vs. Chart.js, React) without compromise.',
      'Financial text chunking by logical sections (balance sheet, income statement, notes) rather than fixed token counts preserves semantic coherence.',
      'FAISS with IVF indexing provides sub-100ms retrieval even with thousands of financial documents.',
    ],
    futureImprovements: [
      'Automated financial ratio calculation and benchmarking',
      'Time-series analysis across multiple quarterly reports',
      'Regulatory compliance checking against IFRS/GAAP standards',
    ],
    seo: {
      title: 'Finance Analyzer — AI Financial Document RAG | Abdullah Portfolio',
      description:
        'Case study: A FastAPI + Next.js system that uses sentence-transformers, FAISS, and OpenAI to extract insights from financial PDF documents via natural language queries.',
      keywords:
        'finance, RAG, FastAPI, FAISS, sentence-transformers, PDF analysis, financial documents',
    },
  },
  {
    slug: 'ai-live-chat',
    title: 'AI Live Chat',
    subtitle: 'Real-Time AI Chat Widget with Groq LLM & Redis',
    date: '2025',
    projectNumber: '06',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Businesses want to add AI-powered customer support to their websites without integrating complex third-party chatbots that charge per-seat or per-conversation. Existing solutions lack customization and data privacy control.',
    solution:
      'Developed a lightweight Express 5 backend serving a vanilla HTML/JS chat widget with Groq LLM integration. Redis session management handles conversation context while JWT authentication supports multi-user access. The widget can be embedded in any website with a single script tag.',
    features: [
      'Groq LLM integration for fast, low-cost AI responses',
      'Redis-based conversation memory with configurable TTL',
      'JWT authentication for user identity management',
      'Embeddable chat widget (single index.html + JS)',
      'Real-time streaming responses via server-sent events',
      'Customizable widget appearance via CSS variables',
      'Express session management for anonymous users',
      'Rate limiting and abuse prevention',
      'Cookie-based authentication for returning users',
      'Zero external frontend dependencies — vanilla JS only',
    ],
    architecture:
      'Express 5 server with ESM modules serves the chat widget frontend as static files. The chat API endpoint accepts messages, retrieves conversation history from Redis, constructs a prompt with context, streams the Groq LLM response back via SSE, and persists the updated conversation to Redis. JWT tokens are managed via httpOnly cookies.',
    folderStructure:
      'server.js (Express entry point with routes and middleware), index.html (chat widget UI), ai-widget.js (client-side chat logic), brain.js (prompt engineering and LLM orchestration), redis.js (Redis client wrapper).',
    technologies: [
      'Node.js',
      'Express 5',
      'Groq SDK',
      'Redis',
      'JWT',
      'Server-Sent Events',
      'HTML5',
      'CSS3',
      'JavaScript (Vanilla)',
    ],
    challenges: [
      'Streaming responses via SSE requires careful handling of back-pressure and connection drops; implemented a buffered retry mechanism for partial responses.',
      'Conversation context management in Redis needs a sliding window approach to stay within Groq context limits while preserving recent exchanges.',
      'The widget must work across different host websites without CORS issues; implemented a proxy-based approach for cross-origin requests.',
    ],
    lessonsLearned: [
      'Vanilla JS widgets are far easier to embed than React-based alternatives — no build step, no framework conflicts, just a script tag.',
      'Redis as a conversation store provides sub-millisecond context retrieval, essential for real-time chat feel.',
      'Groq\'s inference speed (500+ tokens/sec) makes it ideal for real-time chat applications where latency is critical.',
    ],
    futureImprovements: [
      'Multi-tenant support for serving different businesses from a single deployment',
      'Analytics dashboard for conversation metrics and user satisfaction',
      'Custom knowledge base ingestion for domain-specific responses',
    ],
    seo: {
      title: 'AI Live Chat — Real-Time AI Chat Widget | Abdullah Portfolio',
      description:
        'Case study: A lightweight Express 5 + Groq LLM chat widget with Redis conversation memory, JWT auth, and embeddable vanilla JS frontend.',
      keywords:
        'AI chat, Groq, real-time chat, Express, Redis, chat widget, LLM, server-sent events',
    },
  },
  {
    slug: 'parcel-tracker',
    title: 'Parcel Tracker',
    subtitle: 'Multi-Carrier Package Tracking with Web Scraping',
    date: '2025',
    projectNumber: '07',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Tracking packages across different couriers (UPS, FedEx, DHL, USPS) requires visiting multiple websites or using fragmented tracking UIs. There is no unified open-source solution that aggregates tracking data with scheduled status updates.',
    solution:
      'Created a Node.js/Express/MongoDB backend with Cheerio-based web scrapers for each carrier, paired with a React Native (Expo) mobile client. Scheduled jobs via node-cron automatically poll carrier websites for status changes and push notifications to users.',
    features: [
      'Multi-carrier support with carrier-specific scrapers',
      'Cheerio-based web scraping for tracking status extraction',
      'node-cron scheduled jobs for automatic status polling',
      'MongoDB for tracking history and user preferences',
      'React Native mobile app with push notifications',
      'Express REST API with Helmet security headers',
      'Morgan request logging for API monitoring',
      'Axios-based HTTP client with retry logic for scraping reliability',
      'Carrier auto-detection from tracking number format',
      'Historical tracking data with status timeline visualization',
    ],
    architecture:
      'Express 4 backend with MongoDB (Mongoose ODM). Each carrier has a dedicated scraper service that extracts tracking status from carrier web pages using Cheerio. A cron job runs every 30 minutes to update active tracking records. The React Native client consumes the REST API and displays tracking timelines. Scraping failures trigger exponential backoff and retry logic.',
    folderStructure:
      'server/ (Express app: app.js, server.js, controllers/, models/, routes/, middleware/, services/scrapers/, utils/, config/, jobs/), client/ (React Native Expo app: App.js, screens/, components/, navigation/, services/, utils/, assets/).',
    technologies: [
      'Node.js',
      'Express 4',
      'MongoDB',
      'Mongoose',
      'React Native',
      'Expo',
      'Cheerio',
      'node-cron',
      'Axios',
      'Helmet',
      'Morgan',
    ],
    challenges: [
      'Carrier websites frequently change their HTML structure, breaking scrapers. Implemented a scraper health monitoring system with automatic fallback to alternative selectors.',
      'Rate limiting and IP blocking from carrier websites required implementing rotating user agents, request throttling, and proxy rotation.',
      'Tracking number format varies wildly between carriers and regions; built a regex-based carrier detection system with configurable rules.',
    ],
    lessonsLearned: [
      'Web scraping for tracking is fragile; a more robust approach would use carrier API integrations where available as a primary source with scraping as fallback.',
      'MongoDB\'s flexible schema is well-suited for tracking data where different carriers return different status fields.',
      'Push notifications via Expo push service require careful handling of device tokens and notification rate limits.',
    ],
    futureImprovements: [
      'Official carrier API integrations (FedEx, UPS, DHL) as primary tracking source',
      'Estimated delivery date prediction using historical carrier performance data',
      'Package delivery photo capture and signature confirmation',
    ],
    seo: {
      title: 'Parcel Tracker — Multi-Carrier Tracking App | Abdullah Portfolio',
      description:
        'Case study: A Node.js + React Native package tracking application with Cheerio-based web scrapers, MongoDB storage, and scheduled status polling via node-cron.',
      keywords:
        'parcel tracking, package tracker, Node.js, React Native, Cheerio, web scraping, MongoDB, Expo',
    },
  },
  {
    slug: 'focus-app',
    title: 'Focus App',
    subtitle: 'React Native Productivity Timer with Pomodoro & Streaks',
    date: '2025',
    projectNumber: '08',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Existing productivity apps either lock essential features behind subscriptions or bombard users with ads. Students and remote workers need a free, focused, customizable Pomodoro timer with progress tracking, distraction blocking, and motivation through streaks.',
    solution:
      'Built a React Native (Expo) app with customizable focus sessions, audio cues via expo-av, local push notifications for session reminders, and a streak-based motivation system. Zustand handles all state with persistent storage, and the architecture is designed for future backend sync.',
    features: [
      'Customizable Pomodoro timer with work/break intervals',
      'Focus session history with daily, weekly, and monthly stats',
      'Streak tracking for consecutive days with focus sessions',
      'Audio cues via expo-av for session start/end alerts',
      'Push notifications via expo-notifications for session reminders',
      'Zustand state management with AsyncStorage persistence',
      'React Navigation for multi-screen navigation',
      'React Native Reanimated for smooth timer animations',
      'TypeScript for type safety across the codebase',
      'Extensible shared workspace for future backend integration',
    ],
    architecture:
      'React Native (Expo SDK 50) with a monorepo workspace structure (apps/mobile/, backend/, shared/). The mobile app uses Zustand stores for session state, timer logic, and settings — all persisted to AsyncStorage. The timer runs as a managed interval with background detection via AppState API. expo-notifications schedule local notifications for upcoming sessions.',
    folderStructure:
      'apps/mobile/ (React Native Expo app: components/, screens/, stores/, hooks/, utils/), backend/ (placeholder for future API), shared/ (TypeScript types shared between mobile and backend), docs/ (architecture decisions and feature specs).',
    technologies: [
      'React Native',
      'Expo SDK 50',
      'TypeScript',
      'Zustand',
      'React Navigation',
      'React Native Reanimated',
      'expo-av',
      'expo-notifications',
      'AsyncStorage',
    ],
    challenges: [
      'Timer accuracy in React Native is affected by app backgrounding; implemented a hybrid approach using interval ticks when active and timestamp calculations when returning from background.',
      'Streak calculation must handle timezone edge cases — a session at 11:30 PM in UTC+2 should still count for today. Solved by normalizing all timestamps to user\'s local timezone.',
      'Audio playback (expo-av) has race conditions when multiple sessions trigger sounds rapidly; implemented a queue-based audio manager.',
    ],
    lessonsLearned: [
      'Monorepo workspace structure (npm workspaces) allows the mobile app, shared types, and future backend to coexist with shared tooling and TypeScript configs.',
      'Zustand with persist middleware is simpler and more performant than Redux for a single-purpose app with straightforward state.',
      'Reanimated 3\'s worklets enable smooth countdown animations that run on the UI thread, avoiding JS thread jank.',
    ],
    futureImprovements: [
      'Distraction blocking mode with app blacklisting',
      'Backend sync for cross-device session history',
      'Ambient sound player (rain, cafe, white noise) during focus sessions',
    ],
    seo: {
      title: 'Focus App — React Native Productivity Timer | Abdullah Portfolio',
      description:
        'Case study: A React Native Pomodoro timer app with customizable sessions, streak tracking, audio cues, and push notifications built with Expo SDK 50.',
      keywords:
        'focus app, Pomodoro timer, React Native, Expo, productivity, streaks, Zustand',
    },
  },
  {
    slug: 'rehman-royal-store',
    title: 'Rehman Royal Store',
    subtitle: 'Full-Featured E-Commerce Platform with Supabase & Cloudinary',
    date: '2026',
    projectNumber: '09',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'Small retail businesses need a modern e-commerce presence but cannot afford custom development or monthly SaaS fees. Existing platforms like Shopify take significant revenue cuts, and open-source alternatives require complex server management.',
    solution:
      'Delivered a complete e-commerce platform using Next.js 16 with Supabase for auth, database, and storage. Cloudinary handles image optimization and CDN delivery. The platform includes product management, order processing, customer accounts, and an admin dashboard — all within a single Next.js deployment.',
    features: [
      'Product catalog with categories, tags, and search',
      'Shopping cart with persistent state via Zustand',
      'Supabase SSR auth with customer accounts',
      'Order processing with status tracking',
      'Admin dashboard with sales analytics (Recharts)',
      'Cloudinary image upload with automatic optimization',
      'Resend email integration for order confirmations',
      'Radix UI accessible components',
      'React Hook Form + Zod validation on all forms',
      'Row-level security for customer data isolation',
      'TanStack Table for admin data management',
      'Sonner toast notifications for user feedback',
      'Framer Motion page transitions and micro-interactions',
    ],
    architecture:
      'Next.js 16 App Router with Supabase SSR client. Server actions handle mutations (cart, orders, product CRUD) while client components manage UI state. Supabase Row-Level Security ensures customers only access their own data. Cloudinary handles image upload from the admin panel with signed upload presets. Emails are sent via Resend API on order status changes.',
    folderStructure:
      'src/app/ (Next.js routes: products, cart, checkout, orders, admin), src/components/ (UI, cart, product, admin components), src/lib/ (Supabase client, utils, email templates), supabase/ (migrations and seed data), scripts/ (maintenance and data migration scripts), public/ (static assets).',
    technologies: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS 4',
      'Supabase',
      'Cloudinary',
      'Zustand',
      'Radix UI',
      'Framer Motion',
      'React Hook Form',
      'Zod',
      'Resend',
      'Sonner',
      'TanStack Table',
      'Recharts',
    ],
    challenges: [
      'Cart state must persist across page navigations and browser sessions while remaining anonymous before login; implemented a Zustand store with localStorage persistence that merges with server cart on login.',
      'Row-Level Security policies for multi-tenant e-commerce require careful design to prevent one customer from seeing another\'s orders or addresses.',
      'Image optimization with Cloudinary requires signed upload URLs for security while maintaining a smooth admin upload experience.',
    ],
    lessonsLearned: [
      'Next.js 16 with Supabase provides a complete e-commerce stack without traditional backend management (no Express, no separate API server).',
      'Row-Level Security eliminates the need for separate API authorization logic — the database enforces access control directly.',
      'Client-side cart with server merge handles the anonymous-to-authenticated transition gracefully without losing items.',
    ],
    futureImprovements: [
      'Stripe payment integration with webhook handling',
      'Inventory management with low-stock alerts',
      'Wishlist and product review system',
    ],
    seo: {
      title: 'Rehman Royal Store — Next.js E-Commerce Platform | Abdullah Portfolio',
      description:
        'Case study: Complete e-commerce platform built with Next.js 16, Supabase, Cloudinary, and Radix UI. Features product management, cart, orders, and admin analytics.',
      keywords:
        'e-commerce, Next.js, Supabase, Cloudinary, online store, Radix UI, ecommerce platform',
    },
  },
  {
    slug: 'cooking-oil-store',
    title: 'Cooking Oil Store',
    subtitle: 'SSR E-Commerce with React 19, Express 4 & Google AI',
    date: '2026',
    projectNumber: '10',
    heroImage: null,
    liveUrl: null,
    githubUrl: '#',
    problem:
      'A traditional cooking oil distributor needed to digitize their B2B and B2C operations with a website that supports SSR for SEO, has robust image processing for product photos, and integrates AI-powered product recommendations — without the complexity of a headless CMS.',
    solution:
      'Built a hybrid SSR application using Vite + React 19 with an Express 4 backend. The server renders pages for SEO benefits while the client hydrates for interactive SPA-like experience. Google AI SDK generates product descriptions and recommendations. Sharp processes product images server-side with Cloudinary for CDN delivery.',
    features: [
      'SSR with Express 4 + Vite for SEO-optimized pages',
      'React 19 with React Router 7 for client-side navigation',
      'Google Gen AI SDK for automated product descriptions',
      'Sharp image processing for resizing and optimization',
      'Cloudinary CDN for product image delivery',
      'Supabase auth with JWT/Jose token management',
      'Rate limiting and Helmet security headers',
      'Playwright e2e test suite',
      'Lucide React icons throughout',
      'Motion library for page animations',
      'Tailwind CSS 4 with design system',
      'Cloudflare Wrangler deployment configuration',
    ],
    architecture:
      'Express 4 server with TypeScript (tsx runner) renders React 19 components server-side via Vite\'s SSR API. The same components hydrate client-side for interactivity. Sharp processes uploaded images (resize, optimize, convert to WebP) before uploading to Cloudinary. Google AI SDK generates SEO-friendly product descriptions from raw product data. Supabase provides authentication and database.',
    folderStructure:
      'src/ (React components and routes), server.ts (Express SSR server), vite.config.ts (Vite config with SSR build), supabase/ (migrations), scripts/ (maintenance scripts), e2e/ (Playwright tests), functions/ (Cloudflare edge functions).',
    technologies: [
      'React 19',
      'Vite 6',
      'Express 4',
      'TypeScript',
      'Tailwind CSS 4',
      'React Router 7',
      'Supabase',
      'Google Gen AI SDK',
      'Sharp',
      'Cloudinary',
      'JWT/Jose',
      'Playwright',
      'Motion',
      'Lucide React',
      'Cloudflare Wrangler',
    ],
    challenges: [
      'SSR hydration mismatches between server-rendered HTML and client-side React required careful handling of browser-only APIs (window, document) in component code.',
      'Image processing pipeline (upload → Sharp resize → Cloudinary upload → DB record) must handle concurrent uploads without overwhelming server memory. Implemented a queue-based processor with concurrency limits.',
      'Google AI SDK rate limiting for description generation required implementing a retry with exponential backoff and fallback templates.',
    ],
    lessonsLearned: [
      'Vite\'s SSR mode with a custom Express server provides fine-grained control over SSR while keeping the fast HMR developer experience.',
      'Sharp\'s streaming API processes images efficiently without loading full files into memory, critical for a store with high-resolution product photos.',
      'Server-side rendering significantly improves Core Web Vitals (LCP, CLS) compared to a client-only SPA, especially on mobile networks.',
    ],
    futureImprovements: [
      'Real-time inventory management with WebSocket updates',
      'B2B wholesale pricing tiers with minimum order quantities',
      'Delivery route optimization for local配送',
    ],
    seo: {
      title: 'Cooking Oil Store — SSR E-Commerce with React 19 | Abdullah Portfolio',
      description:
        'Case study: Hybrid SSR e-commerce platform using Vite + React 19 with Express 4, Google AI SDK, Sharp image processing, and Cloudinary CDN.',
      keywords:
        'SSR e-commerce, React 19, Express 4, Vite, Google AI, Sharp, Cloudinary, ecommerce',
    },
  },
];

export function getCaseStudy(slug) {
  return caseStudies.find((cs) => cs.slug === slug) || null;
}

export function getAllSlugs() {
  return caseStudies.map((cs) => cs.slug);
}
