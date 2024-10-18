import { FavoriteBorder } from "@mui/icons-material";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import AssignmentIcon from "@mui/icons-material/Assignment";

export interface CommerceUserMenuProps {}

export default function CommerceUserMenu({}: CommerceUserMenuProps) {
  return (
    <List disablePadding>
      <ListItem>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="my.orders" defaultMessage="My Orders" />
          }
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <FavoriteBorder />
        </ListItemIcon>
        <ListItemText
          primary={<FormattedMessage id="wishlist" defaultMessage="Wishlist" />}
        />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemIcon>
          <FavoriteBorder />
        </ListItemIcon>
        <ListItemText
          primary={<FormattedMessage id="Profile" defaultMessage="Profile" />}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <FavoriteBorder />
        </ListItemIcon>
        <ListItemText
          primary={<FormattedMessage id="log.out" defaultMessage="Log out" />}
        />
      </ListItem>
    </List>
  );
}
