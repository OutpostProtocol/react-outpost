import { createContext } from "react";
import { createClientResult } from "outpost-sdk";

export type OutpostContextValue = createClientResult & {
  readonly baseURL: string;
};

export const defaultContext = Object.freeze({
  baseURL: "https://outpost-api-v2.herokuapp.com",
}) as OutpostContextValue;

export default createContext(defaultContext);