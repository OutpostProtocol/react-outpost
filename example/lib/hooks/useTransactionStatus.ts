import { useEffect, useState } from "react";

export type TransactionStatus = {
  status: number;
  confirmed: {
    block_height: number;
    block_indep_hash: string;
    number_of_confirmations: number;
  };
};

export type useTransactionStatusParams = {
  txId: string | null;
  getTransactionStatus: (txId: string) => Promise<TransactionStatus> | null;
  interval: number;
};

export type useTransactionStatusResult = {
  transactionStatus: TransactionStatus | null;
  loading: boolean;
  error: Error | null;
};

const defaultState = Object.freeze({
  transactionStatus: null,
  loading: true,
  error: null,
}) as useTransactionStatusResult;

const missingGetTransactionStatus = Object.freeze({
  transactionStatus: null,
  loading: false,
  error: new Error("Missing getTransactionStatus."),
}) as useTransactionStatusResult;

const missingTxId = Object.freeze({
  transactionStatus: null,
  loading: false,
  error: new Error("Missing txId."),
}) as useTransactionStatusResult;

export default function useTransactionStatus(params: useTransactionStatusParams) {
  const [state, setState] = useState<useTransactionStatusResult>(defaultState);
  const {
    txId,
    getTransactionStatus,
    interval: maybeInterval,
  } = params;

  const interval = !isNaN(maybeInterval) && maybeInterval >= 0 ? maybeInterval : 10000;
  const hasGetTransactionStatus = typeof getTransactionStatus === "function";
  const hasTxId = typeof txId === "string" && !!txId.length;

  useEffect(() => {
    const i = setInterval(() => hasGetTransactionStatus && hasTxId && (async () => {
      setState(e => ({ ...e, loading: true }));
      try {
        const transactionStatus = await getTransactionStatus(txId);

        const { status } = transactionStatus;
        const loading = status !== 200; 

        setState({
          loading,
          error: null,
          transactionStatus,
        });
        !loading && clearInterval(i);
      } catch (e) {
        clearInterval(i);
        setState((error) => ({
          ...e,
          loading: true,
          error,
        }));
      }
    })(), interval);
    return () => clearInterval(i);
  }, [interval, getTransactionStatus, hasGetTransactionStatus, hasTxId, txId]);

  if (!hasGetTransactionStatus) {
    return missingGetTransactionStatus;
  } else if (!hasTxId) {
    return missingTxId;
  }
  return state;
}
