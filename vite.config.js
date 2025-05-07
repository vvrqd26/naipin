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
        name: 'naipindata',
        short_name: 'np',
        description: '奶瓶数据记录',
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
})
