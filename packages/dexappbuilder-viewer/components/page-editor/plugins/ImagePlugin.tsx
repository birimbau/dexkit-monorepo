import ImageIcon from "@mui/icons-material/Landscape";
import type { CellPlugin } from "@react-page/editor";

import Link from "@dexkit/ui/components/AppLink";
import { DEXKIT_BASE_FILES_HOST } from "@dexkit/ui/constants";
import { Stack } from "@mui/material";
import Image from "next/legacy/image";
import { useMemo } from "react";

type Data = {
  src: string;
  alt: string;
  width: number;
  height: number;
  position: string;
  borderRadius: number;
  href: string;
  pageUri: string;
  action: string;
  targetBlank: boolean;
  padding: number;
  priority: boolean;
};

// you can pass the shape of the data as the generic type argument
const ImagePlugin: CellPlugin<Data> = {
  Renderer: ({ data, isEditMode }) => {
    const src = data?.src;
    const alt = data?.alt;
    const priority = data?.priority ? true : false;
    const openInNewWindow = data?.targetBlank;
    let image;
    if (src && src.startsWith(DEXKIT_BASE_FILES_HOST)) {
      image = (
        <Image
          alt={alt || "Image"}
          style={{
            borderRadius: data.borderRadius
              ? `${data.borderRadius}%`
              : undefined,
          }}
          src={src}
          priority={priority}
          height={data.height ? data.height : 250}
          width={data.width ? data.width : 250}
        />
      );
    } else {
      image = (
        <img
          alt={alt || "Image"}
          style={{
            borderRadius: data.borderRadius
              ? `${data.borderRadius}%`
              : undefined,
          }}
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
          <Link
            onClick={isEditMode ? (e) => e.preventDefault() : undefined}
            href={data?.href}
            target={openInNewWindow ? "_blank" : undefined}
            rel={openInNewWindow ? "noreferrer noopener" : undefined}
          >
            {image}
          </Link>
        </Stack>
      ) : !data.href && !data.pageUri ? (
        <Stack alignItems={position} sx={{ p: data.padding }}>
          {image}
        </Stack>
      ) : data.pageUri ? (
        <Stack alignItems={position} sx={{ p: data.padding }}>
          <Link
            href={data.pageUri}
            onClick={isEditMode ? (e) => e.preventDefault() : undefined}
            target={openInNewWindow ? "_blank" : undefined}
            rel={openInNewWindow ? "noreferrer noopener" : undefined}
          >
            {image}
          </Link>
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
};

export default ImagePlugin;
