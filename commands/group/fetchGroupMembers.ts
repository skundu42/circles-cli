import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function fetchGroupMembers(program: Command) {
  program
    .command("fetchGroupMembers")
    .description("fetch all current members of a group")
    .argument("<address>", "The group address")
    .action(async (address) =>{
        const {sdk} = await initSdk();
        const addressAvatar = await sdk.getAvatar(address);
        const trustRelations = await addressAvatar.trust.getAll();
        const relations = trustRelations.filter((r) => r.relation === "trusts").map((r) => r.objectAvatar);
        console.log(relations);
    })
}