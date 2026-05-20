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
