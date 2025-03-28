---
lang: zh-CN
title: js
description: js面试题
---

# js

## 1、js 基本数据类型有哪些及区别

js 中共有八种数据类型，分别是 Undefined、Null、Boolean、Number、String、Object、Symbol、BigInt。

::: details 详情
其中 Symbol 和 BigInt 两种数据类型是后续新增的。

- Symbol 代表创建后独一无二且不可变的数据类型，主要是为了解决可能出现的全局变量冲突的问题。
- BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围。
  这些数据可以分为基本数据类型和引用数据类型：

- 栈：基本数据类型（Undefined、Null、Boolean、Number、String、Symbol、BigInt）
- 堆：引用数据类型（对象、数组和函数）

两种类型的区别在于存储位置的不同：

- 基本数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；
- 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构和操作系统内存中，在数据结构中：

- 在数据结构中，栈中数据的存取方式为先进后出。
- 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。

在操作系统中，内存被分为栈区和堆区：

- 栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
- 堆区内存一般由开发着分配释放，若开发者不释放，程序结束时可能由垃圾回收机制回收。
  :::

## 2、js 数据类型检测的方式有哪些

- typeof (用于检测变量的基本类型，但对于某些类型（如 null 和复杂对象）可能不够准确)
  ::: details 点击查看代码

  ```js
  console.log("🚀 ~ Undefined:", typeof undefined); // 'undefined'
  console.log("🚀 ~ Null:", typeof null); // 'object' （这是一个历史遗留问题）
  console.log("🚀 ~ Boolean:", typeof true); // 'boolean'
  console.log("🚀 ~ Number:", typeof 999); // 'number'
  console.log("🚀 ~ String:", typeof "string"); // 'string'
  console.log("🚀 ~ Object:", typeof {}); // 'object'
  console.log("🚀 ~ Array:", typeof []); // 'object' （数组也是对象）
  console.log("🚀 ~ Function:", typeof function () {}); // 'function'
  console.log("🚀 ~ Symbol:", typeof Symbol(1)); // 'symbol'
  console.log("🚀 ~ BigInt:", typeof BigInt(1)); // 'bigint'
  ```

  :::

- instanceof (用于检测对象是否是某个构造函数的实例，适用于检测复杂对象类型)
  ::: details 点击查看代码

  ```js
  class Person {}
  const person = new Person();

  console.log("🚀 ~ Array instanceof Array:", [] instanceof Array); // true
  console.log("🚀 ~ Object instanceof Object:", {} instanceof Object); // true
  console.log("🚀 ~ Function instanceof Function:", function () {} instanceof Function); // true
  console.log("🚀 ~ Person instanceof Person:", person instanceof Person); // true
  console.log("🚀 ~ Array instanceof Object:", [] instanceof Object); // true （数组也是对象）
  console.log("🚀 ~ null instanceof Object:", null instanceof Object); // false
  console.log("🚀 ~ undefined instanceof Object:", undefined instanceof Object); // false
  // 基本数据类型与 instanceof
  console.log("🚀 ~ 42 instanceof Number:", 42 instanceof Number); // false
  console.log("🚀 ~ 'hello' instanceof String:", "hello" instanceof String); // false
  console.log("🚀 ~ true instanceof Boolean:", true instanceof Boolean); // false
  console.log("🚀 ~ Symbol('sym') instanceof Symbol:", Symbol(1) instanceof Symbol); // false
  console.log("🚀 ~ BigInt(1) instanceof BigInt:", BigInt(1) instanceof BigInt); // false
  ```

  :::

- constructor (每个对象都有一个 constructor 属性，指向创建该对象的构造函数。可以通过检查 constructor 来判断类型)
  ::: details 点击查看代码

  ```js
  const arr = [];
  const obj = {};
  const str = "hello";
  const bool = true;
  const num = 123; // 注意：基本类型没有 constructor 属性，需要包装为对象

  console.log("🚀 ~ Array constructor:", arr.constructor === Array); // true
  console.log("🚀 ~ Object constructor:", obj.constructor === Object); // true
  console.log("🚀 ~ String constructor (wrapper):", Object(str).constructor === String); // true
  console.log("🚀 ~ Boolean constructor (wrapper):", Object(bool).constructor === Boolean); // true
  console.log("🚀 ~ Number constructor (wrapper):", Object(num).constructor === Number); // true
  ```

  :::

- Object.prototype.toString.call() (是一种更为通用和准确的类型检测方法，适用于几乎所有数据类型)
  ::: details 点击查看代码

  ```js
  const getType = value => Object.prototype.toString.call(value);

  console.log("🚀 ~ Undefined:", getType(undefined)); // [object Undefined]
  console.log("🚀 ~ Null:", getType(null)); // [object Null]
  console.log("🚀 ~ Boolean:", getType(true)); // [object Boolean]
  console.log("🚀 ~ Number:", getType(999)); // [object Number]
  console.log("🚀 ~ String:", getType("string")); // [object String]
  console.log("🚀 ~ Object:", getType({})); // [object Object]
  console.log("🚀 ~ Array:", getType([])); // [object Array]
  console.log("🚀 ~ Function:", getType(getType)); // [object Function]
  console.log("🚀 ~ Symbol:", getType(Symbol(1))); // [object Symbol]
  console.log("🚀 ~ BigInt:", getType(BigInt(1))); // [object BigInt]
  console.log("🚀 ~ Date:", getType(new Date())); // [object Date]
  console.log("🚀 ~ RegExp:", getType(/abc/)); // [object RegExp]
  console.log("🚀 ~ Map:", getType(new Map())); // [object Map]
  console.log("🚀 ~ Set:", getType(new Set())); // [object Set]
  ```

  :::

  ::: details 详情
  |方法|支持类型|准确性|简单性|注意事项|
  |---|----|----|----|-------|
  |typeof|基本类型(除 null 外)|高(基本类型)| 高|无法区分 null、数组和其他对象|
  |instanceof|对象类型(需构造函数存在)| 中等|中等|不适用于基本类型，受跨环境限制|
  |constructor|大多数对象类型 |中等|中等|可被修改，不适用于基本类型|
  |Object.prototype.toString.call()|几乎所有类型|高|较低(需处理字符串)|对于自定义对象需要额外处理，返回格式固定|

