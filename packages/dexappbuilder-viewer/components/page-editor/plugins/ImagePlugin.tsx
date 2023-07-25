import { AppLink } from "@dexkit/ui/components";
import { DEXKIT_BASE_FILES_HOST } from "@dexkit/ui/constants";
import ImageIcon from "@mui/icons-material/Landscape";
import { Stack } from "@mui/material";
import type { CellPlugin } from "@react-page/editor";
import Image from "next/image";
import { useMemo } from "react";
import { PagesPicker } from "../components/ActionsPicker";
type Data = {
  src: string;
  alt: string;
  width: number;
  height: number;
  position: string;
  href: string;
  pageUri: string;
  action: string;
  targetBlank: boolean;
  padding: number;
};

// you can pass the shape of the data as the generic type argument
const ImagePlugin: CellPlugin<Data> = {
  Renderer: ({ data, isEditMode }) => {
    const src = data?.src;
    const alt = data?.alt;
    const openInNewWindow = data?.targetBlank;
    let image;
    if (src && src.startsWith(DEXKIT_BASE_FILES_HOST)) {
      image = (
        <Image
          alt={alt || "Image"}
          src={src}
          height={data.height ? data.height : 250}
          width={data.width ? data.width : 250}
        />
      );
    } else {
      image = (
        <img
          alt={alt || "Image"}
          src={src}
          height={data.height ? data.height : 250}
          width={data.width ? data.width : 250}
        />
      );
    }

    const position = useMemo(() => {
      if (data.position === "center") {
        return "center";
      }
      if (data.position === "start") {
        return "flex-start";
      }
      if (data.position === "end") {
        return "flex-end";
      }
    }, [data.position]);

    return data.src ? (
      data.href ? (
        <Stack alignItems={position} sx={{ p: data.padding }}>
          <AppLink
            onClick={isEditMode ? (e) => e.preventDefault() : undefined}
            href={data?.href}
            target={openInNewWindow ? "_blank" : undefined}
            rel={openInNewWindow ? "noreferrer noopener" : undefined}
          >
            {image}
          </AppLink>
        </Stack>
      ) : !data.href && !data.pageUri ? (
        <Stack alignItems={position} sx={{ p: data.padding }}>
          {image}
        </Stack>
      ) : data.pageUri ? (
        <Stack alignItems={position} sx={{ p: data.padding }}>
          <AppLink
            href={data.pageUri}
            onClick={isEditMode ? (e) => e.preventDefault() : undefined}
            target={openInNewWindow ? "_blank" : undefined}
            rel={openInNewWindow ? "noreferrer noopener" : undefined}
          >
            {image}
          </AppLink>
        </Stack>
      ) : (
        <></>
      )
    ) : (
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        alignContent={"center"}
      >
        <ImageIcon sx={{ width: 250, height: 250 }} />
      </Stack>
    );
  },
  id: "image-dexkit-plugin",
  title: "Image",
  description: "Add Image from url or gallery",
  version: 1,
  controls: [
    {
      title: "From Gallery",
      controls: {
        type: "autoform",
        schema: {
          // this JSONschema is type checked against the generic type argument
          // the autocompletion of your IDE helps to create this schema
          properties: {
            /* we are commenting this for now
           
           src: {
              type: "string",
              title: "Image",
              uniforms: {
                component: ImagePicker,
              },
            },*/

            alt: {
              type: "string",
              title: "Image alternative description",
            },
            width: {
              type: "number",
              default: 250,
              title: "Image width in px",
            },
            height: {
              type: "number",
              default: 250,
              title: "Image height in px",
            },
            position: {
              type: "string",
              title: "Position",
              enum: ["center", "start", "end"],
            },
            padding: {
              type: "number",
              default: 0,
              minimum: 0,
            },
            action: {
              type: "string",
              enum: ["Open page", "Open link"],
              title: "Choose action on click",
            },

            href: {
              type: "string",
              title: "Link to open image click",
              uniforms: {
                showIf(data) {
                  return data.action === "Open link";
                },
              },
            },
            pageUri: {
              type: "string",
              uniforms: {
                component: PagesPicker,
                showIf(data) {
                  return data.action === "Open page";
                },
              },
            },
            targetBlank: {
              type: "boolean",
              title: "Open in new tab?",
              uniforms: {
                showIf(data) {
                  return (
                    data.action == "Open page" || data.action == "Open link"
                  );
                },
              },
            },
          },
          required: ["src", "width", "height", "alt"],
        },
      },
    },
    {
      title: "From Url",
      controls: {
        type: "autoform",
        schema: {
          // this JSONschema is type checked against the generic type argument
          // the autocompletion of your IDE helps to create this schema
          properties: {
            src: {
              type: "string",
              title: "Image Url",
            },
            alt: {
              type: "string",
              title: "Image alternative description",
            },
            width: {
              type: "number",
              title: "Image width in px",
            },
            height: {
              type: "number",
              title: "Image height in px",
            },
            position: {
              type: "string",
              title: "Position",
              enum: ["center", "start", "end"],
            },
            padding: {
              type: "number",
              default: 2,
              minimum: 0,
            },
            action: {
              type: "string",
              enum: ["Open page", "Open link"],
              title: "Choose action on click",
            },
            href: {
              type: "string",
              title: "Link to open image click",
              uniforms: {
                showIf(data) {
                  return data.action === "Open link";
                },
              },
            },
            pageUri: {
              type: "string",
              uniforms: {
                component: PagesPicker,
                showIf(data) {
                  return data.action === "Open page";
                },
              },
            },
            targetBlank: {
              type: "boolean",
              title: "Open in new tab?",
              uniforms: {
                showIf(data) {
                  return (
                    data.action == "Open page" || data.action == "Open link"
                  );
                },
              },
            },
          },
          required: ["src"],
        },
      },
    },
  ],
};

export default ImagePlugin;
