import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function trustRelations(program: Command) {

    const trustRelationsCmd =program
        .command("trustRelations")
        .description("trust relations for a given address")
        
        trustRelationsCmd
        .command("getAll")
        .description("get all trust relations for a given address")
        .argument("<address>", "The address to fetch trust relations for")
        .action(async (address) => {
            const { sdk } = await initSdk(); 
            const addressAvatar = await sdk.getAvatar(address);
            const trustRelations = await addressAvatar.trust.getAll();
            console.log(trustRelations);
        });

        trustRelationsCmd
        .command("isTrustedBy")
        .description("check if a given address is trusted by another address")
        .argument("<address>", "The address to check if it is trusted by another address")
        .argument("<trustedBy>", "The address to check if it is trusted by")
        .action(async (address, trustedBy) => {
            const { sdk } = await initSdk();
            const addressAvatar = await sdk.getAvatar(address);
            const isTrusted = await addressAvatar.trust.isTrustedBy(trustedBy);
            console.log(isTrusted);

        trustRelationsCmd
        .command("isTrusted")
        .description("check if a given address is trusted by another address")
        .argument("<address>", "The address to check if it is trusting another address")
        .argument("<isTrusting>", "The address to check against")
        .action(async (address, isTrusting) => {
            const { sdk } = await initSdk();
            const addressAvatar = await sdk.getAvatar(address);
            const isTrusted = await addressAvatar.trust.isTrusting(isTrusting);
            console.log(isTrusted);
        });
    });
 
}