## 3、请简述 js 中的 this

在 js 中，this 指向当前执行上下文的对象。它的值取决于函数的调用方式

::: details 详情

- 全局上下文：在全局作用域中，this 指向全局对象（浏览器中是 window，Node.js 中是 global）。
- 函数上下文：在普通函数中，this 通常指向全局对象（严格模式下是 undefined）。
- 方法上下文：作为对象方法调用时，this 指向调用该方法的对象。
- 构造函数上下文：使用 new 调用时，this 指向新创建的实例。
- 显式绑定：通过 call、apply 或 bind 可以指定 this 的值。
- 箭头函数：箭头函数没有自己的 this，它继承自外围作用域的 this。

:::

## 4、js 中箭头函数和普通函数的区别

::: details 详情
|特性|普通函数|箭头函数|
|---|----|------|
|语法|使用 function 关键字定义|使用 => 符号定义|
|this 绑定|动态绑定，取决于调用方式|词法绑定，继承自外围作用域的 this|
|构造函数|可以使用 new 关键字创建实例|不能作为构造函数，使用 new 会抛出错误|
|变量提升|函数声明会被完全提升，可以在声明前调用(函数表达式不会被提升)|箭头函数作为函数表达式，不会被完全提升(只有变量声明会被提升)|
|prototype 属性|拥有 prototype 属性|没有 prototype 属性|
|arguments 对象|拥有 arguments 对象|没有自己的 arguments 对象，需使用展开运算符|
|适用场景|需要动态 this 或作为构造函数时使用|需要词法 this 或定义简洁的单行函数时使用|
:::

## 5、let const var 的区别

- var：具有函数作用域，可以重复声明和提升，但容易导致代码问题，现代开发中不推荐使用。
- let：具有块级作用域，不能重复声明，可以重新赋值，适用于变量值需要改变的情况。
- const：具有块级作用域，不能重复声明，不能重新赋值（但对引用类型可以修改其内容），适用于变量值不需要改变的情况

::: details 详情
|特性 |var|let|const|
|---|----|----|----|
|​作用域|函数作用域|块级作用域|块级作用域|
|​变量提升|提升并初始化为 undefined|提升但不初始化，存在暂时性死区|提升但不初始化，存在暂时性死区|
|​重复声明|允许在同一作用域内重复声明|不允许在同一作用域内重复声明|不允许在同一作用域内重复声明|
|​重新赋值|允许|允许|不允许（但对于引用类型，可以修改其属性）|
|初始化要求|可选，声明时可以不赋值|可选，声明时可以不赋值|必须在声明时初始化|
|适用场景|旧代码兼容，尽量避免使用|需要重新赋值的变量|声明常量，不需要重新赋值的变量|
|全局对象属性|在全局作用域中声明会成为全局对象的属性|不会成为全局对象的属性|不会成为全局对象的属性|
|闭包行为|可能导致意外的闭包行为|更加可预测的闭包行为|更加可预测的闭包行为|
|​最佳实践|尽量避免使用|推荐用于需要重新赋值的变量|推荐用于声明常量|
:::

## 6、什么是原型链
- 在 js 中，通过构造函数创建对象时，每个构造函数都有一个 `prototype` 属性，这是一个对象，包含所有实例共享的属性和方法。使用构造函数创建的对象内部有一个指针（通常通过 `__proto__` 访问，但不推荐）指向构造函数的 `prototype` 对象。ES5 提供了 `Object.getPrototypeOf()` 方法来标准地获取对象的原型。
- 当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 `Object.prototype`(Object.prototype 的原型是 null，表示原型链的结束) ，所以这就是新建的对象为什么能够使用 toString() 等方法的原因。

## 7、什么是闭包
闭包是指有权访问另一个函数作用域中变量的函数，即使该函数已经执行完毕，其作用域内的变量也不会被销毁，闭包可以让这些变量在其外部被访问和使用。
::: details 详情
闭包常用的用途:
- 使我们在函数外部能够访问到函数内部的变量。通过使用闭包，可以通过在外部调用闭包函数，从而在外部访问到函数内部的变量，可以使用这种方法来创建私有变量。
- 使已经运行结束的函数上下文中的变量对象继续留在内存中，因为闭包函数保留了这个变量对象的引用，所以这个变量对象不会被回收。
:::

## 8、什么是高阶函数
高阶函数是指接受一个或多个函数作为参数，或者返回一个函数作为结果的函数。
::: details 详情
高阶函数常用的用途:
- 抽象通用逻辑
```js
// 通过高阶函数，可以将通用的逻辑抽象出来，避免重复编写相似的代码。例如，JavaScript 内置的 Array.prototype.map、Array.prototype.filter 和 Array.prototype.reduce 都是高阶函数，用于处理数组中的元素。
const numbers = [1, 2, 3, 4, 5];
// 使用 map 将数组中的每个元素加倍
const doubled = numbers.map(function(num) {
    return num * 2;
});
console.log(doubled); // 输出: [2, 4, 6, 8, 10]
```
- 函数柯里化
```js
// 柯里化是将一个多参数函数转换为一系列单参数函数的过程
function add(a) {
    return function(b) {
        return a + b;
    };
}
console.log(add(3)(5)); // 输出: 8
```
- 回调函数
```js
// 回调函数是指在函数调用过程中，将一个函数作为参数传递给另一个函数，并在另一个函数执行完成后调用该函数。
function greet(name, callback) {
    console.log(`Hello, ${name}!`);
    callback();
}
greet('Alice', function() {
    console.log('Callback executed.');
});
// 输出:
// Hello, Alice!
// Callback executed.
```
- ​增强函数功能
```js
// 可以用来增强现有函数的功能，例如添加日志记录、性能监控等
function withLogging(fn) {
    return function(...args) {
        console.log(`Calling function ${fn.name} with arguments: ${args}`);
        const result = fn(...args);
        console.log(`Function ${fn.name} returned: ${result}`);
        return result;
    };
}
function add(a, b) {
    return a + b;
}
const loggedAdd = withLogging(add);
loggedAdd(3, 5);
// 输出:
// Calling function add with arguments: 3,5
// Function add returned: 8
```
:::

