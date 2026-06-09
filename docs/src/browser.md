# 浏览器原理

这里用于整理浏览器原理相关面试题，后续按事件循环、渲染流程、重排重绘、合成层、浏览器缓存、存储、Worker、性能指标等方向追加。

## 1、浏览器事件循环是如何工作的
浏览器事件循环用于协调 JavaScript 执行、宏任务、微任务、渲染和用户交互。理解事件循环有助于分析异步代码执行顺序和页面卡顿问题。

::: details 详情
### 基本流程

浏览器主线程大致会循环执行：

```txt
执行一个宏任务
-> 清空所有微任务
-> 必要时执行渲染
-> 进入下一轮循环
```

### 常见宏任务

- `script` 整体代码。
- `setTimeout`。
- `setInterval`。
- DOM 事件回调。
- 网络请求回调。
- `postMessage`。

### 常见微任务

- `Promise.then/catch/finally`。
- `queueMicrotask`。
- `MutationObserver`。

### 执行顺序示例

```js
console.log("start");

setTimeout(() => {
  console.log("timeout");
});

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");
```

输出顺序：

```txt
start
end
promise
timeout
```

### 和渲染的关系

浏览器通常会在一轮宏任务和微任务执行完后，根据需要进行样式计算、布局、绘制和合成。

如果微任务一直追加新的微任务，可能会阻塞渲染，导致页面无响应。

### 面试要点

- 微任务会在当前宏任务结束后立即清空。
- 渲染不是每个宏任务后都一定发生，要看浏览器调度。
- 长任务会阻塞用户交互和页面渲染。
- 动画相关逻辑通常优先考虑 `requestAnimationFrame`。
:::

## 2、浏览器从输入 URL 到页面渲染经历了什么
从输入 URL 到页面展示，浏览器通常会经历 URL 解析、缓存判断、DNS 查询、建立连接、发送请求、接收响应、解析资源和渲染页面等阶段。

::: details 详情
### 网络阶段

主要流程包括：

```txt
URL 解析
-> 浏览器缓存判断
-> DNS 解析
-> TCP/TLS 连接
-> 发送 HTTP 请求
-> 接收 HTTP 响应
```

如果命中强缓存，可能不会真正发起网络请求。

### HTML 解析

浏览器接收到 HTML 后，会解析生成 DOM 树。

遇到 CSS 会下载并解析为 CSSOM；遇到普通同步脚本时，可能会阻塞 HTML 解析。

### 渲染流程

渲染大致包括：

```txt
DOM + CSSOM
-> Render Tree
-> Layout
-> Paint
-> Composite
```

- DOM：页面结构。
- CSSOM：样式规则。
- Render Tree：可见节点和样式。
- Layout：计算位置和尺寸。
- Paint：绘制文本、颜色、边框等。
- Composite：合成图层并显示到屏幕。

### 资源加载

页面还会加载：

- CSS。
- JavaScript。
- 图片。
- 字体。
- 视频。
- iframe。

这些资源可能影响首屏时间和渲染稳定性。

### 优化方向

- 减少关键资源体积。
- 使用缓存。
- 减少阻塞渲染的脚本。
- CSS 放头部，非关键 JS 延迟加载。
- 图片懒加载和合理尺寸。
- 使用 HTTP/2、HTTP/3 提升传输效率。

### 面试要点

- 不要只背流程，要能解释每一步对性能的影响。
- DNS、连接、缓存属于网络层。
- DOM/CSSOM/Layout/Paint/Composite 属于渲染层。
- 性能优化要围绕关键渲染路径展开。
:::

## 3、重排和重绘有什么区别
重排也叫回流，指浏览器重新计算元素的几何位置和尺寸；重绘是指元素几何信息不变，只重新绘制颜色、背景、阴影等视觉样式。

::: details 详情
### 什么会触发重排

会影响布局的操作可能触发重排，例如：

- 修改元素宽高。
- 修改 margin、padding。
- 修改 display。
- 添加或删除 DOM。
- 改变字体大小。
- 读取某些布局属性前有未完成的样式变更。

常见布局属性包括：

```txt
offsetWidth
offsetHeight
clientWidth
getBoundingClientRect()
```

### 什么会触发重绘

只影响视觉但不影响布局的操作通常触发重绘，例如：

- 修改 color。
- 修改 background。
- 修改 visibility。
- 修改 box-shadow。

### 二者关系

重排通常会带来重绘，因为布局变了，页面需要重新绘制。

但重绘不一定会触发重排。

### 如何减少重排重绘

