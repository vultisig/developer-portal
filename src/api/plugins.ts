import { apiClient } from "./client";
import { EarningTransaction, Plugin, PluginApiKey, PluginPricing } from "@/utils/types";

// Plugin API response types (from backend)
type PluginApiResponse = {
  id: string;
  title: string;
  description: string;
  server_endpoint: string;
  category: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  thumbnail_url?: string;
};

// Transform backend plugin response to frontend type
const transformPlugin = (p: PluginApiResponse): Plugin => ({
  id: p.id,
  title: p.title,
  description: p.description,
  serverEndpoint: p.server_endpoint,
  category: p.category,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
  logoUrl: p.logo_url,
  thumbnailUrl: p.thumbnail_url,
});

// Plugin API functions
export const getPlugins = async (): Promise<Plugin[]> => {
  const response = await apiClient.get<PluginApiResponse[]>("/plugins");
  return response.data.map(transformPlugin);
};

export const getPlugin = async (id: string): Promise<Plugin | undefined> => {
  try {
    const response = await apiClient.get<PluginApiResponse>(`/plugins/${id}`);
    return transformPlugin(response.data);
  } catch (error) {
    if ((error as Error).message === "plugin not found") {
      return undefined;
    }
    throw error;
  }
};

export type PluginUpdateData = Partial<Plugin> & {
  signature?: string;
  signedMessage?: object;
};

export const updatePlugin = async (id: string, data: PluginUpdateData): Promise<Plugin> => {
  const response = await apiClient.put<PluginApiResponse>(`/plugins/${id}`, {
    title: data.title,
    description: data.description,
    server_endpoint: data.serverEndpoint,
    signature: data.signature,
    signed_message: data.signedMessage,
  });
  return transformPlugin(response.data);
};

export const getPluginPricings = async (pluginId: string): Promise<PluginPricing[]> => {
  const response = await apiClient.get<PluginPricing[]>(`/plugins/${pluginId}/pricings`);
  return response.data;
};

export const getPluginApiKeys = async (pluginId: string): Promise<PluginApiKey[]> => {
  const response = await apiClient.get<PluginApiKey[]>(`/plugins/${pluginId}/api-keys`);
  return response.data;
};

// Earnings API types
export type EarningsFilters = {
  pluginId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
};

export const getEarnings = async (filters?: EarningsFilters): Promise<EarningTransaction[]> => {
  const params = new URLSearchParams();

  if (filters?.pluginId) {
    params.append("pluginId", filters.pluginId);
  }
  if (filters?.dateFrom) {
    params.append("dateFrom", filters.dateFrom);
  }
  if (filters?.dateTo) {
    params.append("dateTo", filters.dateTo);
  }

  const response = await apiClient.get<EarningTransaction[]>("/earnings", { params });

  // Apply client-side filtering for status and type (not supported by backend query params)
  let results = response.data;

  if (filters?.status) {
    results = results.filter(e => e.status === filters.status);
  }

  if (filters?.type) {
    results = results.filter(e => e.type === filters.type);
  }

  return results;
};

export const getEarningsSummary = async (): Promise<{
  totalEarnings: number;
  totalTransactions: number;
  earningsByPlugin: Record<string, number>;
}> => {
  const response = await apiClient.get<{
    totalEarnings: number;
    totalTransactions: number;
    earningsByPlugin: Record<string, number>;
  }>("/earnings/summary");
  return response.data;
};
