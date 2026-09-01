import type { Topic } from "../../types";

export const packageManagementTopics: Topic[] = [
  {
    id: "package-management-fundamentals",
    title: "Package Management & Dependencies",
    description:
      "Understanding npm, Yarn, package.json configuration, lock files, semantic versioning, and dependency management strategies for JavaScript projects.",
    category: "Package Management",
    difficulty: "Intermediate",
    tags: [
      "npm",
      "yarn",
      "package.json",
      "semver",
      "dependencies",
      "lock-files",
    ],
    overview:
      "Package managers are essential tools for managing third-party dependencies in JavaScript projects. Understanding npm and Yarn, package.json configuration, lock files, semantic versioning, and the different types of dependencies helps developers manage projects effectively, avoid version conflicts, and maintain secure, reproducible builds.",
    concepts: [
      "npm and Yarn are package managers that install, update, and manage dependencies",
      "package.json defines project metadata, dependencies, and scripts",
      "Lock files ensure deterministic, reproducible installations",
      "Semantic versioning communicates the nature of changes between versions",
      "dependencies, devDependencies, and peerDependencies serve different purposes",
      "Version ranges (^, ~, exact) control how dependencies are updated",
    ],
    codeExamples: [
      {
        title: "package.json Structure",
        code: `{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.25.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "eslint": "^9.6.0"
  }
}`,
        language: "json",
        explanation:
          "dependencies are needed at runtime; devDependencies are only needed during development/build. The ^ prefix allows minor version updates.",
      },
    ],
    relatedTopicIds: [],
    questions: [
      {
        id: "pkg-1",
        question:
          "What is semantic versioning (semver) and how do version ranges work in package.json?",
        answer: `Semantic versioning (semver) is a versioning convention that communicates the nature and impact of changes between software versions using a three-part version number: MAJOR.MINOR.PATCH. Following semver enables developers and automated tools to understand what kind of changes a new version introduces and whether it's safe to upgrade. It's the foundation of dependency management in the npm ecosystem.

The three version components each have specific meaning. MAJOR version changes (1.0.0 → 2.0.0) indicate breaking changes — the API has changed in incompatible ways, and consumers will likely need to modify their code. MINOR version changes (1.0.0 → 1.1.0) indicate new features added in a backwards-compatible manner — existing code continues to work, and new functionality is available. PATCH version changes (1.0.0 → 1.0.1) indicate backwards-compatible bug fixes — no new features, just corrections to existing behavior. Pre-release versions (1.0.0-beta.1) and build metadata (1.0.0+build.123) provide additional context.

Version ranges in package.json control how npm/Yarn resolve dependency versions. The caret (^) prefix is the default and most common — \`^1.2.3\` allows updates that don't modify the left-most non-zero digit: >=1.2.3, <2.0.0. This permits minor and patch updates (new features and bug fixes) while blocking major version changes. The tilde (~) prefix is more conservative — \`~1.2.3\` allows only patch updates: >=1.2.3, <1.3.0. Exact versions (1.2.3 without prefix) lock to that specific version. Other ranges include \`>=1.0.0\`, \`1.x\`, \`*\`, and compound ranges like \`>=1.2.0 <1.5.0\`.

Understanding version ranges is crucial for maintaining stable applications. Using ^ (the default) is generally recommended because it receives bug fixes and new features automatically while protecting against breaking changes. However, not all packages follow semver strictly — some introduce breaking changes in minor versions, and some bugs are introduced in patch versions. This is why lock files exist: they record the exact versions that were installed, ensuring every developer and CI environment uses identical versions regardless of what version range the package.json specifies. The package.json defines the acceptable range; the lock file records the specific resolution within that range.`,
        shortAnswer:
          "Semver uses MAJOR.MINOR.PATCH: major = breaking changes, minor = new features (backwards-compatible), patch = bug fixes. Version ranges in package.json: ^ (caret) allows minor+patch updates, ~ (tilde) allows only patch updates, exact version locks to a specific version. Lock files record the exact resolved versions for reproducibility.",
        code: `// Semantic Versioning: MAJOR.MINOR.PATCH
// 2.3.1
// │ │ └─ PATCH: bug fixes (backwards-compatible)
// │ └── MINOR: new features (backwards-compatible)
// └─── MAJOR: breaking changes (incompatible API changes)

// Version ranges in package.json
{
  "dependencies": {
    // Caret (^): allows minor + patch updates (default)
    "react": "^18.2.0",       // >=18.2.0 <19.0.0
    "lodash": "^4.17.21",     // >=4.17.21 <5.0.0

    // Tilde (~): allows only patch updates
    "axios": "~1.6.0",        // >=1.6.0 <1.7.0

    // Exact: locked to specific version
    "left-pad": "1.3.0",      // exactly 1.3.0

    // Greater than / range
    "node-fetch": ">=3.0.0",  // any version 3.0.0+
    "express": ">=4.18.0 <5.0.0",  // 4.18+ but not 5.x

    // Wildcard
    "debug": "4.x",           // any 4.x.x version
    "chalk": "*"              // any version (avoid this!)
  }
}

// How caret works with 0.x versions (special case!)
// "^0.2.3" → >=0.2.3 <0.3.0 (only patch updates)
// "^0.0.3" → exactly 0.0.3
// (0.x versions are considered unstable, so ^ is more restrictive)

// Lock file ensures reproducibility
// package-lock.json / yarn.lock records:
// {
//   "react": {
//     "version": "18.3.1",       ← exact installed version
//     "resolved": "https://...",  ← download URL
//     "integrity": "sha512-..."   ← checksum for verification
//   }
// }

// npm commands for version management
// npm outdated          — show outdated packages
// npm update            — update within semver ranges
// npm install react@19  — install specific major version
// npm audit             — check for vulnerabilities`,
        language: "json",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "Package Management",
        topicId: "package-management-fundamentals",
        tags: ["semver", "versioning", "npm", "version-ranges", "package.json"],
        commonMistakes: [
          "Assuming ^ works the same for 0.x versions — it's more restrictive for pre-1.0 packages",
          'Using * or "latest" in production dependencies — unpredictable and potentially breaking',
          "Not understanding that semver is a convention, not enforced — packages can break in minor versions",
          "Confusing the package.json range with the actual installed version (lock file is the truth)",
        ],
        followUps: [
          "Why does ^ behave differently for 0.x versions?",
          "How do you safely upgrade a major version of a dependency?",
          "What is the npm equivalent of yarn resolutions for forcing specific versions?",
        ],
        interviewTips: [
          "Explain the three numbers clearly: major (breaking), minor (features), patch (fixes)",
          "Know the difference between ^ and ~ — it's a common interview question",
          "Mention that lock files are the real source of truth for installed versions",
        ],
      },
      {
        id: "pkg-2",
        question:
          "What is the difference between package-lock.json and yarn.lock? Why are lock files important?",
        answer: `Lock files are automatically generated files that record the exact dependency tree resolved during installation — every package, its exact version, its download URL, and its integrity hash. While package.json specifies acceptable version ranges, lock files record the specific versions that were actually installed. This distinction is critical for reproducible builds: without lock files, two installations of the same project could resolve to different dependency versions.

package-lock.json is npm's lock file, generated by npm install. It records every package in the entire dependency tree (including transitive dependencies), their exact versions, resolved download URLs, and integrity checksums (SHA-512 hashes). yarn.lock is Yarn's equivalent, with a slightly different format but the same purpose. Both files should be committed to version control because they ensure that every developer, CI server, and deployment environment uses identical dependency versions. \`npm ci\` (and \`yarn install --frozen-lockfile\`) use the lock file as the authoritative source, failing if it's out of sync with package.json rather than resolving new versions.

Without lock files, dependency resolution is non-deterministic. If package.json specifies \`"lodash": "^4.17.0"\` and you install today, you might get 4.17.21. A colleague installing next week might get 4.17.22 if a new patch is released. Usually this is fine, but occasionally a patch introduces a bug or subtle behavior change. Lock files eliminate this risk by ensuring everyone gets exactly the same versions. This is especially important for CI/CD: production builds should be byte-for-byte identical regardless of when they run.

The key operational difference between npm and Yarn lock files is that npm uses a nested node_modules structure (though it hoists where possible), while Yarn uses a flat structure with more aggressive hoisting. Yarn also supports Plug'n'Play (PnP), which eliminates node_modules entirely, storing packages in a global cache and using a .pnp.cjs file to resolve imports. pnpm uses a content-addressable store with symlinks, achieving the best of both worlds: no duplication, strict isolation, and fast installations. Regardless of which package manager you use, the principle is the same: commit the lock file, use \`ci\`/\`--frozen-lockfile\` for production installs.`,
        shortAnswer:
          "Lock files (package-lock.json for npm, yarn.lock for Yarn) record exact dependency versions for reproducible installs. package.json defines acceptable ranges; lock files record specific resolutions. Always commit lock files. Use npm ci / yarn --frozen-lockfile for deterministic production installs that fail if the lock file is outdated.",
        code: `# package-lock.json structure (simplified)
{
  "name": "my-app",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/react": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
      "integrity": "sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2Q==",
      "dependencies": {
        "loose-envify": "^1.1.0"
      }
    }
  }
}

# yarn.lock structure
react@^18.3.0:
  version "18.3.1"
  resolved "https://registry.yarnpkg.com/react/-/react-18.3.1.tgz#..."
  integrity sha512-wS+hAgJShR0KhEvPJArfuPVN1+...
  dependencies:
    loose-envify "^1.1.0"

# CORRECT: Use ci/frozen-lockfile for production
npm ci                        # Clean install from lock file (fails if outdated)
yarn install --frozen-lockfile # Same for Yarn

# WRONG: Don't use 'npm install' in CI
npm install  # May update lock file if ranges allow newer versions

# Common workflow
npm install lodash            # Adds to package.json + updates lock file
npm ci                        # In CI: install exactly what lock file says
npm audit                     # Check lock file for known vulnerabilities

# Verify lock file is in sync
npm ls                        # Show dependency tree
npm ls --all                  # Show full tree including transitive deps

# ALWAYS commit lock files!
git add package-lock.json     # or yarn.lock
git commit -m "chore: update dependencies"`,
        language: "bash",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Package Management",
        topicId: "package-management-fundamentals",
        tags: [
          "lock-files",
          "package-lock.json",
          "yarn.lock",
          "npm-ci",
          "reproducibility",
        ],
        commonMistakes: [
          "Not committing lock files to version control — breaks reproducibility",
          "Using npm install instead of npm ci in CI/CD — can resolve newer versions",
          "Manually editing lock files — they should only be generated by the package manager",
          "Having both package-lock.json and yarn.lock in the same project — choose one package manager",
        ],
        followUps: [
          "What is the difference between npm install and npm ci?",
          "How does pnpm's lock file (pnpm-lock.yaml) differ from npm and Yarn?",
          "What is Yarn PnP and how does it eliminate node_modules?",
        ],
        interviewTips: [
          "Emphasize reproducibility as the primary purpose of lock files",
          "Know the distinction: package.json = ranges, lock file = exact versions",
          "Mention npm ci vs. npm install as a CI best practice",
        ],
      },
      {
        id: "pkg-3",
        question:
          "What is the difference between dependencies, devDependencies, and peerDependencies?",
        answer: `Package.json defines three types of dependency relationships, each serving a different purpose in the project lifecycle. Understanding the distinction ensures correct package categorization, optimal bundle sizes, and proper dependency resolution for library consumers. Miscategorizing dependencies is one of the most common package management mistakes.

dependencies are packages required for the application to run in production. When your application is deployed and executed, these packages must be present. For a React application, this includes React itself, routing libraries, state management, UI component libraries, and any runtime utility. When someone installs your package (if it's a library), npm automatically installs its dependencies. Everything that's imported in your source code and ends up in the production bundle should be a dependency.

devDependencies are packages needed only during development and build time — they're not required at runtime in production. This includes TypeScript (the compiler runs at build time, not runtime), build tools (Webpack, Vite), testing frameworks (Jest, Vitest), linters (ESLint), formatters (Prettier), type definitions (@types/*), and development servers. When someone installs your package as a dependency of their project (\`npm install your-package\`), devDependencies are NOT installed. For end-user applications (not libraries), the distinction still matters for clarity and for CI optimizations — \`npm ci --production\` skips devDependencies, producing a leaner deployment.

peerDependencies declare packages that your library expects the consuming project to provide. They're most common in plugin ecosystems and framework-specific libraries. For example, a React component library declares react as a peerDependency because it expects the host application to provide React — the library shouldn't bundle its own copy. If the library bundled React separately, you'd have two copies of React at runtime, causing hooks errors and increased bundle size. peerDependencies ensure a single shared instance. npm 7+ auto-installs peer dependencies by default (previous versions only warned). peerDependenciesMeta allows marking peer dependencies as optional for scenarios where your library works with or without a specific package.`,
        shortAnswer:
          "dependencies: required at runtime in production (React, lodash). devDependencies: needed only during development/build (TypeScript, ESLint, Vite, Jest). peerDependencies: expected to be provided by the consuming project (used by libraries to share instances, e.g., a React component library peers on react). Correct categorization prevents bundle bloat and version conflicts.",
        code: `{
  "name": "my-component-library",
  "version": "1.0.0",

  "dependencies": {
    // Runtime requirements — bundled with your library
    "clsx": "^2.1.0",              // utility used at runtime
    "date-fns": "^3.6.0"           // date formatting at runtime
  },

  "devDependencies": {
    // Development/build only — NOT shipped to consumers
    "typescript": "^5.5.0",         // compiles at build time
    "vite": "^5.3.0",              // build tool
    "vitest": "^1.6.0",            // test framework
    "eslint": "^9.6.0",            // linter
    "@types/react": "^18.3.3",     // type definitions (compile-time)
    "prettier": "^3.3.0"           // formatter
  },

  "peerDependencies": {
    // Must be provided by the consuming project
    "react": "^18.0.0 || ^19.0.0",    // consumer provides React
    "react-dom": "^18.0.0 || ^19.0.0" // consumer provides ReactDOM
  },

  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true  // library works without react-dom (e.g., React Native)
    }
  }
}

// Decision guide:
// Q: Is it imported in source code that runs in production?
//    YES → dependencies
//    NO → devDependencies
//
// Q: Should the consuming project provide this package?
//    YES → peerDependencies (libraries sharing framework instances)
//
// Examples:
// react, axios, lodash-es         → dependencies
// typescript, jest, eslint, vite  → devDependencies
// react (in a React library)      → peerDependencies

// Installing in different categories
npm install react                    # → dependencies
npm install -D typescript            # → devDependencies (--save-dev)
npm install --save-peer react        # → peerDependencies

// Production install (skip devDependencies)
npm ci --production                  # installs only dependencies
NODE_ENV=production npm ci           # same effect`,
        language: "json",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Package Management",
        topicId: "package-management-fundamentals",
        tags: [
          "dependencies",
          "devDependencies",
          "peerDependencies",
          "npm",
          "package.json",
        ],
        commonMistakes: [
          "Putting build tools (Webpack, TypeScript) in dependencies instead of devDependencies",
          "Putting runtime libraries in devDependencies, causing them to be missing in production",
          "Bundling React in a component library instead of using peerDependencies",
          "Not specifying wide enough ranges for peerDependencies, forcing consumers to exact versions",
        ],
        followUps: [
          "What happens when peer dependency versions conflict?",
          "What are optionalDependencies?",
          "How does npm 7+ handle peer dependency installation differently from npm 6?",
        ],
        interviewTips: [
          'Use the simple rule: "Does it run in production?" → dependency, "Only for dev?" → devDependency',
          "Explain peerDependencies with the React library example — it's the most relatable",
          "Mention that miscategorization can cause production bugs or bloated bundles",
        ],
      },
      {
        id: "pkg-4",
        question:
          "Compare npm and Yarn. What are their differences and what about pnpm?",
        answer: `npm, Yarn, and pnpm are the three major JavaScript package managers. While they all solve the same fundamental problem — installing, managing, and resolving dependencies — they differ in performance, features, dependency resolution strategies, and disk space efficiency. Understanding these differences helps you choose the right tool for your project and team.

npm (Node Package Manager) is the default package manager bundled with Node.js. It has evolved significantly since its early days, adding features like package-lock.json (v5), npm ci (v5.7), workspaces (v7), and auto-installing peer dependencies (v7). npm uses a node_modules directory with a flattened dependency tree, hoisting shared dependencies to the top level. Its advantages are ubiquity (installed with Node.js), the largest package registry, and no additional installation needed. Its weaknesses historically included slow installation speed and non-deterministic resolution, though npm 7+ has largely addressed these. npm ci is the reliable command for CI environments, performing clean, reproducible installs from the lock file.

Yarn was created by Facebook in 2016 to address npm's reliability and speed issues at the time. Yarn Classic (v1) introduced deterministic installations, parallel downloads, and offline caching years before npm caught up. Yarn Berry (v2+) introduced Plug'n'Play (PnP), which eliminates the node_modules directory entirely. Instead, packages are stored in a global cache and a .pnp.cjs file maps import specifiers to their cache locations. PnP provides faster installations, strict dependency isolation (no phantom dependencies), and zero-install capability (commit the cache to git for instant CI installs). Yarn workspaces provide mature monorepo support. The trade-off is complexity: PnP requires tooling compatibility and some packages need patching.

pnpm is the newest major player, using a content-addressable store and hard links. All packages are stored in a single global store (~/.pnpm-store), and node_modules directories use hard links to these stored packages. This means a package version is stored on disk only once, regardless of how many projects use it — saving significant disk space. pnpm creates a strict node_modules structure using symlinks that prevents phantom dependencies (accessing packages you didn't explicitly declare). It's significantly faster than npm for installations and uses 50-70% less disk space. pnpm also provides excellent monorepo support with its workspace feature. Its main trade-off is that the symlink-based structure can occasionally cause issues with tools that don't handle symlinks correctly.

For most teams, all three are viable choices. npm is the safe default with no setup needed. Yarn Berry is best for teams that want PnP's speed and strictness and are willing to invest in setup. pnpm is the best balance of speed, disk efficiency, and compatibility, and is increasingly the recommended choice for new projects.`,
        shortAnswer:
          "npm: default with Node.js, mature, ubiquitous. Yarn: deterministic installs, PnP mode (no node_modules), zero-install capability. pnpm: content-addressable store with hard links, fastest, 50-70% less disk space, strict dependency isolation. All three are production-ready; pnpm offers the best speed/efficiency balance for new projects.",
        code: `# npm commands
npm install                    # install all dependencies
npm ci                         # clean install from lock file (CI)
npm install react              # add dependency
npm install -D typescript      # add devDependency
npm update                     # update within semver ranges
npm outdated                   # show outdated packages
npm audit                      # security audit
npm run build                  # run script

# Yarn (Classic v1)
yarn install                   # install all dependencies
yarn install --frozen-lockfile # CI: fail if lock file outdated
yarn add react                 # add dependency
yarn add -D typescript         # add devDependency
yarn upgrade                   # update packages
yarn audit                     # security audit
yarn build                     # run script (no 'run' needed)

# Yarn Berry (v2+) with PnP
yarn set version berry         # upgrade to Berry
yarn install                   # creates .pnp.cjs instead of node_modules
yarn dlx create-react-app      # npx equivalent

# pnpm commands
pnpm install                   # install (uses global store + hard links)
pnpm install --frozen-lockfile # CI: deterministic install
pnpm add react                 # add dependency
pnpm add -D typescript         # add devDependency
pnpm update                    # update packages
pnpm audit                     # security audit
pnpm run build                 # run script

# Disk space comparison (approximate for a React project)
# npm:  node_modules = ~250MB
# yarn: node_modules = ~250MB (PnP: ~5MB .pnp.cjs + cache)
# pnpm: node_modules = ~50MB  (hard links to global store)

# Speed comparison (approximate cold install)
# npm ci:                ~30s
# yarn --frozen-lockfile: ~20s
# pnpm install:          ~15s

# Enforce one package manager with corepack
corepack enable
# package.json: "packageManager": "pnpm@9.4.0"`,
        language: "bash",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Package Management",
        topicId: "package-management-fundamentals",
        tags: ["npm", "yarn", "pnpm", "package-manager", "comparison"],
        commonMistakes: [
          "Mixing package managers in one project (having both package-lock.json and yarn.lock)",
          "Using npm install instead of npm ci in CI/CD environments",
          "Not leveraging workspace features for monorepo projects",
          "Ignoring pnpm's strict mode warnings about phantom dependencies",
        ],
        followUps: [
          "What is Yarn PnP and what problems does it solve?",
          "How does pnpm's content-addressable store work?",
          "What is corepack and how does it ensure consistent package manager versions?",
        ],
        interviewTips: [
          "Know the key differentiator for each: npm (default), Yarn (PnP), pnpm (speed + disk)",
          "Mention a recommendation for new projects to show practical judgment",
          "Discuss CI best practices: npm ci, --frozen-lockfile",
        ],
      },
      {
        id: "pkg-5",
        question:
          "How do you handle dependency conflicts and version mismatches in a project?",
        answer: `Dependency conflicts occur when different packages in your dependency tree require incompatible versions of the same package. This is one of the most frustrating issues in JavaScript development and becomes more likely as projects grow and add more dependencies. Understanding the conflict resolution mechanisms and strategies helps you diagnose and fix these issues quickly.

The most common conflict type is version duplication. Package A requires \`lodash@^4.17.0\` and package B requires \`lodash@^3.10.0\`. Since lodash 3.x and 4.x have different APIs, both versions must be installed. npm and Yarn handle this by installing the shared version at the top of node_modules (for packages whose ranges overlap) and nesting conflicting versions inside the requiring package's own node_modules directory. This means your bundle could include two copies of lodash. Use \`npm ls lodash\` to see which versions are installed and which packages require them.

Resolution strategies depend on the conflict type. For compatible ranges (both packages accept lodash@4.17.21), npm dedupe consolidates to a single copy. For incompatible major versions, you can try updating the outdated package that requires the old version, or use npm overrides (npm 8+) / Yarn resolutions to force a specific version across the entire tree. Overrides should be used carefully — forcing a version that a package wasn't tested with can cause runtime errors. Always test thoroughly after applying overrides.

For peer dependency conflicts (common after npm 7+ started auto-installing peers), the \`--legacy-peer-deps\` flag tells npm to ignore peer dependency conflicts, matching npm 6 behavior. However, this is a band-aid — the underlying issue is that two packages expect incompatible versions of a shared dependency. The proper fix is usually updating one or both packages to versions that agree on the peer dependency, or using overrides to resolve the conflict. In monorepo environments, workspace hoisting (single version at the root) naturally reduces conflicts but can cause issues if packages truly need different versions.

Prevention is better than cure. Keep dependencies up to date with regular updates (use Dependabot or Renovate for automated PRs). Before adding a dependency, check its dependency tree (\`npm info package dependencies\`) for potential conflicts. Minimize the number of dependencies — each one increases the chance of version conflicts. Use \`npm outdated\` regularly to identify packages that are behind on updates, and address them before they become incompatible with the rest of the dependency tree.`,
        shortAnswer:
          "Dependency conflicts occur when packages require incompatible versions of a shared dependency. Diagnose with npm ls, resolve with npm dedupe (compatible ranges), npm overrides / yarn resolutions (force versions), or updating packages. Prevent by keeping dependencies current, minimizing them, and using Dependabot/Renovate for automated updates.",
        code: `# Diagnose: find which versions are installed
npm ls lodash
# my-app@1.0.0
# ├── package-a@2.0.0
# │   └── lodash@4.17.21
# └── package-b@1.0.0
#     └── lodash@3.10.1  ← duplicate!

# Deduplicate compatible versions
npm dedupe

# Force a version with npm overrides (npm 8+)
// package.json
{
  "overrides": {
    "lodash": "4.17.21"
  },
  // Nested override: only for a specific package
  "overrides": {
    "package-b": {
      "lodash": "4.17.21"
    }
  }
}

# Yarn resolutions (equivalent)
{
  "resolutions": {
    "lodash": "4.17.21",
    "**/lodash": "4.17.21"
  }
}

# pnpm overrides
{
  "pnpm": {
    "overrides": {
      "lodash": "4.17.21"
    }
  }
}

# Handle peer dependency conflicts
npm install --legacy-peer-deps  # ignore peer conflicts (band-aid)

# Better: update packages to compatible versions
npm update package-a
npm update package-b

# Audit the full dependency tree
npm ls --all                    # show entire tree
npm outdated                    # show available updates
npm audit                       # check for vulnerabilities

# Automated dependency updates
# .github/dependabot.yml
# version: 2
# updates:
#   - package-ecosystem: "npm"
#     directory: "/"
#     schedule:
#       interval: "weekly"
#     open-pull-requests-limit: 10`,
        language: "bash",
        difficulty: "Advanced",
        type: "Scenario",
        category: "Package Management",
        topicId: "package-management-fundamentals",
        tags: [
          "dependency-conflicts",
          "npm-overrides",
          "resolutions",
          "dedupe",
          "version-management",
        ],
        commonMistakes: [
          "Using --legacy-peer-deps as a permanent solution instead of fixing the underlying conflict",
          "Forcing incompatible versions with overrides without testing — can cause runtime errors",
          "Not checking the full dependency tree before adding new packages",
          "Ignoring npm audit warnings — known vulnerabilities accumulate over time",
        ],
        followUps: [
          "How do npm workspaces help with dependency management in monorepos?",
          "What is the difference between npm overrides and Yarn resolutions?",
          "How do you audit and update dependencies safely?",
        ],
        interviewTips: [
          "Show a systematic approach: diagnose (npm ls) → understand → resolve → test → prevent",
          "Mention overrides/resolutions as power tools with caveats",
          "Emphasize prevention: regular updates, minimal dependencies, automated dependency PRs",
        ],
      },
      {
        id: "pkg-6",
        question:
          "What are npm scripts and how do you use them effectively in a project?",
        answer: `npm scripts are commands defined in the "scripts" field of package.json that can be run using \`npm run <script-name>\`. They provide a standardized way to define project-specific commands for building, testing, linting, deploying, and other development tasks. npm scripts serve as the project's command interface, documenting and standardizing how to work with the project regardless of the underlying tools.

npm has several built-in lifecycle scripts that run automatically at specific points. \`preinstall\` and \`postinstall\` run before and after \`npm install\`. \`pretest\`, \`test\`, and \`posttest\` run in sequence when you execute \`npm test\`. \`prepublishOnly\` runs before publishing a package. Any script can have pre and post hooks: defining \`prebuild\` and \`postbuild\` scripts will run automatically before and after the \`build\` script. Built-in scripts like \`test\`, \`start\`, \`stop\`, and \`restart\` can be run without the \`run\` keyword (\`npm test\` instead of \`npm run test\`).

Effective script organization follows conventions. \`dev\` or \`start\` starts the development server. \`build\` creates the production build. \`test\` runs the test suite. \`lint\` runs the linter. \`format\` runs the formatter. More complex projects add \`type-check\` for TypeScript checking, \`preview\` for previewing production builds, \`storybook\` for component documentation, and composite scripts that run multiple commands. Scripts can reference other scripts and chain commands with \`&&\` (sequential, stop on failure), \`;\` (sequential, continue on failure), or use npm-run-all/concurrently for parallel execution.

Scripts can access environment variables, npm package metadata (via $npm_package_name, $npm_package_version), and node_modules/.bin binaries. Any package installed locally can be called directly in scripts without a global install — when running a script, npm adds node_modules/.bin to the PATH. This means you can use \`eslint\` in scripts without installing ESLint globally. Cross-platform compatibility is a concern: scripts using Unix shell commands (\`rm -rf\`, \`&&\`) may fail on Windows. Tools like rimraf, cross-env, and npm-run-all provide cross-platform alternatives.`,
        shortAnswer:
          'npm scripts are commands in package.json\'s "scripts" field, providing a standard project interface. Built-in lifecycle scripts (preinstall, test) run automatically. Scripts access node_modules/.bin binaries without global installs. Use conventions: dev, build, test, lint. Chain with && or use concurrently for parallel execution. Use cross-platform tools for Windows compatibility.',
        code: `// package.json scripts
{
  "scripts": {
    // Development
    "dev": "vite",
    "dev:debug": "NODE_OPTIONS='--inspect' vite",

    // Building
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",

    // Testing
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",

    // Code quality
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "type-check": "tsc --noEmit",

    // Composite scripts
    "validate": "npm run type-check && npm run lint && npm run test -- --run",
    "ci": "npm run validate && npm run build",

    // Pre/post hooks (run automatically)
    "prebuild": "rimraf dist",
    "postbuild": "echo 'Build complete!'",

    // Utilities
    "analyze": "vite-bundle-visualizer",
    "prepare": "husky"
  }
}

// Running scripts
// npm run dev           → starts Vite dev server
// npm test              → runs vitest (built-in, no 'run' needed)
// npm run lint:fix      → fix linting issues
// npm run validate      → type-check + lint + test

// Pass arguments to scripts
// npm run test -- --watch    → passes --watch to vitest
// npm run lint -- --fix      → passes --fix to eslint

// Parallel execution with concurrently
{
  "scripts": {
    "dev": "concurrently \\"npm:dev:*\\"",
    "dev:client": "vite",
    "dev:server": "nodemon server.ts",
    "dev:storybook": "storybook dev"
  }
}

// Cross-platform compatibility
{
  "scripts": {
    "clean": "rimraf dist",           // cross-platform rm -rf
    "env": "cross-env NODE_ENV=production node build.js"
  }
}`,
        language: "json",
        difficulty: "Beginner",
        type: "Coding",
        category: "Package Management",
        topicId: "package-management-fundamentals",
        tags: [
          "npm-scripts",
          "package.json",
          "automation",
          "build-scripts",
          "lifecycle",
        ],
        commonMistakes: [
          "Using global package installs instead of local dev dependencies with scripts",
          "Not using -- to pass arguments through to the underlying command",
          "Writing Unix-specific scripts that break on Windows (rm -rf, export VAR=)",
          "Overcomplicating scripts — if it's more than a few commands, move to a script file",
        ],
        followUps: [
          "What are pre/post lifecycle hooks and when do they run?",
          "How do you run multiple scripts in parallel?",
          "What is the difference between npm start and npm run start?",
        ],
        interviewTips: [
          "Show you know the conventional script names: dev, build, test, lint",
          "Mention that local binaries are available in scripts via PATH extension",
          "Discuss cross-platform considerations — shows awareness of real-world issues",
        ],
      },
    ],
  },
];
