import { theme as antTheme } from "antd";
import { useTheme } from "styled-components";

import { Stack, VStack } from "@/toolkits/Stack";

export const PluginsPage = () => {
  const { token } = antTheme.useToken();
  const colors = useTheme();

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
    </VStack>
  );
};
