import { Table, TableProps, theme as antTheme } from "antd";
import { useResponsive } from "antd-style";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { ChartSixIcon } from "@/icons/ChartSixIcon";
import { LiveFullIcon } from "@/icons/LiveFullIcon";
import { LoaderIcon } from "@/icons/LoaderIcon";
import { PencilLineIcon } from "@/icons/PencilLineIcon";
import { PlusLargeIcon } from "@/icons/PlusLargeIcon";
import { Button } from "@/toolkits/Button";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { match } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Plugin } from "@/utils/types";

export const PluginsPage = () => {
  const { token } = antTheme.useToken();
  const { md } = useResponsive();
  const navigate = useNavigate();
  const colors = useTheme();

  const columns: TableProps<Plugin>["columns"] = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      render: (_, { logoUrl, title }) => (
        <HStack $style={{ alignItems: "center", gap: "12px" }}>
          <Stack
            as="img"
            src={logoUrl}
            $style={{ borderRadius: "12px", height: "40px", width: "40px" }}
          />
          <Stack as="span">{title}</Stack>
        </HStack>
      ),
    },
    {
      align: "center",
      dataIndex: "categoryId",
      key: "categoryId",
      title: "Category",
      render: (_, { categoryId }) => (
        <HStack $style={{ justifyContent: "center" }}>
          <Stack
            as="span"
            $style={{
              backgroundColor: colors.info.toRgba(0.1),
              borderRadius: "4px",
              color: colors.info.toHex(),
              flex: "none",
              fontSize: "12px",
              lineHeight: "24px",
              padding: "0 16px",
            }}
          >
            {categoryId}
          </Stack>
        </HStack>
      ),
    },
    {
      align: "center",
      dataIndex: "price",
      key: "price",
      title: "Price",
    },
    {
      align: "center",
      dataIndex: "serverEndpoint",
      key: "serverEndpoint",
      title: "Endpoint",
    },
    {
      align: "center",
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (_, { status }) => {
        return (
          <HStack $style={{ justifyContent: "center" }}>
            {match(status, {
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
                  }}
                >
                  In Review
                </HStack>
              ),
            })}
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Published",
      render: (_, { createdAt }) => dayjs(createdAt).format("MMM D, YYYY"),
    },
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "Action",
      width: 100,
      render: (_, { id }) => (
        <HStack $style={{ justifyContent: "center" }}>
          <HStack
            as={Link}
            to={routeTree.pluginUpdate.link(id)}
            onClick={() => {}}
            state={true}
            $style={{
              backgroundColor: `${colors.bgTertiary.toHex()}`,
              borderRadius: "50%",
              padding: "12px",
            }}
            $hover={{ color: colors.info.toHex() }}
          >
            <PencilLineIcon fontSize={16} />
          </HStack>
        </HStack>
      ),
    },
  ];

  const plugins: Plugin[] = [
    {
      bannerUrl: "",
      categoryId: "app",
      createdAt: "2025-11-09T20:52:36.353238Z",
      description:
        "Automate your long-term investments with the Recurring Swaps app. Securely and automatically convert any Vultisig-supported asset into any other asset on a recurring schedule. Define the asset, amount, and time interval. Your vault executes the schedule without the need for third parties, contracts or bots.",
      email: "",
      id: "vultisig-dca-0000",
      images: [],
      logoUrl:
        "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-dca-0000/logo/819c104d-1f89-4046-a239-d2d1181a52ae.jpg",
      price: "$1.00 USDC / per-tx",
      serverEndpoint: "https://plugin-dca-swap.prod.plugins.vultisig.com",
      status: "active",
      supportedChains: [],
      title: "Recurring Swaps",
    },
    {
      bannerUrl: "",
      categoryId: "app",
      createdAt: "2025-11-09T20:53:00.210327Z",
      description:
        "Fee collection and management system. Track, calculate, and distribute fees across different protocols and services.",
      email: "",
      id: "vultisig-fees-feee",
      images: [],
      logoUrl:
        "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-fees-feee/logo/c7f19b93-8ac1-406d-97a9-48cf206c802d.jpg",
      price: "Free",
      serverEndpoint: "https://plugin-dca-swap.prod.plugins.vultisig.com",
      status: "active",
      supportedChains: [],
      title: "Billing",
    },
    {
      bannerUrl: "",
      categoryId: "app",
      createdAt: "2025-11-24T02:47:46.143176Z",
      description:
        "Automate your outgoing transfers with the Recurring Sends App. Securely schedule recurring payments to any address, for any asset supported in Vultisig. Set the destination, amount, and interval. Your devices approve the setup, and your vault handles the execution automatically.",
      email: "",
      id: "vultisig-recurring-sends-0000",
      images: [],
      logoUrl:
        "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-recurring-sends-0000/logo/2b37fe78-58f9-46cd-937a-1818e8d770ca.jpg",
      price: "$2.00 USDC / per-tx",
      serverEndpoint: "https://plugin-dca-swap.prod.plugins.vultisig.com",
      status: "pending",
      supportedChains: [],
      title: "Recurring Sends",
    },
  ];

  const stats = [
    {
      color: colors.info,
      icon: ChartSixIcon,
      label: "Total Plugins",
      value: plugins.length,
    },
    {
      color: colors.success,
      icon: LiveFullIcon,
      label: "Live Plugins",
      value: plugins.filter((app) => app.status === "active").length,
    },
    {
      color: colors.warning,
      icon: LoaderIcon,
      label: "In Review",
      value: plugins.filter((app) => app.status === "pending").length,
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
      <HStack $style={{ justifyContent: "space-between" }}>
        <VStack $style={{ gap: "2px" }}>
          <Stack as="span" $style={{ fontSize: "22px", lineHeight: "24px" }}>
            Your Plugins
          </Stack>
          <Stack
            as="span"
            $style={{
              color: colors.textTertiary.toHex(),
              fontSize: "13px",
              lineHeight: "18px",
            }}
          >
            Manage and configure your registered plugins
          </Stack>
        </VStack>
        <Button
          icon={<PlusLargeIcon fontSize={20} />}
          onClick={() => navigate(routeTree.pluginCreate.path, { state: true })}
        >
          {md && "New Plugin"}
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
        {stats.map(({ color, icon, label, value }, index) => (
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
            <Stack
              as="span"
              $style={{ flexGrow: 1, fontSize: "14px", lineHeight: "18px" }}
            >
              {label}
            </Stack>
            <Stack as="span" $style={{ fontSize: "20px", lineHeight: "24px" }}>
              {value}
            </Stack>
          </HStack>
        ))}
      </Stack>
      <Table columns={columns} dataSource={plugins} rowKey="id" />
    </VStack>
  );
};
