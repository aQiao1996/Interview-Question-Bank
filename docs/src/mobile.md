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
