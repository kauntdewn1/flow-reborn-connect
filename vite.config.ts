import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor_framer';
            if (id.includes('@ton')) return 'vendor_ton';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800, // Aumenta a tolerância
  }
})
