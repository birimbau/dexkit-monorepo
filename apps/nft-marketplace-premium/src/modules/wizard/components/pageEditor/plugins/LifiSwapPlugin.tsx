import { RenderOptions } from '@dexkit/widgets/src/widgets/swap/types';

import { useAppWizardConfig } from '@/modules/wizard/hooks';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import { SwapConfigForm } from '../../forms/SwapConfigForm';
import LiFiSwapWidget from '../components/LiFiSwapWidget';

// you can pass the shape of the data as the generic type argument
const LifiSwapPlugin: CellPlugin<RenderOptions> = {
  Renderer: ({ data, isEditMode }) => {
    return <LiFiSwapWidget formData={data} isEditMode={isEditMode} />;
  },
  id: 'lifi-swap-settings-plugin',
  title: 'Li.Fi swap plugin',
  description: 'Li.Fi Swap',
  version: 1,
  controls: {
    type: 'custom',
    Component: (data) => {
      const { wizardConfig } = useAppWizardConfig();

      return (
        <Container sx={{ p: 2 }}>
          <SwapConfigForm
            data={data.data}
            onChange={data.onChange}
            featuredTokens={
              wizardConfig?.tokens ? wizardConfig?.tokens[0].tokens : undefined
            }
          />
        </Container>
      );
    },
  },
};

export default LifiSwapPlugin;
