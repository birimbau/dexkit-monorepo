export type NotificationTypes = "transaction";

export type AppNotificationType = {
  type: string;
  message: string;
  id: string;
};

export type AppNotification = {
  type: NotificationTypes;
  subtype: string;
  icon?: string;
  date: number;
  values?: Record<string, string>;
  checked?: boolean;
  metadata?: Record<string, string>;
  url?: string;
};
