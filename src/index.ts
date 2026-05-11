import type { HtmlTagDescriptor, Plugin } from 'vite'

export interface MetaDataItem {
  name: string
  content: string
  [key: string]: string
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
        if (log) {
          console.log(`\n[vite-plugin-build-meta] <meta ${Object.entries(item).map(([k, v]) => `${k}="${v}"`).join(' ')}>`)
        }
        return {
          tag: 'meta',
          attrs: { ...item },
          injectTo: 'head',
        }
      })

      return { html, tags }
    },
  }
}

export default VitePluginBuildMeta
