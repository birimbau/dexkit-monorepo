import { Grid } from '@mui/material';
import { AppPageSection, ContractPageSection } from '../../types/section';

import ContractForm from './ContractForm';

interface Props {
  onSave: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: ContractPageSection;
}
export function ContractSectionForm({ onSave, onCancel, section }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ContractForm
          params={section?.config}
          onCancel={onCancel}
          onChange={(d) =>
            onSave({
              type: 'contract',
              config: d,
            })
          }
        />
      </Grid>
    </Grid>
  );
}