## 9、什么是事件循环（event loop）
事件循环是一个单线程循环，用于监视调用堆栈并检查是否有工作即将在任务队列中完成。
::: details 详情
在谷歌源码中，存在着消息、微、交互、延时等队列。已经不存在宏队列的说法。而队列具有优先级，其中消息队列总是先执行完，并且消息队列是一个无限循环，消息队列执行完以后，事件循环会去微队列中取出第一个任务到消息队列中执行。当微队列没有任务时，事件循环会从交互队列中取第一个任务到消息队列中执行。当交互队列也没任务时，才会去延时队列取第一个任务执行。直到所有队列中都没有任务时，消息队列会休眠。
- 延时队列：⽤于存放计时器到达后的回调任务，优先级「中」
- 交互队列：⽤于存放⽤户操作后产⽣的事件处理任务，优先级「⾼」
- 微队列：⽤户存放需要最快执⾏的任务，优先级「最⾼」

总结：
- 过去把消息队列简单分为宏队列和微队列，这种说法⽬前已⽆法满⾜复杂的浏览器环境，取⽽代之的是⼀种更加灵活多变的处理⽅式。
- 根据 W3C 官⽅的解释，每个任务有不同的类型，同类型的任务必须在同⼀
个队列，不同的任务可以属于不同的队列。
- 不同任务队列有不同的优先级，在⼀次事件循环中，由浏览器⾃⾏决定取哪⼀个队列的任务。
- 但浏览器必须有⼀个微队列，微队列的任务⼀定具有最⾼的优先级，必须优先调度执⾏
:::

## 10、js 中设计模式有哪些
- 创建型模式，共五种：
  > 工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。
- 结构型模式，共七种：
  > 适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。
- 行为型模式，共十一种：
  > 策略模式、模板方法模式、观察者模式/发布订阅模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式。

## 11、js 中的垃圾回收机制
js 具有自动垃圾回收机制，会定期对那些不在使用的变量，对象占用的内存进行释放，找不到再使用的变量就会被释放掉。

内存中有两种形式的变量，一种事全局变量，一种是局部变量，全局变量的生命周期会持续到页面卸载，局部变量会在函数执行结束，不在被使用的时候。

垃圾回收的方法有两种：`标记清除`，`引用计数`。
::: details 详情
- 优化数组的使用
  - ​避免频繁创建和销毁数组 
  > 尽量复用数组，避免在循环或高频调用的函数中频繁创建新数组。
  - 预分配数组大小
  > 如果已知数组的大致长度，可以预先分配数组的大小，减少动态扩展带来的内存重新分配和复制开销。
  - 及时清空数组
  > 当数组不再使用时，可以将其赋值为 null 或 []，帮助垃圾回收器更快识别和回收内存。
- 优化对象的使用
  - 复用对象
  > 尽量复用已有对象，避免频繁创建新对象。
  - 避免不必要的属性
  > 移除不再需要的属性，减少对象的内存占用。
  - 使用合适的数据结构
  > 根据需求选择合适的数据结构，以优化内存使用和访问效率。
- 优化函数的使用
  - 减少闭包的使用
  > 闭包会保留对外部变量的引用，可能导致内存无法被及时回收。在不需要闭包的情况下，尽量避免使用。
  - 避免内存泄漏
  > 注意函数内部是否存在对不再需要的对象的引用，尤其是在事件监听器和定时器中，确保在不需要时移除这些引用。
  - 使用轻量级函数
  > 尽量编写简洁高效的函数，减少函数内部的临时变量和内存开销。
- ​其他优化建议
  - 及时解除引用
  > 对于不再需要的对象，手动将其引用设为 null，帮助垃圾回收器更快识别可回收的内存。
  - 避免全局变量滥用
  > 全局变量生命周期长，尽量减少全局变量的使用，使用模块化或局部作用域来管理变量。
  - 使用 WeakMap 和 WeakSet
  > 这些数据结构持有对象的弱引用，不会阻止垃圾回收器回收被引用的对象，适用于需要临时引用对象的场景。
:::




## 12、有哪些情况会导致内存泄漏
意外的全局变量，被遗忘的计时器或回调函数，脱离 DOM 的引用，闭包，两个或多个对象循环引用。

## 13、js 中的防抖和节流
- 防抖
  > 防抖指的是在事件被触发后，等待一段时间（延迟时间），如果在这段时间内没有再次触发该事件，才执行事件处理函数。如果在等待时间内事件再次被触发，则重新计时。
  ::: details 点击查看代码
  ```js
   /**
   * 防抖函数
   * @param {Function} func - 需要防抖处理的函数
   * @param {number} wait - 延迟时间（毫秒）
   * @param {boolean} [immediate=false] - 是否立即执行
   * @returns {Function} - 防抖处理后的函数
   */
  function debounce(func, wait, immediate = false) {
      let timeout; // 定义一个定时器变量
      return function(...args) {
          const context = this; // 保存当前上下文
          const later = () => {
              timeout = null; // 清空定时器
              if (!immediate) func.apply(context, args); // 如果不是立即执行，则在延迟后调用函数
          };
          const callNow = immediate && !timeout; // 判断是否需要立即执行
          clearTimeout(timeout); // 清除之前的定时器
          timeout = setTimeout(later, wait); // 设置新的定时器
          if (callNow) func.apply(context, args); // 如果需要立即执行，则立即调用函数
      };
  }
  ```
  :::
- 节流
  > 节流是指在事件被触发后，在指定的时间间隔内，只执行一次事件处理函数。如果在等待时间内事件再次被触发，则忽略该次触发，直到时间间隔结束。
  ::: details 点击查看代码
  ```js
   /**
   * 节流函数
   * @param {Function} func - 需要节流处理的函数
   * @param {number} wait - 时间间隔（毫秒）
   * @returns {Function} - 节流处理后的函数
   */
  function throttle(func, wait) {
      let lastTime = 0; // 记录上一次执行的时间
      return function(...args) {
          const now = Date.now(); // 获取当前时间
          if (now - lastTime >= wait) { // 如果当前时间距离上一次执行时间超过或等于设定的时间间隔
              func.apply(this, args); // 执行目标函数，并绑定当前上下文和参数
              lastTime = now; // 更新上一次执行的时间
          }
      };
  }
  ```
  :::

