import React from "react";
import { Flex, Box, Grid, Stat, StatLabel } from "@chakra-ui/react";
import ScreenLayout from "../../components/Layout";

export default function Play() {
  return (
    <ScreenLayout title="Home">
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
    </ScreenLayout>
  );
}
