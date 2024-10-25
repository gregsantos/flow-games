import { AuthTerminal, LandingTerminal } from "../components/";
import "../flow/config";
import { useAppContext } from "../contexts/AppContext";

export default function Index() {
  const { currentUser, showGreeting } = useAppContext();
  const { loggedIn } = currentUser || { loggedIn: null };

  return <>{!loggedIn ? <AuthTerminal /> : <LandingTerminal />}</>;
}
