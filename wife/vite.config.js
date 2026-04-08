import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  plugins: [],
  build: {
    outDir: 'dist'
  },
  server: {
    port: parseInt(process.env.PORT) || 5174,
    strictPort: true,
    allowedHosts: true
  }
})
