---
lang: zh-CN
title: 前端工程化
description: 前端工程化面试题
---

# 前端工程化

## 1、Vite 为什么更快
::: details 详情
Vite 相比传统构建工具（如 Webpack ）更快🚀，主要得益于以下几个核心特性：

**基于原生 ES 模块（ESM）**
- Vite 利用浏览器原生的 ES 模块，在开发模式下 **按需加载** 模块，避免了整体打包，从而减少了启动时间。
- 它通过只编译实际修改的文件，提升了开发过程中的反馈速度。

---

**高效的热模块替换（HMR）**
- Vite 在开发模式下利用原生 ES 模块实现模块级的热更新。
- 当文件发生变化时，Vite 只会重新加载发生变化的模块，而不是重新打包整个应用，极大提高了热更新的速度。

---

**使用 esbuild 进行快速编译**
- Vite 默认使用 esbuild 作为编译工具，相比传统的 JavaScript 编译工具（如 Babel、Terser），esbuild 提供显著的性能提升，能够快速完成代码转换和压缩，从而加速开发和构建过程。

---

**现代 JavaScript 特性支持**
- Vite 在生产环境中使用 Rollup 构建，支持优秀的树摇和代码拆分，有效减小构建体积。
- 同时，Vite 利用现代浏览器特性（如动态导入、ES2015+ 模块），减少了 polyfill 的使用，提升了加载速度。

---

**预构建和缓存**
- Vite 在开发时会预构建常用依赖（如 Vue、React），并将其转换为浏览器可执行的格式，避免每次启动时重新编译。
- 同时，Vite 会缓存这些预构建的依赖，并在启动时复用缓存，从而加快启动速度。

---
::: tip 局限性
- Vite 的开发模式依赖浏览器原生的 ES 模块加载，因此在不支持 ES 模块的旧版浏览器中需要额外的 polyfill。
- 对于非常复杂的项目，Vite 的 Rollup 构建可能需要更多的配置优化。
:::

## 2、Vite 中如何使用环境变量
::: details 详情
根据当前的代码环境变化的变量就叫做 **环境变量**。比如，在生产环境和开发环境将 BASE_URL 设置成不同的值，用来请求不同的环境的接口。

Vite内置了 `dotenv` 这个第三方库， dotenv 会自动读取 `.env` 文件， dotenv 从你的 **环境目录** 中的下列文件加载额外的环境变量：
> .env # 所有情况下都会加载 .env.[mode] # 只在指定模式下加载。

默认情况下
- `npm run dev` 会加载 `.env` 和 `.env.development` 内的配置。
- `npm run build` 会加载 `.env` 和 `.env.production` 内的配置。
- `mode` 可以通过命令行 `--mode` 选项来重写。 环境变量需以 `VITE_` 前缀定义，且通过 `import.meta.env` 访问。
```js
// .env.development
VITE_API_URL = 'http://localhost:3000'
// 代码中访问
console.log(import.meta.env.VITE_API_URL) // http://localhost:3000
```

多模式环境变量的加载优先级
- Vite 会根据当前模式加载对应的 `.env` 文件，加载顺序如下（后者会覆盖前者的同名变量）：
  1. `.env`
  2. `.env.local`
  3. `.env.[mode]`
  4. `.env.[mode].local`

注意
- 环境变量会被打包到前端代码中，因此不要将敏感信息（如 API 密钥、数据库密码）直接存储在 `.env` 文件中。
- 对于敏感信息，建议通过后端接口或其他安全方式获取。
:::

## 3、简述 Vite 的依赖预加载机制
::: details 详情
**什么是依赖预加载**
- Vite 的依赖预加载机制是为了优化开发环境下的模块加载性能。
- 在开发模式中，Vite 会对第三方依赖（如 `node_modules` 中的包）进行预构建，将其转换为浏览器可执行的 ES 模块格式。

---

**依赖预加载的核心原理**
- 使用 esbuild 进行预构建
  > - Vite 使用 `esbuild` 对第三方依赖进行预构建，速度比传统工具（如 Webpack）快 10-100 倍。
  > - 预构建的依赖会被存储在 `node_modules/.vite` 目录中，避免每次启动时重复构建。
- 将 CommonJS 和 UMD 转换为 ESM
  > - 如果依赖是 CommonJS 或 UMD 格式，Vite 会将其转换为 ESM 格式，以便浏览器直接加载。
- 合并模块
  > - 对于一些模块（如 `lodash-es`），Vite 会将其拆分为多个小模块并按需加载。
  > - 对于一些常用依赖（如 `react`、`vue`），Vite 会将其合并为一个模块，减少请求次数。
- 缓存机制
  > - 预构建的依赖会被缓存，只有当依赖的版本或配置发生变化时才会重新构建。

---

**依赖预加载的触发条件**
- 当你运行 `npm run dev` 时，Vite 会自动检查以下条件：
  > - 是否有新的依赖被安装。
  > - 是否有依赖的版本发生变化。
  > - 是否修改了 `vite.config.js` 中的相关配置（如 `optimizeDeps`）。

---

**依赖预加载的优点**
- 提升启动速度
  > - 通过预构建依赖，避免在开发模式下逐个解析和加载模块，显著提升启动速度。
- 优化模块加载
  > - 将非 ESM 格式的依赖转换为 ESM 格式，减少浏览器加载和解析的开销。
- 减少请求次数
  > - 合并模块后，减少了浏览器的 HTTP 请求次数。

---

**如何配置依赖预加载**
- Vite 提供了 `optimizeDeps` 配置项，用于控制依赖预加载的行为。
  ```js
  optimizeDeps: {
    include: ['lodash', 'axios'], // 强制预构建的依赖
    exclude: ['some-large-lib'], // 排除不需要预构建的依赖
  },
  ```

---

**注意事项**
- 动态导入的依赖
  > - 动态导入的依赖不会被自动预构建，需要手动添加到 `optimizeDeps.include` 中。
- 大型依赖
  > - 对于体积较大的依赖，可以通过 `exclude` 排除，避免影响启动速度。
:::

## 4、Vite 中如何加载、处理静态资源
::: details 详情
**静态资源目录（public 目录）**
- 静态资源可以放在 `public` 目录下，这些文件不会经过构建处理，直接按原样复制到输出目录。在开发时可以通过 `/` 路径直接访问，如 `/icon.png`。
- `public` 目录可通过 `vite.config.js` 中的 `publicDir` 配置项修改。

