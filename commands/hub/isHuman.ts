import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function IsHuman(program: Command) {
  program
    .command("isHuman")
    .description("Check if a given address is a human")
    .argument("<address>", "The address to check")
    .action(async (address) => {
      const { core } = await initSdk();
      const isHuman = await core.hubV2.isHuman(address);
      if (isHuman) {
        console.log("Address is a Circles Human");
      } else {
        console.log("Address is not a Circles Human");
      }
    });
}
