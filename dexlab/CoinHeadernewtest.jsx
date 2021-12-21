import { Col, Row, Divider, Span, Avatar } from 'antd';
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

  let avatar = 1;
  let coinname;
  const marketAddress = market?.address.toBase58();
  const addy = marketAddress;

  if (addy == 'E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA') {
    avatar = shroomz;
    coinname = 'CryptoMushroomz';
  } else if (addy == 'FAHa34qbNbvtEBHgjuALk4WLJMwxJTtV6Z3V3p79XLWG') {
    avatar = kitty;
    coinname = 'Kitty Coin';
  }

  //let Avatar =
  //getTradePageUrl(address) == 'E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA'
  //? shroomz
  //: 0;

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <Card style={{ margin: '10px' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
            ></Typography>

            <Row
              gutter={16}
              style={{
                fontWeight: 'bold',
                fontSize: '16px',
                displaylistitem: 'flex',
                alignContent: 'center',
              }}
            >
              <Avatar
                size={32}
                style={{ marginRight: '5px', marginBottom: '3px' }}
                src={avatar}
              />
              <Col className="gutter-row">
                <div style={{ display: 'flex', align: 'center' }}>
                  {coinname}
                </div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div style={{ textAlign: 'right' }}> {baseCurrency}</div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div style={{ textAlign: 'right' }}> Last Price:</div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div style={{ color: markPriceColor, textAlign: 'right' }}>
                  {markPrice > previousMarkPrice && (
                    <ArrowUpOutlined style={{ marginRight: 5 }} />
                  )}
                  {markPrice < previousMarkPrice && (
                    <ArrowDownOutlined style={{ marginRight: 5 }} />
                  )}
                  {formattedMarkPrice || '----'} {quoteCurrency}
                </div>
              </Col>
            </Row>
          </CardContent>
        </Card>
      </ThemeProvider>
    </React.Fragment>
  );
}
