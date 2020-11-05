import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Collapsible from "react-native-collapsible";
import {
  View,
  Platform,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { pyongyang } from "pyongyang";

import {
  useOutpost,
  useTxIdToUri,
  useTransactionStatus,
  TransactionStatus,
} from "../lib";

export type UploadImageProps = {
  authToken: string | null;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 200,
    justifyContent: "center",
    width: "100%",
  },
});

function UploadImage({ authToken }: UploadImageProps): JSX.Element {
  const [txId, setTxId] = useState(null);
  const { futures: { getTransactionStatus } } = pyongyang(`
    const arweave = Arweave.init();
    return {
      getTransactionStatus: (...args) => arweave.transactions.getStatus(...args),
    };
  `, { resources: ["https://unpkg.com/arweave/bundles/web.bundle.js"] });
  const { uploadImage } = useOutpost();
  const { txIdToUri } = useTxIdToUri();

  const { error, transactionStatus, loading } = useTransactionStatus({
    getTransactionStatus,
    interval: 10000,
    txId,
  });

  const pickImage = useCallback(async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Missing permissions.",
        );
      }
      const { base64, cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        exif: false,
      });
      if (cancelled) {
        throw new Error(
          "User cancelled selection.",
        );
      } else if (!base64) {
        throw new Error(
          "Malformed content returned.",
        );
      }

      const supportedImageTypes = [".png", ".jpg", ".jpeg"];
      const ext = uri.substring(uri.lastIndexOf(".")).toLowerCase();

      if (supportedImageTypes.indexOf(ext) <= 0) {
        throw new Error(
          `${ext} is not a supported type. Please select one of the following: ${supportedImageTypes.join(",")}.`,
        );
      }
      setTxId(
        await uploadImage({
          authToken,
          base64: `data:image/${ext.substring(1)};base64,${base64}`
        })
      );
    }
  }, [uploadImage, authToken, setTxId, txIdToUri]);


  console.log({ loading, error, transactionStatus });

  if (!txId) {
    return (
      <TouchableOpacity onPress={pickImage}>
        <Image
          style={styles.container}
          source={{
            uri: "https://www.lifewire.com/thmb/P856-0hi4lmA2xinYWyaEpRIckw=/1920x1326/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg"
          }}
        />
      </TouchableOpacity>
    );
  } else if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <Image
      style={styles.container}
      source={{ uri: txIdToUri(txId) }}
    />
  );
}

UploadImage.propTypes = {
  authToken: PropTypes.string,
};

UploadImage.defaultProps = {
  authToken: null,
};

export default UploadImage;
