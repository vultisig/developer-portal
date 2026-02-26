import type * as CSS from "csstype";
import styled, { css } from "styled-components";

import { toKebab } from "@/utils/functions";

type CSSProperties = CSS.Properties<string>;

const cssPropertiesToString = (styles: CSSProperties) => {
  return Object.entries(styles)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${toKebab(key)}: ${value};`)
    .join("\n");
};

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
      @media (min-width: 768px) {
        ${defaultPropertiesToString($media.md)}
      }
    `}
    ${$media?.lg &&
    css`
      @media (min-width: 992px) {
        ${defaultPropertiesToString($media.lg)}
      }
    `}
    ${$media?.xl &&
    css`
      @media (min-width: 1200px) {
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
