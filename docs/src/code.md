---
lang: zh-CN
title: code
description: 手写题
---

# code

## 1、根据以下代码进行对应操作
- `tree` 是一个层级不固定的树形结构，每个节点包含 `key`、`count` 和 `children` 属性。编写一段代码，递归计算每个节点的 `count` 值，`count` 值表示以该节点为根的子树中包含的节点总数（包含当前节点自身）。
::: details 点击查看实例代码
```js
const tree = {
  key: "0",
  count: 0,
  children: [
    {
      key: "0-0",
      count: 0,
      children: [
        {
          key: "0-0-0",
          count: 0,
          children: [],
        },
        {
          key: "0-0-1",
          count: 0,
          children: [],
        },
      ],
    },
    {
      key: "0-1",
      count: 0,
      children: [],
    },
  ],
};
```
:::

::: details 详情
```js
/**
 * 递归计算树形结构中每个节点的 count 值
 * count 值表示以该节点为根的子树中包含的节点总数（包含当前节点自身）
 * @param {Object} node - 当前需要计算 count 值的节点，该节点包含 key、count 和 children 属性
 * @returns {Object} - 返回计算好 count 值后的当前节点
 */
const calculateCount = node => {
  // 获取当前节点的子节点数组长度
  const length = node.children.length;

  // 如果子节点数组长度为 0，说明当前节点没有子节点
  if (!length) {
    // 没有子节点时，count 值仅包含当前节点自身，所以设为 1
    node.count = 1; 
    // 返回计算好 count 值的当前节点
    return node;
  }

  // 初始化一个变量 total，用于累加所有子节点的 count 值
  let total = 0;

  // 遍历当前节点的所有子节点
  for (let index = 0; index < length; index++) {
    // 获取当前遍历到的子节点
    const child = node.children[index];
    // 递归调用 calculateCount 函数，计算子节点的 count 值
    calculateCount(child); 
    // 将子节点计算好的 count 值累加到 total 中
    total += child.count;
  }

  // 当前节点的 count 值等于所有子节点的 count 值总和加上自身（即加 1）
  node.count = total + 1;
  // 返回计算好 count 值的当前节点
  return node;
};


const result = calculateCount(tree);
console.log("🚀 ~ index.js:39 ~ result:", result);
```
::: 

## 2、手写防抖函数
- 防抖函数：防抖函数是指在事件被触发n秒后再执行回调，如果在这n秒内事件又被触发，则重新开始延时。
- 应用场景：
  > - 搜索框输入。
  > - 窗口resize。
  > - 按钮点击。
  > - 滚动事件。
- 实现原理：
  > - 利用闭包保存定时器。
  > - 每次触发事件时，先清除之前的定时器，再重新设置定时器。
  > - 定时器到期后，执行回调函数。
::: details 详情
```js
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    // 每次触发事件时，先清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }
    // 重新设置定时器
    timer = setTimeout(() => {
      // 定时器到期后，执行回调函数，绑定当前上下文和参数
      fn.apply(this, args);
    }, delay);
  };
}

// 测试防抖函数
const testFn = debounce(() => {
  console.log("防抖函数触发");
}, 1000);

// 模拟连续触发事件
testFn(); // 1秒后触发
testFn(); // 1秒后触发
testFn(); // 1秒后触发
```
:::

## 3、手写节流函数
- 节流函数：节流函数是指在事件被触发n秒内只执行一次回调。
- 应用场景：
  > - 按钮点击。
  > - 窗口resize。
  > - 滚动事件。
- 实现原理：
  > - 利用闭包保存上次执行时间。
  > - 每次触发事件时，获取当前时间与上次执行时间的差值。
  > - 如果差值大于等于设定的时间间隔，则执行回调函数，并更新上次执行时间。
::: details 详情
```js
function throttle(fn, delay) {
  let lastTime = 0; // 上一次执行函数的时间戳，初始为 0
  return function (...args) {
    // 当前时间戳
    const nowTime = Date.now();
    // 计算当前时间与上次执行时间的差值，
    // 如果差值大于等于设定的时间间隔，则执行回调函数，并更新上次执行时间
    if (nowTime - lastTime >= delay) {
      // 执行回调函数，绑定当前上下文和参数
      fn.apply(this, args);
      // 更新上次执行时间为当前时间
      lastTime = nowTime;
    }
    // 如果差值小于设定的时间间隔，则不执行回调函数
  };
}
```
:::

## 4、手写柯里化函数
- 柯里化函数：柯里化函数是指将一个多参数函数转换为多个单参数函数的技术。
- 应用场景：
  > - 函数参数复用。
  > - 函数参数延迟执行。
- 实现原理：
  > - 利用闭包保存参数。
  > - 每次调用函数时，判断参数是否足够。
  > - 如果参数足够，则执行回调函数。
  > - 如果参数不足，则返回新的函数，等待参数补充。
