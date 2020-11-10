import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Title } from "react-native-paper";
import { useWalletConnect } from "react-native-walletconnect";
import { useOutpost } from "react-outpost";

export type LoginProps = {
  style: ViewStyle;
  onAuthTokenChanged: (authToken: string | null) => void;
};

const styles = StyleSheet.create({
  
});

function Login({ style, onAuthTokenChanged }: LoginProps): JSX.Element {
  const { createSession, session, killSession, signPersonalMessage } = useWalletConnect();
  const hasWallet = !!session.length;
  const { requestAuthToken } = useOutpost();
  const onTitlePress = useCallback(async () => {
    if (hasWallet) {
      killSession();
    }
    return createSession();
  }, [hasWallet, createSession, killSession]);
  useEffect(() => {
    if (hasWallet) {
      (async () => {
        const [{ accounts: [address] }] = session.filter(({ chainId }) => chainId === 1);
        const authToken = await requestAuthToken(address);
        onAuthTokenChanged(authToken);
      })();
    }
  }, [hasWallet, signPersonalMessage, requestAuthToken, onAuthTokenChanged]);
  return (
    <>
      <View style={style}>
        <Title
          children={hasWallet ? 'Logout' : 'Login'}
          onPress={onTitlePress}
        />
      </View>
    </>
  );
}

export default Login;
