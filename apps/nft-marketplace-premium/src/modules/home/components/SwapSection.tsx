import { SwapPageSection } from '@/modules/wizard/types/section';
import { ChainId } from '@dexkit/core';
import { SwapWidget } from '@dexkit/widgets/src/widgets/swap';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import { useWeb3React } from '@web3-react/core';
import { useSwapState } from 'src/hooks/swap';

import { useActiveChainIds } from '@dexkit/ui';
import { useCurrency } from '../../../hooks/currency';

interface Props {
  section: SwapPageSection;
}

export function SwapSection({ section }: Props) {
  const currency = useCurrency();
  const { chainId } = useWeb3React();
  const {activeChainIds} = useActiveChainIds();
  const swapState = useSwapState();

  return (
    <Box py={4}>
      <Container maxWidth={'xs'} disableGutters>
        <SwapWidget
          {...swapState}
          activeChainIds={activeChainIds}
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