::: details 详情
```js
function currying(fn, ...args) {
  // 如果参数足够，则执行回调函数
  if (args.length >= fn.length) {
    return fn.apply(this, args);
  }
  // 如果参数不足，则返回新的函数，等待参数补充
  // return currying.bind(this, fn, ...args);
  return (...newArgs) => currying(fn, ...args, ...newArgs);
}

// 测试柯里化函数
const testFn = currying((a, b, c) => {
  console.log("柯里化函数触发", a, b, c);
});

// 模拟连续触发事件
testFn(1)(2)(3); // 柯里化函数触发 1 2 3
testFn(1, 2)(3); // 柯里化函数触发 1 2 3
testFn(1, 2, 3); // 柯里化函数触发 1 2 3
```
:::

## 5、手写冒泡排序
- 冒泡排序：冒泡排序是一种简单的排序算法，它重复地遍历待排序的数列，比较相邻元素并交换顺序错误的元素，直到没有需要交换的元素为止。
- 应用场景：
  > - 数组排序。
- 实现原理：
  > - 从第一个元素开始，比较相邻的两个元素。
  > - 如果第一个元素大于第二个元素，则交换它们的位置。
  > - 对每一对相邻的元素做同样的工作，从开始第一对到结尾的最后一对，最后的元素会是最大的数。
  > - 针对所有的元素重复以上的步骤，除了最后一个。
  > - 重复以上步骤，直到没有需要交换的元素为止。
- 优化：
  > - 可以在每一轮排序中，记录最后一次交换的位置，作为下一轮排序的边界。
  > - 可以添加一个标志位，用于判断是否发生了交换。如果没有发生交换，则说明数组已经有序，直接结束排序。
- 时间复杂度：
  > - 平均时间复杂度：O(n^2)
  > - 最坏时间复杂度：O(n^2)
  > - 最好时间复杂度：O(n)
- 空间复杂度：
  > - O(1)
- 稳定性：
  > - 稳定排序算法。
::: details 详情
```js
// 基础版，时间复杂度O(n^2)
function bubbleSort(arr) {
  const len = arr.length;
  // 外层循环，控制排序轮数
  for (let i = 0; i < len - 1; i++) {
    // 内层循环，控制每轮排序的比较次数
    for (let j = 0; j < len - 1 - i; j++) {
      // 比较相邻元素，如果前一个比后一个大
      if (arr[j] > arr[j + 1]) {
        // 交换元素位置（升序）
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  // 返回排序后的数组
  return arr;
}
const arr = [5, 3, 8, 4, 2];
const sortedArr = bubbleSort(arr);
console.log("🚀 ~ index.js:39 ~ sortedArr:", sortedArr);

// 进阶版，时间复杂度可以优化到 ​​O(n)​​
// 优化思路：如果某一轮没有任何交换，说明数组已经有序，可以提前退出！
function bubbleSortOptimized(arr) {
  const len = arr.length;
  let swapped;
  for (let i = 0; i < len - 1; i++) {
    swapped = false;
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // 本轮无交换，说明已有序，直接退出
  }
  return arr;
}
```
:::

## 6、手写深拷贝函数
- 深拷贝：深拷贝是指创建一个新的对象或数组，并递归复制原数据中的每一层属性，使新数据和原数据不共享引用地址。
- 应用场景：
  > - 复制复杂对象，避免修改副本时影响原对象。
  > - 状态管理中保存快照。
  > - 表单数据回显、重置和编辑。
- 实现原理：
  > - 判断当前值是否为对象类型，如果不是对象则直接返回。
  > - 判断当前值是数组还是普通对象，创建对应的新容器。
  > - 遍历对象自身属性，递归拷贝每一项。
  > - 使用 WeakMap 记录已经拷贝过的对象，解决循环引用问题。
- 注意事项：
  > - 基础版本主要处理普通对象和数组。
  > - Date、RegExp、Map、Set、函数、Symbol 等特殊类型需要按业务场景单独处理。
::: details 详情
```js
function deepClone(target, cache = new WeakMap()) {
  // null 和基本数据类型直接返回
  if (target === null || typeof target !== "object") {
    return target;
  }

  // 处理循环引用，如果当前对象已经拷贝过，直接返回缓存结果
  if (cache.has(target)) {
    return cache.get(target);
  }

  // 根据原数据类型创建新的数组或对象
  const result = Array.isArray(target) ? [] : {};

  // 先放入缓存，避免递归过程中遇到循环引用时无限递归
  cache.set(target, result);

  // 只遍历对象自身属性
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      result[key] = deepClone(target[key], cache);
    }
  }

  return result;
}

// 测试深拷贝函数
const obj = {
  name: "前端",
  info: {
    age: 3,
    tags: ["html", "css", "js"],
  },
};
obj.self = obj;

const clonedObj = deepClone(obj);
clonedObj.info.tags.push("vue");

console.log(obj.info.tags); // ["html", "css", "js"]
console.log(clonedObj.info.tags); // ["html", "css", "js", "vue"]
console.log(clonedObj.self === clonedObj); // true
```
:::

