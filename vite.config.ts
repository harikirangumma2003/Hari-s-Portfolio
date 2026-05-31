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
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          const gaId = env.VITE_GA_MEASUREMENT_ID;
          if (!gaId) {
            // Remove the Google Analytics script blocks if the ID is missing to prevent network errors in console
            return html.replace(/<!-- Google Analytics -->[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/, '');
          }
          return html.replace(/%VITE_GA_MEASUREMENT_ID%/g, gaId);
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
