# 安全

这里用于整理安全相关面试题，后续按 XSS、CSRF、CSP、点击劫持、JWT、OAuth、SSO、权限模型、接口签名、防重放、供应链安全等方向追加。

## 1、什么是 XSS，如何防御
XSS 是跨站脚本攻击，攻击者把恶意脚本注入到页面中，当用户访问页面时脚本被浏览器执行，从而窃取信息或执行恶意操作。

::: details 详情
### 常见类型

- 存储型 XSS：恶意内容存入数据库，用户访问时触发。
- 反射型 XSS：恶意内容来自 URL 或请求参数，服务端直接拼回页面。
- DOM 型 XSS：前端脚本把不可信数据写入 DOM 导致执行。

### 危害

XSS 可能导致：

- 窃取 token 或 cookie。
- 冒充用户操作。
- 修改页面内容。
- 劫持跳转。
- 读取页面敏感信息。

### 防御方式

核心原则是不要把不可信内容当作代码执行。

常见手段包括：

- 输出时做 HTML 转义。
- 避免直接使用 `innerHTML`。
- 对富文本使用白名单过滤。
- 设置 Cookie 的 `HttpOnly`。
- 使用 CSP 限制脚本来源。
- 对 URL、样式、事件属性等特殊上下文单独处理。

### 示例

危险写法：

```js
container.innerHTML = userInput;
```

更安全的写法：

```js
container.textContent = userInput;
```

### 注意事项

- 输入校验不能替代输出编码。
- 富文本不能简单转义，要做标签和属性白名单。
- `HttpOnly` 不能阻止 XSS 发生，但能降低 cookie 被读取的风险。
- CSP 是纵深防御，不应作为唯一防线。
:::

## 2、什么是 CSRF，如何防御
CSRF 是跨站请求伪造攻击。攻击者诱导已登录用户访问恶意页面，恶意页面利用用户浏览器自动携带 Cookie 的特性，向目标站点发起非用户本意的请求。

::: details 详情
### 攻击条件

CSRF 通常需要满足：

- 用户已经登录目标网站。
- 登录态依赖 Cookie 自动携带。
- 目标接口缺少额外校验。
- 攻击者能诱导用户打开恶意页面。

### 示例

恶意页面中可能放置：

```html
<img src="https://bank.example.com/transfer?to=attacker&amount=1000" />
```

如果目标站点只依赖 Cookie 判断用户身份，就可能执行非用户本意的操作。

### 防御方式

常见防御包括：

- CSRF Token。
- SameSite Cookie。
- 校验 Origin 或 Referer。
- 关键操作二次确认。
- 避免 GET 接口执行状态变更。

### CSRF Token

服务端生成随机 token，页面请求时带上 token：

```txt
Cookie: session=xxx
Header: X-CSRF-Token: random-token
```

攻击站点通常无法读取目标站点页面中的 token，因此伪造请求无法通过校验。

### SameSite

```http
Set-Cookie: session=xxx; SameSite=Lax
```

`SameSite` 可以限制跨站请求是否携带 Cookie。

### 注意事项

- CSRF 防御重点在服务端，不能只靠前端隐藏按钮。
- XSS 可以绕过很多 CSRF 防御，因此 XSS 和 CSRF 要一起防。
- Token 要和用户会话绑定，并有合理生命周期。
- 敏感操作应避免使用 GET 请求。
:::

## 3、CSP 是什么，能解决什么安全问题
CSP 是内容安全策略，用于限制页面可以加载和执行哪些资源，常用于降低 XSS、数据注入和资源劫持带来的风险。

::: details 详情
### 基本作用

CSP 通过 HTTP 响应头声明安全策略：

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

这表示默认只允许加载同源资源，脚本也只允许同源脚本。

### 常见指令

- `default-src`：默认资源加载策略。
- `script-src`：脚本来源。
- `style-src`：样式来源。
- `img-src`：图片来源。
- `connect-src`：接口、WebSocket 等连接来源。
- `frame-ancestors`：限制页面被哪些来源 iframe 嵌入。

### 防御 XSS

如果页面配置了严格的 `script-src`，即使攻击者注入了内联脚本，也可能因为 CSP 限制而无法执行。

例如：

```http
Content-Security-Policy: script-src 'self'
```

这会阻止很多外部恶意脚本和内联脚本执行。

### Report-Only 模式

上线前可以使用：

```http
Content-Security-Policy-Report-Only: default-src 'self'
```

它只上报违规，不真正拦截，适合灰度观察。

### 注意事项

- CSP 是纵深防御，不能替代输入校验和输出编码。
- 策略太宽松效果有限，例如大量使用 `unsafe-inline`。
- 策略太严格可能导致正常资源加载失败。
- 需要结合真实资源域名、监控和上报逐步收紧。
:::

## 4、JWT 由哪几部分组成，使用时要注意什么
JWT 是一种常见的令牌格式，通常用于身份认证和授权信息传递。它由 Header、Payload 和 Signature 三部分组成。

::: details 详情
### 组成结构

JWT 结构如下：

```txt
header.payload.signature
```

### Header

Header 描述令牌类型和签名算法，例如：

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

### Payload

Payload 存放声明信息，例如：

```json
{
  "sub": "user-1",
  "role": "admin",
  "exp": 1710000000
}
```

注意 Payload 只是 Base64URL 编码，不是加密，不能存放密码、手机号等敏感信息。

### Signature

Signature 用于校验令牌是否被篡改。

服务端会用密钥或私钥对 Header 和 Payload 签名，验证时重新计算签名并比对。

### 优点

- 服务端可以不存储 session。
- 适合分布式系统。
- 可以携带少量用户声明。
- 跨服务验证方便。

### 注意事项

- JWT 不能随便存敏感数据。
- 要设置合理过期时间。
- 密钥泄露会导致严重风险。
- 服务端必须校验签名和过期时间。
- 退出登录和强制失效需要额外设计黑名单或版本号机制。
:::
