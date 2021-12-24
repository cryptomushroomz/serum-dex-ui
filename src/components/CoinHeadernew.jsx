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
import SelectCoinHeader from './SelectCoinHeader_shroomz';

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
  const [marketDayVolume, setMarketDayVolume] = useState(undefined);
  const [marketHistData, setMarketHistData] = useState(undefined);

  const { t: trText, i18n } = useTranslation();

  let lowPrice = 0;
  let highPrice = 0;
  let volume = 0;

  let avatar = `https://github.com/solana-labs/token-list/blob/main/assets/mainnet/${mintAddress}/logo.png?raw=true`;
  let tickSize = market?.tickSize && getDecimalCount(market.tickSize);

  async function getDayVolume() {
    const response = await HistoryApi.getMarketDayVolume(
      `${baseCurrency}${quoteCurrency}`,
    );

    console.log('response', response);

    if (response && response.length > 0) {
      setMarketDayVolume(response[0]);
    }
  }

  async function gethistdata() {
    const response = await HistoryApi.getMarketHistData(
      `${baseCurrency}${quoteCurrency}`,
    );

    console.log('response', response);

    if (response && response.length > 0) {
      setMarketHistData(response[0]);
    }
  }

  useInterval(() => {
    getDayVolume();
    gethistdata();
  }, 10000);

  // 최초 1회 실행
  useEffect(() => {
    getDayVolume();
    gethistdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Card flex="auto" style={{ margin: '10px', minheight: '20vh' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
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
                    }}
                  >
                    <Avatar
                      style={{ marginRight: '5px', marginBottom: '5px' }}
                      src={avatar}
                    />
                    {coinname}
                  </span>
                  {'    '}
                  {baseCurrency}/{quoteCurrency}
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-xxl-4">
                  <div>
                    {market?.address.toBase58() && baseCurrency ? (
                      <SelectCoinHeader
                        markPrice={markPrice ?? 0}
                        selectedMarket={market?.address.toBase58()}
                        currency={baseCurrency}
                      />
                    ) : null}
                  </div>
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
                        borderBottom: `1px solid`,
                        fontWeight: 'bold',
                      }}
                    >
                      {quoteCurrency}
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
                      {trText('Volume 24h')}
                    </div>
                    <div
                      className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
                      style={{ borderBottom: `1px solid` }}
                    >
                      {marketDayVolume?.volume.toFixed(
                        getDecimalCount(market.tickSize),
                      )}{' '}
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

                  <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
                      {trText('Low price')}
                    </div>
                    <div
                      className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
                      style={{
                        borderBottom: `1px solid`,
                        fontWeight: 'bold',
                      }}
                    >
                      {quoteCurrency}
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-xxl-3">
                      {trText('Volume price 24h')}
                    </div>
                    <div
                      className="col-xl-3 col-lg-3 col-md-3 col-xxl-3"
                      style={{ borderBottom: `1px solid` }}
                    >
                      {marketDayVolume?.volumeUsd.toFixed(
                        getDecimalCount(market.tickSize),
                      )}{' '}
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

              <div style={{ fontSize: '11px', color: '#646464' }}></div>
            </div>
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
