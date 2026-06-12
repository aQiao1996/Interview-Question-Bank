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

## 33、Python 中 logging 模块如何使用
`logging` 是 Python 标准库中的日志模块，用于记录程序运行信息、错误和调试数据。

::: details 详情
### 基本用法

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.info("service started")
logging.warning("memory usage high")
logging.error("request failed")
```

### 日志级别

常见级别从低到高：

- `DEBUG`
- `INFO`
- `WARNING`
- `ERROR`
- `CRITICAL`

生产环境通常不会打开过多 `DEBUG` 日志。

### Logger

实际项目中更推荐创建 logger：

```python
import logging

logger = logging.getLogger(__name__)

logger.info("hello")
```

`__name__` 可以帮助按模块区分日志来源。

### Handler 和 Formatter

- Handler 决定日志输出到哪里，例如控制台、文件、日志系统。
- Formatter 决定日志格式。

```python
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")
handler.setFormatter(formatter)
```

### 最佳实践

- 不要用 `print` 替代日志。
- 日志中带上请求 ID、用户 ID、trace ID 等上下文。
- 异常日志使用 `logger.exception` 保留堆栈。
- 避免记录密码、token、身份证等敏感信息。

### 注意事项

- 日志太少不利于排查，太多会增加成本和噪音。
- 线上日志要有轮转、采集和检索方案。
- 多进程场景要注意文件日志并发写入问题。
:::

## 34、Python 中 json 和 pickle 有什么区别
`json` 用于跨语言文本数据交换，`pickle` 用于 Python 对象序列化。两者用途、可读性和安全性都不同。

::: details 详情
### json

```python
import json

data = {"name": "Tom", "age": 18}
text = json.dumps(data, ensure_ascii=False)
obj = json.loads(text)
```

特点：

- 文本格式。
- 跨语言通用。
- 可读性较好。
- 只支持基础数据类型。

### pickle

```python
import pickle

data = {"name": "Tom", "age": 18}
binary = pickle.dumps(data)
obj = pickle.loads(binary)
```

特点：

- 二进制格式。
- Python 专用。
- 可以序列化更多 Python 对象。
- 不适合跨语言数据交换。

### 安全风险

不要反序列化不可信来源的 pickle 数据：

```python
pickle.loads(untrusted_data)  # 危险
```

因为 pickle 反序列化可能执行任意代码。

### 如何选择

- 接口传输、配置文件、跨语言通信：使用 JSON。
- Python 内部临时保存复杂对象：可以考虑 pickle。
- 不可信数据：不要用 pickle 反序列化。

### 注意事项

- JSON 不支持直接序列化 datetime、set、自定义对象，需要转换。
- pickle 和 Python 版本、类定义有耦合。
- 长期存储重要数据时，应优先选择稳定、可迁移的格式。
:::

## 35、Python 中 pathlib 相比 os.path 有什么优势
`pathlib` 提供面向对象的路径处理方式，比传统 `os.path` 更直观、更易组合。

::: details 详情
### 基本用法

```python
from pathlib import Path

path = Path("logs") / "app.log"
print(path)
```

`/` 运算符可以拼接路径，代码可读性很好。

### 读取和写入文件

```python
path = Path("demo.txt")

path.write_text("hello", encoding="utf-8")
content = path.read_text(encoding="utf-8")
```

`pathlib` 把常见文件操作也封装到了 Path 对象上。

### 常见操作

```python
path.exists()
path.is_file()
path.is_dir()
path.parent
path.name
path.suffix
path.stem
```

### 遍历目录

```python
for file in Path(".").glob("*.py"):
    print(file)
```

递归遍历：

```python
for file in Path(".").rglob("*.py"):
    print(file)
