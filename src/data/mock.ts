import { Plugin, Transaction } from "@/utils/types";

export const plugins: Plugin[] = [
  {
    bannerUrl: "",
    categoryId: "app",
    createdAt: "2025-11-09T20:52:36.353238Z",
    description:
      "Automate your long-term investments with the Recurring Swaps app. Securely and automatically convert any Vultisig-supported asset into any other asset on a recurring schedule. Define the asset, amount, and time interval. Your vault executes the schedule without the need for third parties, contracts or bots.",
    email: "",
    id: "vultisig-dca-0000",
    images: [],
    logoUrl:
      "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-dca-0000/logo/819c104d-1f89-4046-a239-d2d1181a52ae.jpg",
    price: "$1.00 USDC / per-tx",
    serverEndpoint: "https://plugin-dca-swap.prod.plugins.vultisig.com",
    status: "active",
    supportedChains: [],
    title: "Recurring Swaps",
  },
  {
    bannerUrl: "",
    categoryId: "app",
    createdAt: "2025-11-09T20:53:00.210327Z",
    description:
      "Fee collection and management system. Track, calculate, and distribute fees across different protocols and services.",
    email: "",
    id: "vultisig-fees-feee",
    images: [],
    logoUrl:
      "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-fees-feee/logo/c7f19b93-8ac1-406d-97a9-48cf206c802d.jpg",
    price: "Free",
    serverEndpoint: "https://plugin-dca-swap.prod.plugins.vultisig.com",
    status: "active",
    supportedChains: [],
    title: "Billing",
  },
  {
    bannerUrl: "",
    categoryId: "app",
    createdAt: "2025-11-24T02:47:46.143176Z",
    description:
      "Automate your outgoing transfers with the Recurring Sends App. Securely schedule recurring payments to any address, for any asset supported in Vultisig. Set the destination, amount, and interval. Your devices approve the setup, and your vault handles the execution automatically.",
    email: "",
    id: "vultisig-recurring-sends-0000",
    images: [],
    logoUrl:
      "https://app-store-vs-prod.sgp1.cdn.digitaloceanspaces.com/plugins/vultisig-recurring-sends-0000/logo/2b37fe78-58f9-46cd-937a-1818e8d770ca.jpg",
    price: "$2.00 USDC / per-tx",
    serverEndpoint: "https://plugin-dca-swap.prod.plugins.vultisig.com",
    status: "pending",
    supportedChains: [],
    title: "Recurring Sends",
  },
];

