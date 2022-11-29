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
import { Terminal, useEventQueue, textLine, textWord } from "crt-terminal";
import useUtils from "../../utils";
import useHooks from "../../hooks";
import ScreenLayout from "../../components/ScreenLayout";
import { BANNERS } from "../../constants";

interface GameState {
  scores: [number, number, number];
  results: [number, number, number];
  winner: number;
}

interface GameResults {
  p: string | undefined;
  c: string | undefined;
}

interface Scores {
  p: number;
  c: number;
  t: number;
}

interface ThrowValue {
  beats: string;
  imgUrl: string;
}

interface Throws {
  r: ThrowValue;
  p: ThrowValue;
  s: ThrowValue;
}

const lookupRPS = ["r", "p", "s"];

const rps: Throws = {
  r: {
    beats: "s",
    imgUrl: "imgs/rock.png",
  },
  p: {
    beats: "r",
    imgUrl: "imgs/paper.png",
  },
  s: {
    beats: "p",
    imgUrl: "imgs/scissors.png",
  },
};

const initialState = { count: 0, scores: [], results: [], winner: null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commands: any = {
  r: "rock",
  p: "paper",
  s: "scissors",
};

export default function Play() {
  const [initalized, setInitialized] = useState(false);
  const [lastWinner, setLastWinner] = useState<number | null>(null);
  const [locked, setLocked] = useState(true);
  // const { gameState, setGameState } = useState<GameState>({} as GameState);
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [scores, setScores] = useState<Scores>({
    p: 0,
    c: 0,
    t: 0,
  });
  const [results, setResults] = useState<GameResults>({} as GameResults);
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

  function getWinner() {
    return results.p === results.c
      ? "t"
      : rps[results.p as keyof Throws].beats === results.c
      ? "p"
      : "c";
  }

  function calculateWinner() {
    function getRandomIdx() {
      return Math.floor(Math.random() * 3);
    }
    const p = lookupRPS[getRandomIdx()];
    const c = lookupRPS[getRandomIdx()];
    setResults({ p, c });
    const winner = getWinner();
    setScores((scores) => scores);
    scores[winner]++;
  }

  const initAccount = async () => {
    try {
      print([
        textLine({
          words: [
            textWord({
              characters: BANNERS.INIT,
            }),
          ],
        }),
      ]);
      print([
        textLine({
          words: [
            textWord({
              characters: BANNERS.GAME_LOGO,
            }),
          ],
        }),
      ]);
      // initialize Users Flow account
      const accountInitalized = await delay(5000).then(() => true);
      if (accountInitalized) {
        console.log("Account Successfully Initalized");
        print([
          textLine({
            words: [
              textWord({
                characters: "Account Successfully Initalized",
              }),
            ],
          }),
        ]);
        joinOrCreateGame();
      }
    } catch (error) {
      console.log("Error Initializing Account", error);
    }
  };

  const initGame = async () => {
    loading(true);
    await delay(1500).then(() => {
      console.log("client successfully initialized new game");
      return true;
    });
  };

  const joinOrCreateGame = async () => {
    print([
      textLine({
        words: [
          textWord({
            characters: BANNERS.WELCOME,
          }),
        ],
      }),
    ]);
    await initGame();
    loading(false);
    await delay(1500);
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
            characters: BANNERS.SUBMIT,
          }),
        ],
      }),
    ]);
    lock(false);
    toggleDisableButtons();
  };

  const checkAccountInitialized = async () => {
    try {
      return await delay(1000).then(() => false);
    } catch (error) {
      console.log("Error Checking Account Initialized", error);
    }
  };

  useEffect(() => {
    console.log("initialized", initalized, "locked", locked);
    lock(locked);
    const initializeGame = async () => {
      const initalized = await checkAccountInitialized();

      if (!initalized) {
        await initAccount();
      } else {
        joinOrCreateGame();
      }
    };

    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndgame = async (command: string) => {
    // get P2's move and determine winner
    // print winner
    // print play again?
    function randomIntFromInterval(min: number, max: number) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const winner = randomIntFromInterval(0, 1);
    setLastWinner(winner);
    //clear();
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
        toggleDisableButtons();
      });
    });
    /*     delay(1000).then(() => {
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
      toggleDisableButtons();
    }); */
  };

  const toggleDisableButtons = () => {
    setLocked((locked) => !locked);
  };

  const printP1Move = async (command: string) => {
    printTerm2([
      textLine({
        words: [
          textWord({
            characters: BANNERS.PAPER_ASCII,
          }),
        ],
      }),
    ]);
  };

  const printP2Move = async (command: string) => {
    printTerm3([
      textLine({
        words: [
          textWord({
            characters: BANNERS.ROCK_ASCII,
          }),
        ],
      }),
    ]);
  };

  const handleThrow = async (command: string) => {
    clear();
    lock(true);
    toggleDisableButtons();
    await printP1Move(command);
    await delay(2000);
    await printP2Move(command);
    await delay(2000);
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
                value="r"
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
                value="p"
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
                value="s"
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
                  const c = command1.toLowerCase();
                  if (["r", "p", "s"].includes(c)) {
                    handleThrow(c);
                    clear();
                    lock(true);
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
