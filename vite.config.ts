import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { terser } from 'rollup-plugin-terser';
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
    port: 5174,
    // https: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://172.20.10.6:6060/',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  plugins: [
    // basicSsl(),
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
      plugins: [builtinsPlugin, terser({
        compress: {
          // drop_console: true,
          drop_debugger: true,
        },
      }),],
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
