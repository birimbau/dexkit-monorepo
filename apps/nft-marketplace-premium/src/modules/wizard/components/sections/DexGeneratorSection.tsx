import { Container } from '@mui/material';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { DexGeneratorPageSection } from '../../types/section';
import EditionDropSection from './EditionDropSection';
import NftDropSection from './NftDropSection';
import TokenDropSection from './TokenDropSection';

export interface DabSectionProps {
  section?: DexGeneratorPageSection;
}

export default function DexGeneratorSection({ section }: DabSectionProps) {
  const { provider } = useWeb3React();

  const renderSection = () => {
    if (section?.section) {
      const { type } = section.section;

      if (type === 'token-drop') {
        return <TokenDropSection section={section.section} />;
      } else if (type === 'nft-drop') {
        return <NftDropSection section={section.section} />;
      } else if (type === 'edition-drop-section') {
        return <EditionDropSection section={section.section} />;
      }
    }

    return null;
  };

  return (
    <Container sx={{ py: 2 }}>
      <ThirdwebSDKProvider
        signer={provider?.getSigner()}
        activeChain={section?.contract?.chainId}
        clientId={THIRDWEB_CLIENT_ID}
      >
        {renderSection()}
      </ThirdwebSDKProvider>
    </Container>
  );
}

function Wrapper() {
  return;
}
