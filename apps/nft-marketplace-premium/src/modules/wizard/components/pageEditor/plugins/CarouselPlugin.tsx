import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';

import AddCarouselForm from '@/modules/wizard/components/forms/AddCarouselForm';

import CarouselSection from '@/modules/wizard/components/sections/CarouselSection';

// you can pass the shape of the data as the generic type argument
const CarouselPlugin: CellPlugin<{
  interval?: number;
  height?: { desktop?: number; mobile?: number };
  slides: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    action?: {
      textColor?: string;
      caption: string;
      url: string;
      action: string;
    };
  }[];
}> = {
  Renderer: ({ data, isEditMode }) => {
    if (!data) {
      return <></>;
    }

    return (
      <CarouselSection
        section={{
          type: 'carousel',
          settings: {
            slides: data.slides || [],
            interval: data.interval,
            height: data.height,
          },
        }}
      />
    );
  },
  id: 'carousel-plugin',
  title: 'Carousel',
  description: 'Image carousel',
  version: 1,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Container sx={{ p: 2 }}>
          <AddCarouselForm
            data={
              data
                ? data
                : {
                    slides: [],
                    interval: 5000,
                    height: { mobile: 250, desktop: 500 },
                  }
            }
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

export default CarouselPlugin;
