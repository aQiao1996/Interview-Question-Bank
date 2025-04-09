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