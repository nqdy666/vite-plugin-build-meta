import { defineConfig } from 'vite'
import VitePluginBuildMeta from 'vite-plugin-build-meta'

export default defineConfig({
  plugins: [
    VitePluginBuildMeta({
      log: true,
      metaData: [
        { name: 'build-version', content: '1.0.0' },
        { name: 'build-time', content: new Date().toISOString() },
      ],
    }),
  ],
})
