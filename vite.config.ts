import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy TTS requests to StreamElements — bypasses CORS completely
      '/tts-proxy': {
        target: 'https://api.streamelements.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tts-proxy/, '/kappa/v2/speech'),
        secure: true,
      },
    },
  },
});
