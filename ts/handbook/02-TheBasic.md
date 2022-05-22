# The Basics
## Static type-checking
```typescript
const message = 'message'
const message = "message"

message()
// 如果是 JS 的话，这里的错误只有在运行时才能发现。
// 使用静态类型检查器，比如： TypeScript 。就能够在代码运行之前，检查到这些问题。
// 静态类型系统描述了当项目运行时，值的 shape 和能够进行的一些行为。
```

## Non-exception Failures

```typescript
// 在 JS 中，调用不可调用的东西时，会抛出错误。这是 ES 的规定。
// 但是，访问对象中不存在的属性时，会返回 undefined 。在某些情况下，这可能就会导致程序的错误。  所以，这就叫做无异常错误？

const user = {
    name: "nick",
    age: 18
}

user.location // 在 JS 中，会是 undefined，而在 TS 的检查下，这会抛出一个错误

// 尽管这样的检查让代码不再那么的 自由
// 但是可以避免很多不必要的错误
// 例如：拼写的错误

const announcement = "Hello World!";

// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();

function flipCoin() {
    // Meant to be Math.random()
    return Math.random < 0.5;
}

// 一些基本的逻辑错误
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
    // ...
} else if (value === "b") {
    // Oops, unreachable
}

```

## Types for Tooling
## tsc the TypeScript compiler

## Emitting with Errors 应该是 有 errors 时仍然会产出编译后的文件
tsc --noEmitOnError hello.ts
* 想要编译的过程严厉一些，可以对 tsc 加上 --noEmitError 选项。这样有 error 时，就不会产出文件了
## Explicit Types
```typescript
// 在之前的例子中，并没有给出具体的类型
// 之前的例子
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

// 给之前的例子加上类型约束
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
// 在这里给 person 和 date 加上了类型注解
// 可以这样理解这个签名 greet 接受 string 类型的 person 和 Date 类型的 date

// 在许多情况下，也不需要显示的定义一个变量的类型，TS 能够自动推断出变量的类型
// 在能够自动推断出类型时，最好就不要手动添加类型了。
const msg = 'msg' // infer string
```

## Erased Types 类型擦除

```typescript
// 上述的 greet 函数在经过 tsc 编译后，如下：
function greet(person, date) {
    console.log("Hello " + person + ", today is " + date.toDateString() + "!");
}
// 可以发现里面的 类型注解 部分消失了。因为 JS 的语法中没有类型注解这个概念。
// 类型注解不会改变程序的运行时行为。

```

## Downleveling 降级？
```typescript
// 上面 greet 方法中的 模板字符串 也发生了变化
// 模板字符串（ES6）变成了普通的字符串连接（ES5），
// TS 将高版本的 ES 代码转为了低版本或者说老版本的 ES 代码，这个过程就叫降级
// TS 默认为 ES3 ，一个非常古老的版本。可以通过 target 选项，配置编译后的版本
// tsc --target es2015

```

## Strictness 严格模式
* TypeScript 默认的类型检查是比较宽松的，推断会兼容大部分的内容。对 null/undefined 没有强制的检查。
* 可以对 TypeScript 开启严格模式，带来更全面的检查。应当开启严格模式

## noImplicitAny
* 有些时候，TS 不会推断类型，而是会返回 any 类型。配置 noImplicitAny 后，推断为 any 时，将会抛出 error

## strictNullChecks
* 默认情况下,null 和 undefined 能够被赋值给任意类型。给写代码带来了一些方便。但是忘记处理 null 和 undefined 是许多 bug 产生的原因。
* 启用 strictNullChecks ，会更容易的处理 null 和 undefined

