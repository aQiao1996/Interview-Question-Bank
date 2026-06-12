---
lang: zh-CN
title: http
description: http面试题
---

# http

## 1、TCP 是如何建立连接的，三次握手，四次挥手
::: details 详情
**三次握手**
- 客户端向服务端发送建立连接请求，客户端进入 `SYN-SEND` 状态。
- 服务端收到建立连接请求后，向客户端发送一个应答，服务端进入 `SYN-RECEIVED` 状态。
- 客户端接收到应答后，向服务端发送确认接收到应答，客户端进入 `ESTABLISHED` 状态。

---

**四次挥手**
- 第一次挥手：客户端发送 `FIN` 报文，表示客户端已经没有数据要发送了，客户端进入 `FIN_WAIT_1` 状态。
- 第二次挥手：服务端收到 `FIN` 后，先回复一个 `ACK`，表示“我知道你要关闭了”，此时服务端进入 `CLOSE_WAIT` 状态，客户端收到 `ACK` 后进入 `FIN_WAIT_2` 状态。
- 第三次挥手：当服务端也没有数据要发送时，再发送 `FIN` 报文，表示服务端也准备关闭连接，服务端进入 `LAST_ACK` 状态。
- 第四次挥手：客户端收到服务端的 `FIN` 后，回复 `ACK`，进入 `TIME_WAIT` 状态；服务端收到这个 `ACK` 后，才真正进入 `CLOSED` 状态。客户端等待 `2MSL` 后也进入 `CLOSED` 状态。

---

**为什么需要三次握手**
- 防止重复连接：三次握手可以确保客户端和服务器双方都确认了彼此的接收和发送能力，避免因旧的连接请求导致的错误连接。

---

**为什么需要四次挥手**
- 全双工通信的特性：`TCP` 是全双工通信，双方都需要单独关闭发送和接收通道，因此需要四次挥手来确保双方都完全断开连接。

---

**TIME_WAIT 状态的作用**
- 防止旧数据包干扰新连接：客户端在 `TIME_WAIT` 状态下会等待一段时间（通常是 2 倍的最大报文段寿命，约 2 分钟），确保网络中所有旧的报文都消失后再关闭连接。

---

**总结**
- 三次握手：用于建立可靠的连接，确保双方都能正常通信。
- 四次挥手：用于断开连接，确保双方都能正常断开连接。
- TIME_WAIT：用于防止旧数据包干扰新连接，确保连接的可靠性。
:::

## 2、HTTP 几个版本的区别
::: details 详情
**HTTP/0.9 - 单行协议**
- 只有 GET 请求行，无请求头和请求体。
- 只能传输 HTML 文件，以 ASCII 字符流返回。
- 无响应头。

---

**HTTP/1.0 - 多类型支持**
- 支持多种文件类型传输，不限于 ASCII 编码。
- 引入请求头和响应头( key-value 形式)。
- 每个请求都需要建立新的 TCP 连接。

---

**HTTP/1.1 - 持久连接**
- 引入持久连接( keep-alive )：一个 TCP 连接可传输多个 HTTP 请求。
- 默认开启 keep-alive，通常限制 6-8 个并发连接。
- 存在队头阻塞问题：前面的请求阻塞会影响后续请求。
- 引入 Host 字段，支持虚拟主机。
- 引入 Chunk transfer 机制处理动态内容长度。

---

**HTTP/2.0 - 多路复用**
- 一个域名只使用一个 TCP 长连接。
- 引入二进制分帧层，实现多路复用。
- 可对请求设置优先级。
- 在浏览器实践中通常配合 TLS 使用，但 HTTP/2 本身并不等于 HTTPS，也不是它“引入”了 TLS 加密。

---

**HTTP/3.0 - QUIC 协议**
- 基于 UDP 协议而非 TCP。
- 实现了类似 TCP 的流量控制和可靠传输。
- 集成 TLS 加密。
- 实现多路复用。
- 解决 TCP 队头阻塞问题。
:::

## 3、HTTP 常见的状态码
::: details 详情
- 1xx 信息响应：
  - 100 Continue：客户端应继续其请求。
  - 101 Switching Protocols：服务器同意切换协议。
- 2xx 成功响应：
  - 200 OK：请求成功，服务器返回请求的数据。
  - 204 No Content：响应成功，但没有返回内容。
  - 206 Partial Content：服务器成功处理了部分 GET 请求。
- 3xx 重定向：
  - 301 Moved Permanently：资源已永久移动到新位置。
  - 302 Found：资源临时移动到新位置。
  - 304 Not Modified：资源未修改，使用缓存。
- 4xx 客户端错误：
  - 400 Bad Request：请求语法错误，服务器无法理解。
  - 401 Unauthorized：未授权，需提供认证信息。
  - 403 Forbidden：服务器拒绝请求。
  - 404 Not Found：请求的资源不存在。
- 5xx 服务器错误：
  - 500 Internal Server Error：服务器内部错误。
  - 501 Not Implemented：服务器不支持请求的功能。
  - 503 Service Unavailable：服务器超载或维护中。
:::

## 4、HTTP 常见 Header
::: details 详情
**请求头**

- accept: text/html 告诉服务端我期望接收到一个html的文件。
- accept-encoding: gzip, deflate, br 告诉服务端以这种方式压缩。
- accept-language: zh-CN 告诉服务端以中文的格式返回。
- authorization: 告诉服务端授权信息。
- cookie: 告诉服务端客户端存储的 cookie。
- origin: 告诉服务端请求的来源。
- content-type: 指定请求体的媒体类型。
- referer: 表示当前请求的来源页面 URL。

---

**响应头**

- content-encoding: br 告诉浏览器压缩方式是br。
- content-type: text/html; charset=utf-8 告诉浏览器以这种方式，编码加载。
- cache-control: 告诉浏览器缓存策略。
- expires: 告诉浏览器缓存过期时间。
- set-cookie: 告诉浏览器设置 cookie。
- access-control-allow-origin: * 告诉浏览器允许跨域。
:::

## 5、HTTP 常见的 Content-Type
`Content-Type` 是 HTTP 中非常重要的头字段，决定了请求和响应的内容格式。
::: details 详情
**文本类型**
- `text/plain`
  > 纯文本格式。
- `text/html`
  > HTML 格式。
- `text/css`
  > CSS 样式表。
- `text/javascript`
  > JavaScript 脚本。

---

**应用类型**
- `application/json`
  > JSON 格式。
- `application/xml`
  > XML 格式。
- `application/x-www-form-urlencoded`
  > 表单数据格式（键值对）。
- `application/octet-stream`
  > 二进制流数据（默认值）。

---

**图片理想**
- `image/gif`
  > GIF 图片格式。
- `image/jpeg`
  > JPEG 图片格式。
- `image/png`
  > PNG 图片格式。
- `image/svg+xml`
  > SVG 矢量图。

---

**音视频类型**
- `audio/mpeg`：
  > MP3 音频。
- `audio/ogg`：
  > OGG 音频。
- `video/mp4`：
  > MP4 视频。
- `video/webm`：
  > WebM 视频。

---

**多部分类型**
- `multipart/form-data`：
  > 表单数据，支持文件上传。
- `multipart/byteranges`：
  > 响应中包含多个范围的数据。
:::

## 6、URL 包含哪些部分
::: details 详情
URL (Uniform Resource Locator) 包含以下部分：
- 协议 (protocol)：如 `http://`、`https://`、`ftp://` 等。
- 域名 (domain)：如 `www.example.com`。
  - 子域名 (subdomain)：如 `www`、`blog`、`api` 等。
  - 主域名 (main domain)：如 `example`。
  - 顶级域名 (top-level domain)：如 `com`、`org`、`net` 等。
- 端口号 (port number)：如 `:80`、`:443`（可选，HTTP 默认 80，HTTPS 默认 443）。
- 路径 (path)：如 `/index.html`、`/about/` 等。
- 查询字符串 (query string)：如 `?name=John&age=30`。
- 哈希值 (hash)：如 `#section1`。
:::

