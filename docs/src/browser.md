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

## 10、什么是合成层，为什么 transform 动画更流畅
合成层是浏览器渲染过程中可以独立合成的图层。某些属性变化可以只在合成阶段处理，避免重新布局和重绘，因此动画更流畅。

::: details 详情
### 渲染阶段

页面渲染大致包括：

```txt
样式计算 -> 布局 -> 绘制 -> 合成
```

如果动画会触发布局或绘制，主线程压力会变大。

### transform 和 opacity

`transform` 和 `opacity` 通常可以在合成阶段处理。

例如：

```css
.box {
  transform: translateX(100px);
  opacity: 0.5;
}
```

这类动画通常不需要重新计算布局，也不需要重新绘制所有内容。

### 可能创建合成层的情况

常见情况：

- 3D transform。
- video、canvas。
- fixed 元素。
- will-change。
- opacity 动画。

具体是否创建合成层由浏览器决定。

### will-change

可以提前提示浏览器：

```css
.box {
  will-change: transform;
}
```

但不能滥用，否则可能增加内存占用。

### 注意事项

- 合成层不是越多越好。
- 大量合成层会占用 GPU 内存。
- `left/top` 动画通常会触发布局。
- 性能优化要通过 DevTools Layers 和 Performance 面板验证。
:::

## 11、前端内存泄漏常见原因有哪些
内存泄漏是指不再需要的对象仍然被引用，导致垃圾回收无法释放内存。长期运行的页面如果存在内存泄漏，可能越来越卡甚至崩溃。

::: details 详情
### 常见原因

前端常见内存泄漏包括：

- 未清理定时器。
- 未移除事件监听。
- 闭包长期引用大对象。
- 全局变量持有无用数据。
- DOM 被移除但仍被 JS 引用。
- 长列表缓存无限增长。
- WebSocket 或订阅未关闭。

### 定时器未清理

```js
const timer = setInterval(() => {
  console.log("polling");
}, 1000);

// 页面销毁时
clearInterval(timer);
```

组件卸载时不清理，定时器会继续运行并引用组件状态。

### 事件监听未移除

```js
function onResize() {}

window.addEventListener("resize", onResize);

// 页面销毁时
window.removeEventListener("resize", onResize);
```

匿名函数监听更难移除，要谨慎使用。

### 如何排查

可以使用 Chrome DevTools：

- Performance 观察内存变化。
- Memory 拍摄 Heap Snapshot。
- Allocation instrumentation 分析对象分配。
- 比较多次快照，看哪些对象没有释放。

### 注意事项

- SPA 页面切换后尤其要关注清理。
- 第三方库实例要调用 destroy 或 dispose。
- 缓存要设置容量上限。
- 内存问题要通过快照和复现路径定位，不要凭感觉猜。
:::

## 12、哪些资源会阻塞页面渲染
页面渲染可能被 HTML 解析、CSS 加载、同步脚本执行和字体加载等因素影响。理解阻塞点有助于优化首屏速度。

::: details 详情
### CSS 阻塞渲染

浏览器需要 CSSOM 和 DOM 一起构建渲染树。

如果关键 CSS 没有加载完成，浏览器通常不会立即绘制页面，避免出现无样式内容闪烁。

因此首屏关键 CSS 应尽量小，非关键 CSS 可以延迟加载。

### JavaScript 阻塞解析

普通脚本会阻塞 HTML 解析：

```html
<script src="/app.js"></script>
```

浏览器遇到脚本时，需要先下载并执行脚本，因为脚本可能修改 DOM。

可以使用：

```html
<script src="/app.js" defer></script>
```

让脚本在 HTML 解析完成后执行。

### 字体阻塞

Web Font 可能导致文字不可见或字体切换。

可以通过 `font-display` 控制策略：

```css
@font-face {
  font-family: "Demo";
  src: url("/demo.woff2");
  font-display: swap;
}
```

### 优化方向

- 内联少量首屏关键 CSS。
- 脚本使用 `defer` 或按需加载。
- 图片设置宽高，减少布局偏移。
- 预加载关键资源。
- 减少首屏必须执行的 JavaScript。

### 注意事项

- 不是所有资源都会阻塞渲染，图片通常不会阻塞 HTML 解析。
- `async` 脚本下载不阻塞解析，但执行时仍会打断解析。
- 优化要结合 Performance 面板和真实网络环境判断。
:::

