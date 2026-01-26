# Paxie Frontend - AI Coding Instructions

## Architecture Overview

**Stack**: React 19 + Vite + Tailwind CSS + React Router 7 + Axios  
**Build**: `npm run dev` (dev), `npm run build` (production), `npm run lint`

### Core Structure
- **Public Pages** (`src/components/`): LandingPage, AboutUs, Career - use floating Chatbot wrapper
- **Admin Dashboard** (`src/components/admin/`): Login → Protected Home with tabbed navigation
  - `AdminNavBar`: Navigation with logout
  - Mode switching: "files" (document management) | "jobs" (job listings) | "models" (AI config)
- **API Layer** (`src/api/api.jsx`): Axios instance with BASE_URL from `VITE_API_URL`; AI_URL hardcoded to `http://127.0.0.1:8000`
- **Auth**: localStorage-based with `/admin/login` → localStorage.setItem("authToken") → redirect to `/admin/home`

## Critical Patterns & Conventions

### State Management
- Use `useState` hooks per component (no Redux/Context)
- Async operations: `setLoading(true/false)` wrapper pattern; see `Home.jsx` for example
- Example from `AddNewJob.jsx`:
  ```jsx
  const [adding, setAdding] = useState(false);
  const addNewJob = async (e) => {
    setAdding(true);
    try { /* api call */ }
    finally { setAdding(false); }
  }
  ```

### Styling & Component Layout
- **Tailwind-first**: No CSS modules; inline Tailwind with custom keyframes in `tailwind.config.js`
- **Form patterns** (see `AddNewJob.jsx`, `ManageAIModels.jsx`):
  - `space-y-2` grid for form inputs
  - Standard input class: `rounded-lg bg-white/10 border border-white/20 px-4 py-1.5 text-white focus:ring-2 focus:ring-white/80`
  - Disabled state: `bg-white/20 text-gray-500` (disabled button style)
  - Submit button: white background with brand color text; Cancel: red
- **Dark theme**: Light gray text (`text-white/90`), translucent backgrounds (`bg-white/10`)

### API Integration
- **Endpoint calls**: Use `api` object from `api.jsx` (e.g., `api.login()`, `api.addJob()`, `api.getAllDocuments()`)
- **Error handling**: Check `err.response.status` for specific HTTP codes; generic fallback to "Something went wrong"
- **Response validation**: Always await and store in state; use try/catch/finally

### Component Communication
- **Props-based**: Parent passes data + callbacks to child (e.g., `Home` → `JobOpenings` with `jobs`, `getAllJobs()`, `notify()`)
- **Callbacks for mutations**: Child components call parent function to refetch (e.g., `getAllJobs()` after add/delete)
- **Toast notifications**: Import `{ toast, ToastContainer }` from `react-toastify`; custom `Toast` component in `src/components/Toast.jsx`

### Internationalization (i18n)
- `react-i18next` configured in `src/i18n.js`
- Access via: `const { t } = useTranslation()`; then use `t('key')`
- English/Japanese support baked in; add translations to resource object in `i18n.js`

### File Utilities
- `src/utils/FileConverter.js`: `convertFileToBytes()`, `downloadFileFromBase64()`
- Used in `Home.jsx` for document upload/download flows

## Component Development Checklist

**New public page**:
1. Add to `src/components/` folder
2. Add route to `App.jsx`
3. Import Chatbot conditionally in `main.jsx` (add path to `visibleRoutes` array if floating bot needed)
4. Apply Tailwind styling; match dark/light theme

**New admin feature** (after login):
1. Create in `src/components/admin/`
2. Add conditional tab in `Home.jsx` mode switcher
3. Use `useState` for form state; destructure API calls from `api` object
4. Pass `notify` callback from `Home.jsx` for toast messages
5. Follow form layout pattern (space-y-2, standard input classes)

**Admin state mutations**:
1. Wrap async in try/catch
2. Call parent's `getAll*()` function in `try` block after success
3. Show success toast; catch and show error toast with specifics
4. Always `setLoading(false)` in finally block

## Known Issues & Incomplete Patterns

⚠️ **ManageAIModels.jsx**: Uses undefined state variables (`jobDescription`, `jobRequirements`, `adding`, `cancelAdd()`) - copy pattern from `AddNewJob.jsx` when completing this component.

⚠️ **Auth token**: Commented out in `api.jsx` request interceptor; currently no auth header sent with requests.

⚠️ **Protected routes**: Only check localStorage token; no refresh or expiry logic.

## Build & Deployment

- **Dev server**: `npm run dev` → localhost:5173 (default Vite port)
- **Build**: `npm run build` → outputs to `dist/`
- **ESLint**: `npm run lint` - allows unused uppercase variables (constants pattern)
- **Tailwind**: Init config exists; auto-compiled from inline classes

## External Dependencies Worth Noting

- `lucide-react`: Icon library (ChevronDown, X, Send, etc. - replace with correct names)
- `react-markdown`: Renders markdown in messages
- `react-pdftotext`: PDF upload parsing
- `react-rnd`: Draggable/resizable (used in Chatbot)
- `uuid`: Generate unique IDs (convo tracking)
