import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { Market, OpenOrders } from '@project-serum/serum';
import { Event } from '@project-serum/serum/lib/queue';
import { Order } from '@project-serum/serum/lib/market';
import { WalletAdapter } from '../wallet-adapters';
export const CURRENCY_KEY = 'currency_v2'
export const PROJECT_COMMUNITY_HOMEPAGE_KEY = 'HOMEPAGE'
export const PROJECT_COMMUNITY_TWITTER_KEY = 'TWITTER'

export interface ConnectionContextValues {
  endpoint: string;
  setEndpoint: (newEndpoint: string) => void;
  connection: Connection;
  sendConnection: Connection;
  availableEndpoints: EndpointInfo[];
  setCustomEndpoints: (newCustomEndpoints: EndpointInfo[]) => void;
}

export interface WalletContextValues {
  wallet: WalletAdapter | undefined;
  connected: boolean;
  providerUrl: string;
  setProviderUrl: (newProviderUrl: string) => void;
  providerName: string;
  select: () => void;
}

export interface VolumeResponse  {
  volumeUsd: number
  volume: number
  
}

export interface HistResponse {
  close: number
  open: number
  low: number
  high: number
  startTime: string
  market: string
  volumeBase: number
  volumeQuote: number
}

export interface DexLabMarketInfo {
  address: PublicKey
  nameEn: string
  nameKo: string
  symbol: string
  icon: any
  nftImageUrl?: string
  programId: PublicKey
  quoteLabel: string
  baseLabel: string
  deprecated: boolean
  chart: boolean
  chartType?: string | undefined
  type: string
  isNew: boolean
}

export interface MarketInfo {
  address: PublicKey
  name: string
  programId: PublicKey
  deprecated: boolean
  quoteLabel?: string
  baseLabel?: string
}

export interface CustomMarketInfo {
  address: string;
  name: string;
  programId: string;
  quoteLabel?: string;
  baseLabel?: string;
}

export interface FullMarketInfo {
  address?: PublicKey;
  name?: string;
  programId?: PublicKey;
  deprecated?: boolean;
  quoteLabel?: string;
  baseLabel?: string;
  marketName?: string;
  baseCurrency?: string;
  quoteCurrency?: string;
  marketInfo?: MarketInfo;
}

export interface MarketContextValues extends FullMarketInfo {
  market: Market | undefined | null;
  setMarketAddress: (newMarketAddress: string) => void;
  customMarkets: CustomMarketInfo[];
  setCustomMarkets: (newCustomMarkets: CustomMarketInfo[]) => void;
}

export interface TokenAccount {
  pubkey: PublicKey;
  account: AccountInfo<Buffer> | null;
  effectiveMint: PublicKey;
}

export interface Trade extends Event {
  side: string;
  price: number;
  feeCost: number;
  size: number;
}

export interface OrderWithMarket extends Order {
  marketName: string;
}

export interface OrderWithMarketAndMarketName extends Order {
  market: Market;
  marketName: string | undefined;
}

interface BalancesBase {
  key: string;
  coin: string;
  wallet?: number | null | undefined;
  orders?: number | null | undefined;
  openOrders?: OpenOrders | null | undefined;
  unsettled?: number | null | undefined;
}

export interface Balances extends BalancesBase {
  market?: Market | null | undefined;
}

export interface OpenOrdersBalances extends BalancesBase {
  market?: string | null | undefined;
  baseCurrencyAccount:
    | { pubkey: PublicKey; account: AccountInfo<Buffer> }
    | null
    | undefined;
  quoteCurrencyAccount:
    | { pubkey: PublicKey; account: AccountInfo<Buffer> }
    | null
    | undefined;
}

export interface DeprecatedOpenOrdersBalances extends BalancesBase {
  market: Market | null | undefined;
  marketName: string | null | undefined;
}

export interface PreferencesContextValues {
  autoSettleEnabled: boolean;
  setAutoSettleEnabled: (newAutoSettleEnabled: boolean) => void;
}

export interface EndpointInfo {
  name: string;
  endpoint: string;
  custom: boolean;
}

/**
 * {tokenMint: preferred token account's base58 encoded public key}
 */
export interface SelectedTokenAccounts {
  [tokenMint: string]: string;
}

export interface BonfidaTrade {
  market: string;
  size: number;
  price: number
  orderId: string;
  time: number;
  side: string;
  feeCost: number;
  marketAddress: string;
}

export interface DexLabClosingPrice {
  market: string
  price: string
  time: string
  marketMddress: string
}

export type DexLabMarketV2Info = {
  address: string
  programId: string
  subSymbolPrefix?: string
  base: string
  baseMint: string
  quote: string
  quoteMint: string
  symbol: string
  mainCategory: string
  subCategory: string
  nameEn: string
  nameCn?: string
  nameKr?: string
  descriptionEn?: string
  descriptionCn?: string
  descriptionKr?: string
  iconUrl: string
  nftImageUrl?: string
  community?: string
  owner?: string
  chartType: string
  orderType: string
  summary: string
  hourSummary?: string
  tvWidgetChartSymbol?: string
  isChart: boolean
  isNew: boolean
  isDexlabChart: boolean
  source: string
  enable: boolean
}
export interface DexLabHourPrice {
  market: string
  price: string
  time: string
  marketAddress: string
}
