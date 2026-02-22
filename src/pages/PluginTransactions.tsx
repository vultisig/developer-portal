import { Table, TableProps, theme as antTheme,Tooltip } from "antd";
import { useResponsive } from "antd-style";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { AmoutView } from "@/components/AmoutView";
import { DateView } from "@/components/DateView";
import { TokenView } from "@/components/TokenView";
import { plugins, transactions } from "@/data/mock";
import { ChartSixIcon } from "@/icons/ChartSixIcon";
import { NewspaperIcon } from "@/icons/NewspaperIcon";
import { PencilLineIcon } from "@/icons/PencilLineIcon";
import { PeopleAddedIcon } from "@/icons/PeopleAddedIcon";
import { SquareArrowOutTopLeftIcon } from "@/icons/SquareArrowOutTopLeftIcon";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { camelCaseToTitle, getExplorerUrl, match } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Transaction } from "@/utils/types";

export const PluginTransactionsPage = () => {
  const { token } = antTheme.useToken();
  const { pluginId = "" } = useParams();
  const { md } = useResponsive();
  const colors = useTheme();
  const plugin = plugins.find(({ id }) => id === pluginId);

  const columns: TableProps<Transaction>["columns"] = [
    {
      dataIndex: "tokenId",
      key: "tokenId",
      title: "Token",
      render: (_, { chain, tokenId }) => {
        return <TokenView chain={chain} id={tokenId} />;
      },
    },
    {
      align: "center",
      dataIndex: "amount",
      key: "amount",
      title: "Amount",
      render: (_, { amount, chain, tokenId }) => {
        if (!amount) return "-";

        return <AmoutView amount={amount} chain={chain} tokenId={tokenId} />;
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
      render: (_, { statusOnchain }) => {
        if (!statusOnchain) return "-";

        const color = match(statusOnchain, {
          FAIL: () => colors.error,
          PENDING: () => colors.warning,
          SUCCESS: () => colors.success,
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
              {camelCaseToTitle(statusOnchain.toLowerCase())}
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
      render: (_, { txHash, chain }) => {
        if (!txHash) return null;

        const explorerUrl = getExplorerUrl(chain, "tx", txHash);

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

  const stats = [
    {
      color: colors.info,
      icon: ChartSixIcon,
      label: "Total Revenue",
      unit: "All time",
      value: "$3.5K",
    },
    {
      color: colors.success,
      icon: PeopleAddedIcon,
      label: "Active Users",
      unit: "Last 30 days",
      value: "426",
    },
    {
      color: colors.accentFour,
      icon: NewspaperIcon,
      label: "Transactions",
      unit: "Last 30 days",
      value: "1.8K",
    },
  ];

  if (!plugin) return <Spin centered />;

  return (
    <VStack
      $style={{
        gap: "16px",
        maxWidth: `${token.screenXL}px`,
        padding: "16px",
        width: "100%",
      }}
    >
      <HStack $style={{ gap: "16px", justifyContent: "space-between" }}>
        <HStack
          $style={{ alignItems: "center", gap: "12px", overflow: "hidden" }}
        >
          <Stack
            as="img"
            src={plugin.logoUrl}
            $style={{ borderRadius: "12px", height: "44px", width: "44px" }}
          />
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
            {plugin.title}
          </Stack>
          {match(plugin.status, {
            active: () => (
              <HStack
                as="span"
                $style={{
                  alignItems: "center",
                  backgroundColor: colors.success.toRgba(0.05),
                  borderRadius: "4px",
                  gap: "4px",
                  padding: "0 8px",
                }}
              >
                <Stack
                  as="span"
                  $style={{
                    backgroundColor: colors.success.toHex(),
                    borderRadius: "50%",
                    height: "6px",
                    width: "6px",
                  }}
                />
                <Stack
                  as="span"
                  $style={{
                    color: colors.success.toHex(),
                    fontSize: "12px",
                    lineHeight: "24px",
                  }}
                >
                  Live
                </Stack>
              </HStack>
            ),
            pending: () => (
              <HStack
                as="span"
                $style={{
                  alignItems: "center",
                  backgroundColor: colors.warning.toRgba(0.05),
                  borderRadius: "4px",
                  color: colors.warning.toHex(),
                  fontSize: "12px",
                  gap: "4px",
                  lineHeight: "24px",
                  padding: "0 8px",
                  whiteSpace: "nowrap",
                }}
              >
                In Review
              </HStack>
            ),
          })}
        </HStack>
        <Button
          href={routeTree.pluginUpdate.link(plugin.id)}
          icon={<PencilLineIcon fontSize={16} />}
          state={true}
        >
          {md && "Update Plugin"}
        </Button>
      </HStack>
      <Stack
        $style={{
          backgroundColor: colors.bgTertiary.toHex(),
          borderRadius: "20px",
          display: "grid",
          gap: "16px",
          gridTemplateColumns: md ? "repeat(3, 1fr)" : "repeat(1, 1fr)",
          padding: "20px",
        }}
      >
        {stats.map(({ color, icon, label, unit, value }, index) => (
          <HStack
            as="span"
            key={index}
            $style={{
              alignItems: "center",
              backgroundColor: color.toRgba(0.05),
              borderColor: color.toRgba(0.2),
              borderRadius: "12px",
              borderStyle: "solid",
              borderWidth: "1px",
              gap: "20px",
              padding: "18px 24px",
            }}
          >
            <Stack
              as={icon}
              $style={{ color: color.toHex(), fontSize: "24px" }}
            />
            <VStack $style={{ flexGrow: "1", gap: "16px" }}>
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
              <HStack
                as="span"
                $style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack
                  as="span"
                  $style={{ fontSize: "20px", lineHeight: "24px" }}
                >
                  {value}
                </Stack>
                <Stack
                  as="span"
                  $style={{
                    color: colors.textSecondary.toHex(),
                    fontSize: "12px",
                    lineHeight: "14px",
                  }}
                >
                  {unit}
                </Stack>
              </HStack>
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
      <Table<Transaction>
        columns={columns}
        dataSource={transactions}
        rowKey="id"
      />
    </VStack>
  );
};
