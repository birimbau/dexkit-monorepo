import { AppDialogTitle } from "@dexkit/ui";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useGenVariants, useSaveImages } from "../../../hooks/ai";
import { useSubscription } from "../../../hooks/payments";
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
    setSelectable(false);
    setSelected({});
    resetGenVariants();
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [selectable, setSelectable] = useState(false);

  const [selectedUrl, setSelectedUrl] = useState<string>();

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const selectedImages: string[] = useMemo(() => {
    return Object.keys(selected)
      .map((key) => (selected[key] ? key : undefined))
      .filter((r) => r !== undefined) as string[];
  }, [selected]);

  const handleSelect = useCallback((img: string) => {
    setSelected((selected) => {
      const newSelected = { ...selected };

      if (newSelected[img]) {
        newSelected[img] = false;

        const selectedImages = Object.keys(newSelected)
          .map((key) => (newSelected[key] ? key : undefined))
          .filter((r) => r !== undefined) as string[];

        if (selectedImages.length === 0) {
          setSelectable(false);
        }
      } else {
        newSelected[img] = true;
      }

      return newSelected;
    });
  }, []);

  const handleOpenMenu = useCallback(
    (url: string, anchorEl: HTMLElement | null) => {
      setAnchorEl(anchorEl);
      setSelectedUrl(url);
    },
    []
  );

  const handleCloseMenu = () => {
    setSelectedUrl(undefined);
    setAnchorEl(null);
  };

  const handleMenuSelect = () => {
    setSelectable(true);
    handleCloseMenu();
    if (selectedUrl) {
      handleSelect(selectedUrl);
    }
  };

  const handleSelectForVariant = useCallback(() => {
    resetGenVariants();

    setVarImgUrl(selectedUrl);

    if (selectedTab !== "variants") {
      setTab("variants");
    }
  }, [selectedUrl, selectedTab]);

  const handleSelectForEdit = useCallback(() => {
    setVarImgUrl(selectedUrl);

    if (selectedTab !== "edit") {
      setTab("edit");
    }
  }, [selectedUrl, selectedTab]);

  const handleMenuVariant = useCallback(() => {
    handleSelectForVariant();
    handleCloseMenu();
  }, [handleCloseMenu, handleSelectForVariant]);

  const handleMenuEdit = useCallback(() => {
    handleSelectForEdit();
    handleCloseMenu();
  }, [handleCloseMenu, handleSelectForVariant]);

  const handleConfirm = async () => {
    await saveImages({ urls: selectedImages });
    setSelectable(false);
    setSelected({});
  };

  const handleGenVariants = useCallback(
    async ({ numImages }: { numImages: number }) => {
      setSelectable(false);
      setSelected({});
      if (varImgUrl) {
        await genVariants({ numImages: numImages, url: varImgUrl });
      }
    },
    [varImgUrl]
  );

  const handleVariants = () => {
    setTab("variants");
  };

  const handleEdit = () => {
    setTab("edit");
  };

  const { data: sub } = useSubscription();

  const handleSubscribe = () => {
    handleClose();
    window.open("/u/settings?section=billing", "_blank");
  };

  const renderContent = () => {
    if (!sub) {
      return (
        <Stack sx={{ p: 2 }} spacing={2} alignItems="center">
          <AutoFixHighIcon fontSize="large" />
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="subscription"
                defaultMessage="Subscription"
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="unlock.the.power.of.artificial.intelligence.by.subscribing.to.our.plan.today"
                defaultMessage="Unlock the power of artificial intelligence by subscribing to our plan today!"
              />
            </Typography>
          </Box>
          <Button onClick={handleSubscribe} variant="contained">
            <FormattedMessage id="subscribe" defaultMessage="Subscribe" />
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
          />
        )}
        {selectedTab === "generator" && (
          <GenerateTab
            onSelect={handleSelect}
            selected={selected}
            selectable={selectable}
            onOpenMenu={handleOpenMenu}
            selectedImages={selectedImages}
            disabled={isSavingImages}
          />
        )}
        {selectedTab === "variants" && varImgUrl && (
          <VariantsTab
            onCancel={handleCancelVariant}
            onSelect={handleSelect}
            selected={selected}
            selectable={selectable}
            onOpenMenu={handleOpenMenu}
            selectedImages={selectedImages}
            isSavingImages={isSavingImages}
            disabled={isSavingImages}
            isLoading={isGenVariants}
            onGenVariants={handleGenVariants}
            variants={variants || []}
            imageUrl={varImgUrl}
          />
        )}
        {selectedTab === "edit" && varImgUrl && (
          <EditTab imageUrl={varImgUrl} />
        )}
        {selectable && (
          <Button
            disabled={isSavingImages || selectedImages.length === 0}
            variant="contained"
            onClick={handleConfirm}
            startIcon={
              isSavingImages ? (
                <CircularProgress size="1rem" color="inherit" />
              ) : undefined
            }
          >
            {isSavingImages ? (
              <FormattedMessage id="saving" defaultMessage="Saving" />
            ) : (
              <FormattedMessage id="save" defaultMessage="Save images" />
            )}
          </Button>
        )}
      </Stack>
    );
  };

  console.log("selectedUrl", selectedUrl);
  console.log("varImgUrl", varImgUrl);

  return (
    <>
      <Menu
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={handleMenuSelect}>
          <FormattedMessage id="select" defaultMessage="Select" />
        </MenuItem>
        <MenuItem onClick={handleMenuVariant}>
          <FormattedMessage
            id="generate.variant"
            defaultMessage="Generate variant"
          />
        </MenuItem>
        <MenuItem onClick={handleMenuEdit}>
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </MenuItem>
      </Menu>
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
