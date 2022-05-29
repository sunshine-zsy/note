function printId(id: number | string) {
  console.log(id.toUpperCase());
}


function printOtherId(id: number | string) {
  if (typeof id === 'number') {
    console.log('number')
  } else {
    console.log('string')
  }
}

type Point = {
  name: string
  age: number
}

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

type Box = {
  width: number
}

type Box = {
  height: number
}

let x: 'hello' = 'hello'

x = 'hll' // error

function handleRequest(url: string, method: 'GET' | 'POST') {

}

const req = { url: 'https://xxx', method: 'GET' } as const
// 这里假设
handleRequest(req.url, req.method)

function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}