## 7、如何解决跨域
跨域问题是由于 **浏览器的同源策略**（Same-Origin Policy）限制，**域名**、**端口**、**协议** 三者任意一个不同，就会产生跨域。
::: details 详情
- CORS（跨域资源共享）
  > 服务器通过设置特定的 HTTP 响应头，允许浏览器访问跨域资源。
  - 常见响应头
    - `Access-Control-Allow-Origin`：指定允许访问的域名（如 `*` 表示允许所有域名）。
    - `Access-Control-Allow-Methods`：指定允许的 HTTP 方法（如 `GET, POST`）。
    - `Access-Control-Allow-Headers`：指定允许的请求头。
    - `Access-Control-Allow-Credentials`：是否允许携带 Cookie。
- JSONP 
  > 利用 `<script>` 标签不受同源策略限制的特点，通过动态创建 `<script>` 标签实现跨域。
  - 限制
    - 只能用于 GET 请求。
- 代理服务器
  > 前端将请求发送到同源的代理服务器，由代理服务器转发请求到目标服务器，从而绕过浏览器进行请求（如开发环境下设置 `proxy`）。
- Nginx 反向代理
  > 使用 Nginx 配置反向代理，将跨域请求转发到目标服务器。
- WebSocket
  > WebSocket 不受同源策略限制，可以实现跨域通信。
- iframe + postMessage
  > 使用 `iframe` 加载跨域页面，通过 `postMessage` 实现跨域通信。

**总结**
- CORS 是最常用且标准的跨域解决方案。
- 开发环境优先使用代理服务器。
- Nginx 反向代理 适合复杂场景。
:::

## 8、简述浏览器的缓存策略
浏览器缓存策略主要分为两种：**强缓存** 和 **协商缓存**。浏览器缓存策略通过强缓存和协商缓存提高了资源加载效率，减少了服务器压力。合理配置缓存策略可以显著提升用户体验和系统性能。
::: details 详情
**强缓存**
- 定义
  - 在缓存未过期的情况下，浏览器直接从本地缓存中读取资源，不会向服务器发送请求。
- 实现方式
  - 通过 HTTP 响应头中的 `Expires` 或 `Cache-Control` 实现。
- 相关字段
  - `Expires`：指定资源过期时间（绝对时间）。
  - `Cache-Control`：使用相对时间控制缓存，优先级高于 `Expires`。
- 特点
  - 不会向服务器发送请求。
  - 适合静态资源（如图片、CSS、JS 文件）。

---

**协商缓存**
- 定义
  - 浏览器向服务器发送请求，服务器根据资源是否更新决定是否使用缓存。
- 实现方式
  - 通过 HTTP 请求头和响应头中的 `Last-Modified` / `If-Modified-Since` 或 `ETag` / `If-None-Match` 实现。
- 相关字段
  - `Last-Modified` 和 `If-Modified-Since`
    - `Last-Modified`：资源的最后修改时间。
    - `If-Modified-Since`：浏览器发送的请求头，携带上次的 `Last-Modified` 值。
    > 缺点：只能精确到秒，文件内容未改变但修改时间更新时会导致缓存失效。
  - `ETag` 和 `If-None-Match`
    - `ETag`：资源的唯一标识符（由服务器生成）。
    - `If-None-Match`：浏览器发送的请求头，携带上次的 `ETag` 值。
    > 优点：比 `Last-Modified` 更精确，能识别内容是否真正变化。
- 特点
  - 如果资源未更新，服务器返回 `304 Not Modified`，浏览器使用本地缓存。
  - 适合动态资源。

---

**缓存策略的优先级**
- 浏览器优先判断是否命中 **强缓存**。
- 如果未命中强缓存，则发起请求，进入 **协商缓存** 流程。
- 如果协商缓存生效，服务器返回 `304 Not Modified`，浏览器使用本地缓存。
- 如果协商缓存未生效，服务器返回新的资源。

---

**注意事项**
- 合理设置缓存策略
  - 对于静态资源，优先使用强缓存。
  - 对于动态资源，使用协商缓存。
- 版本管理
  - 静态资源可以通过文件名或 URL 中的版本号（如 `style.css?v=1.0`）实现缓存更新。
- 安全性
  - 确保敏感数据不被缓存（通过 `Cache-Control: no-store`）。
:::

## 9、什么是图片防盗链，如何实现
图片防盗链是指服务器通过 HTTP 协议中的 Referer 字段来判断请求是否来自合法站点，从而防止其他网站直接引用本站图片资源。
::: details 详情
- 服务器端实现
  - 检查 HTTP Referer 字段。
  - 判断请求来源是否在白名单中。
  - 对非法请求返回 403 或替代图片。

Nginx 配置示例：
```nginx
location ~ .*\.(gif|jpg|jpeg|png|bmp)$ {
    valid_referers none blocked server_names *.example.com;
    if ($invalid_referer) {
        return 403;
        # 或者返回替代图片
        # rewrite ^/ /path/to/default.jpg break;
    }
}
```
- 其他防盗链方案
  - 给图片添加水印。
  - 使用 Token 验证。
  - 使用 CDN 提供的防盗链功能。
  - 对图片进行加密处理。
- 注意事项
  - Referer 可以被伪造，不能作为唯一判断依据。
  - 需要考虑用户体验和 SEO 影响。
  - 移动端 APP 可能不发送 Referer。
  - 部分浏览器可能禁用 Referer。
:::

## 10、什么是 Restful API 
::: details 详情
RESTful API 是一种软件架构风格，用于设计网络应用程序的接口。主要特点：

**资源导向**

- 使用 URL 定位资源。
- 每个资源都有唯一的 URL。
- 资源可以有多种表现形式（如 JSON、XML）。

---

**HTTP 方法对应操作**

- GET：获取资源。
- POST：创建资源。
- PUT：更新资源（完整更新）。
- PATCH：更新资源（部分更新）。
- DELETE：删除资源。

---

**无状态**

- 服务器不保存客户端状态。
- 每个请求包含所需的所有信息。
- 有利于横向扩展。

---

**统一接口**

- 使用标准的 HTTP 方法。
- 使用标准的 HTTP 状态码。
- 返回格式一致（通常是 JSON）。
:::

## 11、什么是 GraphQL
::: details 详情
GraphQL 是一种用于 API 的查询语言和运行时，由 Facebook 开发。主要特点：

**查询灵活性**

- 客户端可以精确指定需要哪些数据。
- 可以在一个请求中获取多个资源。
- 避免了传统 REST API 的过度获取和获取不足问题。

---

**类型系统**

- 强类型的 Schema 定义。
- 自动生成文档。
- 开发时有更好的类型提示。

---

**单个端点**

- 只需要一个 API 端点。
- 所有查询都发送到同一个地址。
- 通过查询语句区分不同的操作。

---

**主要操作类型**

- Query：获取数据。
- Mutation：修改数据。
- Subscription：实时数据订阅。

---

**优点**

- 减少网络请求。
- 避免版本化问题。
- 强类型保障。
- 更好的开发体验。

---

**缺点**

- 学习成本较高。
- 缓存较为复杂。
- 服务端实现复杂度增加。
:::

## 12、GET 和 POST 请求的区别
::: details 详情
- 协议层面：HTTP 为不同方法定义了不同语义，GET 通常用于获取资源，强调安全性和幂等性；POST 通常用于提交数据或触发服务端处理。它们不只是“名字不同”，在缓存、幂等、书签、重放等方面也有明显差异。
- 应用层面：GET 请求在规范里没有定义通用的请求体语义，实践中通常不带 `body`，很多浏览器、服务端框架和中间件也不会按“带请求体的 GET”来设计和处理。
- 浏览器层面：GET 请求会缓存，有历史记录。
:::

## 13、为何现代浏览器都禁用第三方 Cookie
现代浏览器禁用第三方 Cookie 是为了提升用户隐私和安全性，防止跨站点跟踪（Cross-Site Tracking）和广告商滥用用户数据，同时符合隐私法规（如 GDPR 和 CCPA）的要求。

## 14、浏览器从输入 url 到显示网页的全过程
::: details 详情
- DNS 解析出 IP 地址。
- 建立 TCP 连接。
- 客户端发出 HTTP 请求。
- 服务端响应 HTTP 请求。
- 浏览器解析 HTML CSS。
- 渲染 DOM。
- 执行 JS 代码，可能会 ajax 加载内容，再次渲染 DOM。
- 加载媒体资源。
- 浏览器缓存机制。
:::

