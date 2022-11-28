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

const gameBanner = `

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
  const [submittingMove, setSubmittingMove] = useState(false);
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();
  const { loggedIn } = currentUser || { loggedIn: null };
  const router = useRouter();
  const { delay } = useUtils();
  const eventQueue1 = useEventQueue();
  const eventQueue2 = useEventQueue();
  const eventQueue3 = useEventQueue();

  const { print, clear, loading, lock, focus } = eventQueue1.handlers;
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
        lock(false);
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
      delay(2500).then(() => {
        print([
          textLine({
            words: [
              textWord({
                characters: gameLogo,
              }),
            ],
          }),
        ]);
      });
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

  const handleEndgame = (command: string) => {
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
        lock(false);
        setSubmittingMove(false);
      });
    });
  };

  const handleThrow = (command: string) => {
    setSubmittingMove(true);
    clearTerm2();
    lock(true);

    switch (command) {
      case "r":
      case "rock":
        printTerm2([
          textLine({
            words: [
              textWord({
                characters: "ROCK",
              }),
            ],
          }),
        ]);
        clear();
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
        clear();
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
        clear();
        break;
      default:
        break;
    }
    handleEndgame(command);
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
                disabled={submittingMove}
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
                disabled={submittingMove}
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
                disabled={submittingMove}
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
                queue={eventQueue1}
                effects={{ scanner: false }}
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
                  focusOnMount={false}
                  onCommand={(c2) => clearTerm2()}
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
                  effects={{ scanner: false }}
                  focusOnMount={false}
                  onCommand={(c3) => {}}
                />
              </div>
            </Flex>
          </Flex>
        </Grid>
      </Box>
    </ScreenLayout>
  );
}
