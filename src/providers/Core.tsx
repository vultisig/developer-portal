import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useEffectEvent,
  useState,
} from "react";

import { getBaseValue } from "@/api/third-party/crypto";
import { CoreContext, CoreContextProps } from "@/context/Core";
import { storageKeys } from "@/storage/constants";
import {
  getCurrency,
  setCurrency as setCurrencyStorage,
} from "@/storage/currency";
import { useLocalStorageWatcher } from "@/storage/hooks/useLocalStorageWatcher";
import { getTheme, setTheme as setThemeStorage } from "@/storage/theme";
import { Currency } from "@/utils/currency";
import { RouteKey } from "@/utils/routes";
import { Theme } from "@/utils/theme";

type StateProps = Pick<
  CoreContextProps,
  "baseValue" | "currency" | "currentRoute" | "theme"
>;

export const CoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StateProps>({
    currency: getCurrency(),
    currentRoute: "root",
    theme: getTheme(),
  });
  const { baseValue, currency, currentRoute, theme } = state;

  const fetchBaseValue = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, baseValue: undefined }));

    const baseValue = await getBaseValue(currency);

    setState((prev) => ({ ...prev, baseValue }));
  });

  const setCurrentRoute = useCallback((currentRoute: RouteKey) => {
    setState((prev) => ({ ...prev, currentRoute }));
  }, []);

  const setCurrency = (currency: Currency, fromStorage?: boolean) => {
    if (!fromStorage) setCurrencyStorage(currency);

    setState((prev) => ({ ...prev, currency }));
  };

  const setTheme = (theme: Theme, fromStorage?: boolean) => {
    if (!fromStorage) setThemeStorage(theme);

    setState((prev) => ({ ...prev, theme }));
  };

  useLocalStorageWatcher(storageKeys.currency, () => {
    setCurrency(getCurrency(), true);
  });

  useLocalStorageWatcher(storageKeys.theme, () => {
    setTheme(getTheme(), true);
  });

  useEffect(() => {
    fetchBaseValue();
  }, [currency]);

  return (
    <CoreContext.Provider
      value={{
        baseValue,
        currency,
        currentRoute,
        setCurrency,
        setCurrentRoute,
        setTheme,
        theme,
      }}
    >
      {children}
    </CoreContext.Provider>
  );
};