## 15、在网络层面可做哪些性能优化
::: details 详情
**减少请求数量**

- 合并文件（CSS/JS 打包）。
  > - 使用工具（如 Webpack、Rollup）将多个 CSS 和 JS 文件合并为一个文件，减少 HTTP 请求数量。
- 雪碧图（CSS Sprites）。
  > - 将多个小图片合并为一张大图片，通过 CSS 的 `background-position` 属性定位显示。
- 图片懒加载。
  > - 延迟加载页面中未进入视口的图片，减少初始加载的资源数量。
- 按需加载/异步加载。
  > - 按需加载：仅加载当前页面需要的资源。
  > - 异步加载：使用 `async` 或 `defer` 属性加载 JS 文件，避免阻塞页面渲染。
- 合理使用缓存。
  > - 对于不经常变化的资源，设置长时间的缓存策略，减少重复请求。

---

**减小资源体积**

- 代码压缩（minify）。
  > - 使用工具（如 Terser、CSSNano）压缩 JS 和 CSS 文件，去除多余的空格、注释等。
- Gzip/Brotli 压缩。
  > - 在服务器端启用 Gzip 或 Brotli 压缩，减少传输数据量。
- 图片优化（压缩、webp格式）。
  > - 使用工具（如 TinyPNG、ImageMagick）压缩图片，或将图片转换为 WebP 格式。
- Tree Shaking。
  > - 移除未使用的代码，通常与 ES6 模块配合使用。
- 代码分割（Code Splitting）。
  > - 将代码按需分割，减少初始加载体积。

---

**CDN 优化**

- 使用 CDN 分发静态资源。
  > - 将静态资源部署到 CDN 节点，用户可以从最近的节点加载资源。
- 合理设置 CDN 缓存。
  > - 配置缓存策略，减少重复请求。
- 选择合适的 CDN 节点。
  > - 根据用户分布选择覆盖范围广、延迟低的 CDN 服务商。
- 配置 CDN 预热和刷新策略。
  > - 预热：在资源上线前，将资源加载到 CDN 节点。
  > - 刷新：当资源更新时，及时刷新 CDN 缓存。

---

**HTTP 优化**

- 使用 HTTP/2 多路复用。
  > - 在一个 TCP 连接中同时传输多个请求和响应，减少连接开销。
- 开启 Keep-Alive。
  > - 复用 TCP 连接，避免频繁建立和关闭连接。
- 合理设置缓存策略。
  > - 对静态资源设置强缓存（`Cache-Control`），对动态资源使用协商缓存（`ETag`）。
- DNS 预解析（dns-prefetch）。
  > - 提前解析外部资源的域名，减少 DNS 查询时间。
- 预连接（preconnect）。
  > - 提前建立与外部资源的连接，包括 DNS 查询、TLS 握手等。
- 预加载（prefetch/preload）。
  > - 预加载：提前加载关键资源。
  > - 预取：加载未来可能需要的资源。

---

**资源加载优化**

- 关键资源优先加载。
  > - 提前加载 CSS、JS 等关键资源，确保页面快速渲染。
- 非关键资源延迟加载。
  > - 延迟加载不影响页面渲染的资源（如图片、广告）。
- 内联关键 CSS/JS。
  > - 将关键 CSS 和 JS 直接写入 HTML，减少外部请求。
- 异步加载非关键 JS（async/defer）。
  > - `async`：脚本加载完成后立即执行，可能阻塞 HTML 解析。
  > - `defer`：脚本加载完成后，等待 HTML 解析完成再执行。
- 优化资源加载顺序。
  > - 优先加载渲染关键路径上的资源，延迟加载非关键资源。

---

**接口优化**

- 接口合并。
  > - 将多个接口请求合并为一个，减少网络请求次数。
- GraphQL 按需查询。
  > - 使用 GraphQL 查询所需字段，避免传统 REST API 的过度获取或获取不足问题。
- 数据缓存。
  > - 使用浏览器缓存（如 `localStorage`、`sessionStorage`）或服务端缓存（如 Redis）。
- 避免重复请求。
  > - 在前端对重复请求进行去重，减少不必要的接口调用。
- 设置合理的超时时间。
  > - 为接口请求设置超时时间，避免长时间等待。

---

**监控和分析**

- 性能监控。
  > - 使用工具（如 Lighthouse、WebPageTest）监控页面性能。
- 错误监控。
  > - 使用工具（如 Sentry）捕获前端和后端的错误日志。
- 用户体验监控。
  > - 收集用户的关键性能指标（如 FCP、LCP、CLS），优化用户体验。
- 性能数据分析。
  > - 分析性能数据，定位瓶颈并持续优化。
- 持续优化。
  > - 定期评估和优化网络性能，跟踪最新的优化技术。
:::

## 16、CORS 是如何实现跨域的
::: details 详情
**什么是 CORS**
- CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种浏览器的跨域访问机制。
- 它通过设置特定的 HTTP 响应头，允许浏览器访问跨域资源。

---

**CORS 的实现原理**
- 浏览器会在跨域请求时，自动添加一些请求头，并根据服务器返回的响应头决定是否允许跨域访问。
- CORS 的核心是服务器通过响应头告知浏览器是否允许跨域请求。

---

**CORS 的关键响应头**
- `Access-Control-Allow-Origin`
  > 指定允许访问的域名。
  ```http
  Access-Control-Allow-Origin: https://example.com
  ```
- `Access-Control-Allow-Methods`
  > 指定允许的 HTTP 方法。
  ```http
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  ```
- `Access-Control-Allow-Headers`
  > 指定允许的自定义请求头。
  ```http
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```
- `Access-Control-Allow-Credentials`
  > 指定是否允许携带 Cookie。
  ```http
  Access-Control-Allow-Credentials: true
  ```
- `Access-Control-Expose-Headers`
  > 指定哪些响应头可以被浏览器访问。
  ```http
  Access-Control-Expose-Headers: X-Custom-Header
  ```
- `Access-Control-Max-Age`
  > 指定预检请求的结果可以缓存的时间（单位：秒）。
  ```http
  Access-Control-Max-Age: 86400
  ```

---

