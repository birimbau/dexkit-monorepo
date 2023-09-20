import { Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContractType } from '@thirdweb-dev/react';
import { ContractMetadataHeader } from '../ContractMetadataHeader';
import { ContractEditionDropContainer } from './ContractEditionDropContainer';

interface Props {
  address: string;
  network: string;
}

export function ContractContainer({ address, network }: Props) {
  const { data, isLoading, error } = useContractType(address);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ContractMetadataHeader
          address={address}
          network={network}
          contractType={data}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {data === 'edition-drop' && (
          <ContractEditionDropContainer address={address} network={network} />
        )}
      </Grid>
    </Grid>
  );
}
