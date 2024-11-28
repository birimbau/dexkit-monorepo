import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import ShareDialogV2 from "@dexkit/ui/components/dialogs/ShareDialogV2";
import Add from "@mui/icons-material/Add";
import { useState } from "react";
import CheckoutsTable from "../CheckoutsTable";
import DashboardLayout from "../layouts/DashboardLayout";
import useParams from "./hooks/useParams";

export default function CheckoutsContainer() {
  const [url, setUrl] = useState<string>();

  const handleShare = (url: string) => {
    setUrl(url);
  };

  const handleClose = () => {
    setUrl(undefined);
  };

  const handleShareContent = (value: string) => {};

  const { setContainer } = useParams();

  return (
    <>
      {url && (
        <ShareDialogV2
          url={url}
          DialogProps={{
            open: true,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleClose,
          }}
          onClick={handleShareContent}
        />
      )}

      <DashboardLayout page="checkouts">
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6">
              <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <FormattedMessage
                id="create.and.share.product.checkouts.with.your.customers"
                defaultMessage="Create and share product checkouts with your customers."
              />
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setContainer("commerce.checkouts.create");
              }}
            >
              <FormattedMessage
                id="new.checkout"
                defaultMessage="New Checkout"
              />
            </Button>
          </Stack>
          <CheckoutsTable onShare={handleShare} />
        </Stack>
      </DashboardLayout>
    </>
  );
}
