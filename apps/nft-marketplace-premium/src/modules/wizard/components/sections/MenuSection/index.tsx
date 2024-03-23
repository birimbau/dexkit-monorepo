import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Dispatch, SetStateAction, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppPage, MenuTree } from '../../../../../types/config';

import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, ListItemIcon, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddMenuPageDialog from '../../dialogs/AddMenuPageDialog';
import MenuItem from './MenuItem';

import DescriptionIcon from '@mui/icons-material/Description';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import MenuIcon from '@mui/icons-material/Menu';

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

interface Props {
  menu: MenuTree[];
  pages: { [key: string]: AppPage };
  onSetMenu: Dispatch<SetStateAction<MenuTree[]>>;
}

interface ChildrenProps {
  children: MenuTree[];
  fatherIndex: number;
  setIsOpen: (open: boolean) => void;
  onMoveUp: (key: number, fatherKey: number) => void;
  onMoveDown: (key: number, fatherKey: number) => void;
  onRemove: (key: number, fatherKey: number) => void;
  setFatherIndex: (index: number) => void;
}

function MenuSectionChildrenList({
  children,
  fatherIndex,
  setFatherIndex,
  onMoveDown,
  onMoveUp,
  onRemove,
  setIsOpen,
}: ChildrenProps) {
  const renderItem = (item: MenuTree, k: number, arr: any[]) => {
    return (
      <ListItem
        disablePadding
        key={k}
        secondaryAction={
          <Box>
            <IconButton
              aria-label="up"
              onClick={() => onMoveUp(k, fatherIndex)}
              disabled={k === 0}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
            <IconButton
              aria-label="down"
              onClick={() => onMoveDown(k, fatherIndex)}
              disabled={k === arr.length - 1}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
            {item.type === 'Menu' && (
              <IconButton
                aria-label="add"
                onClick={() => {
                  setFatherIndex(k);
                  setIsOpen(true);
                }}
              >
                <AddIcon />
              </IconButton>
            )}
            <IconButton
              aria-label="delete"
              onClick={() => onRemove(k, fatherIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        }
      >
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemText primary={item.name} />
        </ListItemButton>
      </ListItem>
    );
  };

  return <List>{children && children.map(renderItem)}</List>;
}

export default function MenuSection(props: Props) {
  const { menu, onSetMenu, pages } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [fatherIndex, setFatherIndex] = useState<number | undefined>();

  const onRemove = (id: number, fIndex?: number) => {
    const newMenu = [...menu];
    if (fIndex !== undefined) {
      if (
        newMenu &&
        newMenu.length &&
        newMenu[fIndex] &&
        newMenu[fIndex]?.children &&
        newMenu[fIndex]?.children?.length
      ) {
        (newMenu[fIndex].children || []).splice(id, 1);
      }
    } else {
      newMenu.splice(id, 1);
    }

    onSetMenu(newMenu || []);
  };

  const onMoveUp = (id: number, fIndex?: number) => {
    const newMenu = [...menu];
    if (fIndex !== undefined) {
      if (
        newMenu &&
        newMenu.length &&
        newMenu[fIndex] &&
        newMenu[fIndex]?.children &&
        newMenu[fIndex]?.children?.length
      ) {
        let before = (newMenu[fIndex].children || [])[id - 1];
        (newMenu[fIndex].children || [])[id - 1] = (newMenu[fIndex].children ||
          [])[id];
        (newMenu[fIndex].children || [])[id] = before;
      }
    } else {
      let before = newMenu[id - 1];
      newMenu[id - 1] = newMenu[id];
      newMenu[id] = before;
    }
    onSetMenu(newMenu);
  };

  const onMoveDown = (id: number, fIndex?: number) => {
    const newMenu = [...menu];
    if (fIndex !== undefined) {
      if (
        newMenu &&
        newMenu.length &&
        newMenu[fIndex] &&
        newMenu[fIndex]?.children &&
        newMenu[fIndex]?.children?.length
      ) {
        let before = (newMenu[fIndex].children || [])[id + 1];
        (newMenu[fIndex].children || [])[id + 1] = (newMenu[fIndex].children ||
          [])[id];
        (newMenu[fIndex].children || [])[id] = before;
      }
    } else {
      let before = newMenu[id + 1];
      newMenu[id + 1] = newMenu[id];
      newMenu[id] = before;
    }
    onSetMenu(newMenu);
  };

  const onAddMenu = (item: MenuTree, fIndex?: number) => {
    const newMenu = [...menu];
    if (fIndex !== undefined) {
      if (
        newMenu[fIndex] &&
        newMenu[fIndex]?.children &&
        newMenu[fIndex]?.children?.length
      ) {
        (newMenu[fIndex].children || []).push(item);
      } else {
        newMenu[fIndex].children = [item];
      }
    } else {
      newMenu.push(item);
    }
    onSetMenu(newMenu);
  };

  const handleAddMenuPage = () => {
    setFatherIndex(undefined);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const [openMenu, setOpenMenu] = useState<{ [key: string]: boolean }>({});

  const renderItem = (
    item: MenuTree,
    index: number,
    arr: MenuTree[],
    depth: number,
  ): any => {
    if (item.type === 'Menu') {
      return (
        <>
          <ListItem>
            <ListItemIcon sx={{ pl: depth * 4 }}>
              {renderIcon(item.type)}
            </ListItemIcon>
            <ListItemText primary={item.name} />

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
              <IconButton>
                <AddIcon />
              </IconButton>
              <IconButton>
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton>
                <ArrowDownwardIcon />
              </IconButton>

              <IconButton
                onClick={() =>
                  setOpenMenu((value) => ({
                    ...value,
                    [`${depth}-${index}`]: !Boolean(
                      openMenu[`${depth}-${index}`],
                    ),
                  }))
                }
              >
                {Boolean(openMenu[`${depth}-${index}`]) ? (
                  <ExpandMore />
                ) : (
                  <ExpandLess />
                )}
              </IconButton>
            </Stack>
          </ListItem>

          {item.children && (
            <Collapse in>
              {item.children?.map(
                (i: MenuTree, index: number, arr: MenuTree[]) =>
                  renderItem(i, index, arr, depth + 1),
              )}
            </Collapse>
          )}
        </>
      );
    }

    return (
      <MenuItem
        item={item}
        key={index}
        depth={depth + 1}
        onUp={() => {
          const newMenu = [...menu];

          let upper = newMenu[index - 1];
          let curr = newMenu[index];

          newMenu[index - 1] = curr;
          newMenu[index] = upper;

          onSetMenu(newMenu);
        }}
        onDown={() => {
          const newMenu = [...menu];

          let curr = newMenu[index];
          let lower = newMenu[index + 1];

          newMenu[index + 1] = curr;
          newMenu[index] = lower;

          onSetMenu(newMenu);
        }}
        buttons={{
          disableUp: index === 0,
          disableDown: index === arr.length - 1,
        }}
        onRemove={() => {
          let newMenu = [...menu];

          newMenu.splice(index, 1);

          onSetMenu(newMenu);
        }}
      />
    );
  };

  return (
    <Stack spacing={2}>
      <AddMenuPageDialog
        dialogProps={{
          open: isOpen,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleClose,
        }}
        pages={pages}
        onCancel={handleClose}
        onSubmit={onAddMenu}
        fatherIndex={fatherIndex}
      />
      <Button
        variant="outlined"
        onClick={handleAddMenuPage}
        startIcon={<AddIcon />}
      >
        <FormattedMessage id="add.menu" defaultMessage="Add menu" />
      </Button>
      {menu.map((item, index, arr) => renderItem(item, index, arr, -1))}
    </Stack>
  );
}
