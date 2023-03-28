import { TransactionStatus } from "@dexkit/core/constants";
import { AppTransaction } from "@dexkit/core/types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import {
  Avatar,
  CircularProgress,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";

import { AppNotification, AppNotificationType } from "../types";
import AppLink from "./AppLink";
import MomentFromSpan from "./MomentFromSpan";
import { NotificationMessage } from "./NotificationMessage";

import { getBlockExplorerUrl } from "@dexkit/core/utils";
import Icon from "@mui/material/Icon";

export interface NotificationsListProps {
  notifications: AppNotification[];
  transactions: { [key: string]: AppTransaction };
  notificationTypes: { [key: string]: AppNotificationType };
}

export default function NotificationsList({
  notifications,
  transactions,
  notificationTypes,
}: NotificationsListProps) {
  const renderSecondaryAction = (
    transactions: { [key: string]: AppTransaction },
    notification: AppNotification
  ) => {
    if (notification.metadata) {
      const notificationType = notification.type;

      if (notificationType === "transaction") {
        const hash = notification.metadata["hash"];

        if (hash) {
          const status = transactions[hash].status;

          if (status === TransactionStatus.Pending) {
            return <CircularProgress size="1.5rem" color="primary" />;
          } else if (status === TransactionStatus.Confirmed) {
            return <CheckCircleIcon color="success" />;
          }
        }
      }
    }

    return null;
  };

  const getNotificationUrl = (
    transactions: { [key: string]: AppTransaction },
    notification: AppNotification
  ) => {
    if (notification.url) {
      return notification.url;
    } else if (notification.metadata && notification.type === "transaction") {
      const hash = notification.metadata["hash"];

      if (hash) {
        const txChainId = transactions[hash].chainId;

        return `${getBlockExplorerUrl(txChainId)}/tx/${hash}`;
      }
    }

    return "#";
  };

  return (
    <List sx={{ p: 0 }}>
      {notifications.map((notification, key) => (
        <ListItemButton
          LinkComponent={AppLink}
          href={getNotificationUrl(transactions, notification)}
          target="_blank"
          key={key}
        >
          <ListItemAvatar>
            <Avatar>
              {notification.icon && <Icon>{notification.icon}</Icon>}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <NotificationMessage
                types={notificationTypes}
                type={notification.subtype}
                values={notification.values}
              />
            }
            secondaryTypographyProps={{ component: "div" }}
            secondary={
              <Stack spacing={0.5} direction="row" alignItems="center">
                {!notification.checked && (
                  <FiberManualRecord fontSize="small" color="primary" />
                )}

                <MomentFromSpan from={notification.date} />
              </Stack>
            }
          />
          <Stack
            sx={{ ml: 2 }}
            spacing={0.5}
            direction="row"
            alignItems="center"
          >
            {renderSecondaryAction(transactions, notification)}
          </Stack>
        </ListItemButton>
      ))}
    </List>
  );
}
