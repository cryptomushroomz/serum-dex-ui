import { DexLabClosingPrice, DexLabMarketV2Info, DexLabHourPrice } from './../types'


export const DEXLAB_API_HOST = 'https://api.dexlab.space'


export default class DexLabApi {
  static URL: string = `${DEXLAB_API_HOST}/`

  static async get(path: string) {
    try {
      const response = await fetch(this.URL + path)
      if (response.ok) {
        const responseJson = await response.json()
        return responseJson.success ? responseJson.data : null
      }
    } catch (err) {
      console.log(`Error fetching from DexLabApi API ${path}: ${err}`)
    }
    return null
  }

  static async getBody(path: string, body: any) {
    try {
      const response = await fetch(this.URL + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        const responseJson = await response.json()
        return responseJson.success ? responseJson.data : null
      }
    } catch (err) {
      console.log(`Error fetching from DexLabApi API ${path}: ${err}`)
    }
    return null
  }

  static async getMarketCurrent24hPrice(marketAddress): Promise<DexLabClosingPrice | null> {
    return DexLabApi.get(`v1/prices/${marketAddress}/closing-price`)
  }

  static async getMarketLastPriceForUsdc(symbol): Promise<DexLabClosingPrice | null> {
    return DexLabApi.get(`v1/prices/${symbol}/last-usdc`)
  }

  static async retryGetAllMarketsV2(): Promise<DexLabMarketV2Info[] | null> {
    return DexLabApi.get(`v2/markets?summary=Y`)
  }

  static async getMarketHourPriceByAddress(address): Promise<DexLabHourPrice[] | null> {
    return DexLabApi.get(`v1/prices/hour/${address}`)
  }
}
