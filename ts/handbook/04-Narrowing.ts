// 假设有这样一个函数
// 实现这样的功能：如果 padding 是 number，则在 input 前添加相应数量的空格，如果是 string，则直接添加该字符串到 input 前面。
// 首先来实现添加相应数量的空格
function padLeft1(padding: number | string, input: string) {
    return " ".repeat(padding) + input; // error  string|number -> number  error
}
// 为什么出错呢？因为我们没有明确的检查 padding 的类型。 这里应该是明确的一种类型就可以了。number or string ?
// 将函数改为这样，则能正常运行。
function padLeft(padding: number | string, input: string) {
    if (typeof padding === "number") {
        return " ".repeat(padding) + input;
    }
    return padding + input;
}

// 也许上面的代码看起来有点像 JavaScript。但这就是 TS 的设计思路，除了有关类型的语法，TS 就是 JavaScript 。
// TS 的类型系统的设计意图是尽可能简单的去编写 JavaScript 代码。而不是费尽心思的去保障类型安全

// 尽管看起来代码很简单，实际上 TS 在背后做了许多的事情。 TS 使用静态类型去分析运行时的值，这样的分析，现在包含了一些流程控制语句，如 if/else
// 三元表达式、循环、真值检查

// 在上面的 if 语句中，（if (type of padding === "number")），TS 会认为这是一种特殊的代码形式，被称为 type guard。
// TS 会跟随所有的执行路径，去分析值在给定位置上最可能、最具体的类型

// TS 会观察（或者说考虑）到特殊的检查（例如 type guard）、赋值，然后会赋予一个值比声明时的类型更具体的类型。这个过程就叫做类型收窄。( narrowing )
// 在许多编辑器中，我们会观察到这种变化。比如上面的 padLeft,在 if 语句内为 number,if 语句外为 string 类型

// 这里有一些不同的结构，TS 能运用他们进行 类型收窄 narrowing



// typeof type guards
// JS 中提供了 typeof 操作符，检测一个值在运行时的基本类型信息。 TS 会认为使用 typeof 操作符后，返回的是一系列确定的字符串中的某一个
// string、number、bigint、boolean、symbol、undefined、object、function
// 如同上面的例子， 该操作符在许多的 JS 库中出现的十分频繁。TS 也能理解该操作符进而在不同的逻辑分支中，对类型进行收窄。
// 在 TS 中，对 typeof 操作符返回的值进行类型检查是一种类型保护（类型守卫、type guard）
// TS 知道 typeof 操作符对各种不同 value 的结果，也清楚 typeof 在 JavaScript 中的一些缺陷，或者说怪异之处。
// typeof 对 null 检测的结果与对对象的检测结果相同 都是 object
function printAll(strs: string | string[] | null) {
    if (typeof strs === "object") {
        for (const s of strs) {
            //   Object is possibly 'null'.
            console.log(s);
        }
    } else if (typeof strs === "string") {
        console.log(strs);
    } else {
        // do nothing
    }
}



// Truthiness narrowing 真值收窄
// 在 JS 中，可以在条件语句中使用任何表达式。例如 &&、｜｜、！
// 举个例子：if 语句不会限制条件始终为 boolean 类型。

function getUsersOnlineMessage(numUsersOnline: number) {
    if (numUsersOnline) {
        return `There are ${numUsersOnline} online now!`;
    }
    return "Nobody's here. :(";
}

// 在 JS 中，像 if 这样的语句会强制将条件转换为 boolean 类型，然后，根据转换后的结果来选择执行的分支。
// 0 、NaN、""、0n、null、undefined 都会被认为是 false。除此之外的所有值，会被认为是 true.
// 可以使用 Boolean 函数，或者 !! 将一个值的类型转换为 boolean 类型。
// both of these result in 'true'
const bool1 = Boolean("hello"); // type: boolean, value: true
const bool2 = !!"world"; // type: true,    value: true
// 这两者的区别是什么呢？ Boolean 函数会将一个字面量的值的类型推断为 boolean ，而 !! 会将字面量的类型推断为 true.
// 就是说，!! 对于字面量的推断，会更准确一些。
// 这种强制类型转换是非常常用的，特别是对于 null 和 undefined 来说。
// 见下面这个例子  在第一个 if 条件判断为 true 的分支内， strs 的类型被成功的收窄为 string[],不再是 string[]|null
function printAll2(strs: string | string[] | null) {
    if (strs && typeof strs === "object") {
        for (const s of strs) {
            console.log(s);
        }
    } else if (typeof strs === "string") {
        console.log(strs);
    }
}

// ! 操作符也可以有类似的效果
function multiplyAll(
    values: number[] | undefined,
    factor: number
): number[] | undefined {
    if (!values) {
        return values;
        // (parameter) values: undefined
    } else {
        return values.map((x) => x * factor);
        // (parameter) values: number[]
    }
}

// Equality narrowing  （等值收窄）
// TS 可以使用 switch 语句和 判断是否相等（=== !== == !=）来收窄类型
function example(x: string | number, y: string | boolean) {
    if (x === y) {
        // We can now call any 'string' method on 'x' or 'y'.
        x.toUpperCase();
        y.toLowerCase();
    } else {
        console.log(x);
        console.log(y);
    }
}
// 之前的例子也可以用判断相等来重写一下
function printAll3(strs: string | string[] | null) {
    if (strs !== null) {
        if (typeof strs === "object") {
            for (const s of strs) {

                console.log(s);
            }
        } else if (typeof strs === "string") {
            console.log(strs);

        }
    }
}
// 对于宽松的 == 来说， null 与 undefined 是相等的。这点与 === 是有所区别的。
interface Container {
    value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
    // Remove both 'null' and 'undefined' from the type.
    if (container.value != null) {
        console.log(container.value);
        // Now we can safely multiply 'container.value'.
        container.value *= factor;
    }
}



