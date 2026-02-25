import { theme } from "antd";
import styled, { css } from "styled-components";

import { cssPropertiesToString } from "@/utils/functions";
import { CSSProperties } from "@/utils/types";

export const { screenLG, screenMD, screenXL } = theme.getDesignToken();

const defaultPropertiesToString = (props: DefaultProps) => {
  const { $after, $before, $hover, $style } = props;

  return css`
    ${$style && cssPropertiesToString($style)}
    ${$after &&
    css`
      &::after {
        ${cssPropertiesToString({ ...$after, content: $after.content || `''` })}
      }
    `}
  ${$before &&
    css`
      &::before {
        ${cssPropertiesToString({
          ...$before,
          content: $before.content || `''`,
        })}
      }
    `}
  ${$hover &&
    css`
      ${!$style?.transition &&
      css`
        transition: all 0.2s;
      `}
      &:hover {
        ${cssPropertiesToString($hover)}
      }
    `}
  `;
};

const stackPropertiesToString = (props: StackProps) => {
  const { $media } = props;

  return css`
    ${defaultPropertiesToString(props)}
    ${$media?.md &&
    css`
      @media (min-width: ${screenMD}px) {
        ${defaultPropertiesToString($media.md)}
      }
    `}
    ${$media?.lg &&
    css`
      @media (min-width: ${screenLG}px) {
        ${defaultPropertiesToString($media.lg)}
      }
    `}
    ${$media?.xl &&
    css`
      @media (min-width: ${screenXL}px) {
        ${defaultPropertiesToString($media.xl)}
      }
    `}
  `;
};

export const Stack = styled.div<StackProps>`
  ${stackPropertiesToString}
`;

export const HStack = styled.div<StackProps>`
  ${({ $style = {}, ...props }) =>
    stackPropertiesToString({
      ...props,
      $style: { display: "flex", flexDirection: "row", ...$style },
    })}
`;

export const VStack = styled.div<StackProps>`
  ${({ $style = {}, ...props }) =>
    stackPropertiesToString({
      ...props,
      $style: { display: "flex", flexDirection: "column", ...$style },
    })}
`;

export type StackProps = DefaultProps & {
  $media?: { lg?: DefaultProps; md?: DefaultProps; xl?: DefaultProps };
};

type DefaultProps = {
  $after?: CSSProperties;
  $before?: CSSProperties;
  $hover?: CSSProperties;
  $style?: CSSProperties;
};
