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

## 10、手写 new 操作符
- new 操作符：new 用于创建构造函数的实例对象，并将实例对象的原型指向构造函数的 prototype。
- 应用场景：
  > - 理解构造函数创建实例的过程。
  > - 理解 this、原型链和返回值之间的关系。
  > - 面试中常用于考察 JavaScript 对象创建机制。
- 实现原理：
  > - 创建一个新的空对象。
  > - 将新对象的原型指向构造函数的 prototype。
  > - 使用新对象作为 this 执行构造函数，并传入参数。
  > - 如果构造函数返回对象或函数，则返回该结果。
  > - 如果构造函数没有返回对象，则返回创建的新对象。
- 注意事项：
  > - 构造函数返回基本数据类型时会被忽略。
  > - 构造函数返回对象或函数时，会覆盖默认创建的实例对象。
::: details 详情
```js
function myNew(Constructor, ...args) {
  if (typeof Constructor !== "function") {
    throw new TypeError("Constructor must be a function");
  }

  // 创建一个新对象，并让它的原型指向构造函数的 prototype
  const instance = Object.create(Constructor.prototype);

  // 执行构造函数，让构造函数中的 this 指向新对象
  const result = Constructor.apply(instance, args);

  // 如果构造函数返回对象或函数，则返回该结果，否则返回新对象
  if (result !== null && (typeof result === "object" || typeof result === "function")) {
    return result;
  }

  return instance;
}

// 测试 new 操作符
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function () {
  console.log(this.name);
};

const person = myNew(Person, "Tom", 18);

console.log(person.name); // Tom
console.log(person.age); // 18
console.log(person instanceof Person); // true
person.sayName(); // Tom

function Factory() {
  this.name = "default";
  return {
    name: "custom",
  };
}

console.log(myNew(Factory).name); // custom
```
:::

## 11、手写 call 方法
- call 方法：call 用于改变函数执行时的 this 指向，并立即执行函数，参数以逗号分隔的形式传入。
- 应用场景：
  > - 显式指定函数执行时的 this。
  > - 借用其他对象上的方法。
  > - 面试中考察 this 绑定、对象属性调用和参数处理。
- 实现原理：
  > - 判断调用 myCall 的目标是否为函数。
  > - 将传入的 thisArg 转成对象，null 或 undefined 默认指向全局对象。
  > - 使用 Symbol 创建唯一属性名，避免覆盖 thisArg 上已有属性。
  > - 将当前函数临时挂到 thisArg 上并执行。
  > - 执行完成后删除临时属性，并返回函数执行结果。
- 注意事项：
  > - 基本数据类型作为 thisArg 时，需要通过 Object 包装成对象。
  > - 使用 Symbol 可以避免属性名冲突。
::: details 详情
```js
Function.prototype.myCall = function (thisArg, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myCall must be called on a function");
  }

  const context = thisArg == null ? globalThis : Object(thisArg);
  const fnKey = Symbol("fn");

  context[fnKey] = this;
  const result = context[fnKey](...args);
  delete context[fnKey];

  return result;
};

// 测试 call 方法
function introduce(city, job) {
  return `${this.name} 来自 ${city}，职业是 ${job}`;
}

const user = {
  name: "Tom",
};

const result = introduce.myCall(user, "上海", "前端工程师");

console.log(result); // Tom 来自 上海，职业是 前端工程师

function getType() {
  return Object.prototype.toString.myCall(this);
}

console.log(getType.myCall([])); // [object Array]
```
:::

## 12、手写 apply 方法
- apply 方法：apply 用于改变函数执行时的 this 指向，并立即执行函数，参数以数组或类数组的形式传入。
- 应用场景：
  > - 显式指定函数执行时的 this。
  > - 参数已经以数组形式存在时调用函数。
  > - 借用内置方法处理类数组。
- 实现原理：
  > - 判断调用 myApply 的目标是否为函数。
  > - 将传入的 thisArg 转成对象，null 或 undefined 默认指向全局对象。
  > - 使用 Symbol 创建唯一属性名，将当前函数临时挂到 thisArg 上。
  > - 判断第二个参数是否存在，不存在则直接执行函数。
  > - 如果第二个参数存在，则展开参数数组后执行函数。
  > - 执行完成后删除临时属性，并返回函数执行结果。
