import type { Topic } from '../../types';

export const testingTopics: Topic[] = [
  {
    id: 'unit-testing-fundamentals',
    title: 'Unit Testing with Jest',
    description: 'Comprehensive coverage of unit testing fundamentals using Jest including assertions, mocks, spies, fixtures, setup/teardown, and async testing patterns.',
    category: 'Testing',
    difficulty: 'Intermediate',
    tags: ['jest', 'unit-testing', 'mocks', 'spies', 'assertions', 'async-testing', 'TDD'],
    overview: 'Unit testing verifies that individual units of code (functions, classes, modules) work correctly in isolation. Jest is the most popular JavaScript testing framework, providing a complete testing solution with test runner, assertion library, mocking utilities, and code coverage reporting. Understanding unit testing principles and Jest APIs is essential for writing reliable, maintainable test suites.',
    concepts: [
      'Jest test runner discovers and executes test files automatically',
      'Assertions (expect/matchers) verify expected outcomes',
      'Mocks replace dependencies with controlled substitutes',
      'Spies observe function calls without replacing implementation',
      'Fixtures provide consistent test data',
      'Setup/teardown hooks manage test lifecycle',
      'Async testing handles promises, callbacks, and timers'
    ],
    codeExamples: [
      {
        title: 'Jest Mock and Spy Example',
        code: `// userService.ts
export async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

// userService.test.ts
import { getUser } from './userService';

global.fetch = jest.fn();

describe('getUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns user data on success', async () => {
    const mockUser = { id: '1', name: 'Alice' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const user = await getUser('1');
    expect(user).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('throws on failure', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    await expect(getUser('999')).rejects.toThrow('User not found');
  });
});`,
        language: 'typescript',
        explanation: 'Demonstrates mocking fetch, asserting on return values, verifying call arguments, and testing error cases.'
      }
    ],
    relatedTopicIds: ['react-testing', 'integration-e2e-testing'],
    questions: [
      {
        id: 'test-1',
        question: 'What is the difference between mocks, stubs, and spies in unit testing? When should you use each?',
        answer: `Mocks, stubs, and spies are three types of test doubles — objects or functions that replace real dependencies during testing to isolate the code under test. While the terms are sometimes used interchangeably, they serve distinct purposes and understanding the differences helps you choose the right tool for each testing scenario.

A stub is the simplest test double. It replaces a function or module with a predetermined implementation that returns controlled values. Stubs don't verify how they're called — they simply provide canned responses to allow the code under test to proceed down a specific path. For example, stubbing a database query to return a specific user allows you to test the business logic that processes that user without needing a real database. In Jest, you create stubs with jest.fn().mockReturnValue() or jest.fn().mockResolvedValue() for async functions.

A spy wraps a real function to record information about its calls — how many times it was called, with what arguments, and what it returned — without changing its behavior. The real implementation still executes. Spies are useful when you want to verify that a function is called correctly while still allowing the actual side effects. For example, you might spy on console.error to verify that your error handler logs the right message while still allowing the log to output. In Jest, jest.spyOn(object, 'method') creates a spy that preserves the original implementation.

A mock is the most powerful test double, combining the features of both stubs and spies. Mocks replace the real implementation with a controlled one (like stubs) AND track call information for verification (like spies). Additionally, mocks can be configured with expectations about how they should be called, and tests can fail if those expectations aren't met. In Jest, jest.fn() creates a mock function, and jest.mock() replaces entire modules. The distinction between mocks and stubs is often blurred in practice — Jest's jest.fn() is technically a mock but is commonly used as both a stub and a mock.

The choice depends on your testing goal. Use stubs when you just need to control inputs to the code under test — you don't care how the stub is called. Use spies when you want to verify interactions while keeping real behavior — useful for testing side effects like logging or analytics. Use mocks when you need to both control behavior and verify interactions — the most common case for testing functions that depend on external services, APIs, or complex dependencies. As a rule of thumb, prefer the simplest test double that satisfies your testing needs.`,
        shortAnswer: 'Stubs provide canned responses without tracking calls. Spies record call information while preserving real implementation. Mocks replace implementation AND track calls for verification. Use stubs for controlled inputs, spies for observing real behavior, and mocks for full control and verification of dependencies.',
        code: `// STUB: control return value, don't verify calls
const getPrice = jest.fn().mockReturnValue(29.99);
const total = calculateTotal(getPrice); // uses stubbed price

// SPY: observe real function, verify it was called
const consoleSpy = jest.spyOn(console, 'error');
handleError(new Error('fail'));
expect(consoleSpy).toHaveBeenCalledWith('Error:', 'fail');
consoleSpy.mockRestore(); // restore original

// MOCK: replace implementation + verify interactions
const mockFetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ id: 1, name: 'Alice' }),
});
global.fetch = mockFetch;

const user = await getUser(1);
expect(user.name).toBe('Alice');
expect(mockFetch).toHaveBeenCalledTimes(1);
expect(mockFetch).toHaveBeenCalledWith('/api/users/1');

// MODULE MOCK: replace entire module
jest.mock('./analytics', () => ({
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
}));
import { trackEvent } from './analytics';

submitForm(data);
expect(trackEvent).toHaveBeenCalledWith('form_submit', { formId: 'signup' });`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Testing',
        topicId: 'unit-testing-fundamentals',
        tags: ['mocks', 'stubs', 'spies', 'jest', 'test-doubles'],
        commonMistakes: [
          'Over-mocking: replacing so many dependencies that tests verify mocks, not real behavior',
          'Not restoring spies after tests, causing interference between test cases',
          'Using mocks when a stub would suffice, adding unnecessary verification complexity',
          'Mocking implementation details rather than behavior, making tests brittle to refactoring'
        ],
        followUps: [
          'When is over-mocking a problem and how do you avoid it?',
          'How do you decide what to mock vs. what to use real implementations for?',
          'What is the difference between jest.fn() and jest.spyOn()?'
        ],
        interviewTips: [
          'Clearly define each type and their key difference: stubs return, spies observe, mocks do both',
          'Give concrete examples for when each is appropriate',
          'Mention the principle: mock what you don\'t own (external APIs), test what you do own'
        ]
      },
      {
        id: 'test-2',
        question: 'How do you test asynchronous code in Jest? Cover promises, async/await, timers, and callbacks.',
        answer: `Testing asynchronous code is one of the most common challenges in JavaScript unit testing. Jest provides several mechanisms for handling async operations, each suited to different async patterns. Getting this wrong leads to false positives — tests that pass even when the async code is broken — because the test completes before the async operation finishes.

For Promise-based code and async/await, the most straightforward approach is to make the test function itself async and use await. Jest automatically waits for an async test function's promise to resolve before considering the test complete. You can also use expect().resolves and expect().rejects matchers for more declarative assertions on promise outcomes. When testing code that should reject, always use expect.assertions(n) to ensure the catch path actually executes — without this, a test where the promise unexpectedly resolves would pass silently with zero assertions.

Timer-based code (setTimeout, setInterval, requestAnimationFrame) requires Jest's fake timer system because you don't want tests to actually wait for real time to pass. jest.useFakeTimers() replaces the global timer functions with controllable versions. jest.advanceTimersByTime(ms) fast-forwards time by the specified milliseconds, triggering any timers that would have fired. jest.runAllTimers() runs all pending timers immediately. This lets you test debounce functions, polling mechanisms, or animation timing instantly. Always call jest.useRealTimers() in cleanup to prevent interference between tests.

For callback-based code, Jest provides the done callback pattern. When your test function accepts a done parameter, Jest waits until done() is called before completing the test. If done is never called, the test times out and fails. If done(error) is called with an argument, the test fails with that error. This pattern is less common in modern code but essential for testing legacy APIs, event emitters, or stream-based code that uses callbacks instead of promises.

Testing concurrent async operations and race conditions requires careful setup. Use Promise.all with expect.resolves for parallel operations. Use jest.fn() to verify that callbacks are called in the right order. For testing retry logic or sequential async chains, you can mock the function to fail on first calls and succeed on later ones using mockRejectedValueOnce followed by mockResolvedValue. Always handle the case where async operations may hang — set appropriate jest.setTimeout values and consider using AbortController patterns for cancellable operations.`,
        shortAnswer: 'Jest handles async testing via: async/await in test functions, .resolves/.rejects matchers for promises, jest.useFakeTimers() with advanceTimersByTime for timer code, and the done callback for callback-based code. Use expect.assertions(n) to prevent false positives when testing rejections.',
        code: `// Async/await testing
it('fetches user data', async () => {
  const user = await getUser('1');
  expect(user.name).toBe('Alice');
});

// Testing rejections with expect.assertions
it('throws for invalid user', async () => {
  expect.assertions(1);
  await expect(getUser('invalid')).rejects.toThrow('Not found');
});

// Fake timers for debounce testing
describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('calls function after delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on subsequent calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    jest.advanceTimersByTime(200);
    debounced(); // reset timer
    jest.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// Callback-based testing with done
it('emits data event', (done) => {
  const emitter = createEmitter();
  emitter.on('data', (payload) => {
    expect(payload).toEqual({ id: 1 });
    done();
  });
  emitter.emit('data', { id: 1 });
});

// Testing retry logic
it('retries on failure', async () => {
  const mockFetch = jest.fn()
    .mockRejectedValueOnce(new Error('Network error'))
    .mockResolvedValue({ data: 'success' });

  const result = await fetchWithRetry(mockFetch, 3);
  expect(result).toEqual({ data: 'success' });
  expect(mockFetch).toHaveBeenCalledTimes(2);
});`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Testing',
        topicId: 'unit-testing-fundamentals',
        tags: ['async-testing', 'jest', 'fake-timers', 'promises', 'callbacks'],
        commonMistakes: [
          'Forgetting to await async assertions, causing tests to pass before assertions run',
          'Not using expect.assertions() when testing rejections, leading to false positives',
          'Leaving fake timers active between tests, causing mysterious failures',
          'Not handling timer interactions with promises — fake timers don\'t auto-resolve promises'
        ],
        followUps: [
          'How do you test a function that uses both timers and promises?',
          'What happens when you forget to return or await a promise in a test?',
          'How do you set test-specific timeouts in Jest?'
        ],
        interviewTips: [
          'Emphasize the danger of false positives with async tests',
          'Show you know multiple async patterns: await, resolves/rejects, fake timers, done',
          'Mention expect.assertions as a safety net for rejection testing'
        ]
      },
      {
        id: 'test-3',
        question: 'Explain Jest setup and teardown hooks. What is the execution order of beforeAll, beforeEach, afterEach, and afterAll?',
        answer: `Jest provides four lifecycle hooks for managing test setup and cleanup: beforeAll, beforeEach, afterEach, and afterAll. These hooks reduce code duplication by centralizing common setup and teardown logic, and they're crucial for ensuring tests start with a clean state and clean up after themselves to prevent inter-test interference.

beforeEach runs before every individual test in its describe block. This is the most commonly used hook because it ensures each test starts with a fresh, identical state. Typical uses include resetting mock implementations, creating fresh test data, initializing class instances, or setting up DOM elements. afterEach runs after every individual test, and is used to clean up side effects: restoring mocks, clearing DOM changes, closing connections, or resetting global state. Together, beforeEach and afterEach ensure test isolation — each test is independent and can run in any order.

beforeAll runs once before any test in its describe block executes. It's used for expensive setup that can be shared across tests without causing interference — like starting a test database, creating a shared server instance, or loading large test fixtures. afterAll runs once after all tests in the block complete, used for final cleanup: closing database connections, stopping servers, or removing temporary files. Be careful with beforeAll — if shared state is mutated by tests, it breaks test isolation.

The execution order with nested describe blocks follows a predictable pattern. For a test nested inside an inner describe inside an outer describe, the order is: outer beforeAll → outer beforeEach → inner beforeEach → test → inner afterEach → outer afterEach → outer afterAll. The "before" hooks run from outermost to innermost (parent first), while "after" hooks run from innermost to outermost (child first). This nesting allows shared setup in outer blocks and specific setup in inner blocks.

A common best practice is to use beforeEach for most setup and reserve beforeAll for genuinely expensive operations. Always clean up in the corresponding "after" hook (what beforeEach sets up, afterEach should tear down). Use jest.restoreAllMocks() in afterEach to reset all spies and mocks. When using fake timers, restore real timers in afterEach. Failing to clean up properly is the number one cause of flaky tests in large test suites — tests that pass in isolation but fail when run together due to leaked state.`,
        shortAnswer: 'beforeAll runs once before all tests; beforeEach runs before each test; afterEach runs after each test; afterAll runs once after all tests. In nested describes, "before" hooks run outer-to-inner, "after" hooks run inner-to-outer. Use beforeEach for test isolation and afterEach for cleanup.',
        code: `describe('UserService', () => {
  let db: TestDatabase;

  // Runs once: expensive shared setup
  beforeAll(async () => {
    db = await TestDatabase.connect();
  });

  // Runs before each test: fresh state
  beforeEach(async () => {
    await db.clear();
    await db.seed(testFixtures);
    jest.restoreAllMocks();
  });

  // Runs after each test: cleanup
  afterEach(() => {
    jest.useRealTimers();
  });

  // Runs once: final cleanup
  afterAll(async () => {
    await db.disconnect();
  });

  describe('getUser', () => {
    // Inner beforeEach runs AFTER outer beforeEach
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation();
    });

    it('returns user by id', async () => {
      const user = await UserService.getUser(db, '1');
      expect(user.name).toBe('Alice');
    });

    it('throws for missing user', async () => {
      await expect(UserService.getUser(db, '999'))
        .rejects.toThrow('User not found');
    });
  });
});

// Execution order for nested test:
// 1. outer beforeAll (db connect)
// 2. outer beforeEach (db clear + seed)
// 3. inner beforeEach (spy on console)
// 4. TEST RUNS
// 5. inner afterEach (if defined)
// 6. outer afterEach (restore timers)
// 7. outer afterAll (db disconnect) — after ALL tests`,
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'Testing',
        topicId: 'unit-testing-fundamentals',
        tags: ['jest', 'beforeEach', 'afterEach', 'setup', 'teardown', 'test-lifecycle'],
        commonMistakes: [
          'Using beforeAll for mutable shared state that tests modify, breaking isolation',
          'Not cleaning up in afterEach, causing state leakage between tests',
          'Confusing execution order with nested describe blocks',
          'Forgetting that async hooks need to return or await promises'
        ],
        followUps: [
          'What happens if a beforeAll hook throws an error?',
          'How do you share setup across multiple test files?',
          'What is the difference between jest.resetAllMocks and jest.restoreAllMocks?'
        ],
        interviewTips: [
          'Draw the execution order for nested describes to show clear understanding',
          'Emphasize test isolation as the primary purpose of these hooks',
          'Mention the connection between cleanup and flaky test prevention'
        ]
      },
      {
        id: 'test-4',
        question: 'How do you write effective Jest assertions? Cover common matchers and custom matchers.',
        answer: `Jest assertions use the expect function combined with matchers to verify that values meet expectations. The quality of assertions directly impacts test effectiveness — vague assertions miss bugs while overly specific assertions break on harmless changes. Understanding the full range of Jest matchers helps you write assertions that catch real issues while remaining resilient to implementation changes.

Basic matchers cover equality, truthiness, and comparison. toBe uses Object.is for strict reference equality — use it for primitives (numbers, strings, booleans) and checking the same object reference. toEqual performs deep equality comparison for objects and arrays, checking that all properties match recursively. toStrictEqual is even stricter, also checking for undefined properties and array sparseness. For truthiness, toBeTruthy and toBeFalsy check JavaScript truthy/falsy rules, while toBeNull, toBeUndefined, and toBeDefined check specific null/undefined states. Numeric comparisons use toBeGreaterThan, toBeLessThanOrEqual, and toBeCloseTo (essential for floating-point comparisons where 0.1 + 0.2 !== 0.3).

String and collection matchers handle patterns and containment. toMatch accepts a regex or substring for string pattern matching. toContain checks array inclusion for primitives. toContainEqual checks array inclusion using deep equality for objects. toHaveLength verifies array or string length. toMatchObject performs partial object matching — the expected object only needs to be a subset of the received object, perfect for checking specific properties without asserting on the entire object structure.

Mock-specific matchers verify function call behavior. toHaveBeenCalled checks if a mock was called at least once. toHaveBeenCalledTimes verifies exact call count. toHaveBeenCalledWith checks arguments of any call. toHaveBeenLastCalledWith checks the most recent call's arguments. toHaveBeenNthCalledWith checks a specific call by position. toHaveReturnedWith verifies the return value of a mock. These matchers are essential for testing interactions between units.

Custom matchers extend Jest's assertion vocabulary for domain-specific checks. Use expect.extend to add new matchers that receive the received value and expected parameters. Custom matchers return an object with pass (boolean) and message (function returning a string). They integrate fully with Jest's negation (.not) and error formatting. Common uses include checking date ranges, validating domain objects, or verifying complex data structures that would require multiple basic assertions.`,
        shortAnswer: 'Jest assertions use expect with matchers like toBe (strict equality), toEqual (deep equality), toMatchObject (partial match), toContain (array inclusion), and mock matchers like toHaveBeenCalledWith. Custom matchers via expect.extend add domain-specific assertions. Choose the most specific matcher that tests behavior without coupling to implementation.',
        code: `// Basic matchers
expect(result).toBe(42);                    // strict reference equality
expect(user).toEqual({ name: 'Alice', age: 30 }); // deep equality
expect(user).toMatchObject({ name: 'Alice' });     // partial match

// Truthiness
expect(response).toBeDefined();
expect(error).toBeNull();
expect(list).toBeTruthy();

// Numbers (use toBeCloseTo for floats!)
expect(0.1 + 0.2).toBeCloseTo(0.3);
expect(items.length).toBeGreaterThan(0);

// Strings and collections
expect(message).toMatch(/error/i);
expect(tags).toContain('typescript');
expect(users).toContainEqual({ id: 1, name: 'Alice' });
expect(items).toHaveLength(3);

// Mock matchers
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', expect.any(Number));
expect(mockFn).toHaveBeenLastCalledWith(expect.objectContaining({
  type: 'submit',
}));

// Asymmetric matchers for partial expectations
expect(response).toEqual({
  id: expect.any(String),
  timestamp: expect.any(Number),
  data: expect.arrayContaining([
    expect.objectContaining({ status: 'active' }),
  ]),
});

// Custom matcher
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        \`expected \${received} to be within [\${floor}, \${ceiling}]\`,
    };
  },
});

expect(port).toBeWithinRange(1024, 65535);`,
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Coding',
        category: 'Testing',
        topicId: 'unit-testing-fundamentals',
        tags: ['jest', 'assertions', 'matchers', 'expect', 'custom-matchers'],
        commonMistakes: [
          'Using toBe for objects/arrays — it checks reference equality, not deep equality',
          'Using toEqual for floating-point numbers instead of toBeCloseTo',
          'Writing assertions that are too broad (toBeTruthy) when a specific matcher exists',
          'Not using asymmetric matchers (expect.any, expect.objectContaining) for partial checks'
        ],
        followUps: [
          'What is the difference between toBe, toEqual, and toStrictEqual?',
          'How do asymmetric matchers like expect.any and expect.objectContaining work?',
          'When would you create a custom matcher vs. using existing matchers?'
        ],
        interviewTips: [
          'Show familiarity with the full matcher API, not just toBe and toEqual',
          'Emphasize choosing matchers that test behavior, not implementation details',
          'Mention asymmetric matchers as a tool for writing flexible, resilient assertions'
        ]
      },
      {
        id: 'test-5',
        question: 'What are test fixtures and how do you manage test data effectively in Jest?',
        answer: `Test fixtures are predetermined sets of data used to establish a known state for testing. They provide consistent, repeatable input that makes tests predictable and debuggable. Without well-managed fixtures, tests become fragile, hard to understand, and prone to interference between test cases. Effective fixture management is a hallmark of a mature test suite.

The simplest approach is inline fixtures — defining test data directly in the test or beforeEach block. This works well for small, simple data and makes tests self-contained and readable. Each test clearly shows what data it uses. However, inline fixtures lead to duplication when multiple tests need the same data structure. They also become unwieldy for complex objects with many properties, obscuring the test's intent with data setup noise.

Factory functions (also called builders) solve the duplication problem by creating functions that generate test data with sensible defaults while allowing overrides. A createUser factory returns a complete User object, and individual tests override only the properties relevant to what they're testing. This approach highlights what's important in each test — if a test only overrides email, the reader knows the test is about email behavior. Libraries like fishery or @mswjs/data provide sophisticated factory patterns with sequences, traits, and associations.

Shared fixture files work well for large, static datasets that many test files reference — like countries, currencies, or configuration objects. These are typically JSON files or TypeScript modules in a __fixtures__ directory. For API response fixtures, using Mock Service Worker (MSW) handlers is increasingly popular — you define realistic API responses that are shared across tests and match the actual API contract. The key danger with shared fixtures is mutation — if a test modifies shared fixture data, it can break other tests. Always create fresh copies (using spread or structuredClone) rather than referencing shared objects directly.

Database fixtures for integration tests use seed scripts or migration-based approaches. In beforeEach, you truncate tables and insert known data. Tools like Prisma provide seeding utilities, and test containers can spin up fresh database instances. For snapshot-based fixtures, Jest's toMatchSnapshot and toMatchInlineSnapshot capture expected output and alert you to changes. Use these judiciously — large snapshots are hard to review and tend to be blindly updated. Prefer inline snapshots for small outputs and explicit assertions for important values.`,
        shortAnswer: 'Test fixtures are predetermined data sets for consistent test state. Use inline data for simple tests, factory functions (builders) for reusable objects with overridable defaults, shared fixture files for static datasets, and MSW for API response fixtures. Always create fresh copies to prevent mutation between tests.',
        code: `// Factory function for test data
function createUser(overrides: Partial<User> = {}): User {
  return {
    id: crypto.randomUUID(),
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

function createOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    items: [{ productId: 'p1', quantity: 1, price: 29.99 }],
    status: 'pending',
    total: 29.99,
    ...overrides,
  };
}

// Tests use factories — only override what matters
it('grants admin access to admin users', () => {
  const admin = createUser({ role: 'admin' });
  expect(canAccessDashboard(admin)).toBe(true);
});

it('calculates order total with discount', () => {
  const order = createOrder({ total: 100 });
  expect(applyDiscount(order, 0.1)).toEqual(
    expect.objectContaining({ total: 90 })
  );
});

// Shared fixture file: __fixtures__/products.ts
export const testProducts: Product[] = [
  { id: 'p1', name: 'Widget', price: 29.99, category: 'tools' },
  { id: 'p2', name: 'Gadget', price: 49.99, category: 'electronics' },
];

// MSW handler for API fixture
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json(createUser({ id: params.id as string }));
  }),
];`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Scenario',
        category: 'Testing',
        topicId: 'unit-testing-fundamentals',
        tags: ['fixtures', 'test-data', 'factory-functions', 'MSW', 'jest'],
        commonMistakes: [
          'Sharing mutable fixture objects between tests without copying them',
          'Creating overly complex fixtures with irrelevant data, obscuring test intent',
          'Hardcoding IDs and dates that cause tests to fail in different environments',
          'Relying on snapshot tests for complex data instead of explicit assertions'
        ],
        followUps: [
          'How does the Factory pattern apply to creating test data?',
          'What is Mock Service Worker and how does it improve API mocking?',
          'When should you use snapshot testing vs. explicit assertions?'
        ],
        interviewTips: [
          'Explain the principle: each test should clearly show what data matters for its assertion',
          'Mention factory functions as the gold standard for test data management',
          'Discuss the mutation danger with shared fixtures — always copy, never reference directly'
        ]
      },
      {
        id: 'test-6',
        question: 'How do you mock modules and dependencies in Jest? Explain jest.mock, manual mocks, and module factory patterns.',
        answer: `Module mocking in Jest replaces real module implementations with test-controlled substitutes, allowing you to isolate the code under test from its dependencies. This is essential for testing code that depends on external APIs, databases, file systems, or complex third-party libraries. Jest provides several mechanisms for module mocking, each suited to different scenarios.

jest.mock() is the most common approach. Called at the top level of a test file with a module path, it replaces the module with an auto-mocked version where all exported functions become jest.fn(). You can provide a factory function as the second argument to specify custom implementations. Jest hoists jest.mock calls to the top of the file (before imports), so the mock is in place before the module under test imports its dependencies. This hoisting behavior is crucial — it means you can write jest.mock after import statements and it still works.

Manual mocks live in a __mocks__ directory adjacent to the module they mock. When you call jest.mock('./myModule'), Jest first checks for __mocks__/myModule.ts. For node_modules mocking, place the mock in a __mocks__ directory at the project root. Manual mocks are ideal for modules used across many test files — you define the mock once and all tests that call jest.mock for that module get the same mock implementation. This prevents duplication and ensures consistent mock behavior across your test suite.

jest.mock with factory function gives you inline control. The factory receives no parameters and must return the mock module's exports. For TypeScript, this is where you often see jest.fn() typed with specific signatures. A common pattern is to mock all functions but provide mock implementations only for the functions the current test needs. jest.requireActual allows you to keep some exports real while mocking others — useful when you want to mock one function from a module but keep utility types or constants intact.

jest.spyOn offers a lighter alternative when you want to mock specific methods on an object without replacing the entire module. It's especially useful for mocking built-in objects (Date.now, Math.random) or class methods. Unlike jest.mock which replaces at the module level, spyOn works at the object property level. Each spy can be individually restored with mockRestore(), giving fine-grained control. The key advantage is that spyOn preserves the module structure and only alters the specific methods you target.`,
        shortAnswer: 'jest.mock() replaces modules with auto-mocked or custom implementations (hoisted before imports). Manual mocks in __mocks__/ directories provide shared mock implementations. jest.mock with factory function gives inline control. jest.spyOn mocks specific methods without replacing entire modules. Use jest.requireActual to partially mock modules.',
        code: `// jest.mock with auto-mocking
jest.mock('./database');
import { getUser, saveUser } from './database';
// getUser and saveUser are now jest.fn()

// jest.mock with factory function
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: '1', name: 'Alice' }),
  fetchPosts: jest.fn().mockResolvedValue([]),
}));

// Partial mock with jest.requireActual
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'), // keep real implementations
  generateId: jest.fn().mockReturnValue('mock-id'), // mock only this
}));

// Manual mock: __mocks__/axios.ts
const axios = {
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  create: jest.fn(() => axios),
  defaults: { headers: { common: {} } },
};
export default axios;

// jest.spyOn for targeted mocking
it('uses current time', () => {
  const now = new Date('2024-06-15T12:00:00Z');
  jest.spyOn(global, 'Date').mockImplementation(() => now as unknown as Date);

  const result = getTimestamp();
  expect(result).toBe('2024-06-15T12:00:00.000Z');

  jest.restoreAllMocks();
});

// TypeScript: typed mock
import { UserService } from './userService';
jest.mock('./userService');
const MockedUserService = jest.mocked(UserService);

MockedUserService.getUser.mockResolvedValue({
  id: '1',
  name: 'Alice',
  email: 'alice@test.com',
});`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Testing',
        topicId: 'unit-testing-fundamentals',
        tags: ['jest', 'mocking', 'jest.mock', 'jest.spyOn', 'manual-mocks'],
        commonMistakes: [
          'Forgetting that jest.mock is hoisted — writing it inside a function doesn\'t work as expected',
          'Not using jest.mocked() for TypeScript type inference on mocked modules',
          'Over-mocking: replacing so much that the test doesn\'t test anything real',
          'Not resetting mocks between tests, causing state leakage via mockReturnValue persistence'
        ],
        followUps: [
          'What is the hoisting behavior of jest.mock and why does it matter?',
          'How do you mock ES module default exports vs. named exports?',
          'What are the tradeoffs of auto-mocking vs. manual mock factories?'
        ],
        interviewTips: [
          'Explain the hoisting mechanism — it\'s a common source of confusion',
          'Show you know when to use jest.mock vs. jest.spyOn vs. manual mocks',
          'Mention jest.requireActual for the common partial mocking pattern'
        ]
      }
    ]
  },
  {
    id: 'react-testing',
    title: 'React Component Testing',
    description: 'Testing React components with React Testing Library, covering queries, user interaction simulation, API mocking, and testing best practices.',
    category: 'Testing',
    difficulty: 'Intermediate',
    tags: ['react-testing-library', 'RTL', 'component-testing', 'user-events', 'queries', 'accessibility'],
    overview: 'React Testing Library (RTL) provides a testing approach centered on how users interact with components rather than testing implementation details. Its guiding principle — "The more your tests resemble the way your software is used, the more confidence they can give you" — leads to tests that are resilient to refactoring and catch real user-facing bugs.',
    concepts: [
      'Query by accessibility roles and text, not implementation details',
      'Simulate real user interactions with userEvent',
      'Use waitFor and findBy for async state changes',
      'Mock API calls at the network level with MSW',
      'Test behavior and output, not state and lifecycle'
    ],
    relatedTopicIds: ['unit-testing-fundamentals', 'integration-e2e-testing'],
    questions: [
      {
        id: 'test-7',
        question: 'Explain React Testing Library queries. What is the priority order and when should you use each type?',
        answer: `React Testing Library provides a hierarchy of query methods for selecting elements in rendered components. The query priority order is intentionally designed to encourage testing in the way users interact with the application — by accessible roles, visible text, and form labels rather than by CSS selectors, test IDs, or component internals. Following this priority produces tests that are more resilient to refactoring and more likely to catch accessibility issues.

The highest priority queries are accessibility-based. getByRole is the most recommended query because it selects elements by their ARIA role, which is how assistive technologies identify elements. Most semantic HTML elements have implicit roles (button, heading, textbox, etc.), so getByRole('button', { name: 'Submit' }) finds a button with accessible name "Submit" — exactly how a screen reader user would identify it. getByLabelText finds form elements by their associated label, matching how users identify form fields. getByPlaceholderText and getByText find by visible text content. These queries simultaneously test that your markup is accessible.

Mid-priority queries use semantic attributes. getByAltText finds images by their alt text — essential for accessibility. getByTitle finds elements by their title attribute. getByDisplayValue finds form elements by their current displayed value, useful for pre-filled forms. These are appropriate when the primary queries don't apply — for example, an image doesn't have a role that includes its alt text in a unique way.

getByTestId is the lowest priority, used as a last resort when no semantic or accessible query applies. It selects by a data-testid attribute, which has no meaning to users or assistive technologies. Common legitimate uses include dynamic containers, complex visualizations (charts, canvases), or generated content where text isn't predictable. However, reaching for data-testid should prompt you to ask whether the element lacks proper accessibility attributes.

Each query type comes in three variants. getBy throws if no match is found (or if multiple matches are found) — use for elements that should definitely be present. queryBy returns null instead of throwing — use for asserting that an element does NOT exist. findBy returns a promise that resolves when the element appears — use for elements that appear asynchronously after state updates, API responses, or animations. The async findBy is shorthand for waitFor(() => getBy).`,
        shortAnswer: 'RTL query priority: getByRole (ARIA roles) > getByLabelText (form labels) > getByPlaceholderText/getByText (visible text) > getByAltText/getByTitle (semantic attributes) > getByTestId (last resort). getBy throws if not found, queryBy returns null, findBy waits asynchronously. This priority ensures tests reflect real user interaction and catch accessibility issues.',
        code: `import { render, screen } from '@testing-library/react';

// BEST: getByRole — matches how assistive tech sees elements
const submitBtn = screen.getByRole('button', { name: 'Submit' });
const heading = screen.getByRole('heading', { level: 2 });
const emailInput = screen.getByRole('textbox', { name: /email/i });
const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

// GOOD: getByLabelText — matches how users identify form fields
const nameInput = screen.getByLabelText('Full Name');
const passwordInput = screen.getByLabelText(/password/i);

// GOOD: getByText — matches visible content
const errorMsg = screen.getByText('Email is required');
const link = screen.getByRole('link', { name: 'Learn more' });

// OK: getByAltText — for images
const avatar = screen.getByAltText('User avatar');

// LAST RESORT: getByTestId
const chart = screen.getByTestId('revenue-chart');

// queryBy: assert element does NOT exist
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// findBy: wait for async element
const results = await screen.findByText('3 results found');

// Multiple elements
const listItems = screen.getAllByRole('listitem');
expect(listItems).toHaveLength(5);`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Testing',
        topicId: 'react-testing',
        tags: ['react-testing-library', 'queries', 'getByRole', 'accessibility', 'DOM-testing'],
        commonMistakes: [
          'Using getByTestId as the default query instead of accessible queries',
          'Using getBy for elements that may not exist — use queryBy for absence assertions',
          'Not using findBy for async content, causing tests to fail on timing',
          'Using container.querySelector instead of RTL queries, testing implementation details'
        ],
        followUps: [
          'Why does RTL discourage testing by className or id?',
          'How do you debug when a query can\'t find an element?',
          'What is screen.debug() and how does it help troubleshoot queries?'
        ],
        interviewTips: [
          'Recite the priority order confidently — it\'s a core RTL concept',
          'Explain the philosophy: test like a user interacts, not like a developer inspects',
          'Mention that getByRole doubles as an accessibility check'
        ]
      },
      {
        id: 'test-8',
        question: 'How do you test user interactions in React Testing Library? Compare fireEvent and userEvent.',
        answer: `Testing user interactions is central to React Testing Library's philosophy of testing components the way users use them. RTL provides two APIs for simulating interactions: fireEvent (built into @testing-library/dom) and userEvent (from @testing-library/user-event). While both trigger DOM events, they differ significantly in how realistically they simulate actual user behavior.

fireEvent is a low-level API that dispatches a single DOM event directly on an element. fireEvent.click(element) dispatches exactly one click event. fireEvent.change(element, { target: { value: 'new value' } }) dispatches a single change event. This is fast and deterministic but doesn't reflect how real browser events work. When a real user clicks a button, the browser fires a sequence of events: pointerdown, mousedown, pointerup, mouseup, click, and potentially focus events. fireEvent.click skips all of these intermediate events, which means event handlers attached to mousedown or pointerdown won't fire.

userEvent (version 14+) simulates complete, realistic user interaction sequences. user.click(element) fires the full event chain including pointer events, mouse events, focus events, and the click event — in the correct order and with proper event properties. user.type(element, 'hello') simulates typing character by character, firing keydown, keypress, input, and keyup for each character. This catches bugs that fireEvent misses — like a component that listens to keydown for keyboard shortcuts, or an input that validates on each character entry.

userEvent 14+ requires an async setup pattern. You call userEvent.setup() to create a user instance, then call methods on it with await. This async API is necessary because userEvent simulates realistic timing between events. The setup function can be configured with options like delay (time between keystrokes), skipHover (skip hover events), and pointerEventsCheck (verify elements are visible and clickable before interacting). The pointer events check is particularly valuable — it catches cases where an overlay or disabled state would prevent real user interaction.

The recommendation is to use userEvent for all interaction tests by default and only fall back to fireEvent for specific events that userEvent doesn't support (like custom events or some edge-case DOM events). userEvent produces higher-confidence tests because it more closely matches how users actually interact with the application. The slight performance overhead of the full event simulation is negligible for most test suites and is far outweighed by the improved test quality.`,
        shortAnswer: 'fireEvent dispatches a single DOM event directly. userEvent simulates complete, realistic interaction sequences (pointer events → mouse events → focus → click) matching actual browser behavior. userEvent catches more bugs because it fires the full event chain. Use userEvent.setup() with async/await for all interaction tests.',
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Setup user instance (recommended pattern)
function setup(jsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

// Click interaction
it('submits form on button click', async () => {
  const onSubmit = jest.fn();
  const { user } = setup(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Email'), 'alice@test.com');
  await user.type(screen.getByLabelText('Password'), 'secret123');
  await user.click(screen.getByRole('button', { name: 'Sign In' }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'alice@test.com',
    password: 'secret123',
  });
});

// Keyboard interaction
it('navigates dropdown with keyboard', async () => {
  const { user } = setup(<Dropdown options={['Red', 'Green', 'Blue']} />);

  await user.click(screen.getByRole('combobox'));
  await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

  expect(screen.getByRole('combobox')).toHaveValue('Green');
});

// Select and clear
it('clears and replaces input value', async () => {
  const { user } = setup(<input defaultValue="old value" />);
  const input = screen.getByRole('textbox');

  await user.clear(input);
  await user.type(input, 'new value');
  expect(input).toHaveValue('new value');
});

// Hover interaction
it('shows tooltip on hover', async () => {
  const { user } = setup(<Tooltip text="Help info">Hover me</Tooltip>);

  await user.hover(screen.getByText('Hover me'));
  expect(screen.getByRole('tooltip')).toHaveTextContent('Help info');

  await user.unhover(screen.getByText('Hover me'));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Testing',
        topicId: 'react-testing',
        tags: ['user-events', 'fireEvent', 'interaction-testing', 'react-testing-library'],
        commonMistakes: [
          'Using fireEvent.change to simulate typing — it skips per-character events and validation',
          'Forgetting to await userEvent calls, causing tests to complete before interactions finish',
          'Not using userEvent.setup() — calling userEvent methods statically uses the older, synchronous API',
          'Testing click on elements that are visually hidden or behind overlays'
        ],
        followUps: [
          'How do you test drag and drop interactions?',
          'What is the pointerEventsCheck option in userEvent?',
          'How do you simulate file uploads in RTL?'
        ],
        interviewTips: [
          'Lead with the philosophical difference: fireEvent is programmatic, userEvent is realistic',
          'Show the setup pattern — it demonstrates you use the modern userEvent API',
          'Mention that userEvent catches real-world bugs that fireEvent misses'
        ]
      },
      {
        id: 'test-9',
        question: 'How do you test components that make API calls? Explain MSW and other API mocking approaches.',
        answer: `Testing components that make API calls requires intercepting network requests to provide controlled, deterministic responses. There are several approaches, each with different tradeoffs regarding test fidelity, setup complexity, and maintenance burden. The modern best practice is to mock at the network level using Mock Service Worker (MSW) rather than mocking fetch or axios directly.

Mocking fetch or axios with jest.mock is the simplest approach. You replace the HTTP client with a mock function that returns predetermined responses. This works but has significant downsides: your tests are coupled to the specific HTTP library used, so switching from fetch to axios breaks all tests. The mock doesn't validate request URLs, headers, or methods — you could change the API endpoint in your code and tests would still pass. It also doesn't test request/response serialization or error handling in the HTTP layer.

Mock Service Worker (MSW) intercepts requests at the network level using Service Worker in browsers and request interception in Node.js. You define request handlers that match URLs and methods, then return mock responses. The key advantage is that your actual fetch/axios code executes fully — MSW only intercepts the network request at the end. This means your code's URL construction, header setting, request serialization, and response parsing are all tested. If you change an API endpoint, the test handler won't match and the test fails, catching the bug.

MSW handlers are composable and shareable. You define a base set of handlers in a handlers.ts file that serves as your default API mock for the entire test suite. Individual tests can override specific handlers for error scenarios or edge cases using server.use(). This provides consistent baseline behavior across tests while allowing per-test customization. Handlers can also be dynamic, using request parameters to return different data — matching the real API's behavior.

For integration with React Testing Library, the pattern is: set up MSW before tests, render the component, wait for async data to appear using findBy queries or waitFor, then assert on the rendered output. Use waitForElementToBeRemoved to wait for loading indicators to disappear. This tests the full lifecycle: loading state → data fetch → render data — exactly what the user experiences. For error states, override the handler to return an error response and verify the error UI renders correctly.`,
        shortAnswer: 'Mock Service Worker (MSW) intercepts requests at the network level, allowing real HTTP code to execute while providing controlled responses. Unlike jest.mock(fetch), MSW tests URL construction, serialization, and error handling. Define handlers for baseline behavior, override per-test for edge cases. Use RTL\'s findBy/waitFor for async assertions.',
        code: `// handlers.ts — shared API mocks
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Alice',
      email: 'alice@example.com',
    });
  }),

  http.post('/api/posts', async ({ request }) => {
    const body = await request.json() as { title: string };
    return HttpResponse.json({ id: '1', title: body.title }, { status: 201 });
  }),
];

// test setup: setupTests.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Component test with MSW
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('displays user profile after loading', async () => {
  render(<UserProfile userId="1" />);

  // Loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data to load
  const name = await screen.findByText('Alice');
  expect(name).toBeInTheDocument();
  expect(screen.getByText('alice@example.com')).toBeInTheDocument();
});

it('shows error on API failure', async () => {
  // Override handler for this test
  server.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    })
  );

  render(<UserProfile userId="999" />);

  const error = await screen.findByRole('alert');
  expect(error).toHaveTextContent('User not found');
});

it('submits form and shows success', async () => {
  const user = userEvent.setup();
  render(<CreatePostForm />);

  await user.type(screen.getByLabelText('Title'), 'My Post');
  await user.click(screen.getByRole('button', { name: 'Create' }));

  await waitFor(() => {
    expect(screen.getByText('Post created!')).toBeInTheDocument();
  });
});`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Testing',
        topicId: 'react-testing',
        tags: ['MSW', 'API-mocking', 'network-mocking', 'react-testing-library', 'integration'],
        commonMistakes: [
          'Mocking fetch/axios directly instead of using network-level mocking',
          'Not resetting handlers between tests, causing handler leakage',
          'Forgetting server.listen() in beforeAll, causing requests to hit real endpoints',
          'Not testing loading and error states — only testing the happy path'
        ],
        followUps: [
          'How do you test optimistic updates with MSW?',
          'What is the advantage of MSW over jest.mock for API testing?',
          'How do you use MSW in the browser for development mocking?'
        ],
        interviewTips: [
          'Explain why network-level mocking is superior to jest.mock(fetch)',
          'Show the full testing pattern: loading → data → error states',
          'Mention that MSW handlers can be shared between tests and even used in development'
        ]
      }
    ]
  },
  {
    id: 'integration-e2e-testing',
    title: 'Integration & End-to-End Testing',
    description: 'Understanding integration testing, E2E testing with Cypress, the testing pyramid, and strategies for comprehensive test coverage.',
    category: 'Testing',
    difficulty: 'Advanced',
    tags: ['integration-testing', 'e2e-testing', 'cypress', 'selenium', 'testing-pyramid', 'test-strategy'],
    overview: 'Integration and end-to-end tests verify that components, modules, and systems work together correctly. While unit tests confirm individual pieces work in isolation, integration tests check the connections between pieces, and E2E tests validate complete user workflows through the full application stack.',
    concepts: [
      'Integration tests verify module interactions and data flow',
      'E2E tests simulate real user workflows through the entire stack',
      'The testing pyramid suggests more unit tests, fewer E2E tests',
      'Cypress provides fast, reliable browser-based testing',
      'Test strategy balances coverage, speed, and maintenance cost'
    ],
    relatedTopicIds: ['unit-testing-fundamentals', 'react-testing'],
    questions: [
      {
        id: 'test-10',
        question: 'What is the testing pyramid? Explain the differences between unit, integration, and E2E tests with examples.',
        answer: `The testing pyramid is a conceptual model that guides the distribution of tests across different levels of granularity. Popularized by Mike Cohn, it illustrates that a healthy test suite should have many fast, focused unit tests at the base, a moderate number of integration tests in the middle, and a small number of slow, comprehensive end-to-end tests at the top. The pyramid shape reflects both the recommended quantity and the cost characteristics of each level.

Unit tests form the pyramid's base and should constitute 60-70% of your test suite. They test individual functions, classes, or components in complete isolation, with all dependencies mocked or stubbed. Unit tests are fast (milliseconds per test), deterministic, and easy to write and maintain. They pinpoint exactly what's broken when they fail. For a React application, unit tests cover utility functions, custom hooks (using renderHook), individual components with mocked props, and business logic modules. The limitation of unit tests is that they can't verify that units work correctly together — all integration points are mocked away.

Integration tests form the middle layer, comprising 20-30% of the suite. They test how multiple units work together with real (or realistic) dependencies. In frontend development, integration tests typically render a component with its real child components, real state management, and mocked API responses (via MSW). They verify that data flows correctly through component hierarchies, that state changes propagate properly, and that user interactions trigger the right sequence of effects. Integration tests are slower than unit tests (due to rendering real component trees) but much faster than E2E tests since they don't require a full browser or backend.

End-to-end (E2E) tests sit at the pyramid's top, comprising 5-10% of the suite. They test complete user workflows through the full application stack — real browser, real frontend, and real (or staging) backend. E2E tests use tools like Cypress or Playwright to automate browser interactions: navigating to pages, filling forms, clicking buttons, and verifying the resulting page state. They catch issues that lower-level tests miss: broken API contracts, authentication flows, cross-page navigation, and real-world timing issues. However, they're slow (seconds to minutes per test), expensive to maintain, and can be flaky due to network latency, animation timing, or test environment instability.

The modern frontend community has evolved the pyramid into a "testing trophy" shape, advocated by Kent C. Dodds, which emphasizes integration tests as the most valuable layer. The argument is that integration tests provide the best return on investment — they test realistic user scenarios without the brittleness and cost of E2E tests. This doesn't eliminate unit or E2E tests but shifts the distribution to favor integration tests for components and pages, with unit tests for complex logic and E2E tests for critical business workflows.`,
        shortAnswer: 'The testing pyramid recommends many fast unit tests (isolated functions/components), moderate integration tests (multiple units working together with mocked APIs), and few slow E2E tests (full browser + backend workflows). The "testing trophy" variant emphasizes integration tests as highest ROI for frontend apps.',
        code: `// UNIT TEST: isolated function
// utils.test.ts
import { formatPrice } from './utils';

it('formats price with currency', () => {
  expect(formatPrice(29.99)).toBe('$29.99');
  expect(formatPrice(0)).toBe('$0.00');
});

// INTEGRATION TEST: component with real children + mocked API
// ProductPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductPage } from './ProductPage';
import { CartProvider } from './CartContext';

it('adds product to cart and updates count', async () => {
  const user = userEvent.setup();
  // Real component tree, real context, mocked API (via MSW)
  render(
    <CartProvider>
      <ProductPage productId="123" />
    </CartProvider>
  );

  const product = await screen.findByText('Wireless Mouse');
  await user.click(screen.getByRole('button', { name: 'Add to Cart' }));

  expect(screen.getByText('Cart (1)')).toBeInTheDocument();
});

// E2E TEST: full workflow with Cypress
// checkout.cy.ts
describe('Checkout Flow', () => {
  it('completes purchase from browsing to confirmation', () => {
    cy.visit('/products');
    cy.findByText('Wireless Mouse').click();
    cy.findByRole('button', { name: 'Add to Cart' }).click();
    cy.findByRole('link', { name: 'Cart (1)' }).click();
    cy.findByRole('button', { name: 'Checkout' }).click();

    // Fill shipping form
    cy.findByLabelText('Address').type('123 Main St');
    cy.findByLabelText('City').type('Springfield');
    cy.findByRole('button', { name: 'Place Order' }).click();

    cy.findByText('Order Confirmed!').should('be.visible');
    cy.findByText('Order #').should('exist');
  });
});`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Testing',
        topicId: 'integration-e2e-testing',
        tags: ['testing-pyramid', 'unit-test', 'integration-test', 'e2e', 'test-strategy'],
        commonMistakes: [
          'Writing only unit tests — misses integration bugs between components',
          'Writing too many E2E tests — slow, flaky, expensive to maintain',
          'Testing implementation details in unit tests instead of behavior',
          'Not having a clear strategy for which scenarios get which test type'
        ],
        followUps: [
          'What is the testing trophy and how does it differ from the pyramid?',
          'How do you decide which tests to write for a new feature?',
          'What makes E2E tests flaky and how do you improve reliability?'
        ],
        interviewTips: [
          'Explain the tradeoffs: speed/cost vs. confidence at each level',
          'Mention the testing trophy as a modern evolution of the pyramid',
          'Give concrete examples of what bugs each level catches that others miss'
        ]
      },
      {
        id: 'test-11',
        question: 'What is Cypress and how does it differ from Selenium for E2E testing? What are Cypress\'s key advantages?',
        answer: `Cypress is a modern end-to-end testing framework built specifically for web applications. Unlike Selenium, which was designed as a general browser automation tool and later adapted for testing, Cypress was purpose-built for the testing use case from the ground up. This design philosophy leads to fundamental architectural differences that significantly impact the developer experience, test reliability, and debugging capabilities.

The most significant architectural difference is execution context. Selenium operates outside the browser, sending commands to a browser driver (like ChromeDriver) via the WebDriver protocol. Each command is a separate HTTP request to the driver, introducing network latency and timing issues. Cypress runs directly inside the browser alongside your application code. Its test code executes in the same JavaScript runtime as your application, giving it direct access to the DOM, network requests, window objects, and even application state. This eliminates the network hop between test runner and browser, making Cypress significantly faster and more deterministic.

Cypress's automatic waiting is a game-changer for test reliability. Selenium requires explicit waits (WebDriverWait, Thread.sleep) because it can't know when the page is "ready" after an interaction. Cypress automatically waits for elements to exist, become visible, become enabled, not be covered, and not be animating before interacting with them. Assertions automatically retry for up to 4 seconds (configurable) before failing. This eliminates the most common source of E2E test flakiness — timing issues — without any explicit wait code.

Cypress provides time-travel debugging through automatic snapshots of the DOM at each test step. The test runner UI shows every command with before/after DOM snapshots that you can hover over to see exactly what the page looked like at each step. Failed tests include screenshots and videos automatically. Network requests are captured in a log, showing request/response details. This dramatically reduces the time to diagnose test failures compared to Selenium, where you typically only get a failure message and must reproduce the issue manually.

However, Cypress has limitations that Selenium doesn't. Cypress only supports Chromium-based browsers and Firefox (Selenium supports all browsers including Safari and IE). Cypress cannot test multiple browser tabs or windows simultaneously. Cypress has a same-origin restriction for navigation. Selenium can test any web technology including native mobile apps (via Appium). For teams that need cross-browser testing including Safari, or need to test multi-tab workflows, Playwright (a newer alternative) covers most of Cypress's advantages while supporting all major browsers and multi-page scenarios.`,
        shortAnswer: 'Cypress runs inside the browser alongside the application, providing direct DOM access, automatic waiting, and time-travel debugging. Selenium runs outside the browser via WebDriver protocol, causing network latency and timing issues. Cypress is faster and more reliable but limited to Chromium and Firefox. Playwright is a modern alternative supporting all browsers.',
        code: `// Cypress E2E test
describe('User Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in with valid credentials', () => {
    cy.findByLabelText('Email').type('user@example.com');
    cy.findByLabelText('Password').type('password123');
    cy.findByRole('button', { name: 'Sign In' }).click();

    // Cypress automatically waits for navigation and element
    cy.url().should('include', '/dashboard');
    cy.findByText('Welcome back').should('be.visible');
  });

  it('shows validation errors', () => {
    cy.findByRole('button', { name: 'Sign In' }).click();

    cy.findByText('Email is required').should('be.visible');
    cy.findByText('Password is required').should('be.visible');
  });

  it('handles API errors gracefully', () => {
    // Intercept and mock API response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginRequest');

    cy.findByLabelText('Email').type('user@example.com');
    cy.findByLabelText('Password').type('wrongpass');
    cy.findByRole('button', { name: 'Sign In' }).click();

    cy.wait('@loginRequest');
    cy.findByRole('alert').should('contain', 'Invalid credentials');
  });
});

// Custom Cypress command
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.findByLabelText('Email').type(email);
    cy.findByLabelText('Password').type(password);
    cy.findByRole('button', { name: 'Sign In' }).click();
    cy.url().should('include', '/dashboard');
  });
});`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'Testing',
        topicId: 'integration-e2e-testing',
        tags: ['cypress', 'selenium', 'e2e', 'browser-testing', 'automation'],
        commonMistakes: [
          'Adding explicit waits (cy.wait(5000)) instead of relying on Cypress automatic waiting',
          'Testing implementation details instead of user-visible behavior in E2E tests',
          'Not using cy.intercept for API mocking, making tests depend on real backend state',
          'Writing too many E2E tests instead of using integration tests where appropriate'
        ],
        followUps: [
          'How does Playwright compare to Cypress?',
          'How do you handle authentication in Cypress tests efficiently?',
          'What is cy.intercept and how does it compare to MSW?'
        ],
        interviewTips: [
          'Focus on the architectural difference: inside the browser vs. outside',
          'Mention automatic waiting as the key reliability advantage',
          'Acknowledge Cypress limitations — shows balanced understanding'
        ]
      },
      {
        id: 'test-12',
        question: 'How do you write maintainable integration tests for React components? What patterns and strategies lead to robust test suites?',
        answer: `Writing maintainable integration tests requires deliberate patterns that keep tests readable, resilient to refactoring, and fast to execute. A well-structured integration test suite becomes documentation for how components behave and serves as a safety net for changes. Poor integration tests, conversely, become a maintenance burden that slows development without providing confidence.

The first principle is to test user-facing behavior, not implementation details. Instead of checking that setState was called with specific arguments or that a particular CSS class was applied, verify what the user sees and experiences. Test that a success message appears after form submission, not that the isSubmitted state became true. Test that a list shows 5 items, not that the data array has length 5. This makes tests resilient to refactoring — you can change state management, component structure, or styling without breaking tests as long as the user-facing behavior is preserved.

The Arrange-Act-Assert (AAA) pattern provides clear test structure. Arrange sets up the component with necessary providers, context, and initial state. Act performs user interactions using userEvent. Assert verifies the expected outcome using screen queries. Keep each test focused on one behavior or scenario. A test named "submits form with valid data" should only test that specific flow, not also verify error handling or loading states. Multiple focused tests are easier to understand and maintain than one test that covers everything.

Create testing utilities that encapsulate common patterns. A custom render function that wraps components in necessary providers (router, theme, query client) eliminates boilerplate from every test. Page object patterns or component test helpers encapsulate common interactions — a fillLoginForm helper that types email and password reads more clearly than raw userEvent calls. These abstractions make tests read like specifications: "given a user fills the login form and clicks submit, they see the dashboard."

Structure tests in a describe hierarchy that mirrors user scenarios, not component internals. Group by feature or workflow: "Checkout Flow" → "Shipping Step" → "validates required fields", "calculates shipping cost". This organization makes it easy to find relevant tests and understand coverage gaps. Use beforeEach for shared setup within a describe block, but keep test-specific setup in the test itself — if a test overrides an MSW handler, that override should be visible in the test, not hidden in a hook. Each test should tell a complete story when read from top to bottom.`,
        shortAnswer: 'Write maintainable integration tests by testing user-facing behavior (not implementation details), using Arrange-Act-Assert structure, creating custom render utilities with providers, and organizing tests by user scenarios. Keep tests focused on one behavior, use descriptive names, and make each test readable as a standalone specification.',
        code: `// Custom render with providers
function renderWithProviders(ui: React.ReactElement, options?: {
  initialRoute?: string;
  preloadedState?: Partial<AppState>;
}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[options?.initialRoute ?? '/']}>
          <ThemeProvider>
            {ui}
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  };
}

// Well-structured integration test
describe('Product Search', () => {
  it('displays search results matching the query', async () => {
    // Arrange
    const { user } = renderWithProviders(<SearchPage />);

    // Act
    await user.type(screen.getByRole('searchbox'), 'keyboard');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    // Assert
    const results = await screen.findAllByRole('article');
    expect(results).toHaveLength(3);
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
  });

  it('shows empty state when no results match', async () => {
    server.use(
      http.get('/api/search', () => HttpResponse.json({ results: [] }))
    );

    const { user } = renderWithProviders(<SearchPage />);

    await user.type(screen.getByRole('searchbox'), 'xyznonexistent');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await screen.findByText('No results found');
    expect(screen.getByText('Try a different search term'))
      .toBeInTheDocument();
  });

  it('handles search API errors with retry option', async () => {
    server.use(
      http.get('/api/search', () =>
        HttpResponse.json({ error: 'Service unavailable' }, { status: 503 })
      )
    );

    const { user } = renderWithProviders(<SearchPage />);

    await user.type(screen.getByRole('searchbox'), 'keyboard');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('button', { name: 'Retry' }))
      .toBeInTheDocument();
  });
});`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Scenario',
        category: 'Testing',
        topicId: 'integration-e2e-testing',
        tags: ['integration-testing', 'test-patterns', 'maintainability', 'AAA-pattern', 'react-testing'],
        commonMistakes: [
          'Testing internal state or implementation instead of user-visible behavior',
          'Not providing necessary context providers, causing cryptic rendering errors',
          'Writing huge monolithic tests that cover multiple behaviors',
          'Relying on snapshot tests for integration testing instead of explicit assertions'
        ],
        followUps: [
          'When should you use snapshot testing vs. explicit assertions?',
          'How do you handle component tests that need complex global state?',
          'What is the Page Object pattern for component testing?'
        ],
        interviewTips: [
          'Emphasize the "test behavior, not implementation" philosophy with concrete examples',
          'Show the custom render pattern — it demonstrates practical testing experience',
          'Discuss how good test organization doubles as feature documentation'
        ]
      }
    ]
  }
];
