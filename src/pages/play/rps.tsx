/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Box,
  Grid,
  Stat,
  StatLabel,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  Terminal,
  useEventQueue,
  textLine,
  textWord,
  commandWord,
} from "crt-terminal";
import useUtils from "../../utils";
import useHooks from "../../hooks";
import ScreenLayout from "../../components/ScreenLayout";

const banner = `
Let's Play FLOW SHAM BO!
`;

const gameBanner = `
Welcome to FLOW SHAM BO!
Initalizing Account for Gameplay...

⠀⠀⠀⠀⠀⣠⡴⠖⠒⠲⠶⢤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠖⠒⢶⣄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⡾⠁⠀⣀⠔⠁⠀⠀⠈⠙⠷⣤⠦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠋⠀⠀⠀⢀⡿⠀⠀⠀⠀⠀⠀⠀
⣠⠞⠛⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠘⢧⠈⢿⡀⢠⡶⠒⠳⠶⣄⠀⠀⠀⠀⠀⣴⠟⠁⠀⠀⠀⣰⠏⠀⢀⣤⣤⣄⡀⠀⠀
⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠛⠛⠃⠸⡇⠈⣇⠸⡇⠀⠀⠀⠘⣇⠀⠀⣠⡾⠁⠀⠀⠀⢀⣾⣣⡴⠚⠉⠀⠀⠈⠹⡆⠀
⣹⡷⠤⠤⠤⠄⠀⠀⠀⠀⢠⣤⡤⠶⠖⠛⠀⣿⠀⣿⠀⢻⡄⠀⠀⠀⢻⣠⡾⠋⠀⠀⠀⠀⣠⡾⠋⠁⠀⠀⠀⠀⢀⣠⡾⠃⠀
⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡤⠖⠋⢀⣿⣠⠏⠀⠀⣿⠀⠀⠀⠘⠉⠀⠀⠀⠀⠀⡰⠋⠀⠀⠀⠀⠀⣠⠶⠋⠁⠀⠀⠀
⢿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠁⠀⠀⠠⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠁⠀⠀⠀⢀⣴⡿⠥⠶⠖⠛⠛⢶⡄
⠀⠉⢿⡋⠉⠉⠁⠀⠀⠀⠀⠀⢀⣠⠾⠋⠀⠀⠀⠀⢀⣰⡇⠀⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⢀⣠⠼⠃
⠀⠀⠈⠛⠶⠦⠤⠤⠤⠶⠶⠛⠋⠁⠀⠀⠀⠀⠀⠀⣿⠉⣇⠀⡴⠟⠁⣠⡾⠃⠀⠀⠀⠀⠀⠈⠀⠀⠀⣀⣤⠶⠛⠉⠀⠀⠀
⠀⠀⠀⠀⢀⣠⣤⣀⣠⣤⠶⠶⠒⠶⠶⣤⣀⠀⠀⠀⢻⡄⠹⣦⠀⠶⠛⢁⣠⡴⠀⠀⠀⠀⠀⠀⣠⡶⠛⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⡴⠋⣠⠞⠋⠁⠀⠀⠀⠀⠙⣄⠀⠙⢷⡀⠀⠀⠻⣄⠈⢷⣄⠈⠉⠁⠀⠀⠀⢀⣠⡴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⡾⠁⣴⠋⠰⣤⣄⡀⠀⠀⠀⠀⠈⠳⢤⣼⣇⣀⣀⠀⠉⠳⢤⣭⡿⠒⠶⠶⠒⠚⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢸⠃⢰⠇⠰⢦⣄⡈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠛⠛⠓⠲⢦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠸⣧⣿⠀⠻⣤⡈⠛⠳⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠈⠹⣆⠀⠈⠛⠂⠀⠀⠀⠀⠀⠀⠈⠐⠒⠒⠶⣶⣶⠶⠤⠤⣤⣠⡼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠹⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠳⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠻⣦⣀⠀⠀⠀⠀⠐⠲⠤⣤⣀⡀⠀⠀⠀⠀⠀⠉⢳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠶⠤⠤⠤⠶⠞⠋⠉⠙⠳⢦⣄⡀⠀⠀⠀⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠳⠦⠾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

`;

const welcomeBanner = `
Welcome to the game!
Awaiting Player 2
`;

