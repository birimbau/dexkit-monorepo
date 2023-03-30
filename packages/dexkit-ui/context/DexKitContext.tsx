import { AppTransaction } from "@dexkit/core/types";
import React from "react";
import {
  AppNotification,
  AppNotificationType,
  CreateAppNotificationParams,
} from "../types";

export interface DexkitContextState {
  onChangeLocale: (locale: string) => void;
  notificationTypes: { [key: string]: AppNotificationType };
  createNotification: (params: CreateAppNotificationParams) => void;
  clearNotifications: () => void;
  checkAllNotifications: () => void;
  notifications: AppNotification[];
  transactions: { [key: string]: AppTransaction };
}

export const DexKitContext = React.createContext<DexkitContextState>({
  notificationTypes: {},
  notifications: [],
  transactions: {},
  onChangeLocale: (locale: string) => {},
  createNotification: (params: CreateAppNotificationParams) => {},
  checkAllNotifications: () => {},
  clearNotifications: () => {},
});
