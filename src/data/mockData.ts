import { EarningTransaction, Plugin, PluginApiKey, PluginPricing } from "@/utils/types";

// Mock Plugins based on seed data
export const mockPlugins: Plugin[] = [
  {
    id: "vultisig-dca-0000",
    title: "Vultisig DCA Plugin",
    description: "Dollar Cost Averaging automation for cryptocurrency investments. Automatically execute recurring buy orders based on predefined schedules and strategies.",
    serverEndpoint: "http://dca-server:8080",
    category: "app",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-20T15:30:00Z",
    logoUrl: "/images/dca-logo.png",
    thumbnailUrl: "/images/dca-thumbnail.png",
    publicKey: "027e897b35aa9f9fff223b6c826ff42da37e8169fae7be57cbd38be86938a746c6",
  },
  {
    id: "vultisig-payroll-0000",
    title: "Vultisig Payroll Plugin",
    description: "Automated payroll system for cryptocurrency payments. Handle employee payments, tax calculations, and compliance reporting.",
    serverEndpoint: "http://payroll-server:8080",
    category: "app",
    createdAt: "2024-02-10T08:00:00Z",
    updatedAt: "2024-04-05T12:00:00Z",
    logoUrl: "/images/payroll-logo.png",
    thumbnailUrl: "/images/payroll-thumbnail.png",
    publicKey: "027e897b35aa9f9fff223b6c826ff42da37e8169fae7be57cbd38be86938a746c6",
  },
  {
    id: "vultisig-copytrader-0000",
    title: "Vultisig Copytrader Plugin",
    description: "Copytrader",
    serverEndpoint: "http://copytrader-server:8080",
    category: "app",
    createdAt: "2024-03-01T14:00:00Z",
    updatedAt: "2024-04-10T09:00:00Z",
    logoUrl: "/images/copytrader-logo.png",
    thumbnailUrl: "/images/copytrader-thumbnail.png",
    publicKey: "027e897b35aa9f9fff223b6c826ff42da37e8169fae7be57cbd38be86938a746c6",
  },
  {
    id: "vultisig-fees-feee",
    title: "Vultisig Fee Management Plugin",
    description: "Fee collection and management system. Track, calculate, and distribute fees across different protocols and services.",
    serverEndpoint: "http://fee-server:8080",
    category: "app",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-04-01T00:00:00Z",
    logoUrl: "/images/fee-logo.png",
    thumbnailUrl: "/images/fee-thumbnail.png",
    publicKey: "027e897b35aa9f9fff223b6c826ff42da37e8169fae7be57cbd38be86938a746c6",
  },
  {
    id: "nbits-labs-merkle-e93d",
    title: "NBits Labs Merkle Plugin",
    description: "Merkle tree implementation for efficient data storage and retrieval.",
    serverEndpoint: "http://localhost:8089",
    category: "app",
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-15T16:00:00Z",
    logoUrl: "/images/merkle-logo.png",
    thumbnailUrl: "/images/merkle-thumbnail.png",
    publicKey: "027e897b35aa9f9fff223b6c826ff42da37e8169fae7be57cbd38be86938a746c6",
  },
];

// Mock Pricing based on seed data
export const mockPricings: PluginPricing[] = [
  {
    id: "00000000-0000-0000-0000-000000000002",
    pluginId: "vultisig-dca-0000",
    asset: "usdc",
    type: "per-tx",
    frequency: null,
    amount: 10000, // 1 cent in micro units
    metric: "fixed",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    pluginId: "vultisig-payroll-0000",
    asset: "usdc",
    type: "once",
    frequency: null,
    amount: 50000, // 5 cents
    metric: "fixed",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    pluginId: "vultisig-payroll-0000",
    asset: "usdc",
    type: "recurring",
    frequency: "monthly",
    amount: 30000, // 3 cents
    metric: "fixed",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    pluginId: "vultisig-copytrader-0000",
    asset: "usdc",
    type: "per-tx",
    frequency: null,
    amount: 10000, // 1 cent
    metric: "fixed",
  },
];

