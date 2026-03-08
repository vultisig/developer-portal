import { PluginUpdateMessage } from "@/utils/types";

const EIP712_DOMAIN: Record<string, unknown> = {
  name: "Vultisig Developer Portal",
  version: "1",
  chainId: 1,
};

const EIP712_TYPES: Record<string, Array<{ name: string; type: string }>> = {
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

export const createPluginUpdateTypedData = (message: PluginUpdateMessage) => ({
  types: EIP712_TYPES,
  primaryType: "PluginUpdate" as const,
  domain: EIP712_DOMAIN,
  message,
});
