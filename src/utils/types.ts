import type * as CSS from "csstype";

import { Chain } from "@/utils/chain";
import { earningStatuses, earningTypes } from "@/utils/constants";

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type CSSProperties = CSS.Properties<string>;

export type Earning = {
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
  status: (typeof earningStatuses)[number];
  txHash: string;
  type: (typeof earningTypes)[number];
};

export type EarningFilters = Partial<
  Pick<Earning, "pluginId" | "status" | "type">
>;

export type EarningSummary = {
  earningsByPlugin: Record<string, Pick<Earning, "amount" | "feeAsset">>;
  totalEarnings: Pick<Earning, "amount" | "feeAsset">;
  totalTransactions: number;
};

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

export type Plugin = {
  category: string;
  createdAt: string;
  description: string;
  id: string;
  logoUrl?: string;
  publicKey?: string;
  serverEndpoint: string;
  thumbnailUrl?: string;
  title: string;
  updatedAt: string;
};

export type Proposal = {
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

export type Member = {
  addedBy?: string;
  addedVia: string;
  createdAt: string;
  isCurrentUser: boolean;
  publicKey: string;
  role: "admin" | "editor" | "staff" | "viewer";
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
