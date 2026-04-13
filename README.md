# 前端面试宝典「[访问地址](http://yangyunqiao.top/)」

## 介绍
本项目使用 VitePress 构建前端面试题题库，覆盖 HTML、CSS、JavaScript、Vue、React、TypeScript、Node、HTTP、工程化等核心知识点，并持续更新。

## 本地开发
推荐使用 `pnpm` 和 Node.js 20。

```bash
pnpm install
pnpm docs:dev
```

## 构建
```bash
pnpm docs:build
```

## 部署
默认按根路径部署：

```bash
pnpm docs:build
```

如果部署到 GitHub Pages 仓库子路径，可在构建时指定 `base`：

```bash
VITEPRESS_BASE=/Interview-Question-Bank/ pnpm docs:build
```

## 项目结构
```plaintext
.git/
.gitignore
.husky/
README.md
commitlint.config.js
package.json
pnpm-lock.yaml
docs/
|-- .vitepress/
|   |-- config.mts
|   `-- theme/
|-- src/
|   |-- index.md
|   |-- html.md
|   |-- css.md
|   |-- js.md
|   |-- ts.md
|   |-- vue2.md
|   |-- vue3.md
|   |-- react.md
|   |-- node.md
|   |-- http.md
|   |-- fe-engineering.md
|   |-- scenario-based.md
|   `-- code.md
`-- utils/
```
