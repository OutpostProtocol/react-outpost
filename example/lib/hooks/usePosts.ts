import { Post } from "outpost-sdk/build/main/lib/requests/getPosts";
import { useEffect, useState } from "react";

import useOutpost from "./useOutpost";

export type usePostsParams = {
  readonly slug: string;
};

export type usePostsResult = {
  readonly posts: readonly Post[];
  readonly loading: boolean;
  readonly error: null | Error;
};

export default function usePosts({ slug }: usePostsParams): usePostsResult {
  const [state, setState] = useState<usePostsResult>({ loading: false, error: null, posts: [] });
  const { getPosts } = useOutpost();
  useEffect(() => {
    (async () => {
      try {
        setState(state => ({ ...state, loading: true }));
        const posts = await getPosts({ slug });
        setState(state => ({
          ...state,
          loading: false,
          error: null,
          posts,
        }));
      } catch (error) {
        setState(state => ({ ...state, loading: false, error }));
      }
    })();
  }, [setState, getPosts, slug]);
  return state;
}