import { Box, Container, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import ActionButton from './ActionButton';

import tradeButtonImage from '../../../../public/assets/images/trade-button.svg';

import connectWalletImage from '../../../../public/assets/images/connect-wallet-background.svg';

interface Props {
  noInteract?: boolean;
}

export function ActionButtonsSection({ noInteract }: Props) {
  return (
    <Box py={4}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ActionButton
              title={
                <FormattedMessage
                  id="connect.wallet"
                  defaultMessage="Connect wallet"
                />
              }
              subtitle={
                <FormattedMessage
                  id="connect.now"
                  defaultMessage="Connect now"
                />
              }
              backgroundImage={connectWalletImage.src}
              href={noInteract ? 'javascript:void(0)' : '/wallet/connect'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ActionButton
              title={<FormattedMessage id="swap" defaultMessage="Swap" />}
              subtitle={<FormattedMessage id="open" defaultMessage="Open" />}
              href={noInteract ? 'javascript:void(0)' : '/swap'}
              backgroundImage={tradeButtonImage.src}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ActionButtonsSection;
