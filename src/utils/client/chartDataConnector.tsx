import { VolumeResponse } from '../types'
import {
  useMarket,
  useOrderbook,
  useMarkPrice,
  useSelectedTokenAccounts,
  MarketProvider,
  getTradePageUrl,
  getTokenSymbolImageUrl
} from '../markets';
import {Market, MARKETS, OpenOrders, Orderbook, TOKEN_MINTS, TokenInstructions,} from '@project-serum/serum';



export const BONFIDA_API_HOST = 'https://serum-api.bonfida.com'


function getHostUrl() {
  // endpoint 랜덤 배정
  const getEndpointRand = Math.random()
  if (getEndpointRand < 0.5) {
    return `${BONFIDA_API_HOST}`
  } else {
    return `${BONFIDA_API_HOST}`
  }
}


export default class HistoryApi {
  static URL = `${getHostUrl()}/`



  static async get(path: string) {
    let isError = false
    try {
      const response = await fetch(this.URL + path)
      if (response.ok) {
        const responseJson = await response.json()
        return responseJson.success ? responseJson.data : responseJson ? responseJson : null
      }
    } catch (err) {
      console.log(`Error fetching from Chart API ${path}: ${err}`)
      isError = true
    }

    if (isError) {
      try {
        let retryApiHost = `${BONFIDA_API_HOST}/`
        if (retryApiHost === `${BONFIDA_API_HOST}/`) {
          retryApiHost = `${BONFIDA_API_HOST}/`
        }
        const response = await fetch(retryApiHost + path)
        if (response.ok) {
          const responseJson = await response.json()
          return responseJson.success ? responseJson.data : responseJson ? responseJson : null
        }
      } catch (err) {
        console.log(`Error retry fetching from Chart API ${path}: ${err}`)
      }
    }

    return null
  }

  // 24시간 거래볼륨 조회
  static async getMarketDayVolume(market): Promise<VolumeResponse[] | null> {
    return HistoryApi.get(`volumes/${market}`)
  }

  // 마켓 히스토리 조회
  /*static async getMarketTradeHistory(marketAddress: string): Promise<TradeHistory[] | null> {
    return ChartApi.get(`${marketAddress}`)
  }

  static async getRecentTrades(marketAddress: string): Promise<ChartTradeType[] | null> {
    return ChartApi.get(`trades/address/${marketAddress}`)
  }

  static async getOhlcv(
    symbol: string,
    resolution: string,
    from: number,
    to: number,
  ): Promise<ChartTradeType[] | null> {
    return ChartApi.get(`tv/history?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`)
  }*/
}


