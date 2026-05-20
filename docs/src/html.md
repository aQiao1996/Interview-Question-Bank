---
lang: zh-CN
title: html
description: html面试题
---

# html

## 1、什么是 DOCTYPE， 有何作用
**DOCTYPE** 是 HTML5 的文档声明，通过它可以告诉浏览器，使用哪一个 HTML 版本标准解析文档。在浏览器发展的过程中，HTML 出现过很多版本，不同的版本之间格式书写上略有差异。如果没有事先告诉浏览器，那么浏览器就不知道文档解析标准是什么？此时，大部分浏览器将开启最大兼容模式来解析网页，我们一般称为 **怪异模式**，这不仅会降低解析效率，而且会在解析过程中产生一些难以预知的 bug，所以文档声明是必须的。

## 2、说说对 HTML 语义化的理解
HTML 标签的语义化，简单来说，就是用正确的标签做正确的事情，给某块内容用上一个最恰当最合适的标签，使页面有良好的结构，页面元素有含义，无论是谁都能看懂这块内容是什么。

语义化的优点如下：
::: details 详情
- 在没有 CSS 样式情况下也能够让页面呈现出清晰的结构
- 有利于 SEO 和搜索引擎建立良好的沟通，有助于爬虫抓取更多的有效信息，爬虫是依赖于标签来确定上下文和各个关键字的权重
- 方便团队开发和维护，语义化更具可读性，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化
:::

## 3、meta 标签是干什么的，都有什么属性和作用
HTML 中的 `<meta>` 标签用于提供页面的元信息，这些信息不会直接显示在网页内容中，但对浏览器、搜索引擎和其他服务非常重要。
::: details 详情
常见的 meta 信息如下：
- 字符编码：
  > 指定网页的字符编码，确保正确显示内容
```html
<meta charset="utf-8">
```
- 页面视口设置（响应式设计）：
  > 控制页面在移动设备上的显示和缩放行为。
```html
<!-- width=device-width：页面宽度匹配设备屏幕宽度 -->
<!--initial-scale=1.0：初始缩放比例为 1  -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
- 搜索引擎优化（SEO）：
  > 提供描述性信息，便于搜索引擎索引。
```html
<meta
  name="keywords"
  content="前端, 面试, 前端面试, 面试题, 刷题, js, ts, React, Vue, webpack, vite, HTTP"
/>
<meta name="description" content="前端面试宝典，胖虎的前端面试题" />
<meta name="robots" content="index, follow" />
```
- 作者信息：
  > 提供网页作者信息。
```html
<meta name="author" content="胖虎" />
```
- 防止页面缓存：
  > 防止用户在浏览器中缓存页面，每次访问页面时都会重新加载。
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```
- 刷新与跳转：
  > 设置页面自动刷新或跳转到指定 URL。
```html
<!-- 每隔 5 秒刷新页面 -->
<meta http-equiv="refresh" content="5" />
<!-- 5 秒后跳转到指定页面 -->
<meta http-equiv="refresh" content="5;url=https://example.com" />
```
- 网页兼容模式：
  > 指定网页在 IE 浏览器中的渲染模式。
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```
- 安全性相关：
  > 提高网页的安全性，防止跨站脚本攻击（XSS）。
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```
:::

## 4、什么是 DOM ，它和 HTML 有什么区别
DOM 即 Document Object Model 文档对象模型，它是一个 JS 对象。而 HTML 是一种标记语言（和 XML 类似）用于定义网页的内容和结构。
::: details 详情
DOM 的特点：

- 树形结构，DOM 树
- 可编程，可以使用 Javascript 读取和修改 DOM 数据
- 动态性，通过 DOM API 动态修改结构和数据

HTML 到 DOM 的过程：

- HTML 解析：浏览器解析 HTML 代码，生成 DOM 树。
- CSSOM 生成：解析 CSS，生成 CSSOM（CSS 对象模型）。
- 渲染树：结合 DOM 和 CSSOM，生成渲染树。
- 页面渲染：根据渲染树将内容显示在页面上。
:::

## 5、如何一次性插入多个 DOM 节点？考虑性能
直接多次操作 DOM（如多次 `appendChild` 或 `innerHTML` 更新）会导致性能问题，因为每次操作都会触发 DOM 的重新渲染。

