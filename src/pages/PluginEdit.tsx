import { Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { getPlugin, getPluginApiKeys, getPluginPricings, updatePlugin } from "@/api/plugins";
import { useCore } from "@/hooks/useCore";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import {
  computeFieldUpdates,
  createPluginUpdateTypedData,
  FieldUpdate,
  generateNonce,
  PluginUpdateMessage,
} from "@/utils/eip712";
import { signTypedData } from "@/utils/extension";
import { formatCurrency, formatDate } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Plugin, PluginApiKey, PluginPricing } from "@/utils/types";

const { TextArea } = Input;

export const PluginEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { address, vault } = useCore();
  const navigate = useNavigate();
  const colors = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signing, setSigning] = useState(false);
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [pricings, setPricings] = useState<PluginPricing[]>([]);
  const [apiKeys, setApiKeys] = useState<PluginApiKey[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serverEndpoint, setServerEndpoint] = useState("");
  const [category, setCategory] = useState("");

  // Signing modal state
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<FieldUpdate[]>([]);

  useEffect(() => {
    const fetchPlugin = async () => {
      if (!id) return;

      try {
        // Fetch plugin and pricings (public endpoints)
        const [pluginData, pricingData] = await Promise.all([
          getPlugin(id),
          getPluginPricings(id),
        ]);

        if (pluginData) {
          setPlugin(pluginData);
          setTitle(pluginData.title);
          setDescription(pluginData.description);
          setServerEndpoint(pluginData.serverEndpoint);
          setCategory(pluginData.category);
        }
        setPricings(pricingData);

        // Fetch API keys (requires ownership - may fail with 403)
        try {
          const apiKeyData = await getPluginApiKeys(id);
          setApiKeys(apiKeyData);
        } catch (apiKeyError) {
          // User may not be authorized to view API keys
          console.warn("Could not fetch API keys:", apiKeyError);
          setApiKeys([]);
        }
      } catch (error) {
        console.error("Failed to fetch plugin:", error);
        message.error("Failed to load plugin");
      } finally {
        setLoading(false);
      }
    };

    fetchPlugin();
  }, [id]);

  const handleSaveClick = () => {
    if (!id || !plugin) return;

    // Compute field updates by comparing original and current values
    const original: Record<string, string> = {
      title: plugin.title,
      description: plugin.description,
      serverEndpoint: plugin.serverEndpoint,
      category: plugin.category,
    };

    const updated: Record<string, string> = {
      title,
      description,
      serverEndpoint,
      category,
    };

    const updates = computeFieldUpdates(original, updated);

    if (updates.length === 0) {
      message.info("No changes to save");
      return;
    }

    // Show signing modal with pending updates
    setPendingUpdates(updates);
    setShowSigningModal(true);
  };

  const handleSignAndSave = async () => {
    if (!id || !address) return;

    setSigning(true);
    try {
      // Create EIP-712 typed data message
      const updateMessage: PluginUpdateMessage = {
        pluginId: id,
        signer: address,
        nonce: generateNonce(),
        timestamp: Math.floor(Date.now() / 1000),
        updates: pendingUpdates,
      };

      const typedData = createPluginUpdateTypedData(updateMessage);

      // Request EIP-712 signature from wallet
      const signature = await signTypedData(address, typedData);

      if (!signature) {
        throw new Error("Signature was not provided");
      }

      // Save the plugin with the signature
      setSaving(true);
      await updatePlugin(id, {
        title,
        description,
        serverEndpoint,
        category,
        signature,
        signedMessage: updateMessage,
      });

      setShowSigningModal(false);
      message.success("Plugin updated successfully");
      navigate(routeTree.plugins.path);
    } catch (error) {
      console.error("Failed to sign or update plugin:", error);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Failed to sign or update plugin");
      }
    } finally {
      setSigning(false);
      setSaving(false);
    }
  };

  if (!vault) {
    return (
      <VStack
        $style={{
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          gap: "16px",
        }}
      >
        <Stack
          $style={{
            fontSize: "18px",
            color: colors.textTertiary.toHex(),
          }}
        >
          Please connect your Vultisig wallet to edit plugins
        </Stack>
      </VStack>
    );
  }

  if (loading) {
    return <Spin centered />;
  }

  if (!plugin) {
    return (
      <VStack
        $style={{
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          gap: "16px",
        }}
      >
        <Stack $style={{ fontSize: "18px", color: colors.textTertiary.toHex() }}>
          Plugin not found
        </Stack>
        <Button onClick={() => navigate(routeTree.plugins.path)}>
          Back to Plugins
        </Button>
      </VStack>
    );
  }

  return (
    <VStack $style={{ gap: "32px", maxWidth: "800px" }}>
      {/* Header */}
      <HStack $style={{ alignItems: "center", justifyContent: "space-between" }}>
        <VStack $style={{ gap: "4px" }}>
          <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
            Edit Plugin
          </Stack>
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            ID: {plugin.id}
          </Stack>
        </VStack>
        <HStack $style={{ gap: "12px" }}>
          <Button kind="secondary" onClick={() => navigate(routeTree.plugins.path)}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick} loading={saving}>
            Save Changes
          </Button>
        </HStack>
      </HStack>

      {/* Basic Information */}
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "20px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          Basic Information
        </Stack>

        <VStack $style={{ gap: "8px" }}>
          <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
            Title
          </Stack>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Plugin title"
          />
        </VStack>

        <VStack $style={{ gap: "8px" }}>
          <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
            Description
          </Stack>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Plugin description"
            rows={4}
          />
        </VStack>

        <HStack $style={{ gap: "16px" }}>
          <VStack $style={{ gap: "8px", flex: "1" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Server Endpoint
            </Stack>
            <Input
              value={serverEndpoint}
              onChange={(e) => setServerEndpoint(e.target.value)}
              placeholder="https://your-server.com"
            />
          </VStack>

          <VStack $style={{ gap: "8px", width: "200px" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Category
            </Stack>
            <Select
              value={category}
              onChange={setCategory}
              options={[
                { value: "app", label: "App" },
                { value: "defi", label: "DeFi" },
                { value: "trading", label: "Trading" },
                { value: "utility", label: "Utility" },
              ]}
            />
          </VStack>
        </HStack>
      </VStack>

      {/* Pricing Information */}
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "16px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          Pricing Configuration
        </Stack>

        {pricings.length > 0 ? (
          <VStack $style={{ gap: "12px" }}>
            {pricings.map((pricing) => (
              <HStack
                key={pricing.id}
                $style={{
                  backgroundColor: colors.bgTertiary.toHex(),
                  borderRadius: "8px",
                  padding: "12px 16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <VStack $style={{ gap: "4px" }}>
                  <Stack $style={{ fontWeight: "500" }}>
                    {pricing.type.charAt(0).toUpperCase() + pricing.type.slice(1).replace("-", " ")}
                    {pricing.frequency && ` (${pricing.frequency})`}
                  </Stack>
                  <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                    {pricing.asset.toUpperCase()} - {pricing.metric}
                  </Stack>
                </VStack>
                <Stack $style={{ fontSize: "18px", fontWeight: "600" }}>
                  {formatCurrency(pricing.amount, 4)}
                </Stack>
              </HStack>
            ))}
          </VStack>
        ) : (
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            No pricing configured - this plugin is free
          </Stack>
        )}
      </VStack>

      {/* API Keys */}
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "16px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          API Keys
        </Stack>

        {apiKeys.length > 0 ? (
          <VStack $style={{ gap: "12px" }}>
            {apiKeys.map((apiKey) => (
              <HStack
                key={apiKey.id}
                $style={{
                  backgroundColor: colors.bgTertiary.toHex(),
                  borderRadius: "8px",
                  padding: "12px 16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <VStack $style={{ gap: "4px" }}>
                  <Stack
                    $style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      backgroundColor: colors.bgPrimary.toHex(),
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {apiKey.apikey}
                  </Stack>
                  <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                    Created: {formatDate(apiKey.createdAt)}
                    {apiKey.expiresAt && ` | Expires: ${formatDate(apiKey.expiresAt)}`}
                  </Stack>
                </VStack>
                <Stack
                  $style={{
                    backgroundColor: apiKey.status === 1 ? colors.success.toHex() : colors.error.toHex(),
                    color: colors.neutral50.toHex(),
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                >
                  {apiKey.status === 1 ? "Active" : "Inactive"}
                </Stack>
              </HStack>
            ))}
          </VStack>
        ) : (
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            No API keys configured
          </Stack>
        )}
      </VStack>

      {/* Metadata */}
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "12px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          Metadata
        </Stack>
        <HStack $style={{ gap: "32px" }}>
          <VStack $style={{ gap: "4px" }}>
            <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
              Created
            </Stack>
            <Stack>{formatDate(plugin.createdAt)}</Stack>
          </VStack>
          <VStack $style={{ gap: "4px" }}>
            <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
              Last Updated
            </Stack>
            <Stack>{formatDate(plugin.updatedAt)}</Stack>
          </VStack>
          {plugin.publicKey && (
            <VStack $style={{ gap: "4px" }}>
              <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                Public Key
              </Stack>
              <Stack
                $style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {plugin.publicKey}
              </Stack>
            </VStack>
          )}
        </HStack>
      </VStack>

      {/* EIP-712 Signing Modal */}
      <Modal
        title="Sign Plugin Update"
        open={showSigningModal}
        onCancel={() => setShowSigningModal(false)}
        footer={[
          <Button
            key="cancel"
            kind="secondary"
            onClick={() => setShowSigningModal(false)}
            disabled={signing}
          >
            Cancel
          </Button>,
          <Button
            key="sign"
            onClick={handleSignAndSave}
            loading={signing}
          >
            Sign & Save
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "16px", padding: "16px 0" }}>
          <Stack $style={{ color: colors.textSecondary.toHex() }}>
            Please sign to confirm the following changes to plugin{" "}
            <strong>{plugin?.title || id}</strong>:
          </Stack>

          <VStack
            $style={{
              backgroundColor: colors.bgTertiary.toHex(),
              borderRadius: "8px",
              padding: "16px",
              gap: "12px",
            }}
          >
            {pendingUpdates.map((update, index) => (
              <VStack key={index} $style={{ gap: "4px" }}>
                <Stack
                  $style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: colors.textPrimary.toHex(),
                  }}
                >
                  {update.field}
                </Stack>
                <HStack $style={{ gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <Stack
                    $style={{
                      fontSize: "12px",
                      color: colors.error.toHex(),
                      textDecoration: "line-through",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {update.oldValue || "(empty)"}
                  </Stack>
                  <Stack $style={{ color: colors.textTertiary.toHex() }}>→</Stack>
                  <Stack
                    $style={{
                      fontSize: "12px",
                      color: colors.success.toHex(),
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {update.newValue || "(empty)"}
                  </Stack>
                </HStack>
              </VStack>
            ))}
          </VStack>

          <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
            This action requires an EIP-712 signature from your connected wallet to verify
            your authorization.
          </Stack>
        </VStack>
      </Modal>
    </VStack>
  );
};
