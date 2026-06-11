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

## 7、图的 BFS 和 DFS 有什么区别
BFS 和 DFS 都是图遍历算法。BFS 按层扩展，常用队列；DFS 沿着一条路径深入，常用递归或栈。

::: details 详情
### BFS

BFS 适合按距离逐层搜索，常用于无权图最短路径。

```js
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];

  while (queue.length) {
    const node = queue.shift();
    result.push(node);

    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return result;
}
```

### DFS

DFS 适合搜索路径、连通性、拓扑相关问题。

```js
function dfs(graph, node, visited = new Set(), result = []) {
  if (visited.has(node)) return result;

  visited.add(node);
  result.push(node);

  for (const next of graph[node]) {
    dfs(graph, next, visited, result);
  }

  return result;
}
```

### 区别

- BFS 使用队列，按层遍历。
- DFS 使用递归或栈，沿路径深入。
- BFS 更适合最短路径。
- DFS 更适合回溯、连通性和路径搜索。

### 注意事项

- 图可能有环，必须记录 visited。
- 邻接表适合稀疏图。
- 邻接矩阵适合节点数较少或稠密图。
- BFS 中 `queue.shift()` 在 JS 中可能有性能问题，大数据量可用指针优化。
:::

## 8、拓扑排序适合解决什么问题
拓扑排序用于处理有向无环图中的依赖顺序问题，例如课程先修关系、任务编排、构建依赖等。

::: details 详情
### 适合场景

如果任务之间存在依赖：

```txt
A 必须在 B 之前完成
B 必须在 C 之前完成
```

就可以把任务抽象成有向图，再使用拓扑排序得到合法执行顺序。

### 入度法

常见做法是统计每个节点的入度：

- 入度为 0 的节点表示没有前置依赖。
- 把入度为 0 的节点放入队列。
- 每取出一个节点，就删除它指向的边。
- 如果新节点入度变为 0，就加入队列。

### 示例代码

```js
function topoSort(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  const result = [];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    result.push(current);

    for (const next of graph[current]) {
      indegree[next]--;
      if (indegree[next] === 0) queue.push(next);
    }
  }

  return result.length === numCourses ? result : [];
}
```

### 如何判断有环

如果最终结果数量小于节点总数，说明存在环，无法完成拓扑排序。

### 面试要点

- 拓扑排序只适用于有向无环图。
- 入度为 0 的节点可以作为起点。
- 可以用来判断依赖关系是否存在循环。
- 构建系统、课程表、任务调度都常用这个模型。
:::

## 9、并查集适合解决什么问题
并查集用于维护元素之间的连通关系，支持快速合并集合和查询两个元素是否属于同一个集合。

::: details 详情
### 适合场景

并查集常用于：

- 判断图中连通分量。
- 朋友圈问题。
- 岛屿合并。
- 最小生成树 Kruskal 算法。
- 判断无向图是否有环。

### 核心操作

并查集有两个核心操作：

- `find(x)`：查找元素所在集合的代表节点。
- `union(a, b)`：合并两个元素所在集合。

### 基础实现

```js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA !== rootB) {
      this.parent[rootB] = rootA;
    }
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}
```

### 路径压缩

`find` 中这行代码是路径压缩：

```js
this.parent[x] = this.find(this.parent[x]);
```

它会让节点直接指向根节点，从而降低后续查询成本。

### 面试要点

- 并查集适合动态连通性问题。
- `find` 用于找代表节点。
- `union` 用于合并集合。
- 路径压缩和按秩合并可以提升性能。
:::

## 10、贪心算法适合解决什么问题
贪心算法是在每一步都选择当前看起来最优的方案，希望最终得到全局最优解。它适合具有贪心选择性质和最优子结构的问题。

::: details 详情
### 核心思想

贪心算法通常不回头修改之前的选择。

例如每次选择当前最优：

```txt
当前最优选择 -> 缩小问题规模 -> 继续选择
```

### 典型场景

- 区间调度。
- 分发饼干。
- 买卖股票。
- 跳跃游戏。
- 合并区间。
- 最小生成树中的部分算法。

### 示例：分发饼干

每个孩子有胃口值，每块饼干有大小。尽量满足更多孩子。

```js
function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let child = 0;
  let cookie = 0;

  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      child++;
    }
    cookie++;
  }

  return child;
}
```

