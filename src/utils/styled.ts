import { DefaultTheme } from "styled-components";

import { Theme } from "@/utils/theme";

export class ColorToken {
  constructor(
    private h: number,
    private s: number,
    private l: number,
    private a: number = 1
  ) {}

  private getRgb(): { r: number; g: number; b: number } {
    const { h, s, l } = this;
    const C = (1 - Math.abs((2 * l) / 100 - 1)) * (s / 100);
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - C / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
      r = C;
      g = X;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = X;
      g = C;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = C;
      b = X;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = X;
      b = C;
    } else if (240 <= h && h < 300) {
      r = X;
      g = 0;
      b = C;
    } else if (300 <= h && h < 360) {
      r = C;
      g = 0;
      b = X;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  darken(amount: number): ColorToken {
    return new ColorToken(this.h, this.s, Math.max(0, this.l - amount));
  }

  lighten(amount: number): ColorToken {
    return new ColorToken(this.h, this.s, Math.min(100, this.l + amount));
  }

  toHex(): string {
    const { r, g, b } = this.getRgb();
    const hex = (value: number) => value.toString(16).padStart(2, "0");
    const a = Math.round(Math.max(0, Math.min(1, this.a)) * 255);

    return `#${hex(r)}${hex(g)}${hex(b)}${a < 255 ? hex(a) : ""}`;
  }

  toHSL(): string {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }

  toHSLA(alpha: number = this.a): string {
    const clamped = Math.max(0, Math.min(1, alpha));
    return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${clamped})`;
  }

  toRgba(alpha: number = this.a): string {
    const { r, g, b } = this.getRgb();

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

export type SharedColors = {
  accentOne: ColorToken;
  accentTwo: ColorToken;
  accentThree: ColorToken;
  accentFour: ColorToken;
  error: ColorToken;
  info: ColorToken;
  neutral50: ColorToken;
  neutral100: ColorToken;
  neutral200: ColorToken;
  neutral300: ColorToken;
  neutral400: ColorToken;
  neutral500: ColorToken;
  neutral600: ColorToken;
  neutral700: ColorToken;
  neutral800: ColorToken;
  neutral900: ColorToken;
  success: ColorToken;
  warning: ColorToken;
};

const sharedColors: SharedColors = {
  accentOne: new ColorToken(224, 95, 31),
  accentTwo: new ColorToken(224, 96, 40),
  accentThree: new ColorToken(224, 75, 50),
  accentFour: new ColorToken(224, 98, 64),
  error: new ColorToken(0, 100, 68),
  info: new ColorToken(212, 100, 68),
  neutral50: new ColorToken(0, 0, 100),
  neutral100: new ColorToken(214, 28, 95),
  neutral200: new ColorToken(216, 41, 85),
  neutral300: new ColorToken(208, 24, 67),
  neutral400: new ColorToken(209, 23, 61),
  neutral500: new ColorToken(205, 15, 55),
  neutral600: new ColorToken(211, 10, 43),
  neutral700: new ColorToken(225, 7, 27),
  neutral800: new ColorToken(210, 6, 6),
  neutral900: new ColorToken(0, 0, 0),
  success: new ColorToken(166, 83, 43),
  warning: new ColorToken(38, 100, 68),
};

export const themes: Record<Theme, DefaultTheme> = {
  dark: {
    ...sharedColors,
    bgAlert: new ColorToken(39, 40, 15),
    bgError: new ColorToken(0, 43, 12),
    bgNeutral: new ColorToken(216, 81, 13),
    bgPrimary: new ColorToken(217, 91, 9),
    bgSecondary: new ColorToken(216, 81, 13),
    bgSuccess: new ColorToken(202, 86, 11),
    bgTertiary: new ColorToken(216, 63, 18),
    borderLight: new ColorToken(216, 63, 18),
    borderNormal: new ColorToken(215, 62, 28),
    buttonDisabled: new ColorToken(221, 68, 14),
    buttonDisabledText: new ColorToken(216, 15, 52),
    buttonPrimary: new ColorToken(224, 75, 50),
    buttonPrimaryHover: new ColorToken(215, 75, 47),
    buttonSecondary: new ColorToken(216, 63, 18),
    buttonSecondaryHover: new ColorToken(216, 53, 24),
    buttonText: new ColorToken(220, 67, 96),
    textPrimary: new ColorToken(220, 67, 96),
    textSecondary: new ColorToken(215, 40, 85),
    textTertiary: new ColorToken(214, 21, 60),
  },
  light: {
    ...sharedColors,
    bgAlert: new ColorToken(37, 83, 86),
    bgError: new ColorToken(358, 83, 86),
    bgNeutral: new ColorToken(224, 69, 81),
    bgPrimary: new ColorToken(0, 0, 100),
    bgSecondary: new ColorToken(0, 0, 100),
    bgSuccess: new ColorToken(169, 81, 13),
    bgTertiary: new ColorToken(240, 20, 97),
    borderLight: new ColorToken(0, 0, 95),
    borderNormal: new ColorToken(0, 0, 90),
    buttonDisabled: new ColorToken(220, 11, 95),
    buttonDisabledText: new ColorToken(216, 6, 65),
    buttonPrimary: new ColorToken(216, 81, 13),
    buttonPrimaryHover: new ColorToken(215, 76, 20),
    buttonSecondary: new ColorToken(228, 43, 93),
    buttonSecondaryHover: new ColorToken(224, 65, 97),
    buttonText: new ColorToken(220, 67, 96),
    textPrimary: new ColorToken(217, 91, 9),
    textSecondary: new ColorToken(217, 55, 19),
    textTertiary: new ColorToken(215, 16, 52),
  },
} as const;
