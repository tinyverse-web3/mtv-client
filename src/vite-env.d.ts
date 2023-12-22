/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_IPFS_HOST: string
  readonly VITE_API_VERSION: string
  // readonly VITE_KEY_SERVER_UR: string
  // readonly VITE_KEY_SET_API: string
  // readonly VITE_KEY_GET_API: string
  // readonly VITE_KEY_QASKS_API_KEY: string
  // readonly VITE_KEY_QASKS_API_SECRET_KEY: string
  // readonly VITE_PINATA_GATE_WAY_API: string
  // readonly VITE_PINATA_PIN_CID_API: string
  // readonly VITE_PINATA_PIN_JSON_API: string
  // readonly VITE_PINATA_PIN_FILE_API: string
  // readonly VITE_PINATA_UNPIN_CID_API: string
  // readonly VITE_PINATA_JWT_KEY: string
  // readonly VITE_TINY_WEB: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
