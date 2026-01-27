import { DatePicker, Input, message, Modal, Switch } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import {
  createPluginApiKey,
  deletePluginApiKey,
  getPlugin,
  getPluginApiKeys,
  getPluginPricings,
  updatePlugin,
  updatePluginApiKeyStatus,
} from "@/api/plugins";
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

  // Signing modal state
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<FieldUpdate[]>([]);

  // API Key management state
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyExpiry, setNewKeyExpiry] = useState<dayjs.Dayjs | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [updatingKeyId, setUpdatingKeyId] = useState<string | null>(null);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

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
    };

    const updated: Record<string, string> = {
      title,
      description,
      serverEndpoint,
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

  // API Key handlers
  const handleCreateApiKey = async () => {
    if (!id) return;

    setCreatingKey(true);
    try {
      const response = await createPluginApiKey(id, {
        expiresAt: newKeyExpiry ? newKeyExpiry.toISOString() : undefined,
      });

      // Store the full key to show in the modal
      setNewlyCreatedKey(response.apikey);
      setShowCreateKeyModal(false);
      setShowNewKeyModal(true);
      setNewKeyExpiry(null);

      // Refresh the API keys list
      const apiKeyData = await getPluginApiKeys(id);
      setApiKeys(apiKeyData);

      message.success("API key created successfully");
    } catch (error) {
      console.error("Failed to create API key:", error);
      message.error(error instanceof Error ? error.message : "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleToggleKeyStatus = async (keyId: string, currentStatus: number) => {
    if (!id) return;

    setUpdatingKeyId(keyId);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await updatePluginApiKeyStatus(id, keyId, newStatus);

      // Refresh the API keys list
      const apiKeyData = await getPluginApiKeys(id);
      setApiKeys(apiKeyData);

      message.success(`API key ${newStatus === 1 ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Failed to update API key:", error);
      message.error(error instanceof Error ? error.message : "Failed to update API key");
    } finally {
      setUpdatingKeyId(null);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!id) return;

    setDeletingKeyId(keyId);
    try {
      await deletePluginApiKey(id, keyId);

      // Refresh the API keys list
      const apiKeyData = await getPluginApiKeys(id);
      setApiKeys(apiKeyData);

      message.success("API key deleted");
    } catch (error) {
      console.error("Failed to delete API key:", error);
      message.error(error instanceof Error ? error.message : "Failed to delete API key");
    } finally {
      setDeletingKeyId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  // Check if a key is expired
  const isKeyExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
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

        <VStack $style={{ gap: "8px" }}>
          <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
            Server Endpoint
          </Stack>
          <Input
            value={serverEndpoint}
            onChange={(e) => setServerEndpoint(e.target.value)}
            placeholder="https://your-server.com"
          />
        </VStack>
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
        <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
            API Keys
          </Stack>
          <Button
            kind="secondary"
            onClick={() => setShowCreateKeyModal(true)}
          >
            Create New Key
          </Button>
        </HStack>

        {apiKeys.length > 0 ? (
          <VStack $style={{ gap: "12px" }}>
            {apiKeys.map((apiKey) => {
              const expired = isKeyExpired(apiKey.expiresAt);
              const isUpdating = updatingKeyId === apiKey.id;
              const isDeleting = deletingKeyId === apiKey.id;

              return (
                <HStack
                  key={apiKey.id}
                  $style={{
                    backgroundColor: colors.bgTertiary.toHex(),
                    borderRadius: "8px",
                    padding: "12px 16px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: expired ? 0.6 : 1,
                  }}
                >
                  <VStack $style={{ gap: "4px", flex: 1 }}>
                    <Stack
                      $style={{
                        fontFamily: "monospace",
                        fontSize: "13px",
                        backgroundColor: colors.bgPrimary.toHex(),
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        width: "fit-content",
                      }}
                    >
                      {apiKey.apikey}
                    </Stack>
                    <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                      Created: {formatDate(apiKey.createdAt)}
                      {apiKey.expiresAt && (
                        <span style={{ color: expired ? colors.error.toHex() : undefined }}>
                          {" | "}
                          {expired ? "Expired: " : "Expires: "}
                          {formatDate(apiKey.expiresAt)}
                        </span>
                      )}
                    </Stack>
                  </VStack>

                  <HStack $style={{ gap: "12px", alignItems: "center" }}>
                    {/* Status Toggle */}
                    <HStack $style={{ gap: "8px", alignItems: "center" }}>
                      <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                        {apiKey.status === 1 ? "Enabled" : "Disabled"}
                      </Stack>
                      <Switch
                        checked={apiKey.status === 1}
                        onChange={() => handleToggleKeyStatus(apiKey.id, apiKey.status)}
                        loading={isUpdating}
                        disabled={expired || isDeleting}
                        size="small"
                      />
                    </HStack>

                    {/* Status Badge */}
                    <Stack
                      $style={{
                        backgroundColor: expired
                          ? colors.textTertiary.toHex()
                          : apiKey.status === 1
                          ? colors.success.toHex()
                          : colors.error.toHex(),
                        color: colors.neutral50.toHex(),
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        minWidth: "70px",
                        textAlign: "center",
                      }}
                    >
                      {expired ? "Expired" : apiKey.status === 1 ? "Active" : "Inactive"}
                    </Stack>

                    {/* Delete Button */}
                    <Button
                      kind="secondary"
                      onClick={() => {
                        Modal.confirm({
                          title: "Delete API Key?",
                          content: "This will immediately expire the API key. This action cannot be undone.",
                          okText: "Delete",
                          okType: "danger",
                          cancelText: "Cancel",
                          onOk: () => handleDeleteApiKey(apiKey.id),
                        });
                      }}
                      loading={isDeleting}
                      disabled={expired}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              );
            })}
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

      {/* Create API Key Modal */}
      <Modal
        title="Create New API Key"
        open={showCreateKeyModal}
        onCancel={() => {
          setShowCreateKeyModal(false);
          setNewKeyExpiry(null);
        }}
        footer={[
          <Button
            key="cancel"
            kind="secondary"
            onClick={() => {
              setShowCreateKeyModal(false);
              setNewKeyExpiry(null);
            }}
            disabled={creatingKey}
          >
            Cancel
          </Button>,
          <Button
            key="create"
            onClick={handleCreateApiKey}
            loading={creatingKey}
          >
            Create Key
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "20px", padding: "16px 0" }}>
          <Stack $style={{ color: colors.textSecondary.toHex() }}>
            Create a new API key for this plugin. The key will be shown only once after creation.
          </Stack>

          <VStack $style={{ gap: "8px" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Expiry Date (optional)
            </Stack>
            <DatePicker
              value={newKeyExpiry}
              onChange={(date) => setNewKeyExpiry(date)}
              placeholder="No expiry (never expires)"
              showTime
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              style={{ width: "100%" }}
            />
            <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
              Leave empty for a key that never expires. You can always delete it later.
            </Stack>
          </VStack>
        </VStack>
      </Modal>

      {/* Newly Created Key Modal */}
      <Modal
        title="API Key Created"
        open={showNewKeyModal}
        onCancel={() => {
          setShowNewKeyModal(false);
          setNewlyCreatedKey(null);
        }}
        footer={[
          <Button
            key="copy"
            onClick={() => {
              if (newlyCreatedKey) {
                copyToClipboard(newlyCreatedKey);
              }
            }}
          >
            Copy Key
          </Button>,
          <Button
            key="done"
            kind="secondary"
            onClick={() => {
              setShowNewKeyModal(false);
              setNewlyCreatedKey(null);
            }}
          >
            Done
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "16px", padding: "16px 0" }}>
          <Stack
            $style={{
              backgroundColor: colors.warning.toHex(),
              color: colors.neutral900.toHex(),
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            <strong>Important:</strong> Copy this API key now. You won&apos;t be able to see it again!
          </Stack>

          <VStack $style={{ gap: "8px" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Your new API key:
            </Stack>
            <HStack
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "8px",
                padding: "12px 16px",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Stack
                $style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  flex: 1,
                  wordBreak: "break-all",
                }}
              >
                {newlyCreatedKey}
              </Stack>
              <Button
                kind="secondary"
                onClick={() => {
                  if (newlyCreatedKey) {
                    copyToClipboard(newlyCreatedKey);
                  }
                }}
              >
                Copy
              </Button>
            </HStack>
          </VStack>

          <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
            Use this key to authenticate API requests to your plugin. Include it in the
            Authorization header as: <code>Bearer {"{your-api-key}"}</code>
          </Stack>
        </VStack>
      </Modal>
    </VStack>
  );
};