```

### 和 os.path 的区别

- `os.path` 主要是函数式 API。
- `pathlib` 是面向对象 API。
- `pathlib` 更容易链式组合路径和文件操作。
- 新项目中通常优先使用 `pathlib`。

### 注意事项

- 需要字符串路径时可以使用 `str(path)`。
- 跨平台路径处理优先使用 `Path`，不要手动拼接 `/` 或 `\\`。
- 老代码中 `os.path` 很常见，实际项目可能两者并存。
:::

## 36、Python 项目如何管理环境变量和配置
Python 项目通常通过环境变量、配置文件和配置类管理不同环境的数据库、密钥、日志级别等配置。

::: details 详情
### 为什么需要配置管理

不同环境配置通常不同：

- 开发环境。
- 测试环境。
- 预发布环境。
- 生产环境。

如果把配置写死在代码里，会导致部署困难，也容易泄露敏感信息。

### 使用环境变量

```python
import os

database_url = os.getenv("DATABASE_URL")
debug = os.getenv("DEBUG", "false") == "true"
```

环境变量适合保存部署相关配置和敏感信息引用。

### .env 文件

开发环境中常使用 `.env` 文件：

```txt
DATABASE_URL=postgresql://localhost/app
DEBUG=true
```

再通过工具加载，例如 `python-dotenv`。

### 配置类

```python
from dataclasses import dataclass

@dataclass
class Settings:
    database_url: str
    debug: bool = False
```

配置集中管理后，业务代码不需要到处读取环境变量。

### 最佳实践

- 敏感信息不要提交到代码仓库。
- 给配置提供明确默认值和校验。
- 启动时检查必需配置是否存在。
- 不同环境使用不同配置来源。
- 配置变更要可追踪。

### 注意事项

- `.env` 适合本地开发，不应直接当作生产密钥管理方案。
- 生产密钥应放在密钥管理服务或部署平台配置中。
- 配置读取最好集中在启动阶段，避免运行中配置状态不一致。
:::

## 37、Python 中如何安全存储用户密码
用户密码不能明文存储，也不应该使用普通哈希直接存储，应使用带盐的慢哈希算法。

::: details 详情
### 为什么不能明文存储

明文存储密码会导致数据库泄露时用户密码直接暴露。

即使只做一次普通哈希，例如 SHA256，也容易被彩虹表或暴力破解攻击。

### 推荐做法

使用专门的密码哈希算法：

- bcrypt。
- argon2。
- scrypt。
- PBKDF2。

这些算法比普通哈希更慢，可以增加破解成本。

### bcrypt 示例

```python
import bcrypt

password = "secret123".encode("utf-8")

hashed = bcrypt.hashpw(password, bcrypt.gensalt())
print(hashed)

is_valid = bcrypt.checkpw(password, hashed)
print(is_valid)
```

`gensalt` 会生成随机盐，盐会包含在最终哈希结果中。

### 登录校验

登录时流程通常是：

```txt
用户输入密码 -> 读取数据库中的密码哈希 -> 使用算法校验 -> 返回结果
```

不要自己手写字符串比较和加密流程。

### 注意事项

- 不要自己设计密码加密算法。
- 不要把密码记录到日志中。
- 密码重置应使用一次性、短有效期 token。
- 可以结合登录失败次数限制、验证码、多因素认证增强安全性。
:::

## 38、Python 中 re 模块常见用法有哪些
`re` 是 Python 标准库中的正则表达式模块，常用于字符串匹配、提取、替换和校验。

::: details 详情
### 基本匹配

```python
import re

text = "email: tom@example.com"
match = re.search(r"\w+@\w+\.\w+", text)

if match:
    print(match.group())
