import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const contactApiPlugin = () => ({
  name: 'contact-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = (req.url || '').split('?')[0]
      if (url === '/api/contact') {
        if (req.method === 'POST') {
          let rawBody = ''
          req.on('data', (chunk) => {
            rawBody += chunk
          })
          req.on('end', async () => {
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {}
            } catch {
              req.body = {}
            }
            try {
              const { default: handler } = await import('./api/contact.js')
              return handler(req, res)
            } catch (err) {
              console.error('API Contact handler error:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ success: false, message: err.message }))
            }
          })
          return
        } else if (req.method === 'OPTIONS') {
          const { default: handler } = await import('./api/contact.js')
          return handler(req, res)
        }
      }
      next()
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), contactApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Listen on all network addresses (both IPv4 127.0.0.1 and IPv6 ::1)
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'ui': ['lucide-react', 'react-icons', '@heroicons/react'],
        },
      },
    },
  },
})