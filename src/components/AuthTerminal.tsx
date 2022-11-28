import * as fcl from "@onflow/fcl";
import { Terminal, useEventQueue, textLine, textWord } from "crt-terminal";
import { Box } from "@chakra-ui/react";

const banner = `
AUTHENTICATION REQUIRED.
ENTER "c" TO CONNECT WALLET AND CONTINUE.
`;

export default function LandingTerminal() {
  const eventQueue = useEventQueue();
  const { print, focus } = eventQueue.handlers;

  return (
    <Box className="react-terminal">
      <Terminal
        queue={eventQueue}
        banner={[textLine({ words: [textWord({ characters: banner })] })]}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onCommand={async (command) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const res: any = await fcl.authenticate();
          if (!res?.loggedIn) {
            print([
              textLine({
                words: [
                  textWord({ characters: "** AUTHENTICATION CANCELLED **" }),
                ],
              }),
            ]);
            focus();
          }
        }}
      />
    </Box>
  );
}
