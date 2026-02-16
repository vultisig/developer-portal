import { theme as antTheme } from "antd";
import { useResponsive } from "antd-style";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useTheme } from "styled-components";

import { DollarIcon } from "@/icons/DollarIcon";
import { InboxEmptyIcon } from "@/icons/InboxEmptyIcon";
import { PeopleCopyIcon } from "@/icons/PeopleCopyIcon";
import { PlusSmallIcon } from "@/icons/PlusSmallIcon";
import { PuzzleIcon } from "@/icons/PuzzleIcon";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { routeTree } from "@/utils/routes";

export const DashboardPage = () => {
  const { token } = antTheme.useToken();
  const { md, xl } = useResponsive();
  const colors = useTheme();

  const apps = [
    {
      categoryId: "app",
      createdAt: "2025-11-09T20:52:36.353238Z",
      description:
        "Automate your long-term investments with the Recurring Swaps app. Securely and automatically convert any Vultisig-supported asset into any other asset on a recurring schedule. Define the asset, amount, and time interval. Your vault executes the schedule without the need for third parties, contracts or bots.",
      id: "vultisig-dca-0000",
      logoUrl:
        "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-dca-0000/logo/819c104d-1f89-4046-a239-d2d1181a52ae.jpg",
      price: "$1.00 USDC / per-tx",
      title: "Recurring Swaps",
    },
    {
      categoryId: "app",
      createdAt: "2025-11-09T20:53:00.210327Z",
      description:
        "Fee collection and management system. Track, calculate, and distribute fees across different protocols and services.",
      id: "vultisig-fees-feee",
      logoUrl:
        "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-fees-feee/logo/c7f19b93-8ac1-406d-97a9-48cf206c802d.jpg",
      price: "Free",
      title: "Billing",
    },
    {
      categoryId: "app",
      createdAt: "2025-11-24T02:47:46.143176Z",
      description:
        "Automate your outgoing transfers with the Recurring Sends App. Securely schedule recurring payments to any address, for any asset supported in Vultisig. Set the destination, amount, and interval. Your devices approve the setup, and your vault handles the execution automatically.",
      id: "vultisig-recurring-sends-0000",
      logoUrl:
        "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-recurring-sends-0000/logo/2b37fe78-58f9-46cd-937a-1818e8d770ca.jpg",
      price: "$2.00 USDC / per-tx",
      title: "Recurring Sends",
    },
  ];

  const items = [
    { icon: <DollarIcon />, title: "Total Revenue", value: "$2.3k" },
    { icon: <PeopleCopyIcon />, title: "Total Users", value: "2.8k" },
    { icon: <PuzzleIcon />, title: "Total Plugins", value: "5" },
  ];

  return (
    <VStack $style={{ alignItems: "center", flexGrow: "1" }}>
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
            Dashboard
          </Stack>
          <Stack
            as="span"
            $style={{
              color: colors.textTertiary.toHex(),
              fontSize: "13px",
              lineHeight: "18px",
            }}
          >
            Monitor your plugin performance and earnings
          </Stack>
        </VStack>
        <Stack
          $style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: xl
              ? "repeat(4, 1fr)"
              : md
                ? "repeat(2, 1fr)"
                : "repeat(1, 1fr)",
          }}
        >
          {items.map(({ icon, title, value }, index) => (
            <VStack
              key={index}
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "20px",
                borderColor: colors.borderLight.toHex(),
                borderStyle: "solid",
                borderWidth: "1px",
                gap: "32px",
                padding: "20px",
              }}
            >
              <VStack
                $style={{
                  alignItems: "center",
                  alignSelf: "flex-start",
                  backgroundColor: colors.accentThree.toHex(),
                  boxShadow: `0px 2px 10px 0px ${colors.accentFour.toHex()} inset`,
                  borderRadius: "10px",
                  color: colors.neutral50.toHex(),
                  fontSize: "18px",
                  height: "32px",
                  justifyContent: "center",
                  width: "32px",
                }}
              >
                {icon}
              </VStack>
              <VStack $style={{ gap: "16px" }}>
                <Stack
                  as="span"
                  $style={{
                    color: colors.textSecondary.toHex(),
                    fontSize: "14px",
                    lineHeight: "18px",
                  }}
                >
                  {title}
                </Stack>
                <Stack
                  as="span"
                  $style={{ fontSize: "36px", lineHeight: "36px" }}
                >
                  {value}
                </Stack>
              </VStack>
            </VStack>
          ))}
          <VStack
            $style={{
              alignItems: "center",
              backgroundImage: `linear-gradient(310deg, ${colors.accentFour.toHex()} 18%, ${colors.accentTwo.toHex()} 82%)`,
              borderRadius: "20px",
              borderColor: colors.accentThree.toHex(),
              borderStyle: "solid",
              borderWidth: "1px",
              color: colors.neutral50.toHex(),
              cursor: "pointer",
              gap: "16px",
              opacity: "1",
              padding: "24px 20px",
              transition: "opacity 0.2s ease-in-out",
            }}
            $hover={{ opacity: "0.9" }}
          >
            <VStack
              $style={{
                alignItems: "center",
                backgroundColor: colors.neutral50.toRgba(0.06),
                borderRadius: "50%",
                fontSize: "38px",
                height: "66px",
                justifyContent: "center",
                width: "66px",
              }}
            >
              <PlusSmallIcon />
            </VStack>
            <VStack $style={{ alignItems: "center", gap: "8px" }}>
              <Stack
                as="span"
                $style={{ fontSize: "17px", lineHeight: "20px" }}
              >
                New Plugin
              </Stack>
              <Stack
                as="span"
                $style={{ fontSize: "12px", lineHeight: "16px" }}
              >
                Create and publish a new plugin
              </Stack>
            </VStack>
          </VStack>
        </Stack>
        <Stack
          $style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: xl ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
          }}
        >
          <VStack
            $style={{
              backgroundColor: colors.bgTertiary.toHex(),
              borderRadius: "20px",
              gap: "20px",
              overflow: "hidden",
              padding: "20px",
            }}
          >
            <HStack
              $style={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <VStack $style={{ gap: "2px" }}>
                <Stack
                  as="span"
                  $style={{ fontSize: "22px", lineHeight: "24px" }}
                >
                  Top Plugins
                </Stack>
                <Stack
                  as="span"
                  $style={{
                    color: colors.textTertiary.toHex(),
                    fontSize: "13px",
                    lineHeight: "18px",
                  }}
                >
                  Last 6 weeks performance
                </Stack>
              </VStack>
              <Stack
                as={Link}
                to={routeTree.root.path}
                $style={{
                  color: colors.info.toHex(),
                  transition: "color 0.2s ease-in-out",
                }}
                $hover={{ color: colors.info.lighten(10).toHex() }}
              >
                See all plugins
              </Stack>
            </HStack>
            <VStack $style={{ gap: "12px" }}>
              {apps.map(
                ({
                  categoryId,
                  createdAt,
                  description,
                  id,
                  logoUrl,
                  price,
                  title,
                }) => (
                  <VStack
                    key={id}
                    $style={{
                      backgroundColor: colors.bgSecondary.toHex(),
                      borderColor: colors.borderLight.toHex(),
                      borderStyle: "solid",
                      borderWidth: "1px",
                      gap: "16px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      padding: "20px",
                    }}
                  >
                    <HStack
                      $style={{
                        alignItems: "flex-start",
                        gap: "16px",
                        justifyContent: "space-between",
                        overflow: "hidden",
                      }}
                    >
                      <HStack $style={{ gap: "16px", overflow: "hidden" }}>
                        <Stack
                          as="img"
                          src={logoUrl}
                          $style={{
                            borderRadius: "16px",
                            height: "50px",
                            width: "50px",
                          }}
                        />
                        <VStack $style={{ gap: "8px", overflow: "hidden" }}>
                          <HStack $style={{ gap: "8px" }}>
                            <Stack
                              as="span"
                              $style={{
                                fontSize: "18px",
                                lineHeight: "24px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {title}
                            </Stack>
                            <Stack
                              as="span"
                              $style={{
                                backgroundColor: colors.info.toRgba(0.1),
                                borderRadius: "4px",
                                color: colors.info.toHex(),
                                flex: "none",
                                fontSize: "12px",
                                lineHeight: "24px",
                                padding: "0 16px",
                              }}
                            >
                              {categoryId}
                            </Stack>
                          </HStack>
                          <Stack
                            as="span"
                            $style={{
                              color: colors.textTertiary.toHex(),
                              fontSize: "13px",
                              lineHeight: "18px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {description}
                          </Stack>
                        </VStack>
                      </HStack>
                      <HStack
                        $style={{
                          alignItems: "center",
                          backgroundColor: colors.success.toRgba(0.05),
                          borderRadius: "4px",
                          gap: "4px",
                          padding: "0 8px",
                        }}
                      >
                        <Stack
                          as="span"
                          $style={{
                            backgroundColor: colors.success.toHex(),
                            borderRadius: "50%",
                            height: "6px",
                            width: "6px",
                          }}
                        />
                        <Stack
                          as="span"
                          $style={{
                            color: colors.success.toHex(),
                            fontSize: "12px",
                            lineHeight: "24px",
                          }}
                        >
                          Live
                        </Stack>
                      </HStack>
                    </HStack>
                    <HStack
                      $style={{
                        alignItems: "center",
                        gap: "16px",
                        justifyContent: "space-between",
                      }}
                    >
                      <HStack $style={{ gap: "4px" }}>
                        <Stack
                          as="span"
                          $style={{
                            color: colors.textTertiary.toHex(),
                            fontSize: "13px",
                            lineHeight: "18px",
                          }}
                        >
                          Pricing:
                        </Stack>
                        <Stack
                          as="span"
                          $style={{ fontSize: "13px", lineHeight: "18px" }}
                        >
                          {price}
                        </Stack>
                      </HStack>
                      <Stack
                        as="span"
                        $style={{
                          color: colors.textTertiary.toHex(),
                          fontSize: "12px",
                          lineHeight: "16px",
                        }}
                      >
                        {dayjs(createdAt).format("MMM D, YYYY")}
                      </Stack>
                    </HStack>
                  </VStack>
                ),
              )}
            </VStack>
          </VStack>
          <VStack
            $style={{
              backgroundColor: colors.bgTertiary.toHex(),
              borderRadius: "20px",
              gap: "16px",
              padding: "20px",
            }}
          >
            <HStack
              $style={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <VStack $style={{ gap: "2px" }}>
                <Stack
                  as="span"
                  $style={{ fontSize: "22px", lineHeight: "24px" }}
                >
                  Revenue Analytics
                </Stack>
                <Stack
                  as="span"
                  $style={{
                    color: colors.textTertiary.toHex(),
                    fontSize: "13px",
                    lineHeight: "18px",
                  }}
                >
                  Last 6 weeks performance
                </Stack>
              </VStack>
              <Stack
                as={Link}
                to={routeTree.root.path}
                $style={{
                  color: colors.info.toHex(),
                  transition: "color 0.2s ease-in-out",
                }}
                $hover={{ color: colors.info.lighten(10).toHex() }}
              >
                See all earnings
              </Stack>
            </HStack>
          </VStack>
        </Stack>
        <VStack $style={{ alignItems: "center", gap: "36px", padding: "60px" }}>
          <VStack
            $style={{
              alignItems: "center",
              backgroundColor: colors.bgTertiary.toHex(),
              borderRadius: "20px",
              fontSize: "38px",
              height: "66px",
              justifyContent: "center",
              width: "66px",
            }}
          >
            <InboxEmptyIcon />
          </VStack>
          <VStack $style={{ alignItems: "center", gap: "12px" }}>
            <Stack as="span" $style={{ fontSize: "22px", lineHeight: "24px" }}>
              You don’t have any plugins yet
            </Stack>
            <Stack
              as="span"
              $style={{
                color: colors.textTertiary.toHex(),
                fontSize: "13px",
                lineHeight: "18px",
              }}
            >
              Once you publish a plugin, you’ll see usage, revenue, and
              performance insights here.
            </Stack>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};
