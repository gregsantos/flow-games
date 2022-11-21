import React from "react";
import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import Newsbar from "./Newsbar";

const ScreenLayout = ({ children, title = "Flow Sham Bo" }) => {
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
            <Flex flex={1}>{children}</Flex>
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