## 13、requestAnimationFrame 有什么作用
`requestAnimationFrame` 用于在浏览器下一次重绘前执行回调，适合做动画、滚动同步和需要跟随刷新率更新的 UI 操作。

::: details 详情
### 和 setTimeout 的区别

`setTimeout` 只按时间调度，不关心浏览器什么时候绘制。

`requestAnimationFrame` 会和浏览器刷新节奏对齐，通常在每一帧绘制前执行。

这意味着动画更新更平滑，也能减少不必要的绘制。

### 基本用法

```js
let x = 0;

function animate() {
  x += 2;
  box.style.transform = `translateX(${x}px)`;

  if (x < 300) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

### 适合场景

- JavaScript 动画。
- 滚动位置同步。
- Canvas 绘制。
- 拖拽过程中的 UI 更新。
- 分帧执行部分视觉任务。

### 页面隐藏时

页面在后台标签页时，浏览器通常会降低或暂停 `requestAnimationFrame` 的执行频率，从而节省资源。

### 注意事项

- 回调中不要执行耗时任务，否则仍然会掉帧。
- 动画优先使用 `transform` 和 `opacity`。
- 需要停止动画时，要保存 ID 并调用 `cancelAnimationFrame`。
- 如果动画依赖真实时间，要使用回调参数中的时间戳计算进度。
:::

## 14、Performance API 可以用来做什么
Performance API 提供浏览器性能数据采集能力，可以用来分析页面加载、资源耗时、长任务和自定义业务耗时，是前端性能监控的重要基础。

::: details 详情
### 常见能力

Performance API 可以获取：

- 页面导航耗时。
- 静态资源加载耗时。
- 用户自定义打点。
- 长任务信息。
- LCP、CLS、INP 等指标相关数据。

### 自定义打点

可以使用 `mark` 和 `measure` 统计业务耗时：

```js
performance.mark("search-start");

await fetchSearchResult();

performance.mark("search-end");
performance.measure("search", "search-start", "search-end");
```

读取结果：

```js
const measures = performance.getEntriesByName("search");
console.log(measures[0].duration);
```

### 资源耗时

可以读取资源加载信息：

```js
const resources = performance.getEntriesByType("resource");
```

常用于分析图片、脚本、样式、接口等资源耗时。

### PerformanceObserver

`PerformanceObserver` 可以监听性能条目：

```js
const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(entry);
  }
});

observer.observe({ entryTypes: ["longtask"] });
```

### 注意事项

- 跨域资源需要配置 `Timing-Allow-Origin` 才能获取完整耗时。
- 性能数据要采样上报，避免监控本身影响性能。
- 指标要结合设备、网络和页面类型分组分析。
- 单个用户数据可能有波动，要看分位数趋势。
:::

## 15、浏览器多标签页之间如何通信
浏览器多标签页通信常用于同步登录状态、主题设置、购物车变化和任务进度。常见方案包括 `storage` 事件、`BroadcastChannel`、SharedWorker 和 Service Worker。

::: details 详情
### storage 事件

同源页面修改 `localStorage` 时，其他标签页可以收到 `storage` 事件：

```js
window.addEventListener("storage", event => {
  if (event.key === "logout") {
    location.reload();
  }
});
```

注意触发修改的当前标签页通常不会收到自己的 `storage` 事件。

### BroadcastChannel

`BroadcastChannel` 更适合同源页面之间发送消息：

```js
const channel = new BroadcastChannel("app");

channel.postMessage({
  type: "theme-change",
  value: "dark",
});

