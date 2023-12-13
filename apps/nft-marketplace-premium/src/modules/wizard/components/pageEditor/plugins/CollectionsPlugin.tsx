import type { CellPlugin } from '@react-page/editor';

import { CollectionPageSection } from '@/modules/wizard/types/section';
import { Box } from '@mui/material';
import CollectionSectionFormAlt from '../../forms/CollectionSectionFormAlt';
import CollectionSection from '../../sections/CollectionSection';

// you can pass the shape of the data as the generic type argument
const CollectionsPlugin: CellPlugin<{
  section?: CollectionPageSection;
}> = {
  Renderer: ({ data, isEditMode }) => {
    return data.section ? <CollectionSection section={data.section} /> : null;
  },
  id: 'collection-new',
  title: 'Collection',
  description: 'Show a collection',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Box p={2}>
          <CollectionSectionFormAlt
            onCancel={() => {}}
            section={data.section}
            onSave={(section: CollectionPageSection) => {
              onChange({ section });
            }}
            onChange={(section: CollectionPageSection) => {
              onChange({ section });
            }}
          />
        </Box>
      );
    },
  },
};

export default CollectionsPlugin;
