import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react-swc';
import UnoCSS from '@unocss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import presetAttributify from '@unocss/preset-attributify';
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';
import path from 'path';
import builtins from 'rollup-plugin-node-builtins';

const builtinsPlugin = builtins({ crypto: true });
builtinsPlugin.name = 'builtins';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'http://192.168.3.68:6060',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    basicSsl(),
    react(),
    // viteCommonjs(),
    // rollupInputOptions({
    //   plugins: [builtinsPlugin],
    // }),
    UnoCSS({
      presets: [presetUno(), presetAttributify(), presetIcons()],
    }),
  ],
  define: {
    'process.env': {},
    // global: 'window',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: './node_modules/crypto-browserify/index.js',
    },
  },
  build: {
    // rollupOptions: {
    //   plugins: [builtinsPlugin],
    // },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: false,
        }),
      ],
    },
  },
});
