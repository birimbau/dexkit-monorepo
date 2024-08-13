import React from "react";
import { CommerceContextState } from "./types";

export const CommerceContext = React.createContext<CommerceContextState>({
  setProduct: () => {},
  isSection: true,
});
