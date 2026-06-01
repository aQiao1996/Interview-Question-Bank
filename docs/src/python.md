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

## 12、Python 中 asyncio 的核心概念有哪些
`asyncio` 是 Python 标准库中的异步 I/O 框架，核心是事件循环、协程、任务和 await。

::: details 详情
### 协程函数

使用 `async def` 定义协程函数：

```python
async def fetch_data():
    return "data"
```

调用协程函数不会立即执行，而是返回一个协程对象。

### await

`await` 用于等待一个可等待对象完成：

```python
async def main():
    result = await fetch_data()
    print(result)
```

### 事件循环

事件循环负责调度协程执行：

```python
import asyncio

asyncio.run(main())
```

`asyncio.run` 会创建事件循环、运行协程，并在结束后关闭事件循环。

### Task

`Task` 用于把协程包装成可调度任务：

```python
async def main():
    task1 = asyncio.create_task(fetch_data())
    task2 = asyncio.create_task(fetch_data())

    result1 = await task1
    result2 = await task2
```

这样多个 I/O 任务可以并发等待。

### gather

```python
results = await asyncio.gather(
    fetch_data(),
    fetch_data(),
)
```

`gather` 常用于并发执行多个异步任务。

### 注意事项

- `asyncio` 适合 I/O 密集型任务，不适合直接加速 CPU 密集计算。
- 异步代码中不要调用阻塞函数，否则会阻塞整个事件循环。
- 需要使用支持异步的库，例如异步 HTTP 客户端、异步数据库驱动。
:::

## 13、Python 中 dataclass 有什么作用
`dataclass` 用于简化数据类定义，自动生成 `__init__`、`__repr__`、`__eq__` 等方法。

::: details 详情
### 基本用法

```python
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    age: int = 18
```

创建对象：

```python
user = User(id=1, name="Tom")
print(user)
```

`dataclass` 会自动生成构造函数和友好的打印结果。

### 默认值

```python
@dataclass
class User:
    name: str
    tags: list[str]
```

如果字段是可变对象，不要直接使用 `[]` 作为默认值，应使用 `field(default_factory=...)`：

```python
from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    tags: list[str] = field(default_factory=list)
```

### 常见参数

```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int
```

- `frozen=True`：创建不可变对象。
- `order=True`：生成排序比较方法。
- `eq=True`：生成相等比较方法，默认开启。

### 适合场景

- DTO。
- 配置对象。
- 简单值对象。
- 函数返回结构化数据。

### 注意事项

- `dataclass` 主要适合承载数据，不应塞入过多业务逻辑。
- 可变默认值要使用 `default_factory`。
- 如果需要数据校验，可以考虑 Pydantic 等库。
:::

## 14、Python 中 property 有什么作用
`property` 可以把方法包装成属性访问形式，用于控制属性读取、设置和删除逻辑。

::: details 详情
### 基本用法

```python
class User:
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
```

使用时像访问普通属性：

```python
user = User("Tom", "Smith")
print(user.full_name)
```

### setter

可以定义属性赋值逻辑：

```python
class User:
    def __init__(self):
        self._age = 0

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("age must be positive")
        self._age = value
```

### 解决什么问题

- 保持属性访问语法简洁。
- 在读取属性时动态计算。
- 在设置属性时做校验。
- 在不破坏调用方代码的情况下，把普通属性改成计算属性。

### 常见场景

- 只读属性。
- 派生属性。
- 参数校验。
- 延迟计算。

### 注意事项

- `property` 中不要做过重计算，否则调用方可能误以为只是普通属性访问。
- 内部真实字段通常使用 `_name` 这类约定命名。
- 复杂缓存计算可以结合 `functools.cached_property`。
:::

## 15、Python 异常处理有哪些最佳实践
Python 异常处理用于捕获和处理运行时错误，好的异常处理应明确、可恢复、可排查，而不是简单吞掉错误。

::: details 详情
### 基本结构

