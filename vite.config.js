import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/notebook/',
  appType: 'mpa',
  plugins: [
    {
      name: 'rewrite-middleware',
      configureServer(serve) {
        serve.middlewares.use((req, res, next) => {
          if (
            req.url.startsWith('/notes/') &&
            !req.url.includes('.js') &&
            !req.url.includes('.ts') &&
            !req.url.includes('.css')
          ) {
            const qs = req.url.split('?')[1]
            req.url = '/notes/' + (qs ? `?${qs}` : '')
          }
          next()
        })
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notes: resolve(__dirname, 'notes/index.html'),
      },
    },
  },
})
