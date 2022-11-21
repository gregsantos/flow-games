import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ScreenLayout, HomeTerminal, AuthTerminal } from "../components/";
import "../flow/config";
import useCurrentUser from "../hooks/useCurrentUser";

export default function Index() {
  const { loggedIn } = useCurrentUser();
  console.log(loggedIn);

  const [authorized, setAuthorized] = useState<boolean>(false);

  return (
    <ScreenLayout title="Home">
      {loggedIn && "LoggedIn"}
      <Box flex={1}>
        {authorized ? (
          <HomeTerminal />
        ) : (
          <AuthTerminal setAuthorized={setAuthorized} />
        )}
      </Box>
    </ScreenLayout>
  );
}
