import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useMarket, useBonfidaTrades } from '../utils/markets';
import { getDecimalCount } from '../utils/utils';
import FloatingElement from './layout/FloatingElement';
import { BonfidaTrade } from '../utils/types';
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Title = styled.div`
  color: rgba(255, 255, 255, 1);
`;
const SizeTitle = styled(Row)`
  padding: 20px 0 14px;
  color: #434a59;
`;

export default function PublicTrades({ smallScreen }) {
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const [trades, loaded] = useBonfidaTrades();

  return (
    

    <React.Fragment>
    <ThemeProvider theme={darkTheme}>  
    <Card style={
      smallScreen
      ? { flex: 1, margin: '10px'}
      : {
          minHeight: '170px',
          maxHeight: 'calc(100vh - 700px)',
          margin: '10px'
        }}>
    
      <CardContent >    
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>

        Recent Market Trades
        
      <SizeTitle>
        <Col span={8}>Price ({quoteCurrency}) </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Size ({baseCurrency})
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Time
        </Col>
      </SizeTitle>
      {!!trades && loaded && (
        <div
          style={{
            overflowY: 'scroll',
            maxHeight: smallScreen
              ? 'calc(100% - 75px)'
              : 'calc(100vh - 800px)',
          }}
        >
          {trades.map((trade: BonfidaTrade, i: number) => (
            <Row key={i} style={{ marginBottom: 4 }}>
              <Col
                span={8}
                style={{
                  color: trade.side === 'buy' ? '#41C77A' : '#F23B69',
                }}
              >
                {market?.tickSize && !isNaN(trade.price)
                  ? Number(trade.price).toFixed(
                      getDecimalCount(market.tickSize),
                    )
                  : trade.price}
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                {market?.minOrderSize && !isNaN(trade.size)
                  ? Number(trade.size).toFixed(
                      getDecimalCount(market.minOrderSize),
                    )
                  : trade.size}
              </Col>
              <Col span={8} style={{ textAlign: 'right', color: '#434a59' }}>
                {trade.time && new Date(trade.time).toLocaleTimeString()}
              </Col>
            </Row>
          ))}
        </div>
      )}
      </Typography>
    </CardContent>
    </Card>
    </ThemeProvider>
    </React.Fragment>
  );
}
