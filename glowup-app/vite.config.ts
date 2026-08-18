import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('canvas-confetti')) return 'confetti';
            if (id.includes('zustand')) return 'state';
            return 'vendor';
          }
        }
      }
    }
  }
})
