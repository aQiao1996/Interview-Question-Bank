---
lang: zh-CN
title: css
description: css面试题
---

# css

## 1、常见的 CSS 选择器有哪些
::: details 详情
|选择器类型|	示例|	说明|
|----|------|------|
|元素选择器|`p`|选择所有 `<p>` 元素|
|类选择器|`.button`|选择所有 `class="button"` 的元素|
|ID 选择器|`#header`|选择 `id="header"` 的元素|
|通用选择器|`*`|选择页面中的所有元素|
|后代选择器|`div p`|选择 `<div>` 内的所有 `<p>` 元素|
|子元素选择器|`div > p`|选择 `<div>` 的直接子元素 `<p>`|
|相邻兄弟选择器|`h1 + p`|选择紧接在 `<h1>` 后面的 `<p>` 元素|
|通用兄弟选择器|`h1 ~ p`|选择所有紧跟在 `<h1>` 后面的 `<p>` 元素|
|属性选择器|`a[href]`|选择具有 `href` 属性的所有 `<a>` 元素|
|`:hover`|`a:hover`|选择鼠标悬停时的 `<a>` 元素|
|`:first-child`|`p:first-child`|选择父元素中的第一个 `<p>` 元素|
|`:nth-child(n)`|`li:nth-child(odd)`|选择父元素中所有奇数位置的 `<li>` 元素|
|`::before`|`p::before { content: "Note: "; }`|在每个 `<p>` 元素的前面插入 "Note: "|
|`::after`|`p::after { content: "."; }`|在每个 `<p>` 元素的后面插入一个句点|
|:`not()`|`p:not(.highlight)`|选择所有不具有 `highlight` 类的 `<p>` 元素|
:::

## 2、line-height 如何继承
::: details 详情
`line-height` 不同类型的值，继承规则是不一样的。
- 写具体的数值，如 30px，则继承该数值。
```css
div {
  line-height: 30px;
}
p {
  /* 继承具体数值 30px */
  line-height: inherit;
}
```
- 写百分比，如 200% ，则继承当前计算出来的值（即父元素的 `font-size` * 百分比）。
```css
div {
  font-size: 16px;
  line-height: 200%; /* 计算后为 32px */
}
p {
  /* 继承计算后的值 32px */
  line-height: inherit;
}
```
- 写比例，如 2 或 1.5 ，则继承比例。
```css
div {
  font-size: 16px;
  line-height: 1.5; /* 计算后为 24px */
}
p {
  /* 继承比例值 1.5 */
  line-height: inherit;
}
```
:::

## 3、如何让一个盒子垂直居中
::: details 详情
- 使用 `flex` 布局。
  > 这是最常用的方法，适用于现代浏览器。
```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 300px; /* 父容器高度 */
  border: 1px solid #000;
}
.box {
  width: 100px;
  height: 100px;
  background-color: lightblue;
}
```
- 使用 `grid` 布局。
  > grid 布局可以通过 place-items 属性轻松实现水平和垂直居中。
```css
.container {
  display: grid;
  place-items: center; /* 水平和垂直居中 */
  height: 300px; /* 父容器高度 */
  border: 1px solid #000;
}
.box {
  width: 100px;
  height: 100px;
  background-color: lightgreen;
}
```
- 使用 `position` 和 `transform`。
  > 适用于固定宽高的盒子。
```css
.container {
  position: relative;
  height: 300px; /* 父容器高度 */
  border: 1px solid #000;
}
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 水平和垂直居中 */
  width: 100px;
  height: 100px;
  background-color: lightcoral;
}
```
- 使用 `table` 布局。
  > 适用于需要兼容旧版浏览器的场景。
```css
.container {
  display: table;
  width: 100%;
  height: 300px; /* 父容器高度 */
  text-align: center; /* 水平居中 */
  border: 1px solid #000;
}
.box {
  display: table-cell;
  vertical-align: middle; /* 垂直居中 */
  width: 100px;
  height: 100px;
  background-color: lightyellow;
}
```
- 使用 `line-height`。
  > 适用于单行文字或高度固定的盒子。
```css
.container {
  height: 300px; /* 父容器高度 */
  line-height: 300px; /* 行高等于容器高度 */
  text-align: center; /* 水平居中 */
  border: 1px solid #000;
}
.box {
  display: inline-block; /* 使子元素不占满整行 */
  vertical-align: middle; /* 垂直居中 */
  line-height: normal; /* 重置子元素的行高 */
  width: 100px;
  height: 100px;
  background-color: lightpink;
}
```
:::

## 4、CSS 中 overflow: hidden、display：none 和 visibility: hidden 有什么区别
::: details 详情
- `overflow: hidden`：溢出内容不可见，未溢出的部分正常可见。
- `display：none`：隐藏内容，不占用任何空间，内容变化不会重新渲染。
- `visibility: hidden`：隐藏元素，但保留其占据的空间，内容变化会重新渲染。
:::

## 5、CSS 中 px、%、em、rem、vw/vh 的区别
::: details 详情
|单位|基准|绝对/相对|优点|缺点|适用场景|
|--|----|----|-----|-----|------|
|px|固定像素|绝对|精确，简单易用|	缺乏响应式能力|固定尺寸元素|
|%|父元素尺寸|相对|灵活，适合响应式设计|依赖父元素|响应式布局，流式设计|
|em|当前元素字体大小|相对|动态调整，适合局部相对设计|嵌套复杂，计算难预测|动态字体、内外边距等|
|rem|根元素字体大小（html）|相对|全局一致，计算简单|需要设置根元素字体|全局比例调整，响应式设计|
|vw/vh|视口宽度或高度|相对|基于视口，适合全屏设计|小屏显示可能不理想|全屏布局，视口动态调整|

