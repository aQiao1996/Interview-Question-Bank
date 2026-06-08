# 数据结构与算法

这里用于整理数据结构与算法相关面试题，后续按数组、链表、栈队列、树、图、动态规划、贪心、二分、滑动窗口等方向追加。

## 1、两数之和如何用哈希表优化
两数之和要求在数组中找到两个数，使它们的和等于目标值。暴力做法是双重循环，时间复杂度是 `O(n^2)`；哈希表可以把复杂度优化到 `O(n)`。

::: details 详情
### 思路

遍历数组时，对当前值 `num`，计算它需要的另一个数：

```txt
need = target - num
```

如果 `need` 已经在哈希表中，说明找到了答案；否则把当前数和下标存入哈希表。

### 代码示例

```js
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];

    if (map.has(need)) {
      return [map.get(need), i];
    }

    map.set(nums[i], i);
  }

  return [];
}
```

### 为什么先查再存

如果先存当前值，再查 `need`，当 `target = nums[i] * 2` 时，可能会错误地使用同一个元素两次。

### 复杂度

- 时间复杂度：`O(n)`。
- 空间复杂度：`O(n)`。

### 面试要点

- 哈希表用空间换时间。
- 要注意重复元素。
- 返回值可能是下标，也可能是具体数值，要看题目要求。
- 如果数组有序，也可以考虑双指针。
:::

## 2、滑动窗口适合解决什么问题
滑动窗口适合解决数组或字符串中“连续区间”的问题，尤其是求最长、最短、满足条件的子数组或子串。

::: details 详情
### 基本思想

滑动窗口通常使用两个指针：

```txt
left  表示窗口左边界
right 表示窗口右边界
```

右指针不断扩展窗口，窗口不满足条件时移动左指针收缩窗口。

### 典型场景

- 最长无重复子串。
- 长度最小的子数组。
- 固定长度窗口最大值。
- 字符串排列包含判断。
- 连续区间计数。

### 示例：最长无重复子串

```js
function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0;
  let ans = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }

    set.add(s[right]);
    ans = Math.max(ans, right - left + 1);
  }

  return ans;
}
```

### 为什么比暴力更快

暴力枚举所有子串通常是 `O(n^2)`。滑动窗口中每个元素最多进窗口一次、出窗口一次，所以常见复杂度是 `O(n)`。

### 面试要点

- 先判断题目是否要求连续区间。
- 明确窗口内维护什么状态。
- 明确什么时候扩展，什么时候收缩。
- 注意更新答案的时机。
:::

## 3、二分查找适合解决什么问题
二分查找适合在有序数据或具有单调性的答案空间中快速定位目标。它的核心是每次排除一半搜索范围。

::: details 详情
### 基础二分

在有序数组中查找目标值：

```js
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

### 适合场景

- 有序数组查找。
- 查找第一个或最后一个满足条件的位置。
- 查找插入位置。
- 在答案空间中找最小可行值或最大可行值。

### 答案二分

有些题不是直接在数组里二分，而是在答案范围里二分。

例如“最小满足条件的速度”“最大可分配数量”等，只要答案具有单调性，就可以二分。

### 常见边界问题

- `left <= right` 还是 `left < right`。
- `right = mid` 还是 `right = mid - 1`。
- 查找的是目标值、左边界还是右边界。
- `mid` 计算要避免溢出，推荐 `left + Math.floor((right - left) / 2)`。

### 面试要点

- 二分的前提是有序或单调。
- 每轮必须缩小搜索区间，否则会死循环。
- 先定义清楚区间含义，再写边界更新。
- 边界类二分要用几个简单样例手动验证。
:::

## 4、二叉树遍历有哪些方式
二叉树遍历是树结构面试的基础，常见方式包括前序遍历、中序遍历、后序遍历和层序遍历。

::: details 详情
### 前序遍历

访问顺序：

```txt
根 -> 左 -> 右
```

```js
function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}
```

### 中序遍历

访问顺序：

```txt
左 -> 根 -> 右
```

二叉搜索树的中序遍历结果是有序的。

```js
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}
```

### 后序遍历

访问顺序：

```txt
左 -> 右 -> 根
```

后序遍历适合需要先处理子树再处理根节点的场景，例如计算树高度、释放资源。

### 层序遍历

层序遍历通常使用队列：

```js
function levelOrder(root) {
  if (!root) return [];

  const queue = [root];
  const result = [];

  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}
```

### 面试要点

- DFS 常用递归或栈。
- BFS 常用队列。
- 二叉搜索树中序遍历有序。
- 递归题要明确终止条件和返回值。
:::

## 5、动态规划如何解决爬楼梯问题
爬楼梯是动态规划入门题。假设每次可以爬 1 阶或 2 阶，问爬到第 `n` 阶有多少种方法。

::: details 详情
### 状态定义

定义：

```txt
dp[i] 表示爬到第 i 阶的方法数
```

到达第 `i` 阶，最后一步可能来自：

- 第 `i - 1` 阶，再爬 1 阶。
- 第 `i - 2` 阶，再爬 2 阶。

所以状态转移方程是：

```txt
dp[i] = dp[i - 1] + dp[i - 2]
```

### 基础实现

```js
function climbStairs(n) {
  if (n <= 2) return n;

  const dp = Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}
```

### 空间优化

因为每次只依赖前两个状态，可以用两个变量优化空间：

```js
function climbStairs(n) {
  if (n <= 2) return n;

  let prev2 = 1;
  let prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

### 面试要点

- 动态规划要先定义状态。
- 再找状态转移方程。
- 明确初始值。
- 如果只依赖有限历史状态，可以做空间优化。
:::

## 6、如何反转单链表
反转单链表是链表题中的基础题，核心是逐个改变节点的 `next` 指向，让链表方向反过来。

::: details 详情
### 迭代思路

使用三个指针：

- `prev`：当前节点反转后应该指向的前一个节点。
- `current`：当前正在处理的节点。
- `next`：提前保存后续节点，避免链表断开后找不到后面。

### 代码示例

```js
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}
```

### 过程示意

```txt
1 -> 2 -> 3 -> null

null <- 1 <- 2 <- 3
```

最后 `prev` 指向新的头节点。

### 递归写法

```js
function reverseList(head) {
  if (!head || !head.next) return head;

  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}
```

### 面试要点

- 链表题要特别注意保存 `next`。
- 反转后旧头节点要指向 `null`。
- 迭代写法空间复杂度是 `O(1)`。
- 递归写法更简洁，但有调用栈开销。
:::
