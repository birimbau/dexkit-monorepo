import SwapSection from '@/modules/home/components/SwapSection';
import { SwapPageSection } from '@/modules/wizard/types/section';
import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { netToQuery } from '@dexkit/ui/utils/networks';
import { NoSsr } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { PageHeader } from 'src/components/PageHeader';
import { useAppConfig } from 'src/hooks/app';
import { getAppConfig } from 'src/services/app';

const SwapPage: NextPage = () => {
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  const swapSection = useMemo(() => {
    const swapSectionPageIndex = appConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'swap'
    );
    if (swapSectionPageIndex !== -1) {
      return (
        (appConfig.pages['home']?.sections[
          swapSectionPageIndex
        ] as SwapPageSection) ||
        ({
          type: 'swap',
        } as SwapPageSection)
      );
    }
    return {
      type: 'swap',
    } as SwapPageSection;
  }, [appConfig]);

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
                <SwapSection section={swapSection} />
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
  const configResponse = await getAppConfig(params?.site, 'home');

  const queryClient = new QueryClient();

  await netToQuery({
    instance: dexkitNFTapi,
    queryClient,
    siteId: configResponse.siteId,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default SwapPage;