使用建议:
- 响应式设计：结合使用 rem 和 %。
- 固定大小：使用 px 定义精确尺寸。
- 全屏布局：使用 vw 和 vh。
- 动态比例设计：em 和 rem 都是优秀的选择，但推荐 rem 更加简洁统一。
:::

## 6、如何实现 Retina 屏 1px 像素边框
::: details 详情
在 Retina 屏上，由于像素密度更高，1px 的边框可能会显得过粗。以下是几种常见的实现方法：

- 使用 `transform: scale` 实现。
```css
.retina-border {
  position: relative;
}

.retina-border::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px; /* 边框的物理宽度 */
  background-color: black; /* 边框颜色 */
  transform: scaleY(0.5); /* 缩放到 0.5 */
  transform-origin: 0 0; /* 缩放起点 */
}
```
- 使用 `box-shadow` 实现。
```css
.retina-border {
  position: relative;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.5); /* 通过阴影模拟边框 */
}
```
- 使用 `border-image` 实现。
```css
.retina-border {
  border: 1px solid transparent;
  border-image: linear-gradient(to bottom, black, black) 1;
}
```
- 使用 `background` 实现。
```css
.retina-border {
  position: relative;
}

.retina-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, black 1px, transparent 0);
  pointer-events: none; /* 防止伪元素影响交互 */
}
```
- 使用 `outline` 实现。
```css
.retina-border {
  outline: 1px solid black;
  outline-offset: -0.5px; /* 调整位置 */
}
```
:::

## 7、使用 CSS 画一个三角形
::: details 详情
使用 CSS “画”一个向上的三角形，重点在于使用透明边框。
```html
<style>
  .triangle-up {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 50px solid #000; /* 底部颜色即为三角形颜色 */
  }
</style>
<div class="triangle-up"></div>
```
:::

## 8、CSS 中如何理解 z-index
::: details 详情
- `z-index` 是一个 CSS 属性，用于控制元素的堆叠顺序（沿 Z 轴的显示顺序）。值越大，元素越靠前显示，反之值越小，元素越靠后。
- `z-index` 只适用于定位的元素，需要设置 `position` 属性为 `relative`、`absolute`、`fixed` 或 `sticky`，否则 `z-index` 不生效。
- `z-index` 只在同级比较，父子元素的 `z-index` 不会互相影响。
:::

## 9、有没有使用过 css variable（变量），它解决了哪些问题
CSS 变量，也称为自定义属性，允许你在 CSS 中定义可重用的值。它们以 -- 开头，可以在整个样式表中通过 var() 函数引用。
::: details 详情
- 减少样式重复定义。
  > 比如同一个颜色值要在多个地方重复使用，以前通过 less 和 sass 预处理做到，现在 css 变量也可以做到，方便维护，提高可读性。
```css
:root {
  --main-color: #4387fb;
}

h1 {
  color: var(--main-color);
}

p {
  border-color: var(--main-color);
}
```
- 动态修改样式。
  > 可以通过 js 动态修改，制作性能更高的动画或实现主题切换。
```js
document.documentElement.style.setProperty('--main-color', '#e74c3c');
```
- 作用域灵活：
  > 可以在不同的选择器中定义和覆盖，支持局部作用域。
```css
:root {
  --main-color: #3498db;
}

.header {
  --main-color: #e74c3c; /* 局部覆盖 */
}
```
- 支持回退值：
  > 当变量未定义时，可以使用回退值。
```css
body {
  color: var(--main-color, #000); /* 如果 --main-color 未定义，则使用 #000 */
}
```
- 配合 content 等通过 css 给 js 传参，得到一些通过 js 难以获取的参数。

html
```html
<div class="box" data-value="42"></div>
```
css
```css
:root {
  --box-color: #3498db; /* 定义一个 CSS 变量 */
}

.box::before {
  content: attr(data-value); /* 使用 data-value 属性的值 */
  display: none; /* 隐藏伪元素 */
}

.box {
  background-color: var(--box-color); /* 使用 CSS 变量 */
  width: 100px;
  height: 100px;
}
```
js
```js
// 获取伪元素的 content 值
const box = document.querySelector('.box');
const style = getComputedStyle(box, '::before'); // 获取伪元素样式
const contentValue = style.content.replace(/['"]/g, ''); // 去掉引号
console.log('伪元素的 content 值:', contentValue); // 输出: 42

// 动态修改 CSS 变量
document.documentElement.style.setProperty('--box-color', '#e74c3c');
```
:::

## 10、为什么会发生样式抖动
因为没有指定元素具体高度和宽度，比如数据还没有加载进来时元素高度是100px(假设这里是100px)，数据加载进来后，因为有了数据，然后元素被撑大，所有出现了抖动。

## 11、什么是 BFC ，如何触发 BFC
BFC (Block formatting context) 直译为"`块级格式化上下文`"。它是一个独立的渲染区域，与这个区域外部毫不相干。即，BFC 里面的的内容再怎么发生变化，也不会影响到 BFC 外面的布局，这一点是在网页布局中非常有用的。
::: details 详情
BFC 的特性
- 同一个 BFC 内的元素会垂直排列：
  > 每个元素的外边距会发生折叠（margin collapsing）。
- BFC 区域不会与浮动元素重叠：
  > BFC 可以包含浮动的子元素，避免父元素高度塌陷。
