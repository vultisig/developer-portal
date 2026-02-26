import {
  ConfigProvider,
  message as Message,
  Modal,
  theme,
  ThemeConfig,
} from "antd";
import { createStyles } from "antd-style";
import { FC, ReactNode, useMemo } from "react";
import { useTheme } from "styled-components";

import { AntdContext, AntdContextProps } from "@/context/Antd";
import { useCore } from "@/hooks/useCore";
import { CrossLargeIcon } from "@/icons/CrossLargeIcon";
import { imageToBase64, imageToDimensions } from "@/utils/functions";
import { Theme } from "@/utils/theme";

const algorithm: Record<Theme, ThemeConfig["algorithm"]> = {
  dark: theme.darkAlgorithm,
  light: theme.defaultAlgorithm,
} as const;

export const AntdProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [messageAPI, messageHolder] = Message.useMessage();
  const [modalAPI, modalHolder] = Modal.useModal();
  const { theme } = useCore();
  const { styles } = useStyles();
  const colors = useTheme();

  const themeConfig: ThemeConfig = useMemo(() => {
    return {
      algorithm: algorithm[theme],
      token: {
        borderRadius: 12,
        borderRadiusLG: 12,
        borderRadiusSM: 8,
        borderRadiusXS: 4,
        colorBgBase: colors.bgPrimary.toHex(),
        colorBgContainer: colors.bgPrimary.toHex(),
        colorBgContainerDisabled: colors.bgTertiary.toHex(),
        colorBgElevated: colors.bgSecondary.toHex(),
        colorBgSpotlight: colors.accentTwo.toHex(),
        colorBorder: colors.borderLight.toHex(),
        colorBorderSecondary: colors.borderNormal.toHex(),
        colorLink: colors.textPrimary.toHex(),
        colorLinkHover: colors.textPrimary.toHex(),
        colorPrimary: colors.buttonPrimary.toHex(),
        colorSplit: colors.borderNormal.toHex(),
        colorTextDescription: colors.textPrimary.toHex(),
        colorWarning: colors.warning.toHex(),
        fontFamily: "inherit",
        fontWeightStrong: 500,
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
        Modal: {
          borderRadiusLG: 24,
          borderRadiusSM: 24,
          controlHeight: 36,
          marginSM: 0,
          marginXS: 0,
          titleFontSize: 22,
          titleLineHeight: "24px",
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
        Table: {
          borderColor: colors.borderLight.toHex(),
          headerBg: colors.bgTertiary.toHex(),
        },
        Upload: {
          colorBorder: colors.borderLight.toHex(),
          colorPrimary: colors.borderNormal.toHex(),
          colorPrimaryHover: colors.borderNormal.toHex(),
          colorFillAlter: colors.bgSecondary.toHex(),
        },
      },
    };
  }, [colors, theme]);

  const beforeUpload: AntdContextProps["beforeUpload"] = async ({
    dimensions,
    file,
    form,
    name,
    onChange,
    size,
  }) => {
    if (size && file.size / 1024 / 1024 > size) {
      form.setFields([
        {
          name,
          errors: [`Image must be smaller than ${size}MB`],
        },
      ]);

      return false;
    }

    if (dimensions) {
      const { height, width } = await imageToDimensions(file);

      if (height > dimensions.height || width > dimensions.width) {
        form.setFields([
          {
            name,
            errors: [
              `Image dimensions must be smaller than ${dimensions.width}x${dimensions.height}px`,
            ],
          },
        ]);

        return false;
      }
    }

    const base64 = await imageToBase64(file);

    onChange(base64);

    return false;
  };

  const onFinishFailed: AntdContextProps["onFinishFailed"] = (
    errorInfo,
    form,
  ) => {
    const [errorField] = errorInfo.errorFields;

    if (!errorField) return;

    const element = document.getElementById(errorField.name.join("_"));

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      form.scrollToField(errorField.name, {
        behavior: "smooth",
        block: "center",
      });
    }

    form.focusField(errorField.name);
  };

  return (
    <ConfigProvider
      theme={themeConfig}
      modal={{ className: styles.modal, closeIcon: <CrossLargeIcon /> }}
      table={{ className: styles.table }}
      upload={{ className: styles.upload }}
    >
      <AntdContext.Provider
        value={{ beforeUpload, messageAPI, modalAPI, onFinishFailed }}
      >
        {children}
        {messageHolder}
        {modalHolder}
      </AntdContext.Provider>
    </ConfigProvider>
  );
};

const useStyles = createStyles(({ css, cssVar, prefixCls }) => ({
  modal: css`
    .${prefixCls}-modal-close {
      background-color: ${cssVar.colorBgContainerDisabled};
      inset-inline-end: 24px;
      top: 18px;
    }

    .${prefixCls}-modal-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px;
    }

    .${prefixCls}-modal-footer {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .${prefixCls}-modal-header {
      padding-right: ${cssVar.controlHeight};
    }

    .${prefixCls}-modal-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  table: css`
    .${prefixCls}-table-container {
      overflow: hidden;
    }

    .${prefixCls}-table-content table {
      border-spacing: 0 12px;
      margin: -12px 0;
    }

    .${prefixCls}-table-tbody > tr > td {
      border-top: 1px solid ${cssVar.colorBorder};

      &:first-child {
        border-inline-start: 1px solid ${cssVar.colorBorder};
        border-start-start-radius: ${cssVar.borderRadius};
        border-end-start-radius: ${cssVar.borderRadius};
      }

      &:last-child {
        border-inline-end: 1px solid ${cssVar.colorBorder};
        border-start-end-radius: ${cssVar.borderRadius};
        border-end-end-radius: ${cssVar.borderRadius};
      }
    }

    .${prefixCls}-table-thead > tr > th {
      border: none;

      &:first-child {
        border-end-start-radius: ${cssVar.borderRadius};
      }

      &:last-child {
        border-end-end-radius: ${cssVar.borderRadius};
      }
    }
  `,
  upload: css`
    .${prefixCls}-upload {
      &.${prefixCls}-upload-select {
        overflow: hidden;
      }
    }

    .${prefixCls}-upload-drag {
      .${prefixCls}-upload {
        overflow: hidden;
        padding: 0;
      }

      .${prefixCls}-upload-drag-container {
        display: block;
      }
    }
  `,
}));
