import type { Topic } from "../../types";

export const functionalTopics: Topic[] = [
  {
    id: "js-functional",
    title: "Functional Programming",
    description:
      "Core functional programming concepts in JavaScript including pure functions, immutability, higher-order functions, composition, currying, and common FP patterns used in modern codebases.",
    category: "JavaScript",
    difficulty: "Intermediate",
    tags: [
      "functional programming",
      "pure functions",
      "immutability",
      "higher-order functions",
      "composition",
      "currying",
      "map",
      "filter",
      "reduce",
    ],
    overview:
      "Functional programming (FP) is a paradigm that treats computation as the evaluation of mathematical functions and avoids changing state or mutable data. JavaScript is a multi-paradigm language with strong support for FP through first-class functions, closures, and built-in array methods like map, filter, and reduce. Understanding FP principles leads to more predictable, testable, and maintainable code. Modern libraries such as React, Redux, and RxJS are deeply rooted in functional concepts, making FP knowledge essential for front-end developers.",
    concepts: [
      "Pure functions and referential transparency",
      "Immutability and persistent data structures",
      "Higher-order functions",
      "Function composition and pipelines",
      "Array methods: map, filter, reduce",
      "Currying and partial application",
      "Side effects and effect management",
      "Declarative vs imperative programming",
      "Closures as a functional tool",
      "Point-free style",
    ],
    questions: [
      {
        id: "js-fp-1",
        question: "What are pure functions? Why are they important?",
        answer:
          "A pure function is a function that, given the same input, always returns the same output and produces no side effects. This means it does not modify any external state, does not rely on mutable external variables, and does not perform I/O operations such as network requests, DOM manipulation, or logging. The output is determined entirely by its input arguments.\n\nPure functions are foundational to functional programming because they provide referential transparency — you can replace a function call with its return value without changing the program's behavior. This property makes code dramatically easier to reason about, debug, and test. When you know a function is pure, you know it cannot be responsible for unexpected state changes elsewhere in the application.\n\nTesting pure functions is straightforward because they require no mocking of external dependencies. You simply pass inputs and assert outputs. This eliminates an entire class of flaky tests caused by shared mutable state or environment-dependent behavior.\n\nPure functions also enable powerful optimizations. Because their output depends only on their input, results can be safely cached (memoized). React leverages this idea extensively — React.memo, useMemo, and useCallback all rely on the assumption that rendering functions behave purely with respect to their props and state.\n\nIn practice, not every function in an application can be pure — you need side effects to do useful work. The key insight from FP is to push side effects to the boundaries of your system and keep the core logic pure. This separation makes the codebase more modular and easier to refactor.",
        shortAnswer:
          "A pure function always returns the same output for the same input and has no side effects. They are important because they are predictable, easy to test, safe to memoize, and make code easier to reason about and debug.",
        code: "// Pure function — output depends only on input\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\n// Impure — depends on external mutable state\nlet taxRate = 0.2;\nfunction calculateTax(price: number): number {\n  return price * taxRate; // taxRate can change\n}\n\n// Impure — produces a side effect\nfunction logAndReturn(value: number): number {\n  console.log(value); // side effect\n  return value;\n}\n\n// Memoization works safely with pure functions\nfunction memoize<T extends (...args: string[]) => unknown>(fn: T): T {\n  const cache = new Map<string, unknown>();\n  return ((...args: string[]) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  }) as T;\n}\n\nconst memoizedAdd = memoize((a: string, b: string) =>\n  Number(a) + Number(b)\n);",
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "pure functions",
          "side effects",
          "referential transparency",
          "memoization",
        ],
        commonMistakes: [
          "Assuming a function is pure when it reads from a mutable variable in an outer scope",
          "Forgetting that mutating an input argument (object or array) is a side effect even if nothing else external is touched",
          "Confusing deterministic output with purity — a function that logs and returns a value is deterministic but not pure",
        ],
        followUps: [
          "How does React rely on function purity for rendering and reconciliation?",
          "What is referential transparency and how does it relate to pure functions?",
          "How would you refactor an impure function into a pure one?",
        ],
        interviewTips: [
          "Give concrete before/after examples showing an impure function refactored to a pure one — interviewers love practical demonstrations",
          "Mention React's reliance on pure components to show real-world relevance",
        ],
      },
      {
        id: "js-fp-2",
        question:
          "What is immutability and how do you achieve it in JavaScript?",
        answer:
          "Immutability means that once a data structure is created, it cannot be changed. Instead of modifying existing data, you create new copies with the desired changes. This is a core principle of functional programming and eliminates an entire category of bugs caused by unexpected mutations to shared state.\n\nIn JavaScript, primitive values (strings, numbers, booleans, etc.) are already immutable. The challenge lies with objects and arrays, which are mutable by default. When you assign an object to a new variable, both variables reference the same object in memory, so mutating through one reference affects the other. This is the root cause of many subtle bugs in complex applications.\n\nThe simplest way to achieve immutability is through the spread operator and methods that return new arrays or objects. For arrays, prefer map, filter, concat, and slice over push, pop, splice, and sort (which mutate in place). For objects, use the spread operator or Object.assign to create shallow copies with updated properties. For nested structures, you need to spread at each level — this is called structural sharing.\n\nObject.freeze provides runtime immutability enforcement but only at the top level (shallow freeze). A deep freeze requires recursion. TypeScript's Readonly<T> and ReadonlyArray<T> utility types enforce immutability at compile time, which is preferable because there is zero runtime cost. Libraries like Immer simplify immutable updates by letting you write mutative-looking code inside a produce callback, which is then translated into immutable operations.\n\nImmutability is especially important in React and Redux. React's reconciliation relies on reference equality checks to detect state changes — if you mutate an object in place, React cannot detect the change and will skip re-rendering. Redux reducers are required to return new state objects for the same reason.",
        shortAnswer:
          "Immutability means data cannot be changed after creation — you create new copies with updates instead. In JavaScript, use the spread operator, Object.freeze, non-mutating array methods, TypeScript Readonly types, or libraries like Immer to enforce it.",
        code: '// Immutable object update with spread\nconst user = { name: "Alice", age: 30, address: { city: "NYC" } };\nconst updatedUser = { ...user, age: 31 };\n\n// Nested immutable update (structural sharing)\nconst movedUser = {\n  ...user,\n  address: { ...user.address, city: "LA" },\n};\n\n// Immutable array operations\nconst numbers = [1, 2, 3, 4];\nconst added = [...numbers, 5];          // [1, 2, 3, 4, 5]\nconst removed = numbers.filter(n => n !== 3); // [1, 2, 4]\nconst updated = numbers.map(n => (n === 2 ? 20 : n)); // [1, 20, 3, 4]\n\n// Object.freeze (shallow)\nconst config = Object.freeze({ api: "/v1", timeout: 3000 });\n// config.timeout = 5000; // silently fails (or throws in strict mode)\n\n// Deep freeze utility\nfunction deepFreeze<T extends Record<string, unknown>>(obj: T): Readonly<T> {\n  Object.keys(obj).forEach((key) => {\n    const val = obj[key];\n    if (val && typeof val === "object" && !Object.isFrozen(val)) {\n      deepFreeze(val as Record<string, unknown>);\n    }\n  });\n  return Object.freeze(obj);\n}\n\n// TypeScript compile-time immutability\ninterface AppState {\n  readonly users: ReadonlyArray<{ readonly name: string }>;\n  readonly count: number;\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "immutability",
          "spread operator",
          "Object.freeze",
          "Immer",
          "state management",
        ],
        commonMistakes: [
          "Using Object.freeze and assuming nested objects are also frozen — it is only a shallow freeze",
          "Mutating arrays with push/splice inside a React setState or Redux reducer, then wondering why the UI does not update",
          "Forgetting that the spread operator only performs a shallow copy, so deeply nested mutations still affect the original",
        ],
        followUps: [
          "How does Immer achieve immutable updates with a mutable API?",
          "Why does React require immutable state updates for correct re-rendering?",
          "What are the performance implications of creating new objects on every update?",
        ],
        interviewTips: [
          "Demonstrate awareness of the shallow vs deep copy distinction — this is a common follow-up trap",
          "Mention TypeScript Readonly types as a zero-cost compile-time alternative to Object.freeze",
        ],
      },
      {
        id: "js-fp-3",
        question: "Explain map, filter, and reduce with examples.",
        answer:
          "map, filter, and reduce are the three fundamental higher-order array methods in JavaScript that form the backbone of functional data transformation. They replace imperative for-loops with declarative, composable operations that clearly express intent.\n\nArray.prototype.map transforms every element in an array by applying a callback function and returns a new array of the same length. It is a one-to-one transformation — each input element produces exactly one output element. The original array is not modified. Common uses include transforming API response data, converting between data formats, and rendering lists in React via JSX.\n\nArray.prototype.filter creates a new array containing only the elements for which the callback returns a truthy value. It is a many-to-fewer transformation — the output array length is less than or equal to the input. Use it for searching, removing items, or applying business rules to datasets. Chaining filter with map is an extremely common pattern: filter selects the relevant subset, then map transforms it.\n\nArray.prototype.reduce is the most powerful and general of the three — both map and filter can be implemented using reduce. It iterates over the array while maintaining an accumulator value that is updated on each step and returned at the end. The accumulator can be any type: a number (for sums), a string, an object (for grouping or indexing), or even another array. The initial value of the accumulator is passed as the second argument to reduce and should always be provided explicitly to avoid unexpected behavior when the array is empty.\n\nThese methods are designed to be chained together in a fluent pipeline: array.filter(...).map(...).reduce(...). Each step in the pipeline produces a new array, making the transformations easy to read, test, and reorder. One performance consideration is that each chained method iterates the entire array, so for very large datasets a single reduce that combines all operations may be more efficient, though readability usually outweighs this concern.",
        shortAnswer:
          "map transforms each element and returns a new array of the same length. filter returns a new array with only elements that pass a test. reduce iterates the array while building up an accumulator value into any shape. All three are non-mutating and can be chained for expressive data pipelines.",
        code: 'const products = [\n  { name: "Laptop", price: 999, inStock: true },\n  { name: "Phone", price: 699, inStock: false },\n  { name: "Tablet", price: 499, inStock: true },\n  { name: "Watch", price: 299, inStock: true },\n];\n\n// map — transform each element\nconst names = products.map((p) => p.name);\n// ["Laptop", "Phone", "Tablet", "Watch"]\n\nconst withTax = products.map((p) => ({\n  ...p,\n  priceWithTax: +(p.price * 1.2).toFixed(2),\n}));\n\n// filter — select a subset\nconst available = products.filter((p) => p.inStock);\n// [{ name: "Laptop", ... }, { name: "Tablet", ... }, { name: "Watch", ... }]\n\nconst affordable = products.filter((p) => p.price < 500);\n\n// reduce — accumulate into any shape\nconst totalValue = products.reduce((sum, p) => sum + p.price, 0);\n// 2496\n\n// reduce to group by a property\nconst grouped = products.reduce<Record<string, typeof products>>(\n  (acc, product) => {\n    const key = product.inStock ? "available" : "soldOut";\n    return { ...acc, [key]: [...(acc[key] ?? []), product] };\n  },\n  {},\n);\n\n// Chaining — pipeline of transformations\nconst discountedAvailable = products\n  .filter((p) => p.inStock)\n  .map((p) => ({ ...p, price: +(p.price * 0.9).toFixed(2) }))\n  .reduce((total, p) => total + p.price, 0);\n// sum of 10%-discounted prices for in-stock items',
        language: "typescript",
        difficulty: "Beginner",
        type: "Coding",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "map",
          "filter",
          "reduce",
          "array methods",
          "data transformation",
        ],
        commonMistakes: [
          "Forgetting to return a value from the map callback (arrow function with curly braces needs an explicit return)",
          "Omitting the initial value in reduce, which causes the first element to be used as the accumulator and throws on empty arrays",
          "Using forEach when map or filter would be more appropriate — forEach returns undefined and encourages side effects",
        ],
        followUps: [
          "How would you implement map and filter using only reduce?",
          "What is flatMap and when would you use it over map?",
          "How do these methods compare in performance to a traditional for-loop on very large arrays?",
        ],
        interviewTips: [
          "When asked to solve a data transformation problem, reach for map/filter/reduce first — it signals functional thinking",
          "Be prepared to implement reduce from scratch as a follow-up question",
        ],
      },
      {
        id: "js-fp-4",
        question: "What is currying? Implement a curry function.",
        answer:
          "Currying is the technique of transforming a function that takes multiple arguments into a sequence of functions that each take a single argument. A curried function does not perform its computation until all arguments have been supplied. When called with fewer arguments than it expects, it returns a new function that waits for the remaining ones. The term comes from mathematician Haskell Curry.\n\nFor example, a function add(a, b) becomes curry(add) which can be called as curried(1)(2) or curried(1) followed later by the returned function being called with (2). This enables partial application — you can create specialized versions of general functions by fixing some arguments upfront. For instance, const addTen = curried(10) creates a reusable function that adds 10 to any number.\n\nCurrying is particularly useful for creating function pipelines and point-free compositions. When every function takes a single argument, composition becomes trivial: compose(f, g)(x) simply applies g to x, then f to the result. Libraries like Ramda and lodash/fp use currying extensively to make their utility functions composable. In React, curried event handlers are a common pattern: const handleChange = (field: string) => (event: Event) => setState({ [field]: event.target.value }).\n\nA general-purpose curry implementation checks the function's arity (the number of expected arguments via fn.length). If enough arguments have been collected, it calls the original function. Otherwise, it returns a new function that collects more arguments. The implementation typically uses recursion or a closure that accumulates arguments across calls.\n\nWhile currying and partial application are related, they are distinct concepts. Currying always produces a chain of unary functions (one argument each), whereas partial application fixes some arguments and returns a function that takes the remaining ones all at once. In practice, most JavaScript curry implementations blend the two — they allow passing multiple arguments at once for convenience.",
        shortAnswer:
          "Currying transforms a multi-argument function into a chain of single-argument functions. Each call returns a new function until all arguments are provided, at which point the original function executes. It enables partial application and makes functions easily composable.",
        code: '// Manual currying\nfunction addManual(a: number): (b: number) => number {\n  return function (b: number): number {\n    return a + b;\n  };\n}\nconst addFive = addManual(5);\nconsole.log(addFive(3)); // 8\n\n// General-purpose curry function\nfunction curry<F extends (...args: never[]) => unknown>(\n  fn: F,\n): (...args: unknown[]) => unknown {\n  const arity = fn.length;\n\n  function curried(this: unknown, ...args: unknown[]): unknown {\n    if (args.length >= arity) {\n      return fn.apply(this, args as Parameters<F>);\n    }\n    return (...moreArgs: unknown[]) =>\n      curried.apply(this, [...args, ...moreArgs]);\n  }\n\n  return curried;\n}\n\n// Usage\nfunction multiply(a: number, b: number, c: number): number {\n  return a * b * c;\n}\n\nconst curriedMultiply = curry(multiply);\nconsole.log(curriedMultiply(2)(3)(4));    // 24\nconsole.log(curriedMultiply(2, 3)(4));    // 24\nconsole.log(curriedMultiply(2)(3, 4));    // 24\n\n// Practical example: configurable formatter\nconst formatCurrency = curry(\n  (symbol: string, decimals: number, value: number): string =>\n    \\`\\${symbol}\\${value.toFixed(decimals)}\\`\n);\n\nconst formatUSD = formatCurrency("$", 2);\nconst formatEUR = formatCurrency("€", 2);\n\nconsole.log(formatUSD(19.99));  // "$19.99"\nconsole.log(formatEUR(24.5));   // "€24.50"',
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "currying",
          "partial application",
          "closures",
          "function composition",
        ],
        commonMistakes: [
          "Relying on fn.length when the function uses default parameters or rest parameters — these do not count toward arity",
          "Confusing currying with partial application — currying always returns unary functions, partial application fixes arbitrary arguments",
          "Forgetting to preserve the this context when currying methods that depend on it",
        ],
        followUps: [
          "How does currying differ from partial application?",
          "How would you curry a variadic function (one with no fixed arity)?",
          "Why do libraries like Ramda curry all their functions by default?",
        ],
        interviewTips: [
          "Be ready to write the curry utility from scratch — focus on the recursive structure and the arity check",
          "Show a practical use case like reusable configuration or event handler factories to ground the concept",
        ],
      },
      {
        id: "js-fp-5",
        question:
          "What is partial application? How is it different from currying?",
        answer:
          'Partial application is the process of fixing a number of arguments to a function, producing a new function with a smaller arity. Unlike currying, which transforms a function into a chain of unary (single-argument) functions, partial application allows you to fix any number of arguments at once and returns a function that accepts the remaining arguments together. The result does not have to be unary.\n\nFor example, if you have a function log(level, timestamp, message), you can partially apply the first two arguments to create a specialized function infoLog(message) that always uses "INFO" as the level and the current timestamp. The key distinction is that partial application is a one-step operation that fixes some arguments, while currying restructures the entire function signature into nested unary calls.\n\nJavaScript provides a built-in mechanism for partial application via Function.prototype.bind. While bind is primarily used to fix the this context, it also accepts additional arguments that are prepended to the argument list of future calls. You can also implement partial application manually using closures or a utility function. Libraries like Lodash provide _.partial and _.partialRight for left-to-right and right-to-left partial application respectively.\n\nIn practice, the distinction between currying and partial application often blurs in JavaScript. Most curry implementations in JS libraries (including Lodash and Ramda) allow passing multiple arguments at once, which means they support partial application as a special case. The conceptual difference still matters: currying is about restructuring a function\'s signature; partial application is about pre-filling arguments to create specialized versions.\n\nPartial application is extremely useful for creating adapter functions, callback factories, and middleware. In React, it appears frequently in patterns like onClick handlers where you partially apply an item ID to a generic handler function, avoiding the need to create arrow functions in JSX.',
        shortAnswer:
          "Partial application fixes some arguments of a function and returns a new function that takes the rest. Unlike currying (which always produces a chain of unary functions), partial application produces a single function expecting all remaining arguments. JavaScript's Function.prototype.bind supports partial application natively.",
        code: '// Partial application with bind\nfunction greet(greeting: string, punctuation: string, name: string): string {\n  return \\`\\${greeting}, \\${name}\\${punctuation}\\`;\n}\n\nconst sayHello = greet.bind(null, "Hello", "!");\nconsole.log(sayHello("Alice")); // "Hello, Alice!"\nconsole.log(sayHello("Bob"));   // "Hello, Bob!"\n\n// Manual partial application utility\nfunction partial<T extends unknown[], R>(\n  fn: (...args: T) => R,\n  ...presetArgs: Partial<T>\n): (...remainingArgs: unknown[]) => R {\n  return (...remainingArgs: unknown[]) =>\n    fn(...([...presetArgs, ...remainingArgs] as unknown as T));\n}\n\nfunction createUrl(\n  protocol: string,\n  domain: string,\n  path: string,\n): string {\n  return \\`\\${protocol}://\\${domain}/\\${path}\\`;\n}\n\nconst secureUrl = partial(createUrl, "https");\nconst apiUrl = partial(createUrl, "https", "api.example.com");\n\nconsole.log(secureUrl("example.com", "about"));  // "https://example.com/about"\nconsole.log(apiUrl("users"));                    // "https://api.example.com/users"\n\n// Currying vs partial application comparison\n// Curried: f(a)(b)(c)\nconst curriedGreet = (g: string) => (p: string) => (n: string) =>\n  \\`\\${g}, \\${n}\\${p}\\`;\n\n// Partially applied: f(a, b) → g(c)\nconst partialGreet = partial(greet, "Hi", ".");  // fixes 2, expects 1',
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "partial application",
          "currying",
          "bind",
          "closures",
          "function factories",
        ],
        commonMistakes: [
          "Using bind for partial application without realizing it permanently sets the this context as well, which can cause issues with methods",
          'Confusing the two: saying "currying" when you mean "partial application" — interviewers notice the imprecision',
          "Creating arrow functions inside JSX on every render instead of using partial application to create stable references",
        ],
        followUps: [
          "When would you choose partial application over currying in a real project?",
          "How does _.partialRight differ from _.partial and when is it useful?",
          "Can you implement partial application that supports placeholder arguments?",
        ],
        interviewTips: [
          "Clearly articulate the difference: currying restructures the function, partial application pre-fills arguments — this distinction shows depth of understanding",
        ],
      },
      {
        id: "js-fp-6",
        question: "What is function composition?",
        answer:
          'Function composition is the process of combining two or more functions to produce a new function where the output of one function becomes the input of the next. Mathematically, composing functions f and g produces a new function h such that h(x) = f(g(x)). In code, this means creating data transformation pipelines where data flows through a series of small, focused functions.\n\nThe primary benefit of composition is that it encourages building complex behavior from simple, reusable parts. Each function in the composition has a single responsibility, making it easy to understand, test, and replace. This aligns with the Unix philosophy of small tools that do one thing well and can be chained together.\n\nThere are two common composition directions. "compose" applies functions right-to-left (the mathematical convention), so compose(f, g, h)(x) computes f(g(h(x))). "pipe" applies functions left-to-right (the reading order), so pipe(h, g, f)(x) computes f(g(h(x))). Pipe tends to be more readable in code because you read the transformations in the order they are applied. Both are equivalent — pipe is just compose with reversed argument order.\n\nComposition works best when all the composed functions are unary (take a single argument), which is one reason currying is so closely associated with functional programming. If your functions take multiple arguments, curry them first so they can be composed. Libraries like Ramda, lodash/fp, and RxJS operators are designed around this principle — their functions are curried and data-last to make composition seamless.\n\nModern JavaScript has a TC39 proposal for a pipe operator (|>) that would enable native syntax like value |> fn1 |> fn2 |> fn3. Until that lands, you can use utility functions or libraries. In React, custom hooks are a form of composition — they compose stateful logic the same way pure function composition combines transformations.',
        shortAnswer:
          "Function composition combines multiple functions into a single function where the output of one feeds as input to the next. compose applies functions right-to-left while pipe applies left-to-right. It builds complex operations from small, testable, reusable functions.",
        code: '// Basic compose (right-to-left)\nfunction compose<T>(\n  ...fns: Array<(arg: T) => T>\n): (arg: T) => T {\n  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);\n}\n\n// Pipe (left-to-right, more readable)\nfunction pipe<T>(\n  ...fns: Array<(arg: T) => T>\n): (arg: T) => T {\n  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);\n}\n\n// Small, reusable transformation functions\nconst trim = (s: string): string => s.trim();\nconst toLowerCase = (s: string): string => s.toLowerCase();\nconst replaceSpaces = (s: string): string => s.replace(/\\s+/g, "-");\nconst removeSpecialChars = (s: string): string =>\n  s.replace(/[^a-z0-9-]/g, "");\n\n// Compose them into a slug generator\nconst slugify = pipe(trim, toLowerCase, replaceSpaces, removeSpecialChars);\n\nconsole.log(slugify("  Hello World! FP is Great  "));\n// "hello-world-fp-is-great"\n\n// Numeric pipeline example\nconst double = (n: number): number => n * 2;\nconst addOne = (n: number): number => n + 1;\nconst square = (n: number): number => n * n;\n\nconst transform = pipe(double, addOne, square);\nconsole.log(transform(3)); // square(addOne(double(3))) = square(7) = 49\n\n// Async composition\nfunction pipeAsync<T>(\n  ...fns: Array<(arg: T) => T | Promise<T>>\n): (arg: T) => Promise<T> {\n  return (arg: T) =>\n    fns.reduce<Promise<T>>(\n      (chain, fn) => chain.then(fn),\n      Promise.resolve(arg),\n    );\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "composition",
          "pipe",
          "compose",
          "data pipelines",
          "point-free",
        ],
        commonMistakes: [
          "Mixing up compose (right-to-left) and pipe (left-to-right) ordering, leading to functions applied in the wrong sequence",
          "Trying to compose functions with mismatched signatures — the output type of one must match the input type of the next",
          "Over-composing trivial operations where a simple function body would be clearer",
        ],
        followUps: [
          "What is the TC39 pipe operator proposal and how would it change composition in JavaScript?",
          "How do you compose async functions or functions that return Promises?",
          "What is point-free style and how does it relate to composition?",
        ],
        interviewTips: [
          "Implement both compose and pipe from scratch using reduce/reduceRight to demonstrate you understand the mechanics",
          "Use a real-world example like a slug generator or data sanitization pipeline to make the concept tangible",
        ],
      },
      {
        id: "js-fp-7",
        question: "Explain higher-order functions with practical examples.",
        answer:
          'A higher-order function (HOF) is a function that either takes one or more functions as arguments, returns a function, or both. This is possible in JavaScript because functions are first-class citizens — they can be stored in variables, passed as arguments, and returned from other functions just like any other value.\n\nThe most common higher-order functions in JavaScript are the built-in array methods: map, filter, reduce, sort, forEach, find, some, and every. Each of these accepts a callback function that defines the specific behavior. The HOF provides the iteration structure while the callback provides the logic. This separation of concerns is a hallmark of functional design.\n\nReturning functions is equally important and enables powerful patterns. Function factories create specialized functions from general templates — for example, a createValidator(rule) that returns a validation function. Closures make this possible: the returned function "closes over" the arguments and variables of the outer function, retaining access to them even after the outer function has returned. Decorators and middleware are higher-order functions that wrap existing functions with additional behavior like logging, timing, error handling, or access control.\n\nIn React, higher-order functions are pervasive. Higher-order components (HOCs) like connect() from Redux and withRouter() from React Router are functions that accept a component and return an enhanced component. Custom hooks that return callback functions are another form. Event handler factories that produce handlers parameterized by item IDs or field names are everyday HOFs.\n\nHigher-order functions promote the Open/Closed principle — functions are open for extension (by passing different callbacks) but closed for modification. They reduce code duplication by abstracting common patterns into reusable utilities. The key to writing good HOFs is keeping them generic: they should handle the structural pattern and delegate specific behavior to the functions they receive.',
        shortAnswer:
          "A higher-order function takes a function as an argument, returns a function, or both. Array methods like map/filter/reduce, event handler factories, decorators, and React higher-order components are all common examples. They enable code reuse by separating structure from behavior.",
        code: '// HOF that takes a function as argument\nfunction withRetry<T>(\n  fn: () => Promise<T>,\n  retries: number = 3,\n): () => Promise<T> {\n  return async () => {\n    for (let attempt = 0; attempt < retries; attempt++) {\n      try {\n        return await fn();\n      } catch (error) {\n        if (attempt === retries - 1) throw error;\n      }\n    }\n    throw new Error("Unreachable");\n  };\n}\n\nconst fetchData = withRetry(() => fetch("/api/data").then((r) => r.json()));\n\n// HOF that returns a function (factory pattern)\nfunction createMultiplier(factor: number): (value: number) => number {\n  return (value: number) => value * factor;\n}\n\nconst double = createMultiplier(2);\nconst triple = createMultiplier(3);\nconsole.log(double(5)); // 10\nconsole.log(triple(5)); // 15\n\n// Decorator / wrapper HOF\nfunction withLogging<Args extends unknown[], R>(\n  fn: (...args: Args) => R,\n  label: string,\n): (...args: Args) => R {\n  return (...args: Args): R => {\n    console.log(\\`[\\${label}] Called with:\\`, args);\n    const result = fn(...args);\n    console.log(\\`[\\${label}] Returned:\\`, result);\n    return result;\n  };\n}\n\nconst add = (a: number, b: number): number => a + b;\nconst loggedAdd = withLogging(add, "add");\nloggedAdd(2, 3); // logs call and result, returns 5\n\n// Practical: event handler factory in React\nfunction handleFieldChange(\n  setState: (update: Record<string, string>) => void,\n) {\n  return (field: string) =>\n    (e: { target: { value: string } }) =>\n      setState({ [field]: e.target.value });\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "higher-order functions",
          "closures",
          "decorators",
          "function factories",
          "HOC",
        ],
        commonMistakes: [
          "Creating new function instances on every render in React by defining arrow functions inline — use useCallback or extract the HOF to a stable reference",
          "Losing the function name and stack trace information when wrapping with HOFs — use Object.defineProperty to preserve the original name for debugging",
          "Overusing HOFs where simple code would suffice — not every function needs to be wrapped in a factory",
        ],
        followUps: [
          "How do higher-order components differ from custom hooks in React?",
          "How would you type a generic higher-order function in TypeScript?",
          "What is the decorator pattern and how do higher-order functions implement it?",
        ],
        interviewTips: [
          "Show both directions — a HOF that receives a function (like withRetry) and one that returns a function (like createMultiplier) — to demonstrate full understanding",
        ],
      },
      {
        id: "js-fp-8",
        question:
          "What are side effects and how do they relate to functional programming?",
        answer:
          'A side effect is any observable change that a function makes to the world outside its own scope, beyond returning a value. This includes modifying global or external variables, writing to the DOM, making network requests, reading from or writing to a database, logging to the console, setting timers, throwing exceptions, and mutating input arguments. In functional programming, side effects are considered the source of complexity and bugs, and the goal is to isolate and manage them carefully.\n\nPure functional programming aims to separate pure computation from side effects entirely. The pure core of your application handles all data transformation and business logic, while a thin imperative shell at the boundaries handles I/O and state mutations. This "functional core, imperative shell" architecture (sometimes called "ports and adapters" or "hexagonal architecture") makes the core logic easy to test, reason about, and reuse, because it has no dependencies on external systems.\n\nIn JavaScript, you cannot avoid side effects entirely — a program that does nothing observable is useless. The goal is to push side effects to the edges. For example, instead of a function that fetches data and transforms it, split it into a pure transformation function and a separate function that handles the fetch. The transformation function is easy to test with static input; the fetch function is a thin integration point that can be tested separately.\n\nReact\'s model is built around this principle. Component render functions should be pure — given the same props and state, they return the same JSX. Side effects are explicitly separated into useEffect hooks, event handlers, and external state managers. This separation is what allows React\'s concurrent rendering features (like Suspense and transitions) to work, because React can call render functions multiple times, discard results, or defer them without risking uncontrolled side effects.\n\nCommon strategies for managing side effects include the Command pattern (returning descriptions of effects rather than performing them), monadic patterns (wrapping effects in containers like Promises or Observables), dependency injection (passing I/O functions as arguments so they can be replaced in tests), and dedicated side-effect libraries like Redux-Saga or RxJS that model effects as declarative data structures.',
        shortAnswer:
          "Side effects are observable interactions with the outside world — DOM changes, network calls, mutations, logging. Functional programming isolates side effects at system boundaries, keeping the core logic pure and testable. React enforces this by making renders pure and routing side effects through useEffect.",
        code: '// IMPURE: side effects mixed with logic\nlet total = 0;\nfunction addToTotal(amount: number): void {\n  total += amount;               // mutation of external state\n  console.log(\\`Total: \\${total}\\`); // I/O side effect\n  document.title = \\`\\${total}\\`;   // DOM side effect\n}\n\n// PURE CORE: separated from side effects\nfunction calculateNewTotal(current: number, amount: number): number {\n  return current + amount;\n}\n\nfunction formatTotal(total: number): string {\n  return \\`Total: \\${total}\\`;\n}\n\n// IMPERATIVE SHELL: handles side effects at the boundary\nfunction handleAddToTotal(amount: number): void {\n  total = calculateNewTotal(total, amount);\n  console.log(formatTotal(total));\n  document.title = String(total);\n}\n\n// React example: pure render + effect separation\n/*\nfunction Cart({ items }: { items: CartItem[] }) {\n  // Pure computation\n  const total = items.reduce((sum, item) => sum + item.price, 0);\n  const formatted = formatCurrency(total);\n\n  // Side effects isolated in useEffect\n  useEffect(() => {\n    document.title = \\`Cart (\\${items.length})\\`;\n    analytics.track("cart_viewed", { total });\n  }, [items, total]);\n\n  // Pure render output\n  return <div>{formatted}</div>;\n}\n*/\n\n// Command pattern: describe effects instead of performing them\ntype Effect =\n  | { type: "LOG"; message: string }\n  | { type: "FETCH"; url: string }\n  | { type: "SET_TITLE"; title: string };\n\nfunction planEffects(total: number): Effect[] {\n  return [\n    { type: "LOG", message: formatTotal(total) },\n    { type: "SET_TITLE", title: String(total) },\n  ];\n}\n\nfunction executeEffects(effects: Effect[]): void {\n  effects.forEach((effect) => {\n    switch (effect.type) {\n      case "LOG":\n        console.log(effect.message);\n        break;\n      case "SET_TITLE":\n        document.title = effect.title;\n        break;\n      case "FETCH":\n        fetch(effect.url);\n        break;\n    }\n  });\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-functional",
        tags: [
          "side effects",
          "purity",
          "functional core",
          "imperative shell",
          "useEffect",
        ],
        commonMistakes: [
          "Performing side effects inside React render functions or useMemo callbacks, which can fire multiple times unpredictably in concurrent mode",
          'Assuming that "no side effects" means "no state changes" — reading from a variable that could change between calls is also a form of impurity',
          "Treating all side effects as equally dangerous — logging is less risky than mutating shared state; the key is knowing which effects to isolate strictly",
        ],
        followUps: [
          'What is the "functional core, imperative shell" architecture and how would you apply it to a Node.js API?',
          "How does React's concurrent rendering depend on pure render functions?",
          "What patterns do libraries like Redux-Saga use to manage side effects declaratively?",
        ],
        interviewTips: [
          "Show the refactoring from an impure function to a pure-core + effect-shell split — this demonstrates practical FP thinking rather than just theory",
          "Mention React's useEffect as a concrete example of side-effect isolation that every React developer will recognize",
        ],
      },
    ],
  },
];
