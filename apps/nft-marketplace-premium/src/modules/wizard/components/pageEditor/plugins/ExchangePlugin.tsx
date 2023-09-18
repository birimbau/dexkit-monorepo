import { RenderOptions } from '@dexkit/widgets/src/widgets/swap/types';

import { useAppWizardConfig } from '@/modules/wizard/hooks';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import SwapWidget from '../components/SwapWidget';

import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';

// you can pass the shape of the data as the generic type argument
const ExchangePlugin: CellPlugin<RenderOptions> = {
  Renderer: ({ data, isEditMode }) => (
    <SwapWidget formData={data} isEditMode={isEditMode} />
  ),
  id: 'exchange-settings-plugin',
  title: 'Exchange plugin',
  description: 'Exchange',
  version: 1,
  controls: {
    type: 'custom',
    Component: (data) => {
      const { wizardConfig } = useAppWizardConfig();

      return (
        <Container sx={{ p: 2 }}>
          <ExchangeSettingsForm
            onCancel={() => {}}
            onSave={() => {}}
            tokens={[]}
          />
        </Container>
      );
    },
  },
};

export default ExchangePlugin;
