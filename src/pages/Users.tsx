import { Table, TableProps, theme as antTheme } from "antd";
import { useResponsive } from "antd-style";
import { useTheme } from "styled-components";

import { PencilLineIcon } from "@/icons/PencilLineIcon";
import { PeopleAddIcon } from "@/icons/PeopleAddIcon";
import { tableClassNames } from "@/styles";
import { Button } from "@/toolkits/Button";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { tinyId } from "@/utils/functions";

export const UsersPage = () => {
  const { token } = antTheme.useToken();
  const { md } = useResponsive();
  const colors = useTheme();

  const data = [
    {
      id: tinyId(),
      name: "John Doe",
      email: "john.doe@example.com",
    },
    {
      id: tinyId(),
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  ];

  const columns: TableProps["columns"] = [
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
      dataIndex: "id",
      key: "id",
      title: "Action",
      width: 100,
      render: () => (
        <HStack $style={{ justifyContent: "center" }}>
          <Stack
            as={Button}
            icon={<PencilLineIcon fontSize={16} />}
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

  return (
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
        <Button icon={<PeopleAddIcon fontSize={20} />}>
          {md && "Invite Member"}
        </Button>
      </HStack>
      <Table
        classNames={tableClassNames}
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
    </VStack>
  );
};
