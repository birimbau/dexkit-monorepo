import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContract, useContractType } from '@thirdweb-dev/react';

interface Props {
  address: string;
  network: string;
}

export function ContractNftContainer({ address, network }: Props) {
  const contract = useContract(address);
  const { data, isLoading, error } = useContractType(address);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button variant={'outlined'}></Button>
      </Grid>
    </Grid>
  );
}
