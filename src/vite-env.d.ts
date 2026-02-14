/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEVELOPER_PORTAL_URL: string;
  readonly VITE_VULTISIG_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