`DocumentFragment` 是一个轻量级的文档片段，可以在内存中操作节点，最后一次性插入到 DOM 中，从而减少重绘和回流。
::: details 详情
```js
// 获取目标容器
const container = document.getElementById('list')

// 创建 DocumentFragment
const fragment = document.createDocumentFragment()

// 创建多个节点并添加到 fragment 中
for (let i = 1; i <= 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `item ${i}`
  fragment.appendChild(li)
}

// 一次性插入到 DOM
container.appendChild(fragment)
```
:::

## 6、offsetHeight scrollHeight clientHeight 有什么区别
::: details 详情
- `offsetHeight`：元素的总高度，包括内容高度、内边距（padding）、水平滚动条高度（如果存在）、以及边框（border）。不包括外边距（margin）。
- `scrollHeight`：元素的实际内容高度，包括不可见的溢出部分（scrollable content），大于等于 clientHeight。
- `clientHeight`：元素的可见内容高度，包括内容高度和内边距（padding），但不包括水平滚动条高度、边框（border）和外边距（margin）。
:::

## 7、HTMLCollection 和 NodeList 的区别
在操作 DOM 时，`HTMLCollection` 和 `NodeList` 都是用来表示节点集合的对象，它们的区别是：
::: details 详情
`HTMLCollection` 只包含 **HTML 元素节点**。通过 `document.getElementsByTagName` 或 `document.getElementsByClassName` 返回的结果是 `HTMLCollection`。

`NodeList` 包括 **元素节点、文本节点、注释节点** 等，不仅仅是 **HTML 元素节点**
- 通过 `document.querySelectorAll` 返回的是 静态 `NodeList`
- 通过 `childNodes` 返回的是 动态 `NodeList`

当文档结构发生变化时

- `HTMLCollection` 和 动态 `NodeList` 会随着 DOM 的变化自动更新
- 静态 `NodeList` 不会随着 DOM 的变化自动更新
:::

## 8、Node 和 Element 有什么区别
在 DOM（文档对象模型）中，`HTML Element` 和 `Node` 都是表示文档结构中的对象，但它们有不同的定义和用途：
::: details 详情
- `Node` 是 DOM 树中所有类型对象的基类，是一个接口，表示文档树中的一个节点。它有多个子类型，Element 是其中的一个。其他的还有 Text、Comment 等。
  > Node 常见属性如 `nodeName` `nodeValue`
- `HTML Element` 是 Node 的子类，专门表示 HTML 元素节点。它提供了与 HTML 元素相关的更多功能，如属性、样式等。HTML Element 仅表示 HTML 元素节点，通常对应 HTML 标签，如 `<div>`, `<p>`, `<a>` 等。
  > Element 常见属性和方法如 `innerHTML` `getAttribute` `setAttribute`
:::

## 9、window.onload 和 DOMContentLoaded 的区别是什么
这两个事件都用于检测页面的加载状态，但触发的时机和作用范围有所不同：
::: details 详情
- `DOMContentLoaded` 是当 **DOM 树构建完成**（HTML 被解析完成，不等待样式表、图片、iframe 等资源加载）时触发，不依赖于外部资源。
- `window.onload` 是当 **整个页面及所有资源**（包括样式表、图片、iframe、脚本等）加载完成时触发，依赖于外部资源。

`DOMContentLoaded` 会更早触发。

使用推荐
- 如果你的逻辑只依赖 DOM 的加载（如操作页面结构、绑定事件），使用 `DOMContentLoaded`。
- 如果你的逻辑需要依赖页面所有资源加载完成（如获取图片尺寸、执行动画），使用 `window.onload`。
:::

## 10、script 标签放在 head 里，怎么解决加载阻塞的问题
在 HTML 中，`<script> `标签通常会阻塞页面的渲染，尤其是当它放在 `<head>` 部分时，因为浏览器会在执行 js 代码之前停止解析 HTML。

可参考的解决方案：
::: details 详情
- 使用 `async` 属性。当 `async` 属性添加到 `<script>` 标签时，脚本会异步加载，并在加载完成后立即执行，不会阻塞页面的渲染。适用于不依赖其他脚本或页面内容的独立脚本，但多个 js 文件时无法保证加载和执行顺序。
```html
<head>
  <script src="script.js" async></script>
</head>
```
- 使用 `defer` 属性。`defer` 属性使得脚本延迟执行，直到 HTML 文档解析完毕。这意味着脚本不会阻塞 HTML 渲染，且会按照文档中 `<script>` 标签的顺序执行。适用于依赖 DOM 元素的脚本（如操作页面内容）。
```html
<head>
  <script src="script.js" defer></script>
</head>
```
- 将 `<script>` 放在 `<body>` 最后。
:::

