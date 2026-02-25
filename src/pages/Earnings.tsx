import {
  Form,
  FormProps,
  Select,
  Table,
  TableProps,
  theme as antTheme,
  Tooltip,
} from "antd";
import { useResponsive } from "antd-style";
import { debounce } from "lodash-es";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "styled-components";

import { getEarnings, getEarningSummary, getPlugins } from "@/api/portal";
import { DateView } from "@/components/DateView";
import { MiddleTruncate } from "@/components/MiddleTruncate";
import { useCore } from "@/hooks/useCore";
import { useFilterParams } from "@/hooks/useFilterParams";
import { CoinsAddIcon } from "@/icons/CoinsAddIcon";
import { LineChartOneIcon } from "@/icons/LineChartOneIcon";
import { NewspaperIcon } from "@/icons/NewspaperIcon";
import { SquareArrowOutTopLeftIcon } from "@/icons/SquareArrowOutTopLeftIcon";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { earningStatuses, earningTypes } from "@/utils/constants";
import {
  camelCaseToTitle,
  getExplorerUrl,
  kebabCaseToTitle,
  match,
  toDecimalFormat,
  toValueFormat,
} from "@/utils/functions";
import { Earning, EarningFilters, EarningSummary, Plugin } from "@/utils/types";

type StateProps = {
  loading: boolean;
  earnings: Earning[];
  plugins: Plugin[];
} & Partial<EarningSummary>;

