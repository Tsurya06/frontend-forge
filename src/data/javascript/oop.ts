import type { Topic } from "../../types";

export const oopTopics: Topic[] = [
  {
    id: "js-oop",
    title: "OOP in JavaScript",
    description:
      "Object-Oriented Programming concepts in JavaScript including prototypal inheritance, prototype chain, constructor functions, ES6 classes, and the this keyword.",
    category: "JavaScript",
    difficulty: "Intermediate",
    tags: [
      "OOP",
      "prototype",
      "classes",
      "inheritance",
      "this",
      "call",
      "apply",
      "bind",
      "constructor",
    ],
    overview:
      "JavaScript uses a prototype-based object-oriented model rather than the classical class-based model found in languages like Java or C++. Every object in JavaScript has an internal link to another object called its prototype, forming a chain that enables property inheritance. ES6 introduced class syntax as syntactic sugar over this prototype mechanism, making OOP patterns more familiar to developers from classical backgrounds while the underlying mechanics remain prototypal.",
    concepts: [
      "Prototypal inheritance",
      "Prototype chain",
      "Constructor functions",
      "ES6 classes",
      "The new operator",
      "this keyword binding rules",
      "call, apply, and bind",
      "Class inheritance with extends",
      "Encapsulation with private fields",
      "Polymorphism",
      "__proto__ vs prototype",
      "Object.create",
      "super keyword",
      "Static methods and properties",
    ],
    relatedTopicIds: ["js-functions", "js-types", "js-engine"],
    questions: [
      {
        id: "js-oop-1",
        question: "Explain prototypal inheritance in JavaScript.",
        answer:
          "Prototypal inheritance is JavaScript's native mechanism for sharing properties and methods between objects. Unlike classical inheritance where classes inherit from other classes, prototypal inheritance works directly with objects—an object can inherit from another object. Every JavaScript object has an internal [[Prototype]] link (accessible via Object.getPrototypeOf() or the __proto__ property) that points to another object, from which it inherits properties.\n\nWhen you access a property on an object, JavaScript first looks for the property on the object itself. If it doesn't find it, the engine follows the [[Prototype]] link to the prototype object and looks there. This process continues up the chain until the property is found or the chain ends at null (the prototype of Object.prototype). This delegation mechanism means objects don't need to own all their properties—they can inherit shared behavior from prototypes.\n\nYou can set up prototypal inheritance in several ways. Object.create(proto) creates a new object with proto as its prototype. Constructor functions combined with the new keyword set the new object's prototype to the constructor's prototype property. ES6 classes use the extends keyword to establish prototype chains. The key insight is that all these approaches ultimately set up the same [[Prototype]] chain.\n\nPrototypal inheritance is more flexible than classical inheritance because it allows objects to inherit directly from other objects without an intermediary class definition. You can create one-off objects with specific prototypes, change an object's prototype at runtime (though this is not recommended for performance reasons), and mix in properties from multiple sources. This flexibility is both a strength and a potential source of confusion, which is why ES6 classes were introduced to provide a more structured syntax.",
        shortAnswer:
          "Prototypal inheritance allows objects to inherit properties and methods from other objects through an internal [[Prototype]] link. When a property isn't found on an object, JavaScript looks up the prototype chain. This differs from classical inheritance because objects inherit directly from other objects, not from classes.",
        code: '// Setting up prototypal inheritance\n\n// 1. Object.create\nconst animal = {\n  speak() {\n    console.log(this.name + " makes a sound.");\n  }\n};\n\nconst dog = Object.create(animal);\ndog.name = "Rex";\ndog.bark = function() {\n  console.log(this.name + " barks!");\n};\n\ndog.speak(); // "Rex makes a sound." (inherited from animal)\ndog.bark();  // "Rex barks!" (own method)\n\n// 2. Constructor functions\nfunction Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function() {\n  console.log(this.name + " makes a sound.");\n};\n\nfunction Dog(name, breed) {\n  Animal.call(this, name);\n  this.breed = breed;\n}\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\nDog.prototype.bark = function() {\n  console.log(this.name + " barks!");\n};\n\nconst rex = new Dog("Rex", "Shepherd");\nrex.speak(); // "Rex makes a sound." (inherited)\nrex.bark();  // "Rex barks!" (own)\n\n// 3. ES6 classes (syntactic sugar)\nclass AnimalClass {\n  constructor(name) { this.name = name; }\n  speak() { console.log(this.name + " makes a sound."); }\n}\n\nclass DogClass extends AnimalClass {\n  constructor(name, breed) {\n    super(name);\n    this.breed = breed;\n  }\n  bark() { console.log(this.name + " barks!"); }\n}',
        language: "javascript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["prototypal inheritance", "prototype", "Object.create"],
        commonMistakes: [
          "Confusing prototypal inheritance with classical inheritance—JavaScript doesn't have true classes, ES6 classes are syntactic sugar",
          "Forgetting to set constructor property when manually linking prototypes (Dog.prototype.constructor = Dog)",
          "Using __proto__ directly in production code instead of Object.getPrototypeOf/Object.setPrototypeOf",
        ],
        followUps: [
          "How does Object.create() differ from using the new keyword?",
          "What happens when you modify a prototype after objects have been created from it?",
          "Can you explain differential inheritance?",
        ],
        interviewTips: [
          "Start by explaining that JavaScript is prototype-based, not class-based, then show how ES6 classes map to prototypes",
          "Drawing the prototype chain diagram can be very helpful for explaining inheritance visually",
        ],
        relatedTopics: ["Prototype Chain", "ES6 Classes", "Object.create"],
      },
      {
        id: "js-oop-2",
        question: "How does the prototype chain work?",
        answer:
          'The prototype chain is the mechanism JavaScript uses to resolve property lookups through a linked list of objects. Every object has an internal [[Prototype]] reference (often called its "proto") that points to another object. When you access a property on an object, the engine first searches the object\'s own properties. If the property is not found, the engine follows the [[Prototype]] link to the next object in the chain and searches there. This process repeats up the chain until the property is found or the chain terminates at null.\n\nThe chain typically ends at Object.prototype, which is the prototype of most objects. Object.prototype itself has a [[Prototype]] of null, forming the end of every prototype chain. For example, when you create a plain object `const obj = {}`, its chain is: obj → Object.prototype → null. For an array `const arr = []`, the chain is: arr → Array.prototype → Object.prototype → null. This is why arrays have access to both Array methods (push, map) and Object methods (toString, hasOwnProperty).\n\nProperty writes behave differently from reads. When you write a property (e.g., `obj.x = 5`), JavaScript always creates or updates the property directly on the target object—it does not traverse the prototype chain. This is called "shadowing": if a prototype has a property `x` and you set `obj.x`, the object gets its own `x` that shadows the prototype\'s `x`. This is important because modifying a property on an instance doesn\'t affect the prototype or other objects that share it.\n\nThe hasOwnProperty() method (or Object.hasOwn() in modern JS) checks whether a property belongs to the object itself rather than being inherited from the prototype chain. The for...in loop iterates over both own and inherited enumerable properties, which is why Object.keys() (own properties only) is often preferred. Understanding the prototype chain is essential for debugging unexpected property values and for designing effective object hierarchies.',
        shortAnswer:
          "The prototype chain is a linked sequence of objects used for property lookup. When a property isn't found on an object, JavaScript follows the [[Prototype]] link to the next object, continuing until the property is found or the chain ends at null. Property writes always occur on the object itself (shadowing), while reads traverse the chain.",
        code: '// Prototype chain visualization\nconst grandparent = { family: "Smith", greet() { return "Hello!"; } };\nconst parent = Object.create(grandparent);\nparent.name = "John";\nconst child = Object.create(parent);\nchild.age = 10;\n\n// Chain: child → parent → grandparent → Object.prototype → null\n\nconsole.log(child.age);    // 10 (own property)\nconsole.log(child.name);   // "John" (from parent)\nconsole.log(child.family); // "Smith" (from grandparent)\nconsole.log(child.greet());// "Hello!" (from grandparent)\nconsole.log(child.toString()); // "[object Object]" (from Object.prototype)\n\n// Property shadowing\nchild.name = "Junior";\nconsole.log(child.name);   // "Junior" (own, shadows parent.name)\nconsole.log(parent.name);  // "John" (unchanged)\n\n// Checking own vs inherited properties\nconsole.log(child.hasOwnProperty("age"));    // true\nconsole.log(child.hasOwnProperty("name"));   // true (shadowed)\nconsole.log(child.hasOwnProperty("family")); // false (inherited)\n\n// Modern alternative\nconsole.log(Object.hasOwn(child, "age"));    // true\nconsole.log(Object.hasOwn(child, "family")); // false\n\n// Array prototype chain:\nconst arr = [1, 2, 3];\n// arr → Array.prototype → Object.prototype → null\nconsole.log(arr.push);       // from Array.prototype\nconsole.log(arr.hasOwnProperty); // from Object.prototype\n\n// Traversing the chain manually:\nlet proto = Object.getPrototypeOf(child);\nwhile (proto !== null) {\n  console.log(proto);\n  proto = Object.getPrototypeOf(proto);\n}\n// parent → grandparent → Object.prototype',
        language: "javascript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["prototype chain", "property lookup", "inheritance"],
        commonMistakes: [
          "Thinking property writes traverse the prototype chain—they always write to the target object",
          "Using for...in without hasOwnProperty check, accidentally iterating inherited properties",
          "Confusing Object.getPrototypeOf(obj) with obj.prototype—the latter is a property on constructor functions, not on instances",
        ],
        followUps: [
          "What is the performance impact of long prototype chains?",
          "How does property shadowing work with getters and setters on the prototype?",
          "What happens if you set Object.prototype to null?",
        ],
        interviewTips: [
          "Sketch the chain diagram: object → proto → proto → ... → null",
          "Highlight that reads traverse up the chain but writes always happen on the object itself",
        ],
        relatedTopics: [
          "Prototypal Inheritance",
          "Property Lookup",
          "hasOwnProperty",
        ],
      },
      {
        id: "js-oop-3",
        question: "What are constructor functions and how do they work?",
        answer:
          "Constructor functions are regular JavaScript functions that are designed to be called with the new keyword to create and initialize objects. By convention, constructor functions are named with a capital first letter (e.g., Person, Car) to distinguish them from regular functions. Before ES6 classes, constructor functions were the primary way to create objects with shared behavior and simulated class-like inheritance in JavaScript.\n\nWhen you call a function with the new keyword, JavaScript performs four implicit steps: (1) a new empty object is created, (2) the object's internal [[Prototype]] is set to the constructor function's prototype property, (3) the function executes with `this` bound to the new object, and (4) if the function doesn't explicitly return an object, the new object is returned. This mechanism is how constructor functions produce instances that share methods through the prototype.\n\nMethods should be defined on the constructor's prototype rather than inside the constructor body. If you define methods inside the constructor (e.g., `this.greet = function() {...}`), each instance gets its own copy of the function, wasting memory. By placing methods on the prototype (e.g., `Person.prototype.greet = function() {...}`), all instances share a single function object through the prototype chain.\n\nConstructor functions can also implement inheritance by manually linking prototype chains. You create the child constructor, call the parent constructor inside it (using Parent.call(this, args)), set the child's prototype to an object that inherits from the parent's prototype (using Object.create(Parent.prototype)), and fix the constructor property. While this works, the verbose boilerplate is exactly what ES6 classes were designed to replace.",
        shortAnswer:
          "Constructor functions are functions called with `new` to create objects. The `new` keyword creates an empty object, sets its prototype to the constructor's .prototype, executes the function with `this` bound to the new object, and returns it. Methods should be placed on the prototype to be shared across instances rather than recreated in each constructor call.",
        code: '// Constructor function\nfunction Person(name, age) {\n  this.name = name;\n  this.age = age;\n}\n\n// Shared methods on prototype\nPerson.prototype.greet = function() {\n  return "Hi, I\'m " + this.name + " and I\'m " + this.age;\n};\n\nPerson.prototype.birthday = function() {\n  this.age++;\n};\n\nconst alice = new Person("Alice", 30);\nconst bob = new Person("Bob", 25);\n\nconsole.log(alice.greet()); // "Hi, I\'m Alice and I\'m 30"\nconsole.log(bob.greet());   // "Hi, I\'m Bob and I\'m 25"\n\n// Both share the same greet function\nconsole.log(alice.greet === bob.greet); // true\n\n// What `new` does behind the scenes:\nfunction myNew(Constructor, ...args) {\n  const obj = Object.create(Constructor.prototype); // Steps 1 & 2\n  const result = Constructor.apply(obj, args);       // Step 3\n  return result instanceof Object ? result : obj;    // Step 4\n}\n\nconst carol = myNew(Person, "Carol", 28);\nconsole.log(carol.greet()); // "Hi, I\'m Carol and I\'m 28"\n\n// Inheritance with constructor functions\nfunction Employee(name, age, company) {\n  Person.call(this, name, age); // Call parent constructor\n  this.company = company;\n}\nEmployee.prototype = Object.create(Person.prototype);\nEmployee.prototype.constructor = Employee;\nEmployee.prototype.introduce = function() {\n  return this.greet() + " at " + this.company;\n};\n\nconst dave = new Employee("Dave", 35, "Google");\nconsole.log(dave.introduce()); // "Hi, I\'m Dave and I\'m 35 at Google"\nconsole.log(dave instanceof Employee); // true\nconsole.log(dave instanceof Person);   // true',
        language: "javascript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["constructor", "new", "prototype", "instance"],
        commonMistakes: [
          "Calling a constructor without new—this binds to the global object (or undefined in strict mode) instead of a new instance",
          "Defining methods inside the constructor instead of on the prototype, causing each instance to get its own copy",
          "Forgetting to reset .constructor after Object.create when setting up inheritance",
        ],
        followUps: [
          "What happens if a constructor function explicitly returns an object?",
          "How does new.target help with detecting whether a function was called with new?",
          "Why is it important to put methods on the prototype instead of in the constructor?",
        ],
        interviewTips: [
          "Be able to explain the four steps new performs—this shows deep understanding",
          "Mention that ES6 classes are syntactic sugar over constructor functions and prototypes",
        ],
        relatedTopics: ["new Keyword", "Prototype", "ES6 Classes"],
      },
      {
        id: "js-oop-4",
        question: "How do ES6 classes work under the hood?",
        answer:
          "ES6 classes are syntactic sugar over JavaScript's existing prototypal inheritance model. Under the hood, a class declaration creates a constructor function and sets up its prototype just like you would manually with constructor functions. The class body's constructor method becomes the function itself, instance methods are placed on the prototype, and static methods are placed on the constructor function. The extends keyword sets up the prototype chain between parent and child.\n\nWhen you write `class Dog extends Animal { constructor(name) { super(name); } bark() { ... } }`, JavaScript creates a function called Dog, sets Dog.prototype to an object whose [[Prototype]] is Animal.prototype, and defines bark on Dog.prototype. The super(name) call invokes Animal as a constructor (like Animal.call(this, name)), and the extends keyword also sets Dog's own [[Prototype]] to Animal, enabling static method inheritance.\n\nDespite being syntactic sugar, classes have several differences from plain constructor functions. Classes are always in strict mode. They cannot be called without new (attempting to do so throws a TypeError). Class declarations are not hoisted in a usable way—they exist in the Temporal Dead Zone like let/const. Class methods are non-enumerable (they won't show up in for...in loops). These differences make classes more predictable and harder to misuse.\n\nES2022 introduced significant additions to classes: private fields (#name) that are truly private (not accessible outside the class, enforced by the engine), static fields and methods, static initialization blocks, and private methods. These features bring JavaScript classes closer to the capabilities of classical OOP languages. However, understanding that the underlying mechanism is still prototypal helps explain behaviors like instanceof, method sharing, and the ability to monkey-patch prototypes even for class instances.",
        shortAnswer:
          "ES6 classes are syntactic sugar over constructor functions and prototypes. The constructor method becomes the constructor function, methods go on the prototype, and extends sets up the prototype chain. Classes enforce strict mode, require new, are not hoisted usably, and have non-enumerable methods. ES2022 added true private fields (#), static blocks, and private methods.",
        code: '// ES6 class\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return this.name + " makes a sound";\n  }\n}\n\n// Is equivalent to:\nfunction AnimalOld(name) {\n  this.name = name;\n}\nAnimalOld.prototype.speak = function() {\n  return this.name + " makes a sound";\n};\n\n// Proving they\'re the same mechanism:\nconsole.log(typeof Animal); // "function"\nconsole.log(Animal.prototype.speak); // [Function: speak]\n\nconst a = new Animal("Cat");\nconsole.log(Object.getPrototypeOf(a) === Animal.prototype); // true\n\n// ES6 class inheritance\nclass Dog extends Animal {\n  #tricks = []; // Private field (ES2022)\n\n  constructor(name, breed) {\n    super(name); // Must call super before using `this`\n    this.breed = breed;\n  }\n\n  bark() {\n    return this.name + " barks!";\n  }\n\n  learnTrick(trick) {\n    this.#tricks.push(trick); // Private access\n  }\n\n  showTricks() {\n    return this.name + " knows: " + this.#tricks.join(", ");\n  }\n\n  static isDog(obj) {\n    return obj instanceof Dog;\n  }\n}\n\nconst rex = new Dog("Rex", "Shepherd");\nconsole.log(rex.speak());  // "Rex makes a sound" (inherited)\nconsole.log(rex.bark());   // "Rex barks!" (own)\n\n// Prototype chain: rex → Dog.prototype → Animal.prototype → Object.prototype\nconsole.log(rex instanceof Dog);    // true\nconsole.log(rex instanceof Animal); // true\n\n// Classes cannot be called without new\n// Animal("test"); // TypeError: Class constructor Animal cannot be invoked without \'new\'',
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["classes", "ES6", "syntactic sugar", "private fields"],
        commonMistakes: [
          "Thinking ES6 classes introduce a new OOP model—they're syntactic sugar over prototypal inheritance",
          "Forgetting to call super() in a derived class constructor before accessing this",
          "Assuming private fields (#) work like TypeScript's private keyword—# fields are enforced at runtime by the engine",
        ],
        followUps: [
          "Can you access a private field using Object.keys or reflection?",
          "How do static initialization blocks work?",
          "What is the difference between class fields and constructor assignments?",
        ],
        interviewTips: [
          "Demonstrate understanding by showing the equivalent constructor function code for a class",
          "Mention the key behavioral differences: strict mode, non-enumerable methods, TDZ, requires new",
        ],
        relatedTopics: ["Constructor Functions", "Prototype", "Private Fields"],
      },
      {
        id: "js-oop-5",
        question: "Explain the `this` keyword and how its value is determined.",
        answer:
          "The `this` keyword in JavaScript refers to the execution context of a function—the object that is \"currently\" associated with the function's execution. Unlike most languages where `this` is determined at compile time based on where the method is defined, JavaScript's `this` is determined at runtime based on how the function is called. This dynamic binding is one of the most confusing aspects of JavaScript for developers coming from other languages.\n\nThere are five primary rules for determining `this`, applied in order of precedence: (1) new binding: when a function is called with new, `this` refers to the newly created object. (2) Explicit binding: when a function is called with call(), apply(), or bind(), `this` is set to the first argument. (3) Implicit binding: when a function is called as a method of an object (obj.method()), `this` refers to the object before the dot. (4) Default binding: when a function is called standalone, `this` is the global object (window in browsers) in non-strict mode, or undefined in strict mode. (5) Arrow functions: don't have their own `this`; they inherit `this` from their enclosing lexical scope.\n\nA common pitfall is \"losing\" this when passing a method as a callback. When you write `setTimeout(obj.method, 1000)`, the method is extracted from the object and called without a receiver, so `this` falls back to the default binding rule. Solutions include using bind() (`setTimeout(obj.method.bind(obj), 1000)`), wrapping in an arrow function (`setTimeout(() => obj.method(), 1000)`), or using class fields with arrow functions to permanently bind methods.\n\nArrow functions are particularly important because they lexically capture `this` from their surrounding scope. This makes them ideal for callbacks within methods where you want to preserve the method's `this`. However, this same behavior means arrow functions should not be used as methods on objects or prototypes, because they would capture the wrong `this` (the enclosing scope instead of the calling object).",
        shortAnswer:
          "The `this` keyword's value depends on how a function is called: new binding (new object), explicit binding (call/apply/bind), implicit binding (object.method), or default binding (global/undefined). Arrow functions don't have their own `this`—they inherit it lexically from the enclosing scope. Methods can lose their `this` when passed as callbacks.",
        code: '// Rule 1: Default binding\nfunction showThis() {\n  console.log(this);\n}\nshowThis(); // window (non-strict) or undefined (strict mode)\n\n// Rule 2: Implicit binding\nconst obj = {\n  name: "Alice",\n  greet() {\n    console.log("Hi, I\'m " + this.name);\n  }\n};\nobj.greet(); // "Hi, I\'m Alice" — this = obj\n\n// Rule 3: Explicit binding\nconst bob = { name: "Bob" };\nobj.greet.call(bob);   // "Hi, I\'m Bob" — this = bob\nobj.greet.apply(bob);  // "Hi, I\'m Bob" — this = bob\nconst boundGreet = obj.greet.bind(bob);\nboundGreet();          // "Hi, I\'m Bob" — this permanently = bob\n\n// Rule 4: new binding\nfunction Person(name) {\n  this.name = name;\n  console.log(this); // the new Person instance\n}\nconst p = new Person("Carol"); // this = new Person object\n\n// Rule 5: Arrow functions (lexical this)\nconst team = {\n  name: "Engineering",\n  members: ["Alice", "Bob"],\n  listMembers() {\n    this.members.forEach((member) => {\n      console.log(member + " is in " + this.name);\n      // Arrow function inherits `this` from listMembers\n    });\n  }\n};\nteam.listMembers();\n// "Alice is in Engineering"\n// "Bob is in Engineering"\n\n// Common pitfall: losing `this`\nconst greetFn = obj.greet; // Extracts the function\ngreetFn(); // undefined (strict) or window.name — `this` is lost!\n\n// Fix with bind:\nsetTimeout(obj.greet.bind(obj), 100); // "Hi, I\'m Alice"\n\n// Fix with arrow wrapper:\nsetTimeout(() => obj.greet(), 100); // "Hi, I\'m Alice"',
        language: "javascript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["this", "binding", "context", "arrow functions"],
        commonMistakes: [
          "Assuming this always refers to the object where the method is defined—it depends on how the function is called",
          "Using arrow functions as object methods, which causes this to refer to the enclosing scope instead of the object",
          "Forgetting that event handlers receive the DOM element as this, not the class instance",
        ],
        followUps: [
          "What is the order of precedence when multiple this-binding rules apply?",
          "How does this work inside a class method vs a regular function?",
          "Can you override this in an arrow function with call or bind?",
        ],
        interviewTips: [
          "List the binding rules in order of precedence: new > explicit (call/apply/bind) > implicit (obj.method) > default",
          'Demonstrate the "lost this" problem and how to fix it—this is an extremely common interview topic',
        ],
        relatedTopics: ["Arrow Functions", "call/apply/bind", "Closures"],
      },
      {
        id: "js-oop-6",
        question: "What are call, apply, and bind? How do they differ?",
        answer:
          "call, apply, and bind are methods available on every JavaScript function (inherited from Function.prototype) that allow you to explicitly control the value of `this` when invoking a function. They are essential tools for controlling function context, borrowing methods from other objects, and creating partially applied functions.\n\ncall() invokes the function immediately with a specified `this` value and individual arguments: `func.call(thisArg, arg1, arg2, ...)`. apply() also invokes immediately but accepts arguments as an array: `func.apply(thisArg, [arg1, arg2, ...])`. The mnemonic is \"a for apply, a for array.\" Before the spread operator existed, apply was the only way to pass an array of arguments to a function. Now you can use `func.call(thisArg, ...args)` which makes call more versatile.\n\nbind() is fundamentally different from call and apply because it does not invoke the function immediately. Instead, it returns a new function with `this` permanently bound to the specified value. The bound function can be called later and will always use the bound `this`, regardless of how it's invoked. bind can also partially apply arguments: `const add5 = add.bind(null, 5)` creates a function where the first argument is always 5.\n\nA key distinction is that bind creates a new function object each time it's called, so repeatedly binding can be memory-inefficient. Also, once a function is bound, the `this` cannot be rebound—calling call or apply on a bound function will not change its `this`. These methods are commonly used for method borrowing (e.g., using Array.prototype.slice.call(arguments) to convert array-likes), setting event handler contexts, and creating callbacks that maintain the correct `this`.",
        shortAnswer:
          "call() invokes a function with a specified this and individual arguments. apply() is the same but takes arguments as an array. bind() returns a new function with this permanently bound without invoking it immediately. call and apply execute immediately; bind creates a reusable bound function. Bind can also partially apply arguments.",
        code: '// call - invoke with specified this, individual args\nfunction greet(greeting, punctuation) {\n  return greeting + ", " + this.name + punctuation;\n}\n\nconst person = { name: "Alice" };\n\nconsole.log(greet.call(person, "Hello", "!"));\n// "Hello, Alice!"\n\n// apply - same but args as array\nconsole.log(greet.apply(person, ["Hey", "!!!"]));\n// "Hey, Alice!!!"\n\n// bind - returns new function with bound this\nconst aliceGreet = greet.bind(person);\nconsole.log(aliceGreet("Hi", "."));\n// "Hi, Alice."\n\n// Partial application with bind\nconst aliceHello = greet.bind(person, "Hello");\nconsole.log(aliceHello("?"));\n// "Hello, Alice?"\n\n// Method borrowing\nfunction listArgs() {\n  // arguments is array-like, not a real array\n  const args = Array.prototype.slice.call(arguments);\n  return args.join(", ");\n}\nconsole.log(listArgs(1, 2, 3)); // "1, 2, 3"\n\n// Fixing this in callbacks\nclass Timer {\n  constructor() {\n    this.seconds = 0;\n  }\n  start() {\n    // Without bind, `this` would be lost in setInterval callback\n    setInterval(function() {\n      this.seconds++;\n      console.log(this.seconds);\n    }.bind(this), 1000);\n    \n    // Or use arrow function (lexical this)\n    // setInterval(() => { this.seconds++; }, 1000);\n  }\n}\n\n// Bound functions cannot be rebound\nconst bound = greet.bind(person);\nconst other = { name: "Bob" };\nconsole.log(bound.call(other, "Hi", "!")); // "Hi, Alice!" — still Alice!\n\n// Math.max with apply (classic pattern)\nconst numbers = [5, 1, 9, 3, 7];\nconsole.log(Math.max.apply(null, numbers)); // 9\n// Modern: Math.max(...numbers)',
        language: "javascript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["call", "apply", "bind", "this", "method borrowing"],
        commonMistakes: [
          'Confusing call and apply—remember "a for apply, a for array"',
          "Expecting bind to modify the original function—it returns a new function",
          "Trying to rebind a already-bound function—the original this persists",
        ],
        followUps: [
          "How would you implement your own bind function?",
          "What happens if you pass null or undefined as the thisArg?",
          "How do call/apply/bind interact with arrow functions?",
        ],
        interviewTips: [
          "Mention the mnemonic: call takes a Comma-separated list, apply takes an Array",
          "Be ready to implement Function.prototype.bind from scratch—it's a popular interview question",
        ],
        relatedTopics: [
          "this Keyword",
          "Partial Application",
          "Method Borrowing",
        ],
      },
      {
        id: "js-oop-7",
        question: "How does inheritance work with ES6 classes?",
        answer:
          "ES6 class inheritance uses the extends keyword to create a child class that inherits from a parent class. When you write `class Child extends Parent`, JavaScript sets up two prototype chain links: Child.prototype.[[Prototype]] points to Parent.prototype (for instance method inheritance), and Child.[[Prototype]] points to Parent (for static method inheritance). This dual chain ensures both instance and static methods are inherited.\n\nIn the child class constructor, you must call super() before accessing `this`. This is because in a derived class, the object is actually created by the base class constructor—the child class's constructor receives the already-created object. If you don't call super(), `this` is uninitialized, and accessing it throws a ReferenceError. super() calls the parent constructor with the given arguments and initializes `this` in the child context.\n\nThe super keyword can also be used to call parent methods from within overridden methods: `super.methodName()` calls the parent class's version of the method. This enables cooperative method overriding where the child extends (rather than fully replaces) the parent's behavior. super is resolved statically based on the class where the method is defined, not dynamically based on the prototype chain, which avoids infinite recursion issues.\n\nES6 inheritance supports the full range of OOP patterns: single inheritance chains (A → B → C), method overriding, constructor delegation via super(), and accessing overridden parent methods. However, JavaScript does not support multiple inheritance—a class can only extend one parent. Mixins (functions that take a class and return a subclass) are the common pattern for composing behavior from multiple sources.",
        shortAnswer:
          "ES6 class inheritance uses extends to set up prototype chains for both instance and static methods. Child constructors must call super() before using this, as the base class creates the object. super.method() calls the parent version of an overridden method. JavaScript supports single inheritance only; mixins are used for multi-source composition.",
        code: '// Basic inheritance\nclass Shape {\n  constructor(color) {\n    this.color = color;\n  }\n  describe() {\n    return "A " + this.color + " shape";\n  }\n  static create(color) {\n    return new this(color); // `this` refers to the class\n  }\n}\n\nclass Circle extends Shape {\n  constructor(color, radius) {\n    super(color); // MUST call before using `this`\n    this.radius = radius;\n  }\n  area() {\n    return Math.PI * this.radius ** 2;\n  }\n  describe() {\n    return super.describe() + " circle with radius " + this.radius;\n  }\n}\n\nclass Cylinder extends Circle {\n  constructor(color, radius, height) {\n    super(color, radius);\n    this.height = height;\n  }\n  volume() {\n    return this.area() * this.height;\n  }\n}\n\nconst cyl = new Cylinder("red", 5, 10);\nconsole.log(cyl.describe());\n// "A red shape circle with radius 5"\nconsole.log(cyl.volume());\n// 785.398...\nconsole.log(cyl instanceof Cylinder); // true\nconsole.log(cyl instanceof Circle);   // true\nconsole.log(cyl instanceof Shape);    // true\n\n// Static methods are inherited too\nconst blueCircle = Circle.create("blue");\nconsole.log(blueCircle instanceof Circle); // true\n\n// Mixin pattern for multiple inheritance\nconst Serializable = (Base) => class extends Base {\n  toJSON() {\n    return JSON.stringify(this);\n  }\n};\n\nconst Printable = (Base) => class extends Base {\n  print() {\n    console.log(this.describe());\n  }\n};\n\nclass FancyCircle extends Printable(Serializable(Circle)) {\n  constructor(color, radius) {\n    super(color, radius);\n  }\n}\n\nconst fc = new FancyCircle("gold", 3);\nfc.print();          // Inherited from Printable mixin\nconsole.log(fc.toJSON()); // Inherited from Serializable mixin',
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["inheritance", "extends", "super", "classes"],
        commonMistakes: [
          "Forgetting to call super() in derived class constructors—accessing this without super throws ReferenceError",
          "Not understanding that super() must come before any this access in the constructor",
          "Thinking JavaScript supports multiple inheritance—use mixins instead",
        ],
        followUps: [
          "How do mixins work as an alternative to multiple inheritance?",
          "Can a class extend a regular function (not a class)?",
          "What happens if you don't define a constructor in a derived class?",
        ],
        interviewTips: [
          "Show the dual prototype chain: Child.prototype → Parent.prototype AND Child → Parent (for statics)",
          "Demonstrate mixin pattern knowledge to show advanced OOP understanding",
        ],
        relatedTopics: ["Prototype Chain", "Mixins", "super Keyword"],
      },
      {
        id: "js-oop-8",
        question:
          "What is encapsulation in JavaScript? How can you achieve it?",
        answer:
          "Encapsulation is the OOP principle of bundling data (properties) and the methods that operate on that data together, while restricting direct access to some of the object's internals. The goal is to hide implementation details and expose only a controlled public interface, preventing external code from depending on or corrupting internal state. This leads to more maintainable, robust code because internal changes don't break external consumers.\n\nHistorically, JavaScript had no built-in mechanism for true privacy. Developers used conventions and patterns to simulate encapsulation. The most common convention is the underscore prefix (`this._name`) to signal \"private\" properties, though this provides no enforcement. The closure pattern (also called the module pattern) uses function scope to create truly hidden variables: a constructor or factory function defines variables in its local scope and returns methods that close over those variables, making them inaccessible from outside.\n\nES2022 introduced true private class fields and methods using the # prefix. Fields like #name and methods like #validate() are genuinely private—they cannot be accessed or even detected from outside the class. Unlike the underscore convention, this privacy is enforced by the JavaScript engine at runtime. Attempting to access a private field outside the class throws a SyntaxError. Private fields are per-instance and are not part of the prototype; they are stored as internal slots on each object.\n\nFor encapsulation without classes, you can also use WeakMap to store private data keyed by object reference, closures in factory functions, or Symbols as property keys (which provides obscurity but not true privacy, as Symbol properties are discoverable via Object.getOwnPropertySymbols). The choice depends on your needs: # private fields for class-based code, closures for factory functions, and WeakMap for attaching private data to existing objects.",
        shortAnswer:
          "Encapsulation bundles data with methods while restricting access to internals. JavaScript achieves it through: ES2022 private fields/methods (#name), closures in constructor/factory functions, the underscore convention (_name, unenforced), WeakMaps for external private data, and Symbols (obscure but discoverable). Private # fields provide true engine-enforced privacy.",
        code: '// 1. ES2022 Private fields and methods\nclass BankAccount {\n  #balance = 0;\n  #owner;\n\n  constructor(owner, initialBalance) {\n    this.#owner = owner;\n    this.#balance = initialBalance;\n  }\n\n  deposit(amount) {\n    if (this.#isValidAmount(amount)) {\n      this.#balance += amount;\n      return true;\n    }\n    return false;\n  }\n\n  get balance() {\n    return this.#balance; // Read-only access via getter\n  }\n\n  #isValidAmount(amount) { // Private method\n    return typeof amount === "number" && amount > 0;\n  }\n}\n\nconst account = new BankAccount("Alice", 1000);\naccount.deposit(500);\nconsole.log(account.balance); // 1500\n// account.#balance;  // SyntaxError: Private field\n// account.#isValidAmount(100); // SyntaxError\n\n// 2. Closure-based encapsulation (pre-ES2022)\nfunction createCounter(initial) {\n  let count = initial; // Truly private via closure\n\n  return {\n    increment() { count++; },\n    decrement() { count--; },\n    getCount() { return count; },\n  };\n}\n\nconst counter = createCounter(0);\ncounter.increment();\ncounter.increment();\nconsole.log(counter.getCount()); // 2\n// counter.count → undefined (not accessible)\n\n// 3. WeakMap for private data\nconst privateData = new WeakMap();\n\nclass User {\n  constructor(name, ssn) {\n    this.name = name;\n    privateData.set(this, { ssn }); // SSN stored externally\n  }\n  getSSNLastFour() {\n    return privateData.get(this).ssn.slice(-4);\n  }\n}\n\nconst user = new User("Bob", "123-45-6789");\nconsole.log(user.name);           // "Bob" (public)\nconsole.log(user.getSSNLastFour()); // "6789"\n// No way to access ssn directly from outside',
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["encapsulation", "private fields", "closure", "WeakMap"],
        commonMistakes: [
          "Relying on underscore convention (_name) for security—it provides zero enforcement",
          "Thinking private fields (#) are the same as TypeScript's private—# is enforced at runtime, TS private is compile-time only",
          "Forgetting that private fields are per-instance, not per-class—two instances cannot access each other's private fields unless the method is defined in the same class",
        ],
        followUps: [
          "Can private fields be inherited by subclasses?",
          "How do private fields interact with Proxy and Reflect?",
          "What are the performance implications of closure-based vs # private encapsulation?",
        ],
        interviewTips: [
          "Show multiple encapsulation approaches and when to use each one",
          "Mention that # fields are a recent addition—knowing the history shows depth",
        ],
        relatedTopics: [
          "Private Fields",
          "Closures",
          "WeakMap",
          "Module Pattern",
        ],
      },
      {
        id: "js-oop-9",
        question: "Explain polymorphism in JavaScript with examples.",
        answer:
          "Polymorphism, meaning \"many forms,\" is the ability for different objects to respond to the same message (method call) in different ways. In JavaScript, polymorphism is achieved naturally through the prototype chain and duck typing, rather than through formal interfaces or abstract classes as in statically-typed languages. When you call a method on an object, JavaScript doesn't care about the object's class—only that the object has a method with that name.\n\nThe most common form of polymorphism in JavaScript is method overriding (subtype polymorphism). When a child class defines a method with the same name as a parent class method, calling that method on a child instance invokes the child's version. The parent's version can still be accessed via super.method(). This allows different classes in an inheritance hierarchy to provide specialized implementations while sharing a common interface.\n\nDuck typing is another form of polymorphism prevalent in JavaScript: \"if it walks like a duck and quacks like a duck, it's a duck.\" JavaScript doesn't require objects to share a common ancestor to be used polymorphically—any object that has the expected method can be used. This is particularly powerful with interfaces like iterables (any object with a Symbol.iterator method works with for...of), thenables (any object with a .then method works with await), and custom protocols.\n\nJavaScript also supports ad-hoc polymorphism through operator overloading (limited—mainly via toString/valueOf for implicit type coercion) and parametric polymorphism through generic patterns (functions that work with any type via duck typing). While JavaScript doesn't have formal interfaces, TypeScript adds them for compile-time checks, and the convention of duck typing provides runtime polymorphism. Well-designed polymorphic code enables the Open/Closed Principle: systems that are open for extension but closed for modification.",
        shortAnswer:
          "Polymorphism allows different objects to respond to the same method call differently. JavaScript achieves it through method overriding (child classes redefine parent methods), duck typing (any object with the right methods can be used regardless of its type), and protocol-based patterns (iterables, thenables). No formal interfaces are needed—JavaScript relies on structural compatibility.",
        code: '// 1. Method overriding (subtype polymorphism)\nclass Shape {\n  area() {\n    throw new Error("area() must be implemented");\n  }\n  describe() {\n    return "Shape with area: " + this.area().toFixed(2);\n  }\n}\n\nclass Circle extends Shape {\n  constructor(radius) {\n    super();\n    this.radius = radius;\n  }\n  area() { return Math.PI * this.radius ** 2; }\n}\n\nclass Rectangle extends Shape {\n  constructor(width, height) {\n    super();\n    this.width = width;\n    this.height = height;\n  }\n  area() { return this.width * this.height; }\n}\n\nclass Triangle extends Shape {\n  constructor(base, height) {\n    super();\n    this.base = base;\n    this.height = height;\n  }\n  area() { return 0.5 * this.base * this.height; }\n}\n\n// Polymorphic usage - same interface, different behavior\nconst shapes = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 8)];\nshapes.forEach(shape => {\n  console.log(shape.describe());\n});\n// "Shape with area: 78.54"\n// "Shape with area: 24.00"\n// "Shape with area: 12.00"\n\n// 2. Duck typing - no shared ancestor needed\nfunction printArea(shape) {\n  // Works with ANY object that has an area() method\n  console.log("Area: " + shape.area());\n}\n\nconst customShape = {\n  area() { return 42; } // Not a Shape subclass!\n};\nprintArea(customShape); // "Area: 42" — duck typing works!\n\n// 3. Protocol-based polymorphism (iterables)\nclass Range {\n  constructor(start, end) {\n    this.start = start;\n    this.end = end;\n  }\n  [Symbol.iterator]() {\n    let current = this.start;\n    const end = this.end;\n    return {\n      next() {\n        return current <= end\n          ? { value: current++, done: false }\n          : { done: true };\n      }\n    };\n  }\n}\n\n// Works with for...of because it implements the iterable protocol\nfor (const num of new Range(1, 5)) {\n  console.log(num); // 1, 2, 3, 4, 5\n}\n\n// Also works with spread, destructuring, Array.from\nconsole.log([...new Range(1, 3)]); // [1, 2, 3]',
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["polymorphism", "duck typing", "method overriding", "protocols"],
        commonMistakes: [
          "Thinking polymorphism requires inheritance—duck typing enables polymorphism without shared ancestors",
          "Not understanding that JavaScript checks for method existence at runtime, not compile time",
          "Overcomplicating polymorphism with class hierarchies when simple duck typing would suffice",
        ],
        followUps: [
          "How does TypeScript's structural typing relate to duck typing?",
          "What is the difference between ad-hoc and parametric polymorphism?",
          "How do Symbol.toPrimitive and toString/valueOf enable operator polymorphism?",
        ],
        interviewTips: [
          "Show both inheritance-based and duck-typing-based polymorphism to demonstrate versatility",
          "Mention protocol-based polymorphism (iterables, thenables) to show advanced knowledge",
        ],
        relatedTopics: [
          "Inheritance",
          "Duck Typing",
          "Iterators",
          "Interfaces",
        ],
      },
      {
        id: "js-oop-10",
        question: "What is the difference between __proto__ and prototype?",
        answer:
          "The distinction between __proto__ and prototype is one of the most confusing aspects of JavaScript's object system, but understanding it is key to mastering prototypal inheritance. `prototype` is a property that exists on functions (specifically, on constructor functions and classes). It is the object that will become the [[Prototype]] of instances created with `new`. When you write `new Foo()`, the newly created object's internal [[Prototype]] is set to Foo.prototype.\n\n`__proto__` (also accessible via Object.getPrototypeOf()) is a getter/setter that exists on every object and provides access to the object's internal [[Prototype]] link—the actual prototype that is used for property lookup. So `instance.__proto__` gives you the prototype object that the instance inherits from. For an instance created with `new Foo()`, instance.__proto__ === Foo.prototype is true.\n\nThe relationship is: `Constructor.prototype` defines what the [[Prototype]] of new instances will be, while `instance.__proto__` (or Object.getPrototypeOf(instance)) reveals the [[Prototype]] that was assigned. They point to the same object but from different perspectives—one is the blueprint specification (prototype on the constructor), the other is the actual link on the instance (__proto__).\n\nIn practice, you should avoid using __proto__ directly in production code. It was originally a non-standard browser extension that was later standardized in ES2015 for compatibility, but with a recommendation to use Object.getPrototypeOf() and Object.setPrototypeOf() instead. Setting __proto__ (or calling Object.setPrototypeOf()) on an existing object is strongly discouraged because it forces V8 to abandon optimizations (hidden classes and inline caches) for that object, severely impacting performance.",
        shortAnswer:
          "prototype is a property on constructor functions that defines the [[Prototype]] for instances created with new. __proto__ is a property on every object that accesses its actual [[Prototype]] link used for inheritance. For `const obj = new Foo()`: obj.__proto__ === Foo.prototype. Use Object.getPrototypeOf() instead of __proto__ in production code.",
        code: '// prototype lives on constructor functions\nfunction Dog(name) {\n  this.name = name;\n}\nDog.prototype.bark = function() {\n  return this.name + " says woof!";\n};\n\n// __proto__ lives on instances (and all objects)\nconst rex = new Dog("Rex");\n\n// The key relationship:\nconsole.log(rex.__proto__ === Dog.prototype);           // true\nconsole.log(Object.getPrototypeOf(rex) === Dog.prototype); // true\n\n// rex itself does NOT have a .prototype property\nconsole.log(rex.prototype); // undefined\n\n// Dog.prototype is an object with its own __proto__\nconsole.log(Dog.prototype.__proto__ === Object.prototype); // true\n\n// The full chain:\n// rex.__proto__                → Dog.prototype\n// Dog.prototype.__proto__      → Object.prototype\n// Object.prototype.__proto__   → null\n\n// Visualizing the difference:\nconsole.log(Dog.prototype);  // { bark: [Function], constructor: Dog }\nconsole.log(rex.__proto__);  // { bark: [Function], constructor: Dog }\n// Same object, accessed from different sides\n\n// Even functions have __proto__ (they\'re objects too)\nconsole.log(Dog.__proto__ === Function.prototype); // true\nconsole.log(Function.prototype.__proto__ === Object.prototype); // true\n\n// Classes work the same way\nclass Cat {\n  constructor(name) { this.name = name; }\n  meow() { return this.name + " says meow!"; }\n}\n\nconst kitty = new Cat("Kitty");\nconsole.log(kitty.__proto__ === Cat.prototype); // true\nconsole.log(typeof Cat.prototype); // "object"\nconsole.log(typeof Cat); // "function"\n\n// Prefer Object.getPrototypeOf over __proto__\nconst proto = Object.getPrototypeOf(rex);\nconsole.log(proto === Dog.prototype); // true\n\n// Don\'t do this in production (kills V8 optimizations):\n// Object.setPrototypeOf(rex, someOtherProto);',
        language: "javascript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "JavaScript",
        topicId: "js-oop",
        tags: ["__proto__", "prototype", "prototype chain", "inheritance"],
        commonMistakes: [
          "Confusing .prototype (property on functions) with __proto__ (property on all objects)—they serve different roles",
          "Thinking instances have a .prototype property—only functions/classes have .prototype",
          "Using __proto__ in production code instead of Object.getPrototypeOf()/Object.setPrototypeOf()",
        ],
        followUps: [
          "What is Object.create() and how does it relate to prototype and __proto__?",
          "Why does modifying an object's prototype at runtime hurt performance?",
          'What is Function.prototype and why is typeof Function.prototype === "function"?',
        ],
        interviewTips: [
          "Draw a diagram showing Constructor.prototype ← instance.__proto__ to make the relationship clear",
          "Mention performance implications of Object.setPrototypeOf to show awareness of engine internals",
        ],
        relatedTopics: [
          "Prototype Chain",
          "Constructor Functions",
          "Object.create",
        ],
      },
    ],
  },
];
