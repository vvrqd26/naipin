import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import unocss from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: '奶瓶数据',
        short_name: '奶瓶数据',
        description: '奶瓶数据记录',
        start_url: '/',
        display: 'standalone',
        background_color: '#FDC7C7',
        theme_color: '#FDC7C7',

        icons:[
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
})
