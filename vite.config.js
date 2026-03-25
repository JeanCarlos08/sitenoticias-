import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base: nome do repositório no GitHub (importante para GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: '/sitenoticias-/',
})