---

**资源引入**
- 图片、字体、视频：通过 `import` 引入，Vite 会自动将其处理为 URL 并生成带哈希值的文件名。在开发时，引用会是根路径（如 `/img.png`），在生产构建后会是如 `/assets/img.2d8efhg.png` 的路径。
- CSS、JS：CSS 会被自动注入到页面中，JS 按模块处理。

---

**强制作为 URL 引入**
- 通过 `?url` 后缀可以显式强制将某些资源作为 URL 引入。
  ```js
  import imgUrl from './img.png?url'
  ```

---

**new URL()**
- 通过 `import.meta.url` 可以动态构建资源的 URL，这对于一些动态路径很有用。
  ```js
  const imgUrl = new URL('./img.png', import.meta.url).href
  document.getElementById('hero-img').src = imgUrl
  ```
:::

## 5、Vite 中可做的项目优化有哪些
::: details 详情
**启用 Gzip/Brotli 压缩**
- 使用 `vite-plugin-compression` 插件开启 Gzip 或 Brotli 压缩，可以有效减小传输的文件体积，提升加载速度。

  安装依赖：
  ```bash
  npm install vite - plugin - compression--save - dev
  ```
  示例：
  ```js
  import compression from 'vite-plugin-compression'
  export default defineConfig({
    plugins: [
      compression({
        algorithm: 'gzip', // 或 'brotli' 压缩
        threshold: 10240, // 文件大于 10KB 时启用压缩
      }),
    ],
  })
  ```

---

**代码分割**
- 路由分割
  > - 使用动态导入实现按需加载，减小初始包的体积，提高页面加载速度。
  ```js
  const module = import('./module.js') // 动态导入
  ```
  > - 在路由中使用懒加载。
  ```js
  const MyComponent = () => import('./MyComponent.vue')
  ```
- 手动控制分包
  > - 配置 Rollup 的 `manualChunks` 选项来手动控制如何分割代码。这个策略适用于想要将特定的依赖或模块提取成单独的 `chunk` 文件。
  ```js
  import { defineConfig } from 'vite'
  export default defineConfig({
    build: {
      minify: false,
      // 在这里配置打包时的rollup配置
      rollupOptions: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  })
  ```

---

**图片优化**
- 使用 `vite-plugin-imagemin` 插件对项目中的图片进行压缩，减少图片体积，提升加载速度。
  安装依赖：
  ```bash
  npm install vite - plugin - imagemin--save - dev
  ```
  示例：
  ```js
  export default defineConfig({
    plugins: [
      ViteImagemin({
        gifsicle: {
          optimizationLevel: 3,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 85,
        },
        pngquant: {
          quality: [0.65, 0.9],
        },
      }),
    ],
  })
  ```

---

---

**依赖优化**
- 配置 Vite 的 `optimizeDeps` 选项，提前预构建常用依赖，减少开发环境下的启动时间。
  ```js
  export default defineConfig({
    optimizeDeps: {
      include: ['lodash', 'vue', 'react'], // 预构建依赖
    },
  })
  ```
:::

## 6、Vite 中如何配置代理服务器
::: details 详情
在 Vite 中配置代理可以通过 `server.proxy` 选项来实现。以下是一个示例配置：
```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // 代理 /api 请求到目标服务器
      '/api': {
        target: 'http://localhost:5000', // 目标服务器地址
        changeOrigin: true, // 修改请求头中的 Origin 字段为目标服务器的 origin
        secure: false, // 是否允许 HTTPS 请求
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，将 /api 替换为空
      },

      // 代理某些静态资源请求
      '/assets': {
        target: 'http://cdn-server.com', // 目标是静态资源服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assets/, '/static'), // 将 /assets 路径重写为 /static
      },
    },
  },
})
```
:::

## 7、简述 Vite 插件开发流程
::: details 详情
Vite 插件开发基于 Rollup 插件系统，因此其生命周期和钩子与 Rollup 插件非常相似。以下是开发流程和关键步骤：

1️⃣ 插件生命周期钩子
- `config`：修改 Vite 配置，适用于动态配置。
- `configResolved`：在 Vite 配置解析完成后调用，适合需要基于最终配置进行操作的场景。
- `configureServer`：修改开发服务器行为，如添加中间件。
- `transform`：对模块内容进行转换，适用于文件类型转换或代码处理。
- `load`：自定义模块加载逻辑。
- `resolveId`：自定义模块解析逻辑。
- `buildStart` 和 `buildEnd`：构建开始和结束时触发，适用于日志记录或资源清理。
- `closeBundle`：在打包完成后触发，适合执行清理或后处理操作。

2️⃣ 插件基本结构
```js
export default function myVitePlugin() {
  return {
    name: 'vite-plugin-example', // 插件名称
    config(config) {
      // 修改 Vite 配置
    },
    configureServer(server) {
      // 修改开发服务器行为
    },
    transform(src, id) {
      // 对文件内容进行转换
    },
  }
}
```

3️⃣ 插件开发
- 在插件开发过程中，根据需求实现不同的钩子逻辑。例如，实现一个插件来自动注入环境变量或处理特定的文件类型：
```js
// 自动注入环境变量到代码中的插件
export default function injectEnvPlugin() {
  return {
    name: 'vite-plugin-inject-env',
    transform(src, id) {
      if (id.endsWith('.js')) {
        const envVars = Object.entries(process.env)
          .map(([key, value]) => `const ${key} = "${value}";`)
          .join('\n');
        return {
          code: `${envVars}\n${src}`,
          map: null,
        };
      }
    },
  };
}
```

4️⃣ 插件调试方法
- 使用 `console.log` 输出调试信息。
- 在 `transform` 或其他钩子中打印 `src` 和 `id`，查看文件内容和路径。
- 使用 `debug` 库。
  ```js
  import debug from 'debug';
  const log = debug('vite:plugin-example');
  log('This is a debug message');
  ```

5️⃣ 插件测试
  - 使用 `vitest` 或 `jest` 编写单元测试。
  ```js
  import { describe, it, expect } from 'vitest';
  import myVitePlugin from './my-vite-plugin';

  describe('myVitePlugin', () => {
    it('should transform code correctly', () => {
      const plugin = myVitePlugin();
      const result = plugin.transform('const a = 1;', 'example.js');
      expect(result.code).toContain('transformed code');
    });
  });
  ```