channel.onmessage = event => {
  console.log(event.data);
};
```

它的语义比 `localStorage` 更直接。

### 其他方式

还可以使用：

- SharedWorker：多个页面共享同一个 Worker。
- Service Worker：作为页面和网络之间的中间层。
- IndexedDB 轮询：兼容性兜底，但实时性较差。
- WebSocket：服务端参与广播。

### 注意事项

- 多标签页通信通常要求同源。
- 消息内容不要包含敏感信息。
- 标签页关闭时要清理监听和连接。
- 登录态同步要考虑接口鉴权结果，而不是只依赖本地消息。
:::

## 16、浏览器渲染流水线包含哪些步骤
浏览器渲染流水线通常包括解析 HTML、构建 DOM、解析 CSS、构建 CSSOM、生成渲染树、布局、绘制和合成。理解这些步骤有助于分析性能问题。

::: details 详情
### 主要步骤

常见流程：

- 解析 HTML，构建 DOM。
- 解析 CSS，构建 CSSOM。
- DOM 和 CSSOM 生成渲染树。
- Layout 计算元素位置和尺寸。
- Paint 绘制文本、颜色、边框、阴影等。
- Composite 合成图层并显示到屏幕。

不同浏览器内部实现会有差异，但大体思路类似。

### Layout

Layout 也叫布局或重排。

当元素几何信息变化时，例如宽高、位置、字体大小变化，浏览器需要重新计算布局。

布局成本通常和影响范围有关。

### Paint

Paint 是把元素视觉样式绘制出来。

例如颜色、背景、阴影变化可能触发重绘，但不一定触发布局。

### Composite

合成阶段会把不同图层组合起来。

`transform`、`opacity` 动画通常可以更多在合成阶段完成，因此更流畅。

### 注意事项

- 频繁读写布局属性可能导致强制同步布局。
- 动画优先使用 `transform` 和 `opacity`。
- 大量 DOM 和复杂 CSS 都会增加渲染成本。
- 性能优化要结合 DevTools Performance 面板观察证据。
:::

## 17、DOMContentLoaded 和 load 有什么区别
`DOMContentLoaded` 在 HTML 被解析完成且 DOM 构建完成后触发；`load` 要等页面中的图片、样式、脚本、iframe 等资源都加载完成后才触发。

::: details 详情
### DOMContentLoaded

`DOMContentLoaded` 表示 DOM 已经可以安全访问。

示例：

```js
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");
});
```

它不需要等待所有图片加载完成。

### load

`load` 表示页面和依赖资源都加载完成：

```js
window.addEventListener("load", () => {
  console.log("all resources loaded");
});
```

如果页面图片很多，`load` 可能比 `DOMContentLoaded` 晚很多。

### 和脚本的关系

普通同步脚本会阻塞 HTML 解析。

`defer` 脚本会在 DOM 解析完成后、`DOMContentLoaded` 前执行。

`async` 脚本下载不阻塞解析，但执行时机不固定。

### 适合场景

- 只需要操作 DOM：使用 `DOMContentLoaded`。
- 需要图片尺寸或所有资源完成：使用 `load`。
- 现代框架通常由框架挂载流程处理，不一定手动监听。

### 注意事项

- 不要把首屏关键逻辑都等到 `load` 后执行。
- 图片懒加载可能让 `load` 含义和用户体验不完全对应。
- 性能分析时要区分 DOM 解析完成和资源完全加载完成。
:::

## 18、storage 事件有什么作用
`storage` 事件用于监听同源页面中 `localStorage` 或 `sessionStorage` 的变化，常用于多个标签页之间同步登录态、主题或简单状态。

::: details 详情
### 基本用法

```js
window.addEventListener("storage", event => {
  console.log(event.key);
  console.log(event.oldValue);
  console.log(event.newValue);
});
```

当其他同源页面修改存储时，当前页面可以收到事件。

### 常见场景

- 多标签页同步退出登录。
- 同步主题切换。
- 通知其他页面刷新用户信息。
- 简单跨标签页广播。

例如退出登录：

```js
localStorage.setItem("logout", String(Date.now()));
```

其他标签页监听到后执行退出逻辑。

### 重要限制

触发修改的当前页面通常不会收到自己的 `storage` 事件。

也就是说，A 页面修改 localStorage，B 页面能收到，A 页面自己不会通过 storage 事件收到。

### 和 BroadcastChannel 对比

`BroadcastChannel` 更适合消息通信，语义清晰。

`storage` 兼容性较好，但本质是借助存储变化传递消息。

### 注意事项

- 不要在 localStorage 中存敏感信息。
- 事件只在同源页面之间触发。
- 复杂通信优先考虑 `BroadcastChannel`。
- 同步登录态时仍要以后端鉴权结果为准。
:::

## 19、浏览器页面生命周期有哪些常见事件
浏览器页面生命周期事件用于感知页面加载、可见性变化、进入后台、恢复和卸载等状态。合理使用这些事件可以优化性能、保存状态和暂停无意义任务。

::: details 详情
### 常见事件

常见事件包括：

- `DOMContentLoaded`：DOM 构建完成。
- `load`：页面资源加载完成。
- `visibilitychange`：页面可见性变化。
- `pagehide`：页面即将进入隐藏或被卸载。
- `pageshow`：页面展示或从 bfcache 恢复。
- `beforeunload`：页面即将离开。

### visibilitychange

页面进入后台时，可以暂停非必要任务：

```js
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pausePolling();
  } else {
    resumePolling();
  }
});
```

适合暂停轮询、动画、视频播放等。

### pagehide 和 pageshow

`pagehide` 和 `pageshow` 对 bfcache 更友好。

当页面从浏览器前进后退缓存恢复时，`pageshow` 会触发，并且 `event.persisted` 可以判断是否来自缓存。

### 注意事项

- 不要滥用 `beforeunload`，它可能影响 bfcache。
- 页面隐藏时应减少轮询和计算。
- 恢复页面时要检查数据是否过期。
- 移动端浏览器可能随时冻结或回收后台页面。
:::

## 20、bfcache 是什么
bfcache 是 back-forward cache，浏览器在用户前进或后退时可能把整个页面状态保存在内存中，从而快速恢复页面，减少重新加载和重新执行脚本。

::: details 详情
### 基本效果

用户从 A 页面跳到 B 页面后，再点击返回。

如果 A 页面命中 bfcache，浏览器可以直接恢复之前的 DOM、滚动位置和 JavaScript 状态，而不是重新请求和渲染页面。

### 如何判断

可以监听 `pageshow`：

```js
window.addEventListener("pageshow", event => {
  if (event.persisted) {
    console.log("from bfcache");
  }
});
```

`event.persisted` 为 true 表示页面从 bfcache 恢复。

### 影响命中的因素

可能影响 bfcache 的因素：

- 使用 `unload` 事件。
- 某些未关闭的连接或锁。
- 页面使用不兼容的浏览器 API。
- 响应头策略限制。
- 浏览器内存压力。

不同浏览器规则可能不同。

### 注意事项

- 尽量使用 `pagehide` 替代 `unload`。
- 页面恢复时要检查数据是否过期。
- 定时器、轮询、播放器等要在隐藏和恢复时正确处理。
- bfcache 优化要用真实浏览器验证。
:::

## 21、浏览器长任务是什么，如何优化
长任务是指主线程上执行时间较长的任务，通常会阻塞用户输入、渲染和脚本执行。浏览器中常把超过 50ms 的主线程任务视为 long task。

::: details 详情
### 为什么有问题

主线程负责很多工作：

- 执行 JavaScript。
- 样式计算。
- 布局。
- 绘制调度。
- 处理用户输入。

如果一个任务长时间占用主线程，用户点击、滚动和输入就会延迟响应。

### 常见原因

- 大量同步计算。
- 一次性渲染大量 DOM。
- 大 JSON 解析。
- 复杂正则。
- 大列表排序或过滤。
- 第三方脚本执行过久。

### 如何发现

可以使用：

- Chrome DevTools Performance。
- Long Tasks API。
- INP 指标。
- 线上性能监控。

Long Tasks API 示例：

```js
new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(entry.duration);
  }
}).observe({ entryTypes: ["longtask"] });
```

### 优化方式

- 拆分大任务，分片执行。
- 使用 Web Worker。
- 虚拟列表。
- 减少同步布局读写。
- 延迟执行非关键逻辑。
- 优化第三方脚本加载。

### 注意事项

- 长任务优化要结合用户交互路径。
- 不要只看平均耗时，要关注低端设备和 P95/P99。
- 拆分任务时要避免破坏业务一致性。
:::

## 22、Web Locks API 有什么作用
Web Locks API 用于在同源的多个标签页、iframe 或 Worker 之间协调互斥任务，避免多个上下文同时执行同一段关键逻辑。

::: details 详情
### 适合场景

常见场景：

- 多标签页只允许一个页面刷新 Token。
- 只允许一个页面执行同步任务。
- 避免多个标签页同时写 IndexedDB。
- 控制后台数据迁移任务。

它解决的是同源浏览器上下文之间的协调问题。

### 基本用法

```js
navigator.locks.request("refresh-token", async lock => {
  await refreshToken();
});
```

同一时间只有拿到 `refresh-token` 锁的上下文会执行回调。

### 非阻塞尝试

可以使用 `ifAvailable`：

```js
navigator.locks.request(
  "sync-task",
  { ifAvailable: true },
  async lock => {
    if (!lock) return;
    await syncData();
  }
);
```

拿不到锁时直接放弃。

### 注意事项

- 只适用于同源上下文。
- 兼容性需要确认，必要时要有降级方案。
- 锁内任务要尽量短，避免长时间占用。
- 不要把它当作服务端分布式锁使用。
:::

## 23、SharedWorker 有什么作用
SharedWorker 是可以被同源多个页面共享的 Worker。它适合在多个标签页之间共享连接、状态或后台计算逻辑。

::: details 详情
### 和 Web Worker 的区别

普通 Web Worker 通常只服务于创建它的页面。

SharedWorker 可以被多个同源页面连接和复用。

这意味着多个标签页可以通过同一个 SharedWorker 共享某些后台能力。

### 基本用法

页面中创建：

```js
const worker = new SharedWorker("/shared-worker.js");

