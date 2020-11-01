import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { useWindowDimensions } from "react-native-use-dimensions";
import WalletConnect from "react-native-walletconnect";

import Outpost, { useAllCommunities } from "./lib";
import { Login, CommunityCard } from "./components";

function CommunityList() {
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
        />
      ))}
    </>
  )
}

export default function App() {
  const { width } = useWindowDimensions();
  const logoSize = width * 0.6;
  return (
    <WalletConnect>
      <Outpost>
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
          <CommunityList />
          <View style={styles.safeAreaView}/>
        </ScrollView>
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <SafeAreaView />
          <Login style={styles.login} />
        </View>
      </Outpost>
    </WalletConnect>
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
