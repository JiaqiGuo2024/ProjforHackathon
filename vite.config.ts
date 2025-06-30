import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'window',
  },
  // ❌ 删除或注释掉 base 行（你现在是 base: '/ProjforHackathon/'）
  // base: '/ProjforHackathon/',
})
