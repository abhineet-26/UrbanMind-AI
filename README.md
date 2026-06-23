# 🧠 UrbanMind AI — Real-Time Civic Hazard Tracking & Mapping Platform

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Mgmt-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Leaflet](https://img.shields.io/badge/Leaflet-Mapping-green?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

> UrbanMind AI is an advanced civic intelligence and administrative mapping center. The platform leverages AI orchestration to extract structured infrastructure hazard data from image uploads in 0.8 seconds, plotting real-time data onto spatial coordinate layers to reduce municipal triage processing overhead by 30%.

---

## 🚀 Key Features

*   **⚡ Sub-Second Hazard Extraction:** Integrates with the Google Gemini Flash API to parse and structure hazard data from citizen image uploads instantly.
*   **🗺️ Interactive Spatial Mapping:** Features an administrative mapping board utilizing `React-Leaflet` to handle real-time geospatial coordinate visualization.
*   **📊 Unified State Architecture:** Implements a global state store via `Zustand` to coordinate background events, modal triggers, and cross-component reactivity seamlessly.
*   **📝 Schema-Validated Ingestion:** Enforces reliable data pipelines matching structural Open311 reporting standards to ensure high-fidelity data integrity.

---

## 📂 Project Structure

The frontend architecture follows an organized, component-driven design layout built on top of Vite and TypeScript:

```text
UrbanMind-AI-main/
├── components/
│   ├── MapBoard.tsx       # Coordinate mapping dashboard & Leaflet container[cite: 4]
│   ├── ReportModal.tsx    # Citizen hazard report creation & image upload panel[cite: 4]
│   └── Sidebar.tsx        # Administrative navigation & real-time ticket stream[cite: 4]
├── services/
│   └── aiService.ts       # Core pipeline communicating with Gemini API endpoints[cite: 4]
├── App.tsx                # Main layout engine and application root[cite: 4]
├── index.html             # Single-page application entry template[cite: 4]
├── index.tsx              # React client DOM bootstrap configuration[cite: 4]
├── types.ts               # Global TypeScript definitions & type specifications[cite: 4]
├── vite.config.ts         # Bundler & compilation settings[cite: 4]
├── tsconfig.json          # TypeScript compiler schema guidelines[cite: 4]
├── package.json           # Active build dependencies & project scripts[cite: 4]
├── .env                   # Local runtime environmental variables[cite: 4]
└── .gitignore             # Git system file exclusion registry[cite: 4]
