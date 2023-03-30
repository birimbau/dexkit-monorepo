import {
  Box,
  Button,
  Drawer,
  Grid,
  Paper,
  Stack,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import MainLayout from '../../../../src/components/layouts/main';
import { NetworkwAccordion } from '../../../../src/components/NetworkAccordion';
import { PageHeader } from '../../../../src/components/PageHeader';
import SidebarFilters from '../../../../src/components/SidebarFilters';
import SidebarFiltersContent from '../../../../src/components/SidebarFiltersContent';
import FavoriteAssetsSection from '../../../../src/modules/favorites/components/FavoriteAssetsSection';
import TableSkeleton from '../../../../src/modules/nft/components/tables/TableSkeleton';
import HiddenAssetsSection from '../../../../src/modules/wallet/components/HiddenAssetsSection';
import WalletAssetsSection from '../../../../src/modules/wallet/components/WalletAssetsSection';
import { getAppConfig } from '../../../../src/services/app';
const ImportAssetDialog = dynamic(
  () =>
    import(
      '../../../../src/modules/orders/components/dialogs/ImportAssetDialog'
    )
);

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const WalletNFTsPage: NextPage = () => {
  const theme = useTheme();
  const { chainId: walletChainId } = useWeb3React();
  const [chainId, setChainId] = useState(walletChainId);

  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [filters, setFilters] = useState({
    myNfts: false,
    chainId: chainId,
    networks: [] as string[],
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCloseDrawer = () => setIsFiltersOpen(false);
  const handleOpenDrawer = () => setIsFiltersOpen(true);

  const onFilterNetworkChanged = (net: string) => {
    setFilters((value) => {
      const newFilterNetwork = [...value.networks] as string[];
      if (newFilterNetwork.includes(net)) {
        const index = newFilterNetwork.findIndex((n) => n === net);
        newFilterNetwork.splice(index, 1);
      } else {
        newFilterNetwork.push(net);
      }
      return {
        ...value,
        networks: newFilterNetwork,
      };
    });
  };

  const renderSidebar = (onClose?: () => void) => {
    return (
      <SidebarFilters
        title={<FormattedMessage id="filters" defaultMessage="Filters" />}
        onClose={onClose}
      >
        <SidebarFiltersContent>
          <Stack spacing={2}>
            <NetworkwAccordion onFilterNetworks={onFilterNetworkChanged} />
          </Stack>
        </SidebarFiltersContent>
      </SidebarFilters>
    );
  };

  const renderDrawer = () => {
    return (
      <Drawer open={isFiltersOpen} onClose={handleCloseDrawer}>
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          {renderSidebar(handleCloseDrawer)}
        </Box>
      </Drawer>
    );
  };

  const [showImportAsset, setShowImportAsset] = useState(false);

  const handleToggleImportAsset = () => setShowImportAsset((value) => !value);

  return (
    <>
      <ImportAssetDialog
        dialogProps={{
          open: showImportAsset,
          fullWidth: true,
          maxWidth: 'xs',
          onClose: handleToggleImportAsset,
        }}
      />
      {renderDrawer()}
      <MainLayout noSsr disablePadding>
        <Grid container>
          {isDesktop && (
            <Grid item xs={12} sm={2}>
              {renderSidebar()}
            </Grid>
          )}

          <Grid item xs={12} sm={10}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
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
                          <FormattedMessage
                            id="wallet"
                            defaultMessage="Wallet"
                          />
                        ),
                        uri: '/wallet',
                      },
                      {
                        caption: (
                          <FormattedMessage id="nfts" defaultMessage="NFTs" />
                        ),
                        uri: '/wallet/nfts',
                        active: true,
                      },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      value={activeTab}
                      onChange={handleChangeTab}
                      aria-label="wallet nft's tab"
                    >
                      <Tab
                        label={
                          <FormattedMessage
                            id={'collected'}
                            defaultMessage={'Collected'}
                          />
                        }
                        {...a11yProps(0)}
                      />
                      <Tab
                        label={
                          <FormattedMessage
                            id={'favorites'}
                            defaultMessage={'Favorites'}
                          />
                        }
                        {...a11yProps(1)}
                      />
                      <Tab
                        label={
                          <FormattedMessage
                            id={'hidden'}
                            defaultMessage={'Hidden'}
                          />
                        }
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  {activeTab === 0 && (
                    <QueryErrorResetBoundary>
                      {({ reset }) => (
                        <ErrorBoundary
                          onReset={reset}
                          fallbackRender={({ resetErrorBoundary, error }) => (
                            <Paper sx={{ p: 1 }}>
                              <Stack
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Typography variant="h6">
                                  <FormattedMessage
                                    id="something.went.wrong"
                                    defaultMessage="Oops, something went wrong"
                                    description="Something went wrong error message"
                                  />
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                >
                                  {String(error)}
                                </Typography>
                                <Button
                                  color="primary"
                                  onClick={resetErrorBoundary}
                                >
                                  <FormattedMessage
                                    id="try.again"
                                    defaultMessage="Try again"
                                    description="Try again"
                                  />
                                </Button>
                              </Stack>
                            </Paper>
                          )}
                        >
                          <Suspense fallback={<TableSkeleton rows={4} />}>
                            <WalletAssetsSection
                              filters={filters}
                              onOpenFilters={handleOpenDrawer}
                              onImport={handleToggleImportAsset}
                            />
                          </Suspense>
                        </ErrorBoundary>
                      )}
                    </QueryErrorResetBoundary>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {activeTab === 1 && (
                    <FavoriteAssetsSection
                      filters={filters}
                      onOpenFilters={handleOpenDrawer}
                      onImport={handleToggleImportAsset}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  {activeTab === 2 && (
                    <HiddenAssetsSection
                      filters={filters}
                      onOpenFilters={handleOpenDrawer}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </MainLayout>
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

    const { appConfig, appNFT } = await getAppConfig(site, 'home');

    return {
      props: { appConfig, appNFT },
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

export default WalletNFTsPage;
