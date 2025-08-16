
import { inspect, parseArgs } from 'util'
import { AtpAgent } from '@atproto/api'
import ACCT_FNS from './acct'
import REPO_FNS from './repo'
import SPACE_FNS from './space'

const users = {
  alice: {
    handle: 'alice.test',
    password: 'hunter2',
  },
  bob: {
    handle: 'bob.test',
    password: 'hunter2',
  },
  carol: {
    handle: 'carol.test',
    password: 'hunter2',
  },
}

const FNS = {
  acct: ACCT_FNS,
  repo: REPO_FNS,
  space: SPACE_FNS,
}

function aparse(argv) {
  const {
    values: flags,
    positionals: [command, ...args],
  } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      service: {
        type: 'string',
      },
      account: {
        type: 'string',
      },
      admin: {
        type: 'boolean',
        default: false,
      },
    },
  })
  return { command, args, flags }
}

const main = async () => {
  const { command, args, flags } = aparse(process.argv.slice(2))

  const agent = new AtpAgent({
    service: (flags.service as string) || 'http://localhost:2583',
  })

  if (flags.account) {
    const acct = flags.account as string
    const user = users[acct]
    if (!user) {
      throw new Error(`Unknown account: ${acct}`)
    }
    await agent.login({
      identifier: user.handle,
      password: user.password,
    })
  }

  if (command === 'help') {
    help(args[0])
    return
  }

  if (typeof command !== 'string' || !command.includes('.')) {
    console.log('Unknown command. Available commands:')
    help()
    process.exit(1)
  }

  const [namespace, fnName] = command.split('.')
  const fnInfo = FNS[namespace]?.[fnName]

  if (!fnInfo) {
    console.log('Unknown command. Available commands:')
    help()
    process.exit(1)
  }

  const fnArgs = {}
  const positional = args.filter((a) => typeof a === 'string')
  const named = args.reduce(
    (acc, a) => (typeof a === 'object' ? { ...acc, ...(a as object) } : acc),
    {},
  )

  fnInfo.args.forEach((argName, i) => {
    const name = argName.endsWith('?') ? argName.slice(0, -1) : argName
    if (named[name]) {
      fnArgs[name] = named[name]
    } else if (positional[i]) {
      fnArgs[name] = positional[i]
    } else if (!argName.endsWith('?')) {
      console.error(`Missing required argument: ${name}`)
      help(command)
      process.exit(1)
    }
  })

  const result = await fnInfo.fn(agent, fnArgs)
  if (result) {
    console.log(inspect(result, false, null, true))
  }
}

// ====================

// == Helper Funcs ==

function help(command?: string) {
  if (command && command.includes('.')) {
    const [namespace, fnName] = command.split('.')
    const fnInfo = FNS[namespace]?.[fnName]
    if (fnInfo) {
      console.log(`Usage: ${command} ${fnInfo.args.join(' ')}`)
      console.log(`\n${fnInfo.help}`)
    } else {
      console.log(`Unknown command: ${command}`)
    }
  } else {
    console.log('Available commands:')
    for (const ns in FNS) {
      if (command && command !== ns) continue
      console.log(`\n${ns}:`)
      for (const fn in FNS[ns]) {
        console.log(`  ${`${ns}.${fn}`.padEnd(20)} ${FNS[ns][fn].help}`)
      }
    }
  }
  console.log('')
  console.log('Flags:')
  console.log('  --service=<url>      Set the service URL.')
  console.log(
    '  --account=<name>     Login as a specific user (alice, bob, carol).',
  )
  console.log('')
  console.log('Known Repos:')
  for (const user in users) {
    console.log(`  ${users[user].handle}`)
  }
  return Promise.resolve()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
