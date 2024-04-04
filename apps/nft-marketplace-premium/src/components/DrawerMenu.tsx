import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

import {
  Collapse,
  Divider,
  ListItemButton,
  ListItemSecondaryAction,
  alpha,
  styled,
} from '@mui/material';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { MenuTree } from '../types/config';
import Link from './Link';

interface DrawerMenuProps {
  menu: MenuTree[];
  onClose: any;
}

const CustomListItemSecondaryAction = styled(ListItemSecondaryAction)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
  })
);

export interface DrawerMenuItemProps {
  menu: MenuTree;
  onClose: () => void;
  depth: number;
}

export function DrawerMenuItem({ menu, onClose, depth }: DrawerMenuItemProps) {
  const [open, setOpen] = useState(false);

  if (menu.type === 'Page') {
    return (
      <React.Fragment>
        <ListItemButton
          sx={{ pl: depth * 2 }}
          onClick={onClose}
          component={Link}
          href={menu.href || '/'}
        >
          <ListItemText sx={{ fontWeight: 600 }} primary={menu.name} />
          <CustomListItemSecondaryAction
            sx={(theme) => ({
              [theme.breakpoints.up('sm')]: {
                display: 'none',
              },
            })}
          >
            <ChevronRightIcon color="primary" />
          </CustomListItemSecondaryAction>
        </ListItemButton>
        <Divider
          sx={{
            borderColor: (theme) => alpha(theme.palette.text.disabled, 0.1),
          }}
        />
      </React.Fragment>
    );
  }

  if (menu.type === 'External') {
    return (
      <React.Fragment>
        <ListItemButton
          sx={{ pl: depth * 2 }}
          onClick={onClose}
          component={Link}
          href={menu.href || '/'}
        >
          <ListItemText sx={{ fontWeight: 600 }} primary={menu.name} />
          <CustomListItemSecondaryAction
            sx={(theme) => ({
              [theme.breakpoints.up('sm')]: {
                display: 'none',
              },
            })}
          >
            <ChevronRightIcon color="primary" />
          </CustomListItemSecondaryAction>
        </ListItemButton>
        <Divider
          sx={{
            borderColor: (theme) => alpha(theme.palette.text.disabled, 0.1),
          }}
        />
      </React.Fragment>
    );
  }

  if (menu.type === 'Menu') {
    return (
      <>
        <ListItemButton
          sx={{ pl: depth * 2 }}
          onClick={() => setOpen((value) => !value)}
        >
          <ListItemText primary={menu.name} />
          <CustomListItemSecondaryAction>
            {open ? <ExpandLess /> : <ExpandMoreIcon />}
          </CustomListItemSecondaryAction>
        </ListItemButton>
        <Divider
          sx={{
            borderColor: (theme) => alpha(theme.palette.text.disabled, 0.1),
          }}
        />
        <Collapse in={open}>
          {menu.children?.map((child, key) => (
            <DrawerMenuItem
              key={key}
              menu={child}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </Collapse>
      </>
    );
  }

  return null;
}

export default function DrawerMenu({ menu, onClose }: DrawerMenuProps) {
  return (
    <List disablePadding>
      {menu.map((m, key) => (
        <DrawerMenuItem menu={m} onClose={onClose} key={key} depth={1} />
      ))}
    </List>
  );
}
