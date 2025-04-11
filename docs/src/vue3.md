---
lang: zh-CN
title: vue3
description: vue3面试题
---
# vue3

## 1、vue3 和 vue2 有什么区别？说几个主要的
::: details 详情
性能优化
- 虚拟 DOM 重构：Vue3的虚拟DOM采用了更高效的 `Diff算法`，减少了渲染和更新的开销。
- Tree-shaking 支持：Vue3的代码结构模块化，支持按需引入，减小了打包体积。

Composition API
- Vue3 引入了Composition API，使代码更模块化、复用性更强。
- 使用 `setup()` 方法代替了部分选项式 API，通过函数的方式组织逻辑，代码更加清晰简洁。
- 生命周期钩子名称变化。

响应式系统改进
- Vue3 使用 `Proxy` + `Reflect` 实现响应式，解决了 Vue2使用 Object.defineProperty 实现响应式的一些局限性，如无法监听新增属性和数组索引变化。

新特性和改进
- Teleport：可以将组件的DOM渲染到指定的DOM节点之外，例如模态框、通知等。
- Fragment 支持：Vue3支持组件返回多个根节点，不再需要单一根节点。
- Suspense：用于处理异步组件加载，允许在组件加载过程中显示一个加载状态，直到异步组件加载完成后再显示实际内容。
- Vue3 原生支持 `TypeScript`，提供更完善的类型推导和开发体验。
- Vue3 支持为一个组件绑定多个 `v-model`，并且可以自定义 `prop` 和 `event` 名称。
- Vue3 支持监听支持动态属性监听和更多数据类型（如 `Map`、`Set`），无需手动调用 `Vue.set`。
- Vue3 新增`provide` 和 `inject`提供了更灵活的依赖注入机制。
:::

## 2、vue3 中为什么要使用 Proxy，它对比 Object.defineProperty 有什么改进
::: details 详情
以下是 `Proxy` 相比 `Object.defineProperty` 的一些改进和优势：
- 更强大和灵活：`Proxy` 可以代理整个对象，而不仅仅是对象的属性。这意味着您可以监听对象的整个操作，包括属性的增删改查等。而 `Object.defineProperty` 只能监听对象的属性的读取和赋值操作。
- 更直观和易用：使用 `Proxy` 可以更直观地监听对象的操作，而不需要像 `Object.defineProperty` 那样手动定义 getter 和 setter。这使得代码更加清晰和易于理解。
- 更好的性能：`Proxy` 的性能通常比 `Object.defineProperty` 更好，因为 `Proxy` 是原生实现的，而 `Object.defineProperty` 是 js 引擎的内部实现。`Proxy` 的底层实现更高效，可以更好地处理大型对象和多次操作。
- 支持数组变化的检测：使用 `Proxy` 可以很容易地监听数组的变化，包括数组的 push、pop、splice 等操作。而 `Object.defineProperty` 难以实现对数组变化的监听。
:::

## 3、vue3 对比 vue2 生命周期钩子有哪些区别
::: details 详情
|vue2 生命周期钩子|vue3 Composition API 钩子|
|----------|----------|
|`beforeCreate`|不需要（逻辑在 `setup` 中初始化）|
|`created`|不需要（逻辑在 `setup` 中初始化）|
|`beforeMount`|`onBeforeMount`|
|`mounted`|`onMounted`|
|`beforeUpdate`|`onBeforeUpdate`|
|`updated`|`onUpdated`|
|`beforeDestroy`|`onBeforeUnmount`|
|`destroyed`|`onUnmounted`|
|`activated`|`onActivated`|
|`deactivated`|`onDeactivated`|
|`errorCaptured`（2.5.0+ 新增）|`onErrorCaptured`|
:::

## 4、vue3 中 watch 和 watchEffect 的区别
`watch` 和 `watchEffect` 都是 vue3 中用于响应式数据变化时执行副作用的 API，它们的使用场景和工作机制存在区别：
::: details 详情
- 依赖追踪方式

`watch`：需要显式声明依赖，监听指定的数据源；可以监听多个数据源或进行深度监听。
```js
import { watch, reactive } from 'vue'
const state = reactive({
  count: 0,
})
watch(
  () => state.count, // 显式声明监听的依赖
  (newCount, oldCount) => {
    console.log(`新值 ${newCount} 老值 ${oldCount}`)
  }
)
```
`watchEffect`：会自动追踪 作用域内所有的响应式依赖，不需要显式声明依赖。
```js
import { watchEffect, reactive } from 'vue'
const state = reactive({
  count: 0,
})
watchEffect(() => {
  console.log(`Count 变化了: ${state.count}`) // 自动追踪 `state.count`
})
```
- 执行时机

`watch`：在监听的响应式数据变化后立即执行。

`watchEffect`：在 组件挂载时 执行一次副作用，并在 依赖发生变化时 再次执行。
- 适用场景