```python
try:
    result = int("abc")
except ValueError as error:
    print(f"invalid value: {error}")
else:
    print("success")
finally:
    print("cleanup")
```

- `except`：捕获异常。
- `else`：没有异常时执行。
- `finally`：无论是否异常都会执行。

### 捕获具体异常

不要随便写：

```python
try:
    do_something()
except Exception:
    pass
```

更推荐捕获明确异常：

```python
try:
    value = int(text)
except ValueError:
    value = 0
```

### 保留异常上下文

重新抛出异常时，可以使用 `raise ... from ...`：

```python
try:
    load_config()
except FileNotFoundError as error:
    raise RuntimeError("config file missing") from error
```

这样可以保留原始异常链。

### 常见实践

- 只捕获自己能处理的异常。
- 不要用异常控制普通流程。
- 日志中记录关键上下文。
- 清理资源优先使用 `with`。
- 自定义异常要表达业务含义。

### 注意事项

- 空 `except` 会隐藏真实问题。
- 捕获范围过大容易掩盖 bug。
- `finally` 中也可能抛异常，要谨慎写清理逻辑。
:::

## 16、Python 中闭包和 nonlocal 有什么作用
闭包是指内部函数引用了外部函数作用域中的变量，即使外部函数已经执行结束，这些变量仍然会被保留。

::: details 详情
### 闭包示例

```python
def make_counter():
    count = 0

    def counter():
        return count

    return counter
```

`counter` 引用了外层函数中的 `count`，这就是闭包。

### nonlocal

如果内部函数想修改外层作用域中的变量，需要使用 `nonlocal`：

```python
def make_counter():
    count = 0

    def counter():
        nonlocal count
        count += 1
        return count

    return counter

c = make_counter()
print(c())  # 1
print(c())  # 2
```

没有 `nonlocal` 时，`count += 1` 会被认为是在内部函数中创建局部变量。

### global 和 nonlocal 的区别

- `global` 声明变量来自模块全局作用域。
- `nonlocal` 声明变量来自外层非全局作用域。

```python
name = "global"

def outer():
    name = "outer"

    def inner():
        nonlocal name
        name = "inner"
```

### 常见场景

- 装饰器。
- 函数工厂。
- 保存私有状态。
- 简单计数器或缓存。

### 注意事项

- 闭包会延长变量生命周期。
- 滥用闭包会让状态来源不直观。
- 复杂状态管理可以考虑类，而不是过度使用闭包。
:::

## 17、Python 的模块导入机制是怎样的
Python 导入模块时，会按照搜索路径查找模块，加载后执行模块顶层代码，并把模块对象缓存到 `sys.modules` 中。

::: details 详情
### 基本流程

执行：

```python
import math
```

大致流程是：

- 检查 `sys.modules` 中是否已有缓存。
- 根据 `sys.path` 查找模块。
- 加载模块文件。
- 执行模块顶层代码。
- 把模块对象放入当前命名空间。

### sys.path

`sys.path` 决定模块查找路径：

```python
import sys

print(sys.path)
```

通常包括：

- 当前脚本所在目录。
- 环境变量 `PYTHONPATH`。
- 标准库路径。
- 第三方包路径。

### 模块缓存

模块第一次导入后会缓存：

```python
import sys

print(sys.modules["math"])
```

后续再次 `import` 同一模块时，通常不会重复执行模块顶层代码。

### import 和 from import

```python
import os
from os import path
```

- `import os` 绑定模块名。
- `from os import path` 把模块中的某个对象绑定到当前命名空间。

### 注意事项

- 模块顶层代码会在首次导入时执行，因此不要在顶层写重副作用逻辑。
- 避免模块文件名和标准库重名，例如 `json.py`、`sys.py`。
- 循环导入可能导致部分初始化的问题，应通过拆分模块或延迟导入解决。
:::

## 18、Python 类型注解有什么作用
类型注解用于描述变量、函数参数和返回值的类型，帮助提升可读性、静态检查和 IDE 提示能力。

