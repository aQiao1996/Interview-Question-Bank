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
