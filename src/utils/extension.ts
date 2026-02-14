import { Vault } from "@/utils/types";

type VultisigProviderItem = {
  request: <T>(params: { method: string; params?: unknown[] }) => Promise<T>;
};

type VultisigProvider = {
  ethereum: VultisigProviderItem;
  bitcoin: VultisigProviderItem;
  solana: VultisigProviderItem;
  ripple: VultisigProviderItem;
  zcash: VultisigProviderItem;
  plugin: VultisigProviderItem;
  getVault: () => Promise<Vault>;
};

declare global {
  interface Window {
    vultisig: VultisigProvider;
  }
}

export const connect = async () => {
  const [account] = await window.vultisig.ethereum.request<string[]>({
    method: "eth_requestAccounts",
    params: [{ preselectFastVault: true }],
  });

  return account;
};

export const disconnect = async () => {
  await window.vultisig.ethereum.request({
    method: "wallet_revokePermissions",
  });
};

export const getVault = async () => {
  try {
    const vault = await window.vultisig.getVault();

    if (!vault) throw new Error("No vault found");

    if (!vault.hexChainCode || !vault.publicKeyEcdsa)
      throw new Error("Missing required vault data");

    if (!vault.isFastVault)
      throw new Error(
        "Your vault type isn't supported. Please use a Fast Vault",
      );

    return vault;
  } catch (error) {
    await disconnect();

    throw error;
  }
};

export const isAvailable = async () => {
  if (!window.vultisig) throw new Error("Please install Vultisig Extension");

  return;
};

export const personalSign = async (
  address: string,
  message: string,
  appId?: string,
) => {
  const signature = await window.vultisig.plugin.request<
    string | { error?: string }
  >({
    method: "personal_sign",
    params: [message, address, ...(appId ? ["policy", appId] : ["connect"])],
  });

  if (typeof signature === "object" && signature?.error)
    throw new Error(signature.error);

  return signature as string;
};
