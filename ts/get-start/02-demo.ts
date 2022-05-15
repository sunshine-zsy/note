let helloWord = 'hello world'

// 定义一个对象，它的类型可以被推断。
const user = {
    name: "Nick",
    age: 18
}

// 可以使用 interface 关键字，明确的描述一个对象的形状
interface User {
    name: string
    age: number
}

// 可以使用 :TypeName 的语法，让上面的 user 遵守 User interface 的形状

const user1: User = {
    name: "Nick",
    age: 18
}

// 如果定义的变量与定义的类型对应不上，TS 就会有警告
const user2: User = {
    name: "Tony",
    age: "18"   // the string is not assignable to number
}

// JavaScript 支持面向对象编程，所以 TS 也行。可以在 class 语法中使用 interface
class UserAccount {
    name: string;
    id: number;
    age: number;

    constructor(name: string, id: number, age: number) {
        this.name = name;
        this.id = id;
        this.age = age;
    }
}

const user3: User = new UserAccount("Tony", 222, 100)

// 可以使用 interface 注解函数参数和函数返回值
function getUser(): User {
    return user2
}

function deleteUser(user: User) {

}


// 使用 union,就可以让定义的类型为许多类型备选项中的任意一个。
type MyBool = true | false;

// 一种常见联合类型：string or number 的集合
type Animal = "cat" | "dog" | "panda"
type Length = 100 | 200 | 300
type Other = "Tony" | 18

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



// 类型检查专注于值拥有什么样的 shape，这是 TS 类型检查的核心原则之一。
// 这有时侯也被称为 duck typing or structural typing
// TODO: 去了解一下上面的两个名词
// 在结构类型系统中，如果两个值具有相同的形状，他们就会被考虑为相同的类型

interface Point {
    x: number
    y: number
}

function logPoint(p: Point) {
    console.log(p.x, p.y)
}

const point = { x: 0, y: 0 }
logPoint(point) // It's ok!
// 尽管 point 没有被显示声明为 Point 类型，但是 TS 的类型检查比较了 point 与 Point 的形状，两者形状相同，所以认为两者是同一个类型。


// shape-matching 时，仅需要 object's field 的一个子集。
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"

// 尽管 rect 中多出了 width 和 height 属性，但是依旧是可以的，因为 rect 拥有 x,y 两个属性

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