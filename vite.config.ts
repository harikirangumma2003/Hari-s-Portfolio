import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false, // Disabling sourcemaps in production reduces build weight
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('scheduler') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-core';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('motion') || id.includes('motion/react')) {
                return 'vendor-motion';
              }
              return 'vendor-helpers'; // Other small libraries
            }
          }
        }
      }
    },
    esbuild: {
      drop: ['console', 'debugger'], // Strip debug statement overhead for smaller footprint and peak execution speed
      legalComments: 'none', // Strip any comments in final chunks
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
