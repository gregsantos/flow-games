import { useRef } from "react";
import Terminal from "react-console-emulator";

const commands = {
  echo: {
    description: "Echoes a passed string.",
    usage: "echo <string>",
    fn: function () {
      return `${Array.from(arguments).join(" ")}`;
    },
  },
  danger: {
    description:
      "This command returns HTML. It will only work with terminals that have danger mode enabled.",
    fn: () => "I can<br/>use HTML in this<br/>and it will be parsed",
  },
  async: {
    description: "This command runs an asynchronous task.",
    fn: async () => {
      const asyncTask = async () => "Hello from a promise!";
      const result = await asyncTask();
      return result;
    },
  },
  delay: {
    description: "Delays return of value by 1000 ms.",
    fn: () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve("Finished!"), 1000);
      });
    },
  },
  html: {
    description: "Returns a raw HTML string.",
    fn: async () =>
      '<span style="color:#c386ff">Hello</span> <span style="color:#fa8072">World</span>',
  },
};

export default function AuthTerminal({ setAuthorized }) {
  const terminal: { current?: any } = useRef();

  return (
    <Terminal
      id="authterm"
      ref={terminal}
      autoFocus
      ignoreCommandCase
      noEchoBack
      promptLabel={"$"}
      welcomeMessage={`ENTER ACCESS CODE TO CONTINUE`}
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
        textShadow: "1px 1px 8px rgba(10, 255, 10, 0.8)",
        color: "#18ff62",
      }}
      inputTextStyle={{
        height: "28px",
        textTransform: "uppercase",
        color: "#18ff62",
        textShadow: "1px 1px 8px rgba(10, 255, 10, 0.8)",
      }}
      commandCallback={(result) => {
        console.log(result);
        setAuthorized(true);
      }}
      commands={commands}
    />
  );
}
