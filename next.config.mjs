// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import CadencePlugin from "cadence-webpack-plugin";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */

const config = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config) => {
    config.plugins.push(new CadencePlugin());

    return config;
  },
};
/*
module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config) => {
    config.plugins.push(
      new FlowCadencePlugin({
        network: process.env.FLOW_NETWORK,
        deployOnChange: true,
        update: true,
      })
    );

    return config;
  },
}; */
export default config;
