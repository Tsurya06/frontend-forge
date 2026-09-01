import type { Topic } from "../../types";

export const typescriptTopics: Topic[] = [
  {
    id: "ts-fundamentals-1",
    title: "TypeScript Fundamentals",
    description:
      "Core TypeScript concepts including primitive and complex data types, type annotations, interfaces, type aliases, enums, tuples, type inference, and the critical differences between any and unknown.",
    category: "TypeScript",
    difficulty: "Beginner",
    tags: [
      "typescript",
      "types",
      "interfaces",
      "enums",
      "tuples",
      "type aliases",
      "type inference",
      "any",
      "unknown",
      "literal types",
      "functions",
    ],
    overview:
      "TypeScript extends JavaScript by adding a static type system that catches errors at compile time rather than at runtime. Understanding the fundamental building blocks — primitive types, object shapes via interfaces and type aliases, enums for named constants, tuples for fixed-length arrays, and the nuances of type inference — is essential for writing robust TypeScript code. This topic establishes the foundation upon which advanced patterns like generics, conditional types, and mapped types are built.",
    concepts: [
      "Primitive types: string, number, boolean, null, undefined, symbol, bigint",
      "Arrays and object type annotations",
      "Function parameter and return type annotations",
      "Interfaces for object shapes",
      "Type aliases with the type keyword",
      "Enums: numeric, string, and const enums",
      "Tuples: fixed-length typed arrays",
      "Type inference and contextual typing",
      "Literal types: string, number, and boolean literals",
      "any vs unknown: safety trade-offs",
      "Type assertions with as and angle-bracket syntax",
      "void and never return types",
    ],
    codeExamples: [
      {
        title: "Basic Type Annotations",
        code: `// Primitive types
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
}`,
        language: "typescript",
        explanation:
          "TypeScript annotations follow a colon syntax. Optional properties and parameters use the ? modifier.",
      },
      {
        title: "Interfaces vs Type Aliases",
        code: `// Interface — extendable, declaration-mergeable
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
}`,
        language: "typescript",
        explanation:
          "Interfaces excel at describing object shapes and support declaration merging. Type aliases are more flexible and can represent any type expression.",
      },
      {
        title: "Enums and Tuples",
        code: `// Numeric enum (auto-incremented from 0)
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
const response: HttpResponse = [200, '{"ok":true}'];`,
        language: "typescript",
        explanation:
          "Enums provide named constants. Const enums are erased at compile time for zero runtime cost. Tuples enforce both length and per-index types.",
      },
    ],
    relatedTopicIds: ["ts-advanced-1", "ts-type-safety-1", "ts-react-1"],
    questions: [
      {
        id: "ts-fundamentals-1",
        question:
          "What are the basic data types in TypeScript and how do they differ from JavaScript?",
        answer:
          "TypeScript provides static type annotations on top of all JavaScript runtime types, and adds several type-system-only constructs that do not exist at runtime. The primitive types mirror JavaScript: string, number, boolean, null, undefined, symbol, and bigint. TypeScript also has array types written as T[] or Array<T>, object types described by inline annotations or interfaces, and the special types void, never, any, and unknown.\n\nThe key difference from JavaScript is that TypeScript enforces these types at compile time. In JavaScript, a variable can be reassigned from a string to a number without complaint, but TypeScript will flag this as an error when the variable has been annotated or inferred as a specific type. This prevents entire categories of bugs — calling string methods on a number, passing the wrong argument to a function, or accessing properties that do not exist on an object.\n\nTypeScript introduces additional type constructs not present in JavaScript. Enums create named constant sets, tuples describe fixed-length arrays with per-position types, literal types restrict a value to an exact string or number, and type aliases allow you to name complex types for reuse. Interfaces describe object shapes and support declaration merging and extension via the extends keyword.\n\nAnother critical distinction is the any and unknown types. any opts out of type checking entirely and allows any operation — it is essentially an escape hatch. unknown is the type-safe counterpart: a value of type unknown cannot be used in any way until you narrow it with a type guard or assertion. Modern TypeScript codebases prefer unknown over any because it forces explicit type checking before use, maintaining the safety guarantees that make TypeScript valuable.",
        shortAnswer:
          "TypeScript has all JavaScript types (string, number, boolean, null, undefined, symbol, bigint) plus static-only constructs like enums, tuples, literal types, any, unknown, void, and never that are enforced at compile time.",
        code: `// Primitives
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
}`,
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: ["types", "primitives", "any", "unknown", "void", "never"],
        commonMistakes: [
          "Using any everywhere instead of proper types or unknown, defeating the purpose of TypeScript",
          "Confusing null and undefined — TypeScript treats them as distinct types under strictNullChecks",
          "Assuming TypeScript types exist at runtime — they are erased during compilation and cannot be used in typeof checks",
        ],
        followUps: [
          "How does strictNullChecks affect the type system?",
          "When would you use never versus void?",
          "What is the difference between type assertions and type guards?",
        ],
        interviewTips: [
          "Emphasize that TypeScript is a compile-time tool — all types are erased before execution",
          "Mention the strict compiler flags (strict, strictNullChecks) that tighten the type system",
        ],
        relatedTopics: ["ts-type-safety-1", "ts-advanced-1"],
      },
      {
        id: "ts-fundamentals-2",
        question:
          "What is the difference between an interface and a type alias in TypeScript?",
        answer:
          "Interfaces and type aliases are the two primary mechanisms for naming types in TypeScript, and while they overlap significantly in capability, they differ in important ways that affect when you should use each.\n\nInterfaces are designed for describing object shapes. They support extends for inheritance, allowing you to compose complex object types from simpler ones. A unique feature of interfaces is declaration merging: if you declare the same interface name twice in the same scope, TypeScript automatically merges them into a single interface containing all members. This is essential for augmenting third-party library types or extending global types like Window.\n\nType aliases, created with the type keyword, are more general-purpose. They can represent any type expression: unions (string | number), intersections (A & B), primitives (type ID = string), tuples, mapped types, conditional types, and more. When you need to name a type that is not purely an object shape — such as a union of string literals or a generic utility type — a type alias is the right choice. Type aliases cannot be declaration-merged; redeclaring the same name is an error.\n\nFrom a practical standpoint, both can describe object shapes, both support generics, and both can be extended (interfaces with extends, type aliases with intersections). The TypeScript team recommends using interfaces for public API contracts and object shapes because they produce better error messages and support augmentation. Use type aliases when you need unions, intersections, conditional types, mapped types, or when naming non-object types. In many modern codebases you will see a mix of both used according to these guidelines.",
        shortAnswer:
          "Interfaces describe object shapes, support declaration merging and extends. Type aliases can represent any type (unions, intersections, primitives, tuples) but cannot be declaration-merged.",
        code: `// Interface — object shape with extension and merging
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
// type StringOrNumber = boolean; // Error: Duplicate identifier`,
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: ["interface", "type alias", "declaration merging", "extends"],
        commonMistakes: [
          "Believing interfaces and type aliases are interchangeable — type aliases handle unions and mapped types that interfaces cannot",
          "Not leveraging declaration merging when augmenting third-party types",
          "Using extends with type aliases instead of intersection (&) syntax",
        ],
        followUps: [
          "How does declaration merging work with module augmentation?",
          "Can an interface extend a type alias and vice versa?",
          "When would declaration merging cause problems?",
        ],
        interviewTips: [
          "Show awareness that both can describe objects, but explain the specific advantages of each",
          "Mention that the TypeScript handbook recommends interfaces for object shapes unless you need type alias features",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-fundamentals-3",
        question: "How does type inference work in TypeScript?",
        answer:
          "Type inference is TypeScript's ability to automatically determine the type of a variable, parameter, or return value without an explicit annotation. The compiler analyzes the value assigned or the expression's structure to infer the most specific type it can, reducing the need for verbose annotations while maintaining full type safety.\n\nThe most common form is variable initialization inference. When you write let x = 42, TypeScript infers x as number. For const y = 42, it infers the literal type 42 because a const binding cannot be reassigned. This distinction between let (widened type) and const (literal type) is an important nuance. Array literals like [1, 2, 3] are inferred as number[], but using as const produces a readonly tuple [1, 2, 3].\n\nReturn type inference means you often do not need to annotate function return types. TypeScript examines all return paths and computes the union of their types. For example, a function that returns either a string or null is inferred as returning string | null. Contextual typing is another powerful form: when a function expression is assigned to a typed variable or passed as a callback with a known signature, TypeScript infers the parameter types from context. This is why array methods like .map(item => item.name) work without annotating item.\n\nWhile inference reduces boilerplate, there are cases where explicit annotations are preferable. Public API surfaces (exported functions, class methods) benefit from explicit return types because they serve as documentation and prevent accidental changes from propagating. Recursive functions sometimes need explicit annotations because inference cannot resolve circular references. The general guideline is to let inference handle local variables and callbacks, but annotate public interfaces and complex return types explicitly.",
        shortAnswer:
          "TypeScript automatically infers types from assignments, return values, and context. const uses literal types, let widens to general types. Contextual typing infers callback parameters from their expected signature.",
        code: `// Variable inference
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
};`,
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: [
          "type inference",
          "contextual typing",
          "literal types",
          "as const",
        ],
        commonMistakes: [
          "Over-annotating obvious types that TypeScript already infers correctly, adding unnecessary noise",
          "Not understanding that const narrows to literal types while let widens to general types",
          "Forgetting that function return types are inferred — unnecessarily annotating trivial returns while missing complex ones that actually need it",
        ],
        followUps: [
          "What is the difference between type widening and type narrowing?",
          "How does as const affect inference for objects and arrays?",
          "When should you prefer explicit annotations over inference?",
        ],
        interviewTips: [
          "Demonstrate understanding of the const vs let inference distinction — it shows depth beyond basics",
          "Mention contextual typing as a practical benefit that reduces callback annotation boilerplate",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
      {
        id: "ts-fundamentals-4",
        question:
          "Explain enums in TypeScript, including numeric, string, and const enums.",
        answer:
          "Enums in TypeScript provide a way to define a set of named constants, making code more readable and maintainable by replacing magic numbers or strings with descriptive identifiers. TypeScript supports three varieties: numeric enums, string enums, and const enums, each with distinct runtime and compile-time behavior.\n\nNumeric enums are the default. When you declare enum Direction { Up, Down, Left, Right }, the members are auto-assigned incrementing integers starting from 0. You can set a custom starting value (Up = 1) and subsequent members auto-increment from there. Numeric enums support reverse mapping: you can look up Direction[0] to get 'Up'. The compiler emits a runtime JavaScript object with both forward (name → value) and reverse (value → name) mappings, which adds to your bundle size.\n\nString enums require each member to have an explicit string value. They do not support auto-increment or reverse mapping, but they provide meaningful, debuggable values at runtime. When you log a string enum member you see 'ACTIVE' rather than 0, making debugging and serialization straightforward. String enums are generally preferred in modern TypeScript because they produce more predictable behavior and clearer output.\n\nConst enums, declared with const enum, are completely erased at compile time. The compiler inlines every usage with the literal value, producing zero runtime overhead — no JavaScript object is emitted. However, const enums have limitations: they cannot be used with computed members, they are incompatible with the isolatedModules flag (common in projects using Babel or esbuild), and they cannot be iterated over since no runtime object exists. For these reasons, many style guides discourage const enums in favor of plain union types (type Direction = 'up' | 'down' | 'left' | 'right') which provide similar type safety without the compilation constraints.",
        shortAnswer:
          "Numeric enums auto-increment from 0 with reverse mapping. String enums require explicit values with no reverse mapping. Const enums inline values at compile time for zero runtime cost but cannot be iterated or used with isolatedModules.",
        code: `// Numeric enum with reverse mapping
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
type Color = "red" | "green" | "blue";`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: ["enums", "string enums", "const enums", "union types"],
        commonMistakes: [
          "Using numeric enums when string enums would provide better debugging and serialization",
          "Using const enums with isolatedModules or Babel, which strips TypeScript without full type-checking",
          "Not considering union literal types as a simpler, more compatible alternative to enums",
        ],
        followUps: [
          "Why do some TypeScript style guides recommend union types over enums?",
          "How are numeric enums compiled to JavaScript?",
          "Can you use computed values in enums?",
        ],
        interviewTips: [
          "Mentioning the trade-offs between enums and union literal types shows pragmatic understanding",
          "Knowing the isolatedModules limitation of const enums demonstrates real-world project experience",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-fundamentals-5",
        question:
          "How do you type functions in TypeScript, including optional parameters, default values, rest parameters, and overloads?",
        answer:
          "TypeScript provides rich function typing that goes well beyond simple parameter annotations. You can annotate parameter types, return types, optional parameters, default values, rest parameters, and even define multiple function signatures through overloads.\n\nBasic function typing involves annotating each parameter and optionally the return type. Parameters can be made optional with ? — optional parameters must come after required ones. Default parameter values serve a dual purpose: they provide a fallback and also serve as implicit type annotations, so function greet(name = 'World') infers name as string without an explicit annotation. Rest parameters use the spread syntax and are typed as arrays: (...items: number[]) collects all remaining arguments into a number array.\n\nFunction overloads let you define multiple call signatures for a single function implementation. This is useful when a function's return type depends on its input types. You write two or more overload signatures followed by the implementation signature that must be compatible with all overloads. The implementation signature is not directly callable — callers can only use the declared overload signatures. Overloads are resolved in order, so place more specific signatures before more general ones.\n\nYou can also type functions as values using type aliases or interfaces. A type alias like type Formatter = (input: string) => string describes a function shape that can be used as a parameter type, return type, or variable annotation. Interfaces can also describe callable types with a call signature: interface Formatter { (input: string): string }. For methods on objects, the shorthand method(arg: Type): ReturnType syntax is common in interfaces. Understanding these patterns is essential for typing callbacks, event handlers, middleware, and higher-order functions throughout a TypeScript application.",
        shortAnswer:
          "Functions are typed via parameter annotations, return types, optional params (?), defaults, and rest params (...args: T[]). Overloads define multiple signatures for different input/output type combinations.",
        code: `// Basic function typing
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
const isPositive: Predicate<number> = (n) => n > 0;`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: [
          "functions",
          "overloads",
          "optional parameters",
          "rest parameters",
          "function types",
        ],
        commonMistakes: [
          "Placing optional parameters before required ones, which is a compilation error",
          "Writing overload signatures that the implementation signature does not satisfy",
          "Forgetting that the implementation signature of an overload is not callable — only the declared overload signatures are visible to callers",
        ],
        followUps: [
          "When should you use overloads versus a union return type?",
          "How do generic functions differ from overloaded functions?",
          "What is the this parameter in TypeScript functions?",
        ],
        interviewTips: [
          "Demonstrate overloads with a practical example like an API response parser whose return type depends on a flag",
          "Mention that generics are often preferred over overloads when the relationship between inputs and outputs is uniform",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-fundamentals-6",
        question:
          "What are tuples in TypeScript and how do they differ from arrays?",
        answer:
          "Tuples are a TypeScript type construct that represents fixed-length arrays where each position has a specific, potentially different type. While regular arrays (number[]) enforce a single element type with no length constraint, tuples enforce both the type at each index and the total number of elements, making them ideal for representing structured data without creating a full interface.\n\nA basic tuple is declared as [string, number], meaning the first element must be a string and the second must be a number. TypeScript enforces this: accessing index 0 gives you a string, accessing index 1 gives you a number, and accessing index 2 is an error. Named tuple elements ([name: string, age: number]) improve readability without changing runtime behavior. Tuples support optional elements with ? and rest elements with ... — for example, [string, ...number[]] represents a string followed by zero or more numbers.\n\nTuples are commonly used to represent function return values when you want to return multiple related pieces of data. React's useState hook returns a [state, setter] tuple, and custom hooks frequently use this pattern. They are also useful for representing fixed-structure data like coordinates ([x: number, y: number]), database rows, or CSV parsed lines. Destructuring tuples (const [first, second] = myTuple) provides a clean syntax for extracting values.\n\nOne important behavior is that tuples without as const allow mutation and push/pop operations that can break the length guarantee at runtime. TypeScript's type system considers [string, number] assignable to (string | number)[] in certain contexts, and methods like push are allowed because the underlying runtime type is still Array. Using readonly tuples (readonly [string, number]) prevents mutation entirely. The as const assertion on array literals produces readonly tuples with literal types, which is a common pattern for configuration values and discriminated unions.",
        shortAnswer:
          "Tuples are fixed-length arrays with per-position types. Unlike regular arrays, they enforce both the type at each index and the element count. They support optional elements, rest elements, and named labels.",
        code: `// Basic tuple
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

const [count, setCount] = useState(0);`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: ["tuples", "arrays", "readonly", "as const", "destructuring"],
        commonMistakes: [
          "Forgetting that regular tuples still allow push/pop at runtime, potentially violating the type guarantee",
          "Not using readonly tuples when immutability is intended",
          "Confusing tuple type [string, number] with union array type (string | number)[] — they have different semantics",
        ],
        followUps: [
          "How does as const interact with tuple inference?",
          "What are variadic tuple types introduced in TypeScript 4.0?",
          "How do you type a function that accepts a variable number of typed arguments using tuple rest elements?",
        ],
        interviewTips: [
          "Relate tuples to React hooks (useState returns a tuple) to show practical understanding",
          "Mention the readonly modifier and as const for interview depth",
        ],
        relatedTopics: ["ts-advanced-1", "ts-react-1"],
      },
      {
        id: "ts-fundamentals-7",
        question:
          "What is the difference between any and unknown in TypeScript?",
        answer:
          "any and unknown are both top types that can hold any value, but they differ fundamentally in type safety. any disables type checking entirely for that value, while unknown preserves type safety by requiring you to narrow the type before performing operations.\n\nWhen a variable is typed as any, TypeScript permits every possible operation: property access, function calls, arithmetic, assignment to any other type. This makes any a complete escape hatch from the type system. You can write (value as any).foo.bar.baz() and TypeScript will not complain even if every property is undefined. This is useful for rapid prototyping, migrating JavaScript codebases, or interfacing with untyped third-party code, but it undermines the safety guarantees that make TypeScript valuable.\n\nunknown, introduced in TypeScript 3.0, is the type-safe counterpart. A variable of type unknown can hold any value, but you cannot perform any operation on it until you narrow its type. Accessing a property, calling it as a function, or even assigning it to a typed variable — all require a type guard or assertion first. This forces you to write defensive code: check typeof before treating it as a string, use instanceof before calling class methods, or use a custom type guard to validate its shape.\n\nThe practical guideline is straightforward: use unknown whenever you receive data of an uncertain type — API responses, JSON.parse results, user inputs, catch clause errors, or any external boundary. Then narrow with appropriate guards before using the value. Reserve any for genuine escape-hatch scenarios: interacting with legacy JavaScript code, working around compiler bugs, or dealing with types that are too complex to express. The strict TypeScript compiler flag noImplicitAny ensures you never accidentally default to any, and many teams enforce this as a baseline configuration.",
        shortAnswer:
          "any disables all type checking, allowing any operation. unknown requires type narrowing before use, maintaining type safety. Prefer unknown for values of uncertain type and reserve any as an escape hatch.",
        code: `// any — no type checking, all operations allowed
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
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: ["any", "unknown", "type safety", "type guards", "narrowing"],
        commonMistakes: [
          "Using any when unknown would provide safety — any should be a last resort",
          "Casting unknown directly with as instead of using proper type guards",
          "Not enabling noImplicitAny in tsconfig, allowing implicit any to sneak in through untyped parameters",
        ],
        followUps: [
          "How do you handle the error parameter in catch clauses with unknown?",
          "What is the never type and how does it relate to unknown?",
          "How do custom type predicates (value is Type) work?",
        ],
        interviewTips: [
          "Demonstrate writing a type guard for unknown — it shows both type safety knowledge and practical TypeScript skill",
          "Mention that TypeScript 4.4+ supports unknown in catch clauses with useUnknownInCatchVariables",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
      {
        id: "ts-fundamentals-8",
        question: "What are literal types in TypeScript and how are they used?",
        answer:
          'Literal types restrict a variable to an exact value rather than a general category. Instead of typing a variable as string (any string), you can type it as the literal "admin" meaning it can only hold that exact value. TypeScript supports string literals, number literals, and boolean literals as types.\n\nThe most common use of literal types is in union types that define a finite set of allowed values. For example, type Direction = "north" | "south" | "east" | "west" creates a type that only accepts those four strings. This is more type-safe than using a plain string because TypeScript will flag any misspelled value at compile time. This pattern serves a similar purpose to string enums but without the runtime overhead or the need for an import.\n\nLiteral types interact with TypeScript inference in an important way. A const declaration infers the literal type: const x = "hello" gives x the type "hello". A let declaration widens to the base type: let x = "hello" gives x the type string. The as const assertion forces literal inference on objects and arrays, making all properties readonly with their literal types. This is critical for patterns like discriminated unions, where a shared property with literal types determines which variant you are working with.\n\nLiteral types are also the foundation of template literal types (introduced in TypeScript 4.1), which let you construct string types from combinations of literals: type EventName = `${"click" | "hover"}_${"start" | "end"}` produces "click_start" | "click_end" | "hover_start" | "hover_end". This enables strongly typed string patterns for event names, CSS class names, API routes, and other structured string formats.',
        shortAnswer:
          "Literal types restrict values to exact strings, numbers, or booleans. Combined in unions, they create finite value sets. const infers literals, let widens to base types. as const forces literal types on objects.",
        code: `// String literal types
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
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: [
          "literal types",
          "template literal types",
          "as const",
          "discriminated unions",
        ],
        commonMistakes: [
          "Expecting let declarations to preserve literal types — they always widen unless explicitly annotated",
          "Not using as const when passing literal objects to functions that expect narrow types",
          "Overusing type assertions (as) instead of letting const inference or as const handle literal narrowing",
        ],
        followUps: [
          "How do template literal types enable typed string manipulation?",
          "What are the built-in string manipulation types (Uppercase, Lowercase, Capitalize)?",
          "How do literal types enable exhaustive switch-case checking?",
        ],
        interviewTips: [
          "Connect literal types to discriminated unions — it shows you understand how they fit into real-world patterns",
          "Mention template literal types to show knowledge of modern TypeScript features",
        ],
        relatedTopics: ["ts-advanced-1", "ts-type-safety-1"],
      },
      {
        id: "ts-fundamentals-9",
        question:
          "How do you use type assertions in TypeScript, and what are their risks?",
        answer:
          "Type assertions tell the TypeScript compiler to treat a value as a specific type, overriding its inference. They use either the as keyword (value as Type) or the angle-bracket syntax (<Type>value), though the as syntax is preferred because angle brackets conflict with JSX. Assertions do not perform any runtime transformation — they are purely a compile-time directive.\n\nType assertions are useful in situations where you have more information than the compiler. For example, when using document.getElementById(), TypeScript returns HTMLElement | null. If you know the element exists and is an input, you can assert document.getElementById('email') as HTMLInputElement to access input-specific properties like .value. Similarly, when working with JSON data you have validated externally, assertions let you tell TypeScript the shape of the parsed object.\n\nHowever, assertions are inherently unsafe because they bypass the compiler's analysis. If you assert a value as the wrong type, TypeScript will trust you and allow operations that will fail at runtime. For example, asserting a string as a number will compile without error but crash when you try to use it as a number. TypeScript enforces a basic sanity check — you cannot assert between completely unrelated types (string as number is an error) — but you can always go through unknown as an intermediate step (value as unknown as TargetType), which is sometimes called a double assertion.\n\nBest practice is to minimize assertions and prefer type guards for narrowing. When assertions are necessary, validate the data at runtime before asserting. Non-null assertion (value!) is a special assertion that tells TypeScript a value is not null or undefined — use it sparingly and only when you can guarantee the value's existence. Assertion functions (asserts value is Type) combine runtime validation with type narrowing, offering a safer alternative to plain assertions.",
        shortAnswer:
          "Type assertions (as Type) override compiler inference without runtime transformation. They are useful when you know more than the compiler but risky when incorrect. Prefer type guards over assertions for safety.",
        code: `// Basic assertion with as
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
console.log(config.toUpperCase()); // narrowed to string after assertion`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-fundamentals-1",
        tags: [
          "type assertions",
          "as",
          "non-null assertion",
          "assertion functions",
          "type guards",
        ],
        commonMistakes: [
          "Using assertions to silence errors instead of fixing the underlying type mismatch",
          "Relying on non-null assertion (!) without ensuring the value actually exists at runtime",
          "Using double assertions (as unknown as T) as a routine pattern instead of a last resort",
        ],
        followUps: [
          "What is the difference between a type assertion and a type guard?",
          "How do assertion functions (asserts value is T) work?",
          "When is a double assertion justified?",
        ],
        interviewTips: [
          "Acknowledge that assertions have legitimate uses but emphasize preferring type guards for safety",
          "Demonstrating knowledge of assertion functions shows advanced TypeScript understanding",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
    ],
  },

  {
    id: "ts-advanced-1",
    title: "Advanced TypeScript Types",
    description:
      "Deep exploration of advanced type-level programming in TypeScript including generics, utility types, conditional types, mapped types, template literal types, and the infer keyword.",
    category: "TypeScript",
    difficulty: "Advanced",
    tags: [
      "generics",
      "utility types",
      "conditional types",
      "mapped types",
      "template literal types",
      "keyof",
      "typeof",
      "infer",
      "union types",
      "intersection types",
    ],
    overview:
      "Advanced TypeScript types transform the language from a simple annotation system into a powerful type-level programming language. Generics enable reusable, parameterized types. Utility types like Partial, Pick, and Omit provide common type transformations out of the box. Conditional types enable type-level branching, mapped types iterate over keys to transform object types, and the infer keyword extracts types from complex structures. Mastering these features lets you write library-quality type definitions that catch bugs at compile time while maintaining flexibility.",
    concepts: [
      "Union types and intersection types",
      "Generics: functions, interfaces, classes, and constraints",
      "Built-in utility types: Partial, Required, Pick, Omit, Record, Exclude, Extract, ReturnType, Parameters",
      "keyof operator for extracting object keys as a union",
      "typeof operator for extracting the type of a value",
      "Conditional types with extends and ternary syntax",
      "Mapped types with in keyof for transforming object types",
      "Template literal types for typed string patterns",
      "The infer keyword for type extraction in conditional types",
      "Distributive conditional types",
      "Recursive types",
    ],
    codeExamples: [
      {
        title: "Generics with Constraints",
        code: `// Generic function with constraint
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
scores.set("Alice", 95);`,
        language: "typescript",
        explanation:
          "Generics with extends constraints ensure type parameters meet required contracts while maintaining precise return types.",
      },
      {
        title: "Conditional and Mapped Types",
        code: `// Conditional type
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
// { name: string; email: string }`,
        language: "typescript",
        explanation:
          "Conditional types enable type-level if/else logic. Mapped types iterate over keys to create transformed object types. Key remapping with as filters out properties.",
      },
    ],
    relatedTopicIds: ["ts-fundamentals-1", "ts-type-safety-1", "ts-react-1"],
    questions: [
      {
        id: "ts-advanced-1",
        question: "What are union and intersection types in TypeScript?",
        answer:
          "Union and intersection types are two fundamental type operators that combine existing types into new ones. A union type (A | B) represents a value that can be either type A or type B, while an intersection type (A & B) represents a value that is simultaneously both type A and type B.\n\nUnion types are used when a value can take multiple forms. A function parameter typed as string | number accepts either a string or a number. When working with a union type, you can only access members that are common to all constituent types unless you narrow the type first. For example, (string | number) only allows operations valid on both strings and numbers. To access string-specific methods, you must narrow using typeof, instanceof, or a discriminant property. This is where discriminated unions shine: adding a common literal property (like { type: 'circle' } | { type: 'square' }) allows TypeScript to narrow based on that discriminant.\n\nIntersection types combine multiple types into one that has all members of each constituent type. { name: string } & { age: number } produces { name: string; age: number }. Intersections are commonly used to compose object types: extend a base type with additional properties without using interface extends. They are also essential for mixins and for requiring a value to satisfy multiple interface contracts simultaneously.\n\nA key distinction is how unions and intersections interact with function parameters and type narrowing. Unions are narrowed down (you start with multiple possibilities and eliminate them), while intersections accumulate constraints (the value must satisfy all types at once). When applied to incompatible primitives, intersections produce never (string & number is never because no value can be both). Understanding this duality is essential for composing complex type expressions in generic utility types, conditional types, and real-world application architecture.",
        shortAnswer:
          "Union (A | B) means a value is one of the constituent types. Intersection (A & B) means a value is all constituent types simultaneously. Unions require narrowing to access type-specific members; intersections combine all members.",
        code: `// Union type — value is one of several types
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
type Impossible = string & number; // never`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "union types",
          "intersection types",
          "discriminated unions",
          "narrowing",
        ],
        commonMistakes: [
          "Trying to access type-specific properties on a union without narrowing first",
          "Confusing union (either/or) with intersection (both) — they are duals, not synonyms",
          "Creating impossible intersections of incompatible primitives and being surprised by never",
        ],
        followUps: [
          "How do discriminated unions enable exhaustive pattern matching?",
          "What happens when you intersect two object types with conflicting property types?",
          "How do unions distribute over conditional types?",
        ],
        interviewTips: [
          "Use a discriminated union example to demonstrate real-world union usage",
          "Explain the union/intersection duality: unions narrow down, intersections accumulate",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
      {
        id: "ts-advanced-2",
        question:
          "Explain generics in TypeScript and how to use generic constraints.",
        answer:
          "Generics are TypeScript's mechanism for creating reusable components that work with multiple types while preserving type relationships. Instead of using any (which loses type information) or writing separate implementations for each type, generics let you parameterize a function, class, or interface with type variables that are filled in by the caller.\n\nA generic function like function identity<T>(value: T): T preserves the relationship between input and output types. When called as identity('hello'), TypeScript infers T as string and the return type is string, not any. This is essential for utility functions, data structures, and API wrappers where the specific type varies but the structural pattern is consistent. Multiple type parameters (function map<T, U>(arr: T[], fn: (item: T) => U): U[]) capture relationships between inputs and outputs.\n\nGeneric constraints, written with extends, restrict what types can be used as a type parameter. The constraint <T extends { length: number }> means T must have a numeric length property — this accepts strings, arrays, and any object with length, but rejects numbers. The keyof constraint (<K extends keyof T>) is extremely common: it ensures a key parameter is actually a valid property name of the given object type. This pattern powers type-safe property access functions and is the foundation of utility types like Pick and Omit.\n\nGenerics also apply to interfaces and classes. A generic interface like interface Repository<T> { find(id: string): T; save(item: T): void } defines a contract that is parameterized by the entity type. Generic classes like class Stack<T> maintain type safety across all methods. Default type parameters (<T = string>) provide fallbacks. Generics are the backbone of TypeScript's type-level expressiveness and are used extensively in library type definitions, React component typing, and any code that needs to be both reusable and type-safe.",
        shortAnswer:
          "Generics parameterize types with type variables (T, U) for reusable, type-safe components. Constraints (extends) restrict type parameters. They preserve type relationships that any would lose.",
        code: `// Basic generic function
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
};`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "generics",
          "constraints",
          "keyof",
          "extends",
          "type parameters",
        ],
        commonMistakes: [
          "Using any instead of generics, losing the type relationship between inputs and outputs",
          "Over-constraining generic parameters when a simpler constraint would suffice",
          "Forgetting that generic type parameters can have defaults, leading to unnecessarily verbose call sites",
        ],
        followUps: [
          "How do conditional types interact with generics?",
          "What are higher-kinded types and does TypeScript support them?",
          "How do you write a generic that infers tuple types from rest parameters?",
        ],
        interviewTips: [
          "Implement a real utility function like pick or groupBy with generics to demonstrate practical skill",
          "Show the keyof + extends pattern — it is by far the most commonly tested generic pattern",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-advanced-3",
        question:
          "Explain the key utility types in TypeScript: Partial, Required, Pick, Omit, Record, Exclude, Extract, and ReturnType.",
        answer:
          "TypeScript ships with a collection of built-in utility types that perform common type transformations. Understanding what they do and how they are implemented deepens your understanding of mapped types, conditional types, and keyof — the building blocks from which they are constructed.\n\nPartial<T> makes all properties of T optional. It is implemented as a mapped type: { [K in keyof T]?: T[K] }. This is essential for update functions where you only want to change some fields: function updateUser(user: User, updates: Partial<User>). Required<T> is the opposite — it removes optionality from all properties, making every field mandatory. Readonly<T> makes all properties readonly.\n\nPick<T, K> extracts a subset of properties: Pick<User, 'name' | 'email'> produces { name: string; email: string }. Omit<T, K> is the complement, removing the specified properties. Record<K, V> creates an object type with keys of type K (a string/number/symbol union) and values of type V: Record<string, number> represents { [key: string]: number }. These three are workhorses for shaping API request/response types and component props.\n\nExclude<T, U> and Extract<T, U> operate on union types using conditional types. Exclude removes from union T any member assignable to U: Exclude<'a' | 'b' | 'c', 'a'> produces 'b' | 'c'. Extract keeps only the members assignable to U. ReturnType<T> extracts the return type of a function type: ReturnType<typeof JSON.parse> gives any. Parameters<T> extracts function parameters as a tuple. These utility types are the foundation for building your own complex type transformations: once you understand that Partial is just a mapped type with ?, you can create custom utilities like DeepPartial, Mutable, or Nullable by following the same patterns.",
        shortAnswer:
          "Partial makes all props optional, Required removes optionality, Pick/Omit select/exclude properties, Record maps keys to values, Exclude/Extract filter unions, ReturnType extracts function return types. All are built from mapped and conditional types.",
        code: `interface User {
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
type MyPartial<T> = { [K in keyof T]?: T[K] };`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "utility types",
          "Partial",
          "Pick",
          "Omit",
          "Record",
          "ReturnType",
          "Exclude",
        ],
        commonMistakes: [
          "Confusing Exclude (operates on unions) with Omit (operates on object property keys)",
          "Using Partial when only specific properties should be optional — Pick + Partial combination is often more precise",
          "Not realizing that ReturnType requires typeof when used with a value (function) rather than a type",
        ],
        followUps: [
          "How would you implement a DeepPartial utility type?",
          "What is the difference between Omit and Exclude internally?",
          "How do you create a utility type that makes only certain properties required?",
        ],
        interviewTips: [
          "Being able to reimplement Partial or Pick from scratch using mapped types demonstrates deep understanding",
          "Show a real use case like a Partial update DTO or a Pick-based API response type",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-advanced-4",
        question:
          "What are conditional types in TypeScript and how do they work?",
        answer:
          "Conditional types bring if/else logic to the type level. They use the syntax T extends U ? TrueType : FalseType — if T is assignable to U, the type resolves to TrueType; otherwise it resolves to FalseType. This enables type-level branching, dynamic return types, and powerful type inference patterns.\n\nThe simplest conditional types are type predicates: type IsString<T> = T extends string ? true : false. Applied to concrete types, they resolve immediately: IsString<'hello'> is true, IsString<42> is false. More useful patterns include overload-like return types: function process<T>(input: T): T extends string ? string[] : number where the return type depends on the input type.\n\nA critical behavior is distributive conditional types. When T is a naked type parameter and the input is a union, the conditional distributes across each member. type ToArray<T> = T extends any ? T[] : never applied to string | number produces string[] | number[], not (string | number)[]. This is because the condition is evaluated for each union member separately. To prevent distribution, wrap both sides in a tuple: [T] extends [any] ? ... — this treats the union as a single unit.\n\nThe infer keyword, usable only within conditional types, lets you extract types from complex structures. type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never extracts the return type R from a function type. type ElementType<T> = T extends (infer E)[] ? E : T extracts the element type from an array. You can infer multiple positions: type FirstAndRest<T> = T extends [infer First, ...infer Rest] ? [First, Rest] : never destructures a tuple. These patterns are the foundation of advanced type-level programming in TypeScript and are used extensively in library type definitions.",
        shortAnswer:
          "Conditional types use T extends U ? A : B for type-level branching. They distribute over unions by default (preventable with [T]). The infer keyword extracts types from patterns within conditional types.",
        code: `// Basic conditional type
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
type I = TypeName<() => void>; // "function"`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "conditional types",
          "infer",
          "distributive",
          "extends",
          "type-level programming",
        ],
        commonMistakes: [
          "Not understanding distributive behavior — T extends any distributes over unions when T is a naked type parameter",
          "Forgetting that infer can only be used within the extends clause of a conditional type",
          "Writing overly complex nested conditionals when a simpler mapped type or overload would work",
        ],
        followUps: [
          "How do you prevent a conditional type from distributing?",
          "Can you use multiple infer keywords in a single conditional type?",
          "How are recursive conditional types used in practice?",
        ],
        interviewTips: [
          "Implement ReturnType or Awaited from scratch to demonstrate mastery of infer",
          "Explain distributive behavior with a clear example — this is a common interview surprise question",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
      {
        id: "ts-advanced-5",
        question:
          "What are mapped types in TypeScript and how do you use key remapping?",
        answer:
          "Mapped types iterate over a set of keys to produce a new object type, transforming each property according to a rule. The syntax { [K in Keys]: ValueType } creates a new type by mapping each key K to a value type. When combined with keyof, modifiers (+/- readonly, +/- optional), and conditional types, mapped types become one of the most powerful tools in TypeScript's type system.\n\nThe basic pattern { [K in keyof T]: T[K] } reproduces the original type T. By adding modifiers, you create transformations: { [K in keyof T]?: T[K] } makes all properties optional (this is Partial<T>), { -readonly [K in keyof T]: T[K] } removes readonly from all properties, and { [K in keyof T]-?: T[K] } makes all properties required (this is Required<T>). You can also transform value types: { [K in keyof T]: Promise<T[K]> } wraps every property value in a Promise.\n\nKey remapping, introduced in TypeScript 4.1 with the as clause, enables filtering and renaming keys during mapping. The syntax { [K in keyof T as NewKey]: T[K] } remaps each key. To filter out properties, remap to never: { [K in keyof T as T[K] extends Function ? never : K]: T[K] } produces an object with only non-function properties. To rename keys, use template literal types: { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] } transforms { name: string } into { getName: () => string }.\n\nMapped types underpin most of TypeScript's built-in utility types and are essential for library authors and advanced application development. They enable patterns like creating getter/setter interfaces from data types, building type-safe ORM query builders, transforming API response types, and creating validation schemas that mirror data shapes. Understanding mapped types and key remapping gives you the ability to express complex type relationships that would otherwise require verbose manual type definitions.",
        shortAnswer:
          "Mapped types iterate over keys with [K in keyof T] to transform object types. Modifiers (+/-readonly, +/-?) toggle property attributes. Key remapping with as enables filtering (remap to never) and renaming keys.",
        code: `// Basic mapped type
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
// { db?: { host?: string; port?: number }; cache?: { ttl?: number } }`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "mapped types",
          "key remapping",
          "modifiers",
          "readonly",
          "template literal types",
        ],
        commonMistakes: [
          "Forgetting to intersect K with string when using template literal key remapping (Capitalize requires string)",
          "Not realizing that mapped types iterate over all keys including optional ones — the optional modifier carries through unless explicitly removed",
          "Attempting to use key remapping syntax in TypeScript versions before 4.1",
        ],
        followUps: [
          "How do you create a deep readonly type using recursive mapped types?",
          "What happens when you map over a union type with in?",
          "How are mapped types used in library type definitions like those in React or Prisma?",
        ],
        interviewTips: [
          "Implementing Partial or Readonly from scratch shows you understand mapped types beyond just using them",
          "The Getters example with key remapping is a great way to demonstrate practical mapped type usage",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-advanced-6",
        question:
          "How do keyof and typeof operators work at the type level in TypeScript?",
        answer:
          "keyof and typeof are type-level operators that extract type information from existing types and values. keyof produces a union of an object type's property names, while typeof extracts the TypeScript type of a runtime value. Together they form the foundation for type-safe property access, lookup types, and dynamic type derivation.\n\nkeyof T produces a union type of all public property names of T as string (or number/symbol) literals. For interface User { name: string; age: number; email: string }, keyof User is 'name' | 'age' | 'email'. This is essential for generic constraints: <K extends keyof T> ensures a key parameter is valid for the given object. Combined with indexed access types (T[K]), keyof enables type-safe property lookups where the return type depends on which key is accessed.\n\nThe typeof operator in type position extracts the TypeScript type from a runtime value. This is distinct from JavaScript's runtime typeof which returns a string. TypeScript's typeof lets you derive types from existing code: const config = { port: 3000, env: 'prod' }; type Config = typeof config produces the type { port: number; env: string }. This is particularly useful with ReturnType<typeof someFunction> to extract a function's return type without having an explicit type definition, and with enum objects where typeof MyEnum gives you the constructor type.\n\nThe combination of keyof and typeof is a powerful pattern. keyof typeof someObject extracts the keys of a runtime object as a type without defining a separate interface. This is common with configuration objects, constant maps, and enum-like plain objects. Indexed access types T[K] complete the picture: given keyof for the keys and the object type, T[K] gives you the value type for key K, enabling fully type-safe generic access patterns that are the backbone of TypeScript's type manipulation capabilities.",
        shortAnswer:
          "keyof extracts an object type's property names as a union type. typeof extracts the TypeScript type of a runtime value. Together, keyof typeof obj derives a value's key union without a separate type definition.",
        code: `// keyof — extracts property names as union
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
type StatusKey = keyof typeof Status; // "Active" | "Inactive"`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "keyof",
          "typeof",
          "indexed access",
          "lookup types",
          "type operators",
        ],
        commonMistakes: [
          "Confusing TypeScript typeof (type-level, returns the TS type) with JavaScript typeof (runtime, returns a string)",
          "Using keyof on a value instead of a type — you need keyof typeof value for runtime objects",
          "Forgetting that keyof includes number and symbol keys when the object type has them, not just string keys",
        ],
        followUps: [
          "How do indexed access types work with unions (T[K1 | K2])?",
          "What is the difference between keyof typeof enum vs the enum itself as a type?",
          "How do keyof and mapped types combine to create type transformations?",
        ],
        interviewTips: [
          "The getValue<T, K extends keyof T>(obj, key): T[K] pattern is the canonical keyof example — know it by heart",
          "Show awareness that keyof typeof bridges runtime values to the type system",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-advanced-7",
        question:
          "Explain template literal types in TypeScript and their practical uses.",
        answer:
          "Template literal types, introduced in TypeScript 4.1, allow you to construct string types by interpolating other string literal types using the same backtick syntax as JavaScript template literals but at the type level. Combined with union types, they can generate large sets of valid string patterns, enabling strongly typed string manipulation.\n\nThe basic syntax mirrors template strings: type Greeting = `hello ${string}` creates a type that matches any string starting with 'hello '. When you interpolate a union, the result distributes: type Color = 'red' | 'blue'; type Size = 'sm' | 'lg'; type ClassName = `${Color}-${Size}` produces 'red-sm' | 'red-lg' | 'blue-sm' | 'blue-lg'. This distributive behavior makes template literals powerful for generating typed event names, CSS class names, API route patterns, and configuration keys.\n\nTypeScript provides four intrinsic string manipulation types that work with template literals: Uppercase<T>, Lowercase<T>, Capitalize<T>, and Uncapitalize<T>. These transform string literal types: Capitalize<'hello'> is 'Hello'. Combined with mapped types and key remapping, they enable patterns like generating getter/setter names from property names: { [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void } transforms { name: string; age: number } into { onNameChange: (value: string) => void; onAgeChange: (value: number) => void }.\n\nPractical uses include typed event emitter interfaces, typed route definitions (type Route = `/${string}/${string}`), typed CSS utility classes, and type-safe string parsing. For example, a type like `${number}.${number}.${number}` can represent semantic version strings. Template literal types bridge the gap between the dynamic string world and the type system, enabling compile-time validation of string patterns that would otherwise require runtime checks.",
        shortAnswer:
          "Template literal types use `${Type}` syntax to construct string types. Unions distribute, producing all combinations. Combined with Capitalize/Lowercase and mapped types, they enable typed string patterns for events, routes, and APIs.",
        code: `// Basic template literal type
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
// "/api/v1/users" | "/api/v1/posts" | ... | "/api/v2/comments"`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "template literal types",
          "string manipulation",
          "Capitalize",
          "distributive",
          "key remapping",
        ],
        commonMistakes: [
          "Forgetting that template literal types with large unions produce exponentially many members, which can slow down the compiler",
          "Not intersecting K with string when using Capitalize in key remapping (symbol keys would cause an error)",
          "Expecting template literal types to work with runtime string values — they only operate on string literal types",
        ],
        followUps: [
          "How do template literal types combine with infer for string parsing at the type level?",
          "What are the performance implications of large template literal unions?",
          "How would you type a CSS-in-JS utility function using template literal types?",
        ],
        interviewTips: [
          "The event handler generation example is a compelling demonstration of practical template literal usage",
          "Mention the intrinsic string types (Uppercase, Lowercase, Capitalize, Uncapitalize) — many developers are not aware of them",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-advanced-8",
        question:
          "How does the infer keyword work in TypeScript conditional types?",
        answer:
          "The infer keyword lets you declare a type variable within the extends clause of a conditional type that is inferred from the matched pattern. It is TypeScript's mechanism for type extraction — pulling out part of a complex type's structure and using it as the result. infer can only appear within the extends clause and the inferred variable is only in scope within the true branch.\n\nThe canonical example is ReturnType: type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never. Here, if T is a function type, R is inferred as whatever the function returns. ReturnType<() => string> gives string. Similarly, type ElementType<T> = T extends (infer E)[] ? E : T extracts the element type from an array, and type UnwrapPromise<T> = T extends Promise<infer U> ? U : T extracts the resolved type from a Promise.\n\nMultiple infer positions can extract different parts of a type simultaneously. With tuple types, you can destructure: type Head<T> = T extends [infer First, ...any[]] ? First : never extracts the first element. type Tail<T> = T extends [any, ...infer Rest] ? Rest : never extracts all remaining elements. For function types, you can infer both parameters and return type: type FnParts<T> = T extends (...args: infer P) => infer R ? { params: P; returns: R } : never.\n\ninfer enables recursive types for deep transformations. type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T recursively unwraps nested Promises until it reaches a non-Promise type. type Flatten<T> = T extends Array<infer E> ? Flatten<E> : T recursively flattens nested arrays. These patterns are used extensively in library type definitions — ORMs like Prisma, validation libraries like Zod, and state managers like Redux all use infer-based conditional types to provide precise, automatically derived types from user-defined schemas and configurations.",
        shortAnswer:
          "infer declares a type variable in a conditional extends clause that TypeScript fills in by matching the pattern. It enables type extraction from functions (ReturnType), arrays (ElementType), Promises (Awaited), and tuples (Head/Tail).",
        code: `// Extract return type
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
// { resource: "users"; id: "123" }`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "infer",
          "conditional types",
          "type extraction",
          "ReturnType",
          "recursive types",
        ],
        commonMistakes: [
          "Trying to use infer outside of a conditional type extends clause — it is only valid there",
          "Forgetting that the inferred variable is only in scope in the true branch, not the false branch",
          "Creating infinitely recursive conditional types without a proper base case termination",
        ],
        followUps: [
          "How does infer interact with distributive conditional types?",
          "Can you infer multiple type variables from the same position?",
          "How do libraries like Zod and Prisma use infer for schema type derivation?",
        ],
        interviewTips: [
          "Implementing ReturnType or Awaited with infer is a classic advanced TypeScript interview question",
          "The string parsing example with template literal types and infer shows cutting-edge TypeScript knowledge",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
      {
        id: "ts-advanced-9",
        question:
          "How do you build custom utility types in TypeScript using mapped types, conditional types, and infer?",
        answer:
          "Building custom utility types combines mapped types, conditional types, infer, and template literal types to create type transformations tailored to your application's needs. The built-in utility types are just starting points — real-world projects often need specialized transformations that go beyond what Partial, Pick, and Omit provide.\n\nDeepPartial is a common custom utility that recursively makes all nested properties optional. The implementation uses a mapped type with a conditional check: type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }. For each property, if the value type extends object, we recursively apply DeepPartial; otherwise we keep the original type and just add the ? modifier. This pattern is essential for deeply nested configuration objects and form state management.\n\nMore advanced patterns include type-level filtering, overriding, and picking by value type. RequiredKeys<T> extracts only the keys that are required: type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]. This maps each key, checks if the property is optional (by testing if {} extends a type with just that property), and filters via never. PickByType<T, V> selects only properties whose values match a given type: type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] }.\n\nThe most powerful custom utilities combine all these features. For example, a type that converts a flat API response type into a nested object based on dot-notation keys, or a type that generates a validated builder pattern where calling methods in a specific order is enforced at the type level. type Override<T, U> = Omit<T, keyof U> & U replaces matching properties. type StrictOmit<T, K extends keyof T> = Omit<T, K> prevents omitting non-existent keys. These patterns demonstrate that TypeScript's type system is Turing-complete — you can express virtually any type transformation if you understand the building blocks.",
        shortAnswer:
          "Custom utility types combine mapped types, conditional types, key remapping, and infer. Common examples include DeepPartial, PickByType, RequiredKeys, and Override. Understanding the building blocks lets you create any type transformation.",
        code: `// DeepPartial — recursively make all properties optional
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
};`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-advanced-1",
        tags: [
          "custom utility types",
          "DeepPartial",
          "mapped types",
          "conditional types",
          "type-level programming",
        ],
        commonMistakes: [
          "Not handling edge cases like arrays and Dates in DeepPartial — object extends check matches arrays too, requiring special handling",
          "Infinite recursion in recursive types when the base case does not properly terminate",
          "Overcomplicating types when a simpler composition of built-in utilities would suffice",
        ],
        followUps: [
          "How do you handle arrays and Date objects in DeepPartial without making them partial too?",
          "What are the compile-time performance implications of deeply recursive types?",
          "How do you test custom utility types to ensure they behave correctly?",
        ],
        interviewTips: [
          "Being able to build DeepPartial or PickByType from scratch demonstrates strong command of the type system",
          "Explain the building blocks step by step — interviewers care more about your reasoning than memorized solutions",
        ],
        relatedTopics: ["ts-fundamentals-1", "ts-type-safety-1"],
      },
    ],
  },

  {
    id: "ts-type-safety-1",
    title: "TypeScript Type Safety",
    description:
      "Patterns and techniques for maximizing type safety in TypeScript, including type guards, type narrowing, discriminated unions, exhaustive checking, assertion functions, branded types, and the never type.",
    category: "TypeScript",
    difficulty: "Advanced",
    tags: [
      "type guards",
      "narrowing",
      "discriminated unions",
      "never",
      "unknown",
      "exhaustive checking",
      "assertion functions",
      "type predicates",
      "branded types",
    ],
    overview:
      "TypeScript's type safety goes beyond simple annotations — it includes a sophisticated system of type narrowing, guards, and patterns that progressively refine types through control flow analysis. This topic covers the full spectrum of type safety techniques: built-in type guards (typeof, instanceof, in), custom type predicates, discriminated unions for modeling state, exhaustive checking with never, assertion functions that combine runtime validation with type narrowing, and branded types for nominal typing in a structurally typed system.",
    concepts: [
      "typeof type guard for primitive narrowing",
      "instanceof type guard for class narrowing",
      "in operator type guard for property checking",
      "Custom type predicates with value is Type",
      "Type narrowing through control flow analysis",
      "Discriminated unions with a shared literal discriminant",
      "Exhaustive switch/case checking with never",
      "The never type: impossible values and bottom type",
      "unknown vs any: safe top type versus unsafe escape hatch",
      "Assertion functions with asserts keyword",
      "Branded/opaque types for nominal typing",
      "Satisfies operator for type validation without widening",
    ],
    codeExamples: [
      {
        title: "Type Guards and Narrowing",
        code: `// typeof guard
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
}`,
        language: "typescript",
        explanation:
          "TypeScript narrows types through control flow analysis when it encounters typeof, instanceof, in, or custom type predicates.",
      },
      {
        title: "Discriminated Unions and Exhaustive Checking",
        code: `type Result<T, E = Error> =
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
}`,
        language: "typescript",
        explanation:
          "Discriminated unions use a shared literal property for narrowing. The assertNever pattern ensures every variant is handled at compile time.",
      },
    ],
    relatedTopicIds: ["ts-fundamentals-1", "ts-advanced-1", "ts-react-1"],
    questions: [
      {
        id: "ts-type-safety-1",
        question:
          "What are type guards in TypeScript and what are the different types?",
        answer:
          "Type guards are expressions that narrow the type of a variable within a conditional block, allowing TypeScript's control flow analysis to refine broad types into more specific ones. They are the mechanism by which you safely work with union types, unknown values, and polymorphic data without resorting to type assertions.\n\nTypeScript recognizes several built-in type guards. The typeof guard checks primitive types: typeof x === 'string' narrows x to string. It works for 'string', 'number', 'boolean', 'symbol', 'bigint', 'undefined', 'function', and 'object'. The instanceof guard narrows to class instances: if (error instanceof TypeError) narrows error to TypeError. The in operator checks for property existence: 'bark' in animal narrows animal to whichever union member has a bark property.\n\nCustom type predicates let you define your own type guard functions. The return type annotation paramName is Type tells TypeScript that if the function returns true, the parameter has the specified type. For example, function isUser(value: unknown): value is User { ... } narrows the parameter to User in the truthy branch. This is the primary mechanism for validating external data (API responses, JSON parsing, form inputs) while getting compile-time type safety.\n\nTypeScript also narrows types through truthiness checks (if (x) narrows out null/undefined), equality checks (x === 'hello' narrows to the literal 'hello'), and assignment (x = 'hello' narrows x to string within that scope). The control flow analysis is sophisticated: it tracks narrowing through if/else, switch, ternary operators, and even logical operators (&& and ||). Understanding these narrowing mechanisms is essential for writing code that is both type-safe and readable, avoiding the temptation to silence the compiler with assertions.",
        shortAnswer:
          "Type guards narrow types in conditional blocks. Built-in guards include typeof (primitives), instanceof (classes), and in (property check). Custom type predicates (value is Type) define reusable guard functions.",
        code: `// typeof guard
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
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "type guards",
          "typeof",
          "instanceof",
          "in",
          "type predicates",
          "narrowing",
        ],
        commonMistakes: [
          "Writing a type predicate function that returns true for invalid data — the compiler trusts your predicate unconditionally",
          'Using typeof to check for arrays or null — typeof null is "object" and typeof [] is "object", requiring Array.isArray or null checks',
          "Forgetting that instanceof does not work across different realms (iframes, Node.js vm modules)",
        ],
        followUps: [
          "What is the difference between a type predicate and a type assertion?",
          "How does control flow analysis handle type narrowing across function boundaries?",
          "What are assertion functions and how do they differ from type predicates?",
        ],
        interviewTips: [
          "Write a real type predicate for validating unknown API data — it demonstrates practical TypeScript skill",
          'Mention the typeof null === "object" quirk and how to handle it',
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-type-safety-2",
        question:
          "How does type narrowing work through control flow analysis in TypeScript?",
        answer:
          "Type narrowing is the process by which TypeScript refines a variable's type from a broader type to a more specific one based on control flow. The compiler tracks assignments, conditions, and returns to determine the precise type at each point in the code. This analysis is what makes TypeScript practical — without it, you would need constant type assertions.\n\nThe most common narrowing occurs through conditional checks. After if (typeof x === 'string'), the compiler knows x is a string in the if block and whatever remains of the union in the else block. This works through if/else chains, switch statements, ternary expressions, and logical operators. The compiler also narrows through truthiness: if (x) eliminates null and undefined from x's type. Equality comparisons narrow to specific values or types: x === null narrows to null, x === 'admin' narrows to the literal type 'admin'.\n\nNarrowing is flow-sensitive and respects early returns, throws, and assignments. After if (!x) return, the code below knows x is truthy. After if (!x) throw new Error(), same effect. Assignment narrows within the assignment's scope: let x: string | number = 'hello' means x is string until reassigned. The compiler even tracks discriminant properties: for a discriminated union type { kind: 'a', data: string } | { kind: 'b', data: number }, checking kind narrows both the kind and data properties simultaneously.\n\nAdvanced narrowing includes the satisfies operator (TypeScript 4.9+), which validates a value against a type without widening it. const config = { port: 3000 } satisfies Config ensures config matches Config but preserves the literal type 3000 for port. The compiler also narrows through array methods: after array.filter((x): x is string => typeof x === 'string'), the result is typed as string[]. Understanding these flows lets you write TypeScript that is both maximally type-safe and readable.",
        shortAnswer:
          "TypeScript narrows types through control flow: conditionals, typeof/instanceof/in checks, equality, truthiness, early returns, and discriminant properties. Each code path has the most specific type the compiler can determine.",
        code: `// Narrowing through conditionals
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
);`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "narrowing",
          "control flow",
          "satisfies",
          "discriminant",
          "truthiness",
        ],
        commonMistakes: [
          "Expecting narrowing to persist across function call boundaries — calling a function resets narrowing because the function could have side effects",
          'Not realizing that truthiness narrowing eliminates 0, "", and false along with null and undefined',
          "Relying on narrowing in callbacks where the variable could be reassigned between the check and the callback execution",
        ],
        followUps: [
          "How does the satisfies operator differ from a type annotation?",
          "Why does narrowing not persist in closures or callbacks?",
          "How do assertion functions combine runtime checks with narrowing?",
        ],
        interviewTips: [
          "Show the early-return narrowing pattern — it is a clean, practical style that interviewers appreciate",
          "Mention the satisfies operator to demonstrate knowledge of recent TypeScript additions",
        ],
        relatedTopics: ["ts-fundamentals-1", "ts-advanced-1"],
      },
      {
        id: "ts-type-safety-3",
        question: "What is the never type in TypeScript and how is it used?",
        answer:
          "never is TypeScript's bottom type — it represents a value that can never occur. No value is assignable to never (except never itself), and never is assignable to every type. It appears in situations where code paths are unreachable, functions never return, or type-level computations produce impossible types.\n\nThe most direct use of never is in functions that never return. A function that always throws an error has return type never: function fail(msg: string): never { throw new Error(msg) }. An infinite loop also has return type never. This is distinct from void — void means the function returns but with no value; never means the function never reaches a return point. TypeScript uses this distinction in control flow analysis: after calling a never-returning function, the compiler knows subsequent code is unreachable.\n\nnever is the exhaustive check mechanism for discriminated unions. In a switch statement over a discriminated union, the default case should receive the discriminant variable. If all variants are handled, the variable is narrowed to never. If a new variant is added to the union but not handled in the switch, the variable will not be never in the default case, producing a compile error. The pattern function assertNever(x: never): never { throw new Error('Unexpected: ' + x) } codifies this: passing a non-never value is a compile error, alerting you to unhandled cases.\n\nAt the type level, never represents the empty set — a type with no possible values. Intersecting incompatible types produces never: string & number is never. In conditional types, never is used to filter union members: Exclude<'a' | 'b' | 'c', 'a'> uses a conditional type that returns never for the excluded member, and since T | never simplifies to T, the excluded member disappears from the union. Understanding never as the empty set makes its behavior in unions (absorbed), intersections (absorbs everything), and conditionals (filters) intuitive.",
        shortAnswer:
          "never is the bottom type representing impossible values. It is used for functions that never return (throw/infinite loop), exhaustive checking in switch statements, and filtering unions in conditional types (never in a union is absorbed).",
        code: `// Function that never returns
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
type NoArgs<T extends never[]> = T;`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "never",
          "bottom type",
          "exhaustive checking",
          "unreachable",
          "type safety",
        ],
        commonMistakes: [
          "Confusing never with void — void means no return value, never means the function never completes",
          "Not using assertNever in switch defaults, missing compile-time safety when new union members are added",
          "Not understanding that never in a union is absorbed (string | never = string) while in an intersection it absorbs (string & never = never)",
        ],
        followUps: [
          "How does never relate to the empty set in type theory?",
          "Why is never assignable to every type?",
          "How do you use never to create exhaustive type checks outside of switch statements?",
        ],
        interviewTips: [
          "The assertNever pattern for exhaustive checking is a must-know for TypeScript interviews",
          "Explain never as the empty set — it makes all its behaviors logical and memorable",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-type-safety-4",
        question:
          "What are discriminated unions and how do they enable exhaustive pattern matching?",
        answer:
          "Discriminated unions (also called tagged unions) are a TypeScript pattern where each member of a union type has a common property — the discriminant — with a unique literal type value. This shared property lets TypeScript narrow the entire union to a specific member by checking just the discriminant, enabling safe access to variant-specific properties.\n\nThe structure is straightforward: define multiple types that share a property with distinct literal values. type Result = { status: 'success'; data: string } | { status: 'error'; error: Error } | { status: 'loading' } uses status as the discriminant. When you check result.status === 'success', TypeScript narrows the type to { status: 'success'; data: string }, making data safely accessible. This works in if/else chains, switch statements, and ternary expressions.\n\nExhaustive checking ensures every variant is handled. In a switch over the discriminant, TypeScript tracks which variants have been matched. If you handle all cases, the discriminant in the default branch is narrowed to never. Adding assertNever(x: never): never in the default case creates a compile-time guarantee: if a new variant is added to the union without being handled, the type of x in default is no longer never, and the compiler reports an error. This is a safety net against incomplete pattern matching.\n\nDiscriminated unions are the idiomatic way to model state machines, API responses, form states, and any domain where an entity can be in one of several distinct states with different associated data. They replace class hierarchies and inheritance-based polymorphism with a simpler, more composable pattern. Libraries like Redux use discriminated unions for action types, React Query uses them for query states, and domain modeling in functional TypeScript relies heavily on them. The pattern scales well: you can nest discriminated unions, combine them with generics, and use them with conditional types for powerful type-level dispatch.",
        shortAnswer:
          "Discriminated unions share a literal-typed discriminant property. Checking it narrows to the specific variant. The assertNever pattern in switch defaults ensures every variant is handled at compile time.",
        code: `// Discriminated union for API state
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
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "discriminated unions",
          "tagged unions",
          "exhaustive checking",
          "pattern matching",
          "state machines",
        ],
        commonMistakes: [
          "Choosing a discriminant property whose values are not unique across variants — each variant must have a distinct literal value",
          "Forgetting the assertNever pattern in the switch default, losing compile-time exhaustive guarantees",
          "Using optional discriminant properties — the discriminant must exist on every variant for narrowing to work",
        ],
        followUps: [
          "How do discriminated unions compare to class hierarchies for polymorphism?",
          "Can you use discriminated unions with generics for typed state machines?",
          "How do React state management patterns like useReducer leverage discriminated unions?",
        ],
        interviewTips: [
          "Model a real-world example (API state, payment methods, form steps) to show practical application",
          "Always include the assertNever exhaustive check to demonstrate thoroughness",
        ],
        relatedTopics: ["ts-advanced-1", "ts-react-1"],
      },
      {
        id: "ts-type-safety-5",
        question:
          "What are assertion functions in TypeScript and how do they differ from type predicates?",
        answer:
          "Assertion functions are functions that throw an error if a condition is not met and narrow the type of their parameter for all subsequent code after the call. They use the asserts keyword in their return type annotation: asserts value is Type or simply asserts value. Unlike type predicates which narrow within a conditional block, assertion functions narrow the variable for the entire scope after the function call.\n\nThe syntax has two forms. asserts value is Type narrows the parameter to the specified type: function assertString(value: unknown): asserts value is string { if (typeof value !== 'string') throw new Error('Not a string'); }. After calling assertString(x), x is typed as string for all subsequent code — no if/else required. The simpler form asserts value just asserts truthiness: function assertDefined<T>(value: T | null | undefined): asserts value is T { if (value == null) throw new Error('Value is null'); }.\n\nType predicates (value is Type) are used in boolean-returning functions that serve as conditions. They narrow within the truthy/falsy branches of a conditional. Assertion functions, by contrast, either throw or proceed — there is no else branch. This makes assertion functions ideal for validation at the start of functions, where you want to fail fast and have the rest of the function work with the narrowed type. They are the TypeScript equivalent of assert statements in other languages.\n\nPractical uses include validating function inputs, asserting environment variables exist, ensuring API response shapes, and validating configuration at startup. Assertion functions pair naturally with the fail-fast pattern: validate all preconditions at the top of a function, then write the main logic knowing all types are safe. Libraries like Node.js's built-in assert module and testing frameworks like Jest and Vitest define assertion functions so that assertions narrow types for subsequent code in tests.",
        shortAnswer:
          "Assertion functions throw on invalid input and narrow the type for all code after the call (not just inside a conditional). They use asserts value is Type syntax and are ideal for fail-fast validation.",
        code: `// Assertion function — narrows type for all subsequent code
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
console.log(rawConfig.host); // narrowed to Config`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "assertion functions",
          "asserts",
          "type predicates",
          "narrowing",
          "validation",
        ],
        commonMistakes: [
          "Writing an assertion function that does not actually throw — the compiler trusts the asserts annotation unconditionally",
          "Using assertion functions where a type predicate would be more appropriate (when you want to handle both cases, not just throw)",
          "Forgetting that assertion functions must throw (not return false) to satisfy the asserts contract",
        ],
        followUps: [
          "Can assertion functions be async?",
          "How do assertion functions interact with control flow analysis in try/catch?",
          "How does Node.js assert module define assertion signatures?",
        ],
        interviewTips: [
          "Contrast assertion functions with type predicates clearly — the key difference is scope of narrowing and error handling style",
          "Show the assertDefined pattern — it is practical, concise, and commonly used in production code",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-type-safety-6",
        question:
          "What are branded types (opaque types) in TypeScript and why are they useful?",
        answer:
          "TypeScript uses structural typing — two types are compatible if their structure matches, regardless of their names. This means type UserId = string and type OrderId = string are interchangeable, even though mixing them up is a bug. Branded types solve this by adding a phantom property that makes structurally identical types incompatible, effectively simulating nominal typing.\n\nThe pattern involves adding a unique, non-existent property (the brand) to a base type: type UserId = string & { readonly __brand: unique symbol }. This intersection creates a type that is a string with an additional property that can never actually exist at runtime. Since the brand symbol is unique to each branded type, UserId and OrderId (with its own unique symbol) are incompatible — passing a UserId where an OrderId is expected is a compile error. The brand has zero runtime cost because it is purely a type-level construct.\n\nTo create branded values, you define constructor functions that perform validation and cast to the branded type: function createUserId(id: string): UserId { if (!isValidUUID(id)) throw new Error('Invalid user ID'); return id as UserId; }. This centralized validation ensures that any value of type UserId has been validated through the constructor. All functions that accept UserId can trust that the value is a valid, validated user ID without re-checking.\n\nBranded types are powerful for domain modeling. They prevent mixing up IDs for different entities (UserID vs ProductID), ensure units are respected (Kilometers vs Miles), validate formats (Email, URL, PhoneNumber), and enforce business rules (PositiveNumber, NonEmptyString). Libraries like io-ts, Zod, and Effect use branded types extensively. The pattern works with any base type — numbers, strings, objects — and composes well with utility types and generics. It is one of the most effective ways to catch semantic bugs at compile time in a structurally typed language.",
        shortAnswer:
          "Branded types add a phantom property to base types, making structurally identical types incompatible. This simulates nominal typing for IDs, units, and validated values with zero runtime overhead.",
        code: `// Brand utility type
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
console.log(createPositiveInt(5) + 10); // number operations still work`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Scenario",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "branded types",
          "opaque types",
          "nominal typing",
          "domain modeling",
          "type safety",
        ],
        commonMistakes: [
          "Forgetting to create constructor functions, allowing raw values to be cast to branded types anywhere in the codebase",
          "Making the brand property non-unique between types, which defeats the purpose",
          "Overusing branded types for every primitive, adding unnecessary complexity where plain types would suffice",
        ],
        followUps: [
          "How do branded types compare to newtypes in Haskell or opaque types in Flow?",
          "Can you use branded types with generics for a reusable validation pattern?",
          "How do validation libraries like Zod implement branded types?",
        ],
        interviewTips: [
          "The UserID vs OrderID example is compelling and immediately shows practical value",
          "Emphasize zero runtime cost — branded types are erased during compilation",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-type-safety-7",
        question:
          "How do you handle unknown types safely in TypeScript, especially for API responses and error handling?",
        answer:
          "Handling unknown types safely is one of TypeScript's most practical type safety patterns. External data — API responses, JSON parsing, localStorage values, URL parameters, catch clause errors — enters your application as unknown or any. Establishing safe boundaries where you validate and narrow this data before it flows into your typed application is essential for preventing runtime errors.\n\nThe standard pattern for API responses involves typing the fetch result as unknown and then validating it with a type guard or assertion function. Instead of blindly casting JSON.parse output with as MyType (which provides no runtime safety), you create a validation function: function isApiResponse(data: unknown): data is ApiResponse { ... }. This function checks every required property's existence and type, and the type predicate annotation tells TypeScript to narrow the type when the function returns true.\n\nError handling is another critical boundary. TypeScript 4.4 introduced useUnknownInCatchVariables, which types catch clause errors as unknown instead of any. This forces you to narrow the error before accessing properties: catch (error) { if (error instanceof Error) { console.log(error.message); } }. This is important because not all thrown values are Error instances — you might catch strings, numbers, or arbitrary objects. A common utility function handles this: function getErrorMessage(error: unknown): string { if (error instanceof Error) return error.message; return String(error); }.\n\nFor comprehensive validation, consider using schema validation libraries like Zod, io-ts, or Valibot. These define schemas that both validate at runtime and infer TypeScript types: const UserSchema = z.object({ name: z.string(), age: z.number() }); type User = z.infer<typeof UserSchema>. The parse method validates unknown data and returns a typed value or throws. This is the gold standard for API boundary validation because it eliminates the need to write manual type guards and keeps the runtime validation and TypeScript type in sync automatically.",
        shortAnswer:
          "Validate unknown data at boundaries (API, JSON, catch) with type guards, assertion functions, or schema validation libraries (Zod). Never cast unknown to a type without runtime validation.",
        code: `// Safe API response handling
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
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "unknown",
          "validation",
          "API safety",
          "error handling",
          "type guards",
          "Zod",
        ],
        commonMistakes: [
          "Using as Type to cast API responses without runtime validation — this provides no safety and crashes at runtime on unexpected data",
          "Not handling non-Error thrown values in catch clauses — anything can be thrown in JavaScript",
          "Writing validation code manually for every type instead of using schema validation libraries that keep types and validation in sync",
        ],
        followUps: [
          "How do schema validation libraries like Zod infer TypeScript types from schemas?",
          "What is the best practice for typing fetch wrappers in a TypeScript application?",
          "How do you handle partial/evolving API responses during development?",
        ],
        interviewTips: [
          "Show awareness of the validation boundary concept — external data must be validated before entering the typed application",
          "Mentioning Zod or similar libraries shows you know the ecosystem beyond just raw TypeScript",
        ],
        relatedTopics: ["ts-fundamentals-1", "ts-react-1"],
      },
      {
        id: "ts-type-safety-8",
        question:
          "How do you implement exhaustive checking in TypeScript beyond switch statements?",
        answer:
          "Exhaustive checking ensures every variant of a union type is handled, catching missing cases at compile time. While the switch/assertNever pattern is the most common approach, TypeScript supports exhaustive checking in several other contexts — if/else chains, object lookup maps, and conditional type-level assertions.\n\nThe if/else chain approach mirrors the switch pattern. After each condition eliminates a union member, the variable's type narrows. In the final else, the variable should be never. You can either use assertNever or assign to a never-typed variable: const _exhaustive: never = value — this line produces a compile error if value is not never, meaning a variant was missed. This works identically to the switch approach but in if/else control flow.\n\nObject lookup maps provide an elegant alternative. Create an object whose keys are every variant of the discriminant and whose values are handler functions: const handlers: Record<Status, () => void> = { idle: () => {}, loading: () => {}, success: () => {}, error: () => {} }. The Record type with a union key ensures every variant has a handler. If a new variant is added, TypeScript will report a missing property error. This approach is often cleaner than switch statements and avoids the need for assertNever.\n\nFor type-level exhaustive checking in generic code, you can use conditional types. type AssertExhaustive<T extends never> = T ensures a generic type parameter has been fully narrowed. Helper types like type UnhandledCases<T, Handled> = Exclude<T, Handled> extends never ? true : false verify at the type level that all members of a union have been covered. These patterns are useful in library code, middleware chains, and plugin systems where exhaustiveness needs to be checked structurally rather than in a specific control flow. Each approach has trade-offs: switch is readable, object maps are composable, and type-level checks work in generic contexts.",
        shortAnswer:
          "Exhaustive checking works in switch (assertNever), if/else (assign to never variable), object maps (Record with union keys), and type-level assertions (Exclude extends never). Each ensures all union variants are handled.",
        code: `// Method 1: switch + assertNever (classic)
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
// Forces implementation of handlers for LOGIN, LOGOUT, and NAVIGATE`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "exhaustive checking",
          "never",
          "Record",
          "pattern matching",
          "discriminated unions",
        ],
        commonMistakes: [
          "Relying on a default case that returns a generic value instead of assertNever, silently swallowing new unhandled variants",
          "Forgetting to include the unreachable return after the never assignment in if/else chains",
          "Not leveraging Record types for object lookups, missing the simplest form of exhaustive checking",
        ],
        followUps: [
          "How do you handle exhaustive checking when the union is defined in a third-party library?",
          "Can TypeScript support pattern matching similar to Rust or Scala?",
          "How do mapped types provide exhaustive property coverage for event systems?",
        ],
        interviewTips: [
          "Show multiple approaches to demonstrate versatility — the object map pattern is often underappreciated",
          "The Record-based approach is cleaner than switch for many real-world use cases and worth highlighting",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-type-safety-9",
        question:
          "What is the satisfies operator in TypeScript and when should you use it?",
        answer:
          "The satisfies operator, introduced in TypeScript 4.9, validates that an expression conforms to a type without widening or changing the inferred type. It answers the question 'does this value match this shape?' while preserving the most specific type TypeScript can infer. This fills a gap that neither type annotations nor type assertions could address cleanly.\n\nWith a type annotation (const config: Config = { ... }), the value is widened to Config, losing specific literal types and autocomplete for specific keys. With a type assertion (const config = { ... } as Config), you are telling TypeScript to trust you without verifying the value matches. satisfies gives you both: validation that the value matches the type AND preservation of the inferred literal types.\n\nThe canonical example is configuration objects. const palette = { red: [255, 0, 0], green: '#00ff00' } satisfies Record<string, string | number[]> validates that all values are strings or number arrays, but palette.red is still typed as number[] (not string | number[]) and palette.green is still string. You get autocomplete for the specific keys 'red' and 'green' and the specific value types, while still catching errors if a value doesn't match the constraint.\n\nsatisfies is particularly useful in several patterns: validating object literals against a type while keeping literal key autocomplete, ensuring enum-like objects have the right shape without losing value specifics, validating function implementations match a type without widening the return type, and checking that configuration values match an interface while preserving const narrowing. It is especially powerful combined with as const: const config = { ... } as const satisfies Schema validates the frozen literal types against the schema. The satisfies operator has quickly become one of the most popular TypeScript features because it resolves a long-standing tension between type safety and type specificity.",
        shortAnswer:
          "satisfies validates a value matches a type without widening the inferred type. It provides type-checking of annotations with the specificity of inference — validating shape while preserving literal types and autocomplete.",
        code: `// Problem: annotation widens the type
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
// Each value preserves its literal type`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-type-safety-1",
        tags: [
          "satisfies",
          "type safety",
          "inference",
          "validation",
          "literal types",
        ],
        commonMistakes: [
          "Confusing satisfies with type annotations — satisfies does not change the inferred type, annotations do",
          "Using satisfies when a simple type annotation would be more readable and the specificity is not needed",
          "Not combining satisfies with as const when you want both immutability and validation",
        ],
        followUps: [
          "How does satisfies interact with as const?",
          "When would you choose a type annotation over satisfies?",
          "Can satisfies be used in function return statements?",
        ],
        interviewTips: [
          "The palette example is the canonical way to explain satisfies — use it to show the annotation vs satisfies trade-off clearly",
          "Knowing satisfies was introduced in TS 4.9 demonstrates you follow TypeScript releases actively",
        ],
        relatedTopics: ["ts-fundamentals-1", "ts-advanced-1"],
      },
    ],
  },

  {
    id: "ts-react-1",
    title: "React with TypeScript",
    description:
      "Comprehensive guide to typing React applications with TypeScript, including component props, hooks, events, refs, context, generic components, higher-order components, and custom hooks.",
    category: "TypeScript",
    difficulty: "Intermediate",
    tags: [
      "react",
      "props",
      "hooks",
      "events",
      "refs",
      "context",
      "generic components",
      "forwardRef",
      "HOC",
      "custom hooks",
    ],
    overview:
      "TypeScript dramatically improves the React development experience by catching prop errors at compile time, providing autocomplete for component APIs, and documenting component contracts through types. This topic covers the essential patterns for typing React applications: component props (FC vs plain functions), state management with typed hooks, event handling, refs and forwardRef, context, generic components, higher-order components, and custom hooks. These patterns form the foundation of a well-typed React codebase.",
    concepts: [
      "Typing component props: FC vs function declarations",
      "Typing children and render props",
      "useState with type parameter and type inference",
      "useRef with element types and mutable refs",
      "useReducer with discriminated union actions",
      "useContext with typed context and null handling",
      "Typing events: onChange, onClick, onSubmit, keyboard events",
      "forwardRef with generic component types",
      "Generic components for reusable typed containers",
      "Typing higher-order components (HOCs)",
      "Typing custom hooks with proper return types",
      "React.ComponentProps and other React utility types",
    ],
    codeExamples: [
      {
        title: "Component Props Patterns",
        code: `// Plain function (preferred over FC)
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
}`,
        language: "typescript",
        explanation:
          "Plain function components with explicit prop interfaces are preferred over React.FC. Discriminated union props model different component states.",
      },
      {
        title: "Typed Hooks",
        code: `// useState — type inference and explicit generics
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
const intervalRef = useRef<number | null>(null); // for mutable values`,
        language: "typescript",
        explanation:
          "Hooks leverage generics for type safety. useState infers from initial values. useReducer pairs with discriminated union actions. useRef has distinct patterns for DOM elements and mutable values.",
      },
    ],
    relatedTopicIds: ["ts-fundamentals-1", "ts-advanced-1", "ts-type-safety-1"],
    questions: [
      {
        id: "ts-react-1",
        question:
          "What is the difference between React.FC and plain function components for typing props?",
        answer:
          "There are two primary ways to type React function components: using the React.FC (or React.FunctionComponent) type alias, and using plain function declarations with typed props. The React community has shifted decisively toward plain functions, and understanding why reveals important TypeScript nuances.\n\nReact.FC<Props> is a generic type that defines a function component. It automatically includes children in the props type (prior to React 18), provides a displayName property, and sets the return type to ReactElement | null. The component is typically written as const MyComponent: React.FC<MyProps> = (props) => { ... }. While this seems convenient, it has several drawbacks that led to its declining popularity.\n\nThe problems with React.FC include: it used to implicitly accept children even when your component does not support them (fixed in React 18's types but still a concern in older codebases); it does not support generics well (you cannot write const List: React.FC<ListProps<T>> = ..., because the generic must be on the function, not the type alias); it prevents you from narrowing the return type beyond ReactElement | null; and it is verbose for no functional benefit. The React team and major style guides (including the React TypeScript Cheatsheet) now recommend against using FC.\n\nPlain function components simply declare props as the function parameter type: function Button(props: ButtonProps): ReactElement or with destructuring function Button({ label, onClick }: ButtonProps). This approach supports generics naturally (function List<T>(props: ListProps<T>)), allows explicit return type control, does not implicitly include children, and reads more like standard TypeScript. When you want to accept children, explicitly include children: React.ReactNode in your props interface. This makes the component's contract clear and avoids implicit behavior.",
        shortAnswer:
          "React.FC adds implicit children, prevents generics, and restricts return types. Plain function components with typed props are now preferred — they support generics, explicit children, and standard TypeScript patterns.",
        code: `// React.FC — declining pattern
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
/>`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "React.FC",
          "function components",
          "props",
          "generics",
          "children",
        ],
        commonMistakes: [
          "Using React.FC by default without understanding its limitations, especially with generic components",
          "Not explicitly typing children when the component should accept them — relying on implicit children is error-prone",
          "Forgetting that React 18 types removed implicit children from FC, which can break upgrades if children was relied upon implicitly",
        ],
        followUps: [
          "How do you type children to accept only specific child element types?",
          "What is the difference between ReactNode, ReactElement, and JSX.Element?",
          "How do you type a component that accepts all HTML attributes of a native element?",
        ],
        interviewTips: [
          "Knowing the FC vs plain function debate and recommending plain functions shows you follow community best practices",
          "The generic List component example demonstrates advanced React + TypeScript skill",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-react-2",
        question:
          "How do you type useState and useReducer hooks in TypeScript?",
        answer:
          "useState and useReducer are the most common state hooks in React, and TypeScript's generics make them type-safe with minimal annotation. Understanding when to rely on inference versus explicit generics is key to clean, correct component code.\n\nuseState infers its type from the initial value: useState(0) creates [number, Dispatch<SetStateAction<number>>]. For primitive initial values, inference works perfectly. However, when the initial value is null or undefined and the state will later hold a complex type, you need an explicit generic: useState<User | null>(null) tells TypeScript the state can be User or null. Without the generic, TypeScript infers the state as just null, and assigning a User object produces an error. The same applies to empty arrays: useState<string[]>([]) is clearer than letting TypeScript infer never[].\n\nuseReducer pairs naturally with discriminated union action types. The reducer function receives the current state and an action, and returns the new state. By typing the action parameter as a discriminated union (type Action = { type: 'INCREMENT'; amount: number } | { type: 'RESET' }), each case in the switch statement narrows to the specific action variant with its associated data. TypeScript infers the useReducer return type from the reducer function, so you get [State, Dispatch<Action>] automatically. The dispatch function only accepts valid Action objects, catching typos and missing payloads at compile time.\n\nAdvanced patterns include lazy initialization with useState(() => computeInitial()), where the type is inferred from the factory's return type. For useReducer, you can type the init function as the third parameter for lazy state computation. When state types are complex, defining them as separate interfaces keeps the component clean: interface FormState { values: Record<string, string>; errors: Record<string, string>; isSubmitting: boolean }. These typed state patterns ensure that every state update is checked at compile time, preventing an entire class of runtime bugs.",
        shortAnswer:
          "useState infers from initial values; use explicit generics for null/undefined initials (useState<User | null>(null)). useReducer works with discriminated union actions for type-safe dispatch.",
        code: `import { useState, useReducer } from "react";

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
// dispatch({ type: "UNKNOWN" }); // Error: invalid action type`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "useState",
          "useReducer",
          "hooks",
          "state management",
          "discriminated unions",
        ],
        commonMistakes: [
          "Not providing a generic when the initial state is null — useState(null) infers as null only, not the desired union",
          "Forgetting to handle all action types in the reducer, losing exhaustive checking",
          "Using the reducer return type as any or a loose type instead of the explicit state interface",
        ],
        followUps: [
          "How do you type a useReducer with an init function for lazy initialization?",
          "When should you use useReducer versus useState for complex state?",
          "How do you share typed dispatch across components?",
        ],
        interviewTips: [
          "The useReducer with discriminated unions pattern is a favorite interview topic — know it thoroughly",
          "Show that you understand when inference is sufficient versus when explicit generics are needed",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
      {
        id: "ts-react-3",
        question: "How do you type React event handlers in TypeScript?",
        answer:
          "Typing React events correctly is essential for type-safe form handling, user interactions, and DOM manipulation. React provides its own synthetic event types that wrap native DOM events with cross-browser compatibility. Understanding the event type hierarchy and how to apply it to handlers eliminates common errors and provides excellent autocomplete.\n\nReact events are typed through generic interfaces in the React namespace. The primary ones are: React.ChangeEvent<T> for onChange on inputs, selects, and textareas; React.MouseEvent<T> for onClick, onMouseDown, onMouseEnter; React.KeyboardEvent<T> for onKeyDown, onKeyUp, onKeyPress; React.FormEvent<T> for onSubmit on forms; React.FocusEvent<T> for onFocus, onBlur; and React.DragEvent<T> for drag-and-drop. The generic parameter T specifies the target element type (HTMLInputElement, HTMLButtonElement, etc.), giving you typed access to event.target and event.currentTarget.\n\nThere are two styles for typing event handlers: inline and extracted. Inline handlers benefit from contextual typing — TypeScript infers the event type from the JSX attribute: <input onChange={(e) => setName(e.target.value)} /> where e is automatically React.ChangeEvent<HTMLInputElement>. Extracted handlers need explicit annotation: const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }. For event handler props, use the React handler type aliases: onClick: React.MouseEventHandler<HTMLButtonElement> or the callback form onClick: (event: React.MouseEvent<HTMLButtonElement>) => void.\n\nA common pattern for forms is typing the submit handler with React.FormEvent<HTMLFormElement> and accessing form data through event.currentTarget. For custom events or native DOM events in useEffect, use the native Event types (not React synthetic events): element.addEventListener('click', (e: MouseEvent) => { ... }). The distinction between React synthetic events and native DOM events catches many developers off guard — they have similar names but are different types from different namespaces.",
        shortAnswer:
          "React provides generic synthetic event types: ChangeEvent<T>, MouseEvent<T>, KeyboardEvent<T>, FormEvent<T>. Inline handlers get contextual typing; extracted handlers need explicit annotation. The generic T specifies the target element type.",
        code: `import type { ChangeEvent, MouseEvent, FormEvent, KeyboardEvent } from "react";

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
}, []);`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "events",
          "ChangeEvent",
          "MouseEvent",
          "FormEvent",
          "event handlers",
        ],
        commonMistakes: [
          "Using native DOM Event types (MouseEvent) instead of React synthetic types (React.MouseEvent) in JSX handlers — they are different types",
          "Typing event.target instead of event.currentTarget — target can be any child element, currentTarget is the element the handler is attached to",
          "Not providing the correct element generic (e.g., using HTMLElement instead of HTMLInputElement), losing access to element-specific properties like value",
        ],
        followUps: [
          "What is the difference between event.target and event.currentTarget in React?",
          "How do you type custom events in React?",
          "How do React synthetic events differ from native DOM events?",
        ],
        interviewTips: [
          "Know the most common event types by heart: ChangeEvent, MouseEvent, FormEvent, KeyboardEvent",
          "Demonstrating the inline vs extracted handler typing pattern shows practical React TypeScript experience",
        ],
        relatedTopics: ["ts-fundamentals-1"],
      },
      {
        id: "ts-react-4",
        question:
          "How do you type useRef and forwardRef in React with TypeScript?",
        answer:
          "useRef serves two distinct purposes in React — holding a reference to a DOM element and storing a mutable value that persists across renders without causing re-renders. TypeScript distinguishes between these two use cases through the generic parameter and the initial value, and getting the types right is important for avoiding null-related errors.\n\nFor DOM references, the pattern is useRef<HTMLElementType>(null). The generic specifies the element type (HTMLInputElement, HTMLDivElement, HTMLButtonElement, etc.), and null is the initial value because the element does not exist until the component mounts. This creates a RefObject<HTMLElementType> where .current is typed as HTMLElementType | null. You must null-check before accessing: if (inputRef.current) { inputRef.current.focus(); }. TypeScript knows that after the component mounts and the ref is attached, current will be the element, but it cannot prove this statically.\n\nFor mutable value refs, the pattern is useRef<T>(initialValue) where the initial value is not null. This creates a MutableRefObject<T> where .current is directly assignable. Common uses include storing interval/timeout IDs (useRef<number | null>(null)), previous values, and instance variables. The key TypeScript distinction: if the generic includes null but the parameter is null (useRef<T | null>(null)), you get MutableRefObject. If only the generic is non-null (useRef<HTMLDivElement>(null)), you get RefObject — the read-only variant.\n\nforwardRef is needed when a parent component needs a ref to a DOM element inside a child component. It wraps the component and exposes the ref parameter. The typing is forwardRef<RefType, PropsType>((props, ref) => { ... }). For generic components with forwardRef, TypeScript requires a workaround because forwardRef does not support generic components directly. The common solution is to cast: const List = forwardRef(function List<T>(props: ListProps<T>, ref: Ref<HTMLUListElement>) { ... }) as <T>(props: ListProps<T> & RefAttributes<HTMLUListElement>) => ReactElement. React 19's ref-as-prop pattern simplifies this by making ref a regular prop.",
        shortAnswer:
          "useRef<HTMLElement>(null) creates a DOM ref (RefObject). useRef<T>(value) creates a mutable ref (MutableRefObject). forwardRef<RefType, Props> exposes child refs to parents. React 19 simplifies this with ref as a regular prop.",
        code: `import { useRef, forwardRef, useImperativeHandle, type Ref } from "react";

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
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "useRef",
          "forwardRef",
          "refs",
          "useImperativeHandle",
          "DOM refs",
        ],
        commonMistakes: [
          "Using useRef<HTMLElement> instead of the specific element type (HTMLInputElement), losing access to element-specific properties",
          "Forgetting null-checks on .current for DOM refs — the element is null until mount",
          "Not understanding the RefObject vs MutableRefObject distinction based on the initial value and generic parameter",
        ],
        followUps: [
          "How does React 19 change the ref pattern with ref as a prop?",
          "When should you use useImperativeHandle versus exposing the DOM element directly?",
          "How do you type a ref that can hold either a DOM element or a component handle?",
        ],
        interviewTips: [
          "Distinguish between DOM refs and mutable value refs — it shows you understand both use cases",
          "The useImperativeHandle pattern for exposing a custom API demonstrates advanced component design",
        ],
        relatedTopics: ["ts-fundamentals-1", "ts-advanced-1"],
      },
      {
        id: "ts-react-5",
        question: "How do you type React Context with TypeScript?",
        answer:
          "Typing React Context involves three key decisions: the context value type, handling the default value (especially null), and ensuring consumers can use the context without excessive null checks. The standard pattern involves creating a typed context, a provider component, and a custom hook that encapsulates the null check.\n\nThe basic pattern creates the context with createContext<Type>(defaultValue). If the context always has a valid value when consumed (because consumers are always inside a provider), but the default value is meaningless, you face a type tension. The common solution is createContext<Type | null>(null) with a custom hook that throws if the context is null: function useMyContext() { const ctx = useContext(MyContext); if (!ctx) throw new Error('Must be used within Provider'); return ctx; }. Consumers use the hook and get the non-null type, avoiding null checks at every usage site.\n\nAlternatively, if a sensible default exists, use createContext<Type>(defaultValue) with the actual default. This avoids the null pattern entirely — consumers always get a valid value even outside a provider. This works well for theme contexts, locale contexts, and other settings with obvious defaults.\n\nFor complex contexts, type the provider's value prop explicitly and separate the state from the dispatch. A common pattern with useReducer is to create two contexts: a StateContext and a DispatchContext. This prevents unnecessary re-renders: components that only dispatch actions (like buttons) do not re-render when state changes. Type each context separately: const StateCtx = createContext<State | null>(null) and const DispatchCtx = createContext<Dispatch<Action> | null>(null). Generic contexts are also possible: createContext<ContextValue<T>> where T is determined by the provider. This pattern is used by library authors creating generic data providers.",
        shortAnswer:
          "Type Context with createContext<T | null>(null) and a custom hook that throws on null for guaranteed non-null access. Split state and dispatch into separate contexts for performance. Use sensible defaults when available.",
        code: `import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react";

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

const useI18n = () => useContext(I18nContext); // no null check needed`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "context",
          "useContext",
          "createContext",
          "providers",
          "state management",
        ],
        commonMistakes: [
          "Using createContext<Type>(undefined as any) to avoid the null pattern — this is a type assertion that hides bugs",
          "Not creating a custom hook for context consumption, forcing every consumer to null-check manually",
          "Putting state and dispatch in the same context, causing unnecessary re-renders for dispatch-only consumers",
        ],
        followUps: [
          "How do you optimize context to prevent unnecessary re-renders?",
          "When should you use context versus a state management library?",
          "How do you test components that depend on context?",
        ],
        interviewTips: [
          "The null-default + custom-hook pattern is the industry standard — demonstrate it confidently",
          "Mentioning the split state/dispatch context optimization shows performance awareness",
        ],
        relatedTopics: ["ts-type-safety-1"],
      },
      {
        id: "ts-react-6",
        question: "How do you create generic React components in TypeScript?",
        answer:
          "Generic React components accept a type parameter that makes the component reusable across different data types while maintaining type safety. Instead of typing a list component to only work with User objects, a generic list works with any type T, inferring it from the props passed at the usage site. This is one of the most powerful patterns in React + TypeScript.\n\nThe syntax uses the standard TypeScript generic function pattern: function List<T>(props: ListProps<T>) where ListProps<T> includes the type parameter in relevant prop types. At the usage site, TypeScript infers T from the provided props: <List items={users} renderItem={(user) => <span>{user.name}</span>} />. Here T is inferred as User from the items prop, and the renderItem callback automatically receives User-typed parameters. No explicit type annotation is needed at the call site.\n\nGeneric components can have constraints to ensure T has required properties: function List<T extends { id: string }>(props: ListProps<T>) ensures every item has an id, which you can use as the React key. Multiple type parameters are also possible: function DataGrid<TRow, TColumn>(props: GridProps<TRow, TColumn>) for components that need to relate multiple types.\n\nA significant limitation is that forwardRef does not natively support generic components. The standard forwardRef<Ref, Props> signature requires concrete types. The workaround is a type assertion: cast the forwardRef result to a generic function type. React 19 addresses this by supporting ref as a regular prop, eliminating the need for forwardRef entirely. For generic components that need to accept arbitrary HTML attributes, you can extend the props with ComponentPropsWithoutRef<'div'> & GenericProps<T> using an intersection type. These patterns enable building truly reusable component libraries with full type safety.",
        shortAnswer:
          "Generic components use function List<T>(props: ListProps<T>) syntax, with T inferred from prop values at usage. Constraints (T extends { id: string }) ensure required properties. forwardRef requires a type assertion workaround for generics.",
        code: `import { type ReactNode, type Key } from "react";

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
/>`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "generic components",
          "generics",
          "reusable components",
          "type inference",
          "constraints",
        ],
        commonMistakes: [
          "Using React.FC for generic components — FC does not support type parameters on the component itself",
          "Over-constraining the generic, reducing reusability — only constrain what the component actually needs",
          "Not leveraging type inference — explicitly passing type parameters at the call site when TypeScript can infer them from props",
        ],
        followUps: [
          "How do you make a generic component work with forwardRef?",
          "Can you create a generic component with default type parameters?",
          "How does React 19 ref-as-prop simplify generic component typing?",
        ],
        interviewTips: [
          "A generic Select or DataTable component is an excellent interview demonstration piece",
          "Show how T flows from the items prop through to callback parameters — this is the key insight",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-react-7",
        question:
          "How do you type higher-order components (HOCs) in TypeScript?",
        answer:
          "Higher-order components (HOCs) are functions that take a component and return a new component with enhanced behavior. Typing HOCs in TypeScript is notoriously complex because you must correctly handle the wrapped component's props, the injected props, and any props the HOC itself needs. While hooks have largely replaced HOCs in modern React, understanding their typing is still relevant for existing codebases and libraries.\n\nThe basic pattern involves defining three prop types: the props injected by the HOC (InjectedProps), the props required by the wrapped component (the generic P), and the props the resulting component accepts (P minus InjectedProps). The HOC function signature is: function withSomething<P extends InjectedProps>(WrappedComponent: ComponentType<P>): ComponentType<Omit<P, keyof InjectedProps>>. The constraint P extends InjectedProps ensures the wrapped component accepts the injected props. Omit removes the injected props from the external API since the HOC provides them.\n\nA concrete example is withAuth, which injects user and isAuthenticated props. The wrapped component must accept these in its props, but callers of the enhanced component do not pass them — the HOC provides them from context or a store. The typing ensures: (1) the wrapped component receives the injected props, (2) the enhanced component's callers only see the remaining props, and (3) any additional props are correctly forwarded.\n\nHOC typing gets complicated with ref forwarding, static methods, and multiple HOC composition. For ref forwarding, you need forwardRef inside the HOC, which adds another type parameter. For static methods, you can use hoist-non-react-statics. For composition, each HOC adds and removes props, and TypeScript must track this through the chain. These complexities are a major reason the React community moved to hooks — a custom hook achieves the same injection pattern with simpler types: function useAuth(): { user: User; isAuthenticated: boolean }. Nevertheless, HOC typing demonstrates advanced TypeScript skills and understanding of component composition.",
        shortAnswer:
          "HOC typing uses withX<P extends InjectedProps>(Component: ComponentType<P>): ComponentType<Omit<P, keyof InjectedProps>>. The generic P captures the wrapped component's props, and Omit removes injected props from the external interface.",
        code: `import {
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
}`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Scenario",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "HOC",
          "higher-order components",
          "ComponentType",
          "Omit",
          "prop injection",
        ],
        commonMistakes: [
          "Not using Omit to remove injected props from the enhanced component's external API",
          "Losing the wrapped component's generic types — HOCs do not naturally preserve generics",
          "Forgetting to forward refs and hoist static methods from the wrapped component",
        ],
        followUps: [
          "How do you compose multiple typed HOCs without type conflicts?",
          "Why are hooks generally preferred over HOCs in modern React?",
          "How do you preserve generic component types through an HOC?",
        ],
        interviewTips: [
          "Acknowledge that HOCs are a legacy pattern while demonstrating you can type them correctly",
          "Show the equivalent custom hook solution to demonstrate modern React preference",
        ],
        relatedTopics: ["ts-advanced-1"],
      },
      {
        id: "ts-react-8",
        question: "How do you type custom hooks in React with TypeScript?",
        answer:
          "Custom hooks are the primary mechanism for extracting and reusing stateful logic in React. TypeScript typing of custom hooks follows the same rules as typing regular functions, but there are several patterns specific to hooks that are worth mastering: return type tuples vs objects, generic custom hooks, and hooks that manage external state or side effects.\n\nThe return type is the most important typing decision. Hooks that return a pair (like useState) should return a tuple type: function useToggle(initial = false): [boolean, () => void]. Without an explicit return type annotation, TypeScript would infer the array type (boolean | (() => void))[], losing the positional type information. Use as const on the return array or annotate the return type explicitly. Hooks that return multiple values should use objects for clarity: function useForm<T>(initial: T): { values: T; errors: Partial<Record<keyof T, string>>; handleChange: (field: keyof T, value: T[keyof T]) => void; reset: () => void }.\n\nGeneric custom hooks parameterize the hook over data types. function useFetch<T>(url: string): { data: T | null; error: Error | null; loading: boolean } allows the caller to specify the expected data type. Combined with overloads or discriminated union return types, you can create hooks with precise state representations: a loading state should not have data, an error state should not have data, and a success state always has data.\n\nHooks that manage subscriptions, event listeners, or external stores need careful typing for cleanup functions and callback parameters. useEventListener<K extends keyof WindowEventMap>(event: K, handler: (e: WindowEventMap[K]) => void) leverages TypeScript's built-in DOM event type maps for full type safety. The combination of generics with keyof and mapped types in the DOM event interfaces gives you autocompletion for event names and correctly typed event objects — the same approach used by libraries like react-use and usehooks-ts.",
        shortAnswer:
          "Custom hooks use explicit tuple return types ([value, setter]) or object returns for multiple values. Generic hooks (<T>) parameterize data types. Discriminated union returns model loading/error/success states precisely.",
        code: `import { useState, useEffect, useCallback, useRef } from "react";

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
});`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "custom hooks",
          "generics",
          "discriminated unions",
          "useEffect",
          "event listeners",
        ],
        commonMistakes: [
          "Not annotating tuple return types explicitly, causing TypeScript to infer a union array instead of a tuple",
          "Using loose return types (data: T | null) instead of discriminated unions, requiring consumers to do redundant null checks",
          "Not memoizing callbacks returned from custom hooks, causing unnecessary re-renders in consumers",
        ],
        followUps: [
          "How do you test custom hooks with TypeScript using @testing-library/react-hooks?",
          "How do you create a custom hook that returns a discriminated union state?",
          "What are the rules of hooks and how does TypeScript help enforce them?",
        ],
        interviewTips: [
          "A well-typed useFetch with discriminated union states is an impressive interview demonstration",
          "Showing the tuple vs object return type trade-off demonstrates thoughtful API design",
        ],
        relatedTopics: ["ts-type-safety-1", "ts-advanced-1"],
      },
      {
        id: "ts-react-9",
        question:
          "How do you use React utility types like ComponentProps, PropsWithChildren, and HTMLAttributes?",
        answer:
          "React ships with several utility types that simplify common prop typing patterns. These types extract prop types from existing components, merge HTML attributes with custom props, and handle children and ref forwarding — saving you from manually redefining types that React already knows.\n\nComponentProps<typeof Component> (and its variants ComponentPropsWithRef and ComponentPropsWithoutRef) extracts the props type from any React component. This is invaluable when wrapping third-party components or extending existing components: type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant: 'primary' | 'secondary' } gives you all native button attributes plus your custom variant prop. For custom components, ComponentProps<typeof MyComponent> extracts the props without requiring access to the prop interface definition.\n\nHTMLAttributes<T> and its element-specific variants (InputHTMLAttributes, ButtonHTMLAttributes, etc.) provide all HTML attributes for a given element type. These are useful for wrapper components that pass through all native attributes: interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; }. The consumer can pass any valid input attribute (placeholder, maxLength, autoComplete, etc.) and they are correctly typed and forwarded.\n\nPropsWithChildren<P> is a simple utility that adds children?: ReactNode to your props type. While straightforward, it documents intent clearly: the component explicitly accepts children. For stricter children typing, you can use ReactElement, ReactElement<SpecificProps>, or even a render prop pattern. The combination of these utility types with Omit lets you create components that override specific native attributes: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { onChange: (value: string) => void } replaces the native onChange type with a simpler callback that receives just the value string.",
        shortAnswer:
          "ComponentProps extracts props from components or HTML elements. HTMLAttributes provides native element props for wrapper components. PropsWithChildren adds children typing. Combine with Omit to override specific attributes.",
        code: `import {
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
<Box as="button" onClick={() => {}}>Click</Box> // button props`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "TypeScript",
        topicId: "ts-react-1",
        tags: [
          "ComponentProps",
          "HTMLAttributes",
          "PropsWithChildren",
          "polymorphic",
          "utility types",
        ],
        commonMistakes: [
          "Manually redefining HTML attributes that React utility types already provide",
          "Not using Omit when overriding native attributes, creating conflicting type definitions",
          "Using ComponentPropsWithRef when the component does not forward refs, or vice versa",
        ],
        followUps: [
          "How do you type a fully polymorphic component with the as prop pattern?",
          "What is the difference between ReactNode, ReactElement, and JSX.Element for children?",
          "How do you restrict which HTML attributes are forwarded to the DOM?",
        ],
        interviewTips: [
          "The Omit + native attributes pattern for wrapper components is a practical pattern that interviewers love to see",
          "The polymorphic as prop component demonstrates advanced generics and React type system knowledge",
        ],
        relatedTopics: ["ts-advanced-1", "ts-fundamentals-1"],
      },
    ],
  },
];