**CORS 的两种请求类型**
- 简单请求
  - 满足以下条件的请求被视为简单请求
    - 使用的 HTTP 方法是 `GET`、`POST` 或 `HEAD`。
    - 请求头仅包含以下字段：
      > - `Accept`
      > - `Accept-Language`
      > - `Content-Language`
      > - `Content-Type`（值为 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`）。
  - 流程
    - 浏览器直接发送请求，服务器通过响应头决定是否允许跨域。
- 预检请求
  - 如果请求不满足简单请求的条件，浏览器会在正式请求之前发送一个 `OPTIONS` 请求，称为预检请求。
  - 流程
    1. 浏览器发送 `OPTIONS` 请求，询问服务器是否允许跨域。
    2. 服务器返回包含 CORS 相关头的响应。
    3. 如果预检请求通过，浏览器才会发送正式请求。
:::

## 17、什么是 CDN
::: details 详情
**定义**
- CDN（Content Delivery Network，内容分发网络）是一种分布式的网络架构，用于加速内容的分发。
- 通过将内容缓存到多个地理位置分散的节点（Edge Server），用户可以从离自己最近的节点获取资源，从而提高访问速度和可靠性。

---

**工作原理**
1. 用户向目标服务器发起请求。
2. DNS 解析将请求路由到最近的 CDN 节点。
3. CDN 节点检查是否有缓存的资源：
   - 如果有缓存，直接返回资源。
   - 如果没有缓存，向源服务器请求资源并缓存到节点。
4. 用户从 CDN 节点获取资源。

---

**优点**
- 加速访问：用户从最近的节点获取资源，减少延迟。
- 减轻源服务器压力：CDN 节点分担了大部分流量，降低源服务器负载。
- 提高可靠性：多个节点分布式部署，避免单点故障。
- 节省带宽：通过缓存减少重复请求，降低带宽消耗。
- 支持高并发：分布式架构可以同时处理大量用户请求。

---

**应用场景**
- 网站加速：提高网页加载速度，优化用户体验。
- 视频点播/直播：提供高质量的视频流传输，减少卡顿。
- 文件下载：加速大文件的分发（如软件、补丁）。
- API 加速：提升接口响应速度，减少延迟。
:::

## 18、强缓存和协商缓存有什么区别
浏览器缓存主要分为强缓存和协商缓存。强缓存命中时不会向服务器发送请求，协商缓存会向服务器发起请求，由服务器判断资源是否可以继续使用本地缓存。

::: details 详情
### 强缓存

强缓存通过响应头告诉浏览器资源在一段时间内可以直接使用本地缓存。

常见响应头：

- `Cache-Control`
- `Expires`

```http
Cache-Control: max-age=3600
```

表示资源在 3600 秒内可以直接使用缓存，不需要请求服务器。

特点：

- 命中时不会发起网络请求。
- 速度最快。
- 如果缓存时间设置过长，资源更新可能不及时。

### 协商缓存

当强缓存失效后，浏览器会带上缓存标识请求服务器，由服务器判断资源是否发生变化。

常见响应头和请求头：

- `Last-Modified` / `If-Modified-Since`
- `ETag` / `If-None-Match`

如果资源没有变化，服务器返回：

```http
304 Not Modified
```

浏览器继续使用本地缓存。

如果资源发生变化，服务器返回新资源，状态码通常是 `200`。

### ETag 和 Last-Modified 的区别

- `Last-Modified` 基于资源最后修改时间，精度通常到秒。
- `ETag` 是资源内容标识，能更准确判断资源是否变化。
- `ETag` 优先级通常高于 `Last-Modified`。

### 对比总结

| 对比项 | 强缓存 | 协商缓存 |
| --- | --- | --- |
| 是否请求服务器 | 否 | 是 |
| 常见状态 | 200 from memory/disk cache | 304 Not Modified |
| 主要响应头 | Cache-Control、Expires | ETag、Last-Modified |
| 速度 | 更快 | 较快 |
| 是否由服务器确认 | 否 | 是 |

### 实践建议

- HTML 文件通常使用协商缓存，避免页面入口更新不及时。
- 带 hash 的静态资源可以设置较长强缓存。
- JS、CSS、图片等静态资源通常配合文件 hash 和 `Cache-Control` 使用。
:::

## 19、HTTP 中 keep-alive 有什么作用
HTTP keep-alive 指的是连接复用。它允许客户端和服务器在一次 TCP 连接上发送多个 HTTP 请求和响应，避免每次请求都重新建立连接。

::: details 详情
### 为什么需要 keep-alive

如果每个 HTTP 请求都重新建立 TCP 连接，就会产生额外的三次握手和慢启动成本。

keep-alive 可以复用连接，减少连接建立开销，提高请求效率。

### HTTP/1.0 和 HTTP/1.1

- HTTP/1.0 默认短连接，需要通过 `Connection: keep-alive` 开启。
- HTTP/1.1 默认开启持久连接，除非显式设置 `Connection: close`。

```http
Connection: keep-alive
```

### 优点

- 减少 TCP 连接建立和关闭的成本。
- 降低延迟。
- 减轻服务器和网络压力。
- 对多个静态资源请求更友好。

### 注意事项

- 长连接不是永久连接，服务器通常会设置超时时间和最大请求数。
- 空闲连接过多会占用服务器资源。
- HTTP/2 在一个连接上支持多路复用，比 HTTP/1.1 的 keep-alive 更进一步。

### 总结

keep-alive 的核心是连接复用。它减少了重复建立 TCP 连接的成本，是 HTTP 性能优化中的基础机制。
:::

## 20、HTTP/2 多路复用是什么
HTTP/2 多路复用是指在同一个 TCP 连接上同时发送多个请求和响应，并且这些请求和响应可以交错传输，互不阻塞。

::: details 详情
### HTTP/1.1 的问题

HTTP/1.1 虽然支持 keep-alive 连接复用，但同一个连接上的请求和响应仍然容易受到队头阻塞影响。

浏览器通常会对同一域名建立多个 TCP 连接来提高并发能力，但这也会带来额外连接成本。

### HTTP/2 的做法

HTTP/2 把 HTTP 消息拆成更小的帧（frame），并通过流（stream）来区分不同请求。

多个请求和响应的数据帧可以在同一个 TCP 连接中交错传输：

```txt
stream 1: frame A
stream 3: frame A
stream 1: frame B
stream 5: frame A
stream 3: frame B
```

接收方再根据 stream id 把这些帧重新组装成完整的请求或响应。

### 优点

- 一个连接可以并发处理多个请求。
- 减少 TCP 连接数量。
- 降低连接建立和慢启动成本。
- 比 HTTP/1.1 更适合大量小资源请求。

### 注意事项

- HTTP/2 解决的是 HTTP 层面的队头阻塞，但在 TCP 层仍然可能受丢包影响。
- HTTP/3 基于 QUIC，可以进一步缓解 TCP 层队头阻塞问题。
- 使用 HTTP/2 后，传统的域名分片优化通常不再必要。
:::

## 21、HTTPS 握手过程是怎样的
HTTPS 是 HTTP over TLS，本质是在 HTTP 通信前先通过 TLS 握手建立安全通道。

::: details 详情
### 主要目标

TLS 握手主要解决三件事：

- 验证服务器身份，避免访问到伪造站点。
- 协商加密算法。
- 生成后续通信使用的会话密钥。

### 简化流程

以常见的 TLS 1.2 为例，流程可以简化为：

1. 客户端发送 `ClientHello`，包含支持的 TLS 版本、加密套件、随机数等信息。
2. 服务端返回 `ServerHello`，选择 TLS 版本和加密套件，并返回服务端随机数。
3. 服务端发送证书，客户端校验证书是否合法、域名是否匹配、是否过期。
4. 客户端生成预主密钥，并用服务端公钥加密后发送给服务端。
5. 双方基于随机数和预主密钥计算出会话密钥。
6. 后续 HTTP 数据使用对称加密传输。

### 为什么不用非对称加密传输所有数据

非对称加密计算成本高，不适合加密大量业务数据。

HTTPS 通常使用非对称加密解决身份验证和密钥交换，再使用对称加密传输实际数据。

### TLS 1.3 的优化

TLS 1.3 精简了握手流程，减少往返次数，并移除了一些不安全的旧算法，因此连接建立速度和安全性都更好。

### 注意事项

- 证书需要由可信 CA 签发，浏览器才会信任。
- 私钥必须妥善保存，泄露后会影响站点安全。
- 开启 HTTPS 后仍需要关注 HSTS、证书续期和安全协议配置。
:::

## 22、Cookie 的 SameSite 属性有什么作用
`SameSite` 用于限制浏览器在跨站请求中是否携带 Cookie，主要用于降低 CSRF 攻击风险。

::: details 详情
### 常见取值

- `Strict`：最严格，跨站请求完全不携带 Cookie。
- `Lax`：相对宽松，普通跨站子请求不携带 Cookie，但顶级导航的安全方法请求可能携带。
- `None`：跨站请求也可以携带 Cookie，但必须同时设置 `Secure`。

### 示例

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax
```

