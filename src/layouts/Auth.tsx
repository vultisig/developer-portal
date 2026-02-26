import { Outlet } from "react-router-dom";
import { useTheme } from "styled-components";

import { HStack, VStack } from "@/toolkits/Stack";

export const AuthLayout = () => {
  const colors = useTheme();

  return (
    <HStack
      $style={{
        backgroundImage: `linear-gradient(314deg, ${colors.bgPrimary.toHex()} 64%, ${colors.bgSecondary.toHex()} 154%)`,
        flexGrow: "1",
        overflow: "hidden",
      }}
    >
      <VStack
        $style={{
          alignItems: "center",
          flexGrow: "1",
          justifyContent: "center",
          minWidth: "480px",
          padding: "32px",
        }}
      >
        <Outlet />
      </VStack>
      <VStack
        $style={{
          backgroundImage: "url('/images/auth.jpg')",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: "768px",
        }}
      />
    </HStack>
  );
};
