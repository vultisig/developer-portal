import dayjs from "dayjs";

import { Currency, currencySymbols } from "@/utils/currency";
import { CSSProperties } from "@/utils/types";

const isArray = (arr: any): arr is any[] => {
  return Array.isArray(arr);
};

const isObject = (obj: any): obj is Record<string, any> => {
  return obj === Object(obj) && !isArray(obj) && typeof obj !== "function";
};

const toCamel = (value: string) => {
  return value.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const toKebab = (value: string) => {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

const toSnake = (value: string) => {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const camelCaseToTitle = (input: string) => {
  if (!input) return input;

  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const cssPropertiesToString = (styles: CSSProperties) => {
  return Object.entries(styles)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${toKebab(key)}: ${value};`)
    .join("\n");
};

export const match = <T extends string | number | symbol, V>(
  value: T,
  handlers: { [key in T]: () => V },
): V => {
  const handler = handlers[value];

  return handler();
};

export const scrollSelectDropdownToTop = (dropdownClassName: string) => {
  requestAnimationFrame(() => {
    const holder = document.querySelector(
      `.${dropdownClassName} .rc-virtual-list-holder`,
    ) as HTMLDivElement | null;

    holder?.scrollTo({ top: 0 });
  });
};

export const snakeCaseToTitle = (input: string) => {
  if (!input) return input;

  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const toCamelCase = <T>(obj: T): T => {
  if (isObject(obj)) {
    const result: Record<string, unknown> = {};

    Object.keys(obj).forEach((key) => {
      const camelKey = toCamel(key);
      result[camelKey] = toCamelCase((obj as Record<string, unknown>)[key]);
    });

    return result as T;
  } else if (isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T;
  }

  return obj;
};

// export const toKebabCase = <T>(obj: T): T => {
//   if (isObject(obj)) {
//     const result: Record<string, unknown> = {};

//     Object.keys(obj).forEach((key) => {
//       const kebabKey = toKebab(key);
//       result[kebabKey] = toKebabCase((obj as Record<string, unknown>)[key]);
//     });

//     return result as T;
//   } else if (isArray(obj)) {
//     return obj.map((item) => toKebabCase(item)) as T;
//   }

//   return obj;
// };

export const toNumberFormat = (value: number | string, decimal = 20) => {
  const str = String(value).trim();

  // If not a valid number string, return as-is
  if (!/^-?\d+(\.\d+)?$/.test(str)) return str;

  const [intPartRaw, decPartRaw = ""] = str.split(".");

  // Format integer part with commas
  const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Trim or pad decimals
  const decPart = decPartRaw.slice(0, decimal);

  return decPart.length > 0 ? `${intPart}.${decPart}` : intPart;
};

export const toSnakeCase = <T>(obj: T): T => {
  if (isObject(obj)) {
    const result: Record<string, unknown> = {};

    Object.keys(obj).forEach((key) => {
      const snakeKey = toSnake(key);
      result[snakeKey] = toSnakeCase((obj as Record<string, unknown>)[key]);
    });

    return result as T;
  } else if (isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as T;
  }

  return obj;
};

export const toValueFormat = (
  value: number | string,
  currency: Currency,
  decimal = 2,
): string => {
  return `${currencySymbols[currency]}${toNumberFormat(value, decimal)}`;
};

export const tinyId = () => {
  return Math.random().toString(36).slice(2, 8);
};

export const formatDateWithTimezone = (date: string | number) => {
  const d = dayjs(date);

  return {
    date: d.format("YYYY-MM-DD"),
    time: d.format("HH:mm"),
    timezone: `UTC${d.format("Z")}`,
  };
};