::: details 详情
### 基本用法

```python
def add(a: int, b: int) -> int:
    return a + b
```

类型注解不会在运行时自动强制校验类型，它主要服务于静态分析和代码理解。

### 变量注解

```python
name: str = "Tom"
age: int = 18
tags: list[str] = ["python", "backend"]
```

### Optional 和 Union

```python
from typing import Optional, Union

def find_user(user_id: int) -> Optional[str]:
    return None

def parse(value: Union[str, int]) -> str:
    return str(value)
```

在较新的 Python 版本中，也可以写：

```python
def parse(value: str | int) -> str:
    return str(value)
```

### 常见工具

- mypy。
- pyright。
- pylance。
- IDE 自动补全和类型提示。

### 好处

- 函数签名更清晰。
- 降低维护成本。
- 更早发现类型错误。
- 方便大型项目协作。
- 改善编辑器提示和重构体验。

### 注意事项

- 类型注解不是运行时校验。
- 动态数据仍需要显式校验，例如接口入参、配置文件、用户输入。
- 类型写得过于复杂会降低可读性，应平衡精确性和维护性。
:::

## 19、Python 项目为什么需要虚拟环境
虚拟环境用于为不同项目隔离 Python 解释器环境和第三方依赖，避免项目之间依赖版本冲突。

::: details 详情
### 为什么需要虚拟环境

如果所有项目共用全局环境，容易出现：

- 项目 A 需要 Django 3，项目 B 需要 Django 5。
- 升级一个包后影响其他项目。
- 部署环境和本地环境不一致。
- 依赖来源和版本难以追踪。

虚拟环境可以让每个项目有独立依赖目录。

### venv

创建虚拟环境：

```bash
python -m venv .venv
```

激活虚拟环境：

```bash
source .venv/bin/activate
```

安装依赖：

```bash
pip install requests
```

### requirements.txt

导出依赖：

```bash
pip freeze > requirements.txt
```

安装依赖：

```bash
pip install -r requirements.txt
```

### 常见工具

- `venv`：标准库自带，轻量。
- `pip`：包安装工具。
- `pip-tools`：依赖锁定。
- `poetry`：依赖管理和打包。
- `uv`：更快的 Python 包管理工具。

### 注意事项

- 不要把 `.venv` 提交到代码仓库。
- 应提交依赖声明文件，例如 `requirements.txt`、`pyproject.toml`、锁文件。
- 团队要统一 Python 版本和依赖管理工具。
:::

## 20、Python 性能优化有哪些常见方向
Python 性能优化应先定位瓶颈，再选择合适手段，不能只凭感觉改代码。

::: details 详情
### 先定位瓶颈

常用工具：

- `timeit`：测量小段代码耗时。
- `cProfile`：分析函数调用耗时。
- `line_profiler`：按行分析性能。
- 日志和监控：观察线上真实耗时。

示例：

```bash
python -m cProfile app.py
```

### 算法和数据结构

优先检查算法复杂度：

- 是否有不必要的嵌套循环。
- 是否可以用 `dict`、`set` 加速查找。
- 是否重复计算了相同结果。
- 是否一次性加载了过多数据。

### I/O 优化

对于 I/O 密集任务：

- 使用连接池。
- 批量读写。
- 减少网络请求次数。
- 使用异步 I/O 或多线程。
- 增加缓存。

### CPU 密集优化

对于计算密集任务：

- 使用更高效算法。
- 使用 NumPy、Pandas 等底层优化库。
- 使用多进程。
- 把热点逻辑用 Cython、Rust 或 C 扩展实现。

### 内存优化

- 使用生成器避免一次性加载大列表。
- 及时释放不再使用的大对象。
- 避免无意义拷贝。
- 大数据处理尽量分批进行。

### 注意事项

- 不要过早优化，先确认瓶颈。
- 优化后要用数据验证效果。
- 可读性和性能要平衡。
- 线上性能问题要结合真实流量、数据规模和环境分析。
:::

