const cosmosExplorerUrl = "https://www.mintscan.io" as const;
const hyperliquidExplorerUrl = "https://liquidscan.io" as const;

const cosmosChains = {
  Akash: "Akash",
  Cosmos: "Cosmos",
  Dydx: "Dydx",
  Kujira: "Kujira",
  MayaChain: "MayaChain",
  Noble: "Noble",
  Osmosis: "Osmosis",
  Terra: "Terra",
  TerraClassic: "TerraClassic",
  THORChain: "THORChain",
} as const;

const ethL2Chains = {
  Arbitrum: "Arbitrum",
  Base: "Base",
  Blast: "Blast",
  Mantle: "Mantle",
  Optimism: "Optimism",
  Zksync: "Zksync",
} as const;

const evmChains = {
  ...ethL2Chains,
  Avalanche: "Avalanche",
  BSC: "BSC",
  CronosChain: "CronosChain",
  Ethereum: "Ethereum",
  Hyperliquid: "Hyperliquid",
  Polygon: "Polygon",
  Sei: "Sei",
} as const;

const otherChains = {
  Cardano: "Cardano",
  Polkadot: "Polkadot",
  Ripple: "Ripple",
  Solana: "Solana",
  Sui: "Sui",
  Ton: "Ton",
  Tron: "Tron",
} as const;

const utxoChains = {
  Bitcoin: "Bitcoin",
  BitcoinCash: "Bitcoin-Cash",
  Litecoin: "Litecoin",
  Dogecoin: "Dogecoin",
  Dash: "Dash",
  Zcash: "Zcash",
} as const;

export const chains = {
  ...cosmosChains,
  ...evmChains,
  ...utxoChains,
  ...otherChains,
} as const;

export const explorerBaseUrl: Record<Chain, string> = {
  [chains.Akash]: `${cosmosExplorerUrl}/akash`,
  [chains.Arbitrum]: "https://arbiscan.io",
  [chains.Avalanche]: "https://snowtrace.io",
  [chains.Base]: "https://basescan.org",
  [chains.Bitcoin]: "https://mempool.space",
  [chains.BitcoinCash]: "https://blockchair.com/bitcoin-cash",
  [chains.Blast]: "https://blastscan.io",
  [chains.BSC]: "https://bscscan.com",
  [chains.Cardano]: "https://cardanoscan.io",
  [chains.Cosmos]: `${cosmosExplorerUrl}/cosmos`,
  [chains.CronosChain]: "https://cronoscan.com",
  [chains.Dash]: "https://blockchair.com/dash",
  [chains.Dogecoin]: "https://blockchair.com/dogecoin",
  [chains.Dydx]: `${cosmosExplorerUrl}/dydx`,
  [chains.Ethereum]: "https://etherscan.io",
  [chains.Hyperliquid]: hyperliquidExplorerUrl,
  [chains.Kujira]: "https://finder.kujira.network/kaiyo-1",
  [chains.Litecoin]: "https://blockchair.com/litecoin",
  [chains.Mantle]: "https://explorer.mantle.xyz",
  [chains.MayaChain]: "https://www.explorer.mayachain.info",
  [chains.Noble]: `${cosmosExplorerUrl}/noble`,
  [chains.Optimism]: "https://optimistic.etherscan.io",
  [chains.Osmosis]: `${cosmosExplorerUrl}/osmosis`,
  [chains.Polkadot]: "https://assethub-polkadot.subscan.io",
  [chains.Polygon]: "https://polygonscan.com",
  [chains.Ripple]: "https://xrpscan.com",
  [chains.Sei]: "https://seiscan.io",
  [chains.Solana]: "https://solscan.io",
  [chains.Sui]: "https://suiscan.xyz/mainnet",
  [chains.Terra]: `${cosmosExplorerUrl}/terra`,
  [chains.TerraClassic]: "https://finder.terra.money/classic",
  [chains.THORChain]: "https://thorchain.net",
  [chains.Ton]: "https://tonviewer.com",
  [chains.Tron]: "https://tronscan.org/#",
  [chains.Zcash]: "https://blockexplorer.one/zcash/mainnet",
  [chains.Zksync]: "https://explorer.zksync.io",
};

export type Chain = (typeof chains)[keyof typeof chains];
