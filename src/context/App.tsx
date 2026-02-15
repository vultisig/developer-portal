import { createContext } from "react";

import { Vault } from "@/utils/types";

export type AppContextProps = {
  connect: () => void;
  disconnect: () => void;
  personalSign: (message: string, appId?: string) => Promise<string>;
  setVault: (vault: Vault) => void;
  vault?: Vault;
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);
