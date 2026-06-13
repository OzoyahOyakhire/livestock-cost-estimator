import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      '/api/v1': {
        target: 'https://livestock-cost-estimator-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  }
})

