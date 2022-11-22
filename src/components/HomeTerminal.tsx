/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import * as fcl from "@onflow/fcl";
import { HOME_BANNER as banner, GAME_LIST as gameList } from "../constants";

const helpText = `
Available commands:

help - This output
lg - List games
ls - Lists files
cd <dir> - Enters directory
cat <filename> - Lists file contents
contact - Prints contact information
contact <key> - Opens up relevant contact link
clear - Clears the display
`;

const contactInfo = {
  email: "info@flow.com",
  twitter: "https://twitter.com/flow_blockchain",
  github: "https://github.com/onflow",
};

const contactList = Object.keys(contactInfo)
  .reduce((result, key) => result.concat([`${key} - ${contactInfo[key]}`]), [])
  .join("\n");

const contactText = `
Built on Flow

${contactList}

Use ex. 'contact twitter' to open the links.
`;

const openContact = (key) =>
  window.open(
    key === "email" ? `mailto:${contactInfo[key]}` : contactInfo[key]
  );

// File browser
const browser = (function () {
  let current = "/";

  let tree = [
    {
      location: "/",
      filename: "documents",
      type: "directory",
    },
    {
      location: "/documents",
      filename: "secret",
      type: "file",
      content: "SECRET_KEY",
    },
  ];

  const fix = (str) => str.trim().replace(/\/+/g, "/") || "/";

  const setCurrent = (dir) => {
    if (typeof dir !== "undefined") {
      if (dir == ".." || dir == "../") {
        const parts = current.split("/");
        parts.pop();
        current = fix(parts.join("/"));
      } else {
        const found = tree
          .filter((iter) => iter.location === current)
          .find((iter) => iter.filename === fix(dir));

        if (found) {
          current = fix(current + "/" + dir);
        } else {
          return `Directory '${dir}' not found in '${current}'`;
        }
      }

      return `Entered '${current}'`;
    }

    return current;
  };

  const ls = () => {
    const found = tree.filter((iter) => iter.location === current);
    const fileCount = found.filter((iter) => iter.type === "file").length;
    const directoryCount = found.filter(
      (iter) => iter.type === "directory"
    ).length;
    const status = `${fileCount} file(s), ${directoryCount} dir(s)`;
    const maxlen = Math.max(
      ...found.map((iter) => iter.filename).map((n) => n.length)
    );

    const list = found
      .map((iter) => {
        return `${iter.filename.padEnd(maxlen + 1, " ")} <${iter.type}>`;
      })
      .join("\n");

    return `${list}\n\n${status} in ${current}`;
  };

  const cat = (filename) => {
    const found = tree.filter((iter) => iter.location === current);
    const foundFile = found.find((iter) => iter.filename === filename);

    if (foundFile) {
      return foundFile.content;
    }

    return `File '${filename}' not found in '${current}'`;
  };

  return {
    cwd: () => setCurrent(),
    cd: (dir) => setCurrent(fix(dir)),
    cat,
    ls,
  };
})();

const createOptions = (opts) =>
  Object.assign(
    {},
    {
      banner: "Hello World",
      prompt: () => "$",
      tickrate: 1000 / 60,
      buflen: 8,
      commands: {},
    },
    opts || {}
  );

// Sets text selection range
const setSelectionRange = (input) => {
  const length = input.value.length;

  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(length, length);
  } else if (input.createTextRange) {
    const range = input.createTextRange();
    range.collapse(true);
    range.moveEnd("character", length);
    range.moveStart("character", length);
    range.select();
  }
};

// Gets the font size of an element
const getFontSize = (element) =>
  parseInt(window.getComputedStyle(element).getPropertyValue("font-size"), 10);

// Creates the rendering loop
const renderer = (tickrate, onrender) => {
  let lastTick = 0;

  const tick = (time) => {
    const now = performance.now();
    const delta = now - lastTick;

    if (delta > tickrate) {
      lastTick = now - (delta % tickrate);

      onrender();
    }

    window.requestAnimationFrame(tick);
  };

  return tick;
};

const printer = ($element, buflen) => (buffer) => {
  if (buffer.length > 0) {
    const len = Math.min(buflen, buffer.length);
    const val = buffer.splice(0, len);

    $element.value += val.join("");

    setSelectionRange($element);
    $element.scrollTop = $element.scrollHeight;

    return true;
  }

  return false;
};

