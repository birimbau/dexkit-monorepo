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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddMenuPageDialog from '../../dialogs/AddMenuPageDialog';
import MenuItem from './MenuItem';
import Submenu from './Submenu';

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

  const renderItem = (item: MenuTree, index: number) => {
    if (item.type === 'Menu') {
      return (
        <Submenu
          key={index}
          item={item}
          pages={pages}
          onUpdateItem={(newItem: MenuTree) => {
            const newMenu = [...menu];

            newMenu[index] = newItem;

            onSetMenu(newMenu);
          }}
          depth={0}
        />
      );
    }

    return <MenuItem item={item} key={index} depth={0} />;
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
      {menu.map((item, index) => renderItem(item, index))}
    </Stack>
  );
}
