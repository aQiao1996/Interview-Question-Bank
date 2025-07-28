---
lang: zh-CN
title: code
description: 手写题
---

# code

## 1、根据以下代码进行对应操作
- `tree` 是一个层级不固定的树形结构，每个节点包含 `key`、`count` 和 `children` 属性。编写一段代码，递归计算每个节点的 `count` 值，`count` 值表示以该节点为根的子树中包含的节点总数（包含当前节点自身）。
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