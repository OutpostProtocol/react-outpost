import { useCallback } from "react";
import { useWalletConnect } from "react-native-walletconnect";

export type useCurrentAddressResult = {
  readonly getCurrentAddress: () => string | null;
};

export default function useCurrentAddress(): useCurrentAddressResult {
  const { session } = useWalletConnect();
  
  const getCurrentAddress = useCallback(() => {
    if (!!session.length) {
      const [{ accounts: [address] }] = session.filter(({ chainId }) => chainId === 1);
      return address;
    }
    return null;
  }, [session]);

  return { getCurrentAddress };
}