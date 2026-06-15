# 移动端与小程序

这里用于整理移动端 H5 和小程序相关面试题，后续按移动端适配、1px、软键盘、手势、性能优化、微信小程序生命周期、登录、分包等方向追加。

## 1、移动端 H5 如何做适配
移动端 H5 适配的目标是在不同屏幕尺寸、像素密度和设备环境下，让页面保持合理的布局、字号和交互体验。

::: details 详情
### viewport 设置

移动端页面通常需要设置：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

这表示布局视口宽度等于设备宽度，并且初始缩放比例为 1。

### 常见适配方案

常见方案包括：

- 百分比布局。
- Flex 布局。
- Grid 布局。
- `rem` 适配。
- `vw/vh` 适配。
- 媒体查询。

实际项目中通常会组合使用，而不是只依赖一种方案。

### rem 适配

`rem` 基于根元素 `font-size` 计算。

例如按 375 设计稿设置：

```js
function setRootFontSize() {
  const width = document.documentElement.clientWidth;
  document.documentElement.style.fontSize = `${width / 37.5}px`;
}

setRootFontSize();
window.addEventListener("resize", setRootFontSize);
```

如果根字号是 `10px`，`1rem` 就等于 `10px`。

### vw 适配

`vw` 直接基于视口宽度：

```css
.title {
  font-size: 4vw;
}
```

它简单直接，但要注意极端宽度下字号过大或过小，可以配合 `clamp()`。

### 注意事项

- 不要只按设计稿等比缩放所有内容。
- 字号、按钮点击区域和间距都要考虑可读性和可操作性。
- 横屏、刘海屏、安全区域要单独处理。
- 移动端适配还要考虑软键盘、滚动穿透和系统字体差异。
:::

## 2、移动端 1px 边框问题如何解决
移动端 1px 边框问题通常是因为 CSS 像素和设备物理像素不一致。在高 DPR 屏幕上，`1px` CSS 边框可能显示得比设计稿期望更粗。

::: details 详情
### DPR 是什么

DPR 是设备像素比：

```txt
DPR = 物理像素 / CSS 像素
```

例如 DPR 为 2 时，`1px` CSS 像素对应 2 个物理像素。

### transform 缩放方案

常见做法是使用伪元素画边框，再缩放：

```css
.hairline {
  position: relative;
}

.hairline::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #ddd;
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}
```

在 DPR 为 2 的设备上，`scaleY(0.5)` 可以让视觉上更接近物理 1px。

### border-image 方案

也可以使用 `border-image` 或背景渐变模拟细线，但维护成本通常更高。

### viewport 缩放方案

早期也有根据 DPR 动态设置 viewport scale 的方案，但会影响整体布局和第三方组件，现代项目中不一定推荐。

### 实际选择

常见组件库通常会封装 hairline 工具类，业务中直接使用即可。

### 注意事项

- 不是所有场景都必须追求物理 1px。
- 缩放方案要注意圆角、四边框和定位问题。
- 不同 DPR 下可能需要不同缩放比例。
- UI 设计稿、设备显示效果和可维护性要一起权衡。
:::

## 3、微信小程序页面生命周期有哪些
微信小程序页面生命周期用于描述页面从加载、显示、隐藏到卸载的过程。理解生命周期有助于管理数据请求、订阅、定时器和资源释放。

::: details 详情
### 常见生命周期

页面中常见生命周期包括：

- `onLoad`：页面加载时触发。
- `onShow`：页面显示时触发。
- `onReady`：页面初次渲染完成时触发。
- `onHide`：页面隐藏时触发。
- `onUnload`：页面卸载时触发。

### onLoad

`onLoad` 通常用于读取路由参数和初始化数据：

```js
Page({
  onLoad(options) {
    console.log(options.id);
  },
});
```

它一个页面实例通常只触发一次。

### onShow

`onShow` 在页面显示时触发。

从其他页面返回当前页面时，也可能触发 `onShow`，适合刷新需要重新展示的数据。

### onHide 和 onUnload

`onHide` 表示页面被隐藏，例如跳转到其他页面。

`onUnload` 表示页面被销毁，适合清理定时器、取消订阅、释放资源。

### 和应用生命周期的区别

小程序还有应用级生命周期，例如：

- `onLaunch`。
- `onShow`。
- `onHide`。

