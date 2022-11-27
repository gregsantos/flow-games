import type { ReactNode } from "react";
import React from "react";
import Head from "next/head";
import { Flex, Box } from "@chakra-ui/react";
import Newsbar from "./Newsbar";
import useHooks from "../hooks";

interface Props {
  children?: ReactNode;
  title?: string;
}

export default function ScreenLayout({
  children,
  title = "Flow Games",
}: Props) {
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();

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
                direction="row"
                align="center"
                justify="flex-end"
                p={6}
              >
                <Box>{currentUser?.addr}</Box>
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
}
