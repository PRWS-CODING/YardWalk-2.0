import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your framework's plugin

export default defineConfig({
  base: './', // This ensures asset paths are relative to the index.html file
  plugins: [react()],
})