```

`search` 会在字符串中查找第一个匹配项。

### 常见方法

```python
re.match(pattern, text)     # 从开头匹配
re.search(pattern, text)    # 查找任意位置
re.findall(pattern, text)   # 返回所有匹配
re.sub(pattern, repl, text) # 替换
```

### 编译正则

如果正则会被重复使用，可以先编译：

```python
pattern = re.compile(r"\d+")
result = pattern.findall("a1 b22 c333")
```

### 贪婪和非贪婪

默认是贪婪匹配：

```python
re.findall(r"<.*>", "<a>1</a><b>2</b>")
```

非贪婪匹配：

```python
re.findall(r"<.*?>", "<a>1</a><b>2</b>")
```

`*?`、`+?`、`??` 都是非贪婪写法。

### 注意事项

- 正则适合规则明确的文本处理，不适合解析复杂 HTML。
- 用户输入拼进正则时要注意转义。
- 复杂正则可能带来性能问题，甚至造成 ReDoS 风险。
- 可读性差的正则应拆分或添加注释。
:::

## 39、Python 中 set 有什么特点和应用场景
`set` 是无序不重复集合，底层基于哈希表，常用于去重、快速判断存在性和集合运算。

::: details 详情
### 基本用法

```python
nums = {1, 2, 2, 3}
print(nums)  # {1, 2, 3}
```

集合会自动去重。

### 存在性判断

```python
allowed = {"admin", "editor"}

if role in allowed:
    print("ok")
```

`set` 的成员判断平均时间复杂度通常是 `O(1)`，比列表线性查找更适合大量判断。

### 集合运算

```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)  # 并集 {1, 2, 3, 4, 5}
print(a & b)  # 交集 {3}
print(a - b)  # 差集 {1, 2}
print(a ^ b)  # 对称差集 {1, 2, 4, 5}
```

### 常见场景

- 数组去重。
- 权限集合判断。
- 标签交集计算。
- 两批 ID 差异对比。
- 快速过滤已处理数据。

### 注意事项

- `set` 是无序的，不应依赖遍历顺序。
- 元素必须可哈希。
- `list`、`dict`、`set` 不能直接作为 `set` 元素。
- 如果需要不可变集合，可以使用 `frozenset`。
:::

## 40、Python 中 monkey patch 是什么
Monkey patch 是指在运行时动态修改模块、类或对象的属性和方法，以改变其行为。

::: details 详情
### 基本示例

```python
class User:
    def say(self):
        return "hello"

def new_say(self):
    return "hi"

User.say = new_say

user = User()
print(user.say())  # hi
```

这里在运行时替换了 `User.say` 方法。

### 常见场景

- 测试中替换外部依赖。
- 临时修复第三方库行为。
- 框架或插件修改运行时行为。
- Mock 网络请求、数据库调用等。

### 测试中的 monkeypatch

pytest 提供了 `monkeypatch` fixture：

```python
def test_env(monkeypatch):
    monkeypatch.setenv("APP_ENV", "test")
```

测试结束后，pytest 会自动恢复修改。

### 风险

Monkey patch 很灵活，但也有明显风险：

- 修改行为不直观。
- 影响范围可能过大。
- 调试困难。
- 第三方库升级后容易失效。
- 多线程或并发场景下可能引发不可预期问题。

### 注意事项

- 业务代码中应谨慎使用 monkey patch。
- 测试中使用要控制作用范围并自动恢复。
- 如果是长期需求，优先通过继承、组合、配置或明确扩展点实现。
- 面试中可以强调它体现了 Python 的动态特性，但不是常规设计手段。
:::

## 41、Python 中 collections 模块常用工具有哪些
`collections` 模块提供了一组增强型容器类型，常用于计数、分组、队列、不可变记录结构等场景。

::: details 详情
### Counter

`Counter` 用于统计元素出现次数。

```python
from collections import Counter

counter = Counter(["a", "b", "a"])

print(counter["a"])  # 2
print(counter.most_common(1))  # [("a", 2)]
```

常用于词频统计、投票统计、数组元素计数。

### defaultdict

`defaultdict` 可以为不存在的 key 自动创建默认值。

```python
from collections import defaultdict

groups = defaultdict(list)

for name, team in [("Tom", "A"), ("Jerry", "A")]:
    groups[team].append(name)

print(groups["A"])  # ["Tom", "Jerry"]
```

它能减少手动判断 key 是否存在的样板代码。

### deque

`deque` 是双端队列，适合在两端高效插入和删除。

```python
from collections import deque