- 注意事项：
  > - 第二个参数必须是数组或类数组。
  > - apply 和 call 的核心区别在于参数传递方式不同。
::: details 详情
```js
Function.prototype.myApply = function (thisArg, args) {
  if (typeof this !== "function") {
    throw new TypeError("myApply must be called on a function");
  }

  const context = thisArg == null ? globalThis : Object(thisArg);
  const fnKey = Symbol("fn");

  context[fnKey] = this;

  let result;
  if (args == null) {
    result = context[fnKey]();
  } else {
    result = context[fnKey](...args);
  }

  delete context[fnKey];

  return result;
};

// 测试 apply 方法
function introduce(city, job) {
  return `${this.name} 来自 ${city}，职业是 ${job}`;
}

const user = {
  name: "Tom",
};

const result = introduce.myApply(user, ["上海", "前端工程师"]);

console.log(result); // Tom 来自 上海，职业是 前端工程师

const numbers = [5, 10, 2, 8];

console.log(Math.max.myApply(null, numbers)); // 10
```
:::

## 13、手写 bind 方法
- bind 方法：bind 用于改变函数执行时的 this 指向，但不会立即执行函数，而是返回一个新的函数。
- 应用场景：
  > - 固定函数执行时的 this。
  > - 预置部分参数，实现函数参数复用。
  > - 在事件回调、定时器回调中保留 this 指向。
- 实现原理：
  > - 判断调用 myBind 的目标是否为函数。
  > - 保存原函数、绑定的 thisArg 和预置参数。
  > - 返回一个新函数，新函数执行时合并预置参数和调用参数。
  > - 如果返回的新函数被 new 调用，this 应该指向新创建的实例，而不是绑定的 thisArg。
  > - 维护原函数的原型关系，使 new 调用时实例可以访问原型方法。
- 注意事项：
  > - bind 返回的是函数，不会立即执行。
  > - bind 支持参数分批传入。
  > - bind 后的函数作为构造函数使用时，绑定的 this 会失效。
::: details 详情
```js
Function.prototype.myBind = function (thisArg, ...bindArgs) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  const originalFn = this;

  function boundFn(...callArgs) {
    const isNewCall = this instanceof boundFn;
    const context = isNewCall ? this : thisArg;

    return originalFn.apply(context, [...bindArgs, ...callArgs]);
  }

  // 维护原型关系，保证 new boundFn() 创建的实例可以访问原函数原型上的方法
  boundFn.prototype = Object.create(originalFn.prototype);
  boundFn.prototype.constructor = boundFn;

  return boundFn;
};

// 测试 bind 方法
function introduce(city, job) {
  return `${this.name} 来自 ${city}，职业是 ${job}`;
}

const user = {
  name: "Tom",
};

const boundIntroduce = introduce.myBind(user, "上海");

console.log(boundIntroduce("前端工程师")); // Tom 来自 上海，职业是 前端工程师

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function () {
  console.log(this.name);
};

const BoundPerson = Person.myBind({ name: "绑定对象" }, "Jerry");
const person = new BoundPerson(20);

console.log(person.name); // Jerry
console.log(person.age); // 20
console.log(person instanceof Person); // true
person.sayName(); // Jerry
```
:::

## 14、手写 Promise.all
- Promise.all：Promise.all 用于并发执行多个 Promise，全部成功后按原顺序返回结果数组，只要有一个失败就立即返回失败原因。
- 应用场景：
  > - 多个接口并发请求，并等待全部完成。
  > - 多个异步任务互不依赖，但后续逻辑依赖全部结果。
  > - 面试中考察 Promise、并发控制和结果顺序处理。
- 实现原理：
  > - 返回一个新的 Promise。
  > - 遍历传入的可迭代对象，将每一项通过 Promise.resolve 包装。
  > - 每个 Promise 成功后，将结果保存到对应下标位置。
  > - 使用计数器记录已完成数量，全部完成后 resolve 结果数组。
  > - 任意一个 Promise 失败时，直接 reject 失败原因。
- 注意事项：
  > - 返回结果的顺序和传入顺序一致，不受完成时间影响。
  > - 空数组需要直接 resolve 空数组。
  > - 非 Promise 值也要当作成功值处理。
