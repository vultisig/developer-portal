import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { AnalyticsIcon } from "@/icons/AnalyticsIcon";
import { CurrencyDollarIcon } from "@/icons/CurrencyDollarIcon";
import { VultisigLogoIcon } from "@/icons/VultisigLogoIcon";
import { WalletIcon } from "@/icons/WalletIcon";
import { ZapIcon } from "@/icons/ZapIcon";
import { Button } from "@/toolkits/Button";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { routeTree } from "@/utils/routes";

export const ConnectPage = () => {
  const navigate = useNavigate();
  const colors = useTheme();

  const items = [
    {
      icon: ZapIcon,
      text: "Build apps & AI agents on top of Vultisig vaults",
    },
    {
      icon: CurrencyDollarIcon,
      text: "Access users, payments, and distribution",
    },
    {
      icon: AnalyticsIcon,
      text: "Manage plugins, analytics, and earnings in one place",
    },
  ];

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
          Welcome to the Vultisig Developer Portal
        </Stack>
        <Stack
          as="span"
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "18px",
            lineHeight: "28px",
          }}
        >
          Build, publish, and monetize automation plugins for the Vultisig
          ecosystem.
        </Stack>
      </VStack>
      <VStack
        $style={{
          alignSelf: "flex-start",
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "16px",
          gap: "32px",
          padding: "32px",
        }}
      >
        {items.map(({ icon, text }, index) => (
          <HStack key={index} $style={{ alignItems: "center", gap: "16px" }}>
            <Stack
              as={icon}
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "12px",
                color: colors.accentFour.toHex(),
                fontSize: "40px",
                padding: "10px",
              }}
            />
            <Stack as="span" $style={{ fontSize: "16px", lineHeight: "24px" }}>
              {text}
            </Stack>
          </HStack>
        ))}
      </VStack>
      <Stack
        as={Button}
        icon={<WalletIcon fontSize={20} />}
        onClick={() =>
          navigate(routeTree.projectManagement.link("create"), { state: true })
        }
        $style={{ width: "300px" }}
      >
        Connect Wallet
      </Stack>
    </VStack>
  );
};
