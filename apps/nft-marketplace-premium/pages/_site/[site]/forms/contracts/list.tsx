import { Box, Container, Grid, NoSsr, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';

import { DexkitApiProvider } from '@dexkit/core/providers';

import ContractListDataGrid from '@/modules/forms/components/ContractListDataGrid';

import { ConnectWalletBox } from '@dexkit/ui/components/ConnectWalletBox';
import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { netToQuery } from '@dexkit/ui/utils/networks';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { LoginAppButton } from 'src/components/LoginAppButton';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';
import { useAuth } from 'src/hooks/account';
import { getAppConfig } from 'src/services/app';

export default function FormsListContractsPage() {
  const { isActive } = useWeb3React();
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <NoSsr>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage id="forms" defaultMessage="Forms" />
                  ),
                  uri: '/forms',
                },
                {
                  caption: (
                    <FormattedMessage id="create" defaultMessage="Contracts" />
                  ),
                  uri: `/forms/contracts/list`,
                  active: true,
                },
              ]}
            />
          </NoSsr>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="my.contracts"
                    defaultMessage="My contracts"
                  />
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <FormattedMessage
                    id="contracts.you.deployed"
                    defaultMessage="Contracts you deployed"
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                {isActive ? (
                  isLoggedIn ? (
                    <ContractListDataGrid />
                  ) : (
                    <Stack justifyContent={'center'} alignItems={'center'}>
                      <Box sx={{ maxWidth: '500px' }}>
                        <LoginAppButton />
                      </Box>
                    </Stack>
                  )
                ) : (
                  <ConnectWalletBox
                    subHeaderMsg={
                      <FormattedMessage
                        id="connect.wallet.to.see.contracts.associated.with.your.account"
                        defaultMessage="Connect wallet to see contracts associated with your account"
                      />
                    }
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsListContractsPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site, 'home');

  const queryClient = new QueryClient();

  await netToQuery({
    queryClient,
    instance: dexkitNFTapi,
    siteId: configResponse.siteId,
  });

  return {
    props: { ...configResponse, dehydratedState: dehydrate(queryClient) },
  };
};
