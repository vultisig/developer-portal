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
        Form: {
          labelColor: colors.textTertiary.toHex(),
        },
        Input: {
          activeBorderColor: colors.borderNormal.toHex(),
          activeShadow: "none",
          colorBgContainer: colors.bgSecondary.toHex(),
          colorTextPlaceholder: colors.textTertiary.toHex(),
          hoverBorderColor: colors.borderNormal.toHex(),
          inputFontSize: 16,
          paddingBlock: 16,
        },
        Select: {
          activeBorderColor: colors.borderNormal.toHex(),
          activeOutlineColor: "transparent",
          colorBgContainer: colors.bgSecondary.toHex(),
          colorTextPlaceholder: colors.textTertiary.toHex(),
          controlHeight: 56,
          hoverBorderColor: colors.borderNormal.toHex(),
          optionHeight: 36,
          optionLineHeight: "28px",
          optionPadding: "4px 12px",
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