## 14、js 中的深拷贝和浅拷贝
- 浅拷贝 
  > 浅拷贝只复制对象的第一层属性。如果对象的属性值是引用类型（如对象、数组等），那么复制的只是这些引用，而不是实际的数据。因此，原对象和拷贝后的对象共享嵌套的引用类型数据。
  ::: details 点击查看代码
  - 使用 Object.assign()
  - 使用展开运算符
  :::
- 深拷贝
  > 深拷贝会递归地复制对象的所有层级属性，包括嵌套的对象和数组。这样，原对象和拷贝后的对象是完全独立的，修改其中一个不会影响另一个。
  ::: details 点击查看代码
  - 使用 JSON.parse 和 JSON.stringify()
  - 使用递归函数手动实现深拷贝
  ```js
  function deepClone(obj, hash = new WeakMap()) {
    // 处理循环引用
    if (hash.has(obj)) return hash.get(obj);
    // 处理基本类型和函数
    if (obj === null || typeof obj !== "object") return obj;
    // 处理日期对象
    if (obj instanceof Date) return new Date(obj.getTime());
    // 处理正则表达式
    if (obj instanceof RegExp) return new RegExp(obj);
    // 处理循环引用
    if (hash.has(obj)) return hash.get(obj);
    // 处理基本类型和函数
    if (obj === null || typeof obj !== "object") return obj;
    // 处理特殊对象
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Map) {
      const mapClone = new Map();
      hash.set(obj, mapClone);
      obj.forEach((value, key) => {
        mapClone.set(deepClone(key, hash), deepClone(value, hash));
      });
      return mapClone;
    }
    if (obj instanceof Set) {
      const setClone = new Set();
      hash.set(obj, setClone);
      obj.forEach(value => {
        setClone.add(deepClone(value, hash));
      });
      return setClone;
    }
    // 创建新对象或数组，并保留原型链
    const clone = Array.isArray(obj)
      ? []
      : Object.create(Object.getPrototypeOf(obj));
    // 存储到 hash 中以处理循环引用
    hash.set(obj, clone);
    // 复制属性，包括不可枚举属性和 Symbol 属性
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    Reflect.ownKeys(descriptors).forEach(key => {
      const descriptor = descriptors[key];
      if (descriptor.value) {
        descriptor.value = deepClone(descriptor.value, hash);
      }
      Object.defineProperty(clone, key, descriptor);
    });
    return clone;
  }
  ```
  - 使用第三方库（如 Lodash）（推荐）
  :::
  ::: details 区别
  |特性|浅拷贝|深拷贝|
  |---|-----|-----|
  |复制层级|只复制对象的第一层属性|递归复制对象的所有层级属性|
  |引用类型处理|复制引用，原对象和拷贝对象共享嵌套的引用类型数据|创建新的引用，原对象和拷贝对象相互独立|
  |适用场景|对象结构简单，不需要独立嵌套数据的副本|对象结构复杂，需要完全独立的副本，避免副作用|
  |复杂度|简单，使用 Object.assign() 或展开运算符即可实现|复杂，需要递归复制或使用第三方库|
  |性能|较高|相对较低，尤其是深层次的对象结构|
  ::: 

## 15、ES6 有哪些新特性
::: details 详情
- let 和 const
- 箭头函数
- 解构赋值
- 模板字符串
- 类（class）
- 模块化
- Promise
- async/await
- Set 和 Map
- Symbol
- 生成器（Generator）和 迭代器（Iterator）
- Proxy 和 Reflect
- 扩展运算符 和 剩余参数
- 新的字符串方法 （startsWith(), endsWith(), includes(), repeat() 等）
- 新的数组方法（Array.from(), Array.of(), find(), findIndex(), fill(), copyWithin() 等）
:::

## 16、什么是 promise
Promise 是一个表示异步操作的对象，可能在未来的某个时间点完成并返回结果。
:::details 详情
Promise 有三种状态：`Pending`（进行中）、`Fulfilled`（已完成）和 `Rejected`（已拒绝）。使用 `then` 方法可以处理成功的结果，使用 `catch` 方法处理错误 `，finally` 方法可以处理 Promise 的完成（无论成功或失败）。
:::

## 17、什么是 async/await
async/await 是一种语法糖，它允许使用同步的方式编写异步代码（只是让异步代码变得`像`同步代码一样执行，而不是变成了同步代码），使得代码更易于阅读和理解。
::: details 详情
- async 函数
  > async 函数返回一个 Promise 对象，可以使用 await 关键字等待异步操作完成。
- await 关键字
  > await 关键字用于等待 Promise 完成，并获取其结果，await 后面通常跟一个 Promise 对象，但它也可以跟任何可以被 await 的值（如普通值，会被自动包装成已解决的 Promise）。
:::

## 18、Promise.allSettled、Promise.all 和 Promise.race 的区别
- Promise.allSettled
  > 适用于需要获取所有异步操作的最终状态，无论成功或失败。
- Promise.all
  > 适用于需要并行执行多个异步操作，并确保所有操作都成功时才继续下一步。
- Promise.race
  > 适用于需要获取最快的异步操作结果，常用于超时控制等场景。
::: details 详情
|方法名|描述|返回值|失败处理|
|---|-----|-----|-----|
|Promise.allSettled|等待所有 Promise 完成（无论成功或失败），返回所有结果|包含每个 Promise 结果的对象数组，对象有 status 和 value（成功时）或 reason（失败时）属性|不会抛出错误，所有结果都会包含在返回数组中|
|Promise.all|等待所有 Promise 成功完成，若有一个失败则立即返回失败结果|包含所有成功 Promise 结果的数组|只要有一个 Promise 失败，就立即拒绝整个 Promise 并返回第一个失败的原因|
|Promise.race|返回最先完成的 Promise 的结果（无论成功或失败）|最先完成的 Promise 的结果或失败原因|不会等待其他 Promise 完成，只关注最先完成的结果|
:::

