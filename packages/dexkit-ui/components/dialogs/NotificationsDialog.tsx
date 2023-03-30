import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import NotificationsList from "../NotificationsList";

import { AppTransaction } from "@dexkit/core/types";
import { AppNotification, AppNotificationType } from "../../types/index";

export interface NotificationsDialogProps {
  DialogProps: DialogProps;
  onClear: () => void;
  notifications: AppNotification[];
  transactions: { [key: string]: AppTransaction };
  notificationTypes: { [key: string]: AppNotificationType };
}

export default function NotificationsDialog({
  DialogProps,
  notifications,
  transactions,
  notificationTypes,
  onClear,
}: NotificationsDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={<NotificationsIcon />}
        title={
          <FormattedMessage id="notifications" defaultMessage="Notifications" />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        {notifications.length > 0 ? (
          <NotificationsList
            notifications={notifications}
            transactions={transactions}
            notificationTypes={notificationTypes}
          />
        ) : (
          <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }}>
            <Typography variant="body1">
              <FormattedMessage
                id="nothing.to.see.here"
                defaultMessage="Nothing to see here"
              />
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClear} color="primary">
          <FormattedMessage id="clear" defaultMessage="Clear" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
