/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FAVORITE_KEY_PREFIX: string;
  readonly VITE_MAX_FAVORITES: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
