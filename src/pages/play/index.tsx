import { useRouter } from "next/router";
import { ScreenLayout } from "../../components/";
import { Terminal, useEventQueue, textLine, textWord } from "crt-terminal";
import useUtils from "../../utils";
import useHooks from "../../hooks";

import { GAME_LIST as banner } from "../../constants";

export default function AuthTerminal() {
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loggedIn } = currentUser || {};
  const router = useRouter();
  const { delay } = useUtils();
  const eventQueue = useEventQueue();
  const { print } = eventQueue.handlers;

  return (
    <ScreenLayout title="Welcome to Flow Games">
      <div className="react-terminal">
        <Terminal
          queue={eventQueue}
          banner={[textLine({ words: [textWord({ characters: banner })] })]}
          onCommand={(command) => {
            switch (command) {
              case "9":
                print([
                  textLine({
                    words: [
                      textWord({
                        characters:
                          "Wise choice, let's play Rock Paper Scissors",
                      }),
                    ],
                  }),
                ]);
                delay(1500).then(() => router.push("/play/rps"));

                break;

              default:
                print([
                  textLine({
                    words: [
                      textWord({
                        characters:
                          "How about a nice game of Rock Paper Scissors?",
                      }),
                    ],
                  }),
                ]);
                break;
            }
          }}
        />
      </div>
    </ScreenLayout>
  );
}
