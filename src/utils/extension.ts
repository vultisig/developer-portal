declare global {
  interface Window {
    vultisig: {
      ethereum: {
        request: <T>(args: {
          method: string;
          params?: unknown[];
        }) => Promise<T>;
      };
      getVault: () => Promise<{
        hexChainCode: string;
        isFastVault: boolean;
        localPartyId: string;
        name: string;
        parties: string[];
        publicKeyEcdsa: string;
        publicKeyEddsa: string;
        uid: string;
      }>;
      plugin: {
        request: <T>(args: { method: string; params?: unknown[] }) => Promise<T>;
      };
    };
  }
}

export const connect = async () => {
  await isAvailable();

  try {
    const [account]: string[] = await window.vultisig.ethereum.request({
      method: "eth_requestAccounts",
      params: [{ preselectFastVault: true }],
    });

    return account;
  } catch {
    throw new Error("Connection failed");
  }
};

export const disconnect = async () => {
  await isAvailable();

  await window.vultisig.ethereum.request({
    method: "wallet_revokePermissions",
  });
};

export const getVault = async () => {
  await isAvailable();

  const vault = await window.vultisig.getVault();

  if (vault) {
    if (!vault.hexChainCode || !vault.publicKeyEcdsa)
      throw new Error("Missing required vault data");

    if (!vault.isFastVault)
      throw new Error("Only Fast Vaults can connect to the Developer Portal");

    return vault;
  } else {
    throw new Error("Vault not found");
  }
};

export const isAvailable = async () => {
  if (!window.vultisig) throw new Error("Please install Vultisig Extension");

  return;
};

export const personalSign = async (
  address: string,
  message: string,
  type: "connect" | "policy",
  pluginId?: string
) => {
  await isAvailable();

  const signature = await window.vultisig.plugin.request<
    string | { error?: string }
  >({
    method: "personal_sign",
    params: [message, address, type, ...(pluginId ? [pluginId] : [])],
  });

  if (typeof signature === "object" && signature?.error)
    throw new Error(signature.error);

  return signature as string;
};

/**
 * Sign typed data using EIP-712
 */
export const signTypedData = async (
  address: string,
  typedData: {
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    domain: Record<string, unknown>;
    message: Record<string, unknown>;
  }
): Promise<string> => {
  await isAvailable();

  // EIP-712 signing via eth_signTypedData_v4
  const signature = await window.vultisig.ethereum.request<string>({
    method: "eth_signTypedData_v4",
    params: [address, JSON.stringify(typedData)],
  });

  if (typeof signature === "object" && (signature as { error?: string })?.error) {
    throw new Error((signature as { error: string }).error);
  }

  return signature;
};
