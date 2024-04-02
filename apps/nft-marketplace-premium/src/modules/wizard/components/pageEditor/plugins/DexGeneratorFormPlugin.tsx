import type { CellPlugin } from '@react-page/editor';

import { DexkitApiProvider } from '@dexkit/core/providers';
import DexGeneratorSection from '@dexkit/dexappbuilder-viewer/components/sections/DexGeneratorSection';
import { DexGeneratorPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box } from '@mui/material';
import { myAppsApi } from 'src/services/whitelabel';
import DexGeneratorSectionForm from '../../forms/DexGeneratorSectionForm';

// you can pass the shape of the data as the generic type argument
const DexGeneratorFormPlugin: CellPlugin<{
  section?: DexGeneratorPageSection;
}> = {
  Renderer: ({ data, isEditMode }) => {
    return data.section ? (
      <DexGeneratorSection section={data.section} hideGrid={true} />
    ) : null;
  },
  id: 'dex-generator-section',
  title: 'Dex Generator',
  description: 'Dex Generator form',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Box p={2}>
          <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
            <DexGeneratorSectionForm
              onCancel={() => {}}
              section={data.section}
              onSave={(section: DexGeneratorPageSection) => {
                onChange({ section });
              }}
              onChange={(section: DexGeneratorPageSection) => {
                onChange({ section });
              }}
            />
          </DexkitApiProvider.Provider>
        </Box>
      );
    },
  },
};

export default DexGeneratorFormPlugin;