queue = deque([1, 2, 3])
queue.append(4)
queue.appendleft(0)
queue.pop()
queue.popleft()
```

常用于队列、栈、滑动窗口、BFS。

### namedtuple

`namedtuple` 可以创建轻量级、不可变、带字段名的元组。

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)

print(p.x, p.y)
```

如果需要更强的类型提示和默认值，现代 Python 项目中也常用 `dataclass`。

### OrderedDict

在现代 Python 中，普通 `dict` 已经保持插入顺序，但 `OrderedDict` 仍提供一些和顺序相关的专用能力，例如 `move_to_end()`。

### 注意事项

- 简单字典能解决的问题，不必强行使用 collections。
- `defaultdict` 会在访问不存在 key 时创建默认值，调试时要注意副作用。
- `deque` 适合两端操作，随机索引访问不如 list 直观。
- 新项目中要结合 Python 版本选择普通 `dict`、`dataclass` 或 collections 工具。
:::

## 42、Python 中 contextlib 模块有什么作用
`contextlib` 提供了一组创建和组合上下文管理器的工具，可以简化 `with` 语句相关代码，常用于资源管理、临时状态切换和异常控制。

::: details 详情
### contextmanager

`@contextmanager` 可以用生成器函数创建上下文管理器：

```python
from contextlib import contextmanager

@contextmanager
def open_resource():
    print("enter")
    try:
        yield "resource"
    finally:
        print("exit")

with open_resource() as resource:
    print(resource)
```

`yield` 之前相当于 `__enter__`，`finally` 中的逻辑相当于 `__exit__`。

### suppress

`suppress` 用于忽略指定异常：

```python
from contextlib import suppress

with suppress(FileNotFoundError):
    import os
    os.remove("not-exists.txt")
```

适合明确允许失败且不需要处理的场景。

### closing

`closing` 可以把只有 `close()` 方法的对象包装成上下文管理器：

```python
from contextlib import closing

with closing(resource) as r:
    r.do_something()
```

退出 `with` 时会自动调用 `close()`。

### ExitStack

`ExitStack` 适合动态管理多个上下文管理器：

```python
from contextlib import ExitStack

with ExitStack() as stack:
    files = [
        stack.enter_context(open(path))
        for path in ["a.txt", "b.txt"]
    ]
```

当资源数量运行时才确定时，`ExitStack` 比嵌套多个 `with` 更灵活。

### 注意事项

- `suppress` 不要滥用，否则会隐藏真实错误。
- `@contextmanager` 中要用 `try/finally` 保证资源释放。
- 上下文管理器适合管理生命周期明确的资源，例如文件、锁、连接和临时配置。
:::

## 43、Python asyncio 中如何取消任务
在 `asyncio` 中，可以通过 `task.cancel()` 请求取消任务。取消不是强制杀死线程，而是在协程的下一个挂起点抛出 `CancelledError`，由协程自己完成清理。

::: details 详情
### 基本用法

```python
import asyncio

async def worker():
    try:
        while True:
            print("working")
            await asyncio.sleep(1)
    except asyncio.CancelledError:
        print("cancelled")
        raise

async def main():
    task = asyncio.create_task(worker())
    await asyncio.sleep(3)
    task.cancel()

    try:
        await task
    except asyncio.CancelledError:
        print("task cancelled")

asyncio.run(main())
```

`task.cancel()` 发出取消请求，`await task` 时可以捕获取消结果。

### 为什么要重新抛出

```python
except asyncio.CancelledError:
    cleanup()
    raise
```

捕获 `CancelledError` 后通常要重新抛出，否则调用方会认为任务正常结束。

### gather 中的取消

```python
tasks = [
    asyncio.create_task(fetch(1)),
    asyncio.create_task(fetch(2)),
]

for task in tasks:
    task.cancel()
```

批量任务取消时，要明确其他任务是继续执行还是一起取消。

### 超时控制

