import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";
import { HumanAvatar } from "@aboutcircles/sdk";

export function mint(program: Command) {
  program
    .command("mint")
    .description("Mint personal CRC")
    .argument("<address>", "The avatar address to mint for")
    .action(async (address) => {
      const { sdk } = await initSdk();
      const avatar = await sdk.getAvatar(address);

      if (!(avatar instanceof HumanAvatar)) {
        console.log("Error: Only human avatars can mint personal tokens");
        return;
      }
      const mintableInfo = await avatar.personalToken.getMintableAmount();
      const mintableInCircles = Number(mintableInfo.amount) / 1e18;

      console.log(`Mintable amount: ${mintableInCircles.toFixed(4)} CRC`);
      if (mintableInfo.amount === 0n) {
        console.log("No tokens available to mint");
        return;
      }

      console.log("Minting personal tokens...");
      const txResponse = await avatar.personalToken.mint();
      console.log("Tokens minted successfully!");
      console.log(`Transaction hash: ${txResponse.transactionHash}`);
    });
}