export const transactions: Transaction[] = [
  {
    amount: "100000000000000",
    appName: "Recurring Sends",
    broadcastedAt: "2026-02-10T13:21:31.766589Z",
    chain: "Arbitrum",
    createdAt: "2026-02-10T13:21:29.491377Z",
    id: "fdaabf47-97b9-4d4a-9409-0379370186d1",
    pluginId: "vultisig-recurring-sends-0000",
    policyId: "317f0015-707e-45be-9829-90bb095bb003",
    publicKey:
      "03b42848682608ebb3385a2743a0006bee52bbd07b7f56a04b6036c4c812c23f1c",
    status: "SIGNED",
    statusOnchain: "SUCCESS",
    tokenId: "",
    toPublicKey: "0x0bd442356896e0cdfC436237e6b92a9A7feF3Fe6",
    txHash:
      "0x5300d89179458fcc057c061ffe03cc3fe57756ac53ebb74805d3774b1fc967a8",
    updatedAt: "2026-02-10T13:21:39.829279Z",
  },
  {
    amount: "100000000000000",
    appName: "Recurring Sends",
    broadcastedAt: "2026-02-08T20:27:12.332353Z",
    chain: "Arbitrum",
    createdAt: "2026-02-08T20:27:10.009395Z",
    id: "451a58ef-cdb1-4c1f-bef7-62f597ddfcd8",
    pluginId: "vultisig-recurring-sends-0000",
    policyId: "3e7c4332-6fda-4ffc-beae-b0b0bbf9a3f3",
    publicKey:
      "03b42848682608ebb3385a2743a0006bee52bbd07b7f56a04b6036c4c812c23f1c",
    status: "SIGNED",
    statusOnchain: "SUCCESS",
    tokenId: "",
    toPublicKey: "0x0bd442356896e0cdfC436237e6b92a9A7feF3Fe6",
    txHash:
      "0xd3d9d41517a2d7ad751489d4a17acc325242f093dc50e8f72914fd838c1fecf6",
    updatedAt: "2026-02-08T20:27:17.369903Z",
  },
  {
    amount: "10000",
    appName: "Recurring Swaps",
    broadcastedAt: "2026-01-05T10:12:28.621438Z",
    chain: "Ethereum",
    createdAt: "2026-01-05T10:12:18.01092Z",
    id: "f81a2fa9-fa9d-4cc0-91df-383370a69f7e",
    pluginId: "vultisig-dca-0000",
    policyId: "e8cf7ad9-c604-493d-96a7-9f61cbd0e4b4",
    publicKey:
      "03b42848682608ebb3385a2743a0006bee52bbd07b7f56a04b6036c4c812c23f1c",
    status: "SIGNED",
    statusOnchain: "PENDING",
    tokenId: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    toPublicKey: "0x0bd442356896e0cdfC436237e6b92a9A7feF3Fe6",
    txHash:
      "0xa0e9b5c1e9d19514a8470c195c3c041bf5891ae5ccc993e7a25b1a8d7fe29c76",
    updatedAt: "2026-01-05T13:12:31.482922Z",
  },
  {
    appName: "Recurring Swaps",
    broadcastedAt: "2025-12-30T08:36:34.099787Z",
    chain: "Arbitrum",
    createdAt: "2025-12-30T08:36:30.850115Z",
    id: "f6fbb2da-8715-4ef8-9405-ec57eee6c127",
    pluginId: "vultisig-dca-0000",
    policyId: "f73e03fa-4920-4ea7-b745-ab4f34145c78",
    publicKey:
      "03b42848682608ebb3385a2743a0006bee52bbd07b7f56a04b6036c4c812c23f1c",
    status: "SIGNED",
    statusOnchain: "PENDING",
    tokenId: "",
    toPublicKey: "",
    txHash:
      "0x7d201b6ddbc213677a771f3f7a839f7cd220b3ac49c0b6a7726d9fa9cdd7ed45",
    updatedAt: "2025-12-30T08:36:41.021817Z",
  },
  {
    appName: "Recurring Swaps",
    broadcastedAt: "2025-12-29T15:14:16.796894Z",
    chain: "Ethereum",
    createdAt: "2025-12-29T15:14:12.833492Z",
    id: "63f5068a-a97a-454d-936f-17e2a2071f2e",
    pluginId: "vultisig-dca-0000",
    policyId: "d4da09c0-2521-474b-a604-daae8fa11a52",
    publicKey:
      "03b42848682608ebb3385a2743a0006bee52bbd07b7f56a04b6036c4c812c23f1c",
    status: "SIGNED",
    statusOnchain: "PENDING",
    tokenId: "",
    toPublicKey: "",
    txHash:
      "0xc0b4bb143e8e4c909ce3e3ece998838eeb25aa124119596fd98d2eb41fae812f",
    updatedAt: "2025-12-29T18:14:26.427601Z",
  },
  {
    appName: "Recurring Swaps",
    broadcastedAt: "2025-12-14T13:36:25.454988Z",
    chain: "Ethereum",
    createdAt: "2025-12-14T13:36:21.591258Z",
    id: "fb63232b-0b17-4903-ad12-2ab168f1af53",
    pluginId: "vultisig-dca-0000",
    policyId: "bd3e45ca-5bce-4762-bd6b-52cf174e45e9",
    publicKey:
      "03b42848682608ebb3385a2743a0006bee52bbd07b7f56a04b6036c4c812c23f1c",
    status: "SIGNED",
    statusOnchain: "SUCCESS",
    tokenId: "",
    toPublicKey: "",
    txHash:
      "0xee6dbbbb2c1a9b0777b9e0f77389657c644e2716ecdb68eb88412b0aea64faf8",
    updatedAt: "2025-12-14T13:36:40.124528Z",
  },
];
