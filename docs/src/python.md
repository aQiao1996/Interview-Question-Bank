---
outline: [2, 6]
---

# Python

## 1、Python 中 list 和 tuple 有什么区别
`list` 和 `tuple` 都可以存储有序元素，核心区别是 `list` 可变，`tuple` 不可变。

::: details 详情
### 基本区别

```python
nums = [1, 2, 3]
nums.append(4)

point = (10, 20)
```

`list` 可以增删改元素，`tuple` 创建后不能修改元素数量和位置。

### 使用场景

- `list` 适合需要动态增删改的数据。
- `tuple` 适合表达固定结构的数据，例如坐标、配置项、函数多返回值。
- `tuple` 可以作为字典 key 的前提是内部元素也都可哈希。

### 性能和语义

`tuple` 通常比 `list` 更轻量，也表达“这组数据不应该被修改”的语义。

```python
location = ("成都", 30.67, 104.06)
```

这种固定结构用 `tuple` 比 `list` 更清晰。

### 注意事项

- `tuple` 不可变指的是容器结构不可变，不代表内部引用对象一定不可变。
- 如果 `tuple` 中包含 `list`，这个内部 `list` 仍然可以被修改。
- 面试中要同时说明“可变性、语义、可哈希、使用场景”。
:::

## 2、Python 中浅拷贝和深拷贝有什么区别
浅拷贝只复制最外层容器，内部嵌套对象仍然共享引用；深拷贝会递归复制内部对象。

::: details 详情
### 浅拷贝

```python
import copy

a = [[1, 2], [3, 4]]
b = copy.copy(a)

b[0].append(99)

print(a)  # [[1, 2, 99], [3, 4]]
```

`a` 和 `b` 是两个不同的外层列表，但内部子列表仍然是同一个对象。

### 深拷贝

```python
import copy

a = [[1, 2], [3, 4]]
b = copy.deepcopy(a)

b[0].append(99)

print(a)  # [[1, 2], [3, 4]]
print(b)  # [[1, 2, 99], [3, 4]]
```

`deepcopy` 会递归复制嵌套对象。

### 常见浅拷贝方式

```python
b = a.copy()
b = list(a)
b = a[:]
```

这些方式都只复制一层。

### 注意事项

- 不含嵌套可变对象时，浅拷贝通常够用。
- 嵌套结构复杂时，深拷贝更安全，但成本更高。
- 自定义对象可以通过 `__copy__`、`__deepcopy__` 控制拷贝行为。
:::

## 3、Python 函数默认参数为什么不要使用可变对象
Python 函数默认参数只会在函数定义时计算一次，如果默认值是可变对象，多次调用会共享同一个对象。

::: details 详情
### 问题示例

```python
def add_item(item, result=[]):
    result.append(item)
    return result

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2]
print(add_item(3))  # [1, 2, 3]
```

很多人以为每次调用都会创建新的空列表，但实际不是。

### 原因

默认参数在函数定义阶段创建，并保存在函数对象上：

```python
print(add_item.__defaults__)
```

所以后续每次调用都会复用同一个默认列表。

### 正确写法

```python
def add_item(item, result=None):
    if result is None:
        result = []

    result.append(item)
    return result
```

用 `None` 作为默认值，在函数内部创建新的列表。

### 适用范围

需要避免的默认参数包括：

- `list`
- `dict`
- `set`
- 自定义可变对象

### 注意事项

- 不可变对象如 `None`、`str`、`int`、`tuple` 通常没这个问题。
- 有时可以故意利用这个特性做缓存，但业务代码中不建议这样写。
- 面试中要说清“定义时计算一次”和“共享同一个可变对象”。
:::
