import MenuIcon from '@mui/icons-material/Menu';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material';
import { MenuTree } from 'src/types/config';

import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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
  onUp: () => void;
  onDown: () => void;
  onRemove?: () => void;
  buttons: { disableUp?: boolean; disableDown?: boolean };
}

export default function MenuItem({
  item,
  depth,
  onUp,
  onDown,
  onRemove,
  buttons,
}: MenuItemProps) {
  return (
    <ListItem>
      <ListItemIcon sx={{ ml: depth * 4 }}>
        {renderIcon(item.type)}
      </ListItemIcon>
      <ListItemText primary={item.name} />
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={onUp} disabled={buttons.disableUp}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton onClick={onDown} disabled={buttons.disableDown}>
          <ArrowDownwardIcon />
        </IconButton>
      </Stack>
    </ListItem>
  );
}
