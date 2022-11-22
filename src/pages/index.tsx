import { ScreenLayout, HomeTerminal, AuthTerminal } from "../components/";
import "../flow/config";
import useCurrentUser from "../hooks/useCurrentUser";

export default function Index() {
  const { loggedIn } = useCurrentUser();

  return (
    <ScreenLayout title="Home">
      {loggedIn ? <HomeTerminal /> : <AuthTerminal />}
    </ScreenLayout>
  );
}