`watch`：适用于 监听特定数据 变化并执行副作用的场景，如 API 请求、保存操作等。适合需要 访问新值和旧值 进行比较的场景。

`watchEffect`：不需要访问旧值，适用于 自动追踪多个响应式依赖 的副作用，如渲染、自动保存等。
:::

## 5、vue3 中 ref 和 reactive 如何选择
`ref` 和 `reactive` 都是 vue3 中用来创建响应式数据的 API，他们的区别及使用场景如下：
::: details 详情
- `ref` 的实现
  > 为了实现基本数据类型的响应式，vue 设计了 `ref`。 `ref` 会将基本数据类型封装为一个包含 `value` 属性的对象，通过 `getter` 和 `setter` 实现响应式依赖追踪和更新。当访问或修改 `ref.value` 时，vue 内部会触发依赖更新。此外，对于复杂数据类型（如对象或数组）， `ref` 的内部实现会直接调用 `reactive`，将复杂数据类型变为响应式。
- `reactive` 的实现
  > `reactive` 通过 `Proxy` 对对象或数组的每个属性进行深度代理，实现响应式。这种设计使得 `reactive` 能自动追踪所有嵌套属性的变化，但由于 `Proxy` 无法直接处理基本数据类型（如 `number` 、 `string` 、 `boolean` ），因此， `reactive` 不适用于基本数据类型。
::: tip 如何选择
官方建议使用 `ref()` 作为声明响应式状态的主要 API（[响应式基础](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#why-refs)），因为 `reactive` 存在以下局限性：

💡有限的值类型：它只能用于对象类型 (对象、数组和如 `Map`、`Set` 这样的集合类型)。它不能持有如 `string`、`number` 或 `boolean` 这样的原始类型。 

💡不能替换整个对象：由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失：
```js
let state = reactive({
  count: 0,
})

// 上面的 ({ count: 0 }) 引用将不再被追踪
// (响应性连接已丢失！)
state = reactive({
  count: 1,
})
```
💡对解构操作不友好：当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接
```js
const state = reactive({
  count: 0,
})
// 当解构时，count 已经与 state.count 断开连接
let { count } = state
// 不会影响原始的 state
count++

// 该函数接收到的是一个普通的数字
// 并且无法追踪 state.count 的变化
// 我们必须传入整个对象以保持响应性
callSomeFunction(state.count)
```
:::

## 6、vue3 中 何统一监听组件报错
::: details 详情
在 vue3 中，可以通过 全局错误处理器 （`errorHandler`） 和 生命周期钩子（例如 `onErrorCaptured` ）来统一监听和处理组件中的错误。
- 通过全局错误处理器 `app.config.errorHandler`
```js
import { createApp } from 'vue';
const app = createApp(App);
// 设置全局错误处理器
app.config.errorHandler = (err, instance, info) => {
  console.error('捕获到组件错误: ', err);
  console.log('发生错误的组件实例: ', instance);
  console.log('错误信息: ', info);
};

app.mount('#app');
```
- 通过生命周期钩子 `onErrorCaptured` 局部捕获错误
```vue
<template>
  <div>
    <h2>局部错误捕获示例</h2>
    <ErrorProneComponent />
  </div>
</template>

<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((err, instance, info) => {
  console.error('局部捕获到错误: ', err)
  console.log('错误来源组件: ', instance)
  console.log('错误信息: ', info)

  // 这个钩子可以通过返回 false 来阻止错误继续向上传递。
  return false // 如果需要让错误冒泡到全局，省略或返回 true
})
</script>
```
:::

## 7、使用 Vue3 Composable 组合式函数，实现 useCount
::: tip 提示
在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。它和自定义 `React hooks` 非常相似。
:::
::: details 详情
使用组合式函数实现如下需求：useCount 是一个计数逻辑管理的组合式函数，它返回一个 count 变量和增加、减少、重置count的方法。
```vue
<template>
  <div>
    <h2>计数器: {{ count }}</h2>
    <button @click="increment">增加</button>
    <button @click="decrement">减少</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 实现 useCount 组合式函数
function useCount() {
  const count = ref(0)
  const increment = () => {
    count.value++
  }
  const decrement = () => {
    count.value--
  }
  const reset = () => {
    count.value = 0
  }
  return {
    count,
    increment,
    decrement,
    reset,
  }
}

// 使用 useCount 组合式函数
const { count, increment, decrement, reset } = useCount()
</script>
```
:::

## 8、vue3 中 如何使用 `v-memo` 指令优化渲染性能
`v-memo` 是 Vue 3.2 引入的指令，用于有条件地缓存子树的渲染结果，仅在依赖项变化时重新渲染。
::: details 详情
```vue
<template>
  <div v-memo="[valueA, valueB]">
    <!-- 仅在 valueA 或 valueB 变化时重新渲染 -->
    <ChildComponent :a="valueA" :b="valueB" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const valueA = ref(1);
const valueB = ref(2);
</script>
```
:::