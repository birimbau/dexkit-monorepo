import EvmTransferCoin from '@dexkit/ui/modules/evm-transfer-coin/components/EvmTransferCoin';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useWeb3React } from '@web3-react/core';

import { FormattedMessage } from 'react-intl';

import { PageHeader } from 'src/components/PageHeader';
import { useEvmCoins, useParsePaymentRequest } from 'src/hooks/blockchain';

interface Props {
  paymentURL?: string;
}

function SendContainer({ paymentURL }: Props) {
  const theme = useTheme();
  const { account, chainId, provider } = useWeb3React();
  const paymentUrlParsed = useParsePaymentRequest({ paymentURL });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const evmCoins = useEvmCoins({ defaultChainId: paymentUrlParsed?.chainId });

  return (
    <>
      <Box>
        <Container>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage id="wallet" defaultMessage="Wallet" />
                    ),
                    uri: '/wallet',
                  },
                  {
                    caption: (
                      <FormattedMessage id="send" defaultMessage="Send" />
                    ),
                    uri: '/wallet/send',
                    active: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <EvmTransferCoin
                account={account}
                defaultCoin={paymentUrlParsed?.defaultCoin}
                chainId={paymentUrlParsed?.chainId}
                amount={
                  paymentUrlParsed?.amount
                    ? Number(paymentUrlParsed?.amount)
                    : undefined
                }
                provider={provider}
                coins={evmCoins}
                to={paymentUrlParsed?.to}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default SendContainer;
