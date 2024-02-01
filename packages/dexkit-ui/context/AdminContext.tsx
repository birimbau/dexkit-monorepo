import React from "react";
import { AppConfig } from "../types/config";

interface IAdminContext {
  editSiteId?: number;
  editAppConfig?: AppConfig;

}

const ADMIN_INITIAL_VALUES = {
  editSiteId: undefined,
  editAppConfig: undefined
};


export const AdminContext =
  React.createContext<IAdminContext>(ADMIN_INITIAL_VALUES);