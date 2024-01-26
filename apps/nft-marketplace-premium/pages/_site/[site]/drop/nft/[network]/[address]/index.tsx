import {
  ThirdwebSDKProvider,
  useContract,
  useContractMetadata,
} from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

import NftDropSection from '@/modules/wizard/components/sections/NftDropSection';
import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import { netToQuery } from '@dexkit/ui/utils/networks';
import { Container, Grid, Skeleton } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { GetStaticPropsContext } from 'next';
import { FormattedMessage } from 'react-intl';
import { PageHeader } from 'src/components/PageHeader';
import MainLayout from 'src/components/layouts/main';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';

function TokenDrop() {
  const router = useRouter();
  const { network, address } = router.query;

  const { contract } = useContract(address as string, 'token-drop');

  const { data: contractMetadata, isLoading } = useContractMetadata(contract);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Container>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage id="nft.drop" defaultMessage="NFT Drop" />
                ),
                uri: '/drop/nft',
              },
              {
                caption: isLoading ? <Skeleton /> : contractMetadata?.name,
                uri: `/drop/nft/${network}/${address}`,
                active: true,
              },
            ]}
          />
        </Container>
      </Grid>
      <Grid item xs={12}>
        <NftDropSection
          section={{
            type: 'nft-drop',
            settings: {
              address: address as string,
              network: network as string,
              variant: 'detailed',
            },
          }}
        />
      </Grid>
    </Grid>
  );
}

export default function Wrapper() {
  const { provider } = useWeb3React();
  const router = useRouter();
  const { network } = router.query;

  const { getChainIdFromSlug } = useNetworkMetadata();

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={getChainIdFromSlug(network as string)?.chainId}
      signer={provider?.getSigner()}
    >
      <TokenDrop />
    </ThirdwebSDKProvider>
  );
}

(Wrapper as any).getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

type Params = {
  site?: string;
  address?: string;
  network?: string;
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { address, network, site } = params;

    const configResponse = await getAppConfig(site, 'home');

    const queryClient = new QueryClient();

    await netToQuery({
      instance: dexkitNFTapi,
      queryClient,
      siteId: configResponse.siteId,
    });

    return {
      props: { dehydratedState: dehydrate(queryClient), ...configResponse },
      revalidate: 5,
    };
  }
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
