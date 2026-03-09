import { Chain } from "@/utils/chain";
import { earningStatuses, earningTypes } from "@/utils/constants";
import { Role } from "@/utils/role";

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

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

export type FieldUpdate = {
  field: string;
  newValue: string;
  oldValue: string;
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

export type Member = {
  addedBy?: string;
  addedVia: string;
  createdAt: string;
  isCurrentUser: boolean;
  publicKey: string;
  role: Role;
};

export type MemberInvitation = {
  link: string;
  expiresAt: string;
  role: Role;
};

export type Plugin = {
  category: string;
  createdAt: string;
  description: string;
  id: string;
  logoUrl?: string;
  payoutAddress: string;
  publicKey?: string;
  serverEndpoint: string;
  thumbnailUrl?: string;
  title: string;
  updatedAt: string;
};

export type PluginProposal = Pick<
  Plugin,
  "category" | "createdAt" | "serverEndpoint" | "title" | "updatedAt"
> & {
  banner?: string; // Only for form submission, not returned by API
  contactEmail: string;
  images: Image[];
  logo?: string; // Only for form submission, not returned by API
  media?: string[]; // Only for form submission, not returned by API
  notes: string;
  pluginId: string;
  pricingModel: "free" | "once" | "per-tx";
  publicKey: string;
  shortDescription: string;
  status: "submitted" | "approved" | "listed" | "active";
  supportedChains: Chain[];
  thumbnail?: string; // Only for form submission, not returned by API
};

export type PluginRole = {
  canEdit: boolean;
  role: Role;
};

export type PluginUpdate = Pick<
  Plugin,
  "description" | "payoutAddress" | "serverEndpoint" | "title"
>;

export type PluginUpdateMessage = {
  nonce: number;
  pluginId: string;
  signer: string;
  timestamp: number;
  updates: FieldUpdate[];
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
