import type * as CSS from "csstype";

import { Chain } from "@/utils/chain";

export type APIResponse<T> = {
  status: number;
  data: T;
  timestamp: string;
  version: string;
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type CSSProperties = CSS.Properties<string>;

export type OneInchToken = {
  address: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  name: string;
};

export type JupiterToken = {
  id: string;
  symbol: string;
  decimals: number;
  icon?: string;
  name: string;
};

export type Token = {
  chain: Chain;
  decimals: number;
  id: string;
  logo: string;
  name: string;
  ticker: string;
};

export type Vault = {
  hexChainCode: string;
  isFastVault: boolean;
  localPartyId: string;
  name: string;
  parties: string[];
  publicKeyEcdsa: string;
  publicKeyEddsa: string;
  uid: string;
};
