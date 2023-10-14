import TokenDropSummary from '@/modules/wizard/components/TokenDropSummary';
import { CoinTypes } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { EvmCoin } from '@dexkit/core/types';
import { convertTokenToEvmCoin } from '@dexkit/core/utils';
import { useTokenList } from '@dexkit/ui';
import { Button, Divider, Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContract } from '@thirdweb-dev/react';
import { CurrencyValue } from '@thirdweb-dev/sdk/evm';
import { useWeb3React } from '@web3-react/core';
import dynamic from 'next/dynamic';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import BurnTokenDialog from '../dialogs/BurnNftDIalog';
import { ClaimConditionsContainer } from './ClaimConditionsContainer';

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog'
    ),
);

interface ContractTokenDropContainerProps {
  address: string;
  network: string;
}

export function ContractTokenDropContainer({
  address,
  network,
}: ContractTokenDropContainerProps) {
  const { data: contract } = useContract(address, 'token-drop');

  const [contractData, setContractData] = useState<CurrencyValue>();
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    (async () => {
      if (contract) {
        const data = await contract?.totalSupply();

        setContractData(data);

        setBalance((await contract?.erc20.balance()).displayValue);
      }
    })();
  }, [contract]);

  const [currTab, setCurrTab] = useState('token');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  const [showBurn, setShowBurn] = useState(false);

  const handleCloseBurn = () => {
    setShowBurn(false);
  };

  const handleBurn = () => {
    setShowBurn(true);
  };

  const { account, provider, chainId, ENSName } = useWeb3React();

  const tokens = useTokenList({ chainId, includeNative: true });

  const [showTransfer, setShowTransfer] = useState(false);

  const handleCloseTransfer = () => {
    setShowTransfer(false);
  };

  const handleShowTransfer = () => {
    setShowTransfer(true);
  };

  const [token, setToken] = useState<EvmCoin>();

  useEffect(() => {
    (async () => {
      if (chainId) {
        const network = NETWORKS[chainId];

        const meta = await contract?.erc20.get();
        if (meta) {
          setToken({
            coinType: CoinTypes.EVM_ERC20,
            contractAddress: address,
            decimals: meta.decimals,
            symbol: meta.symbol,
            name: meta.name,
            network: {
              id: network.slug || '',
              name: network.name,
              chainId: chainId,
              coingeckoPlatformId: network.coingeckoPlatformId,
              icon: network.imageUrl,
            },
          });
        }
      }
    })();
  }, [address, chainId]);

  return (
    <>
      <BurnTokenDialog
        DialogProps={{
          onClose: handleCloseBurn,
          open: showBurn,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        contractAddress={address}
      />
      <EvmTransferCoinDialog
        dialogProps={{
          open: showTransfer,
          onClose: handleCloseTransfer,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        params={{
          ENSName,
          account: account,
          chainId: chainId,
          provider: provider,
          coins: token
            ? [...tokens.map(convertTokenToEvmCoin), token]
            : tokens.map(convertTokenToEvmCoin),
          defaultCoin: token,
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TokenDropSummary contract={contract} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab value="token" label="Token" />
            <Tab value="claim-conditions" label="Claim Conditions" />
          </Tabs>
        </Grid>
        {currTab === 'claim-conditions' && (
          <Grid item xs={12}>
            <ClaimConditionsContainer address={address} network={network} />
          </Grid>
        )}
        {currTab === 'token' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={handleBurn} variant="contained">
                  <FormattedMessage id="burn" defaultMessage="Burn" />
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleShowTransfer} variant="contained">
                  <FormattedMessage id="transfer" defaultMessage="Transfer" />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}
