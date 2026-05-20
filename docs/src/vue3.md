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
- Vue3 的响应式系统可以更自然地处理动态属性、数组索引以及 `Map`、`Set` 等数据类型，无需再依赖 `Vue.set` 这类补丁式写法。
- `provide` 和 `inject` 在 Vue2 中就已经存在，Vue3 只是结合组合式 API 让它们在逻辑复用和依赖注入场景下使用起来更自然。
:::

## 2、vue3 中为什么要使用 Proxy，它对比 Object.defineProperty 有什么改进
::: details 详情
以下是 `Proxy` 相比 `Object.defineProperty` 的一些改进和优势：
- 更强大和灵活：`Proxy` 可以代理整个对象，而不仅仅是对象的属性。这意味着您可以监听对象的整个操作，包括属性的增删改查等。而 `Object.defineProperty` 只能监听对象的属性的读取和赋值操作。
- 更直观和易用：使用 `Proxy` 可以更直观地监听对象的操作，而不需要像 `Object.defineProperty` 那样手动定义 getter 和 setter。这使得代码更加清晰和易于理解。
- 能力更完整：`Proxy` 并不意味着在所有场景下性能都更好，Vue3 选择它的核心原因是它可以拦截更多操作（如属性新增、删除、in、ownKeys、数组索引和长度变化等），让响应式实现更统一，也减少了 Vue2 中对数组方法重写和 `Vue.set` / `Vue.delete` 之类补丁方案的依赖。
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

`watch`：默认是惰性的，只有监听源发生变化时才会执行回调；如果希望在初始化时先执行一次，需要显式传入 `immediate: true`。

`watchEffect`：注册后会先立即执行一次，用来自动收集副作用中访问到的响应式依赖；之后当依赖变化时会再次执行。需要注意的是，它只会追踪同步执行阶段访问到的依赖。
- 适用场景

`watch`：适用于 监听特定数据 变化并执行副作用的场景，如 API 请求、表单联动、路由参数变化处理等。它更适合以下场景：
- 需要明确指定监听谁
- 需要拿到 `newValue` 和 `oldValue`
- 需要控制是否深度监听、是否立即执行、监听执行时机等选项

`watchEffect`：不需要手动列出依赖，适用于 自动追踪多个响应式依赖 的副作用，如根据多个响应式状态自动发起同步逻辑、日志记录、简单的数据联动等。若副作用依赖很多且不想手动维护依赖列表，`watchEffect` 会更省心；但如果需要精确控制依赖范围，通常优先用 `watch`。
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

## 6、vue3 中如何统一监听组件报错
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
::: tip 提示
`v-memo` 仅用于性能至上场景中的微小优化，应该很少需要。最常见的情况可能是有助于渲染海量 `v-for` 列表 (长度超过 1000 的情况)。
:::

## 9、vue3 中 Teleport 是什么，有哪些应用场景
`Teleport` 是 Vue3 提供的内置组件，用于将组件模板中的一部分 DOM 渲染到当前组件层级之外的指定 DOM 节点中。

::: details 详情
### 作用

在组件开发中，弹窗、抽屉、全局提示、下拉菜单等内容通常不适合渲染在当前组件内部，因为它们可能会受到父元素的 `overflow`、`z-index`、`transform` 等样式影响。

`Teleport` 可以让组件逻辑仍然写在当前组件中，但实际 DOM 被挂载到指定位置，例如 `body` 下。

### 基本用法

```vue
<template>
  <button @click="visible = true">打开弹窗</button>

  <Teleport to="body">
    <div v-if="visible" class="modal-mask">
      <div class="modal">
        <p>这是一个弹窗</p>
        <button @click="visible = false">关闭</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
</script>
```

### 应用场景

- 弹窗、抽屉、全局 loading。
- Toast、Message、Notification。
- 需要脱离父级 DOM 层级限制的浮层组件。

### 注意事项

