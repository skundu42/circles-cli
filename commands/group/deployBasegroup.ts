import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function deployBaseGroup(program: Command) {
  program
    .command("deployBasegroup")
    .description("deploy a base group")
    .argument("<name>", "The name of the group")
    .argument("<description>", "The description of the group")
    .action(async (name: string, description: string) => {
      const { sdk, runner } = await initSdk();
      
      if (!runner.address) {
        throw new Error("Runner address is not available");
      }

      const profileCid = await sdk.profiles.create({
        name,
        description,
      });

      const symbol = name.toUpperCase().slice(0, 19);

      const group = await sdk.register.asGroup(
        runner.address, 
        runner.address, 
        runner.address, 
        [], 
        name,
        symbol,
        profileCid
      );
      
      console.log("Group deployed successfully!");
      console.log("Group address:", group.address);
      console.log("Group name:", name);
      console.log("Group symbol:", symbol);
    });
}


