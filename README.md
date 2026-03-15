# ◈ InterviewAI — Full-Stack AI Interview Platform

A full-stack application that conducts AI-powered technical interview practice sessions, providing real-time feedback and scoring using the Anthropic Claude API.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (:5173)                     │
│  React + Vite │ React Router v6 │ Axios │ localStorage  │
└────────────────────────┬────────────────────────────────┘
                         │  /api/* (Vite proxy)
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Spring Boot Backend (:8080)               │
│  SecurityConfig → JwtFilter → Controllers → Services    │
│  PostgreSQL (JPA/Hibernate) │ Anthropic Claude API      │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

### Backend (`ai-interview-backend/`)
```
src/main/java/com/aiinterview/
├── config/
│   ├── AppConfig.java           # WebClient + ObjectMapper beans
│   ├── DataSeeder.java          # Seeds 16 sample questions on startup
│   ├── GlobalExceptionHandler.java
│   └── SecurityConfig.java      # JWT filter chain, CORS
├── controller/
│   ├── AIController.java        # /api/ai/health, /api/ai/followup
│   ├── AuthController.java      # /api/auth/login, /api/auth/register
│   └── InterviewController.java # /api/interview/**
├── dto/
│   ├── InterviewResponse.java   # Nested DTOs (AuthResponse, QuestionDto, etc.)
│   ├── LoginRequest.java
│   └── RegisterRequest.java
├── entity/
│   ├── Question.java            # Category + Difficulty enums
│   ├── Result.java
│   └── User.java                # Role enum
├── repository/
│   ├── QuestionRepository.java
│   ├── ResultRepository.java
│   └── UserRepository.java
├── security/
│   ├── CustomUserDetailsService.java
│   ├── JwtFilter.java           # OncePerRequestFilter — attaches auth
│   └── JwtUtil.java             # Token generation + validation (JJWT)
└── service/
    ├── AIService.java           # Calls Anthropic Claude API via WebClient
    ├── AuthService.java
    └── InterviewService.java
```

### Frontend (`ai-interview-frontend/`)
```
src/
├── components/
│   ├── ErrorBoundary.jsx        # Catches React render errors
│   ├── LoadingScreen.jsx        # Full-page loading state
│   ├── Navbar.jsx               # Sticky nav with user chip + logout
│   ├── ProtectedRoute.jsx       # Redirects to /login if unauthenticated
│   └── Toast.jsx                # Global notification system (Context)
├── hooks/
│   ├── useApi.js                # useApi() + useMutation() generic hooks
│   └── useAuth.js               # Auth context + signOut helper
├── pages/
│   ├── Dashboard.jsx            # Stats summary + quick-start questions
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── Practice.jsx             # Full session: sidebar, answer, AI feedback
│   ├── Register.jsx
│   └── Results.jsx              # History list with scores + AI feedback
├── services/
│   ├── api.js                   # Axios instance + JWT interceptor + 401 handler
│   ├── authService.js           # login() + register()
│   └── interviewService.js      # All interview API calls
├── utils/
│   └── auth.js                  # localStorage token/user helpers
├── App.jsx                      # Route definitions
├── config.js                    # API_BASE_URL + ENDPOINTS + storage keys
├── index.css                    # Full design system
└── main.jsx                     # Root render with ErrorBoundary + ToastProvider
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |

---

## Setup & Running

### 1. Database

```sql
CREATE DATABASE ai_interview_db;
```

### 2. Backend configuration

Edit `ai-interview-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ai_interview_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_DB_PASSWORD

jwt.secret=your_super_secret_key_at_least_32_chars_long
jwt.expiration=86400000

ai.api.key=your_anthropic_api_key
ai.api.model=claude-sonnet-4-20250514
```

### 3. Start the backend

```bash
cd ai-interview-backend
mvn spring-boot:run
# Starts on http://localhost:8080
# DataSeeder auto-creates 16 sample questions
```

### 4. Start the frontend

```bash
cd ai-interview-frontend
npm install
npm run dev
# Opens at http://localhost:5173/login
```

---

## API Reference

### Auth (public)
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | `{ token, userId, name, email, role }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token, userId, name, email, role }` |

### Interview (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/interview/questions` | All questions |
| `GET`  | `/api/interview/questions/random?count=5` | Random N questions |
| `GET`  | `/api/interview/questions/category/{cat}` | Filter by category |
| `GET`  | `/api/interview/questions/{id}` | Single question |
| `POST` | `/api/interview/submit` | `{ questionId, answer }` → AI feedback + score |
| `GET`  | `/api/interview/results` | Current user's history |
| `GET`  | `/api/interview/results/{id}` | Single result |
| `GET`  | `/api/interview/summary` | Stats: total, avg score, high scores |

### AI (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/ai/health` | Public health check |
| `POST` | `/api/ai/followup` | `{ question, answer }` → follow-up question |

### Question Categories
`TECHNICAL` · `BEHAVIORAL` · `SYSTEM_DESIGN` · `DATA_STRUCTURES` · `ALGORITHMS` · `DATABASE` · `JAVA` · `SPRING` · `MICROSERVICES` · `GENERAL`

### Difficulty Levels
`EASY` · `MEDIUM` · `HARD`

---

## Authentication Flow

```
User submits login form
  → POST /api/auth/login
  → Backend validates credentials, returns JWT
  → Frontend saves token to localStorage
  → Axios interceptor attaches "Authorization: Bearer <token>" to all requests
  → On 401: token cleared, redirect to /login
  → On logout: token + user cleared from localStorage
```

---

## Frontend Key Patterns

### Axios interceptors (`src/services/api.js`)
Every request automatically gets the JWT header:
```js
api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### Protected routes (`src/components/ProtectedRoute.jsx`)
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Generic data hook (`src/hooks/useApi.js`)
```js
const { data: summary, loading, error, refetch } = useApi(getSessionSummary)
```

### Toast notifications (`src/components/Toast.jsx`)
```jsx
const toast = useToast()
toast('Answer submitted!', 'success')
toast('Network error', 'error')
```

---

## Design System

| Token | Value |
|-------|-------|
| `--bg` | `#0c0d0f` (near-black) |
| `--accent` | `#6c63ff` (indigo) |
| `--green` | `#22c55e` |
| `--amber` | `#f59e0b` |
| `--red` | `#ef4444` |
| Display font | Syne (800 weight headings) |
| Body font | DM Sans |
| Mono font | DM Mono (scores, badges, labels) |

Score colors: ≥80 = green · 50–79 = amber · <50 = red

---

## Running Tests

```bash
# Backend unit tests
cd ai-interview-backend
mvn test

# Specific test class
mvn test -Dtest=AuthServiceTest
mvn test -Dtest=JwtUtilTest
mvn test -Dtest=InterviewServiceTest
```

---

## Build for Production

```bash
# Frontend production build
cd ai-interview-frontend
npm run build
# Output: dist/

# Backend JAR
cd ai-interview-backend
mvn clean package -DskipTests
java -jar target/ai-interview-backend-1.0.0.jar
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| CORS error in browser | Ensure backend `cors.allowed-origins` includes `http://localhost:5173` in `application.properties` |
| 401 on every request | Check JWT secret matches between restarts; token in localStorage may be expired |
| AI feedback returns 0 score | Verify `ai.api.key` is set and valid in `application.properties` |
| Database connection refused | Confirm PostgreSQL is running and `ai_interview_db` exists |
| Port 8080 in use | Change `server.port` in `application.properties` and update `vite.config.js` proxy target |
| Questions not loading | Backend seeder runs on first startup only — check console for `Seeded 16 questions` log |

---

## License

MIT
