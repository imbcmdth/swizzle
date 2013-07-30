# SWIZZLE

Arbitrarily change the order of a function's parameters.

[![browser support](https://ci.testling.com/imbcmdth/swizzle.png)](https://ci.testling.com/imbcmdth/swizzle)

## Contents

* [Installation](#install)

* [Basic Usage](#basic-usage)

* [Intermediate Usage](#intermediate-usage)

* [API](#api)

* [What are they saying?](#what-are-they-saying-about-swizzle)

* [Versions](#versions)

* [License](#license---mit)

## Install
````bash

npm install swizzle
````

..then `require` swizzle:

````javascript
var swizzle = require('swizzle');
````

### In the browser, traditional

For the *browser*, add the following to your pages:

````html
<script src="swizzle.js"></script>
````

And the global function `swizzle` will be available.

### In the browser, using AMD (require.js)

...Or using AMD in the browser:

````javascript
require(["swizzle"], function(swizzle) {
	// ...
});
````

## Basic Usage

```javascript
function subtractAB (a, b) {
	return a - b;
}

//-- Creating a swizzled function is pretty straight
//-- forward:
var subtractBA = swizzle(subtractAB, [1, 0]);

//-- Now, we have a subtract that will flip the order of
//-- arguments which is quite useful for partial application

var subtract3 = subtractBA.bind(null, 3);

[10, 99, 18].map(subtract3); //=> [7, 96, 15]

//-- The thing to remember is that the array serves as a
//-- remapping of parameters in a "from" sense.

//-- In other words, the array specifies where the parameter
//-- in that position in the original function's parameter list
//-- obtains its value from the new function's argument list.

//-- Some examples to help illustrate the *from* quality:

function ABC(a, b, c) {
	return [a, b, c];
}
//  Destination Param:  A  B  C
var BAC = swizzle(ABC, [1, 0, 2]);
BAC(1, 2, 3) //=> [2, 1, 3]

var CBA = swizzle(ABC, [2, 1, 0]);
CBA(1, 2, 3) //=> [3, 2, 1]

var CAC = swizzle(ABC, [2, 0, 2]);
CAC(1, 2, 3) //=> [3, 1, 3]

```

## Intermediate Usage

```javascript
//-- Swizzle can also be added to Function.prototype if that
//-- is how you roll:

Function.prototype.swizzle = swizzle;

var multDiv = function(a, b, c) {
	return a * b / c;
}

//-- Reorder to place the divisor first and then partially 
//-- apply divisor:
var multDivBy2 = multDiv.swizzle([1, 2, 0]).bind(null, 2);

[3, 4, 5, 10].reduce(multDiv2) //=> 75  ie. product(numbers) / (2 ^ length - 1)

//-- Swizzle can even rearrange the arguments of constructor functions
//-- for easier partial application of those silly little things:

function Rectangle(w, h) {
	this.w = w;
	this.h = h;
}

Rectangle.prototype.area = function(){
	return this.w * this.h;
}

var Rect30H = swizzle(Rectangle, [1, 0]).bind(null, 30);

var r20x30 = new Rect30H(20);

r20x30.area() //=> 600
````

## API

`swizzle( yourFunction , paramPositions )`

* *yourFunction* `function` The function to which you wish to add some secret sauce. Swizzle returns a function with exactly the same arity as the function you pass into it which helps if you curry them later.

* *paramPositions* `array` The positions in the arguments of the new function that the original function's arguments will each be drawn *from*.

There are no limitations imposed on the `paramPositions` array. It tries it's best to do what you ask of it.

For example, if you have a function that takes three arguments. `swizzle(fn, [2, 3, 0])` says "get the first argument(0) from arguments[2], the second from arguments[3], and the third from arguments[0]."

That's right! We just turned a 3 parameter function into one that takes 4 parameters but ignores the second argument passed into it. Pretty cool.

## What are *they* saying about Swizzle?

Absolutely nothing!

## Versions

* [v1.0.0](https://github.com/imbcmdth/swizzle/archive/v1.0.0.zip) Initial functionality

## License - MIT

> Copyright (C) 2013 Jon-Carlos Rivera
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
