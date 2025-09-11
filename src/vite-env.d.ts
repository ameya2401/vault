/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORAGE_PROVIDER: 'supabase' | 'github'
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GITHUB_OWNER: string
  readonly VITE_GITHUB_REPO: string
  readonly VITE_GITHUB_TOKEN: string
  readonly VITE_GITHUB_BRANCH: string
  readonly VITE_APP_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