6️⃣ 插件使用
- 插件开发完成后，可以在 Vite 配置中使用：
```js
import transformFilePlugin from 'vite-plugin-transform-file'

export default {
  plugins: [transformFilePlugin()],
}
```

7️⃣ 发布插件
- 开发完成后，插件可以通过 npm 发布，或者将其托管在 GitHub 上，方便团队或社区使用。
:::

## 8、简述 Webpack 是什么以及作用
::: details 详情
Webpack 是一个开源的 **前端静态模块打包工具**，主要用于将现代 JavaScript 应用中的各种资源（代码、样式、图片等）转换为优化的静态文件。它是现代前端开发的核心工具之一，尤其在复杂项目中扮演着关键角色。

**Webpack 的核心作用**
- 模块化支持
  - 将代码拆分为多个模块（文件），管理依赖关系。
  - 支持语法
    - ES Modules ( `import/export` )。
    - CommonJS ( `require/module.exports` )。
    - AMD 等模块化方案。
- 资源整合
  - 处理非 JS 文件：将 CSS、图片、字体、JSON 等资源视为模块，统一管理。
  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
  }
  ```
- 代码优化
  - Tree Shaking：删除未使用的代码。
  - 代码分割（Code Splitting）：按需加载代码，减少首屏体积。
  - 压缩：减小文件体积，提升加载速度。
- 开发工具集成
  - 热更新（HMR）：实时预览代码修改效果。
  - Source Map：调试时映射压缩代码到源代码。
  - 本地服务器：快速启动开发环境。
- 生态扩展
  - Loader：处理特定类型文件（如 .scss → .css ）。
  - Plugin：优化构建流程（如生成 HTML、压缩代码）。

---

**Webpack 的工作流程**
- 入口（Entry）：从指定文件（如 index.js）开始分析依赖。
- 依赖图（Dependency Graph）：递归构建模块间的依赖关系。
- 加载器（Loaders）：转换非 JS 资源（如编译 Sass、处理图片）。
- 插件（Plugins）：在构建生命周期中执行优化任务。
- 输出（Output）：生成优化后的静态文件（如 bundle.js）。

---

**适用场景**
- 单页应用（SPA）：如 React、Vue、Angular 项目。
- 复杂前端工程：多页面、微前端架构。
- 静态网站生成：结合 Markdown、模板引擎使用。

---

**与其他工具对比**
|工具|定位|优点|缺点|
|----|-----|--------|--------|
|Webpack|通用构建工具|功能强大，生态丰富，适合复杂项目|配置复杂，构建速度较慢|
|Rollup|库打包工具|TreeShaking更激进，适合库开发|不适合大型应用|
|Vite|新一代构建工具|开发环境快，零配置，支持现代特性|生产环境依赖Rollup，生态不如Webpack|
|Gulp/Grunt|任务运行器|简单易用，适合小型项目|无模块化支持，功能有限|
:::

## 9、如何使用 Webpack 配置多环境的不同构建配置
::: details 详情
在 Webpack 中配置多环境（如开发环境、测试环境、生产环境）的构建配置，可以通过 环境变量注入 和 配置合并 的方式实现。

1️⃣ 安装依赖
```bash
npm install webpack-merge cross-env --save-dev
```
- `webpack-merge`：用于合并基础配置和环境专属配置。
- `cross-env`：跨平台设置环境变量（兼容 Windows 和 macOS/Linux）。

2️⃣ 创建配置文件结构
```
project/
├── config/
│   ├── webpack.common.js    # 公共配置
│   ├── webpack.dev.js       # 开发环境配置
│   └── webpack.prod.js      # 生产环境配置
├── src/
│   └── ...                  # 项目源码
└── package.json
```

3️⃣ 编写公共配置 ( `webpack.common.js` )
```js
// config/webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

4️⃣ 编写环境专属配置
- 开发环境 ( `webpack.dev.js` )
```js
// config/webpack.dev.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    // 注入环境变量（可在代码中通过 process.env.API_URL 访问）
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://dev.api.com'),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
})
```
- 生产环境 ( `webpack.prod.js` )
```js
// config/webpack.prod.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      '...', // 保留默认的 JS 压缩配置
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://prod.api.com'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})
```

5️⃣ 配置 `package.json` 脚本
```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development webpack serve --config config/webpack.dev.js",
    "build:dev": "cross-env NODE_ENV=development webpack --config config/webpack.dev.js",
    "build:prod": "cross-env NODE_ENV=production webpack --config config/webpack.prod.js"
  }
}
```

6️⃣ 在代码中使用环境变量
```js
// src/index.js
console.log('当前环境:', process.env.NODE_ENV)
console.log('API 地址:', process.env.API_URL)

// 根据不同环境执行不同逻辑
if (process.env.NODE_ENV === 'development') {
  console.log('这是开发环境')
} else {
  console.log('这是生产环境')
}
```

7️⃣ 运行命令
```bash
# 启动开发服务器（热更新）
npm run start

# 构建开发环境产物
npm run build:dev

# 构建生产环境产物
npm run build:prod
```
:::

## 10、Webpack 的核心概念有哪些
::: details 详情
**入口（Entry）**
- 作用：定义 Webpack 构建依赖图的起点，通常为项目的主文件（如 index.js）。
```js
entry: './src/index.js', // 单入口
    entry: {
        app: './src/app.js',
        admin: './src/admin.js'
    }, // 多入口
```

---

**出口（Output）**
- 作用：指定打包后的资源输出位置和命名规则。
```js
output: {
    filename: '[name].bundle.js', // 输出文件名（[name] 为入口名称）
    path: path.resolve(__dirname, 'dist'), // 输出目录（绝对路径）
    clean: true, // 自动清理旧文件（Webpack 5+）
}
```

---

**加载器（Loaders）**
- 作用：让 Webpack 处理非 JavaScript 文件（如 CSS、图片、字体等），将其转换为有效模块。
```js
module: {
    rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, // 处理 CSS
        {
            test: /\.(png|svg)$/,
            type: 'asset/resource'
        }, // 处理图片（Webpack 5+）
    ],
}
```

---

