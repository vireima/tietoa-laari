import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

interface ENV {
  RAILWAY_BACKEND_PRIVATE_DOMAIN?: string;
  RAILWAY_BACKEND_PUBLIC_DOMAIN?: string;
}

interface Config {
  RAILWAY_BACKEND_PRIVATE_DOMAIN: string;
  RAILWAY_BACKEND_PUBLIC_DOMAIN: string;
}

const getConfig = (): ENV => {
  return {
    RAILWAY_BACKEND_PRIVATE_DOMAIN: process.env.RAILWAY_BACKEND_PRIVATE_DOMAIN,
    RAILWAY_BACKEND_PUBLIC_DOMAIN: process.env.RAILWAY_BACKEND_PUBLIC_DOMAIN,
  };
};

const getSanitizedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
