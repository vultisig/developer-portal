import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { Button } from "@/toolkits/Button";
import { Stack, VStack } from "@/toolkits/Stack";
import { routeTree } from "@/utils/routes";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const colors = useTheme();

  return (
    <VStack
      $style={{
        alignItems: "center",
        justifyContent: "center",
        flex: "1",
        gap: "24px",
        minHeight: "60vh",
      }}
    >
      <Stack $style={{ fontSize: "72px", fontWeight: "700", color: colors.textTertiary.toHex() }}>
        404
      </Stack>
      <VStack $style={{ gap: "8px", alignItems: "center" }}>
        <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
          Page Not Found
        </Stack>
        <Stack $style={{ color: colors.textTertiary.toHex() }}>
          The page you're looking for doesn't exist or has been moved.
        </Stack>
      </VStack>
      <Button onClick={() => navigate(routeTree.plugins.path)}>
        Go to Plugins
      </Button>
    </VStack>
  );
};
