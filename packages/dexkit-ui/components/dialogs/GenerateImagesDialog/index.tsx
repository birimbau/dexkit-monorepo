import { AppDialogTitle } from "@dexkit/ui";
import { Box, Dialog, DialogContent, DialogProps } from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import EditTab from "./EditTab";
import GenerateTab from "./GenerateTab";
import VariantsTab from "./VariantsTab";

export interface GenerateImagesDialogProps {
  DialogProps: DialogProps;
  tab?: string;
  image?: string;
}

export default function GenerateImagesDialog({
  DialogProps,
  tab,
}: GenerateImagesDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const handleConfirm = async () => {};

  const [selectedTab, setTab] = useState(tab ? tab : "generator");

  const [varImgUrl, setVarImgUrl] = useState<string>();

  const handleCancelVariant = () => {
    setTab("generator");
    setVarImgUrl(undefined);
  };

  const handleSelectForVariant = (imageUrl: string) => {
    setTab("variants");
    setVarImgUrl(imageUrl);
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="ai.image.generator"
            defaultMessage="AI Image Generator"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          {selectedTab === "generator" && (
            <GenerateTab onSelectForVariant={handleSelectForVariant} />
          )}
          {selectedTab === "variants" && varImgUrl && (
            <VariantsTab imageUrl={varImgUrl} onCancel={handleCancelVariant} />
          )}
          {selectedTab === "edit" && <EditTab />}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
