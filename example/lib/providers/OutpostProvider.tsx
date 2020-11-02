import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { createClient } from "outpost-sdk";

import { OutpostContext, defaultContext } from "../contexts";
import type { OutpostContextValue, MessageSignRequest } from "../contexts";

type Children = JSX.Element | JSX.Element[];

export type OutpostProviderProps = {
  readonly baseURL: string;
  readonly onRequestSignMessage: MessageSignRequest;
  readonly children: Children;
};

function OutpostProvider({
  baseURL,
  children,
  onRequestSignMessage,
}: OutpostProviderProps): JSX.Element {
  const shouldCreateClient = useCallback(((baseURL: string) => {
    return createClient({ baseURL });
  }), []);
  const [outpost, setOutpost] = useState(() => shouldCreateClient(baseURL));
  useEffect(() => {
    setOutpost(shouldCreateClient(baseURL));
  }, [baseURL, shouldCreateClient, setOutpost]);
  const { getSignInToken, getAuthToken } = outpost;
  const requestAuthToken = useCallback(
    async (address: string): Promise<string> => {
      console.warn({ address });
      const signInToken = await getSignInToken({ address });
      const signature = await onRequestSignMessage(address, signInToken);
      const authToken = await getAuthToken({
        address,
        signature,
      });
      return authToken;
    },
    [getSignInToken, getAuthToken, onRequestSignMessage]
  );
  return (
    <OutpostContext.Provider
      value={{ ...outpost, baseURL, requestAuthToken } as OutpostContextValue}
    >
      {children}
    </OutpostContext.Provider>
  );
}

OutpostProvider.propTypes = {
  baseURL: PropTypes.string,
  onRequestSignMessage: PropTypes.func,
};

OutpostProvider.defaultProps = {
  baseURL: defaultContext.baseURL,
  onRequestSignMessage: defaultContext.requestAuthToken,
};

export default OutpostProvider;