import { ContractNftContainer } from '@/modules/contract-wizard/components/containers/ContractNftContainer';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import Container from '@mui/material/Container';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function ContractPage() {
  const { query } = useRouter();

  const { address, network } = query;

  const { provider } = useWeb3React();
  console.log(NETWORK_FROM_SLUG(network as string)?.chainId);

  return (
    <ThirdwebSDKProvider
      clientId="8b875cba6d295240d3b3861a3e8c2260"
      activeChain={NETWORK_FROM_SLUG(network as string)?.chainId}
      signer={provider?.getSigner()}
    >
      <Container>
        <ContractNftContainer
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
