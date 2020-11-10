import { useCallback } from "react";

export type useTxIdToUriResult = {
  readonly txIdToUri: (gateway: string, txId: string) => string;
};

export default function useTxIdToUri(): useTxIdToUriResult {
  const txIdToUri = useCallback(
    (gateway: string, txId: string) => `https://${gateway}/${txId}`,
    []
  );
  return { txIdToUri };
}