## 11、什么是回流重绘，如何减少回流重绘
- 回流（Reflow）：元素的位置发生变动时发生重排，也叫重排。此时在关键渲染路径中的 `Layout` 阶段，计算每一个元素在设备视口内的确切位置和大小。当一个元素位置发生变化时，其父元素及其后边的元素位置都可能发生变化，代价极高。
- 重绘（Repaint）：元素的样式发生变动，但是位置没有改变。此时在关键渲染路径中的 `Paint` 阶段，将渲染树中的每个节点转换成屏幕上的实际像素，这一步通常称为绘制或栅格化。
::: details 详情
另外，重排必定会造成重绘。以下是避免过多重拍重绘的方法：
- 使用 DocumentFragment 进行 DOM 操作，不过现在原生操作很少也基本上用不到。
- CSS 样式尽量批量修改。
- 使用 CSS 动画代替 js 动画。
- 避免使用 table 布局。
- 为元素提前设置好高宽，不因多次渲染改变位置。
:::

## 12、script 标签中 async 和 defer 有什么区别
`async` 和 `defer` 都可以让外部脚本异步下载，减少脚本加载对 HTML 解析的阻塞，但它们的执行时机和执行顺序不同。

::: details 详情
### async

- 脚本会异步下载。
- 下载完成后会立即执行。
- 执行时可能会暂停 HTML 解析。
- 多个 async 脚本之间不能保证执行顺序。
- 适合统计脚本、广告脚本等不依赖 DOM 和其他脚本的场景。

```html
<script src="analytics.js" async></script>
```

### defer

- 脚本会异步下载。
- 等 HTML 文档解析完成后再执行。
- 多个 defer 脚本会按照它们在文档中出现的顺序执行。
- 会在 `DOMContentLoaded` 事件触发前执行。
- 适合依赖 DOM 或依赖执行顺序的业务脚本。

```html
<script src="main.js" defer></script>
```

### 对比总结

| 特性 | async | defer |
| --- | --- | --- |
| 是否异步下载 | 是 | 是 |
| 是否保证执行顺序 | 否 | 是 |
| 执行时机 | 下载完成后立即执行 | HTML 解析完成后执行 |
| 是否可能阻塞 HTML 解析 | 可能 | 不会 |
| 适合场景 | 独立脚本 | 业务脚本 |

如果脚本依赖 DOM 或依赖其他脚本的执行顺序，优先使用 `defer`；如果脚本完全独立，可以使用 `async`。
:::

## 13、iframe 有哪些优缺点，如何实现页面通信
`iframe` 可以在当前页面中嵌入另一个 HTML 页面，常用于第三方页面接入、低成本系统集成、沙箱隔离等场景。

::: details 详情
### 优点

- 可以嵌入独立页面，接入成本低。
- 子页面和父页面的运行环境相对隔离，样式和脚本不容易互相影响。
- 适合接入第三方系统、广告、地图、支付页、低代码页面等。
- 可以通过 `sandbox` 属性限制子页面能力，提高安全性。

### 缺点

- 会额外加载一个完整页面，性能开销较大。
- SEO 不友好，搜索引擎通常不会把 iframe 内容当作当前页面主体内容。
- 父子页面之间通信比普通组件通信复杂。
- 高度自适应、路由同步、登录态共享等问题需要额外处理。
- 如果嵌入不可信页面，可能带来安全风险。

### 使用 postMessage 通信

父页面向 iframe 发送消息：

```html
<iframe id="child" src="https://example.com/child.html"></iframe>

<script>
const iframe = document.getElementById("child");

iframe.onload = () => {
  iframe.contentWindow.postMessage(
    {
      type: "SET_THEME",
      value: "dark",
    },
    "https://example.com"
  );
};
</script>
```

子页面接收消息：

```js
window.addEventListener("message", event => {
  if (event.origin !== "https://parent.example.com") {
    return;
  }

  if (event.data.type === "SET_THEME") {
    console.log(event.data.value);
  }
});
```

### 安全注意事项

- `postMessage` 的第二个参数不要随意写 `"*"`，应指定明确的目标域名。
- 接收消息时必须校验 `event.origin`。
- 嵌入不可信页面时应使用 `sandbox` 限制脚本、表单、弹窗等能力。
- 如果不希望页面被别人 iframe 嵌入，可以设置 `X-Frame-Options` 或 CSP 的 `frame-ancestors`。
:::