## 21、Python 中列表推导式和生成器表达式有什么区别
列表推导式会立即生成完整列表，生成器表达式会惰性地产生元素，更节省内存。

::: details 详情
### 列表推导式

```python
nums = [x * x for x in range(10)]
```

执行后会立即创建一个完整列表。

适合：

- 数据量不大。
- 后续需要多次遍历。
- 需要列表方法或索引访问。

### 生成器表达式

```python
nums = (x * x for x in range(10))
```

生成器表达式不会一次性生成所有结果，而是在迭代时按需计算。

适合：

- 数据量很大。
- 只需要遍历一次。
- 希望减少内存占用。

### 内存差异

```python
import sys

list_data = [x for x in range(10000)]
gen_data = (x for x in range(10000))

print(sys.getsizeof(list_data))
print(sys.getsizeof(gen_data))
```

生成器对象本身通常更小。

### 注意事项

- 生成器只能顺序消费，消费完后不能自动重来。
- 列表推导式更直观，适合小数据。
- 处理大文件、大数据流时优先考虑生成器表达式。
:::

## 22、Python 中 __new__ 和 __init__ 有什么区别
`__new__` 负责创建对象，`__init__` 负责初始化对象。对象会先经过 `__new__`，再进入 `__init__`。

::: details 详情
### 执行顺序

```python
class User:
    def __new__(cls, *args, **kwargs):
        print("__new__")
        return super().__new__(cls)

    def __init__(self, name):
        print("__init__")
        self.name = name

user = User("Tom")
```

输出顺序：

```txt
__new__
__init__
```

### __new__

`__new__` 是静态方法风格，接收类 `cls`，需要返回一个实例对象。

常见用途：

- 控制对象创建。
- 实现单例模式。
- 创建不可变对象的子类。

### __init__

`__init__` 接收已经创建好的实例 `self`，用于初始化属性。

```python
def __init__(self, name):
    self.name = name
```

它不能返回非 `None` 的值。

### 单例示例

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

### 注意事项

- 普通业务类通常只需要写 `__init__`。
- 如果 `__new__` 不返回当前类实例，`__init__` 可能不会按预期执行。
- 面试中要说清“创建对象”和“初始化对象”的区别。
:::

## 23、Python 中 MRO 是什么
MRO（Method Resolution Order）是方法解析顺序，用于决定多继承场景下属性和方法的查找顺序。

::: details 详情
### 基本示例

```python
class A:
    def say(self):
        print("A")

class B(A):
    pass

class C(A):
    def say(self):
        print("C")

class D(B, C):
    pass

d = D()
d.say()
```

Python 会按 `D` 的 MRO 顺序查找 `say` 方法。

### 查看 MRO

```python
print(D.__mro__)
print(D.mro())
```

输出类似：

```txt
(D, B, C, A, object)
```

### C3 线性化

Python 使用 C3 线性化算法计算 MRO，目标是：

- 子类优先于父类。
- 保持父类声明顺序。
- 同一个类只出现一次。
- 避免菱形继承中重复调用。

### super 的关系

`super()` 并不是简单调用父类，而是按 MRO 找下一个类：

```python
class B(A):
    def say(self):
        super().say()
```

在多继承中，`super()` 的行为依赖当前类的 MRO。

### 注意事项

- 多继承容易增加理解成本，应谨慎使用。
- 使用 `super()` 时，各类方法签名最好保持兼容。
- 面试中重点说明 MRO 查找顺序、C3 线性化和 `super()` 的关系。
:::

## 24、Python 中 __slots__ 有什么作用
`__slots__` 用于限制实例可以拥有的属性，并减少每个实例默认 `__dict__` 带来的内存开销。

::: details 详情
### 默认对象属性

普通 Python 对象通常通过 `__dict__` 保存实例属性：

```python
class User:
    pass

user = User()
user.name = "Tom"
print(user.__dict__)
```

这种方式灵活，但每个实例都维护字典，会有额外内存开销。