export const EarningsPage = () => {
  const [state, setState] = useState<StateProps>({
    loading: true,
    earnings: [],
    plugins: [],
  });
  const { loading, earnings, plugins, totalEarnings, totalTransactions } =
    state;
  const { token } = antTheme.useToken();
  const { baseValue, currency } = useCore();
  const { filters, setFilters } = useFilterParams<EarningFilters>();
  const { md } = useResponsive();
  const [form] = Form.useForm<EarningFilters>();
  const colors = useTheme();

  const columns: TableProps<Earning>["columns"] = [
    {
      dataIndex: "pluginName",
      key: "pluginName",
      title: "Plugin",
    },
    {
      align: "center",
      dataIndex: "feeAsset",
      key: "feeAsset",
      title: "From",
      render: (_, { feeAsset }) => {
        return (
          <HStack $style={{ justifyContent: "center" }}>
            <MiddleTruncate $style={{ width: "140px" }}>
              {feeAsset.addr}
            </MiddleTruncate>
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "amount",
      key: "amount",
      title: "Amount",
      render: (_, { amount, feeAsset }) => {
        return (
          <Stack as="span" $style={{ color: colors.success.toHex() }}>
            {baseValue ? (
              `${toValueFormat(
                toDecimalFormat(amount, baseValue, feeAsset.decimals),
                currency,
                feeAsset.decimals,
              )} ${feeAsset.symbol}`
            ) : (
              <Spin size="small" />
            )}
          </Stack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "type",
      key: "type",
      title: "Type",
      render: (_, { type }) => {
        return (
          <HStack $style={{ justifyContent: "center" }}>
            <Stack
              as="span"
              $style={{
                alignItems: "center",
                backgroundColor: colors.info.toRgba(0.05),
                borderRadius: "4px",
                color: colors.info.toHex(),
                fontSize: "12px",
                gap: "4px",
                lineHeight: "24px",
                padding: "0 8px",
                whiteSpace: "nowrap",
              }}
            >
              {kebabCaseToTitle(type)}
            </Stack>
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Created At",
      render: (_, { createdAt }) => {
        return <DateView date={createdAt} />;
      },
    },
    {
      align: "center",
      dataIndex: "statusOnchain",
      key: "statusOnchain",
      title: "Status",
      render: (_, { status }) => {
        const color = match(status, {
          failed: () => colors.error,
          pending: () => colors.warning,
          completed: () => colors.success,
        });

        return (
          <HStack $style={{ justifyContent: "center" }}>
            <Stack
              as="span"
              $style={{
                alignItems: "center",
                backgroundColor: color.toRgba(0.05),
                borderRadius: "4px",
                color: color.toHex(),
                fontSize: "12px",
                gap: "4px",
                lineHeight: "24px",
                padding: "0 8px",
                whiteSpace: "nowrap",
              }}
            >
              {camelCaseToTitle(status)}
            </Stack>
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "txHash",
      key: "txHash",
      title: "Action",
      width: 100,
      render: (_, { txHash, feeAsset }) => {
        if (!txHash) return "-";

        const explorerUrl = getExplorerUrl(feeAsset.network, "tx", txHash);

        return (
          <HStack $style={{ gap: "8px", justifyContent: "center" }}>
            <Tooltip title="Details">
              <HStack
                as={Link}
                to={explorerUrl}
                target="_blank"
                $style={{
                  backgroundColor: colors.bgTertiary.toHex(),
                  borderRadius: "50%",
                  padding: "12px",
                }}
                $hover={{ color: colors.info.toHex() }}
              >
                <SquareArrowOutTopLeftIcon fontSize={16} />
              </HStack>
            </Tooltip>
          </HStack>
        );
      },
    },
  ];

  const debouncedHandleFilter = useMemo(
    () => debounce(setFilters, 500),
    [setFilters],
  );

  const handleFilter: FormProps["onValuesChange"] = (_, values) => {
    debouncedHandleFilter(values);
  };

  const fetchEarnings = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    form.setFieldsValue(filters);

    const earnings = await getEarnings(filters);

    setState((prev) => ({ ...prev, loading: false, earnings }));
  });

  const fetchData = useEffectEvent(async () => {
    const { totalEarnings, totalTransactions } = await getEarningSummary();
    const plugins = await getPlugins();

    setState((prev) => ({
      ...prev,
      plugins,
      totalEarnings,
      totalTransactions,
    }));
  });

  useEffect(() => {
    fetchEarnings();
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      color: colors.textPrimary,
      icon: CoinsAddIcon,
      label: "Total Revenue",
      value:
        baseValue && totalEarnings ? (
          toValueFormat(
            toDecimalFormat(
              totalEarnings.amount,
              baseValue,
              totalEarnings.feeAsset.decimals,
            ),
            currency,
            totalEarnings.feeAsset.decimals,
          )
        ) : (
          <Spin />
        ),
    },
    {
      color: colors.success,
      icon: LineChartOneIcon,
      label: "Revenue Growth",
      value: "0%",
    },
    {
      color: colors.textPrimary,
      icon: NewspaperIcon,
      label: "Total Transactions",
      value: totalTransactions === undefined ? <Spin /> : totalTransactions,
    },
  ];

  return (
    <VStack
      $style={{
        gap: "16px",
        maxWidth: `${token.screenXL}px`,
        padding: "16px",
        width: "100%",
      }}
    >
      <VStack $style={{ gap: "2px" }}>
        <Stack as="span" $style={{ fontSize: "22px", lineHeight: "24px" }}>
          Earnings
        </Stack>
        <Stack
          as="span"
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "13px",
            lineHeight: "18px",
          }}
        >
          Track fee transactions from your plugins
        </Stack>
      </VStack>
      <Stack
        $style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: md ? "repeat(3, 1fr)" : "repeat(1, 1fr)",
        }}
      >
        {stats.map(({ color, icon, label, value }, index) => (
          <HStack
            as="span"
            key={index}
            $style={{
              backgroundColor: colors.bgTertiary.toHex(),
              borderColor: colors.borderLight.toHex(),
              borderRadius: "12px",
              borderStyle: "solid",
              borderWidth: "1px",
              gap: "20px",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <VStack $style={{ gap: "60px" }}>
              <Stack
                as="span"
                $style={{
                  color: colors.textSecondary.toHex(),
                  fontSize: "14px",
                  lineHeight: "18px",
                }}
              >
                {label}
              </Stack>
              <Stack
                as="span"
                $style={{
                  color: color.toHex(),
                  fontSize: "36px",
                  lineHeight: "38px",
                }}
              >
                {value}
              </Stack>
            </VStack>
            <VStack
              $style={{
                alignItems: "center",
                backgroundColor: colors.textPrimary.toRgba(0.03),
                borderRadius: "12px",
                height: "60px",
                justifyContent: "center",
                width: "60px",
              }}
            >
              <Stack as={icon} $style={{ fontSize: "24px" }} />
            </VStack>
          </HStack>
        ))}
      </Stack>
      <HStack
        $style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Stack
          as="span"
          $style={{
            fontSize: "22px",
            lineHeight: "24px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Transactions
        </Stack>
        <Form<EarningFilters> form={form} onValuesChange={handleFilter}>
          <HStack $style={{ gap: "16px" }}>
            <Form.Item<EarningFilters> name="pluginId" noStyle>
              <Select
                options={plugins.map(({ id, title }) => ({
                  label: title,
                  value: id,
                }))}
                placeholder="Plugin"
                styles={{
                  popup: { root: { width: 236 } },
                  root: { paddingBlock: 8, width: 110 },
                }}
                allowClear
              />
            </Form.Item>
            <Form.Item<EarningFilters> name="status" noStyle>
              <Select
                options={earningStatuses.map((status) => ({
                  label: camelCaseToTitle(status),
                  value: status,
                }))}
                placeholder="Status"
                styles={{ root: { paddingBlock: 8, width: 110 } }}
                allowClear
              />
            </Form.Item>
            <Form.Item<EarningFilters> name="type" noStyle>
              <Select
                options={earningTypes.map((type) => ({
                  label: kebabCaseToTitle(type),
                  value: type,
                }))}
                placeholder="Type"
                styles={{ root: { paddingBlock: 8, width: 110 } }}
                allowClear
              />
            </Form.Item>
          </HStack>
        </Form>
      </HStack>
      <Table<Earning>
        columns={columns}
        dataSource={earnings}
        loading={loading}
        pagination={false}
        rowKey="id"
      />
    </VStack>
  );
};
