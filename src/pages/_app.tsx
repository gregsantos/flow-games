import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../../theme";
import { AppContext } from "../contexts";
import { trpc } from "../utils/trpc";
import { type AppType } from "next/app";

import "../styles/globals.scss";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppContext>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AppContext>
    </>
  );
};

export default trpc.withTRPC(MyApp);