## 14、src 和 href 有什么区别
`src` 和 `href` 都可以用来引入外部资源，但它们的语义和加载行为不同。

::: details 详情
### src

`src` 是 source 的缩写，表示将外部资源嵌入到当前标签所在的位置。浏览器解析到 `src` 时，通常会下载对应资源，并将资源内容作为当前标签的一部分。

常见标签：

```html
<img src="logo.png" alt="logo" />
<script src="main.js"></script>
<iframe src="page.html"></iframe>
```

特点：

- 表示资源替换或嵌入当前元素。
- 资源通常是当前标签正常工作必需的内容。
- 例如 `<script src="">` 默认会阻塞 HTML 解析，除非使用 `async` 或 `defer`。

### href

`href` 是 hyper reference 的缩写，表示当前文档和外部资源之间的引用关系。它不会把资源内容嵌入当前标签位置，而是建立链接或关联。

常见标签：

```html
<a href="https://example.com">跳转链接</a>
<link href="style.css" rel="stylesheet" />
```

特点：

- 表示当前文档和目标资源之间的关系。
- 常用于超链接、样式表、预加载等资源引用。
- 例如 `<link rel="stylesheet">` 会加载 CSS，并影响页面渲染。

### 总结

| 对比项 | src | href |
| --- | --- | --- |
| 含义 | 引入并嵌入资源 | 建立资源引用关系 |
| 常见标签 | img、script、iframe | a、link |
| 是否替换当前元素内容 | 通常会 | 通常不会 |
| 典型场景 | 图片、脚本、内嵌页面 | 链接、样式表、资源引用 |

简单理解：`src` 更偏向“把资源拿来用在当前位置”，`href` 更偏向“当前文档引用或链接到某个资源”。
:::

## 15、HTML5 中 data-* 自定义属性有什么作用
`data-*` 是 HTML5 提供的自定义数据属性，用于在 HTML 元素上存放额外的自定义数据。

::: details 详情
### 基本用法

```html
<button
  data-id="1001"
  data-role="admin"
  data-user-name="Tom"
>
  查看用户
</button>
```

在 JavaScript 中可以通过 `dataset` 访问：

```js
const button = document.querySelector("button");

console.log(button.dataset.id); // 1001
console.log(button.dataset.role); // admin
console.log(button.dataset.userName); // Tom
```

### 命名规则

- 属性名必须以 `data-` 开头。
- `data-user-name` 会转换成 `dataset.userName`。
- 属性值会以字符串形式读取。

### 应用场景

- 给 DOM 元素绑定业务标识，例如 id、类型、状态。
- 配合事件委托获取当前点击元素的数据。
- 给组件或第三方脚本提供初始化配置。
- 在不影响语义的情况下保存少量页面数据。

### 注意事项

- 不要存放敏感信息，因为 HTML 内容可以被用户查看。
- 不适合存放大量复杂数据，复杂数据应放在 JavaScript 状态或接口数据中。
- `data-*` 主要用于页面结构和脚本之间传递少量自定义信息。
:::

## 16、Web Worker 和 Service Worker 有什么区别
`Web Worker` 和 `Service Worker` 都可以在主线程之外运行 JavaScript，但它们的定位不同：Web Worker 主要用于处理耗时计算，Service Worker 主要用于网络代理、缓存和离线能力。

::: details 详情
### Web Worker

Web Worker 用于创建后台线程，把耗时任务从主线程中拆出去，避免阻塞页面渲染和用户交互。

适合场景：

- 大量计算。
- 大文件解析。
- 图片处理。
- 数据压缩、加密等耗时任务。

基本示例：

```js
// main.js
const worker = new Worker("./worker.js");

worker.postMessage({
  count: 100000,
});

worker.onmessage = event => {
  console.log(event.data);
};
```

```js
// worker.js
self.onmessage = event => {
  const { count } = event.data;
  let total = 0;

  for (let i = 0; i < count; i++) {
    total += i;
  }

  self.postMessage(total);
};
```

### Service Worker

Service Worker 是浏览器和网络之间的代理层，可以拦截请求、管理缓存、实现离线访问和消息推送。

适合场景：

- PWA 离线缓存。
- 静态资源缓存。
- 请求拦截和缓存策略控制。
- 推送通知。

### 核心区别

| 对比项 | Web Worker | Service Worker |
| --- | --- | --- |
| 主要作用 | 后台计算 | 请求代理、缓存、离线能力 |
| 生命周期 | 页面打开时创建，页面关闭后通常结束 | 独立于页面，有自己的生命周期 |
| 是否能访问 DOM | 不能 | 不能 |
| 是否能拦截请求 | 不能 | 可以 |
| 典型场景 | 复杂计算 | PWA、离线缓存 |

