import { Command } from "commander";
import { initSdk } from "../../config/runner.ts";

export function getBalances(program: Command) {
  program
    .command("getBalances")
    .description("get total balance of an avatar")
    .argument("<address>", "The address to get the balances for")
    .option("-d, --detail", "print detailed balance breakdown")
    .action(async (address, options: { detail?: boolean }) => {
      const { sdk } = await initSdk();
      const avatar = await sdk.getAvatar(address);
      const totalBalance = await avatar.balances.getTotal();
      const simpleBalance = Number(totalBalance.toString()) / 1e18;

      console.log(`Total Circles balance: ${simpleBalance}`);

      if (options.detail) {
        const tokenBalances = await avatar.balances.getTokenBalances();
        tokenBalances.forEach((balance: any) => {
          console.log(
            `Token: ${balance.tokenAddress}, Balance: ${balance.circles} CRC`,
          );
        });
      }
    });
}