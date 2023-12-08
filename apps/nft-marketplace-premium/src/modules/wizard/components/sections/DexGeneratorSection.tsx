import { Container } from '@mui/material';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { DexGeneratorPageSection } from '../../types/section';
import CollectionSection from './CollectionSection';
import EditionDropSection from './EditionDropSection';
import NftDropSection from './NftDropSection';
import TokenDropSection from './TokenDropSection';
import TokenErc20Section from './TokenErc20Section';

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
      } else if (type === 'token') {
        return <TokenErc20Section section={section.section} />;
      } else if (type === 'collection') {
        return <CollectionSection section={section.section} />;
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
