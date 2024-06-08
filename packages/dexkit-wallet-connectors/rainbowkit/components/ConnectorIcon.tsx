import { useAsyncImage } from "../hooks/useAsyncImage";

import Avatar from "@mui/material/Avatar";

import { lighten } from "@mui/material";

export function ConnectorIcon({ name, icon }: { name?: string; icon?: any }) {
  const image = useAsyncImage(icon);

  return (
    <Avatar
      sx={(theme) => ({
        background: lighten(theme.palette.background.default, 0.05),
        padding: theme.spacing(1),
        width: "auto",
        height: theme.spacing(5),
      })}
      src={typeof image === "string" ? image : image?.src}
      alt={name || "connector-icon"}
    />
  );
}
