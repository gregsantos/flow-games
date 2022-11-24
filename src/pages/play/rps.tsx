/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Flex, Box, Grid, Stat, StatLabel } from "@chakra-ui/react";
import {
  Terminal,
  useEventQueue,
  textLine,
  textWord,
  commandWord,
} from "crt-terminal";
import useUtils from "../../utils";
import useHooks from "../../hooks";
import ScreenLayout from "../../components/Layout";

const banner = `
Let's Play FLOW SHAM BO!
`;

export default function Play() {
  const [initalized, setInitialized] = useState(false);
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();
  const { loggedIn } = currentUser || {};
  const router = useRouter();
  const { delay } = useUtils();
  const eventQueue = useEventQueue();
  const { print, clear, loading } = eventQueue.handlers;

  useEffect(() => {
    if (!initalized) {
      print([
        textLine({
          words: [
            textWord({
              characters: "Initalizing Puppet Account...",
            }),
          ],
        }),
      ]);
      loading(true);

      delay(3000).then(() => {
        loading(false);
        setInitialized(true);
        print([
          textLine({
            words: [
              textWord({
                characters: "Account Initalized",
              }),
            ],
          }),
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalized]);

  return (
    <ScreenLayout title="Rock Paper Scissors">
      <Box flex={1} overflow="auto">
        <Grid
          minHeight="100%"
          templateRows={[
            "auto auto 250px auto auto",
            "300px 100px minmax(auto, 1fr)",
          ]}
          templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
          templateAreas={[
            `
          "ad ad"
          "i1 i1"
          "m1 m1"
          "b1 b2"
          "b3 b4"       
          `,
            `
          "m1 m1 m1 i1"
          "m1 m1 m1 ad"
          "b1 b2 b3 b4"
          `,
          ]}
        >
          <Grid
            gridArea="i1"
            gridTemplateColumns={["repeat(2, 1fr)", "1fr"]}
            gridTemplateRows={["1fr auto", "auto 1fr"]}
            gridGap={["1", "2"]}
            p={[1, 1, 2]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
          >
            <Flex direction="column" p={[1, 2]}>
              <Stat justifyContent="space-between">
                <StatLabel>Net Worth</StatLabel>
              </Stat>
              <Flex justify="space-between">
                <Box color="green.300">$ per sec</Box>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              align="center"
              justify="center"
              p={[0, 1, 2]}
              color="green.300"
              border="1px solid"
              borderColor="green.300"
            >
              <Box color="green.300">Time till Death</Box>
            </Flex>
            <Flex
              align="center"
              justify="center"
              gridColumn={["1 / span 2", 1]}
            ></Flex>
          </Grid>
          <Flex
            gridArea="ad"
            justify="center"
            p={[0, 1, 2]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          >
            <Flex
              justify="center"
              align="center"
              p={[1, 1, 2]}
              color="green.300"
              border="1px solid"
              borderColor="green.300"
            >
              Ad goes here
            </Flex>
          </Flex>
          <Box gridArea="m1" border="1px solid" borderColor="green.300">
            <div id="react-terminal" style={{ width: "100%", height: "100%" }}>
              <Terminal
                queue={eventQueue}
                banner={[
                  textLine({ words: [textWord({ characters: banner })] }),
                ]}
                onCommand={(command) => {
                  console.log(command);
                  command === "play" &&
                    print([
                      textLine({
                        words: [
                          textWord({
                            characters: "Let's Play Rock Paper Scisscoors",
                          }),
                        ],
                      }),
                    ]);
                  print([
                    textLine({
                      words: [
                        textWord({ characters: "You entered command: " }),
                        commandWord({ characters: command, prompt: ">" }),
                      ],
                    }),
                  ]);
                }}
              />
            </div>
          </Box>
          <Flex
            gridArea="b1"
            minHeight="0"
            minWidth="0"
            direction="column"
            justify="center"
            padding={[1, 2, null, 3]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          ></Flex>
          <Flex
            gridArea="b2"
            minHeight="0"
            minWidth="0"
            direction="column"
            justify="center"
            padding={[1, 2, null, 3]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          ></Flex>
          <Flex
            gridArea="b3"
            minHeight="0"
            minWidth="0"
            direction="column"
            justify="center"
            padding={[1, 2, null, 3]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          ></Flex>
          <Flex
            gridArea="b4"
            minHeight="0"
            minWidth="0"
            direction="column"
            justify="center"
            padding={[1, 2, null, 3]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          ></Flex>
        </Grid>
      </Box>
    </ScreenLayout>
  );
}
