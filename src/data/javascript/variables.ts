import type { Topic } from '../../types';

export const variablesTopics: Topic[] = [
  {
    id: 'js-variables',
    title: 'Variables and Scoping',
    description:
      'Deep dive into JavaScript variable declarations (var, let, const), hoisting behavior, the Temporal Dead Zone, and how scope rules govern variable visibility across your code.',
    category: 'JavaScript',
    difficulty: 'Beginner',
    tags: [
      'variables',
      'scope',
      'hoisting',
      'var',
      'let',
      'const',
      'temporal dead zone',
      'lexical scope',
      'block scope',
      'function scope',
    ],
    overview:
      'Variables are the foundation of every JavaScript program. Understanding how var, let, and const differ — and how JavaScript resolves variable names through its scoping rules — is essential for writing predictable, bug-free code. This topic covers declaration keywords, hoisting mechanics, the Temporal Dead Zone, and the full scope hierarchy from global to block level.',
    concepts: [
      'var declarations and function scoping',
      'let and const with block scoping',
      'Hoisting of variables and functions',
      'Temporal Dead Zone (TDZ)',
      'Global scope',
      'Function scope',
      'Block scope',
      'Lexical (static) scope',
      'Scope chain and variable resolution',
      'Variable shadowing',
      'Declaration vs initialization vs assignment',
      'Immutability semantics of const',
    ],
    relatedTopicIds: [
      'js-closures',
      'js-functions',
      'js-execution-context',
      'js-data-types',
    ],
    questions: [
      {
        id: 'js-vars-1',
        question: 'What is the difference between var, let, and const?',
        answer:
          'JavaScript provides three keywords for declaring variables: var, let, and const. Each has distinct scoping, hoisting, and reassignment behavior that significantly affects how your code runs.\n\nvar is function-scoped, meaning a var declaration inside a function is accessible anywhere within that function regardless of block boundaries like if statements or for loops. When var is declared outside any function it becomes a property of the global object (window in browsers, globalThis in Node.js). var declarations are hoisted to the top of their function and initialized to undefined, so you can reference a var variable before its declaration line without getting a ReferenceError — you simply get undefined.\n\nlet and const, introduced in ES6, are block-scoped. A block is any pair of curly braces: an if body, a for loop, or even a standalone block. Variables declared with let or const inside a block are not accessible outside it. Both are hoisted to the top of their block but are not initialized until the declaration statement is evaluated — the region between the start of the block and the declaration is called the Temporal Dead Zone (TDZ), and accessing the variable during this window throws a ReferenceError.\n\nThe key difference between let and const is reassignment. let allows you to reassign a new value after the initial declaration. const requires an initializer at declaration time and does not permit reassignment of the binding. However, const does not make the value immutable — if the value is an object or array, its properties or elements can still be mutated freely.\n\nIn modern JavaScript, the best practice is to default to const for any binding you do not intend to reassign, use let when reassignment is necessary (loop counters, accumulators), and avoid var entirely unless you have a specific reason to rely on function scoping or legacy behavior.',
        shortAnswer:
          'var is function-scoped, hoisted with undefined initialization, and allows redeclaration. let is block-scoped, hoisted but not initialized (TDZ), and allows reassignment. const is block-scoped like let but does not allow reassignment of the binding, though object contents remain mutable.',
        code: '// Scoping difference\nfunction scopeDemo() {\n  if (true) {\n    var a = 1;   // function-scoped — accessible outside the if\n    let b = 2;   // block-scoped — only inside this if\n    const c = 3; // block-scoped — only inside this if\n  }\n  console.log(a); // 1\n  // console.log(b); // ReferenceError\n  // console.log(c); // ReferenceError\n}\n\n// Hoisting difference\nconsole.log(x); // undefined (var is hoisted and initialized)\nvar x = 10;\n\n// console.log(y); // ReferenceError (TDZ)\nlet y = 20;\n\n// Reassignment\nlet count = 0;\ncount = 1; // OK\n\nconst name = "Alice";\n// name = "Bob"; // TypeError: Assignment to constant variable\n\n// const with objects — mutation is allowed\nconst user = { age: 25 };\nuser.age = 26; // perfectly fine\n// user = {};  // TypeError',
        language: 'javascript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: ['var', 'let', 'const', 'scope', 'hoisting'],
        commonMistakes: [
          'Assuming const makes objects immutable — it only prevents reassignment of the binding, not mutation of the value.',
          'Using var inside a for loop and expecting each iteration to have its own copy — var is function-scoped, so closures over the loop variable share the same reference.',
          'Redeclaring a let or const variable in the same scope, which throws a SyntaxError, unlike var which silently allows redeclaration.',
        ],
        followUps: [
          'How does var behave inside a for loop compared to let?',
          'What is the difference between Object.freeze() and const?',
          'Can you use const with destructuring?',
        ],
        interviewTips: [
          'Start by explaining scope differences (function vs block), then move to hoisting, and finish with reassignment rules — this shows structured thinking.',
          'Mention the best-practice recommendation: prefer const by default, use let when needed, avoid var.',
        ],
        relatedTopics: ['hoisting', 'scope', 'temporal dead zone'],
      },
      {
        id: 'js-vars-2',
        question: 'What is hoisting? What gets hoisted?',
        answer:
          'Hoisting is the JavaScript engine behavior where variable and function declarations are processed during the compilation phase before code is executed line by line. Conceptually, it is as though declarations are "moved" to the top of their enclosing scope, although the code is not physically rearranged.\n\nDuring the creation phase of an execution context, the engine scans the code for declarations. For var variables, the engine creates a binding in the current scope and initializes it to undefined. This is why referencing a var before its declaration line yields undefined rather than an error. For function declarations (the `function name() {}` syntax), both the name binding and the entire function body are hoisted, making the function callable before its declaration line.\n\nlet and const declarations are also hoisted — the engine is aware of them from the start of their block — but they are not initialized. They exist in an uninitialized state from the beginning of the block until the declaration line is reached. Accessing them before that line triggers a ReferenceError. This uninitialized region is the Temporal Dead Zone (TDZ).\n\nFunction expressions and arrow functions assigned to variables follow the hoisting rules of their declaration keyword. A function expression declared with var will be hoisted as undefined, so calling it before the assignment line throws a TypeError (undefined is not a function). If declared with let or const, calling it before the declaration throws a ReferenceError due to the TDZ.\n\nClass declarations are hoisted similarly to let — the name is known but accessing the class before its declaration throws a ReferenceError. This contrasts with function declarations, which are fully available before their declaration line.',
        shortAnswer:
          'Hoisting is JavaScript processing declarations during compilation before executing code. var is hoisted and initialized to undefined. Function declarations are fully hoisted (name + body). let, const, and class declarations are hoisted but remain uninitialized in the Temporal Dead Zone until their declaration line.',
        code: '// Function declarations are fully hoisted\ngreet(); // "Hello!" — works fine\nfunction greet() {\n  console.log("Hello!");\n}\n\n// var is hoisted with undefined\nconsole.log(score); // undefined\nvar score = 100;\n\n// let is hoisted but NOT initialized (TDZ)\n// console.log(price); // ReferenceError: Cannot access \'price\' before initialization\nlet price = 50;\n\n// Function expression with var — hoisted as undefined\n// sayHi(); // TypeError: sayHi is not a function\nvar sayHi = function () {\n  console.log("Hi!");\n};\n\n// Function expression with const — TDZ\n// sayBye(); // ReferenceError\nconst sayBye = () => {\n  console.log("Bye!");\n};',
        language: 'javascript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: ['hoisting', 'var', 'let', 'const', 'functions'],
        commonMistakes: [
          'Believing let and const are not hoisted — they are hoisted, but remain uninitialized (TDZ) unlike var which is initialized to undefined.',
          'Confusing function declarations with function expressions — only declarations are fully hoisted with their body.',
          'Assuming hoisting physically moves code — it is a conceptual model describing how the engine processes declarations during compilation.',
        ],
        followUps: [
          'What is the order of precedence when a function and a var share the same name?',
          'How does hoisting interact with modules (import/export)?',
          'Why do function declarations hoist differently than class declarations?',
        ],
        interviewTips: [
          'Draw a mental picture of two phases: creation phase (declarations processed) and execution phase (code runs line by line) — interviewers love this mental model.',
          'Always clarify the difference between "hoisted and initialized" (var) vs "hoisted but uninitialized" (let/const).',
        ],
        relatedTopics: [
          'execution context',
          'temporal dead zone',
          'function declarations',
        ],
      },
      {
        id: 'js-vars-3',
        question: 'What is the Temporal Dead Zone?',
        answer:
          'The Temporal Dead Zone (TDZ) is the period between the start of a scope (block, function, or module) and the point where a let or const variable is declared and initialized. During this window the variable exists in the scope (the engine knows about it due to hoisting) but it is in an uninitialized state, and any attempt to read or write it throws a ReferenceError.\n\nThe TDZ exists because of a deliberate design decision in the ES6 specification. With var, the automatic initialization to undefined masked bugs — developers could accidentally use a variable before assigning it a meaningful value and get silent undefined behavior instead of an obvious error. The TDZ enforces a discipline where you cannot use a variable before you have explicitly given it a value, making code more predictable and easier to debug.\n\nThe TDZ is not based on the physical order of lines in source code but on the temporal order of execution. For example, a function defined above a let declaration can reference that variable, but if the function is called before the let statement has been evaluated at runtime, a ReferenceError occurs. This nuance is important in scenarios involving closures and callbacks.\n\nThe TDZ also applies to default parameter values, class declarations, and even to const bindings in for-of and for-in loops at each iteration boundary. Understanding the TDZ helps explain why moving variable declarations to the top of their scope (or using them only after declaration) is a robust coding practice.\n\nIn summary, the TDZ is a safeguard that transforms what would be a silent undefined bug with var into an explicit error with let and const, catching programming mistakes at the earliest possible moment.',
        shortAnswer:
          'The Temporal Dead Zone (TDZ) is the region from the start of a block scope to the let or const declaration line where the variable is hoisted but uninitialized. Accessing it during this window throws a ReferenceError, enforcing that variables are used only after explicit initialization.',
        code: '// TDZ demonstration\n{\n  // TDZ for `message` starts here\n  // console.log(message); // ReferenceError: Cannot access \'message\' before initialization\n\n  let message = "Hello"; // TDZ ends here\n  console.log(message);  // "Hello"\n}\n\n// TDZ is temporal, not positional\nfunction logValue() {\n  console.log(value); // This line is fine IF called AFTER the let\n}\n\nlet value = 42;\nlogValue(); // 42 — called after declaration, no TDZ issue\n\n// TDZ in function parameters\n// function broken(a = b, b = 1) {} // ReferenceError: b is in TDZ when a\'s default is evaluated\nfunction working(a = 1, b = a) {\n  console.log(a, b); // 1, 1\n}\nworking();\n\n// typeof does NOT save you from TDZ\n// console.log(typeof undeclaredVar); // "undefined" — no error for truly undeclared\n// console.log(typeof tdzVar);        // ReferenceError — TDZ\n// let tdzVar = 10;',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: ['temporal dead zone', 'let', 'const', 'hoisting', 'TDZ'],
        commonMistakes: [
          'Thinking typeof is safe for TDZ variables — typeof throws a ReferenceError for variables in the TDZ, unlike truly undeclared variables.',
          'Confusing the TDZ with the variable not being hoisted — the variable IS hoisted, but it is in an uninitialized state.',
          'Assuming the TDZ only applies to let — const and class declarations also have a TDZ.',
        ],
        followUps: [
          'Does the TDZ apply to function parameters with default values?',
          'How does the TDZ interact with closures?',
          'What errors does the TDZ produce — ReferenceError or TypeError?',
        ],
        interviewTips: [
          'Explain why the TDZ exists (to catch bugs that var silently ignored) rather than just describing what it is — this shows deeper understanding.',
        ],
        relatedTopics: ['hoisting', 'let', 'const', 'block scope'],
      },
      {
        id: 'js-vars-4',
        question:
          'Why does accessing let before initialization throw an error?',
        answer:
          'When the JavaScript engine enters a new scope (block, function, or module), it performs a creation phase where it identifies all declarations. For let and const, the engine allocates a binding in memory but deliberately leaves it in a special "uninitialized" state rather than assigning undefined as it does with var. This is by design in the ECMAScript specification.\n\nThe engine tracks which bindings have been initialized. When code execution reaches the let or const declaration statement, the variable transitions from uninitialized to initialized (with either the assigned value or undefined for a bare `let x;`). Before that point, any read or write operation on the binding triggers a ReferenceError because the specification mandates that accessing an uninitialized binding is illegal.\n\nThis design choice was motivated by a real class of bugs in JavaScript. With var, variables are automatically initialized to undefined during hoisting. Developers frequently wrote code that accidentally used variables before assigning meaningful values, producing subtle undefined-related bugs that were difficult to trace. The ES6 committee decided that let and const should fail loudly instead, so developers are forced to declare and initialize variables before using them.\n\nThe mechanism behind this is part of the Environment Record specification. Each scope has an associated Environment Record that maps identifier names to values. For let and const, the record entry is created during the creation phase but marked as "not yet initialized." The GetBindingValue and SetMutableBinding abstract operations check this flag and throw if the binding is still uninitialized.\n\nThis behavior is consistent across all modern JavaScript engines (V8, SpiderMonkey, JavaScriptCore) and is not a quirk but a deliberate, spec-mandated feature that improves code reliability.',
        shortAnswer:
          'Accessing let before its declaration throws a ReferenceError because let bindings are hoisted but left in an "uninitialized" state by the engine. The specification mandates this to prevent the subtle bugs caused by var\'s automatic undefined initialization, enforcing a discipline where variables must be explicitly initialized before use.',
        code: '// var: hoisted and initialized to undefined (no error, just silent bug)\nconsole.log(a); // undefined\nvar a = 5;\nconsole.log(a); // 5\n\n// let: hoisted but NOT initialized (explicit error)\ntry {\n  console.log(b); // ReferenceError: Cannot access \'b\' before initialization\n} catch (e) {\n  console.log(e.message);\n}\nlet b = 10;\nconsole.log(b); // 10\n\n// Even a bare `let` without assignment initializes to undefined at declaration\nlet c;\nconsole.log(c); // undefined — this is fine, declaration was reached\n\n// The error is a ReferenceError, not TypeError or SyntaxError\ntry {\n  const d = e;\n  let e = 20;\n} catch (err) {\n  console.log(err instanceof ReferenceError); // true\n}',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: ['let', 'TDZ', 'hoisting', 'ReferenceError'],
        commonMistakes: [
          'Thinking the error means let is not hoisted — it IS hoisted, but the initialization behavior differs from var.',
          'Expecting a TypeError — the error is a ReferenceError because the binding exists but is not initialized.',
          'Believing `let x;` leaves x in the TDZ — a bare let declaration without an initializer sets the value to undefined at that line.',
        ],
        followUps: [
          'What is the difference between a ReferenceError and a TypeError in this context?',
          'How does the Environment Record track initialization status internally?',
        ],
        interviewTips: [
          'Reference the ECMAScript specification concepts (Environment Record, uninitialized binding) to demonstrate deep knowledge beyond surface-level understanding.',
        ],
        relatedTopics: [
          'temporal dead zone',
          'hoisting',
          'execution context',
          'environment record',
        ],
      },
      {
        id: 'js-vars-5',
        question: 'Explain lexical scope.',
        answer:
          'Lexical scope (also called static scope) means that the accessibility of variables is determined by the physical location of the code when it is written, not by the runtime call stack. When the JavaScript engine encounters a variable reference, it resolves the variable based on where the function was defined, not where it was invoked. This is determined at compile time by analyzing the nesting structure of functions and blocks.\n\nIn a lexically scoped language, every function carries a reference to its surrounding (outer) environment — the environment that existed when the function was created. This reference is preserved even if the function is passed around as a callback or returned from another function. This property is the foundation of closures: a function "closes over" the variables of its lexical environment and can access them long after the outer function has returned.\n\nConsider a function inner() defined inside function outer(). inner() has access to all variables declared in outer() because inner()\'s lexical scope includes outer()\'s scope. Even if inner() is returned and invoked somewhere else entirely, it still looks up variables in outer()\'s scope — not in the scope of wherever it is eventually called.\n\nLexical scope applies to all scoping levels: global, function, and block. A variable declared in a block is visible to all inner blocks and functions defined within that block. The engine traverses the nesting chain from the innermost scope outward until it finds the variable or reaches the global scope.\n\nAlmost all modern languages (JavaScript, Python, Rust, Go, Java) use lexical scoping. The alternative, dynamic scoping, resolves variables based on the runtime call stack and is found in some older languages like early Lisps and Bash shell. JavaScript exclusively uses lexical scoping (with the exception of the deprecated `with` statement and the special `this` keyword, which is resolved dynamically).',
        shortAnswer:
          'Lexical scope means variable access is determined by where code is written (the nesting of functions and blocks), not where it is called at runtime. A function always has access to variables from the scope in which it was defined, enabling closures.',
        code: 'const globalVar = "I am global";\n\nfunction outer() {\n  const outerVar = "I am from outer";\n\n  function inner() {\n    const innerVar = "I am from inner";\n    // inner can access all three — lexical scope chain\n    console.log(innerVar);  // "I am from inner"\n    console.log(outerVar);  // "I am from outer"\n    console.log(globalVar); // "I am global"\n  }\n\n  inner();\n  // console.log(innerVar); // ReferenceError — inner\'s scope is not accessible here\n}\n\nouter();\n\n// Lexical scope + closure\nfunction createCounter() {\n  let count = 0; // lexically enclosed\n  return function increment() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n// `increment` still accesses `count` from createCounter\'s scope',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: ['lexical scope', 'static scope', 'closures', 'scope chain'],
        commonMistakes: [
          'Confusing lexical scope with dynamic scope — JavaScript uses lexical scoping exclusively (except for `this` binding).',
          'Thinking inner functions cannot access outer variables after the outer function returns — closures preserve the lexical environment.',
          'Assuming arrow functions change scoping rules — they follow the same lexical scope rules as regular functions (though `this` binding differs).',
        ],
        followUps: [
          'How does lexical scope enable closures?',
          'What is the difference between lexical scope and dynamic scope?',
          'Does the `this` keyword follow lexical scoping rules?',
        ],
        interviewTips: [
          'Connect lexical scope to closures — interviewers often ask about scope as a stepping stone to closures, and making the link proactively demonstrates strong fundamentals.',
        ],
        relatedTopics: ['closures', 'scope chain', 'execution context'],
      },
      {
        id: 'js-vars-6',
        question: 'Explain scope chain.',
        answer:
          'The scope chain is the mechanism JavaScript uses to resolve variable references at runtime. When code accesses a variable, the engine starts looking in the current (innermost) scope. If the variable is not found there, it traverses outward through each enclosing scope — following the chain of lexical environments — until it either finds the variable or reaches the global scope. If the variable is not found in the global scope either, a ReferenceError is thrown.\n\nEach execution context (global, function, or block) has an associated Lexical Environment, which contains an Environment Record (the actual variable bindings) and an outer reference pointing to the parent Lexical Environment. The scope chain is formed by this linked list of outer references. When a function is created, it stores a reference to the Lexical Environment of the scope in which it was defined (its [[Environment]] internal slot), which becomes the starting point for the outer reference when the function is later invoked.\n\nThe scope chain is established at function creation time based on lexical nesting, not at call time. This is why closures work: even if a function is called from a completely different part of the code, its scope chain still points back to the environment where it was originally defined. The chain does not change based on where or how the function is invoked.\n\nThe resolution process is deterministic and follows a strict order: local scope first, then each enclosing scope in order, and finally the global scope. This means an inner variable with the same name as an outer variable "shadows" the outer one — the engine stops searching as soon as it finds the first match.\n\nUnderstanding the scope chain is critical for debugging variable resolution issues, understanding closures, and avoiding unintended global variable creation (which happens when you assign to a variable without declaring it in non-strict mode).',
        shortAnswer:
          'The scope chain is the linked sequence of lexical environments JavaScript traverses when resolving a variable reference. The engine looks in the current scope first, then each outer scope in order, until it finds the variable or reaches global scope. It is determined at function creation time based on lexical nesting.',
        code: 'const x = "global";\n\nfunction first() {\n  const x = "first";\n\n  function second() {\n    const x = "second";\n\n    function third() {\n      // Scope chain: third -> second -> first -> global\n      console.log(x); // "second" — found in second\'s scope, stops searching\n    }\n\n    third();\n  }\n\n  second();\n}\n\nfirst();\n\n// Scope chain with variable not in local scope\nconst color = "blue";\n\nfunction paintRoom() {\n  // `color` is not in paintRoom\'s scope\n  // Engine follows scope chain: paintRoom -> global\n  console.log(color); // "blue" — found in global scope\n}\n\npaintRoom();\n\n// Unintended global in non-strict mode\nfunction leaky() {\n  // oops = "leaked"; // Without declaration, creates a global variable (sloppy mode)\n  // In strict mode: ReferenceError: oops is not defined\n}\n\n// Demonstrating scope chain with closures\nfunction makeGreeter(greeting) {\n  return function (name) {\n    // Scope chain: anonymous -> makeGreeter -> global\n    return `${greeting}, ${name}!`;\n  };\n}\n\nconst hello = makeGreeter("Hello");\nconsole.log(hello("World")); // "Hello, World!"',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: [
          'scope chain',
          'lexical environment',
          'closures',
          'variable resolution',
        ],
        commonMistakes: [
          'Assuming the scope chain is based on the call stack — it is based on lexical nesting (where functions are defined), not where they are called.',
          'Forgetting that assigning to an undeclared variable in sloppy mode creates a global variable instead of throwing an error.',
          'Overlooking that inner scopes shadow outer variables with the same name, which can lead to confusing bugs.',
        ],
        followUps: [
          'How does the scope chain differ from the prototype chain?',
          'What role does the [[Environment]] internal slot play in scope chain creation?',
          'How does strict mode affect scope chain behavior?',
        ],
        interviewTips: [
          'Mention the internal mechanism (Lexical Environment with outer reference) to show you understand how the engine actually works, not just the surface behavior.',
          'Use a nested function example to visually walk through each step of the chain.',
        ],
        relatedTopics: [
          'lexical scope',
          'closures',
          'execution context',
          'lexical environment',
        ],
      },
      {
        id: 'js-vars-7',
        question: 'What are the different scopes in JavaScript?',
        answer:
          'JavaScript has four distinct scope levels that control where variables are visible and accessible: global scope, function scope, block scope, and module scope.\n\nGlobal scope is the outermost scope in a JavaScript program. Variables declared outside any function or block reside in the global scope and are accessible from anywhere in the code. In browsers, global var declarations become properties of the window object, while let and const declarations in the global scope do not attach to window — they live in a separate declarative Environment Record. In Node.js, each file is wrapped in a module function, so top-level var declarations are module-scoped rather than truly global.\n\nFunction scope is created whenever a function is invoked. All variables declared with var inside a function are accessible throughout the entire function body, regardless of any inner blocks. let and const within a function body (but outside any inner block) are also function-scoped in practice because the function body itself is their enclosing block. Each function call creates a new scope, so variables are independent between calls.\n\nBlock scope was introduced with ES6 via let and const. Any pair of curly braces — if/else bodies, for/while loops, switch cases, try/catch blocks, or standalone blocks — creates a block scope. Variables declared with let or const inside a block are not accessible outside it. This is the primary advantage over var, which ignores block boundaries entirely.\n\nModule scope applies to ES modules (files using import/export). Each module has its own top-level scope that is separate from the global scope. Variables declared at the top level of a module are not globally accessible — they must be explicitly exported and imported. This provides natural encapsulation and prevents global namespace pollution.',
        shortAnswer:
          'JavaScript has four scopes: global scope (accessible everywhere), function scope (created per function call, var is limited to this), block scope (created by curly braces, let/const are limited to this), and module scope (each ES module has its own isolated top-level scope).',
        code: '// 1. Global scope\nvar globalVar = "I am global"; // attaches to window in browsers\nlet globalLet = "I am global let"; // does NOT attach to window\n\n// 2. Function scope\nfunction demo() {\n  var funcVar = "function scoped";\n  let funcLet = "also function scoped (since function body is a block)";\n  \n  if (true) {\n    var stillFuncScoped = "var ignores blocks";\n    let blockOnly = "block scoped";\n  }\n  \n  console.log(stillFuncScoped); // "var ignores blocks"\n  // console.log(blockOnly);    // ReferenceError\n}\n\n// console.log(funcVar); // ReferenceError — function scoped\n\n// 3. Block scope\nfor (let i = 0; i < 3; i++) {\n  // `i` is scoped to this for-loop block\n}\n// console.log(i); // ReferenceError\n\nfor (var j = 0; j < 3; j++) {\n  // `j` leaks out of the block\n}\nconsole.log(j); // 3\n\n// 4. Module scope (in an ES module file)\n// const secret = "module-private"; // not accessible outside without export\n// export const shared = "accessible to importers";',
        language: 'javascript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: [
          'global scope',
          'function scope',
          'block scope',
          'module scope',
        ],
        commonMistakes: [
          'Assuming var respects block scope — var is only limited by function boundaries, not blocks like if/for/while.',
          'Thinking top-level declarations in Node.js are global — Node wraps each file in a function, making top-level vars module-scoped.',
          'Forgetting that let and const in the global scope do not become properties of the window object, unlike var.',
        ],
        followUps: [
          'How does scope differ between a script tag and an ES module in the browser?',
          'What is the difference between global scope in browsers vs Node.js?',
          'How do IIFEs create scope in pre-ES6 code?',
        ],
        interviewTips: [
          'Mention all four scopes including module scope — many candidates forget it, and including it shows comprehensive understanding.',
          'Highlight the var-in-loop pitfall as a concrete example of why block scope matters.',
        ],
        relatedTopics: [
          'var',
          'let',
          'const',
          'modules',
          'lexical scope',
        ],
      },
      {
        id: 'js-vars-8',
        question:
          'Can you reassign a const variable? What about const objects?',
        answer:
          'A const declaration creates a read-only binding between a name and a value. You cannot reassign the binding — attempting `constVar = newValue` throws a TypeError. However, const does not make the value itself immutable. This distinction between the binding and the value is one of the most misunderstood aspects of const.\n\nWhen const holds a primitive value (number, string, boolean, null, undefined, symbol, bigint), the value is effectively immutable because primitives are immutable by nature. There is no way to change the value without reassigning the binding, and reassignment is forbidden. So `const x = 5; x = 10;` throws a TypeError.\n\nWhen const holds a reference type (object, array, Map, Set, function), the const keyword only prevents you from pointing the variable at a different reference. The internal contents of the object or array are completely mutable. You can add, modify, or delete properties on a const object, push to a const array, or set entries in a const Map. The reference (the memory address the variable points to) cannot change, but the data at that address can.\n\nTo achieve true immutability for objects, you need additional mechanisms. Object.freeze() creates a shallow freeze — top-level properties become non-writable and non-configurable, but nested objects remain mutable. For deep immutability, you need a recursive freeze function or a library like Immer or Immutable.js. TypeScript also offers the `Readonly<T>` utility type and `as const` assertions for compile-time immutability checks.\n\nThe practical implication is that const communicates developer intent — "I will not reassign this binding" — rather than guaranteeing immutability. This is still valuable: it narrows the space of what the variable can become, making code easier to reason about.',
        shortAnswer:
          'You cannot reassign a const binding — that throws a TypeError. However, const objects and arrays are fully mutable: you can add, change, or delete their properties. const protects the binding (the reference), not the value it points to. Use Object.freeze() for shallow immutability.',
        code: '// Primitive const — effectively immutable\nconst PI = 3.14159;\n// PI = 3; // TypeError: Assignment to constant variable\n\n// Object const — reference is fixed, contents are mutable\nconst user = { name: "Alice", age: 25 };\nuser.age = 26;           // OK — mutating a property\nuser.email = "a@b.com";  // OK — adding a property\ndelete user.email;       // OK — deleting a property\n// user = { name: "Bob" }; // TypeError — reassigning the binding\n\nconsole.log(user); // { name: "Alice", age: 26 }\n\n// Array const — same rules\nconst numbers = [1, 2, 3];\nnumbers.push(4);    // OK\nnumbers[0] = 99;    // OK\n// numbers = [5, 6]; // TypeError\n\nconsole.log(numbers); // [99, 2, 3, 4]\n\n// Object.freeze for shallow immutability\nconst config = Object.freeze({ host: "localhost", port: 3000 });\nconfig.port = 8080; // silently fails (or TypeError in strict mode)\nconsole.log(config.port); // 3000 — unchanged\n\n// Freeze is shallow — nested objects are still mutable\nconst deep = Object.freeze({ nested: { value: 1 } });\ndeep.nested.value = 999;\nconsole.log(deep.nested.value); // 999 — nested mutation works',
        language: 'javascript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: ['const', 'immutability', 'Object.freeze', 'reference types'],
        commonMistakes: [
          'Thinking const makes objects immutable — it only prevents reassignment of the binding, not mutation of the referenced value.',
          'Relying on Object.freeze() for deep immutability — it only freezes the top level; nested objects remain mutable.',
          'Confusing const with final in Java or readonly in C# — JavaScript const is purely about the binding, not the value.',
        ],
        followUps: [
          'How would you implement deep freeze in JavaScript?',
          'What is the difference between Object.freeze(), Object.seal(), and Object.preventExtensions()?',
          'How does TypeScript\'s `as const` assertion differ from JavaScript\'s const?',
        ],
        interviewTips: [
          'Clearly distinguish between binding immutability (what const provides) and value immutability (what Object.freeze provides) — this is a common interview trap.',
        ],
        relatedTopics: [
          'Object.freeze',
          'immutability',
          'reference vs value types',
        ],
      },
      {
        id: 'js-vars-9',
        question: 'What is variable shadowing?',
        answer:
          'Variable shadowing occurs when a variable declared in an inner scope has the same name as a variable in an outer scope. The inner declaration "shadows" the outer one, meaning any reference to that name within the inner scope resolves to the inner variable. The outer variable is not modified or destroyed — it is simply inaccessible by that name within the inner scope.\n\nShadowing is a natural consequence of how the scope chain works. When the JavaScript engine encounters a variable reference, it starts looking in the current scope and moves outward through the chain. If the variable is found in the current scope, the engine stops searching and never reaches the outer scope\'s variable. The outer variable still exists and retains its value; it is just unreachable from the inner scope.\n\nShadowing can happen at any scope level. A let in a block can shadow a let in the enclosing function. A function parameter can shadow a global variable. A var in a function can shadow a global var. However, there are specific rules: you cannot shadow a let variable with a var in the same function scope (this throws a SyntaxError), though you can shadow a var with a let in an inner block.\n\nWhile shadowing is syntactically valid, it is generally considered a code smell because it reduces readability. When a developer sees a variable name, they may assume it refers to the outer binding, leading to confusion and bugs. Linters like ESLint have a "no-shadow" rule that warns against this practice.\n\nThere are legitimate uses of shadowing, such as in catch blocks where the error parameter shadows an outer variable, or in callbacks where a common parameter name (like `err` or `item`) naturally shadows. In these cases the shadowing is intentional and understood by convention.',
        shortAnswer:
          'Variable shadowing happens when an inner scope declares a variable with the same name as one in an outer scope. The inner variable takes precedence within its scope, making the outer one inaccessible by that name. The outer variable is unchanged — it is just hidden from the inner scope.',
        code: 'const name = "Global";\n\nfunction outer() {\n  const name = "Outer"; // shadows global `name`\n  console.log(name);    // "Outer"\n\n  function inner() {\n    const name = "Inner"; // shadows outer `name`\n    console.log(name);    // "Inner"\n  }\n\n  inner();\n  console.log(name); // "Outer" — inner\'s shadow doesn\'t affect this scope\n}\n\nouter();\nconsole.log(name); // "Global" — outer scopes are unaffected\n\n// Shadowing with different keywords\nvar x = 1;\n{\n  let x = 2; // let can shadow var in an inner block\n  console.log(x); // 2\n}\nconsole.log(x); // 1\n\n// Illegal shadowing — var cannot shadow let in the same function scope\n// let y = 1;\n// {\n//   var y = 2; // SyntaxError: Identifier \'y\' has already been declared\n// }\n\n// Common legitimate use: callback parameters\nconst items = [1, 2, 3];\nitems.forEach(function (item) {\n  // `item` parameter naturally shadows any outer `item`\n  console.log(item);\n});',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: [
          'variable shadowing',
          'scope',
          'scope chain',
          'naming conflicts',
        ],
        commonMistakes: [
          'Thinking shadowing modifies the outer variable — it only hides it within the inner scope; the outer variable remains unchanged.',
          'Using var to shadow a let in the same function scope — this throws a SyntaxError because var is function-scoped and conflicts with the existing let binding.',
          'Unintentionally shadowing variables and then being confused when the outer value is not what they expected.',
        ],
        followUps: [
          'What is the "no-shadow" ESLint rule and when would you enable it?',
          'Can function parameters shadow outer variables?',
          'What is the difference between shadowing and reassignment?',
        ],
        interviewTips: [
          'Mention the illegal shadowing case (var inside a block when let exists in the enclosing function) — it shows you understand the nuanced interaction between var and let scoping.',
        ],
        relatedTopics: ['scope chain', 'lexical scope', 'naming conventions'],
      },
      {
        id: 'js-vars-10',
        question:
          'Explain the difference between declaration and initialization.',
        answer:
          'In JavaScript, creating and using a variable involves up to three distinct steps: declaration, initialization, and assignment. Understanding these phases is essential for grasping hoisting, the Temporal Dead Zone, and how different keywords behave.\n\nDeclaration is the step where the JavaScript engine registers a variable name in the current scope. During the creation phase of an execution context, the engine scans the code for var, let, const, function, and class declarations and creates bindings for them in the appropriate Environment Record. At this point, the engine knows the variable exists, but it may not yet have a value. For var, declaration and initialization happen simultaneously — the variable is both registered and set to undefined. For let and const, only the declaration happens; the variable is registered but left in an uninitialized state (the TDZ).\n\nInitialization is the step where a variable receives its first value. For var, initialization to undefined happens during hoisting (at declaration time). For let, initialization happens when execution reaches the let statement — if no value is provided (`let x;`), the variable is initialized to undefined at that point. For const, initialization must happen at the declaration statement and an initializer is required (`const x = value;`). A bare `const x;` is a SyntaxError. The TDZ for let and const exists precisely because there is a gap between declaration (hoisting) and initialization (code execution reaching the statement).\n\nAssignment is the step where a new value is given to an already-initialized variable. With let and var, you can assign new values any number of times after initialization. With const, assignment after initialization is forbidden — the initial value provided at the declaration line is the only value the binding will ever hold.\n\nThis three-phase model explains many behaviors: why var gives undefined before its line (declared and initialized during hoisting), why let throws a ReferenceError before its line (declared but not initialized), and why const requires an initializer (declaration without initialization is meaningless for an immutable binding).',
        shortAnswer:
          'Declaration registers a variable name in the scope. Initialization gives it its first value. For var, both happen during hoisting (initialized to undefined). For let, declaration is hoisted but initialization waits until the code line is reached. For const, initialization must occur at the declaration line with a required value.',
        code: '// Declaration vs initialization vs assignment\n\n// var: declaration + initialization (to undefined) happen together during hoisting\nconsole.log(a); // undefined — declared AND initialized\nvar a;          // declaration line (already processed during hoisting)\na = 10;         // assignment\n\n// let: declaration is hoisted, initialization happens at the line\n// console.log(b); // ReferenceError — declared but NOT initialized (TDZ)\nlet b;           // initialization happens here (value: undefined)\nconsole.log(b);  // undefined\nb = 20;          // assignment\n\n// const: declaration + initialization must happen together at the line\n// const c;      // SyntaxError: Missing initializer in const declaration\nconst c = 30;   // declaration + initialization + assignment all at once\n// c = 40;       // TypeError — no reassignment\n\n// Function declarations: declaration + full initialization during hoisting\nconsole.log(greet()); // "hi" — fully hoisted\nfunction greet() {\n  return "hi";\n}\n\n// Function expressions: follow the variable keyword rules\n// console.log(sayHi()); // TypeError: sayHi is not a function (var — initialized to undefined)\nvar sayHi = function () {\n  return "hi";\n};',
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-variables',
        tags: [
          'declaration',
          'initialization',
          'assignment',
          'hoisting',
          'TDZ',
        ],
        commonMistakes: [
          'Conflating declaration and initialization — they are separate steps, and the gap between them is what creates the TDZ for let/const.',
          'Thinking `let x;` leaves x uninitialized — it initializes x to undefined at that line; the TDZ ends at the declaration statement.',
          'Forgetting that const requires an initializer — `const x;` is a SyntaxError, unlike `let x;` which is valid.',
        ],
        followUps: [
          'How do function declarations differ from variable declarations in terms of hoisting phases?',
          'What does the ECMAScript spec mean by "uninitialized binding"?',
          'Can you have a declaration without initialization in all three keywords?',
        ],
        interviewTips: [
          'Frame your answer around the three phases (declaration, initialization, assignment) and map each keyword to its behavior — this structured approach impresses interviewers.',
        ],
        relatedTopics: [
          'hoisting',
          'temporal dead zone',
          'execution context',
        ],
      },
    ],
  },
];
