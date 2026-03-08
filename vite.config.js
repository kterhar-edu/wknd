import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No service worker — iOS Safari crashes with SW + base-path combos.
// "Add to Home Screen" on iOS works purely via the apple-* meta tags.
// The manifest.json (in /public) handles Android home screen install.

export default defineConfig({
  base: '/wknd/',
  plugins: [react()],
})
