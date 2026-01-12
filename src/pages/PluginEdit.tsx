import { Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { getPlugin, getPluginApiKeys, getPluginPricings, updatePlugin } from "@/api/plugins";
import { useCore } from "@/hooks/useCore";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { formatCurrency, formatDate } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Plugin, PluginApiKey, PluginPricing } from "@/utils/types";

const { TextArea } = Input;

export const PluginEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { vault } = useCore();
  const navigate = useNavigate();
  const colors = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [pricings, setPricings] = useState<PluginPricing[]>([]);
  const [apiKeys, setApiKeys] = useState<PluginApiKey[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serverEndpoint, setServerEndpoint] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchPlugin = async () => {
      if (!id) return;

      try {
        const [pluginData, pricingData, apiKeyData] = await Promise.all([
          getPlugin(id),
          getPluginPricings(id),
          getPluginApiKeys(id),
        ]);

        if (pluginData) {
          setPlugin(pluginData);
          setTitle(pluginData.title);
          setDescription(pluginData.description);
          setServerEndpoint(pluginData.serverEndpoint);
          setCategory(pluginData.category);
        }
        setPricings(pricingData);
        setApiKeys(apiKeyData);
      } catch (error) {
        console.error("Failed to fetch plugin:", error);
        message.error("Failed to load plugin");
      } finally {
        setLoading(false);
      }
    };

    fetchPlugin();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    try {
      await updatePlugin(id, {
        title,
        description,
        serverEndpoint,
        category,
      });
      message.success("Plugin updated successfully");
      navigate(routeTree.plugins.path);
    } catch (error) {
      console.error("Failed to update plugin:", error);
      message.error("Failed to update plugin");
    } finally {
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
          <Button onClick={handleSave} loading={saving}>
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
    </VStack>
  );
};
