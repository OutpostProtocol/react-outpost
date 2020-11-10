import { useState, useEffect } from "react";
import { Community } from "outpost-sdk/build/main/lib/requests";

import useOutpost from './useOutpost';

export type useAllCommunitiesResult = {
  readonly loading: boolean;
  readonly communities: readonly Community[];
  readonly error: null | Error;
};

export default function useAllCommunities(): useAllCommunitiesResult {
  const [state, setState] = useState<useAllCommunitiesResult>({
    error: null,
    loading: false,
    communities: [],
  });
  const { getAllCommunities } = useOutpost();
  useEffect(() => {
    (async () => {
      try {
        setState(state => ({ ...state, loading: true }));
        const communities = (await getAllCommunities());
        setState(state => ({
          ...state,
          loading: false,
          error: null,
          communities,
        }));
      } catch (error) {
        setState(state => ({
          ...state,
          loading: false,
          error,
        }));
      }
    })();
  }, [getAllCommunities, setState]);
  return state as useAllCommunitiesResult;
}