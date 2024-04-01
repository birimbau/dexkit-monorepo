import { ShowCaseParams } from '@/modules/wizard/types/section';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import AddShowCaseSectionForm from '../../forms/AddShowCaseSectionForm';
import ShowCaseSection from '../../sections/ShowCaseSection';

// you can pass the shape of the data as the generic type argument
const ShowCasePlugin: CellPlugin<ShowCaseParams> = {
  Renderer: ({ data, isEditMode }) => {
    if (!data) {
      return <></>;
    }

    return (
      <ShowCaseSection
        section={{
          type: 'showcase',
          settings: {
            padding: data.padding || 0,
            items: data.items || [],
            alignItems: data.alignItems || 'left',
            itemsSpacing: data.itemsSpacing || 2,
          },
        }}
      />
    );
  },
  id: 'showcase-plugin',
  title: 'Showcase',
  description: 'Showcase gallery',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Container sx={{ p: 2 }}>
          <AddShowCaseSectionForm
            data={data}
            onChange={(data) => onChange({ ...data })}
            onSave={(data) => onChange({ ...data })}
            saveOnChange
            disableButtons
          />
        </Container>
      );
    },
  },
};

export default ShowCasePlugin;
