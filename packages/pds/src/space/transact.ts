import { AppContext } from '../context'

export async function dualWriteTransaction({
  ctx,
  repo,
  actorOps,
  authzOps,
}: {
  ctx: AppContext,
  repo: string,
  // writes: async (actorTxn) => Promise<void>[],
  actorOps: (actorTxn) => Promise<void>,
  authzOps: (spicedbClient) => Promise<void>,
}) {
  // DUAL WRITE PROBLEM
  // errors could occur anywhere in here
  // and we need to unroll or resolve towards eventual consistency
  // (depending on where there error occurs?)
  //
  // The problem exists because data & permissions
  // are stored in different databases,
  // despite that we also write the relationship to our database
  // This should make it easier to have the data & perms in a transaction
  // considerations
  // - we may need soft delete? or we can look for ids in spice that don't exist in the database?
  // - ...forgot the other one right now?
  //
  // this typically happens when creating records
  // or when updating permissions themselves
  // (events which create both a record change and a relation upsert)
  //
  // We do the writes in this order
  // (1) actor db (sqlite)
  // (2) spicedb (service)
  // Since we also store the relation in a record in the actor db.
  // we can later ensure that the relation is created in spicedb as well,
  // should the failure happen between the two writes.

  try {
    await ctx.actorStore.transact(repo, async (actorTxn) => {
      // (1) Write our transaction to the database
      await actorOps(actorTxn)
    })

  } catch (err) {
    console.error('error during actor txn', err)
    throw err
  }

  try {
    // (2) Write our relations to the database
    await authzOps(ctx.spicedbClient)

    // we don't roll back because we run a reconciliation process
    // we should support some form of retry, initiated by the user
    // or they do something which starts a reconcilation process for that data
    // with ownership in spice, the account owners should be able to see everything
    // regardless if an operation fails on some operation under their account
    // (i.e. account has god mode over everything under their root space, made at creation time)

    // the reconciliation process is also scoped to an account
    // so it should be very easy to trigger with an xrpc call (yet to be created)

    // additionally, this error handler could notify the reconcilation system
    // that this account / record / operation should be looked at
    // ... so that we might shorten the loop in eventual consistency
  } catch (err) {
    console.error('error during authz txn', err)
    throw err
  }
}
