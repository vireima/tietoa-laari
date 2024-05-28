// import dotenv from "dotenv";

import { ActionIconProps } from "@mantine/core";

// dotenv.config();

interface ENV {
  API_URL?: string;
}

interface Config {
  API_URL: string;
}

const getConfig = (): ENV => {
  return {
    API_URL: process.env.API_URL,
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

// Visual config

export const actionIconProps: ActionIconProps = {
  variant: "filled",
  size: "sm",
};

export const iconProps = {
  stroke: 1.3,
  size: "1rem",
};
