import { Dropdown, MenuProps, theme as antTheme } from "antd";
import { useResponsive } from "antd-style";
import { useMemo } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

import { CurrencyModal } from "@/components/CurrencyModal";
import { useApp } from "@/hooks/useApp";
import { useCore } from "@/hooks/useCore";
import { ArrowBoxLeftIcon } from "@/icons/ArrowBoxLeftIcon";
import { ArrowBoxRightIcon } from "@/icons/ArrowBoxRightIcon";
import { DollarIcon } from "@/icons/DollarIcon";
import { DotGridVerticalIcon } from "@/icons/DotGridVerticalIcon";
import { MoonIcon } from "@/icons/MoonIcon";
import { PeopleCopyIcon } from "@/icons/PeopleCopyIcon";
import { PuzzleIcon } from "@/icons/PuzzleIcon";
import { SquareGridCircleIcon } from "@/icons/SquareGridCircleIcon";
import { SunIcon } from "@/icons/SunIcon";
import { VultisigLogoIcon } from "@/icons/VultisigLogoIcon";
import { ZapIcon } from "@/icons/ZapIcon";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { modalHash } from "@/utils/constants";
import { routeTree } from "@/utils/routes";

export const DefaultLayout = () => {
  const { connect, disconnect, vault } = useApp();
  const { currency, currentRoute, setTheme, theme } = useCore();
  const { lg } = useResponsive();
  const { token } = antTheme.useToken();
  const navigate = useNavigate();
  const colors = useTheme();

  const mainMenu = useMemo(
    () => [
      {
        icon: SquareGridCircleIcon,
        isActive: currentRoute === "root",
        label: "Dashboard",
        path: routeTree.root.path,
      },
      {
        icon: PuzzleIcon,
        isActive: currentRoute === "plugins",
        label: "Plugins",
        path: routeTree.plugins.path,
      },
      {
        icon: DollarIcon,
        isActive: currentRoute === "earnings",
        label: "Earnings",
        path: routeTree.earnings.path,
      },
      {
        icon: PeopleCopyIcon,
        isActive: currentRoute === "users",
        label: "Users",
        path: routeTree.users.path,
      },
    ],
    [currentRoute],
  );

  const sideMenu: MenuProps["items"] = [
    {
      icon: <DollarIcon />,
      key: "1",
      label: (
        <HStack
          $style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <span>Currency</span>
          <span>{currency.toUpperCase()}</span>
        </HStack>
      ),
      onClick: () => {
        navigate(modalHash.currency, { state: true });
      },
    },
    {
      icon: theme === "light" ? <SunIcon /> : <MoonIcon />,
      key: "2",
      label: (
        <HStack
          $style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <span>Theme</span>
          <span>{theme === "light" ? "Light" : "Dark"}</span>
        </HStack>
      ),
      onClick: () => {
        setTheme(theme === "light" ? "dark" : "light");
      },
    },
    ...(vault
      ? [
          {
            icon: <ArrowBoxLeftIcon color={colors.accentFour.toHex()} />,
            key: "3",
            label: "Sign out",
            onClick: () => disconnect(),
          },
        ]
      : [
          {
            icon: <ArrowBoxRightIcon color={colors.accentFour.toHex()} />,
            key: "3",
            label: "Connect Vault",
            onClick: () => connect(),
          },
        ]),
  ];

  return (
    <>
      <VStack
        $style={{
          alignItems: "center",
          backgroundColor: colors.bgPrimary.toHex(),
          borderBottomColor: colors.borderLight.toHex(),
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          justifyContent: "center",
          position: "sticky",
          top: "0",
          zIndex: "2",
        }}
      >
        <HStack
          $style={{
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
            maxWidth: `${token.screenXL}px`,
            padding: "0 16px",
            width: "100%",
          }}
        >
          <HStack
            as={Link}
            state={true}
            to={routeTree.root.path}
            $style={{
              alignItems: "center",
              color: colors.textPrimary.toHex(),
              gap: "10px",
            }}
            $hover={{ color: colors.textSecondary.toHex() }}
          >
            <VStack
              $style={{
                alignItems: "center",
                backgroundImage: `linear-gradient(to bottom, ${colors.accentFour.toHex()}, ${colors.accentOne.toHex()})`,
                boxShadow: `0px 0.6px 0.6px 0px ${colors.neutral50.toRgba(0.35)} inset`,
                borderRadius: "10px",
                color: colors.neutral50.toHex(),
                fontSize: "26px",
                justifyContent: "center",
                height: "40px",
                width: "40px",
              }}
            >
              <VultisigLogoIcon />
            </VStack>
            <Stack $style={{ fontSize: "22px", lineHeight: "40px" }}>
              Developer Portal
            </Stack>
          </HStack>
          {lg && (
            <HStack $style={{ gap: "24px" }}>
              {mainMenu.map((item, index) => (
                <HStack
                  as={Link}
                  key={index}
                  state={true}
                  to={item.path}
                  $style={{
                    gap: "4px",
                    height: "20px",
                    ...(item.isActive
                      ? { color: colors.accentFour.toHex() }
                      : {}),
                  }}
                  $hover={{ color: colors.accentFour.toHex() }}
                >
                  <Stack as={item.icon} $style={{ fontSize: "20px" }} />
                  <Stack as="span" $style={{ lineHeight: "22px" }}>
                    {item.label}
                  </Stack>
                </HStack>
              ))}
            </HStack>
          )}
          <Dropdown
            menu={{ items: sideMenu }}
            placement="bottomRight"
            styles={{ root: { width: 302 } }}
          >
            <HStack
              $style={{
                alignItems: "center",
                backgroundColor: colors.bgTertiary.toHex(),
                border: `solid 1px ${colors.borderLight.toHex()}`,
                borderRadius: "8px",
                cursor: "pointer",
                gap: "8px",
                height: "32px",
                justifyContent: "center",
                overflow: "hidden",
                paddingRight: "12px",
              }}
            >
              <Stack
                as={ZapIcon}
                $style={{
                  backgroundColor: colors.bgPrimary.toHex(),
                  border: `solid 1px ${colors.borderLight.toHex()}`,
                  borderRadius: "50%",
                  color: colors.warning.toHex(),
                  fill: "currentcolor",
                  fontSize: "40px",
                  marginLeft: "-4px",
                  padding: "12px",
                }}
              />
              <Stack
                $style={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "110px",
                }}
              >
                {vault?.name || "Connect Vault"}
              </Stack>

              <DotGridVerticalIcon />
            </HStack>
          </Dropdown>
        </HStack>
      </VStack>
      <VStack $style={{ alignItems: "center", flexGrow: "1" }}>
        <Outlet />
      </VStack>
      {!lg && (
        <HStack
          $style={{
            alignItems: "center",
            backgroundColor: colors.bgPrimary.toHex(),
            borderTopColor: colors.borderLight.toHex(),
            borderTopStyle: "solid",
            borderTopWidth: "1px",
            bottom: "0",
            justifyContent: "center",
            position: "sticky",
            zIndex: "2",
          }}
        >
          {mainMenu.map((item, index) => (
            <VStack
              as={Link}
              key={index}
              state={true}
              to={item.path}
              $style={{
                alignItems: "center",
                flexGrow: "1",
                gap: "8px",
                justifyContent: "center",
                padding: "12px 0",
                ...(item.isActive ? { color: colors.accentFour.toHex() } : {}),
              }}
              $hover={{ color: colors.accentFour.toHex() }}
            >
              <Stack as={item.icon} $style={{ fontSize: "20px" }} />
              <Stack as="span">{item.label}</Stack>
            </VStack>
          ))}
        </HStack>
      )}

      <CurrencyModal />
    </>
  );
};