const submitBanner = `
Submit your move!
r = rock
p = paper
s = scissors
`;

export default function Play() {
  const [initalized, setInitialized] = useState(false);
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();
  const { loggedIn } = currentUser || {};
  const router = useRouter();
  const { delay } = useUtils();
  const eventQueue = useEventQueue();
  const eventQueue2 = useEventQueue();
  const eventQueue3 = useEventQueue();

  const { print, clear, loading } = eventQueue.handlers;
  const {
    print: print2,
    clear: clear2,
    loading: loading2,
  } = eventQueue2.handlers;
  const {
    print: print3,
    clear: clear3,
    loading: loading3,
  } = eventQueue3.handlers;

  useEffect(() => {
    if (initalized) {
      print([
        textLine({
          words: [
            textWord({
              characters: welcomeBanner,
            }),
          ],
        }),
      ]);
      loading(true);
      delay(2500).then(() => {
        loading(false);
        clear();
        print([
          textLine({
            words: [
              textWord({
                characters: `Player 2 has joined the game!`,
              }),
            ],
          }),
        ]);
        print([
          textLine({
            words: [
              textWord({
                characters: submitBanner,
              }),
            ],
          }),
        ]);
      });
    } else {
      print([
        textLine({
          words: [
            textWord({
              characters: gameBanner,
            }),
          ],
        }),
      ]);
      delay(7500).then(() => {
        print([
          textLine({
            words: [
              textWord({
                characters: "Account Initalized!",
              }),
            ],
          }),
        ]);
        delay(1500).then(() => {
          clear();
          setInitialized(true);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalized]);

  const getBanner = () => {
    if (!initalized) {
      return "Initalizing Account for Gameplay";
    } else {
      return gameBanner;
    }
  };

  return (
    <ScreenLayout title="Rock Paper Scissors">
      <Box flex={1}>
        <Grid
          minHeight="100%"
          templateRows={[
            "auto auto 250px auto auto",
            "300px 100px 100px minmax(auto, 1fr)",
          ]}
          templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
          templateAreas={[
            `
          "ad ad"
          "i1 i1"
          "m1 m1"
          "b1 b2"
          "b3 b3"       
          `,
            `
          "m1 m1 m1 i1"
          "m1 m1 m1 i1"
          "b3 b3 b3 ad"
          "b1 b1 b2 b2"
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
                <StatLabel>High Score</StatLabel>
              </Stat>
              <Flex justify="space-between">
                <Box color="green.300">0x1234</Box>
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
              <Box color="green.300">Awaiting Opponent...</Box>
            </Flex>
            <Flex
              align="center"
              justify="center"
              gridColumn={["1 / span 2", 1]}
            />
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
            >
              <Button size="lg" variant="outline">
                Main Menu
              </Button>
            </Flex>
          </Flex>
          <Flex
            gridArea="b3"
            justify={["center"]}
            align={["center"]}
            p={[0, 1, 2]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          >
            <ButtonGroup gap="8">
              <Button size="lg" variant="outline">
                Rock
              </Button>
              <Button size="lg" variant="outline">
                Paper
              </Button>
              <Button size="lg" variant="outline">
                Scissors
              </Button>
            </ButtonGroup>
          </Flex>
          <Flex
            gridArea="m1"
            border="1px solid"
            borderColor="green.300"
            position="relative"
          >
            <div id="react-terminal">
              <Terminal
                queue={eventQueue}
                effects={{ scanner: false }}
                onCommand={(command) => {
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
          </Flex>
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
          >
            <Flex flex={1} position="relative">
              <div id="react-terminal">
                <Terminal
                  queue={eventQueue2}
                  prompt=""
                  cursorSymbol=""
                  effects={{ scanner: false }}
                  onCommand={(command) => {
                    console.log("command", command);
                  }}
                />
              </div>
            </Flex>
          </Flex>
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
          >
            <Flex flex={1} position="relative">
              <div id="react-terminal">
                <Terminal
                  queue={eventQueue3}
                  prompt=""
                  cursorSymbol=""
                  effects={{ scanner: false }}
                  onCommand={(command) => {
                    console.log("command", command);
                  }}
                />
              </div>
            </Flex>
          </Flex>
        </Grid>
      </Box>
    </ScreenLayout>
  );
}
