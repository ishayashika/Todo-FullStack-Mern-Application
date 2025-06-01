/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,js,ts,tsx}",
  })],
  server: {
    proxy: {
      '/api': {
        target: 'https://todo-fullstack-mern-application-server.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  esbuild: {
    jsx: 'automatic'
  }
});