- `to` 属性需要指向一个真实存在的 DOM 节点，例如 `body` 或 `#modal-root`。
- `Teleport` 只改变 DOM 挂载位置，不改变组件之间的逻辑关系。
- 父子组件通信、依赖注入、响应式状态仍然按原组件树工作。
:::

## 10、vue3 中 Suspense 是什么，有哪些应用场景
`Suspense` 是 Vue3 提供的内置组件，用于协调异步依赖的加载状态。当默认插槽中的异步组件或带有异步 `setup` 的组件还没准备好时，可以先展示 fallback 插槽中的内容。

::: details 详情
### 作用

在页面中使用异步组件、异步数据初始化或路由级懒加载组件时，组件渲染可能需要等待异步逻辑完成。

`Suspense` 可以统一管理这段等待过程，让页面先展示 loading、骨架屏等兜底内容，等异步组件准备好后再展示真实内容。

### 基本用法

```vue
<template>
  <Suspense>
    <template #default>
      <UserProfile />
    </template>

    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>

<script setup>
import UserProfile from "./UserProfile.vue";
</script>
```

`UserProfile.vue` 中可以包含异步 `setup`：

```vue
<template>
  <div>{{ user.name }}</div>
</template>

<script setup>
const user = await fetch("/api/user").then(res => res.json());
</script>
```

### 应用场景

- 异步组件加载。
- 页面初始化时需要等待接口数据。
- 骨架屏、loading、占位内容展示。
- 和路由懒加载结合，优化页面切换体验。

### 注意事项

- `Suspense` 主要用于处理组件树中的异步依赖。
- fallback 插槽会在异步依赖未完成时展示。
- 在复杂项目中，错误处理通常需要配合 `onErrorCaptured` 或全局错误处理。
:::

## 11、vue3 中 defineProps 和 defineEmits 有什么作用
`defineProps` 和 `defineEmits` 是 `<script setup>` 中的编译器宏，分别用于声明组件接收的 props 和组件向外触发的事件。

::: details 详情
### defineProps

`defineProps` 用于声明父组件传入的属性。它不需要从 `vue` 中导入，会在编译阶段被处理。

```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <h3>{{ props.title }}</h3>
  <p>{{ props.count }}</p>
</template>
```

### defineEmits

`defineEmits` 用于声明组件会触发哪些事件，并返回一个 `emit` 函数。

```vue
<script setup>
const emit = defineEmits(["change", "submit"]);

function handleClick() {
  emit("change", 1);
}
</script>

<template>
  <button @click="handleClick">修改</button>
</template>
```

### 使用 TypeScript 声明

```vue
<script setup lang="ts">
const props = defineProps<{
  title: string;
  count?: number;
}>();

const emit = defineEmits<{
  change: [value: number];
  submit: [form: { name: string }];
}>();
</script>
```

### 注意事项

- `defineProps` 和 `defineEmits` 只能在 `<script setup>` 顶层使用。
- 它们是编译器宏，不需要手动导入。
- props 是只读的，子组件不应该直接修改 props。
- 建议显式声明 emits，便于类型提示、事件文档和维护。
:::

## 12、vue3 中 defineExpose 有什么作用
`defineExpose` 是 `<script setup>` 中的编译器宏，用于显式暴露组件内部的属性和方法，让父组件可以通过模板 ref 访问。

::: details 详情
### 为什么需要 defineExpose

在普通 `<script>` 组件中，父组件通过 ref 获取到的组件实例通常可以访问组件内部暴露在实例上的属性和方法。

但在 `<script setup>` 中，组件默认是关闭的，内部声明的变量和方法不会自动暴露给父组件。如果父组件确实需要调用子组件方法，就需要使用 `defineExpose` 显式暴露。

### 子组件

```vue
<template>
  <div>{{ count }}</div>
</template>

<script setup>
import { ref } from "vue";

const count = ref(0);

function reset() {
  count.value = 0;
}

function increment() {
  count.value++;
}

defineExpose({
  reset,
  increment,
});
</script>
```