- BFC 是一个独立的布局环境：
  > BFC 内部的布局不会影响外部，外部的布局也不会影响 BFC 内部。

如何触发 BFC：
- 根元素
- `float` 属性不为 `none`。
- `position` 为 `absolute` 或 `fixed`。
- `display` 为 `inline-block` `table-cell` `table-caption` `flex` `inline-flex` `flow-root`。
- `overflow` 不为 `visible`。

应用场景：
- 清楚浮动：
  > 当子元素使用 float 布局时，父元素高度会塌陷。通过触发 BFC，可以包含浮动的子元素。
- 防止外边距折叠：
  > 当两个相邻元素的外边距发生折叠时，可以通过触发 BFC 来避免。
- 解决浮动元素重叠问题：
  > 当浮动元素与普通文档流元素重叠时，可以通过触发 BFC 来解决。
- 自适应两栏布局：
  > 使用 BFC 可以实现左侧固定宽度，右侧自适应的两栏布局。
:::

## 12、CSS 中伪类和伪元素有什么区别
- 伪类使用单冒号，而伪元素使用双冒号。如 `:hover` 是伪类，`::before` 是伪元素。
- 伪元素会在文档流生成一个新的元素，并且可以使用 `content` 属性设置内容。

## 13、CSS 如何设置多行超出显示省略号
::: details 详情
```css
.box {
  width: 200px;
  word-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```
:::

## 14、flex 布局中 order 有何作用
`order` 属性定义 flex 布局中子元素的排列顺序，数值越小，排列越靠前，默认为0。

## 15、简单描述 CSS 的盒模型
CSS 的盒模型主要包括以下两种，可通过 `box-sizing` 属性进行配置：
- 标准盒子模型（`content-box`）
  > - width = content-width height = content-height。
- 怪异盒子模型（`border-box`） 
  > - width = content-width + padding + border height = content-height + padding + border。
  > - 在怪异模式下，width 和 height 设置的是整个盒子的尺寸（包括 padding 和 border），而内容区域会自动调整。

## 16、CSS 中 position 有哪些取值，有什么区别
`position` 用于指定元素的定位方式，不同取值会影响元素是否脱离文档流，以及 `top`、`right`、`bottom`、`left` 等偏移属性的参考对象。

::: details 详情
### static

- 默认值。
- 元素按照正常文档流排列。
- `top`、`right`、`bottom`、`left` 不生效。

### relative

- 相对定位。
- 元素仍然占据原来的文档流位置。
- 偏移量相对于自身原来的位置计算。

```css
.box {
  position: relative;
  top: 10px;
  left: 20px;
}
```

### absolute

- 绝对定位。
- 元素会脱离文档流。
- 相对于最近的非 `static` 定位祖先元素进行定位。
- 如果没有符合条件的祖先元素，则相对于初始包含块定位。

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  right: 0;
  bottom: 0;
}
```

### fixed

- 固定定位。
- 元素会脱离文档流。
- 通常相对于浏览器视口定位。
- 常用于固定导航栏、返回顶部按钮、悬浮按钮。

### sticky

- 粘性定位。
- 可以理解为 `relative` 和 `fixed` 的结合。
- 元素在达到指定阈值前按照正常文档流排列，达到阈值后固定在指定位置。
- 常用于吸顶标题、表格表头固定。

```css
.title {
  position: sticky;
  top: 0;
}
```

### 总结

| 取值 | 是否脱离文档流 | 定位参考 |
| --- | --- | --- |
| static | 否 | 正常文档流 |
| relative | 否 | 自身原位置 |
| absolute | 是 | 最近的非 static 祖先 |
| fixed | 是 | 视口 |
| sticky | 否/固定时类似 fixed | 最近滚动容器 |
:::

## 17、flex: 1 表示什么
`flex` 是 `flex-grow`、`flex-shrink`、`flex-basis` 的简写属性。常见的 `flex: 1` 通常表示元素可以占满父容器剩余空间，并和其他同样设置 `flex: 1` 的元素平分空间。

::: details 详情
### flex 三个子属性

```css
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

多数情况下，`flex: 1` 可以理解为：

```css
.item {
  flex: 1 1 0%;
}
```

### flex-grow

`flex-grow` 表示父容器有剩余空间时，当前元素如何放大。

- 默认值是 `0`，表示不放大。
- 设置为 `1` 表示参与剩余空间分配。
- 多个元素都设置为 `1` 时，会平分剩余空间。

### flex-shrink

`flex-shrink` 表示父容器空间不足时，当前元素如何缩小。

- 默认值是 `1`，表示可以缩小。
- 设置为 `0` 表示不缩小。

### flex-basis

`flex-basis` 表示在分配剩余空间之前，元素在主轴方向上的初始尺寸。

- `flex: 1` 中通常是 `0%`，表示先忽略内容宽度，再分配剩余空间。
- 如果设置为 `auto`，会先参考元素自身内容或 width。

### 示例

```css
.container {
  display: flex;
  width: 600px;
}

.item {
  flex: 1;
}
```

如果有 3 个 `.item`，并且都设置了 `flex: 1`，那么每个元素大约占 `200px`。

### 常见区别

```css
.a {
  flex: 1; /* 1 1 0% */
}

.b {
  flex: auto; /* 1 1 auto */
}

.c {
  flex: none; /* 0 0 auto */
}
```

- `flex: 1`：更适合平均分配空间。
- `flex: auto`：会先考虑元素自身内容尺寸，再分配剩余空间。
- `flex: none`：不放大也不缩小，保持自身尺寸。
:::

