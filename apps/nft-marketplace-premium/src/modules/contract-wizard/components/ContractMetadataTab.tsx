import { Box, CircularProgress, Grid } from '@mui/material';
import {
  useContract,
  useContractMetadata,
  useContractMetadataUpdate,
} from '@thirdweb-dev/react';
import { ContractMetadataFormType } from '../types';
import MetadataUpdateForm from './form/MetadataUpdateForm';

export interface ContractMetadataTabProps {
  address?: string;
}

export default function ContractMetadataTab({
  address,
}: ContractMetadataTabProps) {
  const { data: contract } = useContract(address);
  const updateMutation = useContractMetadataUpdate(contract);
  const contractMetadata = useContractMetadata(contract);

  const handleSubmit = async (values: ContractMetadataFormType) => {
    await updateMutation.mutateAsync(values);
  };

  if (!contractMetadata.isSuccess && !contractMetadata.data) {
    return (
      <Box sx={{ py: 4 }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <CircularProgress color="primary" size="2rem" />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <MetadataUpdateForm onSubmit={handleSubmit} data={contractMetadata.data} />
  );
}
