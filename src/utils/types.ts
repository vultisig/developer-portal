import type * as CSS from "csstype";

import { Chain } from "@/utils/chain";

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type CSSProperties = CSS.Properties<string>;

export type Image = {
  contentType: ImageMime;
  data: string;
  filename: string;
  id: string;
  imageOrder: number;
  type: "logo" | "media" | "thumbnail";
  url: string;
};

export type ImageMime = "image/jpeg" | "image/png";

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

export type Plugin = {
  category: string;
  contactEmail: string;
  createdAt: string;
  images: Image[];
  logo?: string; // Only for form submission, not returned by API
  media?: string[]; // Only for form submission, not returned by API
  notes: string;
  pluginId: string;
  pricingModel: "free" | "once" | "per-tx";
  serverEndpoint: string;
  shortDescription: string;
  status: "active" | "submitted";
  supportedChains: Chain[];
  title: string;
  thumbnail?: string; // Only for form submission, not returned by API
  updatedAt: string;
};

export type Token = {
  chain: Chain;
  decimals: number;
  id: string;
  logo: string;
  name: string;
  ticker: string;
};

export type Transaction = {
  amount: string;
  createdAt: string;
  feeAsset: {
    addr: string;
    decimals: number;
    network: Chain;
    symbol: string;
  };
  fromAddress: string;
  id: string;
  pluginId: string;
  pluginName: string;
  status: "pending" | "completed" | "failed";
  txHash: string;
  type: "per-tx" | "once" | "recurring";
};

export type User = {
  email: string;
  id: string;
  name: string;
  role: "owner" | "admin" | "developer";
  status: "active" | "invited";
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