## 19、解释事件冒泡和事件捕获的区别
- 事件冒泡
  > 事件从目标元素向上冒泡到其父元素，直到到达 document 对象。
- 事件捕获
  > 事件从 document 对象向下传播到目标元素。
```js
// 可以通过 addEventListener 方法的第三个参数来控制是捕获还是冒泡，默认为 false（冒泡）。
element.addEventListener('click', function(event) {
    // 处理点击事件
}, false); // 冒泡
```  

## 20、解释事件代理和事件委托的区别
- 事件代理
  > 侧重于在事件传播过程中插入自定义逻辑，可能包括拦截、修改或转发事件。它适用于需要增强事件控制、实现跨组件通信或进行权限验证等复杂场景。
- 事件委托
  > 主要关注于通过事件冒泡机制，将事件处理程序集中绑定到父元素，以简化事件管理和提高性能。它适用于需要处理大量子元素事件的场景。
::: details 详情
|方面|事件委托|事件代理|
|---|-----|-----|
|​定义|利用事件冒泡机制，将事件处理程序绑定到父元素，以管理子元素的事件。|通过创建代理对象或函数，拦截和处理事件，可能在事件传播的不同阶段进行干预|
|​主要用途|简化事件管理，提高性能，适用于大量子元素或动态添加元素的场景。|增强事件控制，实现跨组件通信，权限控制，或在事件传播过程中插入自定义逻辑。|
|​实现方式|绑定一个事件处理程序到父元素，通过 `event.target` 确定触发元素。|可以在事件处理程序中拦截、修改或转发事件，甚至阻止事件的默认行为或传播。|
|​典型应用场景|列表项点击、表格单元格操作等需要管理大量相似事件的场景。|权限验证、日志记录、事件转发、增强或修改事件行为的场景。|
|​示例|将点击事件绑定到父 `ul`，处理所有 `li` 的点击。|在链接点击事件中插入权限检查，决定是否允许默认行为。|
:::

## 21、如何处理 js 中的错误
- 同步错误处理
  - 使用 `try/catch` 语句包裹可能抛出错误的同步代码块
  - 通过 `window.onerror` 或 `window.addEventListener('error', function(event) {})` 来处理`全局错误`。
- 异步错误处理
  - 使用 `Promise` 链时，通过`.catch()`来处理异步错误。
  - 使用 `async/await` 时，通过 `try/catch` 来处理异步错误。
  - 通过 `window.addEventListener('unhandledrejection')`，用于捕获`全局`未处理的 Promise 错误。

## 22、解释 js 中的 bind、call、apply 函数
bind、call 和 apply 都是用于`显式绑定函数执行时 this 的指向`的方法。它们都是函数对象的方法，允许开发者在调用函数时指定 this 的值，并且在某些情况下传递参数。
::: details 详情
- call
  > 立即调用函数，并指定 this 的值，后面可以传入参数。
  ```js
  function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
  }
  const person = { name: '胖虎' };
  // 使用 call 方法绑定 this 并传递参数
  greet.call(person, 'Hello', '!'); // 输出: Hello, 胖虎!
  ```
- apply
  > 与 call 类似，但参数以数组的形式传递。
  ```js
  function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
  }
  const person = { name: '哆啦A梦' };
  // 使用 apply 方法绑定 this 并传递参数数组
  greet.apply(person, ['Hi', '!']); // 输出: Hi, 哆啦A梦!
  ```
- bind
  > 返回一个新的函数，this 被永久绑定到指定对象，并可以传入参数。
  ```js
  function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
  }
  const person = { name: '大雄' };
  // 使用 bind 方法创建一个新的函数，并绑定 this
  const greetPerson = greet.bind(person, 'Hey');
  // 调用新函数，只需要传递剩余的参数
  greetPerson('!'); // 输出: Hey, 大雄!
  ```
:::

## 23、解释 js 中的 Map 和 Set
Set 是一种集合类型，用于存储唯一值，而 Map 是用来存储键值对的对象。
::: details 详情
- Map
  > Map 是一种键值对集合，键可以是任何类型，值可以是任何类型，并保留插入顺序，在`频繁增删键值对`的场景下，Map 的性能优于普通对象。
- Set
  > Set 是一种集合类型，用于存储唯一值，值可以是任何类型，值不允许重复，在需要`频繁检查值`是否存在或`去重`的场景下，Set 提供了高效的性能。
:::

## 24、解释 js 中的 WeakMap 和 WeakSet
WeakMap 和 WeakSet 是 ES6 引入的集合类型，分别用于存储对象的键值对和唯一对象。
::: details 详情
- WeakMap
  > WeakMap 是一种键值对集合，`键必须是对象`，值可以是任何类型。与 Map 不同的是，WeakMap 的键是`弱引用`，即键对象的引用不会阻止键对象的垃圾回收。
- WeakSet
  > WeakSet 是一种集合，`值只能存储对象`。与 Set 不同的是，WeakSet 的元素是`弱引用`，即元素对象的引用不会阻止元素对象的垃圾回收。
  ::: tip 注意事项
  - ​不可迭代：由于 WeakMap 和 WeakSet 的键或成员是弱引用的，它们无法被枚举。因此，没有 keys()、values()、entries() 等方法，也没有 forEach 方法。
  - ​只能使用对象作为键/成员：WeakMap 的键和 WeakSet 的成员必须是对象，不能是原始值（如字符串、数字等）。
  - ​垃圾回收的不确定性：由于垃圾回收的时机是由 JavaScript 引擎决定的，WeakMap 和 WeakSet 中的数据何时被回收是不可预测的。因此，不适合用于需要精确控制数据生命周期的场景。
  :::
:::