**插件（Plugins）**
- 作用：扩展 Webpack 功能，干预整个构建流程（如生成 HTML、压缩代码、提取 CSS）。
```js
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }), // 生成 HTML
  new MiniCssExtractPlugin(), // 提取 CSS 为独立文件
]
```

---

**模式（Mode）**
- 作用：预设优化策略，区分开发环境（development）和生产环境（production）。
```js
mode: 'production', // 启用代码压缩、Tree Shaking 等优化
```

---

**模块（Modules）**
- 作用：Webpack 将每个文件视为模块（如 JS、CSS、图片），通过依赖关系构建依赖图。
- 特点：支持 ESM、CommonJS、AMD 等模块化语法。

---

**代码分割（Code Splitting）**
- 作用：将代码拆分为多个文件（chunks），实现按需加载或并行加载，优化性能。
- 实现方式：
  - 动态导入（`import()`）
  - 配置 `optimization.splitChunks`

---

**Tree Shaking**
- 作用：通过静态分析移除未使用的代码，减小打包体积。
- 前提：使用 ES Module（ `import/export` ），并启用生产模式（`mode: 'production'`）。
:::

## 11、Webpack 中如何实现按需加载
::: details 详情
在 Webpack 中实现按需加载（代码分割/懒加载）的核心思路是 将代码拆分为独立 chunk，在需要时动态加载。

1️⃣ 基础方法
  > 动态导入（Dynamic Import） 通过 `import()` 语法实现按需加载，Webpack 会自动将其拆分为独立 chunk。
  - 代码中使用动态导入
  ```js
  // 示例：点击按钮后加载模块
  document.getElementById('btn').addEventListener('click', async () => {
    const module = await import('./module.js')
    module.doSomething()
  })
  ```
  - 配置 Webpack 确保 `webpack.config.js` 的 `output` 配置中包含 `chunkFilename` 
  ```js
  module.exports = {
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].[contenthash].chunk.js', // 动态导入的 chunk 命名规则
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/', // 确保 chunk 的公共路径正确
    },
  }
  ```

2️⃣ 框架集成
  > React/Vue 路由级按需加载 结合前端框架的路由系统实现组件级懒加载。
  - React 示例
  ```jsx
  import React, { Suspense, lazy } from 'react'
  import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

  const Home = lazy(() => import('./routes/Home'))
  const About = lazy(() => import('./routes/About'))

  function App() {
    return (
      <Router>
        <Suspense fallback={<div> Loading... </div>}>
          {' '}
          <Switch>
            <Route exact path="/" component={Home} />{' '}
            <Route
              path="/about
          "
              component={About}
            />{' '}
          </Switch>{' '}
        </Suspense>{' '}
      </Router>
    )
  }
  ```
  - Vue 示例
  ```js
  const routes = [
    {
      path: '/',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/about',
      component: () => import('./views/About.vue'),
    },
  ]
  ```

3️⃣ 优化配置
  > 代码分割策略 通过 `SplitChunksPlugin` 优化公共代码提取。
  ```js
  module.exports = {
    optimization: {
      splitChunks: {
        chunks: 'all', // 对所有模块进行分割（包括异步和非异步）
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors', // 提取 node_modules 代码为 vendors 块
            priority: 10, // 优先级
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2, // 被至少两个 chunk 引用的代码
            name: 'common',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    },
  }
  ```

4️⃣ Babel 配置（如需支持旧浏览器）
  > 安装 Babel 插件解析动态导入语法
  ```bash
  npm install @babel/plugin-syntax-dynamic-import --save-dev
  ```
  > 在 `.babelrc` 或 `babel.config.json` 中添加插件
  ```json
  {
    "plugins": ["@babel/plugin-syntax-dynamic-import"]
  }
  ```

5️⃣ 预加载与预取（可选优化）
  > 通过注释提示浏览器提前加载资源（需结合框架使用）。
  > - 预加载是一种资源加载优化策略，允许浏览器在当前页面加载时，与父 `chunk` 并行加载指定的资源。
  > - 预取是一种资源加载优化策略，允许浏览器在空闲时间加载指定的资源。
  - React 示例
  ```js
  const About = lazy(
    () =>
      import(
        /* webpackPrefetch: true */ // 预取（空闲时加载）
        /* webpackPreload: true */ // 预加载（与父 chunk 并行加载）
        './routes/About'
      )
  )
  ```
  - Vue 示例
  ```js
  const routes = [
    {
      path: '/',
      component: () => import(/* webpackPrefetch: true */ './views/Home.vue'), // 预取
    },
    {
      path: '/about',
      component: () => import(/* webpackPreload: true */ './views/About.vue'), // 预加载
    },
  ];
  ```

