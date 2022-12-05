import { send, decode, script, args, arg } from "@onflow/fcl";
import { Address } from "@onflow/types";
import IS_ACCOUNT_INITIALIZED_SCRIPT from "./cadence/scripts/is_game_player_configured.cdc";

export async function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false);
  // prettier-ignore
  const isInitalized = await send([
    script(IS_ACCOUNT_INITIALIZED_SCRIPT),
    args([
      arg(address, Address)
    ])
  ]).then(decode)

  return isInitalized;
}
