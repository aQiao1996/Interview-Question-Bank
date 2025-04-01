---
lang: zh-CN
title: ts
description: ts面试题
---

# ts

## 1、优缺点，使用场景
::: details 详情
优点
- 静态类型，减少类型错误。
- 有错误会在编译时提醒，而非运行时报错 —— 解释“编译时”和“运行时”。
- 智能提示，提高开发效率。

缺点
- 学习成本高。
- 某些场景下，类型定义会过于混乱，可读性不好，如下代码。
- 使用不当会变成 anyScript。

使用场景
- 大型项目，需要严格控制类型。
- 逻辑性高的代码，比如前端的组件库。
- 长期维护的项目。
:::

## 2、TS 类型有哪些
::: details 详情
1️⃣ 原始类型
- `number`
  > 表示数字类型，包括整数和浮点数。
```ts
let age: number = 25;
let pi: number = 3.14;
```
- `string`
  > 表示字符串类型。
```ts
let name: string = "胖虎";
```
- `boolean`
  > 表示布尔类型，true 或 false。
```ts
let isActive: boolean = true;
```
- `null` 和 `undefined`
  > 表示空值或未定义的值。
```ts
let empty: null = null;
let notAssigned: undefined = undefined;
```
- `symbol`
  > 表示唯一的值，通常用于对象的唯一属性键。
```ts
let uniqueKey: symbol = Symbol("key");
```
- `bigint`
  > 表示大整数类型。
```ts
let bigNumber: bigint = 12345678901234567890n;
```
2️⃣ 引用类型
- `object`
  > 表示非原始类型的对象。
```ts
let person: object = { name: "胖虎", age: 18 };
```
- 数组（`Array`）
  > 表示一组相同类型的值。
```ts
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
```
- 元组（`Tuple`）
  > 表示固定长度的数组，每个元素可以是不同的类型。
```ts
let tuple: [string, number] = ["胖虎", 18];
```
3️⃣ 特殊类型
- `any`
  > 表示任意类型，关闭类型检查。
```ts
let value: any = 42;
value = "Hello"; // 允许重新赋值为不同类型
```
- `unknown`
  > 表示未知类型，类似于 `any`，但更安全。
```ts
let value: unknown = "Hello";
if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```
- `void`
  > 表示没有返回值的函数。
```ts
function logMessage(message: string): void {
  console.log(message);
}
```
- `never`
  > 表示永远不会有返回值的类型（如抛出错误或死循环）。
```ts
function throwError(message: string): never {
  throw new Error(message);
}
```
4️⃣ 联合类型和交叉类型
- 联合类型（`Union`）
  > 表示一个变量可以是多种类型之一。
```ts
let value: string | number = "Hello";
value = 42;
```
- 交叉类型（`Intersection`）
  > 表示一个变量同时具有多种类型的特性。
```ts
type A = { name: string };
type B = { age: number };
let person: A & B = { name: "胖虎", age: 18 };
```
5️⃣ 类型别名（`type`）和接口（`interface`）
- 类型别名（`type`）
  > 用于定义自定义类型。
```ts
type Point = { x: number; y: number };
let point: Point = { x: 10, y: 20 };
```
- 接口（`interface`）
  > 用于定义对象的结构。
```ts
interface User {
  id: number;
  name: string;
}
let user: User = { id: 1, name: "胖虎" };
```
6️⃣ 枚举类型（`enum`）
  > 用于定义一组常量。
```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
let dir: Direction = Direction.Up;
```
:::