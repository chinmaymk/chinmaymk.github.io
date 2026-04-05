---
title: "Beauty of Closure in JavaScript"
date: 2013-09-27
description: "How closures enable elegant encapsulation in JavaScript"
---

Closure is one of the good parts in JavaScript. It's an amazing way to enable access of local variables from a parent function scope, irrespective of the context in which the function was invoked.

**Problem statement:** Write a function which will take a digit as input and output a verbal representation of the same.

**Solution 1:**

```javascript
var numberMapping = ['zero','one','two','three','four','five','six','seven','eight','nine'];

function getNumber(number) {
    return numberMapping[number] ? numberMapping[number] : 'Invalid input';
}
```

Problem: `numberMapping` array is dangling in global namespace, could be modified anywhere in code. Always try to avoid global variables.

**Solution 2:**

```javascript
function getNumber(number) {
    var numberMapping = ['zero','one','two','three','four','five','six','seven','eight','nine'];
    return numberMapping[number] ? numberMapping[number] : 'Invalid input';
}
```

Solves the global problem but `numberMapping` array will be initialized every time `getNumber` is called.

**Time to use closure:**

```javascript
var getNumber = (function() {
    var numberMapping = ['zero','one','two','three','four','five','six','seven','eight','nine'];
    return function (number) {
        return numberMapping[number] ? numberMapping[number] : 'Invalid input';
    }
})();
```

This executes an anonymous function and stores the returned function in `getNumber`. The `numberMapping` is encapsulated and only initialized once. The inner function has access to `numberMapping` because of closure.

This approach is helpful in many conditions, especially for writing object-oriented code in JavaScript. Using closure helps write beautiful code throughout the codebase.
