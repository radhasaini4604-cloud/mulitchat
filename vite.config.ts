import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load env files in Node process for vite.config
dotenv.config()
dotenv.config({ path: '.env.local' })

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/nvidia-api': {
        target: 'https://ai.api.nvidia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nvidia-api/, ''),
      },
      '/nvidia-nim': {
        target: 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nvidia-nim/, ''),
      },
      '/cloudflare-api': {
        target: 'https://api.cloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloudflare-api/, ''),
      },
      '/ollama-api': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama-api/, ''),
      },
      '/resend-api': {
        target: 'https://api.resend.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/resend-api/, ''),
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_RuQyPUzw_6244v8mV89gswqdjUvcUX7eH'}`
        }
      }
    }
  }
})
