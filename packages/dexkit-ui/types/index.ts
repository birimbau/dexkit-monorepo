export type NotificationTypes = "transaction" | "common";

export type AppNotificationType = {
  type: string;
  message: string;
  id: string;
  color?: string;
  icon?: string;
};

export type AppNotification = {
  type: NotificationTypes;
  subtype: string;
  icon?: string;
  date: number;
  values?: Record<string, string>;
  checked?: boolean;
  metadata?: Record<string, any>;
  url?: string;
};

export type CreateAppNotificationParams = {
  type: NotificationTypes;
  subtype: string;
  icon?: string;
  values?: Record<string, string>;
  url?: string;
  metadata?: Record<string, any>;
};
