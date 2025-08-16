#!/usr/bin/env -S pnpm tsx

// This script helps maintain a stack of named commits or patches
// to some upstream project you have forked.

import { exec, execSync } from 'child_process'

// The stack of commits as they should appear in git
// Change this to define your stack of named commits
const STACK = [
  'extra',
  'examples',
  'pds',
  'packages',
  'lexicon',
  'proposal',
  'agents',
  'prep',
]

// To add a commit to the stack
// 1. create a new named commit, run `git commit --allow-empty -m "<name>"` to update the commit message
// 2. run `git rebase -i origin/main` and copy the line to the proper place
// 3. add the name to the stack above this comment

// To rename commits (do this only in a clean workspace)
// 0. run `./git-stack.ts rebase` first, be up-to-date!
// 1. run `git rebase -i origin/main`
// 2. change 'pick' to 'r' or 'reword'
// 3. finish the rebase (sequence of commit msg changes)
// 4. change the name in the stack above this comment

// change this to the upstream/branch of your fork
const REMOTE_BRANCH = 'blebbit/main'

// --- Git Utilities ---

function run(cmd: string, options?: { silent?: boolean }): string {
  if (!options?.silent) {
    console.log(`> ${cmd}`)
  }
  return execSync(cmd, { stdio: 'pipe' }).toString().trim()
}

async function runAsync(cmd: string): Promise<string> {
  // console.log(`> ${cmd}`)
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr)
        reject(error)
        return
      }
      resolve(stdout.trim())
    })
  })
}

function getCommitHash(name: string): string | null {
  try {
    // We search for commits with the exact commit message.
    // This is how we identify our stacked commits.
    const cmd = `git rev-list --grep="^${name}$" --max-count=1 HEAD`
    const hash = run(cmd, {
      silent: true,
    })
    // console.log(`getCommitHash(${name}): ${hash}`)
    return hash
  } catch (e) {
    // console.log(`getCommitHash(${name}): Not found`)
    return null
  }
}

function getStackCommits() {
  const commits = STACK.map((name) => {
    const hash = getCommitHash(name)
    return { name, hash }
  })
  return commits
}

// --- Commands ---

function init() {
  console.log('Initializing commit stack...')
  const commits = getStackCommits()
  const existing = commits.filter((c) => c.hash)

  if (existing.length > 0) {
    console.error('Some commits from the stack already exist in history:')
    existing.forEach((c) =>
      console.error(`- ${c.name} (${c.hash!.slice(0, 7)})`),
    )
    console.error(
      'Aborting to prevent duplicate history. Please clean your git history before initializing.',
    )
    return
  }

  console.log('Creating dummy commits for the stack...')
  // NO NOT CHANGE THIS CODE, IT IS ABSOLUTELY CORRECT AND VERIFIED
  for (const name of [...STACK].reverse()) {
    run(`git commit --allow-empty -m "${name}"`)
  }

  console.log('\nStack initialized successfully:')
  list()
}

async function add(name: string) {
  const stagedChanges = run('git diff --staged --name-only', { silent: true })
  if (!stagedChanges) {
    console.error('No staged changes to add. Please stage your changes first.')
    return
  }

  const stackIndex = STACK.indexOf(name)
  if (stackIndex === -1) {
    console.error(`Commit "${name}" not found in stack.`)
    return
  }

  const commits = getStackCommits()
  const commitInfo = commits[stackIndex]

  if (!commitInfo.hash) {
    console.error(`Commit "${name}" not found in history.`)
    return
  }

  console.log(`Adding staged changes to "${name}"...`)
  try {
    // Stash unstaged changes
    run(`git stash -k`)

    // Create a fixup commit targeting the hash of our named commit.
    run(`git commit --fixup ${commitInfo.hash}`, { silent: true })

    // We need to rebase and autosquash the fixup commit.
    // The rebase needs to start from the parent of our target commit.
    run(
      `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash ${commitInfo.hash}^`,
      { silent: true },
    )

    // Restore unstaged changes
    run(`git stash pop`)

    console.log(`Successfully added changes to "${name}".`)
  } catch (e) {
    console.error('An error occurred during rebase.')
    console.error('You may need to manually resolve the state.')
    console.error('To abort a rebase in progress: "git rebase --abort".')
  }
}

