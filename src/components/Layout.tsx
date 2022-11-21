import React from "react";
import Head from "next/head";
import { Flex, Box } from "@chakra-ui/react";
import useWindowSize from "../hooks/useWindowSize";
import Newsbar from "./Newsbar";

const ScreenLayout = ({ children, title = "Flow Sham Bo" }) => {
  // const { width, height } = useWindowSize();

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
        background="black"
        direction="column"
        minHeight="100vh"
        textShadow="0 0 5px #c8c8c8"
        textTransform="uppercase"
      >
        <div id="screen" />
        <div id="scanline" />
        <div id="interlace" />
        <div id="green-light" />
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
    </>
  );
};

export default ScreenLayout;
