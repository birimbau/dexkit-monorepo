import { ContractContainer } from '@/modules/contract-wizard/components/containers/ContractContainer';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { netToQuery } from '@dexkit/ui/utils/networks';
import Container from '@mui/material/Container';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function ContractPage() {
  const { query } = useRouter();

  const { address, network } = query;

  const { provider } = useWeb3React();
  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={NETWORK_FROM_SLUG(network as string)?.chainId}
      signer={provider?.getSigner()}
    >
      <Container>
        <ContractContainer
          address={address as string}
          network={network as string}
        />
      </Container>
    </ThirdwebSDKProvider>
  );
}

(ContractPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
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
    const queryClient = new QueryClient();

    await netToQuery({
      instance: dexkitNFTapi,
      queryClient,
      siteId: configResponse.siteId,
    });

    return {
      props: { ...configResponse, dehydratedState: dehydrate(queryClient) },
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
