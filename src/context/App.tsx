import { createContext } from "react";

import { Vault } from "@/utils/types";

export type AppContextProps = {
  connect: () => void;
  disconnect: () => void;
  setVault: (vault: Vault) => void;
  vault?: Vault;
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);
