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



export const DEXLAB_API_HOST = 'https://api.dexlab.space'
export const DEXLAB_CHART_API_HOST = 'https://tv-api.dexlab.space'

function getHostUrl() {
  // endpoint 랜덤 배정
  const getEndpointRand = `${DEXLAB_CHART_API_HOST}/v1/volumes/`
}




// const baseUrl = `${DEXLAB_CHART_API_HOST}/v1/trade-history`
export default class ChartApi {
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
        let retryApiHost = `${DEXLAB_API_HOST}/v1/volumes/`
        
        const response = await fetch(retryApiHost + path)
        if (response.ok) {
          const responseJson = await response.json()
          return responseJson.success ? responseJson.data : responseJson ? responseJson : null
        }
      } catch (err) {
        console.log(`Error retry fetching from Chart API ${path}: ${err}`)
      }
    }
    let addresss = "E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA"

    return null
  }


  // 24시간 거래볼륨 조회
  static async getMarketDayVolume(addresss): Promise<VolumeResponse | null> {
    return ChartApi.get(`${addresss}`)
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

export const CHART_DATA_FEED = `${getHostUrl()}/tv`;