// The in operator narrowing
// JS 中有 in 操作符，检测对象是否有某个属性。 而 TS 也将此用作类型收窄的手段。
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        return animal.swim();
    }

    return animal.fly();
}
// 下面这种情况，某个类型出现在了两个分支中

type Human = { swim?: () => void; fly: () => void };
// 这里有个特点 swim 在 Fish 和 Human 中重复，并且 swim 在 humming 中是可选的。

function move2(animal: Fish | Bird | Human) {
    if ("swim" in animal) {
        animal;
        // (parameter) animal: Fish | Human
    } else {
        animal;
        // (parameter) animal: Bird | Human
    }
}



// instanceof narrowing
// JS 中可以利用 instanceof 关键字检测某个值是否是另一个值的 实例
// TS 中的 instanceof 同样也是一种类型守卫
function logValue(x: Date | string) {
    if (x instanceof Date) {
        console.log(x.toUTCString());
        //   (parameter) x: Date
    } else {
        console.log(x.toUpperCase());
        //   (parameter) x: string
    }
}

// Assignments
// TS 能通过 = 右边的值类型判断左边的值的类型
// 这也能叫做类型收窄？ 不如说是 类型推断？
let x = Math.random() < 0.5 ? 10 : "hello world!";

// let x: string | number
x = 1;

console.log(x);

// let x: number
x = "goodbye!";

console.log(x);

// let x: string

// x 的类型一开始是 string ｜ number
// 所以下面会报错
x = true



// Control flow analysis
// 回到最开始的例子
function padLeft3(padding: number | string, input: string) {
    if (typeof padding === 'number') {
        return " ".repeat(padding) + input
    }
    return padding + input
}
// 当 padLeft3 函数从第一个 if 语句处返回时，TS 就知道后面的代码部分是不能到达的。
// 也就是说 当 padding 为 number 时，后面的部分是不能到达的。因此，后面的类型就被收窄为 string
// 这样的 基于代码的可到达性的分析就是  control flow analysis .
// 当遇到 type guards 或者 assignments 时，TS 就能够用使用 flow analysis 去 narrow 类型。
// 当一个变量被用这样的方式去分析时，就能在流程中，观察到该变量具有不同的类型。
function example2() {
    let x: string | number | boolean;

    x = Math.random() < 0.5;

    console.log(x);

    //   let x: boolean

    if (Math.random() < 0.5) {
        x = "hello";
        console.log(x);

        //   let x: string
    } else {
        x = 100;
        console.log(x);

        // let x: number
    }

    return x;

    //   let x: string | number
}



// Using type predicates
// 上面的例子都是通过 JS 原生的一些方式来进行 narrow
// 但如果，某些时候，我们想更直接的通过自己的代码来进行 narrow ,该怎么做呢？
// 定义一个用户自定的类型守卫时，只需要简单的定义一个函数，这个函数的返回类型就是  type predicate
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined
}
// pet is Fish 不就是相当于 true 吗？ 这个 type predicate 到底是什么意思呢？
// pet is Fish 就是 type predicate ,predicate 的形式是 parameterName is Type ,parameter 必须是
// 函数的参数


// Discriminated unions
// 之前的例子是对一些基本类型进行的类型收窄，比如 number\string 等。
// 现在来看一下比较复杂的类型该如何处理。
// 现在有这样一个类型
interface Shape {
    kind: 'circle' | 'square'
    radius?: number
    sideLength?: number
}
// radius 和 sideLength 都是设计成可选的，因为对于某一种形状来说，不能具有两种属性。

// 当我们判断它是 circle 时
function getArea(shape: Shape) {
    if (shape.kind === 'circle') {
        return shape.radius ** 2 * Math.PI
        // error radius is maybe undefined
    }
}
// 加上一个非空断言可以解决这个问题  但是这样的处理方式，有些不太合理，为什么呢？定义时，
// 就定义其为一个可选的，此时却认为其是一个必然存在的属性，这样的前后语义有些矛盾？
// those assertions are error-prone if we start to move code around. 有点没明白这句话的意思呢
function getArea2(shape: Shape) {
    if (shape.kind === 'circle') {
        return shape.radius! ** 2 * Math.PI
    }
}
// 不如，重构一下 Shape
// 目前，TS 不能从 kind 判断出 radius 或者 sideLength 是否存在
interface Circle {
    kind: 'circle'
    radius: number
}

interface Square {
    kind: 'square'
    sideLength: number
}

type Shape2 = Circle | Square

function getArea3(shape: Shape2) {
    if (shape.kind === 'circle') {
        return Math.PI * shape.radius ** 2
    }
}
// 当 union 中的每个类型都包含同一个字面量类型的属性时，TS 会认为这个 union 是一个 discriminated union
// 就可以对这个 union 进行类型收窄


// The never type

// 在进行 narrowing 时，能够将所有可选的类型都给移除，并且没有留下任何东西。
// TS 用 never 类型来代表这种情况。即，不可能发生、不存在的情况？



// Exhaustiveness checking
// never 类型能够赋值给任意类型，但是其他类型不能赋值给 never 类型，除了 never 本身。
// 可以利用这个特性，来完成穷举的类型检查。
type Shape3 = Circle | Square;

function getArea4(shape: Shape3) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}

// 这样做的意义是什么呢？代表我只需要这两种类型？其他多余的，就是不必要的？
interface Triangle {
    kind: "triangle";
    sideLength: number;
}

type Shape4 = Circle | Square | Triangle;

function getArea5(shape: Shape4) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            //   Type 'Triangle' is not assignable to type 'never'.
            return _exhaustiveCheck;
    }
}
