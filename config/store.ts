import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const CONFIG_FILE = path.join(os.homedir(), ".circles-cli.json");

export interface Config {
  privateKey?: string;
  safeAddress?: string;
}

export interface EncryptedConfig {
  encrypted: boolean;
  iv: string;
  salt: string;
  authTag: string;
  data: string;
}

function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.scryptSync(password, salt, 32);
}

export function encrypt(data: string, password: string): EncryptedConfig {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = deriveKey(password, salt);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return {
    encrypted: true,
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
    authTag: authTag.toString("hex"),
    data: encrypted,
  };
}

export function decrypt(
  encryptedConfig: EncryptedConfig,
  password: string
): string {
  const salt = Buffer.from(encryptedConfig.salt, "hex");
  const iv = Buffer.from(encryptedConfig.iv, "hex");
  const authTag = Buffer.from(encryptedConfig.authTag, "hex");
  const key = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedConfig.data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function loadConfigRaw(): Config | EncryptedConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.warn("Failed to load config:", error);
    return {};
  }
}

export function saveConfig(config: Config, password?: string) {
  let dataToSave: Config | EncryptedConfig = config;

  if (password) {
    const jsonString = JSON.stringify(config);
    dataToSave = encrypt(jsonString, password);
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(dataToSave, null, 2));
  console.log(`Configuration saved to ${CONFIG_FILE}`);
}