## 18、Grid 布局和 Flex 布局有什么区别
`Grid` 和 `Flex` 都是现代 CSS 布局方案。Flex 更适合一维布局，Grid 更适合二维布局。

::: details 详情
### Flex 布局

Flex 主要处理一个方向上的布局，可以是横向，也可以是纵向。

适合场景：

- 水平或垂直居中。
- 导航栏。
- 按钮组。
- 列表项横向排列。
- 一行或一列的自适应布局。

```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Grid 布局

Grid 同时处理行和列，更适合二维布局。

适合场景：

- 页面整体布局。
- 仪表盘卡片布局。
- 图片网格。
- 多行多列复杂布局。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

### 核心区别

| 对比项 | Flex | Grid |
| --- | --- | --- |
| 布局维度 | 一维布局 | 二维布局 |
| 关注点 | 主轴和交叉轴 | 行和列 |
| 适合场景 | 局部排列 | 整体网格 |
| 子项控制 | 依赖内容和弹性分配 | 可以精确放到指定网格 |

### 如何选择

- 如果只是处理一行或一列，用 Flex 更简单。
- 如果同时需要控制行和列，用 Grid 更合适。
- 实际项目中二者经常组合使用：外层用 Grid 做整体布局，内部用 Flex 做局部对齐。
:::

## 19、CSS 中 transition 和 animation 有什么区别
`transition` 和 `animation` 都可以实现动画效果，但它们的触发方式、控制能力和适用场景不同。

::: details 详情
### transition

`transition` 用于在 CSS 属性变化时添加过渡效果，需要有状态变化触发，例如 hover、class 改变、样式改变。

```css
.button {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.button:hover {
  opacity: 1;
}
```

特点：

- 需要触发条件。
- 适合简单状态切换。
- 只能描述开始和结束两个状态之间的过渡。

### animation

`animation` 通过 `@keyframes` 定义动画关键帧，可以自动播放，也可以循环播放。

```css
@keyframes move {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100px);
  }
}

.box {
  animation: move 1s linear infinite;
}
```

特点：

- 不一定需要交互触发。
- 可以定义多个关键帧。
- 支持循环、延迟、方向、暂停等更复杂控制。

### 对比总结

| 对比项 | transition | animation |
| --- | --- | --- |
| 触发方式 | 状态变化触发 | 可自动执行 |
| 控制能力 | 较简单 | 更强 |
| 关键帧 | 不支持多关键帧 | 支持 keyframes |
| 适合场景 | hover、展开收起 | loading、循环动画、复杂动画 |
:::

## 20、CSS 选择器优先级如何计算
CSS 选择器优先级决定当多条规则作用于同一个元素时，哪条规则最终生效。

::: details 详情
### 优先级顺序

一般情况下，优先级从高到低为：

```txt
!important > 行内样式 > ID 选择器 > 类/属性/伪类选择器 > 标签/伪元素选择器 > 通配符/继承
```

### 权重计算

可以把选择器权重理解为四组数字：

```txt
行内样式, ID, 类/属性/伪类, 标签/伪元素
```

示例：

```css
#app .button span {
  color: red;
}
```

权重为：

```txt
0, 1, 1, 1
```

再比如：

```css
.card .title {
  color: blue;
}
```

权重为：

```txt
0, 0, 2, 0
```

所以 `#app .button span` 的优先级更高。

### 同优先级怎么办

如果优先级相同，后声明的样式会覆盖先声明的样式。

```css
.text {
  color: red;
}

.text {
  color: blue;
}
```

最终颜色是 `blue`。

### 注意事项

- `!important` 会提高声明优先级，但不建议滥用。
- 继承样式优先级低于直接作用在元素上的样式。
- 选择器不是越长越好，过高优先级会增加维护成本。
:::

## 21、transform 位移和 position 定位有什么区别
`transform: translate()` 和 `position` 都能改变元素显示位置，但它们影响的层面不同。

::: details 详情
### 核心区别

- `transform: translate()` 是视觉层面的位移，不会改变元素在文档流中的占位，也不会影响周围元素布局。
- `position` 配合 `top`、`left`、`right`、`bottom` 会改变元素的定位位置，具体是否影响文档流取决于定位类型。
- `relative` 会保留原始占位，视觉上偏移；`absolute` 和 `fixed` 会脱离普通文档流。

### 性能差异

`transform` 通常更适合做动画，因为它更容易被浏览器放到合成层处理，减少布局计算和重排。

```css
.box {
  transform: translateX(20px);
}
```

如果频繁修改 `left` 或 `top`，浏览器可能需要重新计算布局：

```css
.box {
  position: relative;
  left: 20px;
}
```

### 使用场景

- 做过渡动画、拖拽跟手、弹窗进入离开动画，优先考虑 `transform`。
- 做元素定位、覆盖层、固定导航、相对容器摆放，使用 `position`。
- 需要让元素真实参与布局变化时，不应只依赖 `transform`。
:::

## 22、CSS 中 contain 属性有什么作用
`contain` 用于告诉浏览器某个元素的渲染影响范围，帮助浏览器把布局、绘制、尺寸等计算限制在局部区域内。

::: details 详情
### 常见取值

- `layout`：元素内部布局不会影响外部布局。
- `paint`：元素内容不会绘制到自身边界之外。
- `size`：元素尺寸不依赖内部内容。
- `style`：限制部分样式影响范围。
- `content`：相当于 `layout paint style` 的组合。
- `strict`：相当于 `layout paint size style` 的组合。

### 示例

```css
.card-list-item {
  contain: content;
}
```

