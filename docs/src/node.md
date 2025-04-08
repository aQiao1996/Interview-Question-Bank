---
lang: zh-CN
title: node
description: node面试题
---

# node

## 1、说说你对 Node.js 的理解
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，主要用于构建高性能、可扩展的网络应用。它的出现使得 JavaScript 不再局限于浏览器端，而可以在服务端运行。
::: details 详情
**Node.js 的核心特点**
- 单线程、事件驱动
   - Node.js 使用单线程处理请求，通过事件循环（Event Loop）实现高并发。
   - 适合 I/O 密集型任务，但不适合 CPU 密集型任务。
- 非阻塞 I/O
   - Node.js 的 I/O 操作是异步的，避免了线程阻塞，提高了性能。
- 基于 V8 引擎
   - 使用 Google 的 V8 引擎，提供了高效的 JavaScript 执行性能。
- 模块化
   - 内置模块（如 `fs`、`http`）和社区模块（通过 npm 提供）使得开发更加高效。
- 跨平台
   - 支持 Windows、Linux 和 macOS 等多种操作系统。

---

**Node.js 的应用场景**

- Web 服务
  - 构建高性能的 Web 服务器，如 RESTful API 和实时聊天应用。
- 实时应用
  - 适合构建需要实时通信的应用，如 WebSocket 聊天、在线协作工具。
- 工具链
  - 用于构建前端开发工具，如 Webpack、Babel 等。
- 微服务架构
  - 通过轻量化的特性，适合构建微服务架构的服务端。
- 流式处理
  - 处理大文件的流式传输，如视频流、日志流等。

--- 

**Node.js 的优缺点**

- 优点
  - 高性能：Node.js 使用单线程处理请求，避免了线程阻塞，提高了性能。
  - 开发效率高：使用 JavaScript 统一前后端语言，降低了学习成本。
  - 生态丰富：拥有庞大的 npm 包管理器，提供了大量的第三方模块。
- 缺点
  - 单线程：不适合 CPU 密集型任务，可能导致主线程阻塞。
  - 回调地狱：异步编程可能导致代码难以维护（可通过 Promise 和 async/await 改善）。

---

**总结**

Node.js 是一个轻量、高效的 JavaScript 运行时环境，适合构建高并发、I/O 密集型的应用。通过其事件驱动和非阻塞 I/O 模型，Node.js 在实时应用、Web 服务和工具链开发中表现出色。然而，由于单线程的限制，它在处理 CPU 密集型任务时需要特别注意。
:::

## 2、Node.js 模块级别的全局对象
::: details 详情

**模块级别的全局对象**

- `exports`
  > 是 `module.exports` 的一个引用，用于导出模块的内容。如果直接赋值给 `exports`，会断开与 `module.exports` 的引用关系，导致导出失败。
  ```js
    // 正确用法
  exports.hello = function () {
    console.log("Hello, Node.js!");
  };

  // 错误用法（会导致导出失败）
  exports = {
    hello: function () {
      console.log("Hello, Node.js!");
    },
  };
  ```
- `require`
  > 用于引入模块、 `JSON`、或本地文件，可以从 `node_modules` 引入模块。
  ```js
  // 引入核心模块
  const fs = require("fs");

  // 引入本地模块
  const myModule = require("./myModule");

  // 引入 JSON 文件
  const config = require("./config.json");
  ```
- `module`
  > 对当前模块的引用，通过 `module.exports` 用于指定一个模块所导出的内容，即可以通过 `require()` 访问的内容。
  ```js
  console.log(module.id); // 模块标识符
  console.log(module.filename); // 模块的绝对路径
  console.log(module.loaded); // 模块是否已加载完成
  ```
- `__filename`
  > 表示当前模块文件的绝对路径，包含文件名和完整路径。
- `__dirname`
  > 表示当前模块文件所在的目录的绝对路径，不包含文件名。

---

**模块级别的全局变量和真正的全局对象的区别**

