import React from "react";
import { Modal, ScrollView, View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useScreenDimensions } from "react-native-use-dimensions";
import HTML from "react-native-render-html";
import { WebView } from "react-native-webview-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type PostModalProps = {
  visible: boolean;
  onRequestDismiss: () => void;
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeAreaView: { height: 50 },
});

export default function PostModal({
  visible,
  onRequestDismiss,
  post,
 }: PostModalProps): JSX.Element {
   const { width } = useScreenDimensions();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestDismiss}
    >
      <ScrollView style={StyleSheet.absoluteFill}>
        {!!post && (
          <HTML html={post.postText} />
        )}
        <View style={styles.safeAreaView} />
      </ScrollView>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <SafeAreaView />
        <TouchableOpacity onPress={onRequestDismiss}>
          <MaterialCommunityIcons
            style={{
              marginLeft: 10,
            }}
            color="white"
            name="arrow-left"
            size={30}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}