### 父组件

```vue
<template>
  <Counter ref="counterRef" />
  <button @click="handleReset">重置子组件</button>
</template>

<script setup>
import { ref } from "vue";
import Counter from "./Counter.vue";

const counterRef = ref(null);

function handleReset() {
  counterRef.value?.reset();
}
</script>
```

### 注意事项

- `defineExpose` 只能在 `<script setup>` 顶层使用。
- 只暴露父组件确实需要访问的属性和方法，避免组件之间过度耦合。
- 常规父子通信仍然优先使用 props 和 emits。
- 适合暴露表单校验、重置、聚焦、滚动等命令式方法。
:::

## 13、vue3 中 ref 和 shallowRef 有什么区别
`ref` 和 `shallowRef` 都可以创建响应式引用，但它们对对象类型数据的响应式处理深度不同。

::: details 详情
### ref

`ref` 会对对象类型的值做深层响应式转换。也就是说，对象内部的属性变化也会触发更新。

```vue
<script setup>
import { ref } from "vue";

const user = ref({
  name: "Tom",
  info: {
    age: 18,
  },
});

function updateAge() {
  user.value.info.age++;
}
</script>
```

在上面示例中，修改 `user.value.info.age` 会触发视图更新。

### shallowRef

`shallowRef` 只追踪 `.value` 本身的变化，不会对对象内部属性做深层响应式转换。

```vue
<script setup>
import { shallowRef } from "vue";

const user = shallowRef({
  name: "Tom",
  info: {
    age: 18,
  },
});

function updateAge() {
  user.value.info.age++;
  // 不会触发视图更新
}

function replaceUser() {
  user.value = {
    name: "Jerry",
    info: {
      age: 20,
    },
  };
  // 会触发视图更新
}
</script>
```

### 适用场景

- `ref`：适合普通状态，尤其是需要追踪内部属性变化的对象。
- `shallowRef`：适合大型对象、第三方库实例、不可变数据、只关心整体替换的场景。

### 总结

| 对比项 | ref | shallowRef |
| --- | --- | --- |
| 响应式深度 | 深层响应式 | 只追踪 value |
| 内部属性变化 | 会触发更新 | 不会触发更新 |
| 整体替换 value | 会触发更新 | 会触发更新 |
| 适合场景 | 普通状态 | 大对象、外部实例、性能优化 |

如果对象内部字段需要频繁响应式更新，使用 `ref`；如果只需要在整体替换时更新，或对象很大、不希望深层代理，使用 `shallowRef`。
:::

## 14、vue3 中 toRef 和 toRefs 有什么作用
`toRef` 和 `toRefs` 都用于把响应式对象中的属性转换成 ref，常用于解决解构 `reactive` 对象后丢失响应式的问题。

::: details 详情
### 为什么需要 toRef 和 toRefs

`reactive` 返回的是一个响应式代理对象，如果直接解构其中的属性，会得到普通值，从而丢失响应式。

```js
import { reactive } from "vue";

const state = reactive({
  count: 0,
  name: "Tom",
});

const { count } = state;

state.count++;
console.log(count); // 仍然是 0，不会跟着更新
```

### toRef

`toRef` 用于把响应式对象中的某一个属性转换成 ref。

```vue
<script setup>
import { reactive, toRef } from "vue";

const state = reactive({
  count: 0,
  name: "Tom",
});

const count = toRef(state, "count");

function increment() {
  count.value++;
}
</script>
```

`count.value` 和 `state.count` 会保持同步。

### toRefs

`toRefs` 用于把响应式对象中的所有属性都转换成 ref。

```vue
<script setup>
import { reactive, toRefs } from "vue";

const state = reactive({
  count: 0,
  name: "Tom",
});

const { count, name } = toRefs(state);
</script>

<template>
  <p>{{ count }}</p>
  <p>{{ name }}</p>
</template>
```

