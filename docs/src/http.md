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
- 客户端向服务端发送断开连接请求。
- 服务端收到断开连接请求后，告诉应用层去释放 `TCP` 连接。
- 服务端向客户端发送最后一个数据包 `FINBIT` ，服务端进入 `LAST-ACK` 状态。
- 客户端收到服务端的断开连接请求后，向服务端确认应答。

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
- 引入 HTTPS(HTTP + TLS) 加密。

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
  > 前端将请求发送到同源的代理服务器，由代理服务器转发请求到目标服务器，从而绕过浏览器进行请求。
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