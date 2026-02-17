import {
  Form,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  theme as antTheme,
} from "antd";
import { useResponsive } from "antd-style";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { useGoBack } from "@/hooks/useGoBack";
import { PencilLineIcon } from "@/icons/PencilLineIcon";
import { PeopleAddIcon } from "@/icons/PeopleAddIcon";
import { Button } from "@/toolkits/Button";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { modalHash } from "@/utils/constants";
import { tinyId } from "@/utils/functions";
import { User } from "@/utils/types";

export const UsersPage = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { token } = antTheme.useToken();
  const { hash } = useLocation();
  const { md } = useResponsive();
  const [form] = Form.useForm<User>();
  const goBack = useGoBack();
  const navigate = useNavigate();
  const colors = useTheme();
  const open = hash === modalHash.form;

  const columns: TableProps<User>["columns"] = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      render: (value) => value || "-",
    },
    {
      align: "center",
      dataIndex: "email",
      key: "email",
      title: "Email",
    },
    {
      align: "center",
      dataIndex: "role",
      key: "role",
      title: "Role",
    },
    {
      align: "center",
      dataIndex: "status",
      key: "status",
      title: "Status",
    },
    {
      align: "center",
      dataIndex: "id",
      key: "id",
      title: "Action",
      width: 100,
      render: (_, user) => (
        <HStack $style={{ justifyContent: "center" }}>
          <Stack
            as={Button}
            disabled={user.role === "owner"}
            icon={<PencilLineIcon fontSize={16} />}
            onClick={() => {
              setUser(user);
              navigate(modalHash.form, { state: true });
            }}
            $style={{
              backgroundColor: `${colors.bgTertiary.toHex()} !important`,
              padding: "12px",
            }}
            ghost
          />
        </HStack>
      ),
    },
  ];

  const data: User[] = [
    {
      id: tinyId(),
      name: "John Doe",
      email: "john.doe@example.com",
      role: "owner",
      status: "active",
    },
    {
      id: tinyId(),
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "admin",
      status: "invited",
    },
  ];

  useEffect(() => {
    if (!open) return;

    form.resetFields();

    if (!user) return;

    form.setFieldsValue(user);
  }, [form, open, user]);

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
        <Table columns={columns} dataSource={data} rowKey="id" />
      </VStack>

      <Modal
        footer={
          <Button onClick={() => form.submit()}>
            {user ? "Save Info" : "Send Invite"}
          </Button>
        }
        mask={{ closable: false }}
        onCancel={() => {
          setUser(undefined);
          goBack();
        }}
        open={open}
        title={user ? "Edit a team member" : "Invite a team member"}
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item<User>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<User>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item<User>
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
