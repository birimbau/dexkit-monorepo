import { Container } from "@mui/material";
import type { CellPlugin } from "@react-page/editor";
import CarouselSection from "../../sections/CarouselSection";
// you can pass the shape of the data as the generic type argument
const CarouselPlugin: CellPlugin<any> = {
  Renderer: ({ data, isEditMode }) => {
    if (!data) {
      return <></>;
    }

    return (
      <CarouselSection
        section={{
          type: "carousel",
          settings: {
            slides: data.slides || [],
            interval: data.interval,
            height: data.height,
          },
        }}
      />
    );
  },
  id: "carousel-plugin",
  title: "Carousel",
  description: "Image carousel",
  version: 1,
};

export default CarouselPlugin;