当列表项内部发生变化时，浏览器可以减少对外部布局和绘制的影响。

### 应用场景

- 大列表中的独立卡片。
- 复杂组件内部更新频繁，但不影响外部布局。
- 需要优化局部重排和重绘成本的模块。

### 注意事项

- `contain` 是性能优化提示，不是所有场景都能明显提升性能。
- `size` 会让元素尺寸不依赖内容，使用不当可能导致布局异常。
- 如果元素内容需要溢出显示，不适合随意使用 `paint`。
- 更常见的实际策略是先定位性能瓶颈，再针对性使用。
:::

## 23、CSS 中 content-visibility 有什么作用
`content-visibility` 可以让浏览器跳过屏幕外内容的渲染工作，从而减少首屏布局和绘制成本。

::: details 详情
### 基本用法

```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: 600px;
}
```

`content-visibility: auto` 表示浏览器可以在元素离开视口时跳过它的布局、绘制等渲染工作。

`contain-intrinsic-size` 用于给未渲染内容提供一个预估尺寸，减少滚动过程中布局跳动。

### 适合场景

- 长列表中的非首屏区域。
- 内容很多的长页面。
- 折叠面板、评论区、推荐列表等首屏外模块。

### 和 display: none 的区别

| 对比项 | content-visibility: auto | display: none |
| --- | --- | --- |
| 是否保留布局位置 | 可以保留 | 不保留 |
| 是否由浏览器自动判断 | 是 | 否 |
| 适合场景 | 延迟渲染屏幕外内容 | 手动隐藏元素 |

### 注意事项

- 首屏关键内容不适合使用，否则可能影响首屏渲染。
- 需要配合合理的 `contain-intrinsic-size`，避免滚动跳动。
- 兼容性需要根据目标浏览器评估。
- 不应盲目全站使用，适合优化长页面的非关键区域。
:::

## 24、CSS 中 @layer 有什么作用
`@layer` 用于定义 CSS 级联层，可以让不同来源或不同职责的样式按层级参与级联，降低选择器优先级冲突。

::: details 详情
### 基本用法

```css
@layer reset, base, components, utilities;

@layer base {
  button {
    font: inherit;
  }
}

@layer components {
  .button {
    color: white;
    background: #1677ff;
  }
}

@layer utilities {
  .text-red {
    color: red;
  }
}
```

声明顺序越靠后的 layer 优先级越高。

### 解决什么问题

传统 CSS 中，后写的样式、选择器权重、`!important` 很容易交织在一起，导致覆盖关系难以维护。

`@layer` 可以先从层级上决定覆盖顺序，再在同一层内部比较选择器优先级。

### 常见分层

- `reset`：样式重置。
- `base`：基础元素样式。
- `components`：组件样式。
- `utilities`：工具类样式。
- `overrides`：少量覆盖样式。

### 注意事项

- 未放入任何 layer 的普通样式优先级通常高于 layer 内样式。
- layer 的顺序应在项目入口统一声明，避免分散维护。
- `@layer` 适合大型项目或样式体系复杂的项目，小项目不一定需要。
:::

## 25、CSS 中 :has() 选择器有什么作用
`:has()` 是关系选择器，可以根据元素内部或后续是否匹配某个条件来选择当前元素，也常被称为“父选择器”能力。

::: details 详情
### 基本用法

选择包含图片的卡片：

```css
.card:has(img) {
  padding-top: 0;
}
```

选择包含选中复选框的表单项：

```css
.form-item:has(input:checked) {
  border-color: #1677ff;
}
```

### 常见场景

- 父元素根据子元素状态改变样式。
- 表单项根据输入状态展示错误或高亮。
- 卡片根据内部内容类型切换布局。
- 列表项根据是否包含特定元素调整间距。

### 和传统写法的区别

过去 CSS 很难根据子元素状态选择父元素，通常需要 JavaScript 给父元素添加 class。

`:has()` 可以让部分交互样式直接通过 CSS 完成，减少 DOM 操作。

### 注意事项

- `:has()` 功能强大，但复杂选择器可能增加样式匹配成本。
- 需要关注目标浏览器兼容性。
- 不要把业务逻辑过度塞进 CSS，复杂状态仍应由 JavaScript 或框架状态管理。
:::

## 26、CSS 容器查询是什么
容器查询允许元素根据父容器尺寸调整样式，而不是只根据浏览器视口尺寸调整样式。

::: details 详情
### 为什么需要容器查询

媒体查询关注的是视口大小：

```css
@media (min-width: 768px) {
  .card {
    display: flex;
  }
}
```

但同一个组件可能出现在不同宽度的容器中，例如主内容区、侧边栏、弹窗里。只看视口大小无法准确判断组件应该如何布局。

容器查询可以让组件根据自己的容器宽度自适应。

### 基本用法

先声明容器：

```css
.card-wrapper {
  container-type: inline-size;
}
```

再写容器查询：

```css
@container (min-width: 480px) {
  .card {
    display: flex;
    gap: 16px;
  }
}
```

当 `.card-wrapper` 的内联方向尺寸大于等于 480px 时，内部 `.card` 样式生效。

### 适合场景

- 可复用卡片组件。
- 同一组件在主栏和侧栏中展示不同布局。
- 响应式组件库。
- 不依赖全局断点的局部布局。

### 注意事项

- 需要先给父级声明 `container-type`。
- 容器查询更适合组件级响应式，媒体查询更适合页面级响应式。
- 使用前要确认目标浏览器兼容性。
:::

