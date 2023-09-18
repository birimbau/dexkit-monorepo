import Container from '@mui/material/Container';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Grid, Skeleton } from '@mui/material';

import AssetHead from '@/modules/nft/components/AssetHead';
import AssetLeftSection from '@/modules/nft/components/AssetLeftSection';
import EditionDropSection from '@/modules/wizard/components/sections/EditionDropSection';
import { ChainId } from '@dexkit/core/constants';
import {
  NETWORK_FROM_SLUG,
  NETWORK_SLUG,
} from '@dexkit/core/constants/networks';
import { ipfsUriToUrl, truncateAddress } from '@dexkit/core/utils';
import { useAsset, useAssetMetadata } from '@dexkit/ui/modules/nft/hooks';
import { truncateErc1155TokenId } from '@dexkit/ui/modules/nft/utils';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { NextSeo } from 'next-seo';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { PageHeader } from 'src/components/PageHeader';
import { NETWORK_ID } from 'src/constants/enum';
import { MAP_NETWORK_TO_RARIBLE } from 'src/constants/marketplaces';
import { BEST_SELL_ORDER_RARIBLE } from 'src/hooks/nft';
import { getAppConfig } from 'src/services/app';
import { fetchAssetForQueryClient } from 'src/services/nft';
import { getRariAsset } from 'src/services/rarible';

const AssetDetailPage: NextPage = () => {
  const router = useRouter();

  const { address, id } = router.query;
  const { provider } = useWeb3React();

  const { data: asset, isLoading } = useAsset(address as string, id as string);

  const { data: metadata } = useAssetMetadata(asset);

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
                    asset?.id
                  )}`,
                  uri: `/asset/${NETWORK_SLUG(
                    asset?.chainId
                  )}/${address}/${id}`,
                },
                {
                  caption: `Drop ${
                    asset?.collectionName
                  } #${truncateErc1155TokenId(asset?.id)}`,
                  uri: `drop/edition//${NETWORK_SLUG(
                    asset?.chainId
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
              clientId="8b875cba6d295240d3b3861a3e8c2260"
              activeChain={asset?.chainId}
              signer={provider?.getSigner()}
            >
              <EditionDropSection
                section={{
                  type: 'edition-drop-section',
                  config: {
                    tokenId: id as string,
                    address: address as string,
                  },
                }}
              ></EditionDropSection>
            </ThirdwebSDKProvider>
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
    const item = {
      contractAddress: address || '',
      tokenId: id || '',
      chainId: NETWORK_FROM_SLUG(network || '')?.chainId as ChainId,
    };
    await fetchAssetForQueryClient({ queryClient, item });

    try {
      if (network === NETWORK_ID.Ethereum || network === NETWORK_ID.Polygon) {
        const { data } = await getRariAsset(
          `${MAP_NETWORK_TO_RARIBLE[network]}:${address}:${id}`
        );
        await queryClient.prefetchQuery(
          [BEST_SELL_ORDER_RARIBLE, network, address, id],
          async () => {
            return data;
          }
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