## 25、如何在 js 中实现一个简单的事件总线（Event Bus）
事件总线是一种发布-订阅模式的实现，允许不同组件之间进行通信。
::: details 点击查看代码
```js
class EventEmitter {
  constructor() {
    this.events = {};
    this.maxListeners = 10; // 默认最大监听器数量
  }
  // 设置最大监听器数量
  setMaxListeners(n) {
    this.maxListeners = n;
  }
  // 订阅事件
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    if (this.events[event].length >= this.maxListeners) {
      console.warn(`Max listeners exceeded for event: ${event}`);
    }
    this.events[event].push(listener);
  }
  // 发布事件
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => {
        Promise.resolve().then(() => listener.apply(this, args)); // 支持异步监听器
      });
    }
    if (this.events['*']) {
      this.events['*'].forEach(listener => {
        Promise.resolve().then(() => listener.apply(this, [event, ...args])); // 支持通配符事件
      });
    }
  }
  // 取消订阅
  off(event, listenerToRemove) {
    if (!this.events[event]) {
      return;
    }
    const index = this.events[event].indexOf(listenerToRemove);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }
  // 订阅一次性事件
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
}
// 使用示例
const eventBus = new EventEmitter();
const testListener = (msg) => {
  console.log(`Test event received: ${msg}`);
};
eventBus.on('test', testListener);
eventBus.emit('test', 'Hello EventBus!'); // 输出: Test event received: Hello EventBus!
eventBus.off('test', testListener);
eventBus.emit('test', 'Hello again!'); // 无输出，因为已取消订阅
// 订阅一次性事件
eventBus.once('onceEvent', (msg) => {
  console.log(`Once event received: ${msg}`);
});
eventBus.emit('onceEvent', 'Hello once!'); // 输出: Once event received: Hello once!
eventBus.emit('onceEvent', 'Hello twice!'); // 无输出，因为是一次性事件
// 通配符事件
eventBus.on('*', (event, msg) => {
  console.log(`Wildcard event received: ${event} - ${msg}`);
});
eventBus.emit('test', 'Wildcard test!'); // 输出: Wildcard event received: test - Wildcard test!
```
::: 

## 26、什么是 fetch
fetch 是一个用于在浏览器和 Node.js 中进行网络请求的 API，它提供了一种更简单的方式来发送 HTTP 请求，并返回一个 Promise 对象。
::: details 详情
```js
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log("🚀 ~ data:", data);
  })
  .catch(error => {
    console.log("🚀 ~ error:", error);
  })
```
:::

## 27、阐述一下 localStorage、sessionStorage、cookie、IndexedDB 的区别
都是用于在浏览器中存储数据的技术。
::: details 详情
|特性|localStorage|sessionStorage|cookie|IndexedDB|
|---|------|------|------|------|
|​存储容量|~5MB|~5MB|~4KB| 每个 cookie|	数 GB|
|​数据类型|字符串|字符串|字符串|	对象、数组等复杂数据类型|
|​生命周期|永久，除非手动删除|当前会话结束即清除|可设置过期时间|永久，除非手动删除或清除浏览器数据|
|​同步/异步|同步|同步|同步|异步|
|​事务支持|不支持|不支持|不支持|	支持|
|​查询能力|有限（键值对）|有限（键值对|）有限（基于键）|强大（索引、复杂查询）|
|​浏览器支持|广泛支持|广泛支持|广泛支持|广泛支持（现代浏览器|
|​适用场景|小量简单数据存储|小量简单数据存储|	跟踪用户会话、偏好|大量复杂数据存储、需要高性能查询|
:::

## 28、解释 js 中的 class 关键字及其用法。
class 关键字是 ES6 引入的语法糖，用于创建类。它允许我们定义一个类，并使用它来创建对象。
::: details 详情
```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  sayHello() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}
const person = new Person('胖虎', 18);
person.sayHello(); // Hello, my name is 胖虎 and I am 18 years old.
```
:::

## 29、解释一下 js 中的模块化机制，如 CommonJS、AMD、CMD、ES6 模块化机制，以及它们之间的区别。
::: details 详情
|特性|CommonJS|AMD|CMD|ES6模块化|
|-----|------|------|------|------|
|​加载方式|同步|异步|异步|静态（编译时确定），支持动态导入|
|​依赖声明|在模块内部通过 require 导入|在模块定义时通过数组声明依赖|在模块内部通过 require 动态导入依赖|通过 import 关键字静态声明依赖|
|​语法|require 和 module.exports|define 和 require|define 和 require|import 和 export|
|​适用环境|	主要用于服务器端（Node.js）|主要用于浏览器端，需加载器支持（如 RequireJS）|主要用于浏览器端，需加载器支持（如 Sea.js）|现代浏览器和 Node.js（需转换工具）|
|​优化特性|无|无|无|支持树摇（Tree Shaking）、代码分割等优化|
|​生态支持|广泛，特别是在 Node.js 生态中|需要 RequireJS 等库支持|需要 Sea.js 等库支持|原生支持，生态支持逐渐成熟|
|​动态加载|不直接支持|支持通过 RequireJS 的 require|支持通过 CMD 规范的动态加载|支持通过 import() 函数动态加载|

总结
- CommonJS 适合服务器端开发，简单易用。
- AMD 和 ​CMD 适合需要异步加载的浏览器端应用，但需要额外的加载器支持。
- ​ES6 模块化 是现代前端开发的标准，具备静态分析、树摇等优化特性，逐渐取代其他模块化规范，成为统一的选择。
:::

## 30、解释一下 js 中的继承机制，如原型链、类继承、组合继承、寄生继承、拷贝继承等。
::: details 详情
|继承方式|描述|优点|缺点|
|----|-------|-------|------|
|原型链继承|子类的原型指向父类的实例|简单，易于实现；所有实例共享原型方法|引用类型属性共享；无法向父类构造函数传递参数|
|class类继承（ES6）|使用 class 和 extends 关键字实现继承|语法简洁；支持 super；更符合传统面向对象编程范式|底层仍是原型链继承；无法直接使用多重继承|
|组合继承|结合原型链继承和构造函数继承，调用两次父类构造函数|继承实例属性和方法；避免引用类型属性共享|父类构造函数被调用两次，性能和内存开销较大|
|寄生继承|创建一个仅用于封装继承过程的函数，增强对象后返回|避免构造函数调用；可以在继承过程中增强对象|无法复用方法；不适用于复杂继承关系|
|拷贝继承|遍历一个对象的属性和方法，复制到另一个对象中|简单直接；灵活选择需要复制的属性和方法|只能浅拷贝；引用类型属性共享
|原型式继承|使用 Object.create 创建一个新对象，原型为指定对象|简单明了；适用于不需要构造函数的场景|引用类型属性共享；无法传递参数|
|寄生组合式继承|结合寄生继承和组合继承，通过 Object.create 设置原型，调用一次父类构造函数|只调用一次父类构造函数；保持原型链完整性；实例属性独立|实现稍微复杂|
:::

