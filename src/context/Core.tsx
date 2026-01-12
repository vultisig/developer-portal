import { createContext } from "react";

import { setTheme } from "@/storage/theme";
import { Theme } from "@/utils/theme";

export type VaultInfo = {
  name: string;
  publicKeyEcdsa: string;
  publicKeyEddsa: string;
  hexChainCode: string;
  uid: string;
};

export type CoreContextProps = {
  address?: string;
  connect: () => void;
  disconnect: () => void;
  setTheme: typeof setTheme;
  theme: Theme;
  vault?: VaultInfo;
};

export const CoreContext = createContext<CoreContextProps | undefined>(
  undefined
);