```python
await asyncio.wait_for(fetch_data(), timeout=3)
```

`wait_for` 超时时会取消内部任务，并抛出 `TimeoutError`。

### 注意事项

- 取消只会在 `await` 等挂起点生效。
- CPU 密集型同步代码无法及时响应取消。
- 任务中要用 `try/finally` 释放资源。
- 不要吞掉 `CancelledError`，除非明确知道后果。
:::

## 44、Python typing.Protocol 有什么作用
`Protocol` 用于定义结构化子类型，也就是只要一个对象拥有协议要求的属性和方法，就可以被认为满足这个类型，而不要求显式继承某个基类。

::: details 详情
### 基本用法

```python
from typing import Protocol

class SupportsClose(Protocol):
    def close(self) -> None:
        ...

def shutdown(resource: SupportsClose) -> None:
    resource.close()
```

任何实现了 `close()` 方法的对象，都可以传给 `shutdown`。

### 不需要显式继承

```python
class FileResource:
    def close(self) -> None:
        print("closed")

shutdown(FileResource())
```

`FileResource` 没有继承 `SupportsClose`，但结构满足协议，因此类型检查可以通过。

### 适合场景

- 定义接口能力。
- 降低继承耦合。
- 给第三方对象补充抽象约束。
- 编写更灵活的函数参数类型。
- 测试中替换 mock 对象。

### 和 ABC 的区别

- ABC 更强调显式继承和运行时抽象基类。
- Protocol 更强调静态类型检查中的结构兼容。
- Protocol 更接近“鸭子类型”的类型化表达。

### runtime_checkable

如果需要运行时使用 `isinstance` 检查，可以加：

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class SupportsClose(Protocol):
    def close(self) -> None:
        ...
```

但运行时检查能力有限，通常只检查属性是否存在。

### 注意事项

- Protocol 主要服务于静态类型检查。
- 不要把复杂业务逻辑放进协议定义。
- 对公共接口、插件系统、适配器模式很有帮助。
:::

## 45、Pydantic v2 常用于解决什么问题
Pydantic 常用于 Python 项目的数据校验、类型转换和序列化，FastAPI 中的请求体、响应模型和配置模型也大量依赖它。

::: details 详情
### 基本用法

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    id: int
    name: str = Field(min_length=1)
    age: int | None = None

user = User(id="1", name="Tom")
print(user.id)  # 1
```

Pydantic 会根据类型标注进行校验和转换。

### 常见能力

- 校验输入数据。
- 自动类型转换。
- 设置默认值。
- 定义字段约束。
- 导出 dict 或 JSON。
- 生成 JSON Schema。

### v2 常见方法

```python
user = User.model_validate({"id": 1, "name": "Tom"})
data = user.model_dump()
json_text = user.model_dump_json()
```

相比 v1，v2 中很多方法名改为 `model_` 前缀。

### 自定义校验

```python
from pydantic import field_validator

class User(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def check_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("name cannot be empty")
        return value
```

### 注意事项

- Pydantic 适合校验边界数据，不要把复杂业务逻辑都塞进模型。
- 类型转换虽然方便，但关键字段要避免过度宽松。
- v1 迁移到 v2 时要注意方法名和 validator 写法变化。
- 大量数据校验时要关注性能和模型嵌套复杂度。
:::

## 46、FastAPI 中 Depends 有什么作用
`Depends` 是 FastAPI 的依赖注入机制，用于把公共逻辑抽出来复用，例如获取数据库连接、校验登录态、读取分页参数、注入配置等。

::: details 详情
### 基本用法

```python
from fastapi import Depends, FastAPI

app = FastAPI()

def get_current_user(token: str):
    return {"name": "Tom", "token": token}

@app.get("/profile")
def profile(user = Depends(get_current_user)):
    return user
```

访问接口时，FastAPI 会先执行依赖函数，再把结果传给路由函数。

### 常见场景

