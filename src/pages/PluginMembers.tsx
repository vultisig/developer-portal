import {
  Form,
  FormProps,
  Modal,
  Select,
  Table,
  TableProps,
  message,
  theme as antTheme,
} from "antd";
import { useResponsive } from "antd-style";
import { useEffect, useEffectEvent, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { createTeamInvite, delMember, getMembers } from "@/api/portal";
import { DateView } from "@/components/DateView";
import { MiddleTruncate } from "@/components/MiddleTruncate";
import { StatusModal } from "@/components/StatusModal";
import { useAntd } from "@/hooks/useAntd";
import { useGoBack } from "@/hooks/useGoBack";
import { usePluginRole } from "@/hooks/usePluginRole";
import { PeopleAddIcon } from "@/icons/PeopleAddIcon";
import { TrashCanIcon } from "@/icons/TrashCanIcon";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { memberRoles, modalHash } from "@/utils/constants";
import { camelCaseToTitle, match, snakeCaseToTitle } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Member, MemberInvitation } from "@/utils/types";

type StateProps = {
  invite?: MemberInvitation;
  loading: boolean;
  members: Member[];
};

export const PluginMembersPage = () => {
  const [state, setState] = useState<StateProps>({
    loading: true,
    members: [],
  });
  const { invite, loading, members } = state;
  const { token } = antTheme.useToken();
  const { messageAPI } = useAntd();
  const { hash } = useLocation();
  const { pluginId = "" } = useParams();
  const { md } = useResponsive();
  const [form] = Form.useForm<Member>();
  const { isAdmin, loading: roleLoading, role } = usePluginRole(pluginId);
  const goBack = useGoBack();
  const navigate = useNavigate();
  const colors = useTheme();
  const open = hash === modalHash.invite;

  const handleRemoveMember = (member: Member) => {
    if (member.role === "admin" || member.role === "staff") {
      message.error("Cannot remove admin or staff members");
      return;
    }

    Modal.confirm({
      title: "Remove Team Member?",
      content: "This action cannot be undone.",
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await delMember(pluginId, member.publicKey);
          message.success("Member removed successfully");
          fetchMembers();
        } catch (error) {
          if (error instanceof Error) {
            message.error(error.message);
          } else {
            message.error("Failed to remove member");
          }
        }
      },
    });
  };

  const columns: TableProps<Member>["columns"] = [
    {
      dataIndex: "addedVia",
      key: "addedVia",
      title: "Added Via",
      render: (_, { addedVia }) => snakeCaseToTitle(addedVia),
    },
    {
      align: "center",
      dataIndex: "role",
      key: "role",
      title: "Role",
      render: (_, { role }) => camelCaseToTitle(role),
    },
    {
      align: "center",
      dataIndex: "publicKey",
      key: "publicKey",
      title: "Address",
      render: (_, { publicKey }) => (
        <HStack $style={{ justifyContent: "center" }}>
          <MiddleTruncate $style={{ width: "140px" }}>
            {publicKey}
          </MiddleTruncate>
        </HStack>
      ),
    },
    ...(isAdmin
      ? [
          {
            align: "center" as const,
            dataIndex: "id",
            key: "id",
            title: "Action",
            width: 100,
            render: (_: unknown, member: Member) =>
              member.role !== "admin" && member.role !== "staff" ? (
                <HStack $style={{ justifyContent: "center" }}>
                  <HStack
                    as="span"
                    onClick={() => handleRemoveMember(member)}
                    $style={{
                      backgroundColor: colors.bgTertiary.toHex(),
                      borderRadius: "50%",
                      cursor: "pointer",
                      padding: "12px",
                    }}
                    $hover={{ color: colors.error.toHex() }}
                  >
                    <TrashCanIcon fontSize={16} />
                  </HStack>
                </HStack>
              ) : null,
          },
        ]
      : []),
  ];

  const fetchMembers = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const members = await getMembers(pluginId);

    setState((prev) => ({ ...prev, loading: false, members }));
  });

  const handleClipboard = () => {
    if (!invite) return;

    navigator.clipboard.writeText(invite.link).then(() => {
      messageAPI.success("Invite link copied to clipboard");

      setState((prev) => ({ ...prev, invite: undefined }));
    });
  };

  const handleFinish: FormProps<Member>["onFinish"] = async ({ role }) => {
    const invite = await createTeamInvite(pluginId, role);

    form.resetFields();

    setState((prev) => ({ ...prev, invite }));

    goBack();
  };

  useEffect(() => {
    fetchMembers();
  }, [pluginId]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      message.error("Only admins can manage team members");
      navigate(routeTree.plugins.path, { replace: true });
    }
  }, [roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!open) return;

    form.resetFields();
  }, [form, open]);

  if (roleLoading) return <Spin centered />;

  if (!isAdmin) return null;

  return (
    <>
      <VStack
        $style={{
          gap: "32px",
          maxWidth: `${token.screenXL}px`,
          padding: "16px",
          width: "100%",
        }}
      >
        <HStack $style={{ justifyContent: "space-between" }}>
          <VStack $style={{ gap: "2px" }}>
            <Stack as="span" $style={{ fontSize: "22px", lineHeight: "24px" }}>
              Team Members
            </Stack>
            <Stack
              as="span"
              $style={{
                color: colors.textTertiary.toHex(),
                fontSize: "13px",
                lineHeight: "18px",
              }}
            >
              Manage who has access to this developer account and what they can
              do.
            </Stack>
          </VStack>
          <Button
            icon={<PeopleAddIcon fontSize={20} />}
            onClick={() => navigate(modalHash.invite, { state: true })}
          >
            {md && "Invite Member"}
          </Button>
        </HStack>
        <Table
          columns={columns}
          dataSource={members}
          loading={loading}
          rowKey="publicKey"
        />
      </VStack>

      <Modal
        footer={
          <Button onClick={() => form.submit()}>Create Invite Link</Button>
        }
        mask={{ closable: false }}
        onCancel={() => goBack()}
        open={open}
        styles={{
          body: { display: "flex", flexDirection: "column", gap: "16px" },
        }}
        title="Invite a team member"
      >
        <Stack $style={{ color: colors.textSecondary.toHex() }}>
          Create an invite link to add a new team member. The link will expire
          in 8 hours and can only be used once.
        </Stack>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
        >
          <Form.Item<Member>
            name="role"
            rules={[{ required: true, message: "Please select the role" }]}
          >
            <Select
              options={memberRoles.map((role) => ({
                label: camelCaseToTitle(role),
                value: role,
              }))}
              placeholder="Select Role"
            />
          </Form.Item>
          <Form.Item<Member>
            shouldUpdate={(prev, current) => prev.role !== current.role}
            noStyle
          >
            {({ getFieldsValue }) => {
              const { role } = getFieldsValue();

              if (!role) return null;

              return (
                <Stack
                  as="span"
                  $style={{ color: colors.textTertiary.toHex() }}
                >
                  {match(role, {
                    editor: () =>
                      "Editors can create and manage plugins but cannot manage team members.",
                    viewer: () =>
                      "Viewers can only view plugin information without access to earnings or management features.",
                  })}
                </Stack>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>

      <StatusModal
        onClose={() => setState((prev) => ({ ...prev, invite: undefined }))}
        open={Boolean(invite)}
        success
      >
        <VStack $style={{ gap: "24px" }}>
          <Button onClick={handleClipboard}>Copy Link</Button>
          <VStack $style={{ textAlign: "center" }}>
            <Stack as="span" $style={{ color: colors.textSecondary.toHex() }}>
              Invite Link Expires At
            </Stack>
            <DateView date={invite?.expiresAt ?? ""} />
          </VStack>
        </VStack>
      </StatusModal>
    </>
  );
};