## 31、解释一下 js 中的 Generator（生成器）和 Iterator（迭代器）。
- Generator 是一种特殊的函数，可以中断执行并在以后的调用中继续执行，使用 `function*` 语法定义（箭头函数不能声明生成器）。
- Iterator 是一种访问集合中元素的抽象接口，提供 `next()` 方法以返回集合的下一个值和状态。
::: details 详情
```js
function* generatorFunction() {
    yield '胖虎';
    yield '大雄';
}
const generator = generatorFunction();
console.log(generator.next()); // 输出 { value: '胖虎', done: false }
console.log(generator.next()); // 输出 { value: '大雄', done: false }
console.log(generator.next()); // 输出 { value: undefined, done: true }
```
:::

## 32、在 js 中如何把类数组转换为数组
一个简单的定义，如果一个对象有 `length` 属性值，`按照索引访问元素`，不继承自 `Array.prototype`，则它就是类数组。
 > 常见的类数组如各种元素检索 API 返回的都是类数组，如 document.getElementsByTagName，document.querySelectorAll 等等。除了 DOM API 中，常见的 function 中的 arguments 也是类数组。
- 使用 Array.from() 方法
  ::: details 详情
  ```js
  function exampleFunction() {
    const argsArray = Array.from(arguments);
    console.log(argsArray);
  }
  exampleFunction(1, 2, 3); // 输出：[1, 2, 3]
  ```
  :::
- 使用扩展运算符
  ::: details 详情
  ```js
  function exampleFunction() {
    const argsArray = [...arguments];
    console.log(argsArray);
  }
  exampleFunction(1, 2, 3); // 输出：[1, 2, 3]
  ```
  :::
- 使用 Array.prototype.slice.call() 方法
  ::: details 详情
  ```js
  function exampleFunction() {
    const argsArray = Array.prototype.slice.call(arguments);
    console.log(argsArray);
  }
  exampleFunction(1, 2, 3); // 输出：[1, 2, 3]
  ```
  :::

## 33、如何实现一个简易的 lodash.get 函数
::: details 详情
```js
/**
 * 简易的 lodash.get 实现
 *
 * @param {Object} object - 要检索的对象
 * @param {string | Array<string>} path - 属性路径，可以是点分隔的字符串或数组
 * @param {*} [defaultValue] - 如果路径不存在时的默认值
 * @returns {*} 返回路径对应的值，如果路径不存在则返回默认值
 */
function get(object, path, defaultValue) {
  if (object == null) {
    return defaultValue;
  }
  // 将路径转换为数组形式，支持点分隔字符串和数组索引
  const keys = Array.isArray(path)
    ? path
    : path.replace(/\[(\d+)\]/g, '.$1').split('.');
  // 遍历路径，逐级访问对象属性
  let result = object;
  for (const key of keys) {
    if (result == null || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  return result !== undefined ? result : defaultValue;
}
// 示例用法
const user = {
  profile: {
    name: '胖虎',
    address: [
      { city: '四川' },
      { city: '北京' }
    ]
  }
};
console.log(get(user, 'profile.name')); // 输出: '胖虎'
console.log(get(user, 'profile.address[0].city')); // 输出: '四川'
console.log(get(user, 'profile.address[1].city')); // 输出: '北京'
console.log(get(user, 'profile.address[2].city', 'Unknown')); // 输出: 'Unknown'
console.log(get(user, ['profile', 'address', '0', 'city'], 'N/A')); // 输出: '四川'
console.log(get(null, 'profile.name', 'Default')); // 输出: 'Default'
```
:::

## 34、在 js 中在 new 的时候发生了什么
- 创建一个新的空对象
- 设置对象的原型
- 绑定 this 指向到新对象
- 执行构造函数
- 返回这个对象
::: details 详情
```js
// 模拟 new 操作
function myNew(constructor, ...args) {
  // 创建一个新对象，并将原型设置为 constructor.prototype
  const obj = Object.create(constructor.prototype);
  // 调用构造函数，并将 this 绑定到新对象
  const result = constructor.apply(obj, args);
  // 如果构造函数返回一个对象，则返回该对象；否则，返回新创建的对象
  return (result !== null && (typeof result === "object" || typeof result === "function")) ? result : obj;
}
```
:::

## 35、在 js 中如何翻转一个字符串
```js
// 自己可增加类型判断之类的
const reverse = (str) => str.split("").reverse().join("");
```

## 36、在 js 中为何 0.1+0.2 不等于 0.3，应如何做相等比较
在 js 中使用了 IEEE 754 双精度浮点数编码（即 64 位浮点数表示法），其中数值被表示为二进制小数。但很多十进制小数在二进制表示时是无限循环小数，如 0.1 和 0.2。由于浮点数的存储空间有限，它们会被截断，从而导致精度丢失。最终，这些截断值相加的结果可能并不精确等于 0.3。
::: details 详情
```js
// Number.EPSILON 是 JavaScript 中预定义的一个非常小的值，用于表示可接受的误差范围。如果两个数之间的差值小于这个容差值，那么它们就被认为是相等的。
function areFloatsEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}
console.log(areFloatsEqual(0.1 + 0.2, 0.3)); // 输出 true
// 使用 toFixed 方法
function addUsingToFixed(n1, n2) {
  return parseFloat((n1 + n2).toFixed(10));
}
console.log(addUsingToFixed(0.1, 0.2)); // 输出: 0.3
// 使用整数运算（固定放大倍数）
function addUsingInteger(n1, n2) {
  const factor = 100; // 根据需要调整
  return (Math.round(n1 * factor) + Math.round(n2 * factor)) / factor;
}
console.log(addUsingInteger(0.1, 0.2)); // 输出: 0.3
```
建议使用 `​decimal.js` 和 `​big.js` 等第三方库，这些库专门处理高精度计算，避免了手动处理浮点数带来的各种问题。
:::

