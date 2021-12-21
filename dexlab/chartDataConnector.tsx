import { ChartTradeType, DexlabMarketVolumeResponse, TradeHistory } from '../types'
import { DEXLAB_CHART_API_HOST, DEXLAB_CHART_API_BACKUP_HOST } from '../../application'

function getHostUrl() {
  // endpoint 랜덤 배정
  const getEndpointRand = Math.random()
  if (getEndpointRand < 0.5) {
    return `${DEXLAB_CHART_API_HOST}/v1/trade-history`
  } else {
    return `${DEXLAB_CHART_API_BACKUP_HOST}/v1/trade-history`
  }
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
    } catch (err: any) {
      console.log(`Error fetching from Chart API ${path}: ${err}`)
      isError = true
    }

    if (isError) {
      try {
        let retryApiHost = `${DEXLAB_CHART_API_HOST}/v1/trade-history/`
        if (retryApiHost === `${DEXLAB_CHART_API_HOST}/v1/trade-history/`) {
          retryApiHost = `${DEXLAB_CHART_API_BACKUP_HOST}/v1/trade-history/`
        }
        const response = await fetch(retryApiHost + path)
        if (response.ok) {
          const responseJson = await response.json()
          return responseJson.success ? responseJson.data : responseJson ? responseJson : null
        }
      } catch (err: any) {
        console.log(`Error retry fetching from Chart API ${path}: ${err}`)
      }
    }

    return null
  }

  // 24시간 거래볼륨 조회
  static async getMarkeyDayVolume(market): Promise<DexlabMarketVolumeResponse | null> {
    return ChartApi.get(`volume?symbol=${market}`)
  }

  // 마켓 히스토리 조회
  static async getMarketTradeHistory(marketAddress: string): Promise<TradeHistory[] | null> {
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
  }
}

export const CHART_DATA_FEED = `${getHostUrl()}/tv`
