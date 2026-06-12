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

## 3、说说对 Node.js 中的事件循环机制（Event Loop）理解
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

## 4、说说对 Node.js 中的 `process` 的理解
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

## 5、Node.js 中有哪些常用的内置模块
::: details 详情
**文件系统模块（`fs`）**
- 用于创建、读取、更新和删除文件。
- 常用方法
  - `fs.readFile()`：异步读取文件内容。
  - `fs.readFileSync()`：同步读取文件内容。
  - `fs.writeFile()`：异步写入文件内容。
  - `fs.writeFileSync()`：同步写入文件内容。
  - `fs.mkdir()`：创建目录。
  - `fs.mkdirSync()`：同步创建目录。
  - `fs.readdir()`：读取目录内容。
  - `fs.unlink()`：删除文件。
  - `fs.stat()`：获取文件或目录的状态信息。
  - `fs.watch()`：监听文件或目录的变化。

---

**HTTP 模块（`http`）**
- 用于创建 HTTP 服务器和客户端。
- 常用方法
  - `http.createServer()`：创建 HTTP 服务器。
  - `http.request()`：发送 HTTP 请求。
  - `http.get()`：发送 GET 请求。

---

**路径模块（`path`）**
- 提供用于处理和操作文件路径的工具。
- 常用方法
  - `path.join()`：将多个路径片段拼接成一个完整路径，自动处理路径分隔符。
  - `path.resolve()`：将路径片段解析为绝对路径，从右到左依次处理，直到构造出一个绝对路径。
  - `path.basename()`：获取文件名。
  - `path.dirname()`：获取目录名。
  - `path.extname()`：获取文件扩展名。
  - `path.parse()`：解析路径为对象。
  - `path.format()`：将路径对象格式化为字符串。

---

**URL 模块（`url`）**
- 提供 URL 解析和格式化的工具。
- 常用方法
  - `url.parse()`：解析 URL。
  - `url.format()`：将 URL 格式化为字符串。
  - `url.resolve()`：解析相对路径。
  - `url.resolveObject()`：解析相对路径为对象。

---

**操作系统模块（`os`）**
- 提供与操作系统相关的信息，如 CPU、内存、文件系统等。
- 常用方法
  - `os.cpus()`：获取 CPU 信息。
  - `os.freemem()`：获取可用内存。
  - `os.totalmem()`：获取总内存。
  - `os.homedir()`：获取用户主目录。
  - `os.networkInterfaces()`：获取网络接口信息。
  - `os.tmpdir()`：获取临时目录。
  - `os.hostname()`：获取主机名。
  - `os.platform()`：获取运行平台。
  - `os.release()`：获取操作系统版本。
  - `os.type()`：获取操作系统类型。
  - `os.uptime()`：获取系统运行时间。
  - `os.userInfo()`：获取用户信息。
  - `os.arch()`：获取 CPU 架构。

---

**事件模块（`events`）**
- 用于创建和监听事件。
- 常用方法
  - `EventEmitter.on()`：监听事件。
  - `EventEmitter.emit()`：触发事件。
  - `EventEmitter.once()`：监听一次性事件。
  - `EventEmitter.removeListener()`：移除事件监听器。

---

**子进程模块（`child_process`）**
- 用于创建子进程，并管理子进程的生命周期。
- 常用方法
  - `child_process.spawn()`：创建子进程。
  - `child_process.exec()`：执行命令行命令。
  - `child_process.execFile()`：执行文件命令。
  - `child_process.fork()`：创建子进程并执行模块。

---

**流模块（`stream`）**
- 提供处理流数据的接口，如文件流、网络流等。。
- 常用方法
  - `stream.Readable`：可读流。
  - `stream.Writable`：可写流。
  - `stream.pipe()`：将可读流连接到可写流。
  - `stream.Transform`：转换流。

---

**加密模块（`crypto`）**
- 用于加密和哈希数据。
- 常用方法
  - `crypto.createHash()`：创建哈希对象。
  - `crypto.createCipher()`：创建加密对象。
  - `crypto.createDecipher()`：创建解密对象。
  - `crypto.randomBytes()`：生成随机字节。
:::

