import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../../../../src/components/layouts/main';

import transakSDK from '@transak/transak-sdk';

import { FormattedMessage, useIntl } from 'react-intl';
import { isBalancesVisibleAtom } from '../../../../src/state/atoms';

import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';

import { NextSeo } from 'next-seo';
import { PageHeader } from '../../../../src/components/PageHeader';
import { useFavoriteAssets } from '../../../../src/hooks/nft';

import { copyToClipboard } from '@dexkit/core/utils';
import dynamic from 'next/dynamic';

import EvmWalletContainer from '@/modules/wallet/components/containers/EvmWalletContainer';
import { useEvmCoins } from 'src/hooks/blockchain';
import {
  useAppConfig,
  useConnectWalletDialog,
} from '../../../../src/hooks/app';
import { useCurrency } from '../../../../src/hooks/currency';
import { getAppConfig } from '../../../../src/services/app';
const EvmReceiveDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/EvmReceiveDialog')
);

enum WalletTabs {
  Transactions,
  Trades,
}

const WalletPage: NextPage = () => {
  const appConfig = useAppConfig();

  const { account, isActive, chainId: walletChainId, ENSName } = useWeb3React();
  const [chainId, setChainId] = useState(walletChainId);

  const { formatMessage } = useIntl();
  const evmCoins = useEvmCoins({ defaultChainId: chainId });

  const favorites = useFavoriteAssets();

  const theme = useTheme();
  const connectWalletDialog = useConnectWalletDialog();

  const handleConnectWallet = () => {
    connectWalletDialog.setOpen(true);
  };
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const [selectedTab, setSelectedTab] = useState(WalletTabs.Transactions);
  const [isTableOpen, setIsTableOpen] = useState(isDesktop);

  const [isBalancesVisible, setIsBalancesVisible] = useAtom(
    isBalancesVisibleAtom
  );

  const handleChangeTab = (
    event: React.SyntheticEvent<Element, Event>,
    value: WalletTabs
  ) => {
    setSelectedTab(value);
  };

  const handleToggleBalances = () => {
    setIsTableOpen((value) => !value);
  };

  const handleToggleVisibility = () => {
    setIsBalancesVisible((value) => !value);
  };

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const currency = useCurrency();

  const transak = useRef<any>();

  useEffect(() => {
    if (appConfig.transak?.enabled) {
      if (account !== undefined) {
        transak.current = new transakSDK({
          apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
          environment:
            process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'STAGING', // STAGING/PRODUCTION
          hostURL: window.location.origin,
          widgetHeight: '625px',
          widgetWidth: '500px',
          walletAddress: account, // Your customer's wallet address
          fiatCurrency: currency.toUpperCase(), // If you want to limit fiat selection eg 'USD'
        });
      }
    }
  }, [account, currency]);

  const handleBuy = () => {
    transak.current?.init();
  };

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleCloseImportTokenDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleOpenImportTokenDialog = () => {
    setIsImportDialogOpen(true);
  };
  const handleCopy = () => {
    if (account) {
      if (ENSName) {
        copyToClipboard(ENSName);
      } else {
        copyToClipboard(account);
      }
    }
  };

  useEffect(() => {
    // we are not allowing to change chainId when user sets defaultChainId
    if (walletChainId) {
      setChainId(walletChainId);
    }
  }, [walletChainId]);

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'my.wallet',
          defaultMessage: 'My Wallet',
        })}
      />
      <Box>
        <Container>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage id="wallet" defaultMessage="Wallet" />
                    ),
                    uri: '/wallet',
                    active: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <EvmWalletContainer />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { site } = params;

    const configResponse = await getAppConfig(site, 'home');

    return {
      props: { ...configResponse },
    };
  }

  return {
    props: {},
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

(WalletPage as any).getLayout = function getLayout(page: any) {
  return <MainLayout noSsr>{page}</MainLayout>;
};

export default WalletPage;