如果需要在第三方场景中携带 Cookie：

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=None
```

### 和 CSRF 的关系

CSRF 攻击依赖浏览器在跨站请求中自动携带目标站点 Cookie。

设置 `SameSite=Lax` 或 `SameSite=Strict` 后，可以减少跨站请求自动带上登录态的情况，从而降低 CSRF 风险。

### 注意事项

- `SameSite` 不能替代服务端 CSRF Token、Referer/Origin 校验等防护。
- `SameSite=None` 必须配合 `Secure`，也就是只能在 HTTPS 下使用。
- 第三方登录、嵌入式页面、跨站单点登录等场景需要特别评估。
- 不同浏览器历史版本对默认值和兼容性处理可能不同。
:::

## 23、ETag 是什么，强校验和弱校验有什么区别
`ETag` 是 HTTP 缓存中的资源标识符，用来判断客户端缓存的资源和服务器资源是否一致。

::: details 详情
### 基本流程

服务器首次返回资源时，可以带上 `ETag`：

```http
ETag: "abc123"
```

浏览器下次请求时会带上：

```http
If-None-Match: "abc123"
```

服务器对比后，如果资源未变化，返回 `304 Not Modified`；如果变化，则返回新的资源和新的 `ETag`。

### 强校验

强校验要求资源字节级完全一致：

```http
ETag: "abc123"
```

只要内容字节发生变化，就应该生成不同的 ETag。

### 弱校验

弱校验表示资源语义上可以认为一致，但字节不一定完全相同：

```http
ETag: W/"abc123"
```

例如只改变了生成时间、格式细节，但对用户看到的内容没有实质影响，可以使用弱校验。

### 和 Last-Modified 的区别

- `Last-Modified` 基于时间，精度有限。
- `ETag` 基于资源标识，通常更准确。
- 两者可以同时存在，实际处理优先级通常以 `ETag` 为准。

### 注意事项

- ETag 生成策略要稳定，避免每次构建都无意义变化。
- 分布式服务要保证不同节点对同一资源生成一致的 ETag。
- 静态资源如果文件名带 hash，通常可以使用强缓存，ETag 压力会更小。
:::

## 24、HSTS 是什么，有什么作用
HSTS 是 HTTP Strict Transport Security，用于告诉浏览器在一段时间内只能通过 HTTPS 访问当前站点。

::: details 详情
### 基本响应头

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

含义：

- `max-age`：策略有效时间，单位是秒。
- `includeSubDomains`：对子域名也生效。
- `preload`：表示希望加入浏览器预加载列表。

### 解决什么问题

如果用户第一次访问时输入的是 `http://example.com`，中间人可能在跳转到 HTTPS 前拦截请求。

开启 HSTS 后，浏览器会记住该站点只能使用 HTTPS，后续访问会自动改成 HTTPS 请求。

### 优点

- 减少 HTTP 降级攻击风险。
- 避免用户手动输入 HTTP 时产生不安全请求。
- 强制浏览器使用 HTTPS 访问站点。

### 注意事项

- 启用前必须确保 HTTPS 配置稳定可用。
- `includeSubDomains` 会影响所有子域名，启用前要确认子域名都支持 HTTPS。
- `preload` 一旦加入浏览器列表，回退成本较高，需要谨慎。
- HSTS 不能替代证书管理、TLS 配置和应用层安全措施。
:::

## 25、CSP 是什么，有什么作用
CSP 是 Content Security Policy，内容安全策略，用于限制页面可以加载和执行哪些资源，主要用于降低 XSS 等攻击风险。

::: details 详情
### 基本示例

