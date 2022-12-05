import * as fcl from "@onflow/fcl";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { isAccountInitialized as isAccountInitializedTx } from "../flow/is-account-initialized.mjs";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface Props {
  children?: ReactNode;
}

interface AppContextInterface {
  currentUser: fcl.CurrentUserObject | null;
  isAccountInitialized: boolean;
  isAccountInitStateLoading: boolean;
  checkIsAccountInitialized: () => void;
  showGreeting: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setModalData: Dispatch<SetStateAction<{ title: string; message: string }>>;
  modalData: { title: string; message: string };
  /*   updateProfile: (opts: {
    name: string;
    color: string;
    info: string;
  }) => Promise<void>; */
}

export const AppContext = createContext<AppContextInterface>({
  currentUser: null,
  isAccountInitialized: false,
  isAccountInitStateLoading: false,
  checkIsAccountInitialized: () => null,
  showGreeting: true,
  showModal: false,
  setShowModal: () => null,
  setModalData: () => null,
  modalData: { title: "", message: "" },
});

export const useAppContext = () => useContext(AppContext);

export default function AppContextProvider({ children }: Props) {
  const [currentUser, setUser] = useState<fcl.CurrentUserObject | null>(null);
  const [isAccountInitStateLoading, setIsAccountInitStateLoading] =
    useState(false);
  const [isAccountInitialized, setIsAccountInitialized] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: "", message: "" });

  const checkIsAccountInitialized = useCallback(() => {
    if (currentUser?.addr) {
      setIsAccountInitStateLoading(true);
      isAccountInitializedTx(currentUser?.addr).then((data) => {
        console.log("isAccountInitialized", data);

        setIsAccountInitialized(data);
        setIsAccountInitStateLoading(false);
      });
    }
  }, [currentUser?.addr]);

  const getFRGBalance = useCallback(() => {
    if (currentUser?.addr) {
      console.log("getFRGBalance");

      /*       frgBalanceScript(currentUser?.addr).then((data) => {
        setFrgBalance(data);
      }); */
    }
  }, [currentUser?.addr]);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkIsAccountInitialized();
    getFRGBalance();
  }, [checkIsAccountInitialized, getFRGBalance]);

  const sendTokens = async (amount: number) => {
    if (amount < 1) return;

    setModalData({
      title: "Congrats!",
      message: `You've earned ${amount} tokens! Please wait while tokens are transferred to your account.`,
    });

    setShowModal(true);
    if (currentUser?.addr) {
      await fetch("/api/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: currentUser?.addr,
          amount: amount.toFixed(2),
        }),
      });
      getFRGBalance();
    }
    setShowModal(false);
  };

  const value = {
    currentUser,
    isAccountInitStateLoading,
    isAccountInitialized,
    checkIsAccountInitialized,
    showGreeting,
    setShowGreeting,
    sendTokens,
    showModal,
    setShowModal,
    setModalData,
    modalData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
