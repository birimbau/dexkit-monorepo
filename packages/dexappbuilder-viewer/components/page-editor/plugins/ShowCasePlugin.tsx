import { ShowCaseParams } from "@dexkit/ui/modules/wizard/types/section";
import { Container } from "@mui/material";
import type { CellPlugin } from "@react-page/editor";
import ShowCaseSection from "../../sections/ShowCaseSection";

// you can pass the shape of the data as the generic type argument
const ShowCasePlugin: CellPlugin<ShowCaseParams> = {
  Renderer: ({ data, isEditMode }) => {
    if (!data) {
      return <></>;
    }

    return (
      <ShowCaseSection
        section={{
          type: "showcase",
          settings: {
            paddingTop: data.paddingTop || 0,
            paddingBottom: data.paddingBottom || 0,
            items: data.items || [],
            alignItems: data.alignItems || "left",
            itemsSpacing: data.itemsSpacing || 2,
          },
        }}
      />
    );
  },
  id: "showcase-plugin",
  title: "Showcase",
  description: "Showcase gallery",
  version: 1,
};

export default ShowCasePlugin;
