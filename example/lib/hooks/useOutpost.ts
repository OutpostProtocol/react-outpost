import { useContext } from "react";

import { OutpostContext } from "../contexts";
import type { OutpostContextValue } from "../contexts";

export default function useOutpost(): OutpostContextValue {
  return useContext(OutpostContext);
}