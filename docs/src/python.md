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

## 4、Python 中迭代器和生成器有什么区别
迭代器是实现了迭代协议的对象，生成器是一种更方便创建迭代器的方式，通常通过 `yield` 定义。

::: details 详情
### 迭代器协议

一个对象如果实现了 `__iter__` 和 `__next__`，就可以作为迭代器：

```python
class Counter:
    def __init__(self, max_value):
        self.current = 0
        self.max_value = max_value

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.max_value:
            raise StopIteration
        self.current += 1
        return self.current
```

### 生成器

使用 `yield` 可以更简单地创建迭代器：

```python
def counter(max_value):
    current = 0
    while current < max_value:
        current += 1
        yield current
```

调用生成器函数不会立即执行函数体，而是返回一个生成器对象。

### 主要区别

- 迭代器是概念和协议。
- 生成器是创建迭代器的一种语法工具。
- 生成器会自动保存函数执行状态。
- 生成器适合惰性计算和处理大数据流。

### 常见场景

- 逐行读取大文件。
- 分批处理数据。
- 构建数据流管道。
- 避免一次性把大量数据加载到内存。

### 注意事项

- 生成器通常只能顺序消费一次。
- 消费完后再次遍历不会重新产生数据，需要重新创建生成器。
- 面试中可以从“迭代协议、yield、惰性求值、内存优势”几个角度回答。
:::

## 5、Python 装饰器是什么，如何实现
装饰器本质上是一个接收函数并返回新函数的高阶函数，用于在不修改原函数代码的情况下增强功能。

::: details 详情
### 基本示例

```python
def log(func):
    def wrapper(*args, **kwargs):
        print(f"call {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log
def hello(name):
    return f"hello {name}"
```

`@log` 等价于：

```python
hello = log(hello)
```

### 保留原函数信息

普通装饰器会让函数名变成 `wrapper`，可以使用 `functools.wraps`：

```python
from functools import wraps

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"call {func.__name__}")
        return func(*args, **kwargs)
    return wrapper
```

### 带参数的装饰器

```python
def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator
```

使用：

```python
@repeat(3)
def say():
    print("hi")
```

### 常见场景

- 日志记录。
- 权限校验。
- 性能统计。
- 缓存。
- 重试。
- 事务管理。

### 注意事项

- 记得用 `functools.wraps` 保留元信息。
- 装饰器不要隐藏过多业务逻辑，否则可读性会下降。
- 多个装饰器叠加时要注意执行顺序。
:::

## 6、Python 中 GIL 是什么，有什么影响
GIL（Global Interpreter Lock，全局解释器锁）是 CPython 解释器中的一把全局锁，它使同一时刻只有一个线程执行 Python 字节码。

::: details 详情
### 为什么有 GIL

CPython 使用引用计数管理对象生命周期。GIL 简化了对象内存管理和解释器内部状态的线程安全问题。

它是 CPython 的实现细节，不是 Python 语言标准本身。

### 对多线程的影响

对于 CPU 密集型任务，多线程通常不能真正并行执行 Python 字节码：

```python
import threading

def cpu_task():
    total = 0
    for i in range(10_000_000):
        total += i

threads = [threading.Thread(target=cpu_task) for _ in range(4)]
```

这种场景可能无法随着线程数增加明显变快。

### I/O 密集型任务

对于网络请求、文件读写、数据库访问等 I/O 密集型任务，多线程仍然有价值。

线程在等待 I/O 时会释放执行机会，其他线程可以继续运行。

### 如何处理 CPU 密集任务

常见方案：

- 使用 `multiprocessing` 多进程。
- 使用 C 扩展或 NumPy 等释放 GIL 的库。
- 把 CPU 任务交给任务队列或独立服务。
- 使用适合并行计算的运行时或语言。

### 注意事项

- GIL 不等于 Python 线程没有用。
- GIL 主要影响 CPU 密集型多线程并行。
- 多进程可以利用多核，但进程间通信成本更高。
- 面试中要区分 CPython、线程并发、CPU 并行和 I/O 并发。
:::
