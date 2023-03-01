import { MagicLoginType } from "@dexkit/core/constants";

export const WALLET_CONNECTORS: {
  id: string;
  name: string;
  icon: string;
  loginType?: MagicLoginType;
}[] = [
  { id: "metamask", name: "MetaMask", icon: "" },
  { id: "magic", name: "Google", icon: "", loginType: "google" },
  { id: "magic", name: "Twitter", icon: "", loginType: "twitter" },
];