### 使用 __slots__

```python
class User:
    __slots__ = ("name", "age")

    def __init__(self, name, age):
        self.name = name
        self.age = age
```

此时实例只能设置 `name` 和 `age`：

```python
user = User("Tom", 18)
user.email = "tom@example.com"  # AttributeError
```

### 优点

- 限制属性集合。
- 减少内存占用。
- 避免动态添加拼写错误的属性。

### 适合场景

- 大量创建的小对象。
- 对象字段固定。
- 对内存敏感的数据结构。

### 注意事项

- 使用 `__slots__` 会降低动态扩展属性的灵活性。
- 继承场景下，父类和子类的 `__slots__` 都需要考虑。
- 如果需要弱引用，需要在 `__slots__` 中加入 `"__weakref__"`。
- 普通业务对象不一定需要使用它，先确认内存瓶颈。
:::

## 25、Python 的垃圾回收机制是怎样的
Python 的内存管理以引用计数为主，并结合分代垃圾回收处理循环引用问题。

::: details 详情
### 引用计数

每个对象都会记录有多少引用指向它。当引用计数变为 0 时，对象可以被立即回收。

```python
import sys

a = []
print(sys.getrefcount(a))
```

`getrefcount` 本身会临时增加一次引用，所以结果通常比直觉多 1。

### 循环引用

引用计数无法解决循环引用：

```python
a = []
b = []
a.append(b)
b.append(a)
```

即使外部不再引用 `a` 和 `b`，它们内部仍然互相引用。

### 分代垃圾回收

Python 使用 `gc` 模块处理循环引用：

```python
import gc

gc.collect()
```

分代思想是：存活越久的对象越不容易被频繁扫描。

### 常见内存泄漏原因

- 全局变量长期持有大对象。
- 缓存没有淘汰策略。
- 闭包或回调持有引用。
- 循环引用中包含复杂清理逻辑。
- 连接、文件等资源没有及时释放。

### 注意事项

- 大多数业务代码不需要手动调用 `gc.collect()`。
- 资源释放应优先使用 `with` 或显式关闭。
- 排查内存问题要关注引用链，而不是只看对象数量。
- 引用计数是 CPython 主要机制，其他 Python 实现可能不同。
:::

## 26、Python 中 functools.lru_cache 有什么作用
`functools.lru_cache` 用于缓存函数调用结果，避免相同参数重复计算。

::: details 详情
### 基本用法

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

相同参数再次调用时，会直接返回缓存结果。

### maxsize

```python
@lru_cache(maxsize=256)
def query(key):
    return expensive_query(key)
```

`maxsize` 表示最多缓存多少个结果。超过后会按照 LRU（最近最少使用）策略淘汰。

如果设置为 `None`，缓存不限制大小：

```python
@lru_cache(maxsize=None)
def calc(n):
    return n * n
```

### 查看缓存信息

```python
print(fib.cache_info())
```

可以看到命中次数、未命中次数、最大缓存数量和当前缓存数量。

### 清空缓存

```python
fib.cache_clear()
```

### 适合场景

- 纯函数。
- 重复调用频繁。
- 计算成本较高。
- 参数空间有限。

### 注意事项

- 函数参数必须可哈希。
- 不适合缓存依赖外部状态或实时数据的函数。
- 缓存会占用内存，要设置合理 `maxsize`。
- 方法使用 `lru_cache` 时，`self` 也会参与缓存 key。
:::

## 27、Python 中 pytest 的 fixture 有什么作用
`fixture` 是 pytest 中用于准备测试依赖的机制，可以复用测试数据、初始化资源，并在测试结束后清理资源。

::: details 详情
### 基本用法

```python
import pytest

@pytest.fixture
def user():
    return {"name": "Tom", "age": 18}

def test_user_name(user):
    assert user["name"] == "Tom"
```

测试函数参数名和 fixture 名一致时，pytest 会自动注入。

### 资源清理

可以使用 `yield` 在测试后执行清理：

