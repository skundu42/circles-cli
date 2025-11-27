import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function trust(program: Command) {
  program
    .command("trust")
    .description("Trust a given address")
    .argument("<address>", "The address to trust")
    .action(async (address) => {
      const { runner, core } = await initSdk();
      console.log("Checking current trust status...");
      const isTrusted = await core.hubV2.isTrusted(runner.address!, address);
      console.log(
        `   Current trust status: ${isTrusted ? "TRUSTED" : "NOT TRUSTED"}\n`
      );

      if (isTrusted) {
        console.log("Address is already trusted. No action needed.");
        return;
      }
      const tx = core.hubV2.trust(
        address,
        BigInt("79228162514264337593543950335")
      );

      console.log("Sending trust transaction...");
      const txResponse = await runner.sendTransaction!([tx]);
      console.log("Transaction sent!");
      console.log(`   Transaction hash: ${txResponse.transactionHash}`);

      console.log("Verifying trust...");
      const newTrustStatus = await core.hubV2.isTrusted(
        runner.address!,
        address
      );
      console.log(
        `   New trust status: ${newTrustStatus ? "TRUSTED" : "NOT TRUSTED"}\n`
      );

      if (newTrustStatus) {
        console.log("🎉 Successfully trusted the address!");
      } else {
        console.log(
          "⚠️  Warning: Address is not trusted yet. The transaction may need more time to be processed."
        );
      }
    });
}
