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

## 4、手写柯理化函数
- 柯理化函数：柯理化函数是指将一个多参数函数转换为多个单参数函数的技术。
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

// 测试柯理化函数
const testFn = currying((a, b, c) => {
  console.log("柯理化函数触发", a, b, c);
});

// 模拟连续触发事件
testFn(1)(2)(3); // 柯理化函数触发 1 2 3
testFn(1, 2)(3); // 柯理化函数触发 1 2 3
testFn(1, 2, 3); // 柯理化函数触发 1 2 3
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
- 代码实现：
```js
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

