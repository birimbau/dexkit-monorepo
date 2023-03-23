import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import NotificationsList from "../NotificationsList";

import { Transaction } from "@dexkit/core/types";
import { AppNotification, AppNotificationType } from "../../types/index";

export interface NotificationsDialogProps {
  DialogProps: DialogProps;
  onClear: () => void;
  notifications: AppNotification[];
  transactions: { [key: string]: Transaction };
  notificationTypes: { [key: string]: AppNotificationType };
}

export default function NotificationsDialog({
  DialogProps,
  notifications,
  transactions,
  notificationTypes,
  onClear,
}: NotificationsDialogProps) {
  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="notifications" defaultMessage="Notifications" />
        }
      />
      <DialogContent dividers sx={{ p: 0 }}>
        {notifications.length > 0 ? (
          <NotificationsList
            notifications={notifications}
            transactions={transactions}
            notificationTypes={notificationTypes}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClear} color="primary">
          <FormattedMessage id="clear" defaultMessage="Clear" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
