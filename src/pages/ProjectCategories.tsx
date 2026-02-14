import { Checkbox, Form, FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";

import { BrainIcon } from "@/icons/BrainIcon";
import { BuildingsIcon } from "@/icons/BuildingsIcon";
import { ChartIcon } from "@/icons/ChartIcon";
import { CuteRobotIcon } from "@/icons/CuteRobotIcon";
import { FortuneTellerBallIcon } from "@/icons/FortuneTellerBallIcon";
import { ToolboxIcon } from "@/icons/ToolboxIcon";
import { VultisigLogoIcon } from "@/icons/VultisigLogoIcon";
import { Button } from "@/toolkits/Button";
import { Stack, VStack } from "@/toolkits/Stack";
import { routeTree } from "@/utils/routes";

type FieldType = {
  categories: string;
};

export const ProjectCategoriesPage = () => {
  const [form] = Form.useForm<FieldType>();
  const navigate = useNavigate();
  const colors = useTheme();

  const items = [
    { icon: BrainIcon, color: colors.accentFour, text: "Automation apps" },
    { icon: CuteRobotIcon, color: colors.accentFour, text: "AI agents" },
    { icon: ToolboxIcon, color: colors.warning, text: "Portfolio tools" },
    { icon: ChartIcon, color: colors.success, text: "Trading / execution" },
    {
      icon: BuildingsIcon,
      color: colors.info,
      text: "Infrastructure / utilities",
    },
    {
      icon: FortuneTellerBallIcon,
      color: colors.textPrimary,
      text: "Exploring / not sure yet",
    },
  ];

  const handleFinish: FormProps<FieldType>["onFinish"] = () => {
    navigate(routeTree.root.path, { state: true });
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
          What do you want to build?
        </Stack>
        <Stack
          as="span"
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "18px",
            lineHeight: "28px",
          }}
        >
          Briefly describe what you want to build.
        </Stack>
      </VStack>
      <VStack $style={{ gap: "20px" }}>
        <Form
          autoComplete="off"
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item<FieldType>
            name="categories"
            rules={[
              {
                required: true,
                message: "Please select your project categories!",
              },
            ]}
          >
            <Stack
              as={Checkbox.Group}
              $style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              {items.map(({ icon, color, text }, index) => (
                <CustomCheckbox value={index} key={index}>
                  <Stack
                    as={icon}
                    $style={{
                      backgroundColor: color.toRgba(0.2),
                      borderRadius: "12px",
                      color: color.toHex(),
                      fontSize: "40px",
                      padding: "10px",
                    }}
                  />
                  <Stack
                    as="span"
                    $style={{ fontSize: "16px", lineHeight: "24px" }}
                  >
                    {text}
                  </Stack>
                </CustomCheckbox>
              ))}
            </Stack>
          </Form.Item>
        </Form>
        <Stack as={Button} onClick={form.submit} $style={{ width: "300px" }}>
          Start Building
        </Stack>
      </VStack>
    </VStack>
  );
};

const CustomCheckbox = styled(Checkbox)`
  background-color: ${({ theme }) => theme.bgSecondary.toHex()};
  border-color: ${({ theme }) => theme.borderLight.toHex()};
  border-style: solid;
  border-width: 1px;
  border-radius: 20px;
  transition: all 0.2s ease;

  .ant-checkbox {
    display: none;
  }

  .ant-checkbox-label {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;
    padding: 24px 0;
  }

  &:hover {
    border-color: ${({ theme }) => theme.borderNormal.toHex()};
  }

  &.ant-checkbox-wrapper-checked {
    background-color: ${({ theme }) => theme.bgTertiary.toHex()};
  }
`;
