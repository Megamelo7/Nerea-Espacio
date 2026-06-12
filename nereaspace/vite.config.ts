import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nereaspace/', // Para GitHub Pages: cambiá por el nombre de tu repo
})
