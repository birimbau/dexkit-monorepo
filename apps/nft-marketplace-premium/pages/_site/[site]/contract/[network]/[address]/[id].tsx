import ContractNftItemContainer from '@/modules/contract-wizard/components/containers/ContractNftItemContainer';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import Container from '@mui/material/Container';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function ContractPage() {
  const { query } = useRouter();

  const { address, network, id } = query;

  const { provider } = useWeb3React();

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={NETWORK_FROM_SLUG(network as string)?.chainId}
      signer={provider?.getSigner()}
    >
      <Container>
        <ContractNftItemContainer
          address={address as string}
          network={network as string}
          tokenId={id as string}
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

    return {
      props: { ...configResponse },
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
