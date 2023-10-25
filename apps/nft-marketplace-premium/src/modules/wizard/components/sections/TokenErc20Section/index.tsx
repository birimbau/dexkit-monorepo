import { CoinTypes, TOKEN_ICON_URL } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { EvmCoin } from '@dexkit/core/types';
import { convertTokenToEvmCoin } from '@dexkit/core/utils';
import { useAsyncMemo } from '@dexkit/widgets/src/hooks';
import { Box, Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useContract } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTokenList } from 'src/hooks/blockchain';
import { getChainIdFromSlug } from 'src/utils/blockchain';
import { TokenErc20PageSection } from '../../../types/section';
import TokenSummary from './TokenSummary';

export interface TokenErc20SectionProps {
  section: TokenErc20PageSection;
}

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog'
    ),
);

const EvmBurnTokenDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-burn-token/components/dialogs/EvmBurnTokenDialog'
    ),
);

export default function TokenErc20Section({ section }: TokenErc20SectionProps) {
  const { address, network, disableBurn, disableInfo, disableTransfer } =
    section.settings;

  const { data: contract } = useContract(address, 'token');

  const { account, provider, ENSName, chainId } = useWeb3React();

  const tokens = useTokenList({ chainId, includeNative: true });

  const [showTransfer, setShowTransfer] = useState(false);
  const [showBurn, setShowBurn] = useState(false);

  const handleOpenTransfer = () => {
    setShowTransfer(true);
  };

  const handleOpenBurn = () => {
    setShowBurn(true);
  };

  const handleCloseTransfer = () => {
    setShowTransfer(false);
  };

  const handeCloseBurnToken = () => {
    setShowBurn(false);
  };

  const token = useAsyncMemo(
    async () => {
      return await contract?.get();
    },
    undefined,
    [contract],
  );

  const net = useMemo(() => {
    let chain = getChainIdFromSlug(network);

    const net = chain ? NETWORKS[chain.chainId] : undefined;

    return net;
  }, [network]);

  const defaultToken: EvmCoin = useMemo(() => {
    return {
      coinType: CoinTypes.EVM_ERC20,
      contractAddress: address,
      decimals: token?.decimals || 0,
      name: token?.name || '',
      symbol: token?.symbol || '',
      network: {
        id: net?.slug || '',
        name: net?.name || '',
        chainId: net?.chainId,
        coingeckoPlatformId: net?.coingeckoPlatformId,
        icon: net?.imageUrl,
      },
    };
  }, [token, net]);

  return (
    <>
      {showTransfer && (
        <EvmTransferCoinDialog
          dialogProps={{
            open: showTransfer,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseTransfer,
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            provider: provider,
            coins: tokens.map(convertTokenToEvmCoin),
            defaultCoin: defaultToken,
          }}
        />
      )}

      {showBurn && net && token && (
        <EvmBurnTokenDialog
          DialogProps={{
            open: showBurn,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handeCloseBurnToken,
          }}
          chainId={chainId}
          account={account}
          token={{
            address: address,
            chainId: net.chainId,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
            logoURI: TOKEN_ICON_URL(address, net.chainId),
          }}
        />
      )}

      <Container>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TokenSummary address={address} />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  {!disableTransfer && (
                    <Button variant="contained" onClick={handleOpenTransfer}>
                      <FormattedMessage
                        id="transfer"
                        defaultMessage="Transfer"
                      />
                    </Button>
                  )}
                  {!disableBurn && (
                    <Button onClick={handleOpenBurn} variant="outlined">
                      <FormattedMessage id="burn" defaultMessage="Burn" />
                    </Button>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
