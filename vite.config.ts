import { defineConfig, splitVendorChunkPlugin } from 'vite';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import react from '@vitejs/plugin-react-swc';
// import UnoCSS from '@unocss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

import path from 'path';
import builtins from 'rollup-plugin-node-builtins';
// import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
// import inject from '@rollup/plugin-inject';

const builtinsPlugin = builtins({ crypto: true });
builtinsPlugin.name = 'builtins';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    // proxy: {
    //   '/api': {
    //     target: 'https://39.108.72.102:8099/mtv/api/',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  plugins: [
    basicSsl(),
    react(),
    // viteCommonjs(),
    // rollupInputOptions({
    //   plugins: [builtinsPlugin],
    // }),
    // splitVendorChunkPlugin(),
    // UnoCSS({
    //   presets: [presetUno(), presetAttributify(), presetIcons()],
    // }),
  ],
  define: {
    // 'process': {},
    'process.env': process.env,
    // global: 'window',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: './node_modules/crypto-browserify/index.js',
    },
  },
  build: {
    rollupOptions: {
      plugins: [builtinsPlugin],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        // NodeGlobalsPolyfillPlugin(),
      ],
    },
  },
});
