import { Command } from "commander";
import { IsHuman } from "./commands/hub/isHuman.ts";
import { trust } from "./commands/trusting/trust.ts";
import { untrust } from "./commands/trusting/untrust.ts";
import { config } from "./commands/config.ts";
import { mint } from "./commands/minting/mint.ts";

const program = new Command();

program.name("circles-cli");
program.version("0.1.0");
program.description("A Comprehensive CLI tool for Circles");

config(program);
IsHuman(program);
trust(program);
untrust(program);
mint(program);

program.parse();