- 认证和鉴权。
- 获取数据库 session。
- 解析分页参数。
- 读取请求上下文。
- 注入业务 service。
- 复用参数校验逻辑。

### 数据库 session 示例

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
def list_users(db = Depends(get_db)):
    return db.query(User).all()
```

使用 `yield` 可以在请求结束后释放资源。

### 依赖可以嵌套

一个依赖函数内部也可以继续声明其他依赖：

```python
def get_current_user(db = Depends(get_db)):
    ...
```

这样可以组合出认证、权限、数据库访问等链路。

### 注意事项

- 依赖函数不要做过重的初始化，避免每次请求重复开销。
- 数据库连接、文件句柄等资源要正确释放。
- 鉴权逻辑可以放在依赖中，但最终权限仍要和业务规则结合。
- 测试时可以使用 dependency override 替换依赖。
:::

## 47、SQLAlchemy Session 应该如何管理
SQLAlchemy 的 `Session` 表示一次数据库工作单元，负责对象状态跟踪、事务提交、回滚和连接使用。它不应该作为全局共享对象长期复用。

::: details 详情
### Session 的作用

`Session` 主要负责：

- 管理 ORM 对象状态。
- 组织数据库查询。
- 控制事务提交和回滚。
- 从连接池获取和释放连接。

它不是简单的数据库连接对象，而是 ORM 的工作上下文。

### 请求级 Session

Web 服务中常见做法是每个请求创建一个 session，请求结束后关闭：

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
```

这样可以保证异常时回滚，并释放连接资源。

### 为什么不能全局共享

全局共享 session 可能导致：

- 多请求之间状态污染。
- 事务边界混乱。
- 连接长期不释放。
- 并发访问产生不可预期行为。

全局可以保存 `engine` 和 `SessionLocal` 工厂，但不要共享同一个 session 实例。

### commit 和 flush

- `flush`：把变更发送到数据库，但不提交事务。
- `commit`：提交事务，并持久化变更。
- `rollback`：回滚当前事务。

有时需要先 `flush` 拿到数据库生成的主键，再继续后续逻辑。

### 注意事项

- 查询后长时间不关闭 session 会占用连接池资源。
- 异常路径必须 rollback，否则事务状态可能异常。
- 后台任务和异步任务要创建自己的 session。
- SQLAlchemy 2.x 推荐使用更明确的 session 生命周期管理方式。
:::

## 48、Python 描述符是什么
描述符是实现了 `__get__`、`__set__` 或 `__delete__` 方法的对象，用于自定义属性访问行为。Python 的 `property`、方法绑定和 ORM 字段都和描述符机制有关。

::: details 详情
### 基本定义

只要对象实现了以下任意方法，就可以称为描述符：

```python
class Descriptor:
    def __get__(self, instance, owner):
        ...

    def __set__(self, instance, value):
        ...

    def __delete__(self, instance):
        ...
```

描述符通常作为类属性使用。

### 数据描述符和非数据描述符

- 数据描述符：实现了 `__set__` 或 `__delete__`。
- 非数据描述符：只实现了 `__get__`。

数据描述符优先级高于实例属性。

非数据描述符可能被实例属性覆盖。

### 示例

```python
class Positive:
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, instance, owner):
        return instance.__dict__[self.name]

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError("must be positive")
        instance.__dict__[self.name] = value

class Product:
    price = Positive()
```

### 应用场景

- `property`。
- ORM 字段映射。
- 参数校验。
- 懒加载属性。
- 缓存计算结果。

### 注意事项

- 描述符适合封装通用属性访问逻辑。
- 使用描述符会增加理解成本，简单场景不必强行使用。
- 要注意实例属性、类属性和描述符之间的查找优先级。
:::

## 49、Python 元类是什么
元类是创建类的类。普通对象由类创建，而类本身由元类创建。Python 默认元类是 `type`。

::: details 详情
### 类也是对象

在 Python 中，类本身也是对象：

```python
class User:
    pass

print(type(User))  # <class 'type'>
```

