# Everyday Types

## The primitives: string,number,boolean
* JavaScript 中有三个非常常见的类型，string,number,boolean.每一个在 TS 中都有相对应的类型。
* 这些类型的 name 与在 JS 中使用 typeof 操作符得到的结果一样（这里指 typeof 对string、number、boolean 得到的结果）
* String,Number,Boolean 这样的类型名也是正确的，但这指的是一些特殊的内建类型。在代码中出现的很少。

## Arrays
* 描述一个数组的类型，比如：`[1,2,3]`,可以使用 `number[]`这样的语法。也可以使用`Array<number>`。
* 注意：`[number]`和`number[]`是完全不同的东西

## any
TS 中有个特殊的类型 any.当一个值的类型是 any 的时候，TS 就放弃类型检查了。
可以对 any 类型的值做任何符合语法的操作。（这里指，把这个值当作函数调用，对这个值赋予任意类型的值，取这个值的属性等操作）

## Type Annotations on Variables
* 对变量使用类型注解，如`let myName:string = 'string'`
* 大部分情况下（比如上面这种情况），是不需要类型注解的。TS 会自动推断。

## Functions
 TS能对函数的输入和返回值进行类型注解。
### Parameter Type Annotations
```typescript
function greet( name:string ){
    console.log( name )
}
// tip: 如果没有对参数进行类型注解，TS 依旧会检查传入函数的参数个数。
```

### Return Type Annotations
```typescript
function greet( name: string ): string{
    return name
}
// 一般情况下，可以不用显示的声明函数的返回类型。TS 会根据 return 语句推断函数返回类型。

```

### Anonymous Functions
* 匿名函数与函数声明有一些不同。当 TS 知道匿名函数是如何调用时，会自动给函数加上类型注解。
```typescript
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Eve"];

// Contextual typing for function
names.forEach(function (s) {
  console.log(s.toUppercase());
// Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});

// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUppercase());
// Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```
* 这样的过程被称为上下文推断。（contextual typing）这个函数的上下文决定了这个函数的类型。

## Object Types
除了上面的原始类型，最常见的就是对象类型。定义对象，只需要列举出它的属性和属性对应的类型。
```typescript
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
// 属性的类型是可选的，如果没有指定。则是 any 类型。
```

## Optional Properties
* 对象中的所有属性都是可选的。（在对象名后使用 ？修饰符）

```typescript
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```
## Union Types
### Defining a Union Type
* 在 TS 中，能够使用不同的操作符，将已存在的类型组合在一起，构建新类型。
* 联合类型是由两种或更多的类型形成的。代表某个值的类型，是其中任意一种。

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
```

### Working with Union Types
* 一个值的类型是联合类型，那它如何正常的工作？或者说有什么限制？

```typescript
// 一个值的类型如果是联合类型，则对它的操作，必须满足联合类型中每一种类型的要求。eg.
function printId(id: number | string) {
  console.log(id.toUpperCase()); // 这里会 提示 number 类型中没有这个方法
}

// 如何解决？可以是使用类型收窄  narrowing ...
// narrow 发生在什么时候？当 TS 能够通过代码的结构（或者说上下文）推断出更具体的类型时。

// It's ok!
function printOtherId(id: number | string) {
  if(typeof id === 'number'){
    console.log('number')
  }else{
    console.log('string')
  }
}

// 或者面对像数组这样的类型时
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

## Type Aliases 类型别名
* 定义任何类型时，都可以使用类型别名（使用 type 关键字,一个可以指代任何类型的关键字。）

```typescript
type Point = {
  name: string
  age: number
}

type ID = number | string
```

## Interfaces
* interface 关键字被用于声明对象类型
```typescript
interface Point {
  name: string
  age: number
}
```
### Differences Between Type Aliases and Interfaces
* 使用 type 声明的对象类型和 interface 声明的对象类型基本上是一样的。但是也有一些不同。

```typescript
// interface 能通过 extend 关键字拓展 property
interface Animal {
  name: string
}

interface Bear extends Animal {
  age: number
}

let bear: Bear = {
  name: 'nick',
  age: 18
}

// type 只能通过 intersection 去拓展属性
type Car = {
  price: number
}

type Tank = Car & {
  age: number
}

const tank: Tank = {
  price: 1000000,
  age: 1000
}

// interface 可以重复声明同一个类型名来添加 field
interface Boat {
  width: number
}

interface Boat {
  height: number
}

const boat: Boat = {
  width: 100,
  height: 100
}

// type 不能重复声明
type Box = {
  width: number
}

type Box = {
  height: number
}
// error duplicate Box identifier
// TODO: interface 和 type 更多的不同
```
## Type Assertions
* 某些时候，我们知道某个值的具体类型，但是 TS 不知道。这个时候肯能就需要断言来帮助我们。

```typescript
// 这里使用官网的例子
// 假设使用 document.getElementById 去获取 dom 元素，TS 会知道这个方法的返回值是某种 HTMLElement.但是我们很清楚，我们获取到的是 Canvas 元素。
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// 另一种语法
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas")
```
* 类型断言有一种保护机制。只能将一种类型断言为更宽泛的类型或者更具体的类型。这是为了避免某些低级的错误。

```typescript
const x = 'x' as number // 这是很显然的一个断言错误
// 可能在某些复杂的类型转换情况下，这中保护机制又显得多余。可以先转换成 any or unknown 再断言为我们需要的类型
cont x = 'x' as unknown as number
```

## Literal Types 字面量类型
* 可以将类型声明为具体的字符串或者数字（不仅仅是 string or number）

```typescript
// 字面量类型本身没有太大的意义
let x: 'hello' = 'hello'

x = 'hll' // error
// 想一想？如果将许多字面量类型组合为联合类型，用来限制函数的参数类型。'left'|'right'|'center' ? 就会很有用
```

### Literal Inference
* 字面量类型的推论。有什么特殊的地方呢？

```typescript
function handleRequest(url: string, method: 'GET' | 'POST') {
//  xxx
}

const req = { url: 'https://xxx', method: 'GET' }
// 这里的 req.method 被推断为 string 类型，所以不能赋值给 'GET'|'POST' 联合类型
handleRequest(req.url, req.method)

// 有两种方式可以解决这个问题
// 1. 使用断言，改变推断结果
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");

// 2. 使用 as const 将初始对象变为字面量类型
const req = { url: 'https://xxx', method: 'POST' } as const
// 对类型系统来说， const 会确保该对象的所有属性都是字面量类型，而不是一种普通的类型，比如 string or number
```

## null and undefined
* JS 中有两个原始类型：null and undefined 用来代表空或者没有初始化值

* strictNullChecks off ; 关闭 strictNullChecks 开关后，null or undefined 的值可以被访问，可以被赋予任何类型的值。这可能是导致 bug 的原因，推荐始终开启 strictNullChecks

## Non-null Assertion Operator (Postfix!)
* 非空断言操作符 !,不做任何类型检查的情况下，从类型中移除 null 和 undefined。即，表示这个值不可能为 null or undefined

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```



