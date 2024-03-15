import type { CellPlugin } from '@react-page/editor';

import { TokenTradePageSection } from '@/modules/wizard/types/section';
import { useAppWizardConfig } from '@dexkit/ui/hooks';
import { Box } from '@mui/material';
import { TokenTradeConfigForm } from '../../forms/TokenTradeConfigForm';
import TokenTradeSection from '../../sections/TokenTradeSection';

// you can pass the shape of the data as the generic type argument
const TokenTradePlugin: CellPlugin<{
  section?: TokenTradePageSection;
}> = {
  Renderer: ({ data, isEditMode }) => {
    return data.section ? <TokenTradeSection section={data.section} /> : null;
  },
  id: 'token-trade-section',
  title: 'Token Trade',
  description: 'Dex Generator form',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      const { wizardConfig } = useAppWizardConfig();
      return (
        <Box p={2}>
          <TokenTradeConfigForm
            data={data.section?.config}
            onChange={(d) =>
              onChange({
                section: {
                  type: 'token-trade',
                  config: d || {},
                },
              })
            }
            featuredTokens={
              wizardConfig?.tokens ? wizardConfig?.tokens[0].tokens : undefined
            }
          />
        </Box>
      );
    },
  },
};

export default TokenTradePlugin;
