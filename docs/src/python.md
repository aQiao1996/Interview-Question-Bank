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

## 7、Python 中 is 和 == 有什么区别
`==` 比较两个对象的值是否相等，`is` 比较两个变量是否引用同一个对象。

::: details 详情
### 基本示例

```python
a = [1, 2, 3]
b = [1, 2, 3]

print(a == b)  # True
print(a is b)  # False
```

两个列表内容相同，所以 `==` 为 `True`；但它们是两个不同对象，所以 `is` 为 `False`。

### None 判断

判断是否为 `None` 时应该使用 `is`：

```python
if value is None:
    pass
```

因为 `None` 是单例对象，使用 `is None` 语义更准确。

### 小整数和字符串驻留

```python
a = 1
b = 1
print(a is b)  # 可能是 True
```

CPython 会缓存小整数和部分字符串，因此某些情况下 `is` 看起来也能比较值，但不要依赖这个行为。

### 自定义对象

`==` 会调用对象的 `__eq__` 方法：

```python
class User:
    def __init__(self, id):
        self.id = id

    def __eq__(self, other):
        return isinstance(other, User) and self.id == other.id
```

### 注意事项

- 比较值用 `==`。
- 判断是否同一个对象用 `is`。
- 判断 `None` 用 `is None` 或 `is not None`。
- 不要用 `is` 比较数字、字符串等普通值。
:::

## 8、Python 中 with 语句和上下文管理器是什么
`with` 语句用于管理资源的进入和退出，常见于文件、锁、数据库连接和事务处理。

::: details 详情
### 基本用法

```python
with open("demo.txt", "r", encoding="utf-8") as f:
    content = f.read()
```

离开 `with` 代码块后，文件会自动关闭，即使中间发生异常也会执行清理逻辑。

### 上下文管理器协议

一个对象如果实现了 `__enter__` 和 `__exit__`，就可以作为上下文管理器：

```python
class Resource:
    def __enter__(self):
        print("enter")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("exit")
```

使用：

```python
with Resource() as resource:
    print("using")
```

### __exit__ 的作用

`__exit__` 可以接收异常信息：

- `exc_type`：异常类型。
- `exc_value`：异常对象。
- `traceback`：调用栈信息。

如果 `__exit__` 返回 `True`，异常会被吞掉；一般不建议随便吞异常。

### contextlib

可以用 `contextlib.contextmanager` 简化实现：

```python
from contextlib import contextmanager

@contextmanager
def managed():
    print("enter")
    try:
        yield
    finally:
        print("exit")
```

### 注意事项

- `with` 的核心价值是保证资源释放。
- 文件、锁、连接池、事务都适合上下文管理。
- 不要在 `__exit__` 中静默吞掉重要异常。
:::

## 9、Python 中 *args 和 **kwargs 有什么作用
`*args` 用于接收可变数量的位置参数，`**kwargs` 用于接收可变数量的关键字参数。

::: details 详情
### *args

```python
def add(*args):
    return sum(args)

print(add(1, 2, 3))  # 6
```

函数内部的 `args` 是一个 `tuple`。

### **kwargs

```python
def print_user(**kwargs):
    print(kwargs)

print_user(name="Tom", age=18)
```

函数内部的 `kwargs` 是一个 `dict`。

### 混合使用

参数顺序通常是：

```python
def func(a, b=1, *args, **kwargs):
    pass
```

更完整的顺序可以包含仅限关键字参数：

```python
def func(a, *args, debug=False, **kwargs):
    pass
```

### 参数解包

调用函数时也可以使用 `*` 和 `**` 解包：

```python
def add(a, b):
    return a + b

nums = [1, 2]
print(add(*nums))

data = {"a": 1, "b": 2}
print(add(**data))
```

### 常见场景

- 封装装饰器。
- 转发函数参数。
- 编写通用工具函数。
- 框架回调函数接收扩展参数。

### 注意事项

- `args` 和 `kwargs` 只是约定名称，关键是 `*` 和 `**`。
- 滥用可变参数会让函数签名不清晰。
- 公共 API 应尽量保留明确参数，避免调用方不知道能传什么。
:::

## 10、Python 中 dict 有哪些特点
`dict` 是 Python 中的哈希映射结构，用于存储键值对，具有快速查找、插入和删除能力。

::: details 详情
### 基本用法

```python
user = {
    "name": "Tom",
    "age": 18,
}

print(user["name"])
```

字典通过 key 查找 value，平均时间复杂度通常是 `O(1)`。

### key 的要求

字典的 key 必须是可哈希对象：

```python
data = {
    "name": "Tom",
    1: "one",
    (1, 2): "point",
}
```

`list`、`dict`、`set` 这类可变对象不能作为 key。

### 有序性

Python 3.7 起，`dict` 在语言层面保证保持插入顺序：

```python
data = {}
data["a"] = 1
data["b"] = 2
data["c"] = 3

print(list(data.keys()))  # ['a', 'b', 'c']
```

### 常见方法

```python
user.get("name")
user.keys()
user.values()
user.items()
user.update({"age": 20})
```

### 注意事项

- 使用 `dict[key]` 访问不存在的 key 会抛出 `KeyError`。
- 不确定 key 是否存在时可以用 `get`。
- key 的哈希值和相等性会影响字典行为。
- 字典保持插入顺序不等于按 key 排序。
:::

## 11、Python 中多线程、多进程和协程有什么区别
多线程、多进程和协程都是并发编程方式，区别在于调度方式、资源隔离、开销和适用场景不同。

::: details 详情
### 多线程

线程共享同一个进程的内存空间，创建和切换成本比进程低。

适合 I/O 密集型任务：

- 网络请求。
- 文件读写。
- 数据库访问。

但在 CPython 中，受 GIL 影响，CPU 密集型任务通常不能通过多线程充分利用多核。

### 多进程

进程之间内存隔离，每个进程都有独立的 Python 解释器和 GIL。

适合 CPU 密集型任务：

- 大量计算。
- 图像处理。
- 数据分析。

缺点是进程创建、进程间通信和数据序列化成本更高。

### 协程

协程是在单线程内通过事件循环进行协作式调度，常见于 `asyncio`。

适合大量 I/O 并发：

- 高并发网络请求。
- Web 服务。
- 爬虫。
- 长连接处理。

### 对比表

| 方式 | 适合场景 | 优点 | 缺点 |
| --- | --- | --- | --- |
| 多线程 | I/O 密集 | 写法相对直观，共享内存 | GIL 影响 CPU 并行 |
| 多进程 | CPU 密集 | 可利用多核，隔离性好 | 通信和启动成本高 |
| 协程 | 高并发 I/O | 开销小，并发能力强 | 需要异步生态配合 |

### 注意事项

- CPU 密集优先考虑多进程。
- I/O 密集可以考虑多线程或协程。
- 协程不是自动并行，它仍然运行在线程中。
- 选择并发模型要结合任务类型、依赖库和部署环境。
:::