6️⃣ 验证效果
- 构建产物分析
  - 运行 `npx webpack --profile --json=stats.json` 生成构建报告。
  - 使用 [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 可视化分析 chunk 分布。
- 网络请求验证
  - 打开浏览器开发者工具，观察触发动态导入时是否加载新 chunk。
:::

## 12、Webpack 的构建流程
::: details 详情
Webpack 的构建流程是一个串行的流程，主要包含以下关键步骤：

1️⃣ 初始化配置
- 读取配置文件：Webpack 启动后，会读取项目根目录下的 `webpack.config.js` 或其他指定的配置文件，获取构建所需的各种配置信息，如入口、出口、加载器、插件等。
- 合并默认配置：将用户自定义的配置与 Webpack 的默认配置进行合并，生成最终的构建配置。

2️⃣  初始化编译环境
- 创建 Compiler 对象：Compiler 对象是 Webpack 的核心对象，负责整个编译过程的控制和管理，包含了所有 Webpack 配置信息。
- 创建 Compilation 对象：Compilation 对象代表了一次资源的构建过程，负责模块的构建、依赖的解析、代码的生成等具体工作。

3️⃣ 解析入口文件
- 确定入口模块：根据配置中的 `entry` 选项，找到项目的入口文件（如 `index.js`）。
- 构建依赖图：从入口文件开始，递归解析模块的依赖关系，使用 `require`、`import` 等语句找到所有依赖的模块，并将它们添加到依赖图中。

4️⃣ 加载模块
- 应用加载器：对于每个模块，Webpack 会根据配置中的 `module.rules` 规则，使用相应的加载器（Loaders）对模块进行转换。例如，使用 `babel-loader` 转换 ES6+ 代码，使用 `css-loader` 和 `style-loader` 处理 CSS 文件。
- 解析模块路径：Webpack 会根据模块的导入语句，解析模块的实际文件路径，并将其转换为绝对路径。

5️⃣ 转换和处理模块
- 代码转换：加载器对模块内容进行转换后，Webpack 会将转换后的代码解析为抽象语法树（AST），并对其进行进一步的处理，如 Tree Shaking、代码压缩等。
- 生成模块实例：处理完成后，Webpack 会为每个模块生成一个模块实例，包含模块的 ID、代码、依赖关系等信息。

6️⃣ 合并模块
- 生成 Chunk：Webpack 根据依赖图和配置中的代码分割规则，将相关的模块合并成一个或多个 Chunk。例如，入口模块和其直接依赖的模块会合并成一个主 Chunk，动态导入的模块会生成独立的 Chunk。
- 优化 Chunk：对生成的 Chunk 进行优化，如提取公共代码、压缩代码等，以减小打包体积。

7️⃣ 输出文件
- 生成最终代码：根据配置中的 `output` 选项，将 Chunk 转换为最终的文件内容，如 JavaScript 文件、CSS 文件等。
- 写入文件系统：将生成的文件写入到指定的输出目录中，完成整个构建过程。

8️⃣ 执行插件
- 生命周期钩子：在整个构建过程中，Webpack 会在不同的阶段触发相应的生命周期钩子，如 `compile`、`make`、`emit` 等。插件可以监听这些钩子，在特定的时机执行相应的操作，如生成 HTML 文件、压缩代码、清理输出目录等。

---

简单示例，以下是一个简单的 Webpack 构建流程示例：
```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
```

## 13、Vite 和 Webpack 有什么区别
Vite 和 Webpack 都是前端构建工具，但它们在开发模式、构建策略和启动速度上有明显不同。

::: details 详情
### 核心区别

#### 开发模式

- Webpack 需要先打包，再启动开发服务。
- Vite 基于浏览器原生 ESM，开发时按需加载模块，启动速度更快。

#### 热更新

- Webpack 的热更新基于打包后的模块系统。
- Vite 的热更新直接基于原生模块，通常更快、更轻量。

#### 生产构建

- Webpack 使用自己的打包体系完成生产构建。
- Vite 生产构建默认基于 Rollup，更适合做最终产物优化。

#### 依赖处理

- Webpack 对所有资源统一处理，适合复杂定制场景。
- Vite 在开发时会先做依赖预构建，减少浏览器重复请求和转换成本。

### 适用场景

- 新项目、追求快速启动和更好开发体验，优先考虑 Vite。
- 旧项目迁移成本较高、依赖复杂 Webpack 插件生态时，继续使用 Webpack 更稳妥。

### 总结

| 对比项 | Vite | Webpack |
| --- | --- | --- |
| 启动速度 | 快 | 相对慢 |
| 开发模式 | 原生 ESM 按需加载 | 先打包再开发 |
| 热更新 | 更轻量 | 成熟稳定 |
| 生产构建 | Rollup | 自身打包体系 |
| 适用场景 | 新项目 | 复杂旧项目、强定制场景 |

如果是现代新项目，通常优先选 Vite；如果项目已经深度依赖 Webpack 生态，保持 Webpack 也很合理。
:::

## 14、什么是 Tree Shaking，如何让它生效
`Tree Shaking` 是构建工具在打包时移除未使用代码的一种优化手段，可以减小最终产物体积。

::: details 详情
### 基本原理

Tree Shaking 主要依赖 ES Module 的静态结构。

ES Module 的 `import` 和 `export` 是静态声明，构建工具可以在编译阶段分析哪些导出被使用，哪些导出没有被使用，然后在压缩阶段删除未使用代码。

```js
// utils.js
export function add(a, b) {
  return a + b;
}

export function minus(a, b) {
  return a - b;
}

// main.js
import { add } from "./utils";

console.log(add(1, 2));
```

如果 `minus` 没有被使用，生产构建时就有机会被删除。

### 生效条件

- 使用 ES Module 语法，避免全部使用 CommonJS。
- 生产模式构建，开启代码压缩。
- 代码没有明显副作用。
- 第三方包需要正确声明 `sideEffects`。

### sideEffects 配置

在 `package.json` 中可以通过 `sideEffects` 告诉构建工具哪些文件有副作用。

```json
{
  "sideEffects": false
}
```

如果项目中有全局样式或会执行副作用的文件，需要保留：

```json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

### 常见失效原因

- 使用 CommonJS 的 `require` 和 `module.exports`。
- 模块顶层存在副作用代码，例如直接修改全局对象。
- 使用整体导入导致构建工具难以精确分析。
- 第三方包没有提供 ESM 产物。
- 错误配置 `sideEffects`，导致该删除的没删或不该删的被删。

### 总结

Tree Shaking 的关键是“静态分析 + 无副作用判断 + 生产压缩”。开发时写代码应尽量使用 ES Module，避免不必要的模块副作用，并正确配置包的 `sideEffects`。
:::

## 15、Source Map 是什么，生产环境如何使用
`Source Map` 是一种源代码映射文件，用于把压缩、混淆、编译后的代码映射回原始源码，方便开发和线上问题定位。

::: details 详情
### 为什么需要 Source Map

前端项目经过构建后，代码通常会被压缩、混淆、合并，甚至从 TypeScript、Sass 等语言编译成 JavaScript、CSS。

如果线上报错只显示构建后的代码行列号，很难定位问题。Source Map 可以把错误位置还原到源码中的文件、行、列，提升调试效率。

### 基本原理

构建工具会生成一个 `.map` 文件，里面记录构建后代码和源码之间的映射关系。

构建后的文件中通常会带有类似注释：

```js
//# sourceMappingURL=app.js.map
```

浏览器开发者工具或错误监控平台可以根据这个映射文件还原源码位置。

### 常见类型

- `eval-source-map`：构建快，适合开发环境，但不适合生产环境。
- `source-map`：生成完整映射文件，定位准确，但可能暴露源码。
- `hidden-source-map`：生成 map 文件，但不在产物中暴露引用，适合上传到监控平台。
- `nosources-source-map`：不包含源码内容，只保留映射信息。

### 生产环境如何使用

- 不建议直接公开完整 Source Map，避免源码泄露。
- 可以使用 `hidden-source-map`，将 map 文件上传到 Sentry 等错误监控平台。
- 构建产物部署到 CDN 时，可以不上传 `.map` 文件到公网。
- 对敏感业务代码，需要评估是否使用 `nosources-source-map`。

### 总结

Source Map 的核心价值是提升调试和线上错误定位效率。开发环境可以使用更完整的映射，生产环境要在“定位效率”和“源码安全”之间做权衡。
:::

## 16、Babel 的作用是什么，转换流程是怎样的
Babel 是一个 JavaScript 编译器，主要用于把新语法转换成目标运行环境可以识别的代码，也可以配合插件完成语法转换、代码分析和自动注入 polyfill。

::: details 详情
### Babel 的作用

- 将 ES6+ 语法转换为兼容性更好的 JavaScript。
- 将 TypeScript、JSX 等语法转换为普通 JavaScript。
- 通过插件对代码做自定义转换。
- 配合 `@babel/preset-env` 和 `core-js` 按需处理兼容性。

### 转换流程

Babel 的核心转换流程可以分为三个阶段：

#### 1. 解析 Parse

Babel 会先把源代码解析成 AST（抽象语法树）。

```js
const add = (a, b) => a + b;
```

这段代码会被解析成描述变量声明、箭头函数、参数、返回表达式等结构的 AST。

#### 2. 转换 Transform

Babel 插件会访问和修改 AST 节点，例如把箭头函数转换成普通函数。

```js
const add = function (a, b) {
  return a + b;
};
```

#### 3. 生成 Generate

Babel 会把修改后的 AST 重新生成 JavaScript 代码，同时可以生成 Source Map。

### preset 和 plugin 的区别

- `plugin`：单个转换能力，例如转换箭头函数、转换可选链。
- `preset`：一组插件集合，例如 `@babel/preset-env`、`@babel/preset-react`。

### polyfill 和语法转换的区别

- 语法转换：把新语法转换成旧语法，例如箭头函数转普通函数。
- polyfill：补齐运行环境中不存在的 API，例如 `Promise`、`Array.prototype.includes`。

Babel 默认主要做语法转换，API 兼容通常需要结合 `core-js`、`@babel/preset-env` 的 `useBuiltIns` 配置处理。

### 总结

Babel 的核心是“源码 -> AST -> 修改 AST -> 生成代码”。面试中需要重点说明它不只是简单字符串替换，而是基于 AST 的代码转换工具。
:::

## 17、PostCSS 是什么，常见用途有哪些
`PostCSS` 是一个使用 JavaScript 插件转换 CSS 的工具。它本身不直接做具体转换，真正的能力来自插件生态。

::: details 详情
### 工作原理

PostCSS 会先把 CSS 解析成 AST，然后交给插件处理，最后再把处理后的 AST 生成新的 CSS。

整体流程类似：

```txt
CSS 源码 -> CSS AST -> 插件转换 -> 生成 CSS
```

### 常见用途

#### 1. 自动添加浏览器前缀

最常见的是配合 `autoprefixer`：

```css
.box {
  display: flex;
}
```

经过处理后可能变成：

```css
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

#### 2. 使用未来 CSS 语法

可以通过插件提前使用部分未来 CSS 语法，再转换为当前浏览器可识别的写法。

#### 3. CSS 代码检查和转换

例如：

- px 转 rem。
- CSS Modules。
- 压缩 CSS。
- 校验 CSS 规范。

### 和 Sass、Less 的区别

- Sass、Less 是 CSS 预处理器，提供变量、嵌套、函数等语法能力。
- PostCSS 是转换工具，能力取决于插件，可以做预处理、后处理、兼容性处理等。

### 总结

PostCSS 的核心价值是“插件化 CSS 转换”。在现代前端工程中，它通常和 Vite、Webpack、Tailwind CSS、Autoprefixer 等工具一起使用。
:::

## 18、什么是 Monorepo，有哪些优缺点
`Monorepo` 是一种代码仓库管理方式，指把多个项目或多个包放在同一个 Git 仓库中统一管理。

::: details 详情
### 常见结构

```txt
repo
├── apps
│   ├── web
│   └── admin
├── packages
│   ├── utils
│   ├── ui
│   └── eslint-config
└── package.json
```

### 优点

- 代码复用方便，公共组件、工具函数、配置可以统一维护。
- 多项目协作时，跨包修改可以在同一个提交中完成。
- 统一依赖版本、代码规范、构建流程和 CI/CD。
- 更容易做全局重构和影响范围分析。

### 缺点

- 仓库体积可能变大。
- 构建和 CI 需要做缓存、增量构建，否则会变慢。
- 权限隔离比多仓库更复杂。
- 工程治理要求更高，需要清晰的包边界和发布流程。

### 常见工具

- `pnpm workspace`
- `Turborepo`
- `Nx`
- `Rush`
- `Lerna`

### 适用场景

- 多个前端应用共享组件库、工具库。
- 中后台、多端应用、组件库一起维护。
- 团队希望统一工程规范和依赖管理。
:::

## 19、Browserslist 是什么，有什么作用
`Browserslist` 用于声明项目需要兼容哪些浏览器和运行环境。Babel、Autoprefixer、PostCSS、ESLint 等工具都可以读取它，从而决定要做哪些兼容处理。

::: details 详情
### 配置方式

可以写在 `package.json` 中：

```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

也可以写在 `.browserslistrc` 文件中：

```txt
> 1%
last 2 versions
not dead
```

### 常见作用

- Babel 根据目标浏览器决定是否需要转换新语法。
- Autoprefixer 根据目标浏览器决定是否添加 CSS 前缀。
- 构建工具可以根据目标环境决定产物兼容范围。
- 团队可以统一项目的浏览器支持策略。

### 常见查询语法

- `> 1%`：全球使用率大于 1% 的浏览器。
- `last 2 versions`：每个浏览器最近两个版本。
- `not dead`：排除已经停止维护或长期无人使用的浏览器。
- `iOS >= 13`：指定 iOS Safari 版本。

### 注意事项

- 兼容范围越宽，构建产物通常越大，转换和 polyfill 也更多。
- 移动端项目需要特别关注 iOS Safari 和 Android WebView。
- 修改 Browserslist 后，可能影响 JS 转译结果和 CSS 前缀输出。
:::

## 20、CI 和 CD 有什么区别
CI/CD 是现代前端工程交付流程中的重要概念，分别对应持续集成和持续交付/持续部署。

::: details 详情
### CI

CI 是 Continuous Integration，持续集成。

它强调开发者频繁提交代码后，系统自动执行检查流程，例如：

- 安装依赖。
- 代码格式检查。
- ESLint 检查。
- TypeScript 类型检查。
- 单元测试。
- 构建验证。

CI 的目标是尽早发现问题，避免错误代码长期停留在主分支。

### CD

CD 可以表示 Continuous Delivery（持续交付）或 Continuous Deployment（持续部署）。

- 持续交付：代码通过 CI 后，自动生成可发布产物，但是否发布到生产环境仍由人工确认。
- 持续部署：代码通过 CI 后，自动发布到目标环境。

### 前端项目常见流程

```txt
提交代码 -> 安装依赖 -> Lint -> 测试 -> 构建 -> 上传产物 -> 部署
```

### 区别总结

| 对比项 | CI | CD |
| --- | --- | --- |
| 关注点 | 代码集成质量 | 代码交付和部署 |
| 典型任务 | lint、test、build | 上传产物、部署环境 |
| 触发时机 | 提交或合并代码 | CI 通过后 |
| 目标 | 尽早发现问题 | 更快更稳定发布 |

### 注意事项

- CI 不等于 CD，构建通过不代表已经发布。
- 生产部署通常需要灰度、回滚、监控和告警配合。
- 前端项目还需要注意环境变量、静态资源路径、CDN 缓存刷新等问题。
:::

## 21、为什么要提交 lockfile
`package-lock.json`、`pnpm-lock.yaml`、`yarn.lock` 这类 lockfile 用来锁定项目依赖的精确版本，保证不同环境安装出的依赖树尽量一致。

::: details 详情
### lockfile 解决什么问题

`package.json` 中的版本通常是范围，例如：

```json
{
  "dependencies": {
    "vite": "^5.0.0"
  }
}
```

`^5.0.0` 表示可以安装 `5.x` 范围内的较新版本。不同时间、不同机器安装时，实际拿到的依赖版本可能不同。

lockfile 会记录：

- 直接依赖的精确版本。
- 间接依赖的精确版本。
- 包下载地址和完整性校验信息。
- 包管理器解析出的依赖树结构。

### 为什么要提交到仓库

- 保证本地、测试环境、CI、生产构建依赖一致。
- 减少“我这里能跑，线上不能跑”的问题。
- 方便代码审查时发现依赖变化。
- 提升安装速度，包管理器不需要每次重新解析完整依赖树。

### 注意事项

- 应使用团队统一的包管理器，不要混用多个 lockfile。
- 应避免手动编辑 lockfile，依赖变更通过包管理器命令生成。
- 应在 CI 中使用严格安装命令，例如 `pnpm install --frozen-lockfile`。
:::

## 22、生产环境 Source Map 应该如何处理
生产环境 Source Map 能帮助定位线上压缩代码对应的源码位置，但也可能暴露源码细节，所以需要结合安全策略使用。

::: details 详情
### Source Map 的作用

前端生产代码通常会经过压缩、混淆、合并，线上报错堆栈不容易直接定位源码。

Source Map 可以把生产代码中的行列号映射回原始源码位置，配合错误监控平台能快速定位问题。

### 常见处理方式

- 不生成 Source Map：安全性高，但线上排查困难。
- 生成但不上传 CDN：构建产物中保留映射文件，只上传到错误监控平台。
- 生成并限制访问：通过鉴权、内网、白名单等方式限制 `.map` 文件访问。
- 只在预发环境开启完整 Source Map，生产使用隐藏 Source Map。

### Vite 示例

```js
// vite.config.js
export default {
  build: {
    sourcemap: "hidden",
  },
};
```

`hidden` 会生成 Source Map，但不会在产物中追加 sourceMappingURL 注释，更适合配合监控平台上传。

### 注意事项

- 不建议直接把可公开访问的完整 Source Map 放到生产 CDN。
- 发布时要保证监控平台中的 Source Map 和线上产物版本一致。
- Source Map 上传后应关联版本号、commit hash 或 release id。
- 如果源码包含敏感信息，应先清理，不要依赖 Source Map 策略兜底。
:::

## 23、前端项目如何做代码分割
代码分割是把打包产物拆成多个 chunk，避免首屏一次性加载全部代码，从而提升页面加载速度。

::: details 详情
### 常见方式

#### 1. 路由级分割

路由页面通常是最适合拆分的边界：

```js
const UserPage = () => import("./pages/UserPage.vue");
```

用户访问对应路由时，才加载该页面代码。

#### 2. 组件级分割

对体积较大、非首屏必需的组件进行异步加载：

```js
const ChartPanel = () => import("./components/ChartPanel.vue");
```

适合图表、富文本编辑器、地图、复杂弹窗等模块。

#### 3. 第三方依赖分割

构建工具可以把稳定的第三方依赖单独拆出，方便浏览器缓存。

```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue"],
        },
      },
    },
  },
};
```

### 注意事项

- 不要拆得过细，否则会产生过多请求和调度成本。
- 首屏关键代码不应过度异步化。
- 大依赖要结合实际使用场景考虑按需加载。
- 拆包后要观察首屏体积、请求瀑布流和缓存命中情况。
:::

## 24、前端如何配置资源预加载策略
资源预加载用于提前请求后续可能需要的资源，减少用户真正访问时的等待时间，但配置不当也会抢占首屏带宽。

::: details 详情
### preload

`preload` 表示当前页面很快就会用到该资源，浏览器应尽早加载。

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

适合首屏关键字体、关键 CSS、关键脚本等。

### prefetch

`prefetch` 表示资源未来可能会用到，浏览器可以在空闲时低优先级加载。

```html
<link rel="prefetch" href="/assets/user-page.js" as="script" />
```

适合下一页路由 chunk、用户可能访问的详情页资源。

### modulepreload

现代 ESM 产物可以使用 `modulepreload` 提前加载模块依赖：

```html
<link rel="modulepreload" href="/assets/main.js" />
```

Vite 构建产物中常会自动处理模块预加载。

### 配置原则

- 首屏必需资源用 `preload`。
- 后续可能访问的资源用 `prefetch`。
- 不确定是否会用到的资源不要过度预加载。
- 预加载资源必须真的被使用，否则会浪费带宽。

### 注意事项

- `preload` 优先级较高，滥用会影响首屏关键请求。
- 字体预加载需要正确设置 `as`、`type`、`crossorigin`。
- 路由预取应结合用户行为，例如鼠标悬停或进入可视区域后再触发。
:::

## 25、前端环境变量使用时要注意什么
前端环境变量常用于区分不同环境的接口地址、构建开关和公共配置，但不能把它当成安全的密钥存储方式。

::: details 详情
### 基本概念

在 Vite 中，只有以 `VITE_` 开头的环境变量会暴露给客户端代码：

```txt
VITE_API_BASE_URL=https://api.example.com
```

代码中可以通过 `import.meta.env` 读取：

```js
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

