---
applyTo: "git-stack.ts"
---
# Git Stack Manager

`./git-stack.ts` is a TypeScript script that implements a simple Git commit stack manager.

The script should allow users to:

- maintain a list of ordered "named" commits as they should be applied in git
- print the list of named commits, with support for showing files changed in each commit
- add the current staged changes in git to a commit by name and ensure they are properly squashed
- fetch the latest `origin/main` and rebase the stack on top, if merge conflicts arise, the user should be able to fix them and continue
- update the series of commits on `blebbit/main` (origin/branch)
- show the changes introduced by each commit in the stack by name

The command has the following help output:

```sh
Usage: git-stack.ts <command>
Commands:
  init                 - Create dummy commits for the stack
  list [--files]       - List the commit stack
  add <commit-name>    - Add staged changes to a commit
  remove <commit-name> <file-path> - Remove a file from a named commit
  diff <commit-name>   - Show changes in a named commit
  rebase               - Rebase stack on origin/main
  push                 - Push stack to a remote branch
```