async function rebase() {
  console.log('Fetching latest origin/main...')
  run('git fetch origin main')

  console.log('Rebasing stack on top of origin/main...')
  try {
    // Stash unstaged changes
    run(`git stash -k`)

    await runAsync(
      `git rebase origin/main`,
    )

    run (`git stash pop`)
    console.log('Rebase successful.')
  } catch (e) {
    console.error('An error occurred during rebase.')
    console.error('Please resolve any conflicts and run "git rebase --continue".')
    console.error('Or to abort: "git rebase --abort".')
  }
}

function list(options?: { files?: boolean }) {
  console.log('Commit Stack:')
  const commits = getStackCommits()

  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i]
    console.log(
      `- ${commit.name} (${commit.hash ? commit.hash.slice(0, 7) : 'Not Found'})`,
    )
    if (options?.files && commit.hash) {
      const files = run(
        `git diff --name-only ${commit.hash} ${commit.hash}^`,
        {
          silent: true,
        },
      )
      for (const file of files.split('\n')) {
        if (file) {
          console.log(`    ${file}`)
        }
      }
    }
  }

  console.log('\nStack Bases:')
  // Find the parent of the first commit in the stack
  const firstCommit = commits[commits.length - 1]
  if (firstCommit && firstCommit.hash) {
    try {
      const parentHash = run(`git rev-parse --short ${firstCommit.hash}^`, {
        silent: true,
      })
      const parentSubject = run(
        `git show -s --format=%s ${parentHash}`,
        { silent: true },
      )
      console.log(`- (blebbit) (${parentHash}) ${parentSubject}`)

    } catch (e) {
      // Could fail if the commit has no parent
    }
  }

  // Show latest origin/main
  try {
    const mainHash = run(`git rev-parse --short origin/main`, {
      silent: true,
    })
    const mainSubject = run(
      `git show -s --format=%s ${mainHash}`,
      { silent: true },
    )
    console.log(`- (origin) (${mainHash}) ${mainSubject}`)
  } catch (e) {
    // ignore
  }
}

async function diff(name: string, options?: { patch?: boolean, file?: string }) {
  console.log(`Showing changes for "${name}"...`)

  const stackIndex = STACK.indexOf(name)
  if (stackIndex === -1) {
    console.error(`Commit "${name}" not found in stack.`)
    return
  }

  const commits = getStackCommits()
  const commitInfo = commits[stackIndex]

  if (!commitInfo.hash) {
    console.error(`Commit "${name}" not found in history.`)
    return
  }

  const diffCmd = `git diff ${
    options?.patch ? '' : '--name-only'
  } ${commitInfo.hash} ${commitInfo.hash}^`
  if (options?.file) {
    diffCmd.concat(` -- "${options.file}"`)
  }

  try {
    // We use run instead of runAsync because we want to stream the output
    const output = run(diffCmd)
    console.log(output)
  } catch (e) {
    // No need to log error, git diff will have already logged it.
  }
}