这些变量会在构建时被替换进前端产物。

### 不能存放什么

前端环境变量最终会进入浏览器代码，用户可以通过打包产物或 DevTools 看到。

因此不能存放：

- 数据库密码。
- 服务端密钥。
- 第三方服务私钥。
- 管理后台高权限 Token。
- 任何不能公开给用户的信息。

### 适合存放什么

- 接口基础地址。
- CDN 地址。
- 站点标题。
- 构建环境标识。
- 是否开启某些前端功能的公开开关。

### 注意事项

- 不同环境应使用不同 `.env` 文件，并避免提交包含敏感信息的文件。
- CI/CD 中注入的变量要区分前端公开变量和服务端私密变量。
- 修改环境变量后通常需要重新构建，不能期待运行时自动变化。
- 前端权限、计费、风控等关键逻辑不能依赖环境变量隐藏。
:::

## 26、package.json 中 sideEffects 有什么作用
`sideEffects` 用于告诉打包工具哪些文件有副作用，从而帮助 Tree Shaking 更安全地删除未使用代码。

::: details 详情
### 什么是副作用

副作用是指模块被导入后，即使没有使用它的导出，也会产生外部影响。

例如：

```js
import "./global.css";
import "./polyfill";
```

这类文件导入后会修改全局样式或全局对象，不能随意删除。

