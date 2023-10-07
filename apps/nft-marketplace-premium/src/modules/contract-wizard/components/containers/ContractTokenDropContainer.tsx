import {
  Button,
  Card,
  CardContent,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContract } from '@thirdweb-dev/react';
import { CurrencyValue } from '@thirdweb-dev/sdk/evm';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ClaimConditionsContainer } from './ClaimConditionsContainer';

import AppDataTable from '@dexkit/ui/components/AppDataTable';

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AppDataTable
          dataColumns={[
            {
              headerName: 'Address',
              name: 'address',
              validate: (value: unknown) => {},
            },
            {
              headerName: 'Quantity',
              name: 'quantity',
              validate: (value: unknown) => {},
            },
          ]}
          data={[
            {
              address: '0xD70453969798BfF922A75292F323304765791D12',
              quantity: '0.1',
            },
          ]}
        />
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
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained">
                    <FormattedMessage id="burn" defaultMessage="Burn" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained">
                    <FormattedMessage id="airdrop" defaultMessage="Airdrop" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained">
                    <FormattedMessage id="transfer" defaultMessage="Transfer" />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage
                      id="total.supply"
                      defaultMessage="Total Supply"
                    />
                  </Typography>
                  <Typography variant="h5">
                    {contractData ? contractData?.displayValue : <Skeleton />}{' '}
                    {contractData?.symbol.toUpperCase()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage
                      id="your.balance"
                      defaultMessage="Your Balance"
                    />
                  </Typography>
                  <Typography variant="h5">
                    {balance} {contractData?.symbol.toUpperCase()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage id="decimals" defaultMessage="Decimals" />
                  </Typography>
                  <Typography variant="h5">
                    {contractData?.decimals ? (
                      contractData?.decimals
                    ) : (
                      <Skeleton />
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
