import ReactDOM from 'react-dom';
import React, { Component }  from 'react';

import { useState, useEffect, useMemo } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Button, Grid, makeStyles } from "@material-ui/core";
import { Provider } from "@project-serum/anchor";
import { useHistory, useParams, useLocation } from 'react-router-dom'
// @ts-ignore
import { MarketProvider, getTradePageUrl } from '../utils/markets'
import Wallet from "@project-serum/sol-wallet-adapter";
import { Row, Col, Alert, Spin } from 'antd'
import { WalletAdapter } from '../wallet-adapters';
import { useConnection } from '../utils/connection'
import { useWallet } from "../utils/wallet";
import {
  Signer,
  ConfirmOptions,
  Connection,
  PublicKey,
  Transaction,
  TransactionSignature
} from "@solana/web3.js";
import {
  TokenListContainer,
  TokenListProvider,
  TokenInfo
} from "@solana/spl-token-registry";
import "./SwapPage.css";

import Swap from "../components/Swap";
import{SHROOMZ_REF} from "../components/Swap/utils/pubkeys";


function SwapPage() {

const { wallet } = useWallet();


  return (
    
    <div>
      
    {wallet ? (
    
   <SnackbarProvider  maxSnack={5} autoHideDuration={8000}>
      

      <AppInner wallet={wallet} />
      
    </SnackbarProvider>
     
          ) : (
            <Spin />
          )}
    </div>
   
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
   
  },

}));


const opts: ConfirmOptions = {
  preflightCommitment: 'recent',
  commitment: 'recent',
}


function AppInner({wallet}) {
  const styles = useStyles();
   const { enqueueSnackbar } = useSnackbar();
  const connection = useConnection()
  const [tokenList, setTokenList] = useState<TokenListContainer | null>(null)

 

  
  const ref = SHROOMZ_REF;

  useEffect(() => {
    new TokenListProvider().resolve().then(setTokenList)
  }, [setTokenList])

  const provider = new NotifyingProvider(connection, wallet as Wallet, opts, (tx, err) => {
    
        if (err) {
          console.log('tx failed: ', err)
          const errMsg = err.message ? err.message : err.toString()
          enqueueSnackbar(`Error: ${errMsg}`, {
            variant: "error",
          });
        } else {

          enqueueSnackbar("Transaction sent", {
            variant: "success",
            action: (
              <Button
                color="inherit"
                component="a"
                target="_blank"
                rel="noopener"
                href={`https://explorer.solana.com/tx/${tx}`}
              >
                View on Solana Explorer
              </Button>
            ),
          });
        }
  }
    );
    
  



 
  return (
 
    <Grid
      container
      justifyContent="center"
      alignItems="center" 
      className={styles.root}
    >
        {tokenList &&
          <Swap 
            containerStyle={{ 
              backgroundColor: '#1C2222',
              maxWidth: 424,
              borderRadius: 8,
              boxShadow: "0px 0px 30px 5px rgba(0,0,0,0.075)",
              padding: 0,
              background: "#1C2222",
              color: "#fff",
              "& button:hover": {
                opacity: 0.8,
              },
             }}
            swapTokenContainerStyle={{ 
              display: "flex",
              justifyContent: "space-between",
            }}
            referral={ref} 
            fromMint={new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")} 
            toMint={new PublicKey("2vRgBSJEVPXxayrhXoazQyCKSGFYQG3ZdfT2Gv5gZykL")}
            provider={provider} 
            tokenList={tokenList}
	     />
              
        }
    </Grid>
  );
      }





















// Cast wallet to AnchorWallet in order to be compatible with Anchor's Provider class
interface AnchorWallet {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

// Custom provider to display notifications whenever a transaction is sent.
//
// Note that this is an Anchor wallet/network provider--not a React provider,
// so all transactions will be flowing through here, which allows us to
// hook in to display all transactions sent from the `Swap` component
// as notifications in the parent app.
class NotifyingProvider extends Provider {
  // Function to call whenever the provider sends a transaction;
  private onTransaction: (tx: TransactionSignature | undefined, err?: Error) => void

  constructor(
    connection: Connection,
    wallet: Wallet,
    opts: ConfirmOptions,
    onTransaction: (tx: TransactionSignature | undefined, err?: Error) => void
  ) {
    const newWallet = wallet as AnchorWallet
    super(connection, newWallet, opts)
    this.onTransaction = onTransaction
  }

  async send(
    tx: Transaction,
    signers?: Array<Signer | undefined>,
    opts?: ConfirmOptions
  ): Promise<TransactionSignature> {
    try {
      const txSig = await super.send(tx, signers, opts);
      this.onTransaction(txSig);
      return txSig;
    } catch (err) {
      //@ts-ignore
      this.onTransaction(undefined, err);
      return "";
    }
  }

  async sendAll(
    txs: Array<{ tx: Transaction; signers: Array<Signer | undefined> }>,
    opts?: ConfirmOptions
  ): Promise<Array<TransactionSignature>> {
    try {
      const txSigs = await super.sendAll(txs, opts)
      txSigs.forEach((sig) => {
        this.onTransaction(sig)
      })
      return txSigs
    } catch (err) {
      if (err instanceof Error || err === undefined) {
        this.onTransaction(undefined, err)
      }
      return []
    }
  }
}
export default SwapPage;