```python
@pytest.fixture
def db_connection():
    conn = create_connection()
    yield conn
    conn.close()
```

`yield` 前是准备逻辑，`yield` 后是清理逻辑。

### scope

fixture 可以设置作用域：

```python
@pytest.fixture(scope="module")
def config():
    return load_config()
```

常见作用域：

- `function`：每个测试函数执行一次，默认值。
- `class`：每个测试类执行一次。
- `module`：每个模块执行一次。
- `session`：整个测试会话执行一次。

### 常见场景

- 构造测试数据。
- 初始化数据库连接。
- 创建临时文件。
- Mock 外部服务。
- 登录测试用户。

### 注意事项

- fixture 不要做过多隐式逻辑，否则测试可读性会下降。
- 作用域越大，越要注意测试之间的状态污染。
- 需要清理的资源优先使用 `yield fixture`。
:::

## 28、Flask 和 FastAPI 有什么区别
Flask 和 FastAPI 都是 Python Web 框架，Flask 更轻量灵活，FastAPI 更强调类型注解、异步能力和自动 API 文档。

::: details 详情
### Flask

Flask 是经典轻量 Web 框架：

```python
from flask import Flask

app = Flask(__name__)

@app.route("/hello")
def hello():
    return {"message": "hello"}
```

特点：

- 简单灵活。
- 生态成熟。
- 扩展丰富。
- 默认同步模型。

### FastAPI

FastAPI 基于类型注解和 ASGI：

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def hello():
    return {"message": "hello"}
```

特点：

- 使用类型注解做参数校验和文档生成。
- 原生支持异步接口。
- 自动生成 OpenAPI 和 Swagger 文档。
- 适合构建 API 服务。

### 主要区别

| 对比项 | Flask | FastAPI |
| --- | --- | --- |
| 协议基础 | WSGI | ASGI |
| 异步支持 | 不是核心优势 | 原生支持 |
| 参数校验 | 依赖扩展或手写 | 基于类型和 Pydantic |
| 自动文档 | 依赖扩展 | 内置支持 |
| 生态成熟度 | 更老牌成熟 | 现代 API 生态强 |

### 如何选择

- 小型服务、传统 Web、已有 Flask 生态：可以选 Flask。
- 新 API 服务、强类型校验、异步场景：可以选 FastAPI。
- 团队已有技术栈和运维经验也很重要。

### 注意事项

- FastAPI 支持 async 不代表所有代码都会自动变快。
- 如果内部仍调用阻塞库，异步接口也可能阻塞事件循环。
- Flask 简单不代表不适合生产，关键看工程化和扩展设计。
:::

## 29、SQLAlchemy 中 ORM 和 Core 有什么区别
SQLAlchemy 既提供 ORM，也提供 Core。ORM 通过对象映射数据库表，Core 更接近 SQL 表达式和数据库操作本身。

::: details 详情
### ORM

ORM 把数据库表映射为 Python 类：

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
```

使用时操作对象：

```python
user = User(name="Tom")
session.add(user)
session.commit()
```

### Core

Core 使用 SQL 表达式构建查询：

```python
from sqlalchemy import table, column, select

users = table("users", column("id"), column("name"))
stmt = select(users).where(users.c.name == "Tom")
```

它更接近 SQL，也更适合精细控制查询。

### 主要区别

| 对比项 | ORM | Core |
| --- | --- | --- |
| 抽象层级 | 更高 | 更接近 SQL |
| 操作方式 | 操作对象 | 操作表和表达式 |
| 适合场景 | 业务实体建模 | 复杂 SQL、批量操作 |
| 学习成本 | 对业务更友好 | 对 SQL 更友好 |

### 如何选择

- 常规业务增删改查：ORM 更方便。
- 复杂查询、批量写入、性能敏感 SQL：Core 更直接。
- 实际项目中经常混用 ORM 和 Core。

### 注意事项

