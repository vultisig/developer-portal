export const EIP712_DOMAIN: Record<string, unknown> = {
  name: "Vultisig Developer Portal",
  version: "1",
  chainId: 1,
};

export const EIP712_TYPES: Record<
  string,
  Array<{ name: string; type: string }>
> = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
  ],
  PluginUpdate: [
    { name: "pluginId", type: "string" },
    { name: "signer", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "timestamp", type: "uint256" },
    { name: "updates", type: "FieldUpdate[]" },
  ],
  FieldUpdate: [
    { name: "field", type: "string" },
    { name: "oldValue", type: "string" },
    { name: "newValue", type: "string" },
  ],
};

export type FieldUpdate = {
  field: string;
  oldValue: string;
  newValue: string;
};

export type PluginUpdateMessage = {
  pluginId: string;
  signer: string;
  nonce: number;
  timestamp: number;
  updates: FieldUpdate[];
};

export const computeFieldUpdates = (
  original: Record<string, string>,
  updated: Record<string, string>,
): FieldUpdate[] => {
  const updates: FieldUpdate[] = [];

  for (const field of Object.keys(updated)) {
    const oldValue = original[field] ?? "";
    const newValue = updated[field] ?? "";

    if (oldValue !== newValue) {
      updates.push({ field, oldValue, newValue });
    }
  }

  return updates;
};

export const createPluginUpdateTypedData = (message: PluginUpdateMessage) => ({
  types: EIP712_TYPES,
  primaryType: "PluginUpdate" as const,
  domain: EIP712_DOMAIN,
  message,
});

export const generateNonce = (): number =>
  Math.floor(Date.now() / 1000) * 1000 + Math.floor(Math.random() * 1000);
