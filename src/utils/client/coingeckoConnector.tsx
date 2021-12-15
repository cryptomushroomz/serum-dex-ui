export default class CoingeckoApi {
  static URL: string = 'https://api.coingecko.com/api/v3/coins/'

  static async get(path: string) {
    try {
      const response = await fetch(this.URL + path)
      if (response.ok) {
        return response.json()
      }
    } catch (err) {
      console.log(`Error CoingeckoApi API ${path}: ${err}`)
    }
    return null
  }

  static async getTokenPrice(coingeckoId): Promise<any | null> {
    return CoingeckoApi.get(`${coingeckoId}?tickers=false&community_data=false&developer_data=false&sparkline=false`)
  }
}
