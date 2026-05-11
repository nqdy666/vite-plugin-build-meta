import type { HtmlTagDescriptor, Plugin } from 'vite'
import { getGitHash } from './utils'

export interface MetaDataItem {
  name: string
  content?: string
  /**
   * 为 true 时自动将 content 设为当前 git commit hash
   * @default false
   */
  commitGitHash?: boolean
  [key: string]: string | boolean | undefined
}

export interface VitePluginBuildMetaOptions {
  /**
   * 是否启用
   * @default true
   */
  enable?: boolean
  /**
   * 是否启用日志
   * @default false
   */
  log?: boolean
  /**
   * 是否注入到 head 的 meta 标签中
   * @default true
   */
  injectToHead?: boolean
  /**
   * meta 标签数据数组
   */
  metaData?: MetaDataItem[]
}

let i = 0

function VitePluginBuildMeta(options: VitePluginBuildMetaOptions = {}): Plugin {
  const {
    enable = true,
    log = false,
    injectToHead = true,
    metaData = [],
  } = options

  return {
    name: `vite-plugin-build-meta:${i++}`,
    apply: 'build',
    transformIndexHtml(html) {
      if (!enable || metaData.length === 0 || !injectToHead) {
        return html
      }

      const tags: HtmlTagDescriptor[] = metaData.map((item) => {
        const { commitGitHash, ...rest } = item
        const attrs: Record<string, string> = {}
        for (const [k, v] of Object.entries(rest)) {
          if (v !== undefined) {
            attrs[k] = String(v)
          }
        }
        if (commitGitHash) {
          attrs.content = getGitHash()
        }
        if (log) {
          console.log(`\n[vite-plugin-build-meta] <meta ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}>`)
        }
        return {
          tag: 'meta',
          attrs,
          injectTo: 'head',
        }
      })

      return { html, tags }
    },
  }
}

export default VitePluginBuildMeta