### 应用场景

- 解构 `reactive` 对象并保留响应式。
- 组合式函数返回响应式对象时，方便调用方解构使用。
- 将 props 中的某个属性转换为 ref 后传给组合式函数。

### 注意事项

- `toRef` 和 `toRefs` 生成的 ref 与原响应式对象属性保持同步。
- `toRefs` 只会转换对象当前已有的属性。
- 如果只需要转换一个属性，使用 `toRef`；如果需要批量解构，使用 `toRefs`。
:::

## 15、vue3 中 provide 和 inject 有什么作用
`provide` 和 `inject` 用于跨层级组件通信。祖先组件可以通过 `provide` 提供数据，后代组件可以通过 `inject` 注入并使用这些数据。

::: details 详情
### 基本用法

祖先组件提供数据：

```vue
<script setup>
import { provide, ref } from "vue";

const theme = ref("dark");

function changeTheme(value) {
  theme.value = value;
}

provide("theme", theme);
provide("changeTheme", changeTheme);
</script>
```

后代组件注入数据：

```vue
<script setup>
import { inject } from "vue";

const theme = inject("theme");
const changeTheme = inject("changeTheme");
</script>

<template>
  <div>当前主题：{{ theme }}</div>
  <button @click="changeTheme('light')">切换主题</button>
</template>
```

### 响应式

如果 `provide` 的是 `ref`、`reactive` 等响应式数据，后代组件通过 `inject` 拿到后仍然可以保持响应式。

```js
const count = ref(0);

provide("count", count);
```

### 应用场景

- 跨多层组件传递全局配置，例如主题、语言、权限。
- 表单组件向子表单项传递上下文。
- 组件库中父组件向深层子组件共享状态。

### 注意事项

- `provide/inject` 适合跨层级共享上下文，不适合替代所有状态管理。
- 如果数据来源和修改逻辑分散，后期会难以维护。
- 建议将修改方法也由提供方暴露，避免后代组件随意修改共享状态。
- 大型全局状态仍然更适合使用 Pinia 等状态管理方案。
:::

## 16、vue3 中 effectScope 有什么作用
`effectScope` 用于收集和统一管理响应式副作用，例如 `computed`、`watch`、`watchEffect`。当不再需要这些副作用时，可以一次性停止它们。

::: details 详情
### 为什么需要 effectScope

在组件内部创建的响应式副作用会随着组件卸载自动清理。但在组件外部、插件、组合式函数或动态创建的逻辑中，如果没有统一管理副作用，可能会造成内存泄漏。

`effectScope` 可以把一组响应式副作用放到同一个作用域中，后续通过 `scope.stop()` 一次性停止。

### 基本用法

```js
import { effectScope, ref, watch, computed } from "vue";

const scope = effectScope();

scope.run(() => {
  const count = ref(0);
  const double = computed(() => count.value * 2);

  watch(count, value => {
    console.log("count changed:", value);
  });

  count.value++;
  console.log(double.value);
});

// 停止作用域内收集到的 computed、watch 等副作用
scope.stop();
```

### 应用场景

- 组合式函数中统一管理多个 watcher。
- 插件或全局状态模块中管理响应式副作用。
- 动态创建一组响应式逻辑，并在某个时机整体销毁。

### 注意事项

- `effectScope` 更偏底层能力，日常业务组件里不一定常用。
- 组件内部的 `watch` 通常会随组件卸载自动清理，不需要额外包一层 `effectScope`。
- 适合封装复杂组合式函数、插件和可销毁的响应式模块。
:::

## 17、vue3 中 markRaw 和 toRaw 有什么作用
`markRaw` 和 `toRaw` 都和 Vue3 响应式代理有关。`markRaw` 用于标记一个对象永远不要被转成响应式代理，`toRaw` 用于从响应式代理中拿到原始对象。

::: details 详情
### markRaw

