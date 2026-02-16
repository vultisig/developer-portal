import { createContext } from "react";

import { setCurrency } from "@/storage/currency";
import { setTheme } from "@/storage/theme";
import { Currency } from "@/utils/currency";
import { RouteKey } from "@/utils/routes";
import { Theme } from "@/utils/theme";

export type CoreContextProps = {
  baseValue: number;
  currency: Currency;
  currentRoute: RouteKey;
  setCurrency: typeof setCurrency;
  setCurrentRoute: (route: RouteKey) => void;
  setTheme: typeof setTheme;
  theme: Theme;
};

export const CoreContext = createContext<CoreContextProps | undefined>(
  undefined,
);
