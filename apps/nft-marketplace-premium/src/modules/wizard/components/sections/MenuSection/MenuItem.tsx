import MenuIcon from '@mui/icons-material/Menu';
import { ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { MenuTree } from 'src/types/config';

import LaunchIcon from '@mui/icons-material/Launch';

import DescriptionIcon from '@mui/icons-material/Description';
import { FormattedMessage } from 'react-intl';

const renderIcon = (type: 'Page' | 'Menu' | 'External') => {
  const types: { [key: string]: React.ReactNode } = {
    Page: (
      <Tooltip title={<FormattedMessage id="page" defaultMessage="Page" />}>
        <DescriptionIcon />
      </Tooltip>
    ),
    Menu: (
      <Tooltip title={<FormattedMessage id="menu" defaultMessage="Menu" />}>
        <MenuIcon />
      </Tooltip>
    ),
    External: (
      <Tooltip
        title={<FormattedMessage id="external" defaultMessage="External" />}
      >
        <LaunchIcon />
      </Tooltip>
    ),
  };

  return types[type];
};

export interface MenuItemProps {
  item: MenuTree;
  depth: number;
}

export default function MenuItem({ item, depth }: MenuItemProps) {
  return (
    <ListItem>
      <ListItemIcon sx={{ ml: depth * 4 }}>
        {renderIcon(item.type)}
      </ListItemIcon>
      <ListItemText primary={item.name} />
    </ListItem>
  );
}
