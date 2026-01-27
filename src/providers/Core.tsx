import { message as Message, Modal } from "antd";
import { hexlify, randomBytes } from "ethers";
import { FC, ReactNode, useCallback, useState } from "react";

import { authenticate } from "@/api/client";
import { CoreContext, CoreContextProps, VaultInfo } from "@/context/Core";
import { storageKeys } from "@/storage/constants";
import { useLocalStorageWatcher } from "@/storage/hooks/useLocalStorageWatcher";
import { getTheme, setTheme as setThemeStorage } from "@/storage/theme";
import { delToken, getToken, setToken } from "@/storage/token";
import { delVaultId, getVaultId, setVaultId } from "@/storage/vaultId";
import {
  connect as connectToExtension,
  disconnect as disconnectFromExtension,
  getVault,
  personalSign,
} from "@/utils/extension";
import { Theme } from "@/utils/theme";

type StateProps = Pick<CoreContextProps, "address" | "theme" | "vault">;

export const CoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StateProps>({
    theme: getTheme(),
  });
  const { address, theme, vault } = state;
  const [messageAPI, messageHolder] = Message.useMessage();
  const [modalAPI, modalHolder] = Modal.useModal();

  const clear = useCallback(() => {
    disconnectFromExtension().finally(() => {
      delToken(getVaultId());
      delVaultId();
      setState((prevState) => ({
        ...prevState,
        address: undefined,
        vault: undefined,
      }));
    });
  }, []);

  const connect = useCallback(() => {
    connectToExtension()
      .then((address: string) =>
        getVault()
          .then(async (vaultData) => {
            const {
              name,
              hexChainCode,
              publicKeyEcdsa,
              publicKeyEddsa,
              uid,
            } = vaultData;

            const vaultInfo: VaultInfo = {
              name,
              publicKeyEcdsa,
              publicKeyEddsa,
              hexChainCode,
              uid,
            };

            const token = getToken(publicKeyEcdsa);

            if (token) {
              setVaultId(publicKeyEcdsa);

              setState((prevState) => ({
                ...prevState,
                address,
                vault: vaultInfo,
              }));
            } else {
              const nonce = hexlify(randomBytes(16));
              const expiryTime = new Date(
                Date.now() + 15 * 60 * 1000
              ).toISOString();

              const message = JSON.stringify({
                message: "Sign into Vultisig Developer Portal",
                nonce: nonce,
                expiresAt: expiryTime,
                address,
              });

              personalSign(address, message, "connect").then((signature) =>
                authenticate({
                  chain_code_hex: hexChainCode,
                  public_key: publicKeyEcdsa,
                  signature,
                  message,
                })
                  .then((response) => {
                    setToken(publicKeyEcdsa, response.token);
                    setVaultId(publicKeyEcdsa);

                    setState((prevState) => ({
                      ...prevState,
                      address: response.address,
                      vault: vaultInfo,
                    }));

                    messageAPI.success("Successfully authenticated!");
                  })
                  .catch((error) => {
                    messageAPI.error(error.message || "Authentication failed!");
                  })
              );
            }
          })
          .catch((error: Error) => {
            messageAPI.error(error.message);
            clear();
          })
      )
      .catch((error: Error) => messageAPI.error(error.message));
  }, [clear, messageAPI]);

  const disconnect = () => {
    modalAPI.confirm({
      title: "Are you sure you want to disconnect?",
      okText: "Yes",
      okType: "default",
      cancelText: "No",
      onOk() {
        clear();
      },
    });
  };

  const setTheme = (theme: Theme, fromStorage?: boolean) => {
    if (!fromStorage) setThemeStorage(theme);

    setState((prevState) => ({ ...prevState, theme }));
  };

  useLocalStorageWatcher(storageKeys.theme, () => {
    setTheme(getTheme(), true);
  });

  return (
    <CoreContext.Provider
      value={{
        address,
        connect,
        disconnect,
        setTheme,
        theme,
        vault,
      }}
    >
      {children}
      {messageHolder}
      {modalHolder}
    </CoreContext.Provider>
  );
};
