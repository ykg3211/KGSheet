import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7777
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, 'src') },
    ]
  },
})
