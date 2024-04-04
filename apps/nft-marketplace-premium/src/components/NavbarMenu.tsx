import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListItemButton, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { MenuTree } from '../types/config';
import Link from './Link';

import LaunchIcon from '@mui/icons-material/Launch';

interface Props {
  menu: MenuTree;
  isPreview?: boolean;
  anchor?: HTMLElement | null;
  child?: boolean;
  ref?: (ref: HTMLElement | null) => void;
}

export interface MenuItemProps {
  item: MenuTree;
}

export function MenuItem({ item }: MenuItemProps) {
  const menuRef = React.useRef<HTMLElement | null>(null);

  return (
    <NavbarMenu
      ref={(ref) => (menuRef.current = ref)}
      menu={item}
      anchor={menuRef.current}
      child
    />
  );
}

export default function NavbarMenu(props: Props) {
  const { menu, isPreview, anchor, child } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (item: MenuTree, key: number) => {
    if (item.type === 'Page') {
      return (
        <ListItemButton
          dense
          key={key}
          disabled={isPreview}
          LinkComponent={Link}
          href={item.href || ''}
        >
          <ListItemText primary={item.name} />
        </ListItemButton>
      );
    }

    if (item.type === 'External') {
      return (
        <ListItemButton
          dense
          key={key}
          target="_blank"
          disabled={isPreview}
          LinkComponent={Link}
          href={item.href || ''}
        >
          <LaunchIcon fontSize="inherit" sx={{ mr: 2 }} />
          <ListItemText primary={item.name} />
        </ListItemButton>
      );
    }

    if (item.type === 'Menu' && item.children) {
      return <MenuItem item={item} />;
    }
  };

  if (menu.type === 'Page') {
    return <Button LinkComponent={Link}>{menu.name}</Button>;
  }

  if (menu.type === 'External') {
    return <Button LinkComponent={Link}>{menu.name}</Button>;
  }

  return (
    <>
      {child ? (
        <ListItemButton
          dense
          aria-controls={open ? 'navbar-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <ListItemText primary={menu.name} />
          <ExpandMoreIcon />
        </ListItemButton>
      ) : (
        <Button
          id="navbar-menu"
          aria-controls={open ? 'navbar-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            fontWeight: 600,
            textDecoration: 'none',
            color: 'text.primary',
            textTransform: 'none',
            fontSize: 'inherit',
          }}
          endIcon={<ExpandMoreIcon />}
          onClick={handleClick}
        >
          <FormattedMessage
            id={menu.name.toLowerCase()}
            defaultMessage={menu.name}
          />
        </Button>
      )}

      <Menu
        id="navbar-menu"
        anchorEl={anchor ? anchor : anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={
          child
            ? { horizontal: 'right', vertical: 'center' }
            : { vertical: 'bottom', horizontal: 'center' }
        }
        MenuListProps={{
          'aria-labelledby': 'navbar-menu',
        }}
      >
        {menu.children?.map((m, k) => renderMenu(m, k))}
      </Menu>
    </>
  );
}