## 37、在 js 中 Object.is 与全等运算符(===)有何区别
- 全等运算符(===)是通用的严格相等运算符，适用于大多数比较场景。
- Object.is 提供了更严格的相等比较，在===基础上特别处理了NaN,-0,+0，保证-0与+0不相等，但NaN与NaN相等。

## 38、在 js 中 Number.isNaN 与 globalThis.isNaN 有何区别
Number.isNaN 和 globalThis.isNaN（或简写为 isNaN）是 JavaScript 中用于检测值是否为 NaN（Not-a-Number）的两个方法。
::: details 详情
|特性|Number.isNaN|globalThis.isNaN（或 isNaN）|
|--|-----|-----|
|​类型检查|严格检查，只有传入 NaN 时返回 true|先进行类型转换，再检查是否为 NaN|
|​对非数值的处理|非数值类型总是返回 false|非数值类型会尝试转换为数值，可能导致 true|
|​用途|更适合需要精确判断 NaN 的场景|适用于需要检测值在数值上下文中是否有效的场景|
:::

## 39、在 js 中如何判断一个数字为整数
- ES6 提供了 Number.isInteger() 方法，用于判断一个值是否为整数。 `推荐`
- ES6之前，先判断是否是数字，然后 num % 1 === 0，或者将数字与它的向下取整、向上取整或四舍五入后的值进行比较是否相等。

## 40、在 js 中什么是递归
- 递归是指在`函数中调用自身`的编程技巧。在 js 中，递归可以用于解决许多问题，如遍历数据结构（树、图等）、计算数学公式（阶乘、斐波那契数列等）以及实现某些算法（如快速排序、归并排序等）。
- 尾递归是指一个`函数的最后一个操作是调用自身的递归调用`。尾递归的特点是在函数的调用栈中，递归调用的返回值直接作为当前函数的返回值，不需要进行额外的计算。因此，尾递归可以被编译器或解释器优化，避免因递归调用过深导致的栈溢出问题。
::: details 详情
```js
// 递归计算阶乘 n! = n × (n-1)!，且 0! = 1。
function factorial(n) {
    if (n === 0) { // 基准条件
        return 1;
    } else { // 递归条件
        return n * factorial(n - 1);
    }
}
console.log(factorial(5)); // 输出: 120
// 尾递归计算阶乘
function factorialTail(n, acc = 1) {
    if (n === 0) { // 基准条件
        return acc;
    } else { // 递归条件
        return factorialTail(n - 1, n * acc); // 递归调用是函数的最后一步
    }
}
console.log(factorialTail(5)); // 输出: 120
```
:::

## 41、在 js 中如何实现函数缓存？函数缓存有哪些应用场景？
函数缓存，就是将函数运算过的结果进行缓存，本质上就是用空间（缓存存储）换时间（计算过程），常用于缓存数据计算结果和缓存对象。
::: details 详情
```js
function memoizedFunction(fn) {
  const cache = new Map(); // 使用Map对象存储缓存结果
  return function(...args) {
    const key = JSON.stringify(args); // 将参数序列化为字符串作为缓存键
    if (cache.has(key)) {
      return cache.get(key); // 如果缓存中存在该键，则返回缓存结果
    } else {
      const result = fn.apply(this, args); // 否则，调用原函数计算结果
      cache.set(key, result); // 将计算结果存入缓存
      return result;
    }
  };
}
function calculateSumUpTo(max) {
    console.time('calculateSumUpTo');
    let num = 0;
    for (let index = 0; index < max; index++) {
        num += index;
    }
    console.timeEnd('calculateSumUpTo');
    return num;
}
// 使用 memoizedFunction 包装 calculateSumUpTo
const memoizedCalculateSumUpTo = memoizedFunction(calculateSumUpTo);
// 测试记忆化函数
console.log(memoizedCalculateSumUpTo(1000000)); // 第一次计算并缓存 打印 calculateSumUpTo
console.log(memoizedCalculateSumUpTo(1000000)); // 从缓存中获取结果
console.log(memoizedCalculateSumUpTo(2000000)); // 第一次计算并缓存 打印 calculateSumUpTo
console.log(memoizedCalculateSumUpTo(2000000)); // 从缓存中获取结果
```
虽然使用缓存效率是非常高的，但并不是所有场景都适用，因此千万不要极端的将所有函数都添加缓存，毕竟缓存函数也是有开销的。

应用场景：
- 对于昂贵的函数调用，执行复杂计算的函数。
- 对于具有有限且高度重复输入范围的函数。
- 对于具有重复输入值的递归函数。
- 对于纯函数，即每次使用特定输入调用时返回相同输出的函数。
:::

## 42、在 js 中如何判断一个对象是否为空
```js
// 简易实现
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function isEmpty(obj) {
  return JSON.stringify(obj) === '{}';
}
```
::: details 详情
```js
function isEmpty(obj) {
  // 如果 obj 不是对象或为 null/undefined，返回 true
  if (obj == null) return true;
  // 处理 Map 和 Set
  if (obj instanceof Map || obj instanceof Set) {
    return obj.size === 0;
  }
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }
  // 处理普通对象，包括 Symbol 属性
  return Reflect.ownKeys(obj).length === 0;
}
// 示例用法
console.log(isEmpty(null));          // true
console.log(isEmpty(undefined));     // true
console.log(isEmpty({}));            // true
console.log(isEmpty({ a: 1 }));      // false
console.log(isEmpty([]));            // true
console.log(isEmpty([1, 2, 3]));     // false
console.log(isEmpty(new Map()));     // true
console.log(isEmpty(new Map([['a', 1]]))); // false
console.log(isEmpty(new Set()));     // true
console.log(isEmpty(new Set([1])));  // false
```
更推荐第三方库处理如 `lodash` 的 `isEmpty` 函数处理
:::