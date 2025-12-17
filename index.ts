import { Command } from "commander";
import { IsHuman } from "./commands/hub/isHuman.ts";
import { trust } from "./commands/trusting/trust.ts";
import { untrust } from "./commands/trusting/untrust.ts";
import { config } from "./commands/config.ts";
import { mint } from "./commands/minting/mint.ts";
import { trustRelations } from "./commands/trusting/trustRelations.ts";
import { getAvatarDetails } from "./commands/avatar/getAvatarDetails.ts";
import {fetchGroupMembers} from "./commands/group/fetchGroupMembers.ts";
import {deployBaseGroup} from "./commands/group/deployBasegroup.ts";
import {getBalances} from "./commands/avatar/getBalances.ts"

const program = new Command();

program.name("circles-cli");
program.version("0.1.0");
program.description("A Comprehensive CLI tool for Circles");

config(program);
IsHuman(program);
trust(program);
untrust(program);
mint(program);
trustRelations(program);
getAvatarDetails(program);
fetchGroupMembers(program);
deployBaseGroup(program);
getBalances(program);

program.parse();
