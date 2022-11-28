/* eslint-disable @typescript-eslint/no-empty-function */
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
import { ROCK_ASCII } from "../../constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commands: any = {
  r: "rock",
  p: "paper",
  s: "scissors",
  rock: "rock",
  paper: "paper",
  scissors: "scissors",
};
const banner = `
Let's Play FLOW SHAM BO!
`;

const initBanner = `

Welcome to FLOW SHAM BO!
Initalizing Account for Gameplay...
`;

const gameLogo = `
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
You have entered the game!
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
  const [lastWinner, setLastWinner] = useState<number | null>(null);
  const [locked, setLocked] = useState(true);
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();
  const { loggedIn } = currentUser || { loggedIn: null };
  const router = useRouter();
  const { delay } = useUtils();
  const eventQueue = useEventQueue();
  const eventQueue2 = useEventQueue();
  const eventQueue3 = useEventQueue();

  const { print, clear, loading, lock, focus } = eventQueue.handlers;
  const {
    print: printTerm2,
    clear: clearTerm2,
    loading: loadingTerm2,
    lock: lockTerm2,
  } = eventQueue2.handlers;
  const {
    print: printTerm3,
    clear: clearTerm3,
    loading: loadingTerm3,
    lock: lockTerm3,
  } = eventQueue3.handlers;

  const initAccount = async () => {
    print([
      textLine({
        words: [
          textWord({
            characters: initBanner,
          }),
        ],
      }),
    ]);
    print([
      textLine({
        words: [
          textWord({
            characters: gameLogo,
          }),
        ],
      }),
    ]);
    await delay(5000);
    setInitialized(true);
  };

  const initGame = async () => {
    print([
      textLine({
        words: [
          textWord({
            characters: welcomeBanner,
          }),
        ],
      }),
    ]);
    await delay(1000);
    loading(true);
    await delay(2000);
    loading(false);
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
    toggleLocked();
  };

  useEffect(() => {
    lock(locked);
    console.log("inital locked", locked);
    if (initalized) {
      initGame();
    } else {
      initAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalized]);

  const handleEndgame = async (command: string) => {
    delay(500).then(() => {
      printTerm3([
        textLine({
          words: [
            textWord({
              characters: "Player 2 Move",
            }),
          ],
        }),
      ]);
    });
    // get P2's move and determine winner
    // print winner
    // print play again?
    function randomIntFromInterval(min: number, max: number) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const winner = randomIntFromInterval(0, 1);
    setLastWinner(winner);
    delay(1000).then(() => {
      clear();
      lock(true);
      if (winner === 0) {
        print([
          textLine({
            words: [
              textWord({
                characters: `You Played ${commands[command]} and Won!`,
              }),
            ],
          }),
        ]);
      } else {
        print([
          textLine({
            words: [
              textWord({
                characters: `You Played ${commands[command]} and Lost!`,
              }),
            ],
          }),
        ]);
      }
      delay(1500).then(() => {
        print([
          textLine({
            words: [
              textWord({
                characters: `Shall we play again?`,
              }),
            ],
          }),
        ]);
        delay(2000).then(() => {
          clearTerm3();
          clearTerm2();
          delay(1000).then(() => {
            lock(false);
          });
        });
      });
      toggleLocked();
    });
  };

  const handleMoves = async (command: string) => {
    switch (command) {
      case "r":
      case "rock":
        printTerm2([
          textLine({
            words: [
              textWord({
                characters: ROCK_ASCII,
              }),
            ],
          }),
        ]);
        break;
      case "p":
      case "paper":
        printTerm2([
          textLine({
            words: [
              textWord({
                characters: "PAPER",
              }),
            ],
          }),
        ]);
        break;
      case "s":
      case "scissors":
        printTerm2([
          textLine({
            words: [
              textWord({
                characters: "SCISSORS",
              }),
            ],
          }),
        ]);
        break;
      default:
        break;
    }
  };

  const toggleLocked = () => {
    console.log("toggle locked", locked);
    locked ? lock(false) : lock(true);
    setLocked((locked) => !locked);
    console.log("locked", !locked);
  };

  const handleThrow = async (command: string) => {
    clear();
    toggleLocked();

    await handleMoves(command);
    await handleEndgame(command);
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
              <Button size={["sm", "md", "lg"]} variant="outline">
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
              <Button
                value="rock"
                onClick={(e) =>
                  handleThrow((e.target as HTMLTextAreaElement).value)
                }
                size={["sm", "md", "lg"]}
                variant="outline"
                disabled={locked}
              >
                Rock
              </Button>
              <Button
                value="paper"
                onClick={(e) =>
                  handleThrow((e.target as HTMLTextAreaElement).value)
                }
                size={["sm", "md", "lg"]}
                variant="outline"
                disabled={locked}
              >
                Paper
              </Button>
              <Button
                value="scissors"
                onClick={(e) =>
                  handleThrow((e.target as HTMLTextAreaElement).value)
                }
                size={["sm", "md", "lg"]}
                variant="outline"
                disabled={locked}
              >
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
            <div className="react-terminal">
              <Terminal
                queue={eventQueue}
                effects={{ scanner: false }}
                printer={{ printerSpeed: 20, charactersPerTick: 5 }}
                onCommand={(command1) => {
                  clear();
                  const c = command1.toLowerCase();
                  if (
                    ["r", "p", "s", "rock", "paper", "scissors"].includes(c)
                  ) {
                    handleThrow(c);
                  } else {
                    print([
                      textLine({
                        words: [
                          textWord({
                            characters: `Invalid command: ${command1}`,
                          }),
                        ],
                      }),
                    ]);
                  }
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
              <div className="react-terminal">
                <Terminal
                  queue={eventQueue2}
                  prompt={""}
                  cursorSymbol=""
                  effects={{ scanner: false }}
                  printer={{ printerSpeed: 10, charactersPerTick: 5 }}
                  focusOnMount={false}
                  onCommand={() => {}}
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
              <div className="react-terminal">
                <Terminal
                  queue={eventQueue3}
                  prompt=""
                  cursorSymbol=""
                  printer={{ printerSpeed: 10, charactersPerTick: 5 }}
                  effects={{ scanner: false }}
                  focusOnMount={false}
                  onCommand={() => {}}
                />
              </div>
            </Flex>
          </Flex>
        </Grid>
      </Box>
    </ScreenLayout>
  );
}
