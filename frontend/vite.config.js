import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is the corrected, modern way to set up the alias
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
})