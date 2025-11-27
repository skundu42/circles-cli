import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function untrust(program: Command) {
  program
    .command("untrust")
    .description("Untrust a given address")
    .argument("<address>", "The address to untrust")
    .action(async (address) => {
      const { runner, core, sdk } = await initSdk();
      const avatar = await sdk.getAvatar(runner.address!);

      console.log("Checking current trust status...");
      const isTrusted = await core.hubV2.isTrusted(runner.address!, address);
      console.log(
        `   Current trust status: ${isTrusted ? "TRUSTED" : "NOT TRUSTED"}\n`
      );

      if (!isTrusted) {
        console.log("Address is not currently trusted. No action needed.");
        return;
      }

      console.log("Sending untrust transaction...");
      const txResponse = await avatar.trust.remove(address);
      console.log("Transaction confirmed!");
      console.log(`   Transaction hash: ${txResponse.transactionHash}`);

      console.log("Verifying trust status...");
      const newTrustStatus = await core.hubV2.isTrusted(
        runner.address!,
        address
      );
      console.log(
        `   New trust status: ${newTrustStatus ? "TRUSTED" : "NOT TRUSTED"}\n`
      );

      if (!newTrustStatus) {
        console.log("🎉 Successfully untrusted the address!");
      } else {
        console.log(
          "⚠️  Warning: Address is still trusted. The transaction may need more time to be indexed.\nPlease wait a few moments and check again."
        );
      }
    });
}
