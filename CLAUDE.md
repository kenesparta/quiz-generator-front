# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quiz Generator Front is a Next.js 15 application for managing online evaluations. The system has two main user flows:

1. **Postulante (Candidate) Flow**: Candidates log in, take evaluations, and submit answers
2. **Admin Flow**: Administrators manage evaluations, exams, candidates, and review submitted answers

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production bundle with Turbopack
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Run Biome linter checks
npm run fmt          # Format code with Biome
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **React**: Version 19.1.2
- **Styling**: Tailwind CSS 4
- **Linting/Formatting**: Biome (configured with recommended rules for React and Next.js)
- **TypeScript**: Strict mode enabled

### Project Structure

```
src/
├── app/                           # Next.js App Router pages
│   ├── login/                     # Candidate login
│   ├── evaluacion/                # Candidate evaluation interface
│   └── admin/
│       ├── login/                 # Admin login
│       └── dashboard/             # Admin dashboard with nested routes
│           ├── layout.tsx         # Dashboard layout with sidebar navigation
│           ├── evaluacion/        # Manage evaluations
│           ├── examen/            # Manage exams
│           ├── postulante/        # Manage candidates
│           └── revision/          # Review candidate submissions
│               └── [postulanteId]/# Dynamic route for individual reviews
├── components/
│   ├── QuestionCard.tsx           # Renders individual questions
│   ├── ExamSection.tsx            # Renders exam sections with questions
│   └── admin/
│       └── Revision.tsx           # Admin review component
├── hooks/
│   ├── useLogin.ts                # Candidate authentication
│   ├── usePostulante.ts           # Fetch candidate data
│   ├── useEvaluation.ts           # Evaluation state management
│   └── admin/
│       └── useAdminLogin.ts       # Admin authentication (currently bypassed)
└── types/
    └── evaluacion.ts              # TypeScript interfaces for evaluation data
```

### API Communication

The app communicates with a backend API. The base URL is configured via:
- Environment variable: `NEXT_PUBLIC_API_BASE_URL`
- Default fallback: `http://localhost:8008`

All custom hooks that make API calls use this BASE_URL pattern.

### Key API Endpoints

Used throughout the application:
- `POST /login/postulante` - Candidate login
- `GET /postulante?id={id}` - Fetch candidate data
- `GET /respuesta/postulante/{postulanteId}` - Fetch evaluation responses
- `PATCH /respuesta/{responseId}` - Update individual question response
- `PUT /respuesta/{postulanteId}` - Submit complete evaluation

### Authentication Flow

**Candidate Authentication:**
1. Login via `useLogin` hook returns JWT token
2. Token stored in localStorage
3. Candidate ID extracted from JWT payload (sub field) using `getSubFromJWT`
4. Token used throughout session for API calls

**Admin Authentication:**
Note: `useAdminLogin` currently bypasses actual authentication and redirects directly to dashboard.

### State Management Pattern

This application uses React hooks for state management:
- Custom hooks encapsulate API logic and state
- Local component state for UI-specific state
- No global state management library (Redux, Zustand, etc.)

### Data Models

**Question Types:**
- `alternativa_unica` - Single choice question (radio buttons)
- `alternativa_peso` - Weighted choice question (radio buttons)
- `sola_respuesta` - Text input question

**Evaluation Structure:**
```
EvaluationResponse
  ├── evaluacion (Evaluation)
  │   └── examenes[] (Exam)
  │       └── preguntas[] (Question)
  │           ├── alternativas (options)
  │           └── respuestas (user answers)
```

### Important Implementation Details

**Response Updates:**
- Individual question responses are saved immediately via PATCH to `/respuesta/{responseId}`
- The `useEvaluation` hook handles automatic debouncing/persistence
- Final submission via PUT includes all responses and sets `fecha_tiempo_fin`

**Timer:**
- Elapsed time tracked in `evaluacion/page.tsx` starting from `fecha_tiempo_transcurrido`
- Updates every second using setInterval
- Displayed as HH:MM:SS clock in sidebar

**Admin Dashboard:**
- Uses fixed sidebar layout with navigation
- Main content area offset by `ml-64` (matching 256px sidebar width)
- Active route highlighting based on pathname matching
- Default redirect to `/admin/dashboard/evaluacion` from base dashboard route

**Path Alias:**
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Always use this alias for imports from src directory

### Biome Configuration

The project uses Biome for linting and formatting with:
- 2-space indentation
- Recommended rules for Next.js and React
- VCS integration enabled for git
- Import organization on save

When making code changes, ensure they comply with Biome rules or update biome.json if intentional deviations are needed.

### Component Patterns

**Server Components vs Client Components:**
- Most pages are client components ("use client") due to interactivity
- Layout files can be server components unless they need hooks

**Styling Convention:**
- Tailwind utility classes for all styling
- No CSS modules or styled-components
- Responsive design with mobile-first approach

### Known Issues/TODOs

- Admin login (`useAdminLogin`) is currently bypassed and needs implementation
- Some hardcoded values exist (e.g., `question.puntos = 3` in QuestionCard.tsx:23, `exam.puntos_obtenidos = 100` in ExamSection.tsx:36)
