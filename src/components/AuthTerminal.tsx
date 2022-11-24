import * as fcl from "@onflow/fcl";

import { Terminal, useEventQueue, textLine, textWord } from "crt-terminal";

const banner = `
ENTER AUTHORIZATION CODE TO CONTINUE:
`;

export default function LandingTerminal() {
  const eventQueue = useEventQueue();
  const { print, focus } = eventQueue.handlers;

  console.log("Auth");

  return (
    <div id="react-terminal">
      <Terminal
        queue={eventQueue}
        banner={[textLine({ words: [textWord({ characters: banner })] })]}
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
    </div>
  );
}
