# TS for JS Programmers
## Types by Inference 类型推论 or 类型推断？
* TS 了解 JS 的语言类型，在许多情况下会自动推断变量的类型。

```typescript
// 这里的 helloWorld 变量会被推断成 string 类型
let helloWorld = "Hello World"
```

## Defining Types 定义类型
```typescript
// 定义一个对象，它的类型可以被推断。
const user = {
    name: "Nick"，
    age: 18
}

// 可以使用 interface 关键字，明确的描述一个对象的形状
interface User {
    name:string
    age:number
}

// 可以使用 :TypeName 的语法，让上面的 user 遵守 User interface 的形状

const user: User = {
    name: "Nick",
    age: 18
}

// 如果定义的变量与定义的类型对应不上，TS 就会有警告
const user: User = {
    name: "Tony",
    age: "18"
}

// JavaScript 支持面向对象编程，所以 TS 也行。可以在 class 语法中使用 interface
class UserAccount {
    name: string;
    id: number;

    constructor(name: string ,id: string){
        this.name = name
        this.id = id
    }
}

const user: User = new UserAccount("Tony",222)

// 可以使用 interface 注解函数参数和函数返回值
function getUser(): User {

}

function deleteUser(user: User){

}

// 在 JavaScript 中有一些原始的数据类型（boolean,bigint,null,number,string,symbol,undefined），这些类型可以在 interface 中使用
// 同时，TS 也拓展了一些类型，any:即允许任何类型，放弃了类型检查？，unknown：ensure someone using this type declares what the type is，没有放弃类型检查，后续使用的时候，会去确认类型，never: 不可能发生的情况，void:一个函数没有返回值或返回 undefined 时，就是 void
// TODO: 这里添加一些对 any、unknown、never 的具体解释

// unknown 就像是 any 的兄弟类型一样。但是两者有些不同，any,会放弃类型的检查，类型为 unknown 的变量在后续的工作中仍然需要一个具体的类型。
// 这里使用 TypeScript 官网的例子叭：
// 官网的例子是对 JSON.parse() 的一个使用。 JSON 数据的来源是未知的，parse 函数的调用者也不知道数据的类型或者说形状吧。
const josnParser = (jsonString: string)=> JSON.parse(jsonString);

const myAccount = josnParser('{"name":"nick","age":18}')

myAccount.name
myAccount.age

// 这里的 jsonParser 返回的是 any 类型，所以 myAccount 能够正常的读取 name,age 等属性
// 可以使用 unknown ,或者泛型来修复类型检查
const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString)
const myOtherAccount = jsonParserUnknown('{"name":"nick","age":20}')
myOtherAccount.name  // 此时就会有类型的错误，提示 myOtherAccount 为 unknown ,需要给它一个具体的类型

// 可以预先定义一个类型
interface User {
    name: string
}

const userAccount = jsonParserUnknown('{"name":"nick"}') as User
userAccount.name
// -----------


// Never

// never 代表在代码逻辑上不可能发生的情况,不能到达的终点？
// 例如，函数永远不能返回
const neverReturns = () => {
    throw new Error('never return')
}
// neverReturns 的类型为，() => never.
// never 可以像其他类型一样，传递
const myNever = neverReturns()

// 在某些情况下，拥有一个永远不能返回的函数是很有用的。
// 比如：处理 JS 运行时的不可预测性，及 API 使用者不使用类型的情况
// 有点没太理解到下面部分的意思呢？？
const validateUser = (user: User) => {
    if (user) {
        return user.name !== "NaN";
    }

    // According to the type system, this code path can never
    // happen, which matches the return type of neverReturns.

    return neverReturns();
};
// The type definitions state that a user has to be passed in
// but there are enough escape valves in JavaScript whereby
// you can't guarantee that.
// 尽管这里定义了类型 User ,但是 JS 中有足够多的逃生舱，不能保证一定是 User？ 这句话啥意思呢。有点没懂

// Using a function which returns never allows you to add
// additional code in places which should not be possible.
// This is useful for presenting better error messages,
// or closing resources like files or loops.

// A very popular use for never, is to ensure that a
// switch is exhaustive. E.g., that every path is covered.

// Here's an enum and an exhaustive switch, try adding
// a new option to the enum (maybe Tulip?)


enum Flower {
    Rose,
    Rhododendron,
    Violet,
    Daisy,
    Tulip,
}

const flowerLatinName = (flower: Flower) => {
    switch (flower) {
        case Flower.Rose:
            return "Rosa rubiginosa";
        case Flower.Rhododendron:
            return "Rhododendron ferrugineum";
        case Flower.Violet:
            return "Viola reichenbachiana";
        case Flower.Daisy:
            return "Bellis perennis";

        default:
            const _exhaustiveCheck: never = flower;
            return _exhaustiveCheck;
    }
};

// You will get a compiler error saying that your new
// flower type cannot be converted into never.
// 就算我得到了这个编译错误提示，意义是什么呢？不太明白

// Never in Unions

// never 会自动从联合类型中删除

type NeverIsRemoved = string | never | number;

// If you look at the type for NeverIsRemoved, you see that
// it is string | number. This is because it should never
// happen at runtime because you cannot assign to it.

```
## Composing Types 组合的类型 or 复杂的类型？
* 这里有两种常见的方式将简单的类型组合成复杂的类型。 union or generic

