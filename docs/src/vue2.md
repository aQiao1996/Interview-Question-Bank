---
lang: zh-CN
title: vue2
description: vue2面试题
---
# vue2

## 1、 vue 中 v-if 和 v-show 的区别是什么
- v-if 是一个条件渲染指令，当条件为真时，它将渲染元素，否则它将移除元素。
- v-show 是一个条件渲染指令，它将元素通过 `display` 显示或隐藏，而不会移除它。
::: details 详情
|​特性|​v-if|​v-show|
|---|------|------|
|​渲染方式|`惰性渲染`：条件为 true 时渲染元素，条件为 false 时从 DOM 中移除元素。|`始终渲染`：始终将元素渲染到 DOM 中，通过 display 样式控制显示或隐藏。|
|​性能开销|较大：每次条件变化时，都会重新渲染或销毁元素。适用于条件不频繁变化的场景。|较小：元素始终保留在 DOM 中，仅通过 display 属性控制显示状态。适用于条件频繁变化的场景。
|​适用场景|条件判断不频繁变化，或需要完全销毁和重建 DOM 元素的场景。例如，根据条件加载某个组件或列表项。|条件频繁变化的场景，如切换标签、菜单等。不需要频繁销毁和创建 DOM 元素，效率更高。|
|​初始渲染|初始渲染时，如果条件为 false，元素不会被渲染到 DOM 中。|初始渲染时，无论条件如何，元素始终会被渲染到 DOM 中，只是通过 display: none 隐藏。|
|​内存开销|较大：由于频繁销毁和重建 DOM 元素，内存开销较大，特别是在频繁切换的情况下。|较小：仅控制元素的显示状态，不涉及频繁的 DOM 操作，内存开销较小，适合频繁切换的场景。|

- 永远不要把 v-if 和 v-for 同时用在同一个元素上，带来性能方面的浪费（每次渲染都会先循环再进行条件判断）。
- 如果避免出现这种情况，则在外层嵌套template（页面渲染不生成dom节点），在这一层进行v-if判断，然后在内部进行v-for循环或者先使用 computed 进行处理后渲染。
:::

## 2、 vue 中 v-model 是什么
v-model 是一个语法糖，它主要用于表单元素（也可以用于 div 上，但是并没有什么意义）上，实现双向数据绑定。

在内部，v-model 实际上是以下两个操作的简写：
- 使用 v-bind 将数据属性绑定到表单元素的 value 属性上。
- 使用 v-on 监听表单元素的输入事件，并在事件触发时更新数据属性的值。
``` vue
<!-- 原生元素 -->
<input v-model="searchText" />
<!-- 在代码背后，模板编译器会对 v-model 进行更冗长的等价展开。因此上面的代码其实等价于下面这段 -->
<input :value="searchText" @input="searchText = $event.target.value" />
```

## 3、 vue 中 computed 的原理是什么
computed 属性是一个特殊的属性，它允许你定义一个计算属性，该计算属性的值会根据其依赖项的值进行计算。当依赖项的值发生变化时，计算属性的值也会自动更新。computed 属性通过响应式依赖追踪和缓存机制，提供了一种高效且便捷的方式来处理依赖于其他数据的状态。
::: details 详情
要讲清楚，computed 原理，首先得讲vue响应式原理，因为 computed 的实现是基于 `Watcher` 对象的。 那么 vue 的响应式原理是什么，众所周知，vue2 是基于 `Object.defineProperty` 实现监听的。在 vue 初始化数据 data 和 computed 数据过程中。会涉及到以下几个对象：
- Observe 对象
- Dep 对象
- Watch 对象 

Observe 对象是在 data 执行响应式时候调用，因为 computed 属性基于响应式属性，所以其不需要创建 Observe 对象。 Dep 对象主要功能是做依赖收集，有个属性维护多个 Watch 对象，当更新时候循环调用每个 Watch 执行更新。 Watch 对象主要是用于更新，而且是收集的重点对象。

这里谈到 computed 计算属性，首先要知道，其有两种定义方式，一种是方法，另一种是 get，set 属性。而且，其内部监听的对象必须是已经定义响应式的属性。

vue 在创建 computed 属性时候，会循环所有计算属性，每一个计算属性会创建一个 watch，并且在通过 defineProperty 定义监听，在 get 中，计算属性工作是做依赖收集，在 set 中，计算属性重要工作是重新执行计算方法，这里需要多补充一句，因为computed 是懒执行，也就是说第一次初始化之后，就不会执行计算，下一次变更执行重新计算是在 set 中。

