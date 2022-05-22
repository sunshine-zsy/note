// # The Basics
// ## Static type-checking
const message = "message"

message()
// 如果是 JS 的话，这里的错误只有在运行时才能发现。
// 使用静态类型检查器，比如： TypeScript 。就能够在代码运行之前，检查到这些问题。
// 静态类型系统描述了当项目运行时，值的 shape 和能够进行的一些行为。

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


// TS 除了在编写代码后寻找错误，也能在我们写代码时，就帮我们避免错误。
// 即，在编写代码时，TS 能提示这个对象有哪些属性和方法之类的。避免犯错。