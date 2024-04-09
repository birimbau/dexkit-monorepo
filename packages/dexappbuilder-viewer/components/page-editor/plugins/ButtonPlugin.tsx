import type { CellPlugin } from "@react-page/editor";

import Link from "@dexkit/ui/components/AppLink";
import { Box, Button } from "@mui/material";
import { useMemo } from "react";

type Data = {
  variant: "text" | "contained" | "outlined";
  color:
    | "secondary"
    | "success"
    | "error"
    | "inherit"
    | "primary"
    | "info"
    | "warning";
  size: "small" | "medium" | "large";
  href: string;
  text: string;
  padding: number;
  pageUri: string;
  action: string;
  fullWidth: boolean;
  position: string;
  targetBlank: boolean;
};

// you can pass the shape of the data as the generic type argument
const ButtonPlugin: CellPlugin<Data> = {
  Renderer: ({ data, isEditMode }) => {
    const href = data.pageUri || data.href;
    //    const openInNewWindow = data?.targetBlank;
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

    return (
      <Box sx={{ p: data.padding }} display={"flex"} justifyContent={position}>
        {data.targetBlank ? (
          <Link
            href={href}
            target={"_blank"}
            variant={"inherit"}
            sx={{ color: data.color }}
            underline={"none"}
          >
            <Button
              variant={data.variant ? data.variant : undefined}
              color={data.color ? data.color : undefined}
              size={data.size ? data.size : undefined}
              fullWidth={data.fullWidth}
              onClick={isEditMode ? (e) => e.preventDefault() : undefined}
            >
              {data.text ? data.text : "Button"}
            </Button>
          </Link>
        ) : (
          <Button
            variant={data.variant ? data.variant : undefined}
            color={data.color ? data.color : undefined}
            size={data.size ? data.size : undefined}
            fullWidth={data.fullWidth}
            href={href}
            onClick={isEditMode ? (e) => e.preventDefault() : undefined}
          >
            {data.text ? data.text : "Button"}
          </Button>
        )}
      </Box>
    );
  },
  id: "button-dexkit-plugin",
  title: "Button",
  description: "Add button with actions",
  version: 1,
};

export default ButtonPlugin;
