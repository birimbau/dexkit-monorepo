import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useState } from 'react';
import MainLayout from '../../../../src/components/layouts/main';
import { WalletButton } from '../../../../src/modules/wallet/components/WalletButton';

import metamaskIcon from '../../../../public/assets/images/metamask-fox.svg';

import walletConnectIcon from '../../../../public/assets/images/walletconnect-circle-blue.svg';

import { FormattedMessage } from 'react-intl';
import { PageHeader } from '../../../../src/components/PageHeader';

import { useWalletActivate } from '@dexkit/core/hooks';
import { WalletActivateParams } from '@dexkit/core/types';
import { selectedWalletAtom } from 'src/state/atoms';
import { getAppConfig } from '../../../../src/services/app';

const ConnectWallet: NextPage = () => {
  const walletActivate = useWalletActivate({
    magicRedirectUrl:
      typeof window !== 'undefined'
        ? window.location.href
        : process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || '',
    selectedWalletAtom,
  });
  const [connectorName, setConnectorName] = useState<string>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleActivateWallet = async ({
    connectorName,
  }: WalletActivateParams) => {
    setConnectorName(connectorName);
    await walletActivate.mutation.mutateAsync({ connectorName });
    setConnectorName(undefined);
  };

  return (
    <>
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
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="connect.wallet"
                        defaultMessage="Connect Wallet"
                      />
                    ),
                    uri: '/wallet/connect',
                    active: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    <FormattedMessage
                      id="choose.wallet"
                      defaultMessage="Choose Wallet"
                    />
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <FormattedMessage
                      id="choose.a.wallet.to.proceed"
                      defaultMessage="Choose a wallet to proceed"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    <FormattedMessage id="wallets" defaultMessage="Wallets" />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    {!isMobile && (
                      <Grid item xs={6} sm={3}>
                        <WalletButton
                          loading={
                            walletActivate.mutation.isLoading &&
                            connectorName === 'metamask'
                          }
                          disabled={
                            walletActivate.mutation.isLoading &&
                            connectorName === 'metamask'
                          }
                          caption="MetaMask"
                          src={metamaskIcon.src}
                          onClick={() =>
                            handleActivateWallet({ connectorName: 'metamask' })
                          }
                        />
                      </Grid>
                    )}
                    <Grid item xs={6} sm={3}>
                      <WalletButton
                        disabled={
                          walletActivate.mutation.isLoading &&
                          connectorName === 'walletConnect'
                        }
                        loading={
                          walletActivate.mutation.isLoading &&
                          connectorName === 'walletConnect'
                        }
                        caption="WalletConnect"
                        src={walletConnectIcon.src}
                        onClick={() =>
                          handleActivateWallet({
                            connectorName: 'walletConnect',
                          })
                        }
                      />
                    </Grid>
                    {/* <Grid item xs={6} sm={3}>
                      <WalletButton caption="Magic Link" />
                    </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
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

(ConnectWallet as any).getLayout = function getLayout(page: any) {
  return <MainLayout noSsr>{page}</MainLayout>;
};

export default ConnectWallet;
