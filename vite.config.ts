import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sanpo.png'],
      manifest: {
        name: '散步 Sanpo',
        short_name: '散步',
        description: '让散步更有趣的方向指引',
        theme_color: '#F5E6D3',
        background_color: '#F5E6D3',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'sanpo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'sanpo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
