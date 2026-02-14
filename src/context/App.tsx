import { VaultBase } from "@vultisig/sdk";
import { createContext } from "react";

export type AppContextProps = {
  connect: () => void;
  disconnect: () => void;
  personalSign: (message: string, appId?: string) => Promise<string>;
  setVault: (vault: VaultBase) => void;
  vault?: VaultBase;
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);
