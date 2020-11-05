import { useCallback } from "react";

export type useTxIdToUriResult = {
  readonly txIdToUri: (txId: string) => string;
};

export default function useTxIdToUri(): useTxIdToUriResult {
  const txIdToUri = useCallback(
    (txId: string) => `https://arweave.net/${txId}`,
    []
  );
  return { txIdToUri };
}
