// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import FlowCadencePlugin from "flow-cadence-plugin";

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
    config.module.rules.push({
      test: /\.cdc$/,
      use: "raw-loader",
    });
    config.plugins.push(
      new FlowCadencePlugin({
        network: process.env.NEXT_PUBLIC_FLOW_NETWORK,
      })
    );

    return config;
  },
};

export default config;