### Unions 联合类型
``` typescript
// 使用 union,就可以让定义的类型为许多类型备选项中的任意一个。
type MyBool = true | false;

// 一种常见联合类型：string or number 的集合
type Animal = "cat"|"dog"|"panda"
type Length = 100|200|300
type Other = "Tony"|18

```

### Generics 泛型
```typescript
//Generics provide variables to types. generic 为类型提供了变量。这句话该怎么理解？
// 常见的情况：没有泛型约束的数组能够包含任何类型的数据，有泛型约束的数组只能包含满足约束的数据

type StringArray = Array<string>
type UserArray = Array<User>


// 可以在自定义的类型中使用泛型
interface Backpack<T> {
  add: (obj: T) => void;
  get: () => T;
}

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from.
declare const backpack: Backpack<string>;

// object is a string, because we declared it above as the variable part of Backpack.
const object = backpack.get();

// Since the backpack variable is a string, you can't pass a number to the add function.
backpack.add(23);
// waring: Argument of type 'number' is not assignable to parameter of type 'string'.

```

### Structural Type System 结构类型系统

```typescript
// 类型检查专注于值拥有什么样的 shape，这是 TS 类型检查的核心原则之一。
// 这有时侯也被称为 duck typing or structural typing
// TODO: 去了解一下上面的两个名词
// 在结构类型系统中，如果两个值具有相同的形状，他们就会被考虑为相同的类型

interface Point {
    x: number
    y: number
}

function logPoint(p: Point){
    console.log(p.x,p.y)
}

const point = { x:0,y:0 }
logPoint(point) // It's ok!
// 尽管 point 没有被显示声明为 Point 类型，但是 TS 的类型检查比较了 point 与 Point 的形状，两者形状相同，所以认为两者是同一个类型。

// shape-matching 时，仅需要 object's field 的一个子集。
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"

// 尽管 rect 中多出了 width 和 height 属性，但是依旧是可以的，因为 rect 拥有 x,y 两个属性，满足需要。

const color = { hex: "#187ABF" };
logPoint(color);
// warning: Argument of type '{ hex: string; }' is not assignable to parameter of type 'Point'.
//   Type '{ hex: string; }' is missing the following properties from type 'Point': x, y



// class 在遵守 shape 方面与 object 没有什么不同
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56"

// 总的来说：如果 object or class 拥有所有满足需要的属性，TS 就认为比较的结果是匹配的，会忽略 object 或 class 实现上的细节。
```



