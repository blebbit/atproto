import { AtpAgent } from '@atproto/api'
import config from './config'

(async () => {

  // Init the agent
  const agent = new AtpAgent({ service: config.pdsDomain })

  const accounts = [
    "alice.test",
    "boris.test",
    "cindy.test",
    "darth.test",
  ]

  // Create the accounts
  for (const handle of accounts) {
    await agent.createAccount({
      handle,
      email: `${handle}@example.com`,
      password: "hunter2",
    })
  }

  // Print accounts known to the PDS
  const accts = await agent.com.atproto.sync.listRepos({})
  console.log("Accounts:", JSON.stringify(accts.data, null, "  "))

})();