思路是用最小能满足当前孩子的饼干，避免浪费大饼干。

### 贪心和动态规划的区别

- 贪心每一步只做局部最优选择。
- 动态规划通常会保留多个状态，比较不同选择。
- 贪心更快、更省空间，但必须证明局部最优能推出全局最优。

### 面试要点

- 不是所有“看起来可以贪心”的题都能贪心。
- 要能解释为什么当前选择不会影响最终最优。
- 排序经常是贪心题的第一步。
- 如果无法证明贪心正确性，可以考虑动态规划。
:::

## 11、LRU 缓存如何实现
LRU 是最近最少使用缓存策略，当缓存容量满时，淘汰最近最久未使用的数据。常见实现是哈希表加双向链表。

::: details 详情
### 为什么需要哈希表和链表

LRU 需要同时满足：

- `get` 快速读取。
- `put` 快速写入。
- 快速把节点移动到最近使用位置。
- 快速删除最久未使用节点。

哈希表负责 `O(1)` 查找，双向链表负责 `O(1)` 移动和删除。

### 简化实现

在 JavaScript 中，`Map` 会保持插入顺序，可以用它写简化版：

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    const value = this.cache.get(key);
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
```

### 执行过程

- 访问某个 key 后，把它移动到最新位置。
- 插入新 key 后，如果超过容量，删除最旧 key。
- `Map` 的第一个 key 就是最久未使用的 key。

### 面试要点

- 标准 LRU 通常用哈希表加双向链表。
- JS 中可以用 `Map` 简化实现。
- 关键是访问后要更新最近使用顺序。
- 容量满时淘汰最久未使用数据。
:::

## 12、快速排序的思路是什么
快速排序是一种分治排序算法，通过选择基准值，把数组划分为小于基准和大于基准的两部分，再递归排序。

::: details 详情
### 基本思路

快速排序流程：

```txt
选择 pivot
-> 分区
-> 递归排序左区间
-> 递归排序右区间
```

### 简化实现

```js
function quickSort(nums) {
  if (nums.length <= 1) return nums;

  const pivot = nums[0];
  const left = [];
  const right = [];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < pivot) {
      left.push(nums[i]);
    } else {
      right.push(nums[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

这个版本好理解，但会创建额外数组。

### 原地分区

面试中也常要求原地分区，核心是用左右指针交换元素，减少额外空间。

### 复杂度

- 平均时间复杂度：`O(n log n)`。
- 最坏时间复杂度：`O(n^2)`。
- 平均空间复杂度：取决于递归深度，通常是 `O(log n)`。

### 最坏情况

如果每次 pivot 都选到最大或最小值，分区会极不均衡，退化为 `O(n^2)`。

可以通过随机选择 pivot 或三数取中降低风险。

### 面试要点

- 快排核心是分治和分区。
- pivot 选择会影响性能。
- 原地快排更节省空间。
- 快排通常不是稳定排序。
:::

## 13、前缀和适合解决什么问题
前缀和适合解决数组区间求和、子数组统计和二维矩阵区域求和等问题。它的核心思想是用预处理换查询效率。

::: details 详情
### 一维前缀和

给定数组：

```js
const nums = [1, 2, 3, 4];
```

可以构造前缀和：

```js
const prefix = [0];

for (let i = 0; i < nums.length; i++) {
  prefix[i + 1] = prefix[i] + nums[i];
}
```

区间 `[left, right]` 的和为：

```js
prefix[right + 1] - prefix[left]
```

### 为什么多放一个 0

`prefix[0] = 0` 可以统一处理从下标 0 开始的区间，避免额外判断。

例如 `[0, 2]` 的和：

```js
prefix[3] - prefix[0]
```

### 常见变形

前缀和常和哈希表结合，用于统计满足条件的子数组个数。

例如判断是否存在区间和为 `k`：

```txt
prefix[j] - prefix[i] = k
```

可以转化为查找之前是否出现过 `prefix[j] - k`。

### 注意事项

- 前缀和适合区间查询多、原数组变化少的场景。
- 如果数组频繁更新，可以考虑树状数组或线段树。
- 注意下标边界和是否使用左闭右闭区间。
- 数值较大时要注意溢出问题。
:::
