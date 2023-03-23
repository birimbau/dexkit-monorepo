import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { AppNotificationType } from "../types";

export interface Props {
  types: { [key: string]: AppNotificationType };
  type: string;
  values?: Record<string, ReactNode>;
}

export function NotificationMessage({ types, type, values }: Props) {
  return (
    <FormattedMessage
      id={types[type].id}
      defaultMessage={types[type].message}
      values={values}
    />
  );
}
