import {
  ConfigProvider,
  message as Message,
  Modal,
  theme,
  ThemeConfig,
} from "antd";
import { FC, ReactNode, useMemo } from "react";
import { useTheme } from "styled-components";

import { AntdContext } from "@/context/Antd";
import { useCore } from "@/hooks/useCore";
import { Theme } from "@/utils/theme";

const algorithm: Record<Theme, ThemeConfig["algorithm"]> = {
  dark: theme.darkAlgorithm,
  light: theme.defaultAlgorithm,
} as const;

export const AntdProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [messageAPI, messageHolder] = Message.useMessage();
  const [modalAPI, modalHolder] = Modal.useModal();
  const { theme } = useCore();
  const colors = useTheme();

  const themeConfig: ThemeConfig = useMemo(() => {
    return {
      algorithm: algorithm[theme],
      token: {
        borderRadius: 10,
        colorBgBase: colors.bgPrimary.toHex(),
        colorBgContainer: colors.bgPrimary.toHex(),
        colorBgElevated: colors.bgSecondary.toHex(),
        colorBorder: colors.borderLight.toHex(),
        colorSplit: colors.borderNormal.toHex(),
        colorBorderSecondary: colors.borderNormal.toHex(),
        colorPrimary: colors.buttonPrimary.toHex(),
        colorWarning: colors.warning.toHex(),
        colorLinkHover: colors.textPrimary.toHex(),
        colorLink: colors.textPrimary.toHex(),
        fontFamily: "inherit",
      },
      components: {
        Dropdown: {
          fontSize: 16,
          fontSizeSM: 20,
          paddingBlock: 8,
        },
        Input: {
          activeBorderColor: colors.borderNormal.toHex(),
          activeShadow: "none",
          hoverBorderColor: colors.borderNormal.toHex(),
        },
        InputNumber: {
          activeBorderColor: colors.borderNormal.toHex(),
          activeShadow: "none",
          hoverBorderColor: colors.borderNormal.toHex(),
        },
        Layout: {
          headerBg: colors.bgSecondary.toHex(),
          headerPadding: 0,
        },
        Menu: {
          itemBg: "transparent",
          itemSelectedBg: colors.bgTertiary.toHex(),
          itemSelectedColor: colors.textPrimary.toHex(),
          itemHoverBg: colors.bgTertiary.toHex(),
          itemHoverColor: colors.textPrimary.toHex(),
        },
        Modal: {
          contentBg: colors.bgPrimary.toHex(),
          headerBg: "transparent",
        },
        Select: {
          activeBorderColor: colors.borderNormal.toHex(),
          activeOutlineColor: "transparent",
          hoverBorderColor: colors.borderNormal.toHex(),
          optionLineHeight: 2,
          optionPadding: "4px 12px",
        },
        Table: {
          borderColor: colors.borderLight.toHex(),
          headerBg: colors.bgTertiary.toHex(),
          headerSplitColor: colors.borderNormal.toHex(),
        },
      },
    };
  }, [colors, theme]);

  return (
    <ConfigProvider theme={themeConfig}>
      <AntdContext.Provider value={{ messageAPI, modalAPI }}>
        {children}
        {messageHolder}
        {modalHolder}
      </AntdContext.Provider>
    </ConfigProvider>
  );
};
