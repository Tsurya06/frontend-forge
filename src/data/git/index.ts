import type { Topic } from "../../types";

export const gitTopics: Topic[] = [
  {
    id: "git-version-control",
    title: "Git Version Control",
    description:
      "Comprehensive guide to Git version control including branching strategies, merging, rebasing, cherry-pick, stash, reset, revert, and conflict resolution.",
    category: "Git",
    difficulty: "Intermediate",
    tags: [
      "git",
      "branching",
      "merging",
      "rebasing",
      "cherry-pick",
      "stash",
      "conflict-resolution",
    ],
    overview:
      "Git is the industry-standard distributed version control system used by virtually every software team. Understanding Git beyond basic add/commit/push — knowing branching strategies, merge vs. rebase workflows, conflict resolution, and history management — is essential for effective collaboration and is frequently tested in frontend interviews.",
    concepts: [
      "Branches are lightweight pointers to commits enabling parallel development",
      "Merging combines diverged branch histories with a merge commit",
      "Rebasing replays commits onto a new base for linear history",
      "Cherry-pick applies specific commits from one branch to another",
      "Reset moves the branch pointer to change history (soft, mixed, hard)",
      "Revert creates a new commit that undoes a previous commit safely",
      "Stash temporarily shelves uncommitted changes",
    ],
    codeExamples: [
      {
        title: "Common Git Workflow",
        code: `# Create and switch to a feature branch
git checkout -b feature/user-auth

# Make changes and commit
git add src/auth/
git commit -m "feat: add login form component"

# Keep up to date with main
git fetch origin
git rebase origin/main

# Resolve conflicts if any, then continue
git add .
git rebase --continue

# Push and create PR
git push -u origin feature/user-auth`,
        language: "bash",
        explanation:
          "Standard feature branch workflow: branch from main, develop, rebase to stay current, push for review.",
      },
    ],
    relatedTopicIds: [],
    questions: [
      {
        id: "git-1",
        question:
          "What is the difference between git merge and git rebase? When should you use each?",
        answer: `Git merge and git rebase are two strategies for integrating changes from one branch into another, but they produce fundamentally different commit histories. Understanding their differences and appropriate use cases is critical for maintaining a clean, navigable project history and collaborating effectively with a team.

Git merge creates a new "merge commit" that combines the histories of two branches. When you run \`git merge feature\` from the main branch, Git finds the common ancestor of both branches, combines the changes, and creates a merge commit with two parents. The resulting history preserves the exact chronological order of commits and shows when branches diverged and converged. Merge is non-destructive — it never changes existing commits. This is its primary advantage: it preserves the complete, true history of the project.

Git rebase moves (replays) a series of commits onto a new base commit. When you run \`git rebase main\` from a feature branch, Git takes each commit from the feature branch, temporarily removes it, moves the branch pointer to the tip of main, and reapplies each commit one by one. The result is a linear history that looks as if the feature work was done sequentially after the latest main commit. The original commits are replaced with new commits (different hashes, same changes). This produces a cleaner, more readable history but rewrites commit history.

The golden rule of rebasing: never rebase commits that have been pushed to a shared/public branch. Since rebase rewrites commit history (creating new commit hashes), rebasing shared commits forces collaborators to reconcile diverged histories, leading to duplicate commits and confusion. Rebase is safe for local, unpublished feature branches. Use rebase to keep feature branches up-to-date with main before merging — this avoids unnecessary merge commits and keeps the main branch history linear.

A common team workflow combines both: developers rebase their feature branches onto main to stay current and resolve conflicts locally, then use merge (often via pull request) to integrate the feature into main. This gives you linear feature histories (from rebase) with clear integration points (from merge). Some teams prefer squash merging for PRs, which collapses all feature commits into a single commit on main, producing an extremely clean main branch history at the cost of losing individual commit granularity.`,
        shortAnswer:
          "Merge creates a merge commit preserving both branch histories (non-destructive). Rebase replays commits onto a new base creating linear history (rewrites commits). Use rebase for local feature branches to stay current with main. Use merge for integrating features into shared branches. Never rebase commits already pushed to shared branches.",
        code: `# MERGE: preserves history, creates merge commit
git checkout main
git merge feature/auth
# History: main --*--*--*--M (merge commit)
#                  \\-A--B-/ (feature commits preserved)

# REBASE: linear history, replays commits
git checkout feature/auth
git rebase main
# Before: main --*--*--*
#                  \\-A--B (feature/auth)
# After:  main --*--*--*--A'--B' (feature/auth, new commit hashes)

# Typical workflow: rebase then merge
git checkout feature/auth
git fetch origin
git rebase origin/main        # stay current, resolve conflicts locally
# ... resolve any conflicts ...
git push --force-with-lease    # update remote feature branch

# Then merge via PR (or from command line):
git checkout main
git merge --no-ff feature/auth # --no-ff creates merge commit even if fast-forward possible

# SQUASH MERGE: collapse feature into one commit
git checkout main
git merge --squash feature/auth
git commit -m "feat: add user authentication"
# History: main --*--*--*--S (single squashed commit)

# Interactive rebase: clean up commits before PR
git rebase -i HEAD~3
# pick abc1234 feat: add login form
# squash def5678 fix: button alignment
# squash ghi9012 fix: typo in label
# Result: one clean commit instead of three`,
        language: "bash",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Git",
        topicId: "git-version-control",
        tags: ["merge", "rebase", "branching", "history", "workflow"],
        commonMistakes: [
          "Rebasing commits that are already on a shared branch, causing history divergence",
          "Using git push --force instead of --force-with-lease after rebase (can overwrite others' work)",
          "Always merging without rebasing first, leading to a tangled main branch history",
          "Not understanding that rebase creates NEW commits with different hashes",
        ],
        followUps: [
          "What is interactive rebase and when would you use it?",
          "What does --force-with-lease do and why is it safer than --force?",
          "What is a squash merge and when is it appropriate?",
        ],
        interviewTips: [
          "Draw diagrams showing the commit history difference between merge and rebase",
          "State the golden rule: never rebase public/shared branches",
          "Describe your team's workflow using both merge and rebase together",
        ],
      },
      {
        id: "git-2",
        question:
          "How do you resolve merge conflicts in Git? Walk through the process and best practices.",
        answer: `Merge conflicts occur when Git cannot automatically reconcile changes from two branches because both branches modified the same lines of the same file, or one branch deleted a file that the other modified. Conflicts are a normal part of collaborative development, not an error. Understanding how to resolve them efficiently and correctly is an essential developer skill.

When a conflict occurs during merge or rebase, Git pauses the operation and marks the conflicting files. Running \`git status\` shows the conflicting files under "Unmerged paths." Git inserts conflict markers into the files: \`<<<<<<< HEAD\` shows your current branch's version, \`=======\` separates the two versions, and \`>>>>>>> feature-branch\` shows the incoming branch's version. Your job is to edit the file to the desired final state, removing all conflict markers and creating the correct merged content — which might be one version, the other, a combination of both, or entirely new code.

The resolution process follows clear steps. First, run \`git status\` to identify all conflicting files. Then open each file and locate the conflict markers. For each conflict, understand what both sides intended (read the commit messages and surrounding code for context). Edit the file to the correct resolution — this requires understanding the code, not just choosing one side. After resolving all conflicts in a file, stage it with \`git add\`. Once all conflicts are resolved and staged, complete the operation with \`git merge --continue\` (for merge) or \`git rebase --continue\` (for rebase).

Best practices for conflict resolution include: pull frequently from the main branch to keep your feature branch current, reducing the scope of conflicts. Communicate with teammates when working on the same files. Use a visual merge tool (VS Code's built-in merge editor, GitKraken, or Meld) for complex conflicts. After resolving, always run the test suite to verify the merged code works correctly — a conflict resolution that compiles but breaks logic is worse than a visible conflict. For complex conflicts, consider using \`git rerere\` (reuse recorded resolution) which remembers how you resolved conflicts and can auto-apply the same resolution if the same conflict appears again.`,
        shortAnswer:
          "Conflicts occur when both branches modify the same lines. Git marks conflicts with <<<<<<<, =======, and >>>>>>> markers. Resolution: identify conflicts via git status, edit files to the correct merged content, remove markers, git add resolved files, then git merge --continue or git rebase --continue. Pull frequently and use visual merge tools for complex conflicts.",
        code: `# Conflict markers in a file
<<<<<<< HEAD
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
=======
function calculateTotal(items: Item[], discount: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return subtotal * (1 - discount);
}
>>>>>>> feature/discounts

# RESOLVED: combine both changes
function calculateTotal(items: Item[], discount: number = 0): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * (1 - discount);
}

# Conflict resolution workflow
git merge feature/discounts
# CONFLICT: Merge conflict in src/utils/cart.ts

git status
# Unmerged paths:
#   both modified: src/utils/cart.ts

# Edit the file, resolve conflicts, then:
git add src/utils/cart.ts
git merge --continue

# During rebase conflicts:
git rebase main
# CONFLICT in src/utils/cart.ts
# Resolve the conflict, then:
git add src/utils/cart.ts
git rebase --continue
# If multiple commits conflict, repeat for each

# Abort if resolution goes wrong
git merge --abort    # undo merge attempt
git rebase --abort   # undo rebase attempt

# Enable rerere (reuse recorded resolution)
git config --global rerere.enabled true
# Git remembers your conflict resolutions and auto-applies them

# Use a visual merge tool
git mergetool
# Or configure VS Code as the merge tool:
# git config --global merge.tool vscode
# git config --global mergetool.vscode.cmd 'code --wait $MERGED'`,
        language: "bash",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Git",
        topicId: "git-version-control",
        tags: ["conflicts", "merge", "resolution", "collaboration"],
        commonMistakes: [
          "Blindly accepting one side without understanding both changes",
          "Leaving conflict markers (<<<<<<<) in the codebase",
          "Not running tests after resolving conflicts to verify correctness",
          "Force-pushing over a teammate's work instead of properly resolving conflicts",
        ],
        followUps: [
          "What is git rerere and how does it help with repeated conflicts?",
          "How do you prevent frequent merge conflicts in a team?",
          "What is the difference between a merge conflict and a merge that silently breaks functionality?",
        ],
        interviewTips: [
          "Walk through the complete workflow: identify → understand → resolve → verify",
          "Mention that resolution requires understanding the code, not just picking a side",
          "Discuss prevention strategies: frequent pulls, communication, small PRs",
        ],
      },
      {
        id: "git-3",
        question: "Explain git cherry-pick. When and how would you use it?",
        answer: `Git cherry-pick applies the changes introduced by one or more specific commits from one branch onto another branch. Unlike merge or rebase which integrate entire branch histories, cherry-pick selectively copies individual commits. It creates new commits on the current branch with the same changes (diffs) as the original commits but with new commit hashes. The original commits remain on their source branch unchanged.

Cherry-pick is useful in several scenarios. Hotfix propagation is the most common: a bug fix committed to a release branch needs to be applied to the development branch (or vice versa) without merging all other changes. Feature extraction occurs when a developer commits a useful utility function on a feature branch that another developer needs on a different feature branch — cherry-picking just that commit is cleaner than merging the entire unfinished feature. Selective release happens when you want to release specific features from a development branch to a release branch without including everything.

The cherry-pick process is straightforward. Find the commit hash you want (using \`git log\`), switch to the target branch, and run \`git cherry-pick <commit-hash>\`. For multiple sequential commits, use \`git cherry-pick A..B\` (exclusive of A) or \`git cherry-pick A^..B\` (inclusive of A). If conflicts occur, resolve them like merge conflicts and run \`git cherry-pick --continue\`. Use \`--no-commit\` flag to apply changes without automatically creating a commit, allowing you to modify the changes before committing.

Cherry-pick has important caveats. Since it creates new commits, the same change exists in two places with different commit hashes, which can cause confusion in commit history and duplicate conflicts if the branches are later merged. Use it sparingly and prefer merge or rebase for regular workflow. It doesn't bring over the commit's context (preceding commits on the source branch), so cherry-picked commits may not make sense in isolation if they depend on earlier changes. Always test after cherry-picking to ensure the isolated commit works correctly on the target branch.`,
        shortAnswer:
          "Cherry-pick applies specific commits from one branch to another, creating new commits with the same changes but different hashes. Use cases: hotfix propagation between branches, extracting specific features, selective releases. Caveats: creates duplicate changes, may cause conflicts on later merge, commits may not work in isolation.",
        code: `# Basic cherry-pick
git log --oneline feature/auth
# a1b2c3d feat: add JWT validation utility
# e4f5g6h feat: add login form
# i7j8k9l feat: add auth context

# Cherry-pick the JWT utility to main
git checkout main
git cherry-pick a1b2c3d
# Creates a new commit on main with the same changes

# Cherry-pick multiple commits
git cherry-pick a1b2c3d e4f5g6h

# Cherry-pick a range of commits
git cherry-pick i7j8k9l^..a1b2c3d  # inclusive range

# Cherry-pick without auto-commit (stage changes only)
git cherry-pick --no-commit a1b2c3d
# Modify changes if needed, then:
git commit -m "feat: add JWT validation (cherry-picked from feature/auth)"

# Handle conflicts during cherry-pick
git cherry-pick a1b2c3d
# CONFLICT in src/auth/jwt.ts
# Resolve the conflict, then:
git add src/auth/jwt.ts
git cherry-pick --continue

# Abort cherry-pick if something goes wrong
git cherry-pick --abort

# Hotfix workflow example
git checkout release/2.1
git cherry-pick abc123   # apply hotfix from main
git push origin release/2.1

git checkout develop
git cherry-pick abc123   # apply same hotfix to develop
git push origin develop`,
        language: "bash",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Git",
        topicId: "git-version-control",
        tags: ["cherry-pick", "selective-merge", "hotfix", "commit-management"],
        commonMistakes: [
          "Over-using cherry-pick instead of merge/rebase for regular integration",
          "Cherry-picking a commit that depends on earlier commits not present on the target branch",
          "Not mentioning in the commit message that it was cherry-picked, losing traceability",
          "Cherry-picking the same commit to multiple branches, then getting duplicate conflicts on merge",
        ],
        followUps: [
          "How do you handle a cherry-pick that creates a conflict?",
          "What are alternatives to cherry-pick for hotfix propagation?",
          "How does cherry-pick differ from rebase in terms of commit copying?",
        ],
        interviewTips: [
          "Give concrete scenarios: hotfix propagation is the most relatable use case",
          "Mention the caveats: duplicate commits, missing context, potential merge conflicts later",
          "Show you know the --no-commit flag for cases where you need to modify the cherry-picked changes",
        ],
      },
      {
        id: "git-4",
        question:
          "Explain the difference between git reset and git revert. When is each appropriate?",
        answer: `Git reset and git revert are both used to undo changes, but they work in fundamentally different ways and are appropriate in different contexts. The key distinction is that reset rewrites history (removes commits) while revert creates new history (adds an undo commit). This difference determines when each is safe to use, particularly regarding shared branches.

Git reset moves the branch pointer backward to a specified commit, effectively "removing" subsequent commits from the branch. It has three modes: --soft moves the pointer but keeps changes staged (ready to recommit), --mixed (default) moves the pointer and unstages changes (changes remain in working directory), and --hard moves the pointer, unstages changes, AND discards working directory changes (destructive). Reset is useful for cleaning up local commit history — squashing messy work-in-progress commits, removing accidental commits, or starting over from a clean state. However, because it rewrites history, it should never be used on commits that have been pushed to a shared branch, as it would force all collaborators to reconcile diverged histories.

Git revert creates a new commit that applies the inverse of a specified commit's changes. The original commit remains in the history, and a new commit is added that undoes its effects. This is safe for shared branches because it doesn't rewrite history — it only adds to it. All collaborators simply pull the new revert commit. Use revert when you need to undo a change on a shared branch: reverting a buggy commit on main, undoing a feature that was merged but needs to be rolled back, or removing a change from a release branch.

The decision framework is simple: if the commits are local and unpublished, use reset (cleaner history). If the commits are shared/published, use revert (safe, preserves history). In rare cases, you might use reset --soft on a local branch to collapse several commits into one before pushing, or use revert on a local branch when you want to preserve the history of the mistake for learning purposes. Remember that \`git reset --hard\` is one of the few truly destructive Git operations — uncommitted changes are permanently lost unless you can recover them from \`git reflog\`.`,
        shortAnswer:
          "Reset moves the branch pointer backward, removing commits from history (rewrites history). Revert creates a new commit that undoes a previous commit's changes (preserves history). Use reset for local unpublished commits; use revert for shared/published commits. Reset has three modes: --soft (keep staged), --mixed (unstage), --hard (discard all).",
        code: `# GIT RESET: rewrites history (LOCAL ONLY)

# --soft: move pointer, keep changes staged
git reset --soft HEAD~2
# Commits removed, but changes ready to recommit
git commit -m "feat: combined commit"

# --mixed (default): move pointer, unstage changes
git reset HEAD~1
# Commit removed, changes in working directory (unstaged)

# --hard: move pointer, discard ALL changes (DESTRUCTIVE)
git reset --hard HEAD~1
# Commit AND changes are gone

# Reset to a specific commit
git reset --hard abc123

# GIT REVERT: creates undo commit (SAFE FOR SHARED)

# Revert the last commit
git revert HEAD
# Creates a new commit that undoes HEAD's changes

# Revert a specific commit
git revert abc123
# Creates a new commit undoing abc123's changes

# Revert without auto-commit
git revert --no-commit abc123
# Apply the undo changes, then commit manually

# Revert a merge commit (must specify parent)
git revert -m 1 abc123
# -m 1 means keep the first parent (usually main branch)

# DECISION FRAMEWORK:
# Local, unpublished commits → git reset
# Shared, published commits → git revert

# Recovery from accidental reset --hard
git reflog
# Shows all recent HEAD movements
# a1b2c3d HEAD@{0}: reset: moving to HEAD~2
# e4f5g6h HEAD@{1}: commit: feat: important feature
# i7j8k9l HEAD@{2}: commit: feat: setup

git reset --hard e4f5g6h  # recover the lost commit`,
        language: "bash",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Git",
        topicId: "git-version-control",
        tags: ["reset", "revert", "undo", "history", "reflog"],
        commonMistakes: [
          "Using git reset --hard on shared branches, forcing teammates to deal with diverged history",
          "Forgetting that reset --hard is destructive — uncommitted changes are permanently lost",
          "Not knowing about git reflog as a recovery mechanism for accidental resets",
          "Using revert on local branches when reset would produce cleaner history",
        ],
        followUps: [
          "How does git reflog help recover from mistakes?",
          "How do you revert a merge commit?",
          "What happens when you revert a revert?",
        ],
        interviewTips: [
          "Emphasize the key distinction: reset rewrites history, revert adds to history",
          "State the rule clearly: reset for local, revert for shared/public branches",
          "Mention reflog as the safety net for accidental resets",
        ],
      },
      {
        id: "git-5",
        question: "What is git stash and how do you use it effectively?",
        answer: `Git stash temporarily shelves (or stashes) uncommitted changes in your working directory, giving you a clean working tree without losing your work. It saves both staged and unstaged modifications to a stack-like storage area and reverts your working directory to match the HEAD commit. You can later reapply the stashed changes when you're ready to continue working on them. Stash is invaluable for context-switching between tasks.

The most common stash workflow involves switching branches. You're working on a feature, have uncommitted changes, and need to urgently fix a bug on another branch. Git won't let you switch branches if your uncommitted changes conflict with the target branch. \`git stash\` saves your work, lets you switch to the bug-fix branch, fix the bug, then switch back and \`git stash pop\` restores your work exactly where you left off. This entire workflow takes seconds compared to the alternative of creating a temporary commit (which clutters history) or manually saving and restoring files.

Git stash supports several useful operations. \`git stash\` saves all modified tracked files. \`git stash -u\` also includes untracked files. \`git stash -p\` lets you interactively select which changes to stash. \`git stash list\` shows all stashed entries. \`git stash pop\` applies the most recent stash and removes it from the stash list. \`git stash apply\` applies a stash without removing it (useful if you want to apply the same stash to multiple branches). \`git stash drop\` removes a stash entry. \`git stash show -p stash@{0}\` shows the diff of a specific stash entry. You can also name stashes with \`git stash push -m "work in progress on auth"\` for easier identification.

Advanced stash usage includes creating branches from stashes. \`git stash branch new-branch stash@{0}\` creates a new branch from the commit where you originally stashed, applies the stash, and drops it — perfect for when you realize your stashed work should be on its own branch. Stash can also be useful for testing: stash your changes, run tests on the clean code to establish a baseline, then pop and compare. Be aware that stash entries are local — they're not shared through push/pull. If you stash and then delete the branch, the stash is still available because it's stored in the reflog independently.`,
        shortAnswer:
          "Git stash saves uncommitted changes to a stack without committing, restoring a clean working directory. Use for branch switching, context switching between tasks, and temporarily shelving work. Key commands: stash (save), pop (apply and remove), apply (apply and keep), list, drop. Name stashes with -m for easier identification.",
        code: `# Basic stash workflow
git stash                    # save all modified tracked files
git stash -u                 # also include untracked files
git stash push -m "WIP: auth form validation"  # named stash

# Switch to fix a bug
git checkout main
git checkout -b hotfix/login-bug
# ... fix the bug, commit, push ...
git checkout feature/auth
git stash pop                # restore stashed work

# List all stashes
git stash list
# stash@{0}: On feature/auth: WIP: auth form validation
# stash@{1}: WIP on main: abc1234 previous work

# Apply specific stash (keep it in the list)
git stash apply stash@{1}

# Show stash contents
git stash show -p stash@{0}  # shows diff

# Drop a specific stash
git stash drop stash@{1}

# Clear all stashes
git stash clear

# Create branch from stash
git stash branch feature/auth-validation stash@{0}
# Creates branch, applies stash, drops stash

# Stash only specific files
git stash push -m "just the styles" src/styles/
# Or interactively select changes
git stash -p  # interactive: stash selected hunks

# Common workflow: test before and after changes
git stash                     # save changes
npm test                      # run tests on clean code (baseline)
git stash pop                 # restore changes
npm test                      # run tests with your changes`,
        language: "bash",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "Git",
        topicId: "git-version-control",
        tags: [
          "stash",
          "context-switching",
          "working-directory",
          "temporary-storage",
        ],
        commonMistakes: [
          "Accumulating many unnamed stashes and forgetting what each contains",
          "Using stash as a long-term storage mechanism instead of committing to a branch",
          "Forgetting about stashed changes entirely — they don't show in git status",
          "Not using -u flag and losing untracked files when stashing",
        ],
        followUps: [
          "What is the difference between git stash pop and git stash apply?",
          "How do you resolve conflicts when applying a stash?",
          "Can you stash specific files instead of everything?",
        ],
        interviewTips: [
          "Show a real workflow: working on feature, need to switch, stash, fix, switch back, pop",
          "Mention naming stashes with -m for teams with multiple stash entries",
          "Note that stashes are local-only and independent of branches",
        ],
      },
      {
        id: "git-6",
        question:
          "Describe common Git branching strategies. Compare Git Flow, GitHub Flow, and trunk-based development.",
        answer: `Git branching strategies define how teams organize their branches, manage releases, and integrate code changes. The right strategy depends on team size, release cadence, deployment model, and project complexity. The three most common strategies are Git Flow, GitHub Flow, and trunk-based development, each optimized for different workflows.

Git Flow (introduced by Vincent Driessen) uses multiple long-lived branches: main (production code), develop (integration branch), feature branches, release branches, and hotfix branches. Feature branches are created from develop, merged back into develop when complete. When enough features are accumulated, a release branch is created from develop for stabilization, then merged into both main and develop. Hotfix branches are created from main for urgent production fixes. Git Flow works well for projects with scheduled releases (mobile apps, enterprise software) but is considered overly complex for web applications with continuous deployment.

GitHub Flow is a simplified workflow with one rule: anything in main is deployable. Developers create feature branches from main, push commits, open pull requests for review, and merge into main when approved. Deployments happen directly from main, often automated via CI/CD. This simplicity makes it ideal for web applications with continuous deployment — there's no release branch management, no develop branch, and no version-specific hotfix branches. The entire workflow is: branch, commit, PR, review, merge, deploy.

Trunk-based development takes simplification further. All developers commit directly to the main branch (trunk) or use very short-lived feature branches (merged within 1-2 days). The key enabler is feature flags — incomplete features are merged behind flags that keep them hidden from users until ready. This eliminates long-lived branches and their merge conflict overhead. Trunk-based development requires strong CI/CD practices, comprehensive automated testing, and a feature flag system. It's favored by high-performing teams (Google, Facebook) because it maximizes integration frequency and minimizes merge conflicts, but it requires disciplined practices and infrastructure.

For most frontend teams, GitHub Flow provides the best balance of simplicity and safety. It supports continuous deployment, is easy to understand and enforce, and the PR-based review process provides quality gates without branch management overhead. Git Flow is appropriate when you need to maintain multiple versions simultaneously. Trunk-based development is the goal for teams mature enough to support it with feature flags and robust CI/CD.`,
        shortAnswer:
          "Git Flow uses main/develop/feature/release/hotfix branches for scheduled releases. GitHub Flow uses main + feature branches with PRs for continuous deployment. Trunk-based development commits directly to main using feature flags. GitHub Flow suits most web teams; Git Flow for versioned releases; trunk-based for high-performing teams with strong CI/CD.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Git",
        topicId: "git-version-control",
        tags: [
          "branching-strategy",
          "Git-Flow",
          "GitHub-Flow",
          "trunk-based",
          "workflow",
        ],
        commonMistakes: [
          "Using Git Flow for web apps with continuous deployment — it adds unnecessary complexity",
          "Long-lived feature branches that diverge significantly from main, causing painful merges",
          "Not having a clear strategy, leading to inconsistent practices across the team",
          "Adopting trunk-based development without feature flags or sufficient test coverage",
        ],
        followUps: [
          "How do feature flags enable trunk-based development?",
          "What is the role of CI/CD in each branching strategy?",
          "How do you handle hotfixes in GitHub Flow?",
        ],
        interviewTips: [
          "Know all three strategies and when each is appropriate",
          "Recommend GitHub Flow for most web teams — shows practical judgment",
          "Mention the team maturity and infrastructure requirements for trunk-based development",
        ],
      },
    ],
  },
];
