import { Table, TableProps, theme as antTheme, Tooltip } from "antd";
import { useResponsive } from "antd-style";
import { useEffect, useEffectEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "styled-components";

import { getPlugins, getProposals } from "@/api/portal";
import { DateView } from "@/components/DateView";
import { ChartSixIcon } from "@/icons/ChartSixIcon";
import { LiveFullIcon } from "@/icons/LiveFullIcon";
import { LoaderIcon } from "@/icons/LoaderIcon";
import { PencilLineIcon } from "@/icons/PencilLineIcon";
import { PlusLargeIcon } from "@/icons/PlusLargeIcon";
import { Button } from "@/toolkits/Button";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { match } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Plugin, Proposal } from "@/utils/types";

type StateProps = {
  loading: boolean;
  plugins: Plugin[];
  proposals: Proposal[];
};

export const ProposalsPage = () => {
  const [state, setState] = useState<StateProps>({
    loading: true,
    plugins: [],
    proposals: [],
  });
  const { loading, plugins, proposals } = state;
  const { token } = antTheme.useToken();
  const { md } = useResponsive();
  const colors = useTheme();

  const columns: TableProps<Proposal>["columns"] = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      render: (_, { images, title }) => {
        const logoUrl = images.find(({ type }) => type === "logo")?.url;

        return (
          <HStack $style={{ alignItems: "center", gap: "12px" }}>
            <Stack
              as="img"
              src={logoUrl}
              $style={{ borderRadius: "12px", height: "40px", width: "40px" }}
            />
            <Stack as="span">{title}</Stack>
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "category",
      key: "category",
      title: "Category",
      render: (_, { category }) => (
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
            {category}
          </Stack>
        </HStack>
      ),
    },
    {
      align: "center",
      dataIndex: "serverEndpoint",
      key: "serverEndpoint",
      title: "Endpoint",
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
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (_, { status }) => (
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
            submitted: () => (
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
      ),
    },
    {
      align: "center",
      dataIndex: "pluginId",
      key: "pluginId",
      title: "Action",
      width: 124,
      render: (_, { pluginId }) => (
        <HStack $style={{ gap: "8px", justifyContent: "center" }}>
          <Tooltip title="Update">
            <HStack
              as={Link}
              to={routeTree.proposalUpdate.link(pluginId)}
              state={true}
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "50%",
                padding: "12px",
              }}
              $hover={{ color: colors.info.toHex() }}
            >
              <PencilLineIcon fontSize={16} />
            </HStack>
          </Tooltip>
          {/* <Tooltip title="Transactions">
            <HStack
              as={Link}
              to={routeTree.pluginEarnings.link(pluginId)}
              state={true}
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "50%",
                padding: "12px",
              }}
              $hover={{ color: colors.info.toHex() }}
            >
              <NewspaperIcon fontSize={16} />
            </HStack>
          </Tooltip> */}
        </HStack>
      ),
    },
  ];

  const fetchData = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const plugins = await getPlugins();
    const proposals = await getProposals();

    setState((prev) => ({ ...prev, loading: false, plugins, proposals }));
  });

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      color: colors.info,
      icon: ChartSixIcon,
      label: "Total",
      value: plugins.length + proposals.length,
    },
    {
      color: colors.success,
      icon: LiveFullIcon,
      label: "Plugins",
      value: plugins.length,
    },
    {
      color: colors.warning,
      icon: LoaderIcon,
      label: "Proposals",
      value: proposals.length,
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
            Your In Review Plugins
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
          href={routeTree.proposalCreate.path}
          icon={<PlusLargeIcon fontSize={16} />}
          state={true}
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
      <Table<Proposal>
        columns={columns}
        dataSource={proposals}
        loading={loading}
        rowKey="pluginId"
      />
    </VStack>
  );
};
