import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Title } from "react-native-paper";
import { useWalletConnect } from "react-native-walletconnect";

import { useOutpost } from "../lib";

export type LoginProps = {
  style: ViewStyle;
};

const styles = StyleSheet.create({
  
});

function Login({ style }: LoginProps): JSX.Element {
  const { createSession, session, killSession, signPersonalMessage } = useWalletConnect();
  const hasWallet = !!session.length;
  const { getSignInToken, getAuthToken } = useOutpost();
  const onTitlePress = useCallback(async () => {
    if (hasWallet) {
      killSession();
    }
    return createSession();
  }, [hasWallet, createSession, killSession, getSignInToken]);
  useEffect(() => {
    if (hasWallet) {
      (async () => {
        const [{ accounts: [address] }] = session.filter(({ chainId }) => chainId === 1);
        const signInToken = await getSignInToken({ address });
        const signature = await signPersonalMessage([
          signInToken,
          address,
        ]);
        const authToken = await getAuthToken({
          address,
          signature,
        });
        console.warn({ authToken });
      })();
    }
  }, [hasWallet, signPersonalMessage, getSignInToken, getAuthToken]);
  return (
    <View style={style}>
      <Title
        children={hasWallet ? 'Logout' : 'Login'}
        onPress={onTitlePress}
      />
    </View>
  );
}

export default Login;