- 在浏览器的 JavaScript 中，`window` 是全局对象，而在 Node.js 中，全局对象是 `global`。
- 在 Node.js 中，所有用户代码都运行在模块作用域内，而不是全局作用域中。因此，在最外层定义的变量仅在当前模块中有效，无法直接成为全局变量。但可以通过 `exports` 对象将模块中的内容导出，以供其他模块使用。
- 需要注意的是，在 Node.js 中，用 `var` 声明的变量并不属于全局变量，它的作用域仅限于当前模块。而 `global` 对象则是 Node.js 的全局对象，处于全局作用域中，任何通过 `global` 定义的变量、函数或对象都可以在整个应用中访问。

---

**总结**

在 Node.js 中，`exports`、`require`、`module`、`__filename` 和 `__dirname` 是模块级别的全局变量，它们在每个模块中独立存在，用于支持模块化开发。这些变量并非真正的全局变量，而是通过 Node.js 的模块包装机制传递给每个模块。

Node.js 在加载模块时，会将模块的代码包装在一个立即执行函数（IIFE）中，并将这些变量作为参数传入。例如：
```js
(function(exports, require, module, __filename, __dirname) {
  // 模块的代码在这里
})(exports, require, module, __filename, __dirname);
```
:::

## 3、说说对 Nodejs 中的事件循环机制（Event Loop）理解
Node.js 的事件循环（Event Loop）是其核心机制之一，用于实现非阻塞 I/O 和高并发处理。它基于 JavaScript 的事件驱动模型，并结合了 `libuv` 库的多线程能力，管理异步任务的执行。
::: details 详情
**事件循环的六个阶段**

1️⃣ `timers` 阶段
  - 执行由 `setTimeout` 和 `setInterval` 设置的回调函数。
  - 如果定时器的时间到达，回调会被放入此阶段的任务队列。

2️⃣ `pending callbacks` 阶段
  - 执行一些系统操作的回调函数，例如 TCP 错误类型的回调。

3️⃣ `idle, prepare` 阶段
  - 内部使用，几乎不会涉及到用户代码。

4️⃣ `poll` 阶段
  - 处理 I/O 事件，如文件读取、网络请求等。
  - 如果没有定时器或其他任务，事件循环可能会在此阶段阻塞，等待新的 I/O 事件。

5️⃣ `check` 阶段
  - 执行 `setImmediate` 设置的回调函数。

6️⃣ `close callbacks` 阶段
  - 执行一些关闭事件的回调函数，例如 `socket.close()` 的回调。

---

**事件循环的执行顺序**

通过上面的学习，下面开始看看题目：
```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

async function async2() {
    console.log('async2')
}

console.log('script start')

setTimeout(function () {
    console.log('setTimeout0')
}, 0)

setTimeout(function () {
    console.log('setTimeout2')
}, 300)

setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick1'));

async1();

process.nextTick(() => console.log('nextTick2'));

new Promise(function (resolve) {
    console.log('promise1')
    resolve();
    console.log('promise2')
}).then(function () {
    console.log('promise3')
})

console.log('script end')
```
分析过程：
<!-- - 先找到同步任务，输出script start。
- 遇到第一个 setTimeout，将里面的回调函数放到 timer 队列中。
- 遇到第二个 setTimeout，300ms后将里面的回调函数放到 timer 队列中。
- 遇到第一个setImmediate，将里面的回调函数放到 check 队列中。
- 遇到第一个 nextTick，将其里面的回调函数放到本轮同步任务执行完毕后执行。
- 执行 async1函数，输出 async1 start。
- 执行 async2 函数，输出 async2，async2 后面的输出 async1 end进入微任务，等待下一轮的事件循环。
- 遇到第二个，将其里面的回调函数放到本轮同步任务执行完毕后执行。
- 遇到 new Promise，执行里面的立即执行函数，输出 promise1、promise2。
- then里面的回调函数进入微任务队列。
- 遇到同步任务，输出 script end。
- 执行下一轮回到函数，先依次输出 nextTick 的函数，分别是 nextTick1、nextTick2。
- 然后执行微任务队列，依次输出 async1 end、promise3。
- 执行timer 队列，依次输出 setTimeout0。
- 接着执行 check 队列，依次输出 setImmediate。
- 300ms后，timer 队列存在任务，执行输出 setTimeout2。 -->
1️⃣ 同步任务执行：
  - `console.log('script start')` 输出 `script start`。
  - 定时器和异步任务（如 `setTimeout`、`setImmediate`、`process.nextTick`）的回调被放入相应的队列中。
  - 执行 `async1()`：
    - 输出 `async1 start`。
    - 调用 `async2()`，输出 `async2`。
    - `await async2()` 后的代码（`console.log('async1 end')`）进入微任务队列。
  - 执行 `new Promise` 的同步部分，输出 `promise1` 和 `promise2`。
  - `then` 的回调函数进入微任务队列。
  - 输出 `script end`。