服务端可以通过响应头设置 CSP：

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' https:
```

含义：

- `default-src 'self'`：默认只允许加载同源资源。
- `script-src 'self'`：脚本只能来自同源。
- `img-src 'self' https:`：图片允许同源和 HTTPS 来源。

### 常见指令

- `default-src`：默认资源加载策略。
- `script-src`：脚本加载策略。
- `style-src`：样式加载策略。
- `img-src`：图片加载策略。
- `connect-src`：接口、WebSocket 等连接策略。
- `frame-ancestors`：限制页面能否被其他页面 iframe 嵌入。

### 作用

- 限制恶意脚本执行。
- 限制资源加载来源。
- 降低 XSS 攻击成功后的影响范围。
- 防止页面被不可信站点嵌入。

### Report-Only 模式

上线前可以先使用只报告不拦截的模式观察影响：

```http
Content-Security-Policy-Report-Only: default-src 'self'
```

这样可以收集违规报告，避免直接拦截导致线上功能异常。

### 注意事项

- CSP 不能替代输入过滤和输出转义。
- 不建议随意使用 `'unsafe-inline'` 和 `'unsafe-eval'`。
- 策略需要结合项目中的 CDN、统计脚本、监控脚本逐步收紧。
:::

## 26、HTTP 内容协商是什么
内容协商是指客户端通过请求头告诉服务端自己能接受的内容类型、语言、编码等，服务端据此返回最合适的响应。

::: details 详情
### 常见请求头

- `Accept`：客户端能接受的媒体类型。
- `Accept-Language`：客户端偏好的语言。
- `Accept-Encoding`：客户端支持的压缩编码。
- `User-Agent`：客户端信息，有时服务端会据此做兼容处理。

### Accept 示例

```http
Accept: application/json, text/plain, */*
```

表示客户端优先希望得到 JSON，也可以接受文本或其他类型。

服务端响应时会通过 `Content-Type` 告诉客户端实际返回类型：

```http
Content-Type: application/json; charset=utf-8
```

### Accept-Language 示例

```http
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
```

`q` 表示权重，值越大优先级越高。

### Accept-Encoding 示例

```http
Accept-Encoding: gzip, br
```

服务端如果使用 Brotli 压缩，可以返回：

```http
Content-Encoding: br
```

### 注意事项

- API 接口应明确返回 `Content-Type`，避免客户端解析错误。
- 内容协商不应让接口行为过于隐式，关键差异最好体现在 URL、参数或版本中。
- 压缩协商通常由 Web 服务器或 CDN 自动处理。
:::

## 27、HTTP 中 Vary 响应头有什么作用
`Vary` 用于告诉缓存系统：响应内容会根据哪些请求头变化，从而避免缓存复用错误。

::: details 详情
### 基本示例

```http
Vary: Accept-Encoding
```

表示响应会根据请求头 `Accept-Encoding` 不同而变化。

例如支持 gzip 的客户端拿到 gzip 版本，不支持 gzip 的客户端不能复用这个 gzip 缓存。

### 多个请求头

```http
Vary: Accept-Encoding, Accept-Language
```

表示响应同时受压缩编码和语言偏好影响。

### 常见场景

- 根据 `Accept-Encoding` 返回 gzip、br 或未压缩内容。
- 根据 `Accept-Language` 返回不同语言内容。
- 根据 `User-Agent` 返回不同兼容版本。
- 根据自定义请求头返回不同内容。

### 为什么重要

CDN、浏览器缓存、代理服务器都可能缓存响应。

如果没有正确设置 `Vary`，不同客户端可能拿到不适合自己的缓存内容，例如：

- 中文用户拿到英文页面。
- 不支持压缩的客户端拿到压缩内容。
- 移动端拿到桌面端资源。

### 注意事项

- 不要随意设置过多 `Vary` 字段，否则会降低缓存命中率。
- 如果响应和 Cookie 强相关，要谨慎缓存。
- 静态资源通常只需要关注压缩相关的 `Vary: Accept-Encoding`。
:::

## 28、HTTP 103 Early Hints 是什么
`103 Early Hints` 是一种临时响应状态码，服务端可以在最终响应前提前告诉浏览器需要预加载哪些关键资源。

::: details 详情
### 基本示例

服务端先返回：

```http
HTTP/1.1 103 Early Hints
Link: </assets/main.css>; rel=preload; as=style
Link: </assets/main.js>; rel=modulepreload
```

随后再返回最终响应：

```http
HTTP/1.1 200 OK
Content-Type: text/html
```

浏览器收到 103 后，可以提前开始请求 CSS、JS 等关键资源，减少等待 HTML 完整生成的时间。

### 适合场景

- 服务端渲染耗时较长。
- HTML 生成前已经能确定关键静态资源。
- CDN 或边缘节点可以提前返回资源提示。

### 和 preload 的关系

`103 Early Hints` 通常通过 `Link` 响应头表达预加载资源，本质上是把资源提示提前到最终 HTML 之前。

### 注意事项

- 浏览器、服务器和 CDN 都需要支持该能力。
- 提示的资源必须准确，否则会浪费带宽。
- 不应预加载低优先级或不确定会用到的资源。
:::

## 29、Fetch Metadata 请求头有什么作用
Fetch Metadata 是浏览器自动携带的一组请求头，用于告诉服务端请求的来源关系和资源类型，帮助服务端防御跨站攻击。

::: details 详情
### 常见请求头

- `Sec-Fetch-Site`：请求来源和目标站点的关系。
- `Sec-Fetch-Mode`：请求模式，例如 `navigate`、`cors`、`no-cors`。
- `Sec-Fetch-Dest`：请求目标类型，例如 `document`、`image`、`script`。
- `Sec-Fetch-User`：是否由用户主动导航触发。

### Sec-Fetch-Site 示例

```http
Sec-Fetch-Site: same-origin
```

常见值包括：

- `same-origin`：同源请求。
- `same-site`：同站但不同源。
- `cross-site`：跨站请求。
- `none`：用户直接输入地址或书签访问。

### 防御思路

服务端可以拒绝不符合预期的跨站请求：

```txt
如果 Sec-Fetch-Site 是 cross-site，并且接口是敏感写操作，则拒绝请求。
```

这可以辅助防御 CSRF、跨站资源滥用等问题。

### 注意事项

- Fetch Metadata 是安全增强手段，不应替代 CSRF Token、SameSite Cookie 等机制。
- 需要给老浏览器或特殊客户端设计兼容策略。
- 静态资源、开放 API、OAuth 回调等场景不能简单一刀切拒绝跨站请求。
:::

## 30、SSE 和 WebSocket 有什么区别
SSE（Server-Sent Events）和 WebSocket 都可以用于服务端主动推送消息，但它们的通信模型和适用场景不同。

::: details 详情
### SSE 是什么

SSE 基于 HTTP 长连接，服务端可以持续向浏览器推送文本事件，浏览器通过 `EventSource` 接收：

```js
const source = new EventSource("/api/events");

source.onmessage = (event) => {
  console.log(event.data);
};
```

服务端响应头通常类似：

```http
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### WebSocket 是什么

WebSocket 会在握手后建立全双工连接，客户端和服务端都可以主动发送消息，适合高频双向通信。

### 主要区别

| 对比项 | SSE | WebSocket |
| --- | --- | --- |
| 通信方向 | 服务端到客户端单向推送 | 客户端和服务端双向通信 |
| 协议基础 | 基于 HTTP | 独立升级协议 |
| 数据格式 | 文本事件 | 文本或二进制 |
| 自动重连 | 浏览器原生支持 | 通常需要业务自己实现 |
| 适合场景 | 通知、日志、进度、AI 流式输出 | 聊天、协作、游戏、实时双向交互 |

### 选择建议

- 只需要服务端持续推送，优先考虑 SSE。
- 需要双向实时通信，选择 WebSocket。
- 需要传输二进制数据，WebSocket 更合适。
- 希望复用 HTTP 基础设施并降低复杂度，SSE 更简单。

### 注意事项

- SSE 主要适合文本数据，不适合大规模二进制传输。
- WebSocket 需要额外考虑心跳、重连、鉴权和连接管理。
- 代理、网关和服务端超时配置会影响长连接稳定性。
:::

## 31、HTTP Range 请求有什么作用
HTTP Range 请求用于请求资源的一部分内容，常见于断点续传、视频拖拽播放和大文件分片下载。

::: details 详情
### 基本请求

客户端通过 `Range` 请求头声明需要的字节范围：

```http
GET /video.mp4 HTTP/1.1
Range: bytes=0-1023
```

表示只请求资源的前 `1024` 个字节。

### 服务端响应

如果服务端支持 Range，会返回 `206 Partial Content`：

```http
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/204800
Accept-Ranges: bytes
Content-Length: 1024
```

`Content-Range` 表示当前返回的范围以及资源总大小。

### 常见场景

- 下载中断后从已下载位置继续请求。
- 视频、音频拖动进度条后只请求目标片段。
- 大文件分片下载后在客户端或服务端合并。
- CDN 边缘节点按需回源部分内容。

### 和普通 GET 的区别

- 普通 GET 通常返回完整资源，状态码是 `200`。
- Range GET 返回部分资源，状态码通常是 `206`。
- 如果范围不合法，服务端可能返回 `416 Range Not Satisfiable`。

### 注意事项

- 服务端需要正确处理范围边界和非法 Range。
- 大文件下载要结合鉴权、限速和过期链接。
- 分片下载不等于上传分片，两者方向和处理逻辑不同。
:::

## 32、Cache-Control 中 immutable 有什么作用
`immutable` 用于告诉浏览器：在缓存有效期内资源内容不会变化，刷新页面时也不需要重新验证该资源。

::: details 详情
### 基本示例

```http
Cache-Control: public, max-age=31536000, immutable
```

这表示资源可以缓存一年，并且在这一年内视为不可变资源。

### 解决什么问题

对于带 hash 的静态资源：

```txt
/assets/main.a8f3c2.js
```

文件内容变化后文件名也会变化，所以旧 URL 对应的内容可以认为不会改变。

使用 `immutable` 后，浏览器在用户刷新页面时也可以直接使用本地缓存，减少不必要的条件请求。

### 适合场景

- 带内容 hash 的 JS、CSS 文件。
- 带 hash 的字体、图片等静态资源。
- CDN 上长期缓存的不可变资源。

### 不适合场景

- HTML 入口文件。
- URL 不变但内容可能变化的资源。
- 用户相关、权限相关或敏感接口响应。

### 和 max-age 的关系

- `max-age` 表示缓存有效期。
- `immutable` 表示有效期内资源不会变化。
- 两者通常配合使用，`immutable` 不能替代 `max-age`。

### 注意事项

- 只有资源 URL 能随内容变化而变化时，才适合使用 `immutable`。
- HTML 文件通常应使用协商缓存或较短缓存，避免入口文件不更新。
- 如果误用在非 hash 资源上，可能导致用户长期访问旧资源。
:::

## 33、HTTP 中 Retry-After 响应头有什么作用
`Retry-After` 用于告诉客户端在多久之后再重试请求，常见于限流、服务维护和临时不可用场景。

::: details 详情
### 基本示例

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

表示客户端应该在 `60` 秒后再尝试请求。

也可以使用具体时间：

```http
Retry-After: Wed, 28 May 2026 10:00:00 GMT
```

### 常见状态码

- `429 Too Many Requests`：请求过于频繁。
- `503 Service Unavailable`：服务临时不可用或维护中。

### 客户端如何处理

客户端收到 `Retry-After` 后，可以：

- 暂停自动重试。
- 展示等待提示。
- 在指定时间后再发起请求。
- 避免立即重试造成服务压力更大。

### 和重试策略的关系

`Retry-After` 是服务端给出的重试建议。客户端仍应配合：

- 最大重试次数。
- 指数退避。
- 请求幂等性判断。
- 用户取消能力。

### 注意事项

- 非幂等请求不要盲目自动重试。
- 前端要避免多个请求同时在同一时间重试。
- 服务端限流时返回清晰错误码和 `Retry-After`，比只返回通用失败更友好。
:::

## 34、HTTP 中 Content-Disposition 响应头有什么作用
`Content-Disposition` 用于告诉浏览器如何处理响应内容，常见用途是控制文件以内联方式展示，还是作为附件下载，并指定下载文件名。

::: details 详情
### 基本示例

```http
Content-Disposition: attachment; filename="report.pdf"
```

表示浏览器应把响应内容作为附件下载，默认文件名为 `report.pdf`。

### 常见取值

- `inline`：尽量在浏览器中直接展示，例如图片、PDF。
- `attachment`：作为附件下载。
- `filename`：指定文件名。
- `filename*`：支持带编码的文件名，常用于中文文件名。

### 中文文件名处理

```http
Content-Disposition: attachment; filename="report.pdf"; filename*=UTF-8''%E6%8A%A5%E5%91%8A.pdf
```

`filename*` 可以更好地处理非 ASCII 字符，兼容性要求较高时通常会同时提供 `filename` 和 `filename*`。

### 常见场景

- 文件下载接口。
- 导出 Excel、CSV、PDF。
- 预览或下载用户上传的附件。
- 控制浏览器是否直接打开资源。

### 注意事项

- 文件名要做安全处理，避免换行注入和路径字符问题。
- 下载接口仍要做权限校验，不能只依赖前端隐藏入口。
- 如果响应内容类型不正确，浏览器行为可能和预期不同。
- 大文件下载还要配合流式输出、Range 请求或异步导出方案。
:::

## 35、Content-Encoding 和 Transfer-Encoding 有什么区别
`Content-Encoding` 描述响应实体内容本身使用了什么压缩或编码方式，`Transfer-Encoding` 描述消息在传输过程中的分块传输方式。

::: details 详情
### Content-Encoding

```http
Content-Encoding: br
```

表示响应体内容经过了 Brotli 压缩。浏览器需要先解压，才能得到原始内容。

常见取值：

- `gzip`
- `br`
- `deflate`

它通常和请求头 `Accept-Encoding` 配合使用。

### Transfer-Encoding

```http
Transfer-Encoding: chunked
```

表示响应体会被拆成多个 chunk 传输，服务端可以边生成边发送，而不必提前知道完整内容长度。

### 核心区别

| 对比项 | Content-Encoding | Transfer-Encoding |
| --- | --- | --- |
| 作用对象 | 响应实体内容 | HTTP 消息传输过程 |
| 典型用途 | gzip、br 压缩 | chunked 分块传输 |
| 客户端处理 | 解压得到原始内容 | 按分块组装消息体 |
| 是否影响内容语义 | 会影响实体编码 | 不改变内容语义 |

### 常见组合

```http
Content-Encoding: gzip
Transfer-Encoding: chunked
```

这表示内容经过 gzip 压缩，同时传输时使用分块发送。

### 注意事项

- `Content-Length` 通常不能和 `Transfer-Encoding: chunked` 同时使用。
- 压缩响应要配合 `Vary: Accept-Encoding`，避免缓存复用错误。
- 前端看到的响应体通常已经被浏览器解压，不一定能直接感知原始传输编码。
:::

## 36、Referrer-Policy 响应头有什么作用
`Referrer-Policy` 用于控制浏览器在跳转、加载图片、脚本等请求时，是否携带 `Referer` 请求头以及携带多少来源信息。

::: details 详情
### 为什么需要

`Referer` 可能包含当前页面 URL。如果 URL 中带有搜索词、用户标识、临时 token 等敏感信息，直接发送给第三方资源会带来隐私风险。

`Referrer-Policy` 可以限制来源信息暴露范围。

### 常见取值

- `no-referrer`：完全不发送 `Referer`。
- `origin`：只发送源，例如 `https://example.com/`。
- `same-origin`：同源请求发送，跨源请求不发送。
- `strict-origin`：HTTPS 到 HTTPS 只发送 origin，HTTPS 到 HTTP 不发送。
- `strict-origin-when-cross-origin`：同源发送完整 URL，跨源只发送 origin，降级不发送。
- `no-referrer-when-downgrade`：从 HTTPS 到 HTTP 不发送。

### 基本示例

```http
Referrer-Policy: strict-origin-when-cross-origin
```

这是现代浏览器中常见的默认策略之一，兼顾分析需求和隐私保护。

### HTML 中也可以设置

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

单个链接也可以使用：

```html
<a href="https://example.com" rel="noreferrer">跳转</a>
```

### 注意事项

- 不要把敏感信息放在 URL 查询参数中。
- 如果业务依赖来源分析，要确认策略不会影响统计。
- 防盗链不能只依赖 `Referer`，它可能为空或被伪造。
- 涉及第三方资源时，建议收敛到只发送 origin 或不发送。
:::

## 37、Permissions-Policy 响应头有什么作用
`Permissions-Policy` 用于控制页面和嵌入的 iframe 是否可以使用某些浏览器能力，例如摄像头、麦克风、定位、全屏等。

::: details 详情
### 基本示例

```http
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

表示：

- 禁止使用摄像头。
- 禁止使用麦克风。
- 只允许当前源使用定位。

### 常见能力

- `camera`
- `microphone`
- `geolocation`
- `fullscreen`
- `payment`
- `clipboard-write`
- `accelerometer`
- `gyroscope`

### 允许列表

```http
Permissions-Policy: geolocation=(self "https://map.example.com")
```

表示当前源和指定第三方源可以使用定位能力。

常见写法：

- `()`：完全禁用。
- `(self)`：只允许当前源。
- `("*")`：允许所有源，通常不建议。

### 和 iframe 的关系

即使响应头允许某个能力，iframe 还可能需要配合 `allow` 属性：

```html
<iframe src="..." allow="camera; microphone"></iframe>
```

浏览器会综合响应头、iframe allow 和用户授权结果来决定是否可用。

### 注意事项

- 它不能绕过用户授权，用户仍需要同意摄像头、定位等权限。
- 默认禁止不需要的能力，可以减少被滥用风险。
- 第三方 iframe 要按最小权限原则配置。
- 旧名称 `Feature-Policy` 已逐步被 `Permissions-Policy` 替代。
:::

## 38、HTTP/3 和 QUIC 有什么关系
HTTP/3 是基于 QUIC 的 HTTP 协议版本。QUIC 运行在 UDP 之上，提供连接建立、加密、多路复用、丢包恢复等能力，用来改善 HTTP/2 在 TCP 上的一些限制。

::: details 详情
### 为什么需要 HTTP/3

HTTP/2 已经支持多路复用，但它仍运行在 TCP 上。

如果 TCP 层发生丢包，同一条连接上的所有 HTTP/2 流都可能受到影响，这就是 TCP 层队头阻塞。

QUIC 把多路复用能力放到传输层自身处理，可以让不同流之间减少互相阻塞。

### QUIC 的特点

- 基于 UDP。
- 默认集成 TLS 加密。
- 支持多路复用。
- 连接建立更快。
- 支持连接迁移，例如网络从 Wi-Fi 切到 4G。
- 改善丢包时的队头阻塞问题。

### 和 HTTP/2 的区别

| 对比项 | HTTP/2 | HTTP/3 |
| --- | --- | --- |
| 传输基础 | TCP | QUIC over UDP |
| 加密 | 通常配合 TLS | QUIC 内置加密 |
| 队头阻塞 | TCP 层仍可能阻塞 | 流之间影响更小 |
| 连接迁移 | 不友好 | 支持更好 |

### 前端需要关注什么

大多数情况下，前端代码不需要为了 HTTP/3 改写请求方式。它更多依赖：

- 浏览器支持。
- CDN 支持。
- 服务端开启 HTTP/3。
- TLS 和证书配置正确。

### 注意事项

- HTTP/3 不是所有场景都一定更快，要看网络环境和服务端支持。
- UDP 在部分网络环境中可能被限制。
- 性能优化仍要关注缓存、资源体积、关键路径和渲染成本。
- 上线后应通过真实用户数据对比 HTTP/2 和 HTTP/3 效果。
:::

## 39、WebSocket 如何设计心跳和重连机制
WebSocket 是长连接，实际运行中可能因为网络切换、代理超时、服务重启等原因断开，因此需要心跳检测和重连机制保证连接可用。

::: details 详情
### 为什么需要心跳

WebSocket 连接可能出现“看起来没断，但实际不可用”的半开状态。

心跳可以定期确认连接是否仍然可用：

```txt
client -> ping
server -> pong
```

如果一段时间内收不到响应，就认为连接异常并主动关闭重连。

### 前端心跳示例

```js
let socket;
let heartbeatTimer;

function startHeartbeat() {
  heartbeatTimer = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "ping" }));
    }
  }, 30000);
}

function stopHeartbeat() {
  clearInterval(heartbeatTimer);
}
```

业务层可以约定 `ping/pong` 消息格式。

### 重连策略

重连不能无限立即重试，应使用退避策略：

```txt
1s -> 2s -> 4s -> 8s -> 最大 30s
```

同时可以加随机抖动，避免大量客户端同时重连。

### 需要处理的状态

- connecting：连接中。
- open：已连接。
- reconnecting：重连中。
- closed：已关闭。
- failed：重连失败。

UI 可以根据状态展示“连接中”“重连中”“离线”等提示。

### 鉴权和恢复

重连时要考虑：

- token 是否过期。
- 是否需要重新鉴权。
- 是否要恢复订阅频道。
- 是否要拉取断线期间遗漏的消息。

### 注意事项

- 页面隐藏或网络离线时可以暂停部分重连逻辑。
- 用户主动退出时不要自动重连。
- 服务端也要清理长期无心跳的连接。
- 消息要设计幂等或带序号，避免重连后重复处理。
:::

## 40、什么是点击劫持，如何防御
点击劫持是指攻击者把目标页面嵌入到透明或伪装的 iframe 中，诱导用户点击，从而在用户不知情的情况下完成敏感操作。

::: details 详情
### 攻击方式

攻击者页面可能长这样：

```html
<iframe src="https://bank.example.com/transfer"></iframe>
```

再通过 CSS 把 iframe 透明化或覆盖在诱导按钮上，用户以为自己点的是普通按钮，实际上点击了 iframe 中的敏感操作。

### 防御方式

常见防御包括：

- `X-Frame-Options`。
- `Content-Security-Policy: frame-ancestors`。
- 关键操作二次确认。
- 敏感操作使用 CSRF token 和权限校验。

### X-Frame-Options

```http
X-Frame-Options: DENY
```

表示页面不允许被任何页面嵌入 iframe。

```http
X-Frame-Options: SAMEORIGIN
```

表示只允许同源页面嵌入。

### CSP frame-ancestors

更推荐使用 CSP：

```http
Content-Security-Policy: frame-ancestors 'self' https://trusted.example.com
```

它可以更精细地控制哪些来源可以嵌入当前页面。

### 注意事项

- `frame-ancestors` 需要由被嵌入页面的服务端返回。
- 如果业务确实需要被第三方嵌入，要使用白名单而不是完全放开。
- 点击劫持防御不能替代 CSRF、防重放和权限校验。
- 登录页、支付页、后台管理页通常应禁止被 iframe 嵌入。
:::

## 41、DNS 解析过程是怎样的
DNS 用于把域名解析成 IP 地址。浏览器访问一个域名前，通常需要经过缓存查询、本地解析、递归查询和权威 DNS 返回结果等步骤。

::: details 详情
### 基本流程

常见解析顺序：

- 浏览器 DNS 缓存。
- 操作系统 DNS 缓存。
- hosts 文件。
- 本地 DNS 服务器。
- 根域名服务器。
- 顶级域名服务器。
- 权威域名服务器。

最终拿到域名对应的 IP 地址。

### 递归和迭代

客户端通常把查询交给本地 DNS 服务器。

本地 DNS 服务器再逐级查询根域名服务器、顶级域名服务器和权威 DNS。

对客户端来说，这通常是递归查询；对 DNS 服务器之间来说，常见是迭代查询。

### DNS 缓存

DNS 结果通常会缓存一段时间，缓存时间由 TTL 控制。

TTL 越长，解析更快、DNS 压力更小，但域名切换 IP 后生效更慢。

TTL 越短，切换更灵活，但解析压力更高。

### 前端优化

可以使用 DNS 预解析：

```html
<link rel="dns-prefetch" href="//cdn.example.com" />
```

适合提前解析第三方 CDN、接口域名等。

### 注意事项

- DNS 解析慢会影响首个请求建立连接。
- HTTPS 还需要 TCP 连接和 TLS 握手。
- DNS 劫持、污染和解析错误会导致访问异常。
- 多 CDN 或容灾场景要结合健康检查和调度策略。
:::

## 42、HTTP 中队头阻塞是什么
队头阻塞是指前面的请求或数据包阻塞了后续内容的处理，导致后面的内容即使已经准备好也无法被及时处理。HTTP 不同版本中队头阻塞表现不同。

::: details 详情
### HTTP/1.1 队头阻塞

HTTP/1.1 在同一个 TCP 连接上，响应通常要按请求顺序返回。

如果前一个请求处理很慢，后面的请求就可能被阻塞。

浏览器通常会对同一域名开启多个连接来缓解这个问题，但连接数仍有限。

### HTTP/2 队头阻塞

HTTP/2 支持多路复用，可以在一个 TCP 连接上并发多个 stream。

这解决了 HTTP 层面的队头阻塞。

但 HTTP/2 仍基于 TCP，如果底层 TCP 丢包，后续数据包需要等待重传，所有 stream 都可能受影响。

### HTTP/3 改进

HTTP/3 基于 QUIC。

QUIC 在传输层支持多个独立 stream，一个 stream 丢包不会阻塞其他 stream 的数据交付。

因此 HTTP/3 能缓解 TCP 层面的队头阻塞。

### 优化思路

- 使用 HTTP/2 或 HTTP/3。
- 减少大资源阻塞关键请求。
- 使用 CDN 降低丢包和延迟。
- 合理拆分关键资源和非关键资源。
- 避免单个慢接口阻塞页面关键渲染。

### 注意事项

- HTTP/2 不等于完全没有队头阻塞，TCP 层仍可能阻塞。
- HTTP/3 需要客户端、服务端和网络链路支持。
- 实际优化要结合瀑布图、网络质量和资源优先级分析。
:::

## 43、Cookie 和 Session 有什么区别
Cookie 是浏览器保存并随请求发送给服务端的数据；Session 通常是服务端保存的会话状态，客户端只保存一个会话标识。

::: details 详情
### Cookie

Cookie 存在浏览器中，会在匹配域名和路径的请求中自动携带。

常见用途：

- 会话标识。
- 用户偏好。
- 埋点标识。
- CSRF Token 辅助。

Cookie 可以设置 `HttpOnly`、`Secure`、`SameSite` 等属性增强安全性。

### Session

Session 通常存储在服务端。

客户端 Cookie 中保存一个 `session_id`，服务端根据这个 ID 查找对应会话数据。

Session 数据可以存在：

- 内存。
- Redis。
- 数据库。
- 分布式缓存。

### 主要区别

- 存储位置不同：Cookie 在客户端，Session 在服务端。
- 安全边界不同：Cookie 可被用户看到或修改，Session 数据不直接暴露。
- 扩展方式不同：Session 分布式部署需要共享存储。
- 生命周期控制不同：两者都要处理过期和清理。

### 注意事项

- 不要在 Cookie 中存放敏感明文数据。
- Session 存储要考虑分布式和高可用。
- 使用 Cookie 保存登录态时建议开启 `HttpOnly` 和 `Secure`。
- Cookie 自动携带也意味着要考虑 CSRF 风险。
:::

## 44、OAuth2 和 OIDC 有什么区别
OAuth2 主要解决授权问题，允许第三方应用在用户授权后访问资源；OIDC 建立在 OAuth2 之上，主要解决身份认证问题。

::: details 详情
### OAuth2 解决什么

OAuth2 的核心是授权。

例如用户允许一个应用访问自己的 GitHub 仓库信息。

OAuth2 中常见角色：

- Resource Owner：资源拥有者。
- Client：第三方客户端。
- Authorization Server：授权服务器。
- Resource Server：资源服务器。

客户端最终拿到 Access Token，用于访问资源接口。

### OIDC 解决什么

OIDC 是 OpenID Connect。

它在 OAuth2 基础上增加了身份层，核心是 ID Token。

ID Token 通常是 JWT，包含用户身份信息，例如：

- 用户 ID。
- 签发方。
- 受众。
- 过期时间。
- 登录时间。

### 主要区别

- OAuth2 关注授权：能访问什么资源。
- OIDC 关注认证：当前用户是谁。
- OAuth2 返回 Access Token。
- OIDC 通常还会返回 ID Token。

### 常见场景

- 第三方登录更接近 OIDC 场景。
- 授权第三方访问 API 更接近 OAuth2 场景。
- 企业 SSO 常使用 OIDC。

### 注意事项

- 不要把 Access Token 当作用户身份凭证随意解析。
- ID Token 要校验签名、过期时间、issuer 和 audience。
- 前端回调要校验 `state`，防止 CSRF。
- 授权码模式配合 PKCE 更适合公开客户端。
:::

## 45、HTTP 接口幂等性如何设计
接口幂等性是指同一个请求执行一次和执行多次，对系统产生的最终影响一致。它常用于防止重复提交、网络重试和消息重复消费导致的数据错误。

::: details 详情
### 哪些接口需要幂等

常见需要幂等的场景：

- 创建订单。
- 支付回调。
- 表单提交。
- 优惠券领取。
- 库存扣减。
- 消息消费。

查询接口通常天然幂等，但写接口需要重点设计。

### HTTP 方法语义

从语义上看：

- `GET`：应当是安全且幂等的。
- `PUT`：通常用于整体替换，适合设计成幂等。
- `DELETE`：删除同一资源多次，最终状态一致。
- `POST`：常用于创建或提交，默认不保证幂等。

实际系统仍要靠业务逻辑保证。

### 常见方案

- 幂等键：客户端生成唯一 requestId。
- 唯一约束：数据库层防重复。
- 状态机：只允许合法状态流转。
- 分布式锁：短时间互斥处理。
- 去重表：记录已处理请求。

### 注意事项

- 幂等键要有过期时间和作用范围。
- 不能只依赖前端按钮禁用。
- 数据库唯一约束是很可靠的兜底手段。
- 幂等失败要返回可理解的结果，而不是让用户反复重试。
:::
