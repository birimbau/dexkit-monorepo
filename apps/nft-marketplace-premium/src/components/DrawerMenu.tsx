import React, { useRef } from 'react';

import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Avatar,
  Collapse,
  Divider,
  Icon,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  NoSsr,
  Stack,
  alpha,
  styled,
} from '@mui/material';
import List from '@mui/material/List';
import { useState } from 'react';
import { MenuTree } from '../types/config';
import Link from './Link';

interface DrawerMenuProps {
  menu: MenuTree[];
  onClose: any;
  isMini?: boolean;
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
  isMini?: boolean;
  onlyIcon?: boolean;
  disablePadding?: boolean;
  useMenu?: boolean;
}

export function DrawerMenuItem({
  menu,
  onClose,
  depth,
  isMini,
  disablePadding,
  useMenu,
  onlyIcon,
}: DrawerMenuItemProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  if (menu.type === 'Page') {
    return (
      <ListItemButton
        sx={disablePadding ? undefined : { pl: depth * 2 }}
        onClick={onClose}
        component={Link}
        href={menu.href || '/'}
      >
        <Stack
          sx={{
            alignItem: 'center',
            justifyContent: 'center',
            mr: isMini ? 0 : 2,
            p: 0.5,
          }}
        >
          {menu.data?.iconName ? <Icon> {menu.data?.iconName}</Icon> : ''}
        </Stack>
        {!onlyIcon && (
          <ListItemText sx={{ fontWeight: 600 }} primary={menu.name} />
        )}
        <CustomListItemSecondaryAction
          sx={(theme) => ({
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
          })}
        >
          <ChevronRight color="primary" />
        </CustomListItemSecondaryAction>
      </ListItemButton>
    );
  }

  if (menu.type === 'External') {
    return (
      <ListItemButton
        sx={disablePadding ? undefined : { pl: depth * 2 }}
        onClick={onClose}
        component={Link}
        href={menu.href || '/'}
      >
        <Stack
          sx={{
            alignItem: 'center',
            justifyContent: 'center',
            mr: isMini ? 0 : 2,
            p: 0.5,
          }}
        >
          <Icon>{menu.data?.iconName ? menu.data?.iconName : ''}</Icon>
        </Stack>
        {!isMini && (
          <ListItemText sx={{ fontWeight: 600 }} primary={menu.name} />
        )}
        <CustomListItemSecondaryAction
          sx={(theme) => ({
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
          })}
        >
          <ChevronRight color="primary" />
        </CustomListItemSecondaryAction>
      </ListItemButton>
    );
  }

  if (menu.type === 'Menu') {
    return (
      <>
        <ListItemButton
          sx={disablePadding ? undefined : { pl: depth * 2 }}
          onClick={() => setOpen((value) => !value)}
          ref={(btnRef: HTMLElement | null) => {
            ref.current = btnRef;
          }}
        >
          <Stack
            sx={{
              alignItem: 'center',
              justifyContent: 'center',
              mr: isMini ? 0 : 2,
              p: 0.5,
            }}
          >
            {menu.data?.iconName && <Icon>{menu.data?.iconName}</Icon>}

            {isMini && !menu.data?.iconName && depth === 1 && (
              <Avatar sx={{ width: '1.5rem', height: '1.5rem' }}>
                {menu.name.substring(0, 1)}
              </Avatar>
            )}
          </Stack>
          {!isMini && <ListItemText primary={menu.name} />}
          {!onlyIcon && (
            <CustomListItemSecondaryAction>
              {!onlyIcon && isMini ? (
                open ? (
                  <KeyboardArrowLeftIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )
              ) : open ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </CustomListItemSecondaryAction>
          )}
        </ListItemButton>
        {useMenu ? (
          <Menu
            open={open}
            anchorEl={ref.current}
            anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
            onClose={handleClose}
            MenuListProps={{ disablePadding: true }}
          >
            {menu.children?.map((child, key, arr) => (
              <div key={key}>
                <DrawerMenuItem
                  menu={child}
                  onClose={onClose}
                  depth={depth + 1}
                  disablePadding={disablePadding}
                  useMenu={useMenu}
                />
                {key < arr.length - 1 && (
                  <Divider
                    sx={{
                      display: 'block',
                      borderColor: (theme) =>
                        alpha(theme.palette.text.disabled, 0.1),
                    }}
                  />
                )}
              </div>
            ))}
          </Menu>
        ) : (
          <Collapse in={open}>
            {menu.children?.map((child, key, arr) => (
              <React.Fragment key={key}>
                <DrawerMenuItem
                  menu={child}
                  onClose={onClose}
                  depth={depth + 1}
                  disablePadding={disablePadding}
                />
                {key < arr.length - 1 && (
                  <Divider
                    sx={{
                      display: 'block',
                      borderColor: (theme) =>
                        alpha(theme.palette.text.disabled, 0.1),
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Collapse>
        )}
      </>
    );
  }

  return null;
}

export default function DrawerMenu({ menu, onClose, isMini }: DrawerMenuProps) {
  return (
    <NoSsr>
      <List disablePadding sx={{ display: 'block' }}>
        {menu.map((m, key, arr) => (
          <React.Fragment key={key}>
            <DrawerMenuItem
              menu={m}
              onClose={onClose}
              depth={1}
              isMini={isMini}
              useMenu={isMini}
              onlyIcon={isMini}
              disablePadding={isMini}
            />
            {key < arr.length - 1 && (
              <Divider
                sx={{
                  display: 'block',
                  borderColor: (theme) =>
                    alpha(theme.palette.text.disabled, 0.1),
                }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
    </NoSsr>
  );
}
