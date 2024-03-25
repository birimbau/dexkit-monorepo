import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';

import AddCarouselForm from '@/modules/wizard/components/forms/AddCarouselForm';
import CarouselSection from '@dexkit/dexappbuilder-viewer/components/sections/CarouselSection';
import { CarouselPageSection } from '@dexkit/ui/modules/wizard/types/section';

// you can pass the shape of the data as the generic type argument
const CarouselPlugin: CellPlugin<{ section: CarouselPageSection }> = {
  Renderer: ({ data, isEditMode }) => {
    if (!data.section) {
      return <></>;
    }

    return (
      <CarouselSection
        slides={data.section.settings.slides}
        interval={data.section.settings.interval}
      />
    );
  },
  id: 'carousel-plugin',
  title: 'Carousel',
  description: 'Image carousel',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data: { section }, onChange }) => {
      return (
        <Container sx={{ p: 2 }}>
          <AddCarouselForm
            data={section}
            onChange={(data) => onChange({ section: data })}
            onSave={(data) => onChange({ section: data })}
            saveOnChange
            disableButtons
          />
        </Container>
      );
    },
  },
};

export default CarouselPlugin;
