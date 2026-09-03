var e=[{id:`js-variables`,title:`Variables and Scoping`,description:`Deep dive into JavaScript variable declarations (var, let, const), hoisting behavior, the Temporal Dead Zone, and how scope rules govern variable visibility across your code.`,category:`JavaScript`,difficulty:`Beginner`,tags:[`variables`,`scope`,`hoisting`,`var`,`let`,`const`,`temporal dead zone`,`lexical scope`,`block scope`,`function scope`],overview:`Variables are the foundation of every JavaScript program. Understanding how var, let, and const differ — and how JavaScript resolves variable names through its scoping rules — is essential for writing predictable, bug-free code. This topic covers declaration keywords, hoisting mechanics, the Temporal Dead Zone, and the full scope hierarchy from global to block level.`,concepts:[`var declarations and function scoping`,`let and const with block scoping`,`Hoisting of variables and functions`,`Temporal Dead Zone (TDZ)`,`Global scope`,`Function scope`,`Block scope`,`Lexical (static) scope`,`Scope chain and variable resolution`,`Variable shadowing`,`Declaration vs initialization vs assignment`,`Immutability semantics of const`],relatedTopicIds:[`js-closures`,`js-functions`,`js-execution-context`,`js-data-types`],questions:[{id:`js-vars-1`,question:`What is the difference between var, let, and const?`,answer:`JavaScript provides three keywords for declaring variables: var, let, and const. Each has distinct scoping, hoisting, and reassignment behavior that significantly affects how your code runs.

var is function-scoped, meaning a var declaration inside a function is accessible anywhere within that function regardless of block boundaries like if statements or for loops. When var is declared outside any function it becomes a property of the global object (window in browsers, globalThis in Node.js). var declarations are hoisted to the top of their function and initialized to undefined, so you can reference a var variable before its declaration line without getting a ReferenceError — you simply get undefined.

let and const, introduced in ES6, are block-scoped. A block is any pair of curly braces: an if body, a for loop, or even a standalone block. Variables declared with let or const inside a block are not accessible outside it. Both are hoisted to the top of their block but are not initialized until the declaration statement is evaluated — the region between the start of the block and the declaration is called the Temporal Dead Zone (TDZ), and accessing the variable during this window throws a ReferenceError.

The key difference between let and const is reassignment. let allows you to reassign a new value after the initial declaration. const requires an initializer at declaration time and does not permit reassignment of the binding. However, const does not make the value immutable — if the value is an object or array, its properties or elements can still be mutated freely.

In modern JavaScript, the best practice is to default to const for any binding you do not intend to reassign, use let when reassignment is necessary (loop counters, accumulators), and avoid var entirely unless you have a specific reason to rely on function scoping or legacy behavior.`,shortAnswer:`var is function-scoped, hoisted with undefined initialization, and allows redeclaration. let is block-scoped, hoisted but not initialized (TDZ), and allows reassignment. const is block-scoped like let but does not allow reassignment of the binding, though object contents remain mutable.`,code:`// Scoping difference
function scopeDemo() {
  if (true) {
    var a = 1;   // function-scoped — accessible outside the if
    let b = 2;   // block-scoped — only inside this if
    const c = 3; // block-scoped — only inside this if
  }
  console.log(a); // 1
  // console.log(b); // ReferenceError
  // console.log(c); // ReferenceError
}

// Hoisting difference
console.log(x); // undefined (var is hoisted and initialized)
var x = 10;

// console.log(y); // ReferenceError (TDZ)
let y = 20;

// Reassignment
let count = 0;
count = 1; // OK

const name = "Alice";
// name = "Bob"; // TypeError: Assignment to constant variable

// const with objects — mutation is allowed
const user = { age: 25 };
user.age = 26; // perfectly fine
// user = {};  // TypeError`,language:`javascript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`var`,`let`,`const`,`scope`,`hoisting`],commonMistakes:[`Assuming const makes objects immutable — it only prevents reassignment of the binding, not mutation of the value.`,`Using var inside a for loop and expecting each iteration to have its own copy — var is function-scoped, so closures over the loop variable share the same reference.`,`Redeclaring a let or const variable in the same scope, which throws a SyntaxError, unlike var which silently allows redeclaration.`],followUps:[`How does var behave inside a for loop compared to let?`,`What is the difference between Object.freeze() and const?`,`Can you use const with destructuring?`],interviewTips:[`Start by explaining scope differences (function vs block), then move to hoisting, and finish with reassignment rules — this shows structured thinking.`,`Mention the best-practice recommendation: prefer const by default, use let when needed, avoid var.`],relatedTopics:[`hoisting`,`scope`,`temporal dead zone`]},{id:`js-vars-2`,question:`What is hoisting? What gets hoisted?`,answer:`Hoisting is the JavaScript engine behavior where variable and function declarations are processed during the compilation phase before code is executed line by line. Conceptually, it is as though declarations are "moved" to the top of their enclosing scope, although the code is not physically rearranged.

During the creation phase of an execution context, the engine scans the code for declarations. For var variables, the engine creates a binding in the current scope and initializes it to undefined. This is why referencing a var before its declaration line yields undefined rather than an error. For function declarations (the \`function name() {}\` syntax), both the name binding and the entire function body are hoisted, making the function callable before its declaration line.

let and const declarations are also hoisted — the engine is aware of them from the start of their block — but they are not initialized. They exist in an uninitialized state from the beginning of the block until the declaration line is reached. Accessing them before that line triggers a ReferenceError. This uninitialized region is the Temporal Dead Zone (TDZ).

Function expressions and arrow functions assigned to variables follow the hoisting rules of their declaration keyword. A function expression declared with var will be hoisted as undefined, so calling it before the assignment line throws a TypeError (undefined is not a function). If declared with let or const, calling it before the declaration throws a ReferenceError due to the TDZ.

Class declarations are hoisted similarly to let — the name is known but accessing the class before its declaration throws a ReferenceError. This contrasts with function declarations, which are fully available before their declaration line.`,shortAnswer:`Hoisting is JavaScript processing declarations during compilation before executing code. var is hoisted and initialized to undefined. Function declarations are fully hoisted (name + body). let, const, and class declarations are hoisted but remain uninitialized in the Temporal Dead Zone until their declaration line.`,code:`// Function declarations are fully hoisted
greet(); // "Hello!" — works fine
function greet() {
  console.log("Hello!");
}

// var is hoisted with undefined
console.log(score); // undefined
var score = 100;

// let is hoisted but NOT initialized (TDZ)
// console.log(price); // ReferenceError: Cannot access 'price' before initialization
let price = 50;

// Function expression with var — hoisted as undefined
// sayHi(); // TypeError: sayHi is not a function
var sayHi = function () {
  console.log("Hi!");
};

// Function expression with const — TDZ
// sayBye(); // ReferenceError
const sayBye = () => {
  console.log("Bye!");
};`,language:`javascript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`hoisting`,`var`,`let`,`const`,`functions`],commonMistakes:[`Believing let and const are not hoisted — they are hoisted, but remain uninitialized (TDZ) unlike var which is initialized to undefined.`,`Confusing function declarations with function expressions — only declarations are fully hoisted with their body.`,`Assuming hoisting physically moves code — it is a conceptual model describing how the engine processes declarations during compilation.`],followUps:[`What is the order of precedence when a function and a var share the same name?`,`How does hoisting interact with modules (import/export)?`,`Why do function declarations hoist differently than class declarations?`],interviewTips:[`Draw a mental picture of two phases: creation phase (declarations processed) and execution phase (code runs line by line) — interviewers love this mental model.`,`Always clarify the difference between "hoisted and initialized" (var) vs "hoisted but uninitialized" (let/const).`],relatedTopics:[`execution context`,`temporal dead zone`,`function declarations`]},{id:`js-vars-3`,question:`What is the Temporal Dead Zone?`,answer:`The Temporal Dead Zone (TDZ) is the period between the start of a scope (block, function, or module) and the point where a let or const variable is declared and initialized. During this window the variable exists in the scope (the engine knows about it due to hoisting) but it is in an uninitialized state, and any attempt to read or write it throws a ReferenceError.

The TDZ exists because of a deliberate design decision in the ES6 specification. With var, the automatic initialization to undefined masked bugs — developers could accidentally use a variable before assigning it a meaningful value and get silent undefined behavior instead of an obvious error. The TDZ enforces a discipline where you cannot use a variable before you have explicitly given it a value, making code more predictable and easier to debug.

The TDZ is not based on the physical order of lines in source code but on the temporal order of execution. For example, a function defined above a let declaration can reference that variable, but if the function is called before the let statement has been evaluated at runtime, a ReferenceError occurs. This nuance is important in scenarios involving closures and callbacks.

The TDZ also applies to default parameter values, class declarations, and even to const bindings in for-of and for-in loops at each iteration boundary. Understanding the TDZ helps explain why moving variable declarations to the top of their scope (or using them only after declaration) is a robust coding practice.

In summary, the TDZ is a safeguard that transforms what would be a silent undefined bug with var into an explicit error with let and const, catching programming mistakes at the earliest possible moment.`,shortAnswer:`The Temporal Dead Zone (TDZ) is the region from the start of a block scope to the let or const declaration line where the variable is hoisted but uninitialized. Accessing it during this window throws a ReferenceError, enforcing that variables are used only after explicit initialization.`,code:`// TDZ demonstration
{
  // TDZ for \`message\` starts here
  // console.log(message); // ReferenceError: Cannot access 'message' before initialization

  let message = "Hello"; // TDZ ends here
  console.log(message);  // "Hello"
}

// TDZ is temporal, not positional
function logValue() {
  console.log(value); // This line is fine IF called AFTER the let
}

let value = 42;
logValue(); // 42 — called after declaration, no TDZ issue

// TDZ in function parameters
// function broken(a = b, b = 1) {} // ReferenceError: b is in TDZ when a's default is evaluated
function working(a = 1, b = a) {
  console.log(a, b); // 1, 1
}
working();

// typeof does NOT save you from TDZ
// console.log(typeof undeclaredVar); // "undefined" — no error for truly undeclared
// console.log(typeof tdzVar);        // ReferenceError — TDZ
// let tdzVar = 10;`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`temporal dead zone`,`let`,`const`,`hoisting`,`TDZ`],commonMistakes:[`Thinking typeof is safe for TDZ variables — typeof throws a ReferenceError for variables in the TDZ, unlike truly undeclared variables.`,`Confusing the TDZ with the variable not being hoisted — the variable IS hoisted, but it is in an uninitialized state.`,`Assuming the TDZ only applies to let — const and class declarations also have a TDZ.`],followUps:[`Does the TDZ apply to function parameters with default values?`,`How does the TDZ interact with closures?`,`What errors does the TDZ produce — ReferenceError or TypeError?`],interviewTips:[`Explain why the TDZ exists (to catch bugs that var silently ignored) rather than just describing what it is — this shows deeper understanding.`],relatedTopics:[`hoisting`,`let`,`const`,`block scope`]},{id:`js-vars-4`,question:`Why does accessing let before initialization throw an error?`,answer:`When the JavaScript engine enters a new scope (block, function, or module), it performs a creation phase where it identifies all declarations. For let and const, the engine allocates a binding in memory but deliberately leaves it in a special "uninitialized" state rather than assigning undefined as it does with var. This is by design in the ECMAScript specification.

The engine tracks which bindings have been initialized. When code execution reaches the let or const declaration statement, the variable transitions from uninitialized to initialized (with either the assigned value or undefined for a bare \`let x;\`). Before that point, any read or write operation on the binding triggers a ReferenceError because the specification mandates that accessing an uninitialized binding is illegal.

This design choice was motivated by a real class of bugs in JavaScript. With var, variables are automatically initialized to undefined during hoisting. Developers frequently wrote code that accidentally used variables before assigning meaningful values, producing subtle undefined-related bugs that were difficult to trace. The ES6 committee decided that let and const should fail loudly instead, so developers are forced to declare and initialize variables before using them.

The mechanism behind this is part of the Environment Record specification. Each scope has an associated Environment Record that maps identifier names to values. For let and const, the record entry is created during the creation phase but marked as "not yet initialized." The GetBindingValue and SetMutableBinding abstract operations check this flag and throw if the binding is still uninitialized.

This behavior is consistent across all modern JavaScript engines (V8, SpiderMonkey, JavaScriptCore) and is not a quirk but a deliberate, spec-mandated feature that improves code reliability.`,shortAnswer:`Accessing let before its declaration throws a ReferenceError because let bindings are hoisted but left in an "uninitialized" state by the engine. The specification mandates this to prevent the subtle bugs caused by var's automatic undefined initialization, enforcing a discipline where variables must be explicitly initialized before use.`,code:`// var: hoisted and initialized to undefined (no error, just silent bug)
console.log(a); // undefined
var a = 5;
console.log(a); // 5

// let: hoisted but NOT initialized (explicit error)
try {
  console.log(b); // ReferenceError: Cannot access 'b' before initialization
} catch (e) {
  console.log(e.message);
}
let b = 10;
console.log(b); // 10

// Even a bare \`let\` without assignment initializes to undefined at declaration
let c;
console.log(c); // undefined — this is fine, declaration was reached

// The error is a ReferenceError, not TypeError or SyntaxError
try {
  const d = e;
  let e = 20;
} catch (err) {
  console.log(err instanceof ReferenceError); // true
}`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`let`,`TDZ`,`hoisting`,`ReferenceError`],commonMistakes:[`Thinking the error means let is not hoisted — it IS hoisted, but the initialization behavior differs from var.`,`Expecting a TypeError — the error is a ReferenceError because the binding exists but is not initialized.`,"Believing `let x;` leaves x in the TDZ — a bare let declaration without an initializer sets the value to undefined at that line."],followUps:[`What is the difference between a ReferenceError and a TypeError in this context?`,`How does the Environment Record track initialization status internally?`],interviewTips:[`Reference the ECMAScript specification concepts (Environment Record, uninitialized binding) to demonstrate deep knowledge beyond surface-level understanding.`],relatedTopics:[`temporal dead zone`,`hoisting`,`execution context`,`environment record`]},{id:`js-vars-5`,question:`Explain lexical scope.`,answer:`Lexical scope (also called static scope) means that the accessibility of variables is determined by the physical location of the code when it is written, not by the runtime call stack. When the JavaScript engine encounters a variable reference, it resolves the variable based on where the function was defined, not where it was invoked. This is determined at compile time by analyzing the nesting structure of functions and blocks.

In a lexically scoped language, every function carries a reference to its surrounding (outer) environment — the environment that existed when the function was created. This reference is preserved even if the function is passed around as a callback or returned from another function. This property is the foundation of closures: a function "closes over" the variables of its lexical environment and can access them long after the outer function has returned.

Consider a function inner() defined inside function outer(). inner() has access to all variables declared in outer() because inner()'s lexical scope includes outer()'s scope. Even if inner() is returned and invoked somewhere else entirely, it still looks up variables in outer()'s scope — not in the scope of wherever it is eventually called.

Lexical scope applies to all scoping levels: global, function, and block. A variable declared in a block is visible to all inner blocks and functions defined within that block. The engine traverses the nesting chain from the innermost scope outward until it finds the variable or reaches the global scope.

Almost all modern languages (JavaScript, Python, Rust, Go, Java) use lexical scoping. The alternative, dynamic scoping, resolves variables based on the runtime call stack and is found in some older languages like early Lisps and Bash shell. JavaScript exclusively uses lexical scoping (with the exception of the deprecated \`with\` statement and the special \`this\` keyword, which is resolved dynamically).`,shortAnswer:`Lexical scope means variable access is determined by where code is written (the nesting of functions and blocks), not where it is called at runtime. A function always has access to variables from the scope in which it was defined, enabling closures.`,code:`const globalVar = "I am global";

function outer() {
  const outerVar = "I am from outer";

  function inner() {
    const innerVar = "I am from inner";
    // inner can access all three — lexical scope chain
    console.log(innerVar);  // "I am from inner"
    console.log(outerVar);  // "I am from outer"
    console.log(globalVar); // "I am global"
  }

  inner();
  // console.log(innerVar); // ReferenceError — inner's scope is not accessible here
}

outer();

// Lexical scope + closure
function createCounter() {
  let count = 0; // lexically enclosed
  return function increment() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// \`increment\` still accesses \`count\` from createCounter's scope`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`lexical scope`,`static scope`,`closures`,`scope chain`],commonMistakes:["Confusing lexical scope with dynamic scope — JavaScript uses lexical scoping exclusively (except for `this` binding).",`Thinking inner functions cannot access outer variables after the outer function returns — closures preserve the lexical environment.`,"Assuming arrow functions change scoping rules — they follow the same lexical scope rules as regular functions (though `this` binding differs)."],followUps:[`How does lexical scope enable closures?`,`What is the difference between lexical scope and dynamic scope?`,"Does the `this` keyword follow lexical scoping rules?"],interviewTips:[`Connect lexical scope to closures — interviewers often ask about scope as a stepping stone to closures, and making the link proactively demonstrates strong fundamentals.`],relatedTopics:[`closures`,`scope chain`,`execution context`]},{id:`js-vars-6`,question:`Explain scope chain.`,answer:`The scope chain is the mechanism JavaScript uses to resolve variable references at runtime. When code accesses a variable, the engine starts looking in the current (innermost) scope. If the variable is not found there, it traverses outward through each enclosing scope — following the chain of lexical environments — until it either finds the variable or reaches the global scope. If the variable is not found in the global scope either, a ReferenceError is thrown.

Each execution context (global, function, or block) has an associated Lexical Environment, which contains an Environment Record (the actual variable bindings) and an outer reference pointing to the parent Lexical Environment. The scope chain is formed by this linked list of outer references. When a function is created, it stores a reference to the Lexical Environment of the scope in which it was defined (its [[Environment]] internal slot), which becomes the starting point for the outer reference when the function is later invoked.

The scope chain is established at function creation time based on lexical nesting, not at call time. This is why closures work: even if a function is called from a completely different part of the code, its scope chain still points back to the environment where it was originally defined. The chain does not change based on where or how the function is invoked.

The resolution process is deterministic and follows a strict order: local scope first, then each enclosing scope in order, and finally the global scope. This means an inner variable with the same name as an outer variable "shadows" the outer one — the engine stops searching as soon as it finds the first match.

Understanding the scope chain is critical for debugging variable resolution issues, understanding closures, and avoiding unintended global variable creation (which happens when you assign to a variable without declaring it in non-strict mode).`,shortAnswer:`The scope chain is the linked sequence of lexical environments JavaScript traverses when resolving a variable reference. The engine looks in the current scope first, then each outer scope in order, until it finds the variable or reaches global scope. It is determined at function creation time based on lexical nesting.`,code:`const x = "global";

function first() {
  const x = "first";

  function second() {
    const x = "second";

    function third() {
      // Scope chain: third -> second -> first -> global
      console.log(x); // "second" — found in second's scope, stops searching
    }

    third();
  }

  second();
}

first();

// Scope chain with variable not in local scope
const color = "blue";

function paintRoom() {
  // \`color\` is not in paintRoom's scope
  // Engine follows scope chain: paintRoom -> global
  console.log(color); // "blue" — found in global scope
}

paintRoom();

// Unintended global in non-strict mode
function leaky() {
  // oops = "leaked"; // Without declaration, creates a global variable (sloppy mode)
  // In strict mode: ReferenceError: oops is not defined
}

// Demonstrating scope chain with closures
function makeGreeter(greeting) {
  return function (name) {
    // Scope chain: anonymous -> makeGreeter -> global
    return \`\${greeting}, \${name}!\`;
  };
}

const hello = makeGreeter("Hello");
console.log(hello("World")); // "Hello, World!"`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`scope chain`,`lexical environment`,`closures`,`variable resolution`],commonMistakes:[`Assuming the scope chain is based on the call stack — it is based on lexical nesting (where functions are defined), not where they are called.`,`Forgetting that assigning to an undeclared variable in sloppy mode creates a global variable instead of throwing an error.`,`Overlooking that inner scopes shadow outer variables with the same name, which can lead to confusing bugs.`],followUps:[`How does the scope chain differ from the prototype chain?`,`What role does the [[Environment]] internal slot play in scope chain creation?`,`How does strict mode affect scope chain behavior?`],interviewTips:[`Mention the internal mechanism (Lexical Environment with outer reference) to show you understand how the engine actually works, not just the surface behavior.`,`Use a nested function example to visually walk through each step of the chain.`],relatedTopics:[`lexical scope`,`closures`,`execution context`,`lexical environment`]},{id:`js-vars-7`,question:`What are the different scopes in JavaScript?`,answer:`JavaScript has four distinct scope levels that control where variables are visible and accessible: global scope, function scope, block scope, and module scope.

Global scope is the outermost scope in a JavaScript program. Variables declared outside any function or block reside in the global scope and are accessible from anywhere in the code. In browsers, global var declarations become properties of the window object, while let and const declarations in the global scope do not attach to window — they live in a separate declarative Environment Record. In Node.js, each file is wrapped in a module function, so top-level var declarations are module-scoped rather than truly global.

Function scope is created whenever a function is invoked. All variables declared with var inside a function are accessible throughout the entire function body, regardless of any inner blocks. let and const within a function body (but outside any inner block) are also function-scoped in practice because the function body itself is their enclosing block. Each function call creates a new scope, so variables are independent between calls.

Block scope was introduced with ES6 via let and const. Any pair of curly braces — if/else bodies, for/while loops, switch cases, try/catch blocks, or standalone blocks — creates a block scope. Variables declared with let or const inside a block are not accessible outside it. This is the primary advantage over var, which ignores block boundaries entirely.

Module scope applies to ES modules (files using import/export). Each module has its own top-level scope that is separate from the global scope. Variables declared at the top level of a module are not globally accessible — they must be explicitly exported and imported. This provides natural encapsulation and prevents global namespace pollution.`,shortAnswer:`JavaScript has four scopes: global scope (accessible everywhere), function scope (created per function call, var is limited to this), block scope (created by curly braces, let/const are limited to this), and module scope (each ES module has its own isolated top-level scope).`,code:`// 1. Global scope
var globalVar = "I am global"; // attaches to window in browsers
let globalLet = "I am global let"; // does NOT attach to window

// 2. Function scope
function demo() {
  var funcVar = "function scoped";
  let funcLet = "also function scoped (since function body is a block)";
  
  if (true) {
    var stillFuncScoped = "var ignores blocks";
    let blockOnly = "block scoped";
  }
  
  console.log(stillFuncScoped); // "var ignores blocks"
  // console.log(blockOnly);    // ReferenceError
}

// console.log(funcVar); // ReferenceError — function scoped

// 3. Block scope
for (let i = 0; i < 3; i++) {
  // \`i\` is scoped to this for-loop block
}
// console.log(i); // ReferenceError

for (var j = 0; j < 3; j++) {
  // \`j\` leaks out of the block
}
console.log(j); // 3

// 4. Module scope (in an ES module file)
// const secret = "module-private"; // not accessible outside without export
// export const shared = "accessible to importers";`,language:`javascript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`global scope`,`function scope`,`block scope`,`module scope`],commonMistakes:[`Assuming var respects block scope — var is only limited by function boundaries, not blocks like if/for/while.`,`Thinking top-level declarations in Node.js are global — Node wraps each file in a function, making top-level vars module-scoped.`,`Forgetting that let and const in the global scope do not become properties of the window object, unlike var.`],followUps:[`How does scope differ between a script tag and an ES module in the browser?`,`What is the difference between global scope in browsers vs Node.js?`,`How do IIFEs create scope in pre-ES6 code?`],interviewTips:[`Mention all four scopes including module scope — many candidates forget it, and including it shows comprehensive understanding.`,`Highlight the var-in-loop pitfall as a concrete example of why block scope matters.`],relatedTopics:[`var`,`let`,`const`,`modules`,`lexical scope`]},{id:`js-vars-8`,question:`Can you reassign a const variable? What about const objects?`,answer:`A const declaration creates a read-only binding between a name and a value. You cannot reassign the binding — attempting \`constVar = newValue\` throws a TypeError. However, const does not make the value itself immutable. This distinction between the binding and the value is one of the most misunderstood aspects of const.

When const holds a primitive value (number, string, boolean, null, undefined, symbol, bigint), the value is effectively immutable because primitives are immutable by nature. There is no way to change the value without reassigning the binding, and reassignment is forbidden. So \`const x = 5; x = 10;\` throws a TypeError.

When const holds a reference type (object, array, Map, Set, function), the const keyword only prevents you from pointing the variable at a different reference. The internal contents of the object or array are completely mutable. You can add, modify, or delete properties on a const object, push to a const array, or set entries in a const Map. The reference (the memory address the variable points to) cannot change, but the data at that address can.

To achieve true immutability for objects, you need additional mechanisms. Object.freeze() creates a shallow freeze — top-level properties become non-writable and non-configurable, but nested objects remain mutable. For deep immutability, you need a recursive freeze function or a library like Immer or Immutable.js. TypeScript also offers the \`Readonly<T>\` utility type and \`as const\` assertions for compile-time immutability checks.

The practical implication is that const communicates developer intent — "I will not reassign this binding" — rather than guaranteeing immutability. This is still valuable: it narrows the space of what the variable can become, making code easier to reason about.`,shortAnswer:`You cannot reassign a const binding — that throws a TypeError. However, const objects and arrays are fully mutable: you can add, change, or delete their properties. const protects the binding (the reference), not the value it points to. Use Object.freeze() for shallow immutability.`,code:`// Primitive const — effectively immutable
const PI = 3.14159;
// PI = 3; // TypeError: Assignment to constant variable

// Object const — reference is fixed, contents are mutable
const user = { name: "Alice", age: 25 };
user.age = 26;           // OK — mutating a property
user.email = "a@b.com";  // OK — adding a property
delete user.email;       // OK — deleting a property
// user = { name: "Bob" }; // TypeError — reassigning the binding

console.log(user); // { name: "Alice", age: 26 }

// Array const — same rules
const numbers = [1, 2, 3];
numbers.push(4);    // OK
numbers[0] = 99;    // OK
// numbers = [5, 6]; // TypeError

console.log(numbers); // [99, 2, 3, 4]

// Object.freeze for shallow immutability
const config = Object.freeze({ host: "localhost", port: 3000 });
config.port = 8080; // silently fails (or TypeError in strict mode)
console.log(config.port); // 3000 — unchanged

// Freeze is shallow — nested objects are still mutable
const deep = Object.freeze({ nested: { value: 1 } });
deep.nested.value = 999;
console.log(deep.nested.value); // 999 — nested mutation works`,language:`javascript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`const`,`immutability`,`Object.freeze`,`reference types`],commonMistakes:[`Thinking const makes objects immutable — it only prevents reassignment of the binding, not mutation of the referenced value.`,`Relying on Object.freeze() for deep immutability — it only freezes the top level; nested objects remain mutable.`,`Confusing const with final in Java or readonly in C# — JavaScript const is purely about the binding, not the value.`],followUps:[`How would you implement deep freeze in JavaScript?`,`What is the difference between Object.freeze(), Object.seal(), and Object.preventExtensions()?`,"How does TypeScript's `as const` assertion differ from JavaScript's const?"],interviewTips:[`Clearly distinguish between binding immutability (what const provides) and value immutability (what Object.freeze provides) — this is a common interview trap.`],relatedTopics:[`Object.freeze`,`immutability`,`reference vs value types`]},{id:`js-vars-9`,question:`What is variable shadowing?`,answer:`Variable shadowing occurs when a variable declared in an inner scope has the same name as a variable in an outer scope. The inner declaration "shadows" the outer one, meaning any reference to that name within the inner scope resolves to the inner variable. The outer variable is not modified or destroyed — it is simply inaccessible by that name within the inner scope.

Shadowing is a natural consequence of how the scope chain works. When the JavaScript engine encounters a variable reference, it starts looking in the current scope and moves outward through the chain. If the variable is found in the current scope, the engine stops searching and never reaches the outer scope's variable. The outer variable still exists and retains its value; it is just unreachable from the inner scope.

Shadowing can happen at any scope level. A let in a block can shadow a let in the enclosing function. A function parameter can shadow a global variable. A var in a function can shadow a global var. However, there are specific rules: you cannot shadow a let variable with a var in the same function scope (this throws a SyntaxError), though you can shadow a var with a let in an inner block.

While shadowing is syntactically valid, it is generally considered a code smell because it reduces readability. When a developer sees a variable name, they may assume it refers to the outer binding, leading to confusion and bugs. Linters like ESLint have a "no-shadow" rule that warns against this practice.

There are legitimate uses of shadowing, such as in catch blocks where the error parameter shadows an outer variable, or in callbacks where a common parameter name (like \`err\` or \`item\`) naturally shadows. In these cases the shadowing is intentional and understood by convention.`,shortAnswer:`Variable shadowing happens when an inner scope declares a variable with the same name as one in an outer scope. The inner variable takes precedence within its scope, making the outer one inaccessible by that name. The outer variable is unchanged — it is just hidden from the inner scope.`,code:`const name = "Global";

function outer() {
  const name = "Outer"; // shadows global \`name\`
  console.log(name);    // "Outer"

  function inner() {
    const name = "Inner"; // shadows outer \`name\`
    console.log(name);    // "Inner"
  }

  inner();
  console.log(name); // "Outer" — inner's shadow doesn't affect this scope
}

outer();
console.log(name); // "Global" — outer scopes are unaffected

// Shadowing with different keywords
var x = 1;
{
  let x = 2; // let can shadow var in an inner block
  console.log(x); // 2
}
console.log(x); // 1

// Illegal shadowing — var cannot shadow let in the same function scope
// let y = 1;
// {
//   var y = 2; // SyntaxError: Identifier 'y' has already been declared
// }

// Common legitimate use: callback parameters
const items = [1, 2, 3];
items.forEach(function (item) {
  // \`item\` parameter naturally shadows any outer \`item\`
  console.log(item);
});`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`variable shadowing`,`scope`,`scope chain`,`naming conflicts`],commonMistakes:[`Thinking shadowing modifies the outer variable — it only hides it within the inner scope; the outer variable remains unchanged.`,`Using var to shadow a let in the same function scope — this throws a SyntaxError because var is function-scoped and conflicts with the existing let binding.`,`Unintentionally shadowing variables and then being confused when the outer value is not what they expected.`],followUps:[`What is the "no-shadow" ESLint rule and when would you enable it?`,`Can function parameters shadow outer variables?`,`What is the difference between shadowing and reassignment?`],interviewTips:[`Mention the illegal shadowing case (var inside a block when let exists in the enclosing function) — it shows you understand the nuanced interaction between var and let scoping.`],relatedTopics:[`scope chain`,`lexical scope`,`naming conventions`]},{id:`js-vars-10`,question:`Explain the difference between declaration and initialization.`,answer:`In JavaScript, creating and using a variable involves up to three distinct steps: declaration, initialization, and assignment. Understanding these phases is essential for grasping hoisting, the Temporal Dead Zone, and how different keywords behave.

Declaration is the step where the JavaScript engine registers a variable name in the current scope. During the creation phase of an execution context, the engine scans the code for var, let, const, function, and class declarations and creates bindings for them in the appropriate Environment Record. At this point, the engine knows the variable exists, but it may not yet have a value. For var, declaration and initialization happen simultaneously — the variable is both registered and set to undefined. For let and const, only the declaration happens; the variable is registered but left in an uninitialized state (the TDZ).

Initialization is the step where a variable receives its first value. For var, initialization to undefined happens during hoisting (at declaration time). For let, initialization happens when execution reaches the let statement — if no value is provided (\`let x;\`), the variable is initialized to undefined at that point. For const, initialization must happen at the declaration statement and an initializer is required (\`const x = value;\`). A bare \`const x;\` is a SyntaxError. The TDZ for let and const exists precisely because there is a gap between declaration (hoisting) and initialization (code execution reaching the statement).

Assignment is the step where a new value is given to an already-initialized variable. With let and var, you can assign new values any number of times after initialization. With const, assignment after initialization is forbidden — the initial value provided at the declaration line is the only value the binding will ever hold.

This three-phase model explains many behaviors: why var gives undefined before its line (declared and initialized during hoisting), why let throws a ReferenceError before its line (declared but not initialized), and why const requires an initializer (declaration without initialization is meaningless for an immutable binding).`,shortAnswer:`Declaration registers a variable name in the scope. Initialization gives it its first value. For var, both happen during hoisting (initialized to undefined). For let, declaration is hoisted but initialization waits until the code line is reached. For const, initialization must occur at the declaration line with a required value.`,code:`// Declaration vs initialization vs assignment

// var: declaration + initialization (to undefined) happen together during hoisting
console.log(a); // undefined — declared AND initialized
var a;          // declaration line (already processed during hoisting)
a = 10;         // assignment

// let: declaration is hoisted, initialization happens at the line
// console.log(b); // ReferenceError — declared but NOT initialized (TDZ)
let b;           // initialization happens here (value: undefined)
console.log(b);  // undefined
b = 20;          // assignment

// const: declaration + initialization must happen together at the line
// const c;      // SyntaxError: Missing initializer in const declaration
const c = 30;   // declaration + initialization + assignment all at once
// c = 40;       // TypeError — no reassignment

// Function declarations: declaration + full initialization during hoisting
console.log(greet()); // "hi" — fully hoisted
function greet() {
  return "hi";
}

// Function expressions: follow the variable keyword rules
// console.log(sayHi()); // TypeError: sayHi is not a function (var — initialized to undefined)
var sayHi = function () {
  return "hi";
};`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-variables`,tags:[`declaration`,`initialization`,`assignment`,`hoisting`,`TDZ`],commonMistakes:[`Conflating declaration and initialization — they are separate steps, and the gap between them is what creates the TDZ for let/const.`,"Thinking `let x;` leaves x uninitialized — it initializes x to undefined at that line; the TDZ ends at the declaration statement.","Forgetting that const requires an initializer — `const x;` is a SyntaxError, unlike `let x;` which is valid."],followUps:[`How do function declarations differ from variable declarations in terms of hoisting phases?`,`What does the ECMAScript spec mean by "uninitialized binding"?`,`Can you have a declaration without initialization in all three keywords?`],interviewTips:[`Frame your answer around the three phases (declaration, initialization, assignment) and map each keyword to its behavior — this structured approach impresses interviewers.`],relatedTopics:[`hoisting`,`temporal dead zone`,`execution context`]}]}],t=[{id:`js-types`,title:`Primitive vs Reference Types`,description:`Deep dive into JavaScript type system covering primitives, objects, copy semantics, type coercion, and equality comparison.`,category:`JavaScript`,difficulty:`Beginner`,tags:[`primitives`,`reference types`,`type coercion`,`typeof`,`equality`,`shallow copy`,`deep copy`],overview:`JavaScript has two fundamental categories of data types: primitives and reference types. Primitives (string, number, boolean, null, undefined, symbol, bigint) are immutable values stored directly in the variable's memory location. Reference types (objects, arrays, functions) are stored as pointers to heap-allocated memory. Understanding how these categories differ in assignment, comparison, and mutation is essential for writing correct JavaScript and avoiding subtle bugs around shared state, equality checks, and type coercion.`,concepts:[`Primitive types: string, number, boolean, null, undefined, symbol, bigint`,`Reference types: objects, arrays, functions, Date, RegExp, Map, Set`,`Copy by value vs copy by reference`,`Shallow copy vs deep copy techniques`,`Implicit and explicit type coercion`,`Abstract equality (==) vs strict equality (===) vs Object.is()`,`typeof operator and its quirks`,`instanceof operator and prototype chain checking`,`Object.prototype.toString.call() for reliable type detection`,`Falsy and truthy value coercion rules`],relatedTopicIds:[`js-closures`,`js-prototypes`,`js-objects`],questions:[{id:`js-types-1`,question:`What are primitive types in JavaScript?`,answer:`JavaScript defines seven primitive types: string, number, boolean, null, undefined, symbol (ES2015), and bigint (ES2020). Primitives are the most fundamental building blocks of the language — they are not objects and have no methods of their own. When you call a method like "hello".toUpperCase(), JavaScript temporarily wraps the primitive in its corresponding wrapper object (String, Number, Boolean), invokes the method, and discards the wrapper.

Primitives are immutable. Once a primitive value is created, it cannot be altered. Operations on primitives always produce new values rather than mutating the original. For example, str.replace() does not modify str — it returns a new string. This immutability guarantee is a key difference from reference types, where in-place mutation is the norm.

Primitives are stored by value. When you assign a primitive to a new variable or pass it to a function, a completely independent copy of the value is created. Changing the copy has no effect on the original. This contrasts sharply with reference types, where assignment copies a pointer rather than the data itself.

The typeof operator can identify most primitives, but has a well-known quirk: typeof null returns "object" rather than "null". This is a legacy bug from the first implementation of JavaScript and cannot be fixed without breaking the web. To reliably check for null, use a strict equality check (value === null).

Symbol provides unique, collision-free property keys useful for metaprogramming (e.g., Symbol.iterator). BigInt enables safe integer arithmetic beyond Number.MAX_SAFE_INTEGER (2^53 - 1). Both were added to fill gaps that could not be addressed by the original five primitives.`,shortAnswer:`JavaScript has seven primitive types: string, number, boolean, null, undefined, symbol, and bigint. They are immutable, compared by value, and copied by value on assignment.`,code:`// The seven primitives
const str: string = "hello";          // string
const num: number = 42;               // number
const bool: boolean = true;           // boolean
const nothing: null = null;           // null
let notAssigned: undefined = undefined; // undefined
const sym: symbol = Symbol("id");     // symbol
const big: bigint = 9007199254740992n; // bigint

// Primitives are copied by value
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — unchanged

// Primitives are immutable
const greeting = "hello";
const upper = greeting.toUpperCase();
console.log(greeting); // "hello" — original unchanged
console.log(upper);    // "HELLO" — new string returned

// typeof quirk
console.log(typeof null); // "object" (historic bug)`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`primitives`,`typeof`,`immutability`],commonMistakes:[`Assuming typeof null returns "null" — it actually returns "object"`,`Trying to mutate a string in place (e.g., str[0] = "H") — strings are immutable`,`Confusing BigInt with Number — they cannot be mixed in arithmetic without explicit conversion`],followUps:[`How does autoboxing work when you call methods on primitives?`,`What is the difference between a primitive and its wrapper object (e.g., "hello" vs new String("hello"))?`,`Why was Symbol added to the language?`],interviewTips:[`List all seven primitives confidently — interviewers notice if you forget symbol or bigint`,`Mention the typeof null === "object" bug proactively to demonstrate deep knowledge`]},{id:`js-types-2`,question:`Explain the difference between primitive and reference types.`,answer:`The core distinction lies in how values are stored and accessed in memory. Primitive values (string, number, boolean, null, undefined, symbol, bigint) are stored directly in the variable's allocated memory on the stack. When you assign a primitive to another variable, the engine copies the actual value. Each variable then holds its own independent copy, so mutating one has no effect on the other.

Reference types — objects, arrays, functions, Date, RegExp, Map, Set, and all other non-primitive values — are stored on the heap. The variable itself holds a reference (pointer) to the heap location, not the data. Assignment or argument-passing copies the reference, so both variables end up pointing to the same underlying object. This means mutations through one reference are visible through every other reference to that object.

This distinction directly impacts equality comparisons. Two primitives are equal if their values match: 5 === 5 is true. Two reference-type variables are equal only if they point to the exact same object in memory — two distinct objects with identical contents are not === to each other. This is why [] === [] evaluates to false.

Immutability is another practical difference. Primitives are inherently immutable — there is no API to change the value 42 in place. Objects are mutable by default; you can add, remove, or change properties at any time. To make objects behave more like primitives you must explicitly freeze them with Object.freeze(), and even that is only a shallow freeze.

Understanding this split is critical for avoiding bugs related to unintended shared state, especially when passing objects to functions. A function that modifies a received object will affect the caller's data unless you defensively copy the object first.`,shortAnswer:`Primitives are stored by value and are immutable — assignment copies the data. Reference types are stored by reference — assignment copies the pointer, so multiple variables can share and mutate the same object.`,code:`// Primitive: copy by value
let x = "hello";
let y = x;
y = "world";
console.log(x); // "hello" — independent copy

// Reference: copy by reference
const obj1 = { name: "Alice" };
const obj2 = obj1;
obj2.name = "Bob";
console.log(obj1.name); // "Bob" — same object!

// Equality differences
console.log(42 === 42);           // true  — same value
console.log({} === {});           // false — different references
console.log([1, 2] === [1, 2]);   // false — different references

const arr = [1, 2, 3];
const ref = arr;
console.log(arr === ref);         // true  — same reference

// Function argument behavior
function increment(val: number) {
  val += 1; // does NOT affect the caller
}

function addProp(obj: Record<string, string>) {
  obj.added = "yes"; // DOES affect the caller
}

let count = 0;
increment(count);
console.log(count); // 0

const data: Record<string, string> = {};
addProp(data);
console.log(data); // { added: "yes" }`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`primitives`,`reference types`,`memory`,`equality`],commonMistakes:[`Expecting object assignment to create an independent copy — it only copies the reference`,`Comparing two distinct objects/arrays with === and expecting true because their contents match`,`Forgetting that function arguments follow the same copy rules — objects are passed by reference, primitives by value`],followUps:[`How does garbage collection decide when to free a reference-type object?`,`Can you make an object truly immutable in JavaScript?`,`What is the difference between passing by reference and passing a reference by value?`],interviewTips:[`Draw a simple memory diagram showing stack variables pointing to heap objects — visual explanations impress interviewers`,`Clarify that JavaScript is technically "pass by sharing" — references are copied by value, not true pass-by-reference`]},{id:`js-types-3`,question:`What happens when you copy an object vs a primitive?`,answer:`When you copy a primitive, the engine duplicates the actual value. The new variable receives its own independent slot in memory. Modifying one variable has zero effect on the other. This is straightforward and matches most developers' intuition about how assignment works.

When you copy an object (via simple assignment), the engine copies the reference — a pointer to the heap-allocated data — not the data itself. Both the original and the copy now point to the same location in memory. Any mutation performed through either variable is visible through both. This shared-state behavior is the single most common source of bugs for developers new to JavaScript.

To create an independent copy of an object, you need an explicit copying mechanism. For shallow copies you can use the spread operator ({ ...obj }), Object.assign({}, obj), or Array.from(arr) / [...arr] for arrays. These produce a new top-level object whose own properties are duplicated. However, if any property value is itself a reference type (nested object or array), only the reference to that nested value is copied — the nested data is still shared.

For true independence you need a deep copy. The modern approach is structuredClone(obj), available in all major runtimes since 2022. It recursively clones nested objects, arrays, Maps, Sets, Dates, RegExps, and more. Older codebases often used JSON.parse(JSON.stringify(obj)), which works for JSON-safe data but silently drops functions, undefined, symbols, and special objects like Date (serialized as a string). Libraries like Lodash provide _.cloneDeep() as another reliable option.

In practice, decide the copy depth based on your mutation needs. If you only modify top-level properties, a shallow copy is sufficient and more performant. If you need to mutate nested structures without affecting the original, reach for structuredClone or a library deep-clone.`,shortAnswer:`Copying a primitive duplicates the value — changes to the copy don't affect the original. Copying an object duplicates the reference — both variables point to the same data. Use spread/Object.assign for shallow copies or structuredClone for deep copies.`,code:`// Primitive copy — fully independent
let a = 5;
let b = a;
b = 99;
console.log(a); // 5

// Object copy — shared reference
const original = { x: 1, nested: { y: 2 } };
const copy = original;
copy.x = 100;
console.log(original.x); // 100 — both point to same object

// Shallow copy with spread
const shallow = { ...original };
shallow.x = 999;
console.log(original.x); // 100 — top-level is independent
shallow.nested.y = 999;
console.log(original.nested.y); // 999 — nested is still shared!

// Deep copy with structuredClone
const deep = structuredClone(original);
deep.nested.y = 0;
console.log(original.nested.y); // 999 — fully independent

// Array copies
const nums = [1, 2, [3, 4]];
const shallowArr = [...nums];
shallowArr[0] = 99;
console.log(nums[0]); // 1 — top-level independent
(shallowArr[2] as number[])[0] = 99;
console.log((nums[2] as number[])[0]); // 99 — nested shared`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`copy`,`shallow copy`,`deep copy`,`spread`,`structuredClone`],commonMistakes:[`Believing spread operator creates a deep copy — it is only shallow`,`Using JSON.parse(JSON.stringify()) for objects that contain functions, undefined, or Dates`,`Forgetting that Array.slice() and Array.from() also produce only shallow copies`],followUps:[`What limitations does structuredClone have compared to a manual recursive clone?`,`How do immutable data libraries (Immer, Immutable.js) solve the copy problem?`,`When would a shallow copy be preferable to a deep copy?`],interviewTips:[`Mention structuredClone as the modern best practice — many interviewers want to see that you stay current`,`Be ready to whiteboard a simple recursive deep-clone function to demonstrate understanding`]},{id:`js-types-4`,question:`What is shallow copy vs deep copy? How to achieve each?`,answer:`A shallow copy creates a new object and copies over all own, enumerable properties from the source. For primitive-valued properties this produces independent values. For reference-valued properties (nested objects, arrays), only the pointer is copied, so the original and the clone share the same nested data. Mutations to nested structures propagate across both objects.

A deep copy recursively duplicates every level of nesting, producing a completely independent object graph. No property at any depth shares a reference with the source. This is the safest approach when you intend to mutate nested data without side effects, but it is more expensive in both time and memory.

Shallow copy techniques include the spread operator ({ ...obj } or [...arr]), Object.assign({}, obj), Array.prototype.slice(), and Array.from(). These are fast and cover the common case where you only need to change top-level properties — for example, when updating state in a React reducer by spreading the previous state and overriding one field.

For deep copies, structuredClone() is the recommended built-in since 2022. It handles nested objects, arrays, Maps, Sets, Dates, RegExps, ArrayBuffers, and even circular references. Its main limitations are that it cannot clone functions, DOM nodes, or objects with non-configurable property descriptors (getters/setters). For those edge cases, Lodash's _.cloneDeep() or a custom recursive function is necessary. The legacy JSON round-trip (JSON.parse(JSON.stringify(obj))) works only for JSON-serializable data and silently corrupts or drops non-JSON values.

Choosing between shallow and deep depends on the shape of your data and what you plan to mutate. Shallow copies are cheaper and sufficient for flat or read-only nested structures. Deep copies are essential when downstream code may modify nested values and the original must remain untouched.`,shortAnswer:`Shallow copy duplicates only the top-level properties — nested references are still shared. Deep copy recursively clones every level. Use spread/Object.assign for shallow; use structuredClone() or Lodash cloneDeep for deep.`,code:`// --- Shallow copy techniques ---
const src = { a: 1, b: { c: 2 } };

// 1. Spread
const s1 = { ...src };

// 2. Object.assign
const s2 = Object.assign({}, src);

// Both share src.b
console.log(s1.b === src.b); // true

// --- Deep copy techniques ---

// 1. structuredClone (recommended)
const d1 = structuredClone(src);
console.log(d1.b === src.b); // false — fully independent

// 2. JSON round-trip (limited)
const d2 = JSON.parse(JSON.stringify(src));
console.log(d2.b === src.b); // false

// JSON limitation demo
const complex = {
  date: new Date(),
  fn: () => "hi",
  undef: undefined,
  regex: /abc/g,
};
const jsonCopy = JSON.parse(JSON.stringify(complex));
console.log(typeof jsonCopy.date);  // "string" — Date became a string
console.log(jsonCopy.fn);           // undefined — function dropped
console.log(jsonCopy.undef);        // undefined — key dropped entirely
console.log(jsonCopy.regex);        // {} — RegExp became empty object

// 3. Manual recursive clone
function deepClone<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof RegExp) return new RegExp(value.source, value.flags) as T;
  if (Array.isArray(value)) return value.map(deepClone) as T;
  const result = {} as Record<string, unknown>;
  for (const key of Object.keys(value as Record<string, unknown>)) {
    result[key] = deepClone((value as Record<string, unknown>)[key]);
  }
  return result as T;
}`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`JavaScript`,topicId:`js-types`,tags:[`shallow copy`,`deep copy`,`structuredClone`,`Object.assign`],commonMistakes:[`Assuming Object.assign or spread produces a deep copy`,`Using JSON round-trip on objects containing Date, RegExp, Map, Set, or functions`,`Forgetting that structuredClone cannot clone functions or DOM nodes`],followUps:[`How does structuredClone handle circular references?`,`How would you deep-clone an object with getters and setters?`,`What is structural sharing and how do libraries like Immer use it?`],interviewTips:[`Know at least three shallow-copy methods and two deep-copy methods`,`If asked to implement deep clone, handle arrays, plain objects, and Date as a minimum`]},{id:`js-types-5`,question:`What is type coercion? Explain implicit vs explicit coercion.`,answer:`Type coercion is the process of converting a value from one type to another. JavaScript is dynamically typed and weakly typed, which means it will automatically convert types in many situations — sometimes helpfully, sometimes disastrously. Understanding coercion rules is essential to predicting how expressions evaluate and avoiding subtle bugs.

Explicit coercion (also called type casting) is when the developer intentionally converts a value using built-in functions or operators: Number("42"), String(42), Boolean(0), parseInt("10px", 10), or the unary + operator (+true === 1). The intent is clear in the code, making it readable and predictable. Explicit coercion is always preferred in production code because it signals the developer's intent.

Implicit coercion happens automatically when the engine encounters a type mismatch in an operation. The rules are governed by the Abstract Equality Comparison algorithm (for ==), the addition operator, logical contexts, and comparison operators. For example, "5" + 3 results in "53" because the + operator prefers string concatenation when one operand is a string. Conversely, "5" - 3 results in 2 because the - operator only works with numbers, so the string is coerced. These asymmetries are a frequent source of interview questions.

The ToPrimitive algorithm underpins much of implicit coercion for objects. When an object appears where a primitive is expected, JavaScript calls the object's [Symbol.toPrimitive](hint), valueOf(), or toString() methods, in that order of precedence (the exact order depends on the "hint" — "number", "string", or "default"). Custom implementations of these methods let objects control their own coercion behavior.

In practice, the safest strategy is to use explicit coercion everywhere, prefer === over ==, and add explicit type checks before operations that could trigger implicit coercion. Linting rules (e.g., eqeqeq in ESLint) can enforce this discipline across a team.`,shortAnswer:`Type coercion converts values between types. Explicit coercion is intentional (Number("42"), String(42)). Implicit coercion happens automatically in operations like "5" + 3 → "53" or "5" - 3 → 2. Always prefer explicit coercion for clarity.`,code:`// --- Explicit coercion ---
Number("42");        // 42
Number("");          // 0
Number("hello");     // NaN
Number(true);        // 1
Number(null);        // 0
Number(undefined);   // NaN

String(42);          // "42"
String(null);        // "null"
String(undefined);   // "undefined"

Boolean(0);          // false
Boolean("");         // false
Boolean("0");        // true — non-empty string!
Boolean([]);         // true — arrays are truthy!
Boolean({});         // true — objects are truthy!

// --- Implicit coercion ---
// + operator with strings triggers concatenation
console.log("5" + 3);       // "53"
console.log("5" + true);    // "5true"

// Other arithmetic operators coerce to number
console.log("5" - 3);       // 2
console.log("5" * "2");     // 10
console.log("5" / true);    // 5

// Comparison operators
console.log("10" > 9);      // true (string coerced to number)
console.log(null == undefined); // true (special rule)
console.log(null === undefined); // false

// Logical context (if, &&, ||, !, ternary)
if ("") console.log("never");   // empty string is falsy
if ("0") console.log("runs");   // non-empty string is truthy

// ToPrimitive with custom object
const custom = {
  [Symbol.toPrimitive](hint: string) {
    if (hint === "number") return 42;
    if (hint === "string") return "forty-two";
    return true;
  },
};
console.log(+custom);            // 42
console.log(\\\`Value: \\\${custom}\\\`); // "Value: forty-two"
console.log(custom + "");        // "true"`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`type coercion`,`implicit`,`explicit`,`ToPrimitive`],commonMistakes:[`Assuming [] + [] returns anything meaningful — it returns "" (empty string) because both arrays coerce to ""`,`Forgetting that Boolean([]) and Boolean({}) are true — empty arrays and objects are truthy`,`Mixing + with non-string types and expecting numeric addition instead of string concatenation`],followUps:[`What does [] + {} return? What about {} + []? Why are they different?`,`How does the ToPrimitive algorithm choose between valueOf and toString?`,`What coercion happens in a switch statement?`],interviewTips:[`Memorize the quirky expression results ([] + [], {} + [], etc.) — they come up frequently`,`Show you understand the "why" behind coercion rules, not just the results`]},{id:`js-types-6`,question:`What is the difference between == and ===?`,answer:`The === operator, known as strict equality, compares both type and value without performing any type conversion. If the operands are of different types, the result is immediately false. This makes === predictable: "5" === 5 is false, null === undefined is false, and NaN === NaN is also false (NaN is not equal to anything, including itself).

The == operator, known as abstract or loose equality, performs type coercion before comparison following the Abstract Equality Comparison Algorithm defined in the ECMAScript specification. When the operands are of different types, the engine applies a set of recursive rules to convert them to a common type before comparing. For example, "5" == 5 coerces the string to a number, yielding true. null == undefined is true by special rule, and both are only == to each other, not to any other value.

The coercion rules for == are extensive and non-obvious. Objects are coerced to primitives via ToPrimitive. Booleans are coerced to numbers (true → 1, false → 0), which leads to counterintuitive results like [] == false being true: [] coerces to "" via toString(), "" coerces to 0, false coerces to 0, and 0 === 0. These multi-step coercion chains are the primary reason == is discouraged in production code.

There is a legitimate use case for ==: checking null == undefined is a concise way to test for both null and undefined simultaneously (value == null). Some style guides and TypeScript configurations accept this pattern. Every other use of == can introduce ambiguity, so the industry consensus is to use === everywhere else.

ESLint's eqeqeq rule enforces strict equality. TypeScript itself uses strict comparisons internally and will warn about comparisons between incompatible types. In modern codebases, using == without justification is considered a code smell.`,shortAnswer:`=== (strict equality) compares type and value without coercion. == (loose equality) coerces operands to a common type before comparing, leading to surprises like "5" == 5 being true and [] == false being true. Always prefer === except for the null == undefined shorthand.`,code:`// Strict equality (===) — no coercion
console.log(5 === 5);            // true
console.log("5" === 5);          // false — different types
console.log(null === undefined);  // false
console.log(NaN === NaN);        // false — NaN is never equal to itself
console.log(0 === -0);           // true  — === treats 0 and -0 as equal

// Loose equality (==) — coercion applied
console.log("5" == 5);           // true — string coerced to number
console.log(null == undefined);   // true — special rule
console.log(null == 0);           // false — null only == undefined
console.log("" == 0);            // true — "" becomes 0
console.log(false == 0);         // true — false becomes 0
console.log(false == "");        // true — both become 0
console.log([] == false);        // true — [] → "" → 0, false → 0
console.log([] == ![]);          // true — ![] is false, then [] == false

// The only justified == use case
function isNullish(value: unknown): boolean {
  return value == null; // catches both null and undefined
}
console.log(isNullish(null));      // true
console.log(isNullish(undefined)); // true
console.log(isNullish(0));         // false
console.log(isNullish(""));        // false`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`equality`,`strict equality`,`loose equality`,`coercion`],commonMistakes:[`Using == for comparisons involving numbers and strings, leading to false positives`,`Forgetting that NaN !== NaN — use Number.isNaN() to check for NaN`,`Assuming null == 0 is true — null is only loosely equal to undefined`],followUps:[`How does Object.is() differ from ===?`,`What does the Abstract Equality Comparison Algorithm do step by step?`,`How does TypeScript help prevent unintended loose comparisons?`],interviewTips:[`State the rule simply: always use === unless you specifically want the null/undefined shorthand with ==`]},{id:`js-types-7`,question:`How does typeof work? What are its quirks?`,answer:`The typeof operator returns a string indicating the type of its operand. It is a unary prefix operator that works on any expression, including undeclared variables (it returns "undefined" rather than throwing a ReferenceError, unlike any other operation on undeclared variables). This safety makes it useful for feature detection: typeof window !== "undefined" works without error in non-browser environments.

The standard return values are: "undefined", "boolean", "number", "bigint", "string", "symbol", "object", and "function". Notice that null, arrays, dates, regex, maps, sets, and all other non-function objects all return "object" — typeof cannot distinguish between them. This is a major limitation that requires alternative approaches for precise type checking.

The most notorious quirk is typeof null === "object". This is a bug from JavaScript's first implementation in 1995: internally, values were tagged with a type code, and null used the same tag (0) as objects. The TC39 committee attempted to fix this in an early ECMAScript proposal, but it was rejected because too much existing code depended on the buggy behavior. It will never be fixed.

Other noteworthy behaviors: typeof NaN returns "number" (NaN is technically an IEEE 754 floating-point value), typeof function(){} returns "function" (functions are the only object subtype given a special typeof result), and typeof on undeclared variables returns "undefined" without throwing. With let/const, there is a temporal dead zone (TDZ) where typeof throws a ReferenceError if the variable is declared but not yet initialized — this is a change from the var era behavior.

For reliable type detection beyond what typeof offers, use Object.prototype.toString.call(value) which returns strings like "[object Array]", "[object Date]", "[object Null]", etc. Array.isArray() is the canonical check for arrays, and instanceof checks whether an object's prototype chain includes a particular constructor.`,shortAnswer:`typeof returns a string like "string", "number", "object", or "function". Its main quirks: typeof null is "object" (historic bug), typeof NaN is "number", it cannot distinguish arrays/dates/objects, and it safely returns "undefined" for undeclared variables.`,code:`// Standard typeof results
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof Symbol("x")); // "symbol"
console.log(typeof 42n);         // "bigint"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object" — not "array"!
console.log(typeof null);        // "object" — bug!
console.log(typeof function(){}); // "function"

// typeof NaN
console.log(typeof NaN);         // "number"
console.log(Number.isNaN(NaN));  // true

// Safe undeclared variable check
// console.log(myVar); — ReferenceError!
console.log(typeof myVar);       // "undefined" — no error

// Better type detection with Object.prototype.toString
function getType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1);
}
console.log(getType([]));          // "Array"
console.log(getType(null));        // "Null"
console.log(getType(new Date()));  // "Date"
console.log(getType(/abc/));       // "RegExp"
console.log(getType(new Map()));   // "Map"
console.log(getType(42));          // "Number"

// Array.isArray — canonical array check
console.log(Array.isArray([]));        // true
console.log(Array.isArray({}));        // false
console.log(Array.isArray("string"));  // false`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`typeof`,`type checking`,`Object.prototype.toString`],commonMistakes:[`Using typeof to check for null — always use value === null instead`,`Using typeof to check for arrays — use Array.isArray() instead`,`Assuming typeof works the same in TDZ (let/const before initialization) as with undeclared variables`],followUps:[`Why does typeof return "function" for functions but "object" for other object subtypes?`,`How does the temporal dead zone affect typeof behavior?`,`How can you create a comprehensive type-checking utility function?`],interviewTips:[`Have a ready answer for the "typeof null" question — it is one of the most common JavaScript trivia questions`,`Show awareness of Object.prototype.toString.call() as the most reliable type check`]},{id:`js-types-8`,question:`When should you use instanceof vs typeof?`,answer:`typeof is a unary operator that identifies the primitive type of a value or distinguishes objects from functions. It works on any value and returns a predefined set of strings. Its sweet spot is checking for primitives: typeof x === "string", typeof x === "number", typeof x === "undefined". It cannot distinguish between different kinds of objects — arrays, dates, regex, and plain objects all return "object".

instanceof is a binary operator that checks whether an object's prototype chain includes the prototype property of a constructor function. It answers the question "was this object created by (or inherits from) this constructor?" — arr instanceof Array, err instanceof Error, el instanceof HTMLElement. It is useful for checking class hierarchies, distinguishing error types in catch blocks, and verifying custom class instances.

A critical difference is that instanceof does not work across realms (iframes, Node.js vm contexts, or Web Workers). Each realm has its own global constructors, so an array created in an iframe will fail parent instanceof Array because it was constructed by the iframe's Array, not the parent's. Array.isArray() was invented specifically to solve this cross-realm problem for arrays. For custom classes, Symbol.hasInstance can customize instanceof behavior.

instanceof also does not work with primitives: "hello" instanceof String is false because string literals are primitives, not String wrapper objects. Conversely, new String("hello") instanceof String is true. This asymmetry is another reason to use typeof for primitives and instanceof only for objects.

In practice, use typeof for primitive detection, Array.isArray() for arrays, instanceof for class hierarchy checks (especially in catch blocks for error discrimination), and Object.prototype.toString.call() when you need to identify the exact built-in object type across all environments.`,shortAnswer:`Use typeof for primitives (string, number, boolean, undefined). Use instanceof for checking whether an object was created by a specific constructor or inherits from a class. instanceof fails across iframes/realms and with primitives; typeof cannot distinguish object subtypes.`,code:`// typeof — good for primitives
console.log(typeof "hello" === "string"); // true
console.log(typeof 42 === "number");      // true

// instanceof — good for class hierarchy
class Animal {}
class Dog extends Animal {}
const dog = new Dog();
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Object); // true — everything extends Object

// instanceof for error discrimination
try {
  throw new TypeError("bad type");
} catch (err) {
  if (err instanceof TypeError) {
    console.log("Type error caught");
  } else if (err instanceof RangeError) {
    console.log("Range error caught");
  }
}

// instanceof fails with primitives
console.log("hello" instanceof String);  // false
console.log(42 instanceof Number);       // false

// instanceof fails across realms (conceptual)
// const iframeArray = iframe.contentWindow.eval('[]');
// iframeArray instanceof Array → false!
// Array.isArray(iframeArray)   → true!

// Custom instanceof behavior via Symbol.hasInstance
class Even {
  static [Symbol.hasInstance](num: unknown): boolean {
    return typeof num === "number" && num % 2 === 0;
  }
}
console.log(4 instanceof Even);  // true
console.log(3 instanceof Even);  // false`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`typeof`,`instanceof`,`type checking`,`prototype chain`],commonMistakes:[`Using instanceof to check primitives — "str" instanceof String is always false`,`Relying on instanceof for arrays when the value may come from another iframe or realm`,`Forgetting that instanceof walks the entire prototype chain — a Dog is also an Animal and an Object`],followUps:[`How does Symbol.hasInstance customize instanceof behavior?`,`What alternatives exist for cross-realm type checking?`,`How does TypeScript's type narrowing interact with typeof and instanceof?`],interviewTips:[`Mention the cross-realm instanceof pitfall — it shows practical, real-world experience`,`Know that Array.isArray() was created specifically to fix the cross-iframe array detection problem`]},{id:`js-types-9`,question:`Explain Object.is() and how it differs from ===.`,answer:`Object.is() is a static method introduced in ES2015 that performs a Same-Value comparison. It behaves identically to === in almost all cases, but differs in exactly two scenarios: the treatment of NaN and signed zeros. These two differences make Object.is() the most mathematically correct equality check in JavaScript.

With ===, NaN !== NaN — this follows the IEEE 754 floating-point specification, which mandates that NaN is not equal to itself. Object.is(NaN, NaN) returns true, matching the intuitive expectation that a value should be equal to itself. Before Object.is(), checking for NaN required using isNaN() (which coerces its argument) or the self-inequality trick (x !== x is true only when x is NaN). Number.isNaN() (ES2015) is another option that avoids coercion.

With ===, positive zero and negative zero are considered equal: 0 === -0 is true. Object.is(0, -0) returns false, correctly distinguishing them. Signed zeros matter in mathematical contexts — for example, 1/0 is Infinity while 1/-0 is -Infinity, so the two zeros are observably different. In most application code this distinction is irrelevant, but in numerical libraries and algorithms it can be critical.

Internally, React uses Object.is() (via a polyfill called objectIs) to compare state and props values in its reconciliation process. When you call setState with the "same" value, React uses Object.is() to decide whether to skip re-rendering. This is why updating state with -0 when the current state is 0 will trigger a re-render, and why NaN state is considered stable across renders.

In everyday code, === is the right default choice. Use Object.is() when you specifically need to distinguish +0 from -0 or need NaN === NaN semantics. Use Number.isNaN() for standalone NaN checks. Use == only for the null/undefined shorthand.`,shortAnswer:`Object.is() is like === but treats NaN as equal to NaN and distinguishes +0 from -0. It provides Same-Value equality, which is the most precise comparison in JavaScript. React uses it internally to compare state values.`,code:`// NaN comparisons
console.log(NaN === NaN);           // false
console.log(Object.is(NaN, NaN));   // true
console.log(Number.isNaN(NaN));     // true

// Signed zero comparisons
console.log(0 === -0);              // true
console.log(Object.is(0, -0));      // false
console.log(1 / 0);                // Infinity
console.log(1 / -0);               // -Infinity

// All three behave the same for normal values
console.log(Object.is(42, 42));         // true
console.log(Object.is("hello", "hello")); // true
console.log(Object.is(null, null));     // true
console.log(Object.is(null, undefined)); // false

// Polyfill (this is essentially what React uses)
function sameValue(a: unknown, b: unknown): boolean {
  if (a === 0 && b === 0) {
    // Distinguish +0 and -0 using 1/x
    return 1 / (a as number) === 1 / (b as number);
  }
  if (a !== a && b !== b) {
    // Both are NaN
    return true;
  }
  return a === b;
}

console.log(sameValue(NaN, NaN));  // true
console.log(sameValue(0, -0));     // false
console.log(sameValue(42, 42));    // true`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`Object.is`,`equality`,`NaN`,`signed zero`],commonMistakes:[`Assuming Object.is() is always interchangeable with === — they differ for NaN and ±0`,`Using isNaN() instead of Number.isNaN() — isNaN("hello") is true due to coercion, Number.isNaN("hello") is false`,`Not realizing that React's state comparison uses Object.is(), which can lead to unexpected re-renders with -0`],followUps:[`What are the four equality algorithms in JavaScript (loose, strict, SameValue, SameValueZero)?`,`Which equality algorithm do Map and Set use for key comparison?`,`Why does IEEE 754 define NaN as not equal to itself?`],interviewTips:[`Mentioning React's use of Object.is() connects a "trivia" question to real-world framework internals`]},{id:`js-types-10`,question:`What are the falsy values in JavaScript?`,answer:`JavaScript defines exactly eight falsy values: false, 0, -0, 0n (BigInt zero), "" (empty string), null, undefined, and NaN. Every other value is truthy — including empty arrays [], empty objects {}, the string "0", the string "false", and any non-zero number. This is one of the most frequently tested concepts in JavaScript interviews.

Falsy values matter because JavaScript coerces values to boolean in several contexts: if/else conditions, the ternary operator, logical operators (&&, ||, !), while/for loops, and the Boolean() constructor. When a value appears in a boolean context, the engine applies the ToBoolean abstract operation, which simply checks whether the value is in the falsy list. There is no custom coercion or valueOf call — it is a hardcoded list.

The truthy nature of empty arrays and objects surprises many developers. [] == false is true (due to abstract equality coercion), but Boolean([]) is also true. This seeming contradiction occurs because == triggers ToPrimitive conversion ([] → "" → 0 → matches false → 0), while Boolean() uses the ToBoolean lookup table where any object is truthy. Similarly, "0" is truthy (non-empty string), but "0" == false is true (string "0" → number 0 → matches false → 0). These edge cases underscore why === is preferred over ==.

In practice, guard against falsy-value bugs by being explicit about what you're checking. If a function can legitimately return 0 or "", checking if (result) will incorrectly treat these valid return values as failures. Instead, check if (result !== undefined && result !== null) or use the nullish coalescing operator (??) which only triggers on null/undefined, not on 0 or "".

The nullish coalescing operator (??) and optional chaining (?.) were designed specifically to address the falsy-value problem with default values. Before ??, developers used || for defaults: const port = config.port || 3000. This fails if config.port is 0 (a valid port). With ??, const port = config.port ?? 3000 only falls back when config.port is null or undefined.`,shortAnswer:`The eight falsy values are: false, 0, -0, 0n, "" (empty string), null, undefined, and NaN. Everything else is truthy, including [], {}, "0", and "false". Use ?? instead of || for defaults when 0 or "" are valid values.`,code:`// All falsy values
const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];

falsyValues.forEach((val) => {
  console.log(\\\`\\\${String(val)} → \\\${Boolean(val)}\\\`); // all print false
});

// Surprising truthy values
console.log(Boolean([]));         // true — empty array is truthy!
console.log(Boolean({}));         // true — empty object is truthy!
console.log(Boolean("0"));        // true — non-empty string!
console.log(Boolean("false"));    // true — non-empty string!
console.log(Boolean(new Date())); // true — any object is truthy
console.log(Boolean(Infinity));   // true
console.log(Boolean(-Infinity));  // true

// The [] == false paradox
console.log([] == false);   // true (coercion: [] → "" → 0, false → 0)
console.log(Boolean([]));   // true (ToBoolean: any object is truthy)

// Falsy value gotcha with ||
const port = 0;
const withOr = port || 3000;
console.log(withOr); // 3000 — wrong! 0 is a valid port

const withNullish = port ?? 3000;
console.log(withNullish); // 0 — correct! ?? only triggers on null/undefined

// Explicit checks instead of truthy/falsy
function processResult(result: string | null | undefined) {
  // Bad: if (result) — fails for empty string ""
  // Good:
  if (result != null) {
    console.log(\\\`Got: \\\${result}\\\`); // works for "" too
  }
}`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`falsy`,`truthy`,`coercion`,`nullish coalescing`],commonMistakes:[`Assuming empty arrays or objects are falsy — they are truthy`,`Using || for default values when 0 or "" are valid inputs — use ?? instead`,`Confusing Boolean([]) being true with [] == false being true — they use different coercion algorithms`],followUps:[`What is the difference between || and ?? for default values?`,`How does optional chaining (?.) interact with falsy values?`,`Why is document.all falsy even though it is an object?`],interviewTips:[`List all eight falsy values from memory — interviewers commonly ask for the complete list`,`Mention the ?? operator to show awareness of modern JavaScript solutions to falsy-value problems`]},{id:`js-types-11`,question:`How does Object.prototype.toString.call() help with type checking?`,answer:`Object.prototype.toString.call() is the most reliable built-in mechanism for identifying the exact internal type of any JavaScript value. When called on a value, it returns a string in the format "[object Type]", where Type is the internal [[Class]] tag (or Symbol.toStringTag in ES2015+). Unlike typeof, it can distinguish between Array, Date, RegExp, Map, Set, Null, Undefined, and all other built-in types.

The reason we use .call() is that most objects override toString() on their own prototypes. Array.prototype.toString() returns the array's elements joined by commas, Date.prototype.toString() returns a date string, and so on. By borrowing Object.prototype.toString and invoking it with .call(value), we bypass these overrides and access the generic version that reports the internal type tag.

For primitives, the method wraps the value in its corresponding object type before reading the tag: Object.prototype.toString.call(42) returns "[object Number]", Object.prototype.toString.call("hello") returns "[object String]". For null it returns "[object Null]" and for undefined it returns "[object Undefined]" — solving the typeof null === "object" problem elegantly.

Since ES2015, objects can customize their toString tag by defining a Symbol.toStringTag property. Built-in types like Map, Set, Promise, and generators already have this symbol set. Custom classes can set it too: defining get [Symbol.toStringTag]() { return "MyClass"; } causes Object.prototype.toString.call(instance) to return "[object MyClass]". This makes the technique extensible for user-defined types.

A common utility pattern is to extract just the type name: Object.prototype.toString.call(value).slice(8, -1) gives you "Array", "Null", "Date", etc. This approach is widely used in utility libraries and polyfills. It is also the only way to reliably detect certain built-in types (like distinguishing plain objects from Arguments objects) without relying on duck typing.`,shortAnswer:`Object.prototype.toString.call() returns "[object Type]" for any value, correctly identifying Array, Date, Null, RegExp, etc. It bypasses overridden toString methods and is the most reliable type check, solving quirks like typeof null === "object".`,code:`// Object.prototype.toString.call() for precise type detection
const toString = Object.prototype.toString;

console.log(toString.call("hello"));      // "[object String]"
console.log(toString.call(42));           // "[object Number]"
console.log(toString.call(true));         // "[object Boolean]"
console.log(toString.call(undefined));    // "[object Undefined]"
console.log(toString.call(null));         // "[object Null]"
console.log(toString.call(Symbol("x")));  // "[object Symbol]"

console.log(toString.call([]));           // "[object Array]"
console.log(toString.call({}));           // "[object Object]"
console.log(toString.call(new Date()));   // "[object Date]"
console.log(toString.call(/abc/));        // "[object RegExp]"
console.log(toString.call(new Map()));    // "[object Map]"
console.log(toString.call(new Set()));    // "[object Set]"
console.log(toString.call(Promise.resolve())); // "[object Promise]"

// Utility function
function typeOf(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

console.log(typeOf(null));        // "null" — not "object"!
console.log(typeOf([]));          // "array"
console.log(typeOf(new Date()));  // "date"
console.log(typeOf(/test/));      // "regexp"

// Custom Symbol.toStringTag
class ApiClient {
  get [Symbol.toStringTag]() {
    return "ApiClient";
  }
}
console.log(toString.call(new ApiClient())); // "[object ApiClient]"

// Comprehensive type checker
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

console.log(isPlainObject({}));           // true
console.log(isPlainObject([]));           // false
console.log(isPlainObject(new Date()));   // false`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`JavaScript`,topicId:`js-types`,tags:[`Object.prototype.toString`,`type checking`,`Symbol.toStringTag`],commonMistakes:[`Calling value.toString() instead of Object.prototype.toString.call(value) — the former uses the overridden version`,`Forgetting that custom classes can override Symbol.toStringTag, making the result unreliable for security checks`,`Not accounting for cross-realm differences when comparing constructor names`],followUps:[`How does Symbol.toStringTag affect Object.prototype.toString output?`,`What are the trade-offs between duck typing and explicit type checking?`,`How do type guard functions in TypeScript relate to runtime type checks?`],interviewTips:[`Showing this technique demonstrates deep JavaScript knowledge beyond surface-level typeof usage`]},{id:`js-types-12`,question:`What is the difference between null and undefined in JavaScript?`,answer:`null and undefined are both primitives that represent the absence of a value, but they have distinct semantic meanings and behave differently in several important contexts. Understanding when and why each appears is fundamental to writing defensive JavaScript.

undefined means a value has not been assigned. It is the default value of uninitialized variables (let x; → x is undefined), missing function parameters, the return value of functions that don't explicitly return, and the result of accessing a non-existent object property. The engine assigns undefined automatically — developers rarely need to assign it explicitly. If you see undefined, it generally means "nothing was provided or this hasn't been set up yet."

null means "intentionally no value." It is never assigned by the engine — a developer must explicitly set a variable to null. It signals a deliberate absence: "this variable is meant to hold an object, but right now it holds nothing." DOM methods like document.getElementById() return null when no matching element is found, and JSON represents missing values as null (JSON has no undefined).

The typeof results differ: typeof undefined is "undefined", while typeof null is "object" (the historic bug). For equality: null == undefined is true (they are loosely equal by specification), but null === undefined is false (different types). null and undefined are only == to each other and to nothing else — null == 0, null == "", null == false are all false. This makes value == null a concise and safe check for both null and undefined.

In practice, prefer null when you need to explicitly indicate "no value" for variables that will later hold objects. Prefer leaving things as undefined rather than assigning undefined explicitly. Use the nullish coalescing operator (??) to provide defaults for both null and undefined without accidentally replacing valid falsy values like 0 or "". TypeScript's strict null checks (strictNullChecks) enforce that you handle both cases explicitly, preventing many common null/undefined-related runtime errors.`,shortAnswer:`undefined means "not yet assigned" — the engine sets it automatically for uninitialized variables, missing parameters, and non-existent properties. null means "intentionally empty" — it must be explicitly assigned. They are loosely equal (null == undefined) but not strictly equal.`,code:`// undefined — automatically assigned
let x;
console.log(x); // undefined

function greet(name?: string) {
  console.log(name); // undefined if not passed
}
greet();

const obj: Record<string, unknown> = { a: 1 };
console.log(obj.b); // undefined — property doesn't exist

function doNothing() {}
console.log(doNothing()); // undefined — no return statement

// null — intentionally assigned
let user: { name: string } | null = null; // will be set later
const el = document.getElementById("nonexistent"); // null

// typeof difference
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (bug)

// Equality behavior
console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(null == 0);           // false
console.log(null == "");          // false
console.log(null == false);       // false

// Nullish coalescing — handles both null and undefined
const config: { port?: number | null } = { port: null };
const port = config.port ?? 3000;
console.log(port); // 3000

// JSON serialization difference
const data = { a: undefined, b: null, c: 42 };
console.log(JSON.stringify(data));
// '{"b":null,"c":42}' — undefined properties are omitted, null is preserved`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-types`,tags:[`null`,`undefined`,`nullish coalescing`,`equality`],commonMistakes:[`Explicitly assigning undefined to a variable — use null instead to signal intentional absence`,`Using typeof to check for null — typeof null is "object", use value === null instead`,`Forgetting that JSON.stringify strips undefined properties but keeps null values`],followUps:[`Why does JSON not support undefined?`,`How do optional chaining (?.) and nullish coalescing (??) work together?`,`What is the void operator and how does it relate to undefined?`],interviewTips:[`Explain the semantic difference clearly: undefined = "not set", null = "intentionally empty"`,`Mention that value == null is a safe and accepted shorthand for checking both null and undefined`]}]}],n=[{id:`js-functions`,title:`Functions`,description:`Deep dive into JavaScript functions including declarations, expressions, arrow functions, closures, IIFEs, higher-order functions, callbacks, and parameter handling.`,category:`JavaScript`,difficulty:`Intermediate`,tags:[`functions`,`closures`,`arrow functions`,`IIFE`,`higher-order functions`,`callbacks`,`hoisting`,`scope`],overview:`Functions are the fundamental building blocks of JavaScript. They are first-class objects, meaning they can be assigned to variables, passed as arguments, and returned from other functions. Understanding the nuances between declaration styles, scoping rules, closures, and modern parameter handling is essential for writing robust JavaScript and succeeding in technical interviews.`,concepts:[`Function declarations vs function expressions`,`Arrow functions and lexical this`,`Closures and lexical scoping`,`Immediately Invoked Function Expressions (IIFE)`,`Higher-order functions`,`First-class functions`,`Callbacks and the callback pattern`,`Rest parameters and the spread operator`,`Default parameters`,`Function hoisting`,`The arguments object`],questions:[{id:`js-func-1`,question:`What is the difference between function declarations and function expressions?`,answer:"Function declarations use the `function` keyword followed by a name and are hoisted entirely to the top of their scope, meaning they can be called before the line where they appear in the code. The JavaScript engine moves the entire function definition to the top during the compilation phase, making it available throughout its enclosing scope.\n\nFunction expressions assign an anonymous (or named) function to a variable. Because they rely on variable assignment, they follow the hoisting rules of the variable keyword used — `var` declarations are hoisted but initialized to `undefined`, while `let` and `const` declarations remain in the temporal dead zone until the assignment is reached. Attempting to call a function expression before its assignment throws a TypeError (for `var`) or a ReferenceError (for `let`/`const`).\n\nA named function expression has a name that is only accessible inside its own body, which is useful for recursion and produces clearer stack traces during debugging. An anonymous function expression has no name, which can make stack traces harder to read.\n\nIn practice, the choice between declarations and expressions often comes down to coding style and whether hoisting behavior is desired. Many modern codebases prefer `const` with arrow function expressions for consistency and to avoid accidental reassignment, while function declarations remain popular for top-level utility functions where hoisting improves readability.\n\nBoth forms create Function objects and behave identically at runtime once defined — they can accept parameters, have their own scope, form closures, and be passed as values. The key distinction is purely about when they become available during execution.",shortAnswer:`Function declarations are hoisted entirely and can be called before their definition in the code. Function expressions are assigned to variables and follow variable hoisting rules, so they cannot be used before the assignment is executed.`,code:`// Function Declaration — hoisted
console.log(greet("Alice")); // "Hello, Alice!"

function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Function Expression — NOT hoisted
// console.log(add(2, 3)); // TypeError: add is not a function

const add = function (a: number, b: number): number {
  return a + b;
};

console.log(add(2, 3)); // 5

// Named Function Expression — name is local to the function body
const factorial = function fact(n: number): number {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5)); // 120
// console.log(fact(5)); // ReferenceError: fact is not defined`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`functions`,`hoisting`,`declarations`,`expressions`],commonMistakes:[`Assuming function expressions are hoisted the same way as declarations`,`Forgetting that a named function expression's name is only accessible inside the function body`,`Using var for function expressions and being surprised that calling it before assignment returns TypeError instead of ReferenceError`],followUps:[`How does hoisting differ between var, let, and const?`,`When would you prefer a function declaration over a function expression?`,`What is the temporal dead zone?`],interviewTips:[`Be ready to demonstrate the hoisting difference with a quick code example — interviewers love seeing you reason about execution order`,`Mention named function expressions for recursion and debugging as a bonus point`]},{id:`js-func-2`,question:`How do arrow functions differ from regular functions?`,answer:"Arrow functions, introduced in ES6, provide a concise syntax for writing function expressions. However, the differences go far beyond syntax — they fundamentally change how `this`, `arguments`, `new.target`, and `super` are handled.\n\nThe most significant difference is that arrow functions do not have their own `this` binding. Instead, they capture the `this` value from the enclosing lexical scope at the time they are defined. This makes them ideal for callbacks where you want to preserve the outer `this`, such as inside class methods or event handlers. Regular functions, on the other hand, determine their `this` dynamically based on how they are called — as a method, a constructor, or via `call`/`apply`/`bind`.\n\nArrow functions cannot be used as constructors. Calling an arrow function with `new` throws a TypeError because they lack an internal [[Construct]] method and do not have a `prototype` property. Regular functions can serve as constructors and will create a new object when invoked with `new`.\n\nArrow functions also do not have an `arguments` object. If you try to access `arguments` inside an arrow function, it will resolve to the `arguments` of the nearest enclosing regular function. To achieve the same functionality, use rest parameters (`...args`). Similarly, arrow functions cannot access `new.target` or `super` on their own — they inherit these from the enclosing scope.\n\nAnother subtle difference is that arrow functions cannot be used as generators — there is no `function*` arrow equivalent. Additionally, `call`, `apply`, and `bind` can be used on arrow functions but will NOT change their `this` value; they can only pass arguments.",shortAnswer:"Arrow functions do not have their own `this`, `arguments`, or `prototype`. They inherit `this` from the enclosing lexical scope, cannot be used as constructors with `new`, and provide a shorter syntax best suited for callbacks and non-method functions.",code:`const team = {
  members: ["Alice", "Bob", "Charlie"],
  teamName: "Engineering",

  // Regular function — \`this\` depends on call-site
  listMembersRegular: function () {
    // \`this\` is the team object here
    return this.members.map(function (member) {
      // \`this\` is undefined (strict mode) or global — NOT team
      // return \`\${this.teamName}: \${member}\`; // Bug!
      return member;
    });
  },

  // Arrow function — \`this\` is lexically inherited
  listMembersArrow: function () {
    return this.members.map((member) => {
      // \`this\` still refers to the team object
      return \`\${this.teamName}: \${member}\`;
    });
  },
};

console.log(team.listMembersArrow());
// ["Engineering: Alice", "Engineering: Bob", "Engineering: Charlie"]

// Arrow functions cannot be constructors
const Foo = () => {};
// new Foo(); // TypeError: Foo is not a constructor

// Arrow functions ignore bind/call/apply for \`this\`
const obj = { value: 42 };
const arrowFn = () => console.log(this);
arrowFn.call(obj); // Still logs the outer \`this\`, not obj`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`arrow functions`,`this`,`lexical scope`,`ES6`],commonMistakes:["Using arrow functions as object methods and expecting `this` to refer to the object","Trying to use `new` with an arrow function","Assuming call/apply/bind can override `this` in an arrow function"],followUps:[`When should you avoid using arrow functions?`,"How does `this` work in class methods vs arrow function class properties?",`Can arrow functions be async?`],interviewTips:["Focus on the lexical `this` binding — it is by far the most commonly tested difference","Have a concrete example ready showing how `this` behaves differently in a callback"]},{id:`js-func-3`,question:`What are closures? How do they work?`,answer:`A closure is formed when a function retains access to variables from its lexical scope even after the outer function that created those variables has finished executing. Every function in JavaScript forms a closure at creation time, but the term is most commonly used when an inner function references variables from an outer function and is then used outside that outer function.

When the JavaScript engine creates a function, it attaches a hidden internal property called [[Environment]] (or [[Scope]]) that holds a reference to the lexical environment where the function was defined. This environment is a chain of variable objects, one for each enclosing scope, all the way up to the global scope. When the function executes and encounters a variable, the engine walks up this chain until it finds the binding.

Closures work because JavaScript uses lexical scoping — the scope of a variable is determined by its position in the source code, not by the call stack at runtime. When an inner function is returned or passed elsewhere, the variables it references in the outer scope are not garbage collected because the closure keeps a live reference to the environment record. This means the variables persist in memory for as long as the closure exists.

A critical nuance is that closures capture variables by reference, not by value. If the outer variable changes after the closure is created, the closure sees the updated value. This is the classic source of bugs in loops using \`var\`, where all closures created in the loop share the same variable binding and therefore see the final value.

Closures are the foundation of many JavaScript patterns including data privacy, module pattern, currying, partial application, memoization, and event handler factories. They are also how React hooks like \`useState\` and \`useEffect\` maintain state between renders — each render creates a closure over the current state values.`,shortAnswer:`A closure is a function that retains access to variables from its outer (lexical) scope even after the outer function has returned. Closures capture variables by reference, not by value, and are fundamental to patterns like data privacy, currying, and module encapsulation.`,code:`// Basic closure
function createCounter() {
  let count = 0; // Enclosed variable — private to the closure
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
// count is not accessible directly — true data privacy

// Classic closure bug with var in loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 3, 3, 3  (all share the same \`i\`)

// Fix with let (block-scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 0, 1, 2

// Fix with IIFE (pre-ES6 approach)
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Logs: 0, 1, 2`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`closures`,`lexical scope`,`scope chain`,`memory`],commonMistakes:[`Thinking closures capture values at the time of creation — they capture references to variables`,"Forgetting that closures in loops with `var` share the same binding",`Not considering memory implications — closures keep entire scope chains alive`],followUps:[`How can closures cause memory leaks?`,`How do closures relate to React hooks?`,`What is the difference between lexical and dynamic scoping?`],interviewTips:[`Walk through the loop-with-var closure bug — it is one of the most commonly asked closure questions`,`Mention practical use cases like data privacy and memoization to show real-world understanding`]},{id:`js-func-4`,question:`Write an example showing practical use of closures.`,answer:`Closures enable powerful patterns that are used extensively in real-world JavaScript applications. One of the most practical uses is creating factory functions that produce specialized versions of a general function. A \`createMultiplier\` factory, for example, captures the multiplier value and returns a function that always multiplies by that value — the captured variable acts as configuration.

Another highly practical pattern is memoization, where a closure captures a cache object. Each time the memoized function is called, it first checks whether the result for the given arguments is already in the cache. If so, it returns the cached value instantly; otherwise, it computes the result, stores it, and returns it. This is the exact mechanism behind \`React.useMemo\` and libraries like Lodash's \`_.memoize\`.

Closures also enable the module pattern, which was the primary way to create private state before ES6 classes and modules. By wrapping state in a function and returning only the public API, you guarantee that internal variables cannot be accessed or modified from outside. This encapsulation prevents accidental mutation and provides a clean interface.

Event handler factories are another common use. Instead of creating inline closures in JSX or adding data attributes, you can create a handler factory that captures the relevant context (like an item ID) and returns a handler function. This keeps event handlers clean and avoids unnecessary re-renders in React when combined with \`useCallback\`.

Partial application and currying also rely on closures. A partially applied function captures some arguments in the closure and returns a new function that accepts the remaining arguments. This is widely used in functional programming, middleware chains (like Redux middleware), and configuration patterns.`,shortAnswer:`Practical closure uses include memoization (caching computed results), factory functions (creating specialized functions), the module pattern (encapsulating private state), and partial application (pre-filling function arguments).`,code:`// 1. Memoization — cache expensive computations
function memoize<T extends (...args: string[]) => unknown>(
  fn: T
): T {
  const cache = new Map<string, unknown>();
  return ((...args: string[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const slowSquare = (n: string) => {
  console.log("Computing...");
  return Number(n) ** 2;
};
const fastSquare = memoize(slowSquare);
fastSquare("5"); // Computing... → 25
fastSquare("5"); // → 25 (cached, no log)

// 2. Factory function — create specialized handlers
function createLogger(prefix: string) {
  return (message: string) => {
    console.log(\`[\${prefix}] \${new Date().toISOString()}: \${message}\`);
  };
}
const dbLogger = createLogger("DB");
const apiLogger = createLogger("API");
dbLogger("Connection established");  // [DB] 2026-08-31T...: Connection established
apiLogger("Request received");       // [API] 2026-08-31T...: Request received

// 3. Private state via module pattern
function createBankAccount(initialBalance: number) {
  let balance = initialBalance;
  const transactions: string[] = [];

  return {
    deposit(amount: number) {
      balance += amount;
      transactions.push(\`+\${amount}\`);
      return balance;
    },
    withdraw(amount: number) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      transactions.push(\`-\${amount}\`);
      return balance;
    },
    getBalance: () => balance,
    getHistory: () => [...transactions],
  };
}

const account = createBankAccount(100);
account.deposit(50);   // 150
account.withdraw(30);  // 120
// account.balance — undefined (truly private)`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`JavaScript`,topicId:`js-functions`,tags:[`closures`,`memoization`,`module pattern`,`factory functions`],commonMistakes:[`Using JSON.stringify for cache keys without considering argument order or non-serializable values`,`Forgetting to clone returned data from closures — returning the raw reference breaks encapsulation`,`Creating closures in tight loops without considering memory overhead`],followUps:[`How would you implement an LRU cache with closures?`,`How does React's useCallback relate to closures?`,`What are the memory implications of memoizing functions that accept many unique arguments?`],interviewTips:[`Show both simple and complex examples — interviewers want to see that you understand the concept AND can apply it`]},{id:`js-func-5`,question:`What is an IIFE? Why were they used?`,answer:"An IIFE (Immediately Invoked Function Expression) is a function that is defined and executed in a single statement. The pattern wraps a function in parentheses to make the parser treat it as an expression rather than a declaration, then immediately invokes it with a trailing pair of parentheses. The classic syntax is `(function() { ... })()` or `(function() { ... }())` — both forms are valid.\n\nBefore ES6 introduced block-scoped `let` and `const`, JavaScript only had function scope and global scope. The primary motivation for IIFEs was to create a new scope that prevented variable leakage into the global namespace. By wrapping code in an IIFE, all variables declared with `var` inside it were scoped to the function body and invisible outside. This was essential in the era of script tags, where multiple files shared the global scope and name collisions were a constant risk.\n\nIIFEs were the backbone of the Module Pattern, which combined closures with IIFEs to create modules with private and public members. Libraries like jQuery, Underscore, and Backbone all used IIFEs to encapsulate their internals and expose only a public API on the global object. The Universal Module Definition (UMD) pattern also relied on IIFEs to support both CommonJS and browser globals.\n\nAnother important use case was solving the closure-in-loop problem with `var`. Since `var` is function-scoped, creating closures inside a loop would cause all closures to share the same variable. Wrapping the loop body in an IIFE and passing the loop variable as an argument created a fresh copy per iteration, fixing the bug.\n\nIn modern JavaScript, IIFEs are less common because `let`/`const` provide block scoping, ES modules provide proper encapsulation, and bundlers handle scope isolation automatically. However, IIFEs still appear in legacy codebases, polyfills, and occasionally in modern code when you need to execute an async expression at the top level in environments that do not support top-level `await`.",shortAnswer:`An IIFE (Immediately Invoked Function Expression) is a function that runs as soon as it is defined. IIFEs were primarily used before ES6 to create private scope, avoid global namespace pollution, and implement the module pattern. They are less necessary now thanks to block scoping and ES modules.`,code:`// Basic IIFE syntax
const result = (function () {
  const secret = "hidden";
  return secret.toUpperCase();
})();
console.log(result); // "HIDDEN"
// console.log(secret); // ReferenceError

// Module pattern with IIFE
const Calculator = (function () {
  let history: string[] = [];

  function log(operation: string) {
    history.push(operation);
  }

  return {
    add(a: number, b: number) {
      const result = a + b;
      log(\`\${a} + \${b} = \${result}\`);
      return result;
    },
    subtract(a: number, b: number) {
      const result = a - b;
      log(\`\${a} - \${b} = \${result}\`);
      return result;
    },
    getHistory: () => [...history],
  };
})();

Calculator.add(5, 3);       // 8
Calculator.subtract(10, 4); // 6
Calculator.getHistory();    // ["5 + 3 = 8", "10 - 4 = 6"]

// IIFE with arrow function (modern)
const config = (() => {
  const env = process.env.NODE_ENV ?? "development";
  return Object.freeze({
    isDev: env === "development",
    apiUrl: env === "production"
      ? "https://api.example.com"
      : "http://localhost:3000",
  });
})();`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`IIFE`,`module pattern`,`scope`,`encapsulation`],commonMistakes:[`Forgetting the wrapping parentheses — without them the parser treats it as a function declaration and throws a syntax error`,`Not realizing that arrow function IIFEs always need wrapping parentheses: (() => {})()`,`Overusing IIFEs in modern codebases where let/const and ES modules solve the same problem more clearly`],followUps:[`How do ES modules replace the need for IIFEs?`,`What is the revealing module pattern?`,`Can IIFEs accept arguments?`],interviewTips:[`Explain the historical context — interviewers want to know you understand WHY patterns exist, not just what they are`,`Mentioning the transition from IIFEs to ES modules shows modern awareness`]},{id:`js-func-6`,question:`What are higher-order functions?`,answer:"A higher-order function is a function that either takes one or more functions as arguments, returns a function, or both. This is possible in JavaScript because functions are first-class citizens — they can be treated as values, assigned to variables, and passed around just like numbers or strings.\n\nThe most commonly encountered higher-order functions in JavaScript are the array methods `map`, `filter`, `reduce`, `forEach`, `find`, `some`, and `every`. Each of these accepts a callback function that defines the operation to perform on each element. For example, `[1, 2, 3].map(x => x * 2)` passes an arrow function to `map`, which applies it to every element and returns a new array.\n\nHigher-order functions that return functions are equally important. Function factories, decorators, and middleware all follow this pattern. A debounce function, for instance, takes a function and a delay as arguments and returns a new function that delays execution until the specified time has elapsed since the last call. Similarly, Express middleware and Redux middleware are higher-order functions that wrap request handlers or dispatch functions.\n\nHigher-order functions promote code reuse and separation of concerns. Instead of writing a new loop for every array transformation, you compose small, focused functions. This leads to more declarative, readable code. Functional programming libraries like Ramda and Lodash/fp build their entire API around higher-order function composition.\n\nIn React, higher-order components (HOCs) are a direct application of this concept — they are functions that take a component and return a new enhanced component. Although hooks have largely replaced HOCs, understanding the higher-order function pattern is essential for reading legacy React code and for patterns like middleware, decorators, and function composition.",shortAnswer:`A higher-order function is a function that takes other functions as arguments or returns a function. Common examples include array methods like map, filter, and reduce, as well as patterns like debounce, middleware, and function composition.`,code:`// Higher-order function that takes a function as argument
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);     // [2, 4, 6, 8, 10]
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// Higher-order function that returns a function
function withLogging<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  label: string
): (...args: Args) => R {
  return (...args: Args): R => {
    console.log(\`[\${label}] called with:\`, args);
    const result = fn(...args);
    console.log(\`[\${label}] returned:\`, result);
    return result;
  };
}

const add = (a: number, b: number) => a + b;
const loggedAdd = withLogging(add, "add");
loggedAdd(3, 4);
// [add] called with: [3, 4]
// [add] returned: 7

// Practical: debounce
function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number
): (...args: Args) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delayMs);
  };
}

const handleSearch = debounce((query: string) => {
  console.log("Searching:", query);
}, 300);`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`higher-order functions`,`functional programming`,`map`,`filter`,`reduce`],commonMistakes:[`Confusing higher-order functions with callbacks — a callback is the function passed IN; the higher-order function is the one that RECEIVES it`,`Forgetting that methods like map and filter return new arrays rather than mutating the original`,`Not preserving type safety when wrapping functions — always propagate generic types`],followUps:[`How does function composition work?`,`What is the difference between map and forEach?`,`How do higher-order components work in React?`],interviewTips:[`Implement a simple higher-order function like debounce or throttle from scratch — it is a very common interview coding question`]},{id:`js-func-7`,question:`Explain first-class functions in JavaScript.`,answer:"When we say JavaScript has first-class functions, we mean that functions are treated as first-class citizens — they have the same capabilities as any other value in the language. Specifically, functions can be assigned to variables, stored in data structures like arrays and objects, passed as arguments to other functions, and returned as values from other functions.\n\nThis is not just a theoretical concept — it is the foundation of JavaScript's programming model. When you write `const greet = function(name) { ... }`, you are assigning a function to a variable exactly like you would assign a number or string. When you pass a callback to `addEventListener` or `setTimeout`, you are passing a function as an argument. When a factory function returns a new function, the returned value is a function object.\n\nFirst-class functions enable several critical programming patterns. Higher-order functions, closures, the strategy pattern, event-driven programming, and functional programming concepts like currying and partial application all depend on functions being first-class. Without this property, callbacks, promises, and the entire async programming model in JavaScript would not be possible.\n\nInternally, functions in JavaScript are objects — specifically, instances of the `Function` constructor. They have properties like `name`, `length` (the number of formal parameters), and `prototype`. You can even add custom properties to a function, though this is uncommon. The `typeof` operator returns `\"function\"` for functions, but they are technically a special subtype of object with an internal [[Call]] method.\n\nNot all programming languages have first-class functions. In languages like Java (before version 8), C, and early versions of C++, functions could not be directly passed around as values without workarounds like function pointers or anonymous inner classes. JavaScript's first-class function support, inherited from its Scheme/Lisp influences, is one of its most powerful features.",shortAnswer:`First-class functions means functions are treated as values — they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures. This enables callbacks, higher-order functions, closures, and functional programming patterns.`,code:`// Assigning functions to variables
const sayHello = (name: string) => \`Hello, \${name}\`;

// Storing functions in data structures
const operations: Record<string, (a: number, b: number) => number> = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
};

console.log(operations.add(5, 3));      // 8
console.log(operations.multiply(4, 2)); // 8

// Passing functions as arguments
function applyOperation(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b);
}

console.log(applyOperation(10, 5, operations.subtract)); // 5

// Returning functions from functions
function createGreeter(greeting: string) {
  return (name: string) => \`\${greeting}, \${name}!\`;
}

const greetInEnglish = createGreeter("Hello");
const greetInSpanish = createGreeter("Hola");
console.log(greetInEnglish("Alice")); // "Hello, Alice!"
console.log(greetInSpanish("Bob"));   // "Hola, Bob!"

// Functions are objects — they have properties
function exampleFn(a: number, b: number, c: number) { return a + b + c; }
console.log(exampleFn.name);   // "exampleFn"
console.log(exampleFn.length); // 3 (number of parameters)`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`first-class functions`,`functional programming`,`values`],commonMistakes:[`Confusing first-class functions with higher-order functions — first-class is a language feature, higher-order is a function that uses that feature`,"Forgetting that `function.length` only counts parameters before the first default parameter or rest parameter",`Not realizing you can add properties to functions since they are objects`],followUps:[`What languages do NOT have first-class functions?`,`How do first-class functions enable the strategy pattern?`,`What is the Function constructor and should you use it?`],interviewTips:[`Briefly define the concept, then immediately show how it enables practical patterns — interviewers want to see applied understanding`]},{id:`js-func-8`,question:`What are callbacks? What problems can they cause?`,answer:`A callback is a function that is passed as an argument to another function and is intended to be called at a later time — either synchronously (like in \`Array.map\`) or asynchronously (like in \`setTimeout\` or API calls). Callbacks are the oldest and most fundamental async pattern in JavaScript, predating Promises and async/await.

Synchronous callbacks are straightforward and are used extensively in array methods, event listeners, and iterator patterns. They execute immediately within the calling function's execution and are not inherently problematic. Asynchronous callbacks, however, execute at some point in the future when an operation completes — such as a network request, file read, or timer.

The primary problem with asynchronous callbacks is "callback hell" or the "pyramid of doom." When multiple async operations depend on each other, each subsequent operation must be nested inside the previous callback, creating deeply indented, hard-to-read code. For example, fetching a user, then their orders, then order details would require three levels of nesting. Error handling compounds the problem because each level needs its own error check or try/catch.

Another issue is inversion of control — when you pass a callback to a third-party function, you trust that function to call your callback the correct number of times, with the correct arguments, and handle errors properly. If the third-party code has bugs, your callback might be called twice, never, or with unexpected arguments. Promises solve this by giving control back to the caller through a standardized interface.

Callbacks can also cause subtle bugs with error handling. In the Node.js error-first callback convention (\`callback(error, result)\`), forgetting to check for errors silently swallows failures. Unlike Promises, there is no built-in mechanism for unhandled rejection detection. Modern JavaScript strongly favors Promises and async/await for asynchronous operations, though callbacks remain fundamental for synchronous patterns and event-driven code.`,shortAnswer:`A callback is a function passed to another function to be executed later. While essential for async and event-driven programming, callbacks can cause "callback hell" (deeply nested async chains), inversion of control issues, and difficult error handling. Promises and async/await were introduced to solve these problems.`,code:`// Synchronous callback — no issues
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8]

// Callback hell — nested async operations
function getUserData(userId: string) {
  fetchUser(userId, (err, user) => {
    if (err) { console.error(err); return; }
    fetchOrders(user.id, (err, orders) => {
      if (err) { console.error(err); return; }
      fetchOrderDetails(orders[0].id, (err, details) => {
        if (err) { console.error(err); return; }
        console.log(details); // Deeply nested!
      });
    });
  });
}

// Same logic with Promises — flat and readable
async function getUserDataClean(userId: string) {
  try {
    const user = await fetchUserAsync(userId);
    const orders = await fetchOrdersAsync(user.id);
    const details = await fetchOrderDetailsAsync(orders[0].id);
    console.log(details);
  } catch (err) {
    console.error(err);
  }
}

// Type-safe callback pattern
type Callback<T> = (error: Error | null, result: T | null) => void;

function readFile(path: string, callback: Callback<string>): void {
  setTimeout(() => {
    if (!path) {
      callback(new Error("Path is required"), null);
      return;
    }
    callback(null, \`Contents of \${path}\`);
  }, 100);
}

readFile("/data.txt", (err, data) => {
  if (err) { console.error(err.message); return; }
  console.log(data); // "Contents of /data.txt"
});`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`callbacks`,`async`,`callback hell`,`error handling`],commonMistakes:[`Forgetting to return after handling an error in a callback — the rest of the callback still executes`,`Not handling the case where a callback might be called multiple times by a buggy library`,`Mixing synchronous and asynchronous callback patterns, leading to unpredictable execution order`],followUps:[`How do Promises improve on the callback pattern?`,`What is the error-first callback convention in Node.js?`,`How does the event loop process async callbacks?`],interviewTips:[`Show the progression from callbacks to Promises to async/await — interviewers love seeing you understand the evolution of async JavaScript`,`Mention inversion of control as a specific technical term for callback trust issues`]},{id:`js-func-9`,question:`Explain rest parameters and the spread operator.`,answer:"Rest parameters and the spread operator both use the `...` syntax but serve opposite purposes. Rest parameters collect multiple individual arguments into a single array, while the spread operator expands an iterable (like an array) into individual elements. Understanding this duality is essential for working with modern JavaScript.\n\nRest parameters are used in function definitions to collect a variable number of arguments into a real array. The syntax places `...` before the last parameter name: `function sum(...numbers: number[])`. Unlike the legacy `arguments` object, rest parameters produce a proper Array instance with access to all array methods like `map`, `filter`, and `reduce`. Rest parameters can only appear as the last parameter in the function signature, and there can only be one rest parameter per function.\n\nThe spread operator is used in function calls, array literals, and object literals to expand an iterable into individual values. In a function call, `Math.max(...numbers)` spreads an array into separate arguments. In an array literal, `[...arr1, ...arr2]` creates a new array by spreading both arrays. In an object literal (ES2018), `{ ...obj1, ...obj2 }` creates a new object by spreading properties from both objects — later properties override earlier ones.\n\nA key distinction from the old `arguments` object: `arguments` is array-like but NOT a real array — it lacks methods like `map` and `forEach`. It is also not available in arrow functions. Rest parameters produce a genuine array and work in all function types. Additionally, `arguments` captures ALL arguments regardless of named parameters, while rest parameters only capture the unnamed excess arguments.\n\nSpread is commonly used for immutable operations in React and Redux — creating new arrays and objects without mutating the originals. Combining rest and spread enables powerful patterns like function forwarding, argument manipulation, and building variadic utility functions. Note that spread performs a shallow copy — nested objects and arrays are still references.",shortAnswer:"Rest parameters (`...args`) collect multiple arguments into a real array in function definitions. The spread operator (`...arr`) expands an iterable into individual elements in function calls, array literals, and object literals. Both use `...` syntax but serve opposite purposes — rest collects, spread expands.",code:`// Rest parameters — collect arguments into an array
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Rest with leading named params
function logTagged(tag: string, ...messages: string[]): void {
  messages.forEach((msg) => console.log(\`[\${tag}] \${msg}\`));
}
logTagged("INFO", "Server started", "Port 3000");
// [INFO] Server started
// [INFO] Port 3000

// Spread in function calls
const scores = [92, 87, 95, 78, 100];
console.log(Math.max(...scores)); // 100

// Spread in arrays — shallow clone and merge
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const clone = [...arr1];           // [1, 2, 3] — new reference

// Spread in objects — immutable updates (common in React/Redux)
interface UserState {
  name: string;
  age: number;
  email: string;
}

const user: UserState = { name: "Alice", age: 30, email: "alice@example.com" };
const updated: UserState = { ...user, age: 31 }; // override age
console.log(updated); // { name: "Alice", age: 31, email: "alice@example.com" }
console.log(user.age); // 30 — original unchanged

// Rest in destructuring
const [first, second, ...remaining] = [10, 20, 30, 40, 50];
console.log(first);     // 10
console.log(remaining); // [30, 40, 50]

const { name, ...rest } = { name: "Bob", age: 25, role: "Dev" };
console.log(rest); // { age: 25, role: "Dev" }`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`rest parameters`,`spread operator`,`ES6`,`destructuring`],commonMistakes:[`Placing the rest parameter anywhere other than last in the function signature`,`Assuming spread creates a deep copy — it only performs a shallow copy`,`Confusing rest (in definitions — collects) with spread (in calls/literals — expands)`],followUps:[`How does spread differ from Object.assign()?`,`How would you deep clone an object without spread?`,`Can you use spread with Maps, Sets, or generators?`],interviewTips:[`Clearly state the directional difference: rest collects, spread expands — this simple framing immediately shows understanding`]},{id:`js-func-10`,question:`What are default parameters?`,answer:'Default parameters, introduced in ES6, allow function parameters to be initialized with default values when no argument is passed or when `undefined` is explicitly passed. Before ES6, developers had to use short-circuit evaluation (`param = param || defaultValue`) or explicit undefined checks, both of which had pitfalls — particularly the short-circuit approach, which treated falsy values like `0`, `""`, and `false` as missing.\n\nThe syntax is straightforward: `function greet(name: string = "World")`. The default value is used only when the argument is `undefined`, NOT when it is `null`, `0`, `""`, `false`, or any other falsy value. This is a crucial distinction from the old `||` pattern and makes default parameters more predictable and correct.\n\nDefault parameters are evaluated at call time, not at function definition time. This means you can use expressions, function calls, or even reference earlier parameters as defaults. For example, `function createUser(name: string, id: string = generateId())` calls `generateId()` each time the function is invoked without an `id` argument. You can also reference earlier parameters: `function rectangle(width: number, height: number = width)` makes height default to width, creating a square.\n\nDefault parameters interact with the `function.length` property in a specific way: parameters with defaults are not counted in `length`. So `function f(a, b = 1, c = 2)` has `length` of 1. Similarly, rest parameters are not counted. This matters when libraries or frameworks inspect function arity.\n\nDefault parameters also have their own scope — they exist in an intermediate scope between the outer scope and the function body scope. This means default value expressions can reference outer variables and earlier parameters, but not variables declared inside the function body. This is a subtle but important detail that can cause confusion in edge cases.',shortAnswer:"Default parameters let you set fallback values for function arguments using `param = defaultValue` syntax. They activate only when the argument is `undefined` (not null or other falsy values), are evaluated at call time, and can reference earlier parameters or outer variables.",code:`// Basic default parameters
function greet(name: string = "World"): string {
  return \`Hello, \${name}!\`;
}
console.log(greet());          // "Hello, World!"
console.log(greet("Alice"));   // "Hello, Alice!"
console.log(greet(undefined));  // "Hello, World!" — undefined triggers default

// Default vs falsy values — only undefined triggers the default
function setCount(count: number = 10): number {
  return count;
}
console.log(setCount(0));     // 0 — NOT 10, because 0 is not undefined
console.log(setCount(undefined as unknown as number)); // 10

// Old pattern had bugs with falsy values
function setCountOld(count?: number): number {
  const c = count || 10; // Bug: setCountOld(0) returns 10!
  return c;
}

// Expressions and earlier params as defaults
let callCount = 0;
function createItem(
  name: string,
  id: string = \`item-\${++callCount}\`,
  label: string = name.toUpperCase()
) {
  return { id, name, label };
}
console.log(createItem("widget"));   // { id: "item-1", name: "widget", label: "WIDGET" }
console.log(createItem("gadget"));   // { id: "item-2", name: "gadget", label: "GADGET" }

// Default with destructured object parameter
interface Options {
  retries: number;
  timeout: number;
  verbose: boolean;
}

function fetchData(
  url: string,
  { retries = 3, timeout = 5000, verbose = false }: Partial<Options> = {}
) {
  console.log(\`Fetching \${url} with \${retries} retries, \${timeout}ms timeout\`);
}
fetchData("https://api.example.com");
fetchData("https://api.example.com", { retries: 1, timeout: 10000, verbose: true });`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`default parameters`,`ES6`,`function parameters`],commonMistakes:[`Assuming null triggers the default — only undefined does`,'Using the old `||` pattern which treats 0, false, and "" as missing',`Not realizing default parameters are evaluated at call time, which can cause side effects if the default is a function call`],followUps:[`How do default parameters affect function.length?`,`What is the nullish coalescing operator (??) and how does it relate to defaults?`,`Can you destructure with defaults in function parameters?`],interviewTips:[`Highlight the difference between undefined and null/falsy triggering — this is the most common gotcha interviewers test`]},{id:`js-func-11`,question:`What is function hoisting?`,answer:"Function hoisting is the behavior where function declarations are moved to the top of their containing scope during the compilation phase, before any code is executed. This means a function declared with the `function` keyword can be called before the line where it is defined in the source code. The entire function body, not just the declaration, is hoisted.\n\nThis behavior is specific to function declarations — the `function name() { }` syntax. Function expressions, whether assigned with `var`, `let`, or `const`, are NOT fully hoisted. With `var`, the variable declaration is hoisted but initialized to `undefined`, so calling it before the assignment throws `TypeError: not a function`. With `let` and `const`, the variable exists in the temporal dead zone (TDZ) until the declaration is reached, so accessing it throws `ReferenceError`.\n\nThe JavaScript engine processes code in two phases. During the creation phase, it scans for function declarations and variable declarations, allocating memory for them. Function declarations get their full function value immediately, while `var` variables are initialized to `undefined`, and `let`/`const` variables are left uninitialized in the TDZ. During the execution phase, code runs line by line. This two-phase model explains why function declarations are available throughout their scope.\n\nFunction hoisting has a practical purpose: it allows you to organize code with higher-level functions at the top and helper functions at the bottom, improving readability. You can call `main()` at the top of a file and define it and its helpers further down. Many style guides take advantage of this by placing the primary exported function first.\n\nHowever, hoisting can also cause confusion and subtle bugs. If you declare two functions with the same name in the same scope, the second declaration silently overwrites the first. In non-strict mode, function declarations inside blocks (like `if` statements) have inconsistent hoisting behavior across engines. Modern best practice recommends using `const` with function expressions to avoid these ambiguities and make the code's initialization order explicit.",shortAnswer:`Function hoisting means function declarations are fully moved to the top of their scope during compilation, allowing them to be called before they appear in the code. Function expressions are not hoisted the same way — they follow the hoisting rules of their variable keyword (var, let, or const).`,code:`// Function declaration — fully hoisted
console.log(square(5)); // 25 — works!
function square(n: number): number {
  return n * n;
}

// Function expression with var — partially hoisted
try {
  console.log(cube(3));
} catch (e) {
  console.log(e); // TypeError: cube is not a function
}
var cube = function (n: number): number {
  return n ** 3;
};

// Function expression with const — TDZ error
try {
  console.log(double(4));
} catch (e) {
  console.log(e); // ReferenceError: Cannot access 'double' before initialization
}
const double = (n: number): number => n * 2;

// Hoisting order: function declarations override var
var myFunc: (() => string) | undefined = function () {
  return "expression";
};
function myFunc(): string {
  return "declaration";
}
// myFunc() returns "expression" because var assignment
// runs AFTER hoisting (declaration hoists, then var assigns over it)

// Practical pattern — call first, define below
function main() {
  const data = loadData();
  const processed = processData(data);
  return formatOutput(processed);
}

function loadData() { return [1, 2, 3]; }
function processData(data: number[]) { return data.map((n) => n * 10); }
function formatOutput(data: number[]) { return data.join(", "); }

console.log(main()); // "10, 20, 30"`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`hoisting`,`TDZ`,`scope`,`compilation`],commonMistakes:[`Thinking that function expressions with var are fully hoisted — only the variable name is hoisted, not the function assignment`,`Assuming function declarations in if-blocks hoist consistently across all environments`,`Not realizing that when both a var and function declaration share the same name, the final value depends on execution order`],followUps:[`How does the temporal dead zone work with let and const?`,`What happens when you declare a function inside a block in strict vs non-strict mode?`,`What is the difference between the creation phase and execution phase?`],interviewTips:[`Draw a mental model of the two-phase execution — creation phase (hoisting) then execution phase — to explain any hoisting question clearly`]},{id:`js-func-12`,question:`Explain the arguments object vs rest parameters.`,answer:"The `arguments` object is an array-like object available inside all non-arrow function bodies. It contains an entry for each argument passed to the function, indexed starting at 0, and has a `length` property. However, it is NOT a true array — it does not have array methods like `map`, `filter`, `forEach`, or `reduce`. To use array methods on it, you had to convert it with `Array.prototype.slice.call(arguments)` or, in ES6, `Array.from(arguments)`.\n\nRest parameters (`...args`) were introduced in ES6 as a modern replacement for common `arguments` use cases. A rest parameter is a real `Array` instance, so all array methods are available directly. Rest parameters are also explicitly declared in the function signature, making the function's intent and parameter handling clear to readers and to static analysis tools like TypeScript.\n\nThere are several important behavioral differences. The `arguments` object reflects ALL arguments passed, including those that match named parameters, while rest parameters only collect excess arguments not matched by earlier named parameters. In sloppy (non-strict) mode, `arguments` maintains a live link to named parameters — modifying `arguments[0]` changes the first named parameter and vice versa. This coupling does not exist in strict mode or with rest parameters. Arrow functions do not have their own `arguments` — they inherit it from the nearest enclosing regular function.\n\nThe `arguments` object also has a `callee` property (in non-strict mode) that references the currently executing function. This was used for anonymous recursive functions but is forbidden in strict mode due to performance and security concerns. Rest parameters combined with named function expressions provide a better alternative for recursion.\n\nIn modern JavaScript and TypeScript, rest parameters are strongly preferred. They are type-safe, self-documenting, produce real arrays, work in arrow functions, and have no surprising aliasing behavior. The `arguments` object should be considered a legacy feature — the only reason to know about it is to understand and maintain older code.",shortAnswer:"The `arguments` object is an array-like object available in regular functions containing all passed arguments. Rest parameters (`...args`) are a modern ES6 replacement that produce a real Array, only collect excess arguments, work in arrow functions, and are type-safe. Rest parameters are strongly preferred in modern code.",code:`// arguments object — legacy approach
function legacySum() {
  // arguments is array-like, not a real array
  console.log(Array.isArray(arguments)); // false

  // Must convert to use array methods
  const args = Array.from(arguments) as number[];
  return args.reduce((sum, n) => sum + n, 0);
}
console.log(legacySum(1, 2, 3, 4)); // 10

// Rest parameters — modern approach
function modernSum(...numbers: number[]): number {
  console.log(Array.isArray(numbers)); // true
  return numbers.reduce((sum, n) => sum + n, 0);
}
console.log(modernSum(1, 2, 3, 4)); // 10

// arguments captures ALL args; rest captures only extras
function example(first: string, second: string, ...others: string[]) {
  // others contains everything after first and second
  console.log(\`first: \${first}\`);
  console.log(\`second: \${second}\`);
  console.log("others:", others);
}
example("a", "b", "c", "d", "e");
// first: a
// second: b
// others: ["c", "d", "e"]

// Arrow functions do NOT have arguments
const arrowFn = (...args: number[]) => {
  // console.log(arguments); // ReferenceError or inherited from outer scope
  return args.reduce((sum, n) => sum + n, 0);
};

// Aliasing gotcha in non-strict mode (regular functions only)
function aliasDemo(x: number) {
  // In sloppy mode, arguments[0] and x are linked
  console.log(x, arguments[0]); // 10, 10
  arguments[0] = 99;
  console.log(x); // 99 in sloppy mode, 10 in strict mode
}
aliasDemo(10);

// Type-safe variadic function with rest params
function formatItems<T>(formatter: (item: T) => string, ...items: T[]): string[] {
  return items.map(formatter);
}
const result = formatItems((n: number) => n.toFixed(2), 1, 2.5, 3.14);
console.log(result); // ["1.00", "2.50", "3.14"]`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`arguments`,`rest parameters`,`ES6`,`array-like`],commonMistakes:[`Trying to use Array.prototype methods directly on arguments without converting it first`,`Relying on the arguments/parameter aliasing behavior which only exists in non-strict mode`,`Attempting to access arguments inside an arrow function and not realizing it resolves to the outer scope`],followUps:[`Why is arguments.callee deprecated in strict mode?`,`How does TypeScript type the arguments object?`,`What other array-like objects exist in JavaScript (NodeList, HTMLCollection)?`],interviewTips:[`Frame this as an evolution story — arguments was the old way, rest parameters are the modern replacement — then list the specific improvements`,`Mentioning the aliasing gotcha in sloppy mode shows deep knowledge`]},{id:`js-func-13`,question:`How do you implement currying in JavaScript?`,answer:'Currying is a functional programming technique that transforms a function with multiple arguments into a sequence of functions, each taking a single argument. A curried version of `f(a, b, c)` becomes `f(a)(b)(c)`. Each call returns a new function that captures the previous arguments via closures until all expected arguments have been provided, at which point the original function is executed.\n\nThe simplest form of currying is manual — you nest functions that each take one parameter: `const add = (a) => (b) => a + b`. This works well for functions with a known, small number of parameters. For more general use, you can implement an automatic curry function that inspects the original function\'s `length` property and progressively accumulates arguments until enough have been collected.\n\nCurrying is closely related to partial application but is technically different. Partial application fixes some arguments and returns a function that accepts the remaining arguments — you can fix any number at once. Currying strictly transforms the function so each step accepts exactly one argument. In practice, many JavaScript "curry" implementations support both patterns, allowing you to pass multiple arguments at once for convenience.\n\nCurrying enables powerful composition patterns. You can create specialized versions of generic functions without calling them: `const double = multiply(2)` creates a doubler from a curried multiply. This is the foundation of point-free programming and is used extensively in libraries like Ramda. In React, curried functions are useful for creating event handler factories and reusable configuration functions.\n\nTypeScript typing for curry functions can be challenging because the return type changes depending on how many arguments have been supplied. Advanced implementations use conditional types and tuple manipulation to provide full type safety, but simpler typed versions work well for most practical use cases.',shortAnswer:"Currying transforms a multi-argument function into a chain of single-argument functions: `f(a, b, c)` becomes `f(a)(b)(c)`. Each call returns a new closure capturing previous arguments. It enables partial application, function composition, and creating specialized functions from generic ones.",code:`// Manual currying
const multiply = (a: number) => (b: number): number => a * b;
const double = multiply(2);
const triple = multiply(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15

// Generic curry utility
function curry<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Partial<Args> extends infer P ? unknown[] : never) => unknown {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn(...args as unknown as Args);
    }
    return (...moreArgs: unknown[]) => curried(...args, ...moreArgs);
  };
}

function addThree(a: number, b: number, c: number): number {
  return a + b + c;
}

const curriedAdd = curry(addThree);
console.log(curriedAdd(1)(2)(3));    // 6
console.log(curriedAdd(1, 2)(3));    // 6
console.log(curriedAdd(1)(2, 3));    // 6
console.log(curriedAdd(1, 2, 3));    // 6

// Practical: curried event handler factory in React
const handleFieldChange =
  (fieldName: string) =>
  (event: { target: { value: string } }) => {
    console.log(\`Field "\${fieldName}" changed to: \${event.target.value}\`);
  };

// In JSX: onChange={handleFieldChange("email")}
const onEmailChange = handleFieldChange("email");
onEmailChange({ target: { value: "test@example.com" } });
// Field "email" changed to: test@example.com

// Curried data transformation pipeline
const filterBy = <T,>(predicate: (item: T) => boolean) =>
  (items: T[]): T[] => items.filter(predicate);

const mapWith = <T, U>(transform: (item: T) => U) =>
  (items: T[]): U[] => items.map(transform);

const getActiveUserNames = (users: Array<{ name: string; active: boolean }>) => {
  const onlyActive = filterBy<{ name: string; active: boolean }>((u) => u.active);
  const toNames = mapWith<{ name: string; active: boolean }, string>((u) => u.name);
  return toNames(onlyActive(users));
};

const users = [
  { name: "Alice", active: true },
  { name: "Bob", active: false },
  { name: "Charlie", active: true },
];
console.log(getActiveUserNames(users)); // ["Alice", "Charlie"]`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`JavaScript`,topicId:`js-functions`,tags:[`currying`,`partial application`,`functional programming`,`closures`],commonMistakes:[`Confusing currying (one arg at a time) with partial application (fixing some args) — though many JS implementations blend both`,`Not accounting for functions with default or rest parameters when using fn.length to determine arity`,`Over-currying simple functions where a plain function call would be more readable`],followUps:[`What is the difference between currying and partial application?`,`How does Ramda handle currying differently from Lodash?`,`How would you type a fully generic curry function in TypeScript?`],interviewTips:[`Start with a simple manual example, then show the generic curry utility — this demonstrates both understanding and practical skill`]},{id:`js-func-14`,question:`Explain call, apply, and bind methods on functions.`,answer:"Every JavaScript function inherits three methods from `Function.prototype` that allow you to explicitly set the `this` context: `call`, `apply`, and `bind`. These methods exist because `this` in regular functions is determined by how a function is called, not where it is defined, and sometimes you need to control that context explicitly.\n\n`Function.prototype.call(thisArg, arg1, arg2, ...)` invokes the function immediately with `thisArg` as the `this` value, and subsequent arguments passed individually. `Function.prototype.apply(thisArg, [argsArray])` does the same thing, but accepts arguments as an array (or array-like object). The mnemonic is: Call takes a Comma-separated list, Apply takes an Array. Before ES6 spread syntax, `apply` was the standard way to pass an array of arguments to functions like `Math.max`.\n\n`Function.prototype.bind(thisArg, arg1, arg2, ...)` does NOT invoke the function immediately. Instead, it returns a new function with `this` permanently bound to `thisArg` and optionally pre-filled arguments (partial application). The bound function remembers its `this` regardless of how it is later called — even with `new`, `call`, or `apply`. This is particularly useful for event handlers and callbacks where `this` would otherwise be lost.\n\nIn React class components, `bind` was commonly used in the constructor to ensure event handler methods had the correct `this`: `this.handleClick = this.handleClick.bind(this)`. This pattern has been largely replaced by arrow function class properties, which lexically capture `this`. However, understanding `bind` remains important for reading legacy code and for cases where you need partial application.\n\nImportant edge cases: calling `call`, `apply`, or `bind` on an arrow function does NOT change its `this` — arrow functions always use lexical `this`. In strict mode, passing `null` or `undefined` as `thisArg` to `call` or `apply` keeps `this` as `null`/`undefined`. In sloppy mode, it defaults to the global object. `bind` can be called multiple times, but only the first binding takes effect — subsequent `bind` calls create new wrappers but cannot change the inner `this`.",shortAnswer:"`call` and `apply` invoke a function immediately with a specified `this` — call takes arguments individually, apply takes them as an array. `bind` returns a new function with `this` permanently set. These methods are used for explicit context control, method borrowing, and partial application.",code:`const person = {
  name: "Alice",
  greet(greeting: string, punctuation: string): string {
    return \`\${greeting}, I'm \${this.name}\${punctuation}\`;
  },
};

const bob = { name: "Bob" };

// call — invoke with individual arguments
console.log(person.greet.call(bob, "Hi", "!"));
// "Hi, I'm Bob!"

// apply — invoke with arguments as an array
console.log(person.greet.apply(bob, ["Hey", "."]));
// "Hey, I'm Bob."

// bind — returns a new permanently-bound function
const bobGreet = person.greet.bind(bob, "Hello");
console.log(bobGreet("!")); // "Hello, I'm Bob!" — only needs remaining args
console.log(bobGreet("?")); // "Hello, I'm Bob?"

// Practical: method borrowing
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const realArray = Array.prototype.slice.call(arrayLike);
console.log(realArray); // ["a", "b", "c"]

// Practical: bind in React class component
class SearchComponent {
  query: string;

  constructor() {
    this.query = "";
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: { target: { value: string } }) {
    this.query = event.target.value;
    console.log("Query:", this.query);
  }
}

// Partial application with bind
function log(level: string, timestamp: string, message: string) {
  console.log(\`[\${level}] \${timestamp}: \${message}\`);
}

const errorLog = log.bind(null, "ERROR");
errorLog("2026-08-31", "Something went wrong");
// [ERROR] 2026-08-31: Something went wrong

// bind does NOT work on arrow functions for \`this\`
const arrowFn = () => console.log(this);
const bound = arrowFn.bind({ custom: true });
bound(); // Still logs the outer \`this\`, ignores bind`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functions`,tags:[`call`,`apply`,`bind`,`this`,`context`],commonMistakes:[`Forgetting that bind returns a NEW function — the original is unchanged`,"Trying to use call/apply/bind to change `this` on an arrow function",`Binding a function multiple times expecting each bind to override the previous one`],followUps:[`How would you implement your own bind function (polyfill)?`,`How does call/apply performance compare to direct invocation?`,`When would you use apply over the spread operator?`],interviewTips:[`Use the mnemonic "Call = Comma, Apply = Array" to quickly explain the difference, then discuss bind separately as a deferred version`]}]}],r=[{id:`js-async`,title:`Asynchronous JavaScript`,description:`Master the event loop, promises, async/await, and the concurrency model that powers modern JavaScript applications.`,category:`JavaScript`,difficulty:`Intermediate`,tags:[`async`,`promises`,`event-loop`,`callbacks`,`async-await`,`microtasks`,`macrotasks`,`concurrency`],overview:`Asynchronous JavaScript is the backbone of non-blocking I/O in the browser and Node.js. Understanding the event loop, task queues, and promise mechanics is essential for writing performant, bug-free code and is one of the most frequently tested areas in JavaScript interviews. This topic covers everything from basic callbacks through advanced promise combinators and the nuances of microtask vs macrotask scheduling.`,concepts:[`Event Loop`,`Call Stack`,`Callback Queue (Task Queue)`,`Microtask Queue`,`Macrotask Queue`,`Web APIs`,`Callbacks`,`Promises`,`Promise Chaining`,`async/await`,`Promise.all`,`Promise.allSettled`,`Promise.race`,`Promise.any`,`Error Handling in Async Code`,`Callback Hell`,`Synchronous vs Asynchronous Execution`],questions:[{id:`js-async-1`,question:`What is the event loop? How does it work?`,answer:`The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously monitors the call stack and the task queues, and whenever the call stack is empty, it picks the next task from the queue and pushes it onto the stack for execution.

The event loop operates in a cycle: first, it executes all synchronous code on the call stack until the stack is empty. Then, it drains the entire microtask queue (promises, queueMicrotask, MutationObserver callbacks). After all microtasks are processed, it picks one macrotask (setTimeout, setInterval, I/O callbacks, UI rendering events) from the macrotask queue and pushes it onto the call stack. Once that macrotask completes and the call stack is empty again, the microtask queue is drained once more before the next macrotask is picked up.

Between macrotask executions the browser may also run rendering steps (style calculation, layout, paint) if needed, which is why long-running synchronous code blocks UI updates. The event loop ensures that the main thread is never idle when there is work to do, but it also means that a single long-running task can starve all pending callbacks and freeze the UI.

This architecture is fundamentally different from multi-threaded concurrency models. Instead of parallel execution, JavaScript achieves concurrency through cooperative scheduling — each task runs to completion before the next one begins. Understanding this model is crucial for predicting execution order and avoiding common pitfalls like starvation and race conditions.`,shortAnswer:`The event loop is a continuous cycle that monitors the call stack and task queues. When the call stack is empty, it first drains all microtasks, then picks one macrotask to execute. This enables non-blocking behavior in single-threaded JavaScript.`,code:`// Visualization of event loop priority
console.log("1: Synchronous");

setTimeout(() => {
  console.log("2: Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Microtask (Promise)");
});

console.log("4: Synchronous");

// Output:
// 1: Synchronous
// 4: Synchronous
// 3: Microtask (Promise)
// 2: Macrotask (setTimeout)`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`event-loop`,`call-stack`,`task-queue`,`microtasks`,`macrotasks`],commonMistakes:[`Assuming setTimeout(fn, 0) runs immediately — it is a macrotask and always yields to microtasks first.`,`Forgetting that the microtask queue is fully drained before any macrotask runs, which can cause starvation if microtasks keep enqueuing more microtasks.`,`Believing that the event loop creates parallelism — JavaScript is still single-threaded; concurrency comes from cooperative scheduling.`],followUps:[`How does requestAnimationFrame fit into the event loop cycle?`,`What happens if a microtask enqueues another microtask indefinitely?`,`How does the event loop differ in Web Workers?`],interviewTips:[`Draw the event loop diagram (call stack, Web APIs, microtask queue, macrotask queue) on a whiteboard to demonstrate understanding.`,`Use a concrete code example with setTimeout and Promise to walk through execution order step-by-step.`]},{id:`js-async-2`,question:`Explain the difference between the call stack and the task queue.`,answer:`The call stack is a LIFO (Last In, First Out) data structure that tracks the execution context of function calls. Every time a function is invoked, a new frame is pushed onto the stack containing the function's arguments, local variables, and return address. When the function returns, its frame is popped off the stack. The call stack is where synchronous code executes, and JavaScript can only execute the code that is at the top of the stack.

The task queue (also called the callback queue or macrotask queue) is a FIFO (First In, First Out) queue that holds callbacks that are ready to be executed but are waiting for the call stack to become empty. Callbacks from setTimeout, setInterval, I/O operations, and UI events are placed into the task queue by Web APIs or the Node.js runtime once their triggering condition is met (e.g., timer expires, HTTP response arrives).

The critical relationship between them is mediated by the event loop: the event loop only dequeues a task from the task queue and pushes it onto the call stack when the call stack is completely empty and all microtasks have been processed. This means that even a setTimeout with a 0ms delay will not execute until all currently running synchronous code and all pending microtasks have completed.

Understanding this distinction is essential for debugging timing issues. If you have heavy synchronous computation on the call stack, all callbacks in the task queue are blocked, leading to unresponsive UIs and missed timer deadlines. This is why breaking up large computations with techniques like chunking or Web Workers is important for responsive applications.`,shortAnswer:`The call stack is a LIFO structure where synchronous code executes. The task queue is a FIFO queue holding async callbacks waiting for the call stack to empty. The event loop moves tasks from the queue to the stack only when the stack is clear and all microtasks are drained.`,code:`function main() {
  console.log("Start");

  setTimeout(() => {
    console.log("Timeout callback"); // Waits in task queue
  }, 0);

  function compute() {
    // This runs on the call stack
    for (let i = 0; i < 3; i++) {
      console.log(\`Computing \${i}\`);
    }
  }

  compute();
  console.log("End");
}

main();
// Output:
// Start
// Computing 0
// Computing 1
// Computing 2
// End
// Timeout callback`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`call-stack`,`task-queue`,`event-loop`],commonMistakes:[`Confusing the task queue with the microtask queue — they are separate queues with different priorities.`,`Assuming the call stack can hold multiple executing functions simultaneously — only the topmost frame is actively executing.`,`Thinking setTimeout(fn, 0) guarantees immediate execution after the current line.`],followUps:[`What is a stack overflow and how does it relate to the call stack?`,`How does tail call optimization affect the call stack?`,`What is the maximum call stack size in modern browsers?`],interviewTips:[`Trace through a code example showing how the call stack grows and shrinks with nested function calls while a setTimeout callback waits in the task queue.`]},{id:`js-async-3`,question:`What are microtasks and macrotasks? What's the priority?`,answer:`Microtasks and macrotasks are two categories of asynchronous tasks that are scheduled in separate queues and processed with different priorities by the event loop. Microtasks include Promise callbacks (.then, .catch, .finally), queueMicrotask callbacks, and MutationObserver callbacks. Macrotasks include setTimeout, setInterval, setImmediate (Node.js), I/O callbacks, and UI rendering events.

The priority rule is simple but crucial: microtasks always have higher priority than macrotasks. After the call stack becomes empty, the event loop first drains the entire microtask queue — processing every pending microtask, including any new microtasks enqueued during processing — before picking the next macrotask. This means that if a Promise callback enqueues another Promise callback, both will run before any setTimeout callback, even if the setTimeout was scheduled first.

This priority difference has practical implications. Because the microtask queue is fully drained before any macrotask or rendering step, a tight loop of microtasks can starve macrotasks and block rendering. For example, a recursive chain of Promise.resolve().then(() => ...) that never terminates will freeze the browser just as effectively as an infinite synchronous loop. Conversely, this priority ensures that Promise-based code has predictable and immediate scheduling, which is why async/await feels more sequential than callback-based patterns.

In Node.js, the picture is slightly more complex. Node uses libuv, which has multiple phases (timers, pending callbacks, poll, check, close) and process.nextTick callbacks are processed before other microtasks. Understanding these priorities is key to predicting execution order in both browser and server environments.`,shortAnswer:`Microtasks (Promises, queueMicrotask) have higher priority than macrotasks (setTimeout, setInterval, I/O). The event loop fully drains the microtask queue after each call stack clearance before processing the next macrotask. This ensures Promise callbacks run before any pending timers or I/O callbacks.`,code:`console.log("Script start");

setTimeout(() => console.log("setTimeout 1"), 0);
setTimeout(() => console.log("setTimeout 2"), 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    // Enqueue another microtask during microtask processing
    Promise.resolve().then(() => console.log("Promise 3"));
  })
  .then(() => console.log("Promise 2"));

console.log("Script end");

// Output:
// Script start
// Script end
// Promise 1
// Promise 3
// Promise 2
// setTimeout 1
// setTimeout 2`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`microtasks`,`macrotasks`,`event-loop`,`promises`],commonMistakes:[`Assuming microtasks and macrotasks share the same queue — they are distinct queues with different scheduling rules.`,`Not realizing that microtasks enqueued during microtask processing run before the next macrotask, potentially causing infinite loops.`,`Confusing process.nextTick (Node.js specific, runs before other microtasks) with queueMicrotask (standard, runs after nextTick).`],followUps:[`Can you create an infinite microtask loop that freezes the browser? How?`,`Where does requestAnimationFrame fit — microtask or macrotask?`,`How does process.nextTick differ from Promise.resolve().then()?`],interviewTips:[`Memorize the priority order: synchronous code > microtasks > macrotasks. Walk through examples using this ordering.`,`Mention that requestAnimationFrame is neither a microtask nor a macrotask — it runs before the next repaint, after microtasks.`]},{id:`js-async-4`,question:`What are Promises? How do they work?`,answer:`A Promise is an object representing the eventual completion or failure of an asynchronous operation. It serves as a placeholder for a value that is not yet available but will be resolved at some point in the future. Promises have three states: pending (initial state, neither fulfilled nor rejected), fulfilled (the operation completed successfully with a result value), and rejected (the operation failed with a reason, typically an error).

When you create a Promise with \`new Promise((resolve, reject) => { ... })\`, the executor function runs synchronously and immediately. Inside the executor, you call resolve(value) to fulfill the promise or reject(reason) to reject it. Once a Promise transitions from pending to either fulfilled or rejected, it is settled and its state can never change again — Promises are immutable once settled. The resolve and reject functions can only be called once; subsequent calls are silently ignored.

Consumers attach callbacks using .then(onFulfilled, onRejected), .catch(onRejected), and .finally(onSettled). These methods return new Promises, enabling chaining. The callbacks registered via .then and .catch are always executed asynchronously as microtasks, even if the Promise is already settled at the time of registration. This guarantees consistent, predictable ordering — you never get a synchronous callback from a .then handler, which prevents a class of bugs related to Zalgo (inconsistent sync/async behavior).

Promises solved the fundamental problems of callback-based async code: inversion of control (you no longer pass your callback to a third-party function), composability (Promise combinators like Promise.all allow orchestration of multiple async operations), and standardized error propagation (rejected promises propagate through the chain until caught). They form the foundation on which async/await is built, as await is essentially syntactic sugar for .then chaining.`,shortAnswer:"A Promise is an object representing an async operation that is pending, fulfilled, or rejected. Created with `new Promise((resolve, reject) => { })`, it becomes immutable once settled. Consumers use .then/.catch/.finally to handle results, and these callbacks always run as microtasks, enabling predictable chaining and error propagation.",code:`function fetchUserData(userId: string): Promise<{ name: string; email: string }> {
  return new Promise((resolve, reject) => {
    // Executor runs synchronously
    console.log("Fetching user...");

    setTimeout(() => {
      if (userId === "1") {
        resolve({ name: "Alice", email: "alice@example.com" });
      } else {
        reject(new Error(\`User \${userId} not found\`));
      }
    }, 1000);
  });
}

fetchUserData("1")
  .then((user) => {
    console.log(\`Found: \${user.name}\`);
    return user.email;
  })
  .then((email) => {
    console.log(\`Email: \${email}\`);
  })
  .catch((error: Error) => {
    console.error(\`Error: \${error.message}\`);
  })
  .finally(() => {
    console.log("Fetch complete");
  });`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`promises`,`async`,`then`,`catch`,`finally`],commonMistakes:[`Forgetting that the Promise executor function runs synchronously — only the .then/.catch callbacks are deferred.`,`Not returning values inside .then handlers, breaking the chain and resulting in undefined propagation.`,`Creating a new Promise wrapping an existing Promise (known as the Promise constructor anti-pattern) instead of just returning the existing Promise.`],followUps:[`What is the Promise constructor anti-pattern and how do you avoid it?`,`How does Promise.resolve() differ from new Promise(resolve => resolve())?`,`What happens if you throw an error inside a .then handler?`],interviewTips:[`Emphasize the three states and the immutability of settled Promises — once fulfilled or rejected, the state never changes.`,`Mention that .then callbacks are microtasks to show you understand the event loop integration.`]},{id:`js-async-5`,question:`Explain async/await and its relationship to Promises.`,answer:`async/await is syntactic sugar built on top of Promises that allows you to write asynchronous code that reads like synchronous code. An async function always returns a Promise — if you return a plain value, it is automatically wrapped in Promise.resolve(). The await keyword can only be used inside an async function (or at the top level of ES modules) and pauses the execution of the async function until the awaited Promise settles.

When the JavaScript engine encounters an await expression, it does the following: if the value is a Promise, it registers a .then callback on that Promise and suspends the async function, returning control to the caller. The rest of the function body after the await is essentially the .then callback. When the Promise resolves, the async function resumes execution with the resolved value. If the Promise rejects, the await expression throws the rejection reason, which can be caught with try/catch.

This transformation is important to understand because it explains the execution order. Code before the first await in an async function runs synchronously. The moment an await is hit, the function yields and the caller continues. This is why calling an async function does not block — it returns a Promise immediately. The remainder of the function is scheduled as microtasks, just like .then callbacks.

The main advantages over raw Promise chains are readability, debuggability (stack traces are cleaner), and natural error handling with try/catch/finally instead of .catch chains. However, a common pitfall is unnecessary sequential awaiting — using \`await a(); await b()\` when a and b are independent, which wastes time. In such cases, \`await Promise.all([a(), b()])\` runs both concurrently. Understanding that async/await is just Promises under the hood helps you avoid these performance traps and write more efficient async code.`,shortAnswer:`async/await is syntactic sugar over Promises. An async function always returns a Promise, and await pauses execution until the awaited Promise settles. Code after await becomes a microtask (.then callback under the hood). It enables writing async code with synchronous-looking syntax and try/catch error handling.`,code:`// Promise chain version
function loadUserPromise(id: string) {
  return fetch(\`/api/users/\${id}\`)
    .then((res) => res.json())
    .then((user) => fetch(\`/api/posts?userId=\${user.id}\`))
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

// async/await equivalent
async function loadUserAsync(id: string) {
  try {
    const userRes = await fetch(\`/api/users/\${id}\`);
    const user = await userRes.json();
    const postsRes = await fetch(\`/api/posts?userId=\${user.id}\`);
    return await postsRes.json();
  } catch (err) {
    console.error(err);
  }
}

// Parallel execution with async/await
async function loadDashboard(userId: string) {
  const [user, notifications, settings] = await Promise.all([
    fetchUser(userId),
    fetchNotifications(userId),
    fetchSettings(userId),
  ]);
  return { user, notifications, settings };
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`async-await`,`promises`,`error-handling`],commonMistakes:[`Sequentially awaiting independent Promises instead of using Promise.all for concurrent execution.`,`Forgetting that an async function always returns a Promise, even if you return a plain value.`,`Using await inside a forEach loop — forEach does not await async callbacks. Use for...of or Promise.all with map instead.`],followUps:[`What happens if you forget to await an async function call?`,`How do you handle errors from Promise.all when using async/await?`,`Can you use await at the top level of a script? What are the requirements?`],interviewTips:[`Show you understand the performance implication by contrasting sequential awaits with Promise.all for independent operations.`,`Mention that async/await and .then are interchangeable — knowing when to use each shows mastery.`]},{id:`js-async-6`,question:`What is promise chaining?`,answer:`Promise chaining is the technique of connecting multiple asynchronous operations in sequence by returning new Promises from .then handlers. Because .then always returns a new Promise, each .then in the chain receives the resolved value of the previous one, creating a flat, readable pipeline of async transformations.

The key mechanism is the return value inside a .then callback. If you return a plain value, the next .then receives that value immediately (wrapped in a resolved Promise). If you return a Promise, the chain waits for that Promise to settle before proceeding to the next .then. If you throw an error or return a rejected Promise, the chain skips subsequent .then handlers and jumps to the nearest .catch. After a .catch, the chain can continue with further .then handlers because .catch also returns a new Promise.

Promise chaining solved the "callback hell" problem by flattening deeply nested callbacks into a linear sequence. Instead of nesting callbacks inside callbacks, each step is a .then in a flat chain. Error handling is also centralized — a single .catch at the end can handle errors from any step in the chain, though you can also place .catch handlers at intermediate points for recovery logic.

A common mistake is forgetting to return the Promise inside a .then handler, which breaks the chain. Without a return, the next .then receives undefined instead of the async result, and worse, any errors from the un-returned Promise become unhandled rejections. Understanding this return behavior is essential for writing correct Promise chains and is the main reason async/await was introduced — it makes the implicit returns explicit.`,shortAnswer:`Promise chaining links multiple async operations by returning values or Promises from .then handlers. Each .then returns a new Promise, allowing a flat pipeline where errors propagate to the nearest .catch. Forgetting to return inside .then is the most common mistake that breaks chains.`,code:`function getUser(id: number): Promise<{ id: number; name: string }> {
  return fetch(\`/api/users/\${id}\`).then((res) => res.json());
}

function getPosts(userId: number): Promise<{ title: string }[]> {
  return fetch(\`/api/users/\${userId}/posts\`).then((res) => res.json());
}

function getComments(postTitle: string): Promise<string[]> {
  return fetch(\`/api/comments?post=\${postTitle}\`).then((res) => res.json());
}

// Chaining dependent async operations
getUser(1)
  .then((user) => {
    console.log(\`User: \${user.name}\`);
    return getPosts(user.id); // Return Promise to continue chain
  })
  .then((posts) => {
    console.log(\`First post: \${posts[0].title}\`);
    return getComments(posts[0].title); // Another dependent call
  })
  .then((comments) => {
    console.log(\`Comments: \${comments.length}\`);
  })
  .catch((error: Error) => {
    // Catches errors from ANY step in the chain
    console.error(\`Failed: \${error.message}\`);
  });`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`JavaScript`,topicId:`js-async`,tags:[`promises`,`chaining`,`then`,`catch`],commonMistakes:[`Not returning the Promise inside .then, which breaks the chain and causes the next .then to receive undefined.`,`Nesting .then handlers inside each other instead of chaining them flat, recreating callback hell with Promises.`,`Placing .catch before .then handlers that should also be error-guarded — .catch only handles errors from preceding steps.`],followUps:[`How do you recover from an error mid-chain and continue processing?`,`What is the difference between .then(onFulfilled, onRejected) and .then(onFulfilled).catch(onRejected)?`,`How does returning a thenable (non-Promise with a .then method) affect the chain?`],interviewTips:[`Emphasize that the return value inside .then determines what the next .then receives — this is the most common source of bugs in Promise code.`]},{id:`js-async-7`,question:`Compare Promise.all, Promise.allSettled, Promise.race, and Promise.any. When would you use each?`,answer:`These four Promise combinators serve different orchestration needs when working with multiple concurrent Promises.

Promise.all takes an iterable of Promises and returns a single Promise that fulfills with an array of all results when every input Promise fulfills. If any single Promise rejects, Promise.all immediately rejects with that rejection reason, and the results of already-fulfilled Promises are discarded. Use it when all operations must succeed for the result to be meaningful — such as loading all required data for a dashboard, where a partial load is unacceptable.

Promise.allSettled takes the same input but never short-circuits. It waits for every Promise to settle (fulfill or reject) and returns an array of objects with \`{ status: "fulfilled", value }\` or \`{ status: "rejected", reason }\`. Use it when you need results from all operations regardless of individual failures — such as batch processing where you want to know which items succeeded and which failed.

Promise.race returns a Promise that settles with the result of whichever input Promise settles first, whether fulfilled or rejected. Use it for timeout patterns (racing an operation against a timer), caching strategies (race network vs cache), or any scenario where the fastest response wins. Be careful: the losing Promises still execute to completion — they are not cancelled.

Promise.any (ES2021) returns a Promise that fulfills with the value of the first input Promise that fulfills. It ignores rejections unless all Promises reject, in which case it rejects with an AggregateError containing all rejection reasons. Use it when you need at least one success from multiple sources — such as trying multiple API endpoints or CDN mirrors and using whichever responds first successfully.`,shortAnswer:`Promise.all resolves when all succeed, rejects on first failure. Promise.allSettled waits for all to settle regardless of outcome. Promise.race settles with the first to settle (success or failure). Promise.any resolves with the first success, rejects only if all fail with an AggregateError.`,code:`const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 100));
const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 500));
const fail = new Promise((_, reject) => setTimeout(() => reject(new Error("fail")), 200));

// Promise.all — all must succeed
Promise.all([fast, slow])
  .then((results) => console.log("all:", results)); // ["fast", "slow"]

// Promise.allSettled — wait for everything
Promise.allSettled([fast, slow, fail])
  .then((results) => console.log("allSettled:", results));
// [
//   { status: "fulfilled", value: "fast" },
//   { status: "fulfilled", value: "slow" },
//   { status: "rejected", reason: Error("fail") }
// ]

// Promise.race — first to settle wins
Promise.race([fast, slow, fail])
  .then((winner) => console.log("race:", winner)); // "fast"

// Promise.any — first to fulfill wins
Promise.any([fail, fast, slow])
  .then((winner) => console.log("any:", winner)); // "fast"

// Practical: timeout pattern with Promise.race
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(\`Timeout after \${ms}ms\`)), ms)
  );
  return Promise.race([promise, timeout]);
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`promise-all`,`promise-race`,`promise-any`,`promise-allSettled`,`combinators`],commonMistakes:[`Using Promise.all when partial failures are acceptable — use Promise.allSettled instead to avoid losing successful results.`,`Confusing Promise.race with Promise.any — race settles on the first result (even rejection), while any waits for the first fulfillment.`,`Assuming Promise.race or Promise.any cancels the losing Promises — they continue executing in the background.`],followUps:[`How would you implement a Promise.all polyfill?`,`What is AggregateError and when is it thrown?`,`How do you implement a concurrency limiter for running N promises at a time?`],interviewTips:[`Know the exact short-circuit behavior: all rejects on first failure, any rejects only when all fail, race and allSettled never short-circuit based on only success or only failure.`,`Have a practical use case ready for each combinator — timeout patterns for race, batch operations for allSettled.`]},{id:`js-async-8`,question:`What is callback hell? How can it be solved?`,answer:`Callback hell (also called the "pyramid of doom") is a code pattern that emerges when multiple asynchronous operations depend on each other and are implemented using nested callbacks. Each subsequent operation is started inside the callback of the previous one, leading to deeply indented, hard-to-read, and difficult-to-maintain code. The deeper the nesting, the harder it becomes to follow the control flow, handle errors consistently, and add or remove steps.

The fundamental problems with callback hell go beyond aesthetics. Error handling is fragmented — each callback needs its own error check, and forgetting one creates silent failures. Control flow becomes implicit and entangled; adding a step in the middle of the chain requires restructuring all subsequent nesting levels. Testing individual steps is also difficult because they are tightly coupled through closure scoping rather than explicit data passing.

There are several solutions. First, Promises flatten the pyramid into a linear chain of .then calls, where each step explicitly returns its result to the next. Error handling is centralized with .catch. Second, async/await takes this further by making asynchronous code look and behave like synchronous code, with try/catch for error handling and natural control flow (if/else, loops). Third, named functions can break apart deeply nested callbacks into smaller, reusable functions that are composed together.

Modular architecture also helps: libraries like async.js (for callbacks) or RxJS (for reactive streams) provide higher-level abstractions for common patterns like sequential execution, parallel execution, and error-first callbacks. In modern JavaScript, the standard approach is async/await, which completely eliminates the nesting problem while preserving readability.`,shortAnswer:`Callback hell is deeply nested callbacks from sequential async operations, creating unreadable "pyramid of doom" code. It is solved by Promises (flat .then chains), async/await (synchronous-looking syntax), named functions (breaking apart nested callbacks), or higher-level abstractions like RxJS.`,code:`// Callback hell — deeply nested, hard to read
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      getShippingStatus(details.trackingId, (err, status) => {
        if (err) return handleError(err);
        console.log(status);
      });
    });
  });
});

// Solution: async/await — flat, readable, proper error handling
async function getShippingInfo(userId: string) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    const status = await getShippingStatus(details.trackingId);
    console.log(status);
  } catch (err) {
    handleError(err);
  }
}`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`callbacks`,`callback-hell`,`promises`,`async-await`,`code-quality`],commonMistakes:[`Recreating callback hell with Promises by nesting .then inside .then instead of chaining them flat.`,`Using async/await but wrapping everything in a new Promise unnecessarily (the Promise constructor anti-pattern).`,`Ignoring error handling when refactoring from callbacks — each approach has its own error propagation mechanism.`],followUps:[`What is the "inversion of control" problem with callbacks?`,`How do error-first callbacks work in Node.js?`,`Can you have "Promise hell"? How would it look?`],interviewTips:[`Show the before (callback hell) and after (async/await) side-by-side to demonstrate the readability improvement.`]},{id:`js-async-9`,question:`Predict the output: setTimeout vs Promise vs console.log`,answer:`The output is:

\`\`\`
Start
End
Promise 1
Promise 2
setTimeout 1
setTimeout 2
\`\`\`

This order follows from the event loop's priority system. First, all synchronous code on the call stack runs to completion: "Start" and "End" are logged. During this synchronous execution, setTimeout callbacks are registered as macrotasks in the task queue and Promise.resolve().then() callbacks are registered as microtasks in the microtask queue.

Once the call stack is empty, the event loop drains the entire microtask queue before processing any macrotask. "Promise 1" runs first (microtask), and during its execution no new microtasks are queued, so "Promise 2" runs next (it was already queued). After the microtask queue is empty, the event loop picks the first macrotask: "setTimeout 1". After that macrotask completes and the microtask queue is checked (it is empty), the next macrotask runs: "setTimeout 2".

The key insight is that the delay value of 0 in setTimeout does not mean "run immediately" — it means "add to the macrotask queue as soon as possible, but only after the minimum delay." Macrotasks always wait for all microtasks to complete before executing.`,shortAnswer:`Output: Start, End, Promise 1, Promise 2, setTimeout 1, setTimeout 2. Synchronous code runs first, then all microtasks (Promises) are drained, and finally macrotasks (setTimeout) execute in order.`,explanation:`Step 1: console.log("Start") executes synchronously → prints "Start".
Step 2: setTimeout(() => log("setTimeout 1"), 0) — registers callback as a macrotask. The 0ms delay means it is eligible immediately, but it goes to the macrotask queue, not the call stack.
Step 3: Promise.resolve().then(() => log("Promise 1")) — the Promise is already resolved, so the .then callback is immediately queued as a microtask.
Step 4: setTimeout(() => log("setTimeout 2"), 0) — another macrotask registered.
Step 5: Promise.resolve().then(() => log("Promise 2")) — another microtask queued.
Step 6: console.log("End") executes synchronously → prints "End".
Step 7: Call stack is now empty. Event loop checks the microtask queue.
Step 8: Microtask "Promise 1" is dequeued and executed → prints "Promise 1".
Step 9: Microtask "Promise 2" is dequeued and executed → prints "Promise 2".
Step 10: Microtask queue is empty. Event loop picks the first macrotask.
Step 11: Macrotask "setTimeout 1" executes → prints "setTimeout 1".
Step 12: Microtask queue checked (empty). Next macrotask picked.
Step 13: Macrotask "setTimeout 2" executes → prints "setTimeout 2".`,code:`console.log("Start");

setTimeout(() => {
  console.log("setTimeout 1");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
});

setTimeout(() => {
  console.log("setTimeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 2");
});

console.log("End");`,language:`javascript`,difficulty:`Intermediate`,type:`Scenario`,category:`JavaScript`,topicId:`js-async`,tags:[`event-loop`,`output-prediction`,`microtasks`,`macrotasks`,`setTimeout`],commonMistakes:[`Thinking setTimeout(fn, 0) runs before Promises because it was registered first — microtasks always have priority.`,`Expecting interleaved output (setTimeout 1, Promise 1, setTimeout 2, Promise 2) — all microtasks drain before any macrotask.`,`Forgetting that console.log("End") runs before any async callback because synchronous code always completes first.`],followUps:[`What would change if we used queueMicrotask instead of Promise.resolve().then?`,`What if one of the setTimeout calls had a delay of 1000ms?`],interviewTips:[`Narrate the execution order by categorizing each operation: synchronous, microtask, or macrotask — then process them in that priority order.`]},{id:`js-async-10`,question:`Predict the output: nested setTimeout and Promise`,answer:`The output is:

\`\`\`
1
7
2
3
5
4
6
\`\`\`

This question tests understanding of how microtasks enqueued inside macrotasks are handled and how nesting affects execution order.

First, all synchronous code runs: "1" and "7" are printed. During synchronous execution, a setTimeout (macrotask) and a Promise.then (microtask logging "2") are scheduled. The microtask queue is drained: "2" is printed. Inside that microtask, another microtask logging "3" is enqueued. The microtask queue is drained again: "3" is printed. Now the microtask queue is empty.

The event loop picks the first macrotask (the outer setTimeout). Inside it, "4" would be the last thing logged in this macrotask, but first a Promise.then logging "5" is scheduled (microtask) and a nested setTimeout logging "6" is scheduled (new macrotask). The synchronous part of the macrotask runs: "4" is not yet logged — actually, looking at the code structure, "5" is enqueued as a microtask, "6" is enqueued as a macrotask, and then "4" is logged synchronously. After the macrotask's synchronous code completes, the microtask queue is drained: "5" is printed. Then the next macrotask (the nested setTimeout) runs: "6" is printed.`,shortAnswer:`Output: 1, 7, 2, 3, 5, 4, 6. Synchronous code first (1, 7), then microtasks drain (2, then 3 which was enqueued by 2), then the macrotask runs logging 4 with its microtask 5 draining before the nested macrotask 6 runs.`,explanation:`Step 1: console.log(1) → prints "1" (synchronous).
Step 2: setTimeout callback [logs 4, enqueues Promise for 5, enqueues setTimeout for 6] registered as Macrotask A.
Step 3: Promise.resolve().then [logs 2, enqueues Promise for 3] registered as Microtask A.
Step 4: console.log(7) → prints "7" (synchronous).
Step 5: Call stack empty. Drain microtask queue.
Step 6: Microtask A runs → prints "2". Enqueues Microtask B (logs 3).
Step 7: Microtask B runs → prints "3". Microtask queue now empty.
Step 8: Event loop picks Macrotask A (outer setTimeout).
Step 9: Inside Macrotask A: Promise.resolve().then [logs 5] enqueued as Microtask C.
Step 10: Inside Macrotask A: setTimeout [logs 6] enqueued as Macrotask B.
Step 11: Inside Macrotask A: console.log(4) → prints "4" (synchronous part of macrotask).
Step 12: Macrotask A completes. Drain microtask queue.
Step 13: Microtask C runs → prints "5". Microtask queue now empty.
Step 14: Event loop picks Macrotask B (nested setTimeout).
Step 15: console.log(6) → prints "6".
Final output: 1, 7, 2, 3, 4, 5, 6.`,code:`console.log(1);

setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(5);
  });
  setTimeout(() => {
    console.log(6);
  }, 0);
  console.log(4);
}, 0);

Promise.resolve().then(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
  });
});

console.log(7);`,language:`javascript`,difficulty:`Advanced`,type:`Scenario`,category:`JavaScript`,topicId:`js-async`,tags:[`event-loop`,`output-prediction`,`nested-async`,`microtasks`,`macrotasks`],commonMistakes:[`Forgetting that microtasks enqueued inside a microtask run before the next macrotask — the microtask queue is always fully drained.`,`Not recognizing that code inside setTimeout is a new macrotask context with its own microtask drainage cycle.`,`Getting confused by the nesting and losing track of which queue each callback belongs to.`],followUps:[`What would the output be if you added another Promise.resolve().then inside the nested setTimeout?`,`How would the output change if process.nextTick were used instead of Promise.resolve().then in Node.js?`],interviewTips:[`Label each operation with its queue (sync, microtask, macrotask) and process them in the correct priority order within each event loop cycle.`]},{id:`js-async-11`,question:`How does the browser's event loop differ from Node.js?`,answer:`The browser and Node.js both implement the event loop concept but with significant architectural differences. The browser's event loop follows the HTML specification and has a relatively simple model: one call stack, one microtask queue, and one or more macrotask queues (browsers may prioritize certain task sources like user interactions over timers). Between macrotask executions, the browser may also run rendering steps (requestAnimationFrame, style calculation, layout, paint).

Node.js uses libuv as its event loop implementation, which divides each iteration into distinct phases: timers (setTimeout/setInterval callbacks), pending callbacks (deferred I/O callbacks), idle/prepare (internal), poll (retrieve new I/O events and execute their callbacks), check (setImmediate callbacks), and close callbacks (socket.on('close')). Each phase has its own FIFO queue, and the event loop processes all callbacks in the current phase's queue before moving to the next phase.

Node.js also has process.nextTick, which is unique to Node and runs before any other microtask (including Promise callbacks). This creates a priority hierarchy: synchronous code > process.nextTick > Promise microtasks > macrotasks. The setImmediate function in Node.js runs in the check phase, after the poll phase, which gives it different timing characteristics than setTimeout(fn, 0). The order between setTimeout(fn, 0) and setImmediate is actually non-deterministic when called from the main module, but setImmediate always runs first when called from within an I/O callback.

In practice, the main difference developers encounter is that Node.js provides more fine-grained control over scheduling through process.nextTick and setImmediate, while the browser provides requestAnimationFrame for rendering-synchronized work. Both environments process microtasks between macrotasks, but the internal phase structure of Node's event loop can produce different timing behavior for complex async patterns.`,shortAnswer:`The browser's event loop follows the HTML spec with a simple microtask/macrotask model plus rendering steps. Node.js uses libuv with multiple phases (timers, poll, check, close) and adds process.nextTick (higher priority than Promise microtasks) and setImmediate (runs in the check phase).`,code:`// Node.js specific behavior

// process.nextTick runs before Promise microtasks
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("Promise"));
// Output: nextTick, Promise

// setImmediate vs setTimeout(fn, 0)
// Order is non-deterministic from main module:
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
// Could be either order!

// But inside I/O callback, setImmediate always runs first:
const fs = require("fs");
fs.readFile(__filename, () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
  // Always: immediate, timeout
});`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`event-loop`,`nodejs`,`browser`,`libuv`,`process-nextTick`,`setImmediate`],commonMistakes:[`Assuming setTimeout(fn, 0) and setImmediate always execute in a fixed order — the order is non-deterministic from the main module in Node.js.`,`Using process.nextTick in the browser — it does not exist in browser environments.`,`Thinking the browser event loop has phases like Node.js — it uses a simpler microtask/macrotask model.`],followUps:[`Why can recursive process.nextTick calls starve I/O in Node.js?`,`How does the poll phase in Node.js decide when to move on?`,`What are Worker Threads in Node.js and how do they relate to the event loop?`],interviewTips:[`Mention the practical implications: knowing the difference helps debug timing issues in isomorphic/universal JavaScript applications.`]},{id:`js-async-12`,question:`What happens when you await a non-Promise value?`,answer:`When you use await on a non-Promise value (such as a number, string, object, or any other non-thenable), JavaScript automatically wraps it in Promise.resolve(). The await expression then resolves immediately with that value on the next microtask tick. This means that even though the value is available synchronously, the code after the await is still deferred to the microtask queue.

This behavior has important implications for execution order. Consider \`async function foo() { const x = await 42; console.log(x); }\`. When foo() is called, everything up to the first await runs synchronously. The value 42 is wrapped in Promise.resolve(42), and the rest of the function (console.log(x)) is scheduled as a microtask. Control returns to the caller immediately. On the next microtask drain, the function resumes and logs 42.

This wrapping behavior also applies to thenables — objects with a .then method that are not actual Promise instances. If you await a thenable, JavaScript calls its .then method with resolve and reject callbacks, treating it as a Promise-like object. This interoperability allows async/await to work seamlessly with third-party Promise libraries and any object implementing the thenable protocol.

From a performance perspective, awaiting a non-Promise value is essentially a no-op that adds an unnecessary microtask tick. In hot code paths, this can accumulate. However, the semantic guarantee of consistent asynchronous behavior (the function always yields at await, regardless of the value type) is usually more valuable than the marginal performance cost. Some JavaScript engines optimize this case to minimize overhead.`,shortAnswer:`When you await a non-Promise value, JavaScript wraps it in Promise.resolve(), making the code after await run as a microtask on the next tick. The value resolves immediately, but execution still yields to the caller before resuming. This ensures consistent async behavior regardless of the value type.`,code:`async function example() {
  console.log("Before await");
  const result = await 42; // Wrapped in Promise.resolve(42)
  console.log("After await:", result); // Runs as microtask
}

console.log("Start");
example();
console.log("End");

// Output:
// Start
// Before await
// End
// After await: 42

// Thenable example
const thenable = {
  then(resolve: (value: string) => void) {
    console.log("thenable.then called");
    resolve("thenable result");
  },
};

async function awaitThenable() {
  const val = await thenable;
  console.log(val); // "thenable result"
}

awaitThenable();`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`async-await`,`promises`,`thenable`,`microtasks`],commonMistakes:[`Assuming that await on a non-Promise value is completely synchronous — it still yields to the caller and resumes on the next microtask tick.`,`Not knowing about thenable support — any object with a .then method can be awaited.`,`Overusing await on synchronous values when it adds unnecessary microtask overhead in performance-critical code.`],followUps:[`What happens if a thenable's .then method throws synchronously?`,`Is there a performance difference between returning a value and returning Promise.resolve(value) in an async function?`],interviewTips:[`Demonstrate understanding by showing that code after await always runs asynchronously, even when the awaited value is synchronous — this shows deep knowledge of the async function mechanics.`]},{id:`js-async-13`,question:`How do you handle errors in async/await?`,answer:`Error handling in async/await primarily uses try/catch blocks, which map naturally to synchronous error handling patterns. When an awaited Promise rejects, the await expression throws the rejection reason as an exception, which can be caught by a surrounding try/catch. This is one of the major ergonomic improvements over .catch chains, as it uses the same error handling mechanism developers are already familiar with from synchronous code.

For granular error handling, you can wrap individual await expressions in their own try/catch blocks to handle specific failures differently. For coarse-grained handling, a single try/catch around multiple await expressions catches the first failure. You can also combine both: wrap a section of related operations in one try/catch and handle specific critical operations individually. The finally block works as expected, running cleanup code regardless of success or failure.

An alternative pattern avoids try/catch entirely by using a utility wrapper that returns a tuple of [error, result]. This is inspired by Go's error handling and avoids the nesting that try/catch introduces. Another approach is to add .catch directly to the Promise before awaiting it: \`const result = await fetchData().catch(err => defaultValue)\`. This is useful for providing fallback values without full try/catch blocks.

Common pitfalls include forgetting to handle errors at all (unhandled rejections crash Node.js processes), catching errors too broadly (swallowing unexpected errors), and not re-throwing errors when you only want to log them. In production code, you should always have a top-level error handler and use specific error types to distinguish between expected failures (API returns 404) and unexpected bugs (TypeError). The unhandledrejection event (browser) and process.on("unhandledRejection") (Node.js) serve as safety nets for uncaught async errors.`,shortAnswer:`Use try/catch blocks around await expressions to catch rejected Promises. Use finally for cleanup. Alternative patterns include tuple-style [error, result] wrappers and inline .catch for fallback values. Always handle unhandled rejections globally as a safety net.`,code:`// Standard try/catch
async function fetchUser(id: string) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Network error:", error.message);
    } else if (error instanceof Error) {
      console.error("Fetch error:", error.message);
    }
    return null;
  } finally {
    console.log("Fetch attempt completed");
  }
}

// Tuple-style error handling (Go-inspired)
type Result<T> = [Error, null] | [null, T];

async function tryCatch<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null];
  }
}

async function loadDashboard() {
  const [userErr, user] = await tryCatch(fetchUser("123"));
  if (userErr) {
    console.error("Failed to load user:", userErr.message);
    return;
  }

  const [postsErr, posts] = await tryCatch(fetchPosts(user.id));
  if (postsErr) {
    console.error("Failed to load posts:", postsErr.message);
  }
}

// Inline .catch for fallback values
async function getUserWithFallback(id: string) {
  const user = await fetchUser(id).catch(() => ({ name: "Guest" }));
  return user;
}`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`JavaScript`,topicId:`js-async`,tags:[`error-handling`,`async-await`,`try-catch`,`promises`],commonMistakes:[`Catching errors too broadly without distinguishing between expected failures and bugs — use instanceof checks or custom error classes.`,`Forgetting to add error handling entirely, leading to unhandled promise rejections that crash the Node.js process.`,`Catching and silently swallowing errors without logging or re-throwing, making bugs invisible.`],followUps:[`How does the unhandledrejection event work in browsers?`,`What is the difference between throwing in an async function and calling reject in a Promise constructor?`,`How do you handle errors when using Promise.all with async/await?`],interviewTips:[`Show multiple error handling strategies and explain when each is appropriate — this demonstrates practical experience.`,`Mention the global unhandled rejection handlers as a safety net to show production awareness.`]},{id:`js-async-14`,question:`What are Web APIs and how do they interact with the event loop?`,answer:`Web APIs are interfaces provided by the browser (not the JavaScript engine itself) that handle operations which would otherwise block the single-threaded JavaScript runtime. They include the DOM API, fetch/XMLHttpRequest, setTimeout/setInterval, geolocation, Web Storage, Canvas, Web Workers, and many more. These APIs run outside the JavaScript call stack, often in separate threads managed by the browser, and communicate results back to JavaScript through the event loop's callback queues.

The interaction works as follows: when JavaScript calls a Web API function like setTimeout or fetch, the call is handed off to the browser's internal implementation. The JavaScript call stack does not wait — the function call returns immediately, and JavaScript continues executing the next line of code. The browser handles the actual work (waiting for the timer, making the HTTP request, etc.) in the background. When the work is complete, the browser places the associated callback into the appropriate queue: macrotask queue for setTimeout/setInterval/I/O callbacks, or microtask queue for Promise-based APIs like fetch.

This architecture is what enables JavaScript's non-blocking behavior. Without Web APIs, JavaScript would have to block on every I/O operation, timer, or network request, freezing the UI completely. Instead, the Web APIs act as a bridge between the single-threaded JavaScript world and the multi-threaded browser environment. For example, when you call fetch(), the browser's network stack (running on a separate thread) handles the HTTP request while your JavaScript code continues executing. When the response arrives, the browser wraps it in a Response object and resolves the Promise, placing the .then callback in the microtask queue.

In Node.js, the equivalent of Web APIs is provided by libuv and the C++ bindings, which handle file system operations, DNS lookups, networking, and child processes. The principle is the same: offload blocking work to the system and notify JavaScript through callbacks and the event loop.`,shortAnswer:`Web APIs are browser-provided interfaces (setTimeout, fetch, DOM, etc.) that run outside the JS call stack, often on separate threads. They offload async work and place callbacks into the event loop queues when complete, enabling non-blocking I/O in single-threaded JavaScript.`,code:`// How Web APIs interact with the event loop:

console.log("1. Synchronous - runs on call stack");

// setTimeout: handed off to the Timer Web API
setTimeout(() => {
  console.log("4. Timer Web API completed - callback from macrotask queue");
}, 1000);

// fetch: handed off to the Network Web API
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => {
    console.log("3. Network Web API completed - callback from microtask queue");
  });

// DOM event: handled by the DOM Web API
document.addEventListener("click", () => {
  console.log("User clicked - event callback from macrotask queue");
});

console.log("2. Synchronous - still on call stack");

// Flow:
// 1. JS engine executes synchronous code on the call stack
// 2. Async calls are delegated to Web APIs (browser threads)
// 3. Web APIs do the work (timer counting, HTTP request, etc.)
// 4. When done, Web APIs enqueue callbacks into the appropriate queue
// 5. Event loop moves callbacks to the call stack when it is empty`,language:`javascript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`web-apis`,`event-loop`,`browser`,`non-blocking`,`async`],commonMistakes:[`Thinking setTimeout is part of the JavaScript language — it is a Web API provided by the browser or global API in Node.js, not defined in the ECMAScript specification.`,`Assuming Web APIs run on the same thread as JavaScript — most Web APIs use separate browser threads for actual work.`,`Confusing Web APIs with Web Workers — Web APIs are built-in browser interfaces, while Web Workers are user-created threads for running JavaScript code in parallel.`],followUps:[`What is the difference between Web APIs and Web Workers?`,`How does the Intersection Observer API use the event loop?`,`Can you access the DOM from a Web Worker?`],interviewTips:[`Draw the complete diagram showing the call stack, Web APIs box, microtask queue, and macrotask queue with arrows showing the flow to demonstrate how all pieces fit together.`]},{id:`js-async-15`,question:`Explain the difference between synchronous and asynchronous code.`,answer:`Synchronous code executes sequentially, one statement at a time, in the order it appears. Each operation must complete before the next one begins. The call stack processes each function call to completion before moving on. This is the default execution model of JavaScript — when you write \`const x = 1 + 2; console.log(x);\`, the addition completes before console.log runs. If a synchronous operation takes a long time (e.g., a complex calculation or a blocking I/O call), the entire program halts until it finishes, including UI rendering and event handling.

Asynchronous code allows operations to be initiated and then set aside while the program continues executing other code. When the async operation completes (a timer expires, a network response arrives, a file is read), a callback is placed in the event loop's queue and eventually executed when the call stack is free. This non-blocking behavior is essential for responsive applications — without it, a single network request could freeze a web page for seconds.

The key trade-off is between simplicity and responsiveness. Synchronous code is easier to reason about because execution order matches code order. Asynchronous code is harder to follow — the code that initiates an operation and the code that handles its result are separated in time and often in location. JavaScript has evolved its async patterns over time to make this easier: from callbacks (simple but nesting-prone) to Promises (composable and chainable) to async/await (reads like synchronous code but executes asynchronously).

In practice, you use synchronous code for computations, data transformations, and operations that are fast enough to not block the main thread. You use asynchronous code for I/O operations (network requests, file access, database queries), timers, user interaction handlers, and any operation that would block the main thread for a perceptible amount of time. Modern best practice is to keep synchronous work on the main thread short (under 50ms per task) and offload heavy computation to Web Workers.`,shortAnswer:`Synchronous code executes sequentially, blocking until each operation completes. Asynchronous code initiates operations and continues execution, handling results later via callbacks, Promises, or async/await. Sync is simpler to reason about; async is essential for non-blocking I/O and responsive UIs.`,code:`// Synchronous: blocks until complete
function syncOperation() {
  console.log("Step 1");
  const data = heavyComputation(); // Blocks here until done
  console.log("Step 2:", data);     // Runs only after computation
  console.log("Step 3");
}
// Output: Step 1, Step 2: <result>, Step 3 (in exact order)

// Asynchronous: non-blocking
async function asyncOperation() {
  console.log("Step 1");
  const dataPromise = fetch("/api/data"); // Initiates request, doesn't block
  console.log("Step 2: request sent");     // Runs immediately
  const response = await dataPromise;      // Yields until response arrives
  const data = await response.json();
  console.log("Step 3:", data);            // Runs after data arrives
}

// Demonstrating blocking vs non-blocking
console.log("Before sync");
for (let i = 0; i < 1e9; i++) {} // Blocks the entire thread
console.log("After sync — UI was frozen during the loop");

console.log("Before async");
setTimeout(() => console.log("After async — UI remained responsive"), 1000);
console.log("Continues immediately");`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-async`,tags:[`synchronous`,`asynchronous`,`blocking`,`non-blocking`,`fundamentals`],commonMistakes:[`Thinking asynchronous means parallel — JavaScript is still single-threaded; async code runs on the same thread, just at a later time.`,`Using synchronous file I/O (like fs.readFileSync in Node.js) in server request handlers, blocking all concurrent connections.`,`Assuming async/await makes code synchronous — it makes async code look synchronous but the execution is still non-blocking under the hood.`],followUps:[`When would you intentionally use synchronous code over asynchronous?`,`How do Web Workers provide true parallelism in JavaScript?`,`What is the 50ms budget rule for main thread tasks?`],interviewTips:[`Frame the answer around the user experience impact — synchronous blocking freezes the UI, while async keeps it responsive.`]},{id:`js-async-16`,question:`Predict the output: async function execution order with await`,answer:`The output is:

\`\`\`
start
async1 start
async2
end
async1 end
setTimeout
\`\`\`

This question tests how async functions interact with the synchronous call stack, microtask queue, and macrotask queue. The critical insight is that code before the first await in an async function runs synchronously, and code after await is scheduled as a microtask.

First, "start" is logged synchronously. Then async1() is called. Inside async1, "async1 start" is logged synchronously. Then \`await async2()\` is encountered: async2() is called, which logs "async2" synchronously. Since async2 is an async function with no await, it returns a resolved Promise. The await in async1 sees this resolved Promise and schedules the rest of async1 (logging "async1 end") as a microtask. Control returns to the main script. setTimeout is registered as a macrotask. "end" is logged synchronously. The call stack is now empty. The microtask queue is drained: "async1 end" is printed. Finally, the macrotask runs: "setTimeout" is printed.`,shortAnswer:`Output: start, async1 start, async2, end, async1 end, setTimeout. Code before await runs synchronously. The await suspends the async function and schedules the remainder as a microtask. Synchronous code in the caller runs next, then microtasks, then macrotasks.`,explanation:`Step 1: console.log("start") → prints "start" (synchronous).
Step 2: async1() is called. Execution enters async1.
Step 3: Inside async1, console.log("async1 start") → prints "async1 start" (synchronous, before any await).
Step 4: \`await async2()\` — first, async2() is called synchronously.
Step 5: Inside async2, console.log("async2") → prints "async2" (synchronous).
Step 6: async2 returns a resolved Promise (async functions always return Promises).
Step 7: The await in async1 receives the resolved Promise. It schedules the remainder of async1 (console.log("async1 end")) as a microtask. async1 suspends and returns its pending Promise to the caller.
Step 8: Back in the main script, setTimeout is registered with the browser Timer API as a macrotask.
Step 9: console.log("end") → prints "end" (synchronous).
Step 10: Call stack is empty. Event loop drains the microtask queue.
Step 11: The async1 continuation microtask runs → prints "async1 end".
Step 12: Microtask queue is empty. Event loop picks the macrotask.
Step 13: setTimeout callback runs → prints "setTimeout".`,code:`async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("start");

async1();

setTimeout(() => {
  console.log("setTimeout");
}, 0);

console.log("end");`,language:`javascript`,difficulty:`Advanced`,type:`Scenario`,category:`JavaScript`,topicId:`js-async`,tags:[`async-await`,`output-prediction`,`event-loop`,`microtasks`],commonMistakes:[`Thinking the entire async function body is asynchronous — code before the first await runs synchronously.`,`Expecting "async1 end" to print immediately after "async2" — the await suspends the function and yields control.`,`Placing "setTimeout" before "async1 end" in the output — microtasks (async function continuations) always run before macrotasks.`],followUps:[`What would change if async2 had an await inside it?`,`What if we called async1() without the outer function being async — does it still work?`],interviewTips:[`Clearly state the rule: everything before the first await in an async function is synchronous; everything after is a microtask. This single rule resolves most async/await output prediction questions.`]},{id:`js-async-17`,question:`How do you implement a retry mechanism with exponential backoff using async/await?`,answer:`A retry mechanism with exponential backoff is a resilience pattern where failed async operations are retried with increasing delays between attempts. The delay typically doubles with each retry (exponential growth) and often includes random jitter to prevent multiple clients from retrying simultaneously (thundering herd problem). This pattern is essential for handling transient failures in network requests, API calls, and distributed systems.

The implementation combines async/await with a loop and a delay function. The core structure is a for loop that attempts the operation, catches failures, calculates the next delay using the formula \`baseDelay * 2^attempt + randomJitter\`, waits for that duration, and retries. After exhausting all retries, the function throws the last error. The delay is implemented with a simple Promise-wrapped setTimeout.

Key design decisions include: maximum number of retries (typically 3-5), base delay (100ms-1000ms), maximum delay cap (to prevent extremely long waits), jitter strategy (full jitter, equal jitter, or decorrelated jitter), and which errors are retryable (network errors and 5xx responses are retryable; 4xx errors usually are not). A well-designed retry function accepts these parameters and includes a predicate function that determines whether a specific error should trigger a retry.

In production systems, this pattern is often combined with circuit breakers (stop retrying after too many failures across all calls, not just one), idempotency keys (ensure retried mutations don't create duplicates), and observability (log retry attempts with backoff durations for monitoring). Libraries like axios-retry, p-retry, and cockatiel provide battle-tested implementations with these features built in.`,shortAnswer:"Implement a loop that catches errors, calculates delay as `baseDelay * 2^attempt + jitter`, waits using a Promise-wrapped setTimeout, and retries. Cap maximum delay, limit retry count, and use a predicate to determine which errors are retryable. Add jitter to prevent thundering herd problems.",code:`function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  shouldRetry?: (error: Error) => boolean;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    baseDelay,
    maxDelay,
    shouldRetry = () => true,
  } = options;

  let lastError: Error = new Error("No attempts made");

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError;
      }

      const jitter = Math.random() * baseDelay;
      const backoff = Math.min(
        baseDelay * Math.pow(2, attempt) + jitter,
        maxDelay
      );

      console.log(
        \`Attempt \${attempt + 1} failed. Retrying in \${Math.round(backoff)}ms...\`
      );
      await delay(backoff);
    }
  }

  throw lastError;
}

// Usage
const data = await withRetry(
  () => fetch("/api/data").then((r) => {
    if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
    return r.json();
  }),
  {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    shouldRetry: (err) => !err.message.includes("HTTP 4"),
  }
);`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`JavaScript`,topicId:`js-async`,tags:[`async-await`,`retry`,`exponential-backoff`,`error-handling`,`resilience`],commonMistakes:[`Not including jitter in the backoff calculation, causing synchronized retry storms across multiple clients.`,`Retrying non-retryable errors like authentication failures (401) or validation errors (400).`,`Not capping the maximum delay, allowing exponential growth to produce extremely long waits.`],followUps:[`What is the thundering herd problem and how does jitter solve it?`,`How does a circuit breaker pattern complement retry logic?`,`What is an idempotency key and why is it important for retried mutations?`],interviewTips:[`Mention jitter unprompted to show awareness of distributed systems concerns — it signals senior-level thinking.`]},{id:`js-async-18`,question:`Predict the output: Promise.resolve chains with mixed sync and async handlers`,answer:`The output is:

\`\`\`
1
2
5
3
4
\`\`\`

This demonstrates how Promise.resolve().then() chains interact with synchronous code and nested microtasks.

First, all synchronous code executes: "1" is logged, the Promise chain and setTimeout are registered, and "5" is logged. The Promise.resolve() creates an already-resolved Promise. Its first .then (logging "2") is enqueued as Microtask A. During that registration, the second .then (logging "3") cannot be enqueued yet because it depends on the Promise returned by the first .then.

After the call stack clears, the event loop drains the microtask queue. Microtask A runs, logging "2". This resolves the Promise returned by the first .then, which causes the second .then callback (logging "3") to be enqueued as Microtask B. Additionally, inside the first .then, a new Promise.resolve().then (logging "4") is enqueued as Microtask C, but "4" is from the nested chain which is a separate Promise from the outer chain.

Wait — looking at the code more carefully, the nested Promise.resolve().then(() => console.log(4)) is independent. So after "2" is logged, both the chained .then (logging "3") and the nested .then (logging "4") become microtasks. The chain's .then is Microtask B, and the nested .then is Microtask C. However, the chained .then("3") resolves from the previous .then in the chain, while the nested .then("4") is a new independent microtask. Since "3" is the continuation of the same chain that just resolved and "4" is from a new Promise.resolve inside the handler, both are enqueued in order. Microtask B ("3") runs, then Microtask C ("4") runs.`,shortAnswer:`Output: 1, 5, 2, 3, 4. Synchronous code (1, 5) runs first. Then microtasks drain: "2" from the first .then, then "3" from the chained .then, and then "4" from the nested Promise.resolve inside the first .then handler.`,explanation:`Step 1: console.log(1) → prints "1" (synchronous).
Step 2: Promise.resolve().then(() => { log(2); Promise.resolve().then(() => log(4)); }).then(() => log(3)) — the first .then callback is enqueued as Microtask A. The second .then cannot enqueue yet (depends on Microtask A resolving).
Step 3: console.log(5) → prints "5" (synchronous).
Step 4: Call stack is empty. Drain microtask queue.
Step 5: Microtask A runs → prints "2". Inside this handler, Promise.resolve().then(() => log(4)) enqueues Microtask C (log 4). Microtask A's handler returns undefined, resolving the Promise from the first .then, which enqueues Microtask B (log 3).
Step 6: Continue draining microtasks. Microtask B (log 3) was enqueued before Microtask C? Actually both were enqueued during step 5. The .then("3") depends on Microtask A's return Promise resolving. The nested Promise.resolve().then("4") is independent. Both are enqueued during step 5. The order depends on implementation — in practice, the chained .then("3") resolves via an extra microtask tick for the implicit Promise wrapping of the return value. So "4" may print before "3".
Step 7: Microtask C runs → prints "3" (chained .then callback). Wait, let me re-analyze: After logging "2", the return value (undefined) resolves the chained Promise, enqueuing the .then(() => log(3)) callback. But the nested Promise.resolve().then(() => log(4)) is also enqueued. The chain callback for "3" and the nested callback for "4" — "3" is enqueued as a result of the outer .then resolving, and "4" is from an already-resolved Promise. Both happen in the same microtask tick, so the order is: "3" then "4".
Final output: 1, 5, 2, 3, 4.`,code:`console.log(1);

Promise.resolve()
  .then(() => {
    console.log(2);
    Promise.resolve().then(() => {
      console.log(4);
    });
  })
  .then(() => {
    console.log(3);
  });

console.log(5);

// Output:
// 1
// 5
// 2
// 4
// 3`,language:`javascript`,difficulty:`Senior`,type:`Scenario`,category:`JavaScript`,topicId:`js-async`,tags:[`promises`,`output-prediction`,`microtasks`,`event-loop`,`chaining`],commonMistakes:[`Expecting "3" before "4" — the nested Promise.resolve().then enqueues its callback immediately, while the chained .then waits for an extra microtask tick to resolve the intermediate Promise.`,`Forgetting that chained .then handlers depend on the previous .then's return Promise resolving, which adds an implicit microtask tick.`,`Not distinguishing between nested (independent) and chained (dependent) .then handlers.`],followUps:[`How would the output change if the inner handler returned the nested Promise instead of not returning it?`,`What happens if you add an await before the nested Promise.resolve()?`],interviewTips:[`For complex promise ordering questions, label each microtask and track when each is enqueued vs when it executes — this systematic approach prevents mistakes.`]}]}],i=[{id:`js-oop`,title:`OOP in JavaScript`,description:`Object-Oriented Programming concepts in JavaScript including prototypal inheritance, prototype chain, constructor functions, ES6 classes, and the this keyword.`,category:`JavaScript`,difficulty:`Intermediate`,tags:[`OOP`,`prototype`,`classes`,`inheritance`,`this`,`call`,`apply`,`bind`,`constructor`],overview:`JavaScript uses a prototype-based object-oriented model rather than the classical class-based model found in languages like Java or C++. Every object in JavaScript has an internal link to another object called its prototype, forming a chain that enables property inheritance. ES6 introduced class syntax as syntactic sugar over this prototype mechanism, making OOP patterns more familiar to developers from classical backgrounds while the underlying mechanics remain prototypal.`,concepts:[`Prototypal inheritance`,`Prototype chain`,`Constructor functions`,`ES6 classes`,`The new operator`,`this keyword binding rules`,`call, apply, and bind`,`Class inheritance with extends`,`Encapsulation with private fields`,`Polymorphism`,`__proto__ vs prototype`,`Object.create`,`super keyword`,`Static methods and properties`],relatedTopicIds:[`js-functions`,`js-types`,`js-engine`],questions:[{id:`js-oop-1`,question:`Explain prototypal inheritance in JavaScript.`,answer:`Prototypal inheritance is JavaScript's native mechanism for sharing properties and methods between objects. Unlike classical inheritance where classes inherit from other classes, prototypal inheritance works directly with objects—an object can inherit from another object. Every JavaScript object has an internal [[Prototype]] link (accessible via Object.getPrototypeOf() or the __proto__ property) that points to another object, from which it inherits properties.

When you access a property on an object, JavaScript first looks for the property on the object itself. If it doesn't find it, the engine follows the [[Prototype]] link to the prototype object and looks there. This process continues up the chain until the property is found or the chain ends at null (the prototype of Object.prototype). This delegation mechanism means objects don't need to own all their properties—they can inherit shared behavior from prototypes.

You can set up prototypal inheritance in several ways. Object.create(proto) creates a new object with proto as its prototype. Constructor functions combined with the new keyword set the new object's prototype to the constructor's prototype property. ES6 classes use the extends keyword to establish prototype chains. The key insight is that all these approaches ultimately set up the same [[Prototype]] chain.

Prototypal inheritance is more flexible than classical inheritance because it allows objects to inherit directly from other objects without an intermediary class definition. You can create one-off objects with specific prototypes, change an object's prototype at runtime (though this is not recommended for performance reasons), and mix in properties from multiple sources. This flexibility is both a strength and a potential source of confusion, which is why ES6 classes were introduced to provide a more structured syntax.`,shortAnswer:`Prototypal inheritance allows objects to inherit properties and methods from other objects through an internal [[Prototype]] link. When a property isn't found on an object, JavaScript looks up the prototype chain. This differs from classical inheritance because objects inherit directly from other objects, not from classes.`,code:`// Setting up prototypal inheritance

// 1. Object.create
const animal = {
  speak() {
    console.log(this.name + " makes a sound.");
  }
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.bark = function() {
  console.log(this.name + " barks!");
};

dog.speak(); // "Rex makes a sound." (inherited from animal)
dog.bark();  // "Rex barks!" (own method)

// 2. Constructor functions
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(this.name + " makes a sound.");
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() {
  console.log(this.name + " barks!");
};

const rex = new Dog("Rex", "Shepherd");
rex.speak(); // "Rex makes a sound." (inherited)
rex.bark();  // "Rex barks!" (own)

// 3. ES6 classes (syntactic sugar)
class AnimalClass {
  constructor(name) { this.name = name; }
  speak() { console.log(this.name + " makes a sound."); }
}

class DogClass extends AnimalClass {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  bark() { console.log(this.name + " barks!"); }
}`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`prototypal inheritance`,`prototype`,`Object.create`],commonMistakes:[`Confusing prototypal inheritance with classical inheritance—JavaScript doesn't have true classes, ES6 classes are syntactic sugar`,`Forgetting to set constructor property when manually linking prototypes (Dog.prototype.constructor = Dog)`,`Using __proto__ directly in production code instead of Object.getPrototypeOf/Object.setPrototypeOf`],followUps:[`How does Object.create() differ from using the new keyword?`,`What happens when you modify a prototype after objects have been created from it?`,`Can you explain differential inheritance?`],interviewTips:[`Start by explaining that JavaScript is prototype-based, not class-based, then show how ES6 classes map to prototypes`,`Drawing the prototype chain diagram can be very helpful for explaining inheritance visually`],relatedTopics:[`Prototype Chain`,`ES6 Classes`,`Object.create`]},{id:`js-oop-2`,question:`How does the prototype chain work?`,answer:'The prototype chain is the mechanism JavaScript uses to resolve property lookups through a linked list of objects. Every object has an internal [[Prototype]] reference (often called its "proto") that points to another object. When you access a property on an object, the engine first searches the object\'s own properties. If the property is not found, the engine follows the [[Prototype]] link to the next object in the chain and searches there. This process repeats up the chain until the property is found or the chain terminates at null.\n\nThe chain typically ends at Object.prototype, which is the prototype of most objects. Object.prototype itself has a [[Prototype]] of null, forming the end of every prototype chain. For example, when you create a plain object `const obj = {}`, its chain is: obj → Object.prototype → null. For an array `const arr = []`, the chain is: arr → Array.prototype → Object.prototype → null. This is why arrays have access to both Array methods (push, map) and Object methods (toString, hasOwnProperty).\n\nProperty writes behave differently from reads. When you write a property (e.g., `obj.x = 5`), JavaScript always creates or updates the property directly on the target object—it does not traverse the prototype chain. This is called "shadowing": if a prototype has a property `x` and you set `obj.x`, the object gets its own `x` that shadows the prototype\'s `x`. This is important because modifying a property on an instance doesn\'t affect the prototype or other objects that share it.\n\nThe hasOwnProperty() method (or Object.hasOwn() in modern JS) checks whether a property belongs to the object itself rather than being inherited from the prototype chain. The for...in loop iterates over both own and inherited enumerable properties, which is why Object.keys() (own properties only) is often preferred. Understanding the prototype chain is essential for debugging unexpected property values and for designing effective object hierarchies.',shortAnswer:`The prototype chain is a linked sequence of objects used for property lookup. When a property isn't found on an object, JavaScript follows the [[Prototype]] link to the next object, continuing until the property is found or the chain ends at null. Property writes always occur on the object itself (shadowing), while reads traverse the chain.`,code:`// Prototype chain visualization
const grandparent = { family: "Smith", greet() { return "Hello!"; } };
const parent = Object.create(grandparent);
parent.name = "John";
const child = Object.create(parent);
child.age = 10;

// Chain: child → parent → grandparent → Object.prototype → null

console.log(child.age);    // 10 (own property)
console.log(child.name);   // "John" (from parent)
console.log(child.family); // "Smith" (from grandparent)
console.log(child.greet());// "Hello!" (from grandparent)
console.log(child.toString()); // "[object Object]" (from Object.prototype)

// Property shadowing
child.name = "Junior";
console.log(child.name);   // "Junior" (own, shadows parent.name)
console.log(parent.name);  // "John" (unchanged)

// Checking own vs inherited properties
console.log(child.hasOwnProperty("age"));    // true
console.log(child.hasOwnProperty("name"));   // true (shadowed)
console.log(child.hasOwnProperty("family")); // false (inherited)

// Modern alternative
console.log(Object.hasOwn(child, "age"));    // true
console.log(Object.hasOwn(child, "family")); // false

// Array prototype chain:
const arr = [1, 2, 3];
// arr → Array.prototype → Object.prototype → null
console.log(arr.push);       // from Array.prototype
console.log(arr.hasOwnProperty); // from Object.prototype

// Traversing the chain manually:
let proto = Object.getPrototypeOf(child);
while (proto !== null) {
  console.log(proto);
  proto = Object.getPrototypeOf(proto);
}
// parent → grandparent → Object.prototype`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`prototype chain`,`property lookup`,`inheritance`],commonMistakes:[`Thinking property writes traverse the prototype chain—they always write to the target object`,`Using for...in without hasOwnProperty check, accidentally iterating inherited properties`,`Confusing Object.getPrototypeOf(obj) with obj.prototype—the latter is a property on constructor functions, not on instances`],followUps:[`What is the performance impact of long prototype chains?`,`How does property shadowing work with getters and setters on the prototype?`,`What happens if you set Object.prototype to null?`],interviewTips:[`Sketch the chain diagram: object → proto → proto → ... → null`,`Highlight that reads traverse up the chain but writes always happen on the object itself`],relatedTopics:[`Prototypal Inheritance`,`Property Lookup`,`hasOwnProperty`]},{id:`js-oop-3`,question:`What are constructor functions and how do they work?`,answer:`Constructor functions are regular JavaScript functions that are designed to be called with the new keyword to create and initialize objects. By convention, constructor functions are named with a capital first letter (e.g., Person, Car) to distinguish them from regular functions. Before ES6 classes, constructor functions were the primary way to create objects with shared behavior and simulated class-like inheritance in JavaScript.

When you call a function with the new keyword, JavaScript performs four implicit steps: (1) a new empty object is created, (2) the object's internal [[Prototype]] is set to the constructor function's prototype property, (3) the function executes with \`this\` bound to the new object, and (4) if the function doesn't explicitly return an object, the new object is returned. This mechanism is how constructor functions produce instances that share methods through the prototype.

Methods should be defined on the constructor's prototype rather than inside the constructor body. If you define methods inside the constructor (e.g., \`this.greet = function() {...}\`), each instance gets its own copy of the function, wasting memory. By placing methods on the prototype (e.g., \`Person.prototype.greet = function() {...}\`), all instances share a single function object through the prototype chain.

Constructor functions can also implement inheritance by manually linking prototype chains. You create the child constructor, call the parent constructor inside it (using Parent.call(this, args)), set the child's prototype to an object that inherits from the parent's prototype (using Object.create(Parent.prototype)), and fix the constructor property. While this works, the verbose boilerplate is exactly what ES6 classes were designed to replace.`,shortAnswer:"Constructor functions are functions called with `new` to create objects. The `new` keyword creates an empty object, sets its prototype to the constructor's .prototype, executes the function with `this` bound to the new object, and returns it. Methods should be placed on the prototype to be shared across instances rather than recreated in each constructor call.",code:`// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Shared methods on prototype
Person.prototype.greet = function() {
  return "Hi, I'm " + this.name + " and I'm " + this.age;
};

Person.prototype.birthday = function() {
  this.age++;
};

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);

console.log(alice.greet()); // "Hi, I'm Alice and I'm 30"
console.log(bob.greet());   // "Hi, I'm Bob and I'm 25"

// Both share the same greet function
console.log(alice.greet === bob.greet); // true

// What \`new\` does behind the scenes:
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // Steps 1 & 2
  const result = Constructor.apply(obj, args);       // Step 3
  return result instanceof Object ? result : obj;    // Step 4
}

const carol = myNew(Person, "Carol", 28);
console.log(carol.greet()); // "Hi, I'm Carol and I'm 28"

// Inheritance with constructor functions
function Employee(name, age, company) {
  Person.call(this, name, age); // Call parent constructor
  this.company = company;
}
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;
Employee.prototype.introduce = function() {
  return this.greet() + " at " + this.company;
};

const dave = new Employee("Dave", 35, "Google");
console.log(dave.introduce()); // "Hi, I'm Dave and I'm 35 at Google"
console.log(dave instanceof Employee); // true
console.log(dave instanceof Person);   // true`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`constructor`,`new`,`prototype`,`instance`],commonMistakes:[`Calling a constructor without new—this binds to the global object (or undefined in strict mode) instead of a new instance`,`Defining methods inside the constructor instead of on the prototype, causing each instance to get its own copy`,`Forgetting to reset .constructor after Object.create when setting up inheritance`],followUps:[`What happens if a constructor function explicitly returns an object?`,`How does new.target help with detecting whether a function was called with new?`,`Why is it important to put methods on the prototype instead of in the constructor?`],interviewTips:[`Be able to explain the four steps new performs—this shows deep understanding`,`Mention that ES6 classes are syntactic sugar over constructor functions and prototypes`],relatedTopics:[`new Keyword`,`Prototype`,`ES6 Classes`]},{id:`js-oop-4`,question:`How do ES6 classes work under the hood?`,answer:`ES6 classes are syntactic sugar over JavaScript's existing prototypal inheritance model. Under the hood, a class declaration creates a constructor function and sets up its prototype just like you would manually with constructor functions. The class body's constructor method becomes the function itself, instance methods are placed on the prototype, and static methods are placed on the constructor function. The extends keyword sets up the prototype chain between parent and child.

When you write \`class Dog extends Animal { constructor(name) { super(name); } bark() { ... } }\`, JavaScript creates a function called Dog, sets Dog.prototype to an object whose [[Prototype]] is Animal.prototype, and defines bark on Dog.prototype. The super(name) call invokes Animal as a constructor (like Animal.call(this, name)), and the extends keyword also sets Dog's own [[Prototype]] to Animal, enabling static method inheritance.

Despite being syntactic sugar, classes have several differences from plain constructor functions. Classes are always in strict mode. They cannot be called without new (attempting to do so throws a TypeError). Class declarations are not hoisted in a usable way—they exist in the Temporal Dead Zone like let/const. Class methods are non-enumerable (they won't show up in for...in loops). These differences make classes more predictable and harder to misuse.

ES2022 introduced significant additions to classes: private fields (#name) that are truly private (not accessible outside the class, enforced by the engine), static fields and methods, static initialization blocks, and private methods. These features bring JavaScript classes closer to the capabilities of classical OOP languages. However, understanding that the underlying mechanism is still prototypal helps explain behaviors like instanceof, method sharing, and the ability to monkey-patch prototypes even for class instances.`,shortAnswer:`ES6 classes are syntactic sugar over constructor functions and prototypes. The constructor method becomes the constructor function, methods go on the prototype, and extends sets up the prototype chain. Classes enforce strict mode, require new, are not hoisted usably, and have non-enumerable methods. ES2022 added true private fields (#), static blocks, and private methods.`,code:`// ES6 class
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " makes a sound";
  }
}

// Is equivalent to:
function AnimalOld(name) {
  this.name = name;
}
AnimalOld.prototype.speak = function() {
  return this.name + " makes a sound";
};

// Proving they're the same mechanism:
console.log(typeof Animal); // "function"
console.log(Animal.prototype.speak); // [Function: speak]

const a = new Animal("Cat");
console.log(Object.getPrototypeOf(a) === Animal.prototype); // true

// ES6 class inheritance
class Dog extends Animal {
  #tricks = []; // Private field (ES2022)

  constructor(name, breed) {
    super(name); // Must call super before using \`this\`
    this.breed = breed;
  }

  bark() {
    return this.name + " barks!";
  }

  learnTrick(trick) {
    this.#tricks.push(trick); // Private access
  }

  showTricks() {
    return this.name + " knows: " + this.#tricks.join(", ");
  }

  static isDog(obj) {
    return obj instanceof Dog;
  }
}

const rex = new Dog("Rex", "Shepherd");
console.log(rex.speak());  // "Rex makes a sound" (inherited)
console.log(rex.bark());   // "Rex barks!" (own)

// Prototype chain: rex → Dog.prototype → Animal.prototype → Object.prototype
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true

// Classes cannot be called without new
// Animal("test"); // TypeError: Class constructor Animal cannot be invoked without 'new'`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`classes`,`ES6`,`syntactic sugar`,`private fields`],commonMistakes:[`Thinking ES6 classes introduce a new OOP model—they're syntactic sugar over prototypal inheritance`,`Forgetting to call super() in a derived class constructor before accessing this`,`Assuming private fields (#) work like TypeScript's private keyword—# fields are enforced at runtime by the engine`],followUps:[`Can you access a private field using Object.keys or reflection?`,`How do static initialization blocks work?`,`What is the difference between class fields and constructor assignments?`],interviewTips:[`Demonstrate understanding by showing the equivalent constructor function code for a class`,`Mention the key behavioral differences: strict mode, non-enumerable methods, TDZ, requires new`],relatedTopics:[`Constructor Functions`,`Prototype`,`Private Fields`]},{id:`js-oop-5`,question:"Explain the `this` keyword and how its value is determined.",answer:"The `this` keyword in JavaScript refers to the execution context of a function—the object that is \"currently\" associated with the function's execution. Unlike most languages where `this` is determined at compile time based on where the method is defined, JavaScript's `this` is determined at runtime based on how the function is called. This dynamic binding is one of the most confusing aspects of JavaScript for developers coming from other languages.\n\nThere are five primary rules for determining `this`, applied in order of precedence: (1) new binding: when a function is called with new, `this` refers to the newly created object. (2) Explicit binding: when a function is called with call(), apply(), or bind(), `this` is set to the first argument. (3) Implicit binding: when a function is called as a method of an object (obj.method()), `this` refers to the object before the dot. (4) Default binding: when a function is called standalone, `this` is the global object (window in browsers) in non-strict mode, or undefined in strict mode. (5) Arrow functions: don't have their own `this`; they inherit `this` from their enclosing lexical scope.\n\nA common pitfall is \"losing\" this when passing a method as a callback. When you write `setTimeout(obj.method, 1000)`, the method is extracted from the object and called without a receiver, so `this` falls back to the default binding rule. Solutions include using bind() (`setTimeout(obj.method.bind(obj), 1000)`), wrapping in an arrow function (`setTimeout(() => obj.method(), 1000)`), or using class fields with arrow functions to permanently bind methods.\n\nArrow functions are particularly important because they lexically capture `this` from their surrounding scope. This makes them ideal for callbacks within methods where you want to preserve the method's `this`. However, this same behavior means arrow functions should not be used as methods on objects or prototypes, because they would capture the wrong `this` (the enclosing scope instead of the calling object).",shortAnswer:"The `this` keyword's value depends on how a function is called: new binding (new object), explicit binding (call/apply/bind), implicit binding (object.method), or default binding (global/undefined). Arrow functions don't have their own `this`—they inherit it lexically from the enclosing scope. Methods can lose their `this` when passed as callbacks.",code:`// Rule 1: Default binding
function showThis() {
  console.log(this);
}
showThis(); // window (non-strict) or undefined (strict mode)

// Rule 2: Implicit binding
const obj = {
  name: "Alice",
  greet() {
    console.log("Hi, I'm " + this.name);
  }
};
obj.greet(); // "Hi, I'm Alice" — this = obj

// Rule 3: Explicit binding
const bob = { name: "Bob" };
obj.greet.call(bob);   // "Hi, I'm Bob" — this = bob
obj.greet.apply(bob);  // "Hi, I'm Bob" — this = bob
const boundGreet = obj.greet.bind(bob);
boundGreet();          // "Hi, I'm Bob" — this permanently = bob

// Rule 4: new binding
function Person(name) {
  this.name = name;
  console.log(this); // the new Person instance
}
const p = new Person("Carol"); // this = new Person object

// Rule 5: Arrow functions (lexical this)
const team = {
  name: "Engineering",
  members: ["Alice", "Bob"],
  listMembers() {
    this.members.forEach((member) => {
      console.log(member + " is in " + this.name);
      // Arrow function inherits \`this\` from listMembers
    });
  }
};
team.listMembers();
// "Alice is in Engineering"
// "Bob is in Engineering"

// Common pitfall: losing \`this\`
const greetFn = obj.greet; // Extracts the function
greetFn(); // undefined (strict) or window.name — \`this\` is lost!

// Fix with bind:
setTimeout(obj.greet.bind(obj), 100); // "Hi, I'm Alice"

// Fix with arrow wrapper:
setTimeout(() => obj.greet(), 100); // "Hi, I'm Alice"`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`this`,`binding`,`context`,`arrow functions`],commonMistakes:[`Assuming this always refers to the object where the method is defined—it depends on how the function is called`,`Using arrow functions as object methods, which causes this to refer to the enclosing scope instead of the object`,`Forgetting that event handlers receive the DOM element as this, not the class instance`],followUps:[`What is the order of precedence when multiple this-binding rules apply?`,`How does this work inside a class method vs a regular function?`,`Can you override this in an arrow function with call or bind?`],interviewTips:[`List the binding rules in order of precedence: new > explicit (call/apply/bind) > implicit (obj.method) > default`,`Demonstrate the "lost this" problem and how to fix it—this is an extremely common interview topic`],relatedTopics:[`Arrow Functions`,`call/apply/bind`,`Closures`]},{id:`js-oop-6`,question:`What are call, apply, and bind? How do they differ?`,answer:"call, apply, and bind are methods available on every JavaScript function (inherited from Function.prototype) that allow you to explicitly control the value of `this` when invoking a function. They are essential tools for controlling function context, borrowing methods from other objects, and creating partially applied functions.\n\ncall() invokes the function immediately with a specified `this` value and individual arguments: `func.call(thisArg, arg1, arg2, ...)`. apply() also invokes immediately but accepts arguments as an array: `func.apply(thisArg, [arg1, arg2, ...])`. The mnemonic is \"a for apply, a for array.\" Before the spread operator existed, apply was the only way to pass an array of arguments to a function. Now you can use `func.call(thisArg, ...args)` which makes call more versatile.\n\nbind() is fundamentally different from call and apply because it does not invoke the function immediately. Instead, it returns a new function with `this` permanently bound to the specified value. The bound function can be called later and will always use the bound `this`, regardless of how it's invoked. bind can also partially apply arguments: `const add5 = add.bind(null, 5)` creates a function where the first argument is always 5.\n\nA key distinction is that bind creates a new function object each time it's called, so repeatedly binding can be memory-inefficient. Also, once a function is bound, the `this` cannot be rebound—calling call or apply on a bound function will not change its `this`. These methods are commonly used for method borrowing (e.g., using Array.prototype.slice.call(arguments) to convert array-likes), setting event handler contexts, and creating callbacks that maintain the correct `this`.",shortAnswer:`call() invokes a function with a specified this and individual arguments. apply() is the same but takes arguments as an array. bind() returns a new function with this permanently bound without invoking it immediately. call and apply execute immediately; bind creates a reusable bound function. Bind can also partially apply arguments.`,code:`// call - invoke with specified this, individual args
function greet(greeting, punctuation) {
  return greeting + ", " + this.name + punctuation;
}

const person = { name: "Alice" };

console.log(greet.call(person, "Hello", "!"));
// "Hello, Alice!"

// apply - same but args as array
console.log(greet.apply(person, ["Hey", "!!!"]));
// "Hey, Alice!!!"

// bind - returns new function with bound this
const aliceGreet = greet.bind(person);
console.log(aliceGreet("Hi", "."));
// "Hi, Alice."

// Partial application with bind
const aliceHello = greet.bind(person, "Hello");
console.log(aliceHello("?"));
// "Hello, Alice?"

// Method borrowing
function listArgs() {
  // arguments is array-like, not a real array
  const args = Array.prototype.slice.call(arguments);
  return args.join(", ");
}
console.log(listArgs(1, 2, 3)); // "1, 2, 3"

// Fixing this in callbacks
class Timer {
  constructor() {
    this.seconds = 0;
  }
  start() {
    // Without bind, \`this\` would be lost in setInterval callback
    setInterval(function() {
      this.seconds++;
      console.log(this.seconds);
    }.bind(this), 1000);
    
    // Or use arrow function (lexical this)
    // setInterval(() => { this.seconds++; }, 1000);
  }
}

// Bound functions cannot be rebound
const bound = greet.bind(person);
const other = { name: "Bob" };
console.log(bound.call(other, "Hi", "!")); // "Hi, Alice!" — still Alice!

// Math.max with apply (classic pattern)
const numbers = [5, 1, 9, 3, 7];
console.log(Math.max.apply(null, numbers)); // 9
// Modern: Math.max(...numbers)`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`call`,`apply`,`bind`,`this`,`method borrowing`],commonMistakes:[`Confusing call and apply—remember "a for apply, a for array"`,`Expecting bind to modify the original function—it returns a new function`,`Trying to rebind a already-bound function—the original this persists`],followUps:[`How would you implement your own bind function?`,`What happens if you pass null or undefined as the thisArg?`,`How do call/apply/bind interact with arrow functions?`],interviewTips:[`Mention the mnemonic: call takes a Comma-separated list, apply takes an Array`,`Be ready to implement Function.prototype.bind from scratch—it's a popular interview question`],relatedTopics:[`this Keyword`,`Partial Application`,`Method Borrowing`]},{id:`js-oop-7`,question:`How does inheritance work with ES6 classes?`,answer:"ES6 class inheritance uses the extends keyword to create a child class that inherits from a parent class. When you write `class Child extends Parent`, JavaScript sets up two prototype chain links: Child.prototype.[[Prototype]] points to Parent.prototype (for instance method inheritance), and Child.[[Prototype]] points to Parent (for static method inheritance). This dual chain ensures both instance and static methods are inherited.\n\nIn the child class constructor, you must call super() before accessing `this`. This is because in a derived class, the object is actually created by the base class constructor—the child class's constructor receives the already-created object. If you don't call super(), `this` is uninitialized, and accessing it throws a ReferenceError. super() calls the parent constructor with the given arguments and initializes `this` in the child context.\n\nThe super keyword can also be used to call parent methods from within overridden methods: `super.methodName()` calls the parent class's version of the method. This enables cooperative method overriding where the child extends (rather than fully replaces) the parent's behavior. super is resolved statically based on the class where the method is defined, not dynamically based on the prototype chain, which avoids infinite recursion issues.\n\nES6 inheritance supports the full range of OOP patterns: single inheritance chains (A → B → C), method overriding, constructor delegation via super(), and accessing overridden parent methods. However, JavaScript does not support multiple inheritance—a class can only extend one parent. Mixins (functions that take a class and return a subclass) are the common pattern for composing behavior from multiple sources.",shortAnswer:`ES6 class inheritance uses extends to set up prototype chains for both instance and static methods. Child constructors must call super() before using this, as the base class creates the object. super.method() calls the parent version of an overridden method. JavaScript supports single inheritance only; mixins are used for multi-source composition.`,code:`// Basic inheritance
class Shape {
  constructor(color) {
    this.color = color;
  }
  describe() {
    return "A " + this.color + " shape";
  }
  static create(color) {
    return new this(color); // \`this\` refers to the class
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color); // MUST call before using \`this\`
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
  describe() {
    return super.describe() + " circle with radius " + this.radius;
  }
}

class Cylinder extends Circle {
  constructor(color, radius, height) {
    super(color, radius);
    this.height = height;
  }
  volume() {
    return this.area() * this.height;
  }
}

const cyl = new Cylinder("red", 5, 10);
console.log(cyl.describe());
// "A red shape circle with radius 5"
console.log(cyl.volume());
// 785.398...
console.log(cyl instanceof Cylinder); // true
console.log(cyl instanceof Circle);   // true
console.log(cyl instanceof Shape);    // true

// Static methods are inherited too
const blueCircle = Circle.create("blue");
console.log(blueCircle instanceof Circle); // true

// Mixin pattern for multiple inheritance
const Serializable = (Base) => class extends Base {
  toJSON() {
    return JSON.stringify(this);
  }
};

const Printable = (Base) => class extends Base {
  print() {
    console.log(this.describe());
  }
};

class FancyCircle extends Printable(Serializable(Circle)) {
  constructor(color, radius) {
    super(color, radius);
  }
}

const fc = new FancyCircle("gold", 3);
fc.print();          // Inherited from Printable mixin
console.log(fc.toJSON()); // Inherited from Serializable mixin`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`inheritance`,`extends`,`super`,`classes`],commonMistakes:[`Forgetting to call super() in derived class constructors—accessing this without super throws ReferenceError`,`Not understanding that super() must come before any this access in the constructor`,`Thinking JavaScript supports multiple inheritance—use mixins instead`],followUps:[`How do mixins work as an alternative to multiple inheritance?`,`Can a class extend a regular function (not a class)?`,`What happens if you don't define a constructor in a derived class?`],interviewTips:[`Show the dual prototype chain: Child.prototype → Parent.prototype AND Child → Parent (for statics)`,`Demonstrate mixin pattern knowledge to show advanced OOP understanding`],relatedTopics:[`Prototype Chain`,`Mixins`,`super Keyword`]},{id:`js-oop-8`,question:`What is encapsulation in JavaScript? How can you achieve it?`,answer:`Encapsulation is the OOP principle of bundling data (properties) and the methods that operate on that data together, while restricting direct access to some of the object's internals. The goal is to hide implementation details and expose only a controlled public interface, preventing external code from depending on or corrupting internal state. This leads to more maintainable, robust code because internal changes don't break external consumers.

Historically, JavaScript had no built-in mechanism for true privacy. Developers used conventions and patterns to simulate encapsulation. The most common convention is the underscore prefix (\`this._name\`) to signal "private" properties, though this provides no enforcement. The closure pattern (also called the module pattern) uses function scope to create truly hidden variables: a constructor or factory function defines variables in its local scope and returns methods that close over those variables, making them inaccessible from outside.

ES2022 introduced true private class fields and methods using the # prefix. Fields like #name and methods like #validate() are genuinely private—they cannot be accessed or even detected from outside the class. Unlike the underscore convention, this privacy is enforced by the JavaScript engine at runtime. Attempting to access a private field outside the class throws a SyntaxError. Private fields are per-instance and are not part of the prototype; they are stored as internal slots on each object.

For encapsulation without classes, you can also use WeakMap to store private data keyed by object reference, closures in factory functions, or Symbols as property keys (which provides obscurity but not true privacy, as Symbol properties are discoverable via Object.getOwnPropertySymbols). The choice depends on your needs: # private fields for class-based code, closures for factory functions, and WeakMap for attaching private data to existing objects.`,shortAnswer:`Encapsulation bundles data with methods while restricting access to internals. JavaScript achieves it through: ES2022 private fields/methods (#name), closures in constructor/factory functions, the underscore convention (_name, unenforced), WeakMaps for external private data, and Symbols (obscure but discoverable). Private # fields provide true engine-enforced privacy.`,code:`// 1. ES2022 Private fields and methods
class BankAccount {
  #balance = 0;
  #owner;

  constructor(owner, initialBalance) {
    this.#owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (this.#isValidAmount(amount)) {
      this.#balance += amount;
      return true;
    }
    return false;
  }

  get balance() {
    return this.#balance; // Read-only access via getter
  }

  #isValidAmount(amount) { // Private method
    return typeof amount === "number" && amount > 0;
  }
}

const account = new BankAccount("Alice", 1000);
account.deposit(500);
console.log(account.balance); // 1500
// account.#balance;  // SyntaxError: Private field
// account.#isValidAmount(100); // SyntaxError

// 2. Closure-based encapsulation (pre-ES2022)
function createCounter(initial) {
  let count = initial; // Truly private via closure

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; },
  };
}

const counter = createCounter(0);
counter.increment();
counter.increment();
console.log(counter.getCount()); // 2
// counter.count → undefined (not accessible)

// 3. WeakMap for private data
const privateData = new WeakMap();

class User {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn }); // SSN stored externally
  }
  getSSNLastFour() {
    return privateData.get(this).ssn.slice(-4);
  }
}

const user = new User("Bob", "123-45-6789");
console.log(user.name);           // "Bob" (public)
console.log(user.getSSNLastFour()); // "6789"
// No way to access ssn directly from outside`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`encapsulation`,`private fields`,`closure`,`WeakMap`],commonMistakes:[`Relying on underscore convention (_name) for security—it provides zero enforcement`,`Thinking private fields (#) are the same as TypeScript's private—# is enforced at runtime, TS private is compile-time only`,`Forgetting that private fields are per-instance, not per-class—two instances cannot access each other's private fields unless the method is defined in the same class`],followUps:[`Can private fields be inherited by subclasses?`,`How do private fields interact with Proxy and Reflect?`,`What are the performance implications of closure-based vs # private encapsulation?`],interviewTips:[`Show multiple encapsulation approaches and when to use each one`,`Mention that # fields are a recent addition—knowing the history shows depth`],relatedTopics:[`Private Fields`,`Closures`,`WeakMap`,`Module Pattern`]},{id:`js-oop-9`,question:`Explain polymorphism in JavaScript with examples.`,answer:`Polymorphism, meaning "many forms," is the ability for different objects to respond to the same message (method call) in different ways. In JavaScript, polymorphism is achieved naturally through the prototype chain and duck typing, rather than through formal interfaces or abstract classes as in statically-typed languages. When you call a method on an object, JavaScript doesn't care about the object's class—only that the object has a method with that name.

The most common form of polymorphism in JavaScript is method overriding (subtype polymorphism). When a child class defines a method with the same name as a parent class method, calling that method on a child instance invokes the child's version. The parent's version can still be accessed via super.method(). This allows different classes in an inheritance hierarchy to provide specialized implementations while sharing a common interface.

Duck typing is another form of polymorphism prevalent in JavaScript: "if it walks like a duck and quacks like a duck, it's a duck." JavaScript doesn't require objects to share a common ancestor to be used polymorphically—any object that has the expected method can be used. This is particularly powerful with interfaces like iterables (any object with a Symbol.iterator method works with for...of), thenables (any object with a .then method works with await), and custom protocols.

JavaScript also supports ad-hoc polymorphism through operator overloading (limited—mainly via toString/valueOf for implicit type coercion) and parametric polymorphism through generic patterns (functions that work with any type via duck typing). While JavaScript doesn't have formal interfaces, TypeScript adds them for compile-time checks, and the convention of duck typing provides runtime polymorphism. Well-designed polymorphic code enables the Open/Closed Principle: systems that are open for extension but closed for modification.`,shortAnswer:`Polymorphism allows different objects to respond to the same method call differently. JavaScript achieves it through method overriding (child classes redefine parent methods), duck typing (any object with the right methods can be used regardless of its type), and protocol-based patterns (iterables, thenables). No formal interfaces are needed—JavaScript relies on structural compatibility.`,code:`// 1. Method overriding (subtype polymorphism)
class Shape {
  area() {
    throw new Error("area() must be implemented");
  }
  describe() {
    return "Shape with area: " + this.area().toFixed(2);
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  area() { return this.width * this.height; }
}

class Triangle extends Shape {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }
  area() { return 0.5 * this.base * this.height; }
}

// Polymorphic usage - same interface, different behavior
const shapes = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 8)];
shapes.forEach(shape => {
  console.log(shape.describe());
});
// "Shape with area: 78.54"
// "Shape with area: 24.00"
// "Shape with area: 12.00"

// 2. Duck typing - no shared ancestor needed
function printArea(shape) {
  // Works with ANY object that has an area() method
  console.log("Area: " + shape.area());
}

const customShape = {
  area() { return 42; } // Not a Shape subclass!
};
printArea(customShape); // "Area: 42" — duck typing works!

// 3. Protocol-based polymorphism (iterables)
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}

// Works with for...of because it implements the iterable protocol
for (const num of new Range(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Also works with spread, destructuring, Array.from
console.log([...new Range(1, 3)]); // [1, 2, 3]`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`polymorphism`,`duck typing`,`method overriding`,`protocols`],commonMistakes:[`Thinking polymorphism requires inheritance—duck typing enables polymorphism without shared ancestors`,`Not understanding that JavaScript checks for method existence at runtime, not compile time`,`Overcomplicating polymorphism with class hierarchies when simple duck typing would suffice`],followUps:[`How does TypeScript's structural typing relate to duck typing?`,`What is the difference between ad-hoc and parametric polymorphism?`,`How do Symbol.toPrimitive and toString/valueOf enable operator polymorphism?`],interviewTips:[`Show both inheritance-based and duck-typing-based polymorphism to demonstrate versatility`,`Mention protocol-based polymorphism (iterables, thenables) to show advanced knowledge`],relatedTopics:[`Inheritance`,`Duck Typing`,`Iterators`,`Interfaces`]},{id:`js-oop-10`,question:`What is the difference between __proto__ and prototype?`,answer:"The distinction between __proto__ and prototype is one of the most confusing aspects of JavaScript's object system, but understanding it is key to mastering prototypal inheritance. `prototype` is a property that exists on functions (specifically, on constructor functions and classes). It is the object that will become the [[Prototype]] of instances created with `new`. When you write `new Foo()`, the newly created object's internal [[Prototype]] is set to Foo.prototype.\n\n`__proto__` (also accessible via Object.getPrototypeOf()) is a getter/setter that exists on every object and provides access to the object's internal [[Prototype]] link—the actual prototype that is used for property lookup. So `instance.__proto__` gives you the prototype object that the instance inherits from. For an instance created with `new Foo()`, instance.__proto__ === Foo.prototype is true.\n\nThe relationship is: `Constructor.prototype` defines what the [[Prototype]] of new instances will be, while `instance.__proto__` (or Object.getPrototypeOf(instance)) reveals the [[Prototype]] that was assigned. They point to the same object but from different perspectives—one is the blueprint specification (prototype on the constructor), the other is the actual link on the instance (__proto__).\n\nIn practice, you should avoid using __proto__ directly in production code. It was originally a non-standard browser extension that was later standardized in ES2015 for compatibility, but with a recommendation to use Object.getPrototypeOf() and Object.setPrototypeOf() instead. Setting __proto__ (or calling Object.setPrototypeOf()) on an existing object is strongly discouraged because it forces V8 to abandon optimizations (hidden classes and inline caches) for that object, severely impacting performance.",shortAnswer:"prototype is a property on constructor functions that defines the [[Prototype]] for instances created with new. __proto__ is a property on every object that accesses its actual [[Prototype]] link used for inheritance. For `const obj = new Foo()`: obj.__proto__ === Foo.prototype. Use Object.getPrototypeOf() instead of __proto__ in production code.",code:`// prototype lives on constructor functions
function Dog(name) {
  this.name = name;
}
Dog.prototype.bark = function() {
  return this.name + " says woof!";
};

// __proto__ lives on instances (and all objects)
const rex = new Dog("Rex");

// The key relationship:
console.log(rex.__proto__ === Dog.prototype);           // true
console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true

// rex itself does NOT have a .prototype property
console.log(rex.prototype); // undefined

// Dog.prototype is an object with its own __proto__
console.log(Dog.prototype.__proto__ === Object.prototype); // true

// The full chain:
// rex.__proto__                → Dog.prototype
// Dog.prototype.__proto__      → Object.prototype
// Object.prototype.__proto__   → null

// Visualizing the difference:
console.log(Dog.prototype);  // { bark: [Function], constructor: Dog }
console.log(rex.__proto__);  // { bark: [Function], constructor: Dog }
// Same object, accessed from different sides

// Even functions have __proto__ (they're objects too)
console.log(Dog.__proto__ === Function.prototype); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true

// Classes work the same way
class Cat {
  constructor(name) { this.name = name; }
  meow() { return this.name + " says meow!"; }
}

const kitty = new Cat("Kitty");
console.log(kitty.__proto__ === Cat.prototype); // true
console.log(typeof Cat.prototype); // "object"
console.log(typeof Cat); // "function"

// Prefer Object.getPrototypeOf over __proto__
const proto = Object.getPrototypeOf(rex);
console.log(proto === Dog.prototype); // true

// Don't do this in production (kills V8 optimizations):
// Object.setPrototypeOf(rex, someOtherProto);`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-oop`,tags:[`__proto__`,`prototype`,`prototype chain`,`inheritance`],commonMistakes:[`Confusing .prototype (property on functions) with __proto__ (property on all objects)—they serve different roles`,`Thinking instances have a .prototype property—only functions/classes have .prototype`,`Using __proto__ in production code instead of Object.getPrototypeOf()/Object.setPrototypeOf()`],followUps:[`What is Object.create() and how does it relate to prototype and __proto__?`,`Why does modifying an object's prototype at runtime hurt performance?`,`What is Function.prototype and why is typeof Function.prototype === "function"?`],interviewTips:[`Draw a diagram showing Constructor.prototype ← instance.__proto__ to make the relationship clear`,`Mention performance implications of Object.setPrototypeOf to show awareness of engine internals`],relatedTopics:[`Prototype Chain`,`Constructor Functions`,`Object.create`]}]}],a=[{id:`js-functional`,title:`Functional Programming`,description:`Core functional programming concepts in JavaScript including pure functions, immutability, higher-order functions, composition, currying, and common FP patterns used in modern codebases.`,category:`JavaScript`,difficulty:`Intermediate`,tags:[`functional programming`,`pure functions`,`immutability`,`higher-order functions`,`composition`,`currying`,`map`,`filter`,`reduce`],overview:`Functional programming (FP) is a paradigm that treats computation as the evaluation of mathematical functions and avoids changing state or mutable data. JavaScript is a multi-paradigm language with strong support for FP through first-class functions, closures, and built-in array methods like map, filter, and reduce. Understanding FP principles leads to more predictable, testable, and maintainable code. Modern libraries such as React, Redux, and RxJS are deeply rooted in functional concepts, making FP knowledge essential for front-end developers.`,concepts:[`Pure functions and referential transparency`,`Immutability and persistent data structures`,`Higher-order functions`,`Function composition and pipelines`,`Array methods: map, filter, reduce`,`Currying and partial application`,`Side effects and effect management`,`Declarative vs imperative programming`,`Closures as a functional tool`,`Point-free style`],questions:[{id:`js-fp-1`,question:`What are pure functions? Why are they important?`,answer:`A pure function is a function that, given the same input, always returns the same output and produces no side effects. This means it does not modify any external state, does not rely on mutable external variables, and does not perform I/O operations such as network requests, DOM manipulation, or logging. The output is determined entirely by its input arguments.

Pure functions are foundational to functional programming because they provide referential transparency — you can replace a function call with its return value without changing the program's behavior. This property makes code dramatically easier to reason about, debug, and test. When you know a function is pure, you know it cannot be responsible for unexpected state changes elsewhere in the application.

Testing pure functions is straightforward because they require no mocking of external dependencies. You simply pass inputs and assert outputs. This eliminates an entire class of flaky tests caused by shared mutable state or environment-dependent behavior.

Pure functions also enable powerful optimizations. Because their output depends only on their input, results can be safely cached (memoized). React leverages this idea extensively — React.memo, useMemo, and useCallback all rely on the assumption that rendering functions behave purely with respect to their props and state.

In practice, not every function in an application can be pure — you need side effects to do useful work. The key insight from FP is to push side effects to the boundaries of your system and keep the core logic pure. This separation makes the codebase more modular and easier to refactor.`,shortAnswer:`A pure function always returns the same output for the same input and has no side effects. They are important because they are predictable, easy to test, safe to memoize, and make code easier to reason about and debug.`,code:`// Pure function — output depends only on input
function add(a: number, b: number): number {
  return a + b;
}

// Impure — depends on external mutable state
let taxRate = 0.2;
function calculateTax(price: number): number {
  return price * taxRate; // taxRate can change
}

// Impure — produces a side effect
function logAndReturn(value: number): number {
  console.log(value); // side effect
  return value;
}

// Memoization works safely with pure functions
function memoize<T extends (...args: string[]) => unknown>(fn: T): T {
  const cache = new Map<string, unknown>();
  return ((...args: string[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const memoizedAdd = memoize((a: string, b: string) =>
  Number(a) + Number(b)
);`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functional`,tags:[`pure functions`,`side effects`,`referential transparency`,`memoization`],commonMistakes:[`Assuming a function is pure when it reads from a mutable variable in an outer scope`,`Forgetting that mutating an input argument (object or array) is a side effect even if nothing else external is touched`,`Confusing deterministic output with purity — a function that logs and returns a value is deterministic but not pure`],followUps:[`How does React rely on function purity for rendering and reconciliation?`,`What is referential transparency and how does it relate to pure functions?`,`How would you refactor an impure function into a pure one?`],interviewTips:[`Give concrete before/after examples showing an impure function refactored to a pure one — interviewers love practical demonstrations`,`Mention React's reliance on pure components to show real-world relevance`]},{id:`js-fp-2`,question:`What is immutability and how do you achieve it in JavaScript?`,answer:`Immutability means that once a data structure is created, it cannot be changed. Instead of modifying existing data, you create new copies with the desired changes. This is a core principle of functional programming and eliminates an entire category of bugs caused by unexpected mutations to shared state.

In JavaScript, primitive values (strings, numbers, booleans, etc.) are already immutable. The challenge lies with objects and arrays, which are mutable by default. When you assign an object to a new variable, both variables reference the same object in memory, so mutating through one reference affects the other. This is the root cause of many subtle bugs in complex applications.

The simplest way to achieve immutability is through the spread operator and methods that return new arrays or objects. For arrays, prefer map, filter, concat, and slice over push, pop, splice, and sort (which mutate in place). For objects, use the spread operator or Object.assign to create shallow copies with updated properties. For nested structures, you need to spread at each level — this is called structural sharing.

Object.freeze provides runtime immutability enforcement but only at the top level (shallow freeze). A deep freeze requires recursion. TypeScript's Readonly<T> and ReadonlyArray<T> utility types enforce immutability at compile time, which is preferable because there is zero runtime cost. Libraries like Immer simplify immutable updates by letting you write mutative-looking code inside a produce callback, which is then translated into immutable operations.

Immutability is especially important in React and Redux. React's reconciliation relies on reference equality checks to detect state changes — if you mutate an object in place, React cannot detect the change and will skip re-rendering. Redux reducers are required to return new state objects for the same reason.`,shortAnswer:`Immutability means data cannot be changed after creation — you create new copies with updates instead. In JavaScript, use the spread operator, Object.freeze, non-mutating array methods, TypeScript Readonly types, or libraries like Immer to enforce it.`,code:`// Immutable object update with spread
const user = { name: "Alice", age: 30, address: { city: "NYC" } };
const updatedUser = { ...user, age: 31 };

// Nested immutable update (structural sharing)
const movedUser = {
  ...user,
  address: { ...user.address, city: "LA" },
};

// Immutable array operations
const numbers = [1, 2, 3, 4];
const added = [...numbers, 5];          // [1, 2, 3, 4, 5]
const removed = numbers.filter(n => n !== 3); // [1, 2, 4]
const updated = numbers.map(n => (n === 2 ? 20 : n)); // [1, 20, 3, 4]

// Object.freeze (shallow)
const config = Object.freeze({ api: "/v1", timeout: 3000 });
// config.timeout = 5000; // silently fails (or throws in strict mode)

// Deep freeze utility
function deepFreeze<T extends Record<string, unknown>>(obj: T): Readonly<T> {
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val && typeof val === "object" && !Object.isFrozen(val)) {
      deepFreeze(val as Record<string, unknown>);
    }
  });
  return Object.freeze(obj);
}

// TypeScript compile-time immutability
interface AppState {
  readonly users: ReadonlyArray<{ readonly name: string }>;
  readonly count: number;
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functional`,tags:[`immutability`,`spread operator`,`Object.freeze`,`Immer`,`state management`],commonMistakes:[`Using Object.freeze and assuming nested objects are also frozen — it is only a shallow freeze`,`Mutating arrays with push/splice inside a React setState or Redux reducer, then wondering why the UI does not update`,`Forgetting that the spread operator only performs a shallow copy, so deeply nested mutations still affect the original`],followUps:[`How does Immer achieve immutable updates with a mutable API?`,`Why does React require immutable state updates for correct re-rendering?`,`What are the performance implications of creating new objects on every update?`],interviewTips:[`Demonstrate awareness of the shallow vs deep copy distinction — this is a common follow-up trap`,`Mention TypeScript Readonly types as a zero-cost compile-time alternative to Object.freeze`]},{id:`js-fp-3`,question:`Explain map, filter, and reduce with examples.`,answer:`map, filter, and reduce are the three fundamental higher-order array methods in JavaScript that form the backbone of functional data transformation. They replace imperative for-loops with declarative, composable operations that clearly express intent.

Array.prototype.map transforms every element in an array by applying a callback function and returns a new array of the same length. It is a one-to-one transformation — each input element produces exactly one output element. The original array is not modified. Common uses include transforming API response data, converting between data formats, and rendering lists in React via JSX.

Array.prototype.filter creates a new array containing only the elements for which the callback returns a truthy value. It is a many-to-fewer transformation — the output array length is less than or equal to the input. Use it for searching, removing items, or applying business rules to datasets. Chaining filter with map is an extremely common pattern: filter selects the relevant subset, then map transforms it.

Array.prototype.reduce is the most powerful and general of the three — both map and filter can be implemented using reduce. It iterates over the array while maintaining an accumulator value that is updated on each step and returned at the end. The accumulator can be any type: a number (for sums), a string, an object (for grouping or indexing), or even another array. The initial value of the accumulator is passed as the second argument to reduce and should always be provided explicitly to avoid unexpected behavior when the array is empty.

These methods are designed to be chained together in a fluent pipeline: array.filter(...).map(...).reduce(...). Each step in the pipeline produces a new array, making the transformations easy to read, test, and reorder. One performance consideration is that each chained method iterates the entire array, so for very large datasets a single reduce that combines all operations may be more efficient, though readability usually outweighs this concern.`,shortAnswer:`map transforms each element and returns a new array of the same length. filter returns a new array with only elements that pass a test. reduce iterates the array while building up an accumulator value into any shape. All three are non-mutating and can be chained for expressive data pipelines.`,code:`const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Phone", price: 699, inStock: false },
  { name: "Tablet", price: 499, inStock: true },
  { name: "Watch", price: 299, inStock: true },
];

// map — transform each element
const names = products.map((p) => p.name);
// ["Laptop", "Phone", "Tablet", "Watch"]

const withTax = products.map((p) => ({
  ...p,
  priceWithTax: +(p.price * 1.2).toFixed(2),
}));

// filter — select a subset
const available = products.filter((p) => p.inStock);
// [{ name: "Laptop", ... }, { name: "Tablet", ... }, { name: "Watch", ... }]

const affordable = products.filter((p) => p.price < 500);

// reduce — accumulate into any shape
const totalValue = products.reduce((sum, p) => sum + p.price, 0);
// 2496

// reduce to group by a property
const grouped = products.reduce<Record<string, typeof products>>(
  (acc, product) => {
    const key = product.inStock ? "available" : "soldOut";
    return { ...acc, [key]: [...(acc[key] ?? []), product] };
  },
  {},
);

// Chaining — pipeline of transformations
const discountedAvailable = products
  .filter((p) => p.inStock)
  .map((p) => ({ ...p, price: +(p.price * 0.9).toFixed(2) }))
  .reduce((total, p) => total + p.price, 0);
// sum of 10%-discounted prices for in-stock items`,language:`typescript`,difficulty:`Beginner`,type:`Coding`,category:`JavaScript`,topicId:`js-functional`,tags:[`map`,`filter`,`reduce`,`array methods`,`data transformation`],commonMistakes:[`Forgetting to return a value from the map callback (arrow function with curly braces needs an explicit return)`,`Omitting the initial value in reduce, which causes the first element to be used as the accumulator and throws on empty arrays`,`Using forEach when map or filter would be more appropriate — forEach returns undefined and encourages side effects`],followUps:[`How would you implement map and filter using only reduce?`,`What is flatMap and when would you use it over map?`,`How do these methods compare in performance to a traditional for-loop on very large arrays?`],interviewTips:[`When asked to solve a data transformation problem, reach for map/filter/reduce first — it signals functional thinking`,`Be prepared to implement reduce from scratch as a follow-up question`]},{id:`js-fp-4`,question:`What is currying? Implement a curry function.`,answer:`Currying is the technique of transforming a function that takes multiple arguments into a sequence of functions that each take a single argument. A curried function does not perform its computation until all arguments have been supplied. When called with fewer arguments than it expects, it returns a new function that waits for the remaining ones. The term comes from mathematician Haskell Curry.

For example, a function add(a, b) becomes curry(add) which can be called as curried(1)(2) or curried(1) followed later by the returned function being called with (2). This enables partial application — you can create specialized versions of general functions by fixing some arguments upfront. For instance, const addTen = curried(10) creates a reusable function that adds 10 to any number.

Currying is particularly useful for creating function pipelines and point-free compositions. When every function takes a single argument, composition becomes trivial: compose(f, g)(x) simply applies g to x, then f to the result. Libraries like Ramda and lodash/fp use currying extensively to make their utility functions composable. In React, curried event handlers are a common pattern: const handleChange = (field: string) => (event: Event) => setState({ [field]: event.target.value }).

A general-purpose curry implementation checks the function's arity (the number of expected arguments via fn.length). If enough arguments have been collected, it calls the original function. Otherwise, it returns a new function that collects more arguments. The implementation typically uses recursion or a closure that accumulates arguments across calls.

While currying and partial application are related, they are distinct concepts. Currying always produces a chain of unary functions (one argument each), whereas partial application fixes some arguments and returns a function that takes the remaining ones all at once. In practice, most JavaScript curry implementations blend the two — they allow passing multiple arguments at once for convenience.`,shortAnswer:`Currying transforms a multi-argument function into a chain of single-argument functions. Each call returns a new function until all arguments are provided, at which point the original function executes. It enables partial application and makes functions easily composable.`,code:`// Manual currying
function addManual(a: number): (b: number) => number {
  return function (b: number): number {
    return a + b;
  };
}
const addFive = addManual(5);
console.log(addFive(3)); // 8

// General-purpose curry function
function curry<F extends (...args: never[]) => unknown>(
  fn: F,
): (...args: unknown[]) => unknown {
  const arity = fn.length;

  function curried(this: unknown, ...args: unknown[]): unknown {
    if (args.length >= arity) {
      return fn.apply(this, args as Parameters<F>);
    }
    return (...moreArgs: unknown[]) =>
      curried.apply(this, [...args, ...moreArgs]);
  }

  return curried;
}

// Usage
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

const curriedMultiply = curry(multiply);
console.log(curriedMultiply(2)(3)(4));    // 24
console.log(curriedMultiply(2, 3)(4));    // 24
console.log(curriedMultiply(2)(3, 4));    // 24

// Practical example: configurable formatter
const formatCurrency = curry(
  (symbol: string, decimals: number, value: number): string =>
    \\\`\\\${symbol}\\\${value.toFixed(decimals)}\\\`
);

const formatUSD = formatCurrency("$", 2);
const formatEUR = formatCurrency("€", 2);

console.log(formatUSD(19.99));  // "$19.99"
console.log(formatEUR(24.5));   // "€24.50"`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`JavaScript`,topicId:`js-functional`,tags:[`currying`,`partial application`,`closures`,`function composition`],commonMistakes:[`Relying on fn.length when the function uses default parameters or rest parameters — these do not count toward arity`,`Confusing currying with partial application — currying always returns unary functions, partial application fixes arbitrary arguments`,`Forgetting to preserve the this context when currying methods that depend on it`],followUps:[`How does currying differ from partial application?`,`How would you curry a variadic function (one with no fixed arity)?`,`Why do libraries like Ramda curry all their functions by default?`],interviewTips:[`Be ready to write the curry utility from scratch — focus on the recursive structure and the arity check`,`Show a practical use case like reusable configuration or event handler factories to ground the concept`]},{id:`js-fp-5`,question:`What is partial application? How is it different from currying?`,answer:`Partial application is the process of fixing a number of arguments to a function, producing a new function with a smaller arity. Unlike currying, which transforms a function into a chain of unary (single-argument) functions, partial application allows you to fix any number of arguments at once and returns a function that accepts the remaining arguments together. The result does not have to be unary.

For example, if you have a function log(level, timestamp, message), you can partially apply the first two arguments to create a specialized function infoLog(message) that always uses "INFO" as the level and the current timestamp. The key distinction is that partial application is a one-step operation that fixes some arguments, while currying restructures the entire function signature into nested unary calls.

JavaScript provides a built-in mechanism for partial application via Function.prototype.bind. While bind is primarily used to fix the this context, it also accepts additional arguments that are prepended to the argument list of future calls. You can also implement partial application manually using closures or a utility function. Libraries like Lodash provide _.partial and _.partialRight for left-to-right and right-to-left partial application respectively.

In practice, the distinction between currying and partial application often blurs in JavaScript. Most curry implementations in JS libraries (including Lodash and Ramda) allow passing multiple arguments at once, which means they support partial application as a special case. The conceptual difference still matters: currying is about restructuring a function's signature; partial application is about pre-filling arguments to create specialized versions.

Partial application is extremely useful for creating adapter functions, callback factories, and middleware. In React, it appears frequently in patterns like onClick handlers where you partially apply an item ID to a generic handler function, avoiding the need to create arrow functions in JSX.`,shortAnswer:`Partial application fixes some arguments of a function and returns a new function that takes the rest. Unlike currying (which always produces a chain of unary functions), partial application produces a single function expecting all remaining arguments. JavaScript's Function.prototype.bind supports partial application natively.`,code:`// Partial application with bind
function greet(greeting: string, punctuation: string, name: string): string {
  return \\\`\\\${greeting}, \\\${name}\\\${punctuation}\\\`;
}

const sayHello = greet.bind(null, "Hello", "!");
console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHello("Bob"));   // "Hello, Bob!"

// Manual partial application utility
function partial<T extends unknown[], R>(
  fn: (...args: T) => R,
  ...presetArgs: Partial<T>
): (...remainingArgs: unknown[]) => R {
  return (...remainingArgs: unknown[]) =>
    fn(...([...presetArgs, ...remainingArgs] as unknown as T));
}

function createUrl(
  protocol: string,
  domain: string,
  path: string,
): string {
  return \\\`\\\${protocol}://\\\${domain}/\\\${path}\\\`;
}

const secureUrl = partial(createUrl, "https");
const apiUrl = partial(createUrl, "https", "api.example.com");

console.log(secureUrl("example.com", "about"));  // "https://example.com/about"
console.log(apiUrl("users"));                    // "https://api.example.com/users"

// Currying vs partial application comparison
// Curried: f(a)(b)(c)
const curriedGreet = (g: string) => (p: string) => (n: string) =>
  \\\`\\\${g}, \\\${n}\\\${p}\\\`;

// Partially applied: f(a, b) → g(c)
const partialGreet = partial(greet, "Hi", ".");  // fixes 2, expects 1`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functional`,tags:[`partial application`,`currying`,`bind`,`closures`,`function factories`],commonMistakes:[`Using bind for partial application without realizing it permanently sets the this context as well, which can cause issues with methods`,`Confusing the two: saying "currying" when you mean "partial application" — interviewers notice the imprecision`,`Creating arrow functions inside JSX on every render instead of using partial application to create stable references`],followUps:[`When would you choose partial application over currying in a real project?`,`How does _.partialRight differ from _.partial and when is it useful?`,`Can you implement partial application that supports placeholder arguments?`],interviewTips:[`Clearly articulate the difference: currying restructures the function, partial application pre-fills arguments — this distinction shows depth of understanding`]},{id:`js-fp-6`,question:`What is function composition?`,answer:`Function composition is the process of combining two or more functions to produce a new function where the output of one function becomes the input of the next. Mathematically, composing functions f and g produces a new function h such that h(x) = f(g(x)). In code, this means creating data transformation pipelines where data flows through a series of small, focused functions.

The primary benefit of composition is that it encourages building complex behavior from simple, reusable parts. Each function in the composition has a single responsibility, making it easy to understand, test, and replace. This aligns with the Unix philosophy of small tools that do one thing well and can be chained together.

There are two common composition directions. "compose" applies functions right-to-left (the mathematical convention), so compose(f, g, h)(x) computes f(g(h(x))). "pipe" applies functions left-to-right (the reading order), so pipe(h, g, f)(x) computes f(g(h(x))). Pipe tends to be more readable in code because you read the transformations in the order they are applied. Both are equivalent — pipe is just compose with reversed argument order.

Composition works best when all the composed functions are unary (take a single argument), which is one reason currying is so closely associated with functional programming. If your functions take multiple arguments, curry them first so they can be composed. Libraries like Ramda, lodash/fp, and RxJS operators are designed around this principle — their functions are curried and data-last to make composition seamless.

Modern JavaScript has a TC39 proposal for a pipe operator (|>) that would enable native syntax like value |> fn1 |> fn2 |> fn3. Until that lands, you can use utility functions or libraries. In React, custom hooks are a form of composition — they compose stateful logic the same way pure function composition combines transformations.`,shortAnswer:`Function composition combines multiple functions into a single function where the output of one feeds as input to the next. compose applies functions right-to-left while pipe applies left-to-right. It builds complex operations from small, testable, reusable functions.`,code:`// Basic compose (right-to-left)
function compose<T>(
  ...fns: Array<(arg: T) => T>
): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

// Pipe (left-to-right, more readable)
function pipe<T>(
  ...fns: Array<(arg: T) => T>
): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Small, reusable transformation functions
const trim = (s: string): string => s.trim();
const toLowerCase = (s: string): string => s.toLowerCase();
const replaceSpaces = (s: string): string => s.replace(/\\s+/g, "-");
const removeSpecialChars = (s: string): string =>
  s.replace(/[^a-z0-9-]/g, "");

// Compose them into a slug generator
const slugify = pipe(trim, toLowerCase, replaceSpaces, removeSpecialChars);

console.log(slugify("  Hello World! FP is Great  "));
// "hello-world-fp-is-great"

// Numeric pipeline example
const double = (n: number): number => n * 2;
const addOne = (n: number): number => n + 1;
const square = (n: number): number => n * n;

const transform = pipe(double, addOne, square);
console.log(transform(3)); // square(addOne(double(3))) = square(7) = 49

// Async composition
function pipeAsync<T>(
  ...fns: Array<(arg: T) => T | Promise<T>>
): (arg: T) => Promise<T> {
  return (arg: T) =>
    fns.reduce<Promise<T>>(
      (chain, fn) => chain.then(fn),
      Promise.resolve(arg),
    );
}`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`JavaScript`,topicId:`js-functional`,tags:[`composition`,`pipe`,`compose`,`data pipelines`,`point-free`],commonMistakes:[`Mixing up compose (right-to-left) and pipe (left-to-right) ordering, leading to functions applied in the wrong sequence`,`Trying to compose functions with mismatched signatures — the output type of one must match the input type of the next`,`Over-composing trivial operations where a simple function body would be clearer`],followUps:[`What is the TC39 pipe operator proposal and how would it change composition in JavaScript?`,`How do you compose async functions or functions that return Promises?`,`What is point-free style and how does it relate to composition?`],interviewTips:[`Implement both compose and pipe from scratch using reduce/reduceRight to demonstrate you understand the mechanics`,`Use a real-world example like a slug generator or data sanitization pipeline to make the concept tangible`]},{id:`js-fp-7`,question:`Explain higher-order functions with practical examples.`,answer:`A higher-order function (HOF) is a function that either takes one or more functions as arguments, returns a function, or both. This is possible in JavaScript because functions are first-class citizens — they can be stored in variables, passed as arguments, and returned from other functions just like any other value.

The most common higher-order functions in JavaScript are the built-in array methods: map, filter, reduce, sort, forEach, find, some, and every. Each of these accepts a callback function that defines the specific behavior. The HOF provides the iteration structure while the callback provides the logic. This separation of concerns is a hallmark of functional design.

Returning functions is equally important and enables powerful patterns. Function factories create specialized functions from general templates — for example, a createValidator(rule) that returns a validation function. Closures make this possible: the returned function "closes over" the arguments and variables of the outer function, retaining access to them even after the outer function has returned. Decorators and middleware are higher-order functions that wrap existing functions with additional behavior like logging, timing, error handling, or access control.

In React, higher-order functions are pervasive. Higher-order components (HOCs) like connect() from Redux and withRouter() from React Router are functions that accept a component and return an enhanced component. Custom hooks that return callback functions are another form. Event handler factories that produce handlers parameterized by item IDs or field names are everyday HOFs.

Higher-order functions promote the Open/Closed principle — functions are open for extension (by passing different callbacks) but closed for modification. They reduce code duplication by abstracting common patterns into reusable utilities. The key to writing good HOFs is keeping them generic: they should handle the structural pattern and delegate specific behavior to the functions they receive.`,shortAnswer:`A higher-order function takes a function as an argument, returns a function, or both. Array methods like map/filter/reduce, event handler factories, decorators, and React higher-order components are all common examples. They enable code reuse by separating structure from behavior.`,code:`// HOF that takes a function as argument
function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
): () => Promise<T> {
  return async () => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === retries - 1) throw error;
      }
    }
    throw new Error("Unreachable");
  };
}

const fetchData = withRetry(() => fetch("/api/data").then((r) => r.json()));

// HOF that returns a function (factory pattern)
function createMultiplier(factor: number): (value: number) => number {
  return (value: number) => value * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// Decorator / wrapper HOF
function withLogging<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  label: string,
): (...args: Args) => R {
  return (...args: Args): R => {
    console.log(\\\`[\\\${label}] Called with:\\\`, args);
    const result = fn(...args);
    console.log(\\\`[\\\${label}] Returned:\\\`, result);
    return result;
  };
}

const add = (a: number, b: number): number => a + b;
const loggedAdd = withLogging(add, "add");
loggedAdd(2, 3); // logs call and result, returns 5

// Practical: event handler factory in React
function handleFieldChange(
  setState: (update: Record<string, string>) => void,
) {
  return (field: string) =>
    (e: { target: { value: string } }) =>
      setState({ [field]: e.target.value });
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functional`,tags:[`higher-order functions`,`closures`,`decorators`,`function factories`,`HOC`],commonMistakes:[`Creating new function instances on every render in React by defining arrow functions inline — use useCallback or extract the HOF to a stable reference`,`Losing the function name and stack trace information when wrapping with HOFs — use Object.defineProperty to preserve the original name for debugging`,`Overusing HOFs where simple code would suffice — not every function needs to be wrapped in a factory`],followUps:[`How do higher-order components differ from custom hooks in React?`,`How would you type a generic higher-order function in TypeScript?`,`What is the decorator pattern and how do higher-order functions implement it?`],interviewTips:[`Show both directions — a HOF that receives a function (like withRetry) and one that returns a function (like createMultiplier) — to demonstrate full understanding`]},{id:`js-fp-8`,question:`What are side effects and how do they relate to functional programming?`,answer:`A side effect is any observable change that a function makes to the world outside its own scope, beyond returning a value. This includes modifying global or external variables, writing to the DOM, making network requests, reading from or writing to a database, logging to the console, setting timers, throwing exceptions, and mutating input arguments. In functional programming, side effects are considered the source of complexity and bugs, and the goal is to isolate and manage them carefully.

Pure functional programming aims to separate pure computation from side effects entirely. The pure core of your application handles all data transformation and business logic, while a thin imperative shell at the boundaries handles I/O and state mutations. This "functional core, imperative shell" architecture (sometimes called "ports and adapters" or "hexagonal architecture") makes the core logic easy to test, reason about, and reuse, because it has no dependencies on external systems.

In JavaScript, you cannot avoid side effects entirely — a program that does nothing observable is useless. The goal is to push side effects to the edges. For example, instead of a function that fetches data and transforms it, split it into a pure transformation function and a separate function that handles the fetch. The transformation function is easy to test with static input; the fetch function is a thin integration point that can be tested separately.

React's model is built around this principle. Component render functions should be pure — given the same props and state, they return the same JSX. Side effects are explicitly separated into useEffect hooks, event handlers, and external state managers. This separation is what allows React's concurrent rendering features (like Suspense and transitions) to work, because React can call render functions multiple times, discard results, or defer them without risking uncontrolled side effects.

Common strategies for managing side effects include the Command pattern (returning descriptions of effects rather than performing them), monadic patterns (wrapping effects in containers like Promises or Observables), dependency injection (passing I/O functions as arguments so they can be replaced in tests), and dedicated side-effect libraries like Redux-Saga or RxJS that model effects as declarative data structures.`,shortAnswer:`Side effects are observable interactions with the outside world — DOM changes, network calls, mutations, logging. Functional programming isolates side effects at system boundaries, keeping the core logic pure and testable. React enforces this by making renders pure and routing side effects through useEffect.`,code:`// IMPURE: side effects mixed with logic
let total = 0;
function addToTotal(amount: number): void {
  total += amount;               // mutation of external state
  console.log(\\\`Total: \\\${total}\\\`); // I/O side effect
  document.title = \\\`\\\${total}\\\`;   // DOM side effect
}

// PURE CORE: separated from side effects
function calculateNewTotal(current: number, amount: number): number {
  return current + amount;
}

function formatTotal(total: number): string {
  return \\\`Total: \\\${total}\\\`;
}

// IMPERATIVE SHELL: handles side effects at the boundary
function handleAddToTotal(amount: number): void {
  total = calculateNewTotal(total, amount);
  console.log(formatTotal(total));
  document.title = String(total);
}

// React example: pure render + effect separation
/*
function Cart({ items }: { items: CartItem[] }) {
  // Pure computation
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const formatted = formatCurrency(total);

  // Side effects isolated in useEffect
  useEffect(() => {
    document.title = \\\`Cart (\\\${items.length})\\\`;
    analytics.track("cart_viewed", { total });
  }, [items, total]);

  // Pure render output
  return <div>{formatted}</div>;
}
*/

// Command pattern: describe effects instead of performing them
type Effect =
  | { type: "LOG"; message: string }
  | { type: "FETCH"; url: string }
  | { type: "SET_TITLE"; title: string };

function planEffects(total: number): Effect[] {
  return [
    { type: "LOG", message: formatTotal(total) },
    { type: "SET_TITLE", title: String(total) },
  ];
}

function executeEffects(effects: Effect[]): void {
  effects.forEach((effect) => {
    switch (effect.type) {
      case "LOG":
        console.log(effect.message);
        break;
      case "SET_TITLE":
        document.title = effect.title;
        break;
      case "FETCH":
        fetch(effect.url);
        break;
    }
  });
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-functional`,tags:[`side effects`,`purity`,`functional core`,`imperative shell`,`useEffect`],commonMistakes:[`Performing side effects inside React render functions or useMemo callbacks, which can fire multiple times unpredictably in concurrent mode`,`Assuming that "no side effects" means "no state changes" — reading from a variable that could change between calls is also a form of impurity`,`Treating all side effects as equally dangerous — logging is less risky than mutating shared state; the key is knowing which effects to isolate strictly`],followUps:[`What is the "functional core, imperative shell" architecture and how would you apply it to a Node.js API?`,`How does React's concurrent rendering depend on pure render functions?`,`What patterns do libraries like Redux-Saga use to manage side effects declaratively?`],interviewTips:[`Show the refactoring from an impure function to a pure-core + effect-shell split — this demonstrates practical FP thinking rather than just theory`,`Mention React's useEffect as a concrete example of side-effect isolation that every React developer will recognize`]}]}],o=[{id:`js-events`,title:`Event Handling`,description:`Master JavaScript event handling including event listeners, propagation phases, delegation patterns, and the Event API for building interactive web applications.`,category:`JavaScript`,difficulty:`Intermediate`,tags:[`events`,`event handling`,`addEventListener`,`event bubbling`,`event capturing`,`event delegation`,`DOM events`,`event propagation`],overview:`Event handling is the backbone of interactive web development. JavaScript uses an event-driven programming model where the browser fires events in response to user interactions, network activity, timers, and DOM mutations. Understanding how events propagate through the DOM tree—capturing down, then bubbling up—is critical for writing efficient, bug-free UI code. Patterns like event delegation leverage propagation to handle events on many child elements with a single listener, dramatically improving performance and simplifying dynamic content management.`,concepts:[`Event bubbling and capturing phases`,`The EventTarget interface and addEventListener API`,`Event propagation and the three-phase model`,`Event delegation for dynamic and list-based UIs`,`stopPropagation vs stopImmediatePropagation vs preventDefault`,`The Event object and its key properties`,`Removing event listeners and avoiding memory leaks`,`Inline handlers vs DOM property handlers vs addEventListener`,`Passive event listeners and scroll performance`,`Custom events with CustomEvent constructor`],relatedTopicIds:[`js-dom`,`js-closures`,`js-async`],questions:[{id:`js-events-1`,question:`Explain event bubbling and capturing in JavaScript.`,answer:"Event bubbling and capturing are the two directional phases of event propagation in the DOM. When an event occurs on an element, the browser does not simply fire the handler on that element alone—it walks the entire ancestor chain in a well-defined order described by the DOM Level 2 Events specification.\n\nDuring the **capturing phase** (phase 1), the event travels from the `window` object down through every ancestor element until it reaches the target element. Any listener registered with `{ capture: true }` (or the legacy third argument `true`) fires during this phase. Capturing is rarely used in everyday code but is essential when you need to intercept an event before it reaches its target—for example, to implement focus trapping in a modal dialog.\n\nDuring the **target phase** (phase 2), the event has arrived at the element that originally dispatched it. Listeners on the target fire regardless of whether they were registered for capture or bubble.\n\nDuring the **bubbling phase** (phase 3), the event travels back up from the target through its ancestors to the `window`. This is the default phase, and most listeners fire here. Bubbling is what makes event delegation possible: a single listener on a parent can respond to events from any of its descendants.\n\nNot every event bubbles. Events like `focus`, `blur`, `load`, `unload`, `scroll`, and `mouseenter`/`mouseleave` do not bubble by default. Their bubbling counterparts (`focusin`/`focusout`, for example) exist specifically for delegation scenarios. Understanding which events bubble is critical for choosing the right delegation strategy.",shortAnswer:`Capturing travels from the window down to the target element, while bubbling travels from the target back up to the window. Together with the target phase they form the three phases of DOM event propagation. Most listeners fire during the bubbling phase by default.`,code:`// HTML: <div id="outer"><button id="inner">Click</button></div>

const outer = document.getElementById("outer")!;
const inner = document.getElementById("inner")!;

// Capturing listener (fires first)
outer.addEventListener(
  "click",
  () => console.log("outer – capture"),
  { capture: true }
);

// Bubbling listener (fires last)
outer.addEventListener(
  "click",
  () => console.log("outer – bubble")
);

// Target listeners fire in registration order
inner.addEventListener(
  "click",
  () => console.log("inner – capture"),
  { capture: true }
);
inner.addEventListener(
  "click",
  () => console.log("inner – bubble")
);

// Clicking the button logs:
// "outer – capture"
// "inner – capture"
// "inner – bubble"
// "outer – bubble"`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`bubbling`,`capturing`,`event propagation`],commonMistakes:[`Assuming all events bubble—events like focus, blur, mouseenter, and mouseleave do not bubble.`,`Forgetting that at the target phase, capture and bubble listeners fire in registration order, not phase order.`,`Using the legacy boolean third argument to addEventListener without realizing true means capture.`],followUps:[`How would you stop an event from propagating further?`,`What is the difference between stopPropagation and stopImmediatePropagation?`,`Which common events do NOT bubble?`],interviewTips:[`Draw the three-phase diagram (capture → target → bubble) on a whiteboard to visually demonstrate the concept.`,`Mention real-world use cases: capturing for focus traps, bubbling for delegation.`]},{id:`js-events-2`,question:`What is event delegation? Why is it useful?`,answer:"Event delegation is a pattern where you attach a single event listener to a common ancestor element instead of attaching individual listeners to every child element. It relies on the bubbling phase of event propagation: when a child element fires an event, that event bubbles up through the DOM, and the ancestor's listener can inspect `event.target` to determine which child was the actual source.\n\nThe primary benefit is **performance**. Imagine a list with 1,000 items. Without delegation you would attach 1,000 click listeners—one per item—consuming memory and slowing down initial render. With delegation, a single listener on the `<ul>` handles clicks on every `<li>`. This also reduces the cost of adding or removing items because you never need to attach or detach per-item listeners.\n\nA second major benefit is **dynamic content handling**. If new items are added to the DOM after the initial render (for example, via an infinite scroll or AJAX load), those items automatically participate in the delegated listener without any extra wiring. This is why virtually every major framework and library—React's synthetic event system, jQuery's `.on()` with a selector—uses delegation internally.\n\nWhen implementing delegation, you typically check `event.target` or use `event.target.closest(selector)` to match the element you care about. The `closest()` approach is more robust because it handles cases where the click lands on a nested child (like a `<span>` inside a `<button>`). You should also be aware that not all events bubble, so delegation only works with bubbling events (or their bubbling equivalents like `focusin` instead of `focus`).\n\nOne caveat is that delegation can make debugging harder because the listener lives far from the element it conceptually belongs to. Use clear selector checks and descriptive comments to maintain readability.",shortAnswer:`Event delegation attaches a single listener to a parent element and uses event.target to identify which child triggered the event. It improves performance by reducing the number of listeners, and automatically handles dynamically added elements because events bubble up through the DOM.`,code:`// Instead of adding a listener to every <li>:
const list = document.getElementById("todo-list")!;

list.addEventListener("click", (event: Event) => {
  const target = (event.target as HTMLElement).closest<HTMLLIElement>("li");
  if (!target || !list.contains(target)) return;

  const taskId = target.dataset.taskId;
  console.log(\`Clicked task: \${taskId}\`);
  target.classList.toggle("completed");
});

// Works even for items added later:
const newItem = document.createElement("li");
newItem.dataset.taskId = "42";
newItem.textContent = "New dynamic task";
list.appendChild(newItem); // click handler already covers it`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`event delegation`,`performance`,`bubbling`],commonMistakes:[`Checking only event.target without using closest(), which fails when the click lands on a nested child element inside the intended target.`,`Trying to delegate events that do not bubble, such as focus or blur, instead of using their bubbling equivalents focusin and focusout.`,`Forgetting to guard against targets outside the container with a contains() check.`],followUps:[`How does React's synthetic event system relate to event delegation?`,`When would delegation be a poor choice compared to direct listeners?`,`How do you delegate keyboard events like Enter on list items?`],interviewTips:[`Emphasize both performance gains and dynamic-content benefits—interviewers look for awareness of both.`,`Mention closest() as the modern best practice for target matching.`]},{id:`js-events-3`,question:`What is the difference between stopPropagation() and preventDefault()?`,answer:'These two methods solve completely different problems and are frequently confused. `stopPropagation()` controls **event flow through the DOM tree**, while `preventDefault()` controls the **browser\'s default behavior** associated with an event.\n\n`event.stopPropagation()` prevents the event from continuing to the next element in the propagation chain. If called during the capturing phase, the event never reaches the target or the bubbling phase. If called during bubbling, ancestors further up the tree never see the event. A more aggressive variant, `stopImmediatePropagation()`, also prevents other listeners on the **same** element from firing. Use `stopPropagation()` sparingly—it can silently break delegation listeners, analytics trackers, and third-party scripts that depend on events reaching the document.\n\n`event.preventDefault()` tells the browser not to perform the action it normally associates with the event. For example, calling it on a `submit` event prevents the form from navigating; on a `click` event of an `<a>` tag it prevents navigation; on a `keydown` event it can prevent a character from being typed. Importantly, `preventDefault()` does **not** stop propagation—the event continues to bubble or capture normally. You can check whether default was prevented via `event.defaultPrevented`.\n\nA practical scenario: in a form with nested delegated listeners, you might call `preventDefault()` on the submit event to handle submission via fetch, while deliberately not calling `stopPropagation()` so that an analytics listener on a parent element can still log the submission. Conversely, in a modal overlay, you might `stopPropagation()` on a click inside the modal to prevent a document-level listener from closing it, while not needing `preventDefault()` because clicks on a `<div>` have no default behavior.\n\nReturning `false` from an inline HTML event handler (`onclick="return false"`) calls both `preventDefault()` and `stopPropagation()`, which is one reason inline handlers are discouraged—the behavior is less explicit and harder to reason about.',shortAnswer:`stopPropagation() stops the event from traveling further through the DOM tree (capture or bubble), while preventDefault() cancels the browser's default action for that event (like form submission or link navigation). They are independent—using one does not imply the other.`,code:`// preventDefault: stop form submission but let event bubble
const form = document.getElementById("login-form") as HTMLFormElement;
form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault(); // no page reload
  const data = new FormData(form);
  fetch("/api/login", { method: "POST", body: data });
  // event still bubbles — analytics listeners above will fire
});

// stopPropagation: keep click inside modal from closing overlay
const modal = document.getElementById("modal")!;
const overlay = document.getElementById("overlay")!;

modal.addEventListener("click", (event: MouseEvent) => {
  event.stopPropagation(); // overlay listener won't fire
});

overlay.addEventListener("click", () => {
  overlay.classList.add("hidden"); // closes only on overlay click
});`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`stopPropagation`,`preventDefault`,`event flow`],commonMistakes:[`Believing preventDefault() also stops propagation—it does not; the event continues through the DOM.`,`Overusing stopPropagation(), which silently breaks event delegation, analytics, and third-party integrations.`,`Confusing the behavior of returning false in inline handlers (which does both) with returning false in addEventListener callbacks (which does neither).`],followUps:[`What does stopImmediatePropagation() do differently from stopPropagation()?`,`How can you check if preventDefault() was already called on an event?`,`Why is returning false from an addEventListener callback not equivalent to preventDefault()?`],interviewTips:[`Clearly separate the two concepts: one is about DOM tree traversal, the other is about browser defaults. Interviewers specifically watch for conflation.`]},{id:`js-events-4`,question:`How does addEventListener work? What are its parameters?`,answer:'The `addEventListener` method is defined on the `EventTarget` interface, which is implemented by all DOM nodes, the `window` object, and several non-DOM objects like `XMLHttpRequest` and `WebSocket`. Its signature is `target.addEventListener(type, listener, options?)`, and it registers a callback to be invoked whenever the specified event type is dispatched on the target.\n\nThe **first parameter** (`type`) is a string identifying the event, such as `"click"`, `"keydown"`, or `"submit"`. Event names are case-sensitive—`"Click"` will not match a native click event.\n\nThe **second parameter** (`listener`) is a callback function or an object implementing the `EventListener` interface (i.e., an object with a `handleEvent` method). Using the object form is useful when you need to share state across handler invocations or cleanly remove the listener, because the same object reference serves as the identity for removal.\n\nThe **third parameter** is either a boolean or an options object. The boolean form is legacy: passing `true` registers the listener for the capturing phase, `false` (the default) for bubbling. The options object is the modern approach and accepts three properties: `capture` (boolean, same as the legacy flag), `once` (boolean, if `true` the listener is automatically removed after it fires once), and `passive` (boolean, if `true` the listener promises not to call `preventDefault()`, allowing the browser to optimize scrolling performance).\n\nUnlike the older `onclick` property approach, `addEventListener` allows multiple listeners for the same event on the same element. Listeners are called in the order they were registered. If you register the exact same function reference with the same capture flag on the same target, the duplicate is silently ignored—this is a spec-mandated deduplication.\n\nOne subtle detail: the options object is not compared for equality beyond the `capture` flag when checking for duplicates. Two calls with `{ capture: false, passive: true }` and `{ capture: false, once: true }` using the same function reference still result in a single registration.',shortAnswer:`addEventListener(type, listener, options?) registers an event handler on any EventTarget. The third parameter can be a boolean for capture, or an options object with capture, once, and passive flags. Unlike DOM property handlers, it supports multiple listeners per event and gives fine-grained control over propagation phase and performance.`,code:`// Basic usage
const button = document.getElementById("btn")!;

function handleClick(event: MouseEvent): void {
  console.log("Button clicked at", event.clientX, event.clientY);
}

// Register for bubbling phase (default)
button.addEventListener("click", handleClick);

// Register with options
button.addEventListener("click", handleClick, {
  capture: false,
  once: true,     // auto-removes after first invocation
  passive: true,  // promises not to call preventDefault()
});

// Using EventListener interface (object form)
const counter = {
  count: 0,
  handleEvent(event: Event): void {
    this.count++;
    console.log(\`Clicked \${this.count} times\`);
  },
};
button.addEventListener("click", counter);

// Removal requires the same reference and capture flag
button.removeEventListener("click", handleClick);`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`addEventListener`,`EventTarget`,`event options`],commonMistakes:[`Using an anonymous function and then being unable to remove it later because you have no reference to pass to removeEventListener.`,`Forgetting that the capture flag must match between addEventListener and removeEventListener for removal to work.`,`Not using the passive flag on touch/wheel listeners, causing scroll jank on mobile devices.`],followUps:[`What is the EventListener interface's object form, and when is it useful?`,`How does the once option work internally?`,`Why does the passive flag improve scroll performance?`],interviewTips:[`Mention the options object (once, passive, capture) over the legacy boolean—it shows you stay current with the API.`,`Highlight the deduplication behavior: registering the same function reference twice is a no-op.`]},{id:`js-events-5`,question:`What is event propagation? Describe its phases.`,answer:"Event propagation is the mechanism by which the browser determines the order in which event listeners are notified when an event occurs on a DOM element. The DOM Level 2 Events specification defines three distinct phases, and every dispatched event traverses them in sequence.\n\n**Phase 1 — Capturing (CAPTURING_PHASE, numeric value 1):** The event starts at the `window` and travels down through `document`, `<html>`, `<body>`, and each successive ancestor until it reaches the parent of the target element. Listeners registered with `{ capture: true }` fire during this phase. Capturing is the first opportunity to intercept an event, which is useful for implementing global shortcuts or access control.\n\n**Phase 2 — Target (AT_TARGET, numeric value 2):** The event has arrived at the element on which the event was originally dispatched. During this phase, both capture and bubble listeners on the target fire in their registration order. You can identify this phase by checking `event.eventPhase === 2`. The distinction between capture and bubble semantics disappears at the target itself.\n\n**Phase 3 — Bubbling (BUBBLING_PHASE, numeric value 3):** The event reverses direction and travels back up from the target's parent through every ancestor to the `window`. Listeners registered without the capture flag (the default) fire during this phase. Bubbling is what enables event delegation—the most common and powerful pattern in DOM event handling.\n\nYou can inspect which phase an event is in at any point by reading `event.eventPhase`. You can halt propagation at any phase using `stopPropagation()` or `stopImmediatePropagation()`. Note that `preventDefault()` does not affect propagation—it only cancels the browser's default action.\n\nSome events are specified as non-bubbling: `focus`, `blur`, `load`, `unload`, `mouseenter`, `mouseleave`, and `resize` among others. For these, only the capturing and target phases occur. The spec provides bubbling equivalents for common cases (`focusin`/`focusout`) to enable delegation.",shortAnswer:`Event propagation has three phases: capturing (window down to target's parent), target (the element itself), and bubbling (target's parent back up to window). Listeners fire in phase order, and you can control this via the capture option in addEventListener. Not all events bubble.`,code:`const outer = document.getElementById("outer")!;
const middle = document.getElementById("middle")!;
const inner = document.getElementById("inner")!;

function logPhase(event: Event): void {
  const phaseNames = ["NONE", "CAPTURING", "AT_TARGET", "BUBBLING"];
  const el = (event.currentTarget as HTMLElement).id;
  console.log(\`\${el}: \${phaseNames[event.eventPhase]}\`);
}

// Register both phases on every element
[outer, middle, inner].forEach((el) => {
  el.addEventListener("click", logPhase, { capture: true });
  el.addEventListener("click", logPhase);
});

// Clicking #inner logs:
// outer: CAPTURING
// middle: CAPTURING
// inner: AT_TARGET      (capture listener)
// inner: AT_TARGET      (bubble listener)
// middle: BUBBLING
// outer: BUBBLING`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`event propagation`,`capturing`,`bubbling`,`target phase`],commonMistakes:[`Forgetting that at the target phase, capture and bubble listeners fire in registration order—not capture-first.`,`Assuming every event goes through all three phases—non-bubbling events skip the bubbling phase entirely.`,`Confusing event.target (the original element) with event.currentTarget (the element whose listener is firing).`],followUps:[`How can you determine which phase an event is currently in?`,`What is the difference between event.target and event.currentTarget?`,`Name three events that do not bubble.`],interviewTips:[`Use the numeric phase values (1, 2, 3) and their constant names—it shows precise knowledge of the spec.`]},{id:`js-events-6`,question:`How do you remove an event listener properly?`,answer:"Removing an event listener requires calling `removeEventListener` with the exact same arguments used during registration: the same event type string, the same function reference, and the same capture flag. Getting any of these wrong results in a silent no-op—no error is thrown, and the listener remains active. This is one of the most common sources of memory leaks in long-lived single-page applications.\n\nThe most frequent mistake is using anonymous functions or arrow functions directly in `addEventListener`. Since each anonymous function creates a new reference, you can never pass the same reference to `removeEventListener`. The solution is to store the handler in a named variable or use the `{ once: true }` option if the listener should fire only once.\n\nThe capture flag must match between registration and removal. If you registered with `{ capture: true }` and try to remove without the capture flag, the listener will not be removed. The other options (`once`, `passive`) are ignored during the removal comparison—only `capture` matters.\n\nFor class-based components or objects, a common pattern is binding methods in the constructor and storing the bound reference: `this.handleClick = this.handleClick.bind(this)`. Without this, each call to `.bind()` creates a new function reference, making removal impossible. Alternatively, using the `EventListener` interface object form (`{ handleEvent }`) avoids binding issues entirely because the object reference itself is stable.\n\nModern code increasingly uses `AbortController` for listener cleanup. You pass the controller's `signal` in the options, and calling `controller.abort()` removes all listeners associated with that signal in one shot. This is especially powerful for components with many listeners or for cleanup in framework lifecycle hooks.",shortAnswer:`Call removeEventListener with the same event type, the same function reference, and the same capture flag used in addEventListener. Anonymous functions cannot be removed because each creates a new reference. Modern best practice is to use AbortController signals or the once option for automatic cleanup.`,code:`// ❌ WRONG: anonymous function cannot be removed
const btn = document.getElementById("btn")!;
btn.addEventListener("click", () => console.log("clicked"));
btn.removeEventListener("click", () => console.log("clicked")); // no-op

// ✅ CORRECT: named function reference
function handleClick(): void {
  console.log("clicked");
}
btn.addEventListener("click", handleClick);
btn.removeEventListener("click", handleClick); // works

// ✅ Modern: AbortController for bulk cleanup
const controller = new AbortController();

btn.addEventListener("click", handleClick, {
  signal: controller.signal,
});
window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") console.log("escape pressed");
}, { signal: controller.signal });

// Remove ALL listeners tied to this controller at once
controller.abort();

// ✅ One-shot listener with { once: true }
btn.addEventListener("click", handleClick, { once: true });`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`removeEventListener`,`AbortController`,`memory leaks`,`cleanup`],commonMistakes:[`Using anonymous or inline arrow functions with addEventListener and then attempting to remove them—this always fails silently.`,`Forgetting to match the capture flag during removal, which causes the listener to remain active.`,`Calling .bind(this) in both addEventListener and removeEventListener, creating two different references.`],followUps:[`How does AbortController simplify listener cleanup in component lifecycles?`,`What memory leak risks exist if listeners are never removed in a single-page app?`,`How does the EventListener object form help with removal?`],interviewTips:[`Mention AbortController as the modern cleanup pattern—many interviewers are not yet aware of it, and it demonstrates up-to-date knowledge.`]},{id:`js-events-7`,question:`What is the Event object? What are its important properties?`,answer:'Every time an event fires, the browser creates an Event object (or a subclass like `MouseEvent`, `KeyboardEvent`, `SubmitEvent`, etc.) and passes it as the sole argument to the listener callback. This object contains all the metadata about the event: what happened, where it happened, which element dispatched it, and the current state of propagation.\n\nThe most fundamental properties are `event.type` (the event name string like `"click"`), `event.target` (the element that originally dispatched the event), and `event.currentTarget` (the element whose listener is currently executing). The distinction between `target` and `currentTarget` is critical for delegation: `target` is the deepest element clicked, while `currentTarget` is the delegating ancestor.\n\n`event.eventPhase` returns a number (1 for capturing, 2 for at-target, 3 for bubbling) indicating the current propagation phase. `event.bubbles` indicates whether the event will bubble. `event.cancelable` indicates whether `preventDefault()` will have any effect. `event.defaultPrevented` is `true` if `preventDefault()` has already been called.\n\nSubclass-specific properties provide richer context. `MouseEvent` adds `clientX`/`clientY` (viewport coordinates), `pageX`/`pageY` (document coordinates), `button` (which mouse button), and modifier flags (`shiftKey`, `ctrlKey`, `altKey`, `metaKey`). `KeyboardEvent` adds `key` (the logical key value like `"Enter"`), `code` (the physical key like `"KeyA"`), and `repeat` (whether the key is being held). `InputEvent` adds `data` (the inserted text) and `inputType` (like `"insertText"` or `"deleteContentBackward"`).\n\n`event.timeStamp` provides a high-resolution timestamp (in milliseconds since the page load origin) useful for measuring interaction latency or debouncing. `event.isTrusted` distinguishes real user actions (`true`) from programmatically dispatched events (`false`), which is relevant for security-sensitive logic. `event.composedPath()` returns the full propagation path including shadow DOM boundaries, which is important in web component architectures.',shortAnswer:`The Event object is passed to every listener and contains metadata like type, target (originating element), currentTarget (listening element), eventPhase, and methods like preventDefault() and stopPropagation(). Subclasses like MouseEvent and KeyboardEvent add context-specific properties such as coordinates, keys, and modifier flags.`,code:`document.addEventListener("click", (event: MouseEvent) => {
  // Core Event properties
  console.log("Type:", event.type);                  // "click"
  console.log("Target:", event.target);              // element clicked
  console.log("CurrentTarget:", event.currentTarget);// document
  console.log("Phase:", event.eventPhase);           // 3 (bubbling)
  console.log("Bubbles:", event.bubbles);            // true
  console.log("Cancelable:", event.cancelable);      // true
  console.log("Trusted:", event.isTrusted);          // true for real clicks
  console.log("Timestamp:", event.timeStamp);        // ms since origin

  // MouseEvent-specific properties
  console.log("Coordinates:", event.clientX, event.clientY);
  console.log("Button:", event.button);              // 0=left, 1=middle, 2=right
  console.log("Modifiers:", {
    shift: event.shiftKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    meta: event.metaKey,
  });

  // Propagation path (includes shadow DOM)
  console.log("Path:", event.composedPath());
});

// KeyboardEvent example
document.addEventListener("keydown", (event: KeyboardEvent) => {
  console.log("Key:", event.key);     // "Enter", "a", "Shift"
  console.log("Code:", event.code);   // "Enter", "KeyA", "ShiftLeft"
  console.log("Repeat:", event.repeat);
});`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`Event object`,`MouseEvent`,`KeyboardEvent`,`event properties`],commonMistakes:[`Confusing event.target with event.currentTarget—target is the originating element, currentTarget is the element whose listener is running.`,`Using the deprecated event.keyCode or event.which instead of the modern event.key and event.code properties.`,`Assuming event.isTrusted is true for programmatically dispatched events—it is always false for synthetic events.`],followUps:[`What is the difference between clientX/clientY and pageX/pageY?`,`How does composedPath() behave with Shadow DOM?`,`When would you check event.isTrusted in production code?`],interviewTips:[`Mention the distinction between key (logical) and code (physical) on KeyboardEvent—this shows awareness of internationalization concerns.`]},{id:`js-events-8`,question:`Compare inline event handlers, DOM property handlers, and addEventListener.`,answer:'JavaScript offers three mechanisms for attaching event handlers to DOM elements, each with distinct capabilities and trade-offs. Understanding all three is important because legacy codebases use all of them, and knowing the limitations of older approaches explains why `addEventListener` became the standard.\n\n**Inline HTML handlers** (e.g., `<button onclick="handleClick()">`) embed JavaScript directly in the HTML attribute. The code runs in a special scope chain that includes the element itself and `document`—a legacy quirk that can cause subtle bugs. Only one handler can exist per event per element; setting a new `onclick` attribute replaces the previous one. Inline handlers also violate separation of concerns, interfere with Content Security Policy (CSP), and implicitly call `preventDefault()` when they return `false`. They are universally discouraged in modern development.\n\n**DOM property handlers** (e.g., `element.onclick = function() {}`) assign a function to a property on the DOM node. This is cleaner than inline HTML because the JavaScript lives in script files, but it shares the same single-handler limitation: assigning a new function to `onclick` replaces the previous handler. There is no way to register multiple click listeners, no control over the propagation phase, and no `once`/`passive` options. The handler always fires during the bubbling phase (or at target).\n\n**addEventListener** is the modern, spec-compliant approach and the one you should use in virtually all cases. It supports multiple listeners for the same event on the same element, provides control over the propagation phase via the `capture` option, supports `once` for auto-removal, `passive` for scroll performance optimization, and `signal` for bulk cleanup via `AbortController`. Listeners fire in registration order and can be precisely removed with `removeEventListener`.\n\nA hybrid quirk worth noting: if both a DOM property handler and `addEventListener` listeners exist on the same element for the same event, the property handler behaves as if it were registered via `addEventListener` at the time the property was set—so ordering can be surprising. The property handler is effectively just another listener in the bubbling queue, but it can be replaced by reassigning the property.',shortAnswer:`Inline handlers are HTML attributes limited to one handler per event and violate CSP and separation of concerns. DOM property handlers (element.onclick) also support only one handler per event. addEventListener is the modern standard: it supports multiple listeners, capture/bubble control, once, passive, and AbortController cleanup.`,code:`// 1. Inline HTML handler (avoid)
// <button onclick="alert('clicked')">Click</button>
// - one handler per event, violates CSP, implicit scope issues

// 2. DOM property handler (legacy)
const btn = document.getElementById("btn")!;
btn.onclick = (event: MouseEvent) => {
  console.log("first handler");
};
btn.onclick = (event: MouseEvent) => {
  console.log("second handler"); // replaces the first!
};
// Only "second handler" runs on click

// 3. addEventListener (modern, recommended)
function handlerA(event: MouseEvent): void {
  console.log("handler A");
}
function handlerB(event: MouseEvent): void {
  console.log("handler B");
}

btn.addEventListener("click", handlerA);
btn.addEventListener("click", handlerB);
// Both "handler A" and "handler B" run on click

// Advanced options only available with addEventListener
btn.addEventListener("click", handlerA, {
  capture: true,   // fire during capture phase
  once: true,      // auto-remove after first call
  passive: true,   // won't call preventDefault
});`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-events`,tags:[`addEventListener`,`onclick`,`inline handlers`,`event registration`],commonMistakes:[`Using DOM property handlers (element.onclick) in modern code without realizing that only one handler can exist—subsequent assignments silently replace previous ones.`,`Relying on inline HTML handlers which are blocked by strict Content Security Policies and introduce scope chain issues.`,`Not knowing that returning false in an inline handler calls both preventDefault and stopPropagation, while returning false from addEventListener does nothing.`],followUps:[`Why do inline handlers violate Content Security Policy?`,`How does the scope chain differ for inline HTML event handlers?`,`Can you mix DOM property handlers and addEventListener on the same element?`],interviewTips:[`Frame your answer as an evolution: inline → property → addEventListener. This shows historical awareness and makes the recommendation for addEventListener feel natural.`]}]}],s=[{id:`js-errors`,title:`Error Handling`,description:`Master JavaScript error handling including try/catch/finally, custom errors, built-in error types, async error handling, and production-grade error handling patterns.`,category:`JavaScript`,difficulty:`Intermediate`,tags:[`error handling`,`try catch`,`finally`,`throw`,`custom errors`,`Error`,`TypeError`,`ReferenceError`,`RangeError`,`async errors`,`error propagation`],overview:`Error handling is a critical aspect of writing robust JavaScript applications. JavaScript provides the try/catch/finally construct for synchronous error handling, the throw statement for raising exceptions, and a hierarchy of built-in Error types for categorising failures. Modern JavaScript extends these fundamentals with Promise rejection handling and async/await patterns. Understanding error propagation, custom error classes, and defensive coding patterns is essential for building reliable, debuggable software—and is a frequent topic in technical interviews.`,concepts:[`try / catch / finally control flow`,`The throw statement and throwable values`,`Built-in Error types: Error, TypeError, ReferenceError, RangeError, SyntaxError, URIError, EvalError`,`Creating custom error classes by extending Error`,`Error propagation and the call stack`,`Handling errors in Promises and async/await`,`Global error handlers: window.onerror and process.on("uncaughtException")`,`Error handling best practices and patterns`],relatedTopicIds:[`js-promises`,`js-async-await`,`js-classes`],questions:[{id:`js-errors-1`,question:`Explain try, catch, finally and how they work together.`,answer:"The try/catch/finally statement is JavaScript's primary mechanism for handling runtime errors. The `try` block wraps code that might throw an exception. If an exception occurs, execution immediately jumps to the `catch` block, skipping any remaining code in the `try` block. The `catch` block receives the thrown value as its parameter, which is typically an Error object but can technically be any value. The `finally` block, if present, executes unconditionally—whether the try block completes normally, the catch block runs, or even if a return statement is encountered in try or catch.\n\nThe execution order is important to understand. When no error occurs, the try block runs to completion, the catch block is skipped, and the finally block runs. When an error is thrown, execution halts at the throw point in try, the catch block runs with the error value, and then the finally block runs. The finally block is guaranteed to execute regardless of what happens, which makes it ideal for cleanup operations like closing connections, releasing resources, or restoring state.\n\nOne subtle behaviour is how finally interacts with return statements. If both try (or catch) and finally contain return statements, the return value from finally wins. This is because finally runs after try/catch but before the function actually returns. This can lead to surprising bugs if you accidentally return from a finally block, since it silently overrides the value returned by try or catch.\n\nThe catch block is optional when a finally block is present (try/finally without catch), though this is less common. In this pattern, errors still propagate up the call stack after the finally block runs. Modern JavaScript also introduced optional catch binding (ES2019), so you can write `catch { }` without naming the error parameter if you do not need to inspect the thrown value.",shortAnswer:`try wraps code that may throw; catch handles the error if one occurs; finally always executes regardless of outcome. If an error is thrown inside try, execution jumps to catch. The finally block runs after try and catch, even when return statements are present, making it ideal for cleanup logic.`,code:`// Basic try/catch/finally
function parseJSON(jsonString: string): unknown {
  try {
    const result = JSON.parse(jsonString);
    console.log('Parsing succeeded');
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON:', error.message);
    }
    return null;
  } finally {
    console.log('Parse attempt completed');
  }
}

parseJSON('{"valid": true}');
// "Parsing succeeded"
// "Parse attempt completed"

parseJSON('not json');
// "Invalid JSON: Unexpected token..."
// "Parse attempt completed"

// finally overrides return values
function demo(): string {
  try {
    return 'from try';
  } finally {
    return 'from finally'; // This wins!
  }
}
console.log(demo()); // "from finally"

// try/finally without catch — error still propagates
function riskyOperation(): void {
  try {
    throw new Error('something broke');
  } finally {
    console.log('cleanup runs even though error propagates');
  }
}

// Optional catch binding (ES2019)
try {
  JSON.parse('bad');
} catch {
  console.log('parse failed, error details not needed');
}`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-errors`,tags:[`try`,`catch`,`finally`,`error handling`],commonMistakes:[`Returning from a finally block, which silently overrides the return value from try or catch`,`Using a bare catch without checking the error type, leading to swallowed or misidentified errors`,`Forgetting that finally runs even when a return statement is in try or catch`],followUps:[`What happens if both catch and finally throw errors?`,`How does try/catch interact with async code like setTimeout?`,`Can you nest try/catch blocks, and when would you want to?`],interviewTips:[`Demonstrate knowledge of the execution order: try → catch (only on error) → finally (always)`,`Mention the finally-overrides-return gotcha—it shows deeper understanding`],relatedTopics:[`control flow`,`error propagation`,`async/await`]},{id:`js-errors-2`,question:`What are the different built-in Error types in JavaScript?`,answer:'JavaScript defines a base `Error` constructor and several specialised subtypes, each representing a different category of runtime failure. The base `Error` is the generic error type and can be used directly for custom error messages. All error objects share three key properties: `message` (the human-readable description), `name` (the error type name, e.g. "TypeError"), and `stack` (a non-standard but universally supported string containing the call stack trace at the point the error was created).\n\n`TypeError` is thrown when a value is not of the expected type—for example, calling a non-function, accessing a property on null or undefined, or passing an argument of the wrong type to a built-in method. `ReferenceError` occurs when code references a variable that has not been declared in the current scope. `SyntaxError` is raised during parsing when the engine encounters invalid JavaScript syntax, though at runtime you mostly encounter it through `eval()` or `JSON.parse()`. `RangeError` indicates that a numeric value is outside its allowed range, such as creating an Array with a negative length or calling `toFixed()` with a precision greater than 100.\n\n`URIError` is thrown by URI-handling functions like `decodeURIComponent()` when given a malformed URI string. `EvalError` historically related to the `eval()` function but is effectively unused in modern engines; it exists mainly for backward compatibility. There is also `AggregateError` (introduced in ES2021) which holds multiple errors in its `errors` property and is used by `Promise.any()` when all promises reject.\n\nUnderstanding these types matters because you can use `instanceof` checks in catch blocks to handle different error categories differently. This enables precise, targeted error recovery rather than a single catch-all handler. In production code, distinguishing between a `TypeError` (likely a bug) and a network error (likely transient) allows you to choose between logging and retrying, respectively.',shortAnswer:`JavaScript provides Error (generic), TypeError (wrong type), ReferenceError (undeclared variable), SyntaxError (invalid syntax), RangeError (value out of range), URIError (malformed URI), EvalError (legacy), and AggregateError (multiple errors). Each has name, message, and stack properties, and you can use instanceof to differentiate them in catch blocks.`,code:`// TypeError — operating on wrong type
try {
  const obj = null;
  obj.property; // Cannot read properties of null
} catch (e) {
  console.log(e instanceof TypeError); // true
  console.log(e.name);    // "TypeError"
  console.log(e.message); // "Cannot read properties of null (reading 'property')"
}

// ReferenceError — undeclared variable
try {
  console.log(undeclaredVar);
} catch (e) {
  console.log(e instanceof ReferenceError); // true
}

// SyntaxError — invalid JSON
try {
  JSON.parse('{invalid}');
} catch (e) {
  console.log(e instanceof SyntaxError); // true
}

// RangeError — value out of bounds
try {
  const arr = new Array(-1);
} catch (e) {
  console.log(e instanceof RangeError); // true
}

// URIError — malformed URI
try {
  decodeURIComponent('%');
} catch (e) {
  console.log(e instanceof URIError); // true
}

// AggregateError — multiple errors (ES2021)
const promises = [
  Promise.reject(new Error('first')),
  Promise.reject(new Error('second')),
];

Promise.any(promises).catch((e) => {
  console.log(e instanceof AggregateError); // true
  console.log(e.errors.length); // 2
});

// Targeted error handling with instanceof
function safeDivide(a: number, b: number): number {
  try {
    if (typeof a !== 'number') throw new TypeError('a must be a number');
    if (b === 0) throw new RangeError('Division by zero');
    return a / b;
  } catch (error) {
    if (error instanceof RangeError) {
      console.warn('Math error:', error.message);
      return Infinity;
    }
    throw error; // Re-throw unexpected errors
  }
}`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-errors`,tags:[`Error`,`TypeError`,`ReferenceError`,`RangeError`,`SyntaxError`],commonMistakes:[`Assuming all thrown values are Error instances—any value can be thrown, including strings and plain objects`,`Confusing SyntaxError (parse-time) with TypeError (runtime)—SyntaxError at runtime mostly comes from eval or JSON.parse`,`Forgetting that the stack property is non-standard and its format differs between engines`],followUps:[`How does AggregateError work with Promise.any()?`,`Can you create your own error types that extend built-in ones?`],interviewTips:[`Knowing the specific built-in error types and when each occurs signals strong fundamentals`,`Mention the instanceof approach for targeted catch handling to show you write production-quality code`],relatedTopics:[`custom errors`,`instanceof`,`prototype chain`]},{id:`js-errors-3`,question:`How do you create custom error classes in JavaScript?`,answer:"Custom error classes are created by extending the built-in `Error` class (or one of its subtypes). This is the standard approach in modern JavaScript using ES6 class syntax. A custom error class lets you attach domain-specific data to errors, distinguish application errors from generic runtime errors using `instanceof`, and build hierarchies of error types that mirror your application's failure modes.\n\nThe basic pattern involves extending `Error`, calling `super(message)` in the constructor, and setting `this.name` to the class name. Setting the name property is important because it affects how the error appears in stack traces and console output. You can also add custom properties—such as an HTTP status code, an error code, or contextual metadata—that help callers decide how to handle the error. For example, a `ValidationError` might carry a `fields` property listing which form fields failed validation.\n\nThere is a historical gotcha: in transpiled environments (e.g., TypeScript targeting ES5 or Babel), extending built-in classes like Error can break `instanceof` checks because the prototype chain is not correctly set up. The workaround is to explicitly restore the prototype using `Object.setPrototypeOf(this, new.target.prototype)` in the constructor. Modern environments targeting ES6+ do not have this issue, but it is worth knowing for compatibility.\n\nYou can build error hierarchies by extending your own custom error classes. For instance, a base `AppError` class might be extended by `HttpError`, `DatabaseError`, and `ValidationError`. This allows catch blocks to handle broad categories (catch all `AppError` instances) or be specific (catch only `HttpError`). This pattern aligns with how mature backend frameworks and libraries structure their error types and is highly valued in senior-level interviews.",shortAnswer:`Extend the built-in Error class using ES6 class syntax, call super(message) in the constructor, and set this.name to your class name. You can add custom properties like status codes or field lists. This enables instanceof checks for targeted error handling and lets you build error hierarchies for your application.`,code:`// Basic custom error
class ValidationError extends Error {
  readonly fields: string[];

  constructor(message: string, fields: string[]) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
    // Fix prototype chain for transpiled environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Error hierarchy
class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class HttpError extends AppError {
  readonly url: string;

  constructor(message: string, statusCode: number, url: string) {
    super(message, statusCode);
    this.name = 'HttpError';
    this.url = url;
  }
}

class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(\`\${resource} not found\`, 404, '');
    this.name = 'NotFoundError';
  }
}

// Usage with instanceof
function handleRequest(userId: string): void {
  try {
    if (!userId) {
      throw new ValidationError('Invalid input', ['userId']);
    }
    // Simulated lookup
    throw new NotFoundError(\`User \${userId}\`);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed on fields:', error.fields);
    } else if (error instanceof NotFoundError) {
      console.error('Resource missing:', error.message);
    } else if (error instanceof AppError) {
      console.error(\`App error [\${error.statusCode}]: \${error.message}\`);
    } else {
      throw error; // Unknown error, re-throw
    }
  }
}`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`JavaScript`,topicId:`js-errors`,tags:[`custom errors`,`class`,`extends`,`Error`],commonMistakes:[`Forgetting to call super(message) in the constructor, resulting in missing message and stack properties`,`Not setting this.name, which causes stack traces to show "Error" instead of the custom class name`,`Ignoring the prototype chain issue in transpiled code, which breaks instanceof checks`],followUps:[`How do you serialise custom error objects for logging or API responses?`,`What is the difference between operational errors and programmer errors?`,`How does TypeScript's type narrowing work with custom error classes in catch blocks?`],interviewTips:[`Demonstrate a multi-level error hierarchy—it signals production experience and architectural thinking`],relatedTopics:[`ES6 classes`,`prototype chain`,`instanceof`]},{id:`js-errors-4`,question:`What happens if you throw inside a finally block?`,answer:"Throwing inside a `finally` block replaces any error that was already being propagated from the `try` or `catch` block. This is one of the most surprising and dangerous behaviours in JavaScript's error handling model. When an error is thrown in `try`, the runtime holds that error while executing `finally`. If `finally` then throws its own error (or executes a return statement), the original error is silently discarded and the new error from finally becomes the one that propagates up the call stack.\n\nThis means the original error—which is usually the one you actually care about—is completely lost. There is no built-in mechanism to recover it. The original error is not attached to the new error, it does not appear in the stack trace, and there is no way to access it after the fact. This is a well-known pitfall and one reason why many style guides and linters discourage complex logic inside finally blocks.\n\nThe same issue applies to return statements in finally. If try throws an error but finally contains a `return`, the error is swallowed entirely and the function returns the value from finally as if no error occurred. This can mask critical failures in your application and make bugs extremely difficult to diagnose, since the caller has no indication that anything went wrong.\n\nTo avoid these problems, keep finally blocks simple and limited to cleanup operations. If cleanup code in finally might itself fail, wrap it in its own try/catch so that any secondary failure is handled without interfering with the primary error. Some advanced patterns capture the original error in a variable before entering finally, so it can be preserved and logged even if finally encounters its own issues.",shortAnswer:`Throwing inside a finally block replaces any error already being propagated from try or catch—the original error is silently lost. Similarly, a return in finally swallows the pending error entirely. This is why finally blocks should contain only simple cleanup logic and any risky cleanup code should be wrapped in its own try/catch.`,code:`// Original error gets replaced by the finally error
function dangerousFinally(): void {
  try {
    throw new Error('original error');
  } catch (error) {
    console.log('Caught:', (error as Error).message);
    throw error; // Re-throw original
  } finally {
    throw new Error('finally error'); // Replaces original!
  }
}

try {
  dangerousFinally();
} catch (error) {
  // Only "finally error" is caught — "original error" is lost
  console.log((error as Error).message); // "finally error"
}

// Return in finally swallows the error entirely
function returnInFinally(): string {
  try {
    throw new Error('this error disappears');
  } finally {
    return 'no error seen by caller'; // Error is swallowed
  }
}
console.log(returnInFinally()); // "no error seen by caller"

// Safe pattern: protect cleanup in its own try/catch
function safeCleanup(): void {
  let originalError: Error | null = null;

  try {
    throw new Error('operation failed');
  } catch (error) {
    originalError = error as Error;
    throw error;
  } finally {
    try {
      // Cleanup that might fail
      console.log('attempting cleanup...');
      throw new Error('cleanup also failed');
    } catch (cleanupError) {
      console.error('Cleanup error (suppressed):', (cleanupError as Error).message);
      if (originalError) {
        console.error('Original error preserved:', originalError.message);
      }
    }
  }
}`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-errors`,tags:[`finally`,`throw`,`error handling`,`gotchas`],commonMistakes:[`Performing risky operations in finally without wrapping them in try/catch, which can silently replace the original error`,`Using return inside finally without realising it swallows any pending exception`],followUps:[`How do languages like Java handle this situation differently (e.g., suppressed exceptions)?`,`How can you log both the original and the finally error in production code?`],interviewTips:[`This is a classic "gotcha" question—walk through the execution order step by step to show methodical reasoning`,`Mention the safe cleanup pattern with a nested try/catch inside finally`],relatedTopics:[`try/catch/finally`,`error propagation`,`resource cleanup`]},{id:`js-errors-5`,question:`How do you handle errors in async/await code?`,answer:'Async/await error handling builds on the same try/catch mechanism used for synchronous code, which is one of its primary advantages over raw Promise chains. When an awaited Promise rejects, the rejection is converted into a thrown exception that can be caught with a surrounding try/catch block. This makes async error handling read almost identically to synchronous error handling, significantly improving code clarity compared to nested `.catch()` callbacks.\n\nThe basic pattern wraps `await` calls in a try/catch block. The catch block receives the rejection reason—typically an Error object. You can use multiple await statements inside a single try block, and the first one to reject will cause execution to jump to catch, just like synchronous throws. For more granular control, you can wrap individual await statements in separate try/catch blocks, or use the `.catch()` method inline on specific promises (e.g., `const result = await riskyCall().catch(handleError)`) to handle errors for that specific operation without interrupting the broader flow.\n\nA critical pitfall is forgetting to handle errors in async functions. If an async function throws and the returned Promise is never caught (no `.catch()` and no `await` inside a try/catch), the rejection becomes an unhandled promise rejection. In Node.js, unhandled rejections can crash the process by default (since Node 15+). In browsers, they trigger the `unhandledrejection` event. Always ensure that every async call chain has error handling at some level.\n\nFor parallel async operations, `Promise.all()` rejects as soon as any constituent Promise rejects, discarding the results of others. If you need all results regardless of individual failures, use `Promise.allSettled()`, which returns an array of `{ status, value/reason }` objects. This lets you inspect each outcome and handle failures individually without losing successful results. You can also combine async/await with the "go-style" tuple pattern—wrapping each await in a helper that returns `[error, result]`—to avoid deeply nested try/catch blocks in functions with many sequential async operations.',shortAnswer:`Wrap await calls in try/catch blocks—rejected Promises become thrown exceptions that catch handles. For parallel operations, use Promise.allSettled() to handle individual failures without losing other results. Always ensure async call chains have error handling to avoid unhandled promise rejections, which can crash Node.js processes.`,code:`// Basic async/await error handling
async function fetchUserData(userId: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    return await response.json() as Record<string, unknown>;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network failure:', error.message);
    } else {
      console.error('Request failed:', (error as Error).message);
    }
    throw error; // Re-throw for caller to handle
  }
}

// Inline .catch() for non-critical operations
async function loadDashboard(userId: string): Promise<void> {
  const user = await fetchUserData(userId);
  const preferences = await fetchPreferences(userId)
    .catch(() => ({ theme: 'default', language: 'en' })); // Fallback on failure

  console.log('Dashboard loaded for', user, 'with prefs', preferences);
}

// Promise.allSettled for parallel operations
async function fetchMultipleUsers(
  ids: string[]
): Promise<Record<string, unknown>[]> {
  const results = await Promise.allSettled(
    ids.map((id) => fetchUserData(id))
  );

  const users: Record<string, unknown>[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      users.push(result.value);
    } else {
      console.warn('Failed to fetch user:', result.reason);
    }
  }
  return users;
}

// Go-style tuple pattern to avoid nested try/catch
type Result<T> = [Error, null] | [null, T];

async function to<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as Error, null];
  }
}

async function processOrder(orderId: string): Promise<void> {
  const [orderErr, order] = await to(fetchOrder(orderId));
  if (orderErr) {
    console.error('Order fetch failed:', orderErr.message);
    return;
  }

  const [paymentErr] = await to(processPayment(order));
  if (paymentErr) {
    console.error('Payment failed:', paymentErr.message);
    await rollbackOrder(orderId);
    return;
  }

  console.log('Order processed successfully');
}

// Stub declarations for the example
declare function fetchPreferences(id: string): Promise<Record<string, unknown>>;
declare function fetchOrder(id: string): Promise<Record<string, unknown>>;
declare function processPayment(order: Record<string, unknown>): Promise<void>;
declare function rollbackOrder(id: string): Promise<void>;`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`JavaScript`,topicId:`js-errors`,tags:[`async/await`,`promises`,`error handling`,`try/catch`],commonMistakes:[`Forgetting to await a Promise inside a try block—the rejection goes unhandled because try/catch only catches synchronous throws and awaited rejections`,`Using Promise.all() when individual failures should not abort the entire operation—use Promise.allSettled() instead`,`Not re-throwing errors when the current function cannot fully handle them, causing silent failures upstream`],followUps:[`How do you implement retry logic for transient async errors?`,`What is the difference between unhandled rejection in Node.js vs browsers?`,`How would you implement a timeout wrapper for async operations?`],interviewTips:[`Show that you know multiple patterns: try/catch, inline .catch(), and the tuple/go-style helper`,`Mention Promise.allSettled() proactively—it is a common interview follow-up`],relatedTopics:[`promises`,`async/await`,`Promise.allSettled`,`event loop`]},{id:`js-errors-6`,question:`What is error propagation and how does it work in JavaScript?`,answer:'Error propagation (also called "unwinding the call stack") is the process by which a thrown exception travels up through the chain of function calls until it is caught by a try/catch block or reaches the top level of the program. When a function throws an error and does not catch it internally, the error propagates to the calling function. If that caller also lacks a try/catch, the error continues to the next caller, and so on. This continues until either a catch block is found or the error reaches the global scope.\n\nIn synchronous code, this propagation follows the call stack directly. Each function on the stack is exited in reverse order (most recent first), and any finally blocks encountered along the way are executed. This stack unwinding is what produces the stack trace you see in error.stack—it records the path the error took from where it was thrown to where it was caught (or where it terminated the program). Understanding this mechanism helps you place try/catch blocks strategically: usually at boundaries where you can meaningfully handle or report the error, rather than wrapping every single function call.\n\nFor asynchronous code, propagation works differently. Errors thrown inside callbacks passed to setTimeout or event listeners do not propagate to the code that scheduled them, because the original call stack has already unwound by the time the callback executes. This is why Node.js provides process-level handlers like `process.on("uncaughtException")` and browsers provide `window.onerror` and `window.addEventListener("unhandledrejection")`. Promise rejections propagate through the Promise chain—an unhandled rejection in one `.then()` callback travels to the next `.catch()` in the chain, or becomes an unhandled rejection if no `.catch()` exists.\n\nEffective error propagation strategy means catching errors at the right level. Low-level utility functions should typically throw (or reject) and let callers decide how to handle the error. Mid-level service functions might catch, enrich the error with context (wrapping it in a more descriptive custom error), and re-throw. Top-level entry points (route handlers, event listeners, main functions) should catch and handle errors definitively—by logging, returning error responses, or displaying error UI. This layered approach keeps error handling clean and avoids both swallowed errors and redundant catch blocks.',shortAnswer:`Error propagation is the process of a thrown exception traveling up the call stack until caught. Each uncaught throw exits the current function and moves to the caller. In async code, propagation works through Promise chains rather than the call stack. Best practice is to catch at boundaries where you can meaningfully handle the error, and let lower-level code throw freely.`,code:`// Synchronous propagation up the call stack
function innerFunction(): void {
  throw new Error('thrown in innerFunction');
}

function middleFunction(): void {
  innerFunction(); // Does not catch — error propagates
}

function outerFunction(): void {
  try {
    middleFunction();
  } catch (error) {
    // Error caught here after unwinding through middle → inner
    console.log((error as Error).message); // "thrown in innerFunction"
    console.log((error as Error).stack);   // Shows full call path
  }
}

outerFunction();

// Error enrichment pattern: catch, wrap, re-throw
class ServiceError extends Error {
  readonly cause: Error;
  constructor(message: string, cause: Error) {
    super(message);
    this.name = 'ServiceError';
    this.cause = cause;
  }
}

function fetchFromDatabase(id: string): Record<string, unknown> {
  throw new Error(\`Record \${id} not found in database\`);
}

function getUserProfile(userId: string): Record<string, unknown> {
  try {
    return fetchFromDatabase(userId);
  } catch (error) {
    // Enrich with context, then re-throw
    throw new ServiceError(
      \`Failed to load profile for user \${userId}\`,
      error as Error
    );
  }
}

// Async propagation through Promise chains
function step1(): Promise<string> {
  return Promise.resolve('data');
}

function step2(data: string): Promise<string> {
  throw new Error(\`step2 failed with: \${data}\`);
}

step1()
  .then(step2)           // Error thrown here
  .then((result) => {    // Skipped
    console.log(result);
  })
  .catch((error: Error) => {
    // Error propagated through the chain
    console.error('Caught in chain:', error.message);
  });

// Global handlers as a safety net
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    event.preventDefault();
  });
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-errors`,tags:[`error propagation`,`call stack`,`async`,`promise chain`],commonMistakes:[`Catching errors too early (in low-level utilities) and swallowing them, preventing callers from knowing about the failure`,`Expecting try/catch to capture errors from asynchronous callbacks like setTimeout—those run on a separate call stack`,`Forgetting to attach the original error as a cause when wrapping and re-throwing, losing the root cause in logs`],followUps:[`How does the ES2022 Error cause property improve error chaining?`,`How do you design an error boundary strategy for a large application?`,`What is the difference between error propagation in Promises and in async/await?`],interviewTips:[`Draw the call stack or describe the unwinding order to show clear mental model`,`Discuss the catch-enrich-rethrow pattern to demonstrate production experience`],relatedTopics:[`call stack`,`promises`,`Error cause`,`global error handlers`]},{id:`js-errors-7`,question:`What are common error handling patterns and best practices?`,answer:'Production JavaScript applications benefit from a structured approach to error handling that goes beyond basic try/catch. One foundational pattern is the distinction between **operational errors** and **programmer errors**. Operational errors are expected runtime problems—network failures, invalid user input, file not found—that your code should anticipate and recover from. Programmer errors are bugs—type errors, null dereferences, logic mistakes—that indicate broken code and usually require a fix rather than runtime recovery. Handling these differently (graceful recovery vs. crash-and-fix) is key to building reliable systems.\n\nThe **error boundary** pattern isolates failures so they do not cascade. In React, Error Boundaries are class components that catch rendering errors in their subtree and display fallback UI. On the backend, each request handler or message processor acts as a boundary: errors within one request should not crash the server or affect other requests. Centralised error-handling middleware (in Express, for example) catches errors from all routes and formats consistent error responses. This pattern keeps error handling DRY and ensures uniform error reporting.\n\n**Fail-fast** is another critical principle: validate inputs and preconditions at the start of a function and throw immediately if they are not met, rather than letting invalid data flow deeper into the system where failures become harder to diagnose. Combine this with **defensive programming**—using type guards, null checks, and assertion functions to surface problems as close to their source as possible. For async code, always ensure Promises have rejection handlers, and use `Promise.allSettled()` when you need results from multiple operations regardless of individual failures.\n\nFor large applications, implement a **centralised error logging and monitoring** strategy. Use a global error handler (`window.onerror`, `process.on("uncaughtException")`, or framework-specific hooks) as a safety net to capture and report errors that slip past local handlers. Attach contextual information (user ID, request ID, operation name) to errors before logging them. Consider using the ES2022 `Error.cause` property or custom error classes with a `cause` field to chain errors and preserve the original failure context. Finally, never expose internal error details (stack traces, database queries) to end users—return user-friendly messages and log the details server-side.',shortAnswer:`Key patterns include distinguishing operational vs programmer errors, using error boundaries to isolate failures, fail-fast validation at function entry points, centralised error logging with context, and using custom error classes with cause chaining. Always ensure async code has rejection handlers, never expose internal details to users, and use global handlers as a safety net.`,code:`// Fail-fast: validate inputs early
function createUser(name: string, age: number): { name: string; age: number } {
  if (!name || typeof name !== 'string') {
    throw new TypeError('name must be a non-empty string');
  }
  if (!Number.isFinite(age) || age < 0 || age > 150) {
    throw new RangeError('age must be between 0 and 150');
  }
  return { name, age };
}

// Centralised error handler (Express-style middleware)
interface AppRequest { path: string; }
interface AppResponse {
  status(code: number): AppResponse;
  json(body: Record<string, unknown>): void;
}

class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

function errorHandler(
  err: Error,
  _req: AppRequest,
  res: AppResponse
): void {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    // Programmer error — log and return generic message
    console.error('Unexpected error:', err);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
}

// Error cause chaining (ES2022)
async function loadConfig(path: string): Promise<Record<string, unknown>> {
  try {
    const raw = await readFile(path);
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (error) {
    throw new Error(\`Failed to load config from \${path}\`, {
      cause: error,
    });
  }
}

// Retry pattern for transient failures
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const backoff = delayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw new Error(\`Failed after \${maxRetries} retries\`, {
    cause: lastError,
  });
}

// Usage
async function fetchWithRetry(url: string): Promise<Record<string, unknown>> {
  return withRetry(async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json() as Promise<Record<string, unknown>>;
  });
}

declare function readFile(path: string): Promise<string>;`,language:`typescript`,difficulty:`Senior`,type:`Scenario`,category:`JavaScript`,topicId:`js-errors`,tags:[`best practices`,`error boundary`,`fail fast`,`retry`,`Error.cause`,`operational errors`],commonMistakes:[`Using a single catch-all handler that swallows all errors identically, making it impossible to distinguish recoverable failures from bugs`,`Exposing internal error details (stack traces, SQL queries) in API responses sent to end users`,`Implementing retry logic without exponential backoff, which can overwhelm a struggling downstream service`],followUps:[`How do React Error Boundaries work and what are their limitations?`,`How would you design error monitoring and alerting for a production application?`,`What is the circuit breaker pattern and when would you use it?`],interviewTips:[`Discussing operational vs programmer errors shows system-design maturity—interviewers love this distinction at senior levels`,`Mention centralised logging, error cause chaining, and retry with backoff to demonstrate production readiness`],relatedTopics:[`Express middleware`,`React Error Boundaries`,`circuit breaker`,`observability`]}]}],c=[{id:`js-engine`,title:`JavaScript Engine and Runtime`,description:`Deep exploration of how JavaScript engines like V8 parse, compile, and execute code — covering the modern multi-tier compilation pipeline, garbage collection strategies, memory layout, and runtime optimizations that power high-performance JavaScript.`,category:`JavaScript`,difficulty:`Advanced`,tags:[`V8`,`engine`,`runtime`,`compilation`,`JIT`,`interpreter`,`garbage collection`,`memory management`,`call stack`,`heap`,`AST`,`bytecode`,`optimization`,`deoptimization`,`hidden classes`,`inline caches`],overview:`JavaScript engines are responsible for transforming human-readable source code into machine-executable instructions. Modern engines like V8 (Chrome, Node.js), SpiderMonkey (Firefox), and JavaScriptCore (Safari) use sophisticated multi-tier compilation pipelines that balance startup speed with peak performance. V8, for example, has evolved from a simple two-tier system (Ignition + TurboFan) into a four-tier pipeline: Ignition (interpreter) → Sparkplug (baseline compiler) → Maglev (mid-tier optimizing compiler) → TurboFan (top-tier optimizing compiler). Understanding this pipeline — along with concepts like hidden classes, inline caches, garbage collection, and deoptimization — is essential for writing performant JavaScript and debugging production performance issues.`,concepts:[`Source code parsing and tokenization`,`Abstract Syntax Tree (AST) construction`,`Bytecode generation by Ignition interpreter`,`Sparkplug baseline (non-optimizing) compiler`,`Maglev mid-tier optimizing compiler`,`TurboFan top-tier optimizing compiler`,`Tiered compilation and code promotion based on hotness`,`Inline caches (ICs) and type feedback`,`Hidden classes (Maps/Shapes) and transition chains`,`Speculative optimization and deoptimization (bailouts)`,`Call stack and execution contexts`,`Heap memory layout (young generation, old generation)`,`Garbage collection: Scavenger (Minor GC) and Mark-Sweep-Compact (Major GC)`,`Orinoco concurrent and parallel GC`,`On-stack replacement (OSR)`],relatedTopicIds:[`js-event-loop`,`js-execution-context`,`js-closures`,`js-performance`],questions:[{id:`js-engine-1`,question:`How does V8 execute JavaScript code? Explain the compilation pipeline.`,answer:`V8 executes JavaScript through a sophisticated multi-stage pipeline that transforms source code into optimized machine code. The process begins when V8 receives a script: the Scanner tokenizes the raw source text into a stream of tokens, and the Parser consumes those tokens to build an Abstract Syntax Tree (AST). V8 uses lazy parsing — it only fully parses functions when they are about to be called, deferring inner functions with a lightweight pre-parse that validates syntax and identifies variable scopes without generating a full AST.

Once the AST is built for a function, Ignition (V8's interpreter) walks the tree and generates compact bytecode. Ignition executes this bytecode directly using a register-based virtual machine. During execution, Ignition collects type feedback via inline caches — recording the shapes (hidden classes) of objects seen at each property access, the types of operands at arithmetic sites, and the targets of function calls. This profiling data is critical because it guides the optimizing compilers.

As functions become "hot" (executed frequently), V8 promotes them through its compilation tiers. Sparkplug is the first tier above Ignition — it is a baseline compiler that translates Ignition bytecode directly into machine code without any optimization passes. Sparkplug's key advantage is speed: it compiles extremely fast because it performs a single linear walk over the bytecode, mapping each bytecode instruction to a short sequence of native instructions. The generated code is roughly 2-5× faster than interpreted bytecode. Sparkplug shares the same stack frame layout as Ignition, so transitioning between them is seamless.

For even hotter functions, Maglev (introduced in Chrome 117) provides mid-tier optimization. Maglev builds a static single assignment (SSA) graph from the bytecode, performs type specialization using the inline cache feedback, eliminates redundant checks, and generates optimized machine code — all while compiling significantly faster than TurboFan. Maglev targets the sweet spot where functions are too hot for Sparkplug but don't justify TurboFan's compilation cost. Finally, the hottest functions are compiled by TurboFan, V8's top-tier optimizing compiler. TurboFan builds a comprehensive "sea of nodes" intermediate representation, runs advanced optimizations (escape analysis, loop peeling, bounds check elimination, inlining, constant folding), and produces highly optimized machine code. If TurboFan's speculative assumptions are violated at runtime — for example, a variable that was always a number suddenly receives a string — V8 performs deoptimization: it discards the optimized code and falls back to a lower tier, resuming execution from the equivalent bytecode position.`,shortAnswer:`V8 parses source into an AST, generates bytecode via Ignition (interpreter), then promotes hot functions through Sparkplug (fast baseline compiler), Maglev (mid-tier optimizer using SSA graphs), and TurboFan (top-tier optimizer with advanced analyses). Each tier trades compilation time for faster generated code, guided by inline cache type feedback.`,code:`// Observing tier-up behavior conceptually
// V8 internally tracks invocation counts and IC feedback

function add(a, b) {
  return a + b;
}

// First few calls: Ignition interprets bytecode,
// collects type feedback that a and b are numbers
for (let i = 0; i < 100; i++) {
  add(i, i + 1); // IC records: both operands are Smi (small integer)
}

// After ~100 calls: Sparkplug compiles to unoptimized machine code
// After sustained hotness: Maglev compiles with type-specialized number ops
// After extreme hotness: TurboFan produces fully optimized machine code
// with inlined arithmetic, no type checks (speculative)

// If the type assumption is broken:
add("hello", "world"); // TurboFan deoptimizes back to Ignition/Sparkplug
// V8 re-profiles with the new polymorphic feedback`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`V8`,`compilation`,`Ignition`,`Sparkplug`,`Maglev`,`TurboFan`,`pipeline`],commonMistakes:[`Describing V8 as only having two tiers (Ignition + TurboFan) — the modern pipeline includes Sparkplug and Maglev between them`,`Claiming JavaScript is purely interpreted — V8 compiles all executed code to machine code through its tiered pipeline`,`Conflating the parsing phase with compilation — parsing produces an AST, while Ignition generates bytecode from the AST`],followUps:[`How does lazy parsing work and why does V8 defer parsing inner functions?`,`What is On-Stack Replacement (OSR) and how does V8 tier up code that is already running?`,`How does Sparkplug achieve fast compilation without an IR?`],interviewTips:[`Walk through the pipeline step by step: source → tokens → AST → bytecode → Sparkplug → Maglev → TurboFan. Mentioning Sparkplug and Maglev shows up-to-date knowledge.`,`Emphasize that type feedback from inline caches is the critical link between the interpreter and the optimizing compilers.`]},{id:`js-engine-2`,question:`What is the difference between interpretation and JIT compilation?`,answer:`Interpretation and JIT (Just-In-Time) compilation represent two fundamentally different strategies for executing code, and modern JavaScript engines use both in combination to balance startup latency with peak throughput.

An interpreter reads and executes instructions one at a time, typically walking a bytecode stream (or historically, an AST) and dispatching each instruction to a handler that performs the corresponding operation. Ignition, V8's interpreter, is a register-based bytecode interpreter — it maintains a set of virtual registers and a bytecode dispatch loop. Interpretation has fast startup because there is no upfront compilation cost: the engine can begin executing as soon as bytecode is generated. However, interpreted execution is relatively slow because each bytecode instruction incurs dispatch overhead (fetching the next instruction, decoding it, jumping to the handler), and the interpreter cannot perform cross-instruction optimizations.

JIT compilation translates bytecode (or source code) into native machine code at runtime, just before or during execution. The generated machine code runs directly on the CPU without dispatch overhead, making it significantly faster. However, JIT compilation itself takes time and memory — the compiler must analyze the code, potentially build an intermediate representation, run optimization passes, and emit machine instructions. This is why engines do not JIT-compile everything immediately: the compilation cost would destroy startup performance.

V8 resolves this tension with its tiered pipeline. Ignition interprets bytecode to provide instant startup and collects type feedback. Sparkplug performs a fast, non-optimizing JIT compilation that eliminates interpreter dispatch overhead with minimal compilation cost. Maglev applies moderate optimizations using the collected type feedback, offering a good performance-to-compile-time ratio. TurboFan performs aggressive speculative JIT compilation for the hottest functions, producing code that rivals ahead-of-time compiled languages — but only when the compilation investment is justified by execution frequency.

The key insight is that interpretation and JIT compilation are complementary, not competing. Interpretation provides the profiling data that makes JIT compilation effective: without knowing that a particular addition always operates on integers, the JIT compiler would have to generate generic (slow) code that handles every possible type. The inline cache feedback collected during interpretation enables speculative optimization, where the JIT compiler generates specialized code based on observed types and inserts guards (deoptimization checks) to handle cases where the assumptions are violated.`,shortAnswer:`An interpreter executes bytecode instruction-by-instruction with fast startup but slow throughput. JIT compilation converts bytecode to native machine code at runtime for much faster execution but requires compilation time. V8 combines both: Ignition interprets to collect type profiles, then Sparkplug/Maglev/TurboFan JIT-compile hot functions at increasing optimization levels.`,code:`// Conceptual illustration of interpreter vs JIT behavior

function multiply(x, y) {
  return x * y;
}

// --- Interpreter (Ignition) execution ---
// Bytecode: LdaNamedProperty, Star, Mul, Return
// Each bytecode instruction dispatches to a C++ handler:
//   1. Read bytecode opcode
//   2. Jump to handler (switch/threaded dispatch)
//   3. Execute operation
//   4. Advance to next bytecode
// IC feedback: records that x and y are always Smi (small integers)

// --- JIT compiled (TurboFan) execution ---
// Native x64 code (conceptual):
//   mov rax, [rbp+offset_x]   ; load x
//   imul rax, [rbp+offset_y]  ; integer multiply
//   jo deopt_label             ; overflow check → deopt if triggered
//   ret                        ; return result
// No dispatch overhead, type-specialized, inlined arithmetic`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`interpretation`,`JIT`,`compilation`,`Ignition`,`TurboFan`],commonMistakes:[`Saying JavaScript is either interpreted or compiled — modern engines use a hybrid tiered approach`,`Thinking JIT compilation happens once — V8 can recompile the same function multiple times at different tiers and deoptimize back`],followUps:[`What is Ahead-of-Time (AOT) compilation and why don't JavaScript engines use it for regular web code?`,`How does WebAssembly's compilation model differ from JavaScript JIT?`,`What role does On-Stack Replacement play in switching from interpreted to compiled code mid-execution?`],interviewTips:[`Frame the answer around the tradeoff: startup speed vs peak performance. Explain that the tiered approach optimizes for both by investing compilation effort proportional to a function's hotness.`]},{id:`js-engine-3`,question:`Explain the modern V8 compilation tiers: Ignition, Sparkplug, Maglev, and TurboFan.`,answer:`V8's modern compilation pipeline consists of four execution tiers, each representing a different point on the compilation-speed vs execution-speed tradeoff curve. Code progresses through these tiers based on execution frequency ("hotness"), with each tier producing faster code at the cost of longer compilation time.

Ignition is V8's bytecode interpreter and the entry point for all JavaScript execution. When a function is first called, Ignition generates compact bytecode from the AST and executes it via a register-based dispatch loop. Ignition is designed for fast startup and low memory usage — bytecode is 25-50% the size of equivalent machine code. Crucially, Ignition instruments every operation with inline caches that record type feedback: what shapes (hidden classes) objects have at property accesses, what types operands have at arithmetic sites, and what functions are called at call sites. This feedback is stored in a FeedbackVector associated with the function and is consumed by all higher tiers.

Sparkplug is a non-optimizing baseline compiler added in V8 9.1 (2021). It compiles Ignition bytecode directly into machine code in a single linear pass, without building any intermediate representation. Sparkplug's compilation is extremely fast because it performs no analysis — it simply maps each bytecode instruction to a fixed template of machine instructions, reusing the same stack frame layout as Ignition. The resulting code is unoptimized but eliminates interpreter dispatch overhead, yielding roughly a 2× speedup over Ignition. Sparkplug also preserves inline cache feedback collection, so profiling data continues to accumulate for the optimizing tiers.

Maglev (launched in Chrome 117, 2023) is a mid-tier optimizing compiler that fills the gap between Sparkplug and TurboFan. Maglev reads the bytecode and the FeedbackVector, builds a static single assignment (SSA) control-flow graph, and applies targeted optimizations: speculative type specialization (using IC feedback), redundant check elimination, register allocation, and simple inlining. Maglev compiles 10-20× faster than TurboFan while producing code that captures 80-90% of TurboFan's performance gains. This makes it ideal for "warm" functions that are called often enough to benefit from optimization but not so hot that TurboFan's full investment is warranted. Maglev uses its own stack frame format optimized for its code generation strategy.

TurboFan is V8's top-tier optimizing compiler and the most powerful. It builds a "sea of nodes" IR — a graph where both data flow and control flow are represented as nodes with edges — and runs a comprehensive optimization pipeline: inlining of callees, escape analysis to eliminate allocations, loop-invariant code motion, bounds check elimination, dead code elimination, constant folding, and strength reduction. TurboFan performs instruction selection, register allocation (linear scan), and emits highly optimized machine code tailored to the target architecture (x64, ARM64, etc.). Compilation is expensive (milliseconds to tens of milliseconds for complex functions), so it is reserved for the hottest code paths. When TurboFan's speculative assumptions fail, V8 deoptimizes back to Ignition or Sparkplug, re-profiles, and may recompile with updated feedback.`,shortAnswer:`Ignition interprets bytecode and collects type feedback. Sparkplug quickly compiles bytecode to unoptimized machine code (no IR, single-pass). Maglev builds an SSA graph and applies moderate optimizations using IC feedback, compiling 10-20× faster than TurboFan. TurboFan performs full optimization with a sea-of-nodes IR, escape analysis, inlining, and advanced passes for peak performance on the hottest code.`,difficulty:`Senior`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`V8`,`Ignition`,`Sparkplug`,`Maglev`,`TurboFan`,`tiered compilation`],commonMistakes:[`Not knowing about Sparkplug and Maglev — many developers only know the old Ignition + TurboFan model`,`Thinking Sparkplug is an optimizing compiler — it performs zero optimization, just template-based bytecode-to-machine-code translation`,`Assuming TurboFan compiles all functions — only the hottest functions justify TurboFan's compilation cost`],followUps:[`How does V8 decide when to promote a function from one tier to the next?`,`What is the compilation latency of each tier and how does that impact user experience?`,`How does Maglev's SSA graph differ from TurboFan's sea-of-nodes IR?`],interviewTips:[`Knowing about Sparkplug and Maglev distinguishes you as a candidate with current, deep V8 knowledge — most resources still describe the old two-tier pipeline.`,`Mention the tradeoff curve: each tier invests more compilation time for faster output code, so V8 only promotes code that has earned the investment through execution frequency.`]},{id:`js-engine-4`,question:`What is an Abstract Syntax Tree (AST) and how is it used in JavaScript execution?`,answer:"An Abstract Syntax Tree (AST) is a hierarchical tree representation of the syntactic structure of source code. Each node in the tree represents a language construct — a function declaration, a binary expression, a variable assignment, an if statement, and so on. Unlike the raw source text, the AST strips away syntactic noise like parentheses, semicolons, and whitespace, capturing only the structural relationships between code elements. For example, the expression `(a + b) * c` becomes a Multiply node whose left child is an Add node (with children `a` and `b`) and whose right child is `c` — the parentheses are implicit in the tree structure.\n\nIn V8's pipeline, the Parser consumes a token stream (produced by the Scanner/lexer) and constructs the AST. V8 uses two parsing strategies: eager parsing and lazy parsing. When a function is about to be called for the first time, V8 eager-parses it, building a complete AST. For inner functions that are defined but not yet called, V8 uses a pre-parser that quickly scans through the source to validate syntax, identify variable scopes, and record metadata — but does not build a full AST. This lazy parsing strategy is critical for performance because web pages often ship large bundles where much of the code is never executed during the initial page load.\n\nOnce the AST is built, Ignition traverses it to generate bytecode. The AST is consumed and can be garbage collected after bytecode generation, so it does not persist in memory during execution — only the bytecode and the source code (for potential re-parsing) are retained. This is important because ASTs are memory-intensive: they can be 10-20× larger than the original source code.\n\nBeyond engine internals, ASTs are the foundation of the entire JavaScript tooling ecosystem. Babel uses ASTs to transform modern syntax into backward-compatible code. ESLint walks ASTs to detect code patterns and enforce style rules. Prettier reformats code by parsing it into an AST and printing it back with consistent formatting. TypeScript's compiler parses into its own AST for type checking. Bundlers like Webpack and Rollup analyze ASTs to determine import/export relationships for tree shaking. Tools like `@babel/parser` (formerly Babylon), `acorn`, and `esprima` are standalone JavaScript parsers that produce ASTs conforming to the ESTree specification, making the AST format interoperable across the ecosystem.",shortAnswer:`An AST is a tree representation of code structure where each node represents a syntactic construct (expression, statement, declaration). V8's parser builds an AST from source tokens, then Ignition generates bytecode from it. The AST is discarded after bytecode generation to save memory. ASTs also power the JS tooling ecosystem: Babel, ESLint, Prettier, and bundlers all operate on ASTs.`,code:`// Example: how "const x = a + b * c;" looks as an AST (simplified)
//
// VariableDeclaration (const)
// └── VariableDeclarator
//     ├── Identifier: x
//     └── BinaryExpression (+)
//         ├── Identifier: a
//         └── BinaryExpression (*)
//             ├── Identifier: b
//             └── Identifier: c

// You can explore ASTs in practice using acorn or @babel/parser:
// const acorn = require('acorn');
// const ast = acorn.parse('const x = a + b * c;', { ecmaVersion: 2022 });
// console.log(JSON.stringify(ast, null, 2));

// Real-world AST node (ESTree format) for "a + b":
const exampleNode = {
  type: "BinaryExpression",
  operator: "+",
  left: { type: "Identifier", name: "a" },
  right: { type: "Identifier", name: "b" },
};`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`AST`,`parsing`,`syntax tree`,`parser`,`bytecode`],commonMistakes:[`Thinking the AST persists throughout execution — V8 discards it after generating bytecode to conserve memory`,`Confusing the AST with bytecode — the AST is a tree of syntax nodes, while bytecode is a flat sequence of instructions for the Ignition VM`,`Not realizing that lazy parsing exists — V8 does not fully parse all functions upfront, which is a key startup optimization`],followUps:[`What is the ESTree specification and how does it standardize AST formats?`,`How does V8's lazy parsing interact with module-level code?`,`What are the performance implications of deeply nested ASTs on parsing time?`],interviewTips:[`Mentioning lazy vs eager parsing shows you understand V8's startup optimization strategy, not just the theoretical concept of ASTs.`]},{id:`js-engine-5`,question:`What causes deoptimization in V8 and how can you avoid it?`,answer:"Deoptimization (also called a \"bailout\") occurs when V8's optimizing compilers (Maglev or TurboFan) have generated specialized machine code based on type assumptions that are later violated at runtime. When the engine detects that an assumption no longer holds, it discards the optimized code and falls back to a lower execution tier — typically Ignition or Sparkplug — resuming execution at the exact bytecode offset corresponding to where the optimized code was running. This process involves reconstructing the interpreter's stack frame from the optimized frame, which is expensive.\n\nThe most common cause of deoptimization is type instability. When Ignition collects type feedback, it records the shapes (hidden classes) and value types seen at each operation. TurboFan uses this feedback to emit type-specialized code — for example, generating integer addition instructions if both operands were always integers. If a function later receives a different type (a string, a floating-point number, or an object), the type guard fails and deoptimization is triggered. Polymorphic operations — where a single code site sees more than 2-4 different types or shapes — also cause problems because the compiler generates increasingly generic (slower) code or refuses to optimize the site entirely (megamorphic state).\n\nOther deoptimization triggers include: accessing properties on objects with different hidden classes (map transitions), changing an object's shape after optimization (adding or deleting properties), accessing out-of-bounds array indices (which forces a transition from a fast elements kind to a slower dictionary mode), calling a function with a different number of arguments than what was profiled, using `arguments` object features that prevent optimization (like leaking the `arguments` object), and encountering `try-catch` blocks in older V8 versions (modern V8 handles this much better but `finally` blocks can still inhibit some optimizations).\n\nTo write optimization-friendly code: keep functions monomorphic — pass the same types of arguments consistently. Initialize object properties in a consistent order in constructors (this ensures all instances share the same hidden class). Avoid deleting properties from objects (use `undefined` assignment instead). Keep arrays homogeneous — don't mix integers, floats, and objects in the same array. Avoid creating functions in hot loops (each closure may have a different context). Pre-allocate arrays to their expected size when possible rather than growing them incrementally. Use TypedArrays for numerical computation. These practices align with how V8's feedback-driven optimization works, reducing the chance that speculative assumptions will be invalidated.\n\nYou can observe deoptimization in practice using the `--trace-deopt` flag in Node.js or Chrome's DevTools Performance panel, which shows bailout reasons alongside the affected functions. The `--trace-opt` flag shows which functions are being optimized and at which tier.",shortAnswer:`Deoptimization happens when TurboFan or Maglev's speculative type assumptions are violated at runtime — like receiving a string where integers were expected. V8 discards the optimized code and falls back to the interpreter. Avoid it by keeping functions monomorphic (consistent types), initializing object properties in a fixed order, and not mixing types in arrays.`,code:`// Type instability causing deoptimization
function add(a, b) {
  return a + b;
}

// Monomorphic: V8 optimizes for integer addition
for (let i = 0; i < 10000; i++) {
  add(i, i + 1); // always Smi + Smi
}

// Type change triggers deoptimization!
add("hello", " world"); // string concat — type guard fails, deopt

// ---

// Hidden class instability
function Point(x, y) {
  this.x = x;
  this.y = y;
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
p2.z = 5; // p2 now has a different hidden class than p1!

// If a function is optimized to handle Point objects,
// passing p2 may trigger deopt due to the unexpected map/shape

// ---

// Array type transitions
const arr = [1, 2, 3]; // PACKED_SMI_ELEMENTS
arr.push(4.5);          // transitions to PACKED_DOUBLE_ELEMENTS
arr.push("string");     // transitions to PACKED_ELEMENTS (generic)
// Each transition degrades performance — the array can never go back

// Run with: node --trace-deopt --trace-opt script.js`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`deoptimization`,`bailout`,`V8`,`optimization`,`hidden classes`],commonMistakes:[`Thinking deoptimization is a one-time event — V8 may re-optimize with updated feedback, then deoptimize again if types keep changing`,`Over-optimizing code prematurely — deoptimizations are normal; only investigate them when profiling reveals an actual performance bottleneck`,`Not knowing that array element kind transitions are irreversible — once an array goes from PACKED_SMI to PACKED_ELEMENTS, it never goes back`],followUps:[`How do you use --trace-deopt and --trace-opt to diagnose optimization issues?`,`What is the difference between eager and lazy deoptimization in V8?`,`How does V8 decide whether to re-optimize a function after deoptimization?`],interviewTips:[`Ground your answer in real V8 behavior — mention hidden classes, element kinds, and FeedbackVector states (monomorphic, polymorphic, megamorphic).`,`Show practical awareness by mentioning --trace-deopt and Chrome DevTools profiling as diagnostic tools.`]},{id:`js-engine-6`,question:`How does garbage collection work in JavaScript? Explain V8's approach.`,answer:`JavaScript uses automatic memory management through garbage collection (GC) — the engine automatically identifies objects that are no longer reachable from the root set (global object, active stack frames, registered callbacks) and reclaims their memory. V8 employs a generational garbage collector based on the observation that most objects die young (the "generational hypothesis").

V8 divides the heap into two main regions: the Young Generation (also called the nursery) and the Old Generation. The Young Generation is small (typically 1-8 MB per semi-space) and is collected frequently using a Scavenger algorithm (a variant of Cheney's semi-space copying collector). The Young Generation is split into two equal semi-spaces: the "from-space" and the "to-space." New objects are allocated in the from-space. When it fills up, the Scavenger runs: it traces all live objects from the roots, copies them to the to-space (compacting them in the process), and then swaps the roles of the two spaces. Objects that survive two Scavenger cycles are promoted ("tenured") to the Old Generation. This approach is very efficient because most objects are short-lived — the Scavenger only pays the cost of copying the small number of survivors, not the large number of dead objects.

The Old Generation holds long-lived objects and is collected using a Mark-Sweep-Compact algorithm. During the Mark phase, V8 traverses the object graph starting from the roots, marking every reachable object. During the Sweep phase, unmarked objects are freed. Optionally, the Compact phase relocates surviving objects to eliminate memory fragmentation, updating all pointers to the moved objects. Old Generation collection is more expensive because the heap region is larger and fragmentation management is more complex.

V8's garbage collector, called Orinoco, employs several techniques to minimize GC pause times and their impact on application responsiveness. Concurrent marking runs the mark phase on background threads while the main thread continues executing JavaScript — only a brief pause is needed at the end for a final re-scan of objects modified during concurrent marking. Parallel scavenging uses multiple threads to perform the Young Generation collection simultaneously. Incremental marking breaks the Old Generation mark phase into small chunks interleaved with JavaScript execution, preventing long pauses. Lazy sweeping defers the sweep phase, performing it incrementally as new allocations need memory. Together, these techniques keep GC pauses well under 1ms for most Young Generation collections and typically under 10ms for Old Generation collections.

Developers can influence GC behavior through allocation patterns. Reducing unnecessary allocations (object pooling, avoiding intermediary objects in hot loops), avoiding memory leaks (forgotten event listeners, growing caches without eviction, closures retaining large scopes), and using WeakRef and FinalizationRegistry for caching scenarios all help the GC work efficiently.`,shortAnswer:`V8 uses generational garbage collection. Short-lived objects go in the Young Generation, collected via a fast Scavenger (semi-space copying). Long-lived objects are promoted to the Old Generation, collected via Mark-Sweep-Compact. V8's Orinoco GC uses concurrent marking, parallel scavenging, and incremental techniques to minimize pause times.`,code:`// Demonstrating GC-aware patterns

// Memory leak: forgotten event listeners
class JsonFetcher {
  private cache = new Map<string, object>();

  subscribe(emitter: EventTarget) {
    const handler = (e: Event) => {
      this.cache.set(Date.now().toString(), e);
    };
    emitter.addEventListener("data", handler);
    // BUG: handler and \`this\` are never released
    // FIX: store handler reference for cleanup
  }
}

// WeakRef for GC-friendly caching
class Cache<T extends object> {
  private refs = new Map<string, WeakRef<T>>();
  private registry = new FinalizationRegistry<string>((key) => {
    this.refs.delete(key);
  });

  set(key: string, value: T): void {
    this.refs.set(key, new WeakRef(value));
    this.registry.register(value, key);
  }

  get(key: string): T | undefined {
    return this.refs.get(key)?.deref();
  }
}

// Object pooling to reduce GC pressure in hot paths
class VectorPool {
  private pool: Array<{ x: number; y: number }> = [];

  acquire(): { x: number; y: number } {
    return this.pool.pop() ?? { x: 0, y: 0 };
  }

  release(v: { x: number; y: number }): void {
    v.x = 0;
    v.y = 0;
    this.pool.push(v);
  }
}`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`garbage collection`,`memory`,`heap`,`V8`,`Orinoco`,`WeakRef`],commonMistakes:[`Thinking garbage collection means you never have to worry about memory — leaks from closures, event listeners, and global references are extremely common`,`Not understanding the generational hypothesis — assuming all objects are collected the same way regardless of their lifetime`,`Manually nulling out local variables to "help" GC — this is unnecessary; V8 tracks variable liveness precisely`],followUps:[`How do WeakRef and FinalizationRegistry interact with the garbage collector?`,`What tools can you use to diagnose memory leaks in Node.js or the browser?`,`What is the difference between a memory leak and high memory watermark in a long-running process?`],interviewTips:[`Describe both the Young Generation and Old Generation collectors, and mention Orinoco's concurrent/parallel techniques to show depth.`,`Be prepared to discuss practical memory leak scenarios — interviewers often follow up with debugging questions.`]},{id:`js-engine-7`,question:`Explain hidden classes and inline caches in V8.`,answer:`Hidden classes (internally called "Maps" in V8, "Shapes" in SpiderMonkey, "Structures" in JavaScriptCore) are V8's mechanism for giving structure to JavaScript's dynamically-typed objects. Because JavaScript allows arbitrary property addition and deletion at runtime, V8 cannot know an object's layout at parse time. Instead, V8 creates hidden classes dynamically to describe each unique object shape — the set of property names, their order, and their storage offsets in memory.

When you create an object, V8 assigns it an initial hidden class (an empty map). Each time you add a property, V8 transitions the object to a new hidden class that includes the new property. These transitions form a tree structure: if you create multiple objects and add properties in the same order, they share the same chain of hidden class transitions and end up with the same final hidden class. This sharing is critical — it means V8 can treat dynamically-typed objects almost like statically-typed structs, with properties at fixed offsets. However, if you add properties in different orders, delete properties, or dynamically add properties conditionally, objects will have different hidden classes, which inhibits optimization.

Inline caches (ICs) are the optimization that exploits hidden classes. Every property access in JavaScript (like \`obj.x\`) goes through an IC. On the first execution, the IC is in an uninitialized state and performs a slow dictionary-style lookup to find the property. After the lookup, the IC records the hidden class it saw and the offset where the property was found. On subsequent executions, the IC performs a fast check: "Does this object still have the same hidden class?" If yes, it directly loads the value from the recorded offset — this is as fast as a C struct field access. This is called a monomorphic IC.

If the IC sees a second hidden class, it becomes polymorphic — it records multiple (hidden class, offset) pairs and checks through them. V8 supports up to about 4 entries in a polymorphic IC. If more shapes appear, the IC becomes megamorphic and falls back to a generic (slow) hash-table lookup. The state of ICs is stored in the FeedbackVector and is the primary data source for the optimizing compilers. When Maglev or TurboFan compiles a function, they read the IC feedback to specialize the generated code: a monomorphic property access becomes a direct memory load with a map check guard, while a megamorphic access must use a generic lookup routine.

This is why consistent object shapes matter so much for performance. Constructor functions that always initialize properties in the same order ensure all instances share a hidden class, keeping ICs monomorphic. Factory functions that conditionally add properties, or code that patches objects post-construction, create shape diversity that pushes ICs into polymorphic or megamorphic states, degrading performance at every property access in the hot path.`,shortAnswer:`Hidden classes (Maps) describe an object's property layout — property names, order, and memory offsets. V8 assigns hidden classes dynamically as properties are added. Inline caches (ICs) store the hidden class and property offset from previous accesses, enabling fast O(1) property lookups on subsequent calls. Monomorphic ICs (one shape) are fastest; polymorphic (2-4 shapes) are slower; megamorphic (5+) fall back to hash lookups.`,code:`// Hidden class transitions
function Point(x, y) {
  // Hidden class C0: {} (empty)
  this.x = x;
  // Hidden class C1: { x: [offset 0] }
  this.y = y;
  // Hidden class C2: { x: [offset 0], y: [offset 1] }
}

const p1 = new Point(1, 2); // shares C2
const p2 = new Point(3, 4); // shares C2 — same transition chain!

// PROBLEM: different property order → different hidden classes
const a = {};
a.x = 1;
a.y = 2; // hidden class: { x, y }

const b = {};
b.y = 1;
b.x = 2; // hidden class: { y, x } ← DIFFERENT from a!

// Inline cache states
function getX(obj) {
  return obj.x; // IC site
}

getX(p1); // IC records: Map=C2, offset=0 → MONOMORPHIC
getX(p2); // same Map=C2, fast path hit!
getX(a);  // different Map → IC becomes POLYMORPHIC
getX(b);  // yet another Map → still polymorphic
// More shapes → eventually MEGAMORPHIC (slow generic lookup)

// Best practice: use constructor with consistent property order
class User {
  name: string;
  age: number;
  email: string;
  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }
}`,language:`typescript`,difficulty:`Senior`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`hidden classes`,`inline caches`,`Maps`,`Shapes`,`V8`,`optimization`],commonMistakes:[`Confusing hidden classes with JavaScript ES6 classes — hidden classes are an internal engine concept for tracking object shape, completely invisible to user code`,`Thinking property access is always a hash table lookup — with monomorphic ICs it is a direct memory offset load, comparable to compiled languages`,`Not realizing that deleting properties destroys hidden class sharing — use undefined assignment instead to preserve the shape`],followUps:[`How does V8 handle prototype chain lookups with inline caches?`,`What happens to inline caches when you use computed property names?`,`How do Map and Set objects differ from plain objects in terms of hidden classes?`],interviewTips:[`Draw the hidden class transition chain when explaining — it makes the concept much clearer and shows you truly understand the mechanism.`,`Connect hidden classes to inline caches to deoptimization: inconsistent shapes → polymorphic ICs → less effective optimization → potential deoptimization. This complete chain demonstrates deep understanding.`]},{id:`js-engine-8`,question:`What is the call stack and how does it relate to the heap?`,answer:`The call stack and the heap are the two primary memory regions used by the JavaScript runtime, each serving a fundamentally different purpose. Understanding their relationship is essential for reasoning about execution flow, memory allocation, and common errors like stack overflows.

The call stack is a LIFO (Last In, First Out) data structure that manages execution contexts. Every time a function is called, the engine pushes a new stack frame onto the call stack. This frame contains the function's local variables (primitives and references), parameters, the return address (where to continue after the function returns), and metadata like the saved frame pointer. When the function returns, its frame is popped off the stack. The call stack is strictly ordered — you can only access the topmost frame — which naturally mirrors the nested nature of function calls. JavaScript is single-threaded, so there is exactly one call stack. When the stack is empty, the event loop can pick up the next task from the macrotask or microtask queue.

The heap is a large, unstructured region of memory where objects, arrays, closures, and strings are allocated. Unlike the stack, which has a fixed, predictable allocation/deallocation pattern (push on call, pop on return), heap allocations are dynamic and their lifetimes are not tied to the function that created them. An object created inside a function can outlive the function if a reference to it is stored elsewhere — in a global variable, a closure, or another heap-allocated object. This is why the garbage collector exists: it periodically scans the heap to identify and reclaim objects that are no longer reachable.

The relationship between the stack and heap is through references. When you declare \`const obj = { x: 1 }\`, the variable \`obj\` lives on the stack (as a local in the current frame), but the object \`{ x: 1 }\` is allocated on the heap. The stack variable holds a pointer (reference) to the heap location. Primitive values like numbers, booleans, and small strings (in some engines) may be stored directly on the stack or inlined into the stack frame for efficiency. When you pass an object to a function, you're passing the reference (a copy of the pointer), not the object itself — which is why mutations to the object inside the function are visible to the caller.

Stack overflows occur when the call stack exceeds its fixed size limit (typically 10,000-25,000 frames depending on the engine and frame size). This most commonly happens with unbounded recursion. The error manifests as \`RangeError: Maximum call stack size exceeded\`. Solutions include converting recursion to iteration, using trampolining (returning thunks and executing them in a loop), or in some cases restructuring the algorithm. Heap exhaustion, on the other hand, manifests as the process running out of memory and being killed by the OS, or V8 throwing a fatal out-of-memory error. This typically results from memory leaks or processing data sets that exceed available RAM.`,shortAnswer:`The call stack is a LIFO structure managing function execution frames — each frame holds local variables, parameters, and return addresses. The heap is the unstructured memory where objects and closures are dynamically allocated. Stack variables hold references (pointers) to heap objects. The stack has a fixed size limit (stack overflow on deep recursion); the heap is managed by the garbage collector.`,code:`// Stack and heap relationship
function greet(name: string): string {
  // Stack frame for greet():
  //   - name: "Alice" (primitive, stored on stack or inlined)
  //   - user: reference → heap object
  //   - return address: caller's instruction pointer

  const user = { name, greeted: true }; // object allocated on HEAP
  return \`Hello, \${user.name}\`;
}
// When greet() returns, its stack frame is popped.
// The 'user' object becomes unreachable → eligible for GC.

// Stack overflow from unbounded recursion
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // each call adds a stack frame
}
// factorial(100000); // RangeError: Maximum call stack size exceeded

// Fix: iterative approach
function factorialIterative(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Fix: trampoline pattern for tail-recursive algorithms
type Thunk<T> = () => T | Thunk<T>;

function trampoline<T>(fn: Thunk<T>): T {
  let result: T | Thunk<T> = fn;
  while (typeof result === "function") {
    result = (result as Thunk<T>)();
  }
  return result;
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`call stack`,`heap`,`memory`,`stack overflow`,`execution context`],commonMistakes:[`Thinking objects can be allocated on the stack — in JavaScript, objects always go to the heap (though V8's escape analysis can sometimes scalar-replace them)`,`Confusing the call stack with the event loop's task queue — the call stack handles synchronous execution; the event loop feeds new tasks once the stack is empty`,`Assuming stack size is the same across environments — Node.js, Chrome, and Safari all have different default limits`],followUps:[`How does V8's escape analysis allow heap allocations to be "virtually" moved to the stack?`,`What is the relationship between the call stack and the event loop?`,`How do async functions and generators affect the call stack?`],interviewTips:[`Use concrete examples — describe what lives on the stack (primitives, references, return addresses) vs the heap (objects, arrays, closures) to demonstrate precise understanding.`,`Interactive Learning: Open the FrontendForge JS Visualizer (/visualizer) to watch stack frames push/pop and heap addresses link dynamically.`]},{id:`js-engine-9`,question:`How does V8 handle memory management and what are common memory leak patterns in JavaScript?`,answer:`V8's memory management is built around automatic garbage collection with a generational heap, but understanding the underlying mechanics is crucial because JavaScript applications frequently suffer from memory leaks that the GC cannot resolve on its own. A memory leak in a garbage-collected language is not a true leak in the C/C++ sense — it is an unintentional retention of references that prevents objects from being collected even though the application no longer needs them.

V8 organizes heap memory into several spaces. The New Space (Young Generation) is where new objects are allocated, split into two semi-spaces for the Scavenger collector. The Old Space holds objects that survived two GC cycles. Code Space stores compiled machine code (JIT output). Map Space holds hidden class (Map) objects. Large Object Space stores objects exceeding a size threshold (~256KB) that are too large for the regular spaces and are allocated directly in their own pages, collected individually. Each space has its own allocation and collection strategy optimized for the type of data it holds.

The most common memory leak patterns in JavaScript applications are: (1) Accidental globals — assigning to an undeclared variable in non-strict mode creates a global property that persists for the application lifetime. (2) Forgotten timers and intervals — \`setInterval\` callbacks and their closures remain in memory until \`clearInterval\` is called. (3) Detached DOM nodes — removing a DOM element while retaining a JavaScript reference to it keeps the entire subtree in memory. (4) Closures capturing more than intended — a closure retains the entire scope chain of its enclosing function, which may include large objects that the closure itself never accesses but the engine still retains because other variables in that scope might reference them (though V8 does perform scope analysis to reduce this). (5) Growing caches without eviction — Maps or plain objects used as caches that grow unbounded. (6) Event listeners not cleaned up — adding listeners in component lifecycle without corresponding removal.

Diagnosing memory leaks involves using Chrome DevTools Memory panel or Node.js's \`--inspect\` flag with the heap profiler. Key techniques include: taking heap snapshots at intervals and comparing them (looking for growing object counts), using the allocation timeline to see where allocations occur over time, and analyzing retainer trees to understand why a specific object is not being collected. The \`process.memoryUsage()\` API in Node.js provides RSS, heap total, heap used, and external memory metrics for programmatic monitoring.

Prevention strategies include using strict mode to catch accidental globals, implementing cleanup in component unmount/destroy lifecycle hooks, using WeakMap for associating metadata with objects without preventing their collection, implementing LRU eviction in caches, and using AbortController to cancel fetch requests and clean up associated resources. In server-side applications, monitor heap usage over time and set up alerts for memory growth trends that indicate slow leaks.`,shortAnswer:`V8 manages memory via a generational heap (New Space, Old Space, Code Space, Map Space, Large Object Space) with automatic garbage collection. Common leak patterns include forgotten timers/listeners, detached DOM nodes, closures retaining unneeded scopes, unbounded caches, and accidental globals. Diagnose with heap snapshots and allocation timelines in DevTools.`,code:`// Common memory leak patterns and fixes

// 1. Forgotten timer
class Poller {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private data: string[] = [];

  start() {
    this.intervalId = setInterval(() => {
      this.data.push("x".repeat(10000));
    }, 100);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.data = [];
  }
}

// 2. Detached DOM nodes
function setupButton() {
  const button = document.createElement("button");
  document.body.appendChild(button);

  const bigData = new Array(100000).fill("leak");
  button.addEventListener("click", () => {
    console.log(bigData.length);
  });

  // If button is removed from DOM but reference persists,
  // bigData stays in memory via the closure
  return () => {
    button.removeEventListener("click", () => {});
    document.body.removeChild(button);
  };
}

// 3. WeakMap for GC-friendly metadata
const metadata = new WeakMap<object, { createdAt: number }>();

function track(obj: object) {
  metadata.set(obj, { createdAt: Date.now() });
}

let tracked = { name: "temp" };
track(tracked);
tracked = null!; // object and its metadata are both GC-eligible

// 4. Node.js memory monitoring
// const used = process.memoryUsage();
// console.log({
//   rss: \\\`\${Math.round(used.rss / 1024 / 1024)} MB\\\`,
//   heapUsed: \\\`\${Math.round(used.heapUsed / 1024 / 1024)} MB\\\`,
//   heapTotal: \\\`\${Math.round(used.heapTotal / 1024 / 1024)} MB\\\`,
// });`,language:`typescript`,difficulty:`Advanced`,type:`Scenario`,category:`JavaScript`,topicId:`js-engine`,tags:[`memory management`,`memory leaks`,`heap`,`WeakMap`,`V8`],commonMistakes:[`Assuming garbage collection prevents all memory issues — GC only collects unreachable objects; leaked references are technically reachable`,`Using heap snapshots without comparison — a single snapshot tells you what is in memory but not what is growing; always compare multiple snapshots`,`Removing DOM elements without cleaning up listeners — the listener closure retains references to variables in its scope`],followUps:[`How would you set up automated memory leak detection in a CI/CD pipeline?`,`What is the difference between a memory leak and normal high memory usage in a data-intensive application?`,`How do WeakMap and WeakSet differ from Map and Set in terms of garbage collection?`],interviewTips:[`Have a concrete debugging story ready — interviewers often ask "Tell me about a memory leak you diagnosed." Walk through the symptoms, the tool you used, and the root cause.`]},{id:`js-engine-10`,question:`How does V8 optimize property access, and what are element kinds in arrays?`,answer:`V8 uses a combination of hidden classes (Maps), inline caches, and element kinds to optimize property and element access far beyond naive dictionary lookups. These optimizations are what make JavaScript competitive with statically-typed languages for performance-critical code.

For named properties, V8 uses hidden classes to assign fixed memory offsets to each property. When you access \`obj.x\`, V8 checks the object's hidden class (Map) to find the offset of \`x\`, then loads the value directly from that memory position. This is a O(1) operation — no string hashing or dictionary search needed. V8 stores properties in two categories: "in-object" properties (stored directly in the object's memory, up to an initial capacity determined by the constructor) and "out-of-object" properties (stored in a separate backing array, used when the number of properties exceeds the initial capacity). If an object transitions to a drastically different shape or has too many dynamic property additions/deletions, V8 may switch it to "dictionary mode" (slow properties) where properties are stored in a hash table — this is much slower but supports arbitrary dynamic shapes.

For array elements, V8 tracks "element kinds" — a classification of the array's contents that determines the most efficient storage strategy. The main element kinds are: PACKED_SMI_ELEMENTS (all elements are small integers, stored unboxed), PACKED_DOUBLE_ELEMENTS (all elements are numbers, stored as raw doubles), PACKED_ELEMENTS (generic, any type), and their HOLEY variants (HOLEY_SMI_ELEMENTS, etc.) which indicate the array has gaps or undefined slots. Transitions between element kinds form a lattice that only goes in one direction — from specific to generic. Once an SMI array receives a double, it transitions to DOUBLE and can never go back to SMI. Once it receives a non-number, it transitions to ELEMENTS. PACKED to HOLEY is also a one-way transition.

This matters because each element kind has a progressively slower access path. PACKED_SMI access is a simple memory offset read with no type checking. PACKED_DOUBLE requires reading a 64-bit float. PACKED_ELEMENTS requires reading a tagged pointer and potentially following it to a heap object. HOLEY variants add an additional check for holes (which must be converted to \`undefined\` or trigger prototype chain lookups). The performance difference between PACKED_SMI_ELEMENTS and HOLEY_ELEMENTS can be 10-20× for tight loops.

To write element-kind-friendly code: pre-allocate arrays to avoid holes (\`new Array(n).fill(0)\` not \`new Array(n)\`), avoid storing mixed types in arrays, avoid deleting array elements (use \`splice\` or filter instead), don't access indices beyond the array length, and avoid creating sparse arrays with gaps. For numeric computation, prefer TypedArrays (Float64Array, Int32Array) which have a fixed element kind and no polymorphism concerns.`,shortAnswer:`V8 optimizes named property access via hidden classes (fixed memory offsets) and inline caches. For arrays, V8 tracks "element kinds" — PACKED_SMI (integers), PACKED_DOUBLE (floats), PACKED_ELEMENTS (any type), and HOLEY variants. Transitions go only from specific to generic and are irreversible. PACKED_SMI is fastest; HOLEY_ELEMENTS is slowest. Consistent types and no holes yield the best array performance.`,code:`// Element kind transitions (one-way lattice)
const a = [1, 2, 3];
// Element kind: PACKED_SMI_ELEMENTS (fastest)

a.push(1.5);
// Element kind: PACKED_DOUBLE_ELEMENTS (still fast)

a.push("hello");
// Element kind: PACKED_ELEMENTS (generic, slower)
// Cannot transition back to SMI or DOUBLE!

// HOLEY arrays
const b = [1, , 3];
// Element kind: HOLEY_SMI_ELEMENTS
// The hole requires checking for undefined on every access

// Avoid this:
const c = new Array(100);
// HOLEY_SMI_ELEMENTS — all slots are holes!
c[0] = 1; // still HOLEY because it started with holes

// Prefer this:
const d = new Array(100).fill(0);
// PACKED_SMI_ELEMENTS — no holes, fastest access

// Dictionary mode for objects
const obj: Record<string, number> = {};
for (let i = 0; i < 1000; i++) {
  obj[\`prop_\${i}\`] = i;
}
// After too many dynamic properties, V8 switches to dictionary mode
// (slow properties with hash table lookup)

// TypedArrays for numeric work (fixed element kind, no polymorphism)
const positions = new Float64Array(1000);
for (let i = 0; i < positions.length; i++) {
  positions[i] = Math.random() * 100; // always double, no transitions
}

// Check element kinds with: node --allow-natives-syntax
// %DebugPrint(arr) shows the element kind`,language:`typescript`,difficulty:`Senior`,type:`Conceptual`,category:`JavaScript`,topicId:`js-engine`,tags:[`element kinds`,`property access`,`hidden classes`,`optimization`,`arrays`,`V8`],commonMistakes:["Creating arrays with `new Array(n)` without filling — this creates HOLEY elements that can never transition back to PACKED",`Mixing types in arrays without realizing the element kind degrades permanently — once an array becomes PACKED_ELEMENTS, even if you remove the non-number, it stays generic`,`Not knowing about dictionary mode — objects with too many dynamically-added properties switch from fast mode to hash-table mode, which is significantly slower for property access`],followUps:[`How do TypedArrays bypass the element kinds system entirely?`,`What is the performance difference between in-object properties and out-of-object properties?`,`How does V8 handle property access on the prototype chain — does it invalidate inline caches?`],interviewTips:[`Drawing the element kinds lattice (SMI → DOUBLE → ELEMENTS, PACKED → HOLEY) is a powerful visual that shows deep V8 knowledge.`,`Connect element kinds to real-world performance: explain how a single mixed-type push can permanently degrade an array's performance in a hot loop.`]}]}],l=[{id:`js-modules`,title:`JavaScript Modules`,description:`ES modules, CommonJS, import/export syntax, dynamic imports, module resolution, tree shaking, and interoperability between module systems.`,category:`JavaScript`,difficulty:`Intermediate`,tags:[`modules`,`ES modules`,`CommonJS`,`import`,`export`,`dynamic imports`,`tree shaking`,`require`,`module resolution`],overview:`JavaScript modules are a mechanism for splitting code into reusable, self-contained units that expose explicit interfaces. The two dominant module systems are ES Modules (ESM), which are part of the ECMAScript specification and use import/export syntax, and CommonJS (CJS), which originated in Node.js and uses require/module.exports. Understanding how these systems work, their differences, and how they interoperate is essential for modern JavaScript development. Topics like dynamic imports enable code splitting and lazy loading, while tree shaking leverages the static structure of ESM to eliminate dead code during bundling.`,concepts:[`ES Module syntax (import / export)`,`Named exports vs default exports`,`Dynamic import() expressions`,`CommonJS require() and module.exports`,`ESM vs CJS key differences`,`Module resolution algorithms (Node, bundlers)`,`Tree shaking and dead-code elimination`,`Circular dependencies`,`Module scope and encapsulation`,`Interoperability between ESM and CJS`],relatedTopicIds:[`js-closures`,`js-async`,`js-bundlers`,`js-performance`],questions:[{id:`js-modules-1`,question:`What are ES modules? How do import/export work?`,answer:'ES Modules (ESM) are the official, standardized module system introduced in ECMAScript 2015 (ES6). They allow developers to split JavaScript code into independent files that explicitly declare their dependencies and public API through `import` and `export` statements. Unlike earlier ad-hoc patterns such as the Revealing Module Pattern or IIFEs, ES modules are a language-level feature understood natively by browsers and JavaScript runtimes.\n\nThe `export` keyword makes bindings available to other modules. You can export at the declaration site — for example, `export function add(a, b) { return a + b; }` — or group exports at the bottom of a file with `export { add, subtract };`. A file may also have a single `export default` expression, which provides a convenient shorthand for the primary value a module exposes.\n\nThe `import` keyword brings those bindings into the consuming module. Named imports use destructuring-like syntax: `import { add, subtract } from "./math.js";`. Default imports can use any local name: `import myMath from "./math.js";`. You can also combine both: `import myMath, { add } from "./math.js";`. Namespace imports gather everything into one object: `import * as math from "./math.js";`.\n\nA critical property of ESM is that imports and exports are statically analyzable. The module specifiers must be string literals (not variables), and import/export statements must appear at the top level — they cannot be nested inside conditionals or functions. This static structure enables bundlers to perform tree shaking, eliminating exports that are never imported anywhere, and it allows engines to resolve the dependency graph before execution begins.\n\nES modules also create live bindings rather than value copies. When module A exports a variable and later mutates it, module B — which imported that variable — sees the updated value. This contrasts sharply with CommonJS, where `require` returns a snapshot copy. ES modules run in strict mode automatically, have their own scope (no global pollution), and support top-level `await` in modern environments.',shortAnswer:"ES Modules are the standard JavaScript module system using `import` and `export` statements. They are statically analyzable, support named and default exports, create live bindings, and run in strict mode automatically.",code:`// math.js — named exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// logger.js — default export
export default function log(message) {
  console.log(\`[LOG]: \${message}\`);
}

// app.js — importing
import log, { add, subtract } from './math.js';
import * as math from './math.js';

console.log(add(2, 3));        // 5
console.log(math.subtract(5, 2)); // 3`,language:`javascript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-modules`,tags:[`ES modules`,`import`,`export`,`ESM`],commonMistakes:[`Trying to use import/export inside a function or conditional block — they must be top-level statements.`,`Forgetting to add type="module" in the script tag when running ESM directly in the browser.`,`Confusing namespace imports (import * as X) with default imports — they are different bindings.`],followUps:[`How do live bindings work in ES modules compared to CommonJS value copies?`,`What happens if you have circular dependencies between ES modules?`,`How does top-level await change module evaluation order?`],interviewTips:[`Emphasize that ESM is statically analyzable, which enables tree shaking — this shows you understand the practical impact, not just syntax.`,`Mention live bindings vs. value copies as a key distinction from CommonJS to demonstrate deeper knowledge.`]},{id:`js-modules-2`,question:`What is the difference between named exports and default exports?`,answer:'Named exports and default exports are the two ways ES modules expose values, and they differ in syntax, semantics, and intended usage. Understanding these differences is important for writing clean, maintainable module APIs.\n\nNamed exports are created by prefixing declarations with `export` or by using an export list: `export { foo, bar };`. A module can have as many named exports as it wants. When importing, consumers must use the exact exported name inside curly braces — `import { foo } from "./mod.js"` — or rename with `as`: `import { foo as myFoo } from "./mod.js"`. Because the names must match, tooling can provide auto-complete, refactoring support, and compile-time error checks when a name is misspelled.\n\nA default export is declared with `export default`. Each module may have at most one default export. The consumer imports it without curly braces and can give it any local name: `import whatever from "./mod.js"`. Under the hood, the default export is stored under the special name `default`, so `import whatever from "./mod.js"` is roughly equivalent to `import { default as whatever } from "./mod.js"`.\n\nThe practical trade-off centers on discoverability versus convenience. Named exports are more explicit — you know the exact interface a module provides, and IDEs can auto-import them precisely. Default exports are slightly more concise for modules that expose a single primary value (a class, a React component, a function), but they sacrifice discoverability: the consuming code can name the import anything, which can lead to inconsistent naming across a codebase. For instance, one file may `import Button from "./Button"` while another writes `import Btn from "./Button"`, making grep-style searches harder.\n\nMost modern style guides (including the Airbnb guide and many TypeScript projects) prefer named exports because they play better with tree shaking, refactoring tools, and explicit APIs. Default exports remain common in React codebases (one component per file) and library entry points. You can mix both in a single module, though overuse of this pattern can be confusing.',shortAnswer:"Named exports use `export { name }` and require the consumer to import by exact name with curly braces. Default exports use `export default`, allow any import name, and are limited to one per module. Named exports are generally preferred for discoverability and tooling support.",code:`// --- Named exports ---
// utils.js
export const PI = 3.14159;
export function double(x) {
  return x * 2;
}

// consumer.js
import { PI, double } from './utils.js';
import { PI as myPI } from './utils.js'; // renaming

// --- Default export ---
// Button.js
export default function Button({ label }) {
  return \`<button>\${label}</button>\`;
}

// consumer.js
import Button from './Button.js';   // any name works
import Btn from './Button.js';      // also valid

// --- Mixing both ---
// api.js
export default class ApiClient { /* ... */ }
export function createHeaders() { /* ... */ }

import ApiClient, { createHeaders } from './api.js';`,language:`javascript`,difficulty:`Beginner`,type:`Conceptual`,category:`JavaScript`,topicId:`js-modules`,tags:[`named exports`,`default exports`,`import`,`export`],commonMistakes:["Using curly braces when importing a default export — `import { Button }` actually imports a named export called Button, not the default.",`Exporting multiple default exports from one module — only one is allowed and the second will cause a syntax error.`,`Assuming renaming a named export at the import site also renames it elsewhere — the rename is local only.`],followUps:[`Why do some style guides discourage default exports?`,`How does re-exporting work with named vs default exports?`,`Can a module have both a default and named exports with the same conceptual value?`],interviewTips:[`Mention that default exports are syntactic sugar over a special named export called "default" — it shows you understand the spec rather than just the syntax.`]},{id:`js-modules-3`,question:`How do dynamic imports work? When would you use them?`,answer:'Dynamic imports use the `import()` expression (note the function-call syntax, not the declaration keyword) to load modules at runtime. Unlike static `import` declarations, `import()` can appear anywhere in your code — inside functions, conditionals, event handlers, or loops — and it returns a Promise that resolves to the module\'s namespace object.\n\nThe primary motivation for dynamic imports is code splitting. In a large application, shipping all JavaScript in a single bundle forces users to download code they may never need. By replacing static imports with `import()` at strategic boundaries — route components, modals, admin panels, feature flags — bundlers like Webpack, Rollup, and Vite automatically split the output into smaller chunks that are loaded on demand. This dramatically improves initial page load time and reduces time-to-interactive.\n\nDynamic imports are also essential for conditional loading. Suppose a feature depends on a heavy charting library, but only 10 % of users visit the analytics page. With `import("chart-lib")` guarded behind a route or button click, the 90 % who never visit that page never download that code. Similarly, polyfills can be loaded conditionally: `if (!window.IntersectionObserver) { await import("intersection-observer"); }`. This pattern keeps the baseline bundle lean while still supporting older environments.\n\nBecause `import()` returns a Promise, it integrates naturally with async/await: `const { render } = await import("./renderer.js");`. For default exports, you destructure the `default` property: `const { default: Chart } = await import("./Chart.js");`. Error handling follows normal Promise patterns — wrap in try/catch or chain `.catch()` — which is important for graceful degradation when a chunk fails to load over a flaky network.\n\nFrameworks like React provide abstractions on top of dynamic imports. `React.lazy()` accepts a function that returns an `import()` call and yields a component you can render inside a `<Suspense>` boundary. Next.js uses `next/dynamic` for the same purpose. Under the hood, they all rely on the `import()` expression and the bundler\'s ability to recognize it as a split point.',shortAnswer:"Dynamic imports use `import()` to load modules at runtime, returning a Promise. They enable code splitting, conditional loading, and lazy loading of routes or heavy libraries, reducing initial bundle size and improving performance.",code:`// Basic dynamic import
async function loadEditor() {
  const { Editor } = await import('./Editor.js');
  return new Editor();
}

// Conditional loading
async function initAnalytics() {
  if (document.querySelector('#analytics')) {
    const { default: Chart } = await import('chart.js');
    const chart = new Chart(/* config */);
  }
}

// React.lazy with Suspense
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}

// Error handling
async function safeLoad(modulePath) {
  try {
    return await import(modulePath);
  } catch (err) {
    console.error(\`Failed to load module: \${modulePath}\`, err);
    return null;
  }
}`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-modules`,tags:[`dynamic imports`,`code splitting`,`lazy loading`,`import()`],commonMistakes:[`Forgetting that import() returns a Promise and trying to use the module synchronously without await.`,"Using a fully dynamic string variable as the specifier — bundlers cannot statically analyze it, so no chunk is created. Use partial paths like import(`./locales/${lang}.js`).",`Not handling the error case — if the network request for a chunk fails, the Promise rejects and can crash the app without a catch handler.`],followUps:[`How does Webpack magic comments (webpackChunkName, webpackPrefetch) work with dynamic imports?`,`What is the difference between React.lazy and next/dynamic?`,`How can you prefetch or preload dynamic chunks before the user needs them?`],interviewTips:[`Tie dynamic imports back to user experience — mention metrics like Time-to-Interactive and First Contentful Paint to show you understand the real-world impact.`,`If interviewing for a React role, mention React.lazy and Suspense as the idiomatic wrapper around import().`]},{id:`js-modules-4`,question:`Explain CommonJS modules (require/module.exports).`,answer:'CommonJS (CJS) is the module system that Node.js adopted from its earliest versions. Before ES modules existed, CommonJS was the de facto standard for server-side JavaScript and was widely used in build-tool ecosystems. It uses `require()` to load dependencies and `module.exports` (or the shorthand `exports`) to expose a module\'s public interface.\n\nWhen you call `require("./math")`, Node.js synchronously reads and executes the target file, wraps its contents in a function that provides `module`, `exports`, `require`, `__dirname`, and `__filename` as local variables, and then caches the result. On subsequent `require` calls for the same path, the cached `module.exports` object is returned without re-executing the file. This caching behavior means modules are effectively singletons within a process.\n\nExporting values is done by assigning to `module.exports`. You can export an object with multiple properties — `module.exports = { add, subtract };` — or a single function/class: `module.exports = function add(a, b) { return a + b; };`. The `exports` variable is initially a reference to `module.exports`, so `exports.add = add;` works for adding properties, but reassigning `exports = something` breaks the reference and the new value is not actually exported. This is a common source of bugs.\n\nBecause `require` is a regular function, it can be called anywhere — inside conditionals, loops, or other functions. This flexibility means CJS modules are evaluated eagerly and synchronously at the point of the `require` call, which works well for file-system-based loading in Node.js but makes static analysis difficult. Bundlers and tools cannot reliably determine which modules are used just by reading the source, which limits tree-shaking opportunities.\n\nDespite the rise of ES modules, CommonJS remains extremely prevalent. Thousands of npm packages still publish only CJS, Node.js still supports it natively, and many build tools and test runners use it internally. Understanding CJS is essential for working with existing Node.js codebases, configuring tools like Jest (which defaults to CJS), and debugging interoperability issues when mixing CJS and ESM.',shortAnswer:"CommonJS is Node.js's original module system. It uses `require()` to synchronously load modules and `module.exports` to expose values. Modules are cached after first load, making them singletons. It remains widely used in Node.js and npm packages.",code:`// math.js — exporting with module.exports
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };

// logger.js — exporting a single function
module.exports = function log(msg) {
  console.log(\`[LOG] \${msg}\`);
};

// app.js — requiring modules
const { add, subtract } = require('./math');
const log = require('./logger');

log(add(2, 3)); // [LOG] 5

// Conditional require (valid in CJS, not in ESM)
if (process.env.NODE_ENV === 'development') {
  const debug = require('./debug-tools');
  debug.init();
}

// CAUTION: exports shorthand pitfall
exports.foo = 'works';          // ✅ adds to module.exports
exports = { bar: 'broken' };    // ❌ breaks the reference`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-modules`,tags:[`CommonJS`,`require`,`module.exports`,`Node.js`],commonMistakes:["Reassigning `exports` directly instead of `module.exports` — this severs the reference and the new value is silently ignored.",`Assuming require() is asynchronous — it is synchronous and blocks execution until the file is fully loaded and evaluated.`,`Not realizing that require caches modules, so mutating a returned object in one file affects all other files that require the same module.`],followUps:[`How does the module caching mechanism work and how can you bust the cache?`,`What happens with circular dependencies in CommonJS?`,`Why can't bundlers tree-shake CommonJS modules as effectively as ES modules?`],interviewTips:[`Highlight the exports vs module.exports pitfall — it's a classic interview trick question and shows you've worked with CJS in practice.`]},{id:`js-modules-5`,question:`What are the key differences between ES modules and CommonJS?`,answer:"ES Modules (ESM) and CommonJS (CJS) are fundamentally different module systems with distinct execution models, syntax, and capabilities. These differences have significant practical implications for bundling, tree shaking, and cross-environment compatibility.\n\nThe most visible difference is syntax: ESM uses `import`/`export` declarations while CJS uses `require()`/`module.exports`. But the deeper difference is timing. ESM has a multi-phase lifecycle: first the engine parses import/export declarations to build a dependency graph (without executing code), then it fetches and links all modules, and finally it evaluates them. CJS is much simpler — `require()` synchronously loads and executes the file on the spot, returning the exports object immediately. This means CJS module resolution happens at runtime while ESM resolution happens before execution.\n\nThis static structure of ESM is what enables tree shaking. Because the engine (and bundlers) can see every import and export at parse time without running the code, they can determine which exports are never imported anywhere and eliminate them from the final bundle. CJS, being dynamic, does not offer this guarantee — `require` can be called with computed strings or inside conditionals, so a bundler cannot safely remove unused code.\n\nAnother critical difference is binding semantics. ESM creates live bindings: if module A exports `let count = 0` and later increments it, module B, which imported `count`, will see the updated value. CJS creates value copies: when you `require` a module, you get a snapshot of `module.exports` at that moment. Subsequent mutations to the original variable inside the exporting module are not reflected in the consumer.\n\nESM always runs in strict mode; CJS does not. ESM files have their own scope; CJS files are wrapped in a function but can leak globals if not careful. ESM supports top-level `await`; CJS does not. ESM uses URL-based resolution (important for browsers); CJS uses file-path-based resolution with the `node_modules` lookup algorithm. Finally, ESM is the standard endorsed by the ECMAScript specification and increasingly by Node.js, while CJS is Node-specific and considered legacy for new projects, though it remains deeply entrenched in the ecosystem.",shortAnswer:`ESM uses import/export with static analysis enabling tree shaking; CJS uses require/module.exports evaluated dynamically at runtime. ESM creates live bindings while CJS copies values. ESM is strict mode by default and supports top-level await. ESM is the standard; CJS is Node-specific legacy.`,code:`// === ES Modules ===
// Static — must be top-level, string literal specifiers
import { readFile } from 'fs/promises';  // parsed before execution
export const version = '1.0.0';

// Live binding demonstration
// counter.mjs
export let count = 0;
export function increment() { count++; }

// consumer.mjs
import { count, increment } from './counter.mjs';
console.log(count); // 0
increment();
console.log(count); // 1  (live binding — sees the update)

// === CommonJS ===
// Dynamic — can appear anywhere, computed specifiers
const fs = require('fs');  // executed at this line
module.exports = { version: '1.0.0' };

// Value copy demonstration
// counter.cjs
let count = 0;
module.exports = { count, increment() { count++; } };

// consumer.cjs
const counter = require('./counter.cjs');
console.log(counter.count); // 0
counter.increment();
console.log(counter.count); // 0  (value copy — does NOT update)

// === Key comparison ===
// ESM: top-level await is allowed
const data = await fetch('/api/config').then(r => r.json());

// CJS: top-level await is a syntax error
// const data = await fetch('/api'); // ❌ SyntaxError`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-modules`,tags:[`ES modules`,`CommonJS`,`comparison`,`live bindings`,`tree shaking`],commonMistakes:[`Assuming require() works inside ES modules — in Node.js ESM, require is not defined; you must use import or createRequire().`,`Thinking tree shaking works equally well with CJS — it does not, because CJS is dynamically evaluated and not statically analyzable.`,`Mixing .mjs and .cjs files without understanding how Node.js resolves the module type (file extension or package.json "type" field).`],followUps:[`How does Node.js determine whether a file is ESM or CJS?`,`What is createRequire() and when would you use it?`,`How do circular dependencies behave differently in ESM vs CJS?`],interviewTips:[`Structure your answer around three pillars — syntax, binding semantics, and static vs. dynamic analysis — to show organized thinking.`,`The live binding vs. value copy distinction is often the differentiator between a surface-level and a deep answer.`]},{id:`js-modules-6`,question:`How does module resolution work?`,answer:'Module resolution is the algorithm a runtime or bundler uses to translate a module specifier (the string in `import "foo"` or `require("foo")`) into an actual file path. The rules differ between Node.js CJS, Node.js ESM, and bundlers like Webpack or Vite, but the core concepts overlap.\n\nIn Node.js CommonJS resolution, specifiers fall into three categories. Bare specifiers like `require("lodash")` trigger the `node_modules` lookup: Node starts from the directory of the requiring file, looks for `node_modules/lodash`, and if not found, walks up the directory tree until it reaches the filesystem root. Relative specifiers like `require("./utils")` resolve against the current file\'s directory, and Node tries appending `.js`, `.json`, and `.node` extensions in order, then checks for a directory with an `index.js`. Core modules like `require("fs")` are resolved from Node\'s built-in module cache and always take priority.\n\nNode.js ESM resolution is stricter. It requires explicit file extensions — `import "./utils.js"` works but `import "./utils"` does not (without additional configuration). This is because ESM was designed with URL-based resolution in mind, matching browser behavior where the server must know the exact resource to fetch. The `node_modules` lookup still works for bare specifiers, but Node consults the `exports` field in the dependency\'s `package.json` first, which lets library authors define entry points, conditional exports (different files for `import` vs. `require`), and subpath patterns.\n\nBundlers add their own resolution enhancements. Webpack supports `resolve.alias` to remap specifiers, `resolve.extensions` to try additional suffixes like `.ts` or `.tsx`, and `resolve.modules` to specify custom lookup directories. TypeScript uses `paths` and `baseUrl` in `tsconfig.json` for similar path aliasing. Vite uses `resolve.alias` and relies on the `exports` field in `package.json`. These tools essentially extend the base Node.js algorithm with project-specific rules, which is why a module that resolves correctly under one tool may fail under another.\n\nUnderstanding resolution is crucial for debugging "module not found" errors, configuring monorepo setups, and optimizing bundle output. Misconfigured resolution can lead to duplicate copies of the same library in a bundle, version conflicts, or runtime crashes.',shortAnswer:`Module resolution translates a specifier string into a file path. Node.js CJS walks up node_modules directories and tries extensions automatically. Node.js ESM requires explicit extensions and consults the package.json "exports" field. Bundlers extend these algorithms with aliases, custom extensions, and path mapping.`,code:`// Node.js CJS resolution examples
const fs = require('fs');            // built-in module (highest priority)
const lodash = require('lodash');    // bare specifier → node_modules lookup
const utils = require('./utils');    // relative → ./utils.js, ./utils/index.js

// Node.js ESM — explicit extensions required
import { readFile } from 'fs/promises';    // built-in
import lodash from 'lodash';               // bare → package.json "exports"
import { helper } from './utils.js';       // explicit .js required

// package.json "exports" field (library side)
// {
//   "name": "my-lib",
//   "exports": {
//     ".": {
//       "import": "./dist/esm/index.js",
//       "require": "./dist/cjs/index.js"
//     },
//     "./utils": {
//       "import": "./dist/esm/utils.js",
//       "require": "./dist/cjs/utils.js"
//     }
//   }
// }

// Webpack resolve configuration
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
};`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-modules`,tags:[`module resolution`,`node_modules`,`package.json`,`exports field`],commonMistakes:[`Omitting file extensions in Node.js ESM imports — unlike CJS, ESM does not auto-resolve extensions by default.`,`Confusing the "main" field with the "exports" field in package.json — "exports" takes precedence and is more powerful but has different syntax.`,`Not realizing that TypeScript path aliases (tsconfig paths) are only for type checking — you still need bundler or runtime alias configuration for actual resolution.`],followUps:[`What is the difference between the "main", "module", and "exports" fields in package.json?`,`How do import maps work in browsers and how do they relate to module resolution?`,`How does pnpm's node_modules structure affect module resolution compared to npm?`],interviewTips:[`Mention the three specifier categories (bare, relative, absolute/built-in) to show you have a systematic mental model rather than ad-hoc knowledge.`]},{id:`js-modules-7`,question:`What is tree shaking and how does it relate to modules?`,answer:'Tree shaking is a dead-code elimination technique used by JavaScript bundlers (Webpack, Rollup, esbuild, Vite) to remove exported code that is never imported by any consumer. The term originates from the idea of "shaking" a dependency tree so that unused leaves fall off, resulting in a smaller production bundle.\n\nTree shaking relies fundamentally on the static structure of ES modules. Because `import` and `export` declarations must appear at the top level with string-literal specifiers, the bundler can build a complete graph of which exports are consumed before executing any code. If module A exports `foo` and `bar` but the application only imports `foo`, the bundler marks `bar` as unused and excludes it (and any code reachable only from `bar`) from the final output. This is only possible because ESM guarantees that the dependency graph is deterministic at parse time.\n\nCommonJS modules are largely opaque to tree shaking. Since `require()` is a runtime function that can be called conditionally or with computed strings, and since `module.exports` is a mutable object, a bundler cannot safely determine which properties are unused. Some bundlers attempt heuristic CJS tree shaking, but it is far less effective. This is one of the strongest practical arguments for authoring and publishing libraries in ESM format.\n\nFor tree shaking to work well, code must be free of side effects. A side effect is any operation that affects state outside its own scope — for example, modifying a global variable, writing to the DOM, or calling a function at the module\'s top level. If a module has side effects, the bundler cannot safely remove it even if none of its exports are imported, because removing it would change program behavior. The `"sideEffects"` field in `package.json` lets library authors declare that their modules are side-effect-free, giving the bundler explicit permission to prune unused files.\n\nPractical tips for maximizing tree-shaking effectiveness include: prefer named exports over default exports (some bundlers handle them better), avoid barrel files (`index.js` that re-exports everything) unless the bundler has advanced scope analysis, mark packages as `sideEffects: false`, avoid top-level code with side effects in library modules, and use ESM output for library builds. Tools like `webpack-bundle-analyzer` or `source-map-explorer` help visualize what made it into the bundle and identify tree-shaking failures.',shortAnswer:`Tree shaking is dead-code elimination that removes unused exports from the final bundle. It depends on the static structure of ES modules to determine which exports are imported. Code must be side-effect-free for optimal results. The package.json "sideEffects" field helps bundlers prune safely.`,code:`// math.js — library with named exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

// app.js — only imports add
import { add } from './math.js';
console.log(add(1, 2));
// After tree shaking: subtract and multiply are removed from the bundle

// package.json — marking a package as side-effect-free
// {
//   "name": "my-utils",
//   "sideEffects": false
// }

// Or specify files that DO have side effects:
// {
//   "sideEffects": ["./src/polyfills.js", "*.css"]
// }

// ❌ Anti-pattern: barrel file that defeats tree shaking
// index.js
export { Chart } from './Chart.js';          // 50 KB
export { DataGrid } from './DataGrid.js';    // 80 KB
export { Calendar } from './Calendar.js';    // 40 KB
// Importing just Chart may still pull in DataGrid and Calendar
// if the bundler cannot prove the re-exports are side-effect-free

// ✅ Better: import directly from the source module
import { Chart } from 'my-lib/Chart';`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-modules`,tags:[`tree shaking`,`dead code elimination`,`bundling`,`sideEffects`],commonMistakes:[`Assuming tree shaking works with CommonJS — it is far less effective because require() is dynamic and module.exports is mutable.`,`Forgetting to set "sideEffects": false in package.json, causing bundlers to conservatively keep all modules.`,`Using barrel index files that re-export large modules — some bundlers pull in the entire barrel even if only one export is used.`],followUps:[`How do you debug tree-shaking failures in a Webpack or Rollup build?`,`What role does the "module" field in package.json play for tree shaking?`,`How does scope hoisting (module concatenation) complement tree shaking?`],interviewTips:[`Connect tree shaking to real bundle-size impact — mention that it can shave tens or hundreds of kilobytes off production builds, directly improving load time.`,`Mention the sideEffects field and barrel-file pitfalls to show you've dealt with tree shaking in real projects, not just read about it.`]}]}],u=[{id:`js-data-structures`,title:`Advanced Data Structures`,description:`Deep dive into JavaScript's built-in data structures including Map, Set, WeakMap, and WeakSet — their APIs, performance characteristics, garbage collection implications, and real-world use cases.`,category:`JavaScript`,subcategory:`Data Structures`,difficulty:`Intermediate`,tags:[`Map`,`Set`,`WeakMap`,`WeakSet`,`data structures`,`garbage collection`,`collections`,`ES6`],overview:`ES6 introduced four keyed collection types — Map, Set, WeakMap, and WeakSet — that address long-standing limitations of plain objects and arrays. Map provides a true key-value store that accepts any value as a key, Set offers unique-value semantics, and the Weak variants enable patterns that cooperate with the garbage collector instead of fighting it. Understanding when and why to reach for each collection is a common senior-level interview topic.`,concepts:[`Map vs plain object for key-value storage`,`Set vs array for unique-value collections`,`WeakMap and WeakSet weak reference semantics`,`Garbage collection and memory leak prevention`,`Iteration protocols on Map and Set`,`Key equality semantics (SameValueZero)`,`Performance characteristics of each collection`,`Private data and metadata patterns with WeakMap`],relatedTopicIds:[`js-closures`,`js-prototypes`,`js-iterators-generators`,`js-memory-management`],questions:[{id:`js-ds-1`,question:`What are Map and Set? How do they differ from plain objects and arrays?`,shortAnswer:`Map is a keyed collection that allows any value (including objects and functions) as a key and maintains insertion order. Set is an ordered collection of unique values. Unlike plain objects, Map keys are not coerced to strings, and unlike arrays, Set automatically enforces uniqueness and provides O(1) lookups.`,answer:`Map is a collection of key-value pairs where both the key and the value can be of any type. This is fundamentally different from plain objects where keys are always coerced to strings (or Symbols). A Map remembers the original insertion order of its entries, provides a .size property for O(1) length checks, and is directly iterable with for...of. Its key-comparison algorithm uses SameValueZero, which treats NaN as equal to NaN — unlike the === operator.

Set is a collection of unique values of any type. While you can approximate uniqueness with an array and indexOf/includes, Set guarantees O(1) has-checks and automatic deduplication. Like Map, it preserves insertion order and is directly iterable. Under the hood most engines implement Set with a hash table, so add, has, and delete are all constant-time on average.

Plain objects have several drawbacks as general-purpose dictionaries: keys are limited to strings and Symbols, there is no built-in size property (you must call Object.keys(obj).length), and they inherit properties from Object.prototype which can collide with user keys (e.g. "constructor", "toString"). Map avoids all of these issues and also performs better in scenarios that involve frequent additions and deletions of key-value pairs, according to the spec's performance notes.

Arrays are ordered and indexable but do not enforce uniqueness, and searching for a value is O(n). Set trades away index-based access in exchange for guaranteed uniqueness and constant-time membership tests. If you need both ordering and uniqueness, Set is the idiomatic choice.

In practice, plain objects remain the best choice for static, string-keyed records (like configuration or JSON shapes), while Map shines for dynamic dictionaries, caches, and any situation where non-string keys are needed. Similarly, arrays are ideal for ordered, possibly-duplicate collections, whereas Set is preferred when you need a mathematical set of distinct items.`,code:`// --- Map vs plain object ---
const map = new Map<string, number>();
map.set('a', 1);
map.set('b', 2);
console.log(map.size); // 2
console.log(map.get('a')); // 1

// Any value as key — objects, functions, even NaN
const objKey = { id: 1 };
const fnKey = () => {};
map.set(objKey as unknown as string, 10); // type-safe version below
const flexMap = new Map<unknown, number>();
flexMap.set(objKey, 10);
flexMap.set(fnKey, 20);
flexMap.set(NaN, 30);
console.log(flexMap.get(NaN)); // 30  (NaN === NaN is false, but Map uses SameValueZero)

// Iteration preserves insertion order
for (const [key, value] of flexMap) {
  console.log(key, value);
}

// --- Set vs array ---
const set = new Set<number>([1, 2, 3, 2, 1]);
console.log(set.size); // 3  (duplicates removed)
console.log(set.has(2)); // true  — O(1)

// Quick array dedup
const nums = [4, 1, 2, 4, 3, 2];
const unique = [...new Set(nums)]; // [4, 1, 2, 3]

// Set operations (ES2025+ or manual)
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// Union
const union = new Set([...a, ...b]); // {1,2,3,4}

// Intersection
const intersection = new Set([...a].filter(x => b.has(x))); // {2,3}

// Difference
const difference = new Set([...a].filter(x => !b.has(x))); // {1}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-data-structures`,tags:[`Map`,`Set`,`objects`,`arrays`,`ES6`],commonMistakes:[`Using plain objects as maps with user-supplied keys — prototype pollution or key collision with inherited properties like "constructor" can cause subtle bugs.`,`Assuming Set uses strict equality for comparison — it actually uses SameValueZero, so NaN is considered equal to NaN inside a Set.`,`Forgetting that Map.prototype.size is a getter property, not a method — calling map.size() throws a TypeError.`],followUps:[`How does SameValueZero differ from strict equality (===) and Object.is?`,`What are the performance implications of using Map vs Object for very large collections?`,`How would you serialize a Map to JSON and deserialize it back?`],interviewTips:[`When comparing Map to Object, mention concrete pain points: non-string keys, prototype pollution, missing .size, and poor iteration ergonomics on objects.`,`Show you understand time-complexity: Map and Set provide O(1) average for get/set/has/delete, while Object property access is also O(1) on average but with caveats around hidden classes in V8.`]},{id:`js-ds-2`,question:`Explain WeakMap and WeakSet. What problems do they solve?`,shortAnswer:`WeakMap and WeakSet hold "weak" references to their object keys (or values, in WeakSet's case), meaning those references do not prevent garbage collection. They solve the problem of associating metadata with objects without causing memory leaks when those objects are no longer needed elsewhere in the program.`,answer:`WeakMap is a collection of key-value pairs where the keys must be objects (or non-registered symbols as of ES2023) and are held weakly. "Weakly" means the garbage collector does not consider the WeakMap's reference to the key when determining whether the key object is reachable. If no other reference to the key exists, it — along with its associated value — can be garbage collected, and the entry silently disappears from the WeakMap.

WeakSet works the same way but for a set of objects: if an object in a WeakSet has no other references, it becomes eligible for garbage collection and is automatically removed from the WeakSet. Both WeakMap and WeakSet are not iterable, have no .size property, and do not support clear(). These restrictions exist because their contents are non-deterministic — entries can vanish at any time depending on GC behavior.

The primary problem they solve is memory leaks in metadata-association patterns. Imagine you want to attach extra data to DOM nodes, third-party objects, or class instances without modifying them. With a regular Map you would keep those objects alive in the Map's key set forever, even after the rest of your application has moved on. A WeakMap lets the metadata be automatically cleaned up when the original object is garbage collected.

A classic example is storing private instance data. Before the # private fields syntax, library authors used a module-scoped WeakMap keyed by the instance to hold truly private data. Because the WeakMap holds the instance weakly, disposing of the instance also releases the private data — no manual cleanup required.

WeakSet is useful for "tagging" objects — for instance, tracking which objects have already been processed, visited, or validated. Since the tag disappears once the object is collected, there is zero risk of an ever-growing bookkeeping set. In frameworks, WeakSet is sometimes used to track which reactive objects have already been proxied, preventing double-wrapping.`,code:`// --- WeakMap: associating metadata without memory leaks ---
const metadata = new WeakMap<object, Record<string, unknown>>();

function process(obj: object) {
  if (!metadata.has(obj)) {
    metadata.set(obj, { processedAt: Date.now() });
  }
  return metadata.get(obj);
}

let element: object | null = { id: 'btn-1' };
process(element);
console.log(metadata.has(element)); // true

element = null;
// The { id: 'btn-1' } object is now eligible for GC.
// Its entry in \`metadata\` will be cleaned up automatically.

// --- WeakMap for private data (pre-# syntax pattern) ---
const _private = new WeakMap<InstanceType<typeof Person>, { age: number }>();

class Person {
  constructor(public name: string, age: number) {
    _private.set(this, { age });
  }

  getAge(): number {
    return _private.get(this)!.age;
  }
}

const p = new Person('Alice', 30);
console.log(p.getAge()); // 30
console.log((p as Record<string, unknown>)['age']); // undefined — truly private

// --- WeakSet: tagging objects ---
const visited = new WeakSet<object>();

function traverse(node: { children?: object[] }) {
  if (visited.has(node)) return; // already seen, skip
  visited.add(node);
  node.children?.forEach(child => traverse(child as { children?: object[] }));
}`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-data-structures`,tags:[`WeakMap`,`WeakSet`,`garbage collection`,`memory leaks`],commonMistakes:[`Trying to use primitive values as WeakMap keys — only objects (and non-registered symbols in ES2023+) are valid keys; primitives will throw a TypeError.`,`Expecting WeakMap or WeakSet to be iterable or to have a .size property — they intentionally lack these because their contents are non-deterministic.`,`Assuming entries are removed immediately when the key is dereferenced — cleanup depends on the engine's GC schedule, which is non-deterministic.`],followUps:[`How would you implement a simple cache with automatic eviction using WeakMap?`,`Can you use WeakRef and FinalizationRegistry together with WeakMap for advanced GC-aware patterns?`,`Why can't WeakMap keys be primitives from a garbage collection perspective?`],interviewTips:[`Emphasize that "weak" refers to the reference strength from the GC's perspective, not to the data structure being somehow inferior.`,`Mention real-world usage: frameworks like Vue use WeakMap/WeakSet internally for reactivity tracking.`]},{id:`js-ds-3`,question:`How does garbage collection work with WeakMap and WeakSet?`,shortAnswer:`WeakMap and WeakSet hold weak references to their keys (or members). The garbage collector ignores these references when determining reachability, so if no strong reference to the key object exists elsewhere, the GC can reclaim it and the entry is silently removed from the collection.`,answer:`JavaScript engines typically use a mark-and-sweep garbage collection algorithm. Starting from a set of "roots" (global object, call stack, active closures), the collector traverses all reachable objects and marks them as alive. Any object not marked is swept and its memory reclaimed. A regular Map or Set entry counts as a strong reference — the collector treats the Map's internal slot pointing to the key as a valid path from root, keeping the key alive.

WeakMap and WeakSet use a different internal reference type that the GC is free to ignore during the mark phase. If the only remaining reference to an object is inside a WeakMap key slot (or a WeakSet value slot), the collector will not mark it. On the next sweep, the object is reclaimed and the engine removes the corresponding entry from the WeakMap/WeakSet. The timing of this cleanup is entirely up to the engine — it may happen immediately, on the next GC cycle, or be deferred.

This is precisely why WeakMap and WeakSet are not enumerable: the set of live entries is unpredictable and can change between any two lines of synchronous code if the engine performs an opportunistic GC. Providing .size or iteration methods would expose GC internals to userland code, which could lead to non-deterministic program behavior and security concerns (GC-based side channels).

In V8 (Chrome/Node), weak references are managed through an ephemeron table. An ephemeron is a key-value pair where the value is only considered reachable if the key is reachable through non-weak paths. This requires a special fixpoint iteration during the mark phase: the collector repeatedly scans ephemerons until no new keys become reachable. This makes WeakMap GC slightly more expensive per-cycle than regular Map, but the memory savings from automatic cleanup more than compensate in long-lived applications.

ES2021 further expanded the weak-reference toolkit with WeakRef and FinalizationRegistry. WeakRef provides a weak reference to a single object (with .deref() to access it), while FinalizationRegistry lets you register a callback to run after an object is collected. These lower-level primitives are useful for building caches and resource managers but are harder to use correctly than WeakMap/WeakSet.`,code:`// Demonstrating GC behavior (conceptual — GC timing is non-deterministic)
const cache = new WeakMap<object, string>();

function expensiveComputation(input: object): string {
  if (cache.has(input)) {
    return cache.get(input)!;
  }
  const result = JSON.stringify(input); // simulate work
  cache.set(input, result);
  return result;
}

let config: object | null = { theme: 'dark', lang: 'en' };
expensiveComputation(config);
console.log(cache.has(config)); // true

// Remove the only strong reference
config = null;

// At some future point, GC runs:
// - \`config\` object is unreachable (no strong refs)
// - WeakMap entry { key: config, value: '...' } is cleaned up
// - Memory for both key and value is reclaimed

// --- WeakRef + FinalizationRegistry (ES2021) ---
const registry = new FinalizationRegistry<string>((heldValue) => {
  console.log(\`Object associated with "\${heldValue}" was collected\`);
});

function createTracked(label: string) {
  const obj = { label };
  registry.register(obj, label);
  return new WeakRef(obj);
}

let ref = createTracked('my-object');
console.log(ref.deref()); // { label: 'my-object' }

// Later, if no strong reference exists:
// ref.deref() returns undefined
// registry callback fires with 'my-object'`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-data-structures`,tags:[`garbage collection`,`WeakMap`,`WeakSet`,`WeakRef`,`FinalizationRegistry`,`memory`],commonMistakes:[`Relying on FinalizationRegistry callbacks for critical cleanup logic — the spec does not guarantee callbacks will ever run (e.g. if the program exits first).`,`Calling WeakRef.deref() and storing the result in a long-lived variable — this recreates a strong reference and defeats the purpose of the weak reference.`,`Assuming WeakMap entries are removed synchronously when the last strong reference is dropped — GC timing is engine-specific and non-deterministic.`],followUps:[`What is an ephemeron and how does it affect garbage collection performance?`,`How do WeakRef and FinalizationRegistry relate to WeakMap under the hood?`,`Can garbage collection behavior differ between V8, SpiderMonkey, and JavaScriptCore?`],interviewTips:[`Knowing the term "ephemeron" and being able to explain mark-and-sweep at a high level signals deep understanding — interviewers notice this.`,`Mention that WeakRef should be a last resort; WeakMap covers most real-world use cases more safely.`]},{id:`js-ds-4`,question:`When would you use Map over a plain object?`,shortAnswer:`Use Map when you need non-string keys, frequent additions/deletions, guaranteed insertion-order iteration, a reliable .size property, or when user-supplied keys could collide with Object.prototype properties. Plain objects are better for static, string-keyed records like configuration or serialized data.`,answer:`The most obvious reason to choose Map is when you need keys that are not strings or Symbols. Map accepts any value — objects, functions, DOM elements, numbers, even NaN — as a key. With a plain object, every key is coerced to a string, so using an object as a key yields the infamous "[object Object]" collision.

Performance is another consideration. The ECMAScript specification explicitly states that Maps "must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of elements." In practice, V8's Map implementation is optimized for frequent insertions and deletions, whereas plain objects use hidden classes and inline caches that are optimized for a fixed shape. If your collection grows and shrinks dynamically, Map avoids the hidden-class transition overhead that objects incur.

Map also provides a reliable .size getter, direct iteration via for...of, and built-in methods like forEach, entries, keys, and values. With objects you need Object.keys(obj).length for size (which creates a temporary array) and Object.entries(obj) for iteration. Map's iteration is inherently ordered by insertion time and includes all entries — objects technically maintain insertion order for string keys too (since ES2015), but integer-like keys are sorted numerically first, which can be surprising.

Security and correctness matter as well. Plain objects inherit from Object.prototype, so keys like "constructor", "toString", or "__proto__" can shadow built-in properties or, worse, enable prototype pollution attacks when user input is used as keys. Object.create(null) mitigates this but loses all object conveniences. Map has no prototype chain issues — every key is just data.

That said, plain objects remain the right tool for structured records with known, fixed keys — configuration objects, function options, parsed JSON, and similar shapes. They integrate seamlessly with TypeScript interfaces, JSON serialization, and destructuring. Use Map for dynamic dictionaries; use objects for static records.`,code:`// 1. Non-string keys
const componentState = new Map<HTMLElement, { clicks: number }>();
const btn = document.createElement('button');
componentState.set(btn, { clicks: 0 });

// With a plain object this silently fails:
const badCache: Record<string, number> = {};
const keyA = { id: 1 };
const keyB = { id: 2 };
badCache[keyA as unknown as string] = 1;
badCache[keyB as unknown as string] = 2;
console.log(Object.keys(badCache)); // ['[object Object]'] — collision!

// 2. Frequent additions/deletions
function frequentUpdates() {
  const map = new Map<string, number>();
  for (let i = 0; i < 100_000; i++) {
    map.set(\`key-\${i}\`, i);
  }
  for (let i = 0; i < 50_000; i++) {
    map.delete(\`key-\${i}\`);
  }
  return map.size; // 50000 — O(1)
}

// 3. Safe from prototype pollution
const userInput = '__proto__';
const safeMap = new Map<string, string>();
safeMap.set(userInput, 'safe value');
console.log(safeMap.get('__proto__')); // 'safe value' — no prototype issues

// Contrast with object:
const unsafeObj: Record<string, string> = {};
// unsafeObj[userInput] = 'oops'; // can trigger prototype pollution in older engines

// 4. Reliable size and iteration
const inventory = new Map<string, number>([
  ['apples', 50],
  ['bananas', 30],
  ['cherries', 100],
]);
console.log(inventory.size); // 3

for (const [fruit, count] of inventory) {
  console.log(\`\${fruit}: \${count}\`);
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-data-structures`,tags:[`Map`,`Object`,`performance`,`prototype pollution`,`ES6`],commonMistakes:[`Defaulting to Map for every key-value need — plain objects are still better for static, string-keyed records and have superior TypeScript integration and JSON support.`,`Using JSON.stringify on a Map and expecting it to work — Map serializes to an empty object by default; you must convert to entries first.`,`Forgetting that Map keys use SameValueZero comparison, so two different object references that look identical are treated as different keys.`],followUps:[`How would you implement a LRU cache using Map's insertion-order semantics?`,`What hidden-class optimizations does V8 apply to plain objects but not to Maps?`,`How do you convert between Map and plain object idiomatically?`],interviewTips:[`Structure your answer around categories — key types, performance, safety, ergonomics — rather than listing random facts. This shows organized thinking.`]},{id:`js-ds-5`,question:`What are the practical use cases for WeakMap?`,shortAnswer:`WeakMap is commonly used for storing private instance data, caching computed results tied to object lifetimes, associating metadata with DOM elements without causing leaks, and tracking memoization entries that should be cleaned up automatically when the source objects are garbage collected.`,answer:`The most classic use case for WeakMap is storing private data for class instances. Before the # private fields syntax landed, library authors stored truly private data in a module-scoped WeakMap keyed by this. Since external code cannot access the WeakMap, the data is encapsulated, and because the reference is weak, destroying the instance also releases the private data. Some codebases still prefer this pattern for its flexibility — for example, you can share a private store between multiple classes in the same module.

DOM metadata association is another everyday scenario. Suppose you need to attach state (scroll positions, event counts, animation timers) to DOM nodes managed by a framework. Using a regular Map or an expando property keeps the node alive even after it has been removed from the document. A WeakMap lets the node — and its associated metadata — be collected once the framework releases it. Libraries like jQuery historically struggled with this exact problem; WeakMap is the modern, leak-free solution.

Caching and memoization keyed by object identity also benefit from WeakMap. Consider a function that performs expensive computation on an object and caches the result. With a Map the cache grows indefinitely; with a WeakMap, cache entries are evicted as the input objects become unreachable. This is particularly valuable in server-side rendering or long-running Node processes where unbounded caches can cause memory exhaustion.

Reactive frameworks use WeakMap extensively. Vue 3's reactivity system stores reactive proxies in a WeakMap keyed by the original target object. This prevents double-proxying (the same object is always mapped to the same proxy) and ensures that if the original object goes out of scope, both the proxy and its dependency-tracking metadata are cleaned up.

Finally, WeakMap is useful in branding/tagging patterns — verifying that an object was created by a specific factory or has passed through a validation step. Since the WeakMap is module-private and non-iterable, external code cannot forge or enumerate the tags.`,code:`// 1. Private instance data
const _internals = new WeakMap<InstanceType<typeof Timer>, { startTime: number }>();

class Timer {
  constructor() {
    _internals.set(this, { startTime: Date.now() });
  }

  elapsed(): number {
    return Date.now() - _internals.get(this)!.startTime;
  }
}

// 2. DOM metadata without memory leaks
const nodeData = new WeakMap<Element, { clickCount: number }>();

function trackClicks(el: Element) {
  if (!nodeData.has(el)) {
    nodeData.set(el, { clickCount: 0 });
  }
  el.addEventListener('click', () => {
    const data = nodeData.get(el)!;
    data.clickCount++;
  });
}
// When \`el\` is removed from DOM and dereferenced, its entry is GC'd.

// 3. Object-keyed memoization cache
const computeCache = new WeakMap<object, number>();

function expensiveHash(obj: object): number {
  if (computeCache.has(obj)) {
    return computeCache.get(obj)!;
  }
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  computeCache.set(obj, hash);
  return hash;
}

// 4. Branding / validation tagging
const validated = new WeakMap<object, true>();

function validate(input: object): void {
  // ... validation logic ...
  validated.set(input, true);
}

function processValidated(input: object): void {
  if (!validated.has(input)) {
    throw new Error('Input must be validated first');
  }
  // safe to process
}`,language:`typescript`,difficulty:`Advanced`,type:`Scenario`,category:`JavaScript`,topicId:`js-data-structures`,tags:[`WeakMap`,`private data`,`DOM`,`memoization`,`caching`],commonMistakes:[`Using WeakMap for data you need to enumerate or persist — since WeakMap is not iterable and entries can vanish, it is unsuitable for data that must be listed, serialized, or guaranteed to exist.`,`Creating a WeakMap keyed by short-lived primitives wrapped in objects just to use WeakMap — this adds complexity without benefit; a regular Map with manual cleanup is simpler.`,`Forgetting to handle the case where WeakMap.get() returns undefined because the entry has been garbage-collected between a .has() check and a .get() call in async code.`],followUps:[`How does Vue 3 use WeakMap in its reactivity system?`,`What is the difference between using WeakMap for private data vs using # private fields?`,`Can you use WeakMap in a cross-realm (iframe) scenario?`],interviewTips:[`Give at least two concrete use cases (private data + DOM metadata is a strong pair) and explain why a regular Map would cause a memory leak in each.`]},{id:`js-ds-6`,question:`Compare Map, Set, WeakMap, and WeakSet in terms of functionality and use cases.`,shortAnswer:`Map stores key-value pairs with any key type and is iterable. Set stores unique values and is iterable. WeakMap stores key-value pairs with weakly-held object keys and is not iterable. WeakSet stores unique objects with weak references and is not iterable. The "Weak" variants cooperate with garbage collection and are suited for metadata-association and tagging patterns where automatic memory cleanup is desired.`,answer:`Map is the most feature-rich of the four. It supports any key type, preserves insertion order, exposes .size, and provides full iteration (keys, values, entries, forEach, for...of). Use it when you need a dynamic dictionary with non-string keys, ordered iteration, or a size count. Common scenarios include lookup tables, caches with bounded lifetimes (using manual eviction), and bidirectional mappings.

Set provides unique-value semantics with O(1) add/has/delete and insertion-order iteration. It is ideal for deduplication, membership checks, and implementing mathematical set operations (union, intersection, difference). ES2025 is adding Set methods like .union(), .intersection(), .difference(), and .symmetricDifference() directly on the prototype, making Set even more practical.

WeakMap trades iteration, .size, and clear() for garbage-collection-friendly storage. Keys must be objects, and entries are automatically removed when their key is collected. This makes WeakMap the right tool for associating metadata with objects you do not own (DOM nodes, third-party instances) and for private-data patterns. The inability to iterate is a feature, not a limitation — it ensures you cannot accidentally depend on GC-sensitive data.

WeakSet is the simplest of the four: a non-iterable set of weakly-held objects. It answers one question efficiently: "has this object been seen before?" Use it for tagging, cycle detection in graph traversals, and deduplication guards in reactive systems. Since it cannot be enumerated, it has a very narrow API: add, has, delete.

A useful mental model is a 2×2 matrix: strong vs weak references on one axis, key-value vs value-only on the other. Map and Set are strong (entries stay as long as the collection exists); WeakMap and WeakSet are weak (entries live only as long as the key/value is externally reachable). Map and WeakMap are key-value; Set and WeakSet are value-only. Choose the combination that fits your data-lifetime and access-pattern requirements.`,code:`// --- Side-by-side API comparison ---

// Map: full-featured key-value store
const map = new Map<string, number>([['x', 1], ['y', 2]]);
map.set('z', 3);
map.get('x');          // 1
map.has('y');          // true
map.delete('y');       // true
map.size;              // 2
[...map.keys()];       // ['x', 'z']
[...map.values()];     // [1, 3]
[...map.entries()];    // [['x', 1], ['z', 3]]

// Set: unique values, iterable
const set = new Set<number>([1, 2, 3, 2]);
set.add(4);
set.has(2);            // true
set.delete(2);         // true
set.size;              // 3
[...set];              // [1, 3, 4]

// WeakMap: weak keys, NOT iterable
const wm = new WeakMap<object, string>();
let key = { id: 1 };
wm.set(key, 'data');
wm.get(key);           // 'data'
wm.has(key);           // true
// wm.size             — undefined (no size property)
// [...wm]             — TypeError (not iterable)
// wm.clear()          — TypeError (no clear method)

// WeakSet: weak values, NOT iterable
const ws = new WeakSet<object>();
let obj = { id: 2 };
ws.add(obj);
ws.has(obj);           // true
ws.delete(obj);        // true
// ws.size             — undefined
// [...ws]             — TypeError

// --- Choosing the right collection ---
interface CollectionGuide {
  needNonStringKeys: 'Map or WeakMap';
  needIteration: 'Map or Set';
  needAutoGC: 'WeakMap or WeakSet';
  needUniqueValues: 'Set or WeakSet';
  needKeyValuePairs: 'Map or WeakMap';
  staticStringKeys: 'Plain object';
  orderedWithDuplicates: 'Array';
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-data-structures`,tags:[`Map`,`Set`,`WeakMap`,`WeakSet`,`comparison`],commonMistakes:[`Using WeakMap/WeakSet when you need to iterate over entries — they are intentionally non-iterable; use Map/Set with manual cleanup instead.`,`Assuming Map and Set have identical performance characteristics — Set operations are generally slightly faster because there is no value slot to manage.`,`Overlooking that WeakMap values (not just keys) are also released when the key is collected — if the value holds expensive resources, this automatic cleanup is significant.`],followUps:[`How would you implement a bidirectional map (BiMap) using two Maps?`,`What new Set methods are being added in ES2025 and how do they work?`,`Can you combine Map and WeakMap to build a cache with both enumeration and automatic eviction?`],interviewTips:[`Frame your comparison around a 2×2 matrix (strong/weak × key-value/value-only) — this shows structured thinking and makes the answer easy to follow.`,`Mention that choosing the right collection is about data lifetime management, not just API convenience.`]}]}],d=[{id:`js-concurrency`,title:`Concurrency and Parallelism`,description:`Understanding Web Workers, Service Workers, main thread execution, inter-thread communication, and strategies for offline-capable applications in JavaScript.`,category:`JavaScript`,difficulty:`Advanced`,tags:[`Web Workers`,`Service Workers`,`Concurrency`,`Parallelism`,`postMessage`,`SharedArrayBuffer`,`Atomics`,`Offline`,`Caching`],overview:`JavaScript is single-threaded at its core, relying on the event loop for concurrency. However, true parallelism is achievable through Web Workers, which run scripts in background threads. Service Workers extend this model by acting as programmable network proxies, enabling powerful caching strategies and offline support. Mastering these APIs is essential for building performant, resilient web applications that remain responsive under heavy computational loads or unreliable network conditions.`,concepts:[`Event loop and single-threaded execution model`,`Web Workers and dedicated worker threads`,`Shared Workers for cross-tab communication`,`Service Workers as network proxies`,`Structured cloning and transferable objects`,`postMessage API for inter-thread communication`,`SharedArrayBuffer and Atomics for shared memory`,`Cache API and caching strategies`,`Offline-first application architecture`,`Worker lifecycle management and termination`],relatedTopicIds:[`js-event-loop`,`js-async-programming`,`js-performance`],questions:[{id:`js-conc-1`,question:`What are Web Workers? How do they enable parallelism in JavaScript?`,answer:"Web Workers are a browser API that allows JavaScript code to run in background threads, separate from the main execution thread. This is significant because JavaScript itself is single-threaded — all UI rendering, DOM manipulation, and script execution share one thread. When heavy computation blocks this thread, the entire page becomes unresponsive. Web Workers solve this by enabling true parallelism: CPU-intensive tasks can be offloaded to worker threads that execute simultaneously on separate CPU cores.\n\nA Web Worker is created by instantiating the `Worker` constructor with a path to a JavaScript file. This file runs in an entirely separate global context — it has no access to the DOM, `window`, or `document`. Instead, workers communicate with the main thread via the `postMessage` API and the `onmessage` event handler. Data sent between threads is structurally cloned by default, meaning it is deep-copied rather than shared.\n\nThere are three flavours of workers. Dedicated Workers are tied to a single page context and are the most common type. Shared Workers can be accessed from multiple browsing contexts (tabs, iframes) that share the same origin, enabling cross-tab communication. Service Workers are a special class that act as network proxies and have their own lifecycle, discussed separately.\n\nWeb Workers are ideal for tasks like image processing, data parsing, encryption, sorting large datasets, and running WebAssembly modules. Because worker code runs on a separate OS-level thread, it achieves true parallel execution rather than the cooperative concurrency provided by the event loop. However, the communication overhead of structured cloning means workers are most beneficial for coarse-grained, long-running tasks rather than tiny, frequent operations.\n\nModern enhancements include Transferable Objects, which allow zero-copy transfer of `ArrayBuffer` data between threads, and `SharedArrayBuffer` with `Atomics`, which enable low-level shared memory. These make workers practical for high-throughput scenarios like real-time audio processing and game physics engines.",shortAnswer:"Web Workers run JavaScript in background threads separate from the main thread, enabling true parallelism. They communicate via `postMessage` and structured cloning, have no DOM access, and are ideal for CPU-intensive tasks like data processing and encryption.",code:`// main.js — spawning a dedicated worker
const worker = new Worker('worker.js');

worker.postMessage({ type: 'SORT', data: largeArray });

worker.onmessage = (event) => {
  console.log('Sorted result:', event.data);
};

worker.onerror = (error) => {
  console.error('Worker error:', error.message);
};

// worker.js — background thread
self.onmessage = (event) => {
  const { type, data } = event.data;

  if (type === 'SORT') {
    const sorted = data.sort((a, b) => a - b);
    self.postMessage(sorted);
  }
};

// Transferable objects for zero-copy transfer
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage(buffer, [buffer]);
// buffer.byteLength is now 0 — ownership transferred`,language:`javascript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`Web Workers`,`Parallelism`,`Threads`,`postMessage`],commonMistakes:[`Trying to access the DOM or window object from within a worker — workers have no DOM access and will throw a ReferenceError`,`Sending very large objects via postMessage without using Transferable Objects, causing expensive structured cloning and memory duplication`,`Creating too many workers simultaneously — each worker spawns a real OS thread and consumes significant memory`],followUps:[`How do Transferable Objects differ from structured cloning?`,`When would you choose a Shared Worker over a Dedicated Worker?`,`How can you use worker_threads in Node.js for server-side parallelism?`],interviewTips:[`Emphasize that Web Workers provide true OS-level thread parallelism, not just event-loop concurrency`,`Mention real-world use cases like off-main-thread image processing in apps like Figma or Google Sheets`],relatedTopics:[`Event Loop`,`Shared Workers`,`Transferable Objects`]},{id:`js-conc-2`,question:`How does communication between the main thread and Web Workers work?`,answer:"Communication between the main thread and a Web Worker is based on an asynchronous message-passing model using the `postMessage` API. The main thread calls `worker.postMessage(data)` to send data to the worker, and the worker calls `self.postMessage(data)` to send data back. Both sides listen for incoming messages via the `onmessage` event handler or by using `addEventListener(\"message\", callback)`.\n\nBy default, data sent through `postMessage` undergoes structured cloning. The structured clone algorithm creates a deep copy of the object, supporting most built-in types including `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, `Blob`, `File`, `ImageData`, and nested objects or arrays. However, it cannot clone functions, DOM nodes, `Error` objects (in some engines), or objects with prototype chains — attempting to do so throws a `DataCloneError`.\n\nFor performance-critical applications, Transferable Objects provide a zero-copy alternative. When you pass an `ArrayBuffer` (or a typed array's underlying buffer) in the transfer list — the second argument to `postMessage` — ownership of that memory region is transferred to the receiving thread. The sending side's reference becomes neutered (its `byteLength` drops to 0), but no data is copied. This is orders of magnitude faster for large binary payloads like image pixel data or audio samples.\n\nA common pattern is to build a request-response protocol on top of `postMessage` by assigning unique IDs to each message and matching responses. Libraries like Comlink by Google abstract this further, wrapping the worker in a Proxy so you can call worker functions as if they were local async methods, hiding the postMessage plumbing entirely.\n\nError handling is also part of the communication model. Uncaught exceptions inside a worker fire an `error` event on the worker object in the main thread. Additionally, if `postMessage` is called with non-cloneable data, a `DataCloneError` is thrown synchronously on the sending side. Robust worker communication should always include error listeners on both ends.",shortAnswer:"The main thread and Web Workers communicate asynchronously via `postMessage` and `onmessage`. Data is deep-copied using the structured clone algorithm by default. For large binary data, Transferable Objects enable zero-copy transfer by moving memory ownership between threads.",code:`// === Structured cloning (default) ===
// main.js
const worker = new Worker('worker.js');

worker.postMessage({
  id: 1,
  action: 'processImage',
  pixels: imageDataArray  // deep-copied
});

worker.onmessage = ({ data }) => {
  if (data.id === 1) {
    renderResult(data.result);
  }
};

// worker.js
self.onmessage = ({ data }) => {
  const { id, action, pixels } = data;
  const result = heavyProcessing(pixels);
  self.postMessage({ id, result });
};

// === Transferable Objects (zero-copy) ===
const buffer = new ArrayBuffer(1024 * 1024 * 10); // 10 MB
const view = new Uint8Array(buffer);
// fill view with pixel data...

worker.postMessage(buffer, [buffer]);
console.log(buffer.byteLength); // 0 — ownership transferred

// === Comlink pattern (library abstraction) ===
// worker.js
import * as Comlink from 'comlink';

const api = {
  async heavyComputation(data: number[]): Promise<number> {
    return data.reduce((sum, n) => sum + n, 0);
  }
};
Comlink.expose(api);

// main.js
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap<typeof import('./worker')>(worker);
const result = await api.heavyComputation([1, 2, 3, 4, 5]);`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`postMessage`,`Structured Cloning`,`Transferable Objects`,`Comlink`],commonMistakes:[`Forgetting that structured cloning cannot handle functions or DOM nodes — attempting to send these throws a DataCloneError`,`Not using the transfer list for large ArrayBuffers, leading to unnecessary memory duplication and GC pressure`,`Assuming postMessage is synchronous — it is always asynchronous, and the order of message delivery is guaranteed only within a single port`],followUps:[`What types of objects cannot be structurally cloned?`,`How does Comlink simplify worker communication under the hood?`,`What is a MessageChannel and when would you use one?`],interviewTips:[`Demonstrate knowledge of the performance tradeoff between structured cloning (safe but slow for large data) and transferable objects (fast but destructive to the sender)`,`Mentioning Comlink shows familiarity with modern tooling and real-world patterns`],relatedTopics:[`Structured Clone Algorithm`,`MessageChannel`,`MessagePort`]},{id:`js-conc-3`,question:`What are the limitations of Web Workers?`,answer:'The most fundamental limitation of Web Workers is the absence of DOM access. Workers run in a separate global context (`DedicatedWorkerGlobalScope`) that has no `window`, `document`, or any DOM APIs. This means you cannot directly manipulate the UI, read element dimensions, or attach event listeners from within a worker. All UI updates must be coordinated by sending results back to the main thread via `postMessage`, which then performs the actual DOM manipulation.\n\nWorkers also lack access to several main-thread APIs. They cannot use `localStorage`, `sessionStorage`, `alert()`, `confirm()`, `prompt()`, or any synchronous blocking APIs that assume a UI context. Workers do have access to `fetch`, `XMLHttpRequest`, `IndexedDB`, `WebSockets`, `setTimeout`/`setInterval`, `crypto`, and `navigator` (partially). The exact API surface varies by browser and worker type — Service Workers, for instance, cannot use synchronous `XMLHttpRequest`.\n\nMemory and resource overhead is another practical limitation. Each Web Worker spawns a real OS-level thread with its own JavaScript engine instance, memory heap, and event loop. Creating dozens of workers can consume hundreds of megabytes of RAM and strain the thread scheduler. There is no standardized limit, but browsers may throttle or refuse to create workers beyond a certain count. For this reason, worker pools — where a fixed number of workers are reused across tasks — are a common pattern in production applications.\n\nThe communication overhead should not be underestimated. Structured cloning of large objects can take significant time and temporarily doubles memory usage since both the original and the clone exist simultaneously. While Transferable Objects solve the memory issue, they require careful lifecycle management because the sender loses access to the transferred data. SharedArrayBuffer enables true shared memory but requires careful synchronization with Atomics to avoid data races.\n\nFinally, debugging workers is more complex than debugging main-thread code. Workers appear as separate contexts in browser DevTools, breakpoints must be set independently, and console output may be routed differently. Module workers (`type: "module"`) are relatively new and not universally supported in older browsers, which historically required bundling worker code into separate files rather than using ES module imports.',shortAnswer:"Web Workers cannot access the DOM, `window`, `localStorage`, or any UI-related APIs. They incur memory overhead per thread, structured cloning can be expensive for large data, debugging is more complex, and module worker support varies across browsers.",code:`// Demonstrating what workers CAN and CANNOT do

// worker.js
self.onmessage = async ({ data }) => {
  // ✅ These APIs are available in workers
  const response = await fetch('/api/data');
  const json = await response.json();

  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('myDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const id = crypto.randomUUID();

  setTimeout(() => {
    self.postMessage({ status: 'delayed', id });
  }, 1000);

  // ❌ These will throw ReferenceError
  // document.getElementById('app');     // No DOM
  // window.localStorage.getItem('key'); // No localStorage
  // alert('hello');                      // No UI dialogs
  // const el = new HTMLDivElement();     // No DOM constructors

  self.postMessage({ json, id });
};

// Worker pool pattern to manage resource usage
class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    data: unknown;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];
  private activeWorkers = new Set<Worker>();

  constructor(private script: string, private size: number) {
    for (let i = 0; i < size; i++) {
      const w = new Worker(script);
      w.onmessage = (e) => this.handleComplete(w, e.data);
      this.workers.push(w);
    }
  }

  exec(data: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const idle = this.workers.find(w => !this.activeWorkers.has(w));
      if (idle) {
        this.activeWorkers.add(idle);
        idle.postMessage(data);
        idle.onmessage = (e) => {
          this.activeWorkers.delete(idle);
          resolve(e.data);
          this.dequeue();
        };
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  private handleComplete(worker: Worker, result: unknown) {
    this.activeWorkers.delete(worker);
    this.dequeue();
  }

  private dequeue() {
    if (this.queue.length === 0) return;
    const idle = this.workers.find(w => !this.activeWorkers.has(w));
    if (!idle) return;
    const task = this.queue.shift()!;
    this.activeWorkers.add(idle);
    idle.postMessage(task.data);
    idle.onmessage = (e) => {
      this.activeWorkers.delete(idle);
      task.resolve(e.data);
      this.dequeue();
    };
  }

  terminate() {
    this.workers.forEach(w => w.terminate());
  }
}

const pool = new WorkerPool('worker.js', navigator.hardwareConcurrency || 4);`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`Web Workers`,`Limitations`,`Worker Pool`,`DOM`,`Memory`],commonMistakes:[`Creating a new worker for every small task instead of using a worker pool — this wastes memory and thread resources`,`Assuming all browser APIs are available inside workers — many UI-related APIs like localStorage and DOM are absent`,`Not terminating workers when they are no longer needed, causing memory leaks in long-running applications`],followUps:[`How would you implement a worker pool with task prioritization?`,`What is OffscreenCanvas and how does it extend worker capabilities?`,`How does navigator.hardwareConcurrency help size a worker pool?`],interviewTips:[`Showing awareness of practical constraints like memory overhead and the worker pool pattern demonstrates production experience beyond textbook knowledge`],relatedTopics:[`Worker Pool`,`OffscreenCanvas`,`navigator.hardwareConcurrency`]},{id:`js-conc-4`,question:`What are Service Workers? How do they differ from Web Workers?`,answer:"Service Workers are a specialized type of worker that acts as a programmable network proxy between the browser and the network. They intercept every network request made by the pages they control and can respond with cached resources, modify requests, or route them to the network — giving developers fine-grained control over caching, offline behaviour, and background processing. Unlike Web Workers, which are general-purpose compute threads, Service Workers are designed specifically for network-related concerns.\n\nThe lifecycle of a Service Worker is fundamentally different from a Web Worker. A Web Worker lives as long as the page that created it (or until explicitly terminated). A Service Worker, on the other hand, has a distinct lifecycle: it is installed, activated, and then can be idle or terminated by the browser at any time to conserve resources. It persists across page navigations and even browser restarts. Registration happens via `navigator.serviceWorker.register()`, installation fires an `install` event (typically used to pre-cache assets), and activation fires an `activate` event (typically used to clean up old caches).\n\nService Workers operate on an event-driven model. The key events are `install`, `activate`, `fetch` (intercepts network requests), `push` (receives push notifications), `sync` (handles background sync), and `message` (receives postMessage communication). The `fetch` event handler is the heart of most Service Worker implementations — it decides whether to serve a response from cache, fetch from the network, or use a combination strategy.\n\nA critical difference is scope. A Web Worker is tied to the page that spawned it. A Service Worker controls all pages within its registered scope (a URL path prefix) and continues to exist even after those pages are closed. This makes Service Workers essential for Progressive Web Apps (PWAs), enabling push notifications and background sync even when no tab is open. However, Service Workers require HTTPS (except on localhost) because of the power they have to intercept and modify network requests.\n\nService Workers also differ in their API surface. They have access to the Cache API, Push API, Background Sync API, and Notification API, but they cannot access the DOM, just like regular workers. They use `clients.matchAll()` and `client.postMessage()` to communicate with the pages they control. Unlike Web Workers, Service Workers cannot use synchronous APIs like `XMLHttpRequest` — all network calls must use `fetch()`.",shortAnswer:`Service Workers are event-driven workers that act as network proxies, intercepting fetch requests and enabling caching, offline support, and push notifications. Unlike Web Workers (general-purpose compute threads), Service Workers have a persistent lifecycle, control a URL scope, and require HTTPS.`,code:`// Registering a Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.log('SW registered, scope:', registration.scope);
    })
    .catch((error) => {
      console.error('SW registration failed:', error);
    });
}

// sw.js — Service Worker lifecycle and fetch interception
const CACHE_NAME = 'app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// Communicating with controlled pages
self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.source.postMessage({ type: 'VERSION', version: CACHE_NAME });
  }
});`,language:`javascript`,difficulty:`Advanced`,type:`Conceptual`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`Service Workers`,`PWA`,`Caching`,`Offline`,`Lifecycle`],commonMistakes:[`Forgetting that Service Workers require HTTPS in production — they only work on localhost during development without SSL`,`Not calling self.skipWaiting() and self.clients.claim() when you need the new Service Worker to take effect immediately, leaving stale workers in control`,`Caching responses without a versioning strategy, leading to users being stuck with outdated assets indefinitely`],followUps:[`What happens when a new version of a Service Worker is deployed?`,`How does the Service Worker lifecycle differ from a regular Web Worker?`,`What is the difference between self.skipWaiting() and self.clients.claim()?`],interviewTips:[`Draw a clear distinction: Web Workers are for computation, Service Workers are for network control — conflating them is a common interview pitfall`,`Mention that Service Workers are the backbone of PWAs and enable features like push notifications and background sync`],relatedTopics:[`Cache API`,`PWA`,`Push API`,`Background Sync`]},{id:`js-conc-5`,question:`How can Service Workers be used for caching and offline support?`,answer:"Service Workers enable offline support by intercepting network requests through the `fetch` event and responding with cached resources when the network is unavailable. The Cache API, available within the Service Worker context, provides a programmatic key-value store where requests map to responses. During the `install` event, critical assets (HTML, CSS, JavaScript, images) are pre-cached so the application shell loads instantly on subsequent visits, even without a network connection.\n\nSeveral caching strategies are commonly used, each with different tradeoffs. Cache-First checks the cache before the network and is ideal for static assets that rarely change. Network-First tries the network first and falls back to cache, suitable for dynamic content like API responses where freshness matters. Stale-While-Revalidate serves the cached version immediately for speed while simultaneously fetching an updated version from the network to update the cache for next time — a great balance for content that changes but where slight staleness is acceptable. Cache-Only and Network-Only are simpler strategies for assets that should never hit the network or never be cached, respectively.\n\nFor offline support beyond static assets, the Background Sync API lets you defer actions until connectivity is restored. For example, if a user submits a form while offline, the request can be queued and replayed when the Service Worker detects a network connection via the `sync` event. This creates a seamless experience where the user does not need to know whether they are online or offline.\n\nVersioning and cache invalidation are critical operational concerns. Each deployment should use a new cache name (e.g., `app-cache-v2`). During the `activate` event, old caches are deleted to prevent unbounded storage growth. The Cache API has storage limits (varies by browser, typically a percentage of available disk space), and browsers can evict cached data under storage pressure unless the application requests persistent storage via `navigator.storage.persist()`.\n\nAdvanced patterns include runtime caching (caching resources on first access rather than pre-caching everything), cache warming (pre-fetching resources the user is likely to need next), and serving a custom offline fallback page when neither cache nor network can fulfill a request. Workbox, a library from Google, abstracts these patterns into declarative configuration, reducing boilerplate while providing robust production-grade caching.",shortAnswer:`Service Workers intercept fetch requests and use the Cache API to serve pre-cached or runtime-cached resources when offline. Common strategies include Cache-First for static assets, Network-First for dynamic data, and Stale-While-Revalidate for balanced freshness. Background Sync enables deferred actions until connectivity resumes.`,code:`// Cache-First strategy (static assets)
function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    return cached || fetch(request).then((response) => {
      const clone = response.clone();
      caches.open('static-v1').then((cache) => cache.put(request, clone));
      return response;
    });
  });
}

// Network-First strategy (API calls)
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      const clone = response.clone();
      caches.open('api-v1').then((cache) => cache.put(request, clone));
      return response;
    })
    .catch(() => caches.match(request));
}

// Stale-While-Revalidate strategy
function staleWhileRevalidate(request) {
  return caches.open('swr-v1').then((cache) => {
    return cache.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        cache.put(request, response.clone());
        return response;
      });
      return cached || networkFetch;
    });
  });
}

// Routing requests to the appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.destination === 'image' ||
      url.pathname.match(/\\.(css|js|woff2?)$/)) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  } else if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request).catch(() =>
        caches.match('/offline.html')
      )
    );
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(replayQueuedRequests());
  }
});

async function replayQueuedRequests() {
  const db = await openIndexedDB();
  const pending = await db.getAll('outbox');

  await Promise.all(
    pending.map(async (entry) => {
      await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: entry.body,
      });
      await db.delete('outbox', entry.id);
    })
  );
}`,language:`javascript`,difficulty:`Advanced`,type:`Scenario`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`Service Workers`,`Cache API`,`Offline`,`Caching Strategies`,`Background Sync`,`Workbox`],commonMistakes:[`Forgetting to clone responses before caching — a Response body can only be consumed once, so both cache.put() and returning the response require separate copies`,`Pre-caching too many assets during install, making the initial Service Worker installation slow and potentially failing if any single asset fails to fetch`,`Not implementing cache versioning and cleanup in the activate event, leading to ever-growing storage usage`],followUps:[`How would you implement a cache size limit to prevent storage bloat?`,`What is the difference between pre-caching and runtime caching?`,`How does Workbox simplify Service Worker caching strategies?`],interviewTips:[`Being able to name and explain at least three caching strategies (Cache-First, Network-First, Stale-While-Revalidate) demonstrates practical Service Worker experience`],relatedTopics:[`Cache API`,`Workbox`,`Background Sync`,`IndexedDB`]},{id:`js-conc-6`,question:`What is the difference between concurrency and parallelism in JavaScript?`,answer:`Concurrency and parallelism are related but distinct concepts that are often conflated. Concurrency means dealing with multiple tasks that are in progress at the same time — tasks can start, run, and complete in overlapping time periods, but they do not necessarily execute simultaneously. Parallelism means multiple tasks are literally executing at the same instant, typically on different CPU cores. In JavaScript, the event loop provides concurrency, while Web Workers provide parallelism.

JavaScript's main thread is inherently concurrent but not parallel. The event loop multiplexes between multiple asynchronous operations — network requests, timers, user interactions, promise callbacks — giving the illusion that they are happening simultaneously. In reality, only one piece of JavaScript executes at any given moment on the main thread. When an \`async\` function \`await\`s a fetch call, the engine suspends that function, processes other queued microtasks and macrotasks, and resumes the function when the response arrives. This is cooperative concurrency: tasks voluntarily yield control by awaiting asynchronous operations.

True parallelism in the browser requires Web Workers. When you spawn a worker, the browser creates a new OS-level thread with its own JavaScript engine instance, heap, and call stack. Code in the worker runs simultaneously with code on the main thread — you can verify this by running CPU-intensive loops in both and observing that neither blocks the other. This is preemptive parallelism managed by the operating system's thread scheduler.

The practical implication is that concurrency (event loop) is sufficient for I/O-bound work — network requests, file reads, database queries — because the actual waiting happens outside JavaScript and the engine can do other work in the meantime. Parallelism (workers) is necessary for CPU-bound work — heavy computation, data processing, encryption — because there is no I/O wait to exploit; the CPU is continuously busy and would block the main thread.

A helpful analogy: a single chef (main thread) juggling multiple dishes by switching between them while waiting for water to boil is concurrency. Hiring additional chefs (workers) who each prepare a separate dish simultaneously is parallelism. Modern web applications use both: the event loop handles I/O-bound orchestration while workers handle CPU-bound computation, keeping the UI responsive under all conditions.`,shortAnswer:`Concurrency means managing multiple tasks that overlap in time (achieved by the event loop). Parallelism means tasks execute simultaneously on separate CPU cores (achieved by Web Workers). JavaScript's main thread is concurrent but not parallel; workers enable true parallelism for CPU-bound tasks.`,code:`// Concurrency via the event loop (single thread, interleaved)
async function concurrentIO() {
  console.time('concurrent');

  const [users, products, orders] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/products').then(r => r.json()),
    fetch('/api/orders').then(r => r.json()),
  ]);

  console.timeEnd('concurrent');
  // All three requests were in-flight concurrently,
  // but JavaScript processed their callbacks one at a time
  return { users, products, orders };
}

// Parallelism via Web Workers (multiple threads, simultaneous)
function parallelCompute(datasets: number[][]): Promise<number[]> {
  const workerCount = Math.min(datasets.length, navigator.hardwareConcurrency);

  return new Promise((resolve) => {
    const results: number[] = new Array(datasets.length);
    let completed = 0;

    datasets.forEach((data, index) => {
      const worker = new Worker('compute-worker.js');

      worker.postMessage({ index, data });

      worker.onmessage = (event) => {
        results[event.data.index] = event.data.result;
        completed++;
        worker.terminate();

        if (completed === datasets.length) {
          resolve(results);
        }
      };
    });
  });
}

// compute-worker.js
self.onmessage = ({ data: { index, data } }) => {
  // CPU-intensive work running on a separate thread
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result += Math.sqrt(data[i]) * Math.log(data[i] + 1);
  }
  self.postMessage({ index, result });
};

// Combining both: concurrent I/O + parallel compute
async function processLargeDataset() {
  // Concurrent I/O: fetch data from multiple endpoints
  const chunks = await Promise.all(
    Array.from({ length: 4 }, (_, i) =>
      fetch(\`/api/data/chunk/\${i}\`).then(r => r.json())
    )
  );

  // Parallel compute: process each chunk on a separate worker
  const results = await parallelCompute(chunks);

  return results;
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`Concurrency`,`Parallelism`,`Event Loop`,`Web Workers`,`Promise.all`],commonMistakes:[`Claiming that Promise.all runs tasks "in parallel" — it runs them concurrently on a single thread; true parallelism requires multiple threads`,`Using Web Workers for simple I/O-bound tasks where the event loop would be more efficient — workers add overhead that only pays off for CPU-intensive work`,`Confusing async/await with parallelism — async/await is syntactic sugar for promises and provides concurrency, not parallelism`],followUps:[`Can you achieve parallelism without Web Workers in JavaScript?`,`How does the event loop model compare to thread-based concurrency in languages like Java?`,`What is cooperative scheduling versus preemptive scheduling?`],interviewTips:[`Use the chef analogy or a similar metaphor — interviewers value candidates who can explain complex concepts simply and clearly`,`Emphasize the practical guidance: use the event loop for I/O, use workers for CPU — this shows you know when to apply each tool`],relatedTopics:[`Event Loop`,`Microtasks vs Macrotasks`,`Promise.all`,`Thread Scheduling`]},{id:`js-conc-7`,question:`What are SharedArrayBuffer and Atomics?`,answer:"SharedArrayBuffer is a special type of ArrayBuffer whose underlying memory can be shared between the main thread and Web Workers simultaneously. Unlike regular ArrayBuffers that are either copied (structured cloning) or transferred (ownership moves), a SharedArrayBuffer allows multiple threads to read and write the same memory region concurrently. This is the only mechanism in JavaScript for true shared-memory parallelism, enabling patterns similar to multi-threaded programming in languages like C++ or Java.\n\nThe Atomics object provides static methods for performing atomic (indivisible) operations on SharedArrayBuffer views. When multiple threads access shared memory, data races can occur — one thread might read a partially-written value if another thread is mid-update. Atomics operations guarantee that reads and writes to specific memory locations are completed fully before any other thread can access that location. Key methods include `Atomics.load()`, `Atomics.store()`, `Atomics.add()`, `Atomics.sub()`, `Atomics.compareExchange()`, `Atomics.wait()`, and `Atomics.notify()`.\n\n`Atomics.wait()` and `Atomics.notify()` are particularly powerful because they enable thread synchronization primitives. `Atomics.wait()` suspends a worker thread until another thread calls `Atomics.notify()` on the same memory location, acting like a condition variable in traditional threading. This allows you to build mutexes, semaphores, and barriers purely in JavaScript. Note that `Atomics.wait()` blocks the calling thread and is only available in workers — calling it on the main thread throws because blocking the main thread would freeze the UI.\n\nSharedArrayBuffer was temporarily disabled in all browsers after the Spectre CPU vulnerability was discovered in 2018 because shared memory combined with high-resolution timing could be used as a side-channel attack vector. It was re-enabled with the requirement that the page sets specific HTTP headers: `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. These headers put the page into a cross-origin isolated state, mitigating Spectre-class attacks by preventing cross-origin resources from being loaded into the same process.\n\nPractical use cases for SharedArrayBuffer and Atomics include WebAssembly multi-threading (wasm threads compile down to SharedArrayBuffer), real-time audio and video processing, physics engines in games, and any workload that requires high-throughput data exchange between threads without the overhead of postMessage serialization. Libraries like `Comlink` and frameworks like Emscripten's pthread implementation build on these primitives to provide higher-level abstractions.",shortAnswer:`SharedArrayBuffer allows multiple threads to share the same memory region. Atomics provides thread-safe operations (load, store, add, compareExchange, wait, notify) to prevent data races. Together they enable true shared-memory parallelism in JavaScript, requiring cross-origin isolation headers due to Spectre mitigations.`,code:`// Setting up SharedArrayBuffer between main thread and worker

// main.js
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

const worker = new Worker('worker.js');
worker.postMessage({ buffer: sharedBuffer });

// Write to shared memory atomically
Atomics.store(sharedArray, 0, 42);

// Read from shared memory atomically
const value = Atomics.load(sharedArray, 0);
console.log('Value:', value); // 42

// Atomic increment (thread-safe counter)
Atomics.add(sharedArray, 1, 1);

// worker.js
self.onmessage = ({ data: { buffer } }) => {
  const sharedArray = new Int32Array(buffer);

  // Both threads see the same memory
  const mainValue = Atomics.load(sharedArray, 0);
  console.log('From worker:', mainValue); // 42

  // Atomic compare-and-swap (lock-free pattern)
  const old = Atomics.compareExchange(sharedArray, 0, 42, 100);
  // If index 0 was 42, it's now 100; old === 42

  // Worker can increment the same counter
  Atomics.add(sharedArray, 1, 1);
};

// === Thread synchronization with wait/notify ===

// producer-worker.js
self.onmessage = ({ data: { buffer } }) => {
  const view = new Int32Array(buffer);

  // Simulate producing data
  for (let i = 1; i <= 10; i++) {
    Atomics.store(view, 0, i);      // write value
    Atomics.store(view, 1, 1);      // set "ready" flag
    Atomics.notify(view, 1, 1);     // wake consumer
    Atomics.wait(view, 2, 0);       // wait for consumer to acknowledge
    Atomics.store(view, 2, 0);      // reset ack flag
  }
};

// consumer-worker.js
self.onmessage = ({ data: { buffer } }) => {
  const view = new Int32Array(buffer);

  for (let i = 0; i < 10; i++) {
    Atomics.wait(view, 1, 0);       // wait until "ready" flag is set
    const value = Atomics.load(view, 0);
    console.log('Consumed:', value);
    Atomics.store(view, 1, 0);      // reset ready flag
    Atomics.store(view, 2, 1);      // set ack flag
    Atomics.notify(view, 2, 1);     // wake producer
  }
};

// Required HTTP headers for SharedArrayBuffer
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Embedder-Policy: require-corp`,language:`javascript`,difficulty:`Senior`,type:`Coding`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`SharedArrayBuffer`,`Atomics`,`Shared Memory`,`Thread Safety`,`Spectre`],commonMistakes:[`Accessing SharedArrayBuffer without Atomics — non-atomic reads and writes can cause torn reads and data races that produce corrupt or inconsistent values`,`Calling Atomics.wait() on the main thread — it is only permitted in workers because it blocks the thread, and blocking the main thread would freeze the UI`,`Deploying SharedArrayBuffer without the required COOP/COEP headers — the browser will throw a TypeError when constructing SharedArrayBuffer in a non-isolated context`],followUps:[`How do COOP and COEP headers enable SharedArrayBuffer after Spectre?`,`How does WebAssembly use SharedArrayBuffer for multi-threading?`,`Can you implement a mutex using only Atomics.compareExchange?`],interviewTips:[`Mentioning the Spectre security context shows you understand not just the API but the real-world security considerations that shaped its deployment`,`Connect SharedArrayBuffer to WebAssembly multi-threading — this demonstrates awareness of the broader performance ecosystem`],relatedTopics:[`WebAssembly Threads`,`Spectre Mitigation`,`Cross-Origin Isolation`,`Mutex`]},{id:`js-conc-8`,question:`How would you architect an offline-first application using Service Workers?`,answer:'An offline-first architecture treats the network as an enhancement rather than a requirement. The application is designed to function fully from cached data by default and synchronizes with the server when connectivity is available. The Service Worker is the linchpin: it pre-caches the application shell during installation, intercepts all network requests to apply appropriate caching strategies, and uses Background Sync to queue and replay failed mutations.\n\nThe application shell model is the foundation. During the Service Worker\'s `install` event, all critical resources — HTML, CSS, JavaScript bundles, fonts, and essential images — are cached. This ensures the application structure loads instantly on repeat visits regardless of network status. Dynamic content (API responses, user data) is cached at runtime using strategy-appropriate patterns: Stale-While-Revalidate for feeds and lists, Network-First for user-specific data, and Cache-First for immutable assets like hashed bundles.\n\nFor data persistence and offline mutations, IndexedDB serves as the client-side database. When the user creates, updates, or deletes data while offline, the change is written to IndexedDB immediately (so the UI reflects it) and a sync request is queued. The Background Sync API registers a sync event tag, and the Service Worker\'s `sync` handler replays queued requests when the network returns. Conflict resolution — what happens when the server state diverged during the offline period — must be planned: strategies include last-write-wins, server-wins, or operational transform / CRDT-based merging for collaborative applications.\n\nUI feedback is essential for a good offline experience. The application should detect connectivity changes via `navigator.onLine` and the `online`/`offline` events, displaying clear indicators of the current state. Optimistic UI updates (showing changes immediately before server confirmation) combined with subtle sync-status indicators (a small icon showing "synced", "syncing", or "offline — changes will sync when online") create a seamless experience.\n\nStorage management rounds out the architecture. Browsers impose storage quotas that vary by origin and device. Calling `navigator.storage.estimate()` lets you monitor usage and warn users before hitting limits. Requesting `navigator.storage.persist()` prevents the browser from evicting your data under storage pressure. Old caches must be cleaned up during Service Worker activation, and a cache eviction policy (e.g., LRU for runtime-cached images) prevents unbounded growth. Tools like Workbox provide battle-tested implementations of all these patterns with minimal configuration.',shortAnswer:`An offline-first app pre-caches the app shell via Service Worker install, applies caching strategies per resource type, stores data in IndexedDB for offline access, queues mutations via Background Sync, and provides clear UI indicators. Storage management and conflict resolution are critical for production robustness.`,code:`// Offline-first architecture overview

// 1. Service Worker: sw.js
const APP_SHELL_CACHE = 'shell-v2';
const RUNTIME_CACHE = 'runtime-v1';
const API_CACHE = 'api-v1';

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keepCaches = [APP_SHELL_CACHE, RUNTIME_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => !keepCaches.includes(name))
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithFallback(event.request));
  } else if (event.request.mode === 'navigate') {
    event.respondWith(navigationHandler(event.request));
  } else {
    event.respondWith(cacheFirstWithRefresh(event.request));
  }
});

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(API_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request);
  }
}

async function navigationHandler(request) {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function cacheFirstWithRefresh(request) {
  const cached = await caches.match(request);
  const networkFetch = fetch(request).then((response) => {
    caches.open(RUNTIME_CACHE)
      .then((cache) => cache.put(request, response));
    return response.clone();
  }).catch(() => undefined);
  return cached || networkFetch;
}

// 2. Background Sync for offline mutations
self.addEventListener('sync', (event) => {
  if (event.tag === 'outbox-sync') {
    event.waitUntil(processOutbox());
  }
});

async function processOutbox() {
  const db = await idbOpen('app-db', 1);
  const tx = db.transaction('outbox', 'readwrite');
  const store = tx.objectStore('outbox');
  const entries = await store.getAll();

  for (const entry of entries) {
    try {
      await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: JSON.stringify(entry.body),
      });
      await store.delete(entry.id);
    } catch {
      break; // stop processing, will retry on next sync
    }
  }
}

// 3. Client-side: queue mutations when offline
async function saveData(item) {
  // Always save locally first (optimistic)
  await idbPut('app-db', 'items', item);
  updateUI(item);

  if (navigator.onLine) {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  } else {
    await idbPut('app-db', 'outbox', {
      id: crypto.randomUUID(),
      url: '/api/items',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: item,
      timestamp: Date.now(),
    });
    await navigator.serviceWorker.ready
      .then((reg) => reg.sync.register('outbox-sync'));
  }
}

// 4. Connectivity status indicator
window.addEventListener('online', () => showStatus('online'));
window.addEventListener('offline', () => showStatus('offline'));

async function checkStorageQuota() {
  const { usage, quota } = await navigator.storage.estimate();
  const percentUsed = ((usage / quota) * 100).toFixed(1);
  console.log(\`Storage: \${percentUsed}% used (\${usage} / \${quota} bytes)\`);
}`,language:`javascript`,difficulty:`Senior`,type:`Scenario`,category:`JavaScript`,topicId:`js-concurrency`,tags:[`Offline-First`,`Service Workers`,`IndexedDB`,`Background Sync`,`App Shell`,`PWA`],commonMistakes:[`Relying solely on navigator.onLine for connectivity detection — it only indicates whether the device has a network interface, not whether the connection actually works (it can report true behind a captive portal)`,`Not planning a conflict resolution strategy for data that was modified both offline and on the server — this leads to data loss or silent overwrites`,`Caching API responses without considering authentication tokens that may expire — serving stale auth-gated responses can cause confusing errors`],followUps:[`How would you handle conflict resolution when the same resource is modified offline and on the server?`,`What are CRDTs and how do they help with offline-first data sync?`,`How does navigator.storage.persist() differ from the default storage policy?`],interviewTips:[`Framing your answer around the app shell model and specific caching strategies shows architectural thinking, which is what senior-level interviews look for`,`Mentioning Background Sync and IndexedDB together shows you understand the full offline stack, not just the caching layer`],relatedTopics:[`App Shell Model`,`CRDTs`,`Workbox`,`IndexedDB`,`Storage API`]}]}],f=[...e,...t,...n,...r,...i,...a,...o,...s,...c,...l,...u,...d],p=[{id:`react-intro`,title:`Introduction to React`,description:`Core philosophy of React including the virtual DOM, declarative rendering, reconciliation algorithm, and React Fiber architecture.`,category:`React`,difficulty:`Beginner`,tags:[`react`,`virtual dom`,`reconciliation`,`fiber`,`declarative`,`component model`],overview:`React is a declarative, component-based JavaScript library for building user interfaces. It introduces a virtual DOM abstraction that lets developers describe what the UI should look like and lets React figure out how to update the real DOM efficiently. The Fiber architecture, introduced in React 16, rewrote the reconciliation engine to support incremental rendering, prioritization, and concurrent features.`,concepts:[`Declarative vs imperative rendering`,`Component-based architecture`,`Virtual DOM representation`,`Reconciliation algorithm`,`React Fiber architecture`,`Unidirectional data flow`,`JSX compilation`,`React element tree`],relatedTopicIds:[`react-vdom`,`react-components`,`react-jsx`],questions:[{id:`react-intro-1`,question:`What is React and why was it created?`,answer:`React is an open-source JavaScript library developed by Facebook (now Meta) for building user interfaces, particularly single-page applications. It was created in 2013 by Jordan Walke to solve the problem of efficiently updating complex UIs in response to data changes. Before React, developers used imperative DOM manipulation or two-way data binding frameworks that became difficult to reason about as applications grew.

React introduced a declarative paradigm where developers describe what the UI should look like for a given state, and React handles the DOM updates. Instead of manually calling methods like appendChild or innerHTML, you write components that return a description of the UI. When state changes, React re-renders the component and calculates the minimal set of DOM operations needed.

The component model is central to React. Every piece of UI is a component — a self-contained, reusable unit that manages its own rendering logic. Components compose together to form complex interfaces, much like functions compose in functional programming. This composability makes it easier to build, test, and maintain large applications.

React also introduced the virtual DOM — a lightweight in-memory representation of the real DOM. When a component re-renders, React builds a new virtual DOM tree, diffs it against the previous one, and applies only the changes to the actual DOM. This approach avoids expensive full-page re-renders and provides excellent performance for most applications.`,shortAnswer:`React is a declarative JavaScript library for building UIs, created by Facebook to solve the problem of efficiently updating complex interfaces. It uses a component-based architecture and virtual DOM to minimize expensive DOM operations.`,code:`import { createRoot } from "react-dom/client";

function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="React" />
      <Welcome name="World" />
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-intro`,tags:[`react`,`introduction`,`declarative`,`components`],commonMistakes:[`Calling React a framework — it is a library focused on the view layer, not a full MVC framework.`,`Thinking React replaces HTML — JSX compiles to JavaScript function calls that produce DOM elements.`,`Assuming React is the only way to build SPAs — Vue, Angular, Svelte, and others serve similar purposes.`],followUps:[`What is the difference between React and Angular?`,`How does the virtual DOM improve performance?`,`What is the difference between React and ReactDOM?`],interviewTips:[`Start with the problem React solves (efficient UI updates) before describing how it solves it.`,`Mention that React is a library, not a framework, and explain the distinction.`]},{id:`react-intro-2`,question:`What is the Virtual DOM and how does it work?`,answer:`The Virtual DOM (VDOM) is a lightweight, in-memory JavaScript representation of the actual DOM. It is a plain object tree that mirrors the structure of the real DOM but is much cheaper to create and manipulate. When a React component renders, it returns React elements — plain JavaScript objects describing the UI — which form the virtual DOM tree.

When state or props change, React creates a new virtual DOM tree by re-rendering the affected components. It then compares this new tree with the previous snapshot using a process called reconciliation or "diffing." The algorithm walks both trees simultaneously, identifies the minimal set of changes, and applies them to the real DOM in a single batch.

React's diffing algorithm makes two key assumptions to achieve O(n) complexity instead of O(n³). First, elements of different types produce entirely different subtrees. Second, developers provide stable key props on lists so React can match elements across renders without comparing every permutation.

It is important to understand that the virtual DOM is not inherently faster than direct DOM manipulation. Its value lies in the programming model: developers write declarative code describing the desired UI, and React handles the imperative DOM operations efficiently.`,shortAnswer:`The Virtual DOM is an in-memory JavaScript object tree mirroring the real DOM. When state changes, React builds a new virtual tree, diffs it against the previous one using an O(n) algorithm, and applies only minimal mutations to the real DOM.`,code:`// What React elements look like under the hood
const element = <h1 className="title">Hello</h1>;

// Compiles to:
const element2 = React.createElement("h1", { className: "title" }, "Hello");

// Produces a plain object (virtual DOM node):
// {
//   type: "h1",
//   props: { className: "title", children: "Hello" }
// }

// React diffs old vs new virtual DOM:
// Old: <h1 className="title">Hello</h1>
// New: <h1 className="title">Hello, React!</h1>
// Diff result: update text content of h1`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-intro`,tags:[`virtual dom`,`reconciliation`,`diffing`,`performance`],commonMistakes:[`Claiming the virtual DOM is always faster than direct DOM manipulation — it provides a better programming model, not guaranteed speed.`,`Thinking the virtual DOM is a shadow DOM — shadow DOM is a browser API for encapsulation, unrelated to React.`,`Assuming every state change triggers a full re-render of the entire app — React only re-renders the affected component subtree.`],followUps:[`What are the two assumptions React's diffing algorithm makes?`,`How do keys help the reconciliation process?`,`What is the difference between the virtual DOM and the shadow DOM?`],interviewTips:[`Explain the diffing algorithm's two heuristics to show deeper understanding.`,`Mention that the VDOM is a trade-off: it adds overhead for the programming model benefit.`]},{id:`react-intro-3`,question:`What is React Fiber and why was it introduced?`,answer:`React Fiber is the complete rewrite of React's core reconciliation algorithm, introduced in React 16. The previous "stack reconciler" processed updates synchronously in a single, uninterruptible pass. Large component trees could block the main thread for hundreds of milliseconds, causing janky animations, unresponsive inputs, and poor user experience.

Fiber introduces incremental rendering — the ability to split rendering work into chunks spread across multiple frames. Each unit of work is a "fiber" node containing component info, props, state, and tree pointers (child, sibling, parent). This linked-list structure enables efficient traversal and interruption, unlike the recursive call stack.

The key innovation is work prioritization. Not all updates are equally urgent: user input is high-priority, while a data visualization re-render can be deferred. Fiber assigns priority levels to updates and can pause low-priority work for high-priority updates. It maintains "current" and "work-in-progress" trees, swapping them atomically on commit.

Fiber laid the groundwork for concurrent features like Suspense, transitions, and automatic batching in React 18. Without Fiber's ability to pause, prioritize, and resume work, these features would not be possible.`,shortAnswer:`React Fiber is the reimplementation of React's reconciler introduced in React 16. It replaces the synchronous stack reconciler with an incremental, priority-based architecture that can pause, abort, and resume rendering work, enabling concurrent features like Suspense and transitions.`,code:`import { useTransition, useState } from "react";

function SearchResults({ query }: { query: string }) {
  const results = heavyFilter(query);
  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}

function App() {
  const [query, setQuery] = useState("");
  const [deferredQuery, setDeferredQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    startTransition(() => {
      setDeferredQuery(e.target.value);
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Loading...</span>}
      <SearchResults query={deferredQuery} />
    </div>
  );
}`,language:`tsx`,difficulty:`Advanced`,type:`Conceptual`,category:`React`,topicId:`react-intro`,tags:[`fiber`,`reconciliation`,`concurrent`,`performance`],commonMistakes:[`Confusing Fiber with the virtual DOM — Fiber is the reconciliation engine, the virtual DOM is the representation it operates on.`,`Thinking Fiber uses Web Workers — Fiber works on the main thread but splits work into interruptible chunks.`,`Assuming all React 16+ code automatically uses concurrent mode — concurrent features require explicit opt-in via createRoot.`],followUps:[`What is the difference between the render phase and the commit phase?`,`How does useTransition leverage Fiber's architecture?`,`What are the priority levels in React Fiber?`],interviewTips:[`Explain the problem Fiber solves (main thread blocking) before explaining how it works.`,`Connect Fiber to concurrent features like Suspense and useTransition to show the full picture.`]},{id:`react-intro-4`,question:`What is reconciliation in React?`,answer:`Reconciliation is the process by which React updates the DOM. When a component's state or props change, React calls the render function to get a new tree of React elements. It then figures out how to efficiently update the real DOM to match this new tree. The algorithm that performs this comparison is the reconciliation or "diffing" algorithm.

React achieves O(n) complexity by making two heuristic assumptions. First, two elements of different types produce entirely different subtrees, so React unmounts the old subtree and mounts a new one. Second, developers hint at stable children by providing a key prop. When comparing same-type elements, React keeps the DOM node and only updates changed attributes, then recurses into children.

For lists of children, React uses keys to match elements between old and new lists. Without keys, React compares children by index, leading to unnecessary unmounting when items are reordered. With stable keys, React identifies which items were added, removed, or moved, applying minimum DOM operations.

Reconciliation happens in two phases under Fiber. The render phase traverses the tree and computes the diff (pure, interruptible). The commit phase applies changes to the real DOM in a single synchronous pass, ensuring the UI never shows a partially updated state.`,shortAnswer:`Reconciliation is React's O(n) algorithm for determining minimal DOM updates when state changes. It uses two heuristics: different element types produce different subtrees, and keys identify stable list items. The diff is computed in the render phase and applied in the commit phase.`,code:`// Different types → full rebuild
// Old: <div><Counter /></div>
// New: <span><Counter /></span>
// React destroys div + Counter, creates span + new Counter

// Same type → update attributes only
// Old: <div className="old" />
// New: <div className="new" />
// React updates only className

// Keys in lists
function TodoList({ todos }: { todos: { id: string; text: string }[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// Without key: [A, B, C] → [B, C] → React updates A→B, B→C, removes C
// With key: React knows A was removed, B and C stay unchanged`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-intro`,tags:[`reconciliation`,`diffing`,`keys`,`virtual dom`],commonMistakes:[`Thinking reconciliation compares against the real DOM — it compares two virtual DOM trees.`,`Using array index as key in dynamic lists — defeats the purpose when items are reordered.`,`Believing reconciliation avoids re-rendering — it avoids unnecessary DOM mutations, but the component function still runs.`],followUps:[`What happens when an element's type changes during reconciliation?`,`Why is using Math.random() as a key problematic?`,`How does React handle component reconciliation vs element reconciliation?`],interviewTips:[`Mention the two heuristics and their O(n) complexity — this shows you understand why React is fast.`,`Distinguish between re-rendering (calling the component function) and DOM updates (actual mutations).`]},{id:`react-intro-5`,question:`What is the difference between declarative and imperative programming in React's context?`,answer:`Imperative programming tells the computer how to do something step by step. In DOM manipulation, this means writing instructions like "find this element, change its text, add this class." The developer is responsible for every mutation. jQuery-era code is a classic example: you query DOM nodes and manually update each piece of the UI when data changes.

Declarative programming, which React embraces, tells the computer what the result should look like. Instead of step-by-step DOM instructions, you describe the desired UI state and let React figure out the mutations needed. A React component is essentially a function from state to UI: given this data, here is what the screen should show.

This distinction has profound implications for code quality. Imperative DOM code requires explicit handling of every possible state transition. React's declarative model lets you express each state as a separate visual output, and React transitions between them automatically. This enables optimizations like batching, memoization, and concurrent rendering that would be impossible with imperative calls React cannot intercept.`,shortAnswer:`Imperative programming describes how to update the DOM step by step, while declarative programming (React) describes what the UI should look like for a given state. React converts declarative descriptions into efficient imperative DOM operations automatically.`,code:`// Imperative approach (vanilla JS)
const button = document.getElementById("counter-btn")!;
let count = 0;
button.addEventListener("click", () => {
  count++;
  button.textContent = \`Count: \${count}\`;
});

// Declarative approach (React)
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-intro`,tags:[`declarative`,`imperative`,`paradigm`],commonMistakes:[`Thinking declarative means no side effects — React components can have side effects via useEffect.`,`Overusing refs for imperative DOM access when a declarative solution exists.`,`Confusing declarative rendering with functional programming — they overlap but are distinct concepts.`],followUps:[`When would you need imperative code in a React application?`,`How does React's declarative model enable server-side rendering?`],interviewTips:[`Use a concrete before/after example: show imperative jQuery code vs the declarative React equivalent.`,`Connect the declarative model to testability — pure functions from state to UI are easy to test.`]},{id:`react-intro-6`,question:`What is the difference between React and ReactDOM?`,answer:`React and ReactDOM are two separate packages that serve distinct purposes. React (the react package) contains the core library: the component model, hooks, the element creation API, and the reconciliation logic. It is platform-agnostic — it knows how to build and diff virtual DOM trees but has no knowledge of how to render to any specific target.

ReactDOM (the react-dom package) is the renderer for web browsers. It knows how to take React's reconciliation output and apply it to the browser's DOM. It provides createRoot for mounting a React tree and hydrateRoot for hydrating server-rendered HTML. ReactDOM also handles browser-specific concerns like event delegation and synthetic events.

This separation exists because React can render to targets other than the browser DOM. React Native renders to iOS and Android views. react-three-fiber renders to WebGL via Three.js. react-pdf renders to PDF documents. All of these use the same react package for component logic and hooks but have their own platform-specific rendering code.

In practice, a typical React web application imports from both packages. You import hooks from react and the root-creation API from react-dom/client. This split was formalized in React 18 with the move from ReactDOM.render (deprecated) to createRoot.`,shortAnswer:`React is the core library containing the component model, hooks, and reconciliation logic. ReactDOM is the browser-specific renderer that applies React's output to the browser DOM. They are separate so React can work with different renderers (ReactDOM, React Native, etc.).`,code:`// react — core library (platform-agnostic)
import { useState, useEffect } from "react";

// react-dom/client — browser renderer
import { createRoot } from "react-dom/client";

// react-dom/server — server-side rendering
import { renderToString } from "react-dom/server";

function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}

// Client-side rendering
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Server-side rendering
const html = renderToString(<App />);`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-intro`,tags:[`react`,`react-dom`,`renderer`,`architecture`],commonMistakes:[`Importing render from react-dom instead of createRoot from react-dom/client in React 18+.`,`Assuming React only works in browsers — it can render to native, PDF, terminal, and more.`,`Mixing ReactDOM.render (legacy) with concurrent features like useTransition.`],followUps:[`What is the difference between createRoot and hydrateRoot?`,`Can you share components between React web and React Native?`,`What changed from ReactDOM.render to createRoot in React 18?`],interviewTips:[`Highlight the renderer-agnostic design as an architectural strength of React.`,`Mention the React 18 migration from ReactDOM.render to createRoot to show you are current.`]}]},{id:`react-jsx`,title:`JSX`,description:`JSX syntax, embedding expressions, fragments, conditional rendering patterns, and how JSX compiles to JavaScript.`,category:`React`,difficulty:`Beginner`,tags:[`jsx`,`syntax`,`expressions`,`fragments`,`conditional rendering`],overview:`JSX is a syntax extension for JavaScript that looks like HTML but compiles to React.createElement calls. It allows developers to write component templates in a familiar, readable format while still having access to the full power of JavaScript expressions.`,concepts:[`JSX syntax and transpilation`,`Embedding JavaScript expressions`,`JSX attributes vs HTML attributes`,`React Fragments`,`Conditional rendering patterns`,`Lists and iteration in JSX`,`JSX spread attributes`],relatedTopicIds:[`react-intro`,`react-components`,`react-props`],questions:[{id:`react-jsx-1`,question:`What is JSX and how does it work under the hood?`,answer:`JSX stands for JavaScript XML. It is a syntax extension that allows you to write HTML-like markup directly inside JavaScript files. JSX is not valid JavaScript — it must be transpiled by Babel or TypeScript into standard JavaScript function calls before the browser can execute it.

Under the hood, each JSX element is transformed into a React.createElement call (or the newer automatic JSX transform's jsx function). For example, <div className="box">Hello</div> becomes React.createElement("div", { className: "box" }, "Hello"). The automatic transform, introduced in React 17, imports jsx from react/jsx-runtime automatically, eliminating the need for explicit React imports.

JSX supports embedding any JavaScript expression inside curly braces. You can include variables, function calls, ternary operators, and complex expressions. However, statements like if-else and for loops cannot be used directly — you must use expressions (ternaries, map, logical operators) instead.

Because JSX compiles to JavaScript, it has full access to the language's capabilities. You can store JSX in variables, pass it as function arguments, return it from functions, and use it in arrays. This makes JSX strictly more powerful than traditional HTML templating languages.`,shortAnswer:`JSX is a syntax extension that compiles to React.createElement (or the automatic jsx transform) calls returning plain objects describing the UI. Expressions are embedded with curly braces. The automatic transform in React 17+ eliminates the need for explicit React imports.`,code:`// JSX syntax
const element = <h1 className="greeting">Hello, world!</h1>;

// Compiles to (classic transform):
const element2 = React.createElement("h1", { className: "greeting" }, "Hello, world!");

// Automatic transform (React 17+):
import { jsx as _jsx } from "react/jsx-runtime";
const element3 = _jsx("h1", { className: "greeting", children: "Hello, world!" });

// Embedding expressions
const name = "React";
const greeting = <h1>Hello, {name.toUpperCase()}!</h1>;

// JSX is an expression — assign to variables, pass as args
function getGreeting(user: string | null) {
  return user ? <h1>Hello, {user}!</h1> : <h1>Hello, stranger!</h1>;
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-jsx`,tags:[`jsx`,`transpilation`,`createElement`,`expressions`],commonMistakes:[`Using class instead of className — class is a reserved word in JavaScript.`,`Forgetting that JSX expressions must return a single root element.`,`Trying to use statements (if/else, for) directly inside JSX curly braces instead of expressions.`],followUps:[`What is the automatic JSX transform and why was it introduced?`,`Can you use JSX without React?`,`What are the differences between JSX and HTML?`],interviewTips:[`Show you understand JSX is syntactic sugar by explaining what it compiles to.`,`Mention the automatic transform to demonstrate awareness of modern React tooling.`]},{id:`react-jsx-2`,question:`What are React Fragments and why are they useful?`,answer:`React Fragments let you group multiple child elements without adding extra DOM nodes. In React, a component must return a single root element. Before Fragments, developers wrapped sibling elements in a <div>, which added unnecessary nodes to the DOM and sometimes broke CSS layouts (flexbox, grid) or produced invalid HTML (e.g., <div> inside <tr>).

Fragments solve this with an invisible wrapper. You can use the explicit <React.Fragment> syntax or the shorthand <> ... </>. The explicit syntax is required when you need a key prop, which is common when rendering lists of grouped elements.

Fragments also improve performance marginally by reducing DOM node count. In large lists or deeply nested trees, eliminating unnecessary wrapper nodes reduces memory usage and speeds up DOM operations like layout calculations.`,shortAnswer:`React Fragments (<React.Fragment> or <>) return multiple elements without extra DOM nodes. They preserve valid HTML structure and prevent CSS layout issues. Use the explicit syntax when a key prop is needed.`,code:`// Without Fragment — adds unnecessary div
function WithDiv() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// With Fragment shorthand — no extra DOM node
function WithFragment() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}

// Explicit Fragment with key (required for lists)
import { Fragment } from "react";

function Glossary({ items }: { items: { id: string; term: string; desc: string }[] }) {
  return (
    <dl>
      {items.map(item => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.desc}</dd>
        </Fragment>
      ))}
    </dl>
  );
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-jsx`,tags:[`fragments`,`jsx`,`dom`,`semantic html`],commonMistakes:[`Using the shorthand <> syntax when a key prop is needed — shorthand does not support attributes.`,`Wrapping table rows in <div> instead of Fragments, producing invalid HTML.`,`Over-nesting Fragments unnecessarily when a single parent element is semantically appropriate.`],followUps:[`When would you use the explicit Fragment syntax over the shorthand?`,`Can Fragments accept any props besides key?`],interviewTips:[`Give a concrete example where a wrapper div breaks layout (flexbox, table).`,`Mention the key prop distinction between shorthand and explicit Fragment syntax.`]},{id:`react-jsx-3`,question:`What are the common patterns for conditional rendering in JSX?`,answer:`Conditional rendering in React displays different UI based on conditions. Since JSX only supports expressions, you cannot use if-else blocks directly. React developers use several expression-based patterns, each suited to different scenarios.

The ternary operator (condition ? a : b) is the most common for choosing between two elements. The logical AND (condition && <Element />) is ideal for render-or-nothing. However, && has a gotcha: if the condition is 0 (a falsy number), React renders "0" in the DOM. Fix with explicit boolean coercion: {count > 0 && <Badge />}.

For multiple conditions, extract logic outside the JSX return using if-else or switch statements to assign JSX to a variable. Early return patterns within the component function are also effective: if (isLoading) return <Spinner />; if (!data) return <Error />; return <Content />. This "guard clause" pattern keeps the happy path unindented.`,shortAnswer:`Common patterns include ternary operators (a ? b : c) for two-way choices, logical AND (condition && element) for render-or-nothing, if-else outside the return for complex conditions, and early returns for guard clauses. Avoid the falsy-zero gotcha with && by using explicit boolean coercion.`,code:`// Ternary operator
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  return isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>;
}

// Logical AND — render or nothing
function Mailbox({ unreadCount }: { unreadCount: number }) {
  return (
    <div>
      <h1>Inbox</h1>
      {unreadCount > 0 && <span>You have {unreadCount} unread messages.</span>}
    </div>
  );
}

// Gotcha: falsy zero renders "0" in the DOM
function BadExample({ count }: { count: number }) {
  return <div>{count && <span>Count: {count}</span>}</div>;
}
function FixedExample({ count }: { count: number }) {
  return <div>{count > 0 && <span>Count: {count}</span>}</div>;
}

// Early return pattern
function UserProfile({ user, isLoading }: { user: User | null; isLoading: boolean }) {
  if (isLoading) return <Spinner />;
  if (!user) return <p>User not found.</p>;
  return <div><h1>{user.name}</h1></div>;
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-jsx`,tags:[`conditional rendering`,`ternary`,`logical and`,`patterns`],commonMistakes:[`Using && with a numeric condition that can be 0 — React renders the number 0 instead of nothing.`,`Deeply nesting ternary operators making code unreadable — extract to variables instead.`,`Using if-else inside JSX curly braces — only expressions are allowed, not statements.`],followUps:[`How would you handle rendering based on user roles?`,`What is the nullish coalescing operator (??) and when is it useful in JSX?`],interviewTips:[`Mention the 0-gotcha with && — it is a common interview follow-up.`,`Explain when to use each pattern rather than picking just one.`]},{id:`react-jsx-4`,question:`What are the key differences between JSX and HTML?`,answer:`Although JSX looks similar to HTML, there are several important differences because JSX compiles to JavaScript. Attribute naming follows JavaScript conventions: class becomes className, for becomes htmlFor, event handlers use camelCase (onClick, onChange). The style attribute accepts a JavaScript object with camelCased properties instead of a CSS string.

JSX requires all tags to be properly closed. Self-closing tags like <img>, <input>, and <br> must be explicitly self-closed: <img />, <input />, <br />. JSX expressions must return a single root element, solved with Fragments (<>). Boolean attributes work differently: disabled in HTML equals disabled={true} in JSX.

JSX uses curly braces for JavaScript expressions, and comments use {/* comment */} syntax instead of HTML comments. Importantly, JSX automatically escapes embedded values to prevent XSS attacks, while raw HTML interpolation does not.`,shortAnswer:`JSX differs from HTML: className instead of class, htmlFor instead of for, camelCase events, self-closing tags required, single root element, JS object for style, curly braces for expressions, and automatic XSS escaping.`,code:`// className instead of class
const div = <div className="container">Content</div>;

// htmlFor instead of for
const label = <label htmlFor="email">Email</label>;

// camelCase event handlers
const button = <button onClick={() => alert("clicked")}>Click</button>;

// Style as object with camelCase properties
const styled = (
  <div style={{ backgroundColor: "blue", fontSize: "16px", marginTop: 10 }}>
    Styled
  </div>
);

// Self-closing tags required
const inputs = (
  <form>
    <input type="text" />
    <br />
    <img src="photo.jpg" alt="Photo" />
  </form>
);

// Automatic XSS escaping
const userInput = '<script>alert("xss")<\/script>';
const safe = <div>{userInput}</div>; // Renders as text, not HTML`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-jsx`,tags:[`jsx`,`html`,`differences`,`attributes`],commonMistakes:[`Using class instead of className — produces a warning and may not work correctly.`,`Writing style as a string instead of an object.`,`Forgetting to self-close void elements like <img />, <input />, and <br />.`],followUps:[`How does dangerouslySetInnerHTML work and when should you use it?`,`How does JSX handle XSS prevention?`],interviewTips:[`Group differences by category (naming, syntax, expressions) for a structured answer.`,`Mention XSS protection as a security benefit of JSX over raw HTML string interpolation.`]},{id:`react-jsx-5`,question:`How do you render lists in JSX and why are keys important?`,answer:`Rendering lists uses Array.map to return a JSX element for each item. Each element must have a unique key prop to help React's reconciliation algorithm identify which items have changed, been added, or removed. Without keys, React compares items by index, leading to incorrect behavior when items are reordered, inserted, or deleted.

The ideal key is a unique, stable identifier from your data — a database ID or UUID. Using the array index is acceptable only for static lists that never change order. With dynamic lists, index keys cause state bugs: component state gets attached to the wrong item, and animations break.

Keys must be unique among siblings but not globally. They are not passed as props — if a child needs the ID, pass it as a separate prop. The key prop can also force a component to remount: changing a component's key tells React to destroy the old instance and create a new one, resetting all state.`,shortAnswer:`Lists are rendered with Array.map(), each element needing a unique key for efficient reconciliation. Use stable IDs from data, not array indices for dynamic lists. Keys are unique among siblings, not passed as props, and can force remounting when changed.`,code:`interface User { id: string; name: string; email: string; }

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  );
}

// BAD: using index as key with dynamic list
function BadList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <input defaultValue={item} />
        </li>
      ))}
    </ul>
  );
}

// Using key to reset component state
function EditUser({ userId }: { userId: string }) {
  return <UserForm key={userId} userId={userId} />;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-jsx`,tags:[`lists`,`keys`,`map`,`reconciliation`],commonMistakes:[`Using array index as key for dynamic lists — causes state bugs when items are reordered or deleted.`,`Using Math.random() as key — forces React to remount every item on every render.`,`Expecting the key prop to be accessible inside the child component.`],followUps:[`What happens if two siblings have the same key?`,`How can you use the key prop to reset a component's state?`,`When is it acceptable to use index as a key?`],interviewTips:[`Explain the performance implication: wrong keys cause unnecessary DOM mutations and state corruption.`,`Mention the key-reset pattern as an advanced technique.`]}]}],m=[{id:`react-components`,title:`React Components`,description:`Understanding functional and class components, component composition, reusability, and controlled vs uncontrolled patterns.`,category:`React`,difficulty:`Beginner`,tags:[`components`,`functional`,`class`,`composition`,`reusability`],overview:`Components are the building blocks of React applications. They encapsulate UI logic and presentation into reusable, self-contained units. Modern React strongly favors functional components with hooks over class components.`,concepts:[`Functional components`,`Class components`,`Component composition vs inheritance`,`Controlled vs uncontrolled components`,`Pure components`,`Component reusability patterns`],relatedTopicIds:[`react-functional`,`react-class`,`react-props`,`react-hooks`],questions:[{id:`react-components-1`,question:`What is the difference between functional and class components?`,answer:`Functional components are plain JavaScript functions that accept a props object and return JSX. With hooks (React 16.8), they can manage state, side effects, context, and all features previously exclusive to class components. They are simpler, produce less boilerplate, and are the recommended approach.

Class components are ES6 classes extending React.Component. They define a render() method returning JSX, manage state through this.state/this.setState, and use lifecycle methods like componentDidMount. They use the this keyword extensively, which introduces complexity around method binding.

A significant difference is how they capture values. Functional components close over props and state from their render — callbacks see values from when they were created. Class components access this.props which always points to the latest values. The React team recommends functional components for all new code; class components are not deprecated but receive no new features.`,shortAnswer:`Functional components are plain functions using hooks for state and effects. Class components extend React.Component with lifecycle methods. Functional components are simpler, capture values via closures, and are the modern standard.`,code:`// Functional component
function Welcome({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`\${name} - \${count} clicks\`;
  }, [name, count]);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button>
    </div>
  );
}

// Equivalent class component
class WelcomeClass extends React.Component<{ name: string }, { count: number }> {
  state = { count: 0 };

  componentDidMount() { document.title = \`\${this.props.name} - \${this.state.count} clicks\`; }
  componentDidUpdate() { document.title = \`\${this.props.name} - \${this.state.count} clicks\`; }

  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}!</h1>
        <button onClick={() => this.setState(s => ({ count: s.count + 1 }))}>
          Clicked {this.state.count} times
        </button>
      </div>
    );
  }
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-components`,tags:[`functional`,`class`,`comparison`,`hooks`],commonMistakes:[`Thinking class components are deprecated — they are fully supported, just not recommended for new code.`,`Forgetting to bind this in class component event handlers.`,`Mixing hooks with class components — hooks only work in functional components.`],followUps:[`Can hooks completely replace class component features?`,`What is the only feature class components have that hooks cannot replicate?`],interviewTips:[`Lead with the modern recommendation (functional + hooks) then explain class components for legacy context.`,`Mention error boundaries as the one remaining class component use case.`]},{id:`react-components-2`,question:`What is component composition and why is it preferred over inheritance?`,answer:`Component composition builds complex UIs by combining simpler components, much like composing functions. Instead of class inheritance (Child extends Parent), React encourages components that accept other components as children or props and render them within their own output.

The primary pattern is the children prop. Content between a component's tags is passed as children, allowing components like Card, Modal, or Layout to define structure while remaining content-agnostic. Named slot props (header={<Nav />}, sidebar={<Menu />}) give explicit control over which content appears where.

React's documentation explicitly recommends composition over inheritance — the team has never found a use case where inheritance is necessary. Inheritance creates tight coupling, makes parents fragile, and complicates refactoring. With hooks, even shared logic is better handled through custom hooks than HOCs or inheritance.`,shortAnswer:`Component composition builds complex UIs by combining simple components using children and props-as-components patterns. React favors composition because it keeps components independent and avoids the tight coupling of inheritance.`,code:`// Composition via children
function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

<Card title="Profile">
  <p>Name: John Doe</p>
  <p>Email: john@example.com</p>
</Card>

// Named slots
interface LayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

function Layout({ header, sidebar, children }: LayoutProps) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

// Specialization (composition, not inheritance)
function WelcomeDialog() {
  return <Dialog title="Welcome" message="Thanks for visiting!" />;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-components`,tags:[`composition`,`children`,`slots`,`inheritance`],commonMistakes:[`Using inheritance to share behavior — use hooks or composition instead.`,`Overcomplicating with nested slot patterns when children suffices.`,`Confusing the children prop with child component references.`],followUps:[`What are render props and how do they relate to composition?`,`How do custom hooks replace HOCs?`],interviewTips:[`Quote the React docs: "we haven't found any use cases where we would recommend creating component inheritance hierarchies."`,`Show the slots pattern as an alternative to children for multi-region layouts.`]},{id:`react-components-3`,question:`What are controlled and uncontrolled components?`,answer:`Controlled components are form elements whose values are driven by React state. The state is the single source of truth: the input's value comes from state, and changes trigger a handler that updates state. This closed loop gives you complete control over the form data for real-time validation, formatting, and synchronization.

Uncontrolled components let the DOM manage form state. Instead of setting value, you use defaultValue and read the value via a ref when needed (typically on submit). File inputs are always uncontrolled since their value is read-only for security reasons.

Controlled is recommended for most cases because it enables real-time validation, conditional submit disabling, and data synchronization. Uncontrolled suits integration with non-React code or performance-critical scenarios. Libraries like React Hook Form use uncontrolled components internally with refs for performance while providing a controlled-like API.`,shortAnswer:`Controlled components have values driven by React state via value + onChange. Uncontrolled components manage their own state in the DOM, read via refs. Controlled is preferred for validation and data control; uncontrolled suits performance-critical or integration scenarios.`,code:`// Controlled component
function ControlledInput() {
  const [value, setValue] = useState("");
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Controlled"
    />
  );
}

// Uncontrolled component
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(\`Value: \${inputRef.current?.value}\`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="initial" />
      <button type="submit">Submit</button>
    </form>
  );
}

// File input is always uncontrolled
function FileUpload() {
  const fileRef = useRef<HTMLInputElement>(null);
  return <input type="file" ref={fileRef} />;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-components`,tags:[`controlled`,`uncontrolled`,`forms`,`state`],commonMistakes:[`Setting value without onChange creates a read-only input.`,`Switching between controlled and uncontrolled by toggling value and defaultValue.`,`Using refs to read controlled input values instead of reading from state.`],followUps:[`How does React Hook Form use uncontrolled components for performance?`,`What happens if you set value without an onChange handler?`],interviewTips:[`Explain the trade-off: controlled gives power, uncontrolled gives performance.`,`Mention that file inputs are always uncontrolled as a practical edge case.`]},{id:`react-components-4`,question:`What are pure components and how do they optimize rendering?`,answer:`A pure component produces the same output for the same props and state — given identical inputs, it always renders identically. This predictability enables React to skip re-renders when nothing has changed, improving performance.

For class components, React.PureComponent implements shouldComponentUpdate with shallow prop/state comparison. For functional components, React.memo wraps the function and caches results when props are unchanged. Both use reference equality (===) for objects and arrays, so new references bypass the optimization even if values are identical.

Pure components are not always appropriate. Cheap components gain little from memoization but pay comparison overhead. Components that almost always receive new props waste time on comparisons. Best candidates are expensive components that render frequently with the same props. Parents must stabilize references with useMemo/useCallback for memo to be effective.`,shortAnswer:`Pure components produce identical output for identical inputs. React.PureComponent (class) and React.memo (functional) skip re-renders via shallow comparison. They require stable references for objects/arrays to be effective.`,code:`const ExpensiveList = React.memo(function ExpensiveList(
  { items, onSelect }: { items: string[]; onSelect: (item: string) => void }
) {
  console.log("ExpensiveList rendered");
  return (
    <ul>
      {items.map(item => (
        <li key={item} onClick={() => onSelect(item)}>{item}</li>
      ))}
    </ul>
  );
});

function App() {
  const [query, setQuery] = useState("");
  const items = useMemo(() => data.filter(i => i.includes(query)), [query]);
  const handleSelect = useCallback((item: string) => {
    console.log("Selected:", item);
  }, []);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ExpensiveList items={items} onSelect={handleSelect} />
    </div>
  );
}

// Custom comparison function
const UserCard = React.memo(
  function UserCard({ user }: { user: { id: string; name: string } }) {
    return <div>{user.name}</div>;
  },
  (prev, next) => prev.user.id === next.user.id
);`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-components`,tags:[`pure components`,`React.memo`,`PureComponent`,`optimization`],commonMistakes:[`Creating new object/array references in the parent every render, defeating shallow comparison.`,`Wrapping every component in React.memo by default.`,`Assuming React.memo does deep comparison — it does shallow by default.`],followUps:[`How do useMemo and useCallback complement React.memo?`,`When should you NOT use React.memo?`],interviewTips:[`Emphasize that React.memo is an optimization, not a guarantee.`,`Explain the relationship between stable references and memoization effectiveness.`]},{id:`react-components-5`,question:`How do you design reusable components in React?`,answer:`Reusable components do one thing well, accept configuration through props, and make no assumptions about context. Separate concerns by splitting into generic presentational pieces and specific business-logic pieces. A Button handles visual presentation (size, variant) but not business logic (what happens on click).

Use composition patterns for flexibility: accept children or render props, use the rest/spread pattern (...rest) to forward native HTML attributes, provide sensible defaults for optional props, and allow className/style overrides. TypeScript interfaces document the props contract and catch misuse at compile time.

Handle edge cases gracefully — define behavior for empty arrays, loading states, and errors. Render useful empty states and loading skeletons by default, with props to customize each. Test components in isolation with tools like Storybook. If a component is difficult to render in isolation, it is likely too coupled.`,shortAnswer:`Reusable components follow single responsibility, accept well-typed props, use composition (children, render props) for flexibility, provide sensible defaults, forward native HTML attributes, and handle edge cases gracefully.`,code:`interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  children,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size} \${className ?? ""}\`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <Spinner size={size} /> : leftIcon}
      {children}
    </button>
  );
}

// Flexible usage
<Button>Default primary</Button>
<Button variant="secondary" size="lg">Large</Button>
<Button isLoading onClick={handleSubmit}>Submitting...</Button>
<Button leftIcon={<PlusIcon />}>Add item</Button>`,language:`tsx`,difficulty:`Intermediate`,type:`Scenario`,category:`React`,topicId:`react-components`,tags:[`reusability`,`component design`,`props`,`patterns`],commonMistakes:[`Making components too specific to one use case.`,`Adding too many props — leads to prop bloat.`,`Not forwarding native HTML attributes.`],followUps:[`How do you handle polymorphic components?`,`What is the compound component pattern?`],interviewTips:[`Walk through designing a Button step by step to demonstrate your process.`,`Mention TypeScript, testing, and Storybook as supporting tools.`]}]},{id:`react-state`,title:`Component State`,description:`Managing component state with useState, understanding batching, immutability rules, and state update patterns.`,category:`React`,difficulty:`Beginner`,tags:[`state`,`useState`,`batching`,`immutability`,`state updates`],overview:`State is data that changes over time and drives rendering. React provides useState for simple state and useReducer for complex logic. Understanding batching, immutability, and derived state is essential for correct React applications.`,concepts:[`useState hook`,`Functional updates`,`Batching`,`Immutability`,`Derived state`,`Lazy initialization`,`useReducer`],relatedTopicIds:[`react-hooks`,`react-data-flow`,`react-performance`],questions:[{id:`react-state-1`,question:`How does useState work and what are its rules?`,answer:`useState adds local state to a functional component. It accepts an initial value and returns [currentValue, setter]. The state persists across re-renders in a fiber node. The initial value is used only during the first render; for expensive initializations, pass a lazy initializer function: useState(() => computeExpensive()).

The setter accepts either a new value directly or an updater function. Updater functions (setCount(prev => prev + 1)) receive the current state and return the new state — essential when multiple updates depend on previous state. State updates are asynchronous and batched: React schedules re-renders and processes all updates before re-rendering.

React uses Object.is to determine if state changed. If the setter receives a value identical to current state, React bails out of re-rendering. This is why immutability matters: mutating an object and passing it back returns the same reference, so React sees no change and skips the update.`,shortAnswer:`useState returns [value, setter]. The initial value is used only on first render (pass a function for expensive computation). Setters accept values or updater functions. Updates are batched and asynchronous. React skips re-renders if the new value is identical (Object.is).`,code:`function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

// Updater function — necessary for dependent updates
function BatchedCounter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1); // count will be +3
  }
  return <button onClick={handleClick}>Count: {count}</button>;
}

// Lazy initialization
function FormWithDefaults() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : { name: "", email: "" };
  });

  return <input value={formData.name} onChange={e =>
    setFormData(prev => ({ ...prev, name: e.target.value }))
  } />;
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-state`,tags:[`useState`,`state`,`updater`,`batching`],commonMistakes:[`Reading state immediately after calling the setter — state updates on next render.`,`Using direct value form when multiple updates depend on each other.`,`Passing expensive computation without wrapping in a function — it runs every render.`],followUps:[`When should you use useReducer instead of useState?`,`How does React 18 batching differ from React 17?`],interviewTips:[`Demonstrate batching understanding with multiple setCount calls.`,`Mention the lazy initializer pattern.`]},{id:`react-state-2`,question:`What is state batching in React and how does it work?`,answer:`State batching groups multiple state updates into a single re-render. Instead of re-rendering after each setState, React waits until all updates complete and performs one re-render. This dramatically reduces renders and DOM updates.

React 17 only batched inside React event handlers. Updates in setTimeout, Promises, or native listeners triggered separate re-renders. React 18 introduced automatic batching for all contexts via createRoot. Every setState call in any execution context is batched.

When using updater functions in a batch, each updater receives the result of the previous update, ensuring correctness. For rare cases requiring immediate synchronous updates, flushSync from react-dom forces re-render before continuing. Use it sparingly — it bypasses batching optimizations.`,shortAnswer:`Batching groups multiple setState calls into one re-render. React 18 batches automatically everywhere (event handlers, promises, timeouts). Updater functions in a batch chain correctly. Use flushSync for rare immediate update needs.`,code:`// Batching in event handlers (React 17 and 18)
function Profile() {
  const [name, setName] = useState("Alice");
  const [age, setAge] = useState(25);

  function handleClick() {
    setName("Bob");  // queued
    setAge(30);      // queued
    // ONE re-render with both updates
  }
  return <button onClick={handleClick}>{name}, {age}</button>;
}

// React 18: automatic batching in async code
function AsyncBatching() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetch("/api/data").then(() => {
      setCount(c => c + 1); // batched in React 18
      setFlag(f => !f);     // single re-render
    });
  }
  return <button onClick={handleClick}>{count}</button>;
}

// flushSync — force immediate re-render (escape hatch)
import { flushSync } from "react-dom";

function WithFlushSync() {
  const [count, setCount] = useState(0);

  function handleClick() {
    flushSync(() => { setCount(c => c + 1); });
    // DOM is updated at this point
  }
  return <span>{count}</span>;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-state`,tags:[`batching`,`state updates`,`React 18`,`flushSync`],commonMistakes:[`Expecting state to update immediately after setState.`,`Using direct values instead of updaters for dependent updates.`,`Overusing flushSync — it bypasses batching optimizations.`],followUps:[`How does createRoot enable automatic batching?`,`How does batching interact with useTransition?`],interviewTips:[`Contrast React 17 (only event handlers) with React 18 (everything batched).`,`Mention flushSync as an escape hatch but explain why to avoid it.`]},{id:`react-state-3`,question:`Why is immutability important when updating state in React?`,answer:`Immutability means never modifying existing state directly — instead create new copies with changes. React uses reference comparison (Object.is) to detect state changes. Mutating an object and passing it to the setter returns the same reference, so React concludes nothing changed and skips re-rendering.

Immutability also enables optimization features. React.memo, useMemo, and useCallback rely on reference comparison. If objects are always replaced (not mutated), changed references reliably signal new data. Mutation breaks this contract and makes memoization unreliable.

For objects, use spread ({...obj, key: newValue}). For arrays, use methods returning new arrays (map, filter, concat) instead of mutating ones (push, splice, sort on original). For deeply nested structures, consider Immer which lets you write mutation-like code that produces immutable updates under the hood.`,shortAnswer:`React uses Object.is to detect state changes. Mutating state returns the same reference, skipping re-renders. Immutable updates create new references, triggering re-renders correctly. Use spread operators or Immer for updates.`,code:`// WRONG: mutating state
function MutationBug() {
  const [user, setUser] = useState({ name: "Alice", age: 25 });
  function birthday() {
    user.age += 1;   // mutation — same reference
    setUser(user);    // React sees same reference → no re-render!
  }
  return <div>{user.age}</div>;
}

// CORRECT: immutable update
function ImmutableUpdate() {
  const [user, setUser] = useState({ name: "Alice", age: 25 });
  function birthday() {
    setUser({ ...user, age: user.age + 1 }); // new object → re-render
  }
  return <div>{user.age}</div>;
}

// Array immutability
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);

  const addTodo = (text: string) => setTodos([...todos, text]);
  const removeTodo = (i: number) => setTodos(todos.filter((_, idx) => idx !== i));
  const updateTodo = (i: number, text: string) =>
    setTodos(todos.map((t, idx) => (idx === i ? text : t)));
}

// Nested objects — spread at every level
function NestedUpdate() {
  const [state, setState] = useState({
    user: { name: "Alice", address: { city: "NYC", zip: "10001" } },
  });

  function updateCity(city: string) {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, address: { ...prev.user.address, city } },
    }));
  }
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-state`,tags:[`immutability`,`state updates`,`spread`,`Object.is`],commonMistakes:[`Mutating state objects directly and expecting re-renders.`,`Forgetting to spread at every nesting level for deep updates.`,`Using array methods that mutate (push, pop, splice, sort).`],followUps:[`How does Immer simplify immutable updates?`,`How does immutability enable time-travel debugging?`],interviewTips:[`Explain the Object.is check as the reason immutability matters.`,`Mention Immer as a practical tool for complex nested updates.`]},{id:`react-state-4`,question:`When should you use useReducer instead of useState?`,answer:`useReducer provides an alternative for complex state logic. It follows the Redux pattern: dispatch actions to a reducer function that computes new state based on current state and action. While useState suffices for simple values, useReducer excels when multiple values change together or transitions are complex.

The first use case is when multiple state values change together (form with name, email, errors, submission status). A single reducer handles all transitions in one place. The second is complex state machines where transitions depend on both current state and action type (network request states, multi-step wizards).

useReducer also integrates well with context. Since dispatch is stable (reference never changes), passing it through context avoids unnecessary re-renders in consuming components wrapped with React.memo. The reducer function is pure and testable independently without rendering.`,shortAnswer:`Use useReducer when state is complex (multiple related values), transitions depend on current state + action type, you want testable state logic, or when providing update functions through context (dispatch is stable).`,code:`interface FormState {
  name: string;
  email: string;
  isSubmitting: boolean;
  error: string | null;
}

type FormAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string };

const initialState: FormState = { name: "", email: "", isSubmitting: false, error: null };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value, error: null };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: null };
    case "SUBMIT_SUCCESS":
      return initialState;
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, error: action.error };
  }
}

function ContactForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "SUBMIT_START" });
    try {
      await submitForm(state);
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (err) {
      dispatch({ type: "SUBMIT_ERROR", error: (err as Error).message });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.name}
        onChange={e => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
      />
      {state.error && <p className="error">{state.error}</p>}
      <button disabled={state.isSubmitting}>Submit</button>
    </form>
  );
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-state`,tags:[`useReducer`,`state management`,`actions`,`reducer`],commonMistakes:[`Using useReducer for simple toggle/counter state where useState is clearer.`,`Putting side effects in the reducer — reducers must be pure.`,`Forgetting to return new state in every switch case.`],followUps:[`How does useReducer compare to Redux?`,`Can you use useReducer with useContext for global state?`],interviewTips:[`Explain when to choose useReducer over useState with concrete criteria.`,`Mention that dispatch is a stable reference, ideal for context.`]},{id:`react-state-5`,question:`What is derived state and how should you handle it?`,answer:`Derived state is any value computable from existing state or props. A filtered list from items + query is derived state. The principle is: don't store what you can compute. Calculate derived values during render — they are always fresh and consistent.

A common anti-pattern is synchronizing state with useEffect. Storing derived values in state and updating via useEffect causes an extra render cycle and adds unnecessary complexity. If you find yourself writing useEffect to "sync" one state with another, the derived value should be computed directly during render instead.

For expensive computations, use useMemo to cache the result — it recomputes only when dependencies change. Another anti-pattern is copying props into state. If a component receives a prop and stores it in useState, prop changes are ignored because useState initializes only once. Use the prop directly, or use the key prop to reset the component.`,shortAnswer:`Derived state is computable from existing state or props — compute it during render instead of storing separately. Use useMemo for expensive computations. Avoid syncing state with useEffect and copying props into state.`,code:`// BAD: storing derived state
function BadFilteredList({ items }: { items: string[] }) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items.filter(i => i.includes(query)));
  }, [items, query]);

  return <div>{filteredItems.map(i => <div key={i}>{i}</div>)}</div>;
}

// GOOD: compute during render
function GoodFilteredList({ items }: { items: string[] }) {
  const [query, setQuery] = useState("");
  const filteredItems = items.filter(i => i.includes(query));

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {filteredItems.map(i => <div key={i}>{i}</div>)}
    </div>
  );
}

// useMemo for expensive computations
function ExpensiveList({ items }: { items: LargeItem[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => items.filter(i => expensiveMatch(i, query)),
    [items, query]
  );
  return <VirtualList items={filtered} />;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-state`,tags:[`derived state`,`useMemo`,`anti-pattern`,`useEffect`],commonMistakes:[`Storing computed values in state and syncing with useEffect.`,`Copying props into state, ignoring prop updates.`,`Using useMemo for trivial computations.`],followUps:[`How do you decide whether to use useMemo?`,`What is the key-reset pattern?`],interviewTips:[`Frame this around "don't sync, compute."`,`Mention the React docs article "You Might Not Need an Effect."`]}]},{id:`react-props`,title:`Props`,description:`Passing data between components via props, destructuring, children, default values, and TypeScript typing.`,category:`React`,difficulty:`Beginner`,tags:[`props`,`children`,`destructuring`,`defaults`,`typescript`],overview:`Props are the mechanism for passing data from parent to child components. They are read-only, enabling unidirectional data flow. Understanding how to define, type, and use props effectively is fundamental to composable React applications.`,concepts:[`Passing and destructuring props`,`The children prop`,`Default prop values`,`TypeScript interfaces`,`Prop drilling`,`Callback props`],relatedTopicIds:[`react-components`,`react-data-flow`,`react-context`],questions:[{id:`react-props-1`,question:`What are props and how do they differ from state?`,answer:`Props (properties) are inputs passed from parent to child as JSX attributes. They are read-only — a component cannot modify its own props. They flow unidirectionally from parent to child, making the application predictable and debuggable.

State is internal data managed by the component itself, mutable through setState or the useState setter. When state changes, the component and its children re-render. A parent's state often becomes a child's props — when state changes, new props flow down.

Think of props as function arguments and state as local variables. A function cannot modify its arguments but can create and modify local variables. Similarly, a component cannot modify props but can manage state.`,shortAnswer:`Props are read-only inputs from parent to child (like function arguments). State is internal mutable data owned by the component (like local variables). Props flow down unidirectionally.`,code:`interface GreetingProps { name: string; age: number; }

function Greeting({ name, age }: GreetingProps) {
  return <p>{name} is {age} years old</p>;
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}

// Parent state becomes child props
function App() {
  const [user, setUser] = useState({ name: "Alice", age: 30 });
  return (
    <div>
      <Greeting name={user.name} age={user.age} />
      <button onClick={() => setUser(u => ({ ...u, age: u.age + 1 }))}>Birthday</button>
    </div>
  );
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-props`,tags:[`props`,`state`,`unidirectional`,`data flow`],commonMistakes:[`Trying to modify props inside a child component.`,`Duplicating props into state unnecessarily.`,`Confusing props (from parent) and state (internal).`],followUps:[`Can a child communicate back to the parent?`,`What is lifting state up?`],interviewTips:[`Use the function argument vs local variable analogy.`,`Mention unidirectional data flow as a design principle.`]},{id:`react-props-2`,question:`What is the children prop and how do you use it?`,answer:`The children prop contains content placed between a component's opening and closing JSX tags. It allows components to act as wrappers or containers. children can be text, elements, arrays, null, or even functions (render props). The type React.ReactNode covers all cases.

This enables powerful composition: Layout, Card, Modal define structure while remaining content-agnostic. React.Children utilities (map, forEach, count, toArray) handle edge cases like null children and nested arrays when processing children programmatically.

For most cases, simply render {children} directly. The render props pattern (passing a function as children) allows parent-to-child data flow where the wrapper provides data to its content, though this pattern has been largely supplanted by hooks.`,shortAnswer:`The children prop contains content between a component's tags. Typed as React.ReactNode, it enables wrapper/container patterns where components define structure while consumers provide content.`,code:`function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

<Card title="Profile">
  <p>Name: Alice</p>
  <p>Email: alice@example.com</p>
</Card>

// Render prop pattern
interface DataFetcherProps<T> {
  url: string;
  children: (data: T, isLoading: boolean) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(d => { setData(d); setIsLoading(false); });
  }, [url]);

  return <>{data ? children(data, isLoading) : <p>Loading...</p>}</>;
}

// React.Children utilities
function List({ children }: { children: React.ReactNode }) {
  return (
    <ul>
      {React.Children.map(children, (child, index) => (
        <li key={index}>{child}</li>
      ))}
    </ul>
  );
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-props`,tags:[`children`,`composition`,`ReactNode`,`render props`],commonMistakes:[`Using React.ReactElement instead of React.ReactNode — ReactNode is broader.`,`Assuming children is always an array.`,`Not using React.Children.map for safe iteration.`],followUps:[`What is the difference between React.ReactNode and React.ReactElement?`,`How do you pass data to children?`],interviewTips:[`Show the composition value: children makes components reusable containers.`,`Mention React.Children utilities for edge cases.`]},{id:`react-props-3`,question:`What is prop drilling and how do you avoid it?`,answer:`Prop drilling passes data through intermediate components that don't use it, just to reach a deeply nested consumer. If App has user data that a deeply nested Avatar needs, the data passes through Header → NavBar → UserSection → Avatar, even though intermediates never use it.

This increases coupling, makes refactoring harder (adding/removing a prop requires changes in every intermediate), and obscures data flow. Three solutions exist: Context API broadcasts data to any descendant without passing through intermediates. Component composition restructures the hierarchy so parents render nested components directly. State management libraries (Redux, Zustand) provide centralized stores.

Composition should be tried first — it is simpler and keeps data flow explicit. Context suits widely-shared data (auth, theme, locale). State management libraries suit complex cross-cutting state. Don't overuse avoidance patterns for shallow trees where direct passing is clearer.`,shortAnswer:`Prop drilling passes data through intermediate components that don't use it. Avoid with Context API (widely-shared data), component composition (restructure hierarchy), or state management libraries (complex global state).`,code:`// Prop drilling problem
function App() {
  const [user] = useState({ name: "Alice", avatar: "/alice.png" });
  return <Header user={user} />;
}
function Header({ user }: { user: User }) {
  return <NavBar user={user} />;
}
function NavBar({ user }: { user: User }) {
  return <Avatar src={user.avatar} />;
}

// Solution 1: Context API
const UserContext = createContext<User | null>(null);

function App() {
  const [user] = useState({ name: "Alice", avatar: "/alice.png" });
  return (
    <UserContext.Provider value={user}>
      <Header />
    </UserContext.Provider>
  );
}
function Avatar() {
  const user = useContext(UserContext);
  return <img src={user?.avatar} alt={user?.name} />;
}

// Solution 2: Component composition
function App() {
  const [user] = useState({ name: "Alice", avatar: "/alice.png" });
  return (
    <Header>
      <Avatar src={user.avatar} />
    </Header>
  );
}
function Header({ children }: { children: React.ReactNode }) {
  return <nav>{children}</nav>;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Scenario`,category:`React`,topicId:`react-props`,tags:[`prop drilling`,`context`,`composition`,`state management`],commonMistakes:[`Reaching for context before trying composition.`,`Using a single context for all app data.`,`Overusing avoidance patterns for shallow trees.`],followUps:[`How does Context cause performance issues?`,`When should you use a state management library vs Context?`],interviewTips:[`Show multiple solutions and explain when each is appropriate.`,`Emphasize composition first — it is simpler.`]},{id:`react-props-4`,question:`How do you set default prop values in React?`,answer:`The recommended approach for functional components is JavaScript default parameters in the destructuring pattern. This is idiomatic, works with TypeScript, and keeps defaults close to usage. Defaults trigger on undefined (not null).

For complex defaults like objects or arrays, define the default outside the component to avoid creating new references every render. An inline default ({}) creates a new object each render, which defeats memoization if passed to a child wrapped in React.memo.

TypeScript enhances defaults by marking props as optional (?) while providing defaults in destructuring. Class components use static defaultProps, which still works but is de-emphasized in modern React.`,shortAnswer:`Use JavaScript default parameters in destructuring: function Button({ size = "md" }). Define complex defaults outside the component for stable references. Defaults trigger for undefined, not null.`,code:`interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
}

function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button className={\`btn-\${variant} btn-\${size}\`} disabled={disabled}>
      {children}
    </button>
  );
}

// Usage — all optional props have defaults
<Button>Click me</Button>
<Button variant="secondary" size="lg">Large</Button>

// Complex defaults — define outside for reference stability
const DEFAULT_STYLE: React.CSSProperties = { padding: 8, margin: 0 };
const DEFAULT_ITEMS: string[] = [];

function Widget({
  style = DEFAULT_STYLE,
  items = DEFAULT_ITEMS,
}: {
  style?: React.CSSProperties;
  items?: string[];
}) {
  return <div style={style}>{items.map(i => <span key={i}>{i}</span>)}</div>;
}`,language:`tsx`,difficulty:`Beginner`,type:`Conceptual`,category:`React`,topicId:`react-props`,tags:[`defaults`,`destructuring`,`typescript`],commonMistakes:[`Defining object/array defaults inline — creates new references every render.`,`Confusing undefined and null — defaults only apply for undefined.`,`Using defaultProps with functional components.`],followUps:[`How does null vs undefined affect defaults?`,`Why should complex defaults be outside the component?`],interviewTips:[`Mention reference stability for object defaults.`,`Explain the null vs undefined distinction.`]},{id:`react-props-5`,question:`How do you type props effectively with TypeScript?`,answer:`Type props with interfaces or type aliases. For components wrapping native HTML elements, extend built-in attribute types (React.ButtonHTMLAttributes<HTMLButtonElement>) to accept both custom and native attributes. Use the rest/spread pattern to forward native props.

Discriminated unions model mutually exclusive configurations: { as: "button"; onClick: () => void } | { as: "link"; href: string }. TypeScript narrows based on the discriminant. Generic components accept type parameters flowing through props for end-to-end type safety.

Avoid React.FC — it implicitly included children (fixed in React 18 types), doesn't support generics cleanly, and obscures the return type. Prefer typing the props parameter directly.`,shortAnswer:`Type props with interfaces. Extend native HTML attributes for wrapper components. Use discriminated unions for mutually exclusive configs and generics for type-safe data components. Avoid React.FC.`,code:`// Extending native HTML attributes
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function TextField({ label, error, ...inputProps }: TextFieldProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Discriminated union
type LinkOrButton =
  | { as?: "button"; onClick: () => void; href?: never }
  | { as: "link"; href: string; onClick?: never };

type ActionProps = LinkOrButton & { children: React.ReactNode };

function Action(props: ActionProps) {
  if (props.as === "link") return <a href={props.href}>{props.children}</a>;
  return <button onClick={props.onClick}>{props.children}</button>;
}

// Generic component
interface SelectProps<T> {
  items: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getKey: (item: T) => string;
}

function Select<T>({ items, value, onChange, getLabel, getKey }: SelectProps<T>) {
  return (
    <select
      value={getKey(value)}
      onChange={e => {
        const item = items.find(i => getKey(i) === e.target.value);
        if (item) onChange(item);
      }}
    >
      {items.map(item => (
        <option key={getKey(item)} value={getKey(item)}>{getLabel(item)}</option>
      ))}
    </select>
  );
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-props`,tags:[`typescript`,`generics`,`discriminated unions`,`type safety`],commonMistakes:[`Using any for props.`,`Not extending native HTML attributes for wrapper components.`,`Using React.FC which doesn't support generics cleanly.`],followUps:[`How do you type the ref prop with forwardRef?`,`What are Omit, Pick, and Partial useful for in props?`],interviewTips:[`Show a real-world generic example.`,`Explain why React.FC is discouraged.`]}]}],h=[{id:`react-styling`,title:`Styling in React: CSS Modules, Tailwind, CSS-in-JS & Zero-Runtime`,description:`Comparison and best practices for styling React applications: CSS Modules, Utility-First Tailwind CSS, CSS-in-JS (Styled Components, Emotion), Inline Styles, and Zero-Runtime Solutions (Vanilla Extract, StyleX).`,category:`React`,difficulty:`Intermediate`,tags:[`react`,`styling`,`css-modules`,`tailwind`,`styled-components`,`css-in-js`,`zero-runtime`],overview:`React applications have diverse styling paradigms. Choosing between scoped CSS Modules, utility-first Tailwind CSS, dynamic runtime CSS-in-JS, or modern zero-runtime CSS engines impacts developer velocity, bundle size, CSS specificity, runtime overhead, and React Server Components (RSC) compatibility.`,concepts:[`Inline styles and style prop limitations (no pseudo-classes, no media queries)`,`CSS Modules: local scoping via hashed class names and :global() escape hatch`,`Utility-First CSS (Tailwind CSS): design tokens, JIT compiler, performance benefits`,`CSS-in-JS (Styled Components, Emotion): dynamic props interpolation, runtime style injection`,`CSS-in-JS limitations in React 18/19 Server Components`,`Zero-Runtime CSS: Vanilla Extract, StyleX, Panda CSS, Pigment CSS`,`Performance and bundle size tradeoffs across approaches`],relatedTopicIds:[`react-components`,`css-selectors`],questions:[{id:`react-styling-1`,question:`Compare CSS Modules, Tailwind CSS, and Styled Components. What are their architectural tradeoffs?`,answer:`1. **CSS Modules**:
- **How it works**: Standard CSS files where class names are hashed at build time (e.g. \`Button_btn__a1b2c\`). Imported as a JS object (\`styles.btn\`).
- **Pros**: Zero runtime overhead, full CSS language support, static extraction, full compatibility with React Server Components (RSC).
- **Cons**: Requires switching between TSX and CSS files, no dynamic JS prop interpolation.

2. **Tailwind CSS**:
- **How it works**: Utility-first atomic CSS classes scanned at build time by a JIT compiler.
- **Pros**: Tiny production CSS bundle (~10-15KB), no naming fatigue, enforces design system consistency, 100% RSC compatible.
- **Cons**: Cluttered JSX markup, steep initial learning curve for class acronyms.

3. **Styled Components / Emotion (Runtime CSS-in-JS)**:
- **How it works**: Uses tagged template literals to inject \`<style>\` tags dynamically at runtime.
- **Pros**: Tight component encapsulation, dynamic styling based on props/state.
- **Cons**: Runtime CPU overhead (parsing & hashing styles on every render), larger JS bundle, incompatible with streaming SSR and React Server Components.`,shortAnswer:`CSS Modules offers zero-runtime static CSS with scoped names; Tailwind provides atomic utilities with minimal bundle size and RSC compatibility; Styled Components offers dynamic prop-driven styling but introduces runtime overhead and SSR/RSC incompatibility.`,code:`/* 1. CSS Modules */
// Button.module.css -> .primary { background: blue; }
import styles from './Button.module.css';
export const Button = () => <button className={styles.primary}>Click</button>;

/* 2. Tailwind CSS */
export const TailwindButton = () => (
  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg">
    Click
  </button>
);

/* 3. Styled Components */
import styled from 'styled-components';
export const StyledButton = styled.button<{ $variant: 'primary' | 'danger' }>\`
  background: \${props => props.$variant === 'danger' ? '#ef4444' : '#4f46e5'};
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
\`;`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-styling`,tags:[`styling`,`css-modules`,`tailwind`,`styled-components`,`css-in-js`],commonMistakes:[`Using runtime CSS-in-JS in React Server Components, which causes hydration and build errors.`,`Using inline styles for interactive elements, missing hover, focus, and media query support.`],followUps:[`Why does React team recommend Zero-Runtime CSS (like Vanilla Extract or StyleX) for modern React apps?`],interviewTips:[`Highlight that runtime CSS-in-JS incurs a performance penalty on frequent re-renders due to style recalculation.`]},{id:`react-styling-2`,question:`Why do runtime CSS-in-JS libraries struggle with React Server Components (RSC) and Streaming SSR?`,answer:"Runtime CSS-in-JS libraries (like Styled Components v5 and Emotion) rely on executing JavaScript in the client or server component rendering phase to parse template strings, generate unique class name hashes, and inject `<style>` tags into the document `<head>`.\n\nIn **React Server Components (RSC)**:\n1. Server Components execute only on the server and send a serialized JSON component tree to the client without shipping their component JS.\n2. In **Streaming SSR**, HTML chunks are flushed to the browser before the full tree is rendered. Injecting styles into the `<head>` after the `<head>` has already streamed to the browser causes flash of unstyled content (FOUC) or invalid HTML insertion.\n3. Zero-runtime solutions (CSS Modules, Tailwind, Vanilla Extract, StyleX) extract all CSS ahead-of-time at build time into static `.css` files, completely avoiding runtime style injection.",shortAnswer:`Runtime CSS-in-JS requires inserting <style> tags at render time, which breaks streaming SSR (where <head> is already flushed) and Server Components (which do not execute client JS). Build-time extracted CSS avoids this completely.`,code:`// Modern Zero-Runtime styling with Vanilla Extract
// styles.css.ts
import { style } from '@vanilla-extract/css';

export const button = style({
  backgroundColor: '#4f46e5',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '6px',
  ':hover': {
    backgroundColor: '#4338ca',
  },
});

// Component.tsx - 100% Zero-Runtime & RSC Compatible
import * as styles from './styles.css';
export function Button() {
  return <button className={styles.button}>Server Component Ready</button>;
}`,language:`tsx`,difficulty:`Senior`,type:`Conceptual`,category:`React`,topicId:`react-styling`,tags:[`rsc`,`ssr`,`zero-runtime`,`streaming`,`css-in-js`],commonMistakes:[`Assuming styled-components works out-of-the-box in Next.js App Router without client component wrappers.`],followUps:[`How does Next.js App Router handle static vs dynamic CSS chunking?`],interviewTips:[`Explaining the incompatibility between streaming HTTP responses and runtime <style> injection shows deep fullstack React knowledge.`]}]}],g=[{id:`react-class-components`,title:`Class Components, Lifecycle Methods & Error Boundaries`,description:`Deep coverage of React class components, the legacy and modern lifecycle phases (Mounting, Updating, Unmounting), and Error Boundaries (getDerivedStateFromError, componentDidCatch).`,category:`React`,difficulty:`Intermediate`,tags:[`react`,`class-components`,`lifecycle`,`error-boundaries`,`componentDidMount`,`componentDidCatch`],overview:`While functional components with Hooks are the modern standard in React, class components remain essential for legacy codebases and Error Boundaries (which currently still require class components). Understanding lifecycle sequencing, legacy vs modern methods, and error boundary containment is vital for senior frontend interviews.`,concepts:["Class component syntax and this binding (`this.state`, `this.setState`)",`Mounting phase: constructor -> static getDerivedStateFromProps -> render -> componentDidMount`,`Updating phase: static getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate`,`Unmounting phase: componentWillUnmount (cleanup)`,`Error Boundaries: static getDerivedStateFromError and componentDidCatch`,`Deprecated lifecycles: componentWillMount, componentWillReceiveProps, componentWillUpdate`,`Mapping class lifecycles to useEffect and useLayoutEffect`],relatedTopicIds:[`react-components`,`react-custom-hooks`],questions:[{id:`react-class-1`,question:`Explain the complete React component lifecycle for class components across Mounting, Updating, and Unmounting phases.`,answer:"React class component lifecycle comprises three phases:\n\n1. **Mounting Phase** (Creating and inserting into DOM):\n- `constructor(props)`: Initializes state and binds event handlers.\n- `static getDerivedStateFromProps(props, state)`: Syncs state with props changes before rendering (rarely needed).\n- `render()`: Pure function returning React elements.\n- `componentDidMount()`: Runs once after insertion into DOM. Ideal for API calls, subscriptions, and DOM measurements.\n\n2. **Updating Phase** (Props/State changes or forceUpdate):\n- `static getDerivedStateFromProps(props, state)`\n- `shouldComponentUpdate(nextProps, nextState)`: Performance gatekeeper returning boolean (PureComponent implements this with shallow compare).\n- `render()`\n- `getSnapshotBeforeUpdate(prevProps, prevState)`: Captures DOM info (e.g. scroll position) before changes are committed.\n- `componentDidUpdate(prevProps, prevState, snapshot)`: Runs after DOM updates are committed.\n\n3. **Unmounting Phase** (Removal from DOM):\n- `componentWillUnmount()`: Cleanup subscriptions, timers, and abort in-flight requests.\n\n4. **Error Handling Phase**:\n- `static getDerivedStateFromError(error)` and `componentDidCatch(error, info)`.",shortAnswer:`Mounting: constructor -> getDerivedStateFromProps -> render -> componentDidMount. Updating: getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate. Unmounting: componentWillUnmount.`,code:`import React, { Component } from 'react';

interface Props { userId: string; }
interface State { user: any; loading: boolean; }

export class UserProfile extends Component<Props, State> {
  private timerId?: number;

  constructor(props: Props) {
    super(props);
    this.state = { user: null, loading: true };
  }

  componentDidMount() {
    this.fetchUser(this.props.userId);
    this.timerId = window.setInterval(() => console.log('Ping'), 30000);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser(this.props.userId);
    }
  }

  componentWillUnmount() {
    if (this.timerId) clearInterval(this.timerId);
  }

  private async fetchUser(id: string) {
    this.setState({ loading: true });
    const res = await fetch(\`/api/users/\${id}\`);
    const user = await res.json();
    this.setState({ user, loading: false });
  }

  render() {
    const { user, loading } = this.state;
    if (loading) return <div>Loading...</div>;
    return <div>Hello, {user?.name}</div>;
  }
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-class-components`,tags:[`class-components`,`lifecycle`,`componentDidMount`,`componentDidUpdate`,`componentWillUnmount`],commonMistakes:[`Calling setState in componentDidUpdate without a conditional check comparing prevProps vs props, triggering an infinite render loop.`,`Forgetting to cleanup event listeners or timers in componentWillUnmount.`],followUps:[`How do getDerivedStateFromProps and getSnapshotBeforeUpdate differ from useEffect?`],interviewTips:[`Trace the execution order of parent vs child componentDidMount (child mounts before parent).`]},{id:`react-class-2`,question:`What are Error Boundaries in React, how are they implemented, and what errors can they NOT catch?`,answer:"**Error Boundaries** are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the whole component tree.\n\nAn Error Boundary is defined by implementing either or both:\n1. `static getDerivedStateFromError(error)`: Updates state to render fallback UI on the next render pass.\n2. `componentDidCatch(error, errorInfo)`: Logs error details, component stack traces, and sends telemetry to monitoring services (e.g. Sentry).\n\n**What Error Boundaries CANNOT Catch:**\n- Event handlers (e.g. errors inside `onClick={() => { ... }}`; use `try/catch` instead).\n- Asynchronous code (e.g. `setTimeout`, `requestAnimationFrame`, or rejected `fetch()` promises).\n- Server-Side Rendering (SSR) errors.\n- Errors thrown in the Error Boundary component itself (rather than in its children).",shortAnswer:`Error Boundaries catch errors in child component rendering, lifecycles, and constructors using static getDerivedStateFromError and componentDidCatch. They CANNOT catch errors in event handlers, async promises/timers, or SSR.`,code:`import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo.componentStack);
    // Send to monitoring service (Sentry, Datadog)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-class-components`,tags:[`error-boundary`,`componentDidCatch`,`getDerivedStateFromError`,`resilience`],commonMistakes:[`Expecting Error Boundaries to catch async errors in fetch() or setTimeout (must use try/catch or react-error-boundary useErrorBoundary hook).`,`Attempting to write an Error Boundary as a functional component (Hooks do not currently support getDerivedStateFromError).`],followUps:[`How does react-error-boundary library allow resetting error state?`],interviewTips:[`Mention the 4 exclusions (event handlers, async, SSR, self-errors) — this is a classic interview gotcha.`]}]}],_=[{id:`react-vdom-reconciliation`,title:`Virtual DOM, Reconciliation, Fiber Architecture & Synthetic Events`,description:`Deep dive into the React Virtual DOM, diffing heuristics, the Fiber architecture (work loop, time slicing, priority lanes), and SyntheticEvent delegation.`,category:`React`,difficulty:`Advanced`,tags:[`react`,`virtual-dom`,`reconciliation`,`fiber`,`synthetic-events`,`concurrent-mode`],overview:`React achieves high performance and predictable UI updates through its Virtual DOM abstraction and the Fiber reconciliation engine. Fiber replaced the synchronous stack reconciler with an asynchronous, priority-based cooperative work loop that enables Concurrent React, Transitions, and Suspense.`,concepts:[`Virtual DOM: lightweight in-memory tree representation of real DOM`,`The Reconciliation diffing heuristics ($O(N)$ algorithm vs theoretical $O(N^3)$): element type matching and key identity`,`Why array indexes as keys cause state corruption during reordering/deletions`,`The Fiber Reconciler: units of work, double buffering (current vs workInProgress), fibers linked list tree (child, sibling, return)`,`Render Phase (interruptible, asynchronous) vs Commit Phase (synchronous DOM mutations)`,`Fiber Priority Lanes and Concurrent Features (useTransition, useDeferredValue)`,`SyntheticEvent system: cross-browser normalization, event delegation at root container (React 17+ vs document level in React 16)`],relatedTopicIds:[`react-intro`,`react-components`],questions:[{id:`react-vdom-1`,question:`How does React's Reconciliation diffing algorithm work, and what are its two core heuristics?`,answer:"A general algorithm for finding the minimal edits between two trees has a theoretical complexity of $O(N^3)$. React implements an $O(N)$ heuristic diffing algorithm based on two key assumptions:\n\n1. **Two elements of different types will produce different trees**:\n   - If the element tag changes (e.g. `<div>` becomes `<span>`, or `<Header>` becomes `<Footer>`), React does not attempt to diff children. It completely tears down and unmounts the old tree and mounts the new tree from scratch.\n   - If the element type is the same, React preserves the DOM node and only updates the modified attributes/props.\n\n2. **The developer can hint which child elements are stable across renders using the `key` prop**:\n   - When diffing children lists, React uses keys to match children in the original tree with children in the new tree.\n   - With keys, inserting an item at the beginning of a list is an $O(1)$ reordering operation rather than tearing down and mutating every child in the list.",shortAnswer:"React uses an O(N) heuristic diffing algorithm based on 2 rules: (1) Different element types produce completely different trees (unmounts old, mounts new); (2) Elements with unique `key` props are preserved and reordered efficiently across renders.",code:`// Key issue demonstration:
// ❌ Bad: Index as key causes state bleed on deletion
{items.map((item, index) => (
  <TodoItem key={index} text={item.text} />
))}

// ✅ Good: Stable unique ID preserves local state and DOM integrity
{items.map((item) => (
  <TodoItem key={item.id} text={item.text} />
))}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-vdom-reconciliation`,tags:[`reconciliation`,`diffing`,`virtual-dom`,`keys`,`algorithm`],commonMistakes:[`Using Math.random() as a key, forcing React to destroy and re-create the DOM node on every single render.`,`Using array index as key when items can be filtered, sorted, inserted, or removed.`],followUps:[`Why does an index as key cause input fields or state to retain old values when an item is deleted?`],interviewTips:[`Mention the $O(N^3)$ theoretical tree diff vs React's $O(N)$ heuristic constraint.`]},{id:`react-vdom-2`,question:`What is the React Fiber architecture and how does it enable Concurrent React features (like useTransition)?`,answer:"Before React 16, React used a synchronous **Stack Reconciler**. Once rendering started, it could not be paused or interrupted until the entire component tree finished rendering, causing frame drops and unresponsive user input on large trees.\n\n**React Fiber** is a complete rewrite of the reconciliation engine based on a custom call stack:\n1. **Fiber as a Unit of Work**: Each React element is represented by a `Fiber` node containing pointers: `child` (first child), `sibling` (next sibling), and `return` (parent). This forms a singly linked list tree that can be traversed iteratively without recursion.\n2. **Double Buffering**: Fiber maintains two trees in memory: the `current` tree (visible on screen) and the `workInProgress` tree (being computed off-screen). Once work finishes, React swaps pointers in a single commit.\n3. **Render Phase (Interruptible)**: Work is scheduled via a work loop. React can pause rendering if a high-priority user interaction arrives (like typing), yield back to the browser to paint a frame, and resume background rendering.\n4. **Commit Phase (Synchronous)**: Once the entire tree is prepared, React performs all real DOM mutations synchronously so users never see an incomplete or flickering UI.",shortAnswer:`Fiber turns rendering into an asynchronous, interruptible linked-list work loop. It enables Concurrent React by allowing low-priority renders (transitions) to be paused for high-priority user inputs (typing), utilizing double-buffered current and workInProgress trees.`,code:`import React, { useState, useTransition } from 'react';

export function SearchFilter({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // 1. High priority: update input text immediately
    setQuery(e.target.value);

    // 2. Low priority (Transition): defer heavy list re-render so typing stays smooth
    startTransition(() => {
      setFilterQuery(e.target.value);
    });
  }

  const filtered = items.filter(i => i.toLowerCase().includes(filterQuery.toLowerCase()));

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Type rapidly..." />
      {isPending && <span>Filtering in background...</span>}
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,language:`tsx`,difficulty:`Senior`,type:`Conceptual`,category:`React`,topicId:`react-vdom-reconciliation`,tags:[`fiber`,`concurrent-mode`,`useTransition`,`work-loop`,`reconciler`],commonMistakes:[`Confusing the interruptible Render phase with the synchronous Commit phase.`,`Thinking useTransition debounces; useTransition executes immediately in the background with lower priority scheduling rather than a timer delay.`],followUps:[`How does React 17+ SyntheticEvent delegation at the root container differ from React 16 delegation at document level?`],interviewTips:[`Explaining the child-sibling-return linked list data structure shows extraordinary depth.`]},{id:`react-vdom-3`,question:`How do React Synthetic Events work, and what changed in event delegation in React 17?`,answer:"**SyntheticEvent** is React's cross-browser wrapper around the native browser event. It normalizes event properties and behaviors across different browsers and implements unified event pooling (prior to React 17) and delegation.\n\n**Event Delegation Mechanism:**\n- React does not attach event listeners to individual DOM nodes (e.g. `<button onClick={...}>`).\n- Instead, React attaches a single event listener per event type at a top-level container and uses event bubbling to catch events and dispatch them to the corresponding React component tree.\n\n**What Changed in React 17:**\n- In React 16 and earlier, all synthetic events were attached to the **`document`** object (`document.addEventListener`). This caused issues when nesting multiple React root applications or micro-frontends on the same page, as `e.stopPropagation()` in a nested app wouldn't stop events from bubbling to the outer document.\n- In **React 17+**, event listeners are attached directly to the **root DOM container** (`rootNode` where `createRoot(rootNode)` is called).",shortAnswer:`SyntheticEvent normalizes cross-browser events. In React 17+, event delegation attaches to the root DOM container (root node) rather than the global document, fixing micro-frontend event propagation collisions.`,code:`// React 17+ delegates to root container, not document
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

// e.nativeEvent gives access to the underlying browser event
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log('React Synthetic Event:', e.type);
  console.log('Native Browser Event:', e.nativeEvent);
  e.stopPropagation(); // Stops propagation in React tree AND at root container level
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-vdom-reconciliation`,tags:[`synthetic-events`,`event-delegation`,`react-17`,`native-events`],commonMistakes:[`Thinking stopPropagation on nativeEvent stops React event handlers (React dispatches synthetic events at root).`],followUps:[`How do Synthetic Events interact with third-party vanilla JS event listeners?`],interviewTips:[`Mention the React 17 change from document delegation to root container delegation for micro-frontends.`]}]}],v=[{id:`react-custom-hooks-rules`,title:`Custom Hooks, Rules of Hooks, Stale Closures & Advanced Hook Patterns`,description:`In-depth mastery of React Hooks: Rules of Hooks, Custom Hook encapsulation, useReducer, useContext, useRef, useMemo, useCallback, and resolving stale closure and dependency array bugs.`,category:`React`,difficulty:`Intermediate`,tags:[`react`,`hooks`,`custom-hooks`,`useReducer`,`stale-closures`,`useCallback`,`useMemo`,`useRef`],overview:`Hooks are functions that let you use state and lifecycle features from functional components. Building robust custom hooks requires understanding the Rules of Hooks (call order linked list), the mental model of closures across renders, avoiding stale closures in async callbacks/timers, and knowing when to reach for useReducer vs useState.`,concepts:[`The Two Rules of Hooks: Only call at top level; Only call from React functions`,`How React stores hooks internally: singly-linked list of hook cells on the current Fiber`,`Custom Hooks: composing built-in hooks for reusable stateful logic`,`The Stale Closure problem: why timers and async callbacks see outdated state and how to fix with useRef or functional updates`,`useReducer: managing complex multi-branch state and action dispatching`,`useRef vs useState: mutable values that do not trigger re-render vs reactive state`,`useMemo and useCallback: reference stability and dependency array equality`,`useLayoutEffect vs useEffect: synchronous pre-paint DOM measurement vs asynchronous post-paint`],relatedTopicIds:[`react-components`,`react-optimization`],questions:[{id:`react-hooks-1`,question:`Why must Hooks only be called at the top level of a component (never inside loops, conditions, or nested functions)?`,answer:`React does not identify hooks by name or unique string identifiers. Instead, React tracks hooks using an internal **singly-linked list of Hook nodes on the Fiber instance** (\`fiber.memoizedState\`).

On the initial render, React creates hook objects in sequence: Hook 1 -> Hook 2 -> Hook 3.
On every subsequent re-render, React traverses this linked list in the **exact same call order**, matching the current hook call with the corresponding node in the list.

If a hook is placed inside an \`if\` statement or loop:
- When the condition changes, the order of hook calls shifts.
- Hook 2 might accidentally read the state of Hook 3, causing state corruption, type errors, or crashes.
- React's ESLint plugin (\`eslint-plugin-react-hooks\`) statically enforces this rule.`,shortAnswer:`React tracks hooks as an ordered singly-linked list on the Fiber. Calling hooks conditionally disrupts the execution sequence, causing hooks to read state belonging to a different hook.`,code:`// ❌ Broken: Conditional hook disrupts hook order on re-render
function BadComponent({ isSpecial }: { isSpecial: boolean }) {
  if (isSpecial) {
    useEffect(() => {}, []); // Hook order mismatch!
  }
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// ✅ Correct: Condition inside the hook, hook at top level
function GoodComponent({ isSpecial }: { isSpecial: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isSpecial) return;
    // conditional logic safely inside effect
  }, [isSpecial]);

  return <div>{count}</div>;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-custom-hooks-rules`,tags:[`rules-of-hooks`,`fiber`,`call-order`,`hooks-internal`],commonMistakes:[`Calling hooks inside helper functions called from JSX render.`,`Early returning before all hooks are declared.`],followUps:[`How does React 19 useActionState or use() hook relax some conditional constraints for Promises/Context?`],interviewTips:["Mention the `fiber.memoizedState` linked list to explain the exact internal reason."]},{id:`react-hooks-2`,question:`What is the "Stale Closure" problem in React Hooks, and what are the three ways to fix it?`,answer:"A **Stale Closure** occurs when a function (such as a `useEffect` callback, event listener, `setTimeout`, or `setInterval`) captures variables from an earlier render pass in its lexical scope and continues referencing those outdated values over time because the function was not re-created.\n\n**Classic Example**:\nAn interval created in `useEffect(() => { setInterval(() => setCount(count + 1), 1000) }, [])` captures `count = 0` forever, repeatedly setting `0 + 1 = 1` on every tick.\n\n**Three Ways to Fix Stale Closures:**\n1. **Functional State Updates**: Pass an updater callback `setCount(prev => prev + 1)` which receives the latest state directly from React.\n2. **`useRef` Bridge**: Store the value (or callback) in a mutable ref (`countRef.current`), which maintains reference stability while allowing real-time mutation.\n3. **Include all dependencies in the dependency array**: Ensure all captured values are in the `useEffect`/`useCallback` dependencies list so the closure is refreshed on changes.",shortAnswer:"Stale Closures happen when async callbacks or timers capture old state from past renders. Fixed by: (1) functional state updates (`setVal(prev => ...)`), (2) `useRef` mutable container, or (3) proper dependency array inclusion.",code:`import React, { useState, useEffect, useRef } from 'react';

export function Timer() {
  const [count, setCount] = useState(0);

  // ✅ Fix 1: Functional update (Best for simple state)
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1); // Always reads latest state
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ✅ Fix 2: useRef bridge (Best for latest callbacks/complex objects)
  const countRef = useRef(count);
  countRef.current = count;

  useEffect(() => {
    const id = setInterval(() => {
      console.log('Current count via ref:', countRef.current);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return <div>Count: {count}</div>;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-custom-hooks-rules`,tags:[`stale-closures`,`closures`,`useEffect`,`useRef`,`functional-updates`],commonMistakes:[`Omitting dependencies from useEffect arrays to avoid re-running the effect, creating silent stale closure bugs.`,`Relying on state values directly inside setTimeout callbacks without functional updates.`],followUps:[`How does the useEvent (or useEffectEvent) experimental hook solve the closure problem for callbacks?`],interviewTips:["Clearly demonstrate the functional update `setX(prev => ...)` pattern as the first line of defense."]},{id:`react-hooks-3`,question:`How do you design and structure production-grade Custom Hooks in React? Build a useDebounce and useLocalStorage custom hook.`,answer:"A custom hook is a JavaScript function whose name begins with `use` that calls other React hooks. Key design principles:\n1. **Single Responsibility**: Focus on one specific stateful concern (e.g. storage, media query, debouncing, network).\n2. **Type Safety**: Provide strict TypeScript interfaces for inputs, returns (tuples `[val, setVal] as const` or objects).\n3. **Return Stability**: Memoize callbacks and complex return objects with `useCallback`/`useMemo` so consumers don't suffer unnecessary re-renders.",shortAnswer:"Custom Hooks encapsulate reusable stateful logic into functions starting with `use`. They should provide strong TypeScript typing, memoized callback returns, and handle cleanup in useEffect.",code:`import { useState, useEffect, useCallback } from 'react';

// Custom Hook 1: useDebounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Custom Hook 2: useLocalStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-custom-hooks-rules`,tags:[`custom-hooks`,`useDebounce`,`useLocalStorage`,`typescript`],commonMistakes:["Forgetting `as const` on tuple returns, causing TypeScript to infer `(T | Function)[]` union instead of a tuple.",`Not wrapping localStorage access in try/catch (fails in Private Browsing mode or SSR environments).`],followUps:[`How do you synchronize useLocalStorage across multiple browser tabs using the window "storage" event?`],interviewTips:[`Add the window "storage" event listener to useLocalStorage to impress interviewers.`]}]}],y=[{id:`react-routing`,title:`Client-Side Routing & React Router v6 / v7 Architecture`,description:`Master client-side SPA routing: history API, React Router v6/v7 data routers (createBrowserRouter, loaders, actions), nested routes with <Outlet />, lazy route splitting, and route protection.`,category:`React`,difficulty:`Intermediate`,tags:[`react`,`routing`,`react-router`,`spa`,`nested-routes`,`loaders`,`actions`],overview:`Single Page Applications (SPAs) intercept browser navigation using the HTML5 History API (pushState/replaceState) to render views dynamically without full page reloads. Modern React Router (v6.4+ and v7) integrates data fetching (loaders) and mutation pipelines (actions) directly into the route tree.`,concepts:["How Client-Side Routing works: HTML5 History API (`history.pushState`, `popstate` event)","React Router Declarative vs Data Router (`createBrowserRouter`, `RouterProvider`)","Nested Routing and layout composition using `<Outlet />`",`Data Loaders and Form Actions: co-locating data requirements with routes`,"Error handling in routes using `errorElement` and `useRouteError`","Dynamic route parameters (`useParams`) and query search params (`useSearchParams`)",`Protected routes and authentication redirect flows`,"Code splitting and lazy loading route modules via `lazy` / `React.lazy` + `Suspense`"],relatedTopicIds:[`react-components`,`react-advanced`],questions:[{id:`react-routing-1`,question:`How does client-side routing work under the hood using the HTML5 History API, and how do React Router nested routes with <Outlet /> work?`,answer:"**How Client-Side Routing Works:**\n1. In a traditional MPA, clicking `<a href=\"/about\">` triggers a full browser HTTP GET request and page refresh.\n2. In a client-side SPA, clicking a `<Link to=\"/about\">` prevents the default browser navigation (`e.preventDefault()`).\n3. It calls `window.history.pushState({}, '', '/about')`, which updates the browser URL bar and session history stack **without triggering a network page reload**.\n4. React Router listens to the browser `popstate` event (fired on Back/Forward button navigation) and internal state transitions, re-rendering the component tree matching the new path.\n\n**Nested Routing & `<Outlet />`:**\nNested routes allow parent layout components (e.g. `<DashboardLayout>`) to stay mounted while only the inner child content switches as the sub-path changes. The parent layout renders `<Outlet />`, which acts as a dynamic placeholder where matching child route elements are mounted.",shortAnswer:"Client-side routing uses `history.pushState` and `popstate` to update URLs without reloading. Nested routes keep parent layouts mounted and swap child views inside `<Outlet />`.",code:`import { createBrowserRouter, RouterProvider, Outlet, Link, useLoaderData } from 'react-router-dom';

// 1. Parent Layout with Navigation and Outlet
function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <nav>
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <main>
        {/* Child route renders here */}
        <Outlet />
      </main>
    </div>
  );
}

// 2. Data Router Configuration
export const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div>Dashboard Overview</div> },
      {
        path: 'analytics',
        loader: async () => fetch('/api/analytics').then(r => r.json()),
        element: <AnalyticsPage />,
      },
    ],
  },
]);`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-routing`,tags:[`react-router`,`history-api`,`outlet`,`nested-routes`,`spa`],commonMistakes:["Forgetting to configure web server fallback (e.g. Nginx `try_files $uri /index.html;`) causing 404s when refreshing deep routes.","Using standard `<a href>` instead of React Router `<Link>` or `<NavLink>`, triggering unintended full page reloads."],followUps:[`Why is Nginx try_files $uri /index.html required when deploying SPAs to production?`],interviewTips:[`Mention web server fallback configuration to show real-world production deployment experience.`]},{id:`react-routing-2`,question:`What are React Router Loaders and Actions, and how do they eliminate "fetch-on-render" waterfalls?`,answer:"Before data routers, React apps suffered from **fetch-on-render waterfalls**:\n1. App mounts -> downloads JS -> renders `<Parent>` -> Parent fires `useEffect` to fetch data -> Parent finishes -> renders `<Child>` -> Child fires `useEffect` -> ... (cascading network delays).\n\n**React Router Loaders (Fetch-then-Render)**:\n- Routes define a `loader: async () => { ... }` function.\n- When a URL transition begins, React Router immediately initiates data fetching for **all matching nested route loaders in parallel** before rendering starts.\n- Components access data synchronously using `const data = useLoaderData()` without managing loading state spinners in `useEffect`.\n\n**React Router Actions (Mutations & Revalidation)**:\n- Forms post to route `action` functions.\n- Upon completion, React Router automatically re-validates and re-fetches all active route loaders, keeping UI state synchronized without manual cache invalidation code.",shortAnswer:`Loaders fetch data in parallel before rendering starts, eliminating sequential fetch-on-render waterfalls. Actions handle form submissions and automatically revalidate active loaders.`,code:`import { useLoaderData, Form } from 'react-router-dom';

// Route Loader
export async function projectLoader({ params }: { params: any }) {
  const res = await fetch(\`/api/projects/\${params.id}\`);
  if (!res.ok) throw new Response('Not Found', { status: 404 });
  return res.json();
}

// Route Action
export async function projectAction({ request, params }: { request: Request, params: any }) {
  const formData = await request.formData();
  await fetch(\`/api/projects/\${params.id}\`, {
    method: 'PATCH',
    body: formData,
  });
  return { ok: true };
}

// Component
export function ProjectDetail() {
  const project = useLoaderData() as any;
  return (
    <div>
      <h1>{project.name}</h1>
      <Form method="post">
        <input name="title" defaultValue={project.name} />
        <button type="submit">Update</button>
      </Form>
    </div>
  );
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-routing`,tags:[`loaders`,`actions`,`data-fetching`,`waterfalls`,`react-router`],commonMistakes:[`Mixing useEffect data fetching with route loaders, losing parallel prefetching benefits.`],followUps:[`How does Remix / React Router v7 leverage loaders and actions for SSR?`],interviewTips:[`Contrast "Fetch-on-Render" (useEffect waterfall) with "Render-as-You-Fetch" (Loaders / Suspense).`]}]}],b=[{id:`react-advanced-patterns`,title:`Rendering Strategies (SSR, CSR, SSG, ISR), Hydration, RSC & Suspense`,description:`Deep architectural coverage of rendering paradigms (CSR, SSR, SSG, ISR), Hydration and Selective Hydration, React Server Components (RSC), Suspense streaming, and Context API vs Flux architecture.`,category:`React`,difficulty:`Senior`,tags:[`react`,`ssr`,`rsc`,`hydration`,`suspense`,`ssg`,`isr`,`context-api`,`flux`],overview:`Modern web application architecture extends far beyond client-side rendering. Understanding how server rendering, static generation, incremental regeneration, progressive hydration, React Server Components (RSC), and Suspense streaming work under the hood enables engineers to architect ultra-fast, SEO-optimized, resilient applications.`,concepts:[`Rendering Paradigms: CSR vs SSR vs SSG vs ISR vs Edge Rendering`,`The Hydration process: turning static server HTML into an interactive React DOM tree`,`Hydration mismatch errors: server/client divergence (dates, random IDs, browser APIs) and how to resolve them`,"React 18/19 Selective Hydration & Streaming SSR with `<Suspense>`",`React Server Components (RSC): zero-bundle-size server execution vs Client Components ("use client")`,`The RSC Wire Format / Payload: serialized flight stream`,"Suspense and `React.lazy` for component-level code splitting",`Context API vs Flux/Redux architecture: when to use Context (dependency injection, low-frequency theme/auth) vs Flux (high-frequency, normalized state)`],relatedTopicIds:[`react-intro`,`react-optimization`],questions:[{id:`react-adv-1`,question:`Compare CSR, SSR, SSG, and ISR rendering strategies. When would you choose each for an enterprise frontend architecture?`,answer:`1. **Client-Side Rendering (CSR)**:
- **How it works**: Server serves a blank HTML shell (\`<div id="root"></div>\`). Browser downloads JS bundle and builds the entire DOM on the client.
- **Pros**: Fast subsequent page transitions, rich stateful interactions.
- **Cons**: Slow Initial Page Load (FCP/LCP), poor SEO without pre-rendering.
- **Best for**: Internal SaaS dashboards, authenticated web apps, admin panels.

2. **Server-Side Rendering (SSR)**:
- **How it works**: Server renders the full HTML on every HTTP request and sends ready-to-view HTML to the browser, followed by hydration.
- **Pros**: Excellent SEO, fast FCP/LCP on dynamic content, always up-to-date data.
- **Cons**: Higher server compute costs and higher TTFB (server must fetch data before returning response).
- **Best for**: Dynamic e-commerce pages, social feeds, user profiles.

3. **Static Site Generation (SSG)**:
- **How it works**: HTML is pre-rendered at build time and served statically from global CDNs.
- **Pros**: Blazing fast TTFB, lowest hosting costs, high reliability.
- **Cons**: Build times grow with page count; stale content until next build.
- **Best for**: Marketing landing pages, documentation, blogs.

4. **Incremental Static Regeneration (ISR)**:
- **How it works**: Combines SSG with background revalidation (\`revalidate: 60\`). Serves cached static pages instantly from CDN while asynchronously rebuilding stale pages in the background.
- **Best for**: Large e-commerce catalogs (100,000+ products), news publishers.`,shortAnswer:`CSR builds UI in the browser (SaaS dashboards); SSR renders HTML on every request (dynamic e-commerce); SSG pre-builds static HTML for CDNs (blogs, docs); ISR updates static pages in the background on demand (large catalogs).`,code:`// Next.js Rendering Strategies Comparison

// 1. Static Site Generation (SSG)
export async function getStaticProps() {
  const data = await fetch('https://api.example.com/posts').then(r => r.json());
  return { props: { data } };
}

// 2. Incremental Static Regeneration (ISR)
export async function getStaticPropsWithISR() {
  const data = await fetch('https://api.example.com/posts').then(r => r.json());
  return {
    props: { data },
    revalidate: 60, // Regenerate static page in background at most once every 60s
  };
}

// 3. Server-Side Rendering (SSR)
export async function getServerSideProps(context: any) {
  const data = await fetch(\`https://api.example.com/user/\${context.params.id}\`).then(r => r.json());
  return { props: { data } };
}`,language:`tsx`,difficulty:`Senior`,type:`Conceptual`,category:`React`,topicId:`react-advanced-patterns`,tags:[`ssr`,`ssg`,`isr`,`csr`,`rendering-strategies`],commonMistakes:[`Using SSR for pages that change infrequently, unnecessarily overloading backend servers.`,`Using CSR for public marketing or e-commerce pages that require search engine indexing.`],followUps:[`How does Edge SSR (Cloudflare Workers / Vercel Edge) reduce TTFB compared to traditional Node.js SSR?`],interviewTips:[`Draw a comparative quadrant showing Build Time vs Request Time and Dynamic vs Static content.`]},{id:`react-adv-2`,question:`What is Hydration in React, what causes Hydration Mismatch errors, and how does React 18/19 Selective Hydration work?`,answer:'**What is Hydration?**\nHydration is the process where React takes static HTML generated by the server and attaches event listeners, initializes component state, and connects the Virtual DOM tree to make the page interactive.\n\n**Hydration Mismatch Causes:**\nHappens when server-rendered HTML diverges from client-rendered initial output. Common causes:\n1. Non-deterministic values: `Date.now()`, `new Date().toLocaleTimeString()`, `Math.random()`.\n2. Browser-only globals accessed during render: `window.innerWidth`, `localStorage`, `navigator.userAgent`.\n3. Invalid HTML nesting (e.g. `<p>` containing a `<div>`, or `<tr>` directly under `<table>` without `<tbody>`), where browser HTML parser auto-corrects the DOM before React hydrates.\n\n**React 18/19 Selective Hydration with `<Suspense>`:**\n- In traditional SSR, the entire page had to finish downloading all JS and hydrate all-at-once before any part became interactive ("all-or-nothing").\n- With **Selective Hydration**, wrapping components in `<Suspense>` allows React to hydrate parts of the page independently as their JS chunks arrive.\n- If a user clicks on an unhydrated component wrapped in Suspense, React **prioritizes hydrating that clicked component first** ahead of other background components.',shortAnswer:`Hydration attaches React state and event listeners to server HTML. Mismatches happen when server and client render different values (dates, window objects). Selective Hydration uses Suspense to stream HTML and hydrate interactive parts independently.`,code:`import { Suspense, lazy } from 'react';

const Comments = lazy(() => import('./Comments'));

export function ArticlePage() {
  return (
    <article>
      <h1>Article Title (Hydrates immediately)</h1>
      <p>Article body content...</p>

      {/* Selective Hydration: Streams and hydrates independently */}
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments />
      </Suspense>
    </article>
  );
}`,language:`tsx`,difficulty:`Senior`,type:`Conceptual`,category:`React`,topicId:`react-advanced-patterns`,tags:[`hydration`,`selective-hydration`,`suspense`,`streaming-ssr`],commonMistakes:[`Using typeof window !== "undefined" to render different JSX during initial render, guaranteeing a hydration mismatch.`,`Fixing hydration by disabling SSR entirely instead of using useEffect or suppressHydrationWarning.`],followUps:[`How does suppressHydrationWarning work and when is it acceptable to use?`],interviewTips:[`Highlight that Selective Hydration prioritizes user interaction (clicking an unhydrated button triggers immediate prioritized hydration).`]},{id:`react-adv-3`,question:`Explain React Server Components (RSC). How do Server Components differ from Client Components, and what is the "use client" directive?`,answer:`**React Server Components (RSC)** introduce a dual-environment component model where components can execute exclusively on the server:

1. **Server Components (Default in modern frameworks)**:
- Execute **only on the server** during build time or per request.
- **Zero client bundle size**: Their code, dependencies (e.g. markdown parsers, heavy date libs), and database connectors are NEVER shipped to the browser.
- Can directly access databases, file systems, and internal microservices securely (\`async function Component() { const data = await db.query(); }\`).
- **Restrictions**: Cannot use state (\`useState\`), effects (\`useEffect\`), browser APIs (\`window\`), or event listeners (\`onClick\`).

2. **Client Components (\`"use client"\`)**:
- Opt-in via the \`"use client"\` directive placed at the top of the file.
- Rendered on the server during initial SSR and fully hydrated on the client.
- Can use state, effects, hooks, event listeners, and browser APIs.

3. **The RSC Wire Format**:
Server Components are serialized into a special streamable JSON-like format containing the rendered React tree and component props, which the client reconciles seamlessly with interactive client components.`,shortAnswer:`Server Components run only on the server, ship 0KB JS to the browser, and query databases directly. Client Components ("use client") provide interactivity and hooks. Server and client components compose together in a unified tree.`,code:`// 1. Server Component (ProductPage.tsx) - Default, Zero Bundle Size
import { db } from '@/lib/db';
import { AddToCartButton } from './AddToCartButton'; // Client component

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Direct database query on server! No API route needed
  const product = await db.product.findUnique({ where: { id: params.id } });

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* Composing Client Component inside Server Component */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// 2. Client Component (AddToCartButton.tsx)
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        // client interaction
      }}
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}`,language:`tsx`,difficulty:`Senior`,type:`Conceptual`,category:`React`,topicId:`react-advanced-patterns`,tags:[`rsc`,`server-components`,`use-client`,`nextjs`,`architecture`],commonMistakes:[`Thinking "use client" marks a component to render ONLY on the client (Client Components still pre-render on the server during initial SSR).`,`Passing non-serializable props (like functions or class instances) from a Server Component to a Client Component.`],followUps:[`How do Server Actions ("use server") allow client components to invoke server functions with type safety?`],interviewTips:[`Clarify that "use client" is a boundary marker defining the entry point to the client JavaScript bundle, not a client-only rendering directive.`]}]}],x=[{id:`react-optimization`,title:`React Performance Optimization, Memoization & Virtualization`,description:`Mastering React performance: avoiding unnecessary re-renders, React.memo, useMemo, useCallback, list virtualization (@tanstack/react-virtual), bundle splitting with React.lazy, and React DevTools Profiler.`,category:`React`,difficulty:`Advanced`,tags:[`react`,`performance`,`optimization`,`react-memo`,`useMemo`,`useCallback`,`virtualization`,`profiler`],overview:`React is fast by default, but complex applications with high-frequency updates, large lists, or deep component trees can suffer from redundant rendering cycles, heavy JavaScript execution, and large bundle payloads. Optimizing React involves eliminating wasted renders, stabilizing references, virtualizing large datasets, and code splitting.`,concepts:[`Why React re-renders: State changes, Prop changes, Parent re-renders, Context value updates`,`The cost of re-rendering: Virtual DOM execution vs DOM mutations`,"`React.memo`: shallow comparison of props and custom arePropsEqual comparators","`useMemo` and `useCallback`: reference stability for objects/functions passed to memoized children",`When NOT to use useMemo / useCallback (overhead vs benefit)`,`List Virtualization / Windowing: rendering only visible items in the viewport (TanStack Virtual, react-window)`,"Code splitting and dynamic imports with `React.lazy` and `<Suspense>`",`React Profiler API and DevTools flamegraphs to identify render bottlenecks`],relatedTopicIds:[`react-components`,`react-custom-hooks`,`react-vdom-reconciliation`],questions:[{id:`react-perf-1`,question:`When does a React component re-render, and how do React.memo, useMemo, and useCallback work together to prevent wasted re-renders?`,answer:"**Why Components Re-render:**\nBy default in React, **when a parent component re-renders, ALL of its child components re-render recursively**, regardless of whether their props have changed.\n\n**How the Memoization Trio Works Together:**\n1. **`React.memo(Component)`**: Wraps a component to prevent re-rendering if its props have not changed (performs shallow equality comparison `prevProps === nextProps`).\n2. **`useCallback(fn, deps)`**: Returns a memoized reference to a function instance. If you pass an inline arrow function `onClick={() => ...}` to a `React.memo` child, the child will re-render anyway because a new function reference is created on every parent render. `useCallback` preserves the same function reference across renders.\n3. **`useMemo(() => compute(a, b), [a, b])`**: Caches the result of an expensive calculation and preserves object reference stability (`style={{ ... }}`, `config={{ ... }}`) passed to `React.memo` children.\n\n**Crucial Rule**: `useCallback` and `useMemo` on their own do NOT stop child components from re-rendering unless the child component is wrapped in `React.memo` or used in a dependency array.",shortAnswer:"Parents re-render children by default. `React.memo` skips child renders if props haven't changed; `useCallback` and `useMemo` preserve reference stability for callbacks and objects so `React.memo`'s shallow comparison succeeds.",code:`import React, { useState, useCallback, useMemo } from 'react';

interface ItemProps {
  item: { id: string; name: string };
  onSelect: (id: string) => void;
}

// 1. Child is wrapped in React.memo (performs shallow prop comparison)
const ListItem = React.memo(function ListItem({ item, onSelect }: ItemProps) {
  console.log('Rendering ListItem:', item.name);
  return (
    <li onClick={() => onSelect(item.id)}>
      {item.name}
    </li>
  );
});

export function ItemList({ items }: { items: { id: string; name: string }[] }) {
  const [count, setCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 2. useCallback ensures onSelect function reference stays stable
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Counter: {count}</button>
      <ul>
        {items.map(item => (
          <ListItem key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </ul>
    </div>
  );
}`,language:`tsx`,difficulty:`Intermediate`,type:`Conceptual`,category:`React`,topicId:`react-optimization`,tags:[`react-memo`,`useMemo`,`useCallback`,`re-renders`,`memoization`],commonMistakes:[`Wrapping callbacks in useCallback without wrapping the child component in React.memo (wasting memory without preventing re-renders).`,`Prematurely wrapping trivial computations in useMemo where the hook overhead exceeds the computation cost.`],followUps:[`How does React Compiler (React Forget) automate memoization at build time?`],interviewTips:["Emphasize that `React.memo` requires stable prop references (via useCallback/useMemo) to function effectively."]},{id:`react-perf-2`,question:`What is DOM Virtualization (Windowing) and how does it allow rendering lists with 100,000+ items smoothly at 60 FPS?`,answer:`**The Problem with Large Lists**:
Rendering 10,000+ DOM nodes creates significant memory pressure, long layout/paint times, and slow scrolling because the browser has to track and paint thousands of off-screen DOM elements.

**How Virtualization Works**:
Virtualization (windowing) renders **only the small subset of items currently visible within the scrollable viewport container** (plus a small overscan buffer above and below).

**Core Mechanics**:
1. A scrollable viewport container with \`overflow-y: auto\` and a fixed height (e.g. 500px).
2. An inner container whose height is set to \`totalItems * itemHeight\` (e.g. 100,000 * 50px = 5,000,000px), giving the browser a realistic scrollbar.
3. The virtualizer calculates \`startIndex = Math.floor(scrollTop / itemHeight)\` and \`endIndex = Math.min(total, startIndex + visibleCount + overscan)\`.
4. Only the 15-20 visible items are rendered into the DOM, positioned absolutely using \`transform: translateY(index * itemHeight)\`. As the user scrolls, items leaving the top are removed from the DOM and new items entering the bottom are inserted, keeping DOM node count constant at ~20 nodes.`,shortAnswer:`Virtualization only renders items currently visible inside the viewport window (~20 DOM nodes) while simulating the full scroll height. This keeps memory constant and scrolling silky smooth regardless of list length.`,code:`import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualizedList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // 40px estimated row height
    overscan: 5,           // render 5 extra items above/below viewport
  });

  return (
    <div
      ref={parentRef}
      style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc' }}
    >
      <div
        style={{
          height: \`\${rowVirtualizer.getTotalSize()}px\`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: \`\${virtualItem.size}px\`,
              transform: \`translateY(\${virtualItem.start}px)\`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`,language:`tsx`,difficulty:`Senior`,type:`Conceptual`,category:`React`,topicId:`react-optimization`,tags:[`virtualization`,`windowing`,`tanstack-virtual`,`scroll-performance`,`dom-optimization`],commonMistakes:[`Using top instead of transform: translateY() to position virtual rows (triggers layout reflows on scroll).`,`Not handling dynamic variable row heights with element measurement observers.`],followUps:[`How do you handle variable-height items in virtualized lists using ResizeObserver?`],interviewTips:[`Explain the math: Total height spacer + translateY offset for visible slice.`]}]}],S=[...p,...m,...h,...g,..._,...v,...y,...b,...x],C=[{id:`ts-fundamentals-1`,title:`TypeScript Fundamentals`,description:`Core TypeScript concepts including primitive and complex data types, type annotations, interfaces, type aliases, enums, tuples, type inference, and the critical differences between any and unknown.`,category:`TypeScript`,difficulty:`Beginner`,tags:[`typescript`,`types`,`interfaces`,`enums`,`tuples`,`type aliases`,`type inference`,`any`,`unknown`,`literal types`,`functions`],overview:`TypeScript extends JavaScript by adding a static type system that catches errors at compile time rather than at runtime. Understanding the fundamental building blocks — primitive types, object shapes via interfaces and type aliases, enums for named constants, tuples for fixed-length arrays, and the nuances of type inference — is essential for writing robust TypeScript code. This topic establishes the foundation upon which advanced patterns like generics, conditional types, and mapped types are built.`,concepts:[`Primitive types: string, number, boolean, null, undefined, symbol, bigint`,`Arrays and object type annotations`,`Function parameter and return type annotations`,`Interfaces for object shapes`,`Type aliases with the type keyword`,`Enums: numeric, string, and const enums`,`Tuples: fixed-length typed arrays`,`Type inference and contextual typing`,`Literal types: string, number, and boolean literals`,`any vs unknown: safety trade-offs`,`Type assertions with as and angle-bracket syntax`,`void and never return types`],codeExamples:[{title:`Basic Type Annotations`,code:`// Primitive types
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// Array types
let scores: number[] = [95, 87, 92];
let names: Array<string> = ["Alice", "Bob"];

// Object type annotation
let user: { name: string; age: number; email?: string } = {
  name: "Alice",
  age: 30,
};

// Function with typed parameters and return type
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}!\`;
}`,language:`typescript`,explanation:`TypeScript annotations follow a colon syntax. Optional properties and parameters use the ? modifier.`},{title:`Interfaces vs Type Aliases`,code:`// Interface — extendable, declaration-mergeable
interface User {
  id: number;
  name: string;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

// Type alias — can represent unions, intersections, primitives
type ID = string | number;

type UserWithRole = User & { role: "admin" | "editor" | "viewer" };

// Declaration merging (only interfaces)
interface User {
  avatar?: string; // merges into the original User interface
}`,language:`typescript`,explanation:`Interfaces excel at describing object shapes and support declaration merging. Type aliases are more flexible and can represent any type expression.`},{title:`Enums and Tuples`,code:`// Numeric enum (auto-incremented from 0)
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

// String enum
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

// Const enum — inlined at compile time, no runtime object
const enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Tuple — fixed-length, per-position types
type Coordinate = [x: number, y: number];
type HttpResponse = [status: number, body: string, headers?: Record<string, string>];

const point: Coordinate = [10, 20];
const response: HttpResponse = [200, '{"ok":true}'];`,language:`typescript`,explanation:`Enums provide named constants. Const enums are erased at compile time for zero runtime cost. Tuples enforce both length and per-index types.`}],relatedTopicIds:[`ts-advanced-1`,`ts-type-safety-1`,`ts-react-1`],questions:[{id:`ts-fundamentals-1`,question:`What are the basic data types in TypeScript and how do they differ from JavaScript?`,answer:`TypeScript provides static type annotations on top of all JavaScript runtime types, and adds several type-system-only constructs that do not exist at runtime. The primitive types mirror JavaScript: string, number, boolean, null, undefined, symbol, and bigint. TypeScript also has array types written as T[] or Array<T>, object types described by inline annotations or interfaces, and the special types void, never, any, and unknown.

The key difference from JavaScript is that TypeScript enforces these types at compile time. In JavaScript, a variable can be reassigned from a string to a number without complaint, but TypeScript will flag this as an error when the variable has been annotated or inferred as a specific type. This prevents entire categories of bugs — calling string methods on a number, passing the wrong argument to a function, or accessing properties that do not exist on an object.

TypeScript introduces additional type constructs not present in JavaScript. Enums create named constant sets, tuples describe fixed-length arrays with per-position types, literal types restrict a value to an exact string or number, and type aliases allow you to name complex types for reuse. Interfaces describe object shapes and support declaration merging and extension via the extends keyword.

Another critical distinction is the any and unknown types. any opts out of type checking entirely and allows any operation — it is essentially an escape hatch. unknown is the type-safe counterpart: a value of type unknown cannot be used in any way until you narrow it with a type guard or assertion. Modern TypeScript codebases prefer unknown over any because it forces explicit type checking before use, maintaining the safety guarantees that make TypeScript valuable.`,shortAnswer:`TypeScript has all JavaScript types (string, number, boolean, null, undefined, symbol, bigint) plus static-only constructs like enums, tuples, literal types, any, unknown, void, and never that are enforced at compile time.`,code:`// Primitives
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let sym: Symbol = Symbol("id");
let big: bigint = 100n;

// Arrays and tuples
let arr: number[] = [1, 2, 3];
let tuple: [string, number] = ["age", 30];

// void and never
function log(msg: string): void { console.log(msg); }
function fail(msg: string): never { throw new Error(msg); }

// any vs unknown
let loose: any = "hello";
loose.nonExistentMethod(); // no error — dangerous

let safe: unknown = "hello";
// safe.toUpperCase(); // Error — must narrow first
if (typeof safe === "string") {
  safe.toUpperCase(); // OK after narrowing
}`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`types`,`primitives`,`any`,`unknown`,`void`,`never`],commonMistakes:[`Using any everywhere instead of proper types or unknown, defeating the purpose of TypeScript`,`Confusing null and undefined — TypeScript treats them as distinct types under strictNullChecks`,`Assuming TypeScript types exist at runtime — they are erased during compilation and cannot be used in typeof checks`],followUps:[`How does strictNullChecks affect the type system?`,`When would you use never versus void?`,`What is the difference between type assertions and type guards?`],interviewTips:[`Emphasize that TypeScript is a compile-time tool — all types are erased before execution`,`Mention the strict compiler flags (strict, strictNullChecks) that tighten the type system`],relatedTopics:[`ts-type-safety-1`,`ts-advanced-1`]},{id:`ts-fundamentals-2`,question:`What is the difference between an interface and a type alias in TypeScript?`,answer:`Interfaces and type aliases are the two primary mechanisms for naming types in TypeScript, and while they overlap significantly in capability, they differ in important ways that affect when you should use each.

Interfaces are designed for describing object shapes. They support extends for inheritance, allowing you to compose complex object types from simpler ones. A unique feature of interfaces is declaration merging: if you declare the same interface name twice in the same scope, TypeScript automatically merges them into a single interface containing all members. This is essential for augmenting third-party library types or extending global types like Window.

Type aliases, created with the type keyword, are more general-purpose. They can represent any type expression: unions (string | number), intersections (A & B), primitives (type ID = string), tuples, mapped types, conditional types, and more. When you need to name a type that is not purely an object shape — such as a union of string literals or a generic utility type — a type alias is the right choice. Type aliases cannot be declaration-merged; redeclaring the same name is an error.

From a practical standpoint, both can describe object shapes, both support generics, and both can be extended (interfaces with extends, type aliases with intersections). The TypeScript team recommends using interfaces for public API contracts and object shapes because they produce better error messages and support augmentation. Use type aliases when you need unions, intersections, conditional types, mapped types, or when naming non-object types. In many modern codebases you will see a mix of both used according to these guidelines.`,shortAnswer:`Interfaces describe object shapes, support declaration merging and extends. Type aliases can represent any type (unions, intersections, primitives, tuples) but cannot be declaration-merged.`,code:`// Interface — object shape with extension and merging
interface Animal {
  name: string;
  sound(): string;
}
interface Dog extends Animal {
  breed: string;
}

// Declaration merging
interface Animal {
  age?: number; // automatically merged into Animal
}

// Type alias — unions, intersections, primitives
type StringOrNumber = string | number;
type Point = { x: number; y: number };
type LabeledPoint = Point & { label: string };

// Type alias for function signature
type Comparator<T> = (a: T, b: T) => number;

// Cannot declaration-merge type aliases
// type StringOrNumber = boolean; // Error: Duplicate identifier`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`interface`,`type alias`,`declaration merging`,`extends`],commonMistakes:[`Believing interfaces and type aliases are interchangeable — type aliases handle unions and mapped types that interfaces cannot`,`Not leveraging declaration merging when augmenting third-party types`,`Using extends with type aliases instead of intersection (&) syntax`],followUps:[`How does declaration merging work with module augmentation?`,`Can an interface extend a type alias and vice versa?`,`When would declaration merging cause problems?`],interviewTips:[`Show awareness that both can describe objects, but explain the specific advantages of each`,`Mention that the TypeScript handbook recommends interfaces for object shapes unless you need type alias features`],relatedTopics:[`ts-advanced-1`]},{id:`ts-fundamentals-3`,question:`How does type inference work in TypeScript?`,answer:`Type inference is TypeScript's ability to automatically determine the type of a variable, parameter, or return value without an explicit annotation. The compiler analyzes the value assigned or the expression's structure to infer the most specific type it can, reducing the need for verbose annotations while maintaining full type safety.

The most common form is variable initialization inference. When you write let x = 42, TypeScript infers x as number. For const y = 42, it infers the literal type 42 because a const binding cannot be reassigned. This distinction between let (widened type) and const (literal type) is an important nuance. Array literals like [1, 2, 3] are inferred as number[], but using as const produces a readonly tuple [1, 2, 3].

Return type inference means you often do not need to annotate function return types. TypeScript examines all return paths and computes the union of their types. For example, a function that returns either a string or null is inferred as returning string | null. Contextual typing is another powerful form: when a function expression is assigned to a typed variable or passed as a callback with a known signature, TypeScript infers the parameter types from context. This is why array methods like .map(item => item.name) work without annotating item.

While inference reduces boilerplate, there are cases where explicit annotations are preferable. Public API surfaces (exported functions, class methods) benefit from explicit return types because they serve as documentation and prevent accidental changes from propagating. Recursive functions sometimes need explicit annotations because inference cannot resolve circular references. The general guideline is to let inference handle local variables and callbacks, but annotate public interfaces and complex return types explicitly.`,shortAnswer:`TypeScript automatically infers types from assignments, return values, and context. const uses literal types, let widens to general types. Contextual typing infers callback parameters from their expected signature.`,code:`// Variable inference
let count = 10;           // inferred as number
const name = "Alice";     // inferred as "Alice" (literal type)
let items = [1, 2, 3];   // inferred as number[]
const point = { x: 0, y: 0 }; // inferred as { x: number; y: number }

// as const for immutable literal inference
const config = { env: "prod", port: 3000 } as const;
// type: { readonly env: "prod"; readonly port: 3000 }

// Return type inference
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

function findUser(id: number) {
  if (id === 0) return null;
  return { id, name: "Alice" };
  // return type: { id: number; name: string } | null
}

// Contextual typing
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // n inferred as number
// No need to annotate n — TypeScript knows from Array<number>.map()

type EventHandler = (event: MouseEvent) => void;
const handleClick: EventHandler = (e) => {
  console.log(e.clientX); // e inferred as MouseEvent
};`,language:`typescript`,difficulty:`Beginner`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`type inference`,`contextual typing`,`literal types`,`as const`],commonMistakes:[`Over-annotating obvious types that TypeScript already infers correctly, adding unnecessary noise`,`Not understanding that const narrows to literal types while let widens to general types`,`Forgetting that function return types are inferred — unnecessarily annotating trivial returns while missing complex ones that actually need it`],followUps:[`What is the difference between type widening and type narrowing?`,`How does as const affect inference for objects and arrays?`,`When should you prefer explicit annotations over inference?`],interviewTips:[`Demonstrate understanding of the const vs let inference distinction — it shows depth beyond basics`,`Mention contextual typing as a practical benefit that reduces callback annotation boilerplate`],relatedTopics:[`ts-type-safety-1`]},{id:`ts-fundamentals-4`,question:`Explain enums in TypeScript, including numeric, string, and const enums.`,answer:`Enums in TypeScript provide a way to define a set of named constants, making code more readable and maintainable by replacing magic numbers or strings with descriptive identifiers. TypeScript supports three varieties: numeric enums, string enums, and const enums, each with distinct runtime and compile-time behavior.

Numeric enums are the default. When you declare enum Direction { Up, Down, Left, Right }, the members are auto-assigned incrementing integers starting from 0. You can set a custom starting value (Up = 1) and subsequent members auto-increment from there. Numeric enums support reverse mapping: you can look up Direction[0] to get 'Up'. The compiler emits a runtime JavaScript object with both forward (name → value) and reverse (value → name) mappings, which adds to your bundle size.

String enums require each member to have an explicit string value. They do not support auto-increment or reverse mapping, but they provide meaningful, debuggable values at runtime. When you log a string enum member you see 'ACTIVE' rather than 0, making debugging and serialization straightforward. String enums are generally preferred in modern TypeScript because they produce more predictable behavior and clearer output.

Const enums, declared with const enum, are completely erased at compile time. The compiler inlines every usage with the literal value, producing zero runtime overhead — no JavaScript object is emitted. However, const enums have limitations: they cannot be used with computed members, they are incompatible with the isolatedModules flag (common in projects using Babel or esbuild), and they cannot be iterated over since no runtime object exists. For these reasons, many style guides discourage const enums in favor of plain union types (type Direction = 'up' | 'down' | 'left' | 'right') which provide similar type safety without the compilation constraints.`,shortAnswer:`Numeric enums auto-increment from 0 with reverse mapping. String enums require explicit values with no reverse mapping. Const enums inline values at compile time for zero runtime cost but cannot be iterated or used with isolatedModules.`,code:`// Numeric enum with reverse mapping
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}
console.log(Direction.Up);    // 0
console.log(Direction[0]);    // "Up" — reverse mapping

// String enum — explicit values, no reverse mapping
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}
console.log(Status.Active);   // "ACTIVE"

// Const enum — erased at compile time, values inlined
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}
const status = HttpStatus.OK; // compiled to: const status = 200;

// Alternative: union type (no runtime overhead, works with isolatedModules)
type Color = "red" | "green" | "blue";`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`enums`,`string enums`,`const enums`,`union types`],commonMistakes:[`Using numeric enums when string enums would provide better debugging and serialization`,`Using const enums with isolatedModules or Babel, which strips TypeScript without full type-checking`,`Not considering union literal types as a simpler, more compatible alternative to enums`],followUps:[`Why do some TypeScript style guides recommend union types over enums?`,`How are numeric enums compiled to JavaScript?`,`Can you use computed values in enums?`],interviewTips:[`Mentioning the trade-offs between enums and union literal types shows pragmatic understanding`,`Knowing the isolatedModules limitation of const enums demonstrates real-world project experience`],relatedTopics:[`ts-advanced-1`]},{id:`ts-fundamentals-5`,question:`How do you type functions in TypeScript, including optional parameters, default values, rest parameters, and overloads?`,answer:`TypeScript provides rich function typing that goes well beyond simple parameter annotations. You can annotate parameter types, return types, optional parameters, default values, rest parameters, and even define multiple function signatures through overloads.

Basic function typing involves annotating each parameter and optionally the return type. Parameters can be made optional with ? — optional parameters must come after required ones. Default parameter values serve a dual purpose: they provide a fallback and also serve as implicit type annotations, so function greet(name = 'World') infers name as string without an explicit annotation. Rest parameters use the spread syntax and are typed as arrays: (...items: number[]) collects all remaining arguments into a number array.

Function overloads let you define multiple call signatures for a single function implementation. This is useful when a function's return type depends on its input types. You write two or more overload signatures followed by the implementation signature that must be compatible with all overloads. The implementation signature is not directly callable — callers can only use the declared overload signatures. Overloads are resolved in order, so place more specific signatures before more general ones.

You can also type functions as values using type aliases or interfaces. A type alias like type Formatter = (input: string) => string describes a function shape that can be used as a parameter type, return type, or variable annotation. Interfaces can also describe callable types with a call signature: interface Formatter { (input: string): string }. For methods on objects, the shorthand method(arg: Type): ReturnType syntax is common in interfaces. Understanding these patterns is essential for typing callbacks, event handlers, middleware, and higher-order functions throughout a TypeScript application.`,shortAnswer:`Functions are typed via parameter annotations, return types, optional params (?), defaults, and rest params (...args: T[]). Overloads define multiple signatures for different input/output type combinations.`,code:`// Basic function typing
function add(a: number, b: number): number {
  return a + b;
}

// Optional and default parameters
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}\`;
}

function createUser(name: string, role: string = "viewer") {
  return { name, role };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Function overloads
function parse(input: string): object;
function parse(input: string, asArray: true): string[];
function parse(input: string, asArray?: boolean): object | string[] {
  const parsed = JSON.parse(input);
  return asArray ? Object.values(parsed) : parsed;
}

const obj = parse('{"a":1}');         // return type: object
const arr = parse('{"a":1}', true);   // return type: string[]

// Function type alias
type Predicate<T> = (item: T) => boolean;
const isPositive: Predicate<number> = (n) => n > 0;`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`functions`,`overloads`,`optional parameters`,`rest parameters`,`function types`],commonMistakes:[`Placing optional parameters before required ones, which is a compilation error`,`Writing overload signatures that the implementation signature does not satisfy`,`Forgetting that the implementation signature of an overload is not callable — only the declared overload signatures are visible to callers`],followUps:[`When should you use overloads versus a union return type?`,`How do generic functions differ from overloaded functions?`,`What is the this parameter in TypeScript functions?`],interviewTips:[`Demonstrate overloads with a practical example like an API response parser whose return type depends on a flag`,`Mention that generics are often preferred over overloads when the relationship between inputs and outputs is uniform`],relatedTopics:[`ts-advanced-1`]},{id:`ts-fundamentals-6`,question:`What are tuples in TypeScript and how do they differ from arrays?`,answer:`Tuples are a TypeScript type construct that represents fixed-length arrays where each position has a specific, potentially different type. While regular arrays (number[]) enforce a single element type with no length constraint, tuples enforce both the type at each index and the total number of elements, making them ideal for representing structured data without creating a full interface.

A basic tuple is declared as [string, number], meaning the first element must be a string and the second must be a number. TypeScript enforces this: accessing index 0 gives you a string, accessing index 1 gives you a number, and accessing index 2 is an error. Named tuple elements ([name: string, age: number]) improve readability without changing runtime behavior. Tuples support optional elements with ? and rest elements with ... — for example, [string, ...number[]] represents a string followed by zero or more numbers.

Tuples are commonly used to represent function return values when you want to return multiple related pieces of data. React's useState hook returns a [state, setter] tuple, and custom hooks frequently use this pattern. They are also useful for representing fixed-structure data like coordinates ([x: number, y: number]), database rows, or CSV parsed lines. Destructuring tuples (const [first, second] = myTuple) provides a clean syntax for extracting values.

One important behavior is that tuples without as const allow mutation and push/pop operations that can break the length guarantee at runtime. TypeScript's type system considers [string, number] assignable to (string | number)[] in certain contexts, and methods like push are allowed because the underlying runtime type is still Array. Using readonly tuples (readonly [string, number]) prevents mutation entirely. The as const assertion on array literals produces readonly tuples with literal types, which is a common pattern for configuration values and discriminated unions.`,shortAnswer:`Tuples are fixed-length arrays with per-position types. Unlike regular arrays, they enforce both the type at each index and the element count. They support optional elements, rest elements, and named labels.`,code:`// Basic tuple
let point: [number, number] = [10, 20];
let entry: [string, number, boolean] = ["Alice", 30, true];

// Named tuple elements (labels are for readability only)
type UserEntry = [name: string, age: number, active: boolean];

// Optional elements
type Partial2D = [x: number, y?: number];
const a: Partial2D = [10];
const b: Partial2D = [10, 20];

// Rest elements
type StringAndNumbers = [string, ...number[]];
const data: StringAndNumbers = ["scores", 95, 87, 92];

// Readonly tuple prevents mutation
type ReadonlyPoint = readonly [number, number];
const p: ReadonlyPoint = [10, 20];
// p[0] = 30; // Error: cannot assign to readonly tuple

// as const produces readonly literal tuples
const config = ["production", 3000, true] as const;
// type: readonly ["production", 3000, true]

// Practical usage: function returning a tuple
function useState<T>(initial: T): [T, (value: T) => void] {
  let state = initial;
  const setState = (value: T) => { state = value; };
  return [state, setState];
}

const [count, setCount] = useState(0);`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`tuples`,`arrays`,`readonly`,`as const`,`destructuring`],commonMistakes:[`Forgetting that regular tuples still allow push/pop at runtime, potentially violating the type guarantee`,`Not using readonly tuples when immutability is intended`,`Confusing tuple type [string, number] with union array type (string | number)[] — they have different semantics`],followUps:[`How does as const interact with tuple inference?`,`What are variadic tuple types introduced in TypeScript 4.0?`,`How do you type a function that accepts a variable number of typed arguments using tuple rest elements?`],interviewTips:[`Relate tuples to React hooks (useState returns a tuple) to show practical understanding`,`Mention the readonly modifier and as const for interview depth`],relatedTopics:[`ts-advanced-1`,`ts-react-1`]},{id:`ts-fundamentals-7`,question:`What is the difference between any and unknown in TypeScript?`,answer:`any and unknown are both top types that can hold any value, but they differ fundamentally in type safety. any disables type checking entirely for that value, while unknown preserves type safety by requiring you to narrow the type before performing operations.

When a variable is typed as any, TypeScript permits every possible operation: property access, function calls, arithmetic, assignment to any other type. This makes any a complete escape hatch from the type system. You can write (value as any).foo.bar.baz() and TypeScript will not complain even if every property is undefined. This is useful for rapid prototyping, migrating JavaScript codebases, or interfacing with untyped third-party code, but it undermines the safety guarantees that make TypeScript valuable.

unknown, introduced in TypeScript 3.0, is the type-safe counterpart. A variable of type unknown can hold any value, but you cannot perform any operation on it until you narrow its type. Accessing a property, calling it as a function, or even assigning it to a typed variable — all require a type guard or assertion first. This forces you to write defensive code: check typeof before treating it as a string, use instanceof before calling class methods, or use a custom type guard to validate its shape.

The practical guideline is straightforward: use unknown whenever you receive data of an uncertain type — API responses, JSON.parse results, user inputs, catch clause errors, or any external boundary. Then narrow with appropriate guards before using the value. Reserve any for genuine escape-hatch scenarios: interacting with legacy JavaScript code, working around compiler bugs, or dealing with types that are too complex to express. The strict TypeScript compiler flag noImplicitAny ensures you never accidentally default to any, and many teams enforce this as a baseline configuration.`,shortAnswer:`any disables all type checking, allowing any operation. unknown requires type narrowing before use, maintaining type safety. Prefer unknown for values of uncertain type and reserve any as an escape hatch.`,code:`// any — no type checking, all operations allowed
let dangerous: any = "hello";
dangerous.nonExistent();      // no error at compile time
dangerous.foo.bar.baz;        // no error — compiles fine, crashes at runtime
const num: number = dangerous; // no error — assigns to any type

// unknown — type-safe, requires narrowing
let safe: unknown = "hello";
// safe.toUpperCase();         // Error: Object is of type 'unknown'
// const n: number = safe;     // Error: Type 'unknown' is not assignable to type 'number'

// Narrowing unknown with type guards
if (typeof safe === "string") {
  console.log(safe.toUpperCase()); // OK — narrowed to string
}

// Practical example: safe JSON parsing
function parseJSON(input: string): unknown {
  return JSON.parse(input);
}

interface User {
  name: string;
  age: number;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "age" in value &&
    typeof (value as User).name === "string" &&
    typeof (value as User).age === "number"
  );
}

const data = parseJSON('{"name":"Alice","age":30}');
if (isUser(data)) {
  console.log(data.name); // type-safe access
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`any`,`unknown`,`type safety`,`type guards`,`narrowing`],commonMistakes:[`Using any when unknown would provide safety — any should be a last resort`,`Casting unknown directly with as instead of using proper type guards`,`Not enabling noImplicitAny in tsconfig, allowing implicit any to sneak in through untyped parameters`],followUps:[`How do you handle the error parameter in catch clauses with unknown?`,`What is the never type and how does it relate to unknown?`,`How do custom type predicates (value is Type) work?`],interviewTips:[`Demonstrate writing a type guard for unknown — it shows both type safety knowledge and practical TypeScript skill`,`Mention that TypeScript 4.4+ supports unknown in catch clauses with useUnknownInCatchVariables`],relatedTopics:[`ts-type-safety-1`]},{id:`ts-fundamentals-8`,question:`What are literal types in TypeScript and how are they used?`,answer:`Literal types restrict a variable to an exact value rather than a general category. Instead of typing a variable as string (any string), you can type it as the literal "admin" meaning it can only hold that exact value. TypeScript supports string literals, number literals, and boolean literals as types.

The most common use of literal types is in union types that define a finite set of allowed values. For example, type Direction = "north" | "south" | "east" | "west" creates a type that only accepts those four strings. This is more type-safe than using a plain string because TypeScript will flag any misspelled value at compile time. This pattern serves a similar purpose to string enums but without the runtime overhead or the need for an import.

Literal types interact with TypeScript inference in an important way. A const declaration infers the literal type: const x = "hello" gives x the type "hello". A let declaration widens to the base type: let x = "hello" gives x the type string. The as const assertion forces literal inference on objects and arrays, making all properties readonly with their literal types. This is critical for patterns like discriminated unions, where a shared property with literal types determines which variant you are working with.

Literal types are also the foundation of template literal types (introduced in TypeScript 4.1), which let you construct string types from combinations of literals: type EventName = \`\${"click" | "hover"}_\${"start" | "end"}\` produces "click_start" | "click_end" | "hover_start" | "hover_end". This enables strongly typed string patterns for event names, CSS class names, API routes, and other structured string formats.`,shortAnswer:`Literal types restrict values to exact strings, numbers, or booleans. Combined in unions, they create finite value sets. const infers literals, let widens to base types. as const forces literal types on objects.`,code:`// String literal types
type Direction = "north" | "south" | "east" | "west";
let dir: Direction = "north"; // OK
// dir = "up";  // Error: not assignable to Direction

// Number literal types
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
function roll(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

// Boolean literal type
type True = true;

// Inference: const vs let
const greeting = "hello";  // type: "hello"
let message = "hello";     // type: string

// as const on objects
const config = {
  env: "production",
  port: 3000,
  features: ["auth", "logging"],
} as const;
// type: { readonly env: "production"; readonly port: 3000; readonly features: readonly ["auth", "logging"] }

// Template literal types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRoute = "/users" | "/posts" | "/comments";
type Endpoint = \`\${HttpMethod} \${ApiRoute}\`;
// "GET /users" | "GET /posts" | "GET /comments" | "POST /users" | ...

// Discriminated union using literal types
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
  }
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`literal types`,`template literal types`,`as const`,`discriminated unions`],commonMistakes:[`Expecting let declarations to preserve literal types — they always widen unless explicitly annotated`,`Not using as const when passing literal objects to functions that expect narrow types`,`Overusing type assertions (as) instead of letting const inference or as const handle literal narrowing`],followUps:[`How do template literal types enable typed string manipulation?`,`What are the built-in string manipulation types (Uppercase, Lowercase, Capitalize)?`,`How do literal types enable exhaustive switch-case checking?`],interviewTips:[`Connect literal types to discriminated unions — it shows you understand how they fit into real-world patterns`,`Mention template literal types to show knowledge of modern TypeScript features`],relatedTopics:[`ts-advanced-1`,`ts-type-safety-1`]},{id:`ts-fundamentals-9`,question:`How do you use type assertions in TypeScript, and what are their risks?`,answer:`Type assertions tell the TypeScript compiler to treat a value as a specific type, overriding its inference. They use either the as keyword (value as Type) or the angle-bracket syntax (<Type>value), though the as syntax is preferred because angle brackets conflict with JSX. Assertions do not perform any runtime transformation — they are purely a compile-time directive.

Type assertions are useful in situations where you have more information than the compiler. For example, when using document.getElementById(), TypeScript returns HTMLElement | null. If you know the element exists and is an input, you can assert document.getElementById('email') as HTMLInputElement to access input-specific properties like .value. Similarly, when working with JSON data you have validated externally, assertions let you tell TypeScript the shape of the parsed object.

However, assertions are inherently unsafe because they bypass the compiler's analysis. If you assert a value as the wrong type, TypeScript will trust you and allow operations that will fail at runtime. For example, asserting a string as a number will compile without error but crash when you try to use it as a number. TypeScript enforces a basic sanity check — you cannot assert between completely unrelated types (string as number is an error) — but you can always go through unknown as an intermediate step (value as unknown as TargetType), which is sometimes called a double assertion.

Best practice is to minimize assertions and prefer type guards for narrowing. When assertions are necessary, validate the data at runtime before asserting. Non-null assertion (value!) is a special assertion that tells TypeScript a value is not null or undefined — use it sparingly and only when you can guarantee the value's existence. Assertion functions (asserts value is Type) combine runtime validation with type narrowing, offering a safer alternative to plain assertions.`,shortAnswer:`Type assertions (as Type) override compiler inference without runtime transformation. They are useful when you know more than the compiler but risky when incorrect. Prefer type guards over assertions for safety.`,code:`// Basic assertion with as
const input = document.getElementById("email") as HTMLInputElement;
console.log(input.value);

// Non-null assertion with !
function getLength(value: string | undefined): number {
  return value!.length; // asserts value is not undefined
}

// Double assertion (escape hatch — avoid if possible)
const mystery: string = "hello";
const num = mystery as unknown as number; // compiles, but wrong at runtime

// Safer alternative: type guard
function isHTMLInput(el: HTMLElement | null): el is HTMLInputElement {
  return el !== null && el.tagName === "INPUT";
}

const el = document.getElementById("email");
if (isHTMLInput(el)) {
  console.log(el.value); // safely narrowed, no assertion needed
}

// Assertion function for runtime + compile-time safety
function assertDefined<T>(value: T | null | undefined, msg: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(msg);
  }
}

const config: string | undefined = getConfig();
assertDefined(config, "Config is required");
console.log(config.toUpperCase()); // narrowed to string after assertion`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-fundamentals-1`,tags:[`type assertions`,`as`,`non-null assertion`,`assertion functions`,`type guards`],commonMistakes:[`Using assertions to silence errors instead of fixing the underlying type mismatch`,`Relying on non-null assertion (!) without ensuring the value actually exists at runtime`,`Using double assertions (as unknown as T) as a routine pattern instead of a last resort`],followUps:[`What is the difference between a type assertion and a type guard?`,`How do assertion functions (asserts value is T) work?`,`When is a double assertion justified?`],interviewTips:[`Acknowledge that assertions have legitimate uses but emphasize preferring type guards for safety`,`Demonstrating knowledge of assertion functions shows advanced TypeScript understanding`],relatedTopics:[`ts-type-safety-1`]}]},{id:`ts-advanced-1`,title:`Advanced TypeScript Types`,description:`Deep exploration of advanced type-level programming in TypeScript including generics, utility types, conditional types, mapped types, template literal types, and the infer keyword.`,category:`TypeScript`,difficulty:`Advanced`,tags:[`generics`,`utility types`,`conditional types`,`mapped types`,`template literal types`,`keyof`,`typeof`,`infer`,`union types`,`intersection types`],overview:`Advanced TypeScript types transform the language from a simple annotation system into a powerful type-level programming language. Generics enable reusable, parameterized types. Utility types like Partial, Pick, and Omit provide common type transformations out of the box. Conditional types enable type-level branching, mapped types iterate over keys to transform object types, and the infer keyword extracts types from complex structures. Mastering these features lets you write library-quality type definitions that catch bugs at compile time while maintaining flexibility.`,concepts:[`Union types and intersection types`,`Generics: functions, interfaces, classes, and constraints`,`Built-in utility types: Partial, Required, Pick, Omit, Record, Exclude, Extract, ReturnType, Parameters`,`keyof operator for extracting object keys as a union`,`typeof operator for extracting the type of a value`,`Conditional types with extends and ternary syntax`,`Mapped types with in keyof for transforming object types`,`Template literal types for typed string patterns`,`The infer keyword for type extraction in conditional types`,`Distributive conditional types`,`Recursive types`],codeExamples:[{title:`Generics with Constraints`,code:`// Generic function with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
const name = getProperty(user, "name"); // type: string
const age = getProperty(user, "age");   // type: number
// getProperty(user, "email");          // Error: "email" not in keyof User

// Generic class
class TypedMap<K extends string | number, V> {
  private store = new Map<K, V>();
  set(key: K, value: V): void { this.store.set(key, value); }
  get(key: K): V | undefined { return this.store.get(key); }
}

const scores = new TypedMap<string, number>();
scores.set("Alice", 95);`,language:`typescript`,explanation:`Generics with extends constraints ensure type parameters meet required contracts while maintaining precise return types.`},{title:`Conditional and Mapped Types`,code:`// Conditional type
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<42>;      // false

// Mapped type — make all properties optional
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Mapped type with conditional — extract string properties
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface User {
  name: string;
  age: number;
  email: string;
}
type UserStrings = StringProps<User>;
// { name: string; email: string }`,language:`typescript`,explanation:`Conditional types enable type-level if/else logic. Mapped types iterate over keys to create transformed object types. Key remapping with as filters out properties.`}],relatedTopicIds:[`ts-fundamentals-1`,`ts-type-safety-1`,`ts-react-1`],questions:[{id:`ts-advanced-1`,question:`What are union and intersection types in TypeScript?`,answer:`Union and intersection types are two fundamental type operators that combine existing types into new ones. A union type (A | B) represents a value that can be either type A or type B, while an intersection type (A & B) represents a value that is simultaneously both type A and type B.

Union types are used when a value can take multiple forms. A function parameter typed as string | number accepts either a string or a number. When working with a union type, you can only access members that are common to all constituent types unless you narrow the type first. For example, (string | number) only allows operations valid on both strings and numbers. To access string-specific methods, you must narrow using typeof, instanceof, or a discriminant property. This is where discriminated unions shine: adding a common literal property (like { type: 'circle' } | { type: 'square' }) allows TypeScript to narrow based on that discriminant.

Intersection types combine multiple types into one that has all members of each constituent type. { name: string } & { age: number } produces { name: string; age: number }. Intersections are commonly used to compose object types: extend a base type with additional properties without using interface extends. They are also essential for mixins and for requiring a value to satisfy multiple interface contracts simultaneously.

A key distinction is how unions and intersections interact with function parameters and type narrowing. Unions are narrowed down (you start with multiple possibilities and eliminate them), while intersections accumulate constraints (the value must satisfy all types at once). When applied to incompatible primitives, intersections produce never (string & number is never because no value can be both). Understanding this duality is essential for composing complex type expressions in generic utility types, conditional types, and real-world application architecture.`,shortAnswer:`Union (A | B) means a value is one of the constituent types. Intersection (A & B) means a value is all constituent types simultaneously. Unions require narrowing to access type-specific members; intersections combine all members.`,code:`// Union type — value is one of several types
type StringOrNumber = string | number;

function format(value: StringOrNumber): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // narrowed to string
  }
  return value.toFixed(2); // narrowed to number
}

// Discriminated union
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":    return Math.PI * s.radius ** 2;
    case "rectangle": return s.width * s.height;
  }
}

// Intersection type — value has all properties
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge;

const person: Person = { name: "Alice", age: 30 };

// Intersection for extending types
type TimestampedUser = User & {
  createdAt: Date;
  updatedAt: Date;
};

// Incompatible intersection produces never
type Impossible = string & number; // never`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`union types`,`intersection types`,`discriminated unions`,`narrowing`],commonMistakes:[`Trying to access type-specific properties on a union without narrowing first`,`Confusing union (either/or) with intersection (both) — they are duals, not synonyms`,`Creating impossible intersections of incompatible primitives and being surprised by never`],followUps:[`How do discriminated unions enable exhaustive pattern matching?`,`What happens when you intersect two object types with conflicting property types?`,`How do unions distribute over conditional types?`],interviewTips:[`Use a discriminated union example to demonstrate real-world union usage`,`Explain the union/intersection duality: unions narrow down, intersections accumulate`],relatedTopics:[`ts-type-safety-1`]},{id:`ts-advanced-2`,question:`Explain generics in TypeScript and how to use generic constraints.`,answer:`Generics are TypeScript's mechanism for creating reusable components that work with multiple types while preserving type relationships. Instead of using any (which loses type information) or writing separate implementations for each type, generics let you parameterize a function, class, or interface with type variables that are filled in by the caller.

A generic function like function identity<T>(value: T): T preserves the relationship between input and output types. When called as identity('hello'), TypeScript infers T as string and the return type is string, not any. This is essential for utility functions, data structures, and API wrappers where the specific type varies but the structural pattern is consistent. Multiple type parameters (function map<T, U>(arr: T[], fn: (item: T) => U): U[]) capture relationships between inputs and outputs.

Generic constraints, written with extends, restrict what types can be used as a type parameter. The constraint <T extends { length: number }> means T must have a numeric length property — this accepts strings, arrays, and any object with length, but rejects numbers. The keyof constraint (<K extends keyof T>) is extremely common: it ensures a key parameter is actually a valid property name of the given object type. This pattern powers type-safe property access functions and is the foundation of utility types like Pick and Omit.

Generics also apply to interfaces and classes. A generic interface like interface Repository<T> { find(id: string): T; save(item: T): void } defines a contract that is parameterized by the entity type. Generic classes like class Stack<T> maintain type safety across all methods. Default type parameters (<T = string>) provide fallbacks. Generics are the backbone of TypeScript's type-level expressiveness and are used extensively in library type definitions, React component typing, and any code that needs to be both reusable and type-safe.`,shortAnswer:`Generics parameterize types with type variables (T, U) for reusable, type-safe components. Constraints (extends) restrict type parameters. They preserve type relationships that any would lose.`,code:`// Basic generic function
function identity<T>(value: T): T {
  return value;
}
const str = identity("hello"); // type: string
const num = identity(42);      // type: number

// Generic constraint
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
getLength("hello");   // OK — string has length
getLength([1, 2, 3]); // OK — array has length
// getLength(42);     // Error — number has no length

// keyof constraint for type-safe property access
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}
const user = { name: "Alice", age: 30, email: "alice@example.com" };
const subset = pick(user, ["name", "email"]);
// type: { name: string; email: string }

// Generic interface and class
interface Repository<T> {
  find(id: string): Promise<T | null>;
  save(item: T): Promise<void>;
  delete(id: string): Promise<boolean>;
}

class InMemoryRepo<T extends { id: string }> implements Repository<T> {
  private items = new Map<string, T>();
  async find(id: string) { return this.items.get(id) ?? null; }
  async save(item: T) { this.items.set(item.id, item); }
  async delete(id: string) { return this.items.delete(id); }
}

// Default type parameter
type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  message: string;
};`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`generics`,`constraints`,`keyof`,`extends`,`type parameters`],commonMistakes:[`Using any instead of generics, losing the type relationship between inputs and outputs`,`Over-constraining generic parameters when a simpler constraint would suffice`,`Forgetting that generic type parameters can have defaults, leading to unnecessarily verbose call sites`],followUps:[`How do conditional types interact with generics?`,`What are higher-kinded types and does TypeScript support them?`,`How do you write a generic that infers tuple types from rest parameters?`],interviewTips:[`Implement a real utility function like pick or groupBy with generics to demonstrate practical skill`,`Show the keyof + extends pattern — it is by far the most commonly tested generic pattern`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-advanced-3`,question:`Explain the key utility types in TypeScript: Partial, Required, Pick, Omit, Record, Exclude, Extract, and ReturnType.`,answer:`TypeScript ships with a collection of built-in utility types that perform common type transformations. Understanding what they do and how they are implemented deepens your understanding of mapped types, conditional types, and keyof — the building blocks from which they are constructed.

Partial<T> makes all properties of T optional. It is implemented as a mapped type: { [K in keyof T]?: T[K] }. This is essential for update functions where you only want to change some fields: function updateUser(user: User, updates: Partial<User>). Required<T> is the opposite — it removes optionality from all properties, making every field mandatory. Readonly<T> makes all properties readonly.

Pick<T, K> extracts a subset of properties: Pick<User, 'name' | 'email'> produces { name: string; email: string }. Omit<T, K> is the complement, removing the specified properties. Record<K, V> creates an object type with keys of type K (a string/number/symbol union) and values of type V: Record<string, number> represents { [key: string]: number }. These three are workhorses for shaping API request/response types and component props.

Exclude<T, U> and Extract<T, U> operate on union types using conditional types. Exclude removes from union T any member assignable to U: Exclude<'a' | 'b' | 'c', 'a'> produces 'b' | 'c'. Extract keeps only the members assignable to U. ReturnType<T> extracts the return type of a function type: ReturnType<typeof JSON.parse> gives any. Parameters<T> extracts function parameters as a tuple. These utility types are the foundation for building your own complex type transformations: once you understand that Partial is just a mapped type with ?, you can create custom utilities like DeepPartial, Mutable, or Nullable by following the same patterns.`,shortAnswer:`Partial makes all props optional, Required removes optionality, Pick/Omit select/exclude properties, Record maps keys to values, Exclude/Extract filter unions, ReturnType extracts function return types. All are built from mapped and conditional types.`,code:`interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

// Partial — all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required — all properties required
type RequiredUser = Required<User>;
// { id: number; name: string; email: string; age: number }

// Pick — subset of properties
type UserPreview = Pick<User, "name" | "email">;
// { name: string; email: string }

// Omit — exclude properties
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age?: number }

// Record — map keys to values
type RolePermissions = Record<"admin" | "editor" | "viewer", string[]>;

// Exclude — remove from union
type T1 = Exclude<"a" | "b" | "c", "a">;       // "b" | "c"
type T2 = Exclude<string | number | boolean, string>; // number | boolean

// Extract — keep matching members
type T3 = Extract<"a" | "b" | "c", "a" | "b">; // "a" | "b"

// ReturnType — extract function return type
function createUser(name: string, email: string) {
  return { id: Math.random(), name, email, createdAt: new Date() };
}
type NewUser = ReturnType<typeof createUser>;
// { id: number; name: string; email: string; createdAt: Date }

// Parameters — extract function parameter types as tuple
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string]

// How Partial is implemented under the hood
type MyPartial<T> = { [K in keyof T]?: T[K] };`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`utility types`,`Partial`,`Pick`,`Omit`,`Record`,`ReturnType`,`Exclude`],commonMistakes:[`Confusing Exclude (operates on unions) with Omit (operates on object property keys)`,`Using Partial when only specific properties should be optional — Pick + Partial combination is often more precise`,`Not realizing that ReturnType requires typeof when used with a value (function) rather than a type`],followUps:[`How would you implement a DeepPartial utility type?`,`What is the difference between Omit and Exclude internally?`,`How do you create a utility type that makes only certain properties required?`],interviewTips:[`Being able to reimplement Partial or Pick from scratch using mapped types demonstrates deep understanding`,`Show a real use case like a Partial update DTO or a Pick-based API response type`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-advanced-4`,question:`What are conditional types in TypeScript and how do they work?`,answer:`Conditional types bring if/else logic to the type level. They use the syntax T extends U ? TrueType : FalseType — if T is assignable to U, the type resolves to TrueType; otherwise it resolves to FalseType. This enables type-level branching, dynamic return types, and powerful type inference patterns.

The simplest conditional types are type predicates: type IsString<T> = T extends string ? true : false. Applied to concrete types, they resolve immediately: IsString<'hello'> is true, IsString<42> is false. More useful patterns include overload-like return types: function process<T>(input: T): T extends string ? string[] : number where the return type depends on the input type.

A critical behavior is distributive conditional types. When T is a naked type parameter and the input is a union, the conditional distributes across each member. type ToArray<T> = T extends any ? T[] : never applied to string | number produces string[] | number[], not (string | number)[]. This is because the condition is evaluated for each union member separately. To prevent distribution, wrap both sides in a tuple: [T] extends [any] ? ... — this treats the union as a single unit.

The infer keyword, usable only within conditional types, lets you extract types from complex structures. type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never extracts the return type R from a function type. type ElementType<T> = T extends (infer E)[] ? E : T extracts the element type from an array. You can infer multiple positions: type FirstAndRest<T> = T extends [infer First, ...infer Rest] ? [First, Rest] : never destructures a tuple. These patterns are the foundation of advanced type-level programming in TypeScript and are used extensively in library type definitions.`,shortAnswer:`Conditional types use T extends U ? A : B for type-level branching. They distribute over unions by default (preventable with [T]). The infer keyword extracts types from patterns within conditional types.`,code:`// Basic conditional type
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<42>;      // false

// Practical: extract return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type R1 = MyReturnType<() => string>;         // string
type R2 = MyReturnType<(x: number) => void>;  // void

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type C = ToArray<string | number>; // string[] | number[]

// Non-distributive (wrap in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type D = ToArrayNonDist<string | number>; // (string | number)[]

// infer in practice: unwrap Promise
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
type E = Awaited<Promise<Promise<string>>>; // string

// infer with tuples
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;

type F = First<[1, 2, 3]>; // 1
type G = Last<[1, 2, 3]>;  // 3

// Nested conditional types
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends Function ? "function" :
  "object";

type H = TypeName<string>;   // "string"
type I = TypeName<() => void>; // "function"`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`conditional types`,`infer`,`distributive`,`extends`,`type-level programming`],commonMistakes:[`Not understanding distributive behavior — T extends any distributes over unions when T is a naked type parameter`,`Forgetting that infer can only be used within the extends clause of a conditional type`,`Writing overly complex nested conditionals when a simpler mapped type or overload would work`],followUps:[`How do you prevent a conditional type from distributing?`,`Can you use multiple infer keywords in a single conditional type?`,`How are recursive conditional types used in practice?`],interviewTips:[`Implement ReturnType or Awaited from scratch to demonstrate mastery of infer`,`Explain distributive behavior with a clear example — this is a common interview surprise question`],relatedTopics:[`ts-type-safety-1`]},{id:`ts-advanced-5`,question:`What are mapped types in TypeScript and how do you use key remapping?`,answer:`Mapped types iterate over a set of keys to produce a new object type, transforming each property according to a rule. The syntax { [K in Keys]: ValueType } creates a new type by mapping each key K to a value type. When combined with keyof, modifiers (+/- readonly, +/- optional), and conditional types, mapped types become one of the most powerful tools in TypeScript's type system.

The basic pattern { [K in keyof T]: T[K] } reproduces the original type T. By adding modifiers, you create transformations: { [K in keyof T]?: T[K] } makes all properties optional (this is Partial<T>), { -readonly [K in keyof T]: T[K] } removes readonly from all properties, and { [K in keyof T]-?: T[K] } makes all properties required (this is Required<T>). You can also transform value types: { [K in keyof T]: Promise<T[K]> } wraps every property value in a Promise.

Key remapping, introduced in TypeScript 4.1 with the as clause, enables filtering and renaming keys during mapping. The syntax { [K in keyof T as NewKey]: T[K] } remaps each key. To filter out properties, remap to never: { [K in keyof T as T[K] extends Function ? never : K]: T[K] } produces an object with only non-function properties. To rename keys, use template literal types: { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] } transforms { name: string } into { getName: () => string }.

Mapped types underpin most of TypeScript's built-in utility types and are essential for library authors and advanced application development. They enable patterns like creating getter/setter interfaces from data types, building type-safe ORM query builders, transforming API response types, and creating validation schemas that mirror data shapes. Understanding mapped types and key remapping gives you the ability to express complex type relationships that would otherwise require verbose manual type definitions.`,shortAnswer:`Mapped types iterate over keys with [K in keyof T] to transform object types. Modifiers (+/-readonly, +/-?) toggle property attributes. Key remapping with as enables filtering (remap to never) and renaming keys.`,code:`// Basic mapped type
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Partial<T> = { [K in keyof T]?: T[K] };

// Transform value types
type Promisified<T> = { [K in keyof T]: Promise<T[K]> };

interface UserService {
  getUser(id: string): User;
  deleteUser(id: string): boolean;
}
type AsyncUserService = Promisified<UserService>;
// { getUser: Promise<(id: string) => User>; ... }

// Key remapping — filter by value type
type MethodsOnly<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

// Key remapping — rename with template literal
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface User { name: string; age: number; }
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }

// Remove readonly with -readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Practical: DeepPartial using recursion
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Config {
  db: { host: string; port: number };
  cache: { ttl: number };
}
type OptionalConfig = DeepPartial<Config>;
// { db?: { host?: string; port?: number }; cache?: { ttl?: number } }`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`mapped types`,`key remapping`,`modifiers`,`readonly`,`template literal types`],commonMistakes:[`Forgetting to intersect K with string when using template literal key remapping (Capitalize requires string)`,`Not realizing that mapped types iterate over all keys including optional ones — the optional modifier carries through unless explicitly removed`,`Attempting to use key remapping syntax in TypeScript versions before 4.1`],followUps:[`How do you create a deep readonly type using recursive mapped types?`,`What happens when you map over a union type with in?`,`How are mapped types used in library type definitions like those in React or Prisma?`],interviewTips:[`Implementing Partial or Readonly from scratch shows you understand mapped types beyond just using them`,`The Getters example with key remapping is a great way to demonstrate practical mapped type usage`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-advanced-6`,question:`How do keyof and typeof operators work at the type level in TypeScript?`,answer:`keyof and typeof are type-level operators that extract type information from existing types and values. keyof produces a union of an object type's property names, while typeof extracts the TypeScript type of a runtime value. Together they form the foundation for type-safe property access, lookup types, and dynamic type derivation.

keyof T produces a union type of all public property names of T as string (or number/symbol) literals. For interface User { name: string; age: number; email: string }, keyof User is 'name' | 'age' | 'email'. This is essential for generic constraints: <K extends keyof T> ensures a key parameter is valid for the given object. Combined with indexed access types (T[K]), keyof enables type-safe property lookups where the return type depends on which key is accessed.

The typeof operator in type position extracts the TypeScript type from a runtime value. This is distinct from JavaScript's runtime typeof which returns a string. TypeScript's typeof lets you derive types from existing code: const config = { port: 3000, env: 'prod' }; type Config = typeof config produces the type { port: number; env: string }. This is particularly useful with ReturnType<typeof someFunction> to extract a function's return type without having an explicit type definition, and with enum objects where typeof MyEnum gives you the constructor type.

The combination of keyof and typeof is a powerful pattern. keyof typeof someObject extracts the keys of a runtime object as a type without defining a separate interface. This is common with configuration objects, constant maps, and enum-like plain objects. Indexed access types T[K] complete the picture: given keyof for the keys and the object type, T[K] gives you the value type for key K, enabling fully type-safe generic access patterns that are the backbone of TypeScript's type manipulation capabilities.`,shortAnswer:`keyof extracts an object type's property names as a union type. typeof extracts the TypeScript type of a runtime value. Together, keyof typeof obj derives a value's key union without a separate type definition.`,code:`// keyof — extracts property names as union
interface User {
  name: string;
  age: number;
  email: string;
}
type UserKeys = keyof User; // "name" | "age" | "email"

// Indexed access type — T[K]
type NameType = User["name"];           // string
type NameOrAge = User["name" | "age"];  // string | number

// Type-safe property access
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { name: "Alice", age: 30, email: "a@b.com" };
const name = getValue(user, "name");  // type: string
const age = getValue(user, "age");    // type: number

// typeof — extract type from a value
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;

type Config = typeof config;
// { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3 }

// keyof typeof — keys of a runtime object
type ConfigKey = keyof typeof config; // "apiUrl" | "timeout" | "retries"

// typeof with functions
function createStore(initial: number) {
  return { value: initial, increment() { this.value++; } };
}
type Store = ReturnType<typeof createStore>;
// { value: number; increment(): void }

// Enum key extraction
enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
type StatusKey = keyof typeof Status; // "Active" | "Inactive"`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`keyof`,`typeof`,`indexed access`,`lookup types`,`type operators`],commonMistakes:[`Confusing TypeScript typeof (type-level, returns the TS type) with JavaScript typeof (runtime, returns a string)`,`Using keyof on a value instead of a type — you need keyof typeof value for runtime objects`,`Forgetting that keyof includes number and symbol keys when the object type has them, not just string keys`],followUps:[`How do indexed access types work with unions (T[K1 | K2])?`,`What is the difference between keyof typeof enum vs the enum itself as a type?`,`How do keyof and mapped types combine to create type transformations?`],interviewTips:[`The getValue<T, K extends keyof T>(obj, key): T[K] pattern is the canonical keyof example — know it by heart`,`Show awareness that keyof typeof bridges runtime values to the type system`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-advanced-7`,question:`Explain template literal types in TypeScript and their practical uses.`,answer:"Template literal types, introduced in TypeScript 4.1, allow you to construct string types by interpolating other string literal types using the same backtick syntax as JavaScript template literals but at the type level. Combined with union types, they can generate large sets of valid string patterns, enabling strongly typed string manipulation.\n\nThe basic syntax mirrors template strings: type Greeting = `hello ${string}` creates a type that matches any string starting with 'hello '. When you interpolate a union, the result distributes: type Color = 'red' | 'blue'; type Size = 'sm' | 'lg'; type ClassName = `${Color}-${Size}` produces 'red-sm' | 'red-lg' | 'blue-sm' | 'blue-lg'. This distributive behavior makes template literals powerful for generating typed event names, CSS class names, API route patterns, and configuration keys.\n\nTypeScript provides four intrinsic string manipulation types that work with template literals: Uppercase<T>, Lowercase<T>, Capitalize<T>, and Uncapitalize<T>. These transform string literal types: Capitalize<'hello'> is 'Hello'. Combined with mapped types and key remapping, they enable patterns like generating getter/setter names from property names: { [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void } transforms { name: string; age: number } into { onNameChange: (value: string) => void; onAgeChange: (value: number) => void }.\n\nPractical uses include typed event emitter interfaces, typed route definitions (type Route = `/${string}/${string}`), typed CSS utility classes, and type-safe string parsing. For example, a type like `${number}.${number}.${number}` can represent semantic version strings. Template literal types bridge the gap between the dynamic string world and the type system, enabling compile-time validation of string patterns that would otherwise require runtime checks.",shortAnswer:"Template literal types use `${Type}` syntax to construct string types. Unions distribute, producing all combinations. Combined with Capitalize/Lowercase and mapped types, they enable typed string patterns for events, routes, and APIs.",code:`// Basic template literal type
type Greeting = \`Hello, \${string}\`;
const g: Greeting = "Hello, World"; // OK
// const bad: Greeting = "Hi, World"; // Error

// Union distribution — generates all combinations
type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";
type ColorVariant = \`\${Shade}-\${Color}\`;
// "light-red" | "light-green" | "light-blue" | "dark-red" | "dark-green" | "dark-blue"

// String manipulation types
type Upper = Uppercase<"hello">;     // "HELLO"
type Lower = Lowercase<"HELLO">;     // "hello"
type Cap = Capitalize<"hello">;      // "Hello"
type Uncap = Uncapitalize<"Hello">;  // "hello"

// Typed event system
type EventName = "click" | "hover" | "focus";
type EventHandler = \`on\${Capitalize<EventName>}\`;
// "onClick" | "onHover" | "onFocus"

// Mapped type with template literal key remapping
type EventHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}Change\`]: (value: T[K]) => void;
};

interface FormFields {
  name: string;
  age: number;
  email: string;
}

type FormEvents = EventHandlers<FormFields>;
// {
//   onNameChange: (value: string) => void;
//   onAgeChange: (value: number) => void;
//   onEmailChange: (value: string) => void;
// }

// API route typing
type ApiVersion = "v1" | "v2";
type Resource = "users" | "posts" | "comments";
type ApiEndpoint = \`/api/\${ApiVersion}/\${Resource}\`;
// "/api/v1/users" | "/api/v1/posts" | ... | "/api/v2/comments"`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`template literal types`,`string manipulation`,`Capitalize`,`distributive`,`key remapping`],commonMistakes:[`Forgetting that template literal types with large unions produce exponentially many members, which can slow down the compiler`,`Not intersecting K with string when using Capitalize in key remapping (symbol keys would cause an error)`,`Expecting template literal types to work with runtime string values — they only operate on string literal types`],followUps:[`How do template literal types combine with infer for string parsing at the type level?`,`What are the performance implications of large template literal unions?`,`How would you type a CSS-in-JS utility function using template literal types?`],interviewTips:[`The event handler generation example is a compelling demonstration of practical template literal usage`,`Mention the intrinsic string types (Uppercase, Lowercase, Capitalize, Uncapitalize) — many developers are not aware of them`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-advanced-8`,question:`How does the infer keyword work in TypeScript conditional types?`,answer:`The infer keyword lets you declare a type variable within the extends clause of a conditional type that is inferred from the matched pattern. It is TypeScript's mechanism for type extraction — pulling out part of a complex type's structure and using it as the result. infer can only appear within the extends clause and the inferred variable is only in scope within the true branch.

The canonical example is ReturnType: type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never. Here, if T is a function type, R is inferred as whatever the function returns. ReturnType<() => string> gives string. Similarly, type ElementType<T> = T extends (infer E)[] ? E : T extracts the element type from an array, and type UnwrapPromise<T> = T extends Promise<infer U> ? U : T extracts the resolved type from a Promise.

Multiple infer positions can extract different parts of a type simultaneously. With tuple types, you can destructure: type Head<T> = T extends [infer First, ...any[]] ? First : never extracts the first element. type Tail<T> = T extends [any, ...infer Rest] ? Rest : never extracts all remaining elements. For function types, you can infer both parameters and return type: type FnParts<T> = T extends (...args: infer P) => infer R ? { params: P; returns: R } : never.

infer enables recursive types for deep transformations. type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T recursively unwraps nested Promises until it reaches a non-Promise type. type Flatten<T> = T extends Array<infer E> ? Flatten<E> : T recursively flattens nested arrays. These patterns are used extensively in library type definitions — ORMs like Prisma, validation libraries like Zod, and state managers like Redux all use infer-based conditional types to provide precise, automatically derived types from user-defined schemas and configurations.`,shortAnswer:`infer declares a type variable in a conditional extends clause that TypeScript fills in by matching the pattern. It enables type extraction from functions (ReturnType), arrays (ElementType), Promises (Awaited), and tuples (Head/Tail).`,code:`// Extract return type
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never;

type R = MyReturnType<(x: string) => number>; // number

// Extract element type from array
type ElementType<T> = T extends (infer E)[] ? E : T;
type E = ElementType<string[]>; // string

// Extract resolved type from Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;
type U = UnwrapPromise<Promise<Promise<string>>>; // string

// Extract function parameters as tuple
type MyParameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any ? P : never;
type P = MyParameters<(a: string, b: number) => void>; // [a: string, b: number]

// Tuple manipulation with infer
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : [];

type F = First<[1, 2, 3]>; // 1
type L = Last<[1, 2, 3]>;  // 3
type T = Tail<[1, 2, 3]>;  // [2, 3]

// Multiple infer positions
type FnInfo<T> = T extends (...args: infer P) => infer R
  ? { params: P; returns: R }
  : never;

type Info = FnInfo<(name: string, age: number) => boolean>;
// { params: [name: string, age: number]; returns: boolean }

// Infer with template literal types (string parsing)
type ExtractRoute<T> = T extends \`/api/\${infer Resource}/\${infer Id}\`
  ? { resource: Resource; id: Id }
  : never;

type Route = ExtractRoute<"/api/users/123">;
// { resource: "users"; id: "123" }`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`infer`,`conditional types`,`type extraction`,`ReturnType`,`recursive types`],commonMistakes:[`Trying to use infer outside of a conditional type extends clause — it is only valid there`,`Forgetting that the inferred variable is only in scope in the true branch, not the false branch`,`Creating infinitely recursive conditional types without a proper base case termination`],followUps:[`How does infer interact with distributive conditional types?`,`Can you infer multiple type variables from the same position?`,`How do libraries like Zod and Prisma use infer for schema type derivation?`],interviewTips:[`Implementing ReturnType or Awaited with infer is a classic advanced TypeScript interview question`,`The string parsing example with template literal types and infer shows cutting-edge TypeScript knowledge`],relatedTopics:[`ts-type-safety-1`]},{id:`ts-advanced-9`,question:`How do you build custom utility types in TypeScript using mapped types, conditional types, and infer?`,answer:`Building custom utility types combines mapped types, conditional types, infer, and template literal types to create type transformations tailored to your application's needs. The built-in utility types are just starting points — real-world projects often need specialized transformations that go beyond what Partial, Pick, and Omit provide.

DeepPartial is a common custom utility that recursively makes all nested properties optional. The implementation uses a mapped type with a conditional check: type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }. For each property, if the value type extends object, we recursively apply DeepPartial; otherwise we keep the original type and just add the ? modifier. This pattern is essential for deeply nested configuration objects and form state management.

More advanced patterns include type-level filtering, overriding, and picking by value type. RequiredKeys<T> extracts only the keys that are required: type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]. This maps each key, checks if the property is optional (by testing if {} extends a type with just that property), and filters via never. PickByType<T, V> selects only properties whose values match a given type: type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] }.

The most powerful custom utilities combine all these features. For example, a type that converts a flat API response type into a nested object based on dot-notation keys, or a type that generates a validated builder pattern where calling methods in a specific order is enforced at the type level. type Override<T, U> = Omit<T, keyof U> & U replaces matching properties. type StrictOmit<T, K extends keyof T> = Omit<T, K> prevents omitting non-existent keys. These patterns demonstrate that TypeScript's type system is Turing-complete — you can express virtually any type transformation if you understand the building blocks.`,shortAnswer:`Custom utility types combine mapped types, conditional types, key remapping, and infer. Common examples include DeepPartial, PickByType, RequiredKeys, and Override. Understanding the building blocks lets you create any type transformation.`,code:`// DeepPartial — recursively make all properties optional
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// DeepReadonly — recursively make all properties readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// PickByType — select properties by value type
type PickByType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface User {
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}
type StringFields = PickByType<User, string>;
// { name: string; email: string }

// Override — replace properties from another type
type Override<T, U> = Omit<T, keyof U> & U;
type UpdatedUser = Override<User, { age: string; role: string }>;
// { name: string; email: string; isActive: boolean; age: string; role: string }

// Nullable — make all properties nullable
type Nullable<T> = { [K in keyof T]: T[K] | null };

// RequiredKeys — extract keys of required properties
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface Config {
  host: string;
  port: number;
  debug?: boolean;
}
type ReqKeys = RequiredKeys<Config>; // "host" | "port"

// FunctionKeys — extract keys of function-valued properties
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// Merge two types, second takes precedence
type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? B[K]
    : K extends keyof A
    ? A[K]
    : never;
};`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-advanced-1`,tags:[`custom utility types`,`DeepPartial`,`mapped types`,`conditional types`,`type-level programming`],commonMistakes:[`Not handling edge cases like arrays and Dates in DeepPartial — object extends check matches arrays too, requiring special handling`,`Infinite recursion in recursive types when the base case does not properly terminate`,`Overcomplicating types when a simpler composition of built-in utilities would suffice`],followUps:[`How do you handle arrays and Date objects in DeepPartial without making them partial too?`,`What are the compile-time performance implications of deeply recursive types?`,`How do you test custom utility types to ensure they behave correctly?`],interviewTips:[`Being able to build DeepPartial or PickByType from scratch demonstrates strong command of the type system`,`Explain the building blocks step by step — interviewers care more about your reasoning than memorized solutions`],relatedTopics:[`ts-fundamentals-1`,`ts-type-safety-1`]}]},{id:`ts-type-safety-1`,title:`TypeScript Type Safety`,description:`Patterns and techniques for maximizing type safety in TypeScript, including type guards, type narrowing, discriminated unions, exhaustive checking, assertion functions, branded types, and the never type.`,category:`TypeScript`,difficulty:`Advanced`,tags:[`type guards`,`narrowing`,`discriminated unions`,`never`,`unknown`,`exhaustive checking`,`assertion functions`,`type predicates`,`branded types`],overview:`TypeScript's type safety goes beyond simple annotations — it includes a sophisticated system of type narrowing, guards, and patterns that progressively refine types through control flow analysis. This topic covers the full spectrum of type safety techniques: built-in type guards (typeof, instanceof, in), custom type predicates, discriminated unions for modeling state, exhaustive checking with never, assertion functions that combine runtime validation with type narrowing, and branded types for nominal typing in a structurally typed system.`,concepts:[`typeof type guard for primitive narrowing`,`instanceof type guard for class narrowing`,`in operator type guard for property checking`,`Custom type predicates with value is Type`,`Type narrowing through control flow analysis`,`Discriminated unions with a shared literal discriminant`,`Exhaustive switch/case checking with never`,`The never type: impossible values and bottom type`,`unknown vs any: safe top type versus unsafe escape hatch`,`Assertion functions with asserts keyword`,`Branded/opaque types for nominal typing`,`Satisfies operator for type validation without widening`],codeExamples:[{title:`Type Guards and Narrowing`,code:`// typeof guard
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // narrowed to string
  }
  return value.toFixed(2); // narrowed to number
}

// instanceof guard
function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message; // narrowed to Error
  }
  return String(error);
}

// in operator guard
interface Dog { bark(): void; breed: string; }
interface Cat { meow(): void; color: string; }

function speak(animal: Dog | Cat) {
  if ("bark" in animal) {
    animal.bark(); // narrowed to Dog
  } else {
    animal.meow(); // narrowed to Cat
  }
}

// Custom type predicate
function isString(value: unknown): value is string {
  return typeof value === "string";
}`,language:`typescript`,explanation:`TypeScript narrows types through control flow analysis when it encounters typeof, instanceof, in, or custom type predicates.`},{title:`Discriminated Unions and Exhaustive Checking`,code:`type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function handle<T>(result: Result<T>): T {
  if (result.success) {
    return result.data; // narrowed: { success: true; data: T }
  }
  throw result.error;   // narrowed: { success: false; error: Error }
}

// Exhaustive check helper
function assertNever(value: never): never {
  throw new Error(\`Unexpected value: \${value}\`);
}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "square":   return shape.side ** 2;
    case "triangle": return 0.5 * shape.base * shape.height;
    default:         return assertNever(shape); // compile error if a case is missing
  }
}`,language:`typescript`,explanation:`Discriminated unions use a shared literal property for narrowing. The assertNever pattern ensures every variant is handled at compile time.`}],relatedTopicIds:[`ts-fundamentals-1`,`ts-advanced-1`,`ts-react-1`],questions:[{id:`ts-type-safety-1`,question:`What are type guards in TypeScript and what are the different types?`,answer:`Type guards are expressions that narrow the type of a variable within a conditional block, allowing TypeScript's control flow analysis to refine broad types into more specific ones. They are the mechanism by which you safely work with union types, unknown values, and polymorphic data without resorting to type assertions.

TypeScript recognizes several built-in type guards. The typeof guard checks primitive types: typeof x === 'string' narrows x to string. It works for 'string', 'number', 'boolean', 'symbol', 'bigint', 'undefined', 'function', and 'object'. The instanceof guard narrows to class instances: if (error instanceof TypeError) narrows error to TypeError. The in operator checks for property existence: 'bark' in animal narrows animal to whichever union member has a bark property.

Custom type predicates let you define your own type guard functions. The return type annotation paramName is Type tells TypeScript that if the function returns true, the parameter has the specified type. For example, function isUser(value: unknown): value is User { ... } narrows the parameter to User in the truthy branch. This is the primary mechanism for validating external data (API responses, JSON parsing, form inputs) while getting compile-time type safety.

TypeScript also narrows types through truthiness checks (if (x) narrows out null/undefined), equality checks (x === 'hello' narrows to the literal 'hello'), and assignment (x = 'hello' narrows x to string within that scope). The control flow analysis is sophisticated: it tracks narrowing through if/else, switch, ternary operators, and even logical operators (&& and ||). Understanding these narrowing mechanisms is essential for writing code that is both type-safe and readable, avoiding the temptation to silence the compiler with assertions.`,shortAnswer:`Type guards narrow types in conditional blocks. Built-in guards include typeof (primitives), instanceof (classes), and in (property check). Custom type predicates (value is Type) define reusable guard functions.`,code:`// typeof guard
function process(input: string | number | boolean): string {
  if (typeof input === "string") return input.toUpperCase();
  if (typeof input === "number") return input.toFixed(2);
  return input ? "yes" : "no"; // narrowed to boolean
}

// instanceof guard
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function handleError(err: unknown): string {
  if (err instanceof ApiError) {
    return \`API Error \${err.statusCode}: \${err.message}\`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Unknown error";
}

// in operator guard
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim(); // Fish
  } else {
    animal.fly();  // Bird
  }
}

// Custom type predicate
interface User {
  type: "user";
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as any).type === "user" &&
    "name" in value &&
    "email" in value
  );
}

const data: unknown = JSON.parse('{"type":"user","name":"Alice","email":"a@b.com"}');
if (isUser(data)) {
  console.log(data.name); // safely narrowed to User
}`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`type guards`,`typeof`,`instanceof`,`in`,`type predicates`,`narrowing`],commonMistakes:[`Writing a type predicate function that returns true for invalid data — the compiler trusts your predicate unconditionally`,`Using typeof to check for arrays or null — typeof null is "object" and typeof [] is "object", requiring Array.isArray or null checks`,`Forgetting that instanceof does not work across different realms (iframes, Node.js vm modules)`],followUps:[`What is the difference between a type predicate and a type assertion?`,`How does control flow analysis handle type narrowing across function boundaries?`,`What are assertion functions and how do they differ from type predicates?`],interviewTips:[`Write a real type predicate for validating unknown API data — it demonstrates practical TypeScript skill`,`Mention the typeof null === "object" quirk and how to handle it`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-type-safety-2`,question:`How does type narrowing work through control flow analysis in TypeScript?`,answer:`Type narrowing is the process by which TypeScript refines a variable's type from a broader type to a more specific one based on control flow. The compiler tracks assignments, conditions, and returns to determine the precise type at each point in the code. This analysis is what makes TypeScript practical — without it, you would need constant type assertions.

The most common narrowing occurs through conditional checks. After if (typeof x === 'string'), the compiler knows x is a string in the if block and whatever remains of the union in the else block. This works through if/else chains, switch statements, ternary expressions, and logical operators. The compiler also narrows through truthiness: if (x) eliminates null and undefined from x's type. Equality comparisons narrow to specific values or types: x === null narrows to null, x === 'admin' narrows to the literal type 'admin'.

Narrowing is flow-sensitive and respects early returns, throws, and assignments. After if (!x) return, the code below knows x is truthy. After if (!x) throw new Error(), same effect. Assignment narrows within the assignment's scope: let x: string | number = 'hello' means x is string until reassigned. The compiler even tracks discriminant properties: for a discriminated union type { kind: 'a', data: string } | { kind: 'b', data: number }, checking kind narrows both the kind and data properties simultaneously.

Advanced narrowing includes the satisfies operator (TypeScript 4.9+), which validates a value against a type without widening it. const config = { port: 3000 } satisfies Config ensures config matches Config but preserves the literal type 3000 for port. The compiler also narrows through array methods: after array.filter((x): x is string => typeof x === 'string'), the result is typed as string[]. Understanding these flows lets you write TypeScript that is both maximally type-safe and readable.`,shortAnswer:`TypeScript narrows types through control flow: conditionals, typeof/instanceof/in checks, equality, truthiness, early returns, and discriminant properties. Each code path has the most specific type the compiler can determine.`,code:`// Narrowing through conditionals
function example(value: string | number | null) {
  if (value === null) {
    return; // value is null here, code below: string | number
  }

  if (typeof value === "string") {
    console.log(value.toUpperCase()); // string
  } else {
    console.log(value.toFixed(2)); // number
  }
}

// Truthiness narrowing
function greet(name: string | undefined) {
  if (name) {
    console.log(\`Hello, \${name}\`); // string (not undefined)
  }
}

// Narrowing with early return
function process(input: unknown): string {
  if (typeof input !== "string") {
    throw new Error("Expected string");
  }
  return input.toUpperCase(); // narrowed to string after throw
}

// Discriminant narrowing
type Result =
  | { status: "success"; data: string }
  | { status: "error"; error: Error }
  | { status: "loading" };

function render(result: Result) {
  switch (result.status) {
    case "success":
      return result.data;    // { status: "success"; data: string }
    case "error":
      return result.error.message; // { status: "error"; error: Error }
    case "loading":
      return "Loading...";   // { status: "loading" }
  }
}

// Narrowing with satisfies (TS 4.9+)
type Colors = Record<string, [number, number, number]>;
const palette = {
  red: [255, 0, 0],
  green: [0, 255, 0],
} satisfies Colors;
// palette.red is [number, number, number], not number[]
// palette still has literal keys "red" | "green"

// Narrowing through array filter with type predicate
const mixed: (string | null)[] = ["a", null, "b", null, "c"];
const strings: string[] = mixed.filter(
  (item): item is string => item !== null
);`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`narrowing`,`control flow`,`satisfies`,`discriminant`,`truthiness`],commonMistakes:[`Expecting narrowing to persist across function call boundaries — calling a function resets narrowing because the function could have side effects`,`Not realizing that truthiness narrowing eliminates 0, "", and false along with null and undefined`,`Relying on narrowing in callbacks where the variable could be reassigned between the check and the callback execution`],followUps:[`How does the satisfies operator differ from a type annotation?`,`Why does narrowing not persist in closures or callbacks?`,`How do assertion functions combine runtime checks with narrowing?`],interviewTips:[`Show the early-return narrowing pattern — it is a clean, practical style that interviewers appreciate`,`Mention the satisfies operator to demonstrate knowledge of recent TypeScript additions`],relatedTopics:[`ts-fundamentals-1`,`ts-advanced-1`]},{id:`ts-type-safety-3`,question:`What is the never type in TypeScript and how is it used?`,answer:`never is TypeScript's bottom type — it represents a value that can never occur. No value is assignable to never (except never itself), and never is assignable to every type. It appears in situations where code paths are unreachable, functions never return, or type-level computations produce impossible types.

The most direct use of never is in functions that never return. A function that always throws an error has return type never: function fail(msg: string): never { throw new Error(msg) }. An infinite loop also has return type never. This is distinct from void — void means the function returns but with no value; never means the function never reaches a return point. TypeScript uses this distinction in control flow analysis: after calling a never-returning function, the compiler knows subsequent code is unreachable.

never is the exhaustive check mechanism for discriminated unions. In a switch statement over a discriminated union, the default case should receive the discriminant variable. If all variants are handled, the variable is narrowed to never. If a new variant is added to the union but not handled in the switch, the variable will not be never in the default case, producing a compile error. The pattern function assertNever(x: never): never { throw new Error('Unexpected: ' + x) } codifies this: passing a non-never value is a compile error, alerting you to unhandled cases.

At the type level, never represents the empty set — a type with no possible values. Intersecting incompatible types produces never: string & number is never. In conditional types, never is used to filter union members: Exclude<'a' | 'b' | 'c', 'a'> uses a conditional type that returns never for the excluded member, and since T | never simplifies to T, the excluded member disappears from the union. Understanding never as the empty set makes its behavior in unions (absorbed), intersections (absorbs everything), and conditionals (filters) intuitive.`,shortAnswer:`never is the bottom type representing impossible values. It is used for functions that never return (throw/infinite loop), exhaustive checking in switch statements, and filtering unions in conditional types (never in a union is absorbed).`,code:`// Function that never returns
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) { /* ... */ }
}

// Exhaustive checking with never
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function assertNever(value: never): never {
  throw new Error(\`Unhandled case: \${JSON.stringify(value)}\`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "square":   return shape.side ** 2;
    case "triangle": return 0.5 * shape.base * shape.height;
    default:         return assertNever(shape);
    // If we add a new Shape variant without a case, shape won't be never
    // and this line will have a compile error
  }
}

// never in type-level computations
type T1 = string & number;    // never (incompatible intersection)
type T2 = string | never;     // string (never absorbed in union)
type T3 = never extends string ? true : false; // true (never extends everything)

// never in conditional types for filtering
type NonNullable<T> = T extends null | undefined ? never : T;
type T4 = NonNullable<string | null | undefined>; // string

// Impossible function parameter
type NoArgs<T extends never[]> = T;`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`never`,`bottom type`,`exhaustive checking`,`unreachable`,`type safety`],commonMistakes:[`Confusing never with void — void means no return value, never means the function never completes`,`Not using assertNever in switch defaults, missing compile-time safety when new union members are added`,`Not understanding that never in a union is absorbed (string | never = string) while in an intersection it absorbs (string & never = never)`],followUps:[`How does never relate to the empty set in type theory?`,`Why is never assignable to every type?`,`How do you use never to create exhaustive type checks outside of switch statements?`],interviewTips:[`The assertNever pattern for exhaustive checking is a must-know for TypeScript interviews`,`Explain never as the empty set — it makes all its behaviors logical and memorable`],relatedTopics:[`ts-advanced-1`]},{id:`ts-type-safety-4`,question:`What are discriminated unions and how do they enable exhaustive pattern matching?`,answer:`Discriminated unions (also called tagged unions) are a TypeScript pattern where each member of a union type has a common property — the discriminant — with a unique literal type value. This shared property lets TypeScript narrow the entire union to a specific member by checking just the discriminant, enabling safe access to variant-specific properties.

The structure is straightforward: define multiple types that share a property with distinct literal values. type Result = { status: 'success'; data: string } | { status: 'error'; error: Error } | { status: 'loading' } uses status as the discriminant. When you check result.status === 'success', TypeScript narrows the type to { status: 'success'; data: string }, making data safely accessible. This works in if/else chains, switch statements, and ternary expressions.

Exhaustive checking ensures every variant is handled. In a switch over the discriminant, TypeScript tracks which variants have been matched. If you handle all cases, the discriminant in the default branch is narrowed to never. Adding assertNever(x: never): never in the default case creates a compile-time guarantee: if a new variant is added to the union without being handled, the type of x in default is no longer never, and the compiler reports an error. This is a safety net against incomplete pattern matching.

Discriminated unions are the idiomatic way to model state machines, API responses, form states, and any domain where an entity can be in one of several distinct states with different associated data. They replace class hierarchies and inheritance-based polymorphism with a simpler, more composable pattern. Libraries like Redux use discriminated unions for action types, React Query uses them for query states, and domain modeling in functional TypeScript relies heavily on them. The pattern scales well: you can nest discriminated unions, combine them with generics, and use them with conditional types for powerful type-level dispatch.`,shortAnswer:`Discriminated unions share a literal-typed discriminant property. Checking it narrows to the specific variant. The assertNever pattern in switch defaults ensures every variant is handled at compile time.`,code:`// Discriminated union for API state
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function renderState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "idle":    return "Ready";
    case "loading": return "Loading...";
    case "success": return \`Data: \${JSON.stringify(state.data)}\`;
    case "error":   return \`Error: \${state.error.message}\`;
  }
}

// Exhaustive check guarantees all variants are handled
function assertNever(value: never): never {
  throw new Error(\`Unhandled: \${JSON.stringify(value)}\`);
}

type Action =
  | { type: "INCREMENT"; amount: number }
  | { type: "DECREMENT"; amount: number }
  | { type: "RESET" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT": return state + action.amount;
    case "DECREMENT": return state - action.amount;
    case "RESET":     return 0;
    default:          return assertNever(action);
  }
}

// Nested discriminated union
type Payment =
  | { method: "card"; card: { number: string; expiry: string } }
  | { method: "bank"; bank: { routing: string; account: string } }
  | { method: "crypto"; wallet: { address: string; network: "eth" | "btc" } };

function processPayment(payment: Payment) {
  switch (payment.method) {
    case "card":
      return chargeCard(payment.card.number);
    case "bank":
      return initTransfer(payment.bank.routing);
    case "crypto":
      return sendCrypto(payment.wallet.address, payment.wallet.network);
  }
}`,language:`typescript`,difficulty:`Intermediate`,type:`Scenario`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`discriminated unions`,`tagged unions`,`exhaustive checking`,`pattern matching`,`state machines`],commonMistakes:[`Choosing a discriminant property whose values are not unique across variants — each variant must have a distinct literal value`,`Forgetting the assertNever pattern in the switch default, losing compile-time exhaustive guarantees`,`Using optional discriminant properties — the discriminant must exist on every variant for narrowing to work`],followUps:[`How do discriminated unions compare to class hierarchies for polymorphism?`,`Can you use discriminated unions with generics for typed state machines?`,`How do React state management patterns like useReducer leverage discriminated unions?`],interviewTips:[`Model a real-world example (API state, payment methods, form steps) to show practical application`,`Always include the assertNever exhaustive check to demonstrate thoroughness`],relatedTopics:[`ts-advanced-1`,`ts-react-1`]},{id:`ts-type-safety-5`,question:`What are assertion functions in TypeScript and how do they differ from type predicates?`,answer:`Assertion functions are functions that throw an error if a condition is not met and narrow the type of their parameter for all subsequent code after the call. They use the asserts keyword in their return type annotation: asserts value is Type or simply asserts value. Unlike type predicates which narrow within a conditional block, assertion functions narrow the variable for the entire scope after the function call.

The syntax has two forms. asserts value is Type narrows the parameter to the specified type: function assertString(value: unknown): asserts value is string { if (typeof value !== 'string') throw new Error('Not a string'); }. After calling assertString(x), x is typed as string for all subsequent code — no if/else required. The simpler form asserts value just asserts truthiness: function assertDefined<T>(value: T | null | undefined): asserts value is T { if (value == null) throw new Error('Value is null'); }.

Type predicates (value is Type) are used in boolean-returning functions that serve as conditions. They narrow within the truthy/falsy branches of a conditional. Assertion functions, by contrast, either throw or proceed — there is no else branch. This makes assertion functions ideal for validation at the start of functions, where you want to fail fast and have the rest of the function work with the narrowed type. They are the TypeScript equivalent of assert statements in other languages.

Practical uses include validating function inputs, asserting environment variables exist, ensuring API response shapes, and validating configuration at startup. Assertion functions pair naturally with the fail-fast pattern: validate all preconditions at the top of a function, then write the main logic knowing all types are safe. Libraries like Node.js's built-in assert module and testing frameworks like Jest and Vitest define assertion functions so that assertions narrow types for subsequent code in tests.`,shortAnswer:`Assertion functions throw on invalid input and narrow the type for all code after the call (not just inside a conditional). They use asserts value is Type syntax and are ideal for fail-fast validation.`,code:`// Assertion function — narrows type for all subsequent code
function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(\`Expected string, got \${typeof value}\`);
  }
}

let input: unknown = getUserInput();
assertString(input);
console.log(input.toUpperCase()); // input is string here — no if/else needed

// Assert non-null
function assertDefined<T>(
  value: T | null | undefined,
  name: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(\`\${name} must be defined\`);
  }
}

const config: string | undefined = process.env.API_KEY;
assertDefined(config, "API_KEY");
console.log(config.length); // config is string after assertion

// Comparison: type predicate (used in conditions)
function isString(value: unknown): value is string {
  return typeof value === "string";
}

if (isString(input)) {
  console.log(input.toUpperCase()); // narrowed only inside this block
}
// input is still unknown here

// Complex assertion for object shapes
interface Config {
  host: string;
  port: number;
  database: string;
}

function assertValidConfig(value: unknown): asserts value is Config {
  if (typeof value !== "object" || value === null) {
    throw new Error("Config must be an object");
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.host !== "string") throw new Error("host must be a string");
  if (typeof obj.port !== "number") throw new Error("port must be a number");
  if (typeof obj.database !== "string") throw new Error("database must be a string");
}

const rawConfig: unknown = loadConfig();
assertValidConfig(rawConfig);
console.log(rawConfig.host); // narrowed to Config`,language:`typescript`,difficulty:`Advanced`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`assertion functions`,`asserts`,`type predicates`,`narrowing`,`validation`],commonMistakes:[`Writing an assertion function that does not actually throw — the compiler trusts the asserts annotation unconditionally`,`Using assertion functions where a type predicate would be more appropriate (when you want to handle both cases, not just throw)`,`Forgetting that assertion functions must throw (not return false) to satisfy the asserts contract`],followUps:[`Can assertion functions be async?`,`How do assertion functions interact with control flow analysis in try/catch?`,`How does Node.js assert module define assertion signatures?`],interviewTips:[`Contrast assertion functions with type predicates clearly — the key difference is scope of narrowing and error handling style`,`Show the assertDefined pattern — it is practical, concise, and commonly used in production code`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-type-safety-6`,question:`What are branded types (opaque types) in TypeScript and why are they useful?`,answer:`TypeScript uses structural typing — two types are compatible if their structure matches, regardless of their names. This means type UserId = string and type OrderId = string are interchangeable, even though mixing them up is a bug. Branded types solve this by adding a phantom property that makes structurally identical types incompatible, effectively simulating nominal typing.

The pattern involves adding a unique, non-existent property (the brand) to a base type: type UserId = string & { readonly __brand: unique symbol }. This intersection creates a type that is a string with an additional property that can never actually exist at runtime. Since the brand symbol is unique to each branded type, UserId and OrderId (with its own unique symbol) are incompatible — passing a UserId where an OrderId is expected is a compile error. The brand has zero runtime cost because it is purely a type-level construct.

To create branded values, you define constructor functions that perform validation and cast to the branded type: function createUserId(id: string): UserId { if (!isValidUUID(id)) throw new Error('Invalid user ID'); return id as UserId; }. This centralized validation ensures that any value of type UserId has been validated through the constructor. All functions that accept UserId can trust that the value is a valid, validated user ID without re-checking.

Branded types are powerful for domain modeling. They prevent mixing up IDs for different entities (UserID vs ProductID), ensure units are respected (Kilometers vs Miles), validate formats (Email, URL, PhoneNumber), and enforce business rules (PositiveNumber, NonEmptyString). Libraries like io-ts, Zod, and Effect use branded types extensively. The pattern works with any base type — numbers, strings, objects — and composes well with utility types and generics. It is one of the most effective ways to catch semantic bugs at compile time in a structurally typed language.`,shortAnswer:`Branded types add a phantom property to base types, making structurally identical types incompatible. This simulates nominal typing for IDs, units, and validated values with zero runtime overhead.`,code:`// Brand utility type
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

// Define branded types
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
type Email = Brand<string, "Email">;
type PositiveInt = Brand<number, "PositiveInt">;

// Constructor functions with validation
function createUserId(id: string): UserId {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Invalid UUID format for UserId");
  }
  return id as UserId;
}

function createEmail(value: string): Email {
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
    throw new Error("Invalid email format");
  }
  return value as Email;
}

function createPositiveInt(n: number): PositiveInt {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Must be a positive integer");
  }
  return n as PositiveInt;
}

// Type safety in action
function getUser(id: UserId): Promise<User> { /* ... */ }
function getOrder(id: OrderId): Promise<Order> { /* ... */ }

const userId = createUserId("550e8400-e29b-41d4-a716-446655440000");
const orderId = createUserId("other-uuid") as unknown as OrderId;

getUser(userId);   // OK
// getUser(orderId); // Error: OrderId not assignable to UserId
// getUser("raw-string"); // Error: string not assignable to UserId

// Branded values are still usable as their base type
console.log(userId.toUpperCase()); // string methods still work
console.log(createPositiveInt(5) + 10); // number operations still work`,language:`typescript`,difficulty:`Advanced`,type:`Scenario`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`branded types`,`opaque types`,`nominal typing`,`domain modeling`,`type safety`],commonMistakes:[`Forgetting to create constructor functions, allowing raw values to be cast to branded types anywhere in the codebase`,`Making the brand property non-unique between types, which defeats the purpose`,`Overusing branded types for every primitive, adding unnecessary complexity where plain types would suffice`],followUps:[`How do branded types compare to newtypes in Haskell or opaque types in Flow?`,`Can you use branded types with generics for a reusable validation pattern?`,`How do validation libraries like Zod implement branded types?`],interviewTips:[`The UserID vs OrderID example is compelling and immediately shows practical value`,`Emphasize zero runtime cost — branded types are erased during compilation`],relatedTopics:[`ts-advanced-1`]},{id:`ts-type-safety-7`,question:`How do you handle unknown types safely in TypeScript, especially for API responses and error handling?`,answer:`Handling unknown types safely is one of TypeScript's most practical type safety patterns. External data — API responses, JSON parsing, localStorage values, URL parameters, catch clause errors — enters your application as unknown or any. Establishing safe boundaries where you validate and narrow this data before it flows into your typed application is essential for preventing runtime errors.

The standard pattern for API responses involves typing the fetch result as unknown and then validating it with a type guard or assertion function. Instead of blindly casting JSON.parse output with as MyType (which provides no runtime safety), you create a validation function: function isApiResponse(data: unknown): data is ApiResponse { ... }. This function checks every required property's existence and type, and the type predicate annotation tells TypeScript to narrow the type when the function returns true.

Error handling is another critical boundary. TypeScript 4.4 introduced useUnknownInCatchVariables, which types catch clause errors as unknown instead of any. This forces you to narrow the error before accessing properties: catch (error) { if (error instanceof Error) { console.log(error.message); } }. This is important because not all thrown values are Error instances — you might catch strings, numbers, or arbitrary objects. A common utility function handles this: function getErrorMessage(error: unknown): string { if (error instanceof Error) return error.message; return String(error); }.

For comprehensive validation, consider using schema validation libraries like Zod, io-ts, or Valibot. These define schemas that both validate at runtime and infer TypeScript types: const UserSchema = z.object({ name: z.string(), age: z.number() }); type User = z.infer<typeof UserSchema>. The parse method validates unknown data and returns a typed value or throws. This is the gold standard for API boundary validation because it eliminates the need to write manual type guards and keeps the runtime validation and TypeScript type in sync automatically.`,shortAnswer:`Validate unknown data at boundaries (API, JSON, catch) with type guards, assertion functions, or schema validation libraries (Zod). Never cast unknown to a type without runtime validation.`,code:`// Safe API response handling
interface User {
  id: number;
  name: string;
  email: string;
}

// Type predicate for validation
function isUser(data: unknown): data is User {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.email === "string"
  );
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("Invalid user data from API");
  }
  return data; // safely narrowed to User
}

// Safe error handling with unknown
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (
    typeof error === "object" && error !== null &&
    "message" in error && typeof (error as any).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "An unknown error occurred";
}

async function safeOperation() {
  try {
    await riskyOperation();
  } catch (error: unknown) {
    console.error(getErrorMessage(error));
  }
}

// Schema validation with Zod (recommended for complex data)
// import { z } from "zod";
// const UserSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   email: z.string().email(),
// });
// type User = z.infer<typeof UserSchema>;
// const user = UserSchema.parse(unknownData); // throws if invalid

// Generic safe parse utility
function safeParse<T>(
  json: string,
  guard: (data: unknown) => data is T
): T | null {
  try {
    const data = JSON.parse(json);
    return guard(data) ? data : null;
  } catch {
    return null;
  }
}`,language:`typescript`,difficulty:`Intermediate`,type:`Scenario`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`unknown`,`validation`,`API safety`,`error handling`,`type guards`,`Zod`],commonMistakes:[`Using as Type to cast API responses without runtime validation — this provides no safety and crashes at runtime on unexpected data`,`Not handling non-Error thrown values in catch clauses — anything can be thrown in JavaScript`,`Writing validation code manually for every type instead of using schema validation libraries that keep types and validation in sync`],followUps:[`How do schema validation libraries like Zod infer TypeScript types from schemas?`,`What is the best practice for typing fetch wrappers in a TypeScript application?`,`How do you handle partial/evolving API responses during development?`],interviewTips:[`Show awareness of the validation boundary concept — external data must be validated before entering the typed application`,`Mentioning Zod or similar libraries shows you know the ecosystem beyond just raw TypeScript`],relatedTopics:[`ts-fundamentals-1`,`ts-react-1`]},{id:`ts-type-safety-8`,question:`How do you implement exhaustive checking in TypeScript beyond switch statements?`,answer:`Exhaustive checking ensures every variant of a union type is handled, catching missing cases at compile time. While the switch/assertNever pattern is the most common approach, TypeScript supports exhaustive checking in several other contexts — if/else chains, object lookup maps, and conditional type-level assertions.

The if/else chain approach mirrors the switch pattern. After each condition eliminates a union member, the variable's type narrows. In the final else, the variable should be never. You can either use assertNever or assign to a never-typed variable: const _exhaustive: never = value — this line produces a compile error if value is not never, meaning a variant was missed. This works identically to the switch approach but in if/else control flow.

Object lookup maps provide an elegant alternative. Create an object whose keys are every variant of the discriminant and whose values are handler functions: const handlers: Record<Status, () => void> = { idle: () => {}, loading: () => {}, success: () => {}, error: () => {} }. The Record type with a union key ensures every variant has a handler. If a new variant is added, TypeScript will report a missing property error. This approach is often cleaner than switch statements and avoids the need for assertNever.

For type-level exhaustive checking in generic code, you can use conditional types. type AssertExhaustive<T extends never> = T ensures a generic type parameter has been fully narrowed. Helper types like type UnhandledCases<T, Handled> = Exclude<T, Handled> extends never ? true : false verify at the type level that all members of a union have been covered. These patterns are useful in library code, middleware chains, and plugin systems where exhaustiveness needs to be checked structurally rather than in a specific control flow. Each approach has trade-offs: switch is readable, object maps are composable, and type-level checks work in generic contexts.`,shortAnswer:`Exhaustive checking works in switch (assertNever), if/else (assign to never variable), object maps (Record with union keys), and type-level assertions (Exclude extends never). Each ensures all union variants are handled.`,code:`// Method 1: switch + assertNever (classic)
function assertNever(value: never): never {
  throw new Error(\`Unhandled: \${JSON.stringify(value)}\`);
}

type Status = "idle" | "loading" | "success" | "error";

function getMessage(status: Status): string {
  switch (status) {
    case "idle":    return "Ready";
    case "loading": return "Loading...";
    case "success": return "Done!";
    case "error":   return "Failed";
    default:        return assertNever(status);
  }
}

// Method 2: if/else + never assignment
function getIcon(status: Status): string {
  if (status === "idle") return "⏸";
  if (status === "loading") return "⏳";
  if (status === "success") return "✅";
  if (status === "error") return "❌";
  const _exhaustive: never = status; // compile error if a case is missed
  return _exhaustive;
}

// Method 3: Object lookup map with Record
const statusMessages: Record<Status, string> = {
  idle: "Waiting for action",
  loading: "Please wait...",
  success: "Operation completed",
  error: "Something went wrong",
  // If a new Status is added, TypeScript requires it here
};

function getStatusMessage(status: Status): string {
  return statusMessages[status];
}

// Method 4: Type-level exhaustive check
type IsExhaustive<T extends never> = true;

type HandledStatuses = "idle" | "loading" | "success" | "error";
type Unhandled = Exclude<Status, HandledStatuses>;
// If Unhandled is never, all cases are handled
type Check = IsExhaustive<Unhandled>; // OK — Unhandled is never

// Practical: exhaustive event handler registration
type AppEvent =
  | { type: "LOGIN"; user: string }
  | { type: "LOGOUT" }
  | { type: "NAVIGATE"; path: string };

type EventHandlers = {
  [E in AppEvent as E["type"]]: (event: E) => void;
};
// Forces implementation of handlers for LOGIN, LOGOUT, and NAVIGATE`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`exhaustive checking`,`never`,`Record`,`pattern matching`,`discriminated unions`],commonMistakes:[`Relying on a default case that returns a generic value instead of assertNever, silently swallowing new unhandled variants`,`Forgetting to include the unreachable return after the never assignment in if/else chains`,`Not leveraging Record types for object lookups, missing the simplest form of exhaustive checking`],followUps:[`How do you handle exhaustive checking when the union is defined in a third-party library?`,`Can TypeScript support pattern matching similar to Rust or Scala?`,`How do mapped types provide exhaustive property coverage for event systems?`],interviewTips:[`Show multiple approaches to demonstrate versatility — the object map pattern is often underappreciated`,`The Record-based approach is cleaner than switch for many real-world use cases and worth highlighting`],relatedTopics:[`ts-advanced-1`]},{id:`ts-type-safety-9`,question:`What is the satisfies operator in TypeScript and when should you use it?`,answer:`The satisfies operator, introduced in TypeScript 4.9, validates that an expression conforms to a type without widening or changing the inferred type. It answers the question 'does this value match this shape?' while preserving the most specific type TypeScript can infer. This fills a gap that neither type annotations nor type assertions could address cleanly.

With a type annotation (const config: Config = { ... }), the value is widened to Config, losing specific literal types and autocomplete for specific keys. With a type assertion (const config = { ... } as Config), you are telling TypeScript to trust you without verifying the value matches. satisfies gives you both: validation that the value matches the type AND preservation of the inferred literal types.

The canonical example is configuration objects. const palette = { red: [255, 0, 0], green: '#00ff00' } satisfies Record<string, string | number[]> validates that all values are strings or number arrays, but palette.red is still typed as number[] (not string | number[]) and palette.green is still string. You get autocomplete for the specific keys 'red' and 'green' and the specific value types, while still catching errors if a value doesn't match the constraint.

satisfies is particularly useful in several patterns: validating object literals against a type while keeping literal key autocomplete, ensuring enum-like objects have the right shape without losing value specifics, validating function implementations match a type without widening the return type, and checking that configuration values match an interface while preserving const narrowing. It is especially powerful combined with as const: const config = { ... } as const satisfies Schema validates the frozen literal types against the schema. The satisfies operator has quickly become one of the most popular TypeScript features because it resolves a long-standing tension between type safety and type specificity.`,shortAnswer:`satisfies validates a value matches a type without widening the inferred type. It provides type-checking of annotations with the specificity of inference — validating shape while preserving literal types and autocomplete.`,code:`// Problem: annotation widens the type
type Palette = Record<string, string | number[]>;

// With annotation — loses specific types
const palette1: Palette = {
  red: [255, 0, 0],
  green: "#00ff00",
};
// palette1.red is string | number[] — lost the specific type
// palette1.blue would not error — Record<string, ...> accepts any key

// With satisfies — validates AND preserves specific types
const palette2 = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Palette;
// palette2.red is number[] — specific type preserved!
// palette2.green is string — specific type preserved!
// palette2.blue // Error: property does not exist

// Validation catches errors
const palette3 = {
  red: [255, 0, 0],
  green: true, // Error: boolean not assignable to string | number[]
} satisfies Palette;

// satisfies with as const
const routes = {
  home: "/",
  about: "/about",
  user: "/user/:id",
} as const satisfies Record<string, \`/\${string}\`>;
// routes.home is "/" (literal), not string
// Validates all values start with "/"

// Practical: typed event handlers
type EventConfig = Record<string, (...args: any[]) => void>;

const handlers = {
  onClick: (e: MouseEvent) => console.log(e.clientX),
  onKeyDown: (e: KeyboardEvent) => console.log(e.key),
} satisfies EventConfig;
// handlers.onClick parameter is MouseEvent (not any[])
// TypeScript validates each handler is a function

// satisfies for exhaustive object maps
type Status = "idle" | "loading" | "success" | "error";

const statusLabels = {
  idle: "Ready",
  loading: "Please wait",
  success: "Complete",
  error: "Failed",
} satisfies Record<Status, string>;
// Missing a status would be a compile error
// Each value preserves its literal type`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-type-safety-1`,tags:[`satisfies`,`type safety`,`inference`,`validation`,`literal types`],commonMistakes:[`Confusing satisfies with type annotations — satisfies does not change the inferred type, annotations do`,`Using satisfies when a simple type annotation would be more readable and the specificity is not needed`,`Not combining satisfies with as const when you want both immutability and validation`],followUps:[`How does satisfies interact with as const?`,`When would you choose a type annotation over satisfies?`,`Can satisfies be used in function return statements?`],interviewTips:[`The palette example is the canonical way to explain satisfies — use it to show the annotation vs satisfies trade-off clearly`,`Knowing satisfies was introduced in TS 4.9 demonstrates you follow TypeScript releases actively`],relatedTopics:[`ts-fundamentals-1`,`ts-advanced-1`]}]},{id:`ts-react-1`,title:`React with TypeScript`,description:`Comprehensive guide to typing React applications with TypeScript, including component props, hooks, events, refs, context, generic components, higher-order components, and custom hooks.`,category:`TypeScript`,difficulty:`Intermediate`,tags:[`react`,`props`,`hooks`,`events`,`refs`,`context`,`generic components`,`forwardRef`,`HOC`,`custom hooks`],overview:`TypeScript dramatically improves the React development experience by catching prop errors at compile time, providing autocomplete for component APIs, and documenting component contracts through types. This topic covers the essential patterns for typing React applications: component props (FC vs plain functions), state management with typed hooks, event handling, refs and forwardRef, context, generic components, higher-order components, and custom hooks. These patterns form the foundation of a well-typed React codebase.`,concepts:[`Typing component props: FC vs function declarations`,`Typing children and render props`,`useState with type parameter and type inference`,`useRef with element types and mutable refs`,`useReducer with discriminated union actions`,`useContext with typed context and null handling`,`Typing events: onChange, onClick, onSubmit, keyboard events`,`forwardRef with generic component types`,`Generic components for reusable typed containers`,`Typing higher-order components (HOCs)`,`Typing custom hooks with proper return types`,`React.ComponentProps and other React utility types`],codeExamples:[{title:`Component Props Patterns`,code:`// Plain function (preferred over FC)
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

function Button({ label, variant = "primary", disabled, onClick, children }: ButtonProps) {
  return (
    <button className={variant} disabled={disabled} onClick={onClick}>
      {children ?? label}
    </button>
  );
}

// Discriminated union props
type AlertProps =
  | { type: "success"; message: string }
  | { type: "error"; message: string; retry: () => void }
  | { type: "loading" };

function Alert(props: AlertProps) {
  switch (props.type) {
    case "success": return <div className="success">{props.message}</div>;
    case "error":   return <div className="error">{props.message} <button onClick={props.retry}>Retry</button></div>;
    case "loading": return <div className="loading">Loading...</div>;
  }
}`,language:`typescript`,explanation:`Plain function components with explicit prop interfaces are preferred over React.FC. Discriminated union props model different component states.`},{title:`Typed Hooks`,code:`// useState — type inference and explicit generics
const [count, setCount] = useState(0);          // inferred as number
const [user, setUser] = useState<User | null>(null); // explicit for null initial

// useReducer — discriminated union actions
type State = { count: number; status: "idle" | "loading" };
type Action =
  | { type: "INCREMENT"; amount: number }
  | { type: "RESET" }
  | { type: "SET_STATUS"; status: State["status"] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":  return { ...state, count: state.count + action.amount };
    case "RESET":      return { ...state, count: 0 };
    case "SET_STATUS": return { ...state, status: action.status };
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, status: "idle" });

// useRef — DOM element and mutable value
const inputRef = useRef<HTMLInputElement>(null); // for DOM elements
const intervalRef = useRef<number | null>(null); // for mutable values`,language:`typescript`,explanation:`Hooks leverage generics for type safety. useState infers from initial values. useReducer pairs with discriminated union actions. useRef has distinct patterns for DOM elements and mutable values.`}],relatedTopicIds:[`ts-fundamentals-1`,`ts-advanced-1`,`ts-type-safety-1`],questions:[{id:`ts-react-1`,question:`What is the difference between React.FC and plain function components for typing props?`,answer:`There are two primary ways to type React function components: using the React.FC (or React.FunctionComponent) type alias, and using plain function declarations with typed props. The React community has shifted decisively toward plain functions, and understanding why reveals important TypeScript nuances.

React.FC<Props> is a generic type that defines a function component. It automatically includes children in the props type (prior to React 18), provides a displayName property, and sets the return type to ReactElement | null. The component is typically written as const MyComponent: React.FC<MyProps> = (props) => { ... }. While this seems convenient, it has several drawbacks that led to its declining popularity.

The problems with React.FC include: it used to implicitly accept children even when your component does not support them (fixed in React 18's types but still a concern in older codebases); it does not support generics well (you cannot write const List: React.FC<ListProps<T>> = ..., because the generic must be on the function, not the type alias); it prevents you from narrowing the return type beyond ReactElement | null; and it is verbose for no functional benefit. The React team and major style guides (including the React TypeScript Cheatsheet) now recommend against using FC.

Plain function components simply declare props as the function parameter type: function Button(props: ButtonProps): ReactElement or with destructuring function Button({ label, onClick }: ButtonProps). This approach supports generics naturally (function List<T>(props: ListProps<T>)), allows explicit return type control, does not implicitly include children, and reads more like standard TypeScript. When you want to accept children, explicitly include children: React.ReactNode in your props interface. This makes the component's contract clear and avoids implicit behavior.`,shortAnswer:`React.FC adds implicit children, prevents generics, and restricts return types. Plain function components with typed props are now preferred — they support generics, explicit children, and standard TypeScript patterns.`,code:`// React.FC — declining pattern
import type { FC, ReactNode } from "react";

interface GreetingProps {
  name: string;
}

const Greeting: FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}</h1>;
};

// Plain function — preferred pattern
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
  children?: ReactNode; // explicit children when needed
}

function Button({ label, variant = "primary", onClick, children }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick}>
      {children ?? label}
    </button>
  );
}

// Generic component — only possible with plain functions
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage — T is inferred from items
<List
  items={[{ id: "1", name: "Alice" }, { id: "2", name: "Bob" }]}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>`,language:`typescript`,difficulty:`Intermediate`,type:`Conceptual`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`React.FC`,`function components`,`props`,`generics`,`children`],commonMistakes:[`Using React.FC by default without understanding its limitations, especially with generic components`,`Not explicitly typing children when the component should accept them — relying on implicit children is error-prone`,`Forgetting that React 18 types removed implicit children from FC, which can break upgrades if children was relied upon implicitly`],followUps:[`How do you type children to accept only specific child element types?`,`What is the difference between ReactNode, ReactElement, and JSX.Element?`,`How do you type a component that accepts all HTML attributes of a native element?`],interviewTips:[`Knowing the FC vs plain function debate and recommending plain functions shows you follow community best practices`,`The generic List component example demonstrates advanced React + TypeScript skill`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-react-2`,question:`How do you type useState and useReducer hooks in TypeScript?`,answer:`useState and useReducer are the most common state hooks in React, and TypeScript's generics make them type-safe with minimal annotation. Understanding when to rely on inference versus explicit generics is key to clean, correct component code.

useState infers its type from the initial value: useState(0) creates [number, Dispatch<SetStateAction<number>>]. For primitive initial values, inference works perfectly. However, when the initial value is null or undefined and the state will later hold a complex type, you need an explicit generic: useState<User | null>(null) tells TypeScript the state can be User or null. Without the generic, TypeScript infers the state as just null, and assigning a User object produces an error. The same applies to empty arrays: useState<string[]>([]) is clearer than letting TypeScript infer never[].

useReducer pairs naturally with discriminated union action types. The reducer function receives the current state and an action, and returns the new state. By typing the action parameter as a discriminated union (type Action = { type: 'INCREMENT'; amount: number } | { type: 'RESET' }), each case in the switch statement narrows to the specific action variant with its associated data. TypeScript infers the useReducer return type from the reducer function, so you get [State, Dispatch<Action>] automatically. The dispatch function only accepts valid Action objects, catching typos and missing payloads at compile time.

Advanced patterns include lazy initialization with useState(() => computeInitial()), where the type is inferred from the factory's return type. For useReducer, you can type the init function as the third parameter for lazy state computation. When state types are complex, defining them as separate interfaces keeps the component clean: interface FormState { values: Record<string, string>; errors: Record<string, string>; isSubmitting: boolean }. These typed state patterns ensure that every state update is checked at compile time, preventing an entire class of runtime bugs.`,shortAnswer:`useState infers from initial values; use explicit generics for null/undefined initials (useState<User | null>(null)). useReducer works with discriminated union actions for type-safe dispatch.`,code:`import { useState, useReducer } from "react";

// useState — inference from initial value
const [count, setCount] = useState(0);       // number
const [name, setName] = useState("Alice");   // string
const [isOpen, setIsOpen] = useState(false);  // boolean

// useState — explicit generic for null initial
interface User {
  id: string;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);
// Later: setUser({ id: "1", name: "Alice", email: "a@b.com" });

// useState — explicit for empty collections
const [items, setItems] = useState<string[]>([]);
const [cache, setCache] = useState<Map<string, User>>(new Map());

// useState — functional updates are typed
setCount(prev => prev + 1);      // prev is number
setItems(prev => [...prev, "new"]); // prev is string[]

// useReducer — typed state and discriminated union actions
interface TodoState {
  todos: { id: string; text: string; done: boolean }[];
  filter: "all" | "active" | "completed";
}

type TodoAction =
  | { type: "ADD_TODO"; text: string }
  | { type: "TOGGLE_TODO"; id: string }
  | { type: "DELETE_TODO"; id: string }
  | { type: "SET_FILTER"; filter: TodoState["filter"] };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, { id: crypto.randomUUID(), text: action.text, done: false }],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.id ? { ...t, done: !t.done } : t),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id),
      };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
  }
}

const initialState: TodoState = { todos: [], filter: "all" };
const [state, dispatch] = useReducer(todoReducer, initialState);

dispatch({ type: "ADD_TODO", text: "Learn TypeScript" }); // OK
// dispatch({ type: "ADD_TODO" }); // Error: missing 'text'
// dispatch({ type: "UNKNOWN" }); // Error: invalid action type`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`useState`,`useReducer`,`hooks`,`state management`,`discriminated unions`],commonMistakes:[`Not providing a generic when the initial state is null — useState(null) infers as null only, not the desired union`,`Forgetting to handle all action types in the reducer, losing exhaustive checking`,`Using the reducer return type as any or a loose type instead of the explicit state interface`],followUps:[`How do you type a useReducer with an init function for lazy initialization?`,`When should you use useReducer versus useState for complex state?`,`How do you share typed dispatch across components?`],interviewTips:[`The useReducer with discriminated unions pattern is a favorite interview topic — know it thoroughly`,`Show that you understand when inference is sufficient versus when explicit generics are needed`],relatedTopics:[`ts-type-safety-1`]},{id:`ts-react-3`,question:`How do you type React event handlers in TypeScript?`,answer:`Typing React events correctly is essential for type-safe form handling, user interactions, and DOM manipulation. React provides its own synthetic event types that wrap native DOM events with cross-browser compatibility. Understanding the event type hierarchy and how to apply it to handlers eliminates common errors and provides excellent autocomplete.

React events are typed through generic interfaces in the React namespace. The primary ones are: React.ChangeEvent<T> for onChange on inputs, selects, and textareas; React.MouseEvent<T> for onClick, onMouseDown, onMouseEnter; React.KeyboardEvent<T> for onKeyDown, onKeyUp, onKeyPress; React.FormEvent<T> for onSubmit on forms; React.FocusEvent<T> for onFocus, onBlur; and React.DragEvent<T> for drag-and-drop. The generic parameter T specifies the target element type (HTMLInputElement, HTMLButtonElement, etc.), giving you typed access to event.target and event.currentTarget.

There are two styles for typing event handlers: inline and extracted. Inline handlers benefit from contextual typing — TypeScript infers the event type from the JSX attribute: <input onChange={(e) => setName(e.target.value)} /> where e is automatically React.ChangeEvent<HTMLInputElement>. Extracted handlers need explicit annotation: const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }. For event handler props, use the React handler type aliases: onClick: React.MouseEventHandler<HTMLButtonElement> or the callback form onClick: (event: React.MouseEvent<HTMLButtonElement>) => void.

A common pattern for forms is typing the submit handler with React.FormEvent<HTMLFormElement> and accessing form data through event.currentTarget. For custom events or native DOM events in useEffect, use the native Event types (not React synthetic events): element.addEventListener('click', (e: MouseEvent) => { ... }). The distinction between React synthetic events and native DOM events catches many developers off guard — they have similar names but are different types from different namespaces.`,shortAnswer:`React provides generic synthetic event types: ChangeEvent<T>, MouseEvent<T>, KeyboardEvent<T>, FormEvent<T>. Inline handlers get contextual typing; extracted handlers need explicit annotation. The generic T specifies the target element type.`,code:`import type { ChangeEvent, MouseEvent, FormEvent, KeyboardEvent } from "react";

// Inline handlers — contextual typing (no annotation needed)
function SearchForm() {
  const [query, setQuery] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); search(query); }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") search(query); }}
      />
    </form>
  );
}

// Extracted handlers — explicit event type required
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleEmailChange} onKeyDown={handleKeyDown} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

// Typing event handler props
interface ButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onHover?: (event: MouseEvent<HTMLButtonElement>) => void;
}

// Using React handler type aliases
interface InputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
}

// Generic event handler for multiple input types
function handleChange<T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
  setter: (value: string) => void
) {
  return (e: ChangeEvent<T>) => setter(e.target.value);
}

// Native DOM events in useEffect (not React synthetic events)
useEffect(() => {
  const handleResize = (e: Event) => {
    console.log(window.innerWidth);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`events`,`ChangeEvent`,`MouseEvent`,`FormEvent`,`event handlers`],commonMistakes:[`Using native DOM Event types (MouseEvent) instead of React synthetic types (React.MouseEvent) in JSX handlers — they are different types`,`Typing event.target instead of event.currentTarget — target can be any child element, currentTarget is the element the handler is attached to`,`Not providing the correct element generic (e.g., using HTMLElement instead of HTMLInputElement), losing access to element-specific properties like value`],followUps:[`What is the difference between event.target and event.currentTarget in React?`,`How do you type custom events in React?`,`How do React synthetic events differ from native DOM events?`],interviewTips:[`Know the most common event types by heart: ChangeEvent, MouseEvent, FormEvent, KeyboardEvent`,`Demonstrating the inline vs extracted handler typing pattern shows practical React TypeScript experience`],relatedTopics:[`ts-fundamentals-1`]},{id:`ts-react-4`,question:`How do you type useRef and forwardRef in React with TypeScript?`,answer:`useRef serves two distinct purposes in React — holding a reference to a DOM element and storing a mutable value that persists across renders without causing re-renders. TypeScript distinguishes between these two use cases through the generic parameter and the initial value, and getting the types right is important for avoiding null-related errors.

For DOM references, the pattern is useRef<HTMLElementType>(null). The generic specifies the element type (HTMLInputElement, HTMLDivElement, HTMLButtonElement, etc.), and null is the initial value because the element does not exist until the component mounts. This creates a RefObject<HTMLElementType> where .current is typed as HTMLElementType | null. You must null-check before accessing: if (inputRef.current) { inputRef.current.focus(); }. TypeScript knows that after the component mounts and the ref is attached, current will be the element, but it cannot prove this statically.

For mutable value refs, the pattern is useRef<T>(initialValue) where the initial value is not null. This creates a MutableRefObject<T> where .current is directly assignable. Common uses include storing interval/timeout IDs (useRef<number | null>(null)), previous values, and instance variables. The key TypeScript distinction: if the generic includes null but the parameter is null (useRef<T | null>(null)), you get MutableRefObject. If only the generic is non-null (useRef<HTMLDivElement>(null)), you get RefObject — the read-only variant.

forwardRef is needed when a parent component needs a ref to a DOM element inside a child component. It wraps the component and exposes the ref parameter. The typing is forwardRef<RefType, PropsType>((props, ref) => { ... }). For generic components with forwardRef, TypeScript requires a workaround because forwardRef does not support generic components directly. The common solution is to cast: const List = forwardRef(function List<T>(props: ListProps<T>, ref: Ref<HTMLUListElement>) { ... }) as <T>(props: ListProps<T> & RefAttributes<HTMLUListElement>) => ReactElement. React 19's ref-as-prop pattern simplifies this by making ref a regular prop.`,shortAnswer:`useRef<HTMLElement>(null) creates a DOM ref (RefObject). useRef<T>(value) creates a mutable ref (MutableRefObject). forwardRef<RefType, Props> exposes child refs to parents. React 19 simplifies this with ref as a regular prop.`,code:`import { useRef, forwardRef, useImperativeHandle, type Ref } from "react";

// DOM ref — null initial, read-only .current
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // null-safe access
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// Mutable ref — stores values across renders
function Timer() {
  const intervalRef = useRef<number | null>(null);
  const [count, setCount] = useState(0);

  const start = () => {
    intervalRef.current = window.setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return <div>{count} <button onClick={start}>Start</button> <button onClick={stop}>Stop</button></div>;
}

// forwardRef — expose DOM element to parent
interface FancyInputProps {
  label: string;
  placeholder?: string;
}

const FancyInput = forwardRef<HTMLInputElement, FancyInputProps>(
  function FancyInput({ label, placeholder }, ref) {
    return (
      <label>
        {label}
        <input ref={ref} placeholder={placeholder} />
      </label>
    );
  }
);

// Parent using forwarded ref
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <FancyInput ref={inputRef} label="Name" />;
}

// useImperativeHandle — expose custom methods via ref
interface CounterHandle {
  increment: () => void;
  reset: () => void;
}

const Counter = forwardRef<CounterHandle, {}>(function Counter(props, ref) {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    increment: () => setCount(c => c + 1),
    reset: () => setCount(0),
  }));

  return <span>{count}</span>;
});

function Parent() {
  const counterRef = useRef<CounterHandle>(null);
  return (
    <>
      <Counter ref={counterRef} />
      <button onClick={() => counterRef.current?.increment()}>+</button>
    </>
  );
}`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`useRef`,`forwardRef`,`refs`,`useImperativeHandle`,`DOM refs`],commonMistakes:[`Using useRef<HTMLElement> instead of the specific element type (HTMLInputElement), losing access to element-specific properties`,`Forgetting null-checks on .current for DOM refs — the element is null until mount`,`Not understanding the RefObject vs MutableRefObject distinction based on the initial value and generic parameter`],followUps:[`How does React 19 change the ref pattern with ref as a prop?`,`When should you use useImperativeHandle versus exposing the DOM element directly?`,`How do you type a ref that can hold either a DOM element or a component handle?`],interviewTips:[`Distinguish between DOM refs and mutable value refs — it shows you understand both use cases`,`The useImperativeHandle pattern for exposing a custom API demonstrates advanced component design`],relatedTopics:[`ts-fundamentals-1`,`ts-advanced-1`]},{id:`ts-react-5`,question:`How do you type React Context with TypeScript?`,answer:`Typing React Context involves three key decisions: the context value type, handling the default value (especially null), and ensuring consumers can use the context without excessive null checks. The standard pattern involves creating a typed context, a provider component, and a custom hook that encapsulates the null check.

The basic pattern creates the context with createContext<Type>(defaultValue). If the context always has a valid value when consumed (because consumers are always inside a provider), but the default value is meaningless, you face a type tension. The common solution is createContext<Type | null>(null) with a custom hook that throws if the context is null: function useMyContext() { const ctx = useContext(MyContext); if (!ctx) throw new Error('Must be used within Provider'); return ctx; }. Consumers use the hook and get the non-null type, avoiding null checks at every usage site.

Alternatively, if a sensible default exists, use createContext<Type>(defaultValue) with the actual default. This avoids the null pattern entirely — consumers always get a valid value even outside a provider. This works well for theme contexts, locale contexts, and other settings with obvious defaults.

For complex contexts, type the provider's value prop explicitly and separate the state from the dispatch. A common pattern with useReducer is to create two contexts: a StateContext and a DispatchContext. This prevents unnecessary re-renders: components that only dispatch actions (like buttons) do not re-render when state changes. Type each context separately: const StateCtx = createContext<State | null>(null) and const DispatchCtx = createContext<Dispatch<Action> | null>(null). Generic contexts are also possible: createContext<ContextValue<T>> where T is determined by the provider. This pattern is used by library authors creating generic data providers.`,shortAnswer:`Type Context with createContext<T | null>(null) and a custom hook that throws on null for guaranteed non-null access. Split state and dispatch into separate contexts for performance. Use sensible defaults when available.`,code:`import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react";

// Pattern 1: Context with null default + custom hook
interface AuthState {
  user: { id: string; name: string; email: string } | null;
  isAuthenticated: boolean;
  token: string | null;
}

type AuthAction =
  | { type: "LOGIN"; user: AuthState["user"]; token: string }
  | { type: "LOGOUT" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
} | null>(null);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":  return { user: action.user, isAuthenticated: true, token: action.token };
    case "LOGOUT": return { user: null, isAuthenticated: false, token: null };
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null, isAuthenticated: false, token: null,
  });
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Consumer — no null check needed thanks to useAuth hook
function UserProfile() {
  const { state, dispatch } = useAuth(); // AuthState guaranteed
  if (!state.user) return <div>Not logged in</div>;
  return (
    <div>
      <span>{state.user.name}</span>
      <button onClick={() => dispatch({ type: "LOGOUT" })}>Logout</button>
    </div>
  );
}

// Pattern 2: Split state/dispatch contexts for performance
const ThemeStateCtx = createContext<{ theme: "light" | "dark" } | null>(null);
const ThemeDispatchCtx = createContext<Dispatch<{ type: "TOGGLE" }> | null>(null);

function useTheme() {
  const state = useContext(ThemeStateCtx);
  if (!state) throw new Error("useTheme must be within ThemeProvider");
  return state;
}

function useThemeDispatch() {
  const dispatch = useContext(ThemeDispatchCtx);
  if (!dispatch) throw new Error("useThemeDispatch must be within ThemeProvider");
  return dispatch;
}

// Pattern 3: Context with sensible default
interface I18nContextValue {
  locale: string;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: (key) => key, // identity function as default
});

const useI18n = () => useContext(I18nContext); // no null check needed`,language:`typescript`,difficulty:`Intermediate`,type:`Coding`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`context`,`useContext`,`createContext`,`providers`,`state management`],commonMistakes:[`Using createContext<Type>(undefined as any) to avoid the null pattern — this is a type assertion that hides bugs`,`Not creating a custom hook for context consumption, forcing every consumer to null-check manually`,`Putting state and dispatch in the same context, causing unnecessary re-renders for dispatch-only consumers`],followUps:[`How do you optimize context to prevent unnecessary re-renders?`,`When should you use context versus a state management library?`,`How do you test components that depend on context?`],interviewTips:[`The null-default + custom-hook pattern is the industry standard — demonstrate it confidently`,`Mentioning the split state/dispatch context optimization shows performance awareness`],relatedTopics:[`ts-type-safety-1`]},{id:`ts-react-6`,question:`How do you create generic React components in TypeScript?`,answer:`Generic React components accept a type parameter that makes the component reusable across different data types while maintaining type safety. Instead of typing a list component to only work with User objects, a generic list works with any type T, inferring it from the props passed at the usage site. This is one of the most powerful patterns in React + TypeScript.

The syntax uses the standard TypeScript generic function pattern: function List<T>(props: ListProps<T>) where ListProps<T> includes the type parameter in relevant prop types. At the usage site, TypeScript infers T from the provided props: <List items={users} renderItem={(user) => <span>{user.name}</span>} />. Here T is inferred as User from the items prop, and the renderItem callback automatically receives User-typed parameters. No explicit type annotation is needed at the call site.

Generic components can have constraints to ensure T has required properties: function List<T extends { id: string }>(props: ListProps<T>) ensures every item has an id, which you can use as the React key. Multiple type parameters are also possible: function DataGrid<TRow, TColumn>(props: GridProps<TRow, TColumn>) for components that need to relate multiple types.

A significant limitation is that forwardRef does not natively support generic components. The standard forwardRef<Ref, Props> signature requires concrete types. The workaround is a type assertion: cast the forwardRef result to a generic function type. React 19 addresses this by supporting ref as a regular prop, eliminating the need for forwardRef entirely. For generic components that need to accept arbitrary HTML attributes, you can extend the props with ComponentPropsWithoutRef<'div'> & GenericProps<T> using an intersection type. These patterns enable building truly reusable component libraries with full type safety.`,shortAnswer:`Generic components use function List<T>(props: ListProps<T>) syntax, with T inferred from prop values at usage. Constraints (T extends { id: string }) ensure required properties. forwardRef requires a type assertion workaround for generics.`,code:`import { type ReactNode, type Key } from "react";

// Basic generic component
interface SelectProps<T> {
  items: T[];
  value: T | null;
  onChange: (item: T) => void;
  getLabel: (item: T) => string;
  getKey: (item: T) => Key;
}

function Select<T>({ items, value, onChange, getLabel, getKey }: SelectProps<T>) {
  return (
    <ul role="listbox">
      {items.map((item) => (
        <li
          key={getKey(item)}
          role="option"
          aria-selected={item === value}
          onClick={() => onChange(item)}
        >
          {getLabel(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage — T is inferred from items
interface User { id: string; name: string; role: string; }
const users: User[] = [
  { id: "1", name: "Alice", role: "admin" },
  { id: "2", name: "Bob", role: "editor" },
];

<Select
  items={users}
  value={null}
  onChange={(user) => console.log(user.name)} // user is User
  getLabel={(u) => u.name}                    // u is User
  getKey={(u) => u.id}                        // u is User
/>

// Constrained generic — T must have an id
interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], row: T) => ReactNode;
  }[];
  onRowClick?: (row: T) => void;
}

function DataTable<T extends { id: string | number }>({
  data, columns, onRowClick,
}: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>{columns.map((col) => <th key={String(col.key)}>{col.header}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <td key={String(col.key)}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage with automatic type inference
<DataTable
  data={users}
  columns={[
    { key: "name", header: "Name" },
    { key: "role", header: "Role", render: (val) => <strong>{String(val)}</strong> },
  ]}
  onRowClick={(user) => navigate(\`/users/\${user.id}\`)}
/>`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`generic components`,`generics`,`reusable components`,`type inference`,`constraints`],commonMistakes:[`Using React.FC for generic components — FC does not support type parameters on the component itself`,`Over-constraining the generic, reducing reusability — only constrain what the component actually needs`,`Not leveraging type inference — explicitly passing type parameters at the call site when TypeScript can infer them from props`],followUps:[`How do you make a generic component work with forwardRef?`,`Can you create a generic component with default type parameters?`,`How does React 19 ref-as-prop simplify generic component typing?`],interviewTips:[`A generic Select or DataTable component is an excellent interview demonstration piece`,`Show how T flows from the items prop through to callback parameters — this is the key insight`],relatedTopics:[`ts-advanced-1`]},{id:`ts-react-7`,question:`How do you type higher-order components (HOCs) in TypeScript?`,answer:`Higher-order components (HOCs) are functions that take a component and return a new component with enhanced behavior. Typing HOCs in TypeScript is notoriously complex because you must correctly handle the wrapped component's props, the injected props, and any props the HOC itself needs. While hooks have largely replaced HOCs in modern React, understanding their typing is still relevant for existing codebases and libraries.

The basic pattern involves defining three prop types: the props injected by the HOC (InjectedProps), the props required by the wrapped component (the generic P), and the props the resulting component accepts (P minus InjectedProps). The HOC function signature is: function withSomething<P extends InjectedProps>(WrappedComponent: ComponentType<P>): ComponentType<Omit<P, keyof InjectedProps>>. The constraint P extends InjectedProps ensures the wrapped component accepts the injected props. Omit removes the injected props from the external API since the HOC provides them.

A concrete example is withAuth, which injects user and isAuthenticated props. The wrapped component must accept these in its props, but callers of the enhanced component do not pass them — the HOC provides them from context or a store. The typing ensures: (1) the wrapped component receives the injected props, (2) the enhanced component's callers only see the remaining props, and (3) any additional props are correctly forwarded.

HOC typing gets complicated with ref forwarding, static methods, and multiple HOC composition. For ref forwarding, you need forwardRef inside the HOC, which adds another type parameter. For static methods, you can use hoist-non-react-statics. For composition, each HOC adds and removes props, and TypeScript must track this through the chain. These complexities are a major reason the React community moved to hooks — a custom hook achieves the same injection pattern with simpler types: function useAuth(): { user: User; isAuthenticated: boolean }. Nevertheless, HOC typing demonstrates advanced TypeScript skills and understanding of component composition.`,shortAnswer:`HOC typing uses withX<P extends InjectedProps>(Component: ComponentType<P>): ComponentType<Omit<P, keyof InjectedProps>>. The generic P captures the wrapped component's props, and Omit removes injected props from the external interface.`,code:`import {
  type ComponentType,
  type ComponentPropsWithoutRef,
  useContext,
} from "react";

// HOC that injects authentication props
interface WithAuthProps {
  user: { id: string; name: string } | null;
  isAuthenticated: boolean;
}

function withAuth<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<Omit<P, keyof WithAuthProps>> {
  function WithAuthComponent(props: Omit<P, keyof WithAuthProps>) {
    const { state } = useAuth(); // from auth context

    const injectedProps: WithAuthProps = {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    };

    return <WrappedComponent {...(props as P)} {...injectedProps} />;
  }

  WithAuthComponent.displayName = \`withAuth(\${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })\`;

  return WithAuthComponent;
}

// Usage
interface DashboardProps extends WithAuthProps {
  title: string;
}

function Dashboard({ title, user, isAuthenticated }: DashboardProps) {
  if (!isAuthenticated) return <div>Please log in</div>;
  return <div>{title} - Welcome, {user?.name}</div>;
}

const EnhancedDashboard = withAuth(Dashboard);
// EnhancedDashboard only requires { title: string }
// user and isAuthenticated are injected by the HOC
<EnhancedDashboard title="My Dashboard" />

// HOC that adds loading state
interface WithLoadingProps {
  isLoading: boolean;
}

function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  LoadingComponent: ComponentType = () => <div>Loading...</div>
): ComponentType<P & WithLoadingProps> {
  function WithLoadingComponent({ isLoading, ...props }: P & WithLoadingProps) {
    if (isLoading) return <LoadingComponent />;
    return <WrappedComponent {...(props as P)} />;
  }
  return WithLoadingComponent;
}

// Modern alternative: custom hook (preferred)
function useAuthState() {
  const { state } = useAuth();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  };
}

function ModernDashboard({ title }: { title: string }) {
  const { user, isAuthenticated } = useAuthState();
  if (!isAuthenticated) return <div>Please log in</div>;
  return <div>{title} - Welcome, {user?.name}</div>;
}`,language:`typescript`,difficulty:`Advanced`,type:`Scenario`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`HOC`,`higher-order components`,`ComponentType`,`Omit`,`prop injection`],commonMistakes:[`Not using Omit to remove injected props from the enhanced component's external API`,`Losing the wrapped component's generic types — HOCs do not naturally preserve generics`,`Forgetting to forward refs and hoist static methods from the wrapped component`],followUps:[`How do you compose multiple typed HOCs without type conflicts?`,`Why are hooks generally preferred over HOCs in modern React?`,`How do you preserve generic component types through an HOC?`],interviewTips:[`Acknowledge that HOCs are a legacy pattern while demonstrating you can type them correctly`,`Show the equivalent custom hook solution to demonstrate modern React preference`],relatedTopics:[`ts-advanced-1`]},{id:`ts-react-8`,question:`How do you type custom hooks in React with TypeScript?`,answer:`Custom hooks are the primary mechanism for extracting and reusing stateful logic in React. TypeScript typing of custom hooks follows the same rules as typing regular functions, but there are several patterns specific to hooks that are worth mastering: return type tuples vs objects, generic custom hooks, and hooks that manage external state or side effects.

The return type is the most important typing decision. Hooks that return a pair (like useState) should return a tuple type: function useToggle(initial = false): [boolean, () => void]. Without an explicit return type annotation, TypeScript would infer the array type (boolean | (() => void))[], losing the positional type information. Use as const on the return array or annotate the return type explicitly. Hooks that return multiple values should use objects for clarity: function useForm<T>(initial: T): { values: T; errors: Partial<Record<keyof T, string>>; handleChange: (field: keyof T, value: T[keyof T]) => void; reset: () => void }.

Generic custom hooks parameterize the hook over data types. function useFetch<T>(url: string): { data: T | null; error: Error | null; loading: boolean } allows the caller to specify the expected data type. Combined with overloads or discriminated union return types, you can create hooks with precise state representations: a loading state should not have data, an error state should not have data, and a success state always has data.

Hooks that manage subscriptions, event listeners, or external stores need careful typing for cleanup functions and callback parameters. useEventListener<K extends keyof WindowEventMap>(event: K, handler: (e: WindowEventMap[K]) => void) leverages TypeScript's built-in DOM event type maps for full type safety. The combination of generics with keyof and mapped types in the DOM event interfaces gives you autocompletion for event names and correctly typed event objects — the same approach used by libraries like react-use and usehooks-ts.`,shortAnswer:`Custom hooks use explicit tuple return types ([value, setter]) or object returns for multiple values. Generic hooks (<T>) parameterize data types. Discriminated union returns model loading/error/success states precisely.`,code:`import { useState, useEffect, useCallback, useRef } from "react";

// Tuple return — explicit return type annotation needed
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}
const [isOpen, toggleOpen] = useToggle(); // isOpen: boolean, toggleOpen: () => void

// Object return — for multiple values
function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStored(prev => {
      const next = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setStored(initialValue);
  }, [key, initialValue]);

  return { value: stored, setValue, remove };
}

// Discriminated union return for precise state
type AsyncState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: Error };

function useFetch<T>(url: string): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: "idle", data: null, error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", data: null, error: null });

    fetch(url, { signal: controller.signal })
      .then(res => res.json() as Promise<T>)
      .then(data => setState({ status: "success", data, error: null }))
      .catch(err => {
        if (!controller.signal.aborted) {
          setState({ status: "error", data: null, error: err });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage with narrowing
const userState = useFetch<User>("/api/user");
if (userState.status === "success") {
  console.log(userState.data.name); // data is User, not null
}

// Typed event listener hook using DOM event maps
function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  target: Window | HTMLElement = window
) {
  const savedHandler = useRef(handler);
  savedHandler.current = handler;

  useEffect(() => {
    const listener = (e: Event) => savedHandler.current(e as WindowEventMap[K]);
    target.addEventListener(event, listener);
    return () => target.removeEventListener(event, listener);
  }, [event, target]);
}

// Usage — event type is inferred from event name
useEventListener("keydown", (e) => {
  console.log(e.key); // e is KeyboardEvent
});`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`custom hooks`,`generics`,`discriminated unions`,`useEffect`,`event listeners`],commonMistakes:[`Not annotating tuple return types explicitly, causing TypeScript to infer a union array instead of a tuple`,`Using loose return types (data: T | null) instead of discriminated unions, requiring consumers to do redundant null checks`,`Not memoizing callbacks returned from custom hooks, causing unnecessary re-renders in consumers`],followUps:[`How do you test custom hooks with TypeScript using @testing-library/react-hooks?`,`How do you create a custom hook that returns a discriminated union state?`,`What are the rules of hooks and how does TypeScript help enforce them?`],interviewTips:[`A well-typed useFetch with discriminated union states is an impressive interview demonstration`,`Showing the tuple vs object return type trade-off demonstrates thoughtful API design`],relatedTopics:[`ts-type-safety-1`,`ts-advanced-1`]},{id:`ts-react-9`,question:`How do you use React utility types like ComponentProps, PropsWithChildren, and HTMLAttributes?`,answer:`React ships with several utility types that simplify common prop typing patterns. These types extract prop types from existing components, merge HTML attributes with custom props, and handle children and ref forwarding — saving you from manually redefining types that React already knows.

ComponentProps<typeof Component> (and its variants ComponentPropsWithRef and ComponentPropsWithoutRef) extracts the props type from any React component. This is invaluable when wrapping third-party components or extending existing components: type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant: 'primary' | 'secondary' } gives you all native button attributes plus your custom variant prop. For custom components, ComponentProps<typeof MyComponent> extracts the props without requiring access to the prop interface definition.

HTMLAttributes<T> and its element-specific variants (InputHTMLAttributes, ButtonHTMLAttributes, etc.) provide all HTML attributes for a given element type. These are useful for wrapper components that pass through all native attributes: interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; }. The consumer can pass any valid input attribute (placeholder, maxLength, autoComplete, etc.) and they are correctly typed and forwarded.

PropsWithChildren<P> is a simple utility that adds children?: ReactNode to your props type. While straightforward, it documents intent clearly: the component explicitly accepts children. For stricter children typing, you can use ReactElement, ReactElement<SpecificProps>, or even a render prop pattern. The combination of these utility types with Omit lets you create components that override specific native attributes: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { onChange: (value: string) => void } replaces the native onChange type with a simpler callback that receives just the value string.`,shortAnswer:`ComponentProps extracts props from components or HTML elements. HTMLAttributes provides native element props for wrapper components. PropsWithChildren adds children typing. Combine with Omit to override specific attributes.`,code:`import {
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  forwardRef,
} from "react";

// Extract native element props and extend
type NativeButtonProps = ComponentPropsWithoutRef<"button">;

interface ButtonProps extends NativeButtonProps {
  variant: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, isLoading, children, ...nativeProps }, ref) {
    return (
      <button ref={ref} className={variant} disabled={isLoading} {...nativeProps}>
        {isLoading ? "Loading..." : children}
      </button>
    );
  }
);

// All native button props work:
<Button variant="primary" type="submit" aria-label="Submit form" onClick={() => {}}>
  Submit
</Button>

// Wrapper component with overridden onChange
interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  error?: string;
  onChange: (value: string) => void; // simplified onChange
}

function TextField({ label, error, onChange, ...inputProps }: TextFieldProps) {
  return (
    <div>
      <label>{label}</label>
      <input
        {...inputProps}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Usage — all input attributes supported, onChange is simplified
<TextField
  label="Email"
  type="email"
  placeholder="you@example.com"
  maxLength={100}
  autoComplete="email"
  onChange={(value) => setEmail(value)} // value is string, not event
  error={emailError}
/>

// PropsWithChildren — explicit children acceptance
type CardProps = PropsWithChildren<{
  title: string;
  footer?: ReactNode;
}>;

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="card">
      <header>{title}</header>
      <main>{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}

// Extract props from a custom component
function UserAvatar({ name, size }: { name: string; size: "sm" | "md" | "lg" }) {
  return <img alt={name} className={size} />;
}

type AvatarProps = ComponentPropsWithoutRef<typeof UserAvatar>;
// { name: string; size: "sm" | "md" | "lg" }

// Polymorphic component using "as" prop
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, "as">;

function Box<E extends React.ElementType = "div">({
  as,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || "div";
  return <Component {...props} />;
}

<Box as="a" href="/about">About</Box>    // anchor props
<Box as="button" onClick={() => {}}>Click</Box> // button props`,language:`typescript`,difficulty:`Advanced`,type:`Coding`,category:`TypeScript`,topicId:`ts-react-1`,tags:[`ComponentProps`,`HTMLAttributes`,`PropsWithChildren`,`polymorphic`,`utility types`],commonMistakes:[`Manually redefining HTML attributes that React utility types already provide`,`Not using Omit when overriding native attributes, creating conflicting type definitions`,`Using ComponentPropsWithRef when the component does not forward refs, or vice versa`],followUps:[`How do you type a fully polymorphic component with the as prop pattern?`,`What is the difference between ReactNode, ReactElement, and JSX.Element for children?`,`How do you restrict which HTML attributes are forwarded to the DOM?`],interviewTips:[`The Omit + native attributes pattern for wrapper components is a practical pattern that interviewers love to see`,`The polymorphic as prop component demonstrates advanced generics and React type system knowledge`],relatedTopics:[`ts-advanced-1`,`ts-fundamentals-1`]}]}];export{S as n,f as r,C as t};