// Mock API Keys
export const mockApiKeys: PluginApiKey[] = [
  {
    id: "apikey-1",
    pluginId: "vultisig-payroll-0000",
    apikey: "localhost-apikey",
    createdAt: "2024-01-15T10:00:00Z",
    expiresAt: null,
    status: 1,
  },
  {
    id: "apikey-2",
    pluginId: "vultisig-copytrader-0000",
    apikey: "localhost-apikey-copytrading",
    createdAt: "2024-02-10T08:00:00Z",
    expiresAt: null,
    status: 1,
  },
  {
    id: "apikey-3",
    pluginId: "vultisig-fees-feee",
    apikey: "localhost-fee-apikey",
    createdAt: "2024-01-01T00:00:00Z",
    expiresAt: null,
    status: 1,
  },
];

// Mock Earning Transactions
export const mockEarnings: EarningTransaction[] = [
  {
    id: "tx-001",
    pluginId: "vultisig-dca-0000",
    pluginName: "Vultisig DCA Plugin",
    amount: 10000,
    asset: "usdc",
    type: "per-tx",
    createdAt: "2024-04-10T14:32:00Z",
    fromAddress: "0x1234...5678",
    txHash: "0xabc123def456789",
    status: "completed",
  },
  {
    id: "tx-002",
    pluginId: "vultisig-dca-0000",
    pluginName: "Vultisig DCA Plugin",
    amount: 10000,
    asset: "usdc",
    type: "per-tx",
    createdAt: "2024-04-10T12:15:00Z",
    fromAddress: "0x8765...4321",
    txHash: "0xdef456abc789012",
    status: "completed",
  },
  {
    id: "tx-003",
    pluginId: "vultisig-payroll-0000",
    pluginName: "Vultisig Payroll Plugin",
    amount: 50000,
    asset: "usdc",
    type: "once",
    createdAt: "2024-04-09T10:00:00Z",
    fromAddress: "0xabcd...efgh",
    txHash: "0x123abc456def789",
    status: "completed",
  },
  {
    id: "tx-004",
    pluginId: "vultisig-payroll-0000",
    pluginName: "Vultisig Payroll Plugin",
    amount: 30000,
    asset: "usdc",
    type: "recurring",
    createdAt: "2024-04-01T00:00:00Z",
    fromAddress: "0xijkl...mnop",
    txHash: "0x789def012abc345",
    status: "completed",
  },
  {
    id: "tx-005",
    pluginId: "vultisig-copytrader-0000",
    pluginName: "Vultisig Copytrader Plugin",
    amount: 10000,
    asset: "usdc",
    type: "per-tx",
    createdAt: "2024-04-08T16:45:00Z",
    fromAddress: "0xqrst...uvwx",
    txHash: "0x456789abcdef012",
    status: "completed",
  },
  {
    id: "tx-006",
    pluginId: "vultisig-dca-0000",
    pluginName: "Vultisig DCA Plugin",
    amount: 10000,
    asset: "usdc",
    type: "per-tx",
    createdAt: "2024-04-07T09:20:00Z",
    fromAddress: "0xyzab...cdef",
    txHash: "0xabcdef123456789",
    status: "pending",
  },
  {
    id: "tx-007",
    pluginId: "vultisig-copytrader-0000",
    pluginName: "Vultisig Copytrader Plugin",
    amount: 10000,
    asset: "usdc",
    type: "per-tx",
    createdAt: "2024-04-06T11:30:00Z",
    fromAddress: "0xghij...klmn",
    txHash: "0x789012345abcdef",
    status: "completed",
  },
  {
    id: "tx-008",
    pluginId: "vultisig-payroll-0000",
    pluginName: "Vultisig Payroll Plugin",
    amount: 30000,
    asset: "usdc",
    type: "recurring",
    createdAt: "2024-03-01T00:00:00Z",
    fromAddress: "0xopqr...stuv",
    txHash: "0xdef012345678abc",
    status: "completed",
  },
];

// Tags
export const mockTags = [
  { id: "00000000-0000-0000-0000-000000000001", name: "Trading" },
  { id: "00000000-0000-0000-0000-000000000002", name: "Operations" },
];

// Plugin to Tag mappings
export const mockPluginTags: Record<string, string[]> = {
  "vultisig-dca-0000": ["00000000-0000-0000-0000-000000000001"],
  "vultisig-copytrader-0000": ["00000000-0000-0000-0000-000000000001"],
  "vultisig-payroll-0000": ["00000000-0000-0000-0000-000000000002"],
};