`markRaw` 可以让对象跳过响应式转换。即使这个对象被放进 `reactive` 或 `ref` 中，也不会被代理。

```js
import { reactive, markRaw } from "vue";

const chartInstance = markRaw({
  render() {
    console.log("render chart");
  },
});

const state = reactive({
  chart: chartInstance,
});

console.log(state.chart === chartInstance); // true
```

适合场景：

- 第三方库实例，例如图表实例、地图实例、编辑器实例。
- 不希望被深层代理的大型对象。
- 只作为普通对象存储，不参与响应式更新的数据。

### toRaw

`toRaw` 用于获取响应式对象对应的原始对象。

```js
import { reactive, toRaw } from "vue";

const raw = {
  count: 1,
};

const state = reactive(raw);

console.log(state === raw); // false
console.log(toRaw(state) === raw); // true
```

适合场景：

- 调试响应式对象。
- 需要把原始对象传给不接受 Proxy 的第三方库。
- 做对象身份比较时排查代理对象和原始对象不一致的问题。

### 注意事项

- 不建议长期持有 `toRaw` 返回的原始对象并直接修改，否则可能绕过响应式更新。
- `markRaw` 会让对象跳过响应式系统，适合明确不需要响应式的数据。
- 如果只是为了性能优化，应先确认响应式代理确实是性能瓶颈。
:::

## 18、vue3 中 nextTick 有什么作用
`nextTick` 用于在下一次 DOM 更新完成后执行回调。它常用于在响应式数据变化后，等待页面 DOM 更新完成，再读取或操作 DOM。

::: details 详情
### 为什么需要 nextTick

Vue 会把同一轮事件循环中的多次状态修改合并，然后异步更新 DOM。

```vue
<template>
  <div ref="boxRef">{{ count }}</div>
  <button @click="handleClick">增加</button>
</template>

<script setup>
import { ref, nextTick } from "vue";

const count = ref(0);
const boxRef = ref(null);

async function handleClick() {
  count.value++;

  console.log(boxRef.value.textContent); // 可能还是旧内容

  await nextTick();

  console.log(boxRef.value.textContent); // DOM 已更新
}
</script>
```

### 应用场景

- 数据变化后读取最新 DOM 尺寸。
- 列表渲染后滚动到底部。
- 弹窗打开后自动聚焦输入框。
- 状态更新后执行依赖最新 DOM 的第三方库逻辑。

### 注意事项

- `nextTick` 等待的是 Vue 的 DOM 更新，不是等待接口请求完成。
- 不要滥用 `nextTick`，大多数业务逻辑可以通过响应式数据驱动。
- 如果要监听数据变化后访问 DOM，也可以考虑 `watch` 的 `flush: "post"`。
:::

## 19、vue3 中 readonly 和 shallowReadonly 有什么区别
`readonly` 和 `shallowReadonly` 都可以创建只读代理对象，区别在于只读限制的深度不同。

::: details 详情
### readonly

`readonly` 会对对象做深层只读处理，对象内部嵌套属性也不能被修改。

```js
import { readonly } from "vue";

const state = readonly({
  user: {
    name: "Tom",
  },
});

state.user.name = "Jerry"; // 开发环境会警告，修改不会生效
```

### shallowReadonly

`shallowReadonly` 只限制第一层属性，嵌套对象内部属性仍然可以被修改。

```js
import { shallowReadonly } from "vue";

const state = shallowReadonly({
  user: {
    name: "Tom",
  },
});

state.user = {}; // 不允许
state.user.name = "Jerry"; // 可以修改嵌套对象
```

### 应用场景

- `readonly`：希望暴露给外部使用但不允许外部修改的完整状态。
- `shallowReadonly`：只需要保护顶层引用，内部对象由其他系统或模块管理。

### 注意事项

- 只读代理主要用于约束修改入口，不等同于深拷贝或不可变数据结构。
- 如果原始对象本身被修改，只读代理仍然能反映最新值。
- 对外暴露状态时，常用 `readonly` 防止调用方直接修改内部状态。
:::