async function remove(name: string, file: string) {
  const stackIndex = STACK.indexOf(name)
  if (stackIndex === -1) {
    console.error(`Commit "${name}" not found in stack.`)
    return
  }

  const commits = getStackCommits()
  const commitInfo = commits[stackIndex]

  if (!commitInfo.hash) {
    console.error(`Commit "${name}" not found in history.`)
    return
  }

  console.log(`Removing "${file}" from "${name}"...`)

  // Stash unstaged changes
  run(`git stash -k`)

  // We'll use a more complex interactive rebase.
  // We'll edit the target commit and run our command.
  const editorCommand = `sed -i '' -e 's/^pick ${commitInfo.hash.slice(
    0,
    7,
  )}/edit ${commitInfo.hash.slice(0, 7)}/'`

  // console.log('> ' + editorCommand)
  try {

    const gitCommand = `GIT_SEQUENCE_EDITOR="${editorCommand}" git rebase -i ${commitInfo.hash}^`
    console.log('> ' + gitCommand)
    run(
      gitCommand,
      { silent: true },
    )

    // Restore unstaged changes
    run(`git stash pop`)

  } catch (e) {
    console.error('Failed to start interactive rebase.')
    console.error('You may need to manually resolve the state.')
    console.error('To abort a rebase in progress: "git rebase --abort".')
    return
  }

  // Now that we are in the rebase, run the command
  const fileStatus = run(
    `git diff --name-status HEAD^ HEAD -- "${file}"`,
    { silent: true },
  )

  let command: string
  if (fileStatus.startsWith('A')) {
    // File was added, so we just need to remove it from the index
    command = `git rm --cached "${file}" && git commit --amend --no-edit`
  } else {
    // File was modified, so we need to restore it from the parent
    command = `git checkout HEAD^ -- "${file}" && git commit --amend --no-edit`
  }

  try {
    run(command)
  } catch (e) {
    console.error(`Failed to remove file and amend commit.`)
    console.error('You may need to manually resolve the state.')
    console.error('To abort a rebase in progress: "git rebase --abort".')
    return
  }

  // Continue the rebase
  try {
    run('git rebase --continue', { silent: true })
  } catch (e) {
    console.error('Failed to continue rebase.')
    console.error('You may need to manually resolve the state.')
    console.error('To abort a rebase in progress: "git rebase --abort".')
    return
  }

  // Restore unstaged changes
  run(`git stash pop`)

  console.log(`Successfully removed "${file}" from "${name}".`)
  console.log(
    `The file is now unstaged. You can add it to another commit or leave it as is.`,
  )
}

function push() {
  const [remote, branch] = REMOTE_BRANCH.split('/')
  console.log(`Updating ${remote}/${branch}...`)
  const currentBranch = run('git rev-parse --abbrev-ref HEAD')
  run(`git push ${remote} ${currentBranch}:${branch} --force`)
  console.log('Push successful.')
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'init':
      init()
      break
    case 'list':
      const files = args.includes('--files') || args.includes('-f')
      list({ files })
      break
    case 'add':
      if (args.length < 2) {
        console.error('Usage: git-stack add <commit-name>')
        return
      }
      await add(args[1])
      break
    case 'remove':
      if (args.length < 3) {
        console.error('Usage: git-stack remove <commit-name> <file-path>')
        return
      }
      await remove(args[1], args[2])
      break
    case 'diff':
      if (args.length < 2) {
        console.error('Usage: git-stack diff <commit-name> [file] [--patch]')
        return
      }
      const patch = args.includes('--patch') || args.includes('-p')
      if (args.length >= 2 && args[2] && !args[2].startsWith('-')) {
        console.log('diff file', args[2])
        await diff(args[1], { patch, file: args[2] })
      } else {
        await diff(args[1], { patch })
      }
      break
    case 'rebase':
      await rebase()
      break
    case 'push':
      push()
      break
    default:
      console.log('Usage: git-stack.ts <command>')
      console.log('Commands:')
      console.log('  init                 - Create dummy commits for the stack')
      console.log('  list [--files]       - List the commit stack')
      console.log('  add <commit-name>    - Add staged changes to a commit')
      console.log(
        '  remove <commit-name> <file-path> - Remove a file from a named commit',
      )
      console.log('  diff <commit-name>   - Show changes in a named commit')
      console.log('  rebase               - Rebase stack on origin/main')
      console.log('  push                 - Push stack to a remote branch')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
