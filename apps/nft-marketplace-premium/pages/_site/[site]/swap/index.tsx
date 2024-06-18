import { Token } from '@dexkit/core/types';
import { isAddressEqual, parseChainId } from '@dexkit/core/utils';
import SwapSection from '@dexkit/dexappbuilder-viewer/components/sections/SwapSection';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { SwapPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { NoSsr } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
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

  const params = useSearchParams();

  const configParams = useMemo(() => {
    const chainId = parseChainId(params.get('chainId') ?? '0');
    const buyTokenAddress = params.get('buyToken');
    const sellTokenAddress = params.get('sellToken');

    let tokens = appConfig?.tokens?.length
      ? appConfig?.tokens[0].tokens || []
      : [];

    let buyToken: Token | undefined;
    let sellToken: Token | undefined;

    if (chainId && buyTokenAddress) {
      buyToken = tokens.find(
        (t) =>
          isAddressEqual(t.address, buyTokenAddress ?? '') &&
          t.chainId === chainId
      );
    }

    if (chainId && sellTokenAddress) {
      sellToken = tokens.find(
        (t) =>
          isAddressEqual(t.address, sellTokenAddress ?? '') &&
          t.chainId === chainId
      );
    }

    if (chainId) {
      const config = {
        ...swapSection.config,
        defaultChainId: chainId,
        configByChain: {
          ...swapSection.config?.configByChain,
        },
      };

      config.configByChain[chainId] = {
        slippage: 0,
      };

      if (swapSection.config?.configByChain?.[chainId].slippage) {
        config.configByChain[chainId].slippage =
          swapSection.config?.configByChain?.[chainId].slippage;
      }

      if (buyToken) {
        config.configByChain[chainId].buyToken = buyToken;
      } else if (swapSection.config?.configByChain?.[chainId].buyToken) {
        config.configByChain[chainId].buyToken =
          swapSection.config?.configByChain?.[chainId].buyToken;
      }

      if (sellToken) {
        config.configByChain[chainId].sellToken = sellToken;
      } else if (swapSection.config?.configByChain?.[chainId].sellToken) {
        config.configByChain[chainId].sellToken =
          swapSection.config?.configByChain?.[chainId].sellToken;
      }

      return config;
    }
  }, [params]);

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
                <SwapSection
                  section={{
                    ...swapSection,
                    config: {
                      ...swapSection.config,
                      ...(swapSection.config?.enableUrlParams
                        ? configParams
                        : {}),
                    },
                  }}
                  selectedChainId={
                    swapSection.config?.enableUrlParams
                      ? configParams?.defaultChainId
                      : undefined
                  }
                />
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

  return {
    props: {
      ...configResponse,
    },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default SwapPage;
