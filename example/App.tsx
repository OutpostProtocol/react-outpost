import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { useWindowDimensions } from "react-native-use-dimensions";
import { withWalletConnect, useWalletConnect } from "react-native-walletconnect";
import Etherscan from "react-use-etherscan";
import Constants from "expo-constants";
import Pyongyang from "pyongyang";
import Outpost, { useAllCommunities } from "react-outpost";

import { Login, CommunityCard, UploadImage } from "./components";

function CommunityList({ authToken }: { authToken: string  | null }) {
  const { loading, error, communities } = useAllCommunities();
  if (error) {
    return <Text style={styles.error} children={error.message} />
  } else if (loading) {
    return <ActivityIndicator style={styles.loading} />
  }
  return (
    <>
      {communities.map((community, i) => (
        <CommunityCard
          key={i}
          community={community}
          authToken={authToken}
        />
      ))}
    </>
  )
}

const { ETHERSCAN_API_KEY } = Constants.manifest.extra;

function App() {
  const [authToken, onAuthTokenChanged] = useState<string | null>(null);
  const { session, signPersonalMessage } = useWalletConnect();
  const { width } = useWindowDimensions();
  const logoSize = width * 0.6;
  const onRequestSignMessage = useCallback(async (address: string, signInToken: string) => {
    if (!session.length) {
      return Promise.reject(new Error(`Unable to sign message; wallet not initialized`));
    }
    return signPersonalMessage([
      signInToken,
      address,
    ]);
  }, [session, signPersonalMessage]);
  return (
    <Pyongyang>
      <Etherscan
        apiKey={ETHERSCAN_API_KEY}
        network="mainnet"
      >
        <Outpost onRequestSignMessage={onRequestSignMessage}>
          <ScrollView style={StyleSheet.absoluteFill}>
            <View style={styles.safeAreaView} />
            <View style={styles.logoContainer}>
              <Image
                style={{
                  width: logoSize,
                  height: logoSize,
                }}
                source={{ uri: "https://outpost-protocol.com/logo/Outpost_black.png"}}
              />
              <Text style={styles.title} children="OUTPOST" />
            </View>
            <UploadImage authToken={authToken} />
            <CommunityList authToken={authToken} />
            <View style={styles.safeAreaView}/>
          </ScrollView>
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <SafeAreaView />
            <Login style={styles.login} onAuthTokenChanged={onAuthTokenChanged} />
          </View>
        </Outpost>
      </Etherscan>
    </Pyongyang>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    padding: 10,
    width: "100%",
  },
  icon: {
    borderRadius: 64,
    height: 128,
    overflow: 'hidden',
    width: 128,
  },
  loading: {},
  login: { padding: 15, flexDirection: "row", justifyContent: "flex-end" },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  row: {
    width: "100%",
    padding: 10,
  },
  safeAreaView: { height: 50 },
  title: { fontSize: 50, marginBottom: 50 },
});

export default withWalletConnect(App);
