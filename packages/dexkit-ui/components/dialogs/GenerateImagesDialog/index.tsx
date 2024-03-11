import { AppDialogTitle } from "@dexkit/ui";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useGenVariants, useSaveImages } from "../../../hooks/ai";
import {
  usePlanCheckoutMutation,
  useSubscription,
} from "../../../hooks/payments";
import EditTab from "./EditTab";
import GenerateTab from "./GenerateTab";
import SelectTab from "./SelectTab";
import VariantsTab from "./VariantsTab";

export interface GenerateImagesDialogProps {
  DialogProps: DialogProps;
  tab?: string;
  image?: string;
}

export default function GenerateImagesDialog({
  DialogProps,
  tab,
  image,
}: GenerateImagesDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const { isLoading: isSavingImages, mutateAsync: saveImages } =
    useSaveImages();

  const [selectedTab, setTab] = useState(tab ? tab : "select");

  const [varImgUrl, setVarImgUrl] = useState<string | undefined>(
    image ? image : undefined
  );

  const {
    mutateAsync: genVariants,
    isLoading: isGenVariants,
    data: variants,
    reset: resetGenVariants,
  } = useGenVariants();

  const handleCancelVariant = () => {
    setTab("select");
    resetGenVariants();
  };

  const handleOpenMenu = useCallback(
    (opt: string, { url }: { url: string }) => {
      setVarImgUrl(url);
      if (opt === "variant") {
        setTab("variants");
        resetGenVariants();
      } else if (opt === "edit") {
        setTab("edit");
      }
    },
    []
  );

  const handleGenVariants = useCallback(
    async ({ numImages }: { numImages: number }) => {
      if (varImgUrl) {
        await genVariants({ numImages: numImages, url: varImgUrl });
      }
    },
    [varImgUrl]
  );

  const { data: sub, refetch: refetchSub } = useSubscription();

  const { mutateAsync: checkoutPlan, isLoading } = usePlanCheckoutMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubscribe = async () => {
    try {
      await checkoutPlan({ plan: "free" });

      enqueueSnackbar(
        <FormattedMessage id="ai.activated" defaultMessage="AI Activated" />,
        { variant: "success" }
      );

      await refetchSub();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const handleEdit = () => {
    setTab("edit");
  };

  const handleVariants = () => {
    setTab("variants");
  };

  const renderContent = () => {
    if (!sub) {
      return (
        <Stack sx={{ p: 2 }} spacing={2} alignItems="center">
          <AutoFixHighIcon fontSize="large" />
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="ai.assistant"
                defaultMessage="AI Assistant"
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="unlock.the.power.of.artificial.intelligence.by.activating.it"
                defaultMessage="Unlock the power of artificial intelligence by activating it"
              />
            </Typography>
          </Box>
          <Button onClick={handleSubscribe} variant="contained">
            <FormattedMessage id="activate.ai" defaultMessage="Activate AI" />
          </Button>
        </Stack>
      );
    }

    return (
      <Stack sx={{ p: 2 }} spacing={2}>
        {selectedTab === "select" && varImgUrl && (
          <SelectTab
            imageUrl={varImgUrl}
            onEdit={handleEdit}
            onGenVariants={handleVariants}
            key={varImgUrl}
          />
        )}
        {selectedTab === "generator" && (
          <GenerateTab
            onMenuOption={handleOpenMenu}
            disabled={isSavingImages}
            key={varImgUrl}
          />
        )}
        {selectedTab === "variants" && varImgUrl && (
          <VariantsTab
            onCancel={handleCancelVariant}
            onMenuOption={handleOpenMenu}
            disabled={isSavingImages}
            isLoading={isGenVariants}
            onGenVariants={handleGenVariants}
            variants={variants || []}
            imageUrl={varImgUrl}
            key={varImgUrl}
          />
        )}
        {selectedTab === "edit" && varImgUrl && (
          <EditTab
            key={varImgUrl}
            imageUrl={varImgUrl}
            onMenuOption={handleOpenMenu}
          />
        )}
      </Stack>
    );
  };

  return (
    <>
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
          {renderContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