## 6、说说对 Node.js 中的 `path` 模块的理解
`path` 模块提供了用于处理和操作文件路径的工具，能够跨平台处理路径分隔符差异（如 Windows 使用 `\`，而 POSIX 使用 `/`）。
::: details 详情
**常用方法**
- `path.join([...paths])`
  > 将多个路径片段拼接成一个完整路径，自动处理路径分隔符。
  ```js
  const path = require('path');
  const fullPath = path.join('/users', 'john', 'docs', 'file.txt');
  console.log(fullPath); // 输出: /users/john/docs/file.txt
  ```
- `path.resolve([...paths])`
  > 将路径片段解析为绝对路径，从右到左依次处理，直到构造出一个绝对路径。
  ```js
  const path = require('path');
  const absolutePath = path.resolve('docs', 'file.txt');
  console.log(absolutePath); // 输出: /当前工作目录/docs/file.txt
  ```
- `path.basename(path[, ext])`
  > 返回路径的最后一部分（文件名），可以选择移除扩展名。
  ```js
  const path = require('path');
  const fileName = path.basename('/users/john/docs/file.txt');
  console.log(fileName); // 输出: file.txt

  const fileNameWithoutExt = path.basename('/users/john/docs/file.txt', '.txt');
  console.log(fileNameWithoutExt); // 输出: file
  ```
- `path.dirname(path)`
  > 返回路径的目录名（不包含文件名）。
  ```js
  const path = require('path');
  const dirName = path.dirname('/users/john/docs/file.txt');
  console.log(dirName); // 输出: /users/john/docs
  ```
- `path.extname(path)`
  > 返回路径的扩展名。
  ```js
  const path = require('path');
  const extName = path.extname('/users/john/docs/file.txt');
  console.log(extName); // 输出: .txt
  ```
- `path.parse(path)`
  > 将路径解析为对象，包含 `root`、`dir`、`base`、`name` 和 `ext` 属性。
  ```js
  const path = require('path');
  const parsedPath = path.parse('/users/john/docs/file.txt');
  console.log(parsedPath);
  // 输出:
  // {
  //   root: '/',
  //   dir: '/users/john/docs',
  //   base: 'file.txt',
  //   name: 'file',
  //   ext: '.txt'
  // }
  ```
- `path.format(pathObject)`
  > 将路径对象格式化为字符串，效果与 `path.parse()` 相反。
  ```js
  const path = require('path');
  const formattedPath = path.format({
    root: '/',
    dir: '/users/john/docs',
    base: 'file.txt'
  });
  console.log(formattedPath); // 输出: /users/john/docs/file.txt
  ```
- `path.isAbsolute(path)`
  > 判断路径是否为绝对路径。
  ```js
  const path = require('path');
  console.log(path.isAbsolute('/users/john')); // 输出: true
  console.log(path.isAbsolute('docs/file.txt')); // 输出: false
  ```
- `path.relative(from, to)`
  > 返回从 `from` 到 `to` 的相对路径。
  ```js
  const path = require('path');
  const relativePath = path.relative('/users/john/docs', '/users/john/images');
  console.log(relativePath); // 输出: ../images
  ```
- `path.normalize(path)`
  > 规范化路径。
  ```js
  const path = require('path');
  const normalizedPath = path.normalize('/users/john/../docs/./file.txt');
  console.log(normalizedPath); // 输出: /users/docs/file.txt
  ```
- `path.sep`
  > 提供平台特定的路径分隔符（POSIX 为 `/`，Windows 为 `\`）。
  ```js
  const path = require('path');
  console.log(path.sep); // POSIX 输出: /，Windows 输出: \
  ```
- `path.delimiter`
  > 提供平台特定的路径分隔符（POSIX 为 `:`，Windows 为 `;`）。
  ```js
  const path = require('path');
  console.log(path.delimiter); // POSIX 输出: :，Windows 输出: ;
  ```

---

**路径模块的应用场景**
- 跨平台路径处理
  - 使用 `path.join()` 和 `path.resolve()` 处理路径，避免手动拼接路径分隔符。
- 文件路径解析
  - 使用 `path.parse()` 和 `path.basename()` 提取文件名、扩展名等信息。
- 动态路径生成
  - 使用 `path.join()` 和 `path.format()` 动态生成文件路径。
:::

## 7、说说对 Node.js 中的 `fs` 模块的理解
`fs` 模块是 Node.js 的内置模块，用于处理文件系统操作，支持文件和目录的创建、读取、写入、删除等操作。`fs` 模块支持同步和异步两种方式，异步方式更符合 Node.js 的非阻塞 I/O 特性。
::: details 详情
**常用方法**
- `fs.readFile(path, options, callback)`
  > 异步读取文件内容。
  ```js
  const fs = require('fs');
  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  ```
- `fs.readFileSync(path, options)`
  > 同步读取文件内容。
  ```js
  const fs = require('fs');
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log(data);
  ```
- `fs.createReadStream`
  > 创建一个可读的流，用于从文件读取数据。
  ```js
  const fs = require('fs');
  const readStream = fs.createReadStream('example.txt');
  readStream.on('data', (chunk) => {
    console.log(chunk);
  })
  readStream.on('end', () => {
    console.log('读取完成');
  })
  readStream.on('error', (err) => {
    console.log(err);
  })
  ```
- `fs.writeFile(path, data, options, callback)`
  > 异步写入文件内容。
  ```js
  const fs = require('fs');
  fs.writeFile('example.txt', 'Hello, Node.js!', (err) => {
    if (err) throw err;
    console.log('File written successfully!');
  });
  ```
- `fs.writeFileSync(path, data, options)`
  > 同步写入文件内容。
  ```js
  const fs = require('fs');
  fs.writeFileSync('example.txt', 'Hello, Node.js!');
  console.log('File written successfully!');
  ```
- `fs.appendFile(path, data, options, callback)`
  > 异步追加文件内容。
  ```js
  const fs = require('fs');
  fs.appendFile('example.txt', 'Hello, Node.js!', (err) => {
    if (err) throw err;
    console.log('File appended successfully!');
  })
  ```
- `fs.createWriteStream`
  > 创建一个可写的流，用于向文件写入数据。
  ```js
  const fs = require('fs');
  const writeStream = fs.createWriteStream('example.txt');
  writeStream.write('Hello World');
  writeStream.end();
  writeStream.on('finish', () => {
    console.log('写入完成');
  })
  writeStream.on('error', (err) => {
    console.log(err);
  })
  ```
- `fs.unlink(path, callback)`
  > 异步删除文件。
  ```js
  const fs = require('fs');
  fs.unlink('example.txt', (err) => {
    if (err) throw err;
    console.log('File deleted successfully!');
  })
  ```
- `fs.stat(path, callback)`
  > 异步获取文件信息。
  ```js
  const fs = require('fs');
  fs.stat('example.txt', (err, stats) => {
    if (err) throw err;
    console.log(`File size: ${stats.size} bytes`);
  })
  ```
- `fs.existsSync(path)`
  > 同步检查文件是否存在。
  ```js
  const fs = require('fs');
  if (fs.existsSync('example.txt')) {
    console.log('File exists!');
  }
  ```
- `fs.readdir(path, callback)`
  > 异步读取目录内容。
  ```js
  const fs = require('fs');
  fs.readdir('/path/to/directory', (err, files) => {
    if (err) throw err;
    console.log(files);
  })
  ```
- `fs.watchFile(path, options, listener)`
  > 监听文件变化。
  ```js
  const fs = require('fs');
  fs.watchFile('/path/to/file', (curr, prev) => {
    console.log(`the current mtime is: ${curr.mtime}`);
  })
  ```
- `fs.watch(path, options, listener)`
  > 监听文件或目录的变化。
  ```js
  const fs = require('fs');
  fs.watch('example.txt', (eventType, filename) => {
    console.log(`Event: ${eventType}, File: ${filename}`);
  });
  ```
:::

## 8、Node.js 中 require 时发生了什么
`require` 是 Node.js 中用于引入模块的关键方法，它可以加载核心模块、第三方模块以及本地模块。`require` 的加载过程涉及模块的解析、编译和缓存机制。
::: details 详情
**`require` 的加载过程**

1️⃣ 路径解析
  - Node.js 首先根据传入的模块标识符（如模块名或路径）解析模块的路径。
  - 核心模块（如 `fs`、`http`）优先加载，无需路径解析。
  - 对于本地模块，Node.js 会根据文件路径解析模块的绝对路径。

2️⃣ 文件定位
  - 如果模块标识符是文件路径，Node.js 会尝试加载以下文件：
    - 精确匹配的文件（如 `./module.js`）。
    - 如果没有扩展名，会依次尝试 `.js`、`.json`、`.node`。
  - 如果模块标识符是目录路径，Node.js 会尝试加载目录下的 `package.json` 中的 `main` 字段指定的文件。如果没有 `package.json`，会尝试加载 `index.js` 或 `index.node`。

3️⃣ 模块编译
  - 对于 `.js` 文件，Node.js 会将其包装在一个立即执行函数（IIFE） 中执行。
  - 对于 `.json` 文件，Node.js 会使用 `JSON.parse` 解析文件内容。
  - 对于 `.node` 文件（C++ 扩展），Node.js 会加载编译后的二进制文件。

4️⃣ 模块缓存
  - 加载完成的模块会被缓存到 `require.cache` 中，避免重复加载。
  - 如果再次 `require` 相同的模块，Node.js 会直接从缓存中返回模块的导出对象。

---

**`require` 的加载顺序**

1️⃣ 系统缓存
  - Node.js 首先检查模块是否已经被加载过（即是否存在于 `require.cache` 中）。

2️⃣ 系统模块
  - 如果模块是 Node.js 的核心模块（如 `fs`、`http`），会直接加载核心模块。

3️⃣ 文件模块
  - 如果模块标识符是文件路径（如 `./module.js` 或 `../module`），Node.js 会尝试加载对应的文件。

4️⃣ 目录模块
  - 如果模块标识符是目录路径，Node.js 会尝试加载该目录下的 `package.json` 文件中 `main` 字段指定的文件。
  - 如果没有 `package.json`，会尝试加载目录下的 `index.js` 或 `index.node` 文件。

5️⃣ `node_modules` 目录
  - 如果模块标识符是模块名（如 `express`），Node.js 会从当前模块所在目录开始，逐级向上查找 `node_modules` 目录，直到找到对应的模块。
  - 如果在所有父级目录中都找不到模块，会抛出 `MODULE_NOT_FOUND` 错误。
:::

## 9、如何发布一个全局可执行命令的 npm package
在 package.json 中增加 bin，对应脚本，脚本文件头部 `#!/usr/bin/env node`
> `#!/usr/bin/env node` 是 shebang，用于指定脚本运行时使用 Node.js。

## 10、Node.js 如何修改内存大小
Node.js 默认的内存限制是约 **1.7GB**（64 位系统）或 **0.8GB**（32 位系统）。如果需要处理大数据集或内存密集型任务，可以通过 `node --max-old-space-size=4096` 修改内存大小。

## 11、说说对 Node.js 中的 Buffer 的理解
`Buffer` 是 Node.js 中用于处理二进制数据的类。它类似于浏览器中的 `TypedArray`，但功能更强大，专为处理二进制数据流设计。
::: details 详情
**创建 Buffer 的方式**
- `Buffer.alloc(size)`
  > 创建一个指定大小的 Buffer，并用 `0` 填充。
  ```js
  const buf = Buffer.alloc(10); // 创建一个大小为 10 字节的 Buffer
  console.log(buf); // <Buffer 00 00 00 00 00 00 00 00 00 00>
  ```
- `Buffer.allocUnsafe(size)`
  > 创建一个指定大小的 Buffer，但不初始化内容，可能包含旧数据。
  ```js
  const buf = Buffer.allocUnsafe(10);
  console.log(buf); // 可能包含随机数据
  ```
- `Buffer.from(array)`
  > 从数组创建 Buffer。
  ```js
  const buf = Buffer.from([1, 2, 3]);
  console.log(buf); // <Buffer 01 02 03>
  ```
- `Buffer.from(string[, encoding])`
  > 从字符串创建 Buffer，默认编码为 `utf8`。
  ```js
  const buf = Buffer.from('Hello, Node.js!');
  console.log(buf); // <Buffer 48 65 6c 6c 6f 2c 20 4e 6f 64 65 2e 6a 73 21>
  ```

---

**常用方法**
- `buf.toString([encoding[, start[, end]]])`
  > 将 Buffer 转换为字符串。
  ```js
  const buf = Buffer.from('Hello, Node.js!');
  console.log(buf.toString('utf8')); // 输出: Hello, Node.js!
  ```
- `buf.length`
  > 获取 Buffer 的长度（字节数）。
  ```js
  const buf = Buffer.from('Hello');
  console.log(buf.length); // 输出: 5
  ```
- `buf.slice(start, end)`
  > 截取 Buffer 的一部分，不会复制数据。
  ```js
  const buf = Buffer.from('Hello, Node.js!');
  const slice = buf.slice(0, 5);
  console.log(slice.toString()); // 输出: Hello
  ```
- `Buffer.concat(list[, totalLength])`
  > 合并多个 Buffer。
  ```js
  const buf1 = Buffer.from('Hello, ');
  const buf2 = Buffer.from('Node.js!');
  const buf = Buffer.concat([buf1, buf2]);
  console.log(buf.toString()); // 输出: Hello, Node.js!
  ```
- `buf.write(string[, offset[, length[, encoding]]])`
  > 向 Buffer 中写入数据。
  ```js
  const buf = Buffer.alloc(10);
  buf.write('Hello');
  console.log(buf.toString()); // 输出: Hello
  ```
