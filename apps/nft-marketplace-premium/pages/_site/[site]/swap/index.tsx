import { NoSsr, Paper, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from '../../../../src/components/layouts/main';
import Swap from '../../../../src/modules/swap/Swap';

import SwapSkeleton from '@/modules/swap/Swap.skeleton';
import { NextSeo } from 'next-seo';
import { PageHeader } from '../../../../src/components/PageHeader';
import { ChainId } from '../../../../src/constants/enum';
import { getAppConfig } from '../../../../src/services/app';

const SwapPage: NextPage = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <NextSeo title={formatMessage({ id: 'swap', defaultMessage: 'Swap' })} />
      <MainLayout>
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
                      <FormattedMessage id="swap" defaultMessage="Swap" />
                    ),
                    uri: '/swap',
                    active: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NoSsr>
                <QueryErrorResetBoundary>
                  {({ reset }) => (
                    <ErrorBoundary
                      onReset={reset}
                      fallbackRender={({ resetErrorBoundary, error }) => (
                        <Paper sx={{ p: 1 }}>
                          <Stack justifyContent="center" alignItems="center">
                            <Typography variant="h6">
                              <FormattedMessage
                                id="something.went.wrong"
                                defaultMessage="Oops, something went wrong"
                                description="Something went wrong error message"
                              />
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
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
                      <Suspense fallback={<SwapSkeleton />}>
                        <Swap defaultChainId={ChainId.ETH} />
                      </Suspense>
                    </ErrorBoundary>
                  )}
                </QueryErrorResetBoundary>
              </NoSsr>
            </Grid>
          </Grid>
        </Container>
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
  const { appConfig, appNFT } = await getAppConfig(params?.site);

  return {
    props: { appConfig, appNFT },
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default SwapPage;
