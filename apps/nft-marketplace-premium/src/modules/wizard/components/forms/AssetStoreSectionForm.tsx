import { useState } from 'react';
import { AppPageSection, AssetStorePageSection } from '../../types/section';
import AssetStoreForm from './AssetStoreForm';

interface Props {
  onSave: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: AssetStorePageSection;
}
export function AssetStoreSectionForm({ onSave, onCancel, section }: Props) {
  const [data, setData] = useState(section?.config);

  return (
    <AssetStoreForm
      item={data}
      onChange={(d) => setData(d)}
      onSubmit={(val) => {
        onSave({
          type: 'asset-store',
          title: val.title,
          config: val,
        });
      }}
      onCancel={onCancel}
    />
  );
}
