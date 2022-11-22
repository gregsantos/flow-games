import { useRef } from "react";
import * as fcl from "@onflow/fcl";
import Terminal from "react-console-emulator";

const commands = {};

export default function AuthTerminal() {
  const terminal: { current?: any } = useRef();

  return (
    <Terminal
      ref={terminal}
      autoFocus
      noDefaults
      welcomeMessage={`ENTER ACCESS CODE TO CONTINUE: `}
      promptLabel={"$ / >"}
      ignoreCommandCase
      noEchoBack
      errorText={" "}
      style={{
        height: "100%",
        backgroundColor: "transparent",
      }}
      contentStyle={{
        zIndex: 2,
        position: "relative",
        color: "#18ff62",
      }}
      inputAreaStyle={{ backgroundColor: "transparent" }}
      promptLabelStyle={{
        width: "55px",
        textShadow: "1px 1px 8px rgba(10, 255, 10, 0.8)",
        color: "#18ff62",
      }}
      inputTextStyle={{
        height: "26px",
        textTransform: "uppercase",
        color: "#18ff62",
        textShadow: "1px 1px 8px rgba(10, 255, 10, 0.8)",
      }}
      commandCallback={async (result: string): Promise<string> => {
        const { loggedIn } = await fcl.authenticate();
        !loggedIn &&
          terminal.current.pushToStdout("** AUTHENTICATION CANCELLED **");

        return result;
      }}
      commands={commands}
    />
  );
}