### 注意事项

- 二者都不能直接操作 DOM，需要通过消息和主线程通信。
- Service Worker 需要运行在 HTTPS 或 localhost 环境。
- Web Worker 更偏计算能力，Service Worker 更偏网络和缓存能力。
:::

## 17、preload 和 prefetch 有什么区别
`preload` 和 `prefetch` 都是资源加载优化手段，用于提示浏览器提前加载资源，但它们的优先级和使用场景不同。

::: details 详情
### preload

`preload` 表示当前页面很快就会用到这个资源，浏览器应该尽早加载。

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

适合场景：

- 当前页面首屏关键字体。
- 当前页面马上要用到的关键 CSS、图片、脚本。
- 希望提前加载但不希望阻塞 HTML 解析的关键资源。

### prefetch

`prefetch` 表示未来可能会用到这个资源，浏览器可以在空闲时低优先级加载。

```html
<link rel="prefetch" href="/static/about-page.js" />
```

适合场景：

- 用户可能跳转到的下一个页面资源。
- 路由懒加载 chunk。
- 非当前页面关键资源。

### 核心区别

| 对比项 | preload | prefetch |
| --- | --- | --- |
| 资源用途 | 当前页面即将使用 | 未来页面可能使用 |
| 加载优先级 | 高 | 低 |
| 触发时机 | 尽早加载 | 浏览器空闲时加载 |
| 常见场景 | 首屏关键资源 | 下一页资源预取 |

### 注意事项

- `preload` 需要设置正确的 `as` 属性，否则可能无法复用缓存。
- 不要滥用 `preload`，否则会抢占关键请求带宽。
- `prefetch` 只是提示，浏览器可能根据网络和设备状态决定是否加载。
:::

## 18、HTML 中如何提升可访问性
可访问性（Accessibility，常简称为 a11y）是指让更多用户，包括使用键盘、读屏器或存在视觉障碍的用户，也能顺利使用页面。

::: details 详情
### 使用语义化标签

优先使用语义化 HTML，而不是全部使用 `div`。

```html
<header>页面头部</header>
<nav>导航</nav>
<main>主要内容</main>
<footer>页脚</footer>
```

### 表单元素关联 label

```html
<label for="username">用户名</label>
<input id="username" name="username" type="text" />
```

这样用户点击 label 也能聚焦输入框，读屏器也能正确读出输入项含义。

### 图片提供 alt

```html
<img src="logo.png" alt="公司 Logo" />
```

如果图片只是装饰，可以使用空 `alt`：

```html
<img src="decorator.png" alt="" />
```

### 保证键盘可操作

- 交互元素优先使用 `button`、`a` 等原生标签。
- 不要移除焦点样式，或移除后提供清晰的自定义焦点样式。
- 弹窗、菜单等组件需要处理焦点管理。

### 合理使用 ARIA

ARIA 可以补充语义，但不应该滥用。优先使用原生语义，原生语义不够时再使用 ARIA。

```html
<button aria-expanded="false" aria-controls="menu">菜单</button>
```

### 总结

可访问性的核心是：语义清晰、键盘可用、焦点可见、文本替代完整、状态变化能被辅助技术感知。
:::

## 19、picture 和 source 标签有什么作用
`picture` 和 `source` 用于实现响应式图片，让浏览器根据屏幕尺寸、像素密度或图片格式支持情况选择最合适的图片资源。

::: details 详情
### 基本用法

```html
<picture>
  <source srcset="banner.avif" type="image/avif" />
  <source srcset="banner.webp" type="image/webp" />
  <img src="banner.jpg" alt="活动 Banner" />
</picture>
```

浏览器会按顺序检查 `source`，选择第一个支持的资源。如果都不支持，则使用 `img` 的 `src`。

### 根据屏幕宽度选择图片

```html
<picture>
  <source media="(max-width: 600px)" srcset="banner-mobile.jpg" />
  <source media="(max-width: 1200px)" srcset="banner-tablet.jpg" />
  <img src="banner-desktop.jpg" alt="活动 Banner" />
</picture>
```

### 常见应用场景

- 移动端和桌面端使用不同尺寸图片。
- 优先使用 AVIF、WebP 等新格式，兼容时回退到 JPG/PNG。
- 根据不同屏幕比例展示不同裁剪版本。
- 优化首屏图片加载性能。

