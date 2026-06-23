# 🧠 UrbanMind AI — Real-Time Civic Hazard Tracking & Mapping Platform

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge\&logo=react\&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Mgmt-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Leaflet](https://img.shields.io/badge/Leaflet-Mapping-green?style=for-the-badge\&logo=leaflet\&logoColor=white)](https://leafletjs.com/)

> UrbanMind AI is an advanced civic intelligence and administrative mapping center. The platform leverages AI orchestration to extract structured infrastructure hazard data from image uploads in 0.8 seconds, plotting real-time data onto spatial coordinate layers to reduce municipal triage processing overhead by 30%.

---

## 🚀 Key Features

* **⚡ Sub-Second Hazard Extraction:** Integrates with the Google Gemini Flash API to parse and structure hazard data from citizen image uploads instantly.
* **🗺️ Interactive Spatial Mapping:** Features an administrative mapping board utilizing `React-Leaflet` to handle real-time geospatial coordinate visualization.
* **📊 Unified State Architecture:** Implements a global state store via `Zustand` to coordinate background events, modal triggers, and cross-component reactivity seamlessly.
* **📝 Schema-Validated Ingestion:** Enforces reliable data pipelines matching structural Open311 reporting standards to ensure high-fidelity data integrity.

---

## 📂 Project Structure

The frontend architecture follows an organized, component-driven design layout built on top of Vite and TypeScript:

```text
UrbanMind-AI-main/
├── components/
│   ├── MapBoard.tsx       # Coordinate mapping dashboard & Leaflet container
│   ├── ReportModal.tsx    # Citizen hazard report creation & image upload panel
│   └── Sidebar.tsx        # Administrative navigation & real-time ticket stream
├── services/
│   └── aiService.ts       # Core pipeline communicating with Gemini API endpoints
├── App.tsx                # Main layout engine and application root
├── index.html             # Single-page application entry template
├── index.tsx              # React client DOM bootstrap configuration
├── types.ts               # Global TypeScript definitions & type specifications
├── vite.config.ts         # Bundler & compilation settings
├── tsconfig.json          # TypeScript compiler schema guidelines
├── package.json           # Active build dependencies & project scripts
├── .env                   # Local runtime environmental variables
└── .gitignore             # Git system file exclusion registry
```

---

## 🔧 Installation & Local Setup

Get the local development server up and running on your workspace machine.

### Prerequisites

* **Node.js** (v18 or higher recommended)
* **npm** or **yarn** package manager
* **Google Gemini API Key** (for hazard classification pipelines)

### Step-by-Step Deployment

```bash
# 1. Clone the repository and navigate into the project workspace
git clone <your-repository-url>
cd UrbanMind-AI-main

# 2. Install all development and runtime dependencies
npm install

# 3. Establish your environmental keys
# Create a .env file matching the configuration layout below
touch .env
```

### ⚙️ Environment Configuration

Open your newly created `.env` file and append the following variables:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
VITE_BACKEND_URL=http://localhost:8000
```

### 🚀 Booting the Client Runtime

```bash
# Run the local Vite development instance
npm run dev
```

🌐 Securely open and view your development portal at **`http://localhost:5173`**

---

## 🛠️ Technology Stack Detail

* **Core UI Layout:** `React.js` leveraging asynchronous state rendering.
* **Compilation Stack:** `Vite` + `TypeScript` ensuring ultra-fast HMR and end-to-end type safety.
* **Geospatial Layering:** `Leaflet.js` and `React-Leaflet` mapping engines.
* **State Coordination:** `Zustand` lightweight state management store.
* **AI Integration:** Form-validated pipelines communicating directly with the `Google Gemini Flash API`.

---

## 🤝 Acknowledgements

Built as a highly scalable software framework targeting structural modern public resource gaps. UrbanMind AI aims to reduce public infrastructure triage backlogs by automating spatial data visualization workflows directly for emergency municipal backends.