另一个补充点是依赖收集的时机，computed 收集时机和 data 一样，是在组件挂载前，但是其收集对象是自己属性对应的 watch，而data 本身所有数据对应一个 watch。
```js
// 这是 computed 源码
function initComputed(vm: Component, computed: Object) {
  // 禁用Flow类型检查的注释（Flow是JavaScript的静态类型检查工具）
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  
  // 判断是否在服务器端渲染（SSR）环境中
  const isSSR = isServerRendering();
 
  // 遍历computed对象中的所有属性
  for (const key in computed) {
    const userDef = computed[key];
    
    // 获取getter函数，如果userDef是函数则直接使用，否则尝试获取userDef.get
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    
    // 在非生产环境下，如果getter未定义，则发出警告
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`计算属性 "${key}" 缺少 getter 函数。`, vm);
    }
 
    // 如果不是在服务器端渲染环境中
    if (!isSSR) {
      // 为计算属性创建内部的Watcher实例，用于依赖追踪和缓存更新
      watchers[key] = new Watcher(
        vm,
        getter || noop,          // getter函数，如果不存在则使用空操作函数
        noop,                    // setter函数，计算属性默认没有setter，使用空操作函数
        computedWatcherOptions   // 计算属性专用的Watcher选项
      );
    }
 
    // 如果该计算属性尚未在组件实例上定义
    if (!(key in vm)) {
      // 在组件实例上定义计算属性
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      // 在非生产环境下，如果计算属性与data中的属性同名，则发出警告
      if (key in vm.$data) {
        warn(`计算属性 "${key}" 已经在 data 中定义。`, vm);
      } 
      // 如果计算属性与props中的属性同名，则发出警告
      else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `计算属性 "${key}" 已经被定义为 prop。`,
          vm,
        );
      }
    }
  }
}
```
计算属性默认是`只读`的，只有 `getter`，不过在需要时你也可以提供一个 setter：
```js
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    // 修改依赖的数据后，依赖于这些数据的 computed 属性会在需要时自动重新计算（即 getter 会被重新执行），但这是由 Vue 的响应式系统自动处理的，而不是 setter 直接触发的重置。
    // 可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```
:::

## 4、 vue 中 watch 的原理是什么
watch 属性是一个特殊的属性，它允许你定义一个观察器，该观察器会监控一个或多个数据属性的变化，并在数据属性发生变化时执行相应的回调函数。watch 属性通过响应式依赖追踪和回调机制，提供了一种高效且便捷的方式来处理
::: details 详情
watch 的实现原理与 computed 类似，都是基于 Vue 的响应式系统，通过 `Watcher` 对象实现依赖追踪和回调机制。以下是具体原理：
- 依赖响应式系统
  > Vue 的响应式系统是基于 `Object.defineProperty` 实现的。当 data 中的属性被修改时，会触发对应的 setter，从而通知依赖该属性的 Watcher 对象。

- 创建 Watcher
  > 当定义 watch 时，Vue 会为每个 watch 属性创建一个 Watcher 实例。这个 Watcher 会订阅所监控的属性（即依赖），并在属性变化时触发回调函数。

- 依赖收集
  > 在 watch 初始化时，Watcher 会读取所监控的属性值，从而触发该属性的 getter，并将 Watcher 添加到该属性的依赖列表中（由 Dep 管理）。

- 属性变化通知
  > 当监控的属性发生变化时，会触发其 setter，setter 会通知依赖列表中的所有 Watcher，从而执行 watch 的回调函数。
:::

## 5、 vue 中 watch 和 computed 的区别
watch 是 Vue 中用于监听数据变化并执行副作用的机制，而 computed 是基于依赖数据动态计算并缓存结果的响应式属性。
::: details 详情
|​特性|Computed（计算属性）​|​Watch（监听器）​|
|---|--------|--------|
|​用途|根据现有响应式数据计算并返回新的值，常用于派生数据。|监听特定数据的变化，并在变化时执行相应的操作或副作用。|
|​缓存机制|具有缓存功能，只有当依赖的数据变化时才重新计算，否则使用缓存的值。|没有缓存，每次监听的数据变化时都会执行回调函数。|
|​数据流|​只读​（默认情况下）。可以通过定义 setter 来实现可写。|​可读写，通过回调函数可以读取和修改数据。|
|​适用场景|派生数据，如根据 firstName 和 lastName 计算 fullName、需要缓存结果以提高性能的场景。|在数据变化时执行异步操作，如发送请求、执行复杂的逻辑或副作用，如手动 DOM 操作、监听特定数据变化并执行特定操作。|
|​声明方式|在 computed 对象中定义计算属性，通常是一个返回值的函数，可以有 getter 和可选的 setter。|在 watch 对象中定义监听器，可以是一个回调函数或配置对象（包含 handler、immediate、deep 等选项）。|
|自动 vs 手动|​自动计算并响应依赖的变化，开发者无需手动触发。​|​手动执行回调函数，开发者需要定义在数据变化时需要执行的逻辑。​|
|​性能|由于缓存机制，适用于频繁访问但不常变化的数据，性能较好。|每次数据变化都会触发回调，如果回调函数复杂或频繁触发，可能影响性能。需谨慎使用，尤其是在大型应用中。|
:::

