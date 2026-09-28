export const defaultPortfolioContent = {
  aboutParagraphs: [
    {
      id: "about-p-1",
      text: "I\u2019m Muhammad Abdullah, a Data Science undergraduate at PUCIT and a full-stack product engineer. I build web, mobile, and AI systems with TypeScript, React, Node.js, and Supabase/PostgreSQL \u2014 and I\u2019ve published an offline-first Android app, Tazkir, to Google Play.",
    },
    {
      id: "about-p-2",
      text: "I\u2019ve shipped multi-tenant platforms like Fast Food Pro, AI codebase tooling like GitHub Reader AI, and invoicing products used by real customers. I\u2019m looking for backend or full-stack software engineering roles where I can build scalable, high-impact systems.",
    },
  ],
  aboutStats: [
    { id: "stat-1", value: "1+", label: "App Published on Google Play" },
    { id: "stat-2", value: "9", label: "Featured Products & Projects" },
    { id: "stat-3", value: "4+", label: "Societies & Leadership Roles" },
    { id: "stat-4", value: "\u221e", label: "Learning Mindset" },
  ],
  aboutHighlights: [
    {
      id: "highlight-1",
      icon: "\u26a1",
      title: "AI & Automation",
      text: "Building RAG and GraphRAG systems, LangChain pipelines, n8n workflows, and AI API orchestration.",
      linkLabel: "",
      linkUrl: "",
    },
    {
      id: "highlight-2",
      icon: "\ud83c\udfd7\ufe0f",
      title: "Full-Stack Product Engineering",
      text: "Shipping multi-tenant products with Next.js, Node.js/Express, TypeScript, and PostgreSQL/Supabase.",
      linkLabel: "",
      linkUrl: "",
    },
    {
      id: "highlight-3",
      icon: "\ud83d\udcf1",
      title: "Published on Google Play",
      text: "Tazkir \u2014 an offline-first Islamic companion with GPS prayer times, sensor-based Qibla, and local notifications.",
      linkLabel: "Get it on Google Play",
      linkUrl: "https://play.google.com/store/apps/details?id=top.mabdullah.tazkir",
    },
  ],
  skills: [
    {
      id: "languages",
      icon: "\ud83d\udcbb",
      title: "Languages",
      tags: ["TypeScript", "JavaScript", "Python", "SQL", "C++", "HTML", "CSS"],
    },
    {
      id: "frontend",
      icon: "\ud83c\udf10",
      title: "Frontend & Mobile",
      tags: ["Next.js", "React", "React Native", "Expo", "Capacitor", "Tailwind CSS"],
    },
    {
      id: "backend",
      icon: "\u2699\ufe0f",
      title: "Backend & APIs",
      tags: ["Node.js", "Express", "Hono API", "REST API Design", "OAuth 2.0", "Webhooks", "n8n"],
    },
    {
      id: "databases",
      icon: "\ud83d\uddc4\ufe0f",
      title: "Databases",
      tags: ["PostgreSQL", "Supabase", "RLS", "pgvector", "MongoDB", "Redis"],
    },
    {
      id: "ai-ml",
      icon: "\ud83e\udd16",
      title: "AI / ML",
      tags: ["LangChain", "RAG", "GraphRAG", "Scikit-learn", "Pandas", "NumPy"],
    },
    {
      id: "tools",
      icon: "\ud83d\udee0\ufe0f",
      title: "Tools",
      tags: ["GitHub Actions", "Docker", "Git", "Linux", "Postman", "GitHub"],
    },
  ],
  projects: [
    {
      id: "project-1",
      title: "Tazkir",
      description:
        "Offline-first Islamic spiritual companion for Android. GPS prayer times, sensor-based Qibla direction, local notifications, and on-device backup/restore \u2014 published to Google Play and stabilized with 40+ testers while keeping all user data private on-device.",
      tech: ["React Native", "Expo", "Android", "Offline-First", "GitHub Actions"],
      liveUrl: "https://mytazkir.com",
      githubUrl: "#",
      linkUrl: "https://play.google.com/store/apps/details?id=top.mabdullah.tazkir",
      linkLabel: "Google Play",
    },
    {
      id: "project-2",
      title: "Fast Food Pro",
      description:
        "A comprehensive white-label restaurant ecosystem featuring a Customer App (Web & Mobile), Kitchen Display System, Admin Dashboard, and a Developer Configuration Panel. Engineered with a Next.js 14 + Hono API architecture and Supabase Realtime.",
      tech: ["Next.js 14", "Hono API", "Supabase Realtime", "Capacitor 8", "Zustand", "TanStack Query"],
      liveUrl: "https://fastfood.mabdullah.top",
      githubUrl: "#",
    },
    {
      id: "project-3",
      title: "GitHub Reader AI",
      description:
        "A Node.js/Express service that answers natural-language questions about any codebase using pgvector semantic search and graph traversal. Indexed 100+ code files and cut retrieval latency by 35% with hybrid retrieval.",
      tech: ["Node.js", "Express", "PostgreSQL", "pgvector", "GraphRAG", "RAG"],
      liveUrl: "https://github-reader-ai.mabdullah.top",
      githubUrl: "https://github.com/Abdullah2k05/github-reader-ai",
    },
    {
      id: "project-4",
      title: "Invoice Maker",
      description:
        "A web and mobile invoicing platform for creating, managing, and exporting professional business invoices, with a responsive multi-platform workflow for generating customer-ready invoices in seconds.",
      tech: ["Next.js", "React", "PDF Export", "Capacitor", "Multi-Tenant"],
      liveUrl: "https://invoice-maker.mabdullah.top",
      githubUrl: "https://github.com/Abdullah2k05/invoice-generator",
    },
    {
      id: "project-5",
      title: "Money Lens",
      description:
        "A Retrieval-Augmented Generation (RAG) system specialized in financial data analysis, leveraging AI and Machine Learning to extract insights from financial documents.",
      tech: ["Python", "AI", "Machine Learning", "Data Analysis"],
      liveUrl: "https://money-lens.mabdullah.top",
      githubUrl: "https://github.com/Abdullah2k05/financial_rag_model",
    },
    {
      id: "project-6",
      title: "Stock Market Dashboard",
      description:
        "Interactive data visualization application for tracking stock market trends in real-time using live API integrations and modern frontend charting tools.",
      tech: ["React", "API Integration", "Data Visualization", "Frontend"],
      liveUrl: "#",
      githubUrl: "https://github.com/Abdullah2k05/stock-market-app",
    },
    {
      id: "project-7",
      title: "Expensio",
      description:
        "Full-stack expense manager with dashboards, recurring transactions, budgeting, and CSV/PDF export for personal and small-business finance.",
      tech: ["Next.js", "Supabase", "PostgreSQL", "CSV Import", "PDF Reports"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: "project-8",
      title: "Record Keeping",
      description:
        "Family Financial Evidence & Accountability System for informal family businesses. Tracks financial events, expenses, claims, work logs, and evidence with a full audit trail, version history, and role-based access.",
      tech: ["Next.js 16", "Supabase", "PostgreSQL", "Zustand", "Cloudinary", "jsPDF", "Tailwind CSS 4"],
      liveUrl: "#",
      githubUrl: "https://github.com/Abdullah2k05/record-keeping",
    },
    {
      id: "project-9",
      title: "Period Tracker Pro",
      description:
        "A highly customizable period tracking application featuring Supabase integration for data persistence and a built-in interactive journal.",
      tech: ["React", "Supabase", "Zustand", "TailwindCSS"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ],
  products: [
    {
      id: "product-1",
      title: "Tazkir",
      description:
        "Offline-first Islamic companion for Android: GPS prayer times, sensor-based Qibla, local notifications, and private on-device data with backup/restore. Free on Google Play.",
      features: ["Offline-First", "Prayer Times", "Qibla", "Backup & Restore", "Free"],
      linkUrl: "https://play.google.com/store/apps/details?id=top.mabdullah.tazkir",
      linkLabel: "Get it on Google Play",
    },
    {
      id: "product-2",
      title: "GitHub Reader AI",
      price: "9/mo",
      description:
        "Ask natural-language questions about any codebase. GraphRAG and pgvector semantic search index your repository and answer with file-level context in seconds. $9 per month.",
      features: ["GraphRAG", "pgvector", "Code Q&A", "REST API", "Subscription"],
      linkUrl: "https://github-reader-ai.mabdullah.top",
      linkLabel: "Get Started — $9/mo",
    },
    {
      id: "product-3",
      title: "Invoice Maker",
      description:
        "Free invoicing platform for creating, managing, and exporting professional business invoices \u2014 a responsive web workflow with Android support.",
      features: ["Free to Use", "PDF Export", "Web & Mobile", "No Sign-up Needed"],
      linkUrl: "https://invoice-maker.mabdullah.top",
      linkLabel: "Open Invoice Maker",
    },
  ],
  photoSlides: [
    {
      id: "slide-1",
      label: "PUCon '24 - Event Photography",
      image: "/images/one.jpg",
    },
    {
      id: "slide-2",
      label: "FCIT Media Society - Production",
      image: "/images/two.jpg",
    },
    {
      id: "slide-3",
      label: "TechnoVerse CUI - Campus Event",
      image: "/images/three.jpg",
    },
  ],
  events: [
    {
      id: "event-1",
      year: "25",
      title: "FCIT Media & Information Society",
      org: "PUCIT",
      role: "Head of Production - Led the production team for events, video shoots, and media campaigns across 15+ faculty society events.",
    },
    {
      id: "event-2",
      year: "25",
      title: "TechnoVerse CUI Lahore",
      org: "COMSATS University",
      role: "Campus Ambassador - Represented and promoted the TechnoVerse tech festival across campus networks.",
    },
    {
      id: "event-3",
      year: "24",
      title: "PUCon '24",
      org: "University of the Punjab",
      role: "Media Team Member - Covered the flagship tech conference with photography and digital media content.",
    },
    {
      id: "event-4",
      year: "24",
      title: "FCIT NC Sports",
      org: "PUCIT",
      role: "Event Manager - Organized and managed the National College Sports competitions at faculty level.",
    },
  ],
  experience: [
    {
      id: "exp-1",
      title: "Pioneer Debating Society",
      role: "Media Team Member",
      period: "Dec 2025 \u2014 Present",
      subtitle: "PUCIT, Lahore",
      description:
        "Document society events, create digital content, and manage the society's online presence and visual identity.",
    },
    {
      id: "exp-2",
      title: "FCIT Information & Media Society",
      role: "Head of Production",
      period: "Oct 2025 \u2014 Present",
      subtitle: "PUCIT, Lahore",
      description:
        "Lead media production and video shoots for 15+ faculty society events reaching 800+ students.",
    },
    {
      id: "exp-3",
      title: "Programming Fundamentals",
      role: "Teaching Assistant",
      period: "Sep 2025 \u2014 Present",
      subtitle: "PUCIT, Lahore",
      description:
        "Run weekly C++ and OOP labs for 50+ first-year students and grade 100+ lab submissions with feedback on algorithms, code quality, and memory management.",
    },
    {
      id: "exp-4",
      title: "TechnoVerse & TalentBeacon",
      role: "Campus Ambassador",
      period: "Apr 2025 \u2014 Present",
      subtitle: "PUCIT",
      description:
        "Represented TechnoVerse and TalentBeacon on campus, connecting students with opportunities and promoting their platforms' resources.",
    },
    {
      id: "exp-5",
      title: "SMM Rival",
      role: "Founder & CEO",
      period: "2022 \u2014 2026",
      subtitle: "Social Media Marketing Agency (Closed)",
      description:
        "Founded and ran a social media marketing agency delivering AI-driven brand growth, strategic automation, and digital presence management for clients \u2014 the foundation of my automation and product engineering work.",
    },
  ],
  education: [
    {
      id: "edu-1",
      period: "2024 - 2028",
      title: "UNIVERSITY OF THE PUNJAB",
      subtitle: "BS Data Science \u2014 PUCIT, Lahore (Expected 2028)",
      description:
        "Coursework: Data Structures & Algorithms, Database Systems, Object-Oriented Programming, Data Warehousing, Artificial Intelligence, Machine Learning. Active in multiple societies and leadership roles.",
    },
    {
      id: "edu-2",
      period: "2022 - 2024",
      title: "INTERMEDIATE COMPUTER SCIENCE (ICS)",
      subtitle: "Government Postgraduate College Vehari, Vehari",
      description:
        "Completed intermediate studies in computer science with a strong foundation in mathematics, physics, and programming \u2014 the analytical base for a technology-driven career.",
    },
  ],
};
