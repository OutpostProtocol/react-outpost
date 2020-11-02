import React from "react";
import {
  Linking,
  Modal,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
 } from "react-native";
import { useScreenDimensions } from "react-native-use-dimensions";
import HTML from "react-native-render-html";
import { Title } from "react-native-paper";
import { WebView } from "react-native-webview-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Post } from "outpost-sdk/build/main/lib/requests/getPosts";

export type PostModalProps = {
  visible: boolean;
  onRequestDismiss: () => void;
  post: Post;
};

const styles = StyleSheet.create({
  backButton: { marginLeft: 10 },
  container: { flex: 1 },
  headingContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  safeAreaView: { height: 50 },
  title: { color: "white", fontSize: 11 },
});

export default function PostModal({
  visible,
  onRequestDismiss,
  post,
 }: PostModalProps): JSX.Element {
   const { width } = useScreenDimensions();
   console.warn({ post });
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestDismiss}
    >
      <ScrollView style={StyleSheet.absoluteFill}>
        {!!post && (
          <HTML
            html={post.postText}
            onLinkPress={(_, url) => Linking.canOpenURL(url).then(canOpen => canOpen && Linking.openURL(url))}
          />
        )}
        <View style={styles.safeAreaView} />
      </ScrollView>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <SafeAreaView />
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={onRequestDismiss}>
            <MaterialCommunityIcons
              style={styles.backButton}
              color="white"
              name="arrow-left"
              size={30}
            />
            {!!post && (
              <Title color="white" children={post.title} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}