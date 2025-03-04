// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3000
  },
  srcDir: 'src/',
  modules: [
    'nuxt-icon',
    '@nuxt/ui'
  ],
  experimental: {
    payloadExtraction: false
  },
  vite: {
    optimizeDeps: {
      exclude: ['vue-demi']
    }
  },
  css: [
    '@/assets/styles/main.css'
  ],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        // Si vous utilisez un PNG :
        // { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  nitro: {
    routeRules: {
      '/_nuxt/**': { cors: false }
    }
  }
})
