import { defineConfig } from 'vite'
import VitePluginBuildMeta from 'vite-plugin-build-meta'

export default defineConfig({
  plugins: [
    VitePluginBuildMeta({ log: true, format: 'YYYY-MM-DD HH:mm:ss' }),
  ],
})
