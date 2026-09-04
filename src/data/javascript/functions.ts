import type { Topic } from "../../types";

export const functionsTopics: Topic[] = [
  {
    id: "js-functions",
    title: "Functions",
    description:
      "Deep dive into JavaScript functions including declarations, expressions, arrow functions, closures, IIFEs, higher-order functions, callbacks, and parameter handling.",
    category: "JavaScript",
    difficulty: "Intermediate",
    tags: [
      "functions",
      "closures",
      "arrow functions",
      "IIFE",
      "higher-order functions",
      "callbacks",
      "hoisting",
      "scope",
    ],
    overview:
      "Functions are the fundamental building blocks of JavaScript. They are first-class objects, meaning they can be assigned to variables, passed as arguments, and returned from other functions. Understanding the nuances between declaration styles, scoping rules, closures, and modern parameter handling is essential for writing robust JavaScript and succeeding in technical interviews.",
    concepts: [
      "Function declarations vs function expressions",
      "Arrow functions and lexical this",
      "Closures and lexical scoping",
      "Immediately Invoked Function Expressions (IIFE)",
      "Higher-order functions",
      "First-class functions",
      "Callbacks and the callback pattern",
      "Rest parameters and the spread operator",
      "Default parameters",
      "Function hoisting",
      "The arguments object",
    ],
    questions: [
      {
        id: "js-func-1",
        question:
          "What is the difference between function declarations and function expressions?",
        answer:
          "Function declarations use the `function` keyword followed by a name and are hoisted entirely to the top of their scope, meaning they can be called before the line where they appear in the code. The JavaScript engine moves the entire function definition to the top during the compilation phase, making it available throughout its enclosing scope.\n\nFunction expressions assign an anonymous (or named) function to a variable. Because they rely on variable assignment, they follow the hoisting rules of the variable keyword used — `var` declarations are hoisted but initialized to `undefined`, while `let` and `const` declarations remain in the temporal dead zone until the assignment is reached. Attempting to call a function expression before its assignment throws a TypeError (for `var`) or a ReferenceError (for `let`/`const`).\n\nA named function expression has a name that is only accessible inside its own body, which is useful for recursion and produces clearer stack traces during debugging. An anonymous function expression has no name, which can make stack traces harder to read.\n\nIn practice, the choice between declarations and expressions often comes down to coding style and whether hoisting behavior is desired. Many modern codebases prefer `const` with arrow function expressions for consistency and to avoid accidental reassignment, while function declarations remain popular for top-level utility functions where hoisting improves readability.\n\nBoth forms create Function objects and behave identically at runtime once defined — they can accept parameters, have their own scope, form closures, and be passed as values. The key distinction is purely about when they become available during execution.",
        shortAnswer:
          "Function declarations are hoisted entirely and can be called before their definition in the code. Function expressions are assigned to variables and follow variable hoisting rules, so they cannot be used before the assignment is executed.",
        code: '// Function Declaration — hoisted\nconsole.log(greet("Alice")); // "Hello, Alice!"\n\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\n// Function Expression — NOT hoisted\n// console.log(add(2, 3)); // TypeError: add is not a function\n\nconst add = function (a: number, b: number): number {\n  return a + b;\n};\n\nconsole.log(add(2, 3)); // 5\n\n// Named Function Expression — name is local to the function body\nconst factorial = function fact(n: number): number {\n  return n <= 1 ? 1 : n * fact(n - 1);\n};\n\nconsole.log(factorial(5)); // 120\n// console.log(fact(5)); // ReferenceError: fact is not defined',
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["functions", "hoisting", "declarations", "expressions"],
        commonMistakes: [
          "Assuming function expressions are hoisted the same way as declarations",
          "Forgetting that a named function expression's name is only accessible inside the function body",
          "Using var for function expressions and being surprised that calling it before assignment returns TypeError instead of ReferenceError",
        ],
        followUps: [
          "How does hoisting differ between var, let, and const?",
          "When would you prefer a function declaration over a function expression?",
          "What is the temporal dead zone?",
        ],
        interviewTips: [
          "Be ready to demonstrate the hoisting difference with a quick code example — interviewers love seeing you reason about execution order",
          "Mention named function expressions for recursion and debugging as a bonus point",
        ],
      },
      {
        id: "js-func-2",
        question: "How do arrow functions differ from regular functions?",
        answer:
          "Arrow functions, introduced in ES6, provide a concise syntax for writing function expressions. However, the differences go far beyond syntax — they fundamentally change how `this`, `arguments`, `new.target`, and `super` are handled.\n\nThe most significant difference is that arrow functions do not have their own `this` binding. Instead, they capture the `this` value from the enclosing lexical scope at the time they are defined. This makes them ideal for callbacks where you want to preserve the outer `this`, such as inside class methods or event handlers. Regular functions, on the other hand, determine their `this` dynamically based on how they are called — as a method, a constructor, or via `call`/`apply`/`bind`.\n\nArrow functions cannot be used as constructors. Calling an arrow function with `new` throws a TypeError because they lack an internal [[Construct]] method and do not have a `prototype` property. Regular functions can serve as constructors and will create a new object when invoked with `new`.\n\nArrow functions also do not have an `arguments` object. If you try to access `arguments` inside an arrow function, it will resolve to the `arguments` of the nearest enclosing regular function. To achieve the same functionality, use rest parameters (`...args`). Similarly, arrow functions cannot access `new.target` or `super` on their own — they inherit these from the enclosing scope.\n\nAnother subtle difference is that arrow functions cannot be used as generators — there is no `function*` arrow equivalent. Additionally, `call`, `apply`, and `bind` can be used on arrow functions but will NOT change their `this` value; they can only pass arguments.",
        shortAnswer:
          "Arrow functions do not have their own `this`, `arguments`, or `prototype`. They inherit `this` from the enclosing lexical scope, cannot be used as constructors with `new`, and provide a shorter syntax best suited for callbacks and non-method functions.",
        code: 'const team = {\n  members: ["Alice", "Bob", "Charlie"],\n  teamName: "Engineering",\n\n  // Regular function — `this` depends on call-site\n  listMembersRegular: function () {\n    // `this` is the team object here\n    return this.members.map(function (member) {\n      // `this` is undefined (strict mode) or global — NOT team\n      // return `${this.teamName}: ${member}`; // Bug!\n      return member;\n    });\n  },\n\n  // Arrow function — `this` is lexically inherited\n  listMembersArrow: function () {\n    return this.members.map((member) => {\n      // `this` still refers to the team object\n      return `${this.teamName}: ${member}`;\n    });\n  },\n};\n\nconsole.log(team.listMembersArrow());\n// ["Engineering: Alice", "Engineering: Bob", "Engineering: Charlie"]\n\n// Arrow functions cannot be constructors\nconst Foo = () => {};\n// new Foo(); // TypeError: Foo is not a constructor\n\n// Arrow functions ignore bind/call/apply for `this`\nconst obj = { value: 42 };\nconst arrowFn = () => console.log(this);\narrowFn.call(obj); // Still logs the outer `this`, not obj',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["arrow functions", "this", "lexical scope", "ES6"],
        commonMistakes: [
          "Using arrow functions as object methods and expecting `this` to refer to the object",
          "Trying to use `new` with an arrow function",
          "Assuming call/apply/bind can override `this` in an arrow function",
        ],
        followUps: [
          "When should you avoid using arrow functions?",
          "How does `this` work in class methods vs arrow function class properties?",
          "Can arrow functions be async?",
        ],
        interviewTips: [
          "Focus on the lexical `this` binding — it is by far the most commonly tested difference",
          "Have a concrete example ready showing how `this` behaves differently in a callback",
        ],
      },
      {
        id: "js-func-3",
        question: "What are closures? How do they work?",
        answer:
          "A closure is formed when a function retains access to variables from its lexical scope even after the outer function that created those variables has finished executing. Every function in JavaScript forms a closure at creation time, but the term is most commonly used when an inner function references variables from an outer function and is then used outside that outer function.\n\nWhen the JavaScript engine creates a function, it attaches a hidden internal property called [[Environment]] (or [[Scope]]) that holds a reference to the lexical environment where the function was defined. This environment is a chain of variable objects, one for each enclosing scope, all the way up to the global scope. When the function executes and encounters a variable, the engine walks up this chain until it finds the binding.\n\nClosures work because JavaScript uses lexical scoping — the scope of a variable is determined by its position in the source code, not by the call stack at runtime. When an inner function is returned or passed elsewhere, the variables it references in the outer scope are not garbage collected because the closure keeps a live reference to the environment record. This means the variables persist in memory for as long as the closure exists.\n\nA critical nuance is that closures capture variables by reference, not by value. If the outer variable changes after the closure is created, the closure sees the updated value. This is the classic source of bugs in loops using `var`, where all closures created in the loop share the same variable binding and therefore see the final value.\n\nClosures are the foundation of many JavaScript patterns including data privacy, module pattern, currying, partial application, memoization, and event handler factories. They are also how React hooks like `useState` and `useEffect` maintain state between renders — each render creates a closure over the current state values.",
        shortAnswer:
          "A closure is a function that retains access to variables from its outer (lexical) scope even after the outer function has returned. Closures capture variables by reference, not by value, and are fundamental to patterns like data privacy, currying, and module encapsulation.",
        code: "// Basic closure\nfunction createCounter() {\n  let count = 0; // Enclosed variable — private to the closure\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count,\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.increment()); // 2\nconsole.log(counter.getCount());  // 2\n// count is not accessible directly — true data privacy\n\n// Classic closure bug with var in loops\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Logs: 3, 3, 3  (all share the same `i`)\n\n// Fix with let (block-scoped)\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Logs: 0, 1, 2\n\n// Fix with IIFE (pre-ES6 approach)\nfor (var i = 0; i < 3; i++) {\n  ((j) => {\n    setTimeout(() => console.log(j), 100);\n  })(i);\n}\n// Logs: 0, 1, 2",
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["closures", "lexical scope", "scope chain", "memory"],
        commonMistakes: [
          "Thinking closures capture values at the time of creation — they capture references to variables",
          "Forgetting that closures in loops with `var` share the same binding",
          "Not considering memory implications — closures keep entire scope chains alive",
        ],
        followUps: [
          "How can closures cause memory leaks?",
          "How do closures relate to React hooks?",
          "What is the difference between lexical and dynamic scoping?",
        ],
        interviewTips: [
          "Walk through the loop-with-var closure bug — it is one of the most commonly asked closure questions",
          "Mention practical use cases like data privacy and memoization to show real-world understanding",
        ],
      },
      {
        id: "js-func-4",
        question: "Write an example showing practical use of closures.",
        answer:
          "Closures enable powerful patterns that are used extensively in real-world JavaScript applications. One of the most practical uses is creating factory functions that produce specialized versions of a general function. A `createMultiplier` factory, for example, captures the multiplier value and returns a function that always multiplies by that value — the captured variable acts as configuration.\n\nAnother highly practical pattern is memoization, where a closure captures a cache object. Each time the memoized function is called, it first checks whether the result for the given arguments is already in the cache. If so, it returns the cached value instantly; otherwise, it computes the result, stores it, and returns it. This is the exact mechanism behind `React.useMemo` and libraries like Lodash's `_.memoize`.\n\nClosures also enable the module pattern, which was the primary way to create private state before ES6 classes and modules. By wrapping state in a function and returning only the public API, you guarantee that internal variables cannot be accessed or modified from outside. This encapsulation prevents accidental mutation and provides a clean interface.\n\nEvent handler factories are another common use. Instead of creating inline closures in JSX or adding data attributes, you can create a handler factory that captures the relevant context (like an item ID) and returns a handler function. This keeps event handlers clean and avoids unnecessary re-renders in React when combined with `useCallback`.\n\nPartial application and currying also rely on closures. A partially applied function captures some arguments in the closure and returns a new function that accepts the remaining arguments. This is widely used in functional programming, middleware chains (like Redux middleware), and configuration patterns.",
        shortAnswer:
          "Practical closure uses include memoization (caching computed results), factory functions (creating specialized functions), the module pattern (encapsulating private state), and partial application (pre-filling function arguments).",
        code: '// 1. Memoization — cache expensive computations\nfunction memoize<T extends (...args: string[]) => unknown>(\n  fn: T\n): T {\n  const cache = new Map<string, unknown>();\n  return ((...args: string[]) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  }) as T;\n}\n\nconst slowSquare = (n: string) => {\n  console.log("Computing...");\n  return Number(n) ** 2;\n};\nconst fastSquare = memoize(slowSquare);\nfastSquare("5"); // Computing... → 25\nfastSquare("5"); // → 25 (cached, no log)\n\n// 2. Factory function — create specialized handlers\nfunction createLogger(prefix: string) {\n  return (message: string) => {\n    console.log(`[${prefix}] ${new Date().toISOString()}: ${message}`);\n  };\n}\nconst dbLogger = createLogger("DB");\nconst apiLogger = createLogger("API");\ndbLogger("Connection established");  // [DB] 2026-08-31T...: Connection established\napiLogger("Request received");       // [API] 2026-08-31T...: Request received\n\n// 3. Private state via module pattern\nfunction createBankAccount(initialBalance: number) {\n  let balance = initialBalance;\n  const transactions: string[] = [];\n\n  return {\n    deposit(amount: number) {\n      balance += amount;\n      transactions.push(`+${amount}`);\n      return balance;\n    },\n    withdraw(amount: number) {\n      if (amount > balance) throw new Error("Insufficient funds");\n      balance -= amount;\n      transactions.push(`-${amount}`);\n      return balance;\n    },\n    getBalance: () => balance,\n    getHistory: () => [...transactions],\n  };\n}\n\nconst account = createBankAccount(100);\naccount.deposit(50);   // 150\naccount.withdraw(30);  // 120\n// account.balance — undefined (truly private)',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "JavaScript",
        topicId: "js-functions",
        tags: [
          "closures",
          "memoization",
          "module pattern",
          "factory functions",
        ],
        commonMistakes: [
          "Using JSON.stringify for cache keys without considering argument order or non-serializable values",
          "Forgetting to clone returned data from closures — returning the raw reference breaks encapsulation",
          "Creating closures in tight loops without considering memory overhead",
        ],
        followUps: [
          "How would you implement an LRU cache with closures?",
          "How does React's useCallback relate to closures?",
          "What are the memory implications of memoizing functions that accept many unique arguments?",
        ],
        interviewTips: [
          "Show both simple and complex examples — interviewers want to see that you understand the concept AND can apply it",
        ],
      },
      {
        id: "js-func-5",
        question: "What is an IIFE? Why were they used?",
        answer:
          "An IIFE (Immediately Invoked Function Expression) is a function that is defined and executed in a single statement. The pattern wraps a function in parentheses to make the parser treat it as an expression rather than a declaration, then immediately invokes it with a trailing pair of parentheses. The classic syntax is `(function() { ... })()` or `(function() { ... }())` — both forms are valid.\n\nBefore ES6 introduced block-scoped `let` and `const`, JavaScript only had function scope and global scope. The primary motivation for IIFEs was to create a new scope that prevented variable leakage into the global namespace. By wrapping code in an IIFE, all variables declared with `var` inside it were scoped to the function body and invisible outside. This was essential in the era of script tags, where multiple files shared the global scope and name collisions were a constant risk.\n\nIIFEs were the backbone of the Module Pattern, which combined closures with IIFEs to create modules with private and public members. Libraries like jQuery, Underscore, and Backbone all used IIFEs to encapsulate their internals and expose only a public API on the global object. The Universal Module Definition (UMD) pattern also relied on IIFEs to support both CommonJS and browser globals.\n\nAnother important use case was solving the closure-in-loop problem with `var`. Since `var` is function-scoped, creating closures inside a loop would cause all closures to share the same variable. Wrapping the loop body in an IIFE and passing the loop variable as an argument created a fresh copy per iteration, fixing the bug.\n\nIn modern JavaScript, IIFEs are less common because `let`/`const` provide block scoping, ES modules provide proper encapsulation, and bundlers handle scope isolation automatically. However, IIFEs still appear in legacy codebases, polyfills, and occasionally in modern code when you need to execute an async expression at the top level in environments that do not support top-level `await`.",
        shortAnswer:
          "An IIFE (Immediately Invoked Function Expression) is a function that runs as soon as it is defined. IIFEs were primarily used before ES6 to create private scope, avoid global namespace pollution, and implement the module pattern. They are less necessary now thanks to block scoping and ES modules.",
        code: '// Basic IIFE syntax\nconst result = (function () {\n  const secret = "hidden";\n  return secret.toUpperCase();\n})();\nconsole.log(result); // "HIDDEN"\n// console.log(secret); // ReferenceError\n\n// Module pattern with IIFE\nconst Calculator = (function () {\n  let history: string[] = [];\n\n  function log(operation: string) {\n    history.push(operation);\n  }\n\n  return {\n    add(a: number, b: number) {\n      const result = a + b;\n      log(`${a} + ${b} = ${result}`);\n      return result;\n    },\n    subtract(a: number, b: number) {\n      const result = a - b;\n      log(`${a} - ${b} = ${result}`);\n      return result;\n    },\n    getHistory: () => [...history],\n  };\n})();\n\nCalculator.add(5, 3);       // 8\nCalculator.subtract(10, 4); // 6\nCalculator.getHistory();    // ["5 + 3 = 8", "10 - 4 = 6"]\n\n// IIFE with arrow function (modern)\nconst config = (() => {\n  const env = process.env.NODE_ENV ?? "development";\n  return Object.freeze({\n    isDev: env === "development",\n    apiUrl: env === "production"\n      ? "https://api.example.com"\n      : "http://localhost:3000",\n  });\n})();',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["IIFE", "module pattern", "scope", "encapsulation"],
        commonMistakes: [
          "Forgetting the wrapping parentheses — without them the parser treats it as a function declaration and throws a syntax error",
          "Not realizing that arrow function IIFEs always need wrapping parentheses: (() => {})()",
          "Overusing IIFEs in modern codebases where let/const and ES modules solve the same problem more clearly",
        ],
        followUps: [
          "How do ES modules replace the need for IIFEs?",
          "What is the revealing module pattern?",
          "Can IIFEs accept arguments?",
        ],
        interviewTips: [
          "Explain the historical context — interviewers want to know you understand WHY patterns exist, not just what they are",
          "Mentioning the transition from IIFEs to ES modules shows modern awareness",
        ],
      },
      {
        id: "js-func-6",
        question: "What are higher-order functions?",
        answer:
          "A higher-order function is a function that either takes one or more functions as arguments, returns a function, or both. This is possible in JavaScript because functions are first-class citizens — they can be treated as values, assigned to variables, and passed around just like numbers or strings.\n\nThe most commonly encountered higher-order functions in JavaScript are the array methods `map`, `filter`, `reduce`, `forEach`, `find`, `some`, and `every`. Each of these accepts a callback function that defines the operation to perform on each element. For example, `[1, 2, 3].map(x => x * 2)` passes an arrow function to `map`, which applies it to every element and returns a new array.\n\nHigher-order functions that return functions are equally important. Function factories, decorators, and middleware all follow this pattern. A debounce function, for instance, takes a function and a delay as arguments and returns a new function that delays execution until the specified time has elapsed since the last call. Similarly, Express middleware and Redux middleware are higher-order functions that wrap request handlers or dispatch functions.\n\nHigher-order functions promote code reuse and separation of concerns. Instead of writing a new loop for every array transformation, you compose small, focused functions. This leads to more declarative, readable code. Functional programming libraries like Ramda and Lodash/fp build their entire API around higher-order function composition.\n\nIn React, higher-order components (HOCs) are a direct application of this concept — they are functions that take a component and return a new enhanced component. Although hooks have largely replaced HOCs, understanding the higher-order function pattern is essential for reading legacy React code and for patterns like middleware, decorators, and function composition.",
        shortAnswer:
          "A higher-order function is a function that takes other functions as arguments or returns a function. Common examples include array methods like map, filter, and reduce, as well as patterns like debounce, middleware, and function composition.",
        code: '// Higher-order function that takes a function as argument\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map((n) => n * 2);     // [2, 4, 6, 8, 10]\nconst evens = numbers.filter((n) => n % 2 === 0); // [2, 4]\nconst sum = numbers.reduce((acc, n) => acc + n, 0); // 15\n\n// Higher-order function that returns a function\nfunction withLogging<Args extends unknown[], R>(\n  fn: (...args: Args) => R,\n  label: string\n): (...args: Args) => R {\n  return (...args: Args): R => {\n    console.log(`[${label}] called with:`, args);\n    const result = fn(...args);\n    console.log(`[${label}] returned:`, result);\n    return result;\n  };\n}\n\nconst add = (a: number, b: number) => a + b;\nconst loggedAdd = withLogging(add, "add");\nloggedAdd(3, 4);\n// [add] called with: [3, 4]\n// [add] returned: 7\n\n// Practical: debounce\nfunction debounce<Args extends unknown[]>(\n  fn: (...args: Args) => void,\n  delayMs: number\n): (...args: Args) => void {\n  let timerId: ReturnType<typeof setTimeout> | null = null;\n  return (...args: Args) => {\n    if (timerId) clearTimeout(timerId);\n    timerId = setTimeout(() => fn(...args), delayMs);\n  };\n}\n\nconst handleSearch = debounce((query: string) => {\n  console.log("Searching:", query);\n}, 300);',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: [
          "higher-order functions",
          "functional programming",
          "map",
          "filter",
          "reduce",
        ],
        commonMistakes: [
          "Confusing higher-order functions with callbacks — a callback is the function passed IN; the higher-order function is the one that RECEIVES it",
          "Forgetting that methods like map and filter return new arrays rather than mutating the original",
          "Not preserving type safety when wrapping functions — always propagate generic types",
        ],
        followUps: [
          "How does function composition work?",
          "What is the difference between map and forEach?",
          "How do higher-order components work in React?",
        ],
        interviewTips: [
          "Implement a simple higher-order function like debounce or throttle from scratch — it is a very common interview coding question",
        ],
      },
      {
        id: "js-func-7",
        question: "Explain first-class functions in JavaScript.",
        answer:
          "When we say JavaScript has first-class functions, we mean that functions are treated as first-class citizens — they have the same capabilities as any other value in the language. Specifically, functions can be assigned to variables, stored in data structures like arrays and objects, passed as arguments to other functions, and returned as values from other functions.\n\nThis is not just a theoretical concept — it is the foundation of JavaScript's programming model. When you write `const greet = function(name) { ... }`, you are assigning a function to a variable exactly like you would assign a number or string. When you pass a callback to `addEventListener` or `setTimeout`, you are passing a function as an argument. When a factory function returns a new function, the returned value is a function object.\n\nFirst-class functions enable several critical programming patterns. Higher-order functions, closures, the strategy pattern, event-driven programming, and functional programming concepts like currying and partial application all depend on functions being first-class. Without this property, callbacks, promises, and the entire async programming model in JavaScript would not be possible.\n\nInternally, functions in JavaScript are objects — specifically, instances of the `Function` constructor. They have properties like `name`, `length` (the number of formal parameters), and `prototype`. You can even add custom properties to a function, though this is uncommon. The `typeof` operator returns `\"function\"` for functions, but they are technically a special subtype of object with an internal [[Call]] method.\n\nNot all programming languages have first-class functions. In languages like Java (before version 8), C, and early versions of C++, functions could not be directly passed around as values without workarounds like function pointers or anonymous inner classes. JavaScript's first-class function support, inherited from its Scheme/Lisp influences, is one of its most powerful features.",
        shortAnswer:
          "First-class functions means functions are treated as values — they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures. This enables callbacks, higher-order functions, closures, and functional programming patterns.",
        code: '// Assigning functions to variables\nconst sayHello = (name: string) => `Hello, ${name}`;\n\n// Storing functions in data structures\nconst operations: Record<string, (a: number, b: number) => number> = {\n  add: (a, b) => a + b,\n  subtract: (a, b) => a - b,\n  multiply: (a, b) => a * b,\n};\n\nconsole.log(operations.add(5, 3));      // 8\nconsole.log(operations.multiply(4, 2)); // 8\n\n// Passing functions as arguments\nfunction applyOperation(\n  a: number,\n  b: number,\n  operation: (x: number, y: number) => number\n): number {\n  return operation(a, b);\n}\n\nconsole.log(applyOperation(10, 5, operations.subtract)); // 5\n\n// Returning functions from functions\nfunction createGreeter(greeting: string) {\n  return (name: string) => `${greeting}, ${name}!`;\n}\n\nconst greetInEnglish = createGreeter("Hello");\nconst greetInSpanish = createGreeter("Hola");\nconsole.log(greetInEnglish("Alice")); // "Hello, Alice!"\nconsole.log(greetInSpanish("Bob"));   // "Hola, Bob!"\n\n// Functions are objects — they have properties\nfunction exampleFn(a: number, b: number, c: number) { return a + b + c; }\nconsole.log(exampleFn.name);   // "exampleFn"\nconsole.log(exampleFn.length); // 3 (number of parameters)',
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["first-class functions", "functional programming", "values"],
        commonMistakes: [
          "Confusing first-class functions with higher-order functions — first-class is a language feature, higher-order is a function that uses that feature",
          "Forgetting that `function.length` only counts parameters before the first default parameter or rest parameter",
          "Not realizing you can add properties to functions since they are objects",
        ],
        followUps: [
          "What languages do NOT have first-class functions?",
          "How do first-class functions enable the strategy pattern?",
          "What is the Function constructor and should you use it?",
        ],
        interviewTips: [
          "Briefly define the concept, then immediately show how it enables practical patterns — interviewers want to see applied understanding",
        ],
      },
      {
        id: "js-func-8",
        question: "What are callbacks? What problems can they cause?",
        answer:
          'A callback is a function that is passed as an argument to another function and is intended to be called at a later time — either synchronously (like in `Array.map`) or asynchronously (like in `setTimeout` or API calls). Callbacks are the oldest and most fundamental async pattern in JavaScript, predating Promises and async/await.\n\nSynchronous callbacks are straightforward and are used extensively in array methods, event listeners, and iterator patterns. They execute immediately within the calling function\'s execution and are not inherently problematic. Asynchronous callbacks, however, execute at some point in the future when an operation completes — such as a network request, file read, or timer.\n\nThe primary problem with asynchronous callbacks is "callback hell" or the "pyramid of doom." When multiple async operations depend on each other, each subsequent operation must be nested inside the previous callback, creating deeply indented, hard-to-read code. For example, fetching a user, then their orders, then order details would require three levels of nesting. Error handling compounds the problem because each level needs its own error check or try/catch.\n\nAnother issue is inversion of control — when you pass a callback to a third-party function, you trust that function to call your callback the correct number of times, with the correct arguments, and handle errors properly. If the third-party code has bugs, your callback might be called twice, never, or with unexpected arguments. Promises solve this by giving control back to the caller through a standardized interface.\n\nCallbacks can also cause subtle bugs with error handling. In the Node.js error-first callback convention (`callback(error, result)`), forgetting to check for errors silently swallows failures. Unlike Promises, there is no built-in mechanism for unhandled rejection detection. Modern JavaScript strongly favors Promises and async/await for asynchronous operations, though callbacks remain fundamental for synchronous patterns and event-driven code.',
        shortAnswer:
          'A callback is a function passed to another function to be executed later. While essential for async and event-driven programming, callbacks can cause "callback hell" (deeply nested async chains), inversion of control issues, and difficult error handling. Promises and async/await were introduced to solve these problems.',
        code: '// Synchronous callback — no issues\nconst numbers = [1, 2, 3, 4];\nconst doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8]\n\n// Callback hell — nested async operations\nfunction getUserData(userId: string) {\n  fetchUser(userId, (err, user) => {\n    if (err) { console.error(err); return; }\n    fetchOrders(user.id, (err, orders) => {\n      if (err) { console.error(err); return; }\n      fetchOrderDetails(orders[0].id, (err, details) => {\n        if (err) { console.error(err); return; }\n        console.log(details); // Deeply nested!\n      });\n    });\n  });\n}\n\n// Same logic with Promises — flat and readable\nasync function getUserDataClean(userId: string) {\n  try {\n    const user = await fetchUserAsync(userId);\n    const orders = await fetchOrdersAsync(user.id);\n    const details = await fetchOrderDetailsAsync(orders[0].id);\n    console.log(details);\n  } catch (err) {\n    console.error(err);\n  }\n}\n\n// Type-safe callback pattern\ntype Callback<T> = (error: Error | null, result: T | null) => void;\n\nfunction readFile(path: string, callback: Callback<string>): void {\n  setTimeout(() => {\n    if (!path) {\n      callback(new Error("Path is required"), null);\n      return;\n    }\n    callback(null, `Contents of ${path}`);\n  }, 100);\n}\n\nreadFile("/data.txt", (err, data) => {\n  if (err) { console.error(err.message); return; }\n  console.log(data); // "Contents of /data.txt"\n});',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["callbacks", "async", "callback hell", "error handling"],
        commonMistakes: [
          "Forgetting to return after handling an error in a callback — the rest of the callback still executes",
          "Not handling the case where a callback might be called multiple times by a buggy library",
          "Mixing synchronous and asynchronous callback patterns, leading to unpredictable execution order",
        ],
        followUps: [
          "How do Promises improve on the callback pattern?",
          "What is the error-first callback convention in Node.js?",
          "How does the event loop process async callbacks?",
        ],
        interviewTips: [
          "Show the progression from callbacks to Promises to async/await — interviewers love seeing you understand the evolution of async JavaScript",
          "Mention inversion of control as a specific technical term for callback trust issues",
        ],
      },
      {
        id: "js-func-9",
        question: "Explain rest parameters and the spread operator.",
        answer:
          "Rest parameters and the spread operator both use the `...` syntax but serve opposite purposes. Rest parameters collect multiple individual arguments into a single array, while the spread operator expands an iterable (like an array) into individual elements. Understanding this duality is essential for working with modern JavaScript.\n\nRest parameters are used in function definitions to collect a variable number of arguments into a real array. The syntax places `...` before the last parameter name: `function sum(...numbers: number[])`. Unlike the legacy `arguments` object, rest parameters produce a proper Array instance with access to all array methods like `map`, `filter`, and `reduce`. Rest parameters can only appear as the last parameter in the function signature, and there can only be one rest parameter per function.\n\nThe spread operator is used in function calls, array literals, and object literals to expand an iterable into individual values. In a function call, `Math.max(...numbers)` spreads an array into separate arguments. In an array literal, `[...arr1, ...arr2]` creates a new array by spreading both arrays. In an object literal (ES2018), `{ ...obj1, ...obj2 }` creates a new object by spreading properties from both objects — later properties override earlier ones.\n\nA key distinction from the old `arguments` object: `arguments` is array-like but NOT a real array — it lacks methods like `map` and `forEach`. It is also not available in arrow functions. Rest parameters produce a genuine array and work in all function types. Additionally, `arguments` captures ALL arguments regardless of named parameters, while rest parameters only capture the unnamed excess arguments.\n\nSpread is commonly used for immutable operations in React and Redux — creating new arrays and objects without mutating the originals. Combining rest and spread enables powerful patterns like function forwarding, argument manipulation, and building variadic utility functions. Note that spread performs a shallow copy — nested objects and arrays are still references.",
        shortAnswer:
          "Rest parameters (`...args`) collect multiple arguments into a real array in function definitions. The spread operator (`...arr`) expands an iterable into individual elements in function calls, array literals, and object literals. Both use `...` syntax but serve opposite purposes — rest collects, spread expands.",
        code: '// Rest parameters — collect arguments into an array\nfunction sum(...numbers: number[]): number {\n  return numbers.reduce((total, n) => total + n, 0);\n}\nconsole.log(sum(1, 2, 3, 4)); // 10\n\n// Rest with leading named params\nfunction logTagged(tag: string, ...messages: string[]): void {\n  messages.forEach((msg) => console.log(`[${tag}] ${msg}`));\n}\nlogTagged("INFO", "Server started", "Port 3000");\n// [INFO] Server started\n// [INFO] Port 3000\n\n// Spread in function calls\nconst scores = [92, 87, 95, 78, 100];\nconsole.log(Math.max(...scores)); // 100\n\n// Spread in arrays — shallow clone and merge\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]\nconst clone = [...arr1];           // [1, 2, 3] — new reference\n\n// Spread in objects — immutable updates (common in React/Redux)\ninterface UserState {\n  name: string;\n  age: number;\n  email: string;\n}\n\nconst user: UserState = { name: "Alice", age: 30, email: "alice@example.com" };\nconst updated: UserState = { ...user, age: 31 }; // override age\nconsole.log(updated); // { name: "Alice", age: 31, email: "alice@example.com" }\nconsole.log(user.age); // 30 — original unchanged\n\n// Rest in destructuring\nconst [first, second, ...remaining] = [10, 20, 30, 40, 50];\nconsole.log(first);     // 10\nconsole.log(remaining); // [30, 40, 50]\n\nconst { name, ...rest } = { name: "Bob", age: 25, role: "Dev" };\nconsole.log(rest); // { age: 25, role: "Dev" }',
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["rest parameters", "spread operator", "ES6", "destructuring"],
        commonMistakes: [
          "Placing the rest parameter anywhere other than last in the function signature",
          "Assuming spread creates a deep copy — it only performs a shallow copy",
          "Confusing rest (in definitions — collects) with spread (in calls/literals — expands)",
        ],
        followUps: [
          "How does spread differ from Object.assign()?",
          "How would you deep clone an object without spread?",
          "Can you use spread with Maps, Sets, or generators?",
        ],
        interviewTips: [
          "Clearly state the directional difference: rest collects, spread expands — this simple framing immediately shows understanding",
        ],
      },
      {
        id: "js-func-10",
        question: "What are default parameters?",
        answer:
          'Default parameters, introduced in ES6, allow function parameters to be initialized with default values when no argument is passed or when `undefined` is explicitly passed. Before ES6, developers had to use short-circuit evaluation (`param = param || defaultValue`) or explicit undefined checks, both of which had pitfalls — particularly the short-circuit approach, which treated falsy values like `0`, `""`, and `false` as missing.\n\nThe syntax is straightforward: `function greet(name: string = "World")`. The default value is used only when the argument is `undefined`, NOT when it is `null`, `0`, `""`, `false`, or any other falsy value. This is a crucial distinction from the old `||` pattern and makes default parameters more predictable and correct.\n\nDefault parameters are evaluated at call time, not at function definition time. This means you can use expressions, function calls, or even reference earlier parameters as defaults. For example, `function createUser(name: string, id: string = generateId())` calls `generateId()` each time the function is invoked without an `id` argument. You can also reference earlier parameters: `function rectangle(width: number, height: number = width)` makes height default to width, creating a square.\n\nDefault parameters interact with the `function.length` property in a specific way: parameters with defaults are not counted in `length`. So `function f(a, b = 1, c = 2)` has `length` of 1. Similarly, rest parameters are not counted. This matters when libraries or frameworks inspect function arity.\n\nDefault parameters also have their own scope — they exist in an intermediate scope between the outer scope and the function body scope. This means default value expressions can reference outer variables and earlier parameters, but not variables declared inside the function body. This is a subtle but important detail that can cause confusion in edge cases.',
        shortAnswer:
          "Default parameters let you set fallback values for function arguments using `param = defaultValue` syntax. They activate only when the argument is `undefined` (not null or other falsy values), are evaluated at call time, and can reference earlier parameters or outer variables.",
        code: '// Basic default parameters\nfunction greet(name: string = "World"): string {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet());          // "Hello, World!"\nconsole.log(greet("Alice"));   // "Hello, Alice!"\nconsole.log(greet(undefined));  // "Hello, World!" — undefined triggers default\n\n// Default vs falsy values — only undefined triggers the default\nfunction setCount(count: number = 10): number {\n  return count;\n}\nconsole.log(setCount(0));     // 0 — NOT 10, because 0 is not undefined\nconsole.log(setCount(undefined as unknown as number)); // 10\n\n// Old pattern had bugs with falsy values\nfunction setCountOld(count?: number): number {\n  const c = count || 10; // Bug: setCountOld(0) returns 10!\n  return c;\n}\n\n// Expressions and earlier params as defaults\nlet callCount = 0;\nfunction createItem(\n  name: string,\n  id: string = `item-${++callCount}`,\n  label: string = name.toUpperCase()\n) {\n  return { id, name, label };\n}\nconsole.log(createItem("widget"));   // { id: "item-1", name: "widget", label: "WIDGET" }\nconsole.log(createItem("gadget"));   // { id: "item-2", name: "gadget", label: "GADGET" }\n\n// Default with destructured object parameter\ninterface Options {\n  retries: number;\n  timeout: number;\n  verbose: boolean;\n}\n\nfunction fetchData(\n  url: string,\n  { retries = 3, timeout = 5000, verbose = false }: Partial<Options> = {}\n) {\n  console.log(`Fetching ${url} with ${retries} retries, ${timeout}ms timeout`);\n}\nfetchData("https://api.example.com");\nfetchData("https://api.example.com", { retries: 1, timeout: 10000, verbose: true });',
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["default parameters", "ES6", "function parameters"],
        commonMistakes: [
          "Assuming null triggers the default — only undefined does",
          'Using the old `||` pattern which treats 0, false, and "" as missing',
          "Not realizing default parameters are evaluated at call time, which can cause side effects if the default is a function call",
        ],
        followUps: [
          "How do default parameters affect function.length?",
          "What is the nullish coalescing operator (??) and how does it relate to defaults?",
          "Can you destructure with defaults in function parameters?",
        ],
        interviewTips: [
          "Highlight the difference between undefined and null/falsy triggering — this is the most common gotcha interviewers test",
        ],
      },
      {
        id: "js-func-11",
        question: "What is function hoisting?",
        answer:
          "Function hoisting is the behavior where function declarations are moved to the top of their containing scope during the compilation phase, before any code is executed. This means a function declared with the `function` keyword can be called before the line where it is defined in the source code. The entire function body, not just the declaration, is hoisted.\n\nThis behavior is specific to function declarations — the `function name() { }` syntax. Function expressions, whether assigned with `var`, `let`, or `const`, are NOT fully hoisted. With `var`, the variable declaration is hoisted but initialized to `undefined`, so calling it before the assignment throws `TypeError: not a function`. With `let` and `const`, the variable exists in the temporal dead zone (TDZ) until the declaration is reached, so accessing it throws `ReferenceError`.\n\nThe JavaScript engine processes code in two phases. During the creation phase, it scans for function declarations and variable declarations, allocating memory for them. Function declarations get their full function value immediately, while `var` variables are initialized to `undefined`, and `let`/`const` variables are left uninitialized in the TDZ. During the execution phase, code runs line by line. This two-phase model explains why function declarations are available throughout their scope.\n\nFunction hoisting has a practical purpose: it allows you to organize code with higher-level functions at the top and helper functions at the bottom, improving readability. You can call `main()` at the top of a file and define it and its helpers further down. Many style guides take advantage of this by placing the primary exported function first.\n\nHowever, hoisting can also cause confusion and subtle bugs. If you declare two functions with the same name in the same scope, the second declaration silently overwrites the first. In non-strict mode, function declarations inside blocks (like `if` statements) have inconsistent hoisting behavior across engines. Modern best practice recommends using `const` with function expressions to avoid these ambiguities and make the code's initialization order explicit.",
        shortAnswer:
          "Function hoisting means function declarations are fully moved to the top of their scope during compilation, allowing them to be called before they appear in the code. Function expressions are not hoisted the same way — they follow the hoisting rules of their variable keyword (var, let, or const).",
        code: '// Function declaration — fully hoisted\nconsole.log(square(5)); // 25 — works!\nfunction square(n: number): number {\n  return n * n;\n}\n\n// Function expression with var — partially hoisted\ntry {\n  console.log(cube(3));\n} catch (e) {\n  console.log(e); // TypeError: cube is not a function\n}\nvar cube = function (n: number): number {\n  return n ** 3;\n};\n\n// Function expression with const — TDZ error\ntry {\n  console.log(double(4));\n} catch (e) {\n  console.log(e); // ReferenceError: Cannot access \'double\' before initialization\n}\nconst double = (n: number): number => n * 2;\n\n// Hoisting order: function declarations override var\nvar myFunc: (() => string) | undefined = function () {\n  return "expression";\n};\nfunction myFunc(): string {\n  return "declaration";\n}\n// myFunc() returns "expression" because var assignment\n// runs AFTER hoisting (declaration hoists, then var assigns over it)\n\n// Practical pattern — call first, define below\nfunction main() {\n  const data = loadData();\n  const processed = processData(data);\n  return formatOutput(processed);\n}\n\nfunction loadData() { return [1, 2, 3]; }\nfunction processData(data: number[]) { return data.map((n) => n * 10); }\nfunction formatOutput(data: number[]) { return data.join(", "); }\n\nconsole.log(main()); // "10, 20, 30"',
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["hoisting", "TDZ", "scope", "compilation"],
        commonMistakes: [
          "Thinking that function expressions with var are fully hoisted — only the variable name is hoisted, not the function assignment",
          "Assuming function declarations in if-blocks hoist consistently across all environments",
          "Not realizing that when both a var and function declaration share the same name, the final value depends on execution order",
        ],
        followUps: [
          "How does the temporal dead zone work with let and const?",
          "What happens when you declare a function inside a block in strict vs non-strict mode?",
          "What is the difference between the creation phase and execution phase?",
        ],
        interviewTips: [
          "Draw a mental model of the two-phase execution — creation phase (hoisting) then execution phase — to explain any hoisting question clearly",
        ],
      },
      {
        id: "js-func-12",
        question: "Explain the arguments object vs rest parameters.",
        answer:
          "The `arguments` object is an array-like object available inside all non-arrow function bodies. It contains an entry for each argument passed to the function, indexed starting at 0, and has a `length` property. However, it is NOT a true array — it does not have array methods like `map`, `filter`, `forEach`, or `reduce`. To use array methods on it, you had to convert it with `Array.prototype.slice.call(arguments)` or, in ES6, `Array.from(arguments)`.\n\nRest parameters (`...args`) were introduced in ES6 as a modern replacement for common `arguments` use cases. A rest parameter is a real `Array` instance, so all array methods are available directly. Rest parameters are also explicitly declared in the function signature, making the function's intent and parameter handling clear to readers and to static analysis tools like TypeScript.\n\nThere are several important behavioral differences. The `arguments` object reflects ALL arguments passed, including those that match named parameters, while rest parameters only collect excess arguments not matched by earlier named parameters. In sloppy (non-strict) mode, `arguments` maintains a live link to named parameters — modifying `arguments[0]` changes the first named parameter and vice versa. This coupling does not exist in strict mode or with rest parameters. Arrow functions do not have their own `arguments` — they inherit it from the nearest enclosing regular function.\n\nThe `arguments` object also has a `callee` property (in non-strict mode) that references the currently executing function. This was used for anonymous recursive functions but is forbidden in strict mode due to performance and security concerns. Rest parameters combined with named function expressions provide a better alternative for recursion.\n\nIn modern JavaScript and TypeScript, rest parameters are strongly preferred. They are type-safe, self-documenting, produce real arrays, work in arrow functions, and have no surprising aliasing behavior. The `arguments` object should be considered a legacy feature — the only reason to know about it is to understand and maintain older code.",
        shortAnswer:
          "The `arguments` object is an array-like object available in regular functions containing all passed arguments. Rest parameters (`...args`) are a modern ES6 replacement that produce a real Array, only collect excess arguments, work in arrow functions, and are type-safe. Rest parameters are strongly preferred in modern code.",
        code: '// arguments object — legacy approach\nfunction legacySum() {\n  // arguments is array-like, not a real array\n  console.log(Array.isArray(arguments)); // false\n\n  // Must convert to use array methods\n  const args = Array.from(arguments) as number[];\n  return args.reduce((sum, n) => sum + n, 0);\n}\nconsole.log(legacySum(1, 2, 3, 4)); // 10\n\n// Rest parameters — modern approach\nfunction modernSum(...numbers: number[]): number {\n  console.log(Array.isArray(numbers)); // true\n  return numbers.reduce((sum, n) => sum + n, 0);\n}\nconsole.log(modernSum(1, 2, 3, 4)); // 10\n\n// arguments captures ALL args; rest captures only extras\nfunction example(first: string, second: string, ...others: string[]) {\n  // others contains everything after first and second\n  console.log(`first: ${first}`);\n  console.log(`second: ${second}`);\n  console.log("others:", others);\n}\nexample("a", "b", "c", "d", "e");\n// first: a\n// second: b\n// others: ["c", "d", "e"]\n\n// Arrow functions do NOT have arguments\nconst arrowFn = (...args: number[]) => {\n  // console.log(arguments); // ReferenceError or inherited from outer scope\n  return args.reduce((sum, n) => sum + n, 0);\n};\n\n// Aliasing gotcha in non-strict mode (regular functions only)\nfunction aliasDemo(x: number) {\n  // In sloppy mode, arguments[0] and x are linked\n  console.log(x, arguments[0]); // 10, 10\n  arguments[0] = 99;\n  console.log(x); // 99 in sloppy mode, 10 in strict mode\n}\naliasDemo(10);\n\n// Type-safe variadic function with rest params\nfunction formatItems<T>(formatter: (item: T) => string, ...items: T[]): string[] {\n  return items.map(formatter);\n}\nconst result = formatItems((n: number) => n.toFixed(2), 1, 2.5, 3.14);\nconsole.log(result); // ["1.00", "2.50", "3.14"]',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["arguments", "rest parameters", "ES6", "array-like"],
        commonMistakes: [
          "Trying to use Array.prototype methods directly on arguments without converting it first",
          "Relying on the arguments/parameter aliasing behavior which only exists in non-strict mode",
          "Attempting to access arguments inside an arrow function and not realizing it resolves to the outer scope",
        ],
        followUps: [
          "Why is arguments.callee deprecated in strict mode?",
          "How does TypeScript type the arguments object?",
          "What other array-like objects exist in JavaScript (NodeList, HTMLCollection)?",
        ],
        interviewTips: [
          "Frame this as an evolution story — arguments was the old way, rest parameters are the modern replacement — then list the specific improvements",
          "Mentioning the aliasing gotcha in sloppy mode shows deep knowledge",
        ],
      },
      {
        id: "js-func-13",
        question: "How do you implement currying in JavaScript?",
        answer:
          'Currying is a functional programming technique that transforms a function with multiple arguments into a sequence of functions, each taking a single argument. A curried version of `f(a, b, c)` becomes `f(a)(b)(c)`. Each call returns a new function that captures the previous arguments via closures until all expected arguments have been provided, at which point the original function is executed.\n\nThe simplest form of currying is manual — you nest functions that each take one parameter: `const add = (a) => (b) => a + b`. This works well for functions with a known, small number of parameters. For more general use, you can implement an automatic curry function that inspects the original function\'s `length` property and progressively accumulates arguments until enough have been collected.\n\nCurrying is closely related to partial application but is technically different. Partial application fixes some arguments and returns a function that accepts the remaining arguments — you can fix any number at once. Currying strictly transforms the function so each step accepts exactly one argument. In practice, many JavaScript "curry" implementations support both patterns, allowing you to pass multiple arguments at once for convenience.\n\nCurrying enables powerful composition patterns. You can create specialized versions of generic functions without calling them: `const double = multiply(2)` creates a doubler from a curried multiply. This is the foundation of point-free programming and is used extensively in libraries like Ramda. In React, curried functions are useful for creating event handler factories and reusable configuration functions.\n\nTypeScript typing for curry functions can be challenging because the return type changes depending on how many arguments have been supplied. Advanced implementations use conditional types and tuple manipulation to provide full type safety, but simpler typed versions work well for most practical use cases.',
        shortAnswer:
          "Currying transforms a multi-argument function into a chain of single-argument functions: `f(a, b, c)` becomes `f(a)(b)(c)`. Each call returns a new closure capturing previous arguments. It enables partial application, function composition, and creating specialized functions from generic ones.",
        code: '// Manual currying\nconst multiply = (a: number) => (b: number): number => a * b;\nconst double = multiply(2);\nconst triple = multiply(3);\nconsole.log(double(5));  // 10\nconsole.log(triple(5));  // 15\n\n// Generic curry utility\nfunction curry<Args extends unknown[], R>(\n  fn: (...args: Args) => R\n): (...args: Partial<Args> extends infer P ? unknown[] : never) => unknown {\n  return function curried(...args: unknown[]): unknown {\n    if (args.length >= fn.length) {\n      return fn(...args as unknown as Args);\n    }\n    return (...moreArgs: unknown[]) => curried(...args, ...moreArgs);\n  };\n}\n\nfunction addThree(a: number, b: number, c: number): number {\n  return a + b + c;\n}\n\nconst curriedAdd = curry(addThree);\nconsole.log(curriedAdd(1)(2)(3));    // 6\nconsole.log(curriedAdd(1, 2)(3));    // 6\nconsole.log(curriedAdd(1)(2, 3));    // 6\nconsole.log(curriedAdd(1, 2, 3));    // 6\n\n// Practical: curried event handler factory in React\nconst handleFieldChange =\n  (fieldName: string) =>\n  (event: { target: { value: string } }) => {\n    console.log(`Field "${fieldName}" changed to: ${event.target.value}`);\n  };\n\n// In JSX: onChange={handleFieldChange("email")}\nconst onEmailChange = handleFieldChange("email");\nonEmailChange({ target: { value: "test@example.com" } });\n// Field "email" changed to: test@example.com\n\n// Curried data transformation pipeline\nconst filterBy = <T,>(predicate: (item: T) => boolean) =>\n  (items: T[]): T[] => items.filter(predicate);\n\nconst mapWith = <T, U>(transform: (item: T) => U) =>\n  (items: T[]): U[] => items.map(transform);\n\nconst getActiveUserNames = (users: Array<{ name: string; active: boolean }>) => {\n  const onlyActive = filterBy<{ name: string; active: boolean }>((u) => u.active);\n  const toNames = mapWith<{ name: string; active: boolean }, string>((u) => u.name);\n  return toNames(onlyActive(users));\n};\n\nconst users = [\n  { name: "Alice", active: true },\n  { name: "Bob", active: false },\n  { name: "Charlie", active: true },\n];\nconsole.log(getActiveUserNames(users)); // ["Alice", "Charlie"]',
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "JavaScript",
        topicId: "js-functions",
        tags: [
          "currying",
          "partial application",
          "functional programming",
          "closures",
        ],
        commonMistakes: [
          "Confusing currying (one arg at a time) with partial application (fixing some args) — though many JS implementations blend both",
          "Not accounting for functions with default or rest parameters when using fn.length to determine arity",
          "Over-currying simple functions where a plain function call would be more readable",
        ],
        followUps: [
          "What is the difference between currying and partial application?",
          "How does Ramda handle currying differently from Lodash?",
          "How would you type a fully generic curry function in TypeScript?",
        ],
        interviewTips: [
          "Start with a simple manual example, then show the generic curry utility — this demonstrates both understanding and practical skill",
        ],
      },
      {
        id: "js-func-14",
        question: "Explain call, apply, and bind methods on functions.",
        answer:
          "Every JavaScript function inherits three methods from `Function.prototype` that allow you to explicitly set the `this` context: `call`, `apply`, and `bind`. These methods exist because `this` in regular functions is determined by how a function is called, not where it is defined, and sometimes you need to control that context explicitly.\n\n`Function.prototype.call(thisArg, arg1, arg2, ...)` invokes the function immediately with `thisArg` as the `this` value, and subsequent arguments passed individually. `Function.prototype.apply(thisArg, [argsArray])` does the same thing, but accepts arguments as an array (or array-like object). The mnemonic is: Call takes a Comma-separated list, Apply takes an Array. Before ES6 spread syntax, `apply` was the standard way to pass an array of arguments to functions like `Math.max`.\n\n`Function.prototype.bind(thisArg, arg1, arg2, ...)` does NOT invoke the function immediately. Instead, it returns a new function with `this` permanently bound to `thisArg` and optionally pre-filled arguments (partial application). The bound function remembers its `this` regardless of how it is later called — even with `new`, `call`, or `apply`. This is particularly useful for event handlers and callbacks where `this` would otherwise be lost.\n\nIn React class components, `bind` was commonly used in the constructor to ensure event handler methods had the correct `this`: `this.handleClick = this.handleClick.bind(this)`. This pattern has been largely replaced by arrow function class properties, which lexically capture `this`. However, understanding `bind` remains important for reading legacy code and for cases where you need partial application.\n\nImportant edge cases: calling `call`, `apply`, or `bind` on an arrow function does NOT change its `this` — arrow functions always use lexical `this`. In strict mode, passing `null` or `undefined` as `thisArg` to `call` or `apply` keeps `this` as `null`/`undefined`. In sloppy mode, it defaults to the global object. `bind` can be called multiple times, but only the first binding takes effect — subsequent `bind` calls create new wrappers but cannot change the inner `this`.",
        shortAnswer:
          "`call` and `apply` invoke a function immediately with a specified `this` — call takes arguments individually, apply takes them as an array. `bind` returns a new function with `this` permanently set. These methods are used for explicit context control, method borrowing, and partial application.",
        code: 'const person = {\n  name: "Alice",\n  greet(greeting: string, punctuation: string): string {\n    return `${greeting}, I\'m ${this.name}${punctuation}`;\n  },\n};\n\nconst bob = { name: "Bob" };\n\n// call — invoke with individual arguments\nconsole.log(person.greet.call(bob, "Hi", "!"));\n// "Hi, I\'m Bob!"\n\n// apply — invoke with arguments as an array\nconsole.log(person.greet.apply(bob, ["Hey", "."]));\n// "Hey, I\'m Bob."\n\n// bind — returns a new permanently-bound function\nconst bobGreet = person.greet.bind(bob, "Hello");\nconsole.log(bobGreet("!")); // "Hello, I\'m Bob!" — only needs remaining args\nconsole.log(bobGreet("?")); // "Hello, I\'m Bob?"\n\n// Practical: method borrowing\nconst arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };\nconst realArray = Array.prototype.slice.call(arrayLike);\nconsole.log(realArray); // ["a", "b", "c"]\n\n// Practical: bind in React class component\nclass SearchComponent {\n  query: string;\n\n  constructor() {\n    this.query = "";\n    this.handleChange = this.handleChange.bind(this);\n  }\n\n  handleChange(event: { target: { value: string } }) {\n    this.query = event.target.value;\n    console.log("Query:", this.query);\n  }\n}\n\n// Partial application with bind\nfunction log(level: string, timestamp: string, message: string) {\n  console.log(`[${level}] ${timestamp}: ${message}`);\n}\n\nconst errorLog = log.bind(null, "ERROR");\nerrorLog("2026-08-31", "Something went wrong");\n// [ERROR] 2026-08-31: Something went wrong\n\n// bind does NOT work on arrow functions for `this`\nconst arrowFn = () => console.log(this);\nconst bound = arrowFn.bind({ custom: true });\nbound(); // Still logs the outer `this`, ignores bind',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functions",
        tags: ["call", "apply", "bind", "this", "context"],
        commonMistakes: [
          "Forgetting that bind returns a NEW function — the original is unchanged",
          "Trying to use call/apply/bind to change `this` on an arrow function",
          "Binding a function multiple times expecting each bind to override the previous one",
        ],
        followUps: [
          "How would you implement your own bind function (polyfill)?",
          "How does call/apply performance compare to direct invocation?",
          "When would you use apply over the spread operator?",
        ],
        interviewTips: [
          'Use the mnemonic "Call = Comma, Apply = Array" to quickly explain the difference, then discuss bind separately as a deferred version',
        ],
      },
    ],
  },
];
