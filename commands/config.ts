import { Command } from "commander";
import { saveConfig } from "../config/store.ts";
import { readHiddenPassword } from "../config/passwordInput.ts";
import readline from "readline/promises";

const MIN_PASSWORD_LENGTH = 6;

export function config(program: Command) {
  program
    .command("config")
    .description("Configure the CLI with your Private Key and Safe Address")
    .action(async () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.log("Configure your Circles CLI\n");
      const privateKey = await readHiddenPassword("Enter your Private Key: ");

      if (!privateKey || privateKey.length === 0) {
        console.log("Error: Private key is required.");
        rl.close();
        return;
      }
      const safeAddress = await rl.question("Enter your Safe Address: ");
      rl.close();

      if (!safeAddress || safeAddress.length === 0) {
        console.log("Error: Safe address is required.");
        return;
      }

      const newConfig: any = {
        privateKey,
        safeAddress,
      };

      const password = await readHiddenPassword(
        "Enter a password to encrypt your configuration (min 6 characters): "
      );

      if (password.length > 0 && password.length < MIN_PASSWORD_LENGTH) {
        console.log(
          `Error: Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
        );
        return;
      }

      saveConfig(newConfig, password);
      console.log("\nConfiguration updated successfully!");
    });
}
