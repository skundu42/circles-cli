import { Command } from "commander";
import { saveConfig } from "../config/store.ts";
import readline from "readline/promises";

export function config(program: Command) {
  program
    .command("config")
    .description("Configure the CLI with your Private Key and Safe Address")
    .option("-p, --private-key <key>", "Your Private Key")
    .option("-s, --safe-address <address>", "Your Safe Address")
    .option("--password <password>", "Password to encrypt the configuration")
    .action(async (options) => {
      if (!options.privateKey && !options.safeAddress) {
        console.log("Please provide at least one option to configure.");
        return;
      }

      const newConfig: any = {};
      if (options.privateKey) newConfig.privateKey = options.privateKey;
      if (options.safeAddress) newConfig.safeAddress = options.safeAddress;

      let password = options.password;
      if (!password) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        password = await rl.question(
          "Enter a password to encrypt your configuration (leave empty for no encryption): "
        );
        rl.close();
      }

      saveConfig(newConfig, password);
      console.log("Configuration updated successfully!");
    });
}
