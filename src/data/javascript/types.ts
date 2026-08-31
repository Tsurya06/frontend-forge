import type { Topic } from '../../types';

export const typesTopics: Topic[] = [
  {
    id: 'js-types',
    title: 'Primitive vs Reference Types',
    description:
      'Deep dive into JavaScript type system covering primitives, objects, copy semantics, type coercion, and equality comparison.',
    category: 'JavaScript',
    difficulty: 'Beginner',
    tags: [
      'primitives',
      'reference types',
      'type coercion',
      'typeof',
      'equality',
      'shallow copy',
      'deep copy',
    ],
    overview:
      'JavaScript has two fundamental categories of data types: primitives and reference types. Primitives (string, number, boolean, null, undefined, symbol, bigint) are immutable values stored directly in the variable\'s memory location. Reference types (objects, arrays, functions) are stored as pointers to heap-allocated memory. Understanding how these categories differ in assignment, comparison, and mutation is essential for writing correct JavaScript and avoiding subtle bugs around shared state, equality checks, and type coercion.',
    concepts: [
      'Primitive types: string, number, boolean, null, undefined, symbol, bigint',
      'Reference types: objects, arrays, functions, Date, RegExp, Map, Set',
      'Copy by value vs copy by reference',
      'Shallow copy vs deep copy techniques',
      'Implicit and explicit type coercion',
      'Abstract equality (==) vs strict equality (===) vs Object.is()',
      'typeof operator and its quirks',
      'instanceof operator and prototype chain checking',
      'Object.prototype.toString.call() for reliable type detection',
      'Falsy and truthy value coercion rules',
    ],
    relatedTopicIds: ['js-closures', 'js-prototypes', 'js-objects'],
    questions: [
      {
        id: 'js-types-1',
        question: 'What are primitive types in JavaScript?',
        answer:
          'JavaScript defines seven primitive types: string, number, boolean, null, undefined, symbol (ES2015), and bigint (ES2020). Primitives are the most fundamental building blocks of the language — they are not objects and have no methods of their own. When you call a method like "hello".toUpperCase(), JavaScript temporarily wraps the primitive in its corresponding wrapper object (String, Number, Boolean), invokes the method, and discards the wrapper.\n\nPrimitives are immutable. Once a primitive value is created, it cannot be altered. Operations on primitives always produce new values rather than mutating the original. For example, str.replace() does not modify str — it returns a new string. This immutability guarantee is a key difference from reference types, where in-place mutation is the norm.\n\nPrimitives are stored by value. When you assign a primitive to a new variable or pass it to a function, a completely independent copy of the value is created. Changing the copy has no effect on the original. This contrasts sharply with reference types, where assignment copies a pointer rather than the data itself.\n\nThe typeof operator can identify most primitives, but has a well-known quirk: typeof null returns "object" rather than "null". This is a legacy bug from the first implementation of JavaScript and cannot be fixed without breaking the web. To reliably check for null, use a strict equality check (value === null).\n\nSymbol provides unique, collision-free property keys useful for metaprogramming (e.g., Symbol.iterator). BigInt enables safe integer arithmetic beyond Number.MAX_SAFE_INTEGER (2^53 - 1). Both were added to fill gaps that could not be addressed by the original five primitives.',
        shortAnswer:
          'JavaScript has seven primitive types: string, number, boolean, null, undefined, symbol, and bigint. They are immutable, compared by value, and copied by value on assignment.',
        code: '// The seven primitives\nconst str: string = "hello";          // string\nconst num: number = 42;               // number\nconst bool: boolean = true;           // boolean\nconst nothing: null = null;           // null\nlet notAssigned: undefined = undefined; // undefined\nconst sym: symbol = Symbol("id");     // symbol\nconst big: bigint = 9007199254740992n; // bigint\n\n// Primitives are copied by value\nlet a = 10;\nlet b = a;\nb = 20;\nconsole.log(a); // 10 — unchanged\n\n// Primitives are immutable\nconst greeting = "hello";\nconst upper = greeting.toUpperCase();\nconsole.log(greeting); // "hello" — original unchanged\nconsole.log(upper);    // "HELLO" — new string returned\n\n// typeof quirk\nconsole.log(typeof null); // "object" (historic bug)',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['primitives', 'typeof', 'immutability'],
        commonMistakes: [
          'Assuming typeof null returns "null" — it actually returns "object"',
          'Trying to mutate a string in place (e.g., str[0] = "H") — strings are immutable',
          'Confusing BigInt with Number — they cannot be mixed in arithmetic without explicit conversion',
        ],
        followUps: [
          'How does autoboxing work when you call methods on primitives?',
          'What is the difference between a primitive and its wrapper object (e.g., "hello" vs new String("hello"))?',
          'Why was Symbol added to the language?',
        ],
        interviewTips: [
          'List all seven primitives confidently — interviewers notice if you forget symbol or bigint',
          'Mention the typeof null === "object" bug proactively to demonstrate deep knowledge',
        ],
      },
      {
        id: 'js-types-2',
        question:
          'Explain the difference between primitive and reference types.',
        answer:
          'The core distinction lies in how values are stored and accessed in memory. Primitive values (string, number, boolean, null, undefined, symbol, bigint) are stored directly in the variable\'s allocated memory on the stack. When you assign a primitive to another variable, the engine copies the actual value. Each variable then holds its own independent copy, so mutating one has no effect on the other.\n\nReference types — objects, arrays, functions, Date, RegExp, Map, Set, and all other non-primitive values — are stored on the heap. The variable itself holds a reference (pointer) to the heap location, not the data. Assignment or argument-passing copies the reference, so both variables end up pointing to the same underlying object. This means mutations through one reference are visible through every other reference to that object.\n\nThis distinction directly impacts equality comparisons. Two primitives are equal if their values match: 5 === 5 is true. Two reference-type variables are equal only if they point to the exact same object in memory — two distinct objects with identical contents are not === to each other. This is why [] === [] evaluates to false.\n\nImmutability is another practical difference. Primitives are inherently immutable — there is no API to change the value 42 in place. Objects are mutable by default; you can add, remove, or change properties at any time. To make objects behave more like primitives you must explicitly freeze them with Object.freeze(), and even that is only a shallow freeze.\n\nUnderstanding this split is critical for avoiding bugs related to unintended shared state, especially when passing objects to functions. A function that modifies a received object will affect the caller\'s data unless you defensively copy the object first.',
        shortAnswer:
          'Primitives are stored by value and are immutable — assignment copies the data. Reference types are stored by reference — assignment copies the pointer, so multiple variables can share and mutate the same object.',
        code: '// Primitive: copy by value\nlet x = "hello";\nlet y = x;\ny = "world";\nconsole.log(x); // "hello" — independent copy\n\n// Reference: copy by reference\nconst obj1 = { name: "Alice" };\nconst obj2 = obj1;\nobj2.name = "Bob";\nconsole.log(obj1.name); // "Bob" — same object!\n\n// Equality differences\nconsole.log(42 === 42);           // true  — same value\nconsole.log({} === {});           // false — different references\nconsole.log([1, 2] === [1, 2]);   // false — different references\n\nconst arr = [1, 2, 3];\nconst ref = arr;\nconsole.log(arr === ref);         // true  — same reference\n\n// Function argument behavior\nfunction increment(val: number) {\n  val += 1; // does NOT affect the caller\n}\n\nfunction addProp(obj: Record<string, string>) {\n  obj.added = "yes"; // DOES affect the caller\n}\n\nlet count = 0;\nincrement(count);\nconsole.log(count); // 0\n\nconst data: Record<string, string> = {};\naddProp(data);\nconsole.log(data); // { added: "yes" }',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['primitives', 'reference types', 'memory', 'equality'],
        commonMistakes: [
          'Expecting object assignment to create an independent copy — it only copies the reference',
          'Comparing two distinct objects/arrays with === and expecting true because their contents match',
          'Forgetting that function arguments follow the same copy rules — objects are passed by reference, primitives by value',
        ],
        followUps: [
          'How does garbage collection decide when to free a reference-type object?',
          'Can you make an object truly immutable in JavaScript?',
          'What is the difference between passing by reference and passing a reference by value?',
        ],
        interviewTips: [
          'Draw a simple memory diagram showing stack variables pointing to heap objects — visual explanations impress interviewers',
          'Clarify that JavaScript is technically "pass by sharing" — references are copied by value, not true pass-by-reference',
        ],
      },
      {
        id: 'js-types-3',
        question:
          'What happens when you copy an object vs a primitive?',
        answer:
          'When you copy a primitive, the engine duplicates the actual value. The new variable receives its own independent slot in memory. Modifying one variable has zero effect on the other. This is straightforward and matches most developers\' intuition about how assignment works.\n\nWhen you copy an object (via simple assignment), the engine copies the reference — a pointer to the heap-allocated data — not the data itself. Both the original and the copy now point to the same location in memory. Any mutation performed through either variable is visible through both. This shared-state behavior is the single most common source of bugs for developers new to JavaScript.\n\nTo create an independent copy of an object, you need an explicit copying mechanism. For shallow copies you can use the spread operator ({ ...obj }), Object.assign({}, obj), or Array.from(arr) / [...arr] for arrays. These produce a new top-level object whose own properties are duplicated. However, if any property value is itself a reference type (nested object or array), only the reference to that nested value is copied — the nested data is still shared.\n\nFor true independence you need a deep copy. The modern approach is structuredClone(obj), available in all major runtimes since 2022. It recursively clones nested objects, arrays, Maps, Sets, Dates, RegExps, and more. Older codebases often used JSON.parse(JSON.stringify(obj)), which works for JSON-safe data but silently drops functions, undefined, symbols, and special objects like Date (serialized as a string). Libraries like Lodash provide _.cloneDeep() as another reliable option.\n\nIn practice, decide the copy depth based on your mutation needs. If you only modify top-level properties, a shallow copy is sufficient and more performant. If you need to mutate nested structures without affecting the original, reach for structuredClone or a library deep-clone.',
        shortAnswer:
          'Copying a primitive duplicates the value — changes to the copy don\'t affect the original. Copying an object duplicates the reference — both variables point to the same data. Use spread/Object.assign for shallow copies or structuredClone for deep copies.',
        code: '// Primitive copy — fully independent\nlet a = 5;\nlet b = a;\nb = 99;\nconsole.log(a); // 5\n\n// Object copy — shared reference\nconst original = { x: 1, nested: { y: 2 } };\nconst copy = original;\ncopy.x = 100;\nconsole.log(original.x); // 100 — both point to same object\n\n// Shallow copy with spread\nconst shallow = { ...original };\nshallow.x = 999;\nconsole.log(original.x); // 100 — top-level is independent\nshallow.nested.y = 999;\nconsole.log(original.nested.y); // 999 — nested is still shared!\n\n// Deep copy with structuredClone\nconst deep = structuredClone(original);\ndeep.nested.y = 0;\nconsole.log(original.nested.y); // 999 — fully independent\n\n// Array copies\nconst nums = [1, 2, [3, 4]];\nconst shallowArr = [...nums];\nshallowArr[0] = 99;\nconsole.log(nums[0]); // 1 — top-level independent\n(shallowArr[2] as number[])[0] = 99;\nconsole.log((nums[2] as number[])[0]); // 99 — nested shared',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['copy', 'shallow copy', 'deep copy', 'spread', 'structuredClone'],
        commonMistakes: [
          'Believing spread operator creates a deep copy — it is only shallow',
          'Using JSON.parse(JSON.stringify()) for objects that contain functions, undefined, or Dates',
          'Forgetting that Array.slice() and Array.from() also produce only shallow copies',
        ],
        followUps: [
          'What limitations does structuredClone have compared to a manual recursive clone?',
          'How do immutable data libraries (Immer, Immutable.js) solve the copy problem?',
          'When would a shallow copy be preferable to a deep copy?',
        ],
        interviewTips: [
          'Mention structuredClone as the modern best practice — many interviewers want to see that you stay current',
          'Be ready to whiteboard a simple recursive deep-clone function to demonstrate understanding',
        ],
      },
      {
        id: 'js-types-4',
        question:
          'What is shallow copy vs deep copy? How to achieve each?',
        answer:
          'A shallow copy creates a new object and copies over all own, enumerable properties from the source. For primitive-valued properties this produces independent values. For reference-valued properties (nested objects, arrays), only the pointer is copied, so the original and the clone share the same nested data. Mutations to nested structures propagate across both objects.\n\nA deep copy recursively duplicates every level of nesting, producing a completely independent object graph. No property at any depth shares a reference with the source. This is the safest approach when you intend to mutate nested data without side effects, but it is more expensive in both time and memory.\n\nShallow copy techniques include the spread operator ({ ...obj } or [...arr]), Object.assign({}, obj), Array.prototype.slice(), and Array.from(). These are fast and cover the common case where you only need to change top-level properties — for example, when updating state in a React reducer by spreading the previous state and overriding one field.\n\nFor deep copies, structuredClone() is the recommended built-in since 2022. It handles nested objects, arrays, Maps, Sets, Dates, RegExps, ArrayBuffers, and even circular references. Its main limitations are that it cannot clone functions, DOM nodes, or objects with non-configurable property descriptors (getters/setters). For those edge cases, Lodash\'s _.cloneDeep() or a custom recursive function is necessary. The legacy JSON round-trip (JSON.parse(JSON.stringify(obj))) works only for JSON-serializable data and silently corrupts or drops non-JSON values.\n\nChoosing between shallow and deep depends on the shape of your data and what you plan to mutate. Shallow copies are cheaper and sufficient for flat or read-only nested structures. Deep copies are essential when downstream code may modify nested values and the original must remain untouched.',
        shortAnswer:
          'Shallow copy duplicates only the top-level properties — nested references are still shared. Deep copy recursively clones every level. Use spread/Object.assign for shallow; use structuredClone() or Lodash cloneDeep for deep.',
        code: '// --- Shallow copy techniques ---\nconst src = { a: 1, b: { c: 2 } };\n\n// 1. Spread\nconst s1 = { ...src };\n\n// 2. Object.assign\nconst s2 = Object.assign({}, src);\n\n// Both share src.b\nconsole.log(s1.b === src.b); // true\n\n// --- Deep copy techniques ---\n\n// 1. structuredClone (recommended)\nconst d1 = structuredClone(src);\nconsole.log(d1.b === src.b); // false — fully independent\n\n// 2. JSON round-trip (limited)\nconst d2 = JSON.parse(JSON.stringify(src));\nconsole.log(d2.b === src.b); // false\n\n// JSON limitation demo\nconst complex = {\n  date: new Date(),\n  fn: () => "hi",\n  undef: undefined,\n  regex: /abc/g,\n};\nconst jsonCopy = JSON.parse(JSON.stringify(complex));\nconsole.log(typeof jsonCopy.date);  // "string" — Date became a string\nconsole.log(jsonCopy.fn);           // undefined — function dropped\nconsole.log(jsonCopy.undef);        // undefined — key dropped entirely\nconsole.log(jsonCopy.regex);        // {} — RegExp became empty object\n\n// 3. Manual recursive clone\nfunction deepClone<T>(value: T): T {\n  if (value === null || typeof value !== "object") return value;\n  if (value instanceof Date) return new Date(value.getTime()) as T;\n  if (value instanceof RegExp) return new RegExp(value.source, value.flags) as T;\n  if (Array.isArray(value)) return value.map(deepClone) as T;\n  const result = {} as Record<string, unknown>;\n  for (const key of Object.keys(value as Record<string, unknown>)) {\n    result[key] = deepClone((value as Record<string, unknown>)[key]);\n  }\n  return result as T;\n}',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['shallow copy', 'deep copy', 'structuredClone', 'Object.assign'],
        commonMistakes: [
          'Assuming Object.assign or spread produces a deep copy',
          'Using JSON round-trip on objects containing Date, RegExp, Map, Set, or functions',
          'Forgetting that structuredClone cannot clone functions or DOM nodes',
        ],
        followUps: [
          'How does structuredClone handle circular references?',
          'How would you deep-clone an object with getters and setters?',
          'What is structural sharing and how do libraries like Immer use it?',
        ],
        interviewTips: [
          'Know at least three shallow-copy methods and two deep-copy methods',
          'If asked to implement deep clone, handle arrays, plain objects, and Date as a minimum',
        ],
      },
      {
        id: 'js-types-5',
        question:
          'What is type coercion? Explain implicit vs explicit coercion.',
        answer:
          'Type coercion is the process of converting a value from one type to another. JavaScript is dynamically typed and weakly typed, which means it will automatically convert types in many situations — sometimes helpfully, sometimes disastrously. Understanding coercion rules is essential to predicting how expressions evaluate and avoiding subtle bugs.\n\nExplicit coercion (also called type casting) is when the developer intentionally converts a value using built-in functions or operators: Number("42"), String(42), Boolean(0), parseInt("10px", 10), or the unary + operator (+true === 1). The intent is clear in the code, making it readable and predictable. Explicit coercion is always preferred in production code because it signals the developer\'s intent.\n\nImplicit coercion happens automatically when the engine encounters a type mismatch in an operation. The rules are governed by the Abstract Equality Comparison algorithm (for ==), the addition operator, logical contexts, and comparison operators. For example, "5" + 3 results in "53" because the + operator prefers string concatenation when one operand is a string. Conversely, "5" - 3 results in 2 because the - operator only works with numbers, so the string is coerced. These asymmetries are a frequent source of interview questions.\n\nThe ToPrimitive algorithm underpins much of implicit coercion for objects. When an object appears where a primitive is expected, JavaScript calls the object\'s [Symbol.toPrimitive](hint), valueOf(), or toString() methods, in that order of precedence (the exact order depends on the "hint" — "number", "string", or "default"). Custom implementations of these methods let objects control their own coercion behavior.\n\nIn practice, the safest strategy is to use explicit coercion everywhere, prefer === over ==, and add explicit type checks before operations that could trigger implicit coercion. Linting rules (e.g., eqeqeq in ESLint) can enforce this discipline across a team.',
        shortAnswer:
          'Type coercion converts values between types. Explicit coercion is intentional (Number("42"), String(42)). Implicit coercion happens automatically in operations like "5" + 3 → "53" or "5" - 3 → 2. Always prefer explicit coercion for clarity.',
        code: '// --- Explicit coercion ---\nNumber("42");        // 42\nNumber("");          // 0\nNumber("hello");     // NaN\nNumber(true);        // 1\nNumber(null);        // 0\nNumber(undefined);   // NaN\n\nString(42);          // "42"\nString(null);        // "null"\nString(undefined);   // "undefined"\n\nBoolean(0);          // false\nBoolean("");         // false\nBoolean("0");        // true — non-empty string!\nBoolean([]);         // true — arrays are truthy!\nBoolean({});         // true — objects are truthy!\n\n// --- Implicit coercion ---\n// + operator with strings triggers concatenation\nconsole.log("5" + 3);       // "53"\nconsole.log("5" + true);    // "5true"\n\n// Other arithmetic operators coerce to number\nconsole.log("5" - 3);       // 2\nconsole.log("5" * "2");     // 10\nconsole.log("5" / true);    // 5\n\n// Comparison operators\nconsole.log("10" > 9);      // true (string coerced to number)\nconsole.log(null == undefined); // true (special rule)\nconsole.log(null === undefined); // false\n\n// Logical context (if, &&, ||, !, ternary)\nif ("") console.log("never");   // empty string is falsy\nif ("0") console.log("runs");   // non-empty string is truthy\n\n// ToPrimitive with custom object\nconst custom = {\n  [Symbol.toPrimitive](hint: string) {\n    if (hint === "number") return 42;\n    if (hint === "string") return "forty-two";\n    return true;\n  },\n};\nconsole.log(+custom);            // 42\nconsole.log(\\`Value: \\${custom}\\`); // "Value: forty-two"\nconsole.log(custom + "");        // "true"',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['type coercion', 'implicit', 'explicit', 'ToPrimitive'],
        commonMistakes: [
          'Assuming [] + [] returns anything meaningful — it returns "" (empty string) because both arrays coerce to ""',
          'Forgetting that Boolean([]) and Boolean({}) are true — empty arrays and objects are truthy',
          'Mixing + with non-string types and expecting numeric addition instead of string concatenation',
        ],
        followUps: [
          'What does [] + {} return? What about {} + []? Why are they different?',
          'How does the ToPrimitive algorithm choose between valueOf and toString?',
          'What coercion happens in a switch statement?',
        ],
        interviewTips: [
          'Memorize the quirky expression results ([] + [], {} + [], etc.) — they come up frequently',
          'Show you understand the "why" behind coercion rules, not just the results',
        ],
      },
      {
        id: 'js-types-6',
        question: 'What is the difference between == and ===?',
        answer:
          'The === operator, known as strict equality, compares both type and value without performing any type conversion. If the operands are of different types, the result is immediately false. This makes === predictable: "5" === 5 is false, null === undefined is false, and NaN === NaN is also false (NaN is not equal to anything, including itself).\n\nThe == operator, known as abstract or loose equality, performs type coercion before comparison following the Abstract Equality Comparison Algorithm defined in the ECMAScript specification. When the operands are of different types, the engine applies a set of recursive rules to convert them to a common type before comparing. For example, "5" == 5 coerces the string to a number, yielding true. null == undefined is true by special rule, and both are only == to each other, not to any other value.\n\nThe coercion rules for == are extensive and non-obvious. Objects are coerced to primitives via ToPrimitive. Booleans are coerced to numbers (true → 1, false → 0), which leads to counterintuitive results like [] == false being true: [] coerces to "" via toString(), "" coerces to 0, false coerces to 0, and 0 === 0. These multi-step coercion chains are the primary reason == is discouraged in production code.\n\nThere is a legitimate use case for ==: checking null == undefined is a concise way to test for both null and undefined simultaneously (value == null). Some style guides and TypeScript configurations accept this pattern. Every other use of == can introduce ambiguity, so the industry consensus is to use === everywhere else.\n\nESLint\'s eqeqeq rule enforces strict equality. TypeScript itself uses strict comparisons internally and will warn about comparisons between incompatible types. In modern codebases, using == without justification is considered a code smell.',
        shortAnswer:
          '=== (strict equality) compares type and value without coercion. == (loose equality) coerces operands to a common type before comparing, leading to surprises like "5" == 5 being true and [] == false being true. Always prefer === except for the null == undefined shorthand.',
        code: '// Strict equality (===) — no coercion\nconsole.log(5 === 5);            // true\nconsole.log("5" === 5);          // false — different types\nconsole.log(null === undefined);  // false\nconsole.log(NaN === NaN);        // false — NaN is never equal to itself\nconsole.log(0 === -0);           // true  — === treats 0 and -0 as equal\n\n// Loose equality (==) — coercion applied\nconsole.log("5" == 5);           // true — string coerced to number\nconsole.log(null == undefined);   // true — special rule\nconsole.log(null == 0);           // false — null only == undefined\nconsole.log("" == 0);            // true — "" becomes 0\nconsole.log(false == 0);         // true — false becomes 0\nconsole.log(false == "");        // true — both become 0\nconsole.log([] == false);        // true — [] → "" → 0, false → 0\nconsole.log([] == ![]);          // true — ![] is false, then [] == false\n\n// The only justified == use case\nfunction isNullish(value: unknown): boolean {\n  return value == null; // catches both null and undefined\n}\nconsole.log(isNullish(null));      // true\nconsole.log(isNullish(undefined)); // true\nconsole.log(isNullish(0));         // false\nconsole.log(isNullish(""));        // false',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['equality', 'strict equality', 'loose equality', 'coercion'],
        commonMistakes: [
          'Using == for comparisons involving numbers and strings, leading to false positives',
          'Forgetting that NaN !== NaN — use Number.isNaN() to check for NaN',
          'Assuming null == 0 is true — null is only loosely equal to undefined',
        ],
        followUps: [
          'How does Object.is() differ from ===?',
          'What does the Abstract Equality Comparison Algorithm do step by step?',
          'How does TypeScript help prevent unintended loose comparisons?',
        ],
        interviewTips: [
          'State the rule simply: always use === unless you specifically want the null/undefined shorthand with ==',
        ],
      },
      {
        id: 'js-types-7',
        question: 'How does typeof work? What are its quirks?',
        answer:
          'The typeof operator returns a string indicating the type of its operand. It is a unary prefix operator that works on any expression, including undeclared variables (it returns "undefined" rather than throwing a ReferenceError, unlike any other operation on undeclared variables). This safety makes it useful for feature detection: typeof window !== "undefined" works without error in non-browser environments.\n\nThe standard return values are: "undefined", "boolean", "number", "bigint", "string", "symbol", "object", and "function". Notice that null, arrays, dates, regex, maps, sets, and all other non-function objects all return "object" — typeof cannot distinguish between them. This is a major limitation that requires alternative approaches for precise type checking.\n\nThe most notorious quirk is typeof null === "object". This is a bug from JavaScript\'s first implementation in 1995: internally, values were tagged with a type code, and null used the same tag (0) as objects. The TC39 committee attempted to fix this in an early ECMAScript proposal, but it was rejected because too much existing code depended on the buggy behavior. It will never be fixed.\n\nOther noteworthy behaviors: typeof NaN returns "number" (NaN is technically an IEEE 754 floating-point value), typeof function(){} returns "function" (functions are the only object subtype given a special typeof result), and typeof on undeclared variables returns "undefined" without throwing. With let/const, there is a temporal dead zone (TDZ) where typeof throws a ReferenceError if the variable is declared but not yet initialized — this is a change from the var era behavior.\n\nFor reliable type detection beyond what typeof offers, use Object.prototype.toString.call(value) which returns strings like "[object Array]", "[object Date]", "[object Null]", etc. Array.isArray() is the canonical check for arrays, and instanceof checks whether an object\'s prototype chain includes a particular constructor.',
        shortAnswer:
          'typeof returns a string like "string", "number", "object", or "function". Its main quirks: typeof null is "object" (historic bug), typeof NaN is "number", it cannot distinguish arrays/dates/objects, and it safely returns "undefined" for undeclared variables.',
        code: '// Standard typeof results\nconsole.log(typeof "hello");     // "string"\nconsole.log(typeof 42);          // "number"\nconsole.log(typeof true);        // "boolean"\nconsole.log(typeof undefined);   // "undefined"\nconsole.log(typeof Symbol("x")); // "symbol"\nconsole.log(typeof 42n);         // "bigint"\nconsole.log(typeof {});          // "object"\nconsole.log(typeof []);          // "object" — not "array"!\nconsole.log(typeof null);        // "object" — bug!\nconsole.log(typeof function(){}); // "function"\n\n// typeof NaN\nconsole.log(typeof NaN);         // "number"\nconsole.log(Number.isNaN(NaN));  // true\n\n// Safe undeclared variable check\n// console.log(myVar); — ReferenceError!\nconsole.log(typeof myVar);       // "undefined" — no error\n\n// Better type detection with Object.prototype.toString\nfunction getType(value: unknown): string {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nconsole.log(getType([]));          // "Array"\nconsole.log(getType(null));        // "Null"\nconsole.log(getType(new Date()));  // "Date"\nconsole.log(getType(/abc/));       // "RegExp"\nconsole.log(getType(new Map()));   // "Map"\nconsole.log(getType(42));          // "Number"\n\n// Array.isArray — canonical array check\nconsole.log(Array.isArray([]));        // true\nconsole.log(Array.isArray({}));        // false\nconsole.log(Array.isArray("string"));  // false',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['typeof', 'type checking', 'Object.prototype.toString'],
        commonMistakes: [
          'Using typeof to check for null — always use value === null instead',
          'Using typeof to check for arrays — use Array.isArray() instead',
          'Assuming typeof works the same in TDZ (let/const before initialization) as with undeclared variables',
        ],
        followUps: [
          'Why does typeof return "function" for functions but "object" for other object subtypes?',
          'How does the temporal dead zone affect typeof behavior?',
          'How can you create a comprehensive type-checking utility function?',
        ],
        interviewTips: [
          'Have a ready answer for the "typeof null" question — it is one of the most common JavaScript trivia questions',
          'Show awareness of Object.prototype.toString.call() as the most reliable type check',
        ],
      },
      {
        id: 'js-types-8',
        question: 'When should you use instanceof vs typeof?',
        answer:
          'typeof is a unary operator that identifies the primitive type of a value or distinguishes objects from functions. It works on any value and returns a predefined set of strings. Its sweet spot is checking for primitives: typeof x === "string", typeof x === "number", typeof x === "undefined". It cannot distinguish between different kinds of objects — arrays, dates, regex, and plain objects all return "object".\n\ninstanceof is a binary operator that checks whether an object\'s prototype chain includes the prototype property of a constructor function. It answers the question "was this object created by (or inherits from) this constructor?" — arr instanceof Array, err instanceof Error, el instanceof HTMLElement. It is useful for checking class hierarchies, distinguishing error types in catch blocks, and verifying custom class instances.\n\nA critical difference is that instanceof does not work across realms (iframes, Node.js vm contexts, or Web Workers). Each realm has its own global constructors, so an array created in an iframe will fail parent instanceof Array because it was constructed by the iframe\'s Array, not the parent\'s. Array.isArray() was invented specifically to solve this cross-realm problem for arrays. For custom classes, Symbol.hasInstance can customize instanceof behavior.\n\ninstanceof also does not work with primitives: "hello" instanceof String is false because string literals are primitives, not String wrapper objects. Conversely, new String("hello") instanceof String is true. This asymmetry is another reason to use typeof for primitives and instanceof only for objects.\n\nIn practice, use typeof for primitive detection, Array.isArray() for arrays, instanceof for class hierarchy checks (especially in catch blocks for error discrimination), and Object.prototype.toString.call() when you need to identify the exact built-in object type across all environments.',
        shortAnswer:
          'Use typeof for primitives (string, number, boolean, undefined). Use instanceof for checking whether an object was created by a specific constructor or inherits from a class. instanceof fails across iframes/realms and with primitives; typeof cannot distinguish object subtypes.',
        code: '// typeof — good for primitives\nconsole.log(typeof "hello" === "string"); // true\nconsole.log(typeof 42 === "number");      // true\n\n// instanceof — good for class hierarchy\nclass Animal {}\nclass Dog extends Animal {}\nconst dog = new Dog();\nconsole.log(dog instanceof Dog);    // true\nconsole.log(dog instanceof Animal); // true\nconsole.log(dog instanceof Object); // true — everything extends Object\n\n// instanceof for error discrimination\ntry {\n  throw new TypeError("bad type");\n} catch (err) {\n  if (err instanceof TypeError) {\n    console.log("Type error caught");\n  } else if (err instanceof RangeError) {\n    console.log("Range error caught");\n  }\n}\n\n// instanceof fails with primitives\nconsole.log("hello" instanceof String);  // false\nconsole.log(42 instanceof Number);       // false\n\n// instanceof fails across realms (conceptual)\n// const iframeArray = iframe.contentWindow.eval(\'[]\');\n// iframeArray instanceof Array → false!\n// Array.isArray(iframeArray)   → true!\n\n// Custom instanceof behavior via Symbol.hasInstance\nclass Even {\n  static [Symbol.hasInstance](num: unknown): boolean {\n    return typeof num === "number" && num % 2 === 0;\n  }\n}\nconsole.log(4 instanceof Even);  // true\nconsole.log(3 instanceof Even);  // false',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['typeof', 'instanceof', 'type checking', 'prototype chain'],
        commonMistakes: [
          'Using instanceof to check primitives — "str" instanceof String is always false',
          'Relying on instanceof for arrays when the value may come from another iframe or realm',
          'Forgetting that instanceof walks the entire prototype chain — a Dog is also an Animal and an Object',
        ],
        followUps: [
          'How does Symbol.hasInstance customize instanceof behavior?',
          'What alternatives exist for cross-realm type checking?',
          'How does TypeScript\'s type narrowing interact with typeof and instanceof?',
        ],
        interviewTips: [
          'Mention the cross-realm instanceof pitfall — it shows practical, real-world experience',
          'Know that Array.isArray() was created specifically to fix the cross-iframe array detection problem',
        ],
      },
      {
        id: 'js-types-9',
        question: 'Explain Object.is() and how it differs from ===.',
        answer:
          'Object.is() is a static method introduced in ES2015 that performs a Same-Value comparison. It behaves identically to === in almost all cases, but differs in exactly two scenarios: the treatment of NaN and signed zeros. These two differences make Object.is() the most mathematically correct equality check in JavaScript.\n\nWith ===, NaN !== NaN — this follows the IEEE 754 floating-point specification, which mandates that NaN is not equal to itself. Object.is(NaN, NaN) returns true, matching the intuitive expectation that a value should be equal to itself. Before Object.is(), checking for NaN required using isNaN() (which coerces its argument) or the self-inequality trick (x !== x is true only when x is NaN). Number.isNaN() (ES2015) is another option that avoids coercion.\n\nWith ===, positive zero and negative zero are considered equal: 0 === -0 is true. Object.is(0, -0) returns false, correctly distinguishing them. Signed zeros matter in mathematical contexts — for example, 1/0 is Infinity while 1/-0 is -Infinity, so the two zeros are observably different. In most application code this distinction is irrelevant, but in numerical libraries and algorithms it can be critical.\n\nInternally, React uses Object.is() (via a polyfill called objectIs) to compare state and props values in its reconciliation process. When you call setState with the "same" value, React uses Object.is() to decide whether to skip re-rendering. This is why updating state with -0 when the current state is 0 will trigger a re-render, and why NaN state is considered stable across renders.\n\nIn everyday code, === is the right default choice. Use Object.is() when you specifically need to distinguish +0 from -0 or need NaN === NaN semantics. Use Number.isNaN() for standalone NaN checks. Use == only for the null/undefined shorthand.',
        shortAnswer:
          'Object.is() is like === but treats NaN as equal to NaN and distinguishes +0 from -0. It provides Same-Value equality, which is the most precise comparison in JavaScript. React uses it internally to compare state values.',
        code: '// NaN comparisons\nconsole.log(NaN === NaN);           // false\nconsole.log(Object.is(NaN, NaN));   // true\nconsole.log(Number.isNaN(NaN));     // true\n\n// Signed zero comparisons\nconsole.log(0 === -0);              // true\nconsole.log(Object.is(0, -0));      // false\nconsole.log(1 / 0);                // Infinity\nconsole.log(1 / -0);               // -Infinity\n\n// All three behave the same for normal values\nconsole.log(Object.is(42, 42));         // true\nconsole.log(Object.is("hello", "hello")); // true\nconsole.log(Object.is(null, null));     // true\nconsole.log(Object.is(null, undefined)); // false\n\n// Polyfill (this is essentially what React uses)\nfunction sameValue(a: unknown, b: unknown): boolean {\n  if (a === 0 && b === 0) {\n    // Distinguish +0 and -0 using 1/x\n    return 1 / (a as number) === 1 / (b as number);\n  }\n  if (a !== a && b !== b) {\n    // Both are NaN\n    return true;\n  }\n  return a === b;\n}\n\nconsole.log(sameValue(NaN, NaN));  // true\nconsole.log(sameValue(0, -0));     // false\nconsole.log(sameValue(42, 42));    // true',
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['Object.is', 'equality', 'NaN', 'signed zero'],
        commonMistakes: [
          'Assuming Object.is() is always interchangeable with === — they differ for NaN and ±0',
          'Using isNaN() instead of Number.isNaN() — isNaN("hello") is true due to coercion, Number.isNaN("hello") is false',
          'Not realizing that React\'s state comparison uses Object.is(), which can lead to unexpected re-renders with -0',
        ],
        followUps: [
          'What are the four equality algorithms in JavaScript (loose, strict, SameValue, SameValueZero)?',
          'Which equality algorithm do Map and Set use for key comparison?',
          'Why does IEEE 754 define NaN as not equal to itself?',
        ],
        interviewTips: [
          'Mentioning React\'s use of Object.is() connects a "trivia" question to real-world framework internals',
        ],
      },
      {
        id: 'js-types-10',
        question: 'What are the falsy values in JavaScript?',
        answer:
          'JavaScript defines exactly eight falsy values: false, 0, -0, 0n (BigInt zero), "" (empty string), null, undefined, and NaN. Every other value is truthy — including empty arrays [], empty objects {}, the string "0", the string "false", and any non-zero number. This is one of the most frequently tested concepts in JavaScript interviews.\n\nFalsy values matter because JavaScript coerces values to boolean in several contexts: if/else conditions, the ternary operator, logical operators (&&, ||, !), while/for loops, and the Boolean() constructor. When a value appears in a boolean context, the engine applies the ToBoolean abstract operation, which simply checks whether the value is in the falsy list. There is no custom coercion or valueOf call — it is a hardcoded list.\n\nThe truthy nature of empty arrays and objects surprises many developers. [] == false is true (due to abstract equality coercion), but Boolean([]) is also true. This seeming contradiction occurs because == triggers ToPrimitive conversion ([] → "" → 0 → matches false → 0), while Boolean() uses the ToBoolean lookup table where any object is truthy. Similarly, "0" is truthy (non-empty string), but "0" == false is true (string "0" → number 0 → matches false → 0). These edge cases underscore why === is preferred over ==.\n\nIn practice, guard against falsy-value bugs by being explicit about what you\'re checking. If a function can legitimately return 0 or "", checking if (result) will incorrectly treat these valid return values as failures. Instead, check if (result !== undefined && result !== null) or use the nullish coalescing operator (??) which only triggers on null/undefined, not on 0 or "".\n\nThe nullish coalescing operator (??) and optional chaining (?.) were designed specifically to address the falsy-value problem with default values. Before ??, developers used || for defaults: const port = config.port || 3000. This fails if config.port is 0 (a valid port). With ??, const port = config.port ?? 3000 only falls back when config.port is null or undefined.',
        shortAnswer:
          'The eight falsy values are: false, 0, -0, 0n, "" (empty string), null, undefined, and NaN. Everything else is truthy, including [], {}, "0", and "false". Use ?? instead of || for defaults when 0 or "" are valid values.',
        code: '// All falsy values\nconst falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];\n\nfalsyValues.forEach((val) => {\n  console.log(\\`\\${String(val)} → \\${Boolean(val)}\\`); // all print false\n});\n\n// Surprising truthy values\nconsole.log(Boolean([]));         // true — empty array is truthy!\nconsole.log(Boolean({}));         // true — empty object is truthy!\nconsole.log(Boolean("0"));        // true — non-empty string!\nconsole.log(Boolean("false"));    // true — non-empty string!\nconsole.log(Boolean(new Date())); // true — any object is truthy\nconsole.log(Boolean(Infinity));   // true\nconsole.log(Boolean(-Infinity));  // true\n\n// The [] == false paradox\nconsole.log([] == false);   // true (coercion: [] → "" → 0, false → 0)\nconsole.log(Boolean([]));   // true (ToBoolean: any object is truthy)\n\n// Falsy value gotcha with ||\nconst port = 0;\nconst withOr = port || 3000;\nconsole.log(withOr); // 3000 — wrong! 0 is a valid port\n\nconst withNullish = port ?? 3000;\nconsole.log(withNullish); // 0 — correct! ?? only triggers on null/undefined\n\n// Explicit checks instead of truthy/falsy\nfunction processResult(result: string | null | undefined) {\n  // Bad: if (result) — fails for empty string ""\n  // Good:\n  if (result != null) {\n    console.log(\\`Got: \\${result}\\`); // works for "" too\n  }\n}',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['falsy', 'truthy', 'coercion', 'nullish coalescing'],
        commonMistakes: [
          'Assuming empty arrays or objects are falsy — they are truthy',
          'Using || for default values when 0 or "" are valid inputs — use ?? instead',
          'Confusing Boolean([]) being true with [] == false being true — they use different coercion algorithms',
        ],
        followUps: [
          'What is the difference between || and ?? for default values?',
          'How does optional chaining (?.) interact with falsy values?',
          'Why is document.all falsy even though it is an object?',
        ],
        interviewTips: [
          'List all eight falsy values from memory — interviewers commonly ask for the complete list',
          'Mention the ?? operator to show awareness of modern JavaScript solutions to falsy-value problems',
        ],
      },
      {
        id: 'js-types-11',
        question:
          'How does Object.prototype.toString.call() help with type checking?',
        answer:
          'Object.prototype.toString.call() is the most reliable built-in mechanism for identifying the exact internal type of any JavaScript value. When called on a value, it returns a string in the format "[object Type]", where Type is the internal [[Class]] tag (or Symbol.toStringTag in ES2015+). Unlike typeof, it can distinguish between Array, Date, RegExp, Map, Set, Null, Undefined, and all other built-in types.\n\nThe reason we use .call() is that most objects override toString() on their own prototypes. Array.prototype.toString() returns the array\'s elements joined by commas, Date.prototype.toString() returns a date string, and so on. By borrowing Object.prototype.toString and invoking it with .call(value), we bypass these overrides and access the generic version that reports the internal type tag.\n\nFor primitives, the method wraps the value in its corresponding object type before reading the tag: Object.prototype.toString.call(42) returns "[object Number]", Object.prototype.toString.call("hello") returns "[object String]". For null it returns "[object Null]" and for undefined it returns "[object Undefined]" — solving the typeof null === "object" problem elegantly.\n\nSince ES2015, objects can customize their toString tag by defining a Symbol.toStringTag property. Built-in types like Map, Set, Promise, and generators already have this symbol set. Custom classes can set it too: defining get [Symbol.toStringTag]() { return "MyClass"; } causes Object.prototype.toString.call(instance) to return "[object MyClass]". This makes the technique extensible for user-defined types.\n\nA common utility pattern is to extract just the type name: Object.prototype.toString.call(value).slice(8, -1) gives you "Array", "Null", "Date", etc. This approach is widely used in utility libraries and polyfills. It is also the only way to reliably detect certain built-in types (like distinguishing plain objects from Arguments objects) without relying on duck typing.',
        shortAnswer:
          'Object.prototype.toString.call() returns "[object Type]" for any value, correctly identifying Array, Date, Null, RegExp, etc. It bypasses overridden toString methods and is the most reliable type check, solving quirks like typeof null === "object".',
        code: '// Object.prototype.toString.call() for precise type detection\nconst toString = Object.prototype.toString;\n\nconsole.log(toString.call("hello"));      // "[object String]"\nconsole.log(toString.call(42));           // "[object Number]"\nconsole.log(toString.call(true));         // "[object Boolean]"\nconsole.log(toString.call(undefined));    // "[object Undefined]"\nconsole.log(toString.call(null));         // "[object Null]"\nconsole.log(toString.call(Symbol("x")));  // "[object Symbol]"\n\nconsole.log(toString.call([]));           // "[object Array]"\nconsole.log(toString.call({}));           // "[object Object]"\nconsole.log(toString.call(new Date()));   // "[object Date]"\nconsole.log(toString.call(/abc/));        // "[object RegExp]"\nconsole.log(toString.call(new Map()));    // "[object Map]"\nconsole.log(toString.call(new Set()));    // "[object Set]"\nconsole.log(toString.call(Promise.resolve())); // "[object Promise]"\n\n// Utility function\nfunction typeOf(value: unknown): string {\n  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();\n}\n\nconsole.log(typeOf(null));        // "null" — not "object"!\nconsole.log(typeOf([]));          // "array"\nconsole.log(typeOf(new Date()));  // "date"\nconsole.log(typeOf(/test/));      // "regexp"\n\n// Custom Symbol.toStringTag\nclass ApiClient {\n  get [Symbol.toStringTag]() {\n    return "ApiClient";\n  }\n}\nconsole.log(toString.call(new ApiClient())); // "[object ApiClient]"\n\n// Comprehensive type checker\nfunction isPlainObject(value: unknown): value is Record<string, unknown> {\n  return Object.prototype.toString.call(value) === "[object Object]";\n}\n\nconsole.log(isPlainObject({}));           // true\nconsole.log(isPlainObject([]));           // false\nconsole.log(isPlainObject(new Date()));   // false',
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['Object.prototype.toString', 'type checking', 'Symbol.toStringTag'],
        commonMistakes: [
          'Calling value.toString() instead of Object.prototype.toString.call(value) — the former uses the overridden version',
          'Forgetting that custom classes can override Symbol.toStringTag, making the result unreliable for security checks',
          'Not accounting for cross-realm differences when comparing constructor names',
        ],
        followUps: [
          'How does Symbol.toStringTag affect Object.prototype.toString output?',
          'What are the trade-offs between duck typing and explicit type checking?',
          'How do type guard functions in TypeScript relate to runtime type checks?',
        ],
        interviewTips: [
          'Showing this technique demonstrates deep JavaScript knowledge beyond surface-level typeof usage',
        ],
      },
      {
        id: 'js-types-12',
        question:
          'What is the difference between null and undefined in JavaScript?',
        answer:
          'null and undefined are both primitives that represent the absence of a value, but they have distinct semantic meanings and behave differently in several important contexts. Understanding when and why each appears is fundamental to writing defensive JavaScript.\n\nundefined means a value has not been assigned. It is the default value of uninitialized variables (let x; → x is undefined), missing function parameters, the return value of functions that don\'t explicitly return, and the result of accessing a non-existent object property. The engine assigns undefined automatically — developers rarely need to assign it explicitly. If you see undefined, it generally means "nothing was provided or this hasn\'t been set up yet."\n\nnull means "intentionally no value." It is never assigned by the engine — a developer must explicitly set a variable to null. It signals a deliberate absence: "this variable is meant to hold an object, but right now it holds nothing." DOM methods like document.getElementById() return null when no matching element is found, and JSON represents missing values as null (JSON has no undefined).\n\nThe typeof results differ: typeof undefined is "undefined", while typeof null is "object" (the historic bug). For equality: null == undefined is true (they are loosely equal by specification), but null === undefined is false (different types). null and undefined are only == to each other and to nothing else — null == 0, null == "", null == false are all false. This makes value == null a concise and safe check for both null and undefined.\n\nIn practice, prefer null when you need to explicitly indicate "no value" for variables that will later hold objects. Prefer leaving things as undefined rather than assigning undefined explicitly. Use the nullish coalescing operator (??) to provide defaults for both null and undefined without accidentally replacing valid falsy values like 0 or "". TypeScript\'s strict null checks (strictNullChecks) enforce that you handle both cases explicitly, preventing many common null/undefined-related runtime errors.',
        shortAnswer:
          'undefined means "not yet assigned" — the engine sets it automatically for uninitialized variables, missing parameters, and non-existent properties. null means "intentionally empty" — it must be explicitly assigned. They are loosely equal (null == undefined) but not strictly equal.',
        code: '// undefined — automatically assigned\nlet x;\nconsole.log(x); // undefined\n\nfunction greet(name?: string) {\n  console.log(name); // undefined if not passed\n}\ngreet();\n\nconst obj: Record<string, unknown> = { a: 1 };\nconsole.log(obj.b); // undefined — property doesn\'t exist\n\nfunction doNothing() {}\nconsole.log(doNothing()); // undefined — no return statement\n\n// null — intentionally assigned\nlet user: { name: string } | null = null; // will be set later\nconst el = document.getElementById("nonexistent"); // null\n\n// typeof difference\nconsole.log(typeof undefined); // "undefined"\nconsole.log(typeof null);      // "object" (bug)\n\n// Equality behavior\nconsole.log(null == undefined);   // true\nconsole.log(null === undefined);  // false\nconsole.log(null == 0);           // false\nconsole.log(null == "");          // false\nconsole.log(null == false);       // false\n\n// Nullish coalescing — handles both null and undefined\nconst config: { port?: number | null } = { port: null };\nconst port = config.port ?? 3000;\nconsole.log(port); // 3000\n\n// JSON serialization difference\nconst data = { a: undefined, b: null, c: 42 };\nconsole.log(JSON.stringify(data));\n// \'{"b":null,"c":42}\' — undefined properties are omitted, null is preserved',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-types',
        tags: ['null', 'undefined', 'nullish coalescing', 'equality'],
        commonMistakes: [
          'Explicitly assigning undefined to a variable — use null instead to signal intentional absence',
          'Using typeof to check for null — typeof null is "object", use value === null instead',
          'Forgetting that JSON.stringify strips undefined properties but keeps null values',
        ],
        followUps: [
          'Why does JSON not support undefined?',
          'How do optional chaining (?.) and nullish coalescing (??) work together?',
          'What is the void operator and how does it relate to undefined?',
        ],
        interviewTips: [
          'Explain the semantic difference clearly: undefined = "not set", null = "intentionally empty"',
          'Mention that value == null is a safe and accepted shorthand for checking both null and undefined',
        ],
      },
    ],
  },
];
