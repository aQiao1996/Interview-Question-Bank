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
