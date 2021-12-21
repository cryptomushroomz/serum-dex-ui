import _ from 'lodash'
import { MARKETS } from '@project-serum/serum'
import { DexLabMarketInfo } from '../utils/types'
import { TOKEN_NAMES } from './token-names'
import { DEXLAB_EXTRA_MARKETS } from './dexlab-market-list'

// TODO: 베타 기간동안엔 일부 마켓만 지원 함
export const SWAP_BETA_MARKETS = [
  'DYfigimKWc5VhavR4moPBibx9sMcWYVSjVdWvPztBPTa', // DXL-USDC
  'A8YFbxQYFVqKZaoYJLLUVcQiWP7G2MeEgW5wsAQgMvFw', // BTC-USDC
  '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS', // USDT-USDC
  '4tSvZvnbyzHXLMTiFonMyxZoHmFqau1XArcRCVHLZ5gX', // ETH-USDC
  'E14BKBhDWD4EuTkWj1ooZezesGxMW8LPCps4W5PuzZJo', // FIDA-USDC
  'ByRys5tuUWDgL73G8JBAEfkdFf8JWBzPBDHsBVQ5vbQA', // SRM-USDC
  '2xiv8A5xrJ7RnGdxXB42uFEkYHJjszEhaJyKKt4WaLep', // RAY-USDC
  '97qCB4cAVSTthvJu3eNoEx6AY6DLuRDtCoPm5Tdyg77S', // STEP-USDC
  '2Pbh1CvRVku1TgewMfycemghf6sU9EyuFDcNXqvRmSxc', // FTT-USDC
  'Aubv1QBFh4bwB2wbP1DaPW21YyQBLfgjg8L4PHTaPzRc', // SUNNY-USDC
  'HXBi8YBwbh4TXF6PjVw81m8Z3Cc4WBofvauj5SBFdgUs', // SBR-USDC
  '7qcCo8jqepnjjvB5swP4Afsr3keVBs6gNpBTNubd1Kr2', // YFI-USDC
  'Di66GTLsV64JgCCYGVcY21RZ173BHkjJVgPyezNN7P1K', // ATLAS-USDC
  'HxFLKUAmAMLz1jtT3hbvCMELwH5H9tpM2QugP8sKyfhW', // POLIS-USDC
  '8N1KkhaCYDpj3awD58d85n973EwkpeYnRp84y1kdZpMX', // ORCA-USDC
  'GcoKtAmTy5QyuijXSmJKBtFdt99e6Buza18Js7j9AJ6e', // ALEPH-USDC
  '7gZNLDbWE73ueAoHuAeFoSu7JqmorwCLpNTBXHtYSFTa', // RUN-USDC
  '2Gx3UfV831BAh8uQv1FKSPKS9yajfeeD8GJ4ZNb2o2YP', // SLRS-USDC
  'A1Q9iJDVVS8Wsswr9ajeZugmj64bQVCYLZQLra2TMBMo', // SUSHI-USDC
  '3hwH1txjJVS8qv588tWrjHfRxdqNjBykM1kMcit484up', // LINK-USDC
  '3d4rzwpy9iGdCZvgxcu7B1YocYffVLsQXPXkBZKt2zLc', // MNGO-USDC
  '6fc7v3PmjZG9Lk2XTot6BywGyYLkBQuzuFKd4FpCsPxk', // COPE-USDC
  'FfiqqvJcVL7oCCu8WQUMHLUC2dnHQPAPjTdSzsERFWjb', // MEDIA-USDC
  'FR3SPJmgfRSKKQ2ysUZBu7vJLpzTixXnjzb84bY3Diif', // SAMO-USDC
  // 'DPfj2jYwPaezkCmUNm5SSYfkrkz8WFqwGLcxDDUsN3gA', // SNY-USDC
  '8x8jf7ikJwgP9UthadtiGFgfFuyyyYPHL3obJAuxFWko', // PORT-USDC
  '8GufnKq7YnXKhnB3WNhgy5PzU9uvHbaaRrZWQK6ixPxW', // TULIP-USDC
  // '3WptgZZu34aiDrLMUiPntTYZGNZ72yT1yxHYxSdbTArX', // LIKE-USDC
  // 'Cud48DK2qoxsWNzQeTL5D8sAiHsGwG8Ev1VMNcYLayxt', // FAB-USDC
  // '9cuBrXXSH9Uw51JB9odLqEyeF5RQSeRpcfXbEW2L8X6X', // SYP-USDC
]

export function getAllDexlabMarket(): DexLabMarketInfo[] {
  const marketResults: DexLabMarketInfo[] = []
  SERUM_MARKETS.forEach((market) => {
    const findMarket = findDexlabMarketBySymbol(market.symbol)
    if (findMarket !== undefined) {
      marketResults.push(findMarket)
    }
  })
  marketResults.push(...DEXLAB_EXTRA_MARKETS)
  return marketResults
}

export function findDexlabMarketBySymbol(symbol: string): DexLabMarketInfo | undefined {
  const serumMarket = findSerumMarketBySymbol(symbol)
  if (serumMarket !== undefined) {
    const findQuote = DEXLAB_MARKET_NAMES.find((f) => f.symbol === symbol)
    const findName = DEXLAB_MARKET_NAMES.find((f) => f.symbol.split('/')[0] === symbol.split('/')[0])
    return {
      address: serumMarket?.address,
      programId: serumMarket?.programId,
      nameEn: findName?.nameEn ?? serumMarket?.symbol,
      nameKo: findName?.nameKo ?? serumMarket?.symbol,
      symbol: serumMarket?.symbol,
      icon: findName?.icon,
      quoteLabel: serumMarket?.symbol.split('/')[0],
      baseLabel: serumMarket?.symbol.split('/')[1],
      deprecated: findQuote?.deprecated ?? serumMarket?.deprecated,
      chart: findQuote?.chart ?? false,
      chartType: findQuote?.chartType ?? undefined,
      type: findQuote?.type ?? 'GENERAL',
      isNew: findQuote?.isNew ?? false,
    } as DexLabMarketInfo
  } else {
    return undefined
  }
}

const SERUM_MARKETS: DexLabMarketInfo[] = _.uniqBy(
  MARKETS.filter((f) => !f.deprecated).map((market) => {
    return {
      address: market.address,
      nameEn: market.name.toUpperCase(),
      nameKo: market.name.toUpperCase(),
      symbol: market.name.toUpperCase(),
      icon: null,
      programId: market.programId,
      quoteLabel: market.name.split('/')[0],
      baseLabel: market.name.split('/')[1],
      deprecated: market.deprecated,
      chart: true,
      chartType: undefined,
      type: 'GENERAL',
    } as DexLabMarketInfo
  }),
  'symbol',
)

const DEXLAB_MARKET_NAMES: DexLabMarketInfo[] = TOKEN_NAMES.filter((f) => !f.deprecated).map((market) => {
  const serumMarket = SERUM_MARKETS.find((f) => f.symbol === market.symbol)
  return {
    address: serumMarket?.address,
    programId: serumMarket?.programId,
    nameEn: market.nameEn,
    nameKo: market.nameKo,
    symbol: market.symbol,
    icon: market.icon,
    quoteLabel: market.quoteLabel,
    baseLabel: market.baseLabel,
    deprecated: market.deprecated,
    chart: market.chart,
    chartType: market.chartType,
    type: market.type,
    isNew: market.isNew,
  } as DexLabMarketInfo
})

function findSerumMarketBySymbol(symbol: string): DexLabMarketInfo | undefined {
  return SERUM_MARKETS.find((f) => f.symbol === symbol) ?? undefined
}
