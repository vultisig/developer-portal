import type * as CSS from "csstype";

export type CSSProperties = CSS.Properties<string>;

export type Plugin = {
  id: string;
  title: string;
  description: string;
  serverEndpoint: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;
  thumbnailUrl?: string;
  publicKey?: string;
};

export type PluginPricing = {
  id: string;
  pluginId: string;
  asset: string;
  type: "per-tx" | "once" | "recurring";
  frequency: string | null;
  amount: number;
  metric: string;
};

export type PluginPolicy = {
  id: string;
  publicKey: string;
  pluginId: string;
  pluginVersion: string;
  policyVersion: number;
  signature: string;
  recipe: string;
  active: boolean;
};

export type PluginApiKey = {
  id: string;
  pluginId: string;
  apikey: string;
  createdAt: string;
  expiresAt: string | null;
  status: number;
};

export type EarningTransaction = {
  id: string;
  pluginId: string;
  pluginName: string;
  amount: number;
  asset: string;
  type: "per-tx" | "once" | "recurring";
  createdAt: string;
  fromAddress: string;
  txHash: string;
  status: "pending" | "completed" | "failed";
};

export type Tag = {
  id: string;
  name: string;
};

export type Review = {
  id: string;
  pluginId: string;
  publicKey: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};
