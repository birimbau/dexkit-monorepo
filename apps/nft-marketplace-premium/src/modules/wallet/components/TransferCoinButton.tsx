import { convertTokenToEvmCoin } from '@dexkit/core/utils';
import Button from '@mui/material/Button';
import { useWeb3React } from '@web3-react/core';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTokenList } from 'src/hooks/blockchain';
const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog'
    )
);

export function TransferCoinButton() {
  const [open, setOpen] = useState<boolean>(false);
  const { account, chainId, provider, ENSName } = useWeb3React();
  const tokens = useTokenList({ chainId, includeNative: true });

  return (
    <>
      {open && (
        <EvmTransferCoinDialog
          dialogProps={{
            open,
            onClose: () => {
              setOpen(false);
            },
            fullWidth: true,
            maxWidth: 'sm',
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            provider: provider,
            coins: tokens.map(convertTokenToEvmCoin),
          }}
        />
      )}

      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        color="primary"
        disabled={!account}
      >
        <FormattedMessage id="send" defaultMessage="send" />
      </Button>
    </>
  );
}
