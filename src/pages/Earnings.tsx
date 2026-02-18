import { theme as antTheme } from "antd";
import { useResponsive } from "antd-style";
import { useTheme } from "styled-components";

import { CoinsAddIcon } from "@/icons/CoinsAddIcon";
import { LineChartOneIcon } from "@/icons/LineChartOneIcon";
import { NewspaperIcon } from "@/icons/NewspaperIcon";
import { HStack, Stack, VStack } from "@/toolkits/Stack";

export const EarningsPage = () => {
  const { token } = antTheme.useToken();
  const { md } = useResponsive();
  const colors = useTheme();

  const stats = [
    {
      color: colors.textPrimary,
      icon: CoinsAddIcon,
      label: "Total Revenue",
      value: "$2,3k",
    },
    {
      color: colors.success,
      icon: LineChartOneIcon,
      label: "Revenue Growth",
      value: "+32%",
    },
    {
      color: colors.textPrimary,
      icon: NewspaperIcon,
      label: "Total Transactions",
      value: "1.7K",
    },
  ];

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
          Earnings
        </Stack>
        <Stack
          as="span"
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "13px",
            lineHeight: "18px",
          }}
        >
          Track fee transactions from your plugins
        </Stack>
      </VStack>
      <Stack
        $style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: md ? "repeat(3, 1fr)" : "repeat(1, 1fr)",
        }}
      >
        {stats.map(({ color, icon, label, value }, index) => (
          <HStack
            as="span"
            key={index}
            $style={{
              backgroundColor: colors.bgTertiary.toHex(),
              borderColor: colors.borderLight.toHex(),
              borderRadius: "20px",
              borderStyle: "solid",
              borderWidth: "1px",
              gap: "20px",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <VStack $style={{ gap: "60px" }}>
              <Stack
                as="span"
                $style={{
                  color: colors.textSecondary.toHex(),
                  fontSize: "14px",
                  lineHeight: "18px",
                }}
              >
                {label}
              </Stack>
              <Stack
                as="span"
                $style={{
                  color: color.toHex(),
                  fontSize: "36px",
                  lineHeight: "38px",
                }}
              >
                {value}
              </Stack>
            </VStack>
            <VStack
              $style={{
                alignItems: "center",
                backgroundColor: colors.textPrimary.toRgba(0.03),
                borderRadius: "14px",
                height: "60px",
                justifyContent: "center",
                width: "60px",
              }}
            >
              <Stack as={icon} $style={{ fontSize: "24px" }} />
            </VStack>
          </HStack>
        ))}
      </Stack>
    </VStack>
  );
};
