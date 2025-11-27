import { Command } from "commander";
import { Core } from "@aboutcircles/sdk-core";

export function IsHuman(program: Command) {
  program
    .command("isHuman")
    .description("Check if a given address is a human")
    .argument("<address>", "The address to check")
    .action(async (address) => {
      const core = new Core();
      const isHuman = await core.hubV2.isHuman(address);
      console.log(isHuman);
    });
}
