import "dotenv/config";
import { SafeContractRunner } from "@aboutcircles/sdk-runner";
import { createPublicClient, http } from "viem";
import { gnosis } from "viem/chains";
import {
  loadConfigRaw,
  decrypt,
  type Config,
  type EncryptedConfig,
} from "./store.ts";
import { Core } from "@aboutcircles/sdk-core";
import { readHiddenPassword } from "./passwordInput.ts";

export const publicClient = createPublicClient({
  chain: gnosis,
  transport: http("https://rpc.gnosischain.com"),
});

export async function initSdk() {
  const configRaw = loadConfigRaw();
  let config: Config = {};

  if ("encrypted" in configRaw && configRaw.encrypted) {
    const password = await readHiddenPassword(
      "Enter password to decrypt configuration: "
    );

    try {
      const decryptedJson = decrypt(configRaw as EncryptedConfig, password);
      config = JSON.parse(decryptedJson);
    } catch (error) {
      throw new Error("Failed to decrypt configuration. Wrong password?");
    }
  } else {
    config = configRaw as Config;
  }

  const PK = process.env.PRIVATE_KEY || config.privateKey;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS || config.safeAddress;

  if (!PK) {
    throw new Error(
      "Private Key is missing. Please set it in .env or run 'circles-cli config --private-key <key>'"
    );
  }

  const runner = new SafeContractRunner(
    publicClient,
    PK,
    "https://rpc.gnosischain.com",
    SAFE_ADDRESS
  );

  await runner.init();
  const core = new Core();
  return { runner, core };
}
