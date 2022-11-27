import { ScreenLayout, AuthTerminal, LandingTerminal } from "../components/";
import "../flow/config";
import useHooks from "../hooks";

export default function Index() {
  const { useCurrentUser } = useHooks();
  const currentUser = useCurrentUser();
  const { loggedIn } = currentUser || { loggedIn: null };

  return (
    <ScreenLayout title="Welcome to Flow Games">
      {loggedIn ? <LandingTerminal /> : <AuthTerminal />}
    </ScreenLayout>
  );
}