- `Buffer.isBuffer(obj)`
  > 检查对象是否为 Buffer。
  ```js
  const buf = Buffer.from('Hello');
  console.log(Buffer.isBuffer(buf)); // 输出: true
  ```

---

**Buffer 的特点**
- 固定大小
  > Buffer 的大小在创建时确定，无法动态调整。
- 高效操作
  > Buffer 提供了直接操作内存的方法，适合处理高性能需求的场景。
- 编码支持
  > 支持多种编码格式，如 `utf8`、`ascii`、`base64`、`hex` 等。

---

**使用场景**
- 处理网络数据流
  > 如 `TCP` 数据流、`HTTP` 请求和响应。
- 文件操作
  > 读取和写入二进制文件。
- 数据加密
  > 处理加密算法中的二进制数据。
- 图片、视频等多媒体数据
  > 处理非文本数据

---

**注意事项**
- `Buffer.allocUnsafe` 的风险
  > 由于未初始化内容，可能包含旧数据，使用前需要手动清空。
- 内存泄漏
  > 如果长时间持有 Buffer 对象，可能导致内存泄漏，需及时释放不再使用的 Buffer。
:::

## 12、说说对 Node.js 中的 Stream 的理解
`Stream` 是 Node.js 中处理流式数据的 **抽象接口** ，适合处理大文件、网络数据流等场景。通过流的分块处理和实时传输机制，可以显著提高性能并节省内存。
::: details 详情
**Stream 的类型**
- 可读流（Readable）
  > 可读取数据的流。例如 `fs.createReadStream()` 可以从文件读取内容。
- 可写流（Writable）
  > 可写入数据的流。例如 `fs.createWriteStream()` 可以将数据写入文件。
- 双工流（Duplex）
  > 可读写数据的流。例如 `net.Socket` 可以用于网络通信。
- 转换流（Transform）
  > 可读写数据的流，并且可以进行数据转换。例如 `zlib.createGzip()` 可以将数据压缩。

Node.js中很多对象都实现了流，总之它是会冒数据（以 `Buffer` 为单位），它的独特之处在于，它不像传统的程序那样一次将一个文件读入内存，而是逐块读取数据、处理其内容，而不是将其全部保存在内存中。

流可以分成三部分：`source`、`dest`、`pipe`

在 `source` 和 `dest` 之间有一个连接的管道 `pipe`，它的基本语法是 `source.pipe(dest)`，`source` 和 `dest` 就是通过 `pipe` 连接，让数据从 `source` 流向了 `dest`。

:::

## 13、JWT 是什么
JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间以 JSON 对象的形式安全地传输信息。它通常用于身份验证和信息交换。
::: details 详情
**JWT 的结构**

JWT 分成了三部分，头部（Header）、载荷（Payload）、签名（Signature），并以.进行拼接。

- 头部（Header）
  > 描述 JWT 的元信息，包括类型和签名算法。
  ```json
  {
    "alg": "HS256", // 签名算法，如 HMAC SHA256
    "typ": "JWT"    // 类型，固定为 JWT
  }
  ```
- 载荷（Payload）
  > 包含需要传输的声明（claims），可以是用户信息或其他数据。
  ```json
  {
    "sub": "1234567890", // 用户 ID
    "name": "John Doe",  // 用户名
    "iat": 1516239022    // 签发时间（时间戳）
  }
  ```
- 签名（Signature）
  > 用于验证数据的完整性，防止数据被篡改。
  ```
  HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret
  )
  ```

---

**JWT 的工作原理**

1️⃣ 用户登录
  > 用户通过用户名和密码登录，服务器验证用户身份。

2️⃣ 生成 JWT
  > 服务器根据用户信息生成 JWT，并将其返回给客户端。

3️⃣ 客户端存储 JWT
  > 客户端通常将 JWT 存储在 `localStorage` 或 `cookie` 中。

4️⃣ 请求携带 JWT
  > 客户端在后续请求中将 JWT 放入 `Authorization` 头中。

5️⃣ 服务器验证 JWT
  > 服务器通过验证 JWT 的签名和有效期，确认请求的合法性。

---

**JWT 的优缺点**
- 优点
  - 无状态：JWT 是自包含的，服务器无需存储会话信息，适合分布式系统。
  - 跨语言支持：JWT 是基于 JSON 的，支持多种语言实现。
  - 安全性：使用签名确保数据完整性，防止篡改。
- 缺点
  - 无法撤销：一旦 JWT 签发，无法轻易撤销，除非在服务器端实现黑名单。
  - 大小：JWT 包含头部、载荷和签名，体积可能较大，影响传输效率。
  - 安全性依赖于密钥：如果密钥泄露，JWT 的安全性将受到威胁。
:::

## 14、请简述重新登录 Refresh Token 的原理
::: details 详情
Refresh Token，将会话管理流程改进如下：
- 客户端使用用户名密码进行认证。
- 服务端生成有效时间较短的 `Access Token`（例如 10 分钟），和有效时间较长的 `Refresh Token`（例如 7 天）。
- 客户端访问需要认证的接口时，携带 `Access Token`。
- 如果 `Access Token` 没有过期，服务端鉴权后返回给客户端需要的数据。
- 如果携带 `Access Token` 访问需要认证的接口时鉴权失败（例如返回 401 错误），则客户端使用 `Refresh Token` 向刷新接口申请新的 `Access Token`。
- 如果 `Refresh Token` 没有过期，服务端向客户端下发新的 `Access Token`。
- 客户端使用新的 `Access Token` 访问需要认证的接口。

Refresh Token 提供了服务端禁用用户 Token 的方式，当用户需要登出或禁用用户时，只需要将服务端的 `Refresh Token` 禁用或删除，用户就会在 `Access Token` 过期后，由于无法获取到新的 `Access Token` 而再也无法访问需要认证的接口。这样的方式虽然会有一定的窗口期（取决于 `Access Token` 的失效时间），但是结合用户登出时客户端删除 `Access Token` 的操作，基本上可以适应常规情况下对用户认证鉴权的精度要求。
:::

## 15、如何手写一个 EventEmitter
`EventEmitter` 是 Node.js 中非常常见的事件发布订阅模式实现。它允许我们注册事件、触发事件、移除事件监听器。

::: details 详情
### 核心能力

- `on`：注册事件监听。
- `off`：移除事件监听。
- `emit`：触发事件。
- `once`：只执行一次的监听。

### 实现思路

- 使用一个对象或 `Map` 存储事件名和对应的回调数组。
- 注册事件时，把回调加入数组。
- 触发事件时，按顺序执行对应回调。
- 移除事件时，从数组中删除指定回调。
- `once` 可以通过包装一层函数实现，触发后自动移除。

### 示例实现

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

    if (!callbacks) {
      return;
    }

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

    if (!callbacks) {
      return;
    }

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

const emitter = new EventEmitter();

function handleMessage(message) {
  console.log("message:", message);
}

emitter.on("message", handleMessage);
emitter.emit("message", "hello");
emitter.off("message", handleMessage);
emitter.once("login", username => {
  console.log("login:", username);
});
emitter.emit("login", "Tom");
emitter.emit("login", "Jerry");
```

### 注意事项

- 触发事件时建议使用 `slice()` 拷贝一份回调数组，避免遍历过程中修改数组。
- `once` 需要确保只执行一次。
- 如果事件数量很多，可以进一步考虑取消后清理空数组，避免内存浪费。
:::

## 16、说说对 Node.js 中 cluster 的理解
`cluster` 是 Node.js 提供的多进程模块，用于创建多个工作进程，让 Node 服务可以更好地利用多核 CPU。

::: details 详情
### 为什么需要 cluster

Node.js 的 JavaScript 执行是单线程的，一个进程默认只能利用一个 CPU 核心。

如果服务器是多核 CPU，只启动一个 Node 进程会造成 CPU 资源浪费。`cluster` 可以通过主进程创建多个工作进程，让多个进程共同处理请求。

### 工作原理

- 主进程负责创建和管理工作进程。
- 工作进程负责实际处理请求。
- 多个工作进程可以监听同一个端口。
- 主进程可以监听工作进程退出，并重新拉起新的工作进程。

### 基本示例

```js
const cluster = require("cluster");
const http = require("http");
const os = require("os");

