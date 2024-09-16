import { Box, Container, Grid, IconButton, Stack } from "@mui/material";

import { DexkitApiProvider } from "@dexkit/core/providers";
import Notifications from "@mui/icons-material/Notifications";
import { MouseEvent, useState } from "react";
import { myAppsApi } from "../../../constants/api";
import NotificationsListPopper from "./NotificationsListPopper";

export interface CommerceUserLayoutProps {
  children: React.ReactNode;
}

function CommerceUserLayoutComponent({ children }: CommerceUserLayoutProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleToggleNotifications = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <NotificationsListPopper
        PopperProps={{
          open: Boolean(anchorEl),
          anchorEl,
          placement: "bottom-end",
        }}
        onClose={handleClose}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Container>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={2}
              >
                <IconButton onClick={handleToggleNotifications}>
                  <Notifications />
                </IconButton>
              </Stack>
            </Box>
          </Container>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </>
  );
}

export default function CommerceUserLayout({
  children,
}: CommerceUserLayoutProps) {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <CommerceUserLayoutComponent children={children} />
    </DexkitApiProvider.Provider>
  );
}