- 批量修改 DOM 和样式。
- 避免频繁读取和写入布局属性交替进行。
- 使用 class 统一切换样式。
- 动画优先使用 `transform` 和 `opacity`。
- 对复杂动画使用合成层优化。

### 示例

不推荐：

```js
for (const item of list) {
  item.style.width = `${item.offsetWidth + 10}px`;
}
```

读取和写入交替，容易触发多次布局计算。

### 面试要点

- 重排影响布局，成本通常比重绘更高。
- 读写布局属性交替是常见性能坑。
- `transform` 和 `opacity` 通常可以走合成层。
- 优化时要结合 Performance 面板观察。
:::

## 4、浏览器强缓存和协商缓存有什么区别
浏览器缓存可以减少网络请求、降低服务器压力、提升页面加载速度。常见缓存机制包括强缓存和协商缓存。

::: details 详情
### 强缓存

强缓存命中时，浏览器不会向服务器发送请求，直接使用本地缓存。

常见响应头：

```http
Cache-Control: max-age=3600
```

表示资源在 3600 秒内可以直接使用缓存。

也可以使用：

```http
Expires: Tue, 01 Jan 2030 00:00:00 GMT
```

但 `Expires` 依赖客户端时间，现代项目更常用 `Cache-Control`。

### 协商缓存

协商缓存会向服务器发送请求，让服务器判断资源是否变化。

常见字段：

- `ETag` 和 `If-None-Match`。
- `Last-Modified` 和 `If-Modified-Since`。

如果资源没有变化，服务器返回：

```http
304 Not Modified
```

浏览器继续使用本地缓存。

### 区别

- 强缓存不发请求。
- 协商缓存会发请求，但可能不返回完整资源。
- 强缓存速度更快。
- 协商缓存能确认资源是否更新。

### 静态资源策略

带 hash 的静态资源适合设置较长强缓存：

```txt
app.abc123.js
```

HTML 通常不建议长期强缓存，否则用户可能拿不到最新入口文件。

### 面试要点

- 先判断强缓存，再判断协商缓存。
- `Cache-Control` 优先级通常高于 `Expires`。
- `ETag` 通常比 `Last-Modified` 更精确。
- 前端构建产物常用文件 hash 配合长缓存。
:::

## 5、Web Worker 有什么作用
Web Worker 允许浏览器在主线程之外运行 JavaScript，适合处理耗时计算，避免阻塞页面渲染和用户交互。

::: details 详情
### 为什么需要 Worker

浏览器主线程负责：

- 执行 JavaScript。
- 处理用户交互。
- 样式计算。
- 布局和绘制。

如果主线程执行大量计算，页面会卡顿甚至无响应。

### 基本用法

主线程：

```js
const worker = new Worker("/worker.js");

worker.postMessage({ count: 100000 });

worker.onmessage = event => {
  console.log(event.data);
};
```

Worker 线程：

```js
self.onmessage = event => {
  const { count } = event.data;
  let total = 0;

  for (let i = 0; i < count; i++) {
    total += i;
  }

  self.postMessage(total);
};
```

### 适合场景

- 大量计算。
- 数据解析。
- 图片处理。
- 加密解密。
- 复杂排序或搜索。

### 限制

Worker 中不能直接访问：

- DOM。
- `window`。
- 部分浏览器主线程 API。

它和主线程通过 `postMessage` 通信。

### 注意事项

- 数据传输有成本，大对象可以考虑 Transferable。
- Worker 不是越多越好，过多线程也会增加调度成本。
- UI 更新仍然要回到主线程。
- 构建工具中使用 Worker 要注意文件路径和打包方式。
:::

## 6、Service Worker 有什么作用
Service Worker 是运行在浏览器后台的脚本，可以拦截网络请求、管理缓存、实现离线访问和消息推送，是 PWA 的核心能力之一。

::: details 详情
### 基本特点

Service Worker 和普通 Web Worker 不同，它可以：

- 拦截 fetch 请求。
- 控制缓存策略。
- 支持离线访问。
- 接收推送消息。
- 在页面关闭后仍由浏览器调度运行。

但它不能直接访问 DOM。

### 注册示例

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

Service Worker 通常要求 HTTPS 环境，本地 `localhost` 例外。

### 生命周期

主要阶段：

- register：注册。
- install：安装。
- activate：激活。
- fetch：拦截请求。

安装阶段常用于预缓存静态资源，激活阶段常用于清理旧缓存。

### 缓存策略

常见策略：

- Cache First：优先读缓存。
- Network First：优先请求网络。
- Stale While Revalidate：先返回缓存，再后台更新。
- Network Only：只走网络。
- Cache Only：只走缓存。

