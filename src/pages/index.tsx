import { ScreenLayout, AuthTerminal } from "../components/";
import LandingTerminal from "../components/LandingTerminal";
import "../flow/config";
import useHooks from "../hooks";

export default function Index() {
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();
  const { loggedIn } = currentUser || {};

  return (
    <ScreenLayout title="Welcome to Flow Games">
      {loggedIn ? <LandingTerminal /> : <AuthTerminal />}
    </ScreenLayout>
  );
}
