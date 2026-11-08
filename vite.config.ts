import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const staticRoot = path.resolve(rootDir, 'static-game')
const mainJsPath = path.resolve(staticRoot, 'assets/main.js')

/** Serve the original Claude bundle as-is (IIFE, not rewritten by Vite). */
function originalMainBundle(): Plugin {
  const send = (res: import('http').ServerResponse) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    fs.createReadStream(mainJsPath).pipe(res)
  }

  return {
    name: 'original-main-bundle',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/assets/main.js') {
          send(res)
          return
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/assets/main.js') {
          send(res)
          return
        }
        next()
      })
    },
    resolveId(id) {
      if (id.includes('assets/main.js')) return '\0original-main-js'
    },
    load(id) {
      if (id === '\0original-main-js') {
        // Keep original bytes as module body (no imports/exports in the bundle).
        return fs.readFileSync(mainJsPath, 'utf8')
      }
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'assets/main.js',
        source: fs.readFileSync(mainJsPath),
      })
    },
  }
}

export default defineConfig({
  root: staticRoot,
  plugins: [originalMainBundle()],
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
    rollupOptions: {
      input: {
        main: path.resolve(staticRoot, 'index.html'),
        game: path.resolve(staticRoot, 'game.html'),
      },
    },
  },
})
