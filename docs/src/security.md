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
