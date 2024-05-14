import {
  Box,
  Button,
  Container,
  Grid,
  NoSsr,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';

import { DexkitApiProvider } from '@dexkit/core/providers';

import ContractListDataGrid from '@/modules/forms/components/ContractListDataGrid';
import { ConnectWalletBox } from '@dexkit/ui/components/ConnectWalletBox';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import AddIcon from '@mui/icons-material/Add';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { LoginAppButton } from 'src/components/LoginAppButton';
import AuthMainLayout from 'src/components/layouts/authMain';

import Link from '@dexkit/ui/components/AppLink';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { QueryClient, dehydrate } from '@tanstack/react-query';
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
                    <FormattedMessage
                      id="dexgenerator"
                      defaultMessage="DexGenerator"
                    />
                  ),
                  uri: '/forms',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="manage.contracts"
                      defaultMessage="Manage Contracts"
                    />
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
                    id="my.deployed.contracts"
                    defaultMessage="My deployed contracts"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  href="/forms/contracts/create"
                  LinkComponent={Link}
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage
                    id="new.contract"
                    defaultMessage="New contract"
                  />
                </Button>
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

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
    },
    revalidate: 3000,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