### 基本配置

如果项目所有模块都没有副作用，可以配置：

```json
{
  "sideEffects": false
}
```

如果部分文件有副作用，可以配置白名单：

```json
{
  "sideEffects": [
    "*.css",
    "./src/polyfill.js"
  ]
}
```

### 和 Tree Shaking 的关系

Tree Shaking 会尝试删除未使用代码，但如果打包工具不确定模块是否有副作用，就可能保守保留。

`sideEffects` 可以帮助打包工具判断未使用模块是否能安全移除。

### 注意事项

- 配置 `sideEffects: false` 前要确认模块确实没有全局副作用。
- CSS、polyfill、全局注册等文件通常需要保留。
- 配置错误可能导致样式丢失、polyfill 不生效或全局初始化逻辑被删除。
:::

## 27、npm scripts 中 pre 和 post 钩子是什么
npm scripts 支持为脚本配置 `pre` 和 `post` 生命周期钩子，用于在目标脚本执行前后自动执行额外命令。

::: details 详情
### 基本用法

```json
{
  "scripts": {
    "prebuild": "pnpm lint",
    "build": "vite build",
    "postbuild": "node scripts/report.js"
  }
}
```

执行：

```bash
pnpm build
```

实际顺序是：

```txt
prebuild -> build -> postbuild
```

