import { ChainId } from '@dexkit/core';
import { SwapWidget } from '@dexkit/widgets';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import { useWeb3React } from '@web3-react/core';
import { useSwapState } from 'src/hooks/swap';

import { useCurrency } from '../../../hooks/currency';
import { SwapPageSection } from '../../../types/config';

interface Props {
  section: SwapPageSection;
}

export function SwapSection({ section }: Props) {
  const currency = useCurrency();
  const { chainId } = useWeb3React();
  const swapState = useSwapState();

  return (
    <Box py={4}>
      <Container maxWidth={'xs'}>
        <SwapWidget
          {...swapState}
          renderOptions={{
            ...swapState.renderOptions,
            configsByChain: section.config?.configByChain
              ? section.config?.configByChain
              : {},
            currency,
            defaultChainId:
              chainId || section.config?.defaultChainId || ChainId.Ethereum,
            zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
            transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
          }}
        />
      </Container>
    </Box>
  );
}

export default SwapSection;
