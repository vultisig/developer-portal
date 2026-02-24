import { Table, TableProps, theme as antTheme, Tooltip } from "antd";
import { useResponsive } from "antd-style";
import { Decimal } from "decimal.js";
import { useEffect, useEffectEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "styled-components";

import { getEarnings } from "@/api/portal";
import { DateView } from "@/components/DateView";
import { MiddleTruncate } from "@/components/MiddleTruncate";
import { useCore } from "@/hooks/useCore";
import { CoinsAddIcon } from "@/icons/CoinsAddIcon";
import { LineChartOneIcon } from "@/icons/LineChartOneIcon";
import { NewspaperIcon } from "@/icons/NewspaperIcon";
import { SquareArrowOutTopLeftIcon } from "@/icons/SquareArrowOutTopLeftIcon";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import {
  camelCaseToTitle,
  getExplorerUrl,
  kebabCaseToTitle,
  match,
  toValueFormat,
} from "@/utils/functions";
import { ListParams, Transaction } from "@/utils/types";

type StateProps = {
  loading: boolean;
  earnings: Transaction[];
};

export const EarningsPage = () => {
  const [state, setState] = useState<StateProps>({
    loading: true,
    earnings: [],
  });
  const { earnings } = state;
  const { token } = antTheme.useToken();
  const { baseValue, currency } = useCore();
  const { md } = useResponsive();
  const colors = useTheme();

  const columns: TableProps<Transaction>["columns"] = [
    {
      dataIndex: "pluginName",
      key: "pluginName",
      title: "Plugin",
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
              {kebabCaseToTitle(type).toUpperCase()}
            </Stack>
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
          <Stack
            as="span"
            $style={{ color: colors.success.toHex() }}
          >{`${toValueFormat(
            new Decimal(amount)
              .mul(new Decimal(baseValue))
              .div(new Decimal(10).pow(feeAsset.decimals))
              .toString(),
            currency,
            feeAsset.decimals,
          )} ${feeAsset.symbol}`}</Stack>
        );
      },
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
        if (!txHash) return null;

        const explorerUrl = getExplorerUrl(feeAsset.network, "tx", txHash);

        return (
          <HStack $style={{ gap: "8px", justifyContent: "center" }}>
            <Tooltip title="Details">
              <HStack
                as={Link}
                to={explorerUrl}
                target="_blank"
                $style={{
                  backgroundColor: `${colors.bgTertiary.toHex()}`,
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

  const fetchEarnings = useEffectEvent(async (params: ListParams) => {
    setState((prev) => ({ ...prev, loading: true }));

    const earnings = await getEarnings(params);

    setState((prev) => ({ ...prev, loading: false, earnings }));
  });

  useEffect(() => {
    fetchEarnings({});
  }, []);

  const stats = [
    {
      color: colors.textPrimary,
      icon: CoinsAddIcon,
      label: "Total Revenue",
      value: "$2,3k",
    },
    {
      color: colors.success,
      icon: LineChartOneIcon,
      label: "Revenue Growth",
      value: "+32%",
    },
    {
      color: colors.textPrimary,
      icon: NewspaperIcon,
      label: "Total Transactions",
      value: "1.7K",
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
              borderRadius: "20px",
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
                borderRadius: "14px",
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
      </HStack>
      <Table<Transaction> columns={columns} dataSource={earnings} rowKey="id" />
    </VStack>
  );
};