## 6、 vue 中 computed 和 方法 的区别
- computed 计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。
- 方法调用总是会在重渲染发生时再次执行函数。
  > 为什么需要缓存呢？想象一下我们有一个非常耗性能的计算属性 list，需要循环一个巨大的数组并做许多计算逻辑，并且可能也有其他计算属性依赖于 list。没有缓存的话，我们会重复执行非常多次 list 的 getter，然而这实际上没有必要！如果你确定不需要缓存，那么也可以使用方法调用。

## 7、 vue 中 生命周期钩子函数
生命周期钩子函数是 Vue 组件的几个重要阶段，它们在组件的创建、更新和销毁时触发，允许开发者在特定的阶段执行特定的代码逻辑。以下是 Vue的生命周期钩子函数及其触发时机：
|​钩子函数|触发时机|
|---|---|
|beforeCreate|组件实例创建之前，在数据观测(data observer) 和 event/watcher 事件配置之前。|
|created|组件实例已经创建完成，数据观测(data observer) 和 event/watcher 事件配置已经完成。|
|beforeMount|组件挂载开始之前，在 render 函数中，对组件的 template 进行编译，但是还没有挂载到 DOM 上。|
|mounted|组件挂载结束之后，模板编译完成，挂载到 DOM 上。|
|beforeUpdate|组件更新之前，在 render 函数中，对组件的 template 进行编译，但是还没有挂载到 DOM 上。|
|updated|组件更新完成，模板编译完成，挂载到 DOM 上。|
|beforeDestroy|组件销毁之前，在调用 unmounted 之前。|
|destroyed|组件销毁完成，调用 unmounted 之后。|
|activated|keep-alive 组件激活时调用。|
|deactivated|keep-alive 组件停用时调用。|

## 8、 vue 中 为什么data属性是一个函数而不是一个对象
vue 实例的时候定义 data 属性既可以是一个对象，也可以是一个函数。vue 组件可能会有很多个实例，为了防止多个组件实例对象之间共用一个data，产生数据污染，采用函数形式可以返回一个全新 data 对象，使每个实例对象的数据不会受到其他实例对象数据的污染。

## 9、 vue 中 组件之间的通信方式都有哪些
- 父子组件通信：父组件向子组件传递数据，子组件通过 props 接收。子组件向父组件传递数据，父组件通过 $emit() 方法触发事件，子组件通过v-on 监听事件。
- 兄弟组件通信：通过事件总线（EventBus），父组件中转 或者 Vuex 来实现。
- 祖孙与后代组件之间通信：通过事件总线（EventBus）或者 Vuex 来实现,通过 provide 和 inject：Vue 提供的依赖注入机制，允许祖先组件向后代组件传递数据。。
- 非关系组件通信：通过事件总线（EventBus）或者 Vuex 来实现。
::: details 详情
|​通信方式|描述|优点|缺点|
|---|------|--------|--------|
|​props/$emit|父子组件通过props和$emit传递数据|简单直观，明确的数据流|不适用于兄弟组件或深层嵌套组件|
|$refs|父组件通过ref直接访问子组件实例|直接操作子组件，方便特定场景|破坏封装性，增加耦合度|
|​provide/inject|父组件provide数据，子组件inject注入|适用于深层嵌套组件，减少props传递|数据流不明确，可能导致隐式依赖|
|​Event Bus|使用全局事件总线进行组件间通信|灵活，适用于任意组件通信|事件管理复杂，调试困难|
|​Vuex|集中式状态管理工具，集中存储和管理应用状态|适合大型应用，集中管理状态，易于维护|学习曲线陡峭，增加项目复杂度|
:::