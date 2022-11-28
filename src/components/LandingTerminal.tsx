import { useRouter } from "next/router";
import useUtils from "../utils";
import { Box } from "@chakra-ui/react";

import { Terminal, useEventQueue, textLine, textWord } from "crt-terminal";
import { HOME_BANNER as banner, GAME_LIST } from "../constants";

export default function LandingTerminal() {
  const router = useRouter();
  const { delay } = useUtils();
  const eventQueue = useEventQueue();
  const { print } = eventQueue.handlers;

  return (
    <Box className="react-terminal">
      <Terminal
        queue={eventQueue}
        banner={[textLine({ words: [textWord({ characters: banner })] })]}
        printer={{ printerSpeed: 20, charactersPerTick: 15 }}
        onCommand={(c) => {
          const command = c.toLowerCase();
          if (command === "help") {
            print([
              textLine({
                words: [
                  textWord({
                    characters: `I would suggest you play Rock Paper Scissors`,
                  }),
                ],
              }),
            ]);
          } else if (command === "lg") {
            print([
              textLine({
                words: [
                  textWord({
                    characters: GAME_LIST,
                  }),
                ],
              }),
            ]);
          } else if (
            ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(command)
          ) {
            if (command === "9") {
              print([
                textLine({
                  words: [
                    textWord({
                      characters:
                        "Wise choice, let's play Rock Paper Scissors!",
                    }),
                  ],
                }),
              ]);
              delay(1500).then(() => router.push("/play/rps"));
            } else {
              print([
                textLine({
                  words: [
                    textWord({
                      characters: `How about a nice game of Rock Paper Scissors?`,
                    }),
                  ],
                }),
              ]);
            }
          } else {
            print([
              textLine({
                words: [
                  textWord({
                    characters: "Please enter a valid command",
                  }),
                ],
              }),
            ]);
          }
        }}
      />
    </Box>
  );
}
