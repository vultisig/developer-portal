import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { getKillSwitch, getPluginPricings, getPlugins, KillSwitchStatus } from "@/api/plugins";
import { useCore } from "@/hooks/useCore";
import { EditIcon } from "@/icons/EditIcon";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { formatCurrency, formatDate } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Plugin, PluginPricing } from "@/utils/types";

type PluginWithPricing = Plugin & {
  pricings: PluginPricing[];
  killSwitch?: KillSwitchStatus | null;
};

export const PluginsPage = () => {
  const { vault } = useCore();
  const navigate = useNavigate();
  const colors = useTheme();
  const [loading, setLoading] = useState(true);
  const [plugins, setPlugins] = useState<PluginWithPricing[]>([]);

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const pluginList = await getPlugins();
        const pluginsWithData = await Promise.all(
          pluginList.map(async (plugin) => {
            const pricings = await getPluginPricings(plugin.id);
            // Try to fetch kill switch (may fail with 403 for non-admin/staff)
            let killSwitch: KillSwitchStatus | null = null;
            try {
              killSwitch = await getKillSwitch(plugin.id);
            } catch {
              // User may not have permission to view kill switch
            }
            return { ...plugin, pricings, killSwitch };
          })
        );
        setPlugins(pluginsWithData);
      } catch (error) {
        console.error("Failed to fetch plugins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlugins();
  }, []);

  const columns: ColumnsType<PluginWithPricing> = [
    {
      title: "Plugin",
      dataIndex: "title",
      key: "title",
      render: (title: string, record) => (
        <VStack $style={{ gap: "4px" }}>
          <Stack $style={{ fontWeight: "600" }}>{title}</Stack>
          <Stack
            $style={{
              color: colors.textTertiary.toHex(),
              fontSize: "12px",
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.description}
          </Stack>
        </VStack>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <Tag color="blue">{category.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Pricing",
      key: "pricing",
      render: (_, record) => (
        <VStack $style={{ gap: "4px" }}>
          {record.pricings.length > 0 ? (
            record.pricings.map((pricing) => (
              <Stack key={pricing.id} $style={{ fontSize: "12px" }}>
                {formatCurrency(pricing.amount)} {pricing.asset.toUpperCase()} / {pricing.type}
                {pricing.frequency && ` (${pricing.frequency})`}
              </Stack>
            ))
          ) : (
            <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "12px" }}>
              Free
            </Stack>
          )}
        </VStack>
      ),
    },
    {
      title: "Endpoint",
      dataIndex: "serverEndpoint",
      key: "serverEndpoint",
      render: (endpoint: string) => (
        <Stack
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "12px",
            fontFamily: "monospace",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {endpoint}
        </Stack>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        record.killSwitch ? (
          <HStack $style={{ gap: "8px" }}>
            <Stack
              $style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: record.killSwitch.keygenEnabled
                  ? colors.success.toHex()
                  : colors.error.toHex(),
                color: colors.neutral50.toHex(),
              }}
            >
              Keygen
            </Stack>
            <Stack
              $style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: record.killSwitch.keysignEnabled
                  ? colors.success.toHex()
                  : colors.error.toHex(),
                color: colors.neutral50.toHex(),
              }}
            >
              Keysign
            </Stack>
          </HStack>
        ) : (
          <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
            —
          </Stack>
        )
      ),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => (
        <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
          {formatDate(date)}
        </Stack>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          kind="secondary"
          icon={<EditIcon />}
          onClick={() => navigate(routeTree.pluginEdit.link(record.id))}
        >
          Edit
        </Button>
      ),
    },
  ];

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
          Please connect your Vultisig wallet to view your plugins
        </Stack>
      </VStack>
    );
  }

  if (loading) {
    return <Spin centered />;
  }

  return (
    <VStack $style={{ gap: "24px" }}>
      <HStack $style={{ alignItems: "center", justifyContent: "space-between" }}>
        <VStack $style={{ gap: "4px" }}>
          <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
            Your Plugins
          </Stack>
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            Manage and configure your registered plugins
          </Stack>
        </VStack>
        <Stack $style={{ color: colors.textTertiary.toHex() }}>
          {plugins.length} plugin{plugins.length !== 1 ? "s" : ""}
        </Stack>
      </HStack>

      <Table
        columns={columns}
        dataSource={plugins}
        rowKey="id"
        pagination={false}
        style={{ width: "100%" }}
      />
    </VStack>
  );
};