## 20、vue3 中 customRef 有什么作用
`customRef` 用于创建一个自定义 ref，让开发者自己控制依赖收集和更新触发时机。

::: details 详情
### 基本概念

普通 `ref` 在读取 `.value` 时会收集依赖，在修改 `.value` 时会触发更新。

`customRef` 会把 `track` 和 `trigger` 暴露出来：

- `track`：手动收集依赖。
- `trigger`：手动触发依赖更新。

### 防抖 ref 示例

```js
import { customRef } from "vue";

function useDebouncedRef(value, delay = 300) {
  let timer;

  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
```

### 应用场景

- 输入框防抖。
- 控制响应式更新频率。
- 和外部状态系统集成。
- 对响应式读写行为做定制封装。

### 注意事项

- `get` 中通常需要调用 `track()`，否则依赖不会被收集。
- `set` 中需要在合适时机调用 `trigger()`，否则视图不会更新。
- 不建议在普通状态下滥用，只有需要自定义更新时机时才使用。
:::

## 21、vue3 中 defineExpose 有什么作用
`defineExpose` 用于在 `<script setup>` 组件中显式暴露属性或方法，让父组件通过模板 ref 访问。

::: details 详情
### 为什么需要 defineExpose

在 `<script setup>` 中，组件内部变量默认不会暴露给父组件实例。

如果父组件需要通过 ref 调用子组件方法，需要子组件主动暴露：

```vue
<!-- Child.vue -->
<script setup>
import { ref } from "vue";

const count = ref(0);

function reset() {
  count.value = 0;
}

defineExpose({
  reset,
});
</script>
```

父组件中使用：

```vue
<script setup>
import { ref } from "vue";
import Child from "./Child.vue";

const childRef = ref(null);

function handleReset() {
  childRef.value?.reset();
}
</script>

<template>
  <Child ref="childRef" />
  <button @click="handleReset">重置</button>
</template>
```

### 应用场景

- 表单组件暴露 `validate`、`reset` 方法。
- 弹窗组件暴露 `open`、`close` 方法。
- 复杂组件向父组件提供少量命令式能力。

### 注意事项

- 优先使用 props 和 emits 通信，避免父组件过度依赖子组件内部实现。
- 只暴露必要的稳定接口，不要把所有内部状态都暴露出去。
- `defineExpose` 只能在 `<script setup>` 顶层使用。
:::

## 22、vue3 中 watch 如何清理副作用
`watch` 中可以通过清理函数取消上一次副作用，避免异步请求、定时器或事件监听在数据变化后继续影响当前状态。

::: details 详情
### 为什么需要清理

当监听值频繁变化时，旧的异步任务可能比新的异步任务更晚完成，导致旧结果覆盖新结果。

例如搜索框输入时，用户连续输入多个关键字，如果不取消旧请求，就可能出现结果错乱。

### onCleanup 用法

```vue
<script setup>
import { ref, watch } from "vue";

const keyword = ref("");
const result = ref([]);

watch(keyword, async (newKeyword, oldKeyword, onCleanup) => {
  const controller = new AbortController();

  onCleanup(() => {
    controller.abort();
  });

  const response = await fetch(`/api/search?q=${newKeyword}`, {
    signal: controller.signal,
  });

  result.value = await response.json();
});
</script>
```

当 `keyword` 再次变化时，Vue 会先执行上一次注册的清理函数，再执行新的回调。

### 常见清理对象

- 未完成的网络请求。
- `setTimeout`、`setInterval`。
- 事件监听器。
- WebSocket 订阅。
- 第三方库创建的实例或副作用。

### 注意事项

- 清理函数应在 watch 回调中同步注册，不要等异步逻辑后再注册。
- `watchEffect` 也支持类似的清理机制。
- 如果副作用和组件生命周期绑定，也要考虑组件卸载时的清理。
:::