- ORM 不等于不用理解 SQL。
- 要注意 N+1 查询问题。
- 事务边界、连接池和 session 生命周期要设计清楚。
:::

## 30、Python Web 项目中数据库事务如何管理
数据库事务用于保证一组数据库操作要么全部成功，要么全部回滚，避免数据处于不一致状态。

::: details 详情
### 事务基本概念

事务通常关注 ACID：

- 原子性：要么全部成功，要么全部失败。
- 一致性：事务前后数据满足约束。
- 隔离性：并发事务之间互不干扰或按隔离级别控制。
- 持久性：提交后数据持久保存。

### SQLAlchemy 示例

```python
try:
    user = User(name="Tom")
    session.add(user)
    session.commit()
except Exception:
    session.rollback()
    raise
finally:
    session.close()
```

出现异常时要回滚事务，最后释放 session。

### 上下文管理

更推荐使用上下文管理封装事务边界：

```python
with Session() as session:
    with session.begin():
        session.add(User(name="Tom"))
```

代码块正常结束时提交，异常时回滚。

### Web 请求中的事务

常见做法：

- 每个请求创建独立 session。
- 请求成功后提交。
- 请求异常时回滚。
- 请求结束后关闭 session。

### 注意事项

- 不要把 session 作为全局对象共享。
- 事务范围不要过大，否则会增加锁竞争。
- 外部接口调用不应长时间放在数据库事务中。
- 后台任务和 Web 请求要分别管理 session 生命周期。
:::

## 31、Celery 在 Python 项目中有什么作用
Celery 是 Python 常用的分布式任务队列，用于把耗时任务从 Web 请求中拆出来异步执行。

::: details 详情
### 解决什么问题

Web 请求中不适合直接执行耗时任务，例如：

- 发送邮件。
- 生成报表。
- 图片处理。
- 文件解析。
- 调用慢速第三方接口。
- 定时任务。

这些任务可以投递到 Celery，由 Worker 异步处理。

### 基本组成

Celery 常见组成：

- Producer：投递任务的一方，通常是 Web 服务。
- Broker：消息中间件，例如 Redis、RabbitMQ。
- Worker：消费并执行任务。
- Result Backend：保存任务结果，可选。

### 简单示例

```python
from celery import Celery

app = Celery("tasks", broker="redis://localhost:6379/0")

@app.task
def send_email(email):
    print(f"send email to {email}")
```

调用：

```python
send_email.delay("tom@example.com")
```

### 常见能力

- 异步任务。
- 定时任务。
- 失败重试。
- 任务队列分组。
- 并发 Worker。
- 任务结果查询。

### 注意事项

- 任务要尽量幂等，避免重试导致重复副作用。
- 长任务要设置超时和重试次数。
- Broker 和 Worker 都需要监控。
- 不要把大对象直接塞进消息，传 ID 更稳妥。
:::

## 32、Pydantic 在 Python 项目中有什么作用
Pydantic 用于基于类型注解进行数据校验、解析和序列化，常见于 FastAPI 请求参数、配置和数据模型。

::: details 详情
### 基本用法

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    age: int = 18

user = User(id="1", name="Tom")
print(user.id)  # 1
```

Pydantic 会根据类型注解解析和校验数据。

### 数据校验

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(min_length=1)
    age: int = Field(ge=0, le=120)
```

字段不符合规则时会抛出校验错误。

### 常见场景

- FastAPI 请求体校验。
- 响应数据序列化。
- 配置文件解析。
- 环境变量校验。
- 外部接口数据清洗。

### 和 dataclass 的区别

- `dataclass` 主要是简化数据类定义。
- Pydantic 更强调运行时数据校验和类型转换。
- 外部输入数据更适合用 Pydantic。
- 内部简单数据结构可以用 `dataclass`。

### 注意事项

- 类型转换很方便，但也要注意隐式转换是否符合业务预期。
- Pydantic 版本差异较大，v1 和 v2 的部分 API 不同。
- 不要把复杂业务逻辑都塞进数据模型校验中。
:::
