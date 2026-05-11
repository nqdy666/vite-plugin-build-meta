import type { Plugin } from 'vite'
import dayjs from 'dayjs'

export interface VitePluginBuildMetaOptions {
  /**
   * 是否启用
   * @default true
   */
  enable?: boolean
  /**
   * 是否启用
   * @default false
   */
  log?: boolean
  name?: string
  format?: string | ((date: Date) => string)
}

let i = 0

function VitePluginBuildMeta(options: VitePluginBuildMetaOptions = {}): Plugin {
  const {
    enable = true,
    log = false,
    name = 'build-timestamp',
    format,
  } = options

  return {
    name: `vite-plugin-build-meta:${i++}`,
    apply: 'build',
    transformIndexHtml(html) {
      if (!enable) {
        return html
      }
      let timestamp: string = new Date().getTime().toString()
      if (typeof format === 'function') {
        timestamp = format(new Date())
      }
      else if (typeof format === 'string') {
        timestamp = dayjs().format(format)
      }

      if (log) {
        console.log(`\n${name}: ${timestamp}`)
      }
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: {
              name,
              content: timestamp,
            },
            injectTo: 'head',
          },
        ],
      }
    },
  }
}

export default VitePluginBuildMeta
