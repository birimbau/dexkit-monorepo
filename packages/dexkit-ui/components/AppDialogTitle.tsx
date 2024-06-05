import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography, { TypographyProps } from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

interface Props {
  title?: string | React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  onClose?: () => void;
  disableClose?: boolean;
  hideCloseButton?: boolean;
  titleProps?: TypographyProps;
  titleBox?: StackProps;
}

export function AppDialogTitle({
  title,
  icon,
  onClose,
  disableClose,
  hideCloseButton,
  titleProps,
  titleBox,
}: Props) {
  return (
    <DialogTitle
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        px: 2,
        py: 1.5,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
        sx={{}}
        {...titleBox}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          alignContent="center"
        >
          {icon}
          <Typography variant="inherit">{title}</Typography>
        </Stack>
        {onClose && !hideCloseButton && (
          <IconButton size="small" disabled={disableClose} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    </DialogTitle>
  );
}