2️⃣ 微任务队列执行：
  - 按优先级依次执行 `process.nextTick` 的回调，输出 `nextTick1` 和 `nextTick2`。
  - 执行微任务队列中的回调，依次输出 `async1` `end` 和 `promise3`。

3️⃣ 宏任务队列执行：
  - 执行 `timers` 阶段的回调，输出 `setTimeout0`。
  - 执行 `check` 阶段的回调，输出 `setImmediate`。
  - 300ms 后，执行 `timers` 阶段的回调，输出 `setTimeout2`。

执行结果如下：
```
script start
async1 start
async2
promise1
promise2
script end
nextTick1
nextTick2
async1 end
promise3
setTimeout0
setImmediate
setTimeout2
```
补充说明：
- `process.nextTick` 的优先级
  - `process.nextTick` 的回调会在当前事件循环阶段结束前执行，优先级高于微任务（如 `Promise.then`）。
- `setTimeout` 和 `setImmediate` 的顺序
  - 在 Node.js `中，setTimeout` 和 `setImmediate` 的执行顺序取决于它们的调用时机：
    - `如果在主线程中调用，setTimeout` 的回调会在 `timers` 阶段执行，而 `setImmediate` 的回调会在 `check` 阶段执行。
    - 如果在 I/O 回调中调用，`setImmediate` 的回调会优先执行。
- `await` 的行为：
  - `await` 会暂停当前异步函数的执行，并将后续代码放入微任务队列。
- 事件循环阶段：
  - Node.js 的事件循环分为多个阶段，每个阶段处理特定类型的任务。任务的执行顺序由事件循环的阶段决定。

---

**事件循环的特点**
- 单线程
  > - Node.js 的事件循环运行在单线程中，但通过 libuv 库实现了多线程的 I/O 操作。
- 非阻塞 I/O
  > - 异步 I/O 操作不会阻塞主线程，任务完成后会将回调函数放入事件队列中等待执行。
- 任务优先级
  > - `process.nextTick()` 的优先级高于其他异步任务。
  > - `setTimeout` 和 `setImmediate` 的优先级取决于事件循环的阶段。
:::

## 4、说说对 Node.js 中的 process 的理解
`process` 是 Node.js 提供的一个全局对象，用于描述当前 Node.js 进程的状态和控制进程的行为。它无需引入，可以直接使用。
::: details 详情
**`process` 的常见属性和方法**
|属性/方法|描述|
|--------|------------|
|`process.pid`|当前进程的 ID|
|`process.platform`|当前运行平台（如 `win32`、`linux`）|
|`process.version`|当前 Node.js 的版本号|
|`process.env`|环境变量对象|
|`process.argv`|命令行参数数组|
|`process.cwd()`|获取当前工作目录|
|`process.exit(code)`|退出当前进程，`code` 为退出码（默认 0 表示正常退出）|
|`process.kill(pid)`|向指定进程发送信号|
|`process.on(event)`|监听进程事件（如 `exit`、`uncaughtException`）|
|`process.nextTick(callback)`|将回调函数放入下一次事件循环的队列中，优先于其他异步任务执行|

---

**注意事项**
- 避免滥用 `process.exit()`：
  - 直接调用 `process.exit()` 会强制退出进程，可能导致未完成的任务被中断。
  - 推荐在退出前清理资源（如关闭文件、断开数据库连接等）。
- 避免滥用 `process.nextTick()`：
  - 如果在 `process.nextTick()` 中递归调用自身，可能会导致事件循环被阻塞，影响其他异步任务的执行。
- 处理未捕获的异常：
  - 使用 `process.on("uncaughtException")` 捕获未处理的异常，但不建议依赖此机制。
  - 推荐使用 `try-catch` 或全局错误处理工具。
- 跨平台兼容性：
  - 使用 `process.platform` 判断运行平台时，注意不同平台的差异（如路径分隔符）。
:::