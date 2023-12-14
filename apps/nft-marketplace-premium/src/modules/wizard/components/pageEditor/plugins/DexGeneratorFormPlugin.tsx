import type { CellPlugin } from '@react-page/editor';

import { DexGeneratorPageSection } from '@/modules/wizard/types/section';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { Box } from '@mui/material';
import { myAppsApi } from 'src/services/whitelabel';
import DexGeneratorSectionForm from '../../forms/DexGeneratorSectionForm';
import DexGeneratorSection from '../../sections/DexGeneratorSection';

// you can pass the shape of the data as the generic type argument
const DexGeneratorFormPlugin: CellPlugin<{
  section?: DexGeneratorPageSection;
}> = {
  Renderer: ({ data, isEditMode }) => {
    return data.section ? <DexGeneratorSection section={data.section} /> : null;
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