::: details 详情
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    const result = [];
    let fulfilledCount = 0;

    if (list.length === 0) {
      resolve([]);
      return;
    }

    list.forEach((item, index) => {
      Promise.resolve(item)
        .then(value => {
          result[index] = value;
          fulfilledCount++;

          if (fulfilledCount === list.length) {
            resolve(result);
          }
        })
        .catch(reason => {
          reject(reason);
        });
    });
  });
}

// 测试 Promise.all
const p1 = Promise.resolve(1);
const p2 = new Promise(resolve => {
  setTimeout(() => resolve(2), 1000);
});
const p3 = 3;

promiseAll([p1, p2, p3]).then(result => {
  console.log(result); // [1, 2, 3]
});

const p4 = Promise.reject("error");

promiseAll([p1, p4, p3]).catch(error => {
  console.log(error); // error
});
```
:::

## 15、手写 Promise.race
- Promise.race：Promise.race 用于并发执行多个 Promise，谁最先完成就以谁的结果作为最终结果，最先完成可以是成功也可以是失败。
- 应用场景：
  > - 请求超时控制。
  > - 多个异步任务竞争，只关心最快返回的结果。
  > - 面试中考察 Promise 状态流转和并发处理。
- 实现原理：
  > - 返回一个新的 Promise。
  > - 遍历传入的可迭代对象，将每一项通过 Promise.resolve 包装。
  > - 任意一个 Promise 最先 resolve 时，外层 Promise 直接 resolve。
  > - 任意一个 Promise 最先 reject 时，外层 Promise 直接 reject。
  > - Promise 状态一旦确定，后续结果不会再影响最终状态。
- 注意事项：
  > - 非 Promise 值会被 Promise.resolve 包装，可能最先完成。
  > - 空数组不会触发 resolve 或 reject，会一直处于 pending 状态。
::: details 详情
```js
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);

    list.forEach(item => {
      Promise.resolve(item).then(resolve, reject);
    });
  });
}

// 测试 Promise.race
const p1 = new Promise(resolve => {
  setTimeout(() => resolve("p1"), 1000);
});

const p2 = new Promise(resolve => {
  setTimeout(() => resolve("p2"), 500);
});

promiseRace([p1, p2]).then(result => {
  console.log(result); // p2
});

const request = new Promise(resolve => {
  setTimeout(() => resolve("请求成功"), 2000);
});

const timeout = new Promise((resolve, reject) => {
  setTimeout(() => reject("请求超时"), 1000);
});

promiseRace([request, timeout]).catch(error => {
  console.log(error); // 请求超时
});
```
:::

## 16、手写 Promise.allSettled
- Promise.allSettled：Promise.allSettled 用于并发执行多个 Promise，等所有 Promise 都完成后，返回每一项的最终状态和结果。
- 应用场景：
  > - 多个请求互不影响，需要拿到每个请求的成功或失败结果。
  > - 批量任务执行后展示完整执行报告。
  > - 面试中考察 Promise 状态收集和结果顺序处理。
- 实现原理：
  > - 返回一个新的 Promise。
  > - 遍历传入的可迭代对象，将每一项通过 Promise.resolve 包装。
  > - 成功时记录 `{ status: "fulfilled", value }`。
  > - 失败时记录 `{ status: "rejected", reason }`。
  > - 使用计数器记录已完成数量，全部完成后 resolve 结果数组。
- 注意事项：
  > - 不会因为某一个 Promise 失败而 reject。
  > - 返回结果的顺序和传入顺序一致。
  > - 空数组需要直接 resolve 空数组。
::: details 详情
```js
function promiseAllSettled(promises) {
  return new Promise(resolve => {
    const list = Array.from(promises);
    const result = [];
    let settledCount = 0;

    if (list.length === 0) {
      resolve([]);
      return;
    }

    list.forEach((item, index) => {
      Promise.resolve(item)
        .then(value => {
          result[index] = {
            status: "fulfilled",
            value,
          };
        })
        .catch(reason => {
          result[index] = {
            status: "rejected",
            reason,
          };
        })
        .finally(() => {
          settledCount++;

          if (settledCount === list.length) {
            resolve(result);
          }
        });
    });
  });
}

// 测试 Promise.allSettled
const p1 = Promise.resolve("success");
const p2 = Promise.reject("error");
const p3 = 3;

