import { message, Modal, Table, TableProps, theme as antTheme } from "antd";
import { useResponsive } from "antd-style";
import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import {
  approveProposal,
  getAdminProposals,
  publishProposal,
} from "@/api/portal";
import { DateView } from "@/components/DateView";
import { useIsApprover } from "@/hooks/useIsApprover";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { routeTree } from "@/utils/routes";
import { PluginProposal } from "@/utils/types";

type StateProps = {
  loading: boolean;
  proposals: PluginProposal[];
};

export const AdminProposalsPage = () => {
  const [state, setState] = useState<StateProps>({
    loading: true,
    proposals: [],
  });
  const { loading, proposals } = state;
  const { token } = antTheme.useToken();
  const { md } = useResponsive();
  const isApprover = useIsApprover();
  const navigate = useNavigate();
  const colors = useTheme();

  const columns: TableProps<PluginProposal>["columns"] = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      render: (_, { images, title }) => {
        const logoUrl = images.find(({ type }) => type === "logo")?.url;

        return (
          <HStack $style={{ alignItems: "center", gap: "12px" }}>
            {logoUrl && (
              <Stack
                as="img"
                src={logoUrl}
                $style={{
                  borderRadius: "12px",
                  height: "40px",
                  width: "40px",
                }}
              />
            )}
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
      render: (_, { createdAt }) => <DateView date={createdAt} />,
    },
    {
      align: "center",
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (_, { status }) => {
        const statusConfig = {
          submitted: { color: colors.warning, label: "Submitted" },
          approved: { color: colors.info, label: "Approved" },
          listed: { color: colors.success, label: "Listed" },
          active: { color: colors.success, label: "Live" },
        };
        const config = statusConfig[status] ?? statusConfig.submitted;

        return (
          <HStack $style={{ justifyContent: "center" }}>
            <Stack
              as="span"
              $style={{
                backgroundColor: config.color.toRgba(0.05),
                borderRadius: "4px",
                color: config.color.toHex(),
                fontSize: "12px",
                lineHeight: "24px",
                padding: "0 8px",
                whiteSpace: "nowrap",
              }}
            >
              {config.label}
            </Stack>
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "pluginId",
      key: "actions",
      title: "Actions",
      width: 200,
      render: (_, { pluginId, publicKey, status }) => {
        if (status === "submitted") {
          return (
            <HStack $style={{ gap: "8px", justifyContent: "center" }}>
              <Button
                kind="success"
                onClick={() => handleApprove(pluginId, publicKey)}
              >
                {md ? "Approve" : "A"}
              </Button>
            </HStack>
          );
        }

        if (status === "approved") {
          return (
            <HStack $style={{ justifyContent: "center" }}>
              <Button onClick={() => handlePublish(pluginId)}>
                {md ? "Publish" : "P"}
              </Button>
            </HStack>
          );
        }

        return (
          <Stack as="span" $style={{ color: colors.textTertiary.toHex() }}>
            {status === "listed" || status === "active" ? "Published" : status}
          </Stack>
        );
      },
    },
  ];

  const fetchProposals = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const proposals = await getAdminProposals();

      setState((prev) => ({ ...prev, loading: false, proposals }));
    } catch {
      setState((prev) => ({ ...prev, loading: false, proposals: [] }));
    }
  };

  const fetchProposalsEvent = useEffectEvent(fetchProposals);

  const handleApprove = (proposalId: string, publicKey: string) => {
    Modal.confirm({
      title: "Approve Proposal?",
      content: "This will approve the plugin proposal.",
      okText: "Approve",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await approveProposal(proposalId, publicKey);

          message.success("Proposal approved");

          fetchProposals();
        } catch (error) {
          message.error(
            error instanceof Error
              ? error.message
              : "Failed to approve proposal",
          );
        }
      },
    });
  };

  const handlePublish = (proposalId: string) => {
    Modal.confirm({
      title: "Publish Proposal?",
      content: "This will publish the plugin and make it live.",
      okText: "Publish",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await publishProposal(proposalId);

          message.success("Proposal published");

          fetchProposals();
        } catch (error) {
          message.error(
            error instanceof Error
              ? error.message
              : "Failed to publish proposal",
          );
        }
      },
    });
  };

  useEffect(() => {
    if (isApprover === undefined) return;

    if (!isApprover) {
      message.error("You don't have permission to access this page");

      navigate(routeTree.root.path, { replace: true });

      return;
    }

    fetchProposalsEvent();
  }, [isApprover, navigate]);

  if (!isApprover) return <Spin centered />;

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
          Plugin Proposals Review
        </Stack>
        <Stack
          as="span"
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "13px",
            lineHeight: "18px",
          }}
        >
          Review, approve, and publish plugin proposals
        </Stack>
      </VStack>
      <Table<PluginProposal>
        columns={columns}
        dataSource={proposals}
        loading={loading}
        rowKey="pluginId"
      />
    </VStack>
  );
};