## 27、CSS 逻辑属性是什么
CSS 逻辑属性是相对于书写模式的方向属性，可以替代部分固定的 `left`、`right`、`top`、`bottom` 写法，更适合国际化布局。

::: details 详情
### 常见逻辑属性

| 逻辑属性 | 类似物理属性 |
| --- | --- |
| `margin-inline-start` | `margin-left` 或 `margin-right` |
| `margin-inline-end` | `margin-right` 或 `margin-left` |
| `padding-block-start` | `padding-top` |
| `padding-block-end` | `padding-bottom` |
| `inline-size` | `width` |
| `block-size` | `height` |

### 示例

传统写法：

```css
.item {
  margin-left: 16px;
}
```

逻辑属性写法：

```css
.item {
  margin-inline-start: 16px;
}
```

在从左到右语言中，`inline-start` 通常是左侧；在从右到左语言中，可能是右侧。

### 适合场景

- 多语言站点。
- 需要支持 RTL 语言的后台系统。
- 组件库基础样式。
- 希望减少方向相关覆盖代码的项目。

### 注意事项

- 团队需要统一约定，避免物理属性和逻辑属性混用导致难维护。
- 旧浏览器兼容性需要评估。
- 对只面向单一书写方向的小项目，收益可能不明显。
:::

## 28、CSS 中 accent-color 有什么作用
`accent-color` 用于设置表单控件的强调色，例如复选框、单选框、进度条等原生控件的主题颜色。

::: details 详情
### 基本用法

```css
input[type="checkbox"],
input[type="radio"] {
  accent-color: #1677ff;
}
```

这样可以在保留原生控件交互和可访问性的同时，让控件颜色匹配产品主题。

### 适用控件

常见支持的控件包括：

- checkbox。
- radio。
- range。
- progress。

具体表现会受浏览器和操作系统影响。

### 优点

- 不需要完全自定义表单控件。
- 保留原生控件的键盘交互和可访问性。
- 比用伪元素重写控件更简单。

### 注意事项

- 只能控制强调色，不能完全控制控件所有细节。
- 需要关注颜色对比度，避免影响可访问性。
- 如果设计要求高度定制，仍可能需要自定义组件。
:::

## 29、CSS 中 @scope 有什么作用
`@scope` 用于限定一组 CSS 规则的作用范围，让样式只在指定 DOM 子树内生效，降低全局样式污染。

::: details 详情
### 基本用法

```css
@scope (.card) {
  .title {
    color: #1677ff;
  }
}
```

上面的 `.title` 样式只会影响 `.card` 范围内的标题。

### 设置结束边界

```css
@scope (.article) to (.comments) {
  p {
    line-height: 1.8;
  }
}
```

表示样式从 `.article` 开始生效，但不会进入 `.comments` 子树。

### 解决什么问题

- 减少全局选择器冲突。
- 限制组件或模块样式作用范围。
- 降低命名约定压力。
- 比单纯依赖长选择器更清晰。

### 和 CSS Modules 的区别

- `@scope` 是 CSS 原生能力。
- CSS Modules 通过构建工具改写 class 名实现局部化。
- 两者关注点类似，但实现机制不同。

### 注意事项

- 需要关注浏览器兼容性。
- 不应依赖它替代所有组件样式隔离方案。
- 大型项目仍需要命名规范、层级管理和工程化配合。
:::

## 30、CSS 中 scroll-margin 和 scroll-padding 有什么作用
`scroll-margin` 和 `scroll-padding` 都用于调整滚动定位时的偏移，常见于锚点跳转、`scrollIntoView` 和固定头部场景。

::: details 详情
### scroll-margin

`scroll-margin` 作用在目标元素上，用于设置元素被滚动到可视区域时，和滚动容器边缘之间预留的距离。

```css
.section {
  scroll-margin-top: 64px;
}
```

当跳转到 `.section` 或调用 `scrollIntoView()` 时，浏览器会在顶部预留 `64px`，避免内容被固定导航遮住。

### scroll-padding

`scroll-padding` 作用在滚动容器上，用于设置滚动容器的内部滚动安全区域。

```css
html {
  scroll-padding-top: 64px;
}
```

它会影响锚点跳转、滚动吸附和部分滚动定位行为。

### 两者区别

- `scroll-margin` 写在被滚动到的目标元素上。
- `scroll-padding` 写在滚动容器上。
- `scroll-margin` 更适合单个元素需要特殊偏移的场景。
- `scroll-padding` 更适合整个页面或容器有统一固定头部的场景。

### 常见场景

- 固定头部下的锚点跳转。
- 调用 `element.scrollIntoView()` 后避免内容贴边。
- 滚动吸附布局中预留安全距离。
- 文档站点、后台详情页中的目录导航定位。

### 注意事项

- 先确认真正的滚动容器，样式要写在对应容器或目标元素上。
- 固定头部高度变化时，可以配合 CSS 变量维护偏移值。
- 它们只影响滚动定位偏移，不会改变元素真实布局尺寸。
:::

## 31、CSS 中 :is 和 :where 有什么区别
`:is()` 和 `:where()` 都可以把多个选择器合并，减少重复书写；核心区别在于它们参与优先级计算的方式不同。

::: details 详情
### :is 的作用

```css
:is(header, main, footer) a {
  color: #1677ff;
}
```

等价于：

```css
header a,
main a,
footer a {
  color: #1677ff;
}
```

`:is()` 的优先级取参数中优先级最高的选择器。

### :where 的作用

```css
:where(header, main, footer) a {
  color: #1677ff;
}
```

`:where()` 的参数不增加选择器优先级，它自身的优先级始终为 `0`。

### 主要区别

