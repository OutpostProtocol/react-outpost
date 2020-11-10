import { createContext } from "react";
import { createClientResult } from "outpost-sdk";

export type MessageSignRequest = (message: string, signInToken: string) => Promise<string>;

export type OutpostContextValue = createClientResult & {
  readonly baseURL: string;
  readonly requestAuthToken: (address: string) => Promise<string>;
};

export const defaultContext = Object.freeze({
  baseURL: "https://outpost-api-v2.herokuapp.com",
  requestAuthToken: async (address: string): Promise<string> => {
    return Promise.reject(new Error(`Unable to sign request. It looks like you haven't provided an onRequestSignMessage prop to your <OutpostProvider />.`));
  },
}) as OutpostContextValue;

export default createContext(defaultContext);