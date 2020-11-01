import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import deepmerge from "deepmerge";
import { createClient } from "outpost-sdk";

import { OutpostContext, defaultContext } from "../contexts";
import type { OutpostContextValue } from "../contexts";
import { useOutpost } from "../hooks";

type Children = JSX.Element | JSX.Element[];

export type OutpostProviderProps = {
  baseURL: string;
  children: Children;
};

function OutpostProvider({
  baseURL,
  children,
}: OutpostProviderProps): JSX.Element {
  const shouldCreateClient = useCallback(((baseURL: string) => {
    return createClient({ baseURL });
  }), []);
  const [outpost, setOutpost] = useState(() => shouldCreateClient(baseURL));
  useEffect(() => {
    setOutpost(shouldCreateClient(baseURL));
  }, [baseURL, shouldCreateClient, setOutpost]);
  return (
    <OutpostContext.Provider
      value={{ ...outpost, baseURL } as OutpostContextValue}
    >
      {children}
    </OutpostContext.Provider>
  );
}

OutpostProvider.propTypes = {
  baseURL: PropTypes.string,
};

OutpostProvider.defaultProps = {
  baseURL: defaultContext.baseURL,
};

export default OutpostProvider;