// Parses input
const parser = (onparsed) => (str) => {
  if (str.length) {
    const args = str.split(" ").map((s) => s.trim());
    const cmd = args.splice(0, 1)[0];
    console.debug(cmd, args);
    onparsed(cmd, ...args);
  }
};

// Command executor
const executor =
  (commands) =>
  (cmd, ...args) =>
  (cb) => {
    try {
      commands[cmd]
        ? cb(commands[cmd](...args) + "\n")
        : cb(`No such command '${cmd}'\n`);
    } catch (e) {
      console.warn(e);
      cb(`Exception: ${e}\n`);
    }
  };

// Handle keyboard events
const keyboard = (parse) => {
  let input = [];
  const keys = { 8: "backspace", 13: "enter" };
  const ignoreKey = (code) => code >= 33 && code <= 40;
  const key = (ev) => keys[ev.which || ev.keyCode];

  return {
    keypress: (ev) => {
      if (key(ev) === "enter") {
        const str = input.join("").trim();
        parse(str);
        input = [];
      } else if (key(ev) !== "backspace") {
        input.push(String.fromCharCode(ev.which || ev.keyCode));
      }
    },

    keydown: (ev) => {
      if (key(ev) === "backspace") {
        if (input.length > 0) {
          input.pop();
        } else {
          ev.preventDefault();
        }
      } else if (ignoreKey(ev.keyCode)) {
        ev.preventDefault();
      }
    },
  };
};

const mountTerminal = (opts) => {
  const { terminalRef, textAreaRef } = opts;
  const $root = terminalRef.current;
  const $element = textAreaRef.current;

  let buffer = [];
  let busy = false;

  const { prompt, banner, commands, buflen, tickrate } = createOptions(opts);
  const fontSize = getFontSize($element);
  const width = $element.offsetWidth;
  const cwidth = Math.round((width / fontSize) * 1.9);

  const output = (output, center) => {
    let lines = output.split(/\n/);
    if (center) {
      lines = lines.map((line) =>
        line.length > 0
          ? line.padStart(line.length + (cwidth / 2 - line.length / 2), " ")
          : line
      );
    }

    const append = lines.join("\n") + "\n" + prompt();
    buffer = buffer.concat(append.split(""));
  };

  const print = printer($element, buflen);
  const execute = executor(commands);
  const onrender = () => (busy = print(buffer));
  const onparsed = (cmd, ...args) => execute(cmd, ...args)(output);
  const render = renderer(tickrate, onrender);
  const parse = parser(onparsed);
  const focus = () => setTimeout(() => $root.focus(), 1);
  const kbd = keyboard(parse);
  const clear = () => ($element.value = "");
  const input = (ev) => (busy ? ev.preventDefault() : kbd[ev.type](ev));

  $root.addEventListener("focus", () => setSelectionRange($element));
  $root.addEventListener("blur", focus);
  $root.addEventListener("keypress", input);
  $root.addEventListener("keydown", input);

  render();
  output(banner, true);
  focus();

  return { focus, parse, clear, print: output };
};

const HomeTerminal = () => {
  const router = useRouter();

  const terminalRef: { current?: any } = useRef(null);
  const textAreaRef: { current?: any } = useRef(null);

  const handleRps = () => {
    router.push("play/rps");
  };

  useEffect(() => {
    const t = mountTerminal({
      terminalRef,
      textAreaRef,
      prompt: () => `$ ${browser.cwd()} > `,
      banner,
      commands: {
        1: () => "Game currently in development",
        2: () => "Game currently in development",
        3: () => "Game currently in development",
        4: () => "Game currently in development",
        5: () => "Game currently in development",
        6: () => "Game currently in development",
        7: () => "Game currently in development",
        8: () => "Game currently in development",
        9: () => handleRps(),
        login: () => fcl.authenticate(),
        lg: () => gameList,
        help: () => helpText,
        cwd: () => browser.cwd(),
        cd: (dir) => browser.cd(dir),
        ls: () => browser.ls(),
        cat: (file) => browser.cat(file),
        clear: () => t.clear(),
        contact: (key) => {
          if (key in contactInfo) {
            openContact(key);
            return `Opening ${key} - ${contactInfo[key]}`;
          }

          return contactText;
        },
      },
    });
  }, []);

  return (
    <Box id="terminal" ref={terminalRef} fontSize="1.15em">
      <textarea spellCheck="false" ref={textAreaRef} />
    </Box>
  );
};

export default HomeTerminal;
