import { Command } from "commander";
import { SdkError } from "@aboutcircles/sdk";
import { initSdk } from "../../config/runner.ts";

export function getAvatarDetails(program: Command) {
  program
    .command("getAvatarDetails")
    .description("get the details of a given address")
    .argument("<address>", "The address to get the details of")
    .action(async (address) => {
      try {
        const { sdk, core } = await initSdk();
        const avatar = await sdk.getAvatar(address);
        const avatarDetails = avatar.avatarInfo?.cidV0?.toString();
        if (!avatarDetails) {
          console.error(
            "Could not retrieve avatar details (cidV0 is missing)."
          );
          return;
        }
        console.log("IPFS CID: ", avatarDetails);
        const profile = await sdk.profiles.get(avatarDetails);
        const name = profile?.name;
        const description = profile?.description;
        let x: string;
        if (await core.hubV2.isHuman(address)) {
          x = "Human";
        } else if (await core.hubV2.isOrganization(address)) {
          x = "Organization";
        } else if (await core.hubV2.isGroup(address)) {
          x = "Group";
        } else {
          x = "Unknown";
        }
        console.log({ name, description, type: x });
      } catch (error) {
        if (error instanceof SdkError && error.code === "SDK_AVATAR_NOT_FOUND") {
          console.error(
            `Avatar not found for address ${address}. Make sure the address is registered.`
          );
          return;
        }
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Failed to fetch avatar details:", message);
        process.exitCode = 1;
      }
    });
}
