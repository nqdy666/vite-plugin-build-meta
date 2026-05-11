import { defineConfig } from 'vite'
import VitePluginBuildMeta from 'vite-plugin-build-meta'

export default defineConfig({
  plugins: [
    VitePluginBuildMeta({
      log: true,
      writeToFile: true,
      metaFilePath: 'dist/meta.json',
      metaData: [
        { name: 'build-version', content: '1.0.0' },
        { name: 'build-time', content: new Date().toISOString() },
        { name: 'commit-hash', commitGitHash: true },
      ],
    }),
  ],
})
