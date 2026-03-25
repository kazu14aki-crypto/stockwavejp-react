import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    // 本番ビルド時にAPIのURLをRenderに向ける
    'import.meta.env.VITE_API_URL': JSON.stringify('https://stockwavejp-api.onrender.com'),
  },
  server: {
    host: true,
    port: 5173,
  },
})