应用生命周期关注整个小程序，页面生命周期关注具体页面。

### 注意事项

- 不要把所有请求都放在 `onShow`，否则返回页面时可能重复请求。
- 定时器和监听器要在页面隐藏或卸载时清理。
- 页面参数通常在 `onLoad` 中读取。
- 页面栈返回不会重新触发 `onLoad`，但可能触发 `onShow`。
:::

## 4、移动端安全区域 safe-area 如何适配
安全区域适配主要用于处理刘海屏、圆角屏和底部手势条，避免内容被系统区域遮挡。

::: details 详情
### viewport-fit

在 iOS Safari 中，需要设置：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```

`viewport-fit=cover` 允许页面内容延伸到整个屏幕区域。

### env 变量

CSS 可以使用安全区域变量：

```css
.page {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

常见变量：

- `safe-area-inset-top`。
- `safe-area-inset-right`。
- `safe-area-inset-bottom`。
- `safe-area-inset-left`。

### 底部按钮适配

底部固定按钮常见写法：

```css
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
```

这样可以避免按钮贴到手势条区域。

### 小程序场景

小程序中也要关注状态栏、导航栏和胶囊按钮区域。

通常需要结合系统信息计算顶部安全距离。

### 注意事项

- 不要只在 iPhone 机型上硬编码高度。
- 横屏时左右安全区域也可能变化。
- 固定底部栏、弹窗、吸底按钮都要考虑安全区域。
- Android 不同机型也可能有异形屏适配问题。
:::

## 5、移动端软键盘会带来哪些问题
移动端软键盘弹出时会影响视口高度、滚动位置和固定定位元素，常见于登录页、表单页、聊天输入框等场景。

::: details 详情
### 常见问题

软键盘可能导致：

- 输入框被遮挡。
- fixed 底部按钮位置异常。
- 页面被压缩或顶起。
- 滚动位置错乱。
- 键盘收起后页面没有恢复。

不同系统和浏览器表现可能不一致。

### 输入框被遮挡

可以在输入框聚焦后滚动到可视区域：

```js
input.addEventListener("focus", () => {
  setTimeout(() => {
    input.scrollIntoView({ block: "center" });
  }, 300);
});
```

延迟是为了等待键盘动画完成。

### fixed 元素问题

底部 fixed 元素在键盘弹起时可能被遮挡或位置异常。

常见处理：

- 键盘弹起时隐藏底部按钮。
- 使用 sticky 或普通布局替代 fixed。
- 根据视口高度变化调整布局。

### 检测视口变化

可以监听：

```js
window.visualViewport?.addEventListener("resize", () => {
  console.log(window.visualViewport.height);
});
```

`visualViewport` 能更准确感知可视区域变化，但兼容性要确认。

### 注意事项

- iOS 和 Android 表现不同，要真机验证。
- 不要只依赖 `window.innerHeight`。
- 聊天输入框要特别处理键盘弹起后的滚动到底部。
- 表单提交按钮要避免被键盘遮挡。
:::

## 6、微信小程序登录流程是怎样的
微信小程序登录通常通过 `wx.login` 获取临时 code，再由后端使用 code 换取用户标识，并建立业务登录态。

::: details 详情
### 基本流程

```txt
小程序调用 wx.login
-> 获取临时 code
-> 前端把 code 发送给后端
-> 后端请求微信服务端换取 openid/session_key
-> 后端创建或查询用户
-> 后端返回业务 token
-> 小程序保存业务登录态
```

### 前端代码示例

```js
wx.login({
  success(res) {
    if (res.code) {
      wx.request({
        url: "/api/login",
        method: "POST",
        data: { code: res.code },
      });
    }
  },
});
```

### code 的特点

`code` 是临时凭证：

- 有有效期。
- 只能使用一次。
- 不能直接当作用户身份。

真正的身份校验应该由后端完成。

### openid 和 unionid

- `openid`：用户在某个小程序下的唯一标识。
- `unionid`：用户在同一开放平台主体下的统一标识。

是否能获取 unionid 取决于开放平台绑定等条件。

### 注意事项

- `session_key` 不能返回给前端。
- 前端保存的是业务 token，不是微信 session_key。
- 用户信息授权和登录不是一回事。
- 业务 token 要有过期和刷新策略。
:::

## 7、微信小程序为什么要做分包
小程序分包用于把不同页面和资源拆成多个包，减少主包体积，加快首次启动速度，并满足平台包体积限制。

::: details 详情
### 为什么需要分包

小程序项目变大后，主包可能包含大量低频页面和资源。

如果全部放在主包中，会导致：

- 首次下载慢。
- 启动慢。
- 超过平台体积限制。
- 用户进入首页前加载无关资源。

### 分包配置

小程序通常在配置中声明分包：

```json
{
  "pages": ["pages/index/index"],
  "subpackages": [
    {
      "root": "packageA",
      "pages": ["pages/detail/detail"]
    }
  ]
}
```

主包只保留启动必需页面和公共资源，低频页面放入分包。

### 独立分包

独立分包可以不依赖主包直接启动，适合活动页、分享页等场景。

但独立分包能使用的公共资源有限，需要单独规划。

### 分包预下载

可以配置进入某些页面后预下载分包，减少用户真正进入分包页面时的等待。

### 注意事项

- 主包要尽量小，保留首屏必要内容。
- 公共资源放主包会增加主包体积。
- 分包之间不能随意互相引用资源。
- 分包策略要结合页面访问频率和业务路径设计。
:::

## 8、移动端常见触摸事件有哪些
移动端触摸事件用于处理手指点击、滑动、拖拽等交互。常见事件包括 `touchstart`、`touchmove`、`touchend` 和 `touchcancel`。

::: details 详情
### 常见事件

- `touchstart`：手指触摸屏幕时触发。
- `touchmove`：手指在屏幕上移动时触发。
- `touchend`：手指离开屏幕时触发。
- `touchcancel`：触摸被系统打断时触发。

### 触摸点信息

事件对象中常见集合：

- `touches`：当前屏幕上的所有触摸点。
- `targetTouches`：当前元素上的触摸点。
- `changedTouches`：本次事件变化的触摸点。

### 滑动距离示例

```js
let startX = 0;
let startY = 0;

element.addEventListener("touchstart", event => {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

element.addEventListener("touchend", event => {
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  console.log(deltaX, deltaY);
});
```

### passive

浏览器为了优化滚动性能，部分触摸事件默认可能倾向 passive。

如果需要在 `touchmove` 中阻止滚动，要确认监听配置：

```js
element.addEventListener("touchmove", handler, { passive: false });
```

### 注意事项

- 手势识别要设置阈值，避免轻微抖动误判。
- 横向滑动和纵向滚动容易冲突。
- 复杂手势可以考虑成熟手势库。
- 移动端还要考虑点击延迟、滚动穿透和可点击区域大小。
:::

## 9、移动端滚动穿透是什么，如何解决
滚动穿透是指弹窗或遮罩层出现后，用户滑动弹窗内容或遮罩时，底层页面也跟着滚动。

::: details 详情
### 出现场景

常见场景：

- 弹窗。
- 抽屉。
- 半屏面板。
- 图片预览。
- 选择器浮层。

用户期望只滚动当前浮层，但底层页面也发生滚动，就属于滚动穿透。

### body 锁定

打开弹窗时可以锁定 body：

```js
const scrollTop = window.scrollY;

document.body.style.position = "fixed";
document.body.style.top = `-${scrollTop}px`;
document.body.style.width = "100%";

function unlock() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollTop);
}
```

这样可以避免关闭弹窗后页面位置丢失。

### 阻止 touchmove

也可以在遮罩层阻止默认滚动：

```js
mask.addEventListener(
  "touchmove",
  event => {
    event.preventDefault();
  },
  { passive: false },
);
```

但要注意不要阻止弹窗内部需要滚动的区域。

### 内部滚动区域

如果弹窗内部可以滚动，要处理滚动边界，避免内部滚到顶部或底部后继续带动外层滚动。

### 注意事项

- iOS Safari 上滚动穿透问题更常见。
- 锁 body 时要恢复原滚动位置。
- 不要全局粗暴阻止所有 touchmove。
- 复杂弹窗建议封装统一滚动锁工具。
:::

## 10、小程序性能优化有哪些常见手段
小程序性能优化主要围绕启动速度、包体积、渲染性能、网络请求和用户交互体验展开。

::: details 详情
### 启动优化

常见方式：

- 减小主包体积。
- 使用分包。
- 分包预下载。
- 精简首页依赖。
- 避免启动时请求过多接口。

首屏必须使用的资源放主包，低频页面放分包。

### 渲染优化

小程序渲染优化可以关注：

- 减少 `setData` 次数。
- 减少单次 `setData` 数据量。
- 避免频繁更新大列表。
- 使用分页或虚拟列表。
- 避免无意义的组件重渲染。

`setData` 会涉及逻辑层到视图层通信，数据量过大会影响性能。

### 网络优化

常见方式：

- 合并接口。
- 缓存稳定数据。
- 请求失败重试。
- 图片使用合适尺寸。
- 使用 CDN。

### 图片优化

图片往往是包体和页面加载的大头。

可以：

- 使用 WebP 等格式。
- 按需加载。
- 使用缩略图。
- 避免把大量图片放入主包。

### 注意事项

- 不要在首页加载低频业务数据。
- 长列表要分页或懒加载。
- 定时器、监听器要及时清理。
- 优化前后要用小程序开发者工具性能面板验证。
:::

## 11、移动端图片懒加载如何实现
图片懒加载是指图片进入可视区域附近时再加载，避免首屏一次性加载大量图片，提升页面首屏速度并节省流量。

::: details 详情
### 原生 loading

现代浏览器支持：

```html
<img src="image.jpg" loading="lazy" alt="图片" />
```

这是最简单的懒加载方式，但兼容性和触发策略由浏览器决定。

### IntersectionObserver

更可控的方式是使用 `IntersectionObserver`：

```js
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  }
});

document.querySelectorAll("img[data-src]").forEach(img => {
  observer.observe(img);
});
```

HTML：

```html
<img data-src="image.jpg" alt="图片" />
```

### 提前加载

可以通过 `rootMargin` 提前加载：

```js
new IntersectionObserver(callback, {
  rootMargin: "200px",
});
```

这样图片快进入视口时就开始请求，减少用户看到空白的概率。

### 占位和尺寸

图片懒加载要设置宽高或占位，避免图片加载后页面布局突然抖动。

### 注意事项

- 首屏关键图片不要懒加载。
- 长列表图片要结合虚拟列表或分页。
- 图片要使用合适尺寸和格式。
- 懒加载失败要有兜底图。
:::

## 12、移动端如何适配刘海屏和安全区域
刘海屏、圆角屏和全面屏设备会带来顶部、底部或左右安全区域问题。适配目标是让内容不被系统状态栏、Home Indicator 或屏幕裁切区域遮挡。

::: details 详情
### viewport-fit

H5 页面需要在 viewport 中开启安全区域适配：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

`viewport-fit=cover` 表示页面可以延伸到整个屏幕区域。

### env 安全区域变量

CSS 中可以使用安全区域变量：

```css
.page {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

常见变量包括：

- `safe-area-inset-top`
- `safe-area-inset-right`
- `safe-area-inset-bottom`
- `safe-area-inset-left`

### 底部固定按钮

底部按钮要避开 Home Indicator：

```css
.footer {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

### 注意事项

- 不要把关键按钮贴到屏幕最底部。
- 全屏弹窗、底部导航和吸底按钮都要考虑安全区域。
- 小程序和 App WebView 可能还有平台自己的安全区域 API。
- 横屏和折叠屏下也要验证左右安全区域。
:::

## 13、移动端手势冲突如何处理
移动端手势冲突常见于横向轮播、纵向滚动、下拉刷新、侧滑返回和缩放拖拽同时存在的页面。处理核心是明确手势优先级，并尽量减少互相抢事件。

::: details 详情
### 常见冲突

- 横向轮播和页面纵向滚动冲突。
- 弹窗内部滚动和页面滚动冲突。
- 自定义侧滑和系统返回手势冲突。
- 地图、图片缩放和页面滚动冲突。
- 下拉刷新和列表滚动冲突。

### 判断方向

可以在触摸开始时记录坐标，在移动时判断方向：

```js
let startX = 0;
let startY = 0;

el.addEventListener("touchstart", event => {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

el.addEventListener("touchmove", event => {
  const touch = event.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // 横向手势
  }
});
```

### CSS 辅助

可以使用 `touch-action` 告诉浏览器允许哪些默认手势：

```css
.carousel {
  touch-action: pan-y;
}
```

表示保留纵向滚动，横向手势交给组件处理。

### 注意事项

- 不要滥用 `preventDefault`，可能破坏页面滚动和浏览器默认行为。
- 手势判断要设置阈值，避免轻微抖动就触发。
- iOS 系统侧滑返回区域要尽量避让。
- 复杂手势建议使用成熟手势库，减少兼容性问题。
:::

## 14、移动端弱网场景如何优化体验
移动端网络环境不稳定，可能出现高延迟、丢包、断网和网络切换。弱网优化的目标是减少等待感、降低失败率，并让用户明确知道当前状态。

::: details 详情
### 请求层优化

常见方式：

- 设置合理超时。
- 关键请求失败重试。
- 非关键请求降级。
- 合并请求减少连接开销。
- 使用分页和按需加载。
- 上传下载支持断点续传。

重试要控制次数和退避时间，避免弱网下反复制造流量。

### 缓存和离线

可以缓存稳定数据：

- 静态资源使用 HTTP 缓存。
- 业务字典和配置做本地缓存。
- 列表页保留上一次成功结果。
- 离线时展示缓存内容和离线提示。

对强实时数据，要标明数据更新时间，避免误导用户。

### 交互体验

弱网下要给用户明确反馈：

- 展示骨架屏或加载状态。
- 超时后给出重试按钮。
- 提交中禁用重复点击。
- 上传进度可见。
- 失败后保留用户已输入内容。

### 注意事项

- 不要无限重试。
- 弱网优化要区分关键链路和非关键链路。
- 网络恢复后可以自动刷新关键数据，但要避免打断用户操作。
- 需要用真机和网络模拟工具验证，而不是只在高速网络下测试。
:::

## 15、微信小程序授权流程要注意什么
微信小程序授权涉及用户隐私和平台能力调用，例如手机号、头像昵称、位置、相册和摄像头。设计时要遵守最小授权原则，并把授权失败作为正常分支处理。

::: details 详情
### 授权原则

小程序授权要注意：

- 用到能力时再申请，不要一进页面就连续弹授权。
- 明确告诉用户为什么需要授权。
- 只申请当前功能必要权限。
- 授权失败后提供可用的降级路径。
- 不要把授权和登录混为一谈。

### 常见权限

常见授权能力包括：

- 获取手机号。
- 获取用户头像昵称。
- 获取地理位置。
- 使用摄像头。
- 访问相册。
- 订阅消息。

不同能力的授权方式和平台规则可能不同，要按微信官方能力分别处理。

### 拒绝授权怎么办

用户拒绝授权后，可以：

- 展示原因说明。
- 允许继续使用非核心功能。
- 提供手动重新授权入口。
- 对核心能力给出明确提示。

不要用死循环弹窗逼用户授权。

### 注意事项

- 授权结果可能变化，每次使用关键能力前要确认状态。
- 服务端仍要校验用户身份和业务权限。
- 隐私相关数据要按需存储，并控制访问范围。
- 授权文案要贴合具体场景，避免空泛描述。
:::

## 16、H5 如何唤起 App
H5 唤起 App 通常通过 URL Scheme、Universal Links 或 App Links 实现。目标是在用户已安装 App 时打开 App，未安装时引导下载或继续使用 H5。

::: details 详情
### URL Scheme

URL Scheme 是 App 自定义协议：

```txt
myapp://product?id=123
```

H5 可以尝试跳转这个地址唤起 App。

缺点是没有安装 App 时体验不稳定，不同浏览器行为也不同。

### Universal Links 和 App Links

iOS Universal Links 和 Android App Links 使用 HTTPS 链接唤起 App。

优点：

- 链接本身是普通 HTTPS。
- 未安装 App 时可以打开网页。
- 安全性和用户体验更好。

缺点是需要 App、域名和配置文件配合。

### 兜底方案

常见兜底：

- 定时检测页面是否进入后台。
- 未唤起时跳转下载页。
- 保留 H5 继续访问入口。
- 在微信等受限环境提示用浏览器打开。

### 注意事项

- 不同浏览器和系统版本行为差异很大，要真机测试。
- 唤起动作最好由用户点击触发，自动唤起容易被拦截。
- 参数要做签名或校验，避免被篡改。
- 不要频繁弹唤起，容易打扰用户。
:::

## 17、H5 和 App WebView 如何通信
H5 和 App WebView 通信通常通过 JSBridge 实现。H5 调用原生能力，原生也可以向 H5 注入回调或触发事件。

::: details 详情
### 常见方式

常见通信方式：

- URL Scheme 拦截。
- 注入全局对象。
- `postMessage`。
- WebView 提供的 bridge API。
- 原生执行 JS 回调。

不同平台和容器实现细节不同，需要约定统一协议。

### 调用示例

H5 可以封装统一方法：

```js
window.NativeBridge.call("getUserInfo", {
  callbackId: "cb_001",
});
```

原生处理后再回调：

```js
window.__bridgeCallback("cb_001", {
  name: "Tom",
});
```

### 协议设计

Bridge 协议通常包括：

- 方法名。
- 参数。
- callbackId。
- 成功或失败状态。
- 错误码。
- 版本号。

这样可以支持异步回调、错误处理和能力演进。

### 注意事项

- H5 调用原生能力前要判断 bridge 是否 ready。
- 参数要校验，不能让任意页面调用敏感能力。
- 原生能力要做权限控制和域名白名单。
- Bridge 调用要有超时处理，避免 Promise 永远 pending。
:::

## 18、移动端 H5 如何调试
移动端 H5 调试通常需要结合真机、远程调试、抓包工具和日志上报。重点是复现真实环境中的系统版本、浏览器内核、网络和 WebView 差异。

::: details 详情
### 真机调试

常见方式：

- iOS 使用 Safari Web Inspector。
- Android 使用 Chrome DevTools 远程调试。
- 小程序使用开发者工具和真机预览。
- App WebView 需要原生开启调试能力。

模拟器有帮助，但不能完全替代真机。

### 抓包

可以使用抓包工具查看：

- 请求是否发出。
- 响应状态码。
- Header 和 Cookie。
- HTTPS 证书问题。
- 接口耗时。

常见工具有 Charles、Fiddler、Proxyman、mitmproxy。

### 日志

线上问题需要日志辅助：

- JS 错误日志。
- 接口错误日志。
- 设备信息。
- 页面路径。
- 用户操作轨迹。
- WebView 版本。

日志要注意脱敏。

### 注意事项

- 移动端问题经常和系统版本、机型、WebView 内核有关。
- 调试环境和生产环境的域名、证书、缓存可能不同。
- 弱网、横竖屏、输入法和系统手势都要纳入验证。
- App 内嵌 H5 问题要同时排查前端和原生容器。
:::

## 19、移动端 H5 白屏如何排查
移动端 H5 白屏通常和资源加载失败、JS 执行错误、容器兼容性、缓存异常或接口阻塞有关。排查要先确认是页面没加载、资源没加载，还是脚本运行后崩溃。

::: details 详情
### 常见原因

- HTML 入口加载失败。
- JS 或 CSS 资源 404。
- CDN 缓存旧版本。
- JS 语法不兼容低版本 WebView。
- 首屏接口长时间无响应。
- 路由匹配失败。
- App WebView 注入脚本异常。
- 本地缓存或离线包损坏。

### 排查顺序

可以按顺序检查：

- 页面 URL 是否正确。
- HTML 是否返回 200。
- 静态资源是否加载成功。
- Console 是否有 JS 错误。
- Network 是否有接口失败。
- 是否只在特定机型或系统出现。
- 是否和版本发布、缓存刷新有关。

### 线上监控

白屏最好通过监控提前发现：

- JS 错误上报。
- 资源加载错误上报。
- 首屏超时检测。
- 页面心跳。
- 用户设备和 WebView 信息。

### 注意事项

- 发布时要保证 HTML 和静态资源版本一致。
- 低版本 Android WebView 要关注语法兼容。
- 首屏关键 JS 失败要有兜底提示。
- App 内 H5 要排查原生容器、离线包和网络代理影响。
:::

## 20、微信小程序支付流程是怎样的
微信小程序支付通常由小程序端发起下单请求，服务端调用微信支付统一下单接口生成支付参数，小程序端再调用支付 API 完成用户付款。

::: details 详情
### 基本流程

常见流程：

1. 小程序端提交订单。
2. 服务端创建业务订单。
3. 服务端调用微信支付接口生成预支付单。
4. 服务端返回支付参数给小程序端。
5. 小程序端调用 `wx.requestPayment`。
6. 微信支付完成后通知服务端。
7. 服务端验签并更新订单状态。

订单状态应以服务端支付回调为准。

### 前端职责

小程序端主要负责：

- 发起下单。
- 调起支付。
- 展示支付结果。
- 支付失败或取消后的交互处理。

前端不能直接决定订单是否支付成功。

### 服务端职责

服务端需要：

- 生成订单号。
- 调用微信支付。
- 保存预支付信息。
- 接收支付回调。
- 验证签名。
- 幂等更新订单状态。

### 注意事项

- 支付回调可能重复到达，必须做幂等。
- 不要只依赖前端支付成功回调更新订单。
- 金额、商品信息必须由服务端计算，不能信任前端传值。
- 订单超时关闭和退款流程也要纳入状态机设计。
:::

## 21、App 内 H5 离线包如何设计
离线包是把 H5 静态资源提前下载到 App 本地，打开页面时优先读取本地资源，从而提升加载速度并降低弱网影响。

::: details 详情
### 基本流程

常见流程：

1. 服务端发布离线包和版本清单。
2. App 启动或空闲时检查更新。
3. 下载 zip 或资源包。
4. 校验签名和完整性。
5. 解压到本地目录。
6. WebView 加载本地资源。
7. 接口请求仍走线上服务。

### 版本管理

离线包需要管理：

- 版本号。
- 适用 App 版本。
- 资源 hash。
- 下载地址。
- 灰度规则。
- 回滚版本。

版本清单要支持快速下线异常包。

### 更新策略

常见策略：

- 启动时检查。
- Wi-Fi 下预下载。
- 后台静默更新。
- 首次打开页面前下载。
- 强制更新或可选更新。

不同业务要平衡实时性和用户等待时间。

### 注意事项

- 离线包必须做完整性校验和签名校验。
- HTML 和 JS/CSS 资源版本要一致。
- 线上接口要兼容旧离线包。
- 出现白屏时要能回退到线上资源或旧版本离线包。
:::

## 22、移动端 WebView 缓存要注意什么
WebView 缓存可以提升页面加载速度，但如果缓存策略不清晰，也容易导致用户拿到旧页面、资源版本不一致或问题难以复现。

::: details 详情
### 常见缓存

移动端 WebView 可能涉及：

- HTTP 缓存。
- Service Worker 缓存。
- App 离线包。
- WebView 内核缓存。
- localStorage、IndexedDB。
- 图片缓存。

不同缓存层可能同时存在，排查问题时要逐层确认。

### 资源版本

推荐做法：

- JS/CSS 文件名带 hash。
- HTML 入口不长期强缓存。
- 离线包有独立版本号。
- 资源发布后保持一段时间可访问。
- 回滚时保证入口和资源版本匹配。

### 清缓存

常见清缓存方式：

- App 提供清缓存入口。
- 版本升级时清理特定目录。
- 离线包按版本替换。
- WebView 重新加载线上入口。

不要随意清空所有缓存，否则会影响性能和用户数据。

### 注意事项

- 白屏问题常和 HTML 缓存旧版本有关。
- App WebView 的缓存行为可能和系统浏览器不同。
- 离线包和 HTTP 缓存要有优先级规则。
- 缓存命中情况要能通过日志或调试工具观察。
:::

## 23、移动端定位权限如何处理
移动端定位涉及用户隐私和系统权限，使用时要明确告知用途、按需申请权限，并处理拒绝授权、定位失败和精度不足等情况。

::: details 详情
### 使用前说明

申请定位前，应让用户知道：

- 为什么需要定位。
- 定位会用于什么功能。
- 不授权是否还能继续使用。
- 是否会持续定位。

不要在页面刚打开时无说明地直接弹系统授权。

### 权限状态

常见状态包括：

- 未询问。
- 已允许。
- 已拒绝。
- 系统定位关闭。
- 仅允许使用期间。
- 精确定位关闭。

不同平台权限模型不同，要按平台能力处理。

### 失败处理

定位失败时可以：

- 提供手动选择城市或地址。
- 提示用户检查系统定位开关。
- 允许使用默认位置。
- 重试但限制频率。
- 展示明确错误信息。

不能让页面卡死在定位中。

### 注意事项

- 定位数据属于敏感信息，要按需存储。
- 后端接口也要做权限和用途控制。
- 持续定位会明显增加耗电。
- 小程序、浏览器和 App WebView 的授权方式差异较大，要分别测试。
:::
