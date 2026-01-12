import { Dropdown, Menu, MenuProps } from "antd";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { createGlobalStyle, useTheme } from "styled-components";

import { useCore } from "@/hooks/useCore";
import { useExtension } from "@/hooks/useExtension";
import { ArrowBoxLeftIcon } from "@/icons/ArrowBoxLeftIcon";
import { ArrowBoxRightIcon } from "@/icons/ArrowBoxRightIcon";
import { BoxIcon } from "@/icons/BoxIcon";
import { DollarIcon } from "@/icons/DollarIcon";
import { DotGridVerticalIcon } from "@/icons/DotGridVerticalIcon";
import { MacbookIcon } from "@/icons/MacbookIcon";
import { MoonIcon } from "@/icons/MoonIcon";
import { PluginIcon } from "@/icons/PluginIcon";
import { PlusIcon } from "@/icons/PlusIcon";
import { SunIcon } from "@/icons/SunIcon";
import { VultisigLogoIcon } from "@/icons/VultisigLogoIcon";
import { ZapIcon } from "@/icons/ZapIcon";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { getVault } from "@/utils/extension";
import { routeTree } from "@/utils/routes";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.bgPrimary.toHex()};
    color: ${({ theme }) => theme.textPrimary.toHex()};
  }
`;

export const DefaultLayout = () => {
  const { connect, disconnect, setTheme, theme, vault } = useCore();
  const navigate = useNavigate();
  const location = useLocation();
  const colors = useTheme();
  const isNotSupport = useMediaQuery({ query: "(max-width: 991px)" });
  const { extension, extensionHolder } = useExtension();

  const sidebarItems: MenuProps["items"] = [
    {
      icon: <PluginIcon fontSize={18} />,
      key: routeTree.plugins.path,
      label: "Plugins",
      onClick: () => navigate(routeTree.plugins.path),
    },
    {
      icon: <DollarIcon fontSize={18} />,
      key: routeTree.earnings.path,
      label: "Earnings",
      onClick: () => navigate(routeTree.earnings.path),
    },
    {
      icon: <PlusIcon fontSize={18} />,
      key: routeTree.newPlugin.path,
      label: "New Plugin",
      onClick: () => navigate(routeTree.newPlugin.path),
    },
  ];

  const dropdownMenu: MenuProps["items"] = [
    {
      icon: theme === "light" ? <MoonIcon /> : <SunIcon />,
      key: "1",
      label: (
        <HStack
          $style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <span>Theme</span>
          <span>{theme === "light" ? "Dark" : "Light"}</span>
        </HStack>
      ),
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
    },
    ...(vault
      ? [
          {
            icon: <ArrowBoxLeftIcon color={colors.accentFour.toHex()} />,
            key: "2",
            label: "Sign out",
            onClick: () => extension(() => disconnect()),
          },
        ]
      : [
          {
            icon: <ArrowBoxRightIcon color={colors.accentFour.toHex()} />,
            key: "3",
            label: "Connect Vault",
            onClick: () => extension(() => connect()),
          },
        ]),
  ];

  useEffect(() => {
    if (isNotSupport) return;

    const timeoutId = setTimeout(() => {
      getVault()
        .then((vault) => {
          if (vault) connect();
        })
        .catch(() => {});
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [connect, isNotSupport]);

  const getSelectedKey = () => {
    if (location.pathname.startsWith("/plugins")) return routeTree.plugins.path;
    if (location.pathname === routeTree.earnings.path) return routeTree.earnings.path;
    if (location.pathname === routeTree.newPlugin.path) return routeTree.newPlugin.path;
    return routeTree.plugins.path;
  };

  return isNotSupport ? (
    <VStack
      $style={{
        alignItems: "center",
        backgroundImage: "url(/images/not-support.jpg)",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        bottom: "0",
        color: colors.neutral50.toHex(),
        gap: "16px",
        justifyContent: "center",
        left: "0",
        position: "fixed",
        right: "0",
        top: "0",
      }}
    >
      <MacbookIcon fontSize={32} />
      <Stack
        as="span"
        $style={{
          fontSize: "22px",
          lineHeight: "24px",
          opacity: "0.9",
          textAlign: "center",
          width: "264px",
        }}
      >
        The Vultisig Developer Portal is currently only available on desktop.
      </Stack>
    </VStack>
  ) : (
    <>
      <GlobalStyle />

      <HStack $style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <VStack
          $style={{
            backgroundColor: colors.bgSecondary.toHex(),
            borderRight: `1px solid ${colors.borderLight.toHex()}`,
            width: "260px",
            position: "fixed",
            top: "0",
            left: "0",
            bottom: "0",
          }}
        >
          {/* Logo */}
          <HStack
            as={Link}
            to={routeTree.root.path}
            $style={{
              alignItems: "center",
              borderBottom: `1px solid ${colors.borderLight.toHex()}`,
              color: colors.textPrimary.toHex(),
              gap: "10px",
              height: "72px",
              padding: "0 20px",
            }}
            $hover={{ color: colors.textSecondary.toHex() }}
          >
            <HStack $style={{ position: "relative" }}>
              <BoxIcon color={colors.accentThree.toHex()} fontSize={36} />
              <Stack
                as={VultisigLogoIcon}
                color={colors.bgSecondary.toHex()}
                fontSize={20}
                $style={{
                  left: "50%",
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </HStack>
            <VStack $style={{ gap: "2px" }}>
              <Stack $style={{ fontSize: "16px", fontWeight: "600", lineHeight: "20px" }}>
                Developer Portal
              </Stack>
              <Stack $style={{ fontSize: "11px", color: colors.textTertiary.toHex(), lineHeight: "14px" }}>
                Plugin Management
              </Stack>
            </VStack>
          </HStack>

          {/* Navigation Menu */}
          <VStack
            $style={{
              flex: "1",
              padding: "16px 12px",
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              items={sidebarItems}
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
            />
          </VStack>

          {/* User Section */}
          <VStack
            $style={{
              borderTop: `1px solid ${colors.borderLight.toHex()}`,
              padding: "16px",
            }}
          >
            <Dropdown
              menu={{ items: dropdownMenu }}
              placement="topRight"
              trigger={["click"]}
            >
              <HStack
                $style={{
                  alignItems: "center",
                  backgroundColor: colors.bgTertiary.toHex(),
                  border: `solid 1px ${colors.borderLight.toHex()}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  gap: "8px",
                  height: "44px",
                  justifyContent: "space-between",
                  padding: "0 12px",
                }}
                $hover={{ backgroundColor: colors.bgNeutral.toHex() }}
              >
                <HStack $style={{ alignItems: "center", gap: "8px" }}>
                  <Stack
                    as={ZapIcon}
                    $style={{
                      backgroundColor: colors.bgPrimary.toHex(),
                      border: `solid 1px ${colors.borderLight.toHex()}`,
                      borderRadius: "50%",
                      color: colors.warning.toHex(),
                      fill: "currentcolor",
                      fontSize: "32px",
                      padding: "8px",
                    }}
                  />
                  <Stack
                    $style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "120px",
                      fontSize: "13px",
                    }}
                  >
                    {vault?.name || "Connect Vault"}
                  </Stack>
                </HStack>
                <DotGridVerticalIcon />
              </HStack>
            </Dropdown>
          </VStack>
        </VStack>

        {/* Main Content */}
        <VStack
          $style={{
            flex: "1",
            marginLeft: "260px",
            minHeight: "100vh",
          }}
        >
          {/* Header */}
          <HStack
            $style={{
              alignItems: "center",
              backgroundColor: colors.bgPrimary.toHex(),
              borderBottom: `1px solid ${colors.borderLight.toHex()}`,
              height: "72px",
              justifyContent: "space-between",
              padding: "0 32px",
              position: "sticky",
              top: "0",
              zIndex: "1",
            }}
          >
            <VStack
              $style={{
                alignItems: "center",
                backgroundColor: colors.bgAlert.toHex(),
                borderRadius: "8px",
                justifyContent: "center",
                padding: "8px 16px",
              }}
            >
              <Stack $style={{ fontSize: "12px" }}>
                This is an early-stage version. Do not rely on it for production use.
              </Stack>
            </VStack>
          </HStack>

          {/* Page Content */}
          <VStack $style={{ flex: "1", padding: "32px" }}>
            <Outlet />
          </VStack>
        </VStack>
      </HStack>

      {extensionHolder}
    </>
  );
};
