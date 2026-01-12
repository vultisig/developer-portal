import { mockApiKeys, mockEarnings, mockPlugins, mockPricings } from "@/data/mockData";
import { EarningTransaction, Plugin, PluginApiKey, PluginPricing } from "@/utils/types";

// Simulated delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Plugin API stubs
export const getPlugins = async (): Promise<Plugin[]> => {
  await delay(300);
  return mockPlugins;
};

export const getPlugin = async (id: string): Promise<Plugin | undefined> => {
  await delay(200);
  return mockPlugins.find(p => p.id === id);
};

export const updatePlugin = async (id: string, data: Partial<Plugin>): Promise<Plugin> => {
  await delay(500);
  const plugin = mockPlugins.find(p => p.id === id);
  if (!plugin) throw new Error("Plugin not found");

  // In a real app, this would update the backend
  Object.assign(plugin, data);
  return plugin;
};

export const getPluginPricings = async (pluginId: string): Promise<PluginPricing[]> => {
  await delay(200);
  return mockPricings.filter(p => p.pluginId === pluginId);
};

export const getPluginApiKeys = async (pluginId: string): Promise<PluginApiKey[]> => {
  await delay(200);
  return mockApiKeys.filter(k => k.pluginId === pluginId);
};

// Earnings API stubs
export type EarningsFilters = {
  pluginId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
};

export const getEarnings = async (filters?: EarningsFilters): Promise<EarningTransaction[]> => {
  await delay(300);

  let results = [...mockEarnings];

  if (filters?.pluginId) {
    results = results.filter(e => e.pluginId === filters.pluginId);
  }

  if (filters?.status) {
    results = results.filter(e => e.status === filters.status);
  }

  if (filters?.type) {
    results = results.filter(e => e.type === filters.type);
  }

  if (filters?.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    results = results.filter(e => new Date(e.createdAt) >= fromDate);
  }

  if (filters?.dateTo) {
    const toDate = new Date(filters.dateTo);
    results = results.filter(e => new Date(e.createdAt) <= toDate);
  }

  // Sort by date descending
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return results;
};

export const getEarningsSummary = async (): Promise<{
  totalEarnings: number;
  totalTransactions: number;
  earningsByPlugin: Record<string, number>;
}> => {
  await delay(200);

  const totalEarnings = mockEarnings
    .filter(e => e.status === "completed")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalTransactions = mockEarnings.length;

  const earningsByPlugin: Record<string, number> = {};
  mockEarnings
    .filter(e => e.status === "completed")
    .forEach(e => {
      earningsByPlugin[e.pluginId] = (earningsByPlugin[e.pluginId] || 0) + e.amount;
    });

  return {
    totalEarnings,
    totalTransactions,
    earningsByPlugin,
  };
};