promiseAllSettled([p1, p2, p3]).then(result => {
  console.log(result);
  // [
  //   { status: "fulfilled", value: "success" },
  //   { status: "rejected", reason: "error" },
  //   { status: "fulfilled", value: 3 }
  // ]
});
```
:::

## 17、手写 Promise.any
- Promise.any：Promise.any 用于并发执行多个 Promise，只要有一个 Promise 成功，就以第一个成功的结果作为最终结果；只有全部失败时才会 reject。
- 应用场景：
  > - 多个备用接口同时请求，只使用最快成功的结果。
  > - 多个资源源站兜底，只要有一个可用即可。
  > - 面试中考察 Promise 状态处理和失败原因收集。
- 实现原理：
  > - 返回一个新的 Promise。
  > - 遍历传入的可迭代对象，将每一项通过 Promise.resolve 包装。
  > - 任意一个 Promise 成功时，外层 Promise 立即 resolve。
  > - 每个 Promise 失败时，将失败原因记录到对应下标位置。
  > - 如果全部 Promise 都失败，则 reject 一个 AggregateError。
- 注意事项：
  > - 和 Promise.race 不同，Promise.any 只关心第一个成功结果。
  > - 全部失败时才会 reject。
  > - 空数组会直接 reject AggregateError。
::: details 详情
```js
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    const errors = [];
    let rejectedCount = 0;

    if (list.length === 0) {
      reject(new AggregateError([], "All promises were rejected"));
      return;
    }

    list.forEach((item, index) => {
      Promise.resolve(item)
        .then(value => {
          resolve(value);
        })
        .catch(reason => {
          errors[index] = reason;
          rejectedCount++;

          if (rejectedCount === list.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}

// 测试 Promise.any
const p1 = Promise.reject("error1");
const p2 = new Promise(resolve => {
  setTimeout(() => resolve("success"), 1000);
});
const p3 = Promise.reject("error3");

promiseAny([p1, p2, p3]).then(result => {
  console.log(result); // success
});

promiseAny([Promise.reject("a"), Promise.reject("b")]).catch(error => {
  console.log(error instanceof AggregateError); // true
  console.log(error.errors); // ["a", "b"]
});
```
:::

## 18、手写 Promise.resolve
- Promise.resolve：Promise.resolve 用于将一个值转换为 fulfilled 状态的 Promise。如果传入的是 Promise，则直接返回它本身。
- 应用场景：
  > - 统一同步值和异步值的处理方式。
  > - 在 Promise.all、Promise.race 等方法中包装每一项输入。
  > - 将 thenable 对象转换为标准 Promise。
- 实现原理：
  > - 如果传入值本身就是当前 Promise 构造函数创建的 Promise，直接返回该值。
  > - 如果传入值是 thenable 对象或函数，则读取它的 then 方法。
  > - 如果 then 是函数，则调用 then，并根据 then 的执行结果决定 Promise 状态。
  > - 如果传入的是普通值，则返回 fulfilled 状态的 Promise。
- 注意事项：
  > - thenable 是指带有 then 方法的对象或函数。
  > - 读取 then 属性时可能抛错，需要进入 rejected 状态。
  > - thenable 的状态只能被改变一次。
::: details 详情
```js
function promiseResolve(value) {
  if (value instanceof Promise) {
    return value;
  }

  return new Promise((resolve, reject) => {
    if (value !== null && (typeof value === "object" || typeof value === "function")) {
      let then;

      try {
        then = value.then;
      } catch (error) {
        reject(error);
        return;
      }

      if (typeof then === "function") {
        let called = false;

        try {
          then.call(
            value,
            result => {
              if (called) return;
              called = true;
              resolve(result);
            },
            reason => {
              if (called) return;
              called = true;
              reject(reason);
            }
          );
        } catch (error) {
          if (!called) {
            reject(error);
          }
        }
        return;
      }
    }

    resolve(value);
  });
}

// 测试 Promise.resolve
promiseResolve(1).then(result => {
  console.log(result); // 1
});

const promise = Promise.resolve("success");

console.log(promiseResolve(promise) === promise); // true

const thenable = {
  then(resolve) {
    resolve("thenable success");
  },
};

promiseResolve(thenable).then(result => {
  console.log(result); // thenable success
});
```
:::

## 19、手写 Promise.prototype.finally
- Promise.prototype.finally：finally 用于在 Promise 成功或失败后都执行同一段回调，常用于清理逻辑，并且默认透传原来的结果或失败原因。
- 应用场景：
  > - 请求完成后关闭 loading。
  > - 异步任务完成后释放资源。
  > - 无论成功失败都需要执行收尾逻辑。
- 实现原理：
  > - finally 返回一个新的 Promise。
  > - 成功时执行回调，等待回调完成后继续返回原来的成功值。
  > - 失败时执行回调，等待回调完成后继续抛出原来的失败原因。
  > - 如果 finally 回调返回 rejected Promise 或抛出错误，则会用新的错误覆盖原结果。
- 注意事项：
  > - finally 的回调不接收成功值或失败原因。
  > - 默认情况下，finally 不改变原 Promise 的最终结果。
  > - 如果 finally 回调内部出错，则会影响后续状态。
::: details 详情
```js
Promise.prototype.myFinally = function (callback) {
  const onFinally = typeof callback === "function" ? callback : () => callback;
  const P = this.constructor || Promise;

  return this.then(
    value => {
      return P.resolve(onFinally()).then(() => value);
    },
    reason => {
      return P.resolve(onFinally()).then(() => {
        throw reason;
      });
    }
  );
};

// 测试 Promise.prototype.finally
Promise.resolve("success")
  .myFinally(() => {
    console.log("finally 执行");
  })
  .then(result => {
    console.log(result); // success
  });

Promise.reject("error")
  .myFinally(() => {
    console.log("finally 也会执行");
  })
  .catch(error => {
    console.log(error); // error
  });

Promise.resolve("success")
  .myFinally(() => {
    return Promise.reject("finally error");
  })
  .catch(error => {
    console.log(error); // finally error
  });
```
:::

## 20、手写并发请求控制函数
- 并发请求控制：并发请求控制是指限制同一时间正在执行的异步任务数量，避免一次性发起过多请求导致浏览器、服务端或网络压力过大。
- 应用场景：
  > - 批量上传文件。
  > - 批量请求列表详情。
  > - 大量异步任务需要限制最大并发数。
- 实现原理：
  > - 维护当前正在执行的任务数量 activeCount。
  > - 维护下一个待执行任务的下标 currentIndex。
  > - 每次启动任务时增加 activeCount。
  > - 任务完成后减少 activeCount，并继续启动下一个任务。
  > - 所有任务完成后，按原始顺序 resolve 结果数组。
- 注意事项：
  > - 返回结果的顺序应和任务传入顺序一致。
  > - 任一任务失败时，可以直接 reject，也可以按业务改成收集失败结果。
  > - 最大并发数需要大于 0。
::: details 详情
```js
function limitRequest(tasks, limit) {
  if (!Array.isArray(tasks)) {
    return Promise.reject(new TypeError("tasks must be an array"));
  }

  if (limit <= 0) {
    return Promise.reject(new Error("limit must be greater than 0"));
  }

  return new Promise((resolve, reject) => {
    const result = [];
    let currentIndex = 0;
    let activeCount = 0;
    let finishedCount = 0;

    if (tasks.length === 0) {
      resolve([]);
      return;
    }

    function runNext() {
      while (activeCount < limit && currentIndex < tasks.length) {
        const index = currentIndex;
        const task = tasks[index];

        currentIndex++;
        activeCount++;

        Promise.resolve()
          .then(task)
          .then(value => {
            result[index] = value;
            finishedCount++;
            activeCount--;

            if (finishedCount === tasks.length) {
              resolve(result);
              return;
            }

            runNext();
          })
          .catch(reject);
      }
    }

    runNext();
  });
}

// 测试并发请求控制函数
function createTask(value, delay) {
  return () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("完成任务：", value);
        resolve(value);
      }, delay);
    });
  };
}

