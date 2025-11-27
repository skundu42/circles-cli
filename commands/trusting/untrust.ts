import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function untrust(program: Command) {
  program
    .command("untrust")
    .description("Untrust a given address")
    .argument("<address>", "The address to untrust")
    .action(async (address) => {
      const { runner, core } = await initSdk();

      console.log("🔍 Checking current trust status...");
      const isTrusted = await core.hubV2.isTrusted(runner.address!, address);
      console.log(
        `   Current trust status: ${isTrusted ? "TRUSTED" : "NOT TRUSTED"}\n`
      );

      if (!isTrusted) {
        console.log("ℹ️  Address is not currently trusted. No action needed.");
        return;
      }

      console.log("📝 Creating untrust transaction...");
      const tx = core.hubV2.trust(address, BigInt(0));

      console.log("   Transaction details:");
      console.log(`   - To: ${tx.to}`);
      console.log(`   - Data: ${tx.data}`);
      console.log(`   - Value: ${tx.value || 0}\n`);

      console.log("🚀 Sending untrust transaction...");
      const txResponse = await runner.sendTransaction!([tx]);
      console.log("✅ Transaction sent!");
      console.log(`   Transaction hash: ${txResponse.transactionHash}`);
      console.log(`   Block number: ${txResponse.blockNumber}`);
      console.log(`   Block hash: ${txResponse.blockHash}\n`);

      console.log("🔍 Verifying untrust...");
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
          "⚠️  Warning: Address is still trusted. The transaction may need more time to be processed."
        );
      }
    });
}
