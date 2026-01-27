import "styled-components";

import { ColorToken, SharedColors } from "@/utils/styled";

type ThemeColors = SharedColors & {
  bgAlert: ColorToken;
  bgError: ColorToken;
  bgNeutral: ColorToken;
  bgPrimary: ColorToken;
  bgSecondary: ColorToken;
  bgSuccess: ColorToken;
  bgTertiary: ColorToken;
  borderLight: ColorToken;
  borderNormal: ColorToken;
  buttonDisabled: ColorToken;
  buttonDisabledText: ColorToken;
  buttonPrimary: ColorToken;
  buttonPrimaryHover: ColorToken;
  buttonSecondary: ColorToken;
  buttonSecondaryHover: ColorToken;
  buttonText: ColorToken;
  textPrimary: ColorToken;
  textSecondary: ColorToken;
  textTertiary: ColorToken;
};

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeColors {}
}
