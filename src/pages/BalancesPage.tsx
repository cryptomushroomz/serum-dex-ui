import React from 'react';
import { Tabs } from 'antd';
import {
  useAllOpenOrdersBalances,
  useWalletBalancesForAllMarkets,
} from '../utils/markets';
import FloatingElement from '../components/layout/FloatingElement';
import WalletBalancesTable from '../components/UserInfoTable/WalletBalancesTable';
import { useMintToTickers } from '../utils/tokens';
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

const { TabPane } = Tabs;

export default function BalancesPage() {
  const walletBalances = useWalletBalancesForAllMarkets();
  const mintToTickers = useMintToTickers();
  const openOrdersBalances = useAllOpenOrdersBalances();

  const data = (walletBalances || []).map((balance) => {
    const balances = {
      coin: mintToTickers[balance.mint],
      mint: balance.mint,
      walletBalance: balance.balance,
      openOrdersFree: 0,
      openOrdersTotal: 0,
    };
    for (let openOrdersAccount of openOrdersBalances[balance.mint] || []) {
      balances['openOrdersFree'] += openOrdersAccount.free;
      balances['openOrdersTotal'] += openOrdersAccount.total;
    }
    return balances;
  });

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
            >

      <Tabs defaultActiveKey="walletBalances">
        <TabPane tab="Wallet Balances" key="walletBalances">
          <WalletBalancesTable walletBalances={data} />
        </TabPane>
      </Tabs>
      </Typography>
      </CardContent>
      </Card>
      </ThemeProvider>
      </React.Fragment>
  );
}
