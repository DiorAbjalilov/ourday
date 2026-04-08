import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  plugins: [],
  build: {
    outDir: 'dist'
  },
  server: {
    port: parseInt(process.env.PORT) || 5173,
    strictPort: true,
    allowedHosts: true
  }
})
