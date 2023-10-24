import StakeErc20Section from '@/modules/wizard/components/sections/StakeErc20Section';
import TokenErc20Section from '@/modules/wizard/components/sections/TokenErc20Section';
import { hexToString } from '@dexkit/ui/utils';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  ThirdwebSDKProvider,
  useContract,
  useContractRead,
} from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import MainLayout from 'src/components/layouts/main';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';
import { getChainIdFromSlug } from 'src/utils/blockchain';

export function TokensPage() {
  const { query } = useRouter();

  const { address, network } = query;

  const { data: contract } = useContract(address as string);
  const contractRead = useContractRead(contract, 'contractType');

  let contractType = hexToString(contractRead.data);

  if (contractType === 'TokenERC20') {
    return (
      <TokenErc20Section
        section={{
          type: 'token',
          settings: { address: address as string, network: network as string },
        }}
      />
    );
  }

  return (
    <StakeErc20Section
      section={{
        type: 'token-stake',
        settings: { address: address as string, network: network as string },
      }}
    />
  );
}

export default function Wrapper() {
  const { provider } = useWeb3React();
  const router = useRouter();
  const { network } = router.query;

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={getChainIdFromSlug(network as string)?.chainId}
      signer={provider?.getSigner()}
    >
      <TokensPage />
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