这说明 `User` 这个类对象是由 `type` 创建的。

### 自定义元类

可以通过继承 `type` 创建元类：

```python
class UpperAttrMeta(type):
    def __new__(cls, name, bases, attrs):
        new_attrs = {}
        for key, value in attrs.items():
            if not key.startswith("__"):
                key = key.upper()
            new_attrs[key] = value
        return super().__new__(cls, name, bases, new_attrs)

class Demo(metaclass=UpperAttrMeta):
    name = "Tom"
```

### 应用场景

元类通常用于框架底层：

- ORM 模型字段收集。
- 自动注册类。
- 约束类定义。
- 修改类创建过程。
- 生成类属性或方法。

普通业务代码很少需要直接写元类。

### 和装饰器的区别

类装饰器可以在类创建后修改类。

元类参与类创建过程，更底层、更强大，也更难理解。

### 注意事项

- 元类会增加代码复杂度，能用普通类、继承、装饰器解决就不要用元类。
- 多个基类使用不同元类时可能出现元类冲突。
- 面试中重点是理解“类由元类创建”，不一定要手写复杂元类。
:::

## 50、Python 协程和线程有什么区别
线程由操作系统调度，协程通常由事件循环在用户态调度。线程适合阻塞 IO 或需要并发执行的任务，协程适合大量高并发 IO 任务。

::: details 详情
### 线程

线程是操作系统级别的执行单元。

特点：

- 由操作系统调度。
- 可以并发处理多个阻塞任务。
- 上下文切换成本相对更高。
- 需要注意锁和共享数据竞争。

在 CPython 中，GIL 会限制多个线程同时执行 Python 字节码，因此 CPU 密集任务不适合靠多线程提速。

### 协程

协程通常运行在一个线程内，由事件循环调度。

特点：

- 切换成本低。
- 适合大量网络 IO。
- 遇到 `await` 主动让出执行权。
- 代码需要使用异步库配合。

示例：

```python
async def fetch():
    await client.get("https://example.com")
```

### 如何选择

- CPU 密集：优先多进程、C 扩展或任务队列。
- 少量阻塞 IO：线程可以简单解决。
- 大量网络 IO：协程更适合。
- 已有同步库：线程改造成本更低。
- 全链路异步库可用：协程更有优势。

### 注意事项

- 协程中不能直接调用长时间阻塞的同步函数。
- 多线程要注意锁、死锁和共享状态。
- 异步代码并不会自动更快，瓶颈仍可能在数据库或外部服务。
- Web 框架中要区分同步视图、异步视图和底层服务器模型。
:::

## 51、Django ORM 中 select_related 和 prefetch_related 有什么区别
`select_related` 和 `prefetch_related` 都用于优化关联查询，减少 N+1 查询问题，但适用的关联关系和实现方式不同。

::: details 详情
### N+1 查询

例如查询文章列表时，每篇文章再单独查询作者：

```python
posts = Post.objects.all()
for post in posts:
    print(post.author.name)
```

如果有 100 篇文章，可能触发 1 次文章查询和 100 次作者查询。

### select_related

`select_related` 使用 SQL join 一次性查询关联对象。

适合：

- ForeignKey。
- OneToOneField。

示例：

```python
posts = Post.objects.select_related("author")
```

它适合一对一或多对一关系。

### prefetch_related

`prefetch_related` 会分别查询主表和关联表，再在 Python 层组装关系。

适合：

- ManyToManyField。
- 反向 ForeignKey。
- 一对多关系。

示例：

```python
authors = Author.objects.prefetch_related("posts")
```

### 如何选择

- 单值关联：优先 `select_related`。
- 多值关联：使用 `prefetch_related`。
- 复杂筛选：可以结合 `Prefetch` 自定义查询集。

### 注意事项

- 不要盲目预加载所有关系，会增加内存和查询成本。
- 列表页要结合分页使用。
- 优化前后可以通过 Django Debug Toolbar 或 SQL 日志确认查询次数。
:::
