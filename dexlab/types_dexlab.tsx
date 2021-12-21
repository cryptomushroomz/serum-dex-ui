import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import { WalletAdapter } from '../wallet-adapters'
import { Market, OpenOrders } from '@project-serum/serum'
import { Event } from '@project-serum/serum/lib/queue'
import { Order } from '@project-serum/serum/lib/market'

export const CURRENCY_KEY = 'currency_v2'
export const PROJECT_COMMUNITY_HOMEPAGE_KEY = 'HOMEPAGE'
export const PROJECT_COMMUNITY_TWITTER_KEY = 'TWITTER'

export interface ConnectionContextValues {
  endpoint: string
  setEndpoint: (newEndpoint: string) => void
  connection: Connection
  sendConnection: Connection
  dexlabRpcConnection: Connection
  dexlabRpcSendConnection: Connection
  availableEndpoints: EndpointInfo[]
  setCustomEndpoints: (newCustomEndpoints: EndpointInfo[]) => void
}

export interface WalletContextValues {
  wallet: WalletAdapter | undefined
  connected: boolean
  providerUrl: string
  setProviderUrl: (newProviderUrl: string) => void
  providerName: string
  select: () => void
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

export interface SerumMarketInfo {
  address: PublicKey
  name: string
  programId: PublicKey
  deprecated: boolean
  quoteLabel?: string
  baseLabel?: string
}

export interface MarketTableInfo {
  id: number
  address: PublicKey
  name: string
  subSymbolPrefix?: string
  base: string
  baseMint: string
  quote: string
  symbol: string
  iconUrl: string
  nftImageUrl?: string
  programId: PublicKey
  deprecated: boolean
  priceText: string
  priceTextHtml: any
  postion: number
  newPrice?: number
  oldPrice?: number
  isNew: boolean
  source: string
  orderType: string
  volume: number
  lowPrice: number
  highPrice: number
  hourSummary: any
}

export interface CustomMarketInfo {
  address: string
  name: string
  programId: string
  quoteLabel?: string
  baseLabel?: string
}

export interface FullMarketV2Info {
  address?: PublicKey
  name?: string
  programId?: PublicKey
  deprecated?: boolean
  quoteLabel?: string
  baseLabel?: string
  marketName?: string
  baseCurrency?: string
  quoteCurrency?: string
  marketInfo?: DexLabMarketV2Info
}

export interface FullMarketInfo {
  address?: PublicKey
  name?: string
  programId?: PublicKey
  deprecated?: boolean
  quoteLabel?: string
  baseLabel?: string
  marketName?: string
  baseCurrency?: string
  quoteCurrency?: string
  marketInfo?: DexLabMarketInfo
}

export interface MarketContextValues extends FullMarketInfo {
  market: Market | undefined | null
  setMarketAddress: (newMarketAddress: string) => void
  customMarkets: CustomMarketInfo[]
  setCustomMarkets: (newCustomMarkets: CustomMarketInfo[]) => void
}

export interface MarketV2ContextValues extends FullMarketV2Info {
  market: Market | undefined | null
  setMarketAddress: (newMarketAddress: string) => void
}

export interface TokenAccount {
  pubkey: PublicKey
  account: AccountInfo<Buffer> | null
  effectiveMint: PublicKey
}

export interface Trade extends Event {
  side: string
  price: number
  feeCost: number
  size: number
}

export interface OrderWithMarket extends Order {
  marketName: string
}

export interface OrderWithMarketAndMarketName extends Order {
  market: Market
  marketName: string | undefined
}

interface BalancesBase {
  key: string
  coin: string
  wallet?: number | null | undefined
  orders?: number | null | undefined
  openOrders?: OpenOrders | null | undefined
  unsettled?: number | null | undefined
}

export interface Balances extends BalancesBase {
  market?: Market | null | undefined
}

export interface OpenOrdersBalances extends BalancesBase {
  market?: string | null | undefined
  baseCurrencyAccount: { pubkey: PublicKey; account: AccountInfo<Buffer> } | null | undefined
  quoteCurrencyAccount: { pubkey: PublicKey; account: AccountInfo<Buffer> } | null | undefined
}

export interface DeprecatedOpenOrdersBalances extends BalancesBase {
  market: Market | null | undefined
  marketName: string | null | undefined
}

export interface PreferencesContextValues {
  autoSettleEnabled: boolean
  setAutoSettleEnabled: (newAutoSettleEnabled: boolean) => void
}

export interface EndpointInfo {
  name: string
  endpoint: string
  custom: boolean
}

/**
 * {tokenMint: preferred token account's base58 encoded public key}
 */
export interface SelectedTokenAccounts {
  [tokenMint: string]: string
}

export interface TradeHistory {
  market: string
  size: number
  price: number
  time: number
  side: string
  marketAddress: string
}

export interface BonfidaPriceHistory {
  market: string
  close: number
  open: number
  low: number
  high: number
  startTime: number
  volumeBase: number
  volumeQuote: number
}

export interface DexLabVolume {
  marketName: string
  address: number
  programId: number
  summary: DexLabVolumeSummary
  last24hOrder: DexLabVolumeLast24hOrder
}

export interface DexLabVolumeSummary {
  totalVolume: number
  sellVolume: number
  buyVolume: number
  highPrice: number
  lowPrice: number
}

export interface DexLabVolumeLast24hOrder {
  exist: boolean
  time?: string
  price?: number
  percent?: number
}

export interface CurrencyDetail {
  id: number
  name: string
  standardType: string
  type: string
  provider: string
  lowPrice: number
  highPrice: number
  createdAt: string
}

// Dexlab batch API
export interface DexLabRecentPrice {
  market: string
  marketAddress: string
  closePrice: string
  price: string
  changePrice: number
  percent: string
}

export interface DexLabClosingPrice {
  market: string
  price: string
  time: string
  marketMddress: string
}

export interface DexlabIdoMarket {
  id: string
  name: string
  logoUrl?: string
  desc?: string
  website?: string
  image?: string
  mint: string
  baseTokenMint: string
  quoteTokenMint: string
  depositAddress: string
  unitSalePriceUsd: number
  base: string
  quote: string
  minQuantity: number
  maxQuantity: number
  saleQuantity: number
  availableQuantity: number
  totalAvailableQuantity: number
  saleType: IdoSaleType
  participants: number
  withdrawType: WithdrawType
  withdrawDate?: string
  winnerAnnouncementDate?: string
  startDate: string
  endDate: string
  stage: number
  saleStatus: EventSaleStatus
}

export interface DexlabIdoMarketDetail {
  id: string
  name: string
  logoUrl?: string
  image?: string
  desc?: string
  website?: string
  community?: any[]
  depositAddress: string
  base: string
  baseTokenDecimals: number
  quoteTokenDecimals: number
  quote: string
  minQuantity: number
  maxQuantity: number
  purchaseQuantity: number
  saleQuantity: number
  availableQuantity: number
  totalAvailableQuantity: number
  winnerAnnouncementDate?: string
  startDate: string
  endDate: string
  participants: number
  baseTokenMint: string
  quoteTokenMint: string
  ownerAvailableQuantity: number
  baseMintSupply: number
  withdrawType: string
  withdrawDate?: string
  withdrawMessage?: string
  coingeckoId?: string
  whitelistInfo?: DexlabIdoWhitelistInfo
  saleType: IdoSaleType
  saleStatus: EventSaleStatus
}

export interface DexlabIdoWhitelistInfo {
  whitelistId: string
  name: string
  progress: boolean
  participation: boolean
  startDate: string
  endDate: string
}

export interface DexlabIdoMarketTransactionResponse {
  txId: string
  base: string
  quote: string
  ownerPublicKey: string
  amount: number
  withdrawBaseTokenAmount: number
  externalId: string
  createdAt: string
}

export interface PreOrderRequest {
  ownerPublicKey: string
  amount: number
}

export interface PreOrderUpdateRequest {
  ownerPublicKey: string
  orderId: string
  txId: string
}

export interface PreOrderResponse {
  marketId: string
  orderId: string
  base: string
  quote: string
  amount: string
  quoteUsdtPrice: string
  status: SaleOrderStatus
  createdAt: string
}

export interface ChartTradeType {
  market: string
  size: number
  price: number
  orderId: string
  time: number
  side: string
  feeCost: number
  marketAddress: string
}

export type OrderConfirmRequest = {
  txId: string
  marketId: string
  ownerPublicKey: string
}

export type OrderConfirmResponse = {
  marketId: string
  orderId: string
  base: string
  quote: string
  amount: string
  txId: string
  expectedQuoteAmount: string
  txAmount: string
  status: SaleOrderStatus
  createdAt: string
}

export type MyOrderItemResponse = {
  orderId: string
  marketId: string
  name: string
  logoUrl: string
  base: string
  quote: string
  withdrawStatus: string
  withdrawMessage?: string
  withdrawTokenWalletAddress: string
  withdrawBaseTokenAmount: string
  depositCompletedTxid?: string
  depositCompletedDate?: string
  depositCompleted: boolean
  status: SaleOrderStatus
  createdAt: string
}

export type MyOrderDetailResponse = {
  orderId: string
  marketId: string
  name: string
  logoUrl: string
  base: string
  txAmount: number
  quote: string
  saleTxId?: string
  withdrawTokenWalletAddress: string
  withdrawBaseTokenAmount: number
  withdrawType: string
  withdrawDate?: string
  withdrawMessage?: string
  depositCompletedTxid?: string
  depositCompletedDate?: string
  depositCompleted: boolean
  status: SaleOrderStatus
  createdAt: string
}

export type MyIdoWhitelistResponse = {
  walletAddress: string
  isKycCertification: boolean
  stage: number
  market: MyIdoWhitelistMarket
  kyc: DexlabKycInfoResponse
}

export type MyIdoWhitelistMarket = {
  name: string
  logoUrl: string
  externalId: string
  base: string
  baseTokenMint: string
  quote: string
  quoteTokenMint: string
  minQuantity: number
  maxQuantity: number
  startDate: string
  endDate: string
}

export type DexlabIdoFaqResponse = {
  question: string
  answer: string
}

export type DexlabErrorResponse = {
  success: boolean
  code: string
  message: string
}

export type DexlabIdoClaimResponse = {
  orderId: string
  ownerPublicKey: string
  marketId: string
  txId?: string
  withdrawWalletAddress: string
  withdrawAmount: number
  withdrawToken: string
  withdrawTokenAddress: string
  depositStatus: string
}

export type DexlabRequestKycResponse = {
  walletAddress: string
  isKycCertification: boolean
  isLivenessValid: boolean
  isIdentityValid: boolean
  isPhoneValid: boolean
}

export type DexlabKycInfoResponse = {
  isIdentityValid: boolean
  isPhoneValid: boolean
  isLivenessValid: boolean
  isKycCertification: boolean
}

export type DexlabMarketResponse = {
  source: string
  projectName?: string
  iconUrl?: string
  name: string
  address: string
  programId: string
  base: string
  baseMint: string
  quote: string
  quoteMint: string
}

export type DexlabMarketVolumeResponse = {
  market: string
  size: number
  price: number
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
  summary: DexLabMarketV2Summary
  hourSummary?: DexlabHourV2Summary
  tvWidgetChartSymbol?: string
  isChart: boolean
  isNew: boolean
  isDexlabChart: boolean
  source: string
  enable: boolean
}

export interface DexlabHourV2Summary {
  address: string
  name: string
  newPrice: string
  oldPrice: string
  marketPrice: string
}

export interface DexLabHourPrice {
  market: string
  price: string
  time: string
  marketAddress: string
}

export type DexlabMarketLpPoonInfo = {
  name: string
  ammId: string
  market: string
  liquidity: number
  volume: number
  volumeQuote: number
  apy: number
  official: boolean
  pool: string
}

export type DexLabMarketV2Summary = {
  highPrice: number
  lowPrice: number
  volume: number
}

export type DexlabInitMarketRequest = {
  ownerWalletAddress: string
  base: string
  baseMint: string
  baseLotSize: string
  quote: string
  quoteMint: string
  quoteLotSize: string
  address?: string
  mainCategory: MainCategoryEnum
  subCategory: SubCategoryEnum
  nameEn: string
  nameCn?: string
  nameKr?: string
  descriptionEn?: string
  descriptionCn?: string
  descriptionKr?: string
  iconUrl: string
  community: any[]
}

export type DexlabInitMarketResponse = {
  id: string
  ownerWalletAddress: string
  dexMarketId?: number
  address?: string
  programId: string
  base: string
  baseMint: string
  baseLotSize: string
  quote: string
  quoteMint: string
  quoteLotSize: string
  nameEn: string
  nameCn?: string
  nameKr?: string
  descriptionEn?: string
  descriptionCn?: string
  descriptionKr?: string
  iconUrl?: string
  community?: any[]
  tier: DexMarketTierEnum
  inspectionType: InspectionTypeEnum
  inspectionStatus: InspectionStatus
  updatedAt?: Date
  createdAt?: Date
}

export type DexlabInitMarketConfirmRequest = {
  txId: string
  ownerWalletAddress: string
  type: 'NEW' | 'ADD'
}

export type DexlabInitMarketConfirmResponse = {
  createId: string
  txId: string
}

export type DexlabMyApplyWhitelistResponse = {
  walletAddress: string
  dxlQuantity: number
  dxlQuantityText?: string
  whitelist: DexlabMyApplyWhitelistInfo
  dailySnapshots: DexlabMyApplyWhitelistItem[]
  createdAt: string
}

export type DexlabMyApplyWhitelistInfo = {
  id: string
  name: string
  startDate: string
  endDate: string
}

export type DexlabWhitelistApplyHistoryResponse = {
  id: string
  walletAddress: string
  applyDate: string
}

export type DexlabMyApplyWhitelistItem = {
  date: string
  avgDxlQuantity: number
  avgDxlQuantityText: string
}

export type DexlabWhitelistRankResponse = {
  rankDateTime: string
  ranks: DexlabWhitelistRankItem[]
}

export type DexlabWhitelistRankItem = {
  rankNo: number
  previousRank: string
  walletAddress: string
  avgDxlQuantity: number
}

export enum InspectionTypeEnum {
  CREATE = 'CREATE',
  MODIFY = 'MODIFY',
}

export enum DexMarketTierEnum {
  MAIN_LISTING = 'MAIN_LISTING',
  UNVERIFIED_LISTING = 'UNVERIFIED_LISTING',
  ANONYMOUS = 'ANONYMOUS',
}

export enum InspectionStatus {
  REQUEST = 'REQUEST',
  FIRST_CONFIRMED = 'FIRST_CONFIRMED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
}

export enum SaleOrderStatus {
  PRE_ORDER = 'PRE_ORDER',
  PENDING = 'PENDING',
  RETRY_TXID_CONFIRM = 'RETRY_TXID_CONFIRM',
  FAIL = 'FAIL',
  PROCEEDING = 'PROCEEDING',
  COMPLETE = 'COMPLETE',
  CANCEL_WAITING = 'CANCEL_WAITING',
}

export enum EventSaleStatus {
  ON_SALE = 'ON_SALE',
  UP_COMING = 'UP_COMING',
  END_SALE = 'END_SALE',
  WHITELIST_UP_COMING = 'WHITELIST_UP_COMING',
  WHITELIST_PROGRESS = 'WHITELIST_PROGRESS',
}

export enum WithdrawType {
  REAL_TIME = 'REAL_TIME',
  DESIGNATED_DATE = 'DESIGNATED_DATE',
  TO_BE = 'TO_BE',
}

export enum IdoSaleType {
  PUBLIC = 'PUBLIC',
  WHITELIST = 'WHITELIST',
  WHITELIST_LOTTERY = 'WHITELIST_LOTTERY',
  WHITELIST_RANK = 'WHITELIST_RANK',
  AIRDROP_EVENT = 'AIRDROP_EVENT',
}

export enum MainCategoryEnum {
  GENERAL = 'GENERAL',
  MEME = 'MEME',
  NFT = 'NFT',
  DEX = 'DEX',
  MANAGEMENT = 'MANAGEMENT',
  POOL = 'POOL',
  ETC = 'ETC',
}

export enum SubCategoryEnum {
  GENERAL = 'GENERAL',
  DEFI = 'DEFI',
  GAME = 'GAME',
  FINANCE = 'FINANCE',
  ENERGY = 'ENERGY',
  GAMBLING = 'GAMBLING',
  COMMERCE = 'COMMERCE',
  IOT = 'IOT',
  AMM = 'AMM',
  MEDIA = 'MEDIA',
  HEALTH = 'HEALTH',
  LENDING = 'LENDING',
  INDEX = 'INDEX',
  FARMING = 'FARMING',
  ETC = 'ETC',
}

export function withdrawTypeText(type: WithdrawType) {
  if (type === WithdrawType.REAL_TIME) {
    return 'Send right away'
  } else if (type === WithdrawType.DESIGNATED_DATE) {
    return 'Designated date'
  } else if (type === WithdrawType.TO_BE) {
    return 'Channel Announcement'
  } else {
    return 'Channel Announcement'
  }
}
