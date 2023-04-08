import EvmWalletContainer from '@/modules/wallet/components/containers/EvmWalletContainer';
import { WalletPageSection } from '@/modules/wizard/types/section';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';

interface Props {
  section: WalletPageSection;
}

export function WalletSection({ section }: Props) {
  return (
    <Box py={4}>
      <Container>
        <EvmWalletContainer />
      </Container>
    </Box>
  );
}

export default WalletSection;