const tasks = [
  createTask(1, 1000),
  createTask(2, 500),
  createTask(3, 300),
  createTask(4, 800),
];

limitRequest(tasks, 2).then(result => {
  console.log(result); // [1, 2, 3, 4]
});
```
:::

## 21、手写 LRU 缓存
- LRU 缓存：LRU 是 Least Recently Used 的缩写，表示最近最少使用。当缓存容量满时，优先淘汰最久没有被访问的数据。
- 应用场景：
  > - 浏览器缓存。
  > - 接口数据缓存。
  > - 图片、文件、计算结果等有限容量缓存。
- 实现原理：
  > - 使用 Map 保存缓存数据，Map 会按照插入顺序保存 key。
  > - get 命中缓存时，先删除原 key，再重新 set，使它变成最新使用的数据。
  > - put 新增或更新数据时，也将该 key 放到最新位置。
  > - 当容量超过限制时，删除 Map 中第一个 key，也就是最久未使用的数据。
- 注意事项：
  > - get 和 put 都需要更新数据的使用顺序。
  > - Map 的 keys().next().value 可以获取最早插入的 key。
  > - 如果面试要求严格 O(1)，也可以使用哈希表 + 双向链表实现。
::: details 详情
```js
class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) {
      throw new Error("capacity must be greater than 0");
    }

    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    const value = this.cache.get(key);

    // 删除后重新插入，让当前 key 变成最近使用的数据
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}