### 常见场景

- 构建前执行 lint 或类型检查。
- 测试前准备 mock 数据。
- 构建后生成报告。
- 发布前执行校验脚本。

### 优点

- 可以把脚本流程拆开，职责更清晰。
- 调用主命令时自动串联前后置任务。
- 减少重复书写命令。

### 注意事项

- 隐式执行可能降低可读性，新人不一定知道还会跑 `pre` 和 `post`。
- 不同包管理器对脚本生命周期的细节可能不同，团队需要统一工具。
- 对关键流程，显式写成 `build:check`、`build:prod` 有时更清晰。
:::

## 28、构建工具中的 external 是什么
`external` 用于告诉构建工具某些依赖不要打包进产物，而是在运行时从外部环境获取。

::: details 详情
### 解决什么问题

默认情况下，构建工具会把项目依赖打进产物。

但在一些场景下，依赖不应该被打包：

- 开发组件库，希望 `react`、`vue` 由使用方提供。
- 页面通过 CDN 全局变量加载某个库。
- 避免多个应用重复打包同一份大依赖。

### Rollup/Vite 示例

```js
export default {
  build: {
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
};
```

这表示 `vue` 不进入 bundle，运行时通过外部的 `Vue` 全局变量获取。

### 常见场景

- 组件库打包。
- SDK 打包。
- 微前端公共依赖共享。
- CDN 外链依赖。

### 注意事项

- external 后运行环境必须真的提供该依赖。
- 版本要保持兼容，否则可能出现运行时错误。
- 业务应用一般不应盲目 external，否则部署和缓存管理会更复杂。
:::

## 29、前端构建缓存如何设计
前端构建缓存用于复用依赖安装、编译结果和构建中间产物，减少本地开发和 CI 构建耗时。

::: details 详情
### 常见缓存类型

- 包管理器缓存：npm、pnpm、yarn 的下载缓存。
- `node_modules` 缓存：依赖安装结果。
- 构建工具缓存：Webpack、Babel、ESLint 等中间产物。
- Monorepo 任务缓存：按输入输出判断任务是否可复用。
- CI 缓存：在不同流水线任务之间复用缓存目录。

### CI 中常见做法

缓存 key 通常和 lockfile 绑定：

```txt
cache-key = pnpm-store-${hash(pnpm-lock.yaml)}
```

当依赖未变化时复用缓存，依赖变化后自动生成新缓存。

### 构建缓存要关注什么

- 输入文件变化。
- lockfile 变化。
- Node.js 版本变化。
- 构建配置变化。
- 环境变量变化。

如果这些输入变了，但缓存没有失效，就可能出现错误产物。

### 注意事项

- 不要为了快而缓存不稳定目录。
- 缓存命中率和缓存正确性要平衡。
- 出现诡异构建问题时，可以先清理缓存验证。
- CI 缓存要有过期策略，避免长期占用空间。
:::
