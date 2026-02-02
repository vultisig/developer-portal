import { DatePicker, Select, Table, Tag } from "antd";
import { TablePaginationConfig } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTheme } from "styled-components";

import { EarningsFilters, getEarnings, getEarningsSummary, getPlugins } from "@/api/plugins";
import { useCore } from "@/hooks/useCore";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { formatCurrency, formatDate, truncateAddress } from "@/utils/functions";
import { EarningTransaction, Plugin } from "@/utils/types";

const { RangePicker } = DatePicker;

export const EarningsPage = () => {
  const { vault } = useCore();
  const colors = useTheme();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningTransaction[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [summary, setSummary] = useState<{
    totalEarnings: number;
    totalTransactions: number;
    earningsByPlugin: Record<string, number>;
  } | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters
  const [filters, setFilters] = useState<EarningsFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [earningsResponse, pluginsData, summaryData] = await Promise.all([
          getEarnings({ ...filters, page, limit: pageSize }),
          getPlugins(),
          getEarningsSummary(),
        ]);
        setEarnings(earningsResponse.data);
        setTotal(earningsResponse.total);
        setPlugins(pluginsData);
        setSummary(summaryData);
      } catch (error) {
        console.error("Failed to fetch earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, page, pageSize]);

  const columns: ColumnsType<EarningTransaction> = [
    {
      title: "Plugin",
      dataIndex: "pluginName",
      key: "pluginName",
      render: (name: string) => (
        <Stack $style={{ fontWeight: "500" }}>{name}</Stack>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const typeColors: Record<string, string> = {
          "per-tx": "blue",
          once: "green",
          recurring: "purple",
        };
        return (
          <Tag color={typeColors[type] || "default"}>
            {type.replace("-", " ").toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record) => (
        <Stack $style={{ fontWeight: "600", color: colors.success.toHex() }}>
          +{formatCurrency(amount, 4)} {record.asset.toUpperCase()}
        </Stack>
      ),
    },
    {
      title: "From",
      dataIndex: "fromAddress",
      key: "fromAddress",
      render: (address: string) => (
        <Stack
          $style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: colors.textTertiary.toHex(),
          }}
        >
          {truncateAddress(address, 8)}
        </Stack>
      ),
    },
    {
      title: "Transaction",
      dataIndex: "txHash",
      key: "txHash",
      render: (hash: string) => (
        <Stack
          $style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: colors.textTertiary.toHex(),
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {hash}
        </Stack>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          completed: "green",
          pending: "orange",
          failed: "red",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
          {formatDate(date)}
        </Stack>
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
          Please connect your Vultisig wallet to view your earnings
        </Stack>
      </VStack>
    );
  }

  if (loading) {
    return <Spin centered />;
  }

  return (
    <VStack $style={{ gap: "24px" }}>
      {/* Header */}
      <VStack $style={{ gap: "4px" }}>
        <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
          Earnings
        </Stack>
        <Stack $style={{ color: colors.textTertiary.toHex() }}>
          Track fee transactions from your plugins
        </Stack>
      </VStack>

      {/* Summary Cards */}
      {summary && (
        <HStack $style={{ gap: "16px" }}>
          <VStack
            $style={{
              backgroundColor: colors.bgSecondary.toHex(),
              borderRadius: "12px",
              border: `1px solid ${colors.borderLight.toHex()}`,
              padding: "20px 24px",
              flex: "1",
            }}
          >
            <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
              Total Earnings
            </Stack>
            <Stack $style={{ fontSize: "28px", fontWeight: "600", color: colors.success.toHex() }}>
              {formatCurrency(summary.totalEarnings, 4)}
            </Stack>
          </VStack>

          <VStack
            $style={{
              backgroundColor: colors.bgSecondary.toHex(),
              borderRadius: "12px",
              border: `1px solid ${colors.borderLight.toHex()}`,
              padding: "20px 24px",
              flex: "1",
            }}
          >
            <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
              Total Transactions
            </Stack>
            <Stack $style={{ fontSize: "28px", fontWeight: "600" }}>
              {summary.totalTransactions}
            </Stack>
          </VStack>

          <VStack
            $style={{
              backgroundColor: colors.bgSecondary.toHex(),
              borderRadius: "12px",
              border: `1px solid ${colors.borderLight.toHex()}`,
              padding: "20px 24px",
              flex: "1",
            }}
          >
            <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
              Active Plugins
            </Stack>
            <Stack $style={{ fontSize: "28px", fontWeight: "600" }}>
              {Object.keys(summary.earningsByPlugin).length}
            </Stack>
          </VStack>
        </HStack>
      )}

      {/* Filters */}
      <HStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "16px 20px",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Stack $style={{ fontSize: "14px", fontWeight: "500" }}>Filters:</Stack>

        <Select
          allowClear
          placeholder="All Plugins"
          style={{ width: 200 }}
          onChange={(value) => setFilters((prev) => ({ ...prev, pluginId: value }))}
          options={plugins.map((p) => ({ value: p.id, label: p.title }))}
        />

        <Select
          allowClear
          placeholder="All Types"
          style={{ width: 150 }}
          onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
          options={[
            { value: "per-tx", label: "Per Transaction" },
            { value: "once", label: "One Time" },
            { value: "recurring", label: "Recurring" },
          ]}
        />

        <Select
          allowClear
          placeholder="All Statuses"
          style={{ width: 150 }}
          onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          options={[
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
          ]}
        />

        <RangePicker
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setFilters((prev) => ({
                ...prev,
                dateFrom: dates[0]?.toISOString(),
                dateTo: dates[1]?.toISOString(),
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                dateFrom: undefined,
                dateTo: undefined,
              }));
            }
          }}
          presets={[
            { label: "Last 7 Days", value: [dayjs().subtract(7, "day"), dayjs()] },
            { label: "Last 30 Days", value: [dayjs().subtract(30, "day"), dayjs()] },
            { label: "Last 90 Days", value: [dayjs().subtract(90, "day"), dayjs()] },
          ]}
        />
      </HStack>

      {/* Earnings Table */}
      <Table
        columns={columns}
        dataSource={earnings}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (t: number) => `Total ${t} transactions`,
          pageSizeOptions: [10, 20, 50],
        }}
        onChange={(pagination: TablePaginationConfig) => {
          setPage(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 10);
        }}
        style={{ width: "100%" }}
      />
    </VStack>
  );
};