const cpuCount = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", worker => {
    console.log(`工作进程 ${worker.process.pid} 已退出，重新启动`);
    cluster.fork();
  });
} else {
  http
    .createServer((req, res) => {
      res.end(`worker ${process.pid}`);
    })
    .listen(3000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 应用场景

- 提高 Node 服务对多核 CPU 的利用率。
- 提升 Web 服务的并发处理能力。
- 工作进程异常退出后自动重启，提高服务可用性。

### 注意事项

- 多进程之间内存不共享，不能直接共享变量。
- 进程间通信需要使用 IPC、消息队列、Redis 等方案。
- 如果需要生产级进程管理，通常会使用 PM2、Docker、Kubernetes 等工具。
- 对 CPU 密集型任务，cluster 可以提升多核利用率；对 I/O 密集型任务，也要结合实际瓶颈分析。
:::

## 17、Node.js 中间件洋葱模型是什么
洋葱模型是一种中间件执行模型，常见于 Koa。请求会按照中间件注册顺序从外到内执行，遇到 `await next()` 后进入下一个中间件，后续逻辑再从内到外返回执行。

::: details 详情
### 执行过程

假设有 3 个中间件：

```js
app.use(async (ctx, next) => {
  console.log("1 start");
  await next();
  console.log("1 end");
});

app.use(async (ctx, next) => {
  console.log("2 start");
  await next();
  console.log("2 end");
});

app.use(async (ctx, next) => {
  console.log("3 start");
  await next();
  console.log("3 end");
});
```

执行顺序是：

```txt
1 start
2 start
3 start
3 end
2 end
1 end
```

### 为什么叫洋葱模型

请求进入时，先经过最外层中间件，再一层层进入内部；响应返回时，又从内部一层层回到外部，就像洋葱的层级结构。

### 应用场景

- 统一错误处理。
- 请求日志记录。
- 鉴权。
- 响应时间统计。
- 参数解析和响应包装。

### 和 Express 中间件的区别

- Express 更偏线性执行，调用 `next()` 后进入下一个中间件。
- Koa 基于 async/await，可以在 `await next()` 前后分别处理请求前置逻辑和响应后置逻辑。

### 注意事项

- 如果某个中间件没有调用 `next()`，后续中间件不会执行。
- `await next()` 后面的代码会在下游中间件执行完成后继续执行。
- 洋葱模型适合做请求前后都需要处理的逻辑。
:::

## 18、Node.js 中 child_process 有哪些常用方法
`child_process` 是 Node.js 用于创建子进程的内置模块，常用于执行系统命令、启动脚本、处理 CPU 密集型任务或和其他进程通信。

::: details 详情
### exec

`exec` 会启动一个 shell 执行命令，并把输出结果缓存到内存中，适合输出较小的命令。

```js
const { exec } = require("child_process");

exec("node -v", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(stdout);
});
```

特点：

- 使用 shell 执行命令。
- 回调中一次性拿到输出结果。
- 输出结果有默认缓存大小限制。
- 不适合处理大量输出。

### spawn

`spawn` 不会一次性缓存输出，而是通过流的方式读取 stdout 和 stderr，适合长时间运行或输出较大的命令。

```js
const { spawn } = require("child_process");

const child = spawn("node", ["-v"]);

child.stdout.on("data", data => {
  console.log(data.toString());
});

child.stderr.on("data", data => {
  console.error(data.toString());
});
```

特点：

- 默认不经过 shell。
- 输出通过流处理。
- 适合大文件处理、持续输出、长时间任务。

### fork

`fork` 是 `spawn` 的特殊形式，专门用于创建 Node.js 子进程，并且默认建立 IPC 通信通道。

```js
const { fork } = require("child_process");

const child = fork("./worker.js");

child.send({
  type: "start",
});

child.on("message", message => {
  console.log(message);
});
```

### 对比总结

| 方法 | 适合场景 | 输出方式 | 是否适合 IPC |
| --- | --- | --- | --- |
| exec | 简单命令、小输出 | 回调一次性返回 | 否 |
| spawn | 长任务、大输出 | 流式输出 | 可手动配置 |
| fork | Node 子进程通信 | IPC 消息 | 是 |

### 注意事项

- 执行用户输入拼接的命令时要防止命令注入。
- 大输出任务不要使用 `exec`，避免超过缓存限制。
- CPU 密集型任务可以放到子进程，避免阻塞主进程事件循环。
:::

## 19、Node.js 中如何处理未捕获异常
Node.js 中未捕获异常如果没有被处理，可能会导致进程退出。常见异常包括同步代码异常、Promise 未处理拒绝、异步回调异常等。

::: details 详情
### try...catch

同步代码可以使用 `try...catch` 捕获。

```js
try {
  JSON.parse("{");
} catch (error) {
  console.error("解析失败:", error);
}
```

但 `try...catch` 无法捕获异步回调内部抛出的异常。

### Promise 异常

Promise 异常需要使用 `catch` 或 `try...catch + await`。

```js
async function main() {
  try {
    await request();
  } catch (error) {
    console.error(error);
  }
}
```

### 全局兜底

```js
process.on("uncaughtException", error => {
  console.error("未捕获异常:", error);
});

process.on("unhandledRejection", reason => {
  console.error("未处理 Promise 拒绝:", reason);
});
```

### 生产建议

- 全局异常处理只适合兜底记录日志，不建议让进程继续长期运行。
- 发生未知异常后，进程可能已经处于不可信状态，应优雅退出并由进程管理工具重启。
- Web 服务中应使用统一错误处理中间件处理业务异常。
- 结合日志、监控、告警定位问题。
:::

## 20、Node.js 服务如何做日志记录
Node.js 服务中的日志用于记录请求、错误、性能和业务关键行为，方便排查问题、追踪链路和做线上监控。

::: details 详情
### 常见日志类型

- 访问日志：记录请求方法、URL、状态码、响应时间、IP 等。
- 错误日志：记录异常堆栈、错误码、上下文信息。
- 业务日志：记录下单、支付、登录、审批等关键业务行为。
- 性能日志：记录慢接口、数据库耗时、外部服务耗时。

### 基本示例

```js
function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });

  next();
}
```

### 生产实践

- 使用成熟日志库，例如 `winston`、`pino`。
- 按级别记录日志，例如 `debug`、`info`、`warn`、`error`。
- 使用 JSON 格式输出，方便日志平台解析。
- 给每个请求生成 requestId，便于链路追踪。
- 错误日志需要包含堆栈和关键上下文。

### 日志落盘和采集

生产环境中，日志通常不会只打印到控制台，而是会进入统一采集链路：

- 输出到 stdout，由 Docker 或进程管理平台采集。
- 写入文件，再由 Filebeat 等工具采集。
- 直接上报到日志平台或可观测性平台。

### 注意事项

- 不要记录密码、Token、身份证号等敏感信息。
- 日志量过大时需要采样、分级和归档。
- 日志记录不能明显影响接口性能。
- 错误日志和告警规则要配合使用，避免只记录不处理。
:::

## 21、Node.js 服务常见的安全防护有哪些
Node.js 服务的安全防护需要从输入校验、认证鉴权、依赖安全、运行时隔离和日志监控等多个方面处理。

::: details 详情
### 输入和参数安全

- 对请求参数做类型、长度、格式校验。
- 避免直接拼接 SQL，使用参数化查询或 ORM。
- 对文件上传限制类型、大小和存储路径。
- 对富文本内容做 XSS 过滤或白名单处理。

### 认证和鉴权

- 登录态使用安全的 Cookie 或 Token 方案。
- Cookie 建议设置 `HttpOnly`、`Secure`、`SameSite`。
- 重要接口必须做权限校验，不能只依赖前端隐藏按钮。
- 敏感操作建议增加二次确认或风控校验。

### 依赖和运行环境

- 定期检查依赖漏洞，例如使用 `npm audit` 或安全扫描平台。
- 不在代码仓库中提交密钥、Token、数据库密码。
- 生产环境使用最小权限运行服务。
- 对配置文件和环境变量做权限控制。

### 接口防护

- 增加限流，防止暴力破解和恶意刷接口。
- 设置合理的请求体大小限制。
- 对跨域、CORS 白名单做严格配置。
- 使用 Helmet 等中间件设置常见安全响应头。

### 监控和兜底

- 记录异常日志和关键安全事件。
- 对登录失败、权限异常、接口高频访问设置告警。
- 发生未捕获异常时优雅退出，并由进程管理工具重启。
:::

## 22、Node.js 服务如何排查内存泄漏
Node.js 内存泄漏通常表现为进程内存持续上涨、GC 后无法回落、接口变慢或进程被系统杀掉。

::: details 详情
### 常见原因

- 全局变量或缓存持续增长，没有淘汰策略。
- 定时器、事件监听器没有清理。
- 闭包长期引用大对象。
- 请求上下文被错误保存到全局集合。
- Stream、数据库连接、文件句柄没有正确关闭。

### 初步定位

可以先观察进程内存变化：

```js
setInterval(() => {
  const memory = process.memoryUsage();
  console.log({
    rss: memory.rss,
    heapUsed: memory.heapUsed,
    heapTotal: memory.heapTotal,
    external: memory.external,
  });
}, 5000);
```

重点关注 `heapUsed` 是否持续增长，并且 GC 后仍无法下降。

### 排查方式

- 使用 Chrome DevTools 或 Node Inspector 采集 Heap Snapshot。
- 对比不同时间点的堆快照，查看持续增长的对象类型。
- 压测某个接口，观察是否每次调用都会增加无法释放的对象。
- 检查缓存、数组、Map、事件监听器、定时器等长期引用。

### 处理建议

- 缓存应设置容量上限、过期时间或 LRU 策略。
- 组件销毁、连接关闭、请求结束时清理监听器和定时器。
- 避免把请求对象、响应对象保存到全局变量。
- 对大文件处理优先使用 Stream，避免一次性读入内存。

### 生产实践

- 接入内存、GC、事件循环延迟等监控指标。
- 配置进程管理工具，在异常退出后自动拉起。
- 对内存持续上涨设置告警，避免问题扩大。
:::

## 23、Node.js 中 worker_threads 有什么作用
`worker_threads` 用于在 Node.js 中创建工作线程，适合处理 CPU 密集型任务，避免阻塞主线程事件循环。

::: details 详情
### 为什么需要 worker_threads

Node.js 主线程适合处理 I/O 密集型任务，但如果执行大量计算，会阻塞事件循环，导致请求响应变慢。

例如：

- 大文件压缩。
- 图片处理。
- 加密解密。
- 大量数据计算。
- 复杂 JSON 解析或报表生成。

这些任务可以放到 worker 线程中执行。

### 基本示例

```js
const { Worker } = require("worker_threads");

function runWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: data,
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0) {
        reject(new Error(`worker stopped with exit code ${code}`));
      }
    });
  });
}
```

```js
// worker.js
const { parentPort, workerData } = require("worker_threads");

const result = workerData.numbers.reduce((sum, item) => sum + item, 0);

parentPort.postMessage(result);
```

### 和 child_process 的区别

- `worker_threads` 是线程，共享同一个进程资源，通信成本相对低。
- `child_process` 是子进程，隔离性更强，但创建和通信成本更高。
- CPU 密集型计算更适合优先考虑 `worker_threads`。

### 注意事项

- worker 不是越多越好，过多线程会增加调度和内存成本。
- 应使用线程池复用 worker，避免频繁创建销毁。
- 主线程和 worker 通信需要考虑数据序列化成本。
:::

## 24、Node.js Stream 中背压是什么
背压是指数据写入速度大于消费速度时，系统通过暂停或减缓数据生产来避免内存持续堆积。

::: details 详情
### 为什么会有背压

在 Stream 中，如果 readable 读取数据很快，但 writable 写入很慢，数据会不断堆积到缓冲区。

如果不控制生产速度，可能导致：

- 内存占用持续上涨。
- 进程响应变慢。
- 大文件处理时进程崩溃。

### write 的返回值

`writable.write(chunk)` 会返回一个布尔值：

- `true`：缓冲区还能继续接收数据。
- `false`：缓冲区已达到阈值，应暂停写入。

当缓冲区排空后，会触发 `drain` 事件。

```js
function writeData(writable, chunks) {
  let index = 0;

  function write() {
    let canWrite = true;

    while (index < chunks.length && canWrite) {
      canWrite = writable.write(chunks[index]);
      index++;
    }

    if (index < chunks.length) {
      writable.once("drain", write);
    } else {
      writable.end();
    }
  }

  write();
}
```

### pipe 如何处理背压

使用 `readable.pipe(writable)` 时，Node.js 会自动处理背压：当写入端处理不过来时暂停读取，等写入端恢复后继续读取。

### 注意事项

- 处理大文件时优先使用 Stream，不要一次性读入内存。
- 手动写入 Stream 时要关注 `write()` 返回值和 `drain` 事件。
- 背压是流式处理稳定性的关键机制。
:::

## 25、Node.js 中 AsyncLocalStorage 有什么作用
`AsyncLocalStorage` 用于在异步调用链中保存和读取上下文数据，常用于记录 requestId、用户信息和链路追踪信息。

::: details 详情
### 为什么需要

Node.js 中一次请求可能经过多层异步调用：

- 中间件。
- 数据库查询。
- 外部接口请求。
- 日志记录。
- 业务 service。

如果每层都手动传递 requestId，会让函数参数变得很臃肿。

`AsyncLocalStorage` 可以让同一条异步链路中的代码共享上下文。

### 基本用法

```js
const { AsyncLocalStorage } = require("async_hooks");
const crypto = require("crypto");

const asyncLocalStorage = new AsyncLocalStorage();

function middleware(req, res, next) {
  const requestId = crypto.randomUUID();

  asyncLocalStorage.run({ requestId }, () => {
    next();
  });
}

function logger(message) {
  const store = asyncLocalStorage.getStore();
  console.log(`[${store?.requestId}] ${message}`);
}
```

在后续异步调用中，`logger` 可以直接读取当前请求的 `requestId`。

### 常见场景

- 请求日志自动带上 requestId。
- 链路追踪。
- 多租户上下文。
- 当前用户上下文。
- APM 和监控埋点。

### 注意事项

- 不要在上下文中保存过大的对象，避免内存压力。
- 需要注意异步边界，某些第三方库可能导致上下文丢失。
- 它适合传递上下文信息，不适合替代正常的业务参数传递。
:::

## 26、Node.js 中 diagnostics_channel 有什么作用
`diagnostics_channel` 是 Node.js 提供的诊断通道模块，用于在应用和库之间发布、订阅诊断事件，常用于监控、链路追踪和性能分析。

::: details 详情
### 基本概念

它提供一种低侵入的事件发布机制。业务库可以在关键位置发布诊断信息，监控系统可以订阅这些信息。

```js
const diagnosticsChannel = require("diagnostics_channel");

const channel = diagnosticsChannel.channel("app.request");

function handleRequest(req) {
  channel.publish({
    url: req.url,
    method: req.method,
  });
}
```

订阅方：

```js
const diagnosticsChannel = require("diagnostics_channel");

diagnosticsChannel.channel("app.request").subscribe(message => {
  console.log("request:", message);
});
```

### 适合场景

- 框架或库暴露内部生命周期事件。
- APM 采集请求、数据库、缓存等调用信息。
- 性能分析和链路追踪。
- 不希望业务代码强依赖具体监控 SDK 的场景。

### 优点

- 发布方和订阅方解耦。
- 没有订阅者时开销较低。
- 适合库和基础设施层提供可观测性扩展点。

### 注意事项

- 通道命名要稳定，避免随意修改导致订阅失效。
- 传递的数据要控制大小，避免影响性能。
- 不要在诊断消息中包含密码、Token 等敏感信息。
:::

## 27、Node.js 中 perf_hooks 有什么作用
`perf_hooks` 是 Node.js 提供的性能测量模块，可以用于记录代码执行耗时、函数耗时和性能时间线。

::: details 详情
### 基本用法

```js
const { performance } = require("perf_hooks");

const start = performance.now();

doSomething();

const end = performance.now();

console.log(`cost: ${end - start}ms`);
```

`performance.now()` 返回高精度时间，比 `Date.now()` 更适合做性能测量。

### 使用 mark 和 measure

```js
const { performance, PerformanceObserver } = require("perf_hooks");

const observer = new PerformanceObserver(list => {
  list.getEntries().forEach(entry => {
    console.log(entry.name, entry.duration);
  });
});

observer.observe({
  entryTypes: ["measure"],
});

performance.mark("task-start");

doSomething();

performance.mark("task-end");
performance.measure("task", "task-start", "task-end");
```

### 常见场景

- 测量接口内部关键步骤耗时。
- 分析启动耗时。
- 对比不同实现的性能。
- 采集业务函数执行时间。

### 注意事项

- 性能测量代码不要过度侵入业务逻辑。
- 线上采集要控制频率和日志量。
- 单次耗时容易受环境影响，应结合多次采样和实际业务指标分析。
:::

## 28、Node.js 中如何使用 AbortController 取消异步任务
`AbortController` 用于给异步任务提供取消信号，常见于取消请求、超时控制和组件卸载后的任务清理。

::: details 详情
### 基本用法

```js
const controller = new AbortController();

fetch("https://example.com/api", {
  signal: controller.signal,
});

controller.abort();
```

调用 `abort()` 后，绑定了该 `signal` 的异步任务会收到取消信号。

### 超时取消

```js
async function fetchWithTimeout(url, timeout = 3000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
```

### 自定义异步任务支持取消

```js
function task(signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("aborted"));
      return;
    }

    signal.addEventListener("abort", () => {
      reject(new Error("aborted"));
    });
  });
}
```

### 注意事项

- 取消信号需要异步任务本身支持才会生效。
- 超时 reject 不等于底层任务一定停止，最好使用 `AbortController` 传递取消信号。
- 取消后要区分取消错误和真实业务错误。
:::

## 29、Node.js 中 timer.unref 和 timer.ref 有什么作用
`timer.unref()` 和 `timer.ref()` 用于控制定时器是否会阻止 Node.js 进程退出。

::: details 详情
### 默认行为

默认情况下，`setTimeout`、`setInterval` 创建的定时器会保持事件循环存活：

```js
setTimeout(() => {
  console.log("timeout");
}, 10000);
```

即使没有其他任务，进程也会等待这个定时器执行。

### 使用 unref

```js
const timer = setTimeout(() => {
  console.log("timeout");
}, 10000);

timer.unref();
```

调用 `unref()` 后，如果事件循环里没有其他需要处理的任务，进程可以直接退出，不必等待该定时器。

### 使用 ref

```js
timer.ref();
```

`ref()` 用于恢复默认行为，让该定时器继续保持事件循环存活。

### 常见场景

- 后台心跳或监控上报，不希望它阻止进程退出。
- 缓存清理、定时刷新等非关键任务。
- CLI 工具中设置兜底超时，但不希望超时定时器拖住正常退出。

### 注意事项

- `unref()` 不会取消定时器，只是不再让它阻止进程退出。
- 如果进程提前退出，`unref` 后的定时器回调可能不会执行。
- 关键业务逻辑不要依赖 `unref` 定时器一定执行。
:::

## 30、Node.js 中 createRequire 有什么作用
`createRequire` 用于在 ES Module 中创建一个 CommonJS 风格的 `require` 函数，方便加载只支持 `require` 的资源或依赖。

::: details 详情
### 基本用法

```js
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const pkg = require("./package.json");
```

在 ESM 文件中没有内置的 `require`、`__dirname`、`__filename`，如果需要兼容 CommonJS 加载方式，就可以使用 `createRequire`。

### 常见场景

- 在 ESM 项目中读取 `package.json`。
- 加载只支持 CommonJS 的包。
- 迁移 CommonJS 项目到 ESM 时做兼容过渡。
- 在工具链脚本中复用已有的 `require.resolve` 能力。

### 和动态 import 的区别

```js
const mod = await import("./config.js");
```

- `import()` 是异步的，遵循 ESM 加载规则。
- `require()` 是同步的，遵循 CommonJS 加载规则。
- `createRequire` 更适合兼容 CommonJS 依赖或 JSON 加载。

### 注意事项

- 不建议在新代码中无节制混用 ESM 和 CommonJS。
- 使用 `createRequire` 时要明确它的解析基准路径。
- 如果依赖本身已经支持 ESM，优先使用标准 `import`。
:::

## 31、Node.js 中 AsyncResource 有什么作用
`AsyncResource` 用于手动创建和管理异步资源，帮助 Node.js 正确追踪自定义异步任务的上下文。

::: details 详情
### 为什么需要 AsyncResource

Node.js 可以自动追踪大部分内置异步操作，例如定时器、Promise、文件 I/O。

但如果你封装了自定义异步调度逻辑，例如任务队列、线程池回调、事件桥接，就可能需要手动告诉 Node.js：这个回调属于某个异步资源。

### 基本示例

```js
const { AsyncResource } = require("node:async_hooks");

class TaskResource extends AsyncResource {
  constructor() {
    super("TaskResource");
  }

  run(callback) {
    this.runInAsyncScope(callback);
    this.emitDestroy();
  }
}

const task = new TaskResource();

task.run(() => {
  console.log("run task");
});
```

`runInAsyncScope` 会在该异步资源的上下文中执行回调。

### 常见场景

- 自定义任务队列。
- 封装原生插件或线程池回调。
- 需要配合 `AsyncLocalStorage` 保持请求上下文。
- 链路追踪和日志上下文传播。

### 和 AsyncLocalStorage 的关系

- `AsyncLocalStorage` 用于保存和读取异步上下文数据。
- `AsyncResource` 用于帮助自定义异步资源正确传播上下文。
- 业务开发通常直接用 `AsyncLocalStorage`，框架和底层库更可能用到 `AsyncResource`。

### 注意事项

- 使用后要在合适时机调用 `emitDestroy()`，避免资源追踪信息长期保留。
- 不要为了普通 Promise 或定时器滥用它。
- 它更偏底层能力，面试中重点说明使用场景和上下文传播问题。
:::

## 32、Node.js 中 crypto 模块常见用途有哪些
`crypto` 是 Node.js 内置加密模块，常用于哈希、签名、随机数生成、密码存储和数据加解密。

::: details 详情
### 哈希摘要

```js
const crypto = require("node:crypto");

const hash = crypto
  .createHash("sha256")
  .update("hello")
  .digest("hex");

console.log(hash);
```

哈希常用于文件完整性校验、缓存 key 和内容摘要。

### 生成随机值

```js
const token = crypto.randomBytes(32).toString("hex");
```

`randomBytes` 适合生成验证码种子、token、盐值等安全随机数据。

### HMAC 签名

```js
const sign = crypto
  .createHmac("sha256", "secret")
  .update("payload")
  .digest("hex");
```

HMAC 常用于接口签名、Webhook 验签和防篡改校验。

### 密码存储

密码不应该直接用普通哈希存储，应使用带盐的慢哈希算法，例如 `scrypt`、`bcrypt`、`argon2`。

```js
crypto.scrypt("password", "salt", 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString("hex"));
});
```

### 注意事项

- 不要自己设计加密算法。
- 密码不能明文存储，也不应只做一次普通 SHA 哈希。
- 随机数要使用 `crypto.randomBytes`，不要用 `Math.random` 生成安全 token。
- 密钥要放在安全配置或密钥管理服务中，不要提交到代码仓库。
:::

## 33、Node.js 服务如何做优雅关闭
优雅关闭是指服务收到退出信号后，不再接收新请求，同时等待正在处理的请求、数据库连接和后台任务安全结束。

::: details 详情
### 为什么需要优雅关闭

如果服务直接退出，可能导致：

- 正在处理的请求中断。
- 数据库事务未完成。
- 日志或监控数据未写入。
- 消息队列任务处理一半。
- 负载均衡仍把流量打到即将退出的实例。

### 监听退出信号

```js
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.log("start graceful shutdown");
}
```

容器、进程管理器或用户中断通常会发送这些信号。

### 关闭 HTTP 服务

```js
const server = app.listen(3000);

function shutdown() {
  server.close(() => {
    console.log("http server closed");
    process.exit(0);
  });
}
```

`server.close()` 会停止接收新连接，并等待已有连接结束。

### 还需要处理什么

- 关闭数据库连接池。
- 停止消费消息队列。
- 等待后台任务完成或安全中断。
- 刷新日志和监控上报。
- 设置最大等待时间，避免永远无法退出。

### 注意事项

- 不要一收到信号就立刻 `process.exit()`。
- 优雅关闭要配合负载均衡摘流。
- Kubernetes 场景要结合 `preStop`、探针和 `terminationGracePeriodSeconds`。
- 关闭流程要能重复调用，避免多个信号导致重复清理。
:::

## 34、Node.js 中 EventEmitter 的 MaxListenersExceededWarning 是什么
`MaxListenersExceededWarning` 是 `EventEmitter` 在同一个事件上注册过多监听器时给出的告警，通常提示可能存在监听器没有及时移除导致的内存泄漏风险。

::: details 详情
### 为什么会出现

Node.js 默认同一个事件最多建议注册 `10` 个监听器。超过这个数量时不会阻止程序运行，但会输出警告：

```txt
MaxListenersExceededWarning: Possible EventEmitter memory leak detected
```

这并不一定代表已经泄漏，但说明需要检查监听器生命周期。

### 常见原因

- 在请求处理函数中反复注册全局事件监听。
- 组件或连接关闭后没有移除监听器。
- 重试、定时任务或热更新逻辑重复绑定。
- 多个模块共享同一个 emitter，但缺少统一管理。

### 如何排查

```js
emitter.listenerCount("message");
emitter.listeners("message");
```

也可以启动时加上：

```bash
node --trace-warnings app.js
```

这样能看到告警产生的调用栈。

### 如何处理

- 确认监听器是否应该注册多次。
- 使用 `once` 处理只需要执行一次的事件。
- 在资源释放时调用 `off` 或 `removeListener`。
- 对长期共享的 emitter 统一封装注册和清理逻辑。

### 注意事项

- 不要一看到告警就盲目调大 `setMaxListeners`。
- 如果业务确实需要很多监听器，可以合理设置上限，但仍要解释原因。
- 监听器闭包可能持有大对象、请求上下文或连接对象，长期不释放会放大内存问题。
:::

## 35、Node.js 中 module.exports 和 exports 有什么区别
`module.exports` 是 CommonJS 模块真正导出的对象，`exports` 只是指向 `module.exports` 的一个初始引用。

::: details 详情
### 基本关系

Node.js 在执行模块时，大致会把代码包一层函数：

```js
(function (exports, require, module, __filename, __dirname) {
  // 模块代码
});
```

初始情况下：

```js
exports === module.exports; // true
```

### 正确写法

给导出对象添加属性时，两者效果类似：

```js
exports.foo = function () {};
module.exports.bar = function () {};
```

最终 `require()` 拿到的是 `module.exports`。

### 常见错误

```js
exports = function () {};
```

这样只是让局部变量 `exports` 指向了一个新函数，并没有改变 `module.exports`，所以不会按预期导出。

如果要整体导出一个函数或类，应写：

```js
module.exports = function () {};
```

### 混用注意

```js
exports.name = "utils";
module.exports = function () {};
```

一旦重新给 `module.exports` 赋值，之前挂在 `exports` 上的属性通常就不会再被导出。

### 注意事项

- 只添加多个属性时，可以用 `exports.xxx`。
- 整体导出函数、类或对象时，使用 `module.exports = ...`。
- 不要在同一个模块里随意混用两种风格，容易造成导出结果不符合预期。
:::

## 36、package.json 中 exports 字段有什么作用
`exports` 字段用于声明一个 npm 包允许外部导入哪些入口，以及在不同环境下使用哪些构建产物。它可以限制包的公开 API，并支持条件导出。

::: details 详情
### 基本用法

```json
{
  "name": "my-lib",
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js"
  }
}
```

使用方可以这样导入：

```js
import lib from "my-lib";
import utils from "my-lib/utils";
```

没有在 `exports` 中声明的内部路径，通常不能再被直接导入。

### 条件导出

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

这样 ESM、CommonJS 和 TypeScript 类型可以使用不同入口。

### 解决什么问题

- 明确包的公共入口。
- 避免用户依赖内部文件路径。
- 同时支持 ESM 和 CommonJS。
- 为浏览器、Node、开发环境、生产环境提供不同产物。

### 和 main/module 的关系

- `main` 是传统 CommonJS 入口。
- `module` 常用于声明 ESM 入口，但不是 Node 标准字段。
- `exports` 更严格，也更适合现代包入口管理。

### 注意事项

- 配置 `exports` 后，未声明的深层路径可能会变成不可访问。
- 发布库时要把类型文件、子路径入口一起声明清楚。
- 条件导出的顺序和兼容性要谨慎测试。
- 它和 CommonJS 模块里的 `exports` 变量不是同一个概念。
:::

## 37、Node.js 中 process.cwd() 和 __dirname 有什么区别
`process.cwd()` 返回当前进程的工作目录，`__dirname` 返回当前模块文件所在目录。两者都和路径有关，但语义完全不同。

::: details 详情
### process.cwd()

```js
console.log(process.cwd());
```

`process.cwd()` 取决于你从哪个目录启动 Node 进程。

例如：

```bash
cd /app
node src/index.js
```

此时 `process.cwd()` 通常是 `/app`。

### __dirname

```js
console.log(__dirname);
```

`__dirname` 是当前模块文件所在目录。

如果当前文件是：

```txt
/app/src/index.js
```

那么 `__dirname` 通常是：

```txt
/app/src
```

### 典型区别

```js
const path = require("path");

const configFromCwd = path.resolve(process.cwd(), "config.json");
const fileFromModule = path.resolve(__dirname, "template.html");
```

- 项目根目录下的配置文件，常用 `process.cwd()`。
- 和当前模块放在一起的模板、静态文件，常用 `__dirname`。

### ESM 中的 __dirname

ESM 模块中没有内置 `__dirname`，可以这样模拟：

```js
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 注意事项

- 启动目录变化会影响 `process.cwd()`。
- `__dirname` 和代码文件位置绑定，更适合引用模块相邻资源。
- CLI 工具通常以 `process.cwd()` 作为用户执行命令的项目目录。
- 不要用字符串拼接路径，优先使用 `path.resolve` 或 `path.join`。
:::

## 38、Node.js 服务如何设计接口限流
接口限流用于限制单位时间内的请求数量，防止暴力破解、恶意刷接口、突发流量打垮服务，也可以保护下游数据库和第三方服务。

::: details 详情
### 常见限流维度

- IP。
- 用户 ID。
- 租户 ID。
- API Key。
- 接口路径。
- 设备或会话。

实际项目中通常会组合多个维度，例如“用户 + 接口”。

### 固定窗口

```txt
每个 IP 每分钟最多 100 次
```

实现简单，但窗口边界可能出现瞬时流量翻倍。

### 滑动窗口

滑动窗口会按更细粒度统计最近一段时间内的请求数量，比固定窗口更平滑。

适合登录、短信验证码、开放 API 等场景。

### 令牌桶

令牌按固定速率生成，请求需要先拿到令牌。

特点：

- 可以限制平均速率。
- 允许一定突发流量。
- 适合大多数接口限流。

### 分布式限流

多实例部署时，限流状态不能只放在单进程内存中，通常会使用：

- Redis。
- 网关。
- Nginx。
- API Gateway。

Redis 中可以结合 Lua 脚本保证计数和过期操作的原子性。

### 返回设计

被限流时通常返回：

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

前端可以根据 `Retry-After` 做等待提示或延迟重试。

### 注意事项

- 限流要区分普通接口和高风险接口。
- 登录、验证码、支付、AI 调用等高成本接口要更严格。
- 内部服务调用也可能需要限流，避免雪崩。
- 限流日志要记录命中规则，方便排查误伤。
:::

## 39、Node.js 服务中数据库连接池有什么作用
数据库连接池用于复用数据库连接，避免每个请求都新建和销毁连接，从而降低连接开销、控制并发数量并提升服务稳定性。

::: details 详情
### 为什么需要连接池

如果每次请求都新建数据库连接，会带来：

- 连接建立耗时高。
- 数据库连接数快速上涨。
- 高并发时数据库被打满。
- 连接泄漏后难以恢复。

连接池会提前或按需创建一批连接，请求使用完后归还到池中。

### 常见配置

- `min`：最小连接数。
- `max`：最大连接数。
- `idleTimeout`：空闲连接多久释放。
- `connectionTimeout`：获取连接的超时时间。
- `acquireTimeout`：等待可用连接的超时时间。

### 使用原则

```js
const pool = createPool({
  max: 20,
  idleTimeoutMillis: 30000,
});
```

连接池大小不是越大越好，要结合：

- 数据库最大连接数。
- 服务实例数量。
- 单个请求查询数量。
- 查询耗时。
- 下游承载能力。

### 连接释放

如果手动获取连接，要确保释放：

```js
const client = await pool.connect();

try {
  await client.query("select 1");
} finally {
  client.release();
}
```

否则可能导致连接被占满，后续请求一直等待。

### 优雅关闭

服务退出时要关闭连接池：

```js
await pool.end();
```

这可以避免进程退出时仍有连接、事务或查询未正确结束。

### 注意事项

- 慢查询会长期占用连接池资源。
- 连接池耗尽通常表现为接口变慢或超时。
- 要监控活跃连接数、等待队列、查询耗时和错误率。
- 多实例部署时，总连接数要按实例数一起计算。
:::

## 40、Node.js 服务中如何理解缓存穿透、击穿和雪崩
缓存穿透、缓存击穿和缓存雪崩都是缓存系统中常见的稳定性问题，通常发生在 Redis 缓存和数据库之间。

::: details 详情
### 缓存穿透

缓存穿透是指请求的数据在缓存和数据库中都不存在，请求每次都会打到数据库。

常见原因：

- 恶意请求不存在的 ID。
- 查询参数不合法。
- 业务中大量访问空数据。

解决方案：

- 参数校验。
- 缓存空值，并设置较短过期时间。
- 使用布隆过滤器提前判断数据是否可能存在。

### 缓存击穿

缓存击穿是指某个热点 key 过期后，大量请求同时打到数据库。

解决方案：

- 热点 key 设置更长过期时间。
- 加互斥锁，只允许一个请求回源。
- 后台异步刷新热点缓存。
- 使用逻辑过期，先返回旧值再异步更新。

### 缓存雪崩

缓存雪崩是指大量 key 在同一时间过期，导致请求集中打到数据库。

解决方案：

- 给过期时间增加随机抖动。
- 分批预热缓存。
- 多级缓存。
- 限流、降级和熔断。

### Node 服务中的注意点

- 不要在缓存失效时让所有请求同时查询数据库。
- Redis 异常时要有降级策略。
- 缓存 key 要规范，避免高基数和脏 key。
- 关键缓存要监控命中率、回源量、热点 key 和 Redis 延迟。

### 总结

- 穿透：查不存在的数据。
- 击穿：热点 key 失效。
- 雪崩：大量 key 同时失效。
:::

## 41、Node.js 服务为什么要使用消息队列
消息队列常用于异步处理、削峰填谷、系统解耦和失败重试。Node.js 服务中常见的队列方案包括 RabbitMQ、Kafka、Redis Stream、BullMQ 等。

::: details 详情
### 适合场景

- 下单后异步发送短信、邮件、站内信。
- 图片、视频、报表等耗时任务后台处理。
- 高峰流量先写入队列，消费者按能力处理。
- 多个系统之间通过消息解耦。
- 失败任务延迟重试。

### 基本流程

```txt
生产者 -> 消息队列 -> 消费者 -> 业务处理
```

生产者只负责把任务投递出去，消费者异步消费消息并执行真正的业务逻辑。

### 需要关注的问题

- 消息是否可能重复消费。
- 消息是否可能丢失。
- 消费失败如何重试。
- 重试多次失败后是否进入死信队列。
- 消费速度跟不上时如何扩容或限流。
- 消息顺序是否有业务要求。

### 幂等处理

消费者必须考虑重复消息，例如通过业务唯一键、任务表状态、数据库唯一索引保证幂等。

```txt
orderId + eventType
```

可以作为某类订单事件的幂等键。

### 面试回答要点

- 队列不是为了让任务“消失”，而是把同步压力转为可控的异步处理。
- 使用队列后要补上监控、告警、重试、死信和幂等。
- 对强实时接口不能随便改成异步，否则会影响用户反馈。
- 队列积压本质上说明生产速度超过消费能力，需要扩容、限流或降级。
:::

## 42、Node.js 服务如何实现 Redis 分布式锁
Redis 分布式锁常用于多实例服务中控制同一时刻只有一个实例执行某段逻辑，例如定时任务、库存扣减、缓存回源等。

::: details 详情
### 加锁思路

核心是使用 `SET key value NX PX ttl`：

```txt
SET lock:order:1 random-value NX PX 30000
```

- `NX`：key 不存在时才设置成功。
- `PX`：设置过期时间，避免进程异常导致死锁。
- `value`：使用随机值标识锁的持有者。

### 释放锁

释放锁时不能简单 `DEL key`，必须确认当前锁是自己持有的，否则可能误删别人的锁。

通常使用 Lua 脚本保证比较和删除的原子性：

```lua
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
else
  return 0
end
```

### 需要考虑的问题

- 锁过期时间太短，业务没执行完锁就释放。
- 锁过期时间太长，异常后恢复慢。
- 加锁失败后是否重试。
- 是否需要自动续期。
- Redis 主从切换时是否可能出现锁一致性问题。

### 适合场景

- 防止多个实例重复执行定时任务。
- 热点缓存回源时只允许一个实例查数据库。
- 短时间互斥的业务操作。

### 注意事项

- 分布式锁不是事务，不能替代数据库唯一约束和业务幂等。
- 高价值一致性场景要谨慎评估 Redis 锁的可靠性。
- 锁的粒度要尽量小，避免影响并发。
- 加锁、执行、解锁都要有日志和监控，方便排查死锁和竞争。
:::

## 43、Node.js 事件循环有哪些阶段
Node.js 事件循环用于协调定时器、IO 回调、异步任务和微任务执行。理解事件循环有助于分析异步代码顺序和性能问题。

::: details 详情
### 主要阶段

Node.js 事件循环主要包括：

- timers：执行 `setTimeout`、`setInterval` 到期回调。
- pending callbacks：执行部分系统操作延迟到下一轮的回调。
- idle、prepare：Node 内部使用。
- poll：处理新的 IO 事件。
- check：执行 `setImmediate` 回调。
- close callbacks：执行关闭事件回调。

### 微任务

微任务通常包括：

- `process.nextTick`
- Promise microtask
- `queueMicrotask`

在 Node.js 中，`process.nextTick` 的优先级通常高于 Promise 微任务。

### setTimeout 和 setImmediate

`setTimeout(fn, 0)` 和 `setImmediate(fn)` 的执行顺序不总是固定，取决于它们被调用的位置。

如果在 IO 回调中调用，`setImmediate` 通常会先执行。

### 面试重点

常被问到：

- 宏任务和微任务的区别。
- `process.nextTick` 和 Promise 的执行顺序。
- `setTimeout` 和 `setImmediate` 的区别。
- CPU 密集任务为什么会阻塞事件循环。

### 注意事项

- 不要在主线程执行长时间 CPU 任务。
- 大量 `process.nextTick` 可能饿死事件循环。
- 排查延迟时可以关注 event loop delay。
- Node 版本差异可能影响部分细节，回答时要说明上下文。
:::

## 44、Node.js 中 cluster 有什么作用
`cluster` 模块用于创建多个 Node.js 工作进程，让应用更好地利用多核 CPU。它适合提升多进程并发处理能力，但不能解决单个请求的 CPU 阻塞问题。

::: details 详情
### 为什么需要 cluster

Node.js 单个进程通常只运行在一个主线程上。

在多核机器上，如果只启动一个进程，无法充分利用所有 CPU 核心。

`cluster` 可以让主进程 fork 多个 worker 进程，由多个进程共同处理请求。

### 基本结构

```js
const cluster = require("cluster");
const http = require("http");
const os = require("os");

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  http.createServer((req, res) => {
    res.end("ok");
  }).listen(3000);
}
```

### 进程管理

生产环境还需要考虑：

- worker 异常退出后自动拉起。
- 优雅关闭。
- 日志聚合。
- 进程间通信。
- 滚动重启。

很多项目会使用 PM2、容器编排或 Kubernetes 管理多进程和实例。

### 注意事项

- worker 之间内存不共享，不能直接共享本地变量状态。
- 会话状态应放到 Redis、数据库或外部存储。
- CPU 密集任务仍可能阻塞当前 worker。
- 多进程会放大数据库连接数、缓存连接数和定时任务重复执行问题。
:::

## 45、Node.js 服务内存泄漏如何排查
Node.js 内存泄漏通常表现为进程内存持续上涨、GC 后无法回落，最终触发 OOM 或响应变慢。排查重点是找到被长期引用且不再需要的对象。

::: details 详情
### 常见原因

- 全局 Map 或数组无限增长。
- 缓存没有容量和过期策略。
- 定时器没有清理。
- 事件监听重复注册。
- 闭包引用大对象。
- 请求上下文被长期保存。
- Stream 或连接没有正确关闭。

### 观察指标

可以关注：

- RSS。
- heapUsed。
- heapTotal。
- external memory。
- GC 次数和耗时。
- event loop delay。

如果 heapUsed 持续增长，通常更需要关注 JavaScript 堆对象。

### 排查工具

常见工具包括：

- Chrome DevTools inspect。
- heap snapshot。
- `process.memoryUsage()`。
- clinic.js。
- heapdump。
- APM 监控。

可以在稳定复现路径下抓多次 heap snapshot，对比哪些对象数量持续增加。

### 处理思路

- 给缓存设置最大容量和过期时间。
- 组件或请求结束时清理监听器、定时器和连接。
- 避免把请求对象、响应对象长期保存。
- 对大对象及时释放引用。
- 对高风险代码增加压测和监控。

### 注意事项

- 内存上涨不一定都是泄漏，可能是正常缓存或 V8 堆扩容。
- 排查要看 GC 后是否能回落。
- 生产抓快照可能影响性能，要谨慎操作。
- 修复后要用压测或长时间运行验证趋势。
:::

## 46、Node.js 如何处理大文件上传
Node.js 处理大文件上传时要避免一次性把文件读入内存，应该使用流式处理、大小限制、类型校验和临时文件管理。

::: details 详情
### 为什么不能一次性读入内存

如果把大文件全部读入内存，多个并发上传可能快速打满进程内存，导致 GC 压力增大甚至 OOM。

Node.js 更适合使用 Stream 边读边写。

### 流式上传

常见处理方式：

- 请求体以流方式读取。
- 写入临时文件或对象存储。
- 计算 hash 或校验信息。
- 上传完成后再入库记录。

例如可以使用 `busboy`、`multer` 等库处理 multipart 上传。

### 分片上传

大文件通常会设计分片上传：

- 前端把文件切成多个 chunk。
- 每个 chunk 单独上传。
- 服务端记录上传进度。
- 全部分片完成后合并。
- 支持失败重试和断点续传。

### 安全校验

需要校验：

- 文件大小。
- 文件类型。
- 文件名安全。
- 用户权限。
- 上传频率。
- 存储路径。

前端校验只能改善体验，服务端必须重新校验。

### 注意事项

- 上传临时文件要定期清理。
- 文件服务最好和应用服务隔离。
- 对象存储直传可以降低应用服务器压力。
- 上传接口要设置超时、限流和并发控制。
:::

## 47、Node.js 服务如何实现 JWT 鉴权
JWT 鉴权通常用于无状态接口认证。服务端在登录成功后签发 Token，客户端后续请求携带 Token，服务端验证签名和声明后识别用户身份。

::: details 详情
### 基本流程

常见流程：

1. 用户登录，服务端校验账号密码。
2. 服务端签发 JWT。
3. 客户端把 JWT 放在请求头中。
4. 服务端中间件验证 JWT。
5. 验证通过后把用户信息挂到请求上下文。

请求头示例：

```http
Authorization: Bearer <token>
```

### Token 内容

JWT 通常包含：

- `sub`：用户标识。
- `exp`：过期时间。
- `iat`：签发时间。
- `aud`：目标受众。
- `iss`：签发方。
- 角色或权限信息。

不要把密码、手机号、身份证号等敏感信息放入 JWT。

### 中间件职责

鉴权中间件通常负责：

- 提取 Token。
- 校验签名。
- 校验过期时间。
- 校验签发方和受众。
- 查询用户是否仍有效。
- 注入用户上下文。

### 注意事项

- JWT 一旦签发，在过期前默认难以主动失效。
- 高安全场景可以配合黑名单、短过期时间和 Refresh Token。
- 密钥要定期轮换，并妥善存储。
- 权限变更后要考虑旧 Token 的权限滞后问题。
:::
