import type { HtmlTagDescriptor, Plugin } from 'vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
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
   * 是否将 metadata 写入到文件
   * @default false
   */
  writeToFile?: boolean
  /**
   * metadata 输出文件路径（相对于项目根目录）
   * @default 'meta.json'
   */
  metaFilePath?: string
  /**
   * meta 标签数据数组
   */
  metaData?: MetaDataItem[]
}

let i = 0

function resolveMetaData(metaData: MetaDataItem[]): Record<string, string>[] {
  return metaData.map((item) => {
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
    return attrs
  })
}

function VitePluginBuildMeta(options: VitePluginBuildMetaOptions = {}): Plugin {
  const {
    enable = true,
    log = false,
    injectToHead = true,
    writeToFile = false,
    metaFilePath = 'meta.json',
    metaData = [],
  } = options

  let root = process.cwd()

  return {
    name: `vite-plugin-build-meta:${i++}`,
    apply: 'build',
    configResolved(config) {
      root = config.root
    },
    transformIndexHtml(html) {
      if (!enable || metaData.length === 0) {
        return html
      }

      const resolved = resolveMetaData(metaData)

      if (log) {
        for (const attrs of resolved) {
          console.log(`\n[vite-plugin-build-meta] <meta ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}>`)
        }
      }

      if (writeToFile && metaFilePath) {
        const outPath = resolve(root, metaFilePath)
        writeFileSync(outPath, JSON.stringify(resolved, null, 2), 'utf-8')
        if (log) {
          console.log(`\n[vite-plugin-build-meta] metadata written to ${outPath}`)
        }
      }

      if (!injectToHead) {
        return html
      }

      const tags: HtmlTagDescriptor[] = resolved.map(attrs => ({
        tag: 'meta',
        attrs,
        injectTo: 'head',
      }))

      return { html, tags }
    },
  }
}

export default VitePluginBuildMeta
