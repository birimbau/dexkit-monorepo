import Container from '@mui/material/Container';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Box, Grid, Skeleton, Typography } from '@mui/material';

import AssetHead from '@/modules/nft/components/AssetHead';
import AssetLeftSection from '@/modules/nft/components/AssetLeftSection';
import { DropEditionListSection } from '@/modules/wizard/components/sections/DropEditionListSection';
import EditionDropSection from '@/modules/wizard/components/sections/EditionDropSection';
import { ipfsUriToUrl, truncateAddress } from '@dexkit/core/utils';
import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import { useAsset, useAssetMetadata } from '@dexkit/ui/modules/nft/hooks';
import { truncateErc1155TokenId } from '@dexkit/ui/modules/nft/utils';
import { getChainIdFromSlugOld, netToQuery } from '@dexkit/ui/utils/networks';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { NextSeo } from 'next-seo';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { PageHeader } from 'src/components/PageHeader';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { NETWORK_ID } from 'src/constants/enum';
import { MAP_NETWORK_TO_RARIBLE } from 'src/constants/marketplaces';
import { BEST_SELL_ORDER_RARIBLE } from 'src/hooks/nft';
import { getAppConfig } from 'src/services/app';
import { fetchAssetForQueryClient } from 'src/services/nft';
import { getRariAsset } from 'src/services/rarible';

const AssetDetailPage: NextPage = () => {
  const router = useRouter();

  const { address, id, network } = router.query;
  const { provider } = useWeb3React();

  const { data: asset, isLoading } = useAsset(address as string, id as string);

  const { data: metadata } = useAssetMetadata(asset);

  const { NETWORK_SLUG } = useNetworkMetadata();

  return (
    <>
      <NextSeo
        title={`Edition drop ${metadata?.name || ''}`}
        description={`${metadata?.description || ''}`}
        openGraph={{
          title: metadata?.name || '',
          description: metadata?.description || '',
          type: 'website',
          images: [
            {
              url: ipfsUriToUrl(metadata?.image || '') || '',
              width: 850,
              height: 650,
              alt: `${metadata?.name || ''} image`,
            },
          ],
        }}
      />

      <AssetHead address={address as string} id={id as string} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: isLoading ? (
                    <Skeleton />
                  ) : (
                    asset?.collectionName || truncateAddress(address as string)
                  ),

                  uri: `/collection/${NETWORK_SLUG(asset?.chainId)}/${address}`,
                },
                {
                  caption: `${asset?.collectionName} #${truncateErc1155TokenId(
                    asset?.id,
                  )}`,
                  uri: `/asset/${NETWORK_SLUG(
                    asset?.chainId,
                  )}/${address}/${id}`,
                },
                {
                  caption: `Drop ${asset?.collectionName} #${truncateErc1155TokenId(
                    asset?.id,
                  )}`,
                  uri: `drop/edition/${NETWORK_SLUG(
                    asset?.chainId,
                  )}/${address}/${id}`,
                  active: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AssetLeftSection address={address as string} id={id as string} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <ThirdwebSDKProvider
              clientId={THIRDWEB_CLIENT_ID}
              activeChain={asset?.chainId}
              signer={provider?.getSigner()}
            >
              <Box py={2}>
                <EditionDropSection
                  section={{
                    type: 'edition-drop-section',
                    config: {
                      network: NETWORK_SLUG(asset?.chainId) || '',
                      tokenId: id as string,
                      address: address as string,
                    },
                  }}
                ></EditionDropSection>
              </Box>
            </ThirdwebSDKProvider>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant="h5">
              <FormattedMessage
                id="drops.of.same.collection"
                defaultMessage={'Drops of same collection'}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <DropEditionListSection
              section={{
                type: 'edition-drop-list-section',
                config: {
                  network: network as string,
                  address: address as string,
                },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

type Params = {
  address?: string;
  id?: string;
  network?: string;
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { address, id, network, site } = params;

    const configResponse = await getAppConfig(site, 'home');

    const queryClient = new QueryClient();

    const { NETWORKS } = await netToQuery({
      instance: dexkitNFTapi,
      queryClient,
      siteId: configResponse.siteId,
    });

    const chainId = getChainIdFromSlugOld(
      queryClient,
      configResponse.siteId,
      network || '',
    );

    if (!chainId) {
      throw new Error('no chain');
    }

    const item = {
      contractAddress: address || '',
      tokenId: id || '',
      chainId,
    };

    await fetchAssetForQueryClient({
      queryClient,
      item,
      siteId: configResponse.siteId,
      NETWORKS,
    });

    try {
      if (network === NETWORK_ID.Ethereum || network === NETWORK_ID.Polygon) {
        const { data } = await getRariAsset(
          `${MAP_NETWORK_TO_RARIBLE[network]}:${address}:${id}`,
        );
        await queryClient.prefetchQuery(
          [BEST_SELL_ORDER_RARIBLE, network, address, id],
          async () => {
            return data;
          },
        );
      }
    } catch (e) {
      console.log(e);
    }

    return {
      props: { dehydratedState: dehydrate(queryClient), ...configResponse },
      revalidate: 5,
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

(AssetDetailPage as any).getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default AssetDetailPage;
