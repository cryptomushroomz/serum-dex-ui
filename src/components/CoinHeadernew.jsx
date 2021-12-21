import { Col, Row, Divider, Span, Avatar, Tooltip } from 'antd';
import React, {
  useRef,
  useEffect,
  useState,
  useLocation,
  useHistory,
} from 'react';
import {
  useMarket,
  useOrderbook,
  useMarkPrice,
  useSelectedTokenAccounts,
  MarketProvider,
  getTradePageUrl,
  getTokenSymbolImageUrl,
} from '../utils/markets';
import {
  isEqual,
  getDecimalCount,
  useLocalStorageStringState,
} from '../utils/utils';
import { useInterval } from '../utils/useInterval';
import FloatingElement from './layout/FloatingElement';
import usePrevious from '../utils/usePrevious';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CaretDownFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import StandaloneBalancesDisplay from './StandaloneBalancesDisplay';
import { MarketSelector } from '../pages/TradePage';
import { getMarketInfos } from '../utils/markets';
import shroomz from '../assets/shroomz.png';
import kitty from '../assets/kitty.png';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  styled,
  alpha,
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import Box from '@mui/material/Box';
import { TokenAccount, FullMarketInfo } from '../utils/types';
import { numberWithCommas, calcCurrencyPrice } from '../utils/shroomz-utils';
import { useTranslation } from 'react-i18next';
import CoingeckoApi from '../utils/client/coingeckoConnector';
import HistoryApi from '../utils/client/chartDataConnector';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function CoinHeader() {
  const markPrice = useMarkPrice();
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const previousMarkPrice = usePrevious(markPrice);
  let markPriceColor =
    markPrice > previousMarkPrice
      ? '#41C77A'
      : markPrice < previousMarkPrice
      ? '#F23B69'
      : 'white';
  let formattedMarkPrice =
    markPrice &&
    market?.tickSize &&
    markPrice.toFixed(getDecimalCount(market.tickSize));

  let coinname;
  const marketAddress = market?.address.toBase58();
  const addy = marketAddress;
  const mintAddress = market?.baseMintAddress.toBase58();

  if (addy == 'E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA') {
    //avatar = shroomz;
    coinname = 'CryptoMushroomz';
  } else if (addy == 'FAHa34qbNbvtEBHgjuALk4WLJMwxJTtV6Z3V3p79XLWG') {
    //avatar = kitty;
    coinname = 'Kitty Coin';
  }

  const [coingeckoPrice, setCoingeckoPrice] = useState(undefined);
  const [marketDayVolume, setMarketDayVolume] = useState({
    market: `${baseCurrency}/${quoteCurrency}`,
    price: 0,
    size: 0,
    summary: 0,
  });
  const { t: trText, i18n } = useTranslation();

  let lowPrice = 0;
  let highPrice = 0;
  let volume = 0;
  lowPrice = marketDayVolume?.summary?.lowPrice;
  highPrice = marketDayVolume?.summary?.highPrice;
  volume = marketDayVolume?.summary?.totalVolume;

  let avatar = `https://github.com/solana-labs/token-list/blob/main/assets/mainnet/${mintAddress}/logo.png?raw=true`;
  let tickSize = market?.tickSize && getDecimalCount(market.tickSize);

  async function getDayVolume() {
    const response = await HistoryApi.getMarketDayVolume(marketAddress);
    if (response) {
      setMarketDayVolume(response);
    }
  }

  //let volumebuf = 0;
  //if  (marketDayVolume>= 0){
  //  volumebuf = marketDayVolume.summary.totalVolume
  //}

  useInterval(() => {
    getDayVolume();
  }, 10000);

  // 최초 1회 실행
  useEffect(() => {
    getDayVolume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <Card style={{ margin: '10px' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
            ></Typography>
            <div className="card-body">
              <div className="row">
                <div
                  className="col-xl-12 col-lg-12 col-md-12 col-xxl-12"
                  style={{ borderBottom: `2px solid `, marginBottom: '10px' }}
                >
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: '#2b2b2b',
                      fontFamily: 'Noto Sans KR,sans-serif',
                    }}
                  >
                    <Avatar
                      style={{ marginRight: '5px', marginBottom: '5px' }}
                      src={avatar}
                    />
                    {coinname}
                  </span>{' '}
                  {baseCurrency}/${quoteCurrency}
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-xxl-4">
                  <div></div>
                </div>
                <div
                  style={{ textAlign: 'right' }}
                  className="col-xl-8 col-lg-8 col-md-8 col-xxl-8"
                >
                  <div className="row" style={{ marginTop: '5px' }}>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
                      {trText('high_price')}
                    </div>
                    <div
                      className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
                      style={{
                        color: '#26A69A',
                        borderBottom: `1px solid`,
                        fontWeight: 'bold',
                      }}
                    >
                      {highPrice && highPrice}
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
                      {trText('volume_24h')}
                    </div>
                    <div
                      className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
                      style={{ borderBottom: `1px solid` }}
                    >
                      {volume && volume}{' '}
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#999',
                          letterSpacing: '.05em',
                        }}
                      >
                        {baseCurrency && baseCurrency.replace('*', '')}
                      </span>
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: '13px' }}>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
                      {trText('low_price')}
                    </div>
                    <div
                      className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
                      style={{
                        color: '#F6465D',
                        borderBottom: `1px solid`,
                        fontWeight: 'bold',
                      }}
                    >
                      {lowPrice && lowPrice}
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
                      {trText('volume_price_24h')}
                    </div>
                    <div
                      className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
                      style={{ borderBottom: `1px solid` }}
                    >
                      {volume && volume}{' '}
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#999',
                          letterSpacing: '.05em',
                        }}
                      >
                        {quoteCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#646464' }}>
                <Tooltip title="Current Coingecko global pricing information.">
                  <span style={{ fontSize: '11px', color: '#646464' }}>
                    Global Price: {`${markPrice} USD`}
                  </span>{' '}
                  <QuestionCircleOutlined
                    style={{ fontSize: '12px', color: '#646464' }}
                  />
                </Tooltip>
              </div>
            </div>
            )
          </CardContent>
        </Card>
      </ThemeProvider>
    </React.Fragment>
  );
}
