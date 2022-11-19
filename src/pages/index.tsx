import React, { useRef } from "react";
import { Flex, Box, Grid, Stat, StatLabel } from "@chakra-ui/react";
import Newsbar from "../components/Newsbar";
import useWindowSize from "../hooks/useWindowSize";

export const GridWrapper = (props: unknown) => {
  const { width, height } = useWindowSize();

  return (
    <Flex
      background="black"
      direction="column"
      h={height}
      w={width}
      maxHeight={height}
      textShadow="0 0 5px #c8c8c8"
      textTransform="uppercase"
    >
      <div id="screen" />
      <div id="scanline" />
      <div id="interlace" />
      <div id="green-light" />
      <Flex
        height={["0px", "40px", "50px", "60px"]}
        direction="column"
        align="center"
        justify="center"
        p={2}
      >
        <h3>D00MBER6</h3>
      </Flex>
      <Flex flex={1} overflow="auto">
        {props.children}
      </Flex>
      <Newsbar />
    </Flex>
  );
};

export default function Index() {
  // const [wallet, setWallet] = useState<Ledger>(Map());
  // const [ledger, setLedger] = useState<Ledger>(Map());
  /* const [state, setState] = useState({
    count: INITIAL_TIME,
    name: "kiddo",
    netWorth: 0,
    occupation: "Shoe Shine",
    payRate: 10,
    chairs: 0,
    floors: 0,
    buildings: 0,
    blocks: 0,
  }); */
  // const [, setSavedGame] = useLocalStorage<any>("savedGame", state);
  const terminal: { current?: any } = useRef();

  /*   useInterval(() => {
    update();
  }, INTERVAL); */

  /*   useInterval(() => {
    setSavedGame(state);
  }, INTERVAL * 300); */

  /*   const update = () => {
    if (state.count === 0) {
      alert(`YOU DIED with $ ${state.netWorth}`);
      return;
    }
    setWallet(sum(wallet, ledger));
    setState({
      ...state,
      count: state.count - (3600 * 1000) / 10,
      netWorth: whole(sum(wallet, ledger).get(DOLLARS)) || 0,
    });
  }; */

  /*   const work = () => {
    const newWallet = sum(wallet, Map({ [DOLLARS]: state.payRate * 1 }));
    setWallet(newWallet);
    setState({
      ...state,
      count: (state.count / 1000 - 3600 * 8) * 1000,
      netWorth: whole(newWallet.get(DOLLARS)) || 0,
    });
    terminal.current.pushToStdout("You worked 8 hours and earned $10");
  }; */

  /*   const buyBuilding = (e) => {
    const { id } = e.target;
    const walletWithCostsApplied = buy(pouch[id], wallet, state);
    if (!inTheBlack(walletWithCostsApplied)) {
      alert("You can't afford this upgrade");
      return;
    }

    const newWallet = add(pouch[id], walletWithCostsApplied);
    setWallet(newWallet);

    const newLedger = effects(Object.values(pouch), newWallet);
    setLedger(newLedger);

    setState({
      ...state,
      [`${id}s`]: state[`${id}s`] + 1,
    });
  };

  const getDps = () => {
    const ledgersTotals = ledger.get(DOLLARS) || 0;
    return ledgersTotals * 10;
  }; */

  return (
    <GridWrapper>
      <Box flex={1} overflow="auto">
        <Grid
          minHeight="100%"
          templateRows={[
            "auto auto 250px auto auto",
            "300px 100px minmax(auto, 1fr)",
          ]}
          templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
          templateAreas={[
            `
          "ad ad"
          "i1 i1"
          "m1 m1"
          "b1 b2"
          "b3 b4"       
          `,
            `
          "m1 m1 m1 i1"
          "m1 m1 m1 ad"
          "b1 b2 b3 b4"
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
                <StatLabel>Net Worth</StatLabel>
              </Stat>
              <Flex justify="space-between">
                <Box color="green.300">$ per sec</Box>
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
              <Box color="green.300">Time till Death</Box>
            </Flex>
            <Flex
              align="center"
              justify="center"
              gridColumn={["1 / span 2", 1]}
            ></Flex>
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
              border="1px solid"
              borderColor="green.300"
            >
              Ad goes here
            </Flex>
          </Flex>
          <Box
            gridArea="m1"
            p={3}
            border="1px solid"
            borderColor="green.300"
          ></Box>
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
          ></Flex>
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
          ></Flex>
          <Flex
            gridArea="b3"
            minHeight="0"
            minWidth="0"
            direction="column"
            justify="center"
            padding={[1, 2, null, 3]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          ></Flex>
          <Flex
            gridArea="b4"
            minHeight="0"
            minWidth="0"
            direction="column"
            justify="center"
            padding={[1, 2, null, 3]}
            color="green.300"
            border="1px solid"
            borderColor="green.300"
            overflow="auto"
          ></Flex>
        </Grid>
      </Box>
    </GridWrapper>
  );
}
