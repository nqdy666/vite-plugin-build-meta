<h2 align='center'><samp>vite-plugin-build-meta</samp></h2>

<p align='center'>Generate meta tags with custom build metadata in the head of the HTML during the build process</p>

<p align='center'>
<a href='https://www.npmjs.com/package/vite-plugin-build-meta'>
<img src='https://img.shields.io/npm/v/vite-plugin-build-meta?color=222&style=flat-square'>
</a>
</p>

<br>

## Usage

Install

```bash
npm i vite-plugin-build-meta -D # yarn add vite-plugin-build-meta -D
```

Add it to `vite.config.js`

```ts
// vite.config.js
import VitePluginBuildMeta from 'vite-plugin-build-meta'

export default {
  plugins: [
    VitePluginBuildMeta({
      metaData: [
        { name: 'build-version', content: '1.0.0' },
        { name: 'build-time', content: new Date().toISOString() },
        { name: 'commit-hash', commitGitHash: true },
      ],
    })
  ],
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enable` | `boolean` | `true` | 是否启用插件 |
| `log` | `boolean` | `false` | 是否在控制台打印日志 |
| `injectToHead` | `boolean` | `true` | 是否将 meta 标签注入到 HTML head 中 |
| `writeToFile` | `boolean` | `false` | 是否将 metadata 写入到文件 |
| `metaFilePath` | `string` | `'meta.json'` | metadata 输出文件路径（相对项目根目录） |
| `metaData` | `MetaDataItem[]` | `[]` | meta 标签数据数组 |

### MetaDataItem

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | meta 标签的 name 属性 |
| `content` | `string` | meta 标签的 content 属性（使用 `commitGitHash` 时可省略） |
| `commitGitHash` | `boolean` | 为 `true` 时自动将 content 设为当前 git commit hash |
| `[key]` | `string` | 其他自定义属性，会直接添加到 meta 标签的 attrs 中 |

### Write metadata to file

```ts
VitePluginBuildMeta({
  writeToFile: true,
  metaFilePath: 'dist/meta.json',
  metaData: [
    { name: 'build-version', content: '1.0.0' },
    { name: 'commit-hash', commitGitHash: true },
  ],
})
```

## License

MIT License © 2025 [nianqin](https://github.com/nqdy666)
