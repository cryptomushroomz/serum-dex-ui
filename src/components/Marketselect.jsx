import { Col, Row, Divider, Span, Avatar, Select, Tag } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import {
  useMarket,
  useOrderbook,
  useMarkPrice,
  useSelectedTokenAccounts,
  MarketProvider,
  getTradePageUrl,
} from '../utils/markets';
import { isEqual, getDecimalCount } from '../utils/utils';
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
import { useHistory, useParams } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function MarketSelect() {
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
  const history = useHistory();
  function setMarketAddress(address) {
    history.push(getTradePageUrl(address));
  }

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <Card variant="outlined" style={{ height: '70vw', width: '30vw' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              <Div style={{ display: 'flex', textalign: 'center' }}>
                Featured Token
              </Div>
              <Row gutter={(8, 48)}>
                <Col className="gutter-row" span={6}>
                  <div orientation="left">Choose market</div>

                  <div orientation="left" type="vertical" span={8}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() =>
                        setMarketAddress(
                          'E9XAtU18PXeSMcz5gkAkZ6yfj1E5nzY21x576ZvEg9VA',
                        )
                      }
                    >
                      SHROOMZ/USD
                    </Button>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div orientation="right">Last Price </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div orientation="right"> change 24h </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div orientation="right"> volume 24h </div>

                  <div style={{ color: markPriceColor }}>
                    {' '}
                    {formattedMarkPrice || '----'}
                    {markPrice > previousMarkPrice && (
                      <ArrowUpOutlined style={{ marginRight: 5 }} />
                    )}
                    {markPrice < previousMarkPrice && (
                      <ArrowDownOutlined style={{ marginRight: 5 }} />
                    )}
                    {quoteCurrency}
                  </div>
                </Col>
              </Row>
            </Typography>
          </CardContent>
        </Card>
      </ThemeProvider>
    </React.Fragment>
  );
}
