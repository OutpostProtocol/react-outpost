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
import { WebView } from "react-native-webview-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Post } from "outpost-sdk/build/main/lib/requests/getPosts";

export type PostModalProps = {
  visible: boolean;
  onRequestDismiss: () => void;
  post: Post;
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeAreaView: { height: 50 },
  backButton: { marginLeft: 10 },
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
        <TouchableOpacity onPress={onRequestDismiss}>
          <MaterialCommunityIcons
            style={styles.backButton}
            color="white"
            name="arrow-left"
            size={30}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}