- `:is()` 会参与优先级计算。
- `:where()` 不增加优先级。
- `:is()` 适合正常合并选择器。
- `:where()` 适合写低优先级的基础样式和主题样式。

### 常见场景

```css
:where(.prose) h1 {
  margin-block: 1em;
}

.article h1 {
  margin-block: 2em;
}
```

因为 `:where()` 不增加优先级，业务样式更容易覆盖基础样式。

### 注意事项

- 不要只把它们当成语法糖，优先级差异会影响覆盖结果。
- `:where()` 很适合降低组件库默认样式的覆盖成本。
- `:is()` 参数中如果包含高优先级选择器，整体优先级也会变高。
:::

## 32、CSS Grid 中 subgrid 有什么作用
`subgrid` 允许子网格继承父级 Grid 的行或列轨道，让嵌套内容在同一套网格线上对齐。

::: details 详情
### 问题背景

普通嵌套 Grid 会创建自己的网格轨道，子元素很难和父级网格列线保持一致。

```css
.parent {
  display: grid;
  grid-template-columns: 120px 1fr 80px;
}

.child {
  display: grid;
}
```

`.child` 内部的列不会自动继承 `.parent` 的列定义。

### 使用 subgrid

```css
.parent {
  display: grid;
  grid-template-columns: 120px 1fr 80px;
}

.card {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}
```

这样 `.card` 内部子元素可以沿用父级的列轨道。

### 常见场景

- 表单 label、内容、操作按钮跨多行对齐。
- 卡片列表内部字段和外层网格对齐。
- 复杂后台表格或详情布局。
- 多层嵌套布局中保持列线一致。

### 和普通 Grid 的区别

- 普通 Grid 自己定义行列轨道。
- `subgrid` 复用父级的行或列轨道。
- `subgrid` 更强调跨层级对齐。

### 注意事项

- 需要关注浏览器兼容性。
- `subgrid` 依赖父级本身是 Grid 布局。
- 如果只是简单局部排列，普通 Grid 或 Flex 更直接。
:::

## 33、CSS Nesting 原生嵌套有什么作用
CSS Nesting 允许在原生 CSS 中书写嵌套规则，减少重复选择器，让组件样式结构更清晰。

::: details 详情
### 基本用法

```css
.card {
  padding: 16px;

  & .title {
    font-weight: 600;
  }

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  }
}
```

`&` 表示当前选择器。

### 等价写法

上面的代码大致等价于：

```css
.card {
  padding: 16px;
}

.card .title {
  font-weight: 600;
}

.card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
}
```

### 和 Sass 嵌套的区别

- CSS Nesting 是浏览器原生能力。
- Sass 嵌套需要预处理器编译。
- 原生嵌套语法更受 CSS 规范限制。
- 不能完全照搬 Sass 的所有写法。

### 适合场景

- 组件局部样式。
- 状态选择器，例如 `:hover`、`:focus-visible`。
- 主题或容器下的局部规则。
- 减少重复父选择器。

### 注意事项

- 不要嵌套过深，否则会生成复杂选择器。
- 嵌套不会自动带来样式隔离，仍要注意命名冲突。
- 需要关注目标浏览器兼容性和构建工具处理方式。
:::

## 34、CSS 中 @property 有什么作用
`@property` 用于注册 CSS 自定义属性，让自定义属性拥有类型、初始值和继承行为，并支持更稳定的动画过渡。

::: details 详情
### 基本用法

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.box {
  --angle: 0deg;
  background: conic-gradient(from var(--angle), red, blue, red);
  transition: --angle 1s;
}