## 7、手写数组扁平化函数
- 数组扁平化：数组扁平化是指将多层嵌套数组转换为指定层级或一维数组。
- 应用场景：
  > - 处理树形数据转换后的列表结果。
  > - 合并多层分类、菜单或权限数组。
  > - 面试中考察递归、循环和数组方法的使用。
- 实现原理：
  > - 遍历数组中的每一项。
  > - 如果当前项还是数组，并且还需要继续展开，则递归处理当前项。
  > - 如果当前项不是数组，或者已经达到指定展开层级，则直接放入结果数组。
- 注意事项：
  > - 可以通过 depth 控制展开层级。
  > - 如果需要完全展开，可以传入 Infinity。
::: details 详情
```js
function flatten(arr, depth = 1) {
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }

  return result;
}

// 测试数组扁平化函数
const arr = [1, [2, [3, [4, 5]]], 6];

console.log(flatten(arr)); // [1, 2, [3, [4, 5]], 6]
console.log(flatten(arr, 2)); // [1, 2, 3, [4, 5], 6]
console.log(flatten(arr, Infinity)); // [1, 2, 3, 4, 5, 6]
```
:::

## 8、手写发布订阅模式
- 发布订阅模式：发布订阅模式是一种对象间通信方式，发布者不直接调用订阅者，而是通过事件中心统一管理事件的订阅、触发和取消订阅。
- 应用场景：
  > - 组件之间解耦通信。
  > - 全局事件总线。
  > - 消息通知、状态变化通知。
- 实现原理：
  > - 使用一个对象或 Map 保存事件名和对应的回调函数列表。
  > - 订阅时，将回调函数加入对应事件的列表。
  > - 发布时，依次执行该事件下的所有回调函数。
  > - 取消订阅时，从回调函数列表中移除指定回调。
- 注意事项：
  > - 触发事件时需要透传参数。
  > - 取消订阅时要处理事件不存在或回调不存在的情况。
  > - 可以扩展 once 方法，实现只执行一次的订阅。
::: details 详情
```js
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);
  }

  off(eventName, callback) {
    const callbacks = this.events.get(eventName);
    if (!callbacks) return;

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }

    if (callbacks.length === 0) {
      this.events.delete(eventName);
    }
  }

  emit(eventName, ...args) {
    const callbacks = this.events.get(eventName);
    if (!callbacks) return;

    callbacks.slice().forEach(callback => {
      callback(...args);
    });
  }

  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };

    this.on(eventName, onceCallback);
  }
}

// 测试发布订阅模式
const eventBus = new EventEmitter();

function handleMessage(message) {
  console.log("收到消息：", message);
}

eventBus.on("message", handleMessage);
eventBus.emit("message", "hello"); // 收到消息：hello

eventBus.off("message", handleMessage);
eventBus.emit("message", "world"); // 不会执行

eventBus.once("login", username => {
  console.log("登录用户：", username);
});
eventBus.emit("login", "Tom"); // 登录用户：Tom
eventBus.emit("login", "Jerry"); // 不会执行
```
:::

## 9、手写 instanceof
- instanceof：instanceof 用于判断构造函数的 prototype 属性是否出现在实例对象的原型链上。
- 应用场景：
  > - 判断对象是否由某个构造函数创建。
  > - 判断对象是否属于某个类或父类。
  > - 面试中考察原型链和构造函数的理解。
- 实现原理：
  > - 先获取实例对象的原型，也就是 `Object.getPrototypeOf(left)`。
  > - 再获取构造函数的 `prototype`。
  > - 沿着实例对象的原型链不断向上查找。
  > - 如果某一层原型等于构造函数的 `prototype`，则返回 true。
  > - 如果原型链查找到 null，说明没有找到，返回 false。
- 注意事项：
  > - 基本数据类型不是对象，直接返回 false。
  > - 右侧必须是函数，否则不符合 instanceof 的使用方式。
::: details 详情
```js
function myInstanceof(left, right) {
  if (left === null || (typeof left !== "object" && typeof left !== "function")) {
    return false;
  }

  if (typeof right !== "function") {
    throw new TypeError("Right-hand side of instanceof is not callable");
  }

  let proto = Object.getPrototypeOf(left);
  const prototype = right.prototype;

  while (proto !== null) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

// 测试 instanceof
function Person(name) {
  this.name = name;
}

const person = new Person("Tom");

console.log(myInstanceof(person, Person)); // true
console.log(myInstanceof(person, Object)); // true
console.log(myInstanceof([], Array)); // true
console.log(myInstanceof([], Object)); // true
console.log(myInstanceof("hello", String)); // false
```
:::
