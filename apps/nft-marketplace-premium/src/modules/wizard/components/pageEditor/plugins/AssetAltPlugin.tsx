import type { CellPlugin } from '@react-page/editor';

import { AssetFormType } from '@/modules/wizard/types';
import dynamic from 'next/dynamic';
import AssetSectionForm from '../../forms/AssetSectionForm';

const AssetSection = dynamic(() => import('../../sections/AssetSection/index'));

// you can pass the shape of the data as the generic type argument
const AssetAltPlugin: CellPlugin<AssetFormType> = {
  Renderer: ({ data, isEditMode, onChange }) => {
    return (
      <AssetSection
        section={{ config: data, type: 'asset-section' }}
        key={JSON.stringify(data)}
      />
    );
  },
  id: 'asset-alt-plugin',
  title: 'Asset Section',
  description: 'Asset Section',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <AssetSectionForm
          section={{ type: 'asset-section', config: data }}
          onChange={(section) => {
            onChange(section.config);
          }}
          onCancel={() => {}}
          onSave={() => {}}
        />
      );
    },
  },
};

export default AssetAltPlugin;
