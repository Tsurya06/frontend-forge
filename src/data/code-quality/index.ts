import type { Topic } from "../../types";

export const codeQualityTopics: Topic[] = [
  {
    id: "code-quality-principles",
    title: "Code Quality & Engineering Principles",
    description:
      "Clean code practices, SOLID principles, DRY/KISS/YAGNI, code reviews, refactoring strategies, naming conventions, separation of concerns, and component architecture for maintainable frontend applications.",
    category: "Code Quality",
    difficulty: "Intermediate",
    tags: [
      "clean-code",
      "SOLID",
      "DRY",
      "KISS",
      "YAGNI",
      "refactoring",
      "naming",
      "architecture",
    ],
    overview:
      'Code quality is about writing code that is readable, maintainable, testable, and extensible. While any code can "work," high-quality code reduces bugs, speeds up development, makes onboarding easier, and scales with team and project growth. Understanding principles like SOLID, DRY, KISS, and YAGNI provides a framework for making consistent design decisions that improve codebases over time.',
    concepts: [
      "Clean code is readable, predictable, and self-documenting",
      "SOLID principles guide object-oriented and component design",
      "DRY eliminates knowledge duplication, not just code duplication",
      "KISS favors simplicity over cleverness",
      "YAGNI prevents speculative complexity",
      "Separation of concerns divides code by responsibility",
      "Refactoring improves structure without changing behavior",
    ],
    codeExamples: [
      {
        title: "Single Responsibility in React Components",
        code: `// BAD: Component does too many things
function UserDashboard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { fetchUser(userId).then(setUser); }, [userId]);
  useEffect(() => { fetchPosts(userId).then(setPosts); }, [userId]);

  // 200+ lines of mixed concerns...
}

// GOOD: Separated by responsibility
function UserDashboard({ userId }: { userId: string }) {
  return (
    <div>
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
    </div>
  );
}

function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useUser(userId);
  return user ? <ProfileCard user={user} /> : <Skeleton />;
}`,
        language: "typescript",
        explanation:
          "Each component has one clear responsibility. Data fetching is extracted to custom hooks. Layout is separated from content.",
      },
    ],
    relatedTopicIds: [],
    questions: [
      {
        id: "quality-1",
        question:
          "What are the SOLID principles and how do they apply to frontend/React development?",
        answer: `SOLID is an acronym for five design principles that promote maintainable, scalable software architecture. Originally articulated for object-oriented programming by Robert C. Martin, these principles translate naturally to component-based frontend development. They guide decisions about how to structure components, modules, and their interactions to minimize coupling and maximize cohesion.

**Single Responsibility Principle (SRP):** A component or module should have one reason to change — one responsibility. In React, this means a component should do one thing well. A UserDashboard component that fetches data, handles form editing, manages notifications, and renders the layout violates SRP. Break it into UserProfile (display), UserEditForm (editing), NotificationBar (alerts), and a DashboardLayout (composition). Custom hooks also follow SRP: useUser handles user data fetching, useForm handles form state, useNotifications handles alerts. When a component has too many useStates or useEffects, it's often a sign of multiple responsibilities that should be separated.

**Open/Closed Principle (OCP):** Software entities should be open for extension but closed for modification. In React, this means designing components that can be extended with new behavior without changing their existing code. A Button component that uses a variant prop (primary, secondary, danger) follows OCP — adding a new variant extends behavior without modifying the Button's internals. The compound component pattern, render props, and component composition all enable OCP. A Form component that accepts arbitrary field components via children is open for extension (new field types) and closed for modification (the Form itself doesn't change).

**Liskov Substitution Principle (LSP):** Subtypes should be substitutable for their base types. In React, components that share an interface should be interchangeable. If you have an InputField component, a TextInput, NumberInput, and DateInput that extend it should all work correctly wherever InputField is expected. They should accept the same base props and behave consistently. Violating LSP in React often looks like a component that accepts a type prop and has completely different behavior for each type — it's really multiple components pretending to be one.

**Interface Segregation Principle (ISP):** Clients shouldn't depend on interfaces they don't use. In React, this means components should only receive the props they actually need. Instead of passing an entire user object to an AvatarComponent that only needs name and imageUrl, pass only those specific props. This reduces coupling (Avatar doesn't need to know the shape of User), improves reusability (Avatar works with any source of name/image data), and makes testing simpler (fewer props to mock).

**Dependency Inversion Principle (DIP):** High-level modules shouldn't depend on low-level modules; both should depend on abstractions. In React, this means components should depend on interfaces (props, hooks, context) rather than concrete implementations. A DataTable component should receive a fetchData function prop rather than directly calling axios.get. A form should use a submit handler prop rather than directly calling a specific API endpoint. This makes components reusable across different data sources and testable without mocking specific modules.`,
        shortAnswer:
          "SOLID applies to React: SRP = one responsibility per component/hook. OCP = extend via composition, not modification. LSP = interchangeable components sharing interfaces. ISP = pass only needed props, not entire objects. DIP = depend on abstractions (props, hooks) not concrete implementations (axios, specific APIs).",
        code: `// SRP: Each component has one responsibility
function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useUser(userId); // hook handles data fetching
  if (!user) return <Skeleton />;
  return <ProfileCard user={user} />;      // component handles rendering
}

// OCP: Extend via composition, not modification
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
}

function Button({ variant = 'primary', size = 'md', leftIcon, children, ...props }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`} {...props}>
      {leftIcon && <span className="btn-icon">{leftIcon}</span>}
      {children}
    </button>
  );
}

// ISP: Pass only what's needed
// BAD: Avatar receives entire User object
function BadAvatar({ user }: { user: User }) {
  return <img src={user.avatarUrl} alt={user.name} />;
}

// GOOD: Avatar receives only what it uses
function Avatar({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) {
  return <img src={src} alt={alt} width={size} height={size} />;
}

// DIP: Depend on abstractions, not concrete implementations
// BAD: Component directly calls API
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios.get('/api/users').then(r => setUsers(r.data)); // coupled to axios
  }, []);
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// GOOD: Component depends on abstraction (hook)
function UserList() {
  const { data: users } = useUsers(); // abstracted data source
  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "SOLID",
          "SRP",
          "OCP",
          "LSP",
          "ISP",
          "DIP",
          "React",
          "principles",
        ],
        commonMistakes: [
          "Over-applying SRP: splitting into too many tiny components that fragment readable logic",
          "Ignoring ISP: passing entire objects when only a few properties are needed",
          "Violating DIP by hardcoding API calls inside components instead of abstracting with hooks",
          "Treating SOLID as rigid rules instead of guidelines — pragmatism matters",
        ],
        followUps: [
          "Can you give an example of violating each SOLID principle in React?",
          "How does the composition pattern in React relate to OCP?",
          "When is it acceptable to violate a SOLID principle for pragmatic reasons?",
        ],
        interviewTips: [
          "Map each principle to a concrete React example — abstract definitions aren't enough",
          "Show that you apply these principles pragmatically, not dogmatically",
          "Mention that hooks naturally encourage SRP and DIP in React",
        ],
      },
      {
        id: "quality-2",
        question:
          "Explain DRY, KISS, and YAGNI principles. When do they conflict and how do you balance them?",
        answer: `DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid), and YAGNI (You Aren't Gonna Need It) are three foundational software engineering principles that guide day-to-day coding decisions. While each individually promotes better code, they can conflict with each other, and understanding when to prioritize one over another is a mark of engineering maturity.

DRY states that every piece of knowledge should have a single, authoritative representation in the system. It's commonly misunderstood as "don't repeat code" — but it's actually about knowledge duplication. Two functions with similar code might represent different domain concepts and should remain separate, while two functions with different code might express the same business rule and should be unified. In React, DRY manifests as extracting shared logic into custom hooks, creating reusable components, centralizing constants and configuration, and using shared type definitions. The danger of over-applying DRY is premature abstraction: creating a "generic" component that handles 10 different cases with complex props is often worse than having two simpler, slightly duplicated components.

KISS advocates for simplicity in design and implementation. The simplest solution that meets requirements is usually the best. In frontend development, KISS means preferring straightforward state management (useState) over complex solutions (Redux) when local state suffices, using CSS for animations instead of JavaScript when possible, choosing well-known patterns over clever abstractions, and writing code that a junior developer can understand. Clever, concise code that requires deep knowledge to understand is not simple — readability trumps cleverness.

YAGNI warns against implementing functionality before it's actually needed. Building for hypothetical future requirements adds complexity now while the future requirements may never materialize or may differ from what you anticipated. In React, YAGNI violations include adding a state management library before outgrowing useState/useContext, building an abstract form system when you have three simple forms, creating a plugin architecture for a feature only one team uses, or adding configuration options that no one has requested. Wait until the need is real and concrete before abstracting.

These principles conflict in practice. DRY can conflict with KISS when extracting a shared abstraction makes code harder to understand than two simpler duplicated implementations. KISS can conflict with DRY when the simplest approach involves some copy-paste. YAGNI can conflict with DRY when premature deduplication creates abstractions for future use cases that don't exist yet. The resolution is to use the "Rule of Three": tolerate some duplication until you see the pattern three times, then refactor. This naturally balances all three principles — you avoid premature abstraction (YAGNI), keep things simple (KISS), and eventually eliminate meaningful duplication (DRY) once the pattern is clear.`,
        shortAnswer:
          "DRY: single source of truth for each piece of knowledge. KISS: prefer simple solutions over clever ones. YAGNI: don't build what isn't needed yet. They conflict: DRY can create complex abstractions (violating KISS), KISS may allow duplication (violating DRY), YAGNI prevents premature DRY abstractions. Balance with the Rule of Three: tolerate duplication until the pattern appears three times.",
        code: `// DRY: Extract shared knowledge (not just code)
// BAD: duplicated validation logic
function validateEmail(email: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}
// Same regex appears in 3 files — knowledge duplication!

// GOOD: single source of truth
// validation.ts
export const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email);

// KISS: prefer simple solutions
// OVER-ENGINEERED:
function useComplexForm<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  options: FormOptions<T>
): FormReturn<T> {
  // 200 lines of generic form logic...
}

// SIMPLE (when you only have 2 forms):
function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!isValidEmail(email)) newErrors.email = 'Invalid email';
    if (password.length < 8) newErrors.password = 'Too short';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { email, setEmail, password, setPassword, errors, validate };
}

// YAGNI: don't build what isn't needed yet
// BAD: building for hypothetical future
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto' | 'custom'; // no one asked for 'custom'
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  animationSpeed: number; // not needed yet
  rtlSupport: boolean;    // not needed yet
}

// GOOD: build what's needed now
interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
}

// RULE OF THREE: balance DRY and KISS
// Occurrence 1: just write it inline
// Occurrence 2: notice the duplication, but leave it
// Occurrence 3: now the pattern is clear — extract!
function useUser(id: string) { /* third time = extract */ }`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "DRY",
          "KISS",
          "YAGNI",
          "principles",
          "abstraction",
          "simplicity",
        ],
        commonMistakes: [
          "Applying DRY to code similarity instead of knowledge duplication",
          "Building complex abstractions for two use cases (wait for three)",
          'Confusing "simple" with "easy" — KISS means simple design, not lazy implementation',
          "Using YAGNI to justify technical debt — YAGNI is about features, not quality",
        ],
        followUps: [
          "What is the Rule of Three and how does it guide refactoring?",
          "Give an example where DRY leads to worse code than duplication.",
          "How do you distinguish premature abstraction from necessary abstraction?",
        ],
        interviewTips: [
          "Show you understand the tension between these principles",
          "Use the Rule of Three as your balancing framework",
          "Give examples of when you chose simplicity (KISS) over deduplication (DRY)",
        ],
      },
      {
        id: "quality-3",
        question:
          'What makes code "clean"? Explain naming conventions, function design, and readability principles.',
        answer: `Clean code, as popularized by Robert C. Martin, is code that is easy to read, understand, and modify. The defining characteristic is that another developer can quickly comprehend what the code does, why it does it, and how to change it safely. Clean code doesn't require comments to explain itself — its structure, naming, and flow communicate intent directly. Writing clean code is a discipline that compound over time: a clean codebase is faster to work in, produces fewer bugs, and is easier to onboard new developers into.

Naming is the most impactful aspect of code readability. Variable and function names should reveal intent: \`isUserAuthenticated\` is clearer than \`auth\`, \`remainingAttempts\` is clearer than \`n\`. Use consistent conventions: boolean variables start with is/has/should/can (\`isLoading\`, \`hasPermission\`), event handlers start with handle/on (\`handleClick\`, \`onSubmit\`), functions that return data describe what they return (\`getUserById\`, \`formatCurrency\`). Avoid abbreviations unless universally understood (URL, API, ID are fine; \`usr\`, \`btn\`, \`mgr\` are not). Component names should describe what they render (\`UserProfileCard\`, \`PaymentForm\`), not how they work internally.

Function design follows several principles. Functions should be small and do one thing — if you need to add a comment section like "// Now handle the error case," that's a separate function. Parameters should be minimal: more than three parameters suggest the function is doing too much or should accept an options object. Functions should operate at a single level of abstraction: a high-level function orchestrates steps, while helper functions implement details. Avoid side effects where possible — a function named \`calculateTotal\` shouldn't also update the database. When side effects are necessary, make them obvious in the name (\`saveAndNotify\`).

Code structure should guide the reader's eye. Related code should be close together (cohesion). Functions should be ordered so that callers appear above callees (step-down rule). Early returns reduce nesting and clarify preconditions. Destructuring props and function parameters at the top makes it immediately clear what data a function uses. Consistent formatting (enforced by Prettier) eliminates visual noise. The goal is that reading the code feels like reading a well-organized document — you can scan it quickly, find what you need, and understand the relationships between parts without deep study.`,
        shortAnswer:
          "Clean code is readable, self-documenting, and easy to modify. Key practices: descriptive naming (isLoading, handleSubmit, getUserById), small single-purpose functions, minimal parameters, single level of abstraction, early returns to reduce nesting, consistent formatting (Prettier), and cohesive grouping of related code.",
        code: `// NAMING: reveal intent
// BAD
const d = new Date();
const u = users.filter(u => u.a);
function proc(d: unknown[]) { /* ... */ }

// GOOD
const registrationDate = new Date();
const activeUsers = users.filter(user => user.isActive);
function processPayments(pendingPayments: Payment[]) { /* ... */ }

// Boolean naming: is/has/should/can prefix
const isAuthenticated = !!token;
const hasPermission = user.role === 'admin';
const shouldShowBanner = !isDismissed && isNewUser;
const canEdit = hasPermission && !isLocked;

// FUNCTION DESIGN: small, single-purpose, minimal params
// BAD: does too many things
function handleUserAction(userId: string, action: string, data: Record<string, unknown>,
  notify: boolean, log: boolean, redirect: string) {
  // 100 lines handling 5 different actions...
}

// GOOD: single responsibility, clear parameters
function updateUserProfile(userId: string, updates: ProfileUpdates): Promise<User> {
  const validated = validateProfileUpdates(updates);
  const user = await userApi.update(userId, validated);
  return user;
}

// EARLY RETURNS: reduce nesting
// BAD: deeply nested
function getDiscount(user: User | null): number {
  if (user) {
    if (user.isPremium) {
      if (user.yearsActive > 5) {
        return 0.3;
      } else {
        return 0.2;
      }
    } else {
      return 0.1;
    }
  }
  return 0;
}

// GOOD: guard clauses with early returns
function getDiscount(user: User | null): number {
  if (!user) return 0;
  if (!user.isPremium) return 0.1;
  if (user.yearsActive > 5) return 0.3;
  return 0.2;
}

// COMPONENT STRUCTURE: clear, organized
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formattedPrice = formatCurrency(product.price);
  const isOutOfStock = product.inventory === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(product.id);
    }
  };

  return (
    <article className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">{formattedPrice}</p>
      <button onClick={handleAddToCart} disabled={isOutOfStock}>
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </article>
  );
}`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "clean-code",
          "naming",
          "readability",
          "functions",
          "early-returns",
        ],
        commonMistakes: [
          "Using abbreviations and single-letter variables outside of small, obvious scopes (loop indices)",
          "Writing clever one-liners that are hard to read — readability beats cleverness",
          "Leaving commented-out code in the codebase — use version control instead",
          "Adding unnecessary comments that repeat what the code says instead of explaining why",
        ],
        followUps: [
          "How do you balance descriptive naming with keeping names a reasonable length?",
          "What is the step-down rule for organizing functions?",
          "When are comments actually valuable vs. a code smell?",
        ],
        interviewTips: [
          "Show naming examples — interviewers notice how you name variables in live coding",
          "Demonstrate early returns as a refactoring technique for nested conditions",
          "Mention that clean code reduces the need for comments — the code documents itself",
        ],
      },
      {
        id: "quality-4",
        question:
          "What is separation of concerns and how do you implement it in React applications?",
        answer: `Separation of concerns (SoC) is a design principle that organizes code so each section addresses a distinct aspect of functionality. In frontend development, the primary concerns are: data management (what data exists and where it comes from), business logic (rules, calculations, validations), presentation (what the user sees), and interaction handling (what happens when the user acts). When these concerns are separated, each piece is easier to understand, test, reuse, and modify independently.

In React, the most effective SoC strategy is the custom hook pattern combined with component composition. Custom hooks extract data fetching, state management, and business logic out of components, leaving components focused purely on rendering UI and handling user interactions. A component like ProductList renders products and handles click events. A hook like useProducts manages fetching, filtering, pagination, and caching. The component doesn't know or care where the data comes from — it could be an API, local storage, or a mock during testing.

Component architecture should follow a layered approach. Container components (or page components) orchestrate the overall view, composing smaller components and connecting them to data via hooks. Presentational components receive data as props and render UI — they're pure functions of their props, making them highly reusable and easily testable. Layout components handle spatial arrangement without knowing about the content they contain. This separation allows you to change the data source without touching UI components, change the UI design without touching data logic, and test each layer independently.

File structure should reflect the separation. Group by feature (not by type): a features/products/ directory contains the ProductList component, useProducts hook, product API functions, product types, and product tests together. Within each feature, separate files for components (.tsx), hooks (use*.ts), API functions (api.ts), types (types.ts), and utilities (utils.ts). This organization makes it easy to find related code, understand feature boundaries, and maintain clear ownership. The alternative — grouping all hooks in one folder, all components in another — forces developers to jump between distant folders to understand a single feature.`,
        shortAnswer:
          "Separation of concerns divides code by responsibility: data management (hooks), business logic (utilities), presentation (components), interaction (handlers). In React: custom hooks for data/logic, presentational components for UI, container components for orchestration. Organize by feature, not by type, with clear boundaries between concerns.",
        code: `// SEPARATION OF CONCERNS in React

// 1. API Layer: data fetching abstraction
// features/products/api.ts
export async function fetchProducts(filters: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams(filters as Record<string, string>);
  const response = await fetch(\`/api/products?\${params}\`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

// 2. Custom Hook: state management + business logic
// features/products/useProducts.ts
function useProducts(filters: ProductFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });

  const sortedProducts = useMemo(
    () => data?.sort((a, b) => a.price - b.price) ?? [],
    [data]
  );

  const totalValue = useMemo(
    () => sortedProducts.reduce((sum, p) => sum + p.price, 0),
    [sortedProducts]
  );

  return { products: sortedProducts, totalValue, isLoading, error };
}

// 3. Presentational Component: pure rendering
// features/products/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article>
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{formatCurrency(product.price)}</p>
      <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
    </article>
  );
}

// 4. Container Component: composition + orchestration
// features/products/ProductsPage.tsx
function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ category: 'all' });
  const { products, totalValue, isLoading, error } = useProducts(filters);
  const { addToCart } = useCart();

  if (error) return <ErrorDisplay error={error} />;
  if (isLoading) return <ProductsSkeleton />;

  return (
    <div>
      <FilterBar filters={filters} onChange={setFilters} />
      <p>Total: {formatCurrency(totalValue)}</p>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

// File structure by feature:
// src/features/products/
//   ├── api.ts           (data fetching)
//   ├── useProducts.ts   (hook: state + logic)
//   ├── ProductCard.tsx   (presentational)
//   ├── ProductsPage.tsx  (container/orchestration)
//   ├── types.ts          (interfaces)
//   └── __tests__/        (tests for each layer)`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "separation-of-concerns",
          "hooks",
          "components",
          "architecture",
          "feature-folders",
        ],
        commonMistakes: [
          "Putting fetch calls directly in components instead of extracting to hooks/API layer",
          'Creating "god components" that handle data, logic, and rendering in 500+ lines',
          "Over-separating: creating a hook, component, and utility file for trivial 10-line features",
          "Organizing by type (all hooks together, all components together) instead of by feature",
        ],
        followUps: [
          "When does separation of concerns go too far?",
          "How do you decide what goes in a hook vs. a utility function?",
          "What is the feature-sliced design architecture?",
        ],
        interviewTips: [
          "Show the layered architecture: API → hook → component",
          "Demonstrate how this separation improves testability",
          "Mention feature-based organization as a scalable file structure",
        ],
      },
      {
        id: "quality-5",
        question:
          "How do you approach code reviews effectively? What do you look for and what feedback do you give?",
        answer: `Code reviews are one of the most valuable quality assurance practices in software development. An effective code review catches bugs before they reach production, ensures code meets team standards, shares knowledge across the team, and mentors junior developers. However, poorly conducted reviews can be demotivating, create bottlenecks, and miss important issues while nitpicking trivial ones. The key is having a structured approach that balances thoroughness with efficiency.

Start with understanding the "what" and "why" before examining the "how." Read the PR description, linked tickets, and any design documents to understand the intent. Then review the changes with that context in mind. This prevents misguided feedback — suggesting a different approach when the current one was chosen for reasons explained in the ticket. Look at the big picture first: does the overall architecture make sense? Is the change in the right place? Are the abstractions appropriate? Then drill into details: naming, edge cases, error handling, and test coverage.

The review checklist should prioritize by impact. Critical issues (always flag): bugs, security vulnerabilities, data loss risks, broken functionality, race conditions, missing error handling. Important issues: performance problems, missing tests for new behavior, incorrect abstractions, poor separation of concerns, accessibility violations. Minor issues: naming inconsistencies, code style (should be automated with ESLint/Prettier), missing TypeScript types, documentation gaps. Avoid blocking PRs on style preferences that aren't codified in team standards — these should be resolved in team discussions and enforced by tooling.

Effective feedback is specific, actionable, and kind. Instead of "this is wrong," explain what the issue is, why it matters, and suggest a solution: "This API call isn't wrapped in a try/catch — if the request fails, the error will be unhandled and crash the component. Consider wrapping in a try/catch and showing an error state." Use questions for non-obvious improvements: "Have you considered using useMemo here? The filter operation runs on every render." Distinguish between blocking issues (must fix), suggestions (nice to have), and nitpicks (optional). Praise good code — acknowledging thoughtful design, clean tests, or elegant solutions reinforces good practices.`,
        shortAnswer:
          "Effective reviews: understand context first (PR description, tickets), review architecture before details, prioritize by impact (bugs > performance > style). Give specific, actionable feedback with explanations. Distinguish blocking issues from suggestions. Automate style checks with tooling. Be kind — praise good code and frame feedback constructively.",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "code-review",
          "collaboration",
          "feedback",
          "best-practices",
          "team",
        ],
        commonMistakes: [
          "Focusing on style/formatting issues that should be handled by ESLint/Prettier",
          "Reviewing only the diff without understanding the broader context and requirements",
          "Blocking PRs on personal preferences not codified in team standards",
          "Not reviewing tests — tests are as important as the code they test",
        ],
        followUps: [
          "How do you handle disagreements during code review?",
          "What is the ideal turnaround time for code reviews?",
          "How do you review a PR that touches code you're not familiar with?",
        ],
        interviewTips: [
          "Show you have a structured approach: context → architecture → details",
          "Emphasize the human side: constructive feedback, praise, question format for suggestions",
          "Mention automating style checks to focus reviews on what matters",
        ],
      },
      {
        id: "quality-6",
        question:
          "What is refactoring and what are common refactoring techniques for React applications?",
        answer: `Refactoring is the process of restructuring existing code without changing its external behavior. The goal is to improve code quality — readability, maintainability, performance, or testability — while the application continues to function identically. Refactoring is not rewriting (building from scratch) or adding features (changing behavior). It's improving the internal structure to make the code easier to understand and extend.

The most common React refactoring is extracting custom hooks from components. When a component has complex state management, multiple useEffects, or data fetching logic interleaved with rendering, extract the stateful logic into a custom hook. The component becomes a pure function of the hook's return value and its props. This immediately improves testability (hooks can be tested independently with renderHook), reusability (the hook can be used in other components), and readability (the component focuses on what to render, the hook on how to get data).

Component decomposition breaks large components into smaller, focused ones. A 300-line component with multiple sections should be split into smaller components, each handling one section. The parent component becomes an orchestrator that composes children, passing data via props. This reduces cognitive load (each component fits in your head), improves performance (smaller components can be memoized individually), and enables parallel development (team members can work on different components simultaneously).

Other essential refactoring techniques include: replacing magic numbers and strings with named constants, converting conditional rendering chains (if/else/if) to lookup objects or component maps, replacing prop drilling with Context (when appropriate), extracting shared validation/formatting logic into utility functions, converting class components to function components with hooks, replacing complex useEffect chains with React Query or proper state machines, and simplifying deeply nested conditions with early returns and guard clauses. The key to successful refactoring is having tests in place before you start — tests verify that behavior is preserved through the restructuring. Refactor in small, incremental steps, running tests after each step.`,
        shortAnswer:
          "Refactoring improves code structure without changing behavior. Common React refactoring: extract custom hooks from components, decompose large components into smaller focused ones, replace prop drilling with Context, convert class components to hooks, replace magic values with constants, and simplify conditional logic with early returns.",
        code: `// BEFORE: monolithic component
function UserDashboard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchUser(userId), fetchPosts(userId)])
      .then(([userData, postsData]) => {
        setUser(userData);
        setPosts(postsData);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [userId]);

  const filteredPosts = posts.filter(p =>
    filter === 'all' ? true : p.status === filter
  );

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  // 100 more lines of rendering...
}

// AFTER: refactored with separation of concerns

// Step 1: Extract hooks
function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

function useUserPosts(userId: string, filter: string) {
  const { data: posts, ...rest } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchPosts(userId),
  });

  const filteredPosts = useMemo(
    () => posts?.filter(p => filter === 'all' || p.status === filter) ?? [],
    [posts, filter]
  );

  return { posts: filteredPosts, ...rest };
}

// Step 2: Decompose into focused components
function UserDashboard({ userId }: { userId: string }) {
  const [filter, setFilter] = useState('all');

  return (
    <div className="dashboard">
      <UserHeader userId={userId} />
      <PostFilter value={filter} onChange={setFilter} />
      <PostList userId={userId} filter={filter} />
    </div>
  );
}

function UserHeader({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);
  if (isLoading) return <Skeleton variant="header" />;
  return <h1>Welcome, {user?.name}</h1>;
}

function PostList({ userId, filter }: { userId: string; filter: string }) {
  const { posts, isLoading, error } = useUserPosts(userId, filter);

  if (isLoading) return <Skeleton variant="list" count={5} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
}

// Step 3: Replace magic values with constants
const POST_FILTERS = {
  ALL: 'all',
  PUBLISHED: 'published',
  DRAFT: 'draft',
} as const;`,
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "refactoring",
          "hooks",
          "component-decomposition",
          "clean-code",
          "React",
        ],
        commonMistakes: [
          "Refactoring without tests in place — no way to verify behavior is preserved",
          "Making large refactoring changes in a single commit instead of small incremental steps",
          "Refactoring and adding features in the same PR — keep them separate",
          "Over-refactoring: extracting every 10-line piece into its own file/hook",
        ],
        followUps: [
          "How do you convince a team to allocate time for refactoring?",
          "What is the strangler fig pattern for gradually refactoring legacy code?",
          "How do you identify code that needs refactoring?",
        ],
        interviewTips: [
          "Show a before/after example — interviewers love seeing the improvement",
          "Emphasize tests as a prerequisite for safe refactoring",
          "Mention the incremental approach: small steps, verify after each",
        ],
      },
      {
        id: "quality-7",
        question:
          "How do you design a good component architecture for a React application?",
        answer: `Component architecture is the structural design of how components are organized, composed, and communicate within a React application. A well-designed component architecture makes the application easy to develop, test, maintain, and scale. It establishes clear boundaries, reduces coupling, and creates a consistent mental model for the entire team.

The foundation is a layered component hierarchy. Page components sit at the top, corresponding to routes. They orchestrate the page layout and connect feature components to data via hooks. Feature components implement specific functionality (ProductList, CheckoutForm, UserProfile) and manage their own state and data needs. Shared UI components are generic, reusable building blocks (Button, Modal, Card, Input) that know nothing about the business domain. This layering ensures that changes to business logic don't affect UI components and vice versa. UI components are typically in a shared component library, while feature components live in their feature directories.

Component composition is preferred over configuration. Instead of a single Table component with 20 props controlling every aspect (sortable, filterable, paginated, selectable, expandable), compose smaller components: \`<Table><TableHeader sortable /><TableBody><TableRow expandable /></TableBody><Pagination /></Table>\`. The compound component pattern lets components communicate through shared context while maintaining a flexible, declarative API. This follows the OCP — adding a new table feature (column reordering) doesn't require modifying the Table component, just adding a new composable piece.

State management architecture should follow the principle of locality. State should live as close to where it's used as possible. Local component state (useState) for UI concerns like open/closed, form values, and selected items. Shared state (Context or Zustand) for data needed by multiple components. Server state (React Query) for data from APIs. URL state (router) for state that should survive page refreshes and be shareable via links. Global state (Redux, Zustand) only for truly application-wide concerns. Moving state up the tree should be a deliberate decision, not a default — every time state is lifted, the blast radius of re-renders increases.

Communication patterns between components should be explicit. Parent to child: props. Child to parent: callback props. Siblings: lift state to the common parent, or use context. Distant components: context or state management library. Avoid using refs or imperative handles for communication between components — they break React's declarative model and make data flow hard to trace. When you find yourself needing complex communication patterns, it often indicates that the component boundaries are drawn incorrectly and should be restructured.`,
        shortAnswer:
          "Good component architecture uses layered hierarchy (pages → features → shared UI), composition over configuration (compound components), and locality-based state management (local → shared → server → global). Components communicate via props (down), callbacks (up), and context (across). Keep state close to usage and prefer declarative patterns.",
        code: `// LAYERED COMPONENT ARCHITECTURE

// Layer 1: Shared UI Components (generic, domain-agnostic)
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

function Button({ variant = 'primary', size = 'md', isLoading, children, ...props }: ButtonProps) {
  return (
    <button className={\`btn-\${variant} btn-\${size}\`} disabled={isLoading} {...props}>
      {isLoading ? <Spinner size={size} /> : children}
    </button>
  );
}

// Layer 2: Feature Components (domain-specific)
// features/checkout/CartSummary.tsx
function CartSummary() {
  const { items, total, removeItem } = useCart();

  return (
    <Card>
      <h2>Cart Summary</h2>
      {items.map(item => (
        <CartItem key={item.id} item={item} onRemove={removeItem} />
      ))}
      <Divider />
      <Flex justify="between">
        <Text weight="bold">Total</Text>
        <Text weight="bold">{formatCurrency(total)}</Text>
      </Flex>
    </Card>
  );
}

// Layer 3: Page Components (route-level orchestration)
// pages/CheckoutPage.tsx
function CheckoutPage() {
  return (
    <PageLayout title="Checkout">
      <Grid columns={2} gap="lg">
        <div>
          <ShippingForm />
          <PaymentForm />
        </div>
        <aside>
          <CartSummary />
          <OrderButton />
        </aside>
      </Grid>
    </PageLayout>
  );
}

// COMPOUND COMPONENT PATTERN (composition over configuration)
// Instead of: <Tabs items={[...]} onSelect={...} renderItem={...} />
// Use composable parts:
function App() {
  return (
    <Tabs defaultTab="details">
      <TabList>
        <Tab id="details">Details</Tab>
        <Tab id="reviews">Reviews</Tab>
        <Tab id="specs">Specifications</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="details"><ProductDetails /></TabPanel>
        <TabPanel id="reviews"><ReviewList /></TabPanel>
        <TabPanel id="specs"><SpecsTable /></TabPanel>
      </TabPanels>
    </Tabs>
  );
}

// STATE LOCALITY
// Local: UI state (this component only)
const [isOpen, setIsOpen] = useState(false);

// Feature: shared within feature (Context or Zustand store)
const { items, addItem } = useCart();

// Server: API data (React Query)
const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

// URL: shareable, persistent state (router)
const [searchParams, setSearchParams] = useSearchParams();`,
        language: "typescript",
        difficulty: "Advanced",
        type: "Scenario",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "architecture",
          "components",
          "composition",
          "state-management",
          "design",
        ],
        commonMistakes: [
          "Building monolithic page components that handle data, logic, and UI in one file",
          "Using global state for everything instead of keeping state local where possible",
          "Creating deeply nested prop drilling instead of using composition or context",
          "Not establishing a consistent component hierarchy, leading to inconsistent patterns across the codebase",
        ],
        followUps: [
          "How do you handle cross-cutting concerns in component architecture?",
          "What is the compound component pattern and when do you use it?",
          "How do you scale component architecture for a team of 10+ developers?",
        ],
        interviewTips: [
          "Describe the three layers: UI → Feature → Page",
          "Emphasize composition over configuration with examples",
          "Discuss state locality as a performance and complexity management strategy",
        ],
      },
      {
        id: "quality-8",
        question:
          "What is maintainability in software and how do you measure and improve it in a frontend codebase?",
        answer: `Maintainability is the ease with which a software system can be modified to fix bugs, add features, improve performance, or adapt to changing requirements. A maintainable codebase reduces the cost and risk of change over time. In frontend development, where requirements evolve rapidly and teams change frequently, maintainability directly impacts development velocity, bug rates, and developer satisfaction.

Maintainability has several measurable dimensions. Readability is how quickly a new developer can understand what code does. Changeability is how easy it is to modify code without introducing bugs. Testability is how easy it is to write and run tests. Debuggability is how quickly you can identify and fix problems. Onboardability is how fast a new team member becomes productive. While these can't be measured with a single metric, proxies include: time to implement similar-sized features (should be consistent, not growing), bug rates after changes (should be low), code review turnaround time (readable code reviews faster), and new developer ramp-up time.

Improving maintainability requires both technical and process practices. Technical practices include: consistent code style (enforced by ESLint and Prettier), clear naming conventions, small focused components and functions, comprehensive test coverage with meaningful tests, TypeScript for type safety and self-documentation, separation of concerns (hooks for logic, components for rendering), well-defined module boundaries, and minimal dependency coupling. Process practices include: regular refactoring time allocated in sprints, code review standards, documentation for architecture decisions (ADRs), component libraries with Storybook, and dependency update automation.

The biggest enemies of maintainability are: technical debt that accumulates without cleanup, inconsistent patterns across the codebase, implicit conventions that exist only in tribal knowledge, lack of tests that make changes risky, and over-engineering that makes simple things complex. A practical maintenance strategy includes: establish and enforce conventions early (ESLint rules, project structure), keep dependencies updated (Dependabot/Renovate), refactor continuously in small increments (not big-bang rewrites), maintain test coverage for critical paths, and document architectural decisions and non-obvious design choices. The goal is that the codebase is as easy to work with in year three as it was in month one.`,
        shortAnswer:
          "Maintainability is the ease of modifying code safely. Measure via feature implementation time, bug rates, review speed, and onboarding time. Improve with consistent code style (ESLint/Prettier), TypeScript, small focused components, separation of concerns, test coverage, regular refactoring, and documented conventions. Biggest enemies: accumulated tech debt, inconsistent patterns, and lack of tests.",
        difficulty: "Advanced",
        type: "Scenario",
        category: "Code Quality",
        topicId: "code-quality-principles",
        tags: [
          "maintainability",
          "technical-debt",
          "code-quality",
          "best-practices",
          "long-term",
        ],
        commonMistakes: [
          "Treating maintainability as a one-time effort instead of a continuous practice",
          "Not allocating sprint time for refactoring and tech debt reduction",
          "Establishing conventions verbally without codifying them in tooling (ESLint rules, templates)",
          'Ignoring test coverage because "we\'ll add tests later" — later never comes',
        ],
        followUps: [
          "How do you balance feature delivery with maintainability investments?",
          "What are Architecture Decision Records (ADRs)?",
          "How do you quantify technical debt to justify cleanup work?",
        ],
        interviewTips: [
          "Show that you think about long-term code health, not just shipping features",
          "Mention specific practices: TypeScript, ESLint, test coverage, regular refactoring",
          "Discuss the cost of NOT maintaining code quality — it compounds exponentially",
        ],
      },
    ],
  },
];
