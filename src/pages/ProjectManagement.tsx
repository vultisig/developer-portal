import { Form, FormProps, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { VultisigLogoIcon } from "@/icons/VultisigLogoIcon";
import { Button } from "@/toolkits/Button";
import { Stack, VStack } from "@/toolkits/Stack";
import { tinyId } from "@/utils/functions";
import { routeTree } from "@/utils/routes";

type FieldType = {
  name: string;
  role: string;
  email: string;
};

export const ProjectManagementPage = () => {
  const [form] = Form.useForm<FieldType>();
  const navigate = useNavigate();
  const colors = useTheme();

  const handleFinish: FormProps<FieldType>["onFinish"] = () => {
    navigate(routeTree.projectCategories.link(tinyId()), { state: true }); // TODO: replace tinyId with actual project ID
  };

  return (
    <VStack $style={{ gap: "40px", maxWidth: "768px", width: "100%" }}>
      <VStack
        $style={{
          alignItems: "center",
          backgroundImage: `linear-gradient(to bottom, ${colors.accentFour.toHex()}, ${colors.accentOne.toHex()})`,
          boxShadow: `0px 0.8px 0.8px 0px ${colors.neutral50.toRgba(0.35)} inset`,
          borderRadius: "12px",
          fontSize: "40px",
          justifyContent: "center",
          height: "60px",
          width: "60px",
        }}
      >
        <VultisigLogoIcon />
      </VStack>
      <VStack $style={{ gap: "20px" }}>
        <Stack as="span" $style={{ fontSize: "60px", lineHeight: "72px" }}>
          Tell us about your project
        </Stack>
        <Stack
          as="span"
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "18px",
            lineHeight: "28px",
          }}
        >
          This helps us tailor the developer experience and support you better.
        </Stack>
      </VStack>
      <VStack $style={{ gap: "20px" }}>
        <Stack $style={{ maxWidth: "534px" }}>
          <Form
            autoComplete="off"
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
          >
            <Form.Item<FieldType>
              label="Project / Company Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your project or company name!",
                },
              ]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item<FieldType>
              label="Your Role"
              name="role"
              rules={[{ required: true, message: "Please select your role!" }]}
            >
              <Select
                options={[{ label: "Admin", value: "admin" }]}
                placeholder="Select"
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="Contact Email"
              name="email"
              rules={[
                { required: true, message: "Please input your contact email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="your@email.com" />
            </Form.Item>
          </Form>
        </Stack>
        <Stack as={Button} onClick={form.submit} $style={{ width: "300px" }}>
          Continue
        </Stack>
      </VStack>
    </VStack>
  );
};
