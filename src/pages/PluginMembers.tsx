import {
  Form,
  Modal,
  Select,
  Table,
  TableProps,
  theme as antTheme,
} from "antd";
import { useResponsive } from "antd-style";
import { useEffect, useEffectEvent, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { getMembers } from "@/api/portal";
import { MiddleTruncate } from "@/components/MiddleTruncate";
import { useGoBack } from "@/hooks/useGoBack";
import { PeopleAddIcon } from "@/icons/PeopleAddIcon";
import { TrashCanIcon } from "@/icons/TrashCanIcon";
import { Button } from "@/toolkits/Button";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { modalHash } from "@/utils/constants";
import { camelCaseToTitle, snakeCaseToTitle } from "@/utils/functions";
import { Member } from "@/utils/types";

type StateProps = {
  loading: boolean;
  member?: Member;
  members: Member[];
};

export const PluginMembersPage = () => {
  const [state, setState] = useState<StateProps>({
    loading: true,
    members: [],
  });
  const { loading, member, members } = state;
  const { token } = antTheme.useToken();
  const { hash } = useLocation();
  const { pluginId = "" } = useParams();
  const { md } = useResponsive();
  const [form] = Form.useForm<Member>();
  const goBack = useGoBack();
  const navigate = useNavigate();
  const colors = useTheme();
  const open = hash === modalHash.form;

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
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "Action",
      width: 100,
      render: (_, member) => (
        <HStack $style={{ justifyContent: "center" }}>
          {member.role === "admin" && (
            <HStack
              as="span"
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
          )}
        </HStack>
      ),
    },
  ];

  const handlePluginChange = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const members = await getMembers(pluginId);

    setState((prev) => ({ ...prev, loading: false, members }));
  });

  useEffect(() => {
    handlePluginChange();
  }, [pluginId]);

  useEffect(() => {
    if (!open) return;

    form.resetFields();

    if (!member) return;

    form.setFieldsValue(member);
  }, [form, member, open]);

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
            onClick={() => navigate(modalHash.form, { state: true })}
          >
            {md && "Invite Member"}
          </Button>
        </HStack>
        <Table
          columns={columns}
          dataSource={members}
          loading={loading}
          rowKey="id"
        />
      </VStack>

      <Modal
        footer={
          <Button onClick={() => form.submit()}>
            {member ? "Save Info" : "Send Invite"}
          </Button>
        }
        mask={{ closable: false }}
        onCancel={() => {
          setState((prev) => ({ ...prev, member: undefined }));
          goBack();
        }}
        open={open}
        title={member ? "Edit a team member" : "Invite a team member"}
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item<Member>
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select the role" }]}
          >
            <Select
              options={[
                { value: "admin", label: "Admin" },
                { value: "developer", label: "Developer" },
              ]}
              placeholder="Select"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
