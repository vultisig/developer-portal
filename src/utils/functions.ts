import dayjs from "dayjs";

import { Chain, chains, explorerBaseUrl } from "@/utils/chain";
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

export const formatDateWithTimezone = (date: string | number) => {
  const d = dayjs(date);

  return {
    date: d.format("YYYY-MM-DD"),
    time: d.format("HH:mm"),
    timezone: `UTC${d.format("Z")}`,
  };
};

export const getExplorerUrl = (
  chain: Chain,
  entity: "address" | "tx",
  value: string,
): string => {
  const baseUrl = explorerBaseUrl[chain];

  return match(entity, {
    address: () =>
      match(chain, {
        [chains.Akash]: () => `${baseUrl}/address/${value}`,
        [chains.Arbitrum]: () => `${baseUrl}/address/${value}`,
        [chains.Avalanche]: () => `${baseUrl}/address/${value}`,
        [chains.Base]: () => `${baseUrl}/address/${value}`,
        [chains.Bitcoin]: () => `${baseUrl}/address/${value}`,
        [chains.BitcoinCash]: () => `${baseUrl}/address/${value}`,
        [chains.Blast]: () => `${baseUrl}/address/${value}`,
        [chains.BSC]: () => `${baseUrl}/address/${value}`,
        [chains.Cardano]: () => `${baseUrl}/address/${value}`,
        [chains.Cosmos]: () => `${baseUrl}/address/${value}`,
        [chains.CronosChain]: () => `${baseUrl}/address/${value}`,
        [chains.Dash]: () => `${baseUrl}/address/${value}`,
        [chains.Dogecoin]: () => `${baseUrl}/address/${value}`,
        [chains.Dydx]: () => `${baseUrl}/address/${value}`,
        [chains.Ethereum]: () => `${baseUrl}/address/${value}`,
        [chains.Hyperliquid]: () => `${baseUrl}/address/${value}`,
        [chains.Kujira]: () => `${baseUrl}/address/${value}`,
        [chains.Litecoin]: () => `${baseUrl}/address/${value}`,
        [chains.Mantle]: () => `${baseUrl}/address/${value}`,
        [chains.MayaChain]: () => `${baseUrl}/address/${value}`,
        [chains.Noble]: () => `${baseUrl}/address/${value}`,
        [chains.Optimism]: () => `${baseUrl}/address/${value}`,
        [chains.Osmosis]: () => `${baseUrl}/address/${value}`,
        [chains.Polkadot]: () => `${baseUrl}/account/${value}`,
        [chains.Polygon]: () => `${baseUrl}/address/${value}`,
        [chains.Ripple]: () => `${baseUrl}/account/${value}`,
        [chains.Sei]: () => `${baseUrl}/address/${value}`,
        [chains.Solana]: () => `${baseUrl}/address/${value}`,
        [chains.Sui]: () => `${baseUrl}/address/${value}`,
        [chains.Terra]: () => `${baseUrl}/address/${value}`,
        [chains.TerraClassic]: () => `${baseUrl}/classic/address/${value}`,
        [chains.THORChain]: () => `${baseUrl}/address/${value}`,
        [chains.Ton]: () => `${baseUrl}/${value}`,
        [chains.Tron]: () => `${baseUrl}/address/${value}`,
        [chains.Zcash]: () => `${baseUrl}/address/${value}`,
        [chains.Zksync]: () => `${baseUrl}/address/${value}`,
      }),
    tx: () =>
      match(chain, {
        [chains.Akash]: () => `${baseUrl}/tx/${value}`,
        [chains.Arbitrum]: () => `${baseUrl}/tx/${value}`,
        [chains.Avalanche]: () => `${baseUrl}/tx/${value}`,
        [chains.Base]: () => `${baseUrl}/tx/${value}`,
        [chains.Bitcoin]: () => `${baseUrl}/tx/${value}`,
        [chains.BitcoinCash]: () => `${baseUrl}/transaction/${value}`,
        [chains.Blast]: () => `${baseUrl}/tx/${value}`,
        [chains.BSC]: () => `${baseUrl}/tx/${value}`,
        [chains.Cardano]: () => `${baseUrl}/transaction/${value}`,
        [chains.Cosmos]: () => `${baseUrl}/tx/${value}`,
        [chains.CronosChain]: () => `${baseUrl}/tx/${value}`,
        [chains.Dash]: () => `${baseUrl}/transaction/${value}`,
        [chains.Dogecoin]: () => `${baseUrl}/transaction/${value}`,
        [chains.Dydx]: () => `${baseUrl}/tx/${value}`,
        [chains.Ethereum]: () => `${baseUrl}/tx/${value}`,
        [chains.Hyperliquid]: () => `${baseUrl}/tx/${value}`,
        [chains.Kujira]: () => `${baseUrl}/tx/${value}`,
        [chains.Litecoin]: () => `${baseUrl}/transaction/${value}`,
        [chains.Mantle]: () => `${baseUrl}/tx/${value}`,
        [chains.MayaChain]: () => `${baseUrl}/tx/${value}`,
        [chains.Noble]: () => `${baseUrl}/tx/${value}`,
        [chains.Optimism]: () => `${baseUrl}/tx/${value}`,
        [chains.Osmosis]: () => `${baseUrl}/tx/${value}`,
        [chains.Polkadot]: () => `${baseUrl}/extrinsic/${value}`,
        [chains.Polygon]: () => `${baseUrl}/tx/${value}`,
        [chains.Ripple]: () => `${baseUrl}/transaction/${value}`,
        [chains.Sei]: () => `${baseUrl}/tx/${value}`,
        [chains.Solana]: () => `${baseUrl}/tx/${value}`,
        [chains.Sui]: () => `${baseUrl}/tx/${value}`,
        [chains.Terra]: () => `${baseUrl}/tx/${value}`,
        [chains.TerraClassic]: () => `${baseUrl}/tx/${value}`,
        [chains.THORChain]: () => `${baseUrl}/tx/${value}`,
        [chains.Ton]: () => `${baseUrl}/transaction/${value}`,
        [chains.Tron]: () => `${baseUrl}/transaction/${value}`,
        [chains.Zcash]: () => `${baseUrl}/tx/${value}`,
        [chains.Zksync]: () => `${baseUrl}/tx/${value}`,
      }),
  });
};

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const match = <T extends string | number | symbol, V>(
  value: T,
  handlers: { [key in T]: () => V },
): V => {
  const handler = handlers[value];

  return handler();
};

export const parseBase64DataUrl = (
  dataUrl: string,
): { mime: string; base64: string } => {
  const [prefix, base64] = dataUrl.split(",");

  const mimeMatch = prefix.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "";

  return { mime, base64 };
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

export const urlToBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
