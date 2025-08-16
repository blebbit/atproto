import AppContext from "../../../../context";

export function assertSpice(ctx: AppContext) {
  // check that spice is available
  if (!ctx.spicedbClient) {
    throw new Error('SpiceDB client not initialized, spaces are unavailable')
  }
}
