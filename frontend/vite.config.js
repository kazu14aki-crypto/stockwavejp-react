import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'import.meta.env.VITE_API_URL':           JSON.stringify('https://stockwavejp-api.onrender.com'),
    'import.meta.env.VITE_SUPABASE_URL':      JSON.stringify('https://mhrfecweuvueoxkoderc.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocmZlY3dldXZ1ZW94a29kZXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTU3NDAsImV4cCI6MjA5MDI5MTc0MH0.zZDhedTM9tp1dZJ9zbS1T8GM3NZOadah-FXD-IwdNJw'),
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    // CSS最小化を明示的に有効化
    cssMinify: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Reactコアを分離
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Supabaseを分離（大きいライブラリ）
          if (id.includes('node_modules/@supabase')) {
            return 'supabase'
          }
          // columnDataは大きいので分離
          if (id.includes('columnData')) {
            return 'column-data'
          }
        },
      },
    },
  },
})