// 测试 LRU 缓存
const lru = new LRUCache(2);

lru.put("a", 1);
lru.put("b", 2);

console.log(lru.get("a")); // 1

lru.put("c", 3); // 淘汰 b

console.log(lru.get("b")); // -1
console.log(lru.get("c")); // 3

lru.put("d", 4); // 淘汰 a

console.log(lru.get("a")); // -1
console.log(lru.get("d")); // 4
```
:::

## 22、手写 compose 函数
- compose 函数：compose 用于把多个函数组合成一个函数，执行顺序通常是从右到左。
- 应用场景：
  > - 函数组合。
  > - Redux 中间件组合。
  > - 多个数据转换函数串联执行。
- 实现原理：
  > - 接收多个函数作为参数。
  > - 返回一个新的函数。
  > - 新函数执行时，从右到左依次执行每个函数。
  > - 上一个函数的返回值会作为下一个函数的参数。
::: details 详情
```js
function compose(...fns) {
  if (fns.length === 0) {
    return value => value;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return function (...args) {
    let index = fns.length - 1;
    let result = fns[index](...args);

    while (--index >= 0) {
      result = fns[index](result);
    }

    return result;
  };
}

// 测试 compose 函数
const add = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const fn = compose(square, double, add);

console.log(fn(2)); // square(double(add(2))) = 36
```
:::

## 24、手写 Promise 重试函数
- Promise 重试函数：用于异步任务失败后按指定次数重新执行。
- 应用场景：
  > - 网络请求偶发失败后重试。
  > - 上传分片失败后重试。
  > - 第三方接口短暂不可用时重试。
- 实现原理：
  > - 接收一个返回 Promise 的函数。
  > - 执行失败后判断是否还有剩余重试次数。
  > - 有剩余次数则等待一段时间后再次执行。
  > - 次数耗尽后抛出最后一次错误。
::: details 详情
```js
function sleep(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

async function retry(task, times = 3, delay = 0) {
  let lastError;

  for (let i = 0; i <= times; i++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      if (i === times) {
        break;
      }

      if (delay > 0) {
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

// 测试 Promise 重试函数
let count = 0;

retry(
  () => {
    count++;

    if (count < 3) {
      return Promise.reject(new Error("请求失败"));
    }

    return Promise.resolve("请求成功");
  },
  3,
  1000,
).then(result => {
  console.log(result); // 请求成功
});
```

### 注意事项

- `task` 必须是函数，不能直接传入已经执行过的 Promise。
- 重试只适合幂等或可安全重复执行的任务。
- 生产中可以增加指数退避、最大延迟、取消控制等能力。
:::

## 23、手写 pipe 函数
- pipe 函数：pipe 也用于函数组合，但执行顺序通常是从左到右。
- 应用场景：
  > - 数据处理流水线。
  > - 多个格式化函数按顺序执行。
  > - 将复杂转换拆成多个小函数组合。
- 实现原理：
  > - 接收多个函数作为参数。
  > - 返回一个新函数。
  > - 新函数执行时，先执行最左侧函数。
  > - 前一个函数的返回值作为后一个函数的入参。
::: details 详情
```js
function pipe(...fns) {
  if (fns.length === 0) {
    return value => value;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return function (...args) {
    let result = fns[0](...args);

    for (let i = 1; i < fns.length; i++) {
      result = fns[i](result);
    }

    return result;
  };
}

// 测试 pipe 函数
const add = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const fn = pipe(add, double, square);

console.log(fn(2)); // square(double(add(2))) = 36
```
:::