worker.port.start();
worker.port.postMessage({ type: "hello" });

worker.port.onmessage = event => {
  console.log(event.data);
};
```

Worker 中通过 `connect` 接收连接：

```js
onconnect = event => {
  const port = event.ports[0];
  port.onmessage = message => {
    port.postMessage(message.data);
  };
};
```

### 适合场景

- 多标签页共享 WebSocket 连接。
- 多页面状态同步。
- 后台计算复用。
- 减少重复轮询。

### 注意事项

- SharedWorker 有兼容性限制，使用前要确认目标浏览器。
- 生命周期受所有连接页面影响。
- 通信需要通过 `port`。
- 简单广播场景可以优先考虑 `BroadcastChannel`。
:::

## 24、Service Worker 适合解决什么问题
Service Worker 是运行在浏览器后台的脚本，可以拦截网络请求、做缓存、支持离线能力和推送。它适合构建渐进式 Web 应用和优化重复访问性能。

::: details 详情
### 核心能力

Service Worker 可以：

- 拦截 `fetch` 请求。
- 缓存静态资源和接口结果。
- 提供离线访问能力。
- 接收推送消息。
- 在后台执行部分任务。

它不直接操作 DOM。

### 适合场景

常见场景有：

- PWA 离线缓存。
- 资源加速。
- 弱网兜底。
- 推送通知。
- 请求失败时的缓存响应。

### 注意事项

- 只能在 HTTPS 下工作，localhost 例外。
- 更新逻辑要小心，避免旧缓存影响新版本。
- 缓存策略要区分静态资源和动态数据。
- 调试时要注意浏览器缓存和 Worker 状态。
:::

## 25、强缓存和协商缓存有什么区别
强缓存和协商缓存都是 HTTP 缓存机制。强缓存命中时浏览器不向服务器发送请求，协商缓存需要向服务器确认资源是否变化。

::: details 详情
### 强缓存

强缓存常见响应头包括：

```http
Cache-Control: max-age=31536000
Expires: Wed, 21 Oct 2026 07:28:00 GMT
```

在缓存未过期时，浏览器可以直接使用本地缓存。

`Cache-Control` 优先级通常高于 `Expires`。

### 协商缓存

协商缓存常见响应头包括：

```http
ETag: "abc123"
Last-Modified: Mon, 15 Jun 2026 10:00:00 GMT
```

下次请求时浏览器会带上：

```http
If-None-Match: "abc123"
If-Modified-Since: Mon, 15 Jun 2026 10:00:00 GMT
```

如果资源未变化，服务器返回 `304 Not Modified`。

### 常见策略

常见做法是：

- 带 hash 的静态资源使用长强缓存。
- HTML 使用协商缓存或较短缓存。
- 接口数据按业务实时性设置缓存。
- 用户相关数据谨慎缓存。

### 注意事项

- 静态资源文件名要带内容 hash，避免更新不生效。
- `no-cache` 表示需要协商，不等于完全不缓存。
- `no-store` 表示不存储缓存。
- 缓存问题排查时要同时看请求头、响应头和 DevTools 来源。
:::