### 注意事项

- Service Worker 更新有生命周期延迟，不是刷新页面就一定立即生效。
- 缓存策略错误可能导致用户长期拿到旧资源。
- 要设计版本号和缓存清理策略。
- 离线能力要明确哪些页面和接口可用。
:::

## 7、Core Web Vitals 包含哪些指标
Core Web Vitals 是 Google 提出的核心 Web 性能指标，用于衡量用户真实体验。常见指标包括 LCP、INP 和 CLS。

::: details 详情
### LCP

LCP 是 Largest Contentful Paint，表示最大内容元素渲染完成的时间。

它主要衡量页面加载速度。

常见优化方向：

- 优化首屏图片。
- 减少阻塞渲染资源。
- 提升服务器响应速度。
- 关键资源预加载。

### INP

INP 是 Interaction to Next Paint，表示用户交互到下一次页面响应绘制的延迟。

它主要衡量交互响应速度。

常见优化方向：

- 减少长任务。
- 拆分耗时 JavaScript。
- 使用 Web Worker。
- 降低主线程压力。

### CLS

CLS 是 Cumulative Layout Shift，表示页面生命周期内意外布局偏移的累计分数。

它主要衡量视觉稳定性。

常见优化方向：

- 图片和视频提前设置宽高。
- 广告位预留空间。
- 避免动态插入内容挤压已有内容。
- 字体加载策略合理。

### 为什么重要

这些指标更接近真实用户体验，而不只是实验室环境下的加载时间。

### 面试要点

- LCP 看加载。
- INP 看交互。
- CLS 看稳定性。
- 优化要结合真实用户监控和 Performance 面板。
:::

## 8、浏览器同源策略是什么
同源策略是浏览器的安全机制，用于限制不同源之间的资源访问，防止恶意站点读取其他站点的敏感数据。

::: details 详情
### 什么是同源

两个 URL 同源需要同时满足：

- 协议相同。
- 域名相同。
- 端口相同。

例如：

```txt
https://example.com:443
```

协议、域名、端口任意一个不同，都属于不同源。

### 限制什么

同源策略主要限制：

- Ajax 读取跨源响应。
- DOM 访问。
- Cookie、localStorage 等存储访问。

注意，某些资源可以跨源加载，例如：

- 图片。
- CSS。
- script。
- iframe。

但能加载不代表能读取其中内容。

### CORS

CORS 是跨源资源共享，用于让服务器声明允许哪些来源访问资源。

常见响应头：

```http
Access-Control-Allow-Origin: https://example.com
```

浏览器看到允许后，才会把响应交给前端 JavaScript。

### 预检请求

某些复杂跨域请求会先发送 OPTIONS 预检请求，确认服务器是否允许真实请求。

### 面试要点

- 同源策略是浏览器限制，不是服务器限制。
- 跨域请求可能已经到达服务器，但浏览器不把响应交给 JS。
- CORS 需要服务器配合配置响应头。
- JSONP 可以跨域是因为 script 标签不受同样限制，但只支持 GET 且有安全风险。
:::

## 9、浏览器常见存储方式有哪些
浏览器常见存储方式包括 Cookie、localStorage、sessionStorage 和 IndexedDB。它们适合不同的数据规模、生命周期和访问场景。

::: details 详情
### Cookie

Cookie 通常用于存储会话标识。

特点：

- 会随同源请求自动发送到服务器。
- 容量较小。
- 可以设置过期时间。
- 支持 `HttpOnly`、`Secure`、`SameSite` 等属性。

不适合存储大量业务数据。

### localStorage

localStorage 是持久化本地存储：

```js
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");
```

特点：

- 生命周期较长。
- 不会自动随请求发送。
- 只能存字符串。
- 同源页面共享。

### sessionStorage

sessionStorage 只在当前标签页会话中有效。

关闭标签页后数据会被清除，不同标签页之间通常不共享。

### IndexedDB

IndexedDB 是浏览器中的结构化存储，适合大量数据和离线应用。

特点：

- 容量更大。
- 支持索引。
- 异步 API。
- 可以存储对象、文件等复杂数据。

### 选择建议

- 登录会话：Cookie。
- 简单偏好配置：localStorage。
- 临时表单状态：sessionStorage。
- 大量离线数据：IndexedDB。

### 注意事项

- localStorage 可被 JS 读取，存在 XSS 风险。
- Cookie 要合理设置 `HttpOnly`、`Secure`、`SameSite`。
- 不要把敏感信息明文存储在前端。
- 存储容量和行为在不同浏览器中可能有差异。
:::
