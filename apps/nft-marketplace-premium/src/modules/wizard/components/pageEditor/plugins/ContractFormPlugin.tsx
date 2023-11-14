import type { CellPlugin } from '@react-page/editor';
import ContractForm from '../../forms/ContractForm';

import { ContractFormParams } from '@dexkit/web3forms/types';

import ContractFormView from '@dexkit/web3forms/components/ContractFormView';
import { Box } from '@mui/material';

// you can pass the shape of the data as the generic type argument
const ContractFormPlugin: CellPlugin<ContractFormParams> = {
  Renderer: ({ data, isEditMode }) =>
    data.abi ? (
      <Box sx={{ p: 2 }}>
        <ContractFormView params={data} />
      </Box>
    ) : null,
  id: 'contract-form-settings-plugin',
  title: 'Contract',
  description: 'Contract form',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => (
      <Box p={2}>
        <ContractForm
          updateOnChange
          params={data}
          onChange={onChange}
          onSave={onChange}
        />
      </Box>
    ),
  },
};

export default ContractFormPlugin;
