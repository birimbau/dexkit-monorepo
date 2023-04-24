import { Grid } from '@mui/material';
import { AppPageSection, ContractPageSection } from '../../types/section';

import { ContractFormParams } from '@dexkit/web3forms/types';
import ContractForm from './ContractForm';

interface Props {
  onSave: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: ContractPageSection;
}
export function ContractSectionForm({ onSave, onCancel, section }: Props) {
  const handleSaveData = (data: ContractFormParams | undefined) => {
    onSave({
      type: 'contract',
      config: data,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ContractForm
          params={section?.config}
          onCancel={onCancel}
          onChange={handleSaveData}
        />
      </Grid>
    </Grid>
  );
}
