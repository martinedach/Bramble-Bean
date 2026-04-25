/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional API origin (e.g. `https://api.example.com`). Leave unset in dev to use the Vite `/api` proxy. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
