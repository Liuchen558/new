import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.resolve(rootDir, 'static-game'),
  server: {
    host: '127.0.0.1',
    port: 4729,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4729,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(rootDir, 'dist'),
    emptyOutDir: true,
  },
})
