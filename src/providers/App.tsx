import { Modal } from "antd";
import { hexlify, randomBytes } from "ethers";
import Lottie from "lottie-react";
import { FC, ReactNode, useEffect, useState } from "react";
import { createGlobalStyle, useTheme } from "styled-components";

import { setUnauthorizedHandler } from "@/api/client";
import { delAuthToken, getAuthToken } from "@/api/portal";
import splashScreen from "@/assets/logo.json";
import { AppContext, AppContextProps } from "@/context/App";
import { getVaults, setVaults } from "@/storage/vaults";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { Stack, VStack } from "@/toolkits/Stack";
import * as extensionAPI from "@/utils/extension";
import { match } from "@/utils/functions";
import { Vault } from "@/utils/types";

type StateProps = Pick<AppContextProps, "vault"> & {
  connectError?: string;
  connectStatus?: "connected" | "connecting" | "retrying" | "signing";
  disconnectStatus?: "confirm" | "pending" | "success";
  loaded?: boolean;
  vault?: Vault;
};

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StateProps>({});
  const { connectError, connectStatus, disconnectStatus, loaded, vault } =
    state;
  const colors = useTheme();

  const clear = () => {
    extensionAPI.disconnect().finally(() => {
      setState((prev) => ({ ...prev, vault: undefined }));
      setVaults([]);
    });
  };

  const connect = async () => {
    try {
      setState((prev) => ({
        ...prev,
        connectError: undefined,
        connectStatus: "connecting",
      }));

      const address = await extensionAPI.connect();
      const vault = await extensionAPI.getVault();

      setState((prev) => ({
        ...prev,
        connectError: undefined,
        connectStatus: "signing",
      }));

      const message = JSON.stringify({
        address,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        message: "Sign into Vultisig Plugin Marketplace",
        nonce: hexlify(randomBytes(16)),
      });

      const signature = await extensionAPI.personalSign(address, message);

      const { accessToken, refreshToken } = await getAuthToken({
        chainCodeHex: vault.hexChainCode,
        publicKey: vault.publicKeyEcdsa,
        signature,
        message,
      });

      setVaults([{ ...vault, accessToken, refreshToken }]);

      setState((prev) => ({ ...prev, connectStatus: "connected", vault }));

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          connectStatus: undefined,
          connectError: undefined,
        }));
      }, 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        connectError: (error as Error).message,
        connectStatus: "retrying",
      }));
    }
  };

  const disconnect = async () => {
    setState((prev) => ({ ...prev, disconnectStatus: "pending" }));

    const [vault] = getVaults();

    if (vault) await delAuthToken(vault.accessToken).catch(() => {});

    await extensionAPI.disconnect().catch(() => {});

    setState((prev) => ({ ...prev, disconnectStatus: "success" }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        disconnectStatus: undefined,
        vault: undefined,
      }));

      setVaults([]);
    }, 1000);
  };

  useEffect(() => {
    const [vault] = getVaults();

    setState((prev) => ({ ...prev, loaded: true, vault }));

    setUnauthorizedHandler(clear);
  }, []);

  return (
    <AppContext.Provider
      value={{
        connect,
        disconnect: () =>
          setState((prev) => ({ ...prev, disconnectStatus: "confirm" })),
        setVault: (vault) => setState((prev) => ({ ...prev, vault })),
        vault,
      }}
    >
      <GlobalStyle />

      {loaded && children}

      <Modal
        centered={true}
        closable={connectStatus !== "connecting" && connectStatus !== "signing"}
        footer={
          connectStatus &&
          match(connectStatus, {
            connected: () => (
              <Stack
                as="span"
                $style={{ color: colors.success.toHex(), lineHeight: "44px" }}
              >
                Connected
              </Stack>
            ),
            connecting: () => (
              <VStack
                $style={{
                  color: colors.textTertiary.toHex(),
                  height: "44px",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </VStack>
            ),
            retrying: () => <Button onClick={connect}>Retry</Button>,
            signing: () => (
              <VStack
                $style={{
                  color: colors.textTertiary.toHex(),
                  height: "44px",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </VStack>
            ),
          })
        }
        mask={{ closable: false }}
        onCancel={() =>
          setState((prev) => ({ ...prev, connectStatus: undefined }))
        }
        styles={{
          body: {
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          },
          container: { display: "flex", flexDirection: "column", gap: 24 },
          footer: { display: "flex", justifyContent: "center", marginTop: 0 },
        }}
        title={false}
        width={480}
        open={Boolean(connectStatus)}
        zIndex={1002}
      >
        <VStack>
          <Lottie
            animationData={splashScreen}
            loop={connectStatus === "connecting" || connectStatus === "signing"}
          />
        </VStack>
        <VStack $style={{ alignItems: "center", gap: "4px" }}>
          <Stack
            as="span"
            $style={{ fontSize: "18px", fontWeight: "700", lineHeight: "24px" }}
          >
            Connecting to Vultisig Extension
          </Stack>
          <Stack
            as="span"
            $style={{
              color: colors.textTertiary.toHex(),
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "18px",
              textAlign: "center",
            }}
          >
            {connectError ||
              (connectStatus &&
                match(connectStatus, {
                  connected: () => "Connection established",
                  connecting: () => "Waiting for approval...",
                  retrying: () => "Connection failed. Please try again",
                  signing: () => "Approve the request in Vultisig Extension",
                }))}
          </Stack>
        </VStack>
      </Modal>

      <Modal
        centered={true}
        closable={disconnectStatus !== "pending"}
        footer={
          disconnectStatus &&
          match(disconnectStatus, {
            confirm: () => (
              <Button kind="warning" onClick={disconnect}>
                Disconnect
              </Button>
            ),
            pending: () => (
              <VStack
                $style={{
                  color: colors.textTertiary.toHex(),
                  height: "44px",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </VStack>
            ),
            success: () => (
              <Stack
                as="span"
                $style={{ color: colors.success.toHex(), lineHeight: "44px" }}
              >
                Disconnected
              </Stack>
            ),
          })
        }
        mask={{ closable: false }}
        onCancel={() =>
          setState((prev) => ({ ...prev, disconnectStatus: undefined }))
        }
        styles={{
          body: {
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          },
          container: { display: "flex", flexDirection: "column", gap: 24 },
          footer: { display: "flex", justifyContent: "center", marginTop: 0 },
        }}
        width={480}
        open={Boolean(disconnectStatus)}
        zIndex={1002}
      >
        <Lottie animationData={splashScreen} loop={false} />
        <Stack
          as="span"
          $style={{ fontSize: "18px", fontWeight: "700", lineHeight: "24px" }}
        >
          Disconnect from Vultisig Extension?
        </Stack>
      </Modal>
    </AppContext.Provider>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.bgPrimary.toHex()};
    color: ${({ theme }) => theme.textPrimary.toHex()};
  }
`;
