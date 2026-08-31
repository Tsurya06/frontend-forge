import type { Topic } from '../../types';

export const reduxTopics: Topic[] = [
  {
    id: 'redux-1',
    title: 'Redux State Management',
    description:
      'Comprehensive coverage of Redux fundamentals, middleware, async patterns, Redux Toolkit, selectors, debugging, and best practices for scalable state management in React applications.',
    category: 'Redux',
    difficulty: 'Intermediate',
    tags: [
      'redux',
      'state management',
      'middleware',
      'redux toolkit',
      'rtk query',
      'thunk',
      'saga',
      'selectors',
      'immutability',
      'devtools',
    ],
    overview:
      'Redux is a predictable state container for JavaScript applications that enforces a unidirectional data flow. Built on three core principles — a single source of truth, read-only state, and pure reducer functions — Redux provides a robust architecture for managing complex application state. Modern Redux development leverages Redux Toolkit (RTK) to eliminate boilerplate while preserving the benefits of explicit state transitions, middleware-driven side effects, and powerful debugging through time-travel. Understanding Redux deeply — from raw store creation to RTK Query for data fetching — is essential for senior React interviews.',
    concepts: [
      'Single source of truth (one store)',
      'State is read-only — changes only via dispatched actions',
      'Reducers are pure functions (prevState, action) → newState',
      'Unidirectional data flow: dispatch → middleware → reducer → store → UI',
      'Middleware for side effects and cross-cutting concerns',
      'Immutability guarantees via Immer inside Redux Toolkit',
      'Selector functions and memoization with Reselect',
      'Redux Toolkit: createSlice, configureStore, createAsyncThunk, RTK Query',
      'combineReducers for modular state composition',
      'Redux DevTools and time-travel debugging',
    ],
    codeExamples: [
      {
        title: 'configureStore with Redux Toolkit',
        language: 'typescript',
        code: `import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import postsReducer from './features/posts/postsSlice';
import { apiSlice } from './features/api/apiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
        explanation:
          'configureStore wraps createStore with good defaults: redux-thunk middleware, Redux DevTools integration, and development-mode checks for accidental mutations and non-serializable values.',
      },
      {
        title: 'createSlice example',
        language: 'typescript',
        code: `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = { value: 0, status: 'idle' };

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1; // Immer allows "mutative" syntax
    },
    decrement(state) {
      state.value -= 1;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;`,
        explanation:
          'createSlice generates action creators and a reducer from a single definition. Immer is used internally so you can write "mutative" code that produces immutable updates.',
      },
      {
        title: 'createAsyncThunk with loading states',
        language: 'typescript',
        code: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User { id: number; name: string; }
interface UsersState {
  entities: User[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle', error: null } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;`,
        explanation:
          'createAsyncThunk generates pending/fulfilled/rejected action types automatically. The builder callback in extraReducers handles each lifecycle phase with type-safe access to payloads.',
      },
      {
        title: 'Memoized selector with createSelector',
        language: 'typescript',
        code: `import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const selectAllPosts = (state: RootState) => state.posts.entities;
const selectUserId = (_: RootState, userId: string) => userId;

export const selectPostsByUser = createSelector(
  [selectAllPosts, selectUserId],
  (posts, userId) => posts.filter((p) => p.authorId === userId)
);

// Usage in component:
// const userPosts = useSelector((state) => selectPostsByUser(state, userId));`,
        explanation:
          'createSelector (re-exported from Reselect) memoizes the output so the filter only reruns when posts or userId change, preventing unnecessary re-renders.',
      },
    ],
    relatedTopicIds: ['react-hooks', 'react-context', 'react-performance'],
    questions: [
      {
        id: 'redux-1',
        question:
          'What are the three core principles of Redux, and why does each matter?',
        answer:
          'The first principle is "Single Source of Truth": the entire application state lives in one JavaScript object inside a single store. This centralisation makes it straightforward to hydrate the app from server-rendered state or persist/restore state across sessions. Debugging benefits enormously because you can inspect one object to understand the full picture, and features like undo/redo become trivial since you only need to snapshot a single tree.\n\nThe second principle is "State is Read-Only": the only way to change state is to dispatch an action — a plain object with a `type` field and an optional payload. This constraint ensures every state transition is explicit and traceable. No component can silently mutate a shared object; instead, every change flows through a well-defined pipeline. Action objects are serialisable, which enables logging, replay, and time-travel debugging in Redux DevTools.\n\nThe third principle is "Changes Are Made with Pure Functions": reducers take the previous state and an action, then return a brand-new state object without side effects. Purity guarantees referential transparency — given the same inputs, you always get the same output — which makes testing straightforward (no mocks needed) and enables advanced tooling like hot module replacement of reducers. Together, these three constraints trade a small amount of ceremony for enormous predictability, and that trade-off pays off rapidly as application complexity grows.',
        shortAnswer:
          'Single source of truth (one store), state is read-only (actions only), and pure reducer functions ensure predictable, testable, and debuggable state management.',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['redux', 'principles', 'store', 'actions', 'reducers'],
        commonMistakes: [
          'Mutating state directly inside a reducer instead of returning a new object',
          'Creating multiple stores — Redux is designed around a single store',
          'Putting non-serialisable values (class instances, Promises) in the store',
        ],
        followUps: [
          'How does Redux Toolkit relax the "no mutation" rule without violating immutability?',
          'Can you have more than one store, and when might that make sense?',
          'How do these principles compare to MobX or Zustand?',
        ],
        interviewTips: [
          'Relate each principle to a concrete debugging or testing benefit rather than just reciting definitions',
          'Mention how Redux Toolkit embraces these principles while reducing boilerplate',
        ],
      },
      {
        id: 'redux-2',
        question:
          'When would you choose Redux over the Context API, and vice versa?',
        answer:
          'The React Context API is ideal for low-frequency, global values that rarely change — things like the current locale, theme, or authentication status. Because every consumer of a context re-renders whenever the context value changes (unless you manually split contexts or memoize), Context becomes a performance liability when the data updates frequently or many components subscribe to different slices of the same value.\n\nRedux, by contrast, is optimized for frequent, fine-grained updates. `useSelector` performs a strict-equality check by default, so a component only re-renders when the specific slice of state it subscribes to has actually changed. Combined with memoized selectors (Reselect), Redux can efficiently serve hundreds of subscribing components without unnecessary render cycles. Redux also offers a rich middleware ecosystem for side effects, built-in support for serializable action logs, and time-travel debugging — none of which Context provides.\n\nA practical heuristic: if the state is consumed by fewer than a dozen closely-related components and changes infrequently, Context is simpler and sufficient. If the state is shared across many unrelated parts of the tree, changes often, benefits from middleware-driven side effects, or needs powerful DevTools, Redux is the better fit. Many large applications use both — Context for truly global, rarely-changing values and Redux for domain state that drives the UI.',
        shortAnswer:
          'Use Context for low-frequency global values (theme, locale); use Redux for frequently-changing shared state that benefits from fine-grained subscriptions, middleware, and DevTools.',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['redux', 'context api', 'state management', 'performance'],
        commonMistakes: [
          'Using a single Context for many values that change independently, causing widespread re-renders',
          'Assuming Redux is always overkill — complex apps with shared mutable state genuinely benefit from it',
          'Wrapping the entire state tree in Context and calling it "good enough" without profiling',
        ],
        followUps: [
          'How does Zustand compare to both Context and Redux?',
          'Can you combine Context and Redux in the same app — and should you?',
        ],
        interviewTips: [
          'Demonstrate awareness of performance trade-offs, not just API differences',
          'Mention that Redux Toolkit has eliminated most of the boilerplate argument against Redux',
        ],
      },
      {
        id: 'redux-3',
        question:
          'Explain Redux middleware. How would you write a custom middleware?',
        answer:
          'Middleware in Redux sits between the dispatch of an action and the moment that action reaches the reducer. It forms a composable pipeline: each middleware receives the store\'s `dispatch` and `getState`, and returns a function that accepts the `next` middleware\'s dispatch, which in turn returns a function that receives the action. This curried signature `(store) => (next) => (action) => { ... }` lets each middleware inspect, delay, transform, or even swallow actions before they continue down the chain.\n\nThe most common built-in middleware is `redux-thunk`, which checks whether the dispatched value is a function rather than a plain action object; if it is, the thunk middleware calls that function with `dispatch` and `getState`, giving it the ability to perform async work and dispatch further actions. `redux-saga` takes a different approach, using generator functions to describe complex async flows declaratively with effects like `call`, `put`, `takeLatest`, and `fork`. Sagas excel at orchestrating race conditions, cancellation, and parallel side effects.\n\nWriting a custom middleware is straightforward. For example, a logging middleware looks like `const logger = (store) => (next) => (action) => { console.log(\'dispatching\', action); const result = next(action); console.log(\'next state\', store.getState()); return result; }`. The key rule is that you must call `next(action)` to pass the action along — otherwise the chain stops and the reducer never sees the action. Custom middleware is the right place for cross-cutting concerns like analytics tracking, error reporting, or WebSocket message handling.',
        shortAnswer:
          'Middleware intercepts dispatched actions before they reach the reducer. Its signature is (store) => (next) => (action) => {}. You must call next(action) to continue the chain.',
        code: `// Custom analytics middleware
const analyticsMiddleware = (store) => (next) => (action) => {
  if (action.meta?.analytics) {
    const { event, properties } = action.meta.analytics;
    trackEvent(event, {
      ...properties,
      currentState: store.getState(),
    });
  }
  return next(action);
};

// Applying middleware with configureStore
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(analyticsMiddleware),
});`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['middleware', 'redux-thunk', 'redux-saga', 'custom middleware'],
        commonMistakes: [
          'Forgetting to call next(action), which silently swallows the action',
          'Performing heavy synchronous work inside middleware, blocking the dispatch pipeline',
          'Placing middleware in the wrong order — e.g. a logger after a thunk will never see thunk functions',
        ],
        followUps: [
          'How does middleware ordering affect behaviour?',
          'When would you choose redux-saga over redux-thunk?',
          'How does RTK\'s listener middleware compare to saga?',
        ],
        interviewTips: [
          'Be ready to write the curried middleware signature from memory — it is a classic whiteboard question',
        ],
      },
      {
        id: 'redux-4',
        question:
          'How does combineReducers work, and how do you manage deeply nested state?',
        answer:
          'combineReducers is a utility that turns an object whose values are individual reducer functions into a single reducer function suitable for `createStore` (or `configureStore`). Each key in the object maps to a top-level key in the state tree, and the corresponding reducer only ever receives and returns that slice. When an action is dispatched, combineReducers calls every child reducer with its slice and the action, then assembles the results into a new root state object. If none of the slices changed (strict reference equality), it returns the previous state object, which prevents unnecessary React re-renders.\n\nFor deeply nested state, you have several strategies. The simplest is to call combineReducers recursively — a child reducer can itself be the product of combineReducers. However, deeply nesting reducers increases complexity and makes selectors awkward. A better practice is to normalise state: flatten entities into lookup tables keyed by ID and store relationships as arrays of IDs, similar to a relational database. Redux Toolkit\'s `createEntityAdapter` automates this normalisation, providing `addOne`, `updateOne`, `removeMany`, and pre-built selectors like `selectAll` and `selectById`.\n\nWhen a single action needs to update multiple slices, each child reducer independently handles the same action type. Alternatively, you can use `extraReducers` in `createSlice` to let one slice react to actions defined in another. For truly cross-cutting updates that span the whole tree, a higher-order reducer that wraps the combined reducer can intercept specific actions and perform tree-wide transformations before delegating to the children.',
        shortAnswer:
          'combineReducers maps each key in the state tree to an independent reducer. For nested state, prefer normalisation (flat entity tables) over deeply nested reducer trees.',
        code: `import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postsReducer from './postsSlice';
import commentsReducer from './commentsSlice';

// Nested combineReducers
const socialReducer = combineReducers({
  posts: postsReducer,
  comments: commentsReducer,
});

const rootReducer = combineReducers({
  user: userReducer,
  social: socialReducer,
});

// Equivalent state shape:
// { user: { ... }, social: { posts: { ... }, comments: { ... } } }`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['combineReducers', 'state normalisation', 'reducer composition'],
        commonMistakes: [
          'Assuming a child reducer receives the entire state tree — it only sees its own slice',
          'Deeply nesting state instead of normalising, leading to brittle spread-based updates',
          'Forgetting that combineReducers returns the same reference when no slice changes, and then breaking that guarantee with careless reducer logic',
        ],
        followUps: [
          'How does createEntityAdapter help with normalised state?',
          'Can two slices respond to the same action type?',
        ],
        interviewTips: [
          'Draw the state tree on a whiteboard to show how combineReducers maps keys to slices',
          'Mention normalisation early — it signals senior-level thinking about scalable state design',
        ],
      },
      {
        id: 'redux-5',
        question:
          'Describe the complete Redux data flow from a user interaction to a UI update.',
        answer:
          'The cycle begins when a user interaction (click, form submit, route change) triggers a call to `dispatch(action)`. The action is a plain object with a `type` string and an optional `payload`. Dispatching is the only way to signal that something happened; components never modify the store directly.\n\nOnce dispatched, the action enters the middleware pipeline. Each middleware can inspect the action, perform side effects (API calls, logging, analytics), transform the action, dispatch additional actions, or pass the action along by calling `next(action)`. After the final middleware calls `next`, the action reaches the root reducer. The root reducer (typically produced by `combineReducers` or `configureStore`) delegates to each slice reducer. Every slice reducer examines the action\'s type: if it matches, the reducer computes and returns a new slice state; otherwise, it returns the previous slice state unchanged. The root reducer assembles all slices into a new root state object.\n\nThe store saves this new root state and notifies all subscribers. In a React app using `react-redux`, the `<Provider>` makes the store available via context, and each `useSelector` hook runs its selector against the new state. React-Redux performs a shallow equality comparison on selector results; only components whose selected value actually changed will re-render. This granular subscription model is what makes Redux efficient even with a single global store — the store update is O(1), and only the affected leaves of the component tree re-render.',
        shortAnswer:
          'User event → dispatch(action) → middleware pipeline → root reducer computes new state → store notifies subscribers → useSelector detects changes → affected components re-render.',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['data flow', 'dispatch', 'reducer', 'store', 'useSelector'],
        commonMistakes: [
          'Thinking reducers are called only for matching action types — every slice reducer is called for every action',
          'Ignoring the middleware step when explaining the flow, which is where all side effects live',
          'Assuming dispatch is asynchronous — it is synchronous unless middleware intercepts the action',
        ],
        followUps: [
          'What happens if a reducer accidentally returns undefined?',
          'How does batching work with multiple rapid dispatches?',
          'How does React 18 automatic batching interact with Redux dispatches?',
        ],
        interviewTips: [
          'Walk through each phase sequentially on a whiteboard — interviewers love visual data-flow explanations',
        ],
      },
      {
        id: 'redux-6',
        question:
          'How do you handle asynchronous operations in Redux? Compare thunks and sagas.',
        answer:
          'Redux reducers must be pure and synchronous, so async work has to happen elsewhere — typically in middleware. The two dominant approaches are thunks (via `redux-thunk` or `createAsyncThunk`) and sagas (via `redux-saga`). A thunk is simply a function that receives `dispatch` and `getState` as arguments, allowing you to perform async logic and dispatch actions at any point. `createAsyncThunk` from Redux Toolkit standardises this by auto-generating `pending`, `fulfilled`, and `rejected` action types and dispatching them at the right lifecycle moments. Thunks are easy to learn, require no special syntax, and work well for straightforward API calls.\n\nRedux-saga uses ES6 generator functions and a declarative effect model. Instead of directly calling `fetch`, you `yield call(fetch, url)`, and the saga middleware executes the effect for you. This indirection makes sagas highly testable — you can step through the generator and assert on yielded effects without mocking network calls. Sagas also provide powerful concurrency primitives: `takeLatest` automatically cancels in-flight requests when a new one arrives, `race` lets you implement timeouts, `all` runs effects in parallel, and `fork` spawns non-blocking background tasks. These capabilities make sagas ideal for complex async orchestration like WebSocket management, polling, or multi-step workflows.\n\nIn practice, most applications start with thunks because of their simplicity and the excellent `createAsyncThunk` API. Sagas earn their complexity budget when you need fine-grained cancellation, debouncing at the middleware level, or coordination between multiple concurrent flows. A newer alternative, RTK\'s `listenerMiddleware`, offers a middle ground: it supports condition-based action listening and cancellation without the generator syntax, and is built into Redux Toolkit.',
        shortAnswer:
          'Thunks dispatch functions for simple async work; sagas use generators for complex orchestration with cancellation and concurrency. createAsyncThunk standardises thunk lifecycle actions.',
        code: `// Thunk approach with createAsyncThunk
export const fetchPosts = createAsyncThunk(
  'posts/fetch',
  async (userId: string, { rejectWithValue }) => {
    const res = await fetch(\`/api/users/\${userId}/posts\`);
    if (!res.ok) return rejectWithValue('Failed to fetch');
    return res.json();
  }
);

// Saga approach
import { call, put, takeLatest } from 'redux-saga/effects';

function* fetchPostsSaga(action) {
  try {
    yield put({ type: 'posts/loading' });
    const posts = yield call(fetch, \`/api/users/\${action.payload}/posts\`);
    const data = yield call([posts, 'json']);
    yield put({ type: 'posts/loaded', payload: data });
  } catch (e) {
    yield put({ type: 'posts/error', payload: e.message });
  }
}

function* watchFetchPosts() {
  yield takeLatest('posts/fetch', fetchPostsSaga);
}`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['async', 'thunk', 'saga', 'createAsyncThunk', 'side effects'],
        commonMistakes: [
          'Not handling the rejected/error case in extraReducers, leaving the UI stuck in a loading state',
          'Using sagas for trivial API calls where a thunk would be simpler and easier to maintain',
          'Forgetting to return the result of rejectWithValue, causing the thunk to fulfill instead of reject',
        ],
        followUps: [
          'How does RTK listener middleware compare to sagas?',
          'How would you implement request cancellation with createAsyncThunk?',
          'What is the AbortController integration in createAsyncThunk?',
        ],
        interviewTips: [
          'Show awareness of trade-offs rather than strongly advocating one approach — interviewers value pragmatic judgment',
          'Mention RTK listener middleware as a modern alternative to demonstrate up-to-date knowledge',
        ],
      },
      {
        id: 'redux-7',
        question:
          'Why is immutability important in Redux, and how does Immer simplify immutable updates?',
        answer:
          'Immutability is foundational to Redux because the entire change-detection mechanism depends on reference equality checks. When you dispatch an action, React-Redux\'s `useSelector` compares the new selector result with the previous one using `===`. If a reducer mutates the existing state object instead of returning a new one, the reference stays the same, and subscribers never learn that data has changed — the UI becomes stale. Immutability also enables time-travel debugging in Redux DevTools, because every dispatched action produces a distinct state snapshot that can be replayed or reverted.\n\nBefore Immer, achieving immutability required carefully spreading nested objects and arrays at every level: `return { ...state, user: { ...state.user, address: { ...state.user.address, city: newCity } } }`. This verbose "spread pattern" is error-prone — missing one level of spreading silently mutates a shared reference. For arrays, developers had to use non-mutating methods like `map`, `filter`, and `concat` instead of `push`, `splice`, or direct index assignment.\n\nImmer, which is integrated into Redux Toolkit\'s `createSlice` and `createReducer`, eliminates this verbosity. You write code that looks like direct mutation — `state.user.address.city = newCity` — and Immer intercepts those writes using a Proxy-based draft mechanism. When the reducer returns, Immer produces a structurally shared immutable copy where only the changed paths are new objects; unchanged branches keep their original references. This structural sharing is memory-efficient and preserves the reference-equality checks that React-Redux depends on, giving you the best of both worlds: readable reducer code and correct immutable semantics.',
        shortAnswer:
          'Immutability lets Redux detect changes via reference equality. Immer, built into RTK, lets you write "mutative" code in reducers while producing immutable updates via Proxy-based drafts.',
        code: `// Without Immer — manual immutable update
function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todo/toggle':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    default:
      return state;
  }
}

// With Immer (via createSlice) — equivalent logic
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<string>) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed; // safe — Immer draft
      }
    },
  },
});`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['immutability', 'immer', 'spread pattern', 'structural sharing'],
        commonMistakes: [
          'Mutating state outside of an Immer-powered reducer (e.g. in a hand-written reducer without RTK)',
          'Both mutating the draft AND returning a new value in the same createSlice reducer — Immer cannot reconcile both',
          'Assuming Immer deep-clones the entire state — it uses structural sharing so only changed paths are new objects',
        ],
        followUps: [
          'What is structural sharing and why does it matter for performance?',
          'How does Immer handle updates to Map and Set objects?',
        ],
        interviewTips: [
          'Explain the Proxy mechanism briefly to show you understand Immer internals, not just its API',
        ],
      },
      {
        id: 'redux-8',
        question:
          'How do selectors and memoization work in Redux? Explain Reselect.',
        answer:
          'A selector is any function that takes the Redux state and returns a derived value. Simple selectors like `(state) => state.user.name` are just property accessors, but computed selectors — ones that filter, sort, or aggregate data — can be expensive. Without memoization, every call to `useSelector` that returns a new array or object reference will trigger a re-render even if the underlying data has not changed, because the default `===` comparison sees a new reference.\n\nReselect (re-exported by Redux Toolkit as `createSelector`) solves this by creating memoized selectors. A `createSelector` call takes one or more "input selectors" and a "result function". The input selectors extract raw slices of state, and the result function computes the derived value. Reselect caches the most recent inputs and output: if all input selector results are identical by reference to the previous call, the result function is skipped entirely and the cached output is returned. This means the component receives the same object reference and React skips the re-render.\n\nFor parameterised selectors (e.g. selecting posts by a specific user ID), each component instance needs its own memoized selector instance to avoid cache thrashing. With Reselect 4+ you can pass `{ memoizeOptions: { maxSize: 10 } }` for a small LRU cache, or use `createSelector` inside a factory function that returns a new selector per component. Redux Toolkit also re-exports `createDraftSafeSelector` for use inside `createSlice` extra reducers, and `createEntityAdapter` provides pre-built selectors (`selectAll`, `selectById`, `selectIds`) that are already memoized and cover the most common CRUD-table patterns.',
        shortAnswer:
          'Selectors derive data from state. createSelector (Reselect) memoizes results so the output reference stays stable when inputs have not changed, preventing unnecessary re-renders.',
        code: `import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const selectPosts = (state: RootState) => state.posts.entities;
const selectFilter = (state: RootState) => state.posts.filter;

// Memoized: only recomputes when posts or filter changes
export const selectFilteredPosts = createSelector(
  [selectPosts, selectFilter],
  (posts, filter) => {
    if (filter === 'all') return posts;
    return posts.filter((p) => p.status === filter);
  }
);

// Parameterised selector factory (avoids cache thrashing)
export const makeSelectPostsByUser = () =>
  createSelector(
    [selectPosts, (_: RootState, userId: string) => userId],
    (posts, userId) => posts.filter((p) => p.authorId === userId)
  );

// Usage in component
// const selectPostsByUser = useMemo(makeSelectPostsByUser, []);
// const posts = useSelector((state) => selectPostsByUser(state, userId));`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['selectors', 'reselect', 'memoization', 'createSelector', 'performance'],
        commonMistakes: [
          'Creating a new selector inside a component on every render — this defeats memoization entirely',
          'Using createSelector for trivial property access where a plain function suffices',
          'Forgetting that Reselect\'s default cache size is 1 — parameterised selectors with changing args thrash the cache',
        ],
        followUps: [
          'How would you increase the cache size for a selector used with many different arguments?',
          'What is the difference between createSelector and createDraftSafeSelector?',
          'How does useSelector equality comparison interact with selector memoization?',
        ],
        interviewTips: [
          'Demonstrate understanding of why selectors re-render components by discussing reference equality, not just "memoization"',
        ],
      },
      {
        id: 'redux-9',
        question:
          'How would you structure a large Redux application? Compare feature folders, ducks, and slices.',
        answer:
          'In a large Redux codebase, the folder structure directly impacts maintainability. The traditional approach grouped files by type: one folder for all actions, one for all reducers, one for all selectors. This "type-based" layout forces you to jump between three or four directories to understand a single feature and scales poorly as the feature count grows.\n\nThe "ducks" pattern solved this by co-locating a feature\'s action types, action creators, and reducer in a single file. A ducks module exports a default reducer and named action creators, keeping everything about a feature together. While a significant improvement, ducks modules still required manual boilerplate — defining string constants, writing switch-case reducers, and creating action creators by hand.\n\nRedux Toolkit\'s `createSlice` is the evolution of the ducks pattern. A slice file defines the reducer logic, action creators, and action types in a single `createSlice` call. The recommended project structure is feature-based: each feature gets its own folder containing its slice, selectors, thunks (or hooks), and associated component code. For example: `features/auth/authSlice.ts`, `features/auth/authSelectors.ts`, `features/auth/useAuth.ts`. The store is configured at the top level by importing each slice\'s reducer. This approach scales to hundreds of features because each feature is fully self-contained: you can add, remove, or refactor a feature without touching unrelated code. For very large applications, code-splitting reducers with `store.replaceReducer` or lazy-injecting slices lets you load feature state only when the user navigates to that feature.',
        shortAnswer:
          'Feature-based folders with RTK slices are the modern standard. Each feature co-locates its slice, selectors, and thunks. This scales better than type-based folders or vanilla ducks.',
        difficulty: 'Advanced',
        type: 'Scenario',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['project structure', 'ducks pattern', 'feature folders', 'createSlice', 'scalability'],
        commonMistakes: [
          'Grouping by file type (all reducers together, all actions together) which breaks feature cohesion at scale',
          'Creating one massive slice with dozens of reducers instead of splitting into focused feature slices',
          'Importing slices circularly — e.g. slice A importing from slice B which imports from slice A',
        ],
        followUps: [
          'How would you implement lazy-loaded reducer injection for code-split routes?',
          'How do you handle shared state that spans multiple features?',
        ],
        interviewTips: [
          'Reference a real project structure you have used — concrete examples are more convincing than abstract patterns',
          'Mention code-splitting reducers to show senior-level awareness of performance at scale',
        ],
      },
      {
        id: 'redux-10',
        question:
          'How do you debug Redux applications? Describe Redux DevTools and time-travel debugging.',
        answer:
          'Redux DevTools is a browser extension (and standalone app) that hooks into the Redux store to provide a rich debugging interface. Every dispatched action appears in a chronological list with its type, payload, and the resulting state diff. You can inspect any action to see exactly which parts of the state tree changed, which is invaluable for tracking down bugs where "the wrong value ends up in state." The DevTools also display the current full state tree, so you can verify shape and values at a glance without adding console.log statements.\n\nTime-travel debugging is the standout feature. Because Redux state transitions are pure and every action is recorded, you can jump to any point in the action history and the store will revert to that exact state. You can step backward and forward, skip individual actions, or replay the entire sequence. This turns debugging from "reproduce the bug and add breakpoints" into "inspect the exact moment the state went wrong." It is especially powerful for complex user flows where the bug only manifests after a specific sequence of interactions.\n\nBeyond DevTools, Redux\'s architecture naturally supports other debugging strategies. Since actions are plain serialisable objects, you can log them to an external service for production diagnostics. Middleware like `redux-logger` prints each action and state change to the console during development. `configureStore` from Redux Toolkit also enables serialisability checks and immutability checks in development mode — these middleware warn you immediately if you accidentally put a non-serialisable value (like a Date object or a class instance) into the store, or if you mutate state outside of an Immer-powered reducer.',
        shortAnswer:
          'Redux DevTools records every action and state change, enabling time-travel debugging (jump/replay any state), action diffs, and state inspection. RTK adds built-in mutation and serialisability warnings.',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['devtools', 'debugging', 'time-travel', 'redux-logger', 'serialisability'],
        commonMistakes: [
          'Leaving DevTools enabled in production builds, exposing the entire state tree to users',
          'Ignoring serialisability warnings — non-serialisable state breaks time-travel and persistence',
          'Not using the state diff view and instead manually comparing full state snapshots',
        ],
        followUps: [
          'How do you conditionally enable DevTools only in development?',
          'How would you log Redux actions to a monitoring service in production?',
          'What are the performance implications of recording every action?',
        ],
        interviewTips: [
          'Share a real debugging story where DevTools or time-travel saved you significant time',
        ],
      },
      {
        id: 'redux-11',
        question:
          'Explain Redux Toolkit: createSlice, configureStore, createAsyncThunk, and createEntityAdapter.',
        answer:
          'Redux Toolkit (RTK) is the official, opinionated toolset for writing Redux logic. `configureStore` replaces the manual `createStore` + `applyMiddleware` setup: it automatically includes redux-thunk, connects Redux DevTools, and in development adds middleware that checks for accidental state mutations and non-serialisable values. You pass a `reducer` map and optionally customise middleware — a single function call that previously required 10–15 lines of boilerplate.\n\n`createSlice` is the heart of RTK. You provide a name, initial state, and a `reducers` object. RTK auto-generates action creators and action type strings from the reducer names (e.g. a reducer named `increment` in a slice named `counter` produces the action type `counter/increment`). Inside the reducers, Immer is active, so you can write "mutative" code that produces immutable updates. For responding to external actions (like those from `createAsyncThunk`), the `extraReducers` builder API provides `addCase`, `addMatcher`, and `addDefaultCase`.\n\n`createAsyncThunk` standardises the async action lifecycle. You provide a type prefix and a payload creator function that returns a promise. RTK dispatches `pending`, `fulfilled`, and `rejected` actions automatically, with proper typing for the payload and error. It also integrates with `AbortController` so thunks can be cancelled.\n\n`createEntityAdapter` manages normalised collections. You provide an entity type and it gives you CRUD reducers (`addOne`, `upsertMany`, `removeAll`) and selectors (`selectAll`, `selectById`, `selectIds`, `selectEntities`). Internally it stores entities as `{ ids: string[], entities: Record<string, T> }`, which is the recommended normalised shape. This eliminates hand-written normalisation logic and ensures O(1) lookups by ID.',
        shortAnswer:
          'RTK provides configureStore (store setup with good defaults), createSlice (reducer + actions), createAsyncThunk (async lifecycle), and createEntityAdapter (normalised CRUD state and selectors).',
        code: `import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';

interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

const articlesAdapter = createEntityAdapter<Article>();

export const fetchArticles = createAsyncThunk(
  'articles/fetchAll',
  async () => {
    const res = await fetch('/api/articles');
    return (await res.json()) as Article[];
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: articlesAdapter.getInitialState({
    loading: 'idle' as 'idle' | 'pending' | 'failed',
  }),
  reducers: {
    articleAdded: articlesAdapter.addOne,
    articleUpdated: articlesAdapter.updateOne,
    articleRemoved: articlesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        articlesAdapter.setAll(state, action.payload);
        state.loading = 'idle';
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.loading = 'failed';
      });
  },
});

export const { articleAdded, articleUpdated, articleRemoved } =
  articlesSlice.actions;

export const {
  selectAll: selectAllArticles,
  selectById: selectArticleById,
  selectIds: selectArticleIds,
} = articlesAdapter.getSelectors((state: any) => state.articles);

export default articlesSlice.reducer;`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Redux',
        topicId: 'redux-1',
        tags: [
          'redux toolkit',
          'createSlice',
          'configureStore',
          'createAsyncThunk',
          'createEntityAdapter',
        ],
        commonMistakes: [
          'Writing switch-case reducers manually when createSlice handles everything with less code and fewer errors',
          'Using createStore instead of configureStore — missing out on built-in dev checks and middleware',
          'Forgetting to pass a selectState function to getSelectors when the entity adapter manages a sub-slice',
        ],
        followUps: [
          'How does createEntityAdapter handle sorting?',
          'What is the difference between addCase and addMatcher in extraReducers?',
          'How would you migrate a legacy Redux codebase to RTK incrementally?',
        ],
        interviewTips: [
          'Show that you understand how RTK reduces boilerplate while preserving Redux fundamentals',
          'Mention that RTK is now the official recommended way to write Redux — it is not a third-party add-on',
        ],
      },
      {
        id: 'redux-12',
        question:
          'What is RTK Query, and how does it compare to manual data fetching with createAsyncThunk?',
        answer:
          'RTK Query is a powerful data-fetching and caching solution built directly into Redux Toolkit. You define an API slice using `createApi`, specifying a base URL and a set of endpoints (queries for reading data, mutations for writing). RTK Query auto-generates React hooks — `useGetPostsQuery`, `useLazyGetPostsQuery`, `useAddPostMutation` — that components call directly. Under the hood, RTK Query manages the full lifecycle: initiating the request, tracking loading/error/success states, caching the response, and re-fetching when cache tags are invalidated.\n\nCompared to manual `createAsyncThunk` workflows, RTK Query eliminates an enormous amount of repetitive code. With `createAsyncThunk` you must define the thunk, create loading/error/data state in your slice, write three `extraReducers` cases (pending/fulfilled/rejected), create selectors, and wire everything into components. For each additional endpoint you repeat this process. RTK Query replaces all of that with a declarative endpoint definition — typically 5–10 lines — and generates the hooks, reducers, selectors, and middleware automatically.\n\nRTK Query also provides features that are difficult to hand-roll: automatic cache invalidation via a tag system (when a mutation invalidates a tag, all queries subscribed to that tag automatically re-fetch), polling with configurable intervals, optimistic updates for immediate UI feedback, prefetching for anticipated navigation, request deduplication (identical concurrent requests share one network call), and automatic garbage collection of unused cache entries. For applications that are primarily CRUD-driven, RTK Query dramatically reduces code volume and eliminates entire categories of bugs related to stale data and inconsistent loading states.',
        shortAnswer:
          'RTK Query auto-generates hooks, caching, and invalidation for API endpoints. It replaces the manual createAsyncThunk + slice + selector pattern with declarative endpoint definitions.',
        code: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Post {
  id: string;
  title: string;
  body: string;
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;

// In store configuration:
// reducer: { [postsApi.reducerPath]: postsApi.reducer },
// middleware: (getDefault) => getDefault().concat(postsApi.middleware),`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['rtk query', 'createApi', 'caching', 'data fetching', 'mutations'],
        commonMistakes: [
          'Forgetting to add the API middleware to configureStore, causing queries to never resolve',
          'Not using tag invalidation — manually refetching queries instead of letting the cache system handle it',
          'Mixing RTK Query and manual createAsyncThunk for the same data, leading to duplicate state and synchronisation bugs',
        ],
        followUps: [
          'How do you implement optimistic updates with RTK Query?',
          'How does RTK Query handle pagination and infinite scroll?',
          'When would you still prefer createAsyncThunk over RTK Query?',
        ],
        interviewTips: [
          'Compare RTK Query to React Query / TanStack Query — they solve the same problem, but RTK Query integrates directly into the Redux store',
        ],
      },
      {
        id: 'redux-13',
        question:
          'You are building an e-commerce app where the cart, product catalog, user auth, and order history must share state across many routes. How would you design the Redux store?',
        answer:
          'Start by identifying the four bounded domains — auth, catalog, cart, and orders — and give each its own RTK slice in a feature-based folder structure. The auth slice holds the current user profile, token, and authentication status; the catalog slice manages a normalised product collection via `createEntityAdapter` with selectors for filtering and search; the cart slice stores line items keyed by product ID with quantities and computed totals; and the orders slice handles the order history as a paginated, normalised list.\n\nFor data fetching, use RTK Query with a single `createApi` definition split across multiple files using `injectEndpoints`. Define query endpoints for products, order history, and user profile, and mutation endpoints for adding to cart (if server-synced), placing orders, and updating profile. Use tag-based cache invalidation: when a `placeOrder` mutation succeeds, it invalidates the `Order` and `Cart` tags so the order list refetches and the cart clears automatically.\n\nCross-slice coordination is handled through shared action types. For example, when a `placeOrder` mutation fulfills, both the cart slice (to clear items) and the orders slice (to prepend the new order) listen for the same action via `extraReducers`. Selectors like `selectCartTotal` use `createSelector` to derive the total from cart items joined with product prices from the catalog slice — memoised so it only recalculates when either slice changes. For performance, the product catalog on routes that display hundreds of items uses virtualised lists, and the Redux state stores only IDs and entities (no UI state). Persistent state (auth token, cart for guest users) is handled with `redux-persist` on selected slices, while ephemeral UI state (modals, toasts) stays in local component state or Context.',
        shortAnswer:
          'Four feature slices (auth, catalog, cart, orders), RTK Query with tag invalidation for data fetching, createEntityAdapter for normalised products and orders, and cross-slice extraReducers for coordinated state transitions.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Redux',
        topicId: 'redux-1',
        tags: [
          'architecture',
          'store design',
          'e-commerce',
          'normalisation',
          'rtk query',
          'cross-slice',
        ],
        commonMistakes: [
          'Putting everything in one giant slice instead of splitting into cohesive feature domains',
          'Storing derived data (like cart totals) in the store instead of computing it with selectors',
          'Persisting the entire store to localStorage instead of selectively persisting only the necessary slices',
        ],
        followUps: [
          'How would you handle offline support and optimistic cart updates?',
          'How would you code-split reducer state for lazy-loaded routes?',
          'How would you handle real-time inventory updates via WebSockets alongside Redux?',
        ],
        interviewTips: [
          'Walk through the state shape visually — draw the tree with slice names, entity adapters, and key selectors',
          'Mention persistence, cache invalidation, and cross-slice coordination to demonstrate senior-level architectural thinking',
        ],
      },
      {
        id: 'redux-14',
        question:
          'What are common performance pitfalls in Redux applications, and how do you solve them?',
        answer:
          'The most frequent pitfall is unnecessary re-renders caused by selectors that return new references on every call. If a `useSelector` callback creates a new array or object — even with the same data — React sees a new reference and re-renders the component. The fix is `createSelector` from Reselect, which memoizes the result and returns the same reference when inputs have not changed. For selectors that accept parameters, use a factory function or increase the cache size to avoid thrashing.\n\nAnother common issue is dispatching many actions in rapid succession — for example, processing each item in a batch loop with a separate dispatch. Each dispatch triggers the entire subscriber notification cycle. The solution is to batch updates: either dispatch a single action with the full batch payload, use RTK\'s `createEntityAdapter.setAll` or `upsertMany` for bulk entity updates, or wrap multiple dispatches in `unstable_batchedUpdates` (though React 18 batches automatically inside event handlers). Reducing the number of dispatches is almost always the most impactful optimisation.\n\nA subtler pitfall is storing too much data in Redux. Not everything belongs in the store — form input values, animation state, hover state, and ephemeral UI state are better managed locally with `useState` or `useRef`. Putting high-frequency-changing data in Redux means the entire subscriber pipeline runs on every keystroke or frame. Additionally, deeply nested state without normalisation forces expensive spread operations in reducers and makes selectors complex. Normalising entities with `createEntityAdapter` keeps updates O(1) by ID lookup and simplifies selector logic. Finally, for large lists, combine memoized selectors with virtualised rendering (e.g. `react-window`) to ensure that even if the Redux state contains thousands of items, only the visible subset triggers component rendering.',
        shortAnswer:
          'Key pitfalls: selectors returning new references (fix with createSelector), excessive dispatches (batch into single actions), and storing ephemeral UI state in Redux. Normalise entities and virtualise large lists.',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'Redux',
        topicId: 'redux-1',
        tags: [
          'performance',
          'memoization',
          'batching',
          'normalisation',
          're-renders',
          'react-window',
        ],
        commonMistakes: [
          'Adding useSelector with inline arrow functions that compute derived data without memoization',
          'Using JSON.parse(JSON.stringify(state)) for deep cloning instead of Immer or normalised updates',
          'Treating Redux as a universal cache without eviction — unbounded state growth causes memory issues',
        ],
        followUps: [
          'How does React 18 concurrent rendering interact with Redux subscriptions?',
          'What tools would you use to profile Redux-related rendering performance?',
          'How does the useSyncExternalStore hook used by React-Redux v8+ affect these performance considerations?',
        ],
        interviewTips: [
          'Frame performance solutions in terms of measurable impact — "this reduced re-renders from 200 to 3 on a bulk import" is more convincing than generic advice',
        ],
      },
      {
        id: 'redux-15',
        question:
          'How do you test Redux logic — slices, thunks, selectors, and connected components?',
        answer:
          'Testing Redux logic follows a layered strategy. Slice reducers are the easiest to test because they are pure functions: import the reducer and action creators, call the reducer with a known state and action, and assert on the returned state. With `createSlice` you can test each case function in isolation: `expect(reducer(initialState, increment())).toEqual({ value: 1 })`. Since Immer is involved, always assert on the full returned state rather than checking for mutation. These tests are fast, require no mocks, and give you the highest confidence-to-effort ratio in a Redux codebase.\n\nThunks and async logic require slightly more setup. For `createAsyncThunk`, you can test the payload creator in isolation by mocking the API call and asserting on the returned value. For integration-level thunk tests, create a real store with `configureStore`, dispatch the thunk, and assert on the resulting state. Libraries like `msw` (Mock Service Worker) let you intercept network requests at the service-worker level, providing realistic async behaviour without coupling tests to fetch implementation details. For saga tests, the generator-based architecture enables step-by-step assertions: you iterate the generator and check each yielded effect without executing real side effects.\n\nSelector tests are straightforward: pass a mock state shape to the selector and assert on the output. For memoized selectors, also verify that calling the selector twice with the same state returns the same reference (validating memoization). Testing connected React components is done with React Testing Library and a real (or narrowly-configured) Redux store wrapped in `<Provider>`. RTK\'s `setupApiStore` utility helps create test stores pre-configured for RTK Query. The key principle is to test behaviour — what the user sees and interacts with — rather than implementation details like which actions were dispatched.',
        shortAnswer:
          'Reducers: pure function tests. Thunks: dispatch against a real store + MSW for mocking. Selectors: pass mock state and assert output. Components: React Testing Library with Provider-wrapped real store.',
        code: `// Testing a slice reducer
import reducer, { increment, incrementByAmount } from './counterSlice';

describe('counterSlice', () => {
  const initial = { value: 0, status: 'idle' };

  it('should handle increment', () => {
    expect(reducer(initial, increment())).toEqual({
      value: 1,
      status: 'idle',
    });
  });

  it('should handle incrementByAmount', () => {
    expect(reducer(initial, incrementByAmount(5))).toEqual({
      value: 5,
      status: 'idle',
    });
  });
});

// Testing a selector
import { selectFilteredPosts } from './postSelectors';

it('filters posts by status', () => {
  const state = {
    posts: {
      entities: [
        { id: '1', status: 'published', title: 'A' },
        { id: '2', status: 'draft', title: 'B' },
      ],
      filter: 'published',
    },
  };
  expect(selectFilteredPosts(state as any)).toEqual([
    { id: '1', status: 'published', title: 'A' },
  ]);
});

// Testing a component with Redux
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import { Counter } from './Counter';

function renderWithStore(preloadedState?: any) {
  const store = configureStore({
    reducer: { counter: counterReducer },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

it('displays the current count', () => {
  renderWithStore({ counter: { value: 42, status: 'idle' } });
  expect(screen.getByText('42')).toBeInTheDocument();
});`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Redux',
        topicId: 'redux-1',
        tags: ['testing', 'jest', 'react testing library', 'msw', 'unit tests', 'integration tests'],
        commonMistakes: [
          'Mocking the Redux store with a fake dispatch instead of using a real configureStore — this misses reducer bugs',
          'Testing that specific actions were dispatched rather than testing the resulting state or UI — this couples tests to implementation',
          'Forgetting to wrap components in Provider during testing, leading to cryptic "could not find store" errors',
        ],
        followUps: [
          'How would you test RTK Query endpoints and cache invalidation?',
          'What is the role of MSW in Redux testing vs. mocking fetch directly?',
          'How do you test middleware in isolation?',
        ],
        interviewTips: [
          'Emphasise the pure-function advantage of Redux reducers for testing — it is one of the strongest arguments for the architecture',
        ],
      },
    ],
  },
];
