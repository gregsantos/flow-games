import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../../theme";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import "../styles/globals.scss";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
