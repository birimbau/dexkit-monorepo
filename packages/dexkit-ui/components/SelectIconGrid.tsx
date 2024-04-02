import { Grid, IconButton, SvgIcon } from "@mui/material";

import * as mui from "@mui/icons-material";
import { useMemo } from "react";

export interface SelectIconGridProps {}

export default function SelectIconGrid({}: SelectIconGridProps) {
  const icons = useMemo(() => {
    return Object.keys(mui);
  }, []);

  return (
    <Grid container spacing={2}>
      {icons.map((importName: string) => (
        <Grid item xs={3}>
          <IconButton>
            <SvgIcon component={mui[importName as keyof typeof mui]} />
          </IconButton>
        </Grid>
      ))}
    </Grid>
  );
}