.box:hover {
  --angle: 360deg;
}
```

普通 CSS 变量通常只是字符串替换，注册后浏览器可以知道它的类型。

### 配置项

- `syntax`：声明属性类型，例如 `<length>`、`<color>`、`<angle>`。
- `initial-value`：初始值。
- `inherits`：是否继承。

### 解决什么问题

- 让自定义属性可以按类型参与动画。
- 避免非法值导致不可预期结果。
- 给自定义属性设置明确初始值。
- 控制自定义属性是否继承。

### 常见场景

- 渐变角度动画。
- 主题颜色过渡。
- 数值型 CSS 变量动画。
- 复杂组件内部的样式状态管理。

### 注意事项

- 需要关注浏览器兼容性。
- `initial-value` 必须符合 `syntax` 定义。
- 并不是所有 CSS 变量都需要注册，普通复用值直接用自定义属性即可。
:::

## 35、CSS 中 scroll-snap 有什么作用
`scroll-snap` 用于控制滚动容器在滚动结束后自动吸附到指定位置，常用于横向卡片、轮播、分页滚动和移动端滑动列表。

::: details 详情
### 基本用法

```css
.list {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.item {
  flex: 0 0 80%;
  scroll-snap-align: start;
}
```

滚动 `.list` 时，滚动位置会吸附到 `.item` 的起始位置。

### 常见属性

- `scroll-snap-type`：定义滚动方向和吸附强度。
- `scroll-snap-align`：定义子元素吸附到容器的哪个位置。
- `scroll-snap-stop`：控制是否必须停在某个吸附点。
- `scroll-padding`：设置容器吸附时的内边距。
- `scroll-margin`：设置元素吸附时的外边距。

### mandatory 和 proximity

```css
.container {
  scroll-snap-type: x mandatory;
}
```

- `mandatory`：滚动结束后必须吸附到某个点。
- `proximity`：接近吸附点时才吸附，更柔和。

### 常见场景

- 移动端横向卡片列表。
- Banner 轮播。
- 图片预览。
- 全屏分页滚动。
- 日历、时间轴等滑动选择器。

### 注意事项

- 子元素尺寸要稳定，否则吸附位置可能跳动。
- 不要过度使用 `mandatory`，可能影响用户自由滚动。
- 需要兼顾键盘、触摸板和鼠标滚轮体验。
- 如果是复杂轮播，仍要考虑无障碍、焦点管理和状态同步。
:::

## 36、CSS 中 prefers-color-scheme 有什么作用
`prefers-color-scheme` 是媒体查询条件，用于检测用户系统偏好的颜色主题，例如浅色模式或深色模式。

::: details 详情
### 基本用法

```css
:root {
  --bg: #ffffff;
  --text: #111111;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111111;
    --text: #ffffff;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

当系统处于深色模式时，页面会自动使用深色变量。

### 常见取值

- `light`：用户偏好浅色主题。
- `dark`：用户偏好深色主题。

### 和 color-scheme 的关系

```css
:root {
  color-scheme: light dark;
}
```

`color-scheme` 用于告诉浏览器页面支持哪些配色方案，浏览器可以据此调整表单控件、滚动条等内置 UI。

### 常见场景

- 自动适配系统深色模式。
- 初始化主题变量。
- 优化表单控件和滚动条颜色。
- 在用户未手动选择主题时作为默认主题依据。

### 注意事项

- 系统偏好不等于用户在站内选择的主题。
- 如果站内有手动主题切换，通常要让用户选择优先于系统偏好。
- 颜色切换要保证对比度和可读性。
- 图片、图标、阴影、边框也要适配，不只是背景色和文字色。
:::

## 37、CSS 中 clamp() 函数有什么作用
`clamp()` 用于在最小值、理想值和最大值之间动态取值，常用于响应式字号、间距、宽度等场景。

::: details 详情
### 基本语法

```css
.title {
  font-size: clamp(20px, 4vw, 48px);
}
```

表示字号：

- 最小不低于 `20px`。
- 理想情况下按 `4vw` 变化。
- 最大不超过 `48px`。

### 等价理解

```css
font-size: clamp(最小值, 理想值, 最大值);
```

可以理解为：

```txt
max(最小值, min(理想值, 最大值))
```

### 常见场景

- 响应式标题字号。
- 页面左右留白。
- 卡片宽度。
- 行高或间距。
- 不同屏幕下的布局尺寸控制。

### 示例

```css
.page {
  padding-inline: clamp(16px, 5vw, 64px);
}

.card {
  width: clamp(280px, 50vw, 640px);
}
```

这样可以减少媒体查询数量，让样式随视口平滑变化。

### 和媒体查询的关系

`clamp()` 适合连续变化的响应式值，媒体查询适合在断点处切换布局结构。

两者可以配合使用，而不是互相替代。

### 注意事项

- 不要让字号完全依赖 `vw`，否则小屏过小、大屏过大。
- `clamp()` 中可以混合 `px`、`rem`、`vw` 等单位。
- 复杂布局结构变化仍应使用媒体查询或容器查询。
:::

## 38、CSS 中 aspect-ratio 有什么作用
`aspect-ratio` 用于设置元素的宽高比，让浏览器在只确定一个方向尺寸时自动计算另一个方向尺寸。

::: details 详情
### 基本用法

```css
.cover {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

当 `.cover` 宽度变化时，高度会按 `16:9` 自动计算。

### 常见场景

- 视频容器。
- 图片占位。
- 商品卡片封面。
- 响应式 Banner。
- 瀑布流或网格卡片。

### 图片占位

```css
.image-box {
  aspect-ratio: 4 / 3;
  background: #f5f5f5;
  overflow: hidden;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

提前确定图片区域高度，可以减少图片加载后造成的布局偏移。

### 和 padding-top 方案的区别

过去常用百分比 padding 模拟宽高比：

```css
.box {
  padding-top: 56.25%;
}
```

`aspect-ratio` 更直观，语义更清晰，代码也更少。

### 注意事项

- 如果同时设置了明确的 `width` 和 `height`，宽高比可能不会生效。
- 内容超过容器时仍可能撑开布局，需要配合 `overflow`。
- 图片本身也有自然宽高比，容器和图片的适配要结合 `object-fit`。
:::

## 39、CSS 层叠规则是怎样的
CSS 层叠规则决定多个样式同时作用于同一个元素时，最终哪条样式生效。判断顺序通常包括来源、重要性、层叠层、选择器优先级、书写顺序等。

::: details 详情
### 基本判断顺序

常见影响因素包括：

- 样式来源：浏览器默认、用户样式、作者样式。
- `!important`。
- `@layer` 层叠层。
- 选择器优先级。
- 样式书写顺序。

当多个规则冲突时，浏览器会按层叠规则选出最终值。

### 选择器优先级

大致可以理解为：

- 行内样式优先级较高。
- ID 选择器高于 class 选择器。
- class、属性选择器、伪类高于元素选择器。
- 相同优先级时，后写的覆盖先写的。

例如：

```css
#title {
  color: red;
}

.title {
  color: blue;
}
```

如果元素同时命中，通常 ID 选择器生效。

### !important

`!important` 会提高声明优先级：

```css
.title {
  color: blue !important;
}
```

但滥用会让样式难以维护。

### 注意事项

- 不要只靠提高优先级解决样式冲突。
- 组件样式应保持选择器简单稳定。
- 全局样式、工具类和组件样式最好有清晰边界。
- 使用 `@layer` 可以更系统地管理不同来源样式的优先级。
:::
