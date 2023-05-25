import type { CellPlugin } from '@react-page/editor';

import { Box } from '@mui/material';
import { UserContractForm } from '../../forms/UserContractForm';
import UserContractSection from '../../sections/UserContractSection';

// you can pass the shape of the data as the generic type argument
const UserContractFormPlugin: CellPlugin<{ formId?: number }> = {
  Renderer: ({ data, isEditMode }) => {
    return data.formId ? (
      <UserContractSection
        section={{ formId: data.formId, type: 'user-contract-form' }}
      />
    ) : null;
  },
  id: 'user-contract-form-plugin',
  title: 'User Contract Form',
  description: 'User Contract Form',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Box p={2}>
          <UserContractForm
            onCancel={() => {}}
            onSave={(formId?: number) => {
              if (formId) {
                onChange({ formId });
              }
            }}
            formId={data.formId}
            saveOnChange
          />
        </Box>
      );
    },
  },
};

export default UserContractFormPlugin;
