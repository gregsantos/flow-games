import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ScreenLayout, HomeTerminal, AuthTerminal } from "../components/";
import "../flow/config";
import useCurrentUser from "../hooks/useCurrentUser";

export default function Index() {
  const { loggedIn } = useCurrentUser();

  return (
    <ScreenLayout title="Home">
      <Box flex={1}>{loggedIn ? <HomeTerminal /> : <AuthTerminal />}</Box>
    </ScreenLayout>
  );
}
