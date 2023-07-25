import EvmWalletContainer from "@dexkit/ui/modules/wallet/components/containers/EvmWalletContainer";

import { WalletPageSection } from "@dexkit/ui/modules/wizard/types";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";

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
