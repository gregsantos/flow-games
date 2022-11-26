import type { ReactNode } from "react";
import React from "react";
import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import Newsbar from "./Newsbar";

interface Props {
  children?: ReactNode;
  title?: string;
}

const ScreenLayout = ({ children, title = "Flow Sham Bo" }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Rock Paper Scissors on the Flow Blockchain"
        />
      </Head>
      <Flex
        id="screen"
        background="black"
        direction="column"
        minHeight="100vh"
        textShadow="0 0 5px #c8c8c8"
        textTransform="uppercase"
      >
        <Flex direction="column" id="green-light">
          <div id="interlace" />
          <div id="scanline" />
          <Flex direction="column" id="envelope">
            <nav>
              <Flex
                height={["0px", "40px", "50px", "60px"]}
                direction="column"
                align="center"
                justify="center"
                p={2}
              >
                <h3>FLOW SHAM BO</h3>
              </Flex>
            </nav>
            <Flex
              id="layout-main-container"
              flex={1}
              position="relative"
              border="red solid 2px"
            >
              {children}
            </Flex>
            <footer>
              <Newsbar />
            </footer>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ScreenLayout;