### 注意事项

- `picture` 只是负责选择资源，真正展示图片的仍然是 `img`。
- `img` 标签必须保留，用作默认回退内容和无障碍描述。
- `alt` 应写在 `img` 上。
:::

## 20、script type="module" 有什么特点
`<script type="module">` 用于在浏览器中加载 ES Module 模块脚本，它支持 `import` 和 `export`，并且默认具备延迟执行等特性。

::: details 详情
### 基本用法

```html
<script type="module" src="./main.js"></script>
```

```js
// main.js
import { add } from "./utils.js";

console.log(add(1, 2));
```

### 主要特点

- 支持 ES Module 的 `import` 和 `export`。
- 默认是严格模式。
- 默认延迟执行，类似 `defer`，不会阻塞 HTML 解析。
- 模块只会执行一次，即使被多次导入。
- 顶层作用域不会污染全局作用域。
- 默认按 CORS 规则加载跨域模块。

### 和普通 script 的区别

| 对比项 | 普通 script | module script |
| --- | --- | --- |
| 模块语法 | 不支持 import/export | 支持 |
| 默认严格模式 | 否 | 是 |
| 执行时机 | 默认阻塞解析 | 默认 defer |
| 顶层作用域 | 可能污染全局 | 模块作用域 |
| 加载规则 | 普通脚本规则 | CORS 模块规则 |

### nomodule

可以配合 `nomodule` 给不支持模块脚本的旧浏览器提供降级脚本。

```html
<script type="module" src="modern.js"></script>
<script nomodule src="legacy.js"></script>
```

现代浏览器会加载 `modern.js`，旧浏览器会加载 `legacy.js`。
:::

## 21、HTML 表单中常见的增强属性有哪些
HTML5 给表单提供了很多增强属性，可以减少简单校验和交互逻辑的 JavaScript 代码。

::: details 详情
### 常见属性

- `placeholder`：输入框占位提示。
- `required`：提交前要求必填。
- `pattern`：使用正则表达式做格式校验。
- `min`、`max`：限制数字、日期等输入范围。
- `maxlength`、`minlength`：限制输入长度。
- `autocomplete`：控制是否启用自动填充。
- `autofocus`：页面加载后自动聚焦。
- `readonly`：只读，内容会随表单提交。
- `disabled`：禁用，内容不会随表单提交。

### 示例

```html
<form>
  <input
    type="email"
    name="email"
    placeholder="请输入邮箱"
    required
    autocomplete="email"
  />

  <input
    type="text"
    name="code"
    pattern="\\d{6}"
    maxlength="6"
    placeholder="6 位验证码"
  />

  <button type="submit">提交</button>
</form>
```

### readonly 和 disabled 的区别

| 对比项 | readonly | disabled |
| --- | --- | --- |
| 是否可编辑 | 否 | 否 |
| 是否可聚焦 | 通常可以 | 不可以 |
| 是否提交值 | 会提交 | 不会提交 |
| 常见场景 | 展示不可编辑字段 | 禁用不可用字段 |

### 注意事项

- 原生表单校验只能处理基础规则，复杂业务校验仍需要 JavaScript。
- 前端校验不能替代服务端校验。
- 表单控件应配合 `label` 使用，提升可访问性。
:::

## 22、img 标签的 loading="lazy" 有什么作用
`loading="lazy"` 是浏览器原生图片懒加载能力，用于延迟加载暂时不在视口附近的图片。

::: details 详情
### 基本用法

```html
<img src="banner.jpg" alt="活动图" loading="lazy" />
```

浏览器会根据图片和视口的距离决定何时开始加载资源，从而减少首屏无关图片请求。

### 常见取值

- `lazy`：延迟加载。
- `eager`：立即加载。
- `auto`：由浏览器自行决定，通常也是默认行为。

### 优点

- 减少首屏资源请求数量。
- 降低首屏带宽占用。
- 改善长页面中的图片加载性能。
- 不需要额外引入懒加载库。

### 注意事项

- 首屏关键图片不建议设置 `loading="lazy"`，否则可能影响 LCP。
- 图片最好设置明确的 `width` 和 `height`，避免加载后产生布局偏移。
- 懒加载触发距离由浏览器决定，不同浏览器策略可能不同。
- 对背景图无效，背景图懒加载需要其他方案。

### 示例

```html
<img
  src="article-cover.jpg"
  alt="文章封面"
  width="640"
  height="360"
  loading="lazy"
/